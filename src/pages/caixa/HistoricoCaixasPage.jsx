import HistoricoCaixas from "../../components/HistoricoCaixas";

function HistoricoCaixasPage() {
    return (
        <section className="pagina pagina-caixa">
            <header className="pagina-header">
                <h1>Histórico de caixas</h1>
                <p>Consulte os caixas fechados e suas conferências.</p>
            </header>

            <HistoricoCaixas />
        </section>
    );
}

export default HistoricoCaixasPage;