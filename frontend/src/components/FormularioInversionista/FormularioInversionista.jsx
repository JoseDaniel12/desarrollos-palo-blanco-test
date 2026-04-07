

import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';

const FormularioInversionista = forwardRef((props, ref) => {
	const [categorias, setCategorias] = useState([]);
	const [loading, setLoading] = useState(true);

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

	
	useImperativeHandle(ref, () => ({
		getValores: () => ({
			nombre: nombreRef.current.value,
			apellido: apellidoRef.current.value,
			email: emailRef.current.value,
			inversion: inversionRef.current.value,
			categoria_id: categoriaRef.current.value,
			estado: estadoRef.current.checked,
		})
	}));

	return (
		<form style={{ maxWidth: 400, margin: '0 auto', padding: 24, borderRadius: 8 }}>
			<h2 style={{ textAlign: 'center' }}>Formulario Inversionista</h2>
			<div style={{ marginBottom: 12 }}>
				<label>Nombre:</label>
				<input ref={nombreRef} type="text" name="nombre" required style={{ width: '100%', padding: 6 }} />
			</div>
			<div style={{ marginBottom: 12 }}>
				<label>Apellido:</label>
				<input ref={apellidoRef} type="text" name="apellido" required style={{ width: '100%', padding: 6 }} />
			</div>
			<div style={{ marginBottom: 12 }}>
				<label>Email:</label>
				<input ref={emailRef} type="email" name="email" style={{ width: '100%', padding: 6 }} />
			</div>
			<div style={{ marginBottom: 12 }}>
				<label>Inversión:</label>
				<input ref={inversionRef} type="number" name="inversion" min="0" step="0.01" defaultValue="0.00" style={{ width: '100%', padding: 6 }} />
			</div>
			<div style={{ marginBottom: 12 }}>
				<label>Categoría:</label>
				<select ref={categoriaRef} name="categoria_id" style={{ width: '100%', padding: 6 }} disabled={loading}>
					<option value="">Seleccione una categoría</option>
					{categorias.map(cat => (
						<option key={cat.id} value={cat.id}>{cat.nombre}</option>
					))}
				</select>
			</div>
			<div style={{ marginBottom: 12 }}>
				<label>
					<input ref={estadoRef} type="checkbox" name="estado" defaultChecked /> Activo
				</label>
			</div>
		</form>
	);
});

export default FormularioInversionista;