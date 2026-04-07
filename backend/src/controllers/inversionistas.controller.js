const { QueryTypes } = require('sequelize');
const sequelize = require('../database/mySqlConnection');

const obtenerDetalleInversionista = async (id) => {
	const rows = await sequelize.query(
		`SELECT
			i.id,
			i.nombre,
			i.apellido,
			i.email,
			i.inversion,
			i.categoria_id,
			c.nombre AS categoria_nombre,
			i.estado,
			i.created_at,
			i.updated_at
		FROM inversionista i
		LEFT JOIN categoria_inversion c ON c.id = i.categoria_id
		WHERE i.id = :id`,
		{
			replacements: { id },
			type: QueryTypes.SELECT
		}
	);

	return rows[0] || null;
};

const crearInversionista = async (req, res) => {
	try {
		const nombre = typeof req.body.nombre === 'string' ? req.body.nombre.trim() : '';
		const apellido = typeof req.body.apellido === 'string' ? req.body.apellido.trim() : '';

		if (!nombre || !apellido) {
			return res.status(400).json({ message: 'nombre y apellido son obligatorios.' });
		}

		const email = req.body.email || null;
		const inversion = req.body.inversion ?? 0;
		const categoriaId = req.body.categoria_id ?? null;
		const estado = req.body.estado ?? true;

		const [result, metadata] = await sequelize.query(
			`INSERT INTO inversionista (nombre, apellido, email, inversion, categoria_id, estado)
			 VALUES (:nombre, :apellido, :email, :inversion, :categoria_id, :estado)`,
			{
				replacements: {
					nombre,
					apellido,
					email,
					inversion,
					categoria_id: categoriaId,
					estado
				}
			}
		);

		const insertId = result?.insertId ?? metadata?.insertId;
		const inversionistaCreado = insertId
			? await obtenerDetalleInversionista(insertId)
			: null;
		return res.status(201).json({
			message: 'Inversionista creado exitosamente.',
			data: inversionistaCreado
		});
	} catch (error) {
		console.error('Error en crearInversionista:', error);
		return res.status(500).json({ message: 'Error al crear inversionista.' });
	}
};

const obtenerInversionistas = async (req, res) => {
	try {
		const categoriaIdParam = req.query.categoriaId;
		const minInversionParam = req.query.minInversion;
		const maxInversionParam = req.query.maxInversion;
		const ordenParam = req.query.orden;
		const paginaParam = req.query.pagina;
		const limiteParam = req.query.limite;

		const pagina = paginaParam ? Number.parseInt(paginaParam, 10) : 1;
		const limite = limiteParam ? Number.parseInt(limiteParam, 10) : 10;
		const categoriaId = categoriaIdParam ? Number.parseInt(categoriaIdParam, 10) : null;
		const minInversion = minInversionParam !== undefined ? Number.parseFloat(minInversionParam) : null;
		const maxInversion = maxInversionParam !== undefined ? Number.parseFloat(maxInversionParam) : null;

		if (Number.isNaN(pagina) || pagina < 1) {
			return res.status(400).json({ message: 'La pagina es invalida.' });
		}

		if (Number.isNaN(limite) || limite < 1) {
			return res.status(400).json({ message: 'El limite es invalido.' });
		}

		if (categoriaIdParam && Number.isNaN(categoriaId)) {
			return res.status(400).json({ message: 'La categoria es invalida.' });
		}

		if (minInversionParam !== undefined && Number.isNaN(minInversion)) {
			return res.status(400).json({ message: 'El minimo de inversion es invalido.' });
		}

		if (maxInversionParam !== undefined && Number.isNaN(maxInversion)) {
			return res.status(400).json({ message: 'El maximo de inversion es invalido.' });
		}

		const orden = (ordenParam || 'desc').toLowerCase();
		if (orden !== 'asc' && orden !== 'desc') {
			return res.status(400).json({ message: 'El orden es invalido. Use asc o desc.' });
		}

		const condiciones = [];
		const replacements = {};

		if (categoriaId !== null) {
			condiciones.push('i.categoria_id = :categoria_id');
			replacements.categoria_id = categoriaId;
		}

		if (minInversion !== null) {
			condiciones.push('i.inversion >= :min_inversion');
			replacements.min_inversion = minInversion;
		}

		if (maxInversion !== null) {
			condiciones.push('i.inversion <= :max_inversion');
			replacements.max_inversion = maxInversion;
		}

		const whereClause = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';
		const offset = (pagina - 1) * limite;

		const totalRows = await sequelize.query(
			`SELECT COUNT(*) AS total
			 FROM inversionista i
			 ${whereClause}`,
			{
				replacements,
				type: QueryTypes.SELECT
			}
		);

		const total = Number(totalRows[0]?.total || 0);

		replacements.limite = limite;
		replacements.offset = offset;

		const inversionistas = await sequelize.query(
			`SELECT
				i.id,
				i.nombre,
				i.apellido,
				i.email,
				i.inversion,
				i.categoria_id,
				c.nombre AS categoria_nombre,
				i.estado,
				i.created_at,
				i.updated_at
			FROM inversionista i
			LEFT JOIN categoria_inversion c ON c.id = i.categoria_id
			${whereClause}
			ORDER BY i.inversion ${orden.toUpperCase()}
			LIMIT :limite OFFSET :offset`,
			{
				replacements,
				type: QueryTypes.SELECT
			}
		);

		return res.status(200).json({
			data: inversionistas,
			paginacion: {
				pagina,
				limite,
				total,
				total_paginas: Math.ceil(total / limite)
			}
		});
	} catch (error) {
		console.error('Error en obtenerInversionistas:', error);
		return res.status(500).json({ message: 'Error al obtener inversionistas.' });
	}
};

const obtenerInversionistaPorId = async (req, res) => {
	try {
		const id = Number.parseInt(req.params.id);
		if (Number.isNaN(id)) {
			return res.status(400).json({ message: 'El id es invalido.' });
		}

		const inversionista = await obtenerDetalleInversionista(id);
		if (!inversionista) {
			return res.status(404).json({ message: 'Inversionista no encontrado.' });
		}

		return res.status(200).json({ data: inversionista });
	} catch (error) {
		console.error('Error en obtenerInversionistaPorId:', error);
		return res.status(500).json({ message: 'Error al obtener inversionista.' });
	}
};

const editarInversionista = async (req, res) => {
	try {
		const id = Number.parseInt(req.params.id, 10);
		if (Number.isNaN(id)) {
			return res.status(400).json({ message: 'El id es invalido.' });
		}

		const inversionistaActual = await obtenerDetalleInversionista(id);
		if (!inversionistaActual) {
			return res.status(404).json({ message: 'Inversionista no encontrado.' });
		}

		const nombre = req.body.nombre ?? inversionistaActual.nombre;
		const apellido = req.body.apellido ?? inversionistaActual.apellido;
		const email = req.body.email !== undefined ? req.body.email : inversionistaActual.email;
		const inversion = req.body.inversion ?? inversionistaActual.inversion;
		const categoriaId = req.body.categoria_id !== undefined ? req.body.categoria_id : inversionistaActual.categoria_id;
		const estado = req.body.estado ?? inversionistaActual.estado;

		await sequelize.query(
			`UPDATE inversionista
			 SET nombre = :nombre,
				 apellido = :apellido,
				 email = :email,
				 inversion = :inversion,
				 categoria_id = :categoria_id,
				 estado = :estado
			 WHERE id = :id`,
			{
				replacements: {
					nombre,
					apellido,
					email,
					inversion,
					categoria_id: categoriaId,
					estado,
					id
				}
			}
		);

		const inversionistaActualizado = await obtenerDetalleInversionista(id);
		return res.status(200).json({
			message: 'Inversionista editado exitosamente.',
			data: inversionistaActualizado
		});
	} catch (error) {
		console.error('Error en editarInversionista:', error);
		return res.status(500).json({ message: 'Error al editar inversionista.' });
	}
};

module.exports = {
	crearInversionista,
	obtenerInversionistas,
	obtenerInversionistaPorId,
	editarInversionista
};