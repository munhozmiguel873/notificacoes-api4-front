import { useState } from "react";
import { useEffect } from "react";
import { API_URL } from "./config";

import FilterBar from "./components/FilterBar";
import NotificationList from "./components/NotificationList";
import NovaNotificacaoForm from "./components/NovaNotificacaoForm";

const notificacoesIniciais = [
  {
    id: 1,
    canal: "PUSH",
    hora: "14:32",
    titulo: "Inscrição confirmada",
    texto: "Seu lugar está garantido.",
    lida: false,
  },
  {
    id: 2,
    canal: "EMAIL",
    hora: "13:10",
    titulo: "Evento amanhã",
    texto: "Não esqueça o notebook.",
    lida: true,
  },
];

function App() {
  const [filtro, setFiltro] = useState("todas");
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const notificacoesVisiveis = notificacoes.filter((n) => {
    if (filtro === "todas") return true;
    if (filtro === "push") return n.canal === "PUSH";
    if (filtro === "email") return n.canal === "EMAIL";
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

  {
    carregando && <p className="text-gray-500">Carregando notificações...</p>;
  }
  {
    erro && (
      <p className="text-red-600">Não foi possível carregar. Tente novamente.</p>
    );
  }
  {
    !carregando && !erro && (
      <NotificationList notificacoes={notificacoesVisiveis} />
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto p-4 bg-fundo-principal">
      <h1 className="text-2xl font-bold mb-4 text-titulo">Central de Notificações</h1>

      <NovaNotificacaoForm onAdicionar={adicionarNotificacao} />
      <FilterBar filtroAtual={filtro} onFiltroChange={setFiltro} />
      <NotificationList notificacoes={notificacoesVisiveis} />
    </div>
  );
}

export default App;