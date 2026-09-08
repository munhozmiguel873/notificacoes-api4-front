# Encontro 6 — React: Vite, JSX, Componentes e Tailwind

**PEND — Programação Front-End** · 01/09/2026

---

## Hoje é tradução, não novidade

Vocês já usam React todos os dias em PPDM — JSX, componentes, props, `useState` não são conceitos novos. O que muda hoje é o **destino**: em vez de renderizar componentes nativos do celular, o React vai renderizar HTML no navegador. É a mesma língua, sotaque diferente.

---

## Parte 1 — Biblioteca x Framework

**Biblioteca**: vocês chamam o código dela quando precisam.
**Framework**: ele chama o código de vocês — vocês escrevem componentes, ele decide quando renderizar.

React é, tecnicamente, uma biblioteca. Mas no dia a dia do mercado ocupa o papel de framework, e é assim que o conteúdo formativo trata os dois termos: como sinônimos neste contexto.

---

## Parte 2 — Criando o repositório de front-end

Até hoje, cada grupo só tinha o repositório de **backend** — o que constroem desde o 3º semestre. Agora nasce o repositório de **front-end**, separado.

### Passo a passo

1. Um integrante cria o repositório vazio no GitHub: `<nome-do-grupo>-frontend`.
2. Adiciona os colegas como colaboradores.
3. Todo mundo clona usando **SSH** (a chave já foi configurada no encontro 5):

```bash
git clone git@github.com:<usuario>/<nome-do-grupo>-frontend.git
cd <nome-do-grupo>-frontend
```

> Sem a chave configurada ainda? Voltem à Parte 2 do `01-guia-branches-pull-requests.md`.

4. Criar o projeto Vite **dentro** da pasta já clonada:

```bash
npm create vite@latest . -- --template react
npm install
npm run dev
```

5. Primeiro commit — direto na `main`, só desta vez (é o scaffold, ainda não é código de ninguém em especial):

```bash
git add .
git commit -m "scaffold inicial do projeto Vite + React"
git push origin main
```

A partir de agora, **todo commit segue o fluxo de branch** do guia — cada um na própria branch do dia.

---

## Parte 3 — JSX: o que muda vindo do React Native

| React Native                       | React (web)                  |
| ---------------------------------- | ---------------------------- |
| `<View>`                           | `<div>`                      |
| `<Text>`                           | `<p>`, `<span>`, `<h1>`...   |
| `<TouchableOpacity onPress={...}>` | `<button onClick={...}>`     |
| `StyleSheet.create({...})`         | classes CSS (hoje: Tailwind) |
| `<Image source={...}>`             | `<img src={...}>`            |

A lógica do JSX é a mesma: chaves para JavaScript dentro do markup, um elemento raiz por retorno, `className` no lugar de `class`. Só o vocabulário de tags muda.

---

## Parte 4 — Configurando o Tailwind (v4)

```bash
npm install tailwindcss @tailwindcss/vite
```

Não precisa de PostCSS nem Autoprefixer separados — a v4 já inclui os dois.

Em `vite.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

Em `src/index.css`, substituir tudo por uma linha:

```css
@import "tailwindcss";
```

Testem aplicando `className="text-3xl font-bold"` em qualquer elemento.

### Suas cores do Figma, no código

Na v4, cores customizadas entram direto no CSS, dentro de um bloco `@theme` — não existe mais `tailwind.config.js` para isso:

```css
@import "tailwindcss";

@theme {
  --color-marca: #0f4d46; /* troquem pelas cores de vocês */
  --color-destaque: #ff4a26;
}
```

A partir de agora, usem `bg-marca`, `text-destaque` etc. — nunca as cores padrão do Tailwind (`bg-blue-500`) para elementos que já têm identidade definida no sistema de vocês.

> Se encontrarem tutorial ou vídeo mostrando `tailwind.config.js` com `theme.extend.colors`, é conteúdo da v3 — o conceito é o mesmo, mas o arquivo mudou de lugar.

---

## Parte 5 — Situação-problema: componentizando o design system

### O que fazer

Transformar os três componentes que vocês desenharam no Figma (botão, cartão de notificação, chip de filtro) em componentes React reais.

### Fluxo de trabalho (branch/PR)

1. Cada um cria a própria branch: `git checkout -b seu-nome-01-09`
2. Trabalha, commita, dá `push`.
3. Nos últimos 20 minutos, o grupo compara as versões e escolhe uma para virar Pull Request.
4. Todo mundo atualiza a `main` local antes de sair.

### `Button.jsx`

```jsx
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

### `NotificationCard.jsx`

```jsx
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

### `FilterChip.jsx`

```jsx
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

> Os valores de cor e espaçamento acima são exemplo — ajustem para o sistema de vocês. O que não muda: três componentes, cada um recebendo dados por **prop**, nenhum com dado fixo escrito direto dentro dele.

### Juntando tudo em `App.jsx`

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

> Reparem: o `FilterChip` já aplica uma heurística do encontro 4 — "reconhecimento em vez de memorização". O estado `ativo` muda a cor do chip, então dá para ver qual filtro está selecionado sem precisar lembrar.

---

## Checklist de encerramento

- [ ] Repositório de front-end criado e clonado por todos via SSH
- [ ] `npm run dev` rodando sem erro
- [ ] Cores do design system aplicadas no `tailwind.config.js`
- [ ] `Button`, `NotificationCard` e `FilterChip` construídos, recebendo dados por prop
- [ ] Filtro clicável mudando de estado em `App.jsx`
- [ ] Pull Request revisado e mergeado na `main`
- [ ] Todos atualizaram a `main` local antes de sair

---

## Para pensar até o próximo encontro

Hoje os componentes mostraram dados que vocês mesmos escreveram na lista `notificacoesExemplo`. Semana que vem, o que muda na tela vai depender do que o **usuário** faz — clicar, digitar — sem recarregar nada.
