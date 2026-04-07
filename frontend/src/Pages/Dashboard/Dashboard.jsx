import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
	const navigate = useNavigate();
	const [inversionistasPaginados, setInversionistasPaginados] = useState([]);
	const [pagina, setPagina] = useState(1);
	const [limite] = useState(10);
	const [totalPaginas, setTotalPaginas] = useState(1);
	const [totalRegistros, setTotalRegistros] = useState(0);
	const [cargando, setCargando] = useState(false);
	const [error, setError] = useState('');
	const [categorias, setCategorias] = useState([]);
	const [filtros, setFiltros] = useState({
		categoriaId: '',
		minInversion: '',
		maxInversion: '',
		orden: 'desc'
	});

	const obtenerCategorias = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/categorias-inversionistas`);
			const data = await response.json();
			setCategorias(data?.data || []);
		} catch (error) {
			console.error('Error al obtener categorias:', error);
			setCategorias([]);
		}
	};

	const obtenerInversionistas = async () => {
		try {
			setCargando(true);
			setError('');

			const queryParams = new URLSearchParams({
				pagina: String(pagina),
				limite: String(limite),
				orden: filtros.orden
			});

			if (filtros.categoriaId) {
				queryParams.append('categoriaId', filtros.categoriaId);
			}

			if (filtros.minInversion) {
				queryParams.append('minInversion', filtros.minInversion);
			}

			if (filtros.maxInversion) {
				queryParams.append('maxInversion', filtros.maxInversion);
			}

			const response = await fetch(`${API_BASE_URL}/inversionistas?${queryParams.toString()}`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data?.message || 'No se pudo obtener la lista de inversionistas.');
			}

			setInversionistasPaginados(data?.data || []);
			setTotalPaginas(data?.paginacion?.total_paginas || 1);
			setTotalRegistros(data?.paginacion?.total || 0);
		} catch (error) {
			console.error('Error al obtener inversionistas:', error);
			setError(error.message || 'Error inesperado al consultar inversionistas.');
			setInversionistasPaginados([]);
			setTotalPaginas(1);
			setTotalRegistros(0);
		} finally {
			setCargando(false);
		}
	};

	useEffect(() => {
		obtenerCategorias();
	}, []);

	useEffect(() => {
		obtenerInversionistas();
	}, [pagina, limite, filtros]);

	const handleFiltroChange = (event) => {
		const { name, value } = event.target;
		setPagina(1);
		setFiltros((prev) => ({
			...prev,
			[name]: value
		}));
	};


	const handleCrearInversionista = () => {
		navigate('/crear-inversionista');
	};

	const formatearMoneda = (valor) => {
		const formatedInversion = Number(valor);
		if (isNaN(formatedInversion)) {
			return '-';
		}

		return new Intl.NumberFormat('es-CO', {
			style: 'currency',
			currency: 'GTQ',
			minimumFractionDigits: 0
		}).format(formatedInversion);
	};


	return (
		<>
			<div className="dashboard">
				<h1>Dashboard</h1>

				<button onClick={handleCrearInversionista}>
					Crear Inversionista
				</button>

				<div>
					<select
						name="categoriaId"
						value={filtros.categoriaId}
						onChange={handleFiltroChange}
					>
						<option value="">Todas las categorías</option>
						{categorias.map((categoria) => (
							<option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
						))}
					</select>
					<input
						type="number"
						name="minInversion"
						placeholder="Mín. inversión"
						value={filtros.minInversion}
						onChange={handleFiltroChange}
					/>
					<input
						type="number"
						name="maxInversion"
						placeholder="Máx. inversión"
						value={filtros.maxInversion}
						onChange={handleFiltroChange}
					/>
					<select name="orden" value={filtros.orden} onChange={handleFiltroChange}>
						<option value="desc">Mayor inversión</option>
						<option value="asc">Menor inversión</option>
					</select>
				</div>

				{error ? <p>{error}</p> : null}

				<table>
					<thead>
						<tr>
							<th>Nombre Completo</th>
							<th>Email</th>
							<th>Inversión</th>
							<th>Categoría</th>
							<th>Estado</th>
							<th>Acciones</th>
						</tr>
					</thead>

					<tbody>
						{cargando ? (
							<tr>
								<td colSpan={5}>Cargando inversionistas...</td>
							</tr>
						) : null}

						{!cargando && inversionistasPaginados.length === 0 ? (
							<tr>
								<td colSpan={5}>No hay resultados para los filtros seleccionados.</td>
							</tr>
						) : null}

						{!cargando && inversionistasPaginados.map((inversionista) => (
							<tr key={inversionista.id}>
								<td>{`${inversionista.nombre} ${inversionista.apellido}`}</td>
								<td>{inversionista.email}</td>
								<td>{formatearMoneda(inversionista.inversion)}</td>
								<td>{inversionista.categoria_nombre || 'Sin categoría'}</td>
								<td>{inversionista.estado ? 'Activo' : 'Inactivo'}</td>
								<td>
									<button onClick={() => navigate(`/inversionistas/${inversionista.id}/editar`)}>
										Editar
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<div>
					<p>{`Página ${pagina} de ${totalPaginas} · ${totalRegistros} registros`}</p>
					<button type="button" onClick={() => setPagina((prev) => prev - 1)} disabled={pagina <= 1 || cargando}>
						Anterior
					</button>
					<button
						type="button"
						onClick={() => setPagina((prev) => prev + 1)}
						disabled={pagina >= totalPaginas || cargando}
					>
						Siguiente
					</button>
				</div>
			</div>
		</>
	);
};

export default Dashboard;