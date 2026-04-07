import { useRef } from 'react';
import FormularioInversionista from "../FormularioInversionista/FormularioInversionista";

const FormularioEdicionInversionista = ({
	inversorista,
}) => {
	const formRef = useRef(null);

	const handleEditarInversionista = async () => {
		const valores = formRef.current.getValores();

		try {
			const response = await fetch(`http://localhost:5000/inversionistas/${inversorista.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(valores),
			});
			if (!response.ok) {
				alert('Error al editar el inversionista');
			}
			alert('Inversionista editado exitosamente');
		} catch (e) {
			console.error('Error al editar el inversionista:', e);
		}
	};

	return (
		<div>
			<FormularioInversionista
				ref={formRef}
				values={inversorista}
			/>

			<button onClick={handleEditarInversionista}>
				Editar Inversionista
			</button>
		</div>
	);
};

export default FormularioEdicionInversionista;