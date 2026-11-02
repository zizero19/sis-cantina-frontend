import { useEffect, useState } from "react";
import { listarCaixasFechados } from "../services/caixaService";

const moeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

function formatarData(valor) {
    return valor ? new Date(valor).toLocaleString("pt-BR") : "—";
}

const filtrosVazios = {
    responsavel: "",
    dataInicial: "",
    dataFinal: "",
};

function periodoInvalido(filtros) {
    return Boolean(filtros.dataInicial && filtros.dataFinal &&
        filtros.dataInicial > filtros.dataFinal);
}

function HistoricoCaixas() {
    const [resultado, setResultado] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [consulta, setConsulta] = useState({
        pagina: 0,
        filtros: filtrosVazios,
    });
    const campos = consulta.filtros;
    const erroFiltros = periodoInvalido(campos)
        ? "A data inicial não pode ser posterior à final."
        : "";
    const pagina = consulta.pagina;

    useEffect(() => {
        if (periodoInvalido(consulta.filtros)) return;
        let ativo = true;

        async function carregar() {
            try {
                const dados = await listarCaixasFechados(
                    consulta.pagina,
                    10,
                    consulta.filtros
                );

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

        const temporizador = setTimeout(carregar, consulta.espera ?? 0);

        return () => {
            ativo = false;
            clearTimeout(temporizador);
        };
    }, [consulta]);

    function mudarPagina(novaPagina) {
        setCarregando(true);
        setErro("");
        setConsulta((anterior) => ({
            ...anterior,
            pagina: novaPagina,
            espera: 0,
        }));
    }

    function alterarFiltro(nome, valor) {
        const filtros = { ...campos, [nome]: valor };
        setErro("");
        setCarregando(!periodoInvalido(filtros));

        setConsulta({
            pagina: 0,
            filtros,
            espera: nome === "responsavel" ? 400 : 0,
        });
    }

    function limparFiltros() {
        setErro("");
        setCarregando(true);

        setConsulta({
            pagina: 0,
            filtros: { ...filtrosVazios },
        });
    }

    return (
        <section
            className="caixa-historico"
            aria-label="Listagem de caixas fechados"
        >

            <section
                className="caixa-historico-filtros"
                aria-label="Filtros do histórico"
            >
                <header className="caixa-historico-cabecalho">
                    <h2>Histórico de caixas</h2>
                    <span role="status">
                        {carregando ? "Consultando…" : erro || erroFiltros
                            ? "Consulta indisponível"
                            : `${resultado?.totalElements ?? 0} caixa(s) fechado(s)`}
                    </span>
                </header>
                <div className="caixa-barra-filtros">
                    <div className="caixa-filtro-busca">
                    <label className="visualmente-oculto" htmlFor="filtro-responsavel">Buscar responsável</label>
                    <input
                        id="filtro-responsavel"
                        type="text"
                        placeholder="Buscar responsável…"
                        maxLength={100}
                        value={campos.responsavel}
                        onChange={(evento) =>
                            alterarFiltro("responsavel", evento.target.value)
                        }
                    />
                    </div>
                    <div className="caixa-filtro-data">
                    <label htmlFor="filtro-data-inicial">De</label>
                    <input
                        id="filtro-data-inicial"
                        type="date"
                        title="Data inicial de abertura"
                        aria-invalid={Boolean(erroFiltros)}
                        aria-describedby={erroFiltros ? "erro-periodo-caixas" : undefined}
                        value={campos.dataInicial}
                        onChange={(evento) =>
                            alterarFiltro("dataInicial", evento.target.value)
                        }
                    />
                    </div>
                    <div className="caixa-filtro-data">
                    <label htmlFor="filtro-data-final">Até</label>
                    <input
                        id="filtro-data-final"
                        type="date"
                        title="Data final de abertura"
                        aria-invalid={Boolean(erroFiltros)}
                        aria-describedby={erroFiltros ? "erro-periodo-caixas" : undefined}
                        value={campos.dataFinal}
                        onChange={(evento) =>
                            alterarFiltro("dataFinal", evento.target.value)
                        }
                    />

                    </div>
                        <button
                            type="button"
                            className="botao-secundario"
                            onClick={limparFiltros}
                        >
                            Limpar
                        </button>
                </div>

                {erroFiltros && <p id="erro-periodo-caixas" role="alert">{erroFiltros}</p>}
            </section>
            <div className="caixa-historico-resultados" aria-busy={carregando}>
            {erroFiltros ? (
                <p>Corrija o período para consultar os caixas.</p>
            ) : carregando ? (
                <p role="status">Carregando histórico...</p>
            ) : erro ? (
                <p role="alert">{erro}</p>
            ) : resultado?.content.length === 0 ? (
                <p>Nenhum caixa fechado encontrado.</p>
            ) : (
                <>
                    <div className="caixa-historico-lista">
                        {resultado?.content.map((item) => (
                            <article
                                className="caixa-historico-card"
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

            {!carregando && !erro && !erroFiltros && resultado && resultado.totalPages > 0 && (
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
            </div>
        </section>
    );
}

export default HistoricoCaixas;
