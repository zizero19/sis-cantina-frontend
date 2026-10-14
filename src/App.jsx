import { Route, Routes } from 'react-router';
import Layout from "./components/Layout";
import Inicio from './pages/Inicio';
import Clientes from './pages/Clientes';
import Produtos from './pages/Produtos';
import Setores from './pages/Setores';
import Pedidos from './pages/Pedidos';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/setores" element={<Setores />} />
        <Route path="/pedidos" element={<Pedidos />} />
      </Route>
    </Routes>
  );
}

export default App
