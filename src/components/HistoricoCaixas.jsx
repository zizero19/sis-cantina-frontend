import { useEffect, useState } from "react";
import { listarCaixasFechados } from "../services/caixaService";

const moeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

function formatarData(valor) {
    return valor ? new Date(valor).toLocaleString("pt-BR") : "—";
}

function HistoricoCaixas() {
    const [pagina, setPagina] = useState(0);
    const [resultado, setResultado] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregar() {
            try {
                const dados = await listarCaixasFechados(pagina);

                if (ativo) {
                    setResultado(dados);
                    setErro("");
                }
            } catch (erro) {
                if (ativo) {
                    setErro(erro.message);
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregar();

        return () => {
            ativo = false;
        };
    }, [pagina]);

    function mudarPagina(novaPagina) {
        setCarregando(true);
        setErro("");
        setPagina(novaPagina);
    }

    return (
        <section
            className="caixa-historico"
            aria-label="Listagem de caixas fechados"
        >
            {carregando ? (
                <p role="status">Carregando histórico...</p>
            ) : erro ? (
                <p role="alert">{erro}</p>
            ) : resultado?.content.length === 0 ? (
                <p>Nenhum caixa fechado encontrado.</p>
            ) : (
                <>
                    <p>
                        {resultado.totalElements} caixa(s) fechado(s).
                    </p>

                    <div className="caixa-historico-lista">
                        {resultado?.content.map((item) => (
                            <article
                                className="caixa-painel"
                                key={item.id}
                            >
                                <header className="caixa-card-cabecalho">
                                    <h3>Caixa #{item.id}</h3>
                                    <span className="caixa-status">
                                        Fechado
                                    </span>
                                </header>

                                <p>
                                    <strong>Responsável:</strong>{" "}
                                    {item.responsavelAbertura}
                                </p>

                                <p>
                                    <strong>Abertura:</strong>{" "}
                                    {formatarData(item.abertura)}
                                </p>

                                <p>
                                    <strong>Fechamento:</strong>{" "}
                                    {formatarData(item.fechamento)}
                                </p>

                                <dl className="caixa-totais">
                                    {[
                                        ["Valor inicial", item.valorAbertura],
                                        ["Vendas em dinheiro", item.totalDinheiro],
                                        ["Cartão", item.totalCartao],
                                        ["PIX", item.totalPix],
                                        ["A prazo", item.totalAPrazo],
                                        ["Dinheiro esperado", item.valorEsperado],
                                        ["Dinheiro contado", item.valorFechamento],
                                        ["Diferença", item.diferenca],
                                    ].map(([titulo, valor]) => (
                                        <div key={titulo}>
                                            <dt>{titulo}</dt>
                                            <dd>{moeda.format(valor)}</dd>
                                        </div>
                                    ))}
                                </dl>

                                {item.observacoes && (
                                    <p>
                                        <strong>Observações:</strong>{" "}
                                        {item.observacoes}
                                    </p>
                                )}
                            </article>
                        ))}
                    </div>
                </>
            )}

            {resultado && resultado.totalPages > 0 && (
                <nav
                    className="caixa-paginacao"
                    aria-label="Páginas do histórico de caixas"
                >
                    <button
                        type="button"
                        disabled={carregando || pagina === 0}
                        onClick={() => mudarPagina(pagina - 1)}
                    >
                        Anterior
                    </button>

                    <span>
                        Página {pagina + 1} de {resultado.totalPages}
                    </span>

                    <button
                        type="button"
                        disabled={
                            carregando ||
                            pagina >= resultado.totalPages - 1
                        }
                        onClick={() => mudarPagina(pagina + 1)}
                    >
                        Próxima
                    </button>
                </nav>
            )}
        </section>
    );
}

export default HistoricoCaixas;