import { useEffect, useState } from "react";
import { abrirCaixa, buscarCaixaAberto, fecharCaixa } from "../../services/caixaService";

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function Caixa() {
    const [caixa, setCaixa] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [consultaConcluida, setConsultaConcluida] = useState(false);
    const [fechamentoVisivel, setFechamentoVisivel] = useState(false);

    const [responsavel, setResponsavel] = useState("");
    const [valorAbertura, setValorAbertura] = useState("");
    const [observacoes, setObservacoes] = useState("");
    const [valorFechamento, setValorFechamento] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregar() {
            try {
                const dados = await buscarCaixaAberto();

                if (ativo) {
                    setCaixa(dados);
                    setConsultaConcluida(true);
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

        carregar()

        return () => {
            ativo = false;
        };
    }, []);

    async function handleAbrir(evento) {
        evento.preventDefault();

        if (!responsavel.trim()) {
            setErro("Informe o responsavel pelo caixa.");
            return;
        }

        setEnviando(true);
        setErro("");
        setMensagem("");

        try {
            const dados = await abrirCaixa({
                responsavelAbertura: responsavel.trim(),
                valorAbertura: Number(valorAbertura),
                observacoes: observacoes.trim() || null,
            });

            setCaixa(dados);
            setResponsavel("");
            setValorAbertura("");
            setObservacoes("");
            setMensagem("Caixa aberto com sucesso.");
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    async function handleFechar(evento) {
        evento.preventDefault();
        setEnviando(true);
        setErro("");
        setMensagem("");

        try {
            const dados = await fecharCaixa(
                caixa.id,
                Number(valorFechamento)
            );

            setCaixa(dados);
            setValorFechamento("");
            setFechamentoVisivel(false);

            setMensagem(
                `Caixa #${dados.id} fechado com sucesso. ` +
                `Diferença: ${moeda.format(dados.diferenca)}.`
            );
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    const isAberto = caixa?.status === "ABERTO";
    const diferencaPrevista =
        isAberto &&
            valorFechamento !== "" &&
            Number.isFinite(Number(valorFechamento)) &&
            Number(valorFechamento) >= 0
            ? (
                Math.round(Number(valorFechamento) * 100) -
                Math.round(Number(caixa.valorEsperado) * 100)
            ) / 100
            : null;

    return (
        <div className="caixa-atual">
            {erro && <p role="alert">{erro}</p>}
            {mensagem && <p role="status">{mensagem}</p>}

            {carregando ? (
                <p role="status">Consultando caixa...</p>
            ) : !consultaConcluida ? (
                <p>
                    Não foi possível consultar a situação do caixa.
                    Verifique a conexão com o servidor e recarregue a página.
                </p>
            ) : (
                <>
                    {isAberto && (
                        <section className="caixa-painel">
                            <h2>Caixa #{caixa.id} — {caixa.status}</h2>

                            <p>
                                Responsável: {caixa.responsavelAbertura}
                            </p>

                            <p>
                                Aberto em: {new Date(caixa.abertura).toLocaleString("pt-BR")}
                            </p>

                            <dl className="caixa-totais">
                                {[
                                    ["Valor inicial", caixa.valorAbertura],
                                    ["Vendas em dinheiro", caixa.totalDinheiro],
                                    ["Cartão", caixa.totalCartao],
                                    ["PIX", caixa.totalPix],
                                    ["A prazo", caixa.totalAPrazo],
                                    ["Dinheiro esperado", caixa.valorEsperado],
                                ].map(([titulo, valor]) => (
                                    <div key={titulo}>
                                        <dt>{titulo}</dt>
                                        <dd>{moeda.format(valor)}</dd>
                                    </div>
                                ))}
                            </dl>
                        </section>
                    )}

                    {isAberto ? (
                        <>
                            {!fechamentoVisivel ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFechamentoVisivel(true);
                                        setErro("");
                                        setMensagem("");
                                    }}
                                >
                                    Fechar caixa
                                </button>
                            ) : (
                                <form
                            className="caixa-painel caixa-formulario"
                            onSubmit={handleFechar}
                        >
                            <h2>Fechar caixa</h2>
                            <p>
                                Informe o dinheiro físico contado,
                                incluindo o valor inicial.
                            </p>

                            <fieldset disabled={enviando}>
                                <label htmlFor="valor-fechamento">
                                    Dinheiro contado (R$)
                                </label>
                                <input
                                    id="valor-fechamento"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    value={valorFechamento}
                                    onChange={(evento) =>
                                        setValorFechamento(evento.target.value)
                                    }
                                />

                                {diferencaPrevista !== null && (
                                    <div className="caixa-conferencia" aria-live="polite">
                                        <p>
                                            Esperado: <strong>{moeda.format(caixa.valorEsperado)}</strong>
                                        </p>
                                        <p>
                                            Contado: <strong>{moeda.format(Number(valorFechamento))}</strong>
                                        </p>
                                        <p>
                                            Diferença: <strong>
                                                {moeda.format(diferencaPrevista)}
                                                {diferencaPrevista < 0
                                                    ? " — falta"
                                                    : diferencaPrevista > 0
                                                        ? " — sobra"
                                                        : " — conferido"}
                                            </strong>
                                        </p>
                                    </div>
                                )}

                                <div className="caixa-acoes">
                                    <button type="submit">
                                        {enviando ? "Fechando..." : "Confirmar fechamento"}
                                    </button>
                                    <button
                                        type="button"
                                        className="botao-secundario"
                                        onClick={() => {
                                            setFechamentoVisivel(false);
                                            setValorFechamento("");
                                            setErro("");
                                        }}
                                    >
                                        Voltar
                                    </button>
                                </div>
                            </fieldset>
                        </form> 
                            )}
                        </>
                    ) : (
                        (
                            <form
                                className="caixa-painel caixa-formulario"
                                onSubmit={handleAbrir}
                            >
                                <h2>Abrir caixa</h2>

                                <fieldset disabled={enviando}>
                                    <label htmlFor="responsavel">
                                        Responsável pela abertura
                                    </label>
                                    <input
                                        id="responsavel"
                                        type="text"
                                        maxLength={100}
                                        required
                                        value={responsavel}
                                        onChange={(evento) =>
                                            setResponsavel(evento.target.value)
                                        }
                                    />

                                    <label htmlFor="valor-abertura">
                                        Valor inicial para troco (R$)
                                    </label>
                                    <input
                                        id="valor-abertura"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        value={valorAbertura}
                                        onChange={(evento) =>
                                            setValorAbertura(evento.target.value)
                                        }
                                    />

                                    <label htmlFor="observacoes">
                                        Observações (opcional)
                                    </label>
                                    <textarea
                                        id="observacoes"
                                        maxLength={255}
                                        value={observacoes}
                                        onChange={(evento) =>
                                            setObservacoes(evento.target.value)
                                        }
                                    />

                                    <button type="submit">
                                        {enviando ? "Abrindo..." : "Abrir caixa"}
                                    </button>
                                </fieldset>
                            </form>
                        )
                    )}
                </>
            )}
        </div>
    );
}

export default Caixa;
