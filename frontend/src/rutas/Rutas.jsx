
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../Pages/Dashboard/Dashboard';
import CrecionInversionista from '../Pages/CrecionInversionista/CrecionInversionista';
import EdicionInversionista from '../Pages/EdicionInversionista/EdicionInversionista'

function NotFound() {
    return <div>Página no encontrada</div>;
}

function Rutas() {
    return (
        <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/crear-inversionista' element={<CrecionInversionista />} />
            <Route path='/inversionistas/:id/editar' element={<EdicionInversionista />} />
            <Route path='/*' element={<NotFound />} />
        </Routes>
    );
}

export default Rutas;