async function requisitar(caminho, opcoes ={}) {
    const resposta = await fetch(`/api/caixa${caminho}`, opcoes);

    if(resposta.status === 204) {
        return null;
    }

    const texto = await resposta.text();
    let dados;

    try {
        dados = texto ? JSON.parse(texto) : null;
    } catch {
        throw new Error("O servidor retornou uma resposta inesperada");
    }

    if(!resposta.ok) {
        const errosCampos = dados?.campos ? Object.values(dados.campos).join(" ") : "";
        throw new Error(errosCampos || dados?.message || dados?.mensagem || `Não foi piossível concluir a operação (${resposta.status})`);
    }

    return dados;
}

export function buscarCaixaAberto() {
    return requisitar("/aberto");
}

export function abrirCaixa(dadosAbertura) {
    return requisitar("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAbertura),
    });
}

export function fecharCaixa(id, valorFechamento) {
    return requisitar(`/${id}/fechar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valorFechamento }),
    });
}

export function listarCaixasFechados(pagina = 0, tamanho = 10) {
    const parametros = new URLSearchParams({
        page: String(pagina),
        size: String(tamanho)
    });

    return requisitar(`/fechados?${parametros.toString()}`);
}