# ARABIA GANG — عصابة أرابيا

Site de apresentação de **oito integrantes**, com identidade árabe premium: mármore escuro,
verde-esmeralda, ouro, arcos e mosaicos geométricos.

Duas seções: **Início** e **Integrantes**. Antes delas, uma **tela de acesso** com dois emblemas
e o botão *Acessar*. Todo o conteúdo — textos, fotos e vídeos — é editável pelo painel e fica
guardado num banco SQLite.

React 18 · Vite 5 · Tailwind 3 · Framer Motion · Lucide · Express · SQLite (`node:sqlite`).

## Como rodar

```bash
npm install
npm run dev
```

Isso sobe os dois processos de uma vez:

| Processo | Endereço | O que é |
| --- | --- | --- |
| `web` | http://localhost:5173 | o site (Vite) |
| `api` | http://localhost:3001 | a API + banco + uploads |

O Vite faz proxy de `/api` e `/uploads` para a API, então o front sempre usa caminhos relativos.

Rodar separado: `npm run web` e `npm run server`. Build de produção: `npm run build`.
Regerar a arte vetorial: `npm run assets`.

**Requisito:** Node 22.5 ou superior — o banco usa o módulo `node:sqlite`, nativo do Node,
sem compilar nada.

## Painel de edição

1. Clique no ícone de chave no canto inferior esquerdo.
2. Senha inicial: **`thamaniya2026`**.
3. O painel aparece na base da tela. Em *Editar conteúdo*, os textos ganham contorno
   tracejado — clique em qualquer um para editar ali mesmo.

O que dá para fazer:

- **Texto** — clique no texto, escreva, `Enter` salva (`Ctrl+Enter` nos campos longos).
- **Imagem** — o botão *Trocar* sobre cada imagem aceita upload de arquivo ou um endereço colado.
- **Logo do cabeçalho** — *Trocar* ao lado da marca, e os botões −/+ ajustam a altura (28–96 px).
- **Vídeo** — no editor do integrante: **post do X**, YouTube, Vimeo ou envio de um MP4 (até 512 MB).
  Cole o link como ele vem (`https://x.com/usuario/status/123…`) — o tipo se ajusta sozinho.
- **Integrantes** — *Editar* em cada card abre o formulário completo: identificação, biografia,
  por onde passou, conquistas, linha do tempo, galeria e redes. Também dá para criar, reordenar
  e remover.
- **Restaurar** — devolve tudo ao conteúdo original de `src/data/`.

### Idiomas

O painel edita **sempre o idioma ativo**. Para escrever a versão em inglês, troque o idioma no
cabeçalho e edite de novo — as outras traduções ficam intactas. O rótulo de cada campo mostra
qual idioma está sendo editado.

### Trocar a senha

Defina `ADMIN_PASSWORD` no ambiente do servidor antes de subir:

```bash
ADMIN_PASSWORD="sua-senha" npm run server          # macOS/Linux
$env:ADMIN_PASSWORD="sua-senha"; npm run server    # PowerShell
```

A senha nunca é guardada em texto puro — o banco só tem o hash (scrypt + salt). A sessão vale
12 horas e usa um token assinado com HMAC.

## Estrutura

```text
server/
├── index.js      rotas da API, uploads e tratamento de erro
├── db.js         esquema SQLite, consultas e a carga inicial
├── auth.js       hash de senha, token de sessão e middleware
├── data/         content.db (criado na primeira execução)
└── uploads/      arquivos enviados pelo painel

src/
├── api/client.js            chamadas à API e guarda do token
├── context/
│   ├── LanguageContext.jsx  PT / EN / AR com RTL
│   └── ContentContext.jsx   conteúdo, sessão e salvamento otimista
├── components/
│   ├── AccessScreen.jsx     porta de entrada com os dois emblemas
│   ├── Header.jsx           cabeçalho fixo (só a logo), transparente → preto ao rolar
│   ├── SandTransition.jsx   cortina de areia entre a porta e o site
│   ├── ScrollProgress.jsx   fio dourado de progresso no topo
│   ├── Hero.jsx             primeira dobra com parallax e números
│   ├── MembersSection.jsx   grade dos oito
│   ├── MemberCard.jsx       card com o retrato ocupando tudo
│   ├── MemberModal.jsx      perfil completo
│   ├── VideoModal.jsx       player post do X / YouTube / Vimeo / MP4
│   ├── ArabicPattern.jsx    padrões, arcos, ornamentos, partículas
│   ├── SmartImage.jsx       lazy loading, fade-in e fallback
│   ├── Footer.jsx, ScrollToTop.jsx, ErrorBoundary.jsx
│   └── admin/
│       ├── AdminBar.jsx     login, modo edição e ações do painel
│       ├── EditableText.jsx edição de texto no lugar
│       ├── MediaField.jsx   upload ou endereço de imagem/vídeo
│       └── MemberEditor.jsx formulário completo do integrante
├── data/{members.js, siteContent.js}   carga inicial do banco
└── translations/{pt,en,ar}.js          textos de interface
```

`src/data/` é **semente**, não fonte da verdade: depois da primeira execução quem manda é o
banco. Para mudar o conteúdo inicial de uma instalação nova, edite esses arquivos e apague
`server/data/content.db`.

## Entrada e transição

A porta de entrada aparece uma vez por sessão do navegador. Ao clicar em *Acessar*, uma cortina
leva a logo atravessando a tela junto com faixas de areia, e o site já monta por baixo — quando
a cortina abre não há espera nem salto de layout. Dura 2,6 s, ou um escurecer curto de 0,4 s
quando o sistema pede menos movimento.

Qual logo atravessa a areia se escolhe na própria tela de acesso, no bloco *Logo da transição*
que aparece no modo edição. Vazio usa a logo principal.

Durante a leitura, um fio dourado no topo acompanha a rolagem da página.

## Vídeos do X

O player embute o post pelo endereço oficial `platform.twitter.com/embed/Tweet.html`, sem carregar
o script de widgets do X. A altura do quadro se ajusta pela mensagem que o próprio embed envia,
então post com muito texto não fica cortado. Abaixo do player há um link para abrir o original.

Posts apagados, de conta protegida ou com resposta restrita não abrem no embed — nesse caso o
player mostra o aviso e o botão de abrir no X.

## Imagens

`public/images/ai/` — retratos e cenários gerados no Higgsfield (modelo soul_2), em WebP de
resolução cheia, 1,8 MB no total. `scripts/fetch-ai-images.mjs` guarda a origem de cada arquivo.

`public/images/` — arte vetorial gerada por `scripts/generate-assets.mjs`: os dois emblemas,
capas de vídeo, galerias e as versões de reserva de retrato e fundo.

Para usar suas próprias fotos, o caminho mais direto é o painel: *Trocar* → enviar arquivo.
O arquivo vai para `server/uploads/` e o endereço é gravado no banco.

## Acessibilidade e desempenho

- Alvos de toque com no mínimo 44 px, foco visível em dourado e navegação completa por teclado.
- Modais com `role="dialog"`, foco preso, fechamento por **Esc**, rolagem da página travada e
  foco devolvido ao elemento de origem.
- Véu escuro sobre os retratos garante contraste do texto em qualquer foto.
- `prefers-reduced-motion` desliga parallax e partículas e revela o texto dos cards sem hover.
- RTL completo no árabe, sem rolagem horizontal em nenhuma largura.
- Imagens em WebP com `loading="lazy"` e fallback quando o arquivo não existe.

## Publicação

Em produção o site e a API rodam **num único processo Node**: o Express serve a pasta `dist/`
junto com `/api` e `/uploads`. Uma porta só, um comando só — que é o formato que os painéis de
hospedagem esperam.

### Antes de subir, aqui na sua máquina

```bash
npm run optimize   # converte imagens para WebP e recomprime vídeos
npm run export     # congela o conteúdo atual como carga inicial
npm run build      # gera a pasta dist/
```

O `export` é o passo que a maioria esquece. O banco (`server/data/`) e os arquivos enviados
(`server/uploads/`) ficam fora do versionamento, então sem ele o site subiria com o conteúdo
de demonstração e as logos quebradas. Ele grava `src/data/snapshot.json` e copia os arquivos
usados para `public/images/uploads/`, que entram no build.

### No painel da hospedagem

| Campo | Valor |
| --- | --- |
| Versão do Node | **24 ou superior** |
| Comando de instalação | `npm install` |
| Comando de build | `npm run build` |
| Comando de start | `npm start` |

Se o painel não tiver campo separado para build, use `npm run deploy` como start — ele constrói
e sobe em seguida.

Variáveis de ambiente (veja `.env.example`):

| Variável | Obrigatória | Para quê |
| --- | --- | --- |
| `ADMIN_PASSWORD` | **sim** | Senha do painel. Sem ela o servidor recusa iniciar em produção. |
| `NODE_ENV` | sim | `production` |
| `PORT` | não | Quase sempre o painel injeta sozinho. |
| `CORS_ORIGIN` | não | Só se o site e a API ficarem em endereços diferentes. |

### Arquivos que precisam ir junto

Além do código: `src/data/snapshot.json` e `public/images/uploads/`. Se você subir por Git,
confira que eles não foram ignorados — `server/data/` e `server/uploads/` são os ignorados,
esses dois não.

### Disco que precisa sobreviver a reinícios

Tudo que for editado pelo painel depois do deploy vive em:

- `server/data/content.db` — textos, integrantes, senha;
- `server/uploads/` — imagens e vídeos enviados.

Se a hospedagem apagar o disco a cada reinício ou novo deploy, essas edições se perdem e o site
volta ao snapshot. Vale confirmar com o suporte se o armazenamento é persistente. Para não
depender disso, rode `npm run export` de novo sempre que quiser fixar o estado atual.

### Verificação rápida depois de subir

```bash
curl https://seu-dominio/api/health
```

Deve responder `{"ok":true,...}`. Se a página abrir mas o conteúdo vier em branco, é sinal de
que o `dist/` não foi construído.

## Conteúdo

Integrantes, conquistas e datas são fictícios. Os oito vídeos apontam para o mesmo post do X,
usado como demonstração — troque pelo post de cada integrante no editor.
