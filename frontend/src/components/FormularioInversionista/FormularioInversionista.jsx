

import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';

const obtenerCategoriaInicial = (valores, categoriasDisponibles) => {
	if (!valores) {
		return '';
	}

	const categoriaDirecta =
		valores.categoria_id ??
		valores.categoriaId ??
		valores.id_categoria ??
		valores?.categoria?.id ??
		'';

	if (categoriaDirecta !== '') {
		return String(categoriaDirecta);
	}

	const categoriaPorNombre = valores.categoria_nombre ?? valores.categoriaNombre ?? '';
	if (!categoriaPorNombre) {
		return '';
	}

	const categoriaEncontrada = categoriasDisponibles.find((cat) => cat.nombre === categoriaPorNombre);
	return categoriaEncontrada ? String(categoriaEncontrada.id) : '';
};

const obtenerEstadoInicial = (estado) => {
	if (typeof estado === 'boolean') {
		return estado;
	}

	if (typeof estado === 'number') {
		return estado === 1;
	}

	if (typeof estado === 'string') {
		const normalizado = estado.trim().toLowerCase();
		return normalizado === '1' || normalizado === 'true' || normalizado === 'activo' || normalizado === 'activa';
	}

	return true;
};

const FormularioInversionista = forwardRef(({
	values
}, ref) => {
	const valoresIniciales = values || {};

	const [categorias, setCategorias] = useState([]);
	const [loading, setLoading] = useState(true);
	const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
	const [estadoSeleccionado, setEstadoSeleccionado] = useState(obtenerEstadoInicial(valoresIniciales.estado));

	const nombreRef = useRef();
	const apellidoRef = useRef();
	const emailRef = useRef();
	const inversionRef = useRef();
	const categoriaRef = useRef();
	const estadoRef = useRef();


	useEffect(() => {
		const fetchCategorias = async () => {
			try {
				const res = await fetch('http://localhost:5000/categorias-inversionistas');
				const data = await res.json();
				setCategorias(data.data || []);
			} catch (e) {
				setCategorias([]);
			} finally {
				setLoading(false);
			}
		};
		fetchCategorias();
	}, []);

	useEffect(() => {
		setCategoriaSeleccionada(obtenerCategoriaInicial(values, categorias));
	}, [values, categorias]);

	useEffect(() => {
		setEstadoSeleccionado(obtenerEstadoInicial(values?.estado));
	}, [values]);

	
	useImperativeHandle(ref, () => ({
		getValores: () => ({
			nombre: nombreRef.current.value,
			apellido: apellidoRef.current.value,
			email: emailRef.current.value,
			inversion: inversionRef.current.value,
			categoria_id: categoriaSeleccionada || categoriaRef.current.value,
			estado: estadoSeleccionado,
		})
	}), [categoriaSeleccionada, estadoSeleccionado]);

	return (
		<form style={{ maxWidth: 400, margin: '0 auto', padding: 24, borderRadius: 8 }}>
			<h2 style={{ textAlign: 'center' }}>Formulario Inversionista</h2>
			<div style={{ marginBottom: 12 }}>
				<label>Nombre:</label>
				<input ref={nombreRef} type="text" name="nombre" required defaultValue={valoresIniciales.nombre || ''} style={{ width: '100%', padding: 6 }} />
			</div>
			<div style={{ marginBottom: 12 }}>
				<label>Apellido:</label>
				<input ref={apellidoRef} type="text" name="apellido" required defaultValue={valoresIniciales.apellido || ''} style={{ width: '100%', padding: 6 }} />
			</div>
			<div style={{ marginBottom: 12 }}>
				<label>Email:</label>
				<input ref={emailRef} type="email" name="email" defaultValue={valoresIniciales.email || ''} style={{ width: '100%', padding: 6 }} />
			</div>
			<div style={{ marginBottom: 12 }}>
				<label>Inversión:</label>
				<input ref={inversionRef} type="number" name="inversion" min="0" step="0.01" defaultValue={valoresIniciales.inversion ?? '0.00'} style={{ width: '100%', padding: 6 }} />
			</div>
			<div style={{ marginBottom: 12 }}>
				<label>Categoría:</label>
				<select
					ref={categoriaRef}
					name="categoria_id"
					value={categoriaSeleccionada}
					onChange={(event) => setCategoriaSeleccionada(event.target.value)}
					style={{ width: '100%', padding: 6 }}
					disabled={loading}
				>
					<option value="">Seleccione una categoría</option>
					{categorias.map(cat => (
						<option key={cat.id} value={cat.id}>{cat.nombre}</option>
					))}
				</select>
			</div>
			{
				valoresIniciales.id && (
					<div style={{ marginBottom: 12 }}>
						<label>
							<input
								ref={estadoRef}
								type="checkbox"
								name="estado"
								checked={estadoSeleccionado}
								onChange={(event) => setEstadoSeleccionado(event.target.checked)}
							/> Activo
						</label>
					</div>
				)
			}

		</form>
	);
});

export default FormularioInversionista;