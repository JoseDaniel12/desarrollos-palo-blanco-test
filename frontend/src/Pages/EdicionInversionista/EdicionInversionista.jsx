import { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import FormularioCreacionInversionista from '../../components/FormularioCreacionInversionista/FormularioCreacionInversionista';
import FormularioEdicionInversionista from '../../components/FormularioEdicionInversionista/FormularioEdicionInversionista';


const EdicionInversionista = () => {
	const { id } = useParams();
	const [inversionista, setInversionista] = useState(null);
	const [isLoading, setIsLoading] = useState(true);



	const obtenerInversionista = async (id) => {
		setIsLoading(true);
		try {
			const response = await fetch(`http://localhost:5000/inversionistas/${id}`);
			if (!response.ok) {
				throw new Error('Error al obtener el inversionista');
			}
			const data = await response.json();
			setInversionista(data.data);
		} catch (error) {
			console.error('Error:', error);
		} finally {
			setIsLoading(false);
		}
	};


	useEffect(() => {
		obtenerInversionista(id);
	}, []);

	if (isLoading) {
		return <div>Cargando...</div>;
	}

	return (
		<div>
			<h1>Editar Inversionista</h1>

			<FormularioEdicionInversionista inversorista={inversionista}/>
		</div>
	)
};

export default EdicionInversionista;