
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioInversionista from '../FormularioInversionista/FormularioInversionista';


const FormularioCreacionInversionista = () => {
	const formRef = useRef();
	const navigate = useNavigate();

	const handleCrearInversionista = async () => {
		const valores = formRef.current.getValores();
		try {
			const res = await fetch('http://localhost:5000/inversionistas', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(valores)
			});
			if (res.ok) {
				navigate(-1);
			} else {
				const data = await res.json();
				alert(data.message || 'Error al crear inversionista');
				console.error('Error al crear inversionista:', data);
			}
		} catch (e) {
			alert('Error al crear inversionista');
		}
	};

	return (
		<div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'transparent' }}>
			<FormularioInversionista ref={formRef} />
			<button
				onClick={handleCrearInversionista}
				style={{ padding: '10px 32px', fontSize: 16, borderRadius: 6, border: 'none', background: '#2875b4', color: '#fff', cursor: 'pointer', boxShadow: '0 2px 8px #0001', marginTop: 24 }}
			>
				Crear Inversionista
			</button>
		</div>
	);
};

export default FormularioCreacionInversionista;