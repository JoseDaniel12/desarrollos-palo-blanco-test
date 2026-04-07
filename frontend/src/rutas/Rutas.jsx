
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../Pages/Dashboard/Dashboard';
import CrecionInversionista from '../Pages/CrecionInversionista/CrecionInversionista';

function NotFound() {
    return <div>Página no encontrada</div>;
}

function Rutas() {
    return (
        <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/crear-inversionista' element={<CrecionInversionista />} />
            <Route path='/*' element={<NotFound />} />
        </Routes>
    );
}

export default Rutas;