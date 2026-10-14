import { Link } from "react-router";

const atalhos = [
    {
        titulo: "Clientes",
        descricao: "Gerenciar clientes cadastrados",
        caminho: "/clientes"
    },
    {
        titulo: "Produtos",
        descricao: "Gerenciar produtos da cantina",
        caminho: "/produtos"
    },
    {
        titulo: "Setores",
        descricao: "Gerenciar setores",
        caminho: "/setores"
    },
    {
        titulo: "Pedidos",
        descricao: "Registrar e consultar pedidos",
        caminho: "/pedidos"
    }
];

function Inicio() {
    return (
        <section className="pagina">
            <header className="pagina-header">
                <h1>Início</h1>
                <p>Bem-vindo ao sistema de gestão da catina.</p>
            </header>

            <h2 className="secao-titulo">Acesso rápido</h2>

            <div className="atalhos-grid">
                {atalhos.map((atalho) => (
                    <Link
                        key={atalho.caminho}
                        to={atalho.caminho}
                        className="atalho-card"
                    >
                        <h3>{atalho.titulo}</h3>
                        <p>{atalho.descricao}</p>
                        <span>Acessar →</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default Inicio;