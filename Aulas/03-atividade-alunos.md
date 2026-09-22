# Encontro 7 — Composição, Elevação de Estado e Formulários

**PEND — Programação Front-End** · 08/09/2026

---

## O que você vai conseguir fazer ao fim de hoje

- Explicar o que é **composição** e usar `children` para montar um componente a partir de outro.
- Decidir **quando** um pedaço de JSX merece virar um componente próprio.
- Entender por que **não se pode alterar (mutar) estado diretamente** e qual é a forma correta.
- Escrever um **formulário controlado**: campos cujo valor vive no estado do React.
- Aplicar **elevação de estado** — deixar o dado no componente pai e mandar funções para os filhos.
- Terminar o dia com a tela reagindo ao usuário: filtro que filtra de verdade e formulário que adiciona notificações sem recarregar a página.

> **Recapitulando o encontro passado:** vocês criaram `Button`, `NotificationCard` e `FilterChip`, cada um recebendo dados por prop, e montaram tudo em `App.jsx` com uma lista fixa e um `.map`. Hoje essa tela sai do estático.

> **Se você já usou React Native:** composição via `children`, `useState` e formulários controlados são os mesmos conceitos de lá. Os boxes marcados assim apontam os paralelos, mas o texto principal não depende deles.

---

## Parte 1 — Composição via `children`

### O que já sabemos fazer

Até agora, um componente recebe **dados** por prop: texto, número, booleano, função.

```jsx
<NotificationCard canal="PUSH" hora="14:32" titulo="..." />
```

### O que é composição

**Composição** é passar **outro pedaço de JSX inteiro** para dentro de um componente, como conteúdo — não como um atributo, mas entre a tag de abertura e a de fechamento.

```jsx
<Painel titulo="Notificações de hoje">
  <NotificationCard {...notificacao} />
</Painel>
```

Aqui o `<NotificationCard>` foi **passado para dentro** do `<Painel>`. Quem escreve o `Painel` não sabe (nem precisa saber) o que vai receber ali dentro — pode ser um cartão, uma lista, um texto, qualquer coisa.

### Como o componente recebe esse conteúdo: a prop `children`

Tudo que você escreve **entre** as tags de um componente chega para ele numa prop de nome especial: `children`.

```jsx
function Painel({ titulo, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h2 className="font-semibold mb-3">{titulo}</h2>
      {children}
    </div>
  );
}
```

- `titulo` é uma prop normal, passada como atributo: `<Painel titulo="...">`.
- `children` **não** é passada como atributo. É preenchida automaticamente pelo React com o que estiver entre `<Painel>` e `</Painel>`.
- Onde você escreve `{children}` no JSX é onde esse conteúdo aparece.

### Para que serve

Composição resolve o caso "quero uma casca reutilizável com um miolo variável": um card com borda e sombra padrão, um modal, um layout de página, um botão que às vezes tem ícone e às vezes não. A casca é escrita uma vez; o miolo muda a cada uso.

> **Vindo do React Native:** é o mesmo padrão de uma `<View>` que envolve outras, ou de um `<ScrollView>` que aceita qualquer coisa como filho. `children` na web é exatamente `props.children` de lá.

---

## Parte 2 — Quando extrair um componente novo

Nem todo pedaço de JSX precisa virar componente. A regra prática:

> **Extraia um componente quando o trecho se repete, OU quando ele pode mudar de tamanho / ganhar regras próprias independente do resto da tela.**

Exemplos no nosso projeto:

- **A lista de notificações** (hoje um `.map` solto no `App.jsx`) merece virar `NotificationList`, porque ela pode crescer, precisa tratar o caso "lista vazia", e dá para testá-la isolada.
- **A barra de filtros** (hoje três `<FilterChip>` soltos no `App.jsx`) merece virar `FilterBar`, porque é um bloco coeso com responsabilidade única.
- **Um `<span>` com uma classe** provavelmente **não** precisa virar componente — extrair aqui só espalharia o código sem ganho.

Extrair cedo demais atrapalha tanto quanto extrair de menos. O sinal verde é: "esse pedaço tem vida própria".

---

## Parte 3 — Estado sem mutar diretamente

### O erro mais difícil de debugar

```jsx
// ERRADO — altera o array que já existe
notificacoes.push(novaNotificacao);
setNotificacoes(notificacoes);
```

Isso **às vezes funciona e às vezes não**, o que é pior do que quebrar sempre. O motivo: para decidir se precisa redesenhar, o React compara se o valor novo **é o mesmo objeto** que o anterior (comparação por referência, não item a item). Você deu `.push` no mesmo array e passou esse mesmo array de volta — para o React, "nada mudou", e a tela não atualiza. Nenhum erro no console. Você fica olhando o código certo sem entender por quê.

### A forma correta: criar um valor novo

```jsx
// CERTO — cria um array novo a partir do atual
setNotificacoes((atual) => [novaNotificacao, ...atual]);
```

- `[...atual]` cria um **array novo** com os mesmos itens (o `...` "espalha" os itens do array atual dentro do novo).
- `[novaNotificacao, ...atual]` coloca a nova no começo; `[...atual, novaNotificacao]` colocaria no fim.
- Como é um array **novo**, a referência mudou, e o React redesenha.

### Por que `(atual) => ...` em vez de usar a variável direto

```jsx
setNotificacoes((atual) => [nova, ...atual]);   // recomendado
setNotificacoes([nova, ...notificacoes]);        // funciona, mas frágil
```

A versão com função recebe **o valor mais recente** do estado como argumento (`atual`). Se você usar a variável `notificacoes` direto, pode estar lendo um valor já desatualizado quando várias mudanças acontecem juntas. Pegue o hábito da forma com função para qualquer atualização que dependa do valor anterior.

### Vale para objeto também

```jsx
// ERRADO
usuario.nome = "Ana";
setUsuario(usuario);

// CERTO
setUsuario({ ...usuario, nome: "Ana" });
```

> **Vindo do React Native:** o mesmo problema aparece com uma `FlatList` que não atualiza depois de um `.push()`. A causa é idêntica: mutou em vez de criar novo.

---

## Parte 4 — Formulário controlado

### O que "controlado" quer dizer

Um campo de formulário **controlado** é aquele cujo valor vive no **estado do React**, não solto no DOM. O React manda o valor para o campo; o campo avisa o React a cada tecla.

```jsx
const [titulo, setTitulo] = useState("");

<input
  value={titulo}
  onChange={(e) => setTitulo(e.target.value)}
/>
```

O ciclo, a cada tecla:

1. Usuário digita → dispara `onChange`.
2. `e.target.value` é o texto atual do campo.
3. `setTitulo(...)` guarda esse texto no estado e redesenha.
4. O `<input>` recebe `value={titulo}` de volta e mostra o texto.

O estado é a **fonte da verdade**. O campo só reflete o estado — nunca o contrário.

### Por que isso é bom

Com o valor no estado, você consegue: validar antes de enviar, limpar o campo depois do envio, desabilitar o botão se o campo estiver vazio, preencher o campo com um valor inicial — tudo mexendo só no estado.

### `e.preventDefault()`: obrigatório no submit

```jsx
function handleSubmit(e) {
  e.preventDefault();
  // ... resto
}

<form onSubmit={handleSubmit}>
```

Por padrão, enviar um `<form>` faz o **navegador recarregar a página** (comportamento pré-React, que mandava os dados por HTTP e trocava de página). `e.preventDefault()` cancela esse comportamento para você tratar o envio em JavaScript, sem recarregar.

---

## Parte 5 — Elevação de estado (*lifting state up*)

Este é o conceito central do encontro. Leia com calma.

### O problema

O `FilterBar` precisa saber **qual chip está ativo** para pintá-lo. A `NotificationList` precisa saber **qual é o filtro** para mostrar só as notificações certas. São dois componentes irmãos que precisam do **mesmo dado**.

Se cada um guardasse seu próprio `useState` do filtro, eles ficariam **fora de sincronia**: o `FilterBar` acharia que o filtro é "push" e a lista continuaria mostrando tudo.

### A solução

O dado sobe para o **primeiro componente que é pai dos dois**. No nosso caso, o `App`.

```
App  ← o estado `filtro` mora AQUI
├── FilterBar     (recebe: filtro atual + função para mudar)
└── NotificationList  (recebe: a lista já filtrada)
```

- O `App` tem `const [filtro, setFiltro] = useState("todas")`.
- O `App` passa `filtro` para baixo como prop.
- O `App` passa `setFiltro` (ou uma função que chama ele) para baixo, para o filho conseguir **pedir** uma mudança.
- O filho **não decide** nada — só avisa o pai: "o usuário clicou em Push". Quem muda o estado é sempre o `App`.

Esse padrão — estado no pai, função de mudança descendo, evento subindo — é o mesmo que você já viu no encontro passado com o `onClick` do `Button`. A "elevação" é só reconhecer **qual** pai deve segurar o dado.

> **Vindo do React Native:** idêntico. "Lift state up" é o mesmo termo, mesma solução.

---

## Parte 6 — Situação-problema

**Fluxo de trabalho (igual sempre):**

```bash
git checkout main && git pull
git checkout -b seu-nome-08-09
```

Trabalhe, commite, `push`. No fim, o grupo escolhe uma branch, abre Pull Request, revisa e faz o merge. Todos atualizam a `main` antes de sair.

Vamos refatorar o `App.jsx` do encontro passado em quatro passos.

### Passo 1 — Extrair `NotificationList`

Crie `src/components/NotificationList.jsx`:

```jsx
import NotificationCard from "./NotificationCard";

function NotificationList({ notificacoes }) {
  if (notificacoes.length === 0) {
    return (
      <p className="text-gray-500 text-sm">Nenhuma notificação por aqui.</p>
    );
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

Lendo por partes:

- **`import NotificationCard`** no topo — este arquivo usa `<NotificationCard>`, então precisa importá-lo. Todo arquivo que usa um componente importa esse componente; o `App.jsx` de vocês já fazia isso.
- **`if (notificacoes.length === 0)`** — o **estado vazio**. Um componente pode ter mais de um `return`: se a lista está vazia, retorna a mensagem e para ali. Todo estado do fluxo precisa aparecer na tela, inclusive "ainda não tem nada aqui" (é a mesma preocupação do fluxograma do encontro 3).
- **`export default`** no fim — sem isso, o `App` não consegue importar.

### Passo 2 — Extrair `FilterBar` (com o estado ficando no `App`)

Crie `src/components/FilterBar.jsx`:

```jsx
import FilterChip from "./FilterChip";

function FilterBar({ filtroAtual, onFiltroChange }) {
  return (
    <div className="flex gap-2 mb-4">
      <FilterChip
        label="Todas"
        ativo={filtroAtual === "todas"}
        onClick={() => onFiltroChange("todas")}
      />
      <FilterChip
        label="Push"
        ativo={filtroAtual === "push"}
        onClick={() => onFiltroChange("push")}
      />
      <FilterChip
        label="E-mail"
        ativo={filtroAtual === "email"}
        onClick={() => onFiltroChange("email")}
      />
    </div>
  );
}

export default FilterBar;
```

- **`import FilterChip`** e **`export default FilterBar`** — as duas pontas do vaivém de import/export. Faltando qualquer uma, o componente não funciona.
- **`filtroAtual`** e **`onFiltroChange`** são props. O `FilterBar` **não tem `useState`**. Ele recebe o filtro atual de fora e, no clique, chama `onFiltroChange(...)` — que é uma função do `App`.
- Isto é elevação de estado na prática: o `FilterBar` não decide qual filtro está ativo, só **avisa** o pai.

### Passo 3 — Aplicar o filtro na lista

Trocar o chip de cor não adianta nada se a lista não reagir. **Dentro do `App`, antes do `return`**, derive a lista visível a partir do estado `filtro`:

```jsx
const notificacoesVisiveis = notificacoes.filter((n) => {
  if (filtro === "todas") return true;
  if (filtro === "push") return n.canal === "PUSH";
  if (filtro === "email") return n.canal === "EMAIL";
});
```

Depois passe `notificacoesVisiveis` (e **não** `notificacoes`) para o `<NotificationList>`.

- `.filter(...)` devolve um **array novo** só com os itens em que a função retorna `true`. Não altera o original — perfeito, já que não podemos mutar estado.
- `notificacoesVisiveis` **não é estado**. É um valor calculado a cada renderização, a partir de `notificacoes` + `filtro`. Toda vez que um desses dois muda, a lista é recalculada sozinha.

> **Cuidado com maiúsculas/minúsculas.** Os dados de exemplo usam `canal: "PUSH"` e `"EMAIL"`, mas os valores do filtro são `"push"` e `"email"`. Comparar `n.canal === filtro` direto **nunca** dá certo — por isso o `if` acima traduz um para o outro. Alternativa: `n.canal.toLowerCase() === filtro`.

### Passo 4 — Formulário que eleva o resultado

Crie `src/components/NovaNotificacaoForm.jsx`:

```jsx
import { useState } from "react";
import Button from "./Button";

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

export default NovaNotificacaoForm;
```

Lendo por partes:

- **Três estados controlados** — um por campo. Cada `<input>`/`<textarea>` tem `value={...}` e `onChange={...}`.
- **`onAdicionar`** é uma prop (função vinda do `App`). O formulário monta o objeto da notificação e **entrega para o pai** — ele mesmo não guarda a lista. É elevação de estado de novo: o resultado sobe.
- **`if (!titulo.trim()) return;`** — validação simples: sem título (ou só espaços), não faz nada.
- **`id: Date.now()`** — um número único o suficiente para servir de `key` enquanto os dados são locais. No encontro 8 o `id` virá do banco.
- **`new Date().toLocaleTimeString().slice(0, 5)`** — pega a hora atual no formato `HH:MM`.
- **`setTitulo(""); setTexto("");`** — limpa os campos depois de enviar. Como são controlados, limpar o estado limpa a tela.
- **`<Button variant="destaque">`** dentro de um `<form>` funciona como botão de envio: ao clicar, dispara o `onSubmit` do form.

### Passo 5 — Juntar tudo em `App.jsx`

Agora o `App` do encontro 6 muda: a lista fixa vira **estado**, os três `<FilterChip>` soltos viram `<FilterBar>`, o `.map` solto vira `<NotificationList>`, e entra o formulário. `FilterChip` e `NotificationCard` **não são mais importados aqui** — quem usa eles agora são o `FilterBar` e a `NotificationList`.

```jsx
import { useState } from "react";
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
  const [notificacoes, setNotificacoes] = useState(notificacoesIniciais);

  const notificacoesVisiveis = notificacoes.filter((n) => {
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

      <NovaNotificacaoForm onAdicionar={adicionarNotificacao} />
      <FilterBar filtroAtual={filtro} onFiltroChange={setFiltro} />
      <NotificationList notificacoes={notificacoesVisiveis} />
    </div>
  );
}

export default App;
```

Repare onde cada dado mora:

- `filtro` e `notificacoes` são **estado do `App`** — é ele o pai comum.
- `notificacoesVisiveis` é **derivado** — calculado, não guardado.
- `adicionarNotificacao` é uma função do `App` que desce para o formulário.
- `setFiltro` desce (dentro de `onFiltroChange`) para o `FilterBar`.

### Passo 6 — Testar

1. Clique nos chips → a lista deve **filtrar** (não só mudar de cor).
2. Preencha o formulário e envie → a notificação nova aparece **no topo** da lista, sem recarregar a página.
3. Filtre por "E-mail" com uma notificação PUSH nova → ela deve sumir da vista e voltar ao clicar em "Todas".
4. Apague todo o conteúdo e filtre por um canal sem notificações → deve aparecer "Nenhuma notificação por aqui."

### Passo 7 — Commit, push e Pull Request

```bash
git add .
git commit -m "extrai FilterBar e NotificationList, adiciona formulário controlado"
git push origin seu-nome-08-09
```

Grupo escolhe uma branch, abre PR, revisa, faz merge. Todos rodam `git checkout main && git pull`.

---

## Erros comuns de hoje

| Sintoma | Causa provável |
| --- | --- |
| Cliquei no chip, a cor muda, mas a lista não filtra | Você passou `notificacoes` para a `NotificationList` em vez de `notificacoesVisiveis`. |
| Filtro por "Push"/"E-mail" nunca mostra nada | Comparação `n.canal === filtro` com maiúsculas diferentes (`"PUSH"` vs `"push"`). |
| `FilterChip is not defined` dentro do `FilterBar` | Faltou `import FilterChip from "./FilterChip";` no `FilterBar.jsx`. |
| `App` diz que `FilterBar` é `undefined` | Faltou `export default FilterBar;` no fim do arquivo. |
| Enviei o formulário e a página recarregou | Faltou `e.preventDefault()` no `handleSubmit`. |
| Adicionei uma notificação e a lista não mudou | Você mutou o array (`notificacoes.push(...)`) em vez de criar um novo (`[nova, ...atual]`). |
| O campo de texto não deixa digitar nada | `value={titulo}` sem o `onChange` correspondente — o campo fica travado no valor do estado. |
| `key` warning no console | Faltou `key={n.id}` no `.map` da `NotificationList`. |

---

## Checklist de encerramento

- [ ] `NotificationList` extraído, com o estado vazio tratado (`length === 0`)
- [ ] `FilterBar` extraído, com o estado do filtro permanecendo no `App`
- [ ] Filtro realmente aplicado: clicar no chip muda a lista na tela
- [ ] Formulário controlado adicionando notificações **sem mutar** o array
- [ ] Testado: nova notificação aparece no topo, sem recarregar a página
- [ ] Pull Request revisado e mergeado
- [ ] Todos atualizaram a `main` local antes de sair

---

## Para pensar até o próximo encontro

Hoje toda notificação nasceu de vocês, digitada no formulário, e a lista inicial ainda é um array escrito à mão no código. No próximo encontro esse array some: a lista inteira vai vir de fora, da API de verdade, com `fetch`. E aí aparecem perguntas novas — e enquanto os dados não chegam? E se a internet falhar?
