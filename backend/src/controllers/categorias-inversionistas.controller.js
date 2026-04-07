const { QueryTypes } = require('sequelize');
const sequelize = require('../database/mySqlConnection');

const obtenerCategoriasInversionistas = async (_, res) => {
	try {
		const categorias = await sequelize.query(
			`SELECT
				id,
				nombre,
				descripcion,
				created_at
			FROM categoria_inversion
			ORDER BY id DESC`,
			{ type: QueryTypes.SELECT }
		);

		return res.status(200).json({ data: categorias });
	} catch (error) {
		console.error('Error en categorias-inversionistas controller:', error);
		return res.status(500).json({ message: 'Ocurrio un error inesperado.' });
	}
};

module.exports = {
	obtenerCategoriasInversionistas
};