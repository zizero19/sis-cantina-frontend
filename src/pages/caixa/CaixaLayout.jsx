import { NavLink, Outlet } from "react-router";

function CaixasLayout() {
    return (
        <section className="pagina pagina-caixa">
            <header className="pagina-header">
                <h1>Caixas</h1>
                <p>
                    Gerencie a operação atual e consulte os fechamentos.
                </p>
            </header>

            <nav className="subnavegacao" aria-label="Seção Caixas">
                <NavLink
                    to="/caixas/atual"
                    className={({ isActive }) =>
                        isActive ? "subnav-link active" : "subnav-link"
                    }
                >
                    Caixa atual
                </NavLink>

                <NavLink
                    to="/caixas/historico"
                    className={({ isActive }) =>
                        isActive ? "subnav-link active" : "subnav-link"
                    }
                >
                    Histórico
                </NavLink>
            </nav>

            <Outlet />
        </section>
    );
}

export default CaixasLayout;