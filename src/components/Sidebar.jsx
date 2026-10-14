import { NavLink } from "react-router";

const menu = [
    {
        titulo: "Geral",
        links: [
            { nome: "Início", caminho: "/"}
        ]
    },
    {
        titulo: "Cadastros",
        links: [
            { nome: "Clientes", caminho: "/clientes"},
            { nome: "Produtos", caminho: "/produtos"},
            { nome: "Setores", caminho: "/setores"}
        ]
    },
    {
        titulo: "Operação",
        links: [
            { nome: "Pedidos", caminho: "/pedidos" }
        ]
    }
];

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <h2>Cantina SENAC</h2>
                <p>Gestão da cantina</p>
            </div>

            <nav aria-label="Navegação principal">
                {menu.map((grupo) => (
                    <div className="menu-group" key={grupo.titulo}>
                        <h3>{grupo.titulo}</h3>

                        {grupo.links.map((link) => (
                            <NavLink
                                key={link.caminho}
                                to={link.caminho}
                                end={link.caminho === "/"}
                                className={({ isActive }) => 
                                    isActive ? "menu-link active" : "menu-link"
                                }
                            >
                                {link.nome}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar;