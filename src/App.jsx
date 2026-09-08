import { useState } from "react";
import FilterChip from "./components/FilterChip";
import NotificationCard from "./components/NotificationCard";
import Button from "./components/Button";
const notificacoesExemplo = [
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
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Central de Notificações</h1>
      <div className="flex gap-2 mb-4">
        <FilterChip
          label="Todas"
          ativo={filtro === "todas"}
          onClick={() => setFiltro("todas")}
        />
        <FilterChip
          label="Push"
          ativo={filtro === "push"}
          onClick={() => setFiltro("push")}

        />
        <FilterChip
          label="E-mail"
          ativo={filtro === "email"}
          onClick={() => setFiltro("email")}
        />
      </div>
      {notificacoesExemplo.map((n) => (
        <NotificationCard key={n.id} {...n} />
      ))}
      <Button variant="destaque">Enviar notificação de teste</Button>
    </div>
  );
}

function adicionarNotificacao(nova) {
  setNotificacoes((atual) => [nova, ...atual]);
}

export default App;