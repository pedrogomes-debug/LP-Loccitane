# Peças de e-mail — Jornada de Revenda L'Occitane au Brésil

A régua vigente é a de **14/08/2026**: 5 momentos (M1 a M5) com **dois assuntos cada**, mais o
e-mail de confirmação. O assunto A vai para quem abriu o e-mail anterior e o B para quem não
abriu — **a peça é a mesma nos dois casos**, só mudam assunto, título (H1) e preheader.

| Criativo | Arquivo | Momento |
| --- | --- | --- |
| E1 — Apresentação | `dist/criativos/e1-apresentacao.html` | M1 — Convite, D+0 |
| E3 — Benefício | `dist/criativos/e3-beneficio.html` | M2 — Benefícios, D+3 |
| E3 — Calculadora | `dist/criativos/e3-calculadora.html` | M3 — Calculadora, D+5 |
| E4 — Prova Social | `dist/criativos/e4-prova-social.html` | M4 — Prova Social, D+7 |
| E5 — Overview do Programa | `dist/criativos/e5-overview-do-programa.html` | M5 — Overview, D+10 |
| Confirmação | `dist/criativos/confirmacao-de-cadastro.html` | Automático, no cadastro na LP |
| E2 — Reforço | `dist/criativos/e2-reforco.html` | Sem momento na régua nova (ver abaixo) |

O corpo dos criativos é neutro de propósito: como cada peça roda com dois assuntos diferentes e as
ondas recomeçam no M1, não existe frase do tipo "como enviamos no e-mail anterior". Quem dá o tom
de cada momento é o assunto e o título.

O **E2 — Reforço** foi feito para a régua anterior e não tem momento na régua de 14/08. A peça
segue pronta e válida, disponível para um teste A/B de conteúdo ou para as próximas ondas.

## Aprovação (local, sem depender de CDN)

Abra **`dist/preview/index.html`** no navegador (`npm run emails:aprovar`). A página lista os
criativos e os disparos das duas réguas com assunto, contagem de caracteres, título e preheader,
com link para cada peça renderizada usando as imagens de `emails/assets`.

Os arquivos de `dist/criativos`, `dist/por-momento` e `dist/por-disparo` são os que vão para o ESP:
as imagens neles apontam para `config.baseImagens`, então aparecem quebradas se abertos direto no
navegador. Isso é esperado — e-mail não aceita imagem relativa.

## Estrutura

```
emails/
  conteudo.mjs           copy dos criativos + disparosMomentos (régua de 14/08) + disparos (anterior)
  template.mjs           HTML base e componentes (tabela, botão VML, régua, simulação, depoimento...)
  build.mjs              gera as peças, o texto puro, o CSV e roda as validações
  preparar-imagens.mjs   gera as imagens de e-mail a partir dos assets da landing
  screenshots.mjs        renderiza as peças em PNG (desktop e celular) para conferência
  assets/                12 imagens já otimizadas, prontas para subir no CDN
  dist/
    criativos/           um arquivo por criativo (.html + .txt)
    por-momento/         os 10 disparos da régua de 14/08 (.html + .txt)
    por-disparo/         os 11 disparos da régua anterior, mantidos para consulta
    preview/
      index.html         página de aprovação: criativos + as duas réguas com seus textos
      criativos/         as peças com imagens locais (+ PNG desktop e celular)
      por-momento/       os 10 disparos com imagens locais (+ PNG desktop)
      por-disparo/       os 11 disparos da régua anterior com imagens locais (+ PNG desktop)
    assuntos.csv         tabela de códigos, assuntos (com contagem de caracteres) e preheaders
```

Para regerar tudo: `npm run emails` (ou `node emails/preparar-imagens.mjs` e `node emails/build.mjs`).
O build imprime peso de cada peça, número de imagens e alertas. `npm run emails:preview` gera os
PNGs de todas as peças e avisa se alguma imagem não carregou.

## Régua de 14/08 — 5 momentos

Intervalos contados a partir do D0. Em cada momento, o assunto A vai para quem abriu o e-mail
anterior e o B para quem não abriu. Quando a régua termina, uma nova onda recomeça no M1 para
quem ainda não se cadastrou.

| # | Código do template | Criativo | Momento | Gatilho |
| --- | --- | --- | --- | --- |
| 1 | `LOCCITANE_LP_M1_A` | E1 — Apresentação | D+0 | Todos os leads da base |
| 2 | `LOCCITANE_LP_M1_B` | E1 — Apresentação | D+0 | Não abriu o E1 (peça E1.1, assunto novo) |
| 3 | `LOCCITANE_LP_M2_A` | E3 — Benefício | D+3 | Abriu o M1 |
| 4 | `LOCCITANE_LP_M2_B` | E3 — Benefício | D+3 | Não abriu o M1 |
| 5 | `LOCCITANE_LP_M3_A` | E3 — Calculadora | D+5 | Abriu o M2 |
| 6 | `LOCCITANE_LP_M3_B` | E3 — Calculadora | D+5 | Não abriu o M2 |
| 7 | `LOCCITANE_LP_M4_A` | E4 — Prova Social | D+7 | Abriu o M3 |
| 8 | `LOCCITANE_LP_M4_B` | E4 — Prova Social | D+7 | Não abriu o M3 |
| 9 | `LOCCITANE_LP_M5_A` | E5 — Overview | D+10 | Abriu o M4 |
| 10 | `LOCCITANE_LP_M5_B` | E5 — Overview | D+10 | Não abriu o M4 (última tentativa da onda) |
| — | `LOCCITANE_LP_CONFIRMACAO_EMAIL` | Confirmação | Automático | Cadastro na LP (o lead sai da régua) |

## Régua anterior (mantida para consulta)

Superada pela régua de 14/08. As peças continuam sendo geradas em `dist/por-disparo` porque os
textos foram aprovados e podem ser reaproveitados.

| # | Código do template | Criativo | Momento | Gatilho |
| --- | --- | --- | --- | --- |
| 1 | `LOCCITANE_LP_M1` | E1 | D+0 | Entrada na jornada |
| 2 | `LOCCITANE_LP_M2_ABRIU` | E2 | D+4 | Abriu o E1 |
| 3 | `LOCCITANE_LP_M2_NAO_ABRIU` | E1 | D+4 | Não abriu o E1 (reenvio com assunto novo) |
| 4 | `LOCCITANE_LP_M3_ABRIU` | E3 | D+7 | Abriu o E2 |
| 5 | `LOCCITANE_LP_M3_NAO_ABRIU` | E3 | D+7 | Abriu o E1 e não abriu o E2 |
| 6 | `LOCCITANE_LP_M2_P2_ABRIU` | E2 | D+7 | Abriu o reenvio |
| 7 | `LOCCITANE_LP_M2_P2_NAO_ABRIU` | E2 | D+7 | Não abriu o reenvio |
| 8 | `LOCCITANE_LP_M3_P2_ABRIU` | E3 | D+10 | Reengajou pelo reenvio |
| 9 | `LOCCITANE_LP_M4_ABRIU` | E3 | D+10 | Abriu o reenvio e ignorou o E2 |
| 10 | `LOCCITANE_LP_M4_NAO_ABRIU` | E3 | D+10 | Última tentativa da jornada |
| 11 | `LOCCITANE_LP_CONFIRMACAO_EMAIL` | Confirmação | Automático | Cadastro na LP (o lead sai da jornada) |

Os assuntos e títulos de cada código estão em `dist/assuntos.csv` e em `conteudo.mjs`.

### Assuntos longos

Três assuntos da régua de 14/08 passam de 70 caracteres e serão cortados no app do Gmail e no
iPhone. A copy foi mantida como aprovada; se quiser testar versões curtas, sugestões:

| Código | Assunto aprovado (nº de caracteres) | Alternativa curta |
| --- | --- | --- |
| `M1_A` | Revenda brasilidade com nosso Programa de Revendedoras L'Occitane au Brésil! (76) | Revenda brasilidade com a L'Occitane au Brésil (46) |
| `M2_A` | Lucre com produtos que as pessoas já amam: revenda L'Occitane au Brésil (71) | Lucre com produtos que as pessoas já amam (41) |
| `CONFIRMACAO_EMAIL` | A L'Occitane au Brésil recebeu suas informações e seu cadastro está confirmado! (79) | Seu cadastro de revendedora está confirmado (43) |

Os assuntos do M3 (Calculadora) e do M4 (Prova Social) foram escritos aqui, porque a régua de
14/08 só indica "Assunto A" e "Assunto B" sem o texto. Precisam de aprovação da marca.

## Antes de subir para o ESP

Tudo o que precisa ser trocado está no topo de `conteudo.mjs`, no objeto `config`:

1. **`baseImagens`** — hoje é `https://SEU-DOMINIO.com.br/email/revenda`. Suba os 12 arquivos de
   `emails/assets/` num host HTTPS público (CDN ou o próprio site) e aponte para lá. Imagem em
   HTTP ou em domínio que exige login não carrega e derruba o engajamento.
2. **`urlLp`** — a URL final da landing page. Hoje aponta para o site de revendedoras.
3. **Merge tags** — `{{URL_DESCADASTRO}}`, `{{URL_PREFERENCIAS}}` e `{{URL_ESPELHO}}` usam sintaxe
   genérica. Ajuste para a do ESP (`%%unsub_center_url%%` no Salesforce, `{{unsubscribe}}` em
   outros). Nenhuma tag pode ficar sem substituição: link quebrado no rodapé é queixa de spam
   quase garantida.
4. **Dados cadastrais** — `razaoSocial`, `cnpj` e `endereco` estão como `[placeholder]`. Endereço
   físico do remetente é exigência legal e critério de pontuação dos filtros.
5. **Remetente** — de preferência um subdomínio dedicado (ex.: `revenda@e.loccitaneaubresil.com.br`),
   para que a reputação do disparo em massa não contamine o domínio principal.
6. Rode `node emails/build.mjs` de novo e confira que não sobrou nenhum alerta.

Cada `.html` tem um `.txt` ao lado. Suba os dois: e-mail sem a parte `text/plain` pontua pior em
filtro antispam e quebra em leitor de tela e smartwatch.

## O que já está aplicado nas peças

Renderização:

- Layout em tabelas com `role="presentation"`, 600px de largura, uma coluna só.
- Estilo inline em tudo o que importa; a tag `<style>` carrega apenas melhoria progressiva
  (media query e dark mode), porque parte dos webmails descarta o `<style>`.
- Botões em VML `roundrect` para Outlook 2007–2019 no Windows, que ignora `border-radius` e
  `padding` em `<a>`; nos outros clients, âncora com padding.
- Condicional MSO com `PixelsPerInch 96` e `AllowPNG`, que corrige o escalonamento de imagem
  em DPI alto no Outlook.
- `mso-line-height-rule:exactly` em todo texto, senão o Outlook aumenta a entrelinha.
- Sem WebP, SVG, `background-image`, JavaScript, formulário, iframe ou vídeo.
- Fonte Arial/Helvetica: webfont não renderiza em Outlook, Gmail app e Yahoo.
- Imagens com `width`, `height`, `alt` descritivo e `display:block`.
- Dark mode: `color-scheme`, `supported-color-schemes` e paleta alternativa via
  `prefers-color-scheme` para Apple Mail e Outlook do macOS.
- Preheader oculto com enchimento invisível, para o client não completar a prévia com o texto
  do rodapé.
- No celular: padding reduzido, H1 menor, botão de largura total e trio de fotos empilhado.
- Peça mais pesada com 29 KB (o E5, que é o overview completo), bem abaixo dos ~102 KB em que o
  Gmail corta a mensagem e mostra o "[Mensagem aparada]".

Conteúdo e reputação:

- Proporção alta de texto real em relação a imagem; nada de peça que é só um banner.
- Sem caixa alta, sem exclamação repetida, sem promessa de ganho garantido, sem encurtador de
  link (encurtador é sinal clássico de spam).
- Um só destino de CTA por peça, repetido no topo e no fim, com o mesmo rótulo descritivo
  ("Quero ser revendedora L'Occitane") em vez de "clique aqui".
- Rodapé com identificação, motivo do recebimento, descadastro, preferências e endereço.
- UTM em todos os links de CTA (`utm_content` = código do template), sem parâmetro sobrando.
- Alt text em todas as imagens: a peça continua compreensível com imagens bloqueadas, que é o
  padrão do Outlook e de boa parte dos usuários.

## Checklist do lado do envio

O HTML resolve a parte de renderização e ajuda no filtro, mas **hard bounce e caixa de spam se
resolvem na infraestrutura e na lista**:

Autenticação e reputação

- SPF, DKIM e DMARC publicados e alinhados no domínio de envio. Sem os três, Gmail e Yahoo
  rejeitam ou mandam para spam remetentes em volume.
- Cabeçalho `List-Unsubscribe` com `mailto:` e `https:`, mais `List-Unsubscribe-Post` para o
  descadastro em um clique (exigência para quem envia mais de 5 mil mensagens por dia ao Gmail).
- Aquecimento do IP/subdomínio novo: comece por poucos milhares e suba aos poucos, priorizando
  quem abriu recentemente.
- Meta de reclamação de spam abaixo de 0,10% e nunca acima de 0,30%.
- Monitorar o Google Postmaster Tools e a taxa de bounce por domínio.

Higiene de lista (evita o hard bounce)

- Validação de e-mail no formulário da LP: sintaxe, domínio com MX válido e bloqueio de
  descartáveis. A LP já valida CPF e formato de e-mail; a checagem de MX é feita no backend.
- Double opt-in ou, no mínimo, confirmação de cadastro (o e-mail de confirmação já cumpre esse
  papel e serve de sinal de endereço válido).
- Remover hard bounce na primeira ocorrência e soft bounce após 3 a 5 tentativas.
- Supressão global compartilhada entre as jornadas, para o lead descadastrado não voltar por
  outra automação.
- Não importar lista comprada ou base antiga sem reengajamento: é a principal fonte de
  spam trap e hard bounce.
- Reengajamento antes de descartar inativos e sunset policy para quem nunca abre.

Antes do go-live

- Teste de renderização em Litmus ou Email on Acid, cobrindo Outlook 2016/2019/365 no Windows,
  Gmail Web e app, Apple Mail, iPhone, Yahoo e Samsung Mail. É o único jeito de validar o VML
  do botão e o dark mode.
- Teste de spam score (Mail Tester ou equivalente) com o remetente real, não com o de teste.
- Envio de amostra para caixas reais (Gmail, Outlook.com, Yahoo, iCloud e um domínio
  corporativo com Microsoft 365).
- Conferir os links com o clique real, já com o encurtador do ESP ativo, e checar se o domínio
  de rastreamento tem certificado válido.
