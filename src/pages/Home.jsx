// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { API_URL } from "../config"; // Ajustado o caminho para voltar uma pasta

const { token } = useAuth();

// Imports da pasta components (ajustado o caminho para voltar uma pasta)
import FilterBar from "../components/FilterBar";
import NotificationList from "../components/NotificationList";
import NovaNotificacaoForm from "../components/NovaNotificacaoForm";

async function Home() {
    const [filtro, setFiltro] = useState("todas");
    const [notificacoes, setNotificacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    const notificacoesVisiveis = notificacoes.filter((n) => {
        if (filtro === "todas") return true;
        if (filtro === "push") return n.canal === "PUSH";
        if (filtro === "email") return n.canal === "EMAIL";
        return false;
    });

    function adicionarNotificacao(nova) {
        setNotificacoes((atual) => [nova, ...atual]);
    }

    useEffect(() => {
        async function buscar() {
            try {
                const resposta = await fetch(`${API_URL}/notificacoes`);
                if (!resposta.ok) throw new Error("Erro ao buscar notificações");
                const dados = await resposta.json();
                setNotificacoes(dados);
            } catch (e) {
                setErro(e.message);
            } finally {
                setCarregando(false);
            }
        }
        buscar();
    }, []);

    await fetch(`${API_URL}/notificacoes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novaNotificacao),
    });

    return (
        <div className="max-w-2xl mx-auto p-4 bg-fundo-principal">
            <h1 className="text-2xl font-bold mb-4 text-titulo">Central de Notificações</h1>

            <NovaNotificacaoForm onAdicionar={adicionarNotificacao} />
            <FilterBar filtroAtual={filtro} onFiltroChange={setFiltro} />

            {/* Mensagens de feedback renderizadas corretamente dentro do return */}
            {carregando && <p className="text-gray-500 mt-4">Carregando notificações...</p>}
            {erro && <p className="text-red-600 mt-4">Não foi possível carregar. Tente novamente.</p>}

            {!carregando && !erro && (
                <NotificationList notificacoes={notificacoesVisiveis} />
            )}
        </div>
    );
}

export default Home;
