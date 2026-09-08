# Encontro 7 — Componentes, Props, Composição, Estado e Formulários

**PEND — Programação Front-End** · 08/09/2026

---

## Hoje em duas partes

Hoje a tela dá dois passos: primeiro ela se organiza melhor em componentes (composição), depois ganha vida própria — uma notificação pode nascer de um formulário que vocês mesmos preencherem, sem recarregar a página.

---

## Parte 1 — Composição via `children`

Até agora, os componentes recebiam dados simples (texto, número, booleano) por prop. **Composição** é diferente: é passar **outro componente inteiro** como conteúdo.

```jsx
function Painel({ titulo, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h2 className="font-semibold mb-3">{titulo}</h2>
      {children}
    </div>
  );
}

// uso:
<Painel titulo="Notificações de hoje">
  <NotificationCard {...notificacao} />
</Painel>
```

`children` é uma prop especial: tudo que fica **entre** as tags de abertura e fechamento do componente vira `children` automaticamente.

> **Ponte com React Native:** é o mesmo padrão de uma `<View>` que envolve outras, ou de um `<ScrollView>` recebendo qualquer coisa como filho.

### Quando extrair um componente novo

Regra prática: **se um trecho de JSX se repete, ou pode mudar de tamanho independente do resto, ele vira componente.** A lista de notificações (hoje um `.map` solto em `App.jsx`) vira `NotificationList`, porque pode crescer, ser testada isoladamente, e ganhar novas regras (como estado vazio) sem afetar o resto da tela.

---

## Parte 2 — Estado sem mutar direto

### O erro mais comum

```jsx
// ERRADO — muta o array diretamente
notificacoes.push(novaNotificacao);
setNotificacoes(notificacoes);

// CERTO — cria um array novo
setNotificacoes((atual) => [...atual, novaNotificacao]);
```

Se vocês mutarem o array direto, o React às vezes **não percebe a mudança** — a tela simplesmente não atualiza, sem erro nenhum no console. É um dos bugs mais frustrantes de debugar sem saber a causa.

> **Ponte com React Native:** o mesmo problema aparece com `FlatList` que não atualiza depois de um `.push()`. A causa é a mesma.

### Formulário controlado

"Controlado" significa que o valor do campo vive no **estado do React**, não só no DOM:

```jsx
const [titulo, setTitulo] = useState("");

<input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
```

Cada tecla digitada atualiza o estado, e o campo reflete esse estado — não o contrário.

---

## Parte 3 — Situação-problema

### Fluxo de trabalho

Mesma dinâmica de sempre: `git checkout main && git pull`, criar a branch do dia, trabalhar, `push`. No fim, o grupo escolhe uma branch, abre Pull Request, e todos atualizam a `main` antes de sair.

### Passo 1 — Extrair `NotificationList`

```jsx
function NotificationList({ notificacoes }) {
  if (notificacoes.length === 0) {
    return <p className="text-gray-500 text-sm">Nenhuma notificação por aqui.</p>;
  }

  return (
    <div>
      {notificacoes.map((n) => (
        <NotificationCard key={n.id} {...n} />
      ))}
    </div>
  );
}

export default NotificationList;
```

> Reparem no estado vazio (`length === 0`). É a mesma preocupação do fluxograma do encontro 3 — todo estado do fluxo precisa aparecer na tela, inclusive "ainda não tem nada aqui".

### Passo 2 — Elevar o estado do filtro

Extraiam a barra de filtros para um componente próprio — mas o estado continua no `App`:

```jsx
function FilterBar({ filtroAtual, onFiltroChange }) {
  return (
    <div className="flex gap-2 mb-4">
      <FilterChip label="Todas" ativo={filtroAtual === "todas"} onClick={() => onFiltroChange("todas")} />
      <FilterChip label="Push" ativo={filtroAtual === "push"} onClick={() => onFiltroChange("push")} />
      <FilterChip label="E-mail" ativo={filtroAtual === "email"} onClick={() => onFiltroChange("email")} />
    </div>
  );
}
```

**Isto é elevação de estado**: o `FilterBar` não decide qual filtro está ativo, só avisa o pai (`onFiltroChange`). Quem decide continua sendo `App` — porque `App` também precisa do filtro atual para filtrar a lista.

### Passo 3 — Formulário que eleva o resultado

```jsx
function NovaNotificacaoForm({ onAdicionar }) {
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [canal, setCanal] = useState("PUSH");

  function handleSubmit(e) {
    e.preventDefault();
    if (!titulo.trim()) return;

    onAdicionar({
      id: Date.now(),
      canal,
      hora: new Date().toLocaleTimeString().slice(0, 5),
      titulo,
      texto,
      lida: false,
    });

    setTitulo("");
    setTexto("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
      <input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título da notificação"
        className="border border-gray-200 rounded-lg px-3 py-2"
      />
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Texto"
        className="border border-gray-200 rounded-lg px-3 py-2"
      />
      <Button variant="destaque">Adicionar notificação</Button>
    </form>
  );
}
```

Em `App.jsx`:

```jsx
function adicionarNotificacao(nova) {
  setNotificacoes((atual) => [nova, ...atual]);
}

// <NovaNotificacaoForm onAdicionar={adicionarNotificacao} />
```

> Não esqueçam o `e.preventDefault()` no `handleSubmit` — sem ele, o navegador recarrega a página ao enviar o formulário, do jeito antigo (pré-React).

### Testar

Preencham o formulário e confirmem: a notificação aparece **no topo** da lista, sem recarregar a página.

---

## Checklist de encerramento

- [ ] `NotificationList` extraído, com estado vazio tratado
- [ ] `FilterBar` extraído, com o estado do filtro permanecendo em `App`
- [ ] Formulário controlado adicionando notificações, sem mutar o array direto
- [ ] Testado: nova notificação aparece sem recarregar a página
- [ ] Pull Request revisado e mergeado
- [ ] Todos atualizaram a `main` local antes de sair

---

## Para pensar até o próximo encontro

Hoje toda notificação nasceu de vocês, digitada no formulário. Semana que vem ela vai nascer de fora — a lista inteira vai vir da API de verdade, com `fetch`.
