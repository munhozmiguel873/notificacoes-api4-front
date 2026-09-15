import { useState } from "react";
import FilterBar from "./components/FilterBar";
import NotificationCard from "./components/NotificationList";
import Button from "./components/Button";
import Saudacao from "./components/Saudacao";

const [notificacoes, setNotificacoes] = useState([]);

function adicionarNotificacao(nova) {
  setNotificacoes((atual) => [nova, ...atual]);
}

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
  const [notificacoes, setNotificacoes] = useState(notificacoesIniciais);

  const notificacoesFiltradas = notificacoes.filter((n) => {
    if (filtro === "todas") return true;
    if (filtro === "push") return n.canal === "PUSH";
    if (filtro === "email") return n.canal === "EMAIL";
  });

  function adicionarNotificacao(nova) {
    setNotificacoes((atual) => [nova, ...atual]);
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Central de Notificações</h1>

      <div className="flex gap-2 mb-4">
        <FilterBar filtroAtual={filtro} onFiltroChange={setFiltro} />
      </div>

      <NotificationList notificacoes={} />

      <NovaNotificacaoForm onAdicionar={adicionarNotificacao} />

      <Button variant="destaque">Enviar notificação de teste</Button>

      <div>
        <Saudacao />
      </div>
    </div>
  );
};

export default App;