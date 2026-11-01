import { Navigate, Route, Routes } from 'react-router';
import Layout from "./components/Layout";
import Inicio from './pages/Inicio';
import Clientes from './pages/Clientes';
import Produtos from './pages/Produtos';
import Setores from './pages/Setores';
import Pedidos from './pages/Pedidos';
import Caixa from './pages/caixa/Caixa';
import CaixasLayout from './pages/caixa/CaixaLayout';
import HistoricoCaixas from './components/HistoricoCaixas';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/setores" element={<Setores />} />
        <Route path="/pedidos" element={<Pedidos />} />

        <Route path="/caixas" element={<CaixasLayout />}>
          <Route index element={<Navigate to="atual" replace />} />
          <Route path="atual" element={<Caixa />} />
          <Route path="historico" element={<HistoricoCaixas />}/>
        </Route>

        <Route path="/caixa" element={<Navigate to="/caixas/atual" replace />}/>
      </Route>
    </Routes>
  );
}

export default App
