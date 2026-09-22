# Encontro 6 — React na Web: Vite, JSX, Componentes e Tailwind

**PEND — Programação Front-End** · 01/09/2026

---

## O que você vai conseguir fazer ao fim de hoje

- Explicar, com suas palavras, o que é o React e por que ele existe.
- Criar um projeto React do zero com o Vite e colocá-lo para rodar no navegador.
- Escrever **JSX** sem errar as regras básicas (um elemento raiz, `className`, chaves para JavaScript).
- Construir um **componente** que recebe dados de fora por **props**.
- Aplicar estilo com **Tailwind** e registrar as cores do design system do grupo.
- Montar a primeira tela do projeto: três componentes reais (botão, cartão de notificação, chip de filtro) juntos em uma página.

> **Se você já usou React Native em PPDM:** muita coisa aqui vai soar familiar — JSX, componentes, props. O que muda é o **destino**: em vez de desenhar telas de celular, o React vai gerar HTML para o navegador. Sempre que um conceito tiver um paralelo direto com o RN, ele aparece num box como este. Mas o texto principal parte do zero — não depende de você lembrar do RN.

---

## Parte 1 — O que é React (e por que não é "só JavaScript")

### O problema que o React resolve

Sem uma ferramenta como o React, atualizar uma página é trabalhoso: você pega um elemento pelo `id`, muda o texto na mão, lembra de atualizar também aquele outro pedaço que dependia desse dado, e assim por diante. Quando a tela cresce, é fácil esquecer um pedaço e a interface fica **inconsistente** — mostrando dados velhos em um canto e novos em outro.

O React inverte isso. Você descreve **como a tela deve ser para um determinado estado dos dados**, e ele se encarrega de mexer no HTML para chegar lá. Você mudou os dados? O React recalcula o que precisa mudar na tela. Você para de dar instruções passo a passo ("apague isso, escreva aquilo") e passa a **declarar o resultado**.

### Biblioteca ou framework?

Você vai ouvir os dois termos. A diferença prática:

- **Biblioteca**: o seu código chama o código dela quando precisa. Você está no comando.
- **Framework**: o código dele chama o seu. Você escreve as peças (componentes) e ele decide quando executá-las.

Tecnicamente, o React é uma **biblioteca**. Mas no dia a dia ele ocupa o papel de framework — você escreve componentes e o React decide quando renderizar cada um. Neste curso vamos tratar os dois termos como sinônimos, porque é assim que o mercado e o material formativo tratam.

### Componente: a peça de montar

Um **componente** é uma função JavaScript que devolve um pedaço de tela. Esse é o tijolo do React. Uma aplicação inteira é uma **árvore de componentes**: um componente `App` que contém um `Cabecalho`, uma `ListaDeNotificacoes` que contém vários `CartaoDeNotificacao`, e assim por diante.

A vantagem de quebrar a tela em componentes:

- **Reuso** — o mesmo `Botao` aparece em dez lugares, escrito uma vez só.
- **Isolamento** — se o `CartaoDeNotificacao` tem um bug, você sabe onde procurar.
- **Leitura** — o `App` fica curto e legível, porque os detalhes estão dentro das peças menores.

---

## Parte 2 — Preparando o projeto

Até agora cada grupo só tinha o repositório de **backend** (o que vocês constroem desde o 3º semestre). Hoje nasce o repositório de **front-end**, separado — outro repositório, outro `package.json`, outra pasta.

### Passo 2.1 — Criar o repositório no GitHub

Um integrante do grupo:

1. Cria um repositório **vazio** no GitHub com o nome `<nome-do-grupo>-frontend`.
2. Adiciona os colegas como colaboradores (Settings → Collaborators).

### Passo 2.2 — Clonar via SSH

Todos clonam. Use **SSH** (a chave foi configurada no encontro 5):

```bash
git clone git@github.com:<usuario>/<nome-do-grupo>-frontend.git
cd <nome-do-grupo>-frontend
```

> Ainda sem a chave SSH configurada? Volte à Parte 2 do `01-guia-branches-pull-requests.md` antes de continuar.

### Passo 2.3 — Criar o projeto Vite dentro da pasta clonada

O **Vite** é a ferramenta que monta o projeto, roda o servidor de desenvolvimento e empacota a versão final. Rode, **dentro da pasta que você acabou de clonar**:

```bash
npm create vite@latest . -- --template react
npm install
npm run dev
```

- O `.` no comando quer dizer "crie o projeto aqui mesmo, nesta pasta", em vez de criar uma subpasta.
- `npm install` baixa as dependências para a pasta `node_modules/`.
- `npm run dev` sobe o servidor local. Ele vai imprimir um endereço tipo `http://localhost:5173` — abra no navegador.

Deixe o `npm run dev` rodando o tempo todo. Cada vez que você salvar um arquivo, a página recarrega sozinha (isso se chama *hot reload*).

### Passo 2.4 — Primeiro commit (só este, direto na `main`)

O scaffold ainda não é código de ninguém em especial, então vai direto na `main` desta vez:

```bash
git add .
git commit -m "scaffold inicial do projeto Vite + React"
git push origin main
```

### Passo 2.5 — Daqui pra frente, sempre em branch

A partir de agora **todo commit segue o fluxo de branch/PR** do guia. No começo de cada encontro:

```bash
git checkout main
git pull
git checkout -b seu-nome-01-09
```

Trabalha, commita, dá `push`. No fim do encontro o grupo escolhe uma das branches para virar Pull Request, revisa e faz o merge na `main`.

### O que vem no projeto recém-criado

Vale abrir e olhar:

| Arquivo | Para que serve |
| --- | --- |
| `index.html` | A única página HTML de verdade. Tem uma `<div id="root">` vazia — o React preenche ela. |
| `src/main.jsx` | O ponto de entrada. Pega a `div#root` e manda o React renderizar o `<App />` dentro dela. |
| `src/App.jsx` | O componente raiz. É aqui que você vai trabalhar hoje. |
| `src/index.css` | Estilos globais. Vamos trocar o conteúdo por uma linha de Tailwind. |
| `package.json` | Lista de dependências e scripts (`dev`, `build`, `lint`, `preview`). |
| `vite.config.js` | Configuração do Vite (plugins). |

---

## Parte 3 — JSX

### O que é

**JSX** é uma sintaxe que deixa você escrever "HTML" no meio do JavaScript. Não é HTML de verdade e não é string — é uma forma curta de descrever elementos de tela. O Vite converte isso em chamadas de função antes de mandar para o navegador.

```jsx
const elemento = <h1 className="titulo">Central de Notificações</h1>;
```

### As regras que mais pegam gente no começo

**1. Um retorno = um elemento raiz.** Um componente só pode devolver **um** elemento no topo. Se você precisa de dois elementos lado a lado, envolva num elemento pai (uma `<div>`, ou um fragmento vazio `<>...</>`).

```jsx
// ERRADO — dois elementos irmãos no topo
return (
  <h1>Título</h1>
  <p>Parágrafo</p>
);

// CERTO — um pai só
return (
  <div>
    <h1>Título</h1>
    <p>Parágrafo</p>
  </div>
);
```

**2. É `className`, não `class`.** `class` é palavra reservada do JavaScript, então o JSX usa `className` para o atributo de classe CSS.

```jsx
<div className="max-w-2xl mx-auto p-4">
```

**3. Chaves `{ }` abrem uma janela para o JavaScript.** Tudo dentro das chaves é uma **expressão** JavaScript avaliada na hora.

```jsx
const nome = "Ana";
return <p>Olá, {nome}</p>;          // Olá, Ana
return <p>Total: {2 + 3}</p>;        // Total: 5
return <p>{usuario.logado ? "Sair" : "Entrar"}</p>;
```

Repare: **expressão**, não comando. Cabe `2 + 3`, `nome`, `lista.map(...)`, um ternário. **Não** cabe um `if` solto nem um `for` — para isso você resolve **antes** do `return` e usa só o resultado dentro das chaves.

**4. Toda tag precisa fechar.** Inclusive as que em HTML podiam ficar abertas: `<img />`, `<input />`, `<br />`.

> **Vindo do React Native:** as regras são idênticas às de lá. O que muda é o vocabulário de tags. Uma tabela de tradução rápida:
>
> | React Native | React (web) |
> | --- | --- |
> | `<View>` | `<div>` |
> | `<Text>` | `<p>`, `<span>`, `<h1>`… |
> | `<TouchableOpacity onPress={}>` | `<button onClick={}>` |
> | `<Image source={}>` | `<img src={} />` |
> | `StyleSheet.create({...})` | classes CSS (hoje: Tailwind) |

---

## Parte 4 — Componentes e props

### Criando o componente mais simples possível

Um componente é uma função que:

1. Tem nome com **letra maiúscula** (o React usa isso para diferenciar de uma tag HTML comum).
2. Devolve JSX.
3. É **exportada** para outros arquivos poderem usá-la.

```jsx
// src/components/Saudacao.jsx
function Saudacao() {
  return <p>Bem-vindo à Central de Notificações</p>;
}

export default Saudacao;
```

E em outro arquivo:

```jsx
// src/App.jsx
import Saudacao from "./components/Saudacao";

function App() {
  return (
    <div>
      <Saudacao />
    </div>
  );
}
```

### `import` e `export`: a dupla que precisa combinar

Isso vai te acompanhar o curso inteiro, então vale fixar agora:

- No arquivo que **cria** o componente: `export default NomeDoComponente;` no fim.
- No arquivo que **usa** o componente: `import NomeDoComponente from "./caminho/do/arquivo";` no topo.
- O `./` no caminho quer dizer "a partir da pasta deste arquivo". Sem `./`, o import procura em `node_modules/`.
- A extensão `.jsx` pode ser omitida no import.

Se você usar `<Saudacao />` sem o `import`, o erro é `Saudacao is not defined`. Se esquecer o `export default`, o import traz `undefined` e o React reclama que o componente é inválido.

### Props: passando dados para dentro do componente

Do jeito acima, `Saudacao` sempre mostra o mesmo texto. Para reaproveitar o componente com conteúdos diferentes, ele precisa **receber dados de fora**. Esses dados chegam como **props** — um único objeto que o React entrega como primeiro argumento da função.

```jsx
function Saudacao(props) {
  return <p>Bem-vindo, {props.nome}</p>;
}

// uso:
<Saudacao nome="Ana" />
<Saudacao nome="Bruno" />
```

Cada atributo que você escreve na tag (`nome="Ana"`) vira uma chave nesse objeto `props`.

### Desestruturação: o atalho que todo mundo usa

Em vez de escrever `props.nome`, `props.canal`, `props.hora` toda hora, você "abre" o objeto direto na assinatura da função:

```jsx
function Saudacao({ nome }) {
  return <p>Bem-vindo, {nome}</p>;
}
```

`{ nome }` nos parâmetros significa "me dê a chave `nome` de dentro do objeto de props". É exatamente o mesmo objeto — só uma forma mais curta de ler. **É assim que vamos escrever daqui pra frente.**

### Valor padrão

Se uma prop pode não vir, dá para definir um padrão na própria desestruturação:

```jsx
function Botao({ variant = "primario" }) {
  // se ninguém passar variant, vale "primario"
}
```

> **Vindo do React Native:** props funcionam igual. A diferença é só que os atributos aceitos mudam (não existe `onPress`, existe `onClick`; não existe `style={{}}` com objeto do StyleSheet como padrão, usamos `className`).

> Passar **outro componente** como conteúdo (o `children`) também é possível e muito útil — mas isso é assunto do próximo encontro. Hoje as props são só dados simples: texto, número, booleano, função.

---

## Parte 5 — Estado: o mínimo para hoje

Uma variável comum dentro de um componente **não** faz a tela reagir. Se você escreve `let filtro = "todas"` e depois muda para `"push"` num clique, o valor até muda na memória, mas o React não fica sabendo e a tela não atualiza.

Para um dado que **muda com o tempo e precisa redesenhar a tela**, o React oferece o `useState`:

```jsx
import { useState } from "react";

function App() {
  const [filtro, setFiltro] = useState("todas");
  // filtro       -> o valor atual ("todas" na primeira renderização)
  // setFiltro    -> a função que troca o valor E manda o React redesenhar
  // "todas"      -> valor inicial
}
```

Regra de ouro: **nunca** faça `filtro = "push"` na mão. Sempre `setFiltro("push")`. É a chamada da função `set...` que avisa o React "esse dado mudou, redesenhe quem depende dele".

Hoje usamos `useState` só para o filtro selecionado. No próximo encontro ele volta com mais profundidade (lista de dados, formulários).

> **Vindo do React Native:** é o mesmo hook, mesma sintaxe. Nada novo aqui — só um uso pequeno.

---

## Parte 6 — Tailwind (v4)

### O modelo mental

Se você está acostumado a escrever um arquivo `.css` separado com regras e seletores, o Tailwind propõe outra coisa: **classes utilitárias**. Cada classe faz **uma** coisa pequena, e você compõe o visual empilhando classes direto no elemento.

```jsx
<div className="max-w-2xl mx-auto p-4">
```

- `max-w-2xl` — largura máxima
- `mx-auto` — centraliza horizontalmente
- `p-4` — padding de todos os lados

Parece verboso no começo, mas evita ficar inventando nome de classe e pulando entre arquivos. O estilo mora junto do elemento.

### Instalando

```bash
npm install tailwindcss @tailwindcss/vite
```

Na v4 **não precisa** de PostCSS nem Autoprefixer separados — já vêm inclusos.

Em `vite.config.js`, adicione o plugin:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

Em `src/index.css`, apague tudo e deixe só:

```css
@import "tailwindcss";
```

Teste: ponha `className="text-3xl font-bold"` em qualquer elemento e veja se o texto muda. Se mudou, o Tailwind está ativo.

### As cores do design system do grupo

As cores que vocês definiram no Figma entram no CSS, dentro de um bloco `@theme`. Na v4 **não existe mais `tailwind.config.js`** para isso:

```css
@import "tailwindcss";

@theme {
  --color-marca: #0f4d46;    /* troquem pela cor primária de vocês */
  --color-destaque: #ff4a26; /* troquem pela cor de destaque de vocês */
}
```

Cada `--color-xxx` que você declara vira automaticamente um conjunto de classes: `bg-marca`, `text-marca`, `border-marca`, etc.

**Regra do projeto:** para qualquer elemento que já tem identidade no design system de vocês, usem as cores nomeadas (`bg-marca`, `text-destaque`) — **nunca** as cores genéricas do Tailwind (`bg-blue-500`). As genéricas servem só para cinzas neutros de apoio.

> Se você achar um tutorial mostrando `tailwind.config.js` com `theme.extend.colors`, é conteúdo da v3. O conceito é o mesmo, o arquivo mudou de lugar (agora é o bloco `@theme` no CSS).

---

## Parte 7 — Situação-problema: componentizar o design system

Vocês desenharam três componentes no Figma: **botão**, **cartão de notificação** e **chip de filtro**. Hoje eles viram componentes React de verdade, cada um recebendo dados por prop.

> Os valores de cor, espaçamento e texto abaixo são **exemplo**. Ajustem para o sistema de vocês. O que **não** muda: três componentes, cada um recebendo dados por **prop**, nenhum com dado fixo escrito por dentro.

### Passo 0 — Preparar a branch

```bash
git checkout main && git pull
git checkout -b seu-nome-01-09
```

Crie a pasta `src/components/`.

### Passo 1 — `Button.jsx`

```jsx
// src/components/Button.jsx
function Button({ children, variant = "primario", onClick }) {
  const estilos = {
    primario: "bg-marca text-white",
    destaque: "bg-destaque text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold ${estilos[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;
```

Lendo o componente por partes:

- **`children`** — o texto (ou o que estiver) entre `<Button>` e `</Button>`. É uma prop com nome especial; hoje ela chega pronta, no próximo encontro a gente destrincha.
- **`variant = "primario"`** — qual visual usar. Sem valor passado, cai no `"primario"`.
- **`onClick`** — a função a chamar quando clicarem. Chega de fora; o `Button` não decide o que acontece, só repassa o evento.
- **`estilos`** — um objeto que mapeia cada variante para as classes daquela variante. `estilos[variant]` pega a linha certa.
- **A crase `` ` ``** no `className` é um *template string*: mistura texto fixo (`px-4 py-2...`) com o valor variável (`${estilos[variant]}`).

### Passo 2 — `NotificationCard.jsx`

```jsx
// src/components/NotificationCard.jsx
function NotificationCard({ canal, hora, titulo, texto, lida }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
      <div className="flex gap-2 text-xs font-mono text-gray-500 mb-2">
        <span className="bg-teal-50 text-marca px-2 py-0.5 rounded">
          {canal}
        </span>
        <span>{hora}</span>
        {!lida && <span>não lida</span>}
      </div>
      <h3 className="font-semibold text-base mb-1">{titulo}</h3>
      <p className="text-gray-600 text-sm">{texto}</p>
    </div>
  );
}

export default NotificationCard;
```

Pontos de atenção:

- Cinco props de **dados**: `canal`, `hora`, `titulo`, `texto`, `lida`. Nenhum texto fixo — tudo vem de fora.
- **`{!lida && <span>não lida</span>}`** — renderização condicional. Se `lida` for `false`, `!lida` é `true` e o `<span>` aparece. Se for `true`, o React não desenha nada. Esse padrão `condição && <elemento>` é o "if" do JSX.

### Passo 3 — `FilterChip.jsx`

```jsx
// src/components/FilterChip.jsx
function FilterChip({ label, ativo, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm border ${
        ativo
          ? "bg-marca text-white border-marca"
          : "bg-white text-gray-500 border-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

export default FilterChip;
```

- **`label`** — o texto do chip ("Todas", "Push", "E-mail").
- **`ativo`** — booleano: este chip é o filtro selecionado no momento?
- O ternário dentro do `className` troca as classes conforme `ativo`. Chip selecionado fica com fundo da cor da marca; os outros ficam apagados.

> Repare no que esse componente faz pela usabilidade: a cor do chip selecionado muda, então dá para **ver** qual filtro está ativo sem precisar lembrar. Isso é a heurística "reconhecimento em vez de memorização" do encontro 4, aplicada em código.

### Passo 4 — Juntar tudo em `App.jsx`

```jsx
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

export default App;
```

Três coisas novas nesse arquivo:

- **`notificacoesExemplo`** é uma lista fixa que **nós** escrevemos, fora do componente. Hoje os dados são inventados. No encontro 8 eles vêm da API.
- **`.map()`** transforma cada item da lista em um `<NotificationCard>`. É como se repete elemento no JSX.
- **`key={n.id}`** — o React exige uma chave única por item de lista, para saber quem é quem quando a lista muda. Use sempre o `id`.
- **`{...n}`** — espalha todas as chaves do objeto `n` como props. `{...n}` equivale a escrever `canal={n.canal} hora={n.hora} titulo={n.titulo} ...`.
- **`ativo={filtro === "todas"}`** — a comparação devolve `true`/`false`, e é isso que vai para a prop `ativo` do chip.
- **`onClick={() => setFiltro("push")}`** — uma função anônima que, ao ser chamada, troca o estado. Note o `() =>`: sem ele, `setFiltro("push")` rodaria na hora da renderização, não no clique.

### Passo 5 — Rodar e conferir

Com `npm run dev` rodando, abra o navegador. Você deve ver: o título, três chips, dois cartões e um botão. Clique nos chips e confirme que **só a cor muda** — filtrar a lista de verdade é assunto do próximo encontro.

### Passo 6 — Commit, push e Pull Request

```bash
git add .
git commit -m "componentiza design system: Button, NotificationCard, FilterChip"
git push origin seu-nome-01-09
```

Nos últimos 20 minutos: o grupo compara as versões de cada um, escolhe **uma** para virar Pull Request, revisa junto e faz o merge na `main`. Depois **todos** rodam `git checkout main && git pull` antes de sair.

---

## Erros comuns de hoje

| Sintoma | Causa provável |
| --- | --- |
| `X is not defined` no console | Faltou o `import` do componente `X` no arquivo que usa ele. |
| React diz que o componente é `undefined` / tipo inválido | Faltou `export default` no arquivo do componente, ou o caminho do `import` está errado. |
| `Adjacent JSX elements must be wrapped...` | Dois elementos irmãos no topo do `return` sem um pai. Envolva numa `<div>` ou `<>...</>`. |
| A classe de cor `bg-marca` não faz nada | A cor não foi declarada no bloco `@theme` do `src/index.css`, ou tem erro de digitação (`--color-marca`). |
| O estilo do Tailwind não aplica em nada | Faltou o plugin no `vite.config.js` ou o `@import "tailwindcss";` no `index.css`. Reinicie o `npm run dev`. |
| Cliquei no chip e a tela não mudou nada | Esperado hoje — o clique só troca o estado `filtro`; a lista ainda não usa esse estado. |
| O `onClick` dispara sozinho ao carregar a página | Você passou `onClick={setFiltro("push")}` em vez de `onClick={() => setFiltro("push")}`. |

---

## Checklist de encerramento

- [ ] Repositório de front-end criado e clonado por todos via SSH
- [ ] `npm run dev` rodando sem erro
- [ ] Tailwind ativo e cores do design system aplicadas no bloco `@theme` do `src/index.css`
- [ ] `Button`, `NotificationCard` e `FilterChip` construídos, cada um recebendo dados por prop
- [ ] `App.jsx` monta os três componentes e a lista de exemplo com `.map`
- [ ] Chip de filtro clicável mudando de estado (a cor troca ao clicar)
- [ ] Pull Request revisado e mergeado na `main`
- [ ] Todos atualizaram a `main` local antes de sair

---

## Para pensar até o próximo encontro

Hoje os componentes mostraram dados que **nós** escrevemos na lista `notificacoesExemplo`, e clicar num chip só mudou a cor dele. No próximo encontro a tela ganha vida: o que aparece vai depender do que o **usuário** faz — clicar num filtro e a lista realmente filtrar, digitar num formulário e uma notificação nova aparecer — tudo sem recarregar a página.
