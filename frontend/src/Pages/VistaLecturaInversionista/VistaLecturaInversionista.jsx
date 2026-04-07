import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


const VistaLecturaInversionista = () => {
	const { id: idInversionista } = useParams();
	const [inversionista, setInversionista] = useState(null);

	const obtenerInversionista = async (id) => {
		try {
			const response = await fetch(`http://localhost:5000/inversionistas/${id}`);
			if (!response.ok) {
				throw new Error('Error al obtener el inversionista');
			}
			const data = await response.json();
			setInversionista(data.data);	
			console.log('Inversionista obtenido:', data.data);
		} catch (error) {
			console.error('Error:', error);
		}
	};

	useEffect(() => {
		if (idInversionista) {
			obtenerInversionista(idInversionista);
		}
	}, [idInversionista]);


	return (
		<div>
			<h1>Vista de Lectura del Inversionista</h1>

			{inversionista ? (
				<div>
					<p><strong>Nombre:</strong> {inversionista.nombre} {inversionista.apellido}</p>
					<p><strong>Correo:</strong> {inversionista.email}</p>
					<p><strong>Inversión:</strong> {inversionista.inversion}</p>
				</div>
			) : (
				<p>Cargando información del inversionista...</p>
			)}
		</div>
	);
};

export default VistaLecturaInversionista;