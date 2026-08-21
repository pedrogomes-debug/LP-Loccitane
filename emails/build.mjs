/**
 * Gera as peças de e-mail a partir de conteudo.mjs + template.mjs.
 *
 * Saídas em emails/dist:
 *   criativos/    → um arquivo por criativo, com o assunto do seu disparo principal
 *   por-momento/  → os 10 disparos da régua de 14/08 (5 momentos x assunto A/B)
 *   por-disparo/  → os 11 disparos da régua anterior, mantidos para consulta
 *   preview/      → as mesmas peças apontando para as imagens locais + página de aprovação
 *   assuntos.csv  → tabela de códigos, assuntos, títulos e preheaders das duas réguas
 *   Cada .html tem um .txt ao lado, para o ESP montar a parte text/plain do multipart.
 *
 * Uso: node emails/build.mjs
 */
import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { config, criativos, disparos, disparosMomentos } from "./conteudo.mjs";
import * as T from "./template.mjs";

const DIST = "emails/dist";

/** Caminho das imagens nas cópias de preview (emails/dist/preview/<pasta>/arquivo.html). */
const IMAGENS_LOCAIS = "../../../assets";

/** Disparo que representa cada criativo na pasta "criativos". */
const PRINCIPAL = {
  e1: "LOCCITANE_LP_M1_A",
  e2: "LOCCITANE_LP_M2_ABRIU",
  e3: "LOCCITANE_LP_M2_A",
  calculadora: "LOCCITANE_LP_M3_A",
  provaSocial: "LOCCITANE_LP_M4_A",
  overview: "LOCCITANE_LP_M5_A",
  confirmacao: "LOCCITANE_LP_CONFIRMACAO_EMAIL"
};

const TODOS_OS_DISPAROS = [...disparosMomentos, ...disparos];

const paraAtributo = (url) => url.replace(/&(?!amp;)/g, "&amp;");

const comUtm = (url, codigo) => {
  const separador = url.includes("?") ? "&" : "?";
  const { source, medium, campaign } = config.utm;
  return `${url}${separador}utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}&utm_content=${codigo.toLowerCase()}`;
};

/** Troca os marcadores de link usados no conteúdo. */
const trocarLinks = (texto) =>
  texto
    .replace(/__WHATSAPP__/g, paraAtributo(config.urlWhatsapp))
    .replace(/__DESCADASTRO__/g, config.tags.descadastro)
    .replace(/__PREFERENCIAS__/g, config.tags.preferencias);

/** HTML → texto puro legível, preservando os endereços dos links. */
const paraTexto = (html) =>
  String(html)
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "$2 ($1)")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, " ")
    .trim();

const NIVEIS_TEXTO = [
  "Bronze: de R$ 360 a R$ 1.999 — 20% de desconto",
  "Prata: de R$ 2.000 a R$ 5.999 — 25% de desconto",
  "Ouro: de R$ 6.000 a R$ 19.999 — 30% de desconto",
  "Diamante: acima de R$ 20.000 — 35% de desconto"
];

function renderizarBloco(bloco, ctx) {
  switch (bloco.tipo) {
    case "texto":
      return T.paragrafos(bloco.paragrafos.map(trocarLinks));
    case "subtitulo":
      return T.subtitulo(bloco.texto);
    case "pilares":
      return T.pilares(
        bloco.itens.map((item) => ({ titulo: item.titulo, texto: trocarLinks(item.texto) }))
      );
    case "passos":
      return T.passos(bloco.itens);
    case "regua":
      return T.regua();
    case "simulacao":
      return T.simulacao(bloco.itens);
    case "destaque":
      return T.destaque({ titulo: bloco.titulo, texto: trocarLinks(bloco.texto) });
    case "trio":
      return T.trio(
        bloco.itens.map((item) => ({
          src: `${ctx.baseImagens}/${item.arquivo}`,
          alt: item.alt,
          legenda: item.legenda
        }))
      );
    case "depoimento":
      // Só a peça de prova social usa foto; nas outras o depoimento entra sem rosto.
      return T.depoimento({
        ...bloco,
        foto: bloco.foto ? `${ctx.baseImagens}/${bloco.foto}` : undefined
      });
    case "lider":
      return T.lider({ src: `${ctx.baseImagens}/lider.jpg`, texto: trocarLinks(bloco.texto) });
    case "cta":
      return T.botao(bloco.rotulo, paraAtributo(ctx.urlCta));
    case "nota":
      return T.notaFinal(trocarLinks(bloco.texto));
    case "divisor":
      return T.divisor();
    default:
      throw new Error(`Bloco desconhecido: ${bloco.tipo}`);
  }
}

function blocoParaTexto(bloco, ctx) {
  switch (bloco.tipo) {
    case "texto":
      return bloco.paragrafos.map((p) => paraTexto(trocarLinks(p))).join("\n\n");
    case "subtitulo":
      return `${bloco.texto.toUpperCase()}`;
    case "pilares":
      return bloco.itens.map((i) => `- ${paraTexto(i.titulo)}: ${paraTexto(trocarLinks(i.texto))}`).join("\n");
    case "passos":
      return bloco.itens.map((i, n) => `${n + 1}. ${i.titulo}: ${i.texto}`).join("\n");
    case "regua":
      return NIVEIS_TEXTO.map((linha) => `- ${linha}`).join("\n");
    case "simulacao":
      return bloco.itens
        .map(
          (i) =>
            `- Compra de ${i.compra} com ${i.desconto} de desconto: vende por ${i.vende} e lucra ${i.lucro}`
        )
        .join("\n");
    case "destaque":
      return `${bloco.titulo ? `${bloco.titulo.toUpperCase()}\n` : ""}${paraTexto(trocarLinks(bloco.texto))}`;
    case "trio":
      return bloco.itens.map((i) => `- ${i.legenda}`).join("\n");
    case "depoimento":
      return `"${bloco.texto}"\n${bloco.autor}, ${bloco.detalhe}`;
    case "lider":
      return paraTexto(trocarLinks(bloco.texto));
    case "cta":
      return `${bloco.rotulo.toUpperCase()}: ${ctx.urlCta}`;
    case "nota":
      return paraTexto(trocarLinks(bloco.texto));
    case "divisor":
      return "---";
    default:
      return "";
  }
}

function rodapeHtml(tipo) {
  const { remetente, tags, urlWhatsapp, urlInstagram } = config;
  const p = (conteudo, tamanho = 12) =>
    `<p class="t-foot" style="margin:0;padding:0 0 8px 0;mso-line-height-rule:exactly;font-family:${T.FONTE};font-size:${tamanho}px;line-height:18px;color:${T.CORES.suave};">${conteudo}</p>`;
  const link = (href, rotulo) =>
    `<a href="${paraAtributo(href)}" style="color:${T.CORES.suave};text-decoration:underline;">${rotulo}</a>`;

  const motivo =
    tipo === "transacional"
      ? "Você recebeu este e-mail porque concluiu o seu cadastro no Programa de Revendedoras L'Occitane au Brésil."
      : "Você recebeu este e-mail porque demonstrou interesse no Programa de Revendedoras L'Occitane au Brésil.";

  return [
    p(`<strong>${remetente.nome}</strong> — Programa de Revendedoras`, 13),
    p(motivo),
    p(`${remetente.razaoSocial} — CNPJ ${remetente.cnpj} — ${remetente.endereco}`),
    p(
      `Para não perder nossos e-mails, adicione <span style="color:${T.CORES.suave};">${remetente.email}</span> aos seus contatos.`
    ),
    p(
      [
        link(tags.descadastro, "Cancelar inscrição"),
        link(tags.preferencias, "Gerenciar preferências"),
        link(urlWhatsapp, "WhatsApp"),
        link(urlInstagram, "Instagram")
      ].join(" &nbsp;&bull;&nbsp; ")
    )
  ].join("");
}

function rodapeTexto(tipo) {
  const { remetente, tags, urlWhatsapp } = config;
  const motivo =
    tipo === "transacional"
      ? "Você recebeu este e-mail porque concluiu o seu cadastro no Programa de Revendedoras L'Occitane au Brésil."
      : "Você recebeu este e-mail porque demonstrou interesse no Programa de Revendedoras L'Occitane au Brésil.";
  return [
    "---",
    `${remetente.nome} — Programa de Revendedoras`,
    motivo,
    `${remetente.razaoSocial} — CNPJ ${remetente.cnpj} — ${remetente.endereco}`,
    `Cancelar inscrição: ${tags.descadastro}`,
    `Gerenciar preferências: ${tags.preferencias}`,
    `WhatsApp: ${urlWhatsapp}`
  ].join("\n");
}

function montarPeca(disparo, { baseImagens }) {
  const criativo = criativos[disparo.criativo];
  const urlCta = comUtm(criativo.ctaUrl || config.urlLp, disparo.codigo);
  const ctx = { baseImagens, urlCta };

  const blocos = criativo.blocos
    .map((bloco) => renderizarBloco(bloco, ctx))
    .join(T.espaco(22));

  const html = T.montarEmail({
    assunto: disparo.assunto,
    tituloDocumento: `${disparo.titulo} — ${config.remetente.nome}`,
    preheader: disparo.preheader,
    urlEspelho: config.tags.espelho,
    corpo: {
      logo: `${baseImagens}/logo-cabecalho.png`,
      html: [
        T.capa({
          src: `${baseImagens}/${criativo.capa.arquivo}`,
          alt: criativo.capa.alt,
          altura: criativo.capa.altura
        }),
        T.espaco(28),
        T.titulo(disparo.titulo),
        T.espaco(18),
        blocos
      ].join("")
    },
    rodape: rodapeHtml(criativo.tipo)
  });

  const texto = [
    `${disparo.titulo}\n${"=".repeat(Math.min(disparo.titulo.length, 60))}`,
    disparo.preheader,
    ...criativo.blocos.map((bloco) => blocoParaTexto(bloco, ctx)).filter(Boolean),
    rodapeTexto(criativo.tipo)
  ].join("\n\n");

  return { html, texto, criativo, urlCta };
}

/** Checagens que evitam os erros clássicos de entregabilidade e renderização. */
function validar(nome, html, disparo) {
  const alertas = [];
  const bytes = Buffer.byteLength(html, "utf8");

  if (bytes > 102000) alertas.push(`HTML com ${(bytes / 1024).toFixed(0)} KB: o Gmail corta acima de ~102 KB`);
  if (/<script|<form|<iframe|<video|onclick=/i.test(html)) alertas.push("tag/atributo bloqueado por clients de e-mail");
  if (/src="http:\/\//i.test(html) || /href="http:\/\//i.test(html)) alertas.push("link ou imagem em HTTP: usar HTTPS");
  if (/background-image/i.test(html)) alertas.push("background-image não renderiza em Outlook");

  const imagens = html.match(/<img\b[^>]*>/gi) || [];
  const semAlt = imagens.filter((tag) => !/\balt="/.test(tag));
  if (semAlt.length) alertas.push(`${semAlt.length} imagem(ns) sem alt`);

  const semDimensao = imagens.filter((tag) => !/\bwidth="/.test(tag));
  if (semDimensao.length) alertas.push(`${semDimensao.length} imagem(ns) sem width`);

  if (/SEU-DOMINIO/.test(html)) alertas.push("baseImagens ainda é placeholder (trocar pelo CDN)");
  if (disparo.assunto.length > 70) alertas.push(`assunto com ${disparo.assunto.length} caracteres (corta no celular)`);
  if (disparo.preheader.length > 140) alertas.push(`preheader com ${disparo.preheader.length} caracteres`);
  if (!html.includes(config.tags.descadastro)) alertas.push("sem link de descadastro");
  if ((html.match(/ALL CAPS/g) || []).length) alertas.push("texto em caixa alta");

  return { nome, bytes, imagens: imagens.length, alertas };
}

const csv = (valor) => `"${String(valor).replace(/"/g, '""')}"`;

/**
 * Página local que lista os criativos e os disparos das duas réguas com assunto,
 * título e preheader, cada um com link para a peça renderizada com as imagens do
 * disco. É por aqui que a aprovação acontece, sem depender de CDN nem de ESP.
 */
function paginaAprovacao(nomesCriativos) {
  const esc = T.escapar;

  const cartoes = Object.entries(PRINCIPAL)
    .map(([id, codigo]) => {
      const disparo = TODOS_OS_DISPAROS.find((d) => d.codigo === codigo);
      return `      <a class="cartao" href="criativos/${nomesCriativos[id]}.html">
        <img src="../../assets/${criativos[id].capa.arquivo}" alt="" />
        <div class="cartao__corpo">
          <strong>${esc(criativos[id].nome)}</strong>
          <span>${esc(disparo.titulo)}</span>
        </div>
      </a>`;
    })
    .join("\n");

  const tabela = (lista, pasta) =>
    lista
      .map((disparo, indice) => {
        const longo = disparo.assunto.length > 70;
        return `        <tr>
          <td class="num">${indice + 1}</td>
          <td><code>${esc(disparo.codigo)}</code><span class="meta">${esc(disparo.etapa)}<br />${esc(criativos[disparo.criativo].nome)} &middot; ${esc(disparo.momento)}</span></td>
          <td>${esc(disparo.gatilho)}</td>
          <td>
            <span class="rotulo">Assunto</span>${esc(disparo.assunto)}
            <span class="contagem${longo ? " contagem--alerta" : ""}">${disparo.assunto.length} caracteres${longo ? " — corta no celular" : ""}</span>
            <span class="rotulo">Título (H1)</span>${esc(disparo.titulo)}
            <span class="rotulo">Preheader</span>${esc(disparo.preheader)}
          </td>
          <td class="acoes">
            <a class="botao" href="${pasta}/${disparo.arquivo}.html">Abrir peça</a>
            <a href="../${pasta}/${disparo.arquivo}.txt">Versão texto</a>
          </td>
        </tr>`;
      })
      .join("\n");

  const linhas = tabela(disparosMomentos, "por-momento");
  const linhasAnteriores = tabela(disparos, "por-disparo");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Aprovação — E-mails da jornada de revenda</title>
<style>
  :root { --red:#C02031; --ink:#2B1A13; --muted:#6E564A; --line:#E7D8C8; --cream:#FBF1E6; }
  * { box-sizing:border-box; }
  body { margin:0; padding:32px 24px 64px; background:#F7F0E8; color:var(--ink);
    font-family:"Segoe UI",system-ui,-apple-system,sans-serif; line-height:1.55; }
  .wrap { max-width:1080px; margin:0 auto; }
  h1 { font-size:1.9rem; margin:0 0 .3rem; color:var(--red); }
  h2 { font-size:1.15rem; margin:2.5rem 0 .9rem; }
  .intro { color:var(--muted); max-width:70ch; margin:0 0 .4rem; }
  .cartoes { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:14px; }
  .cartao { display:block; background:#fff; border:1px solid var(--line); border-radius:12px;
    overflow:hidden; text-decoration:none; color:inherit; transition:transform .15s, box-shadow .15s; }
  .cartao:hover { transform:translateY(-2px); box-shadow:0 10px 24px rgba(88,40,25,.14); }
  .cartao img { display:block; width:100%; height:110px; object-fit:cover; }
  .cartao__corpo { padding:12px 14px; }
  .cartao__corpo strong { display:block; color:var(--red); }
  .cartao__corpo span { font-size:.88rem; color:var(--muted); }
  table { width:100%; border-collapse:collapse; background:#fff; border:1px solid var(--line);
    border-radius:12px; overflow:hidden; }
  th, td { text-align:left; padding:12px 14px; border-bottom:1px solid var(--line);
    vertical-align:top; font-size:.9rem; }
  th { background:var(--cream); font-size:.78rem; letter-spacing:.06em; text-transform:uppercase;
    color:var(--muted); }
  tr:last-child td { border-bottom:0; }
  .num { color:var(--muted); font-variant-numeric:tabular-nums; }
  code { font-size:.78rem; background:var(--cream); padding:2px 6px; border-radius:5px; }
  .meta { display:block; margin-top:5px; font-size:.78rem; color:var(--muted); }
  .rotulo { display:block; margin-top:9px; font-size:.7rem; letter-spacing:.06em;
    text-transform:uppercase; color:var(--muted); }
  .rotulo:first-child { margin-top:0; }
  .contagem { display:block; font-size:.76rem; color:var(--muted); }
  .contagem--alerta { color:#B4551A; font-weight:600; }
  .acoes { white-space:nowrap; }
  .acoes a { display:block; font-size:.85rem; color:var(--red); }
  .botao { display:inline-block !important; margin-bottom:8px; padding:8px 14px; border-radius:999px;
    background:var(--red); color:#fff !important; text-decoration:none; font-weight:600; }
  .nota { margin-top:2rem; padding:14px 16px; background:#fff; border:1px solid var(--line);
    border-radius:12px; font-size:.86rem; color:var(--muted); }
</style>
</head>
<body>
  <div class="wrap">
    <h1>E-mails da jornada de revenda</h1>
    <p class="intro">Versão local para aprovação: as imagens são carregadas do disco
      (<code>emails/assets</code>) e os links de CTA apontam para a URL configurada em
      <code>emails/conteudo.mjs</code>.</p>
    <p class="intro">A régua de 14/08 tem 5 momentos com dois assuntos cada. O assunto A vai para
      quem abriu o e-mail anterior e o B para quem não abriu — a peça é a mesma nos dois casos.</p>

    <h2>Os ${Object.keys(nomesCriativos).length} criativos</h2>
    <div class="cartoes">
${cartoes}
    </div>

    <h2>Régua de 14/08 — ${disparosMomentos.length} disparos em 5 momentos</h2>
    <table>
      <thead>
        <tr><th>#</th><th>Código do template</th><th>Gatilho</th><th>Textos do disparo</th><th>Peça</th></tr>
      </thead>
      <tbody>
${linhas}
      </tbody>
    </table>

    <h2>Régua anterior — ${disparos.length} disparos (mantida para consulta)</h2>
    <p class="intro">Superada pela régua de 14/08. Fica aqui porque as peças continuam válidas e
      podem ser reaproveitadas: o E2 — Reforço, por exemplo, não tem momento na régua nova.</p>
    <table>
      <thead>
        <tr><th>#</th><th>Código do template</th><th>Gatilho</th><th>Textos do disparo</th><th>Peça</th></tr>
      </thead>
      <tbody>
${linhasAnteriores}
      </tbody>
    </table>

    <p class="nota">Estas cópias servem só para conferência. As peças que vão para o ESP estão em
      <code>dist/criativos</code>, <code>dist/por-momento</code> e <code>dist/por-disparo</code>,
      com as imagens apontando para o CDN — por isso elas aparecem sem imagem se abertas direto no
      navegador. A tabela completa de assuntos das duas réguas está em
      <a href="../assuntos.csv">assuntos.csv</a>.</p>
  </div>
</body>
</html>`;
}

async function main() {
  await rm(DIST, { recursive: true, force: true });
  for (const pasta of [
    "criativos",
    "por-momento",
    "por-disparo",
    "preview/criativos",
    "preview/por-momento",
    "preview/por-disparo"
  ]) {
    await mkdir(path.join(DIST, pasta), { recursive: true });
  }

  const relatorio = [];

  const gerarLista = async (lista, pasta) => {
    for (const disparo of lista) {
      const { html, texto } = montarPeca(disparo, { baseImagens: config.baseImagens });
      const destino = path.join(DIST, pasta, disparo.arquivo);
      await writeFile(`${destino}.html`, html, "utf8");
      await writeFile(`${destino}.txt`, texto, "utf8");
      relatorio.push(validar(`${pasta}/${disparo.arquivo}`, html, disparo));

      const previa = montarPeca(disparo, { baseImagens: IMAGENS_LOCAIS });
      await writeFile(
        path.join(DIST, "preview", pasta, `${disparo.arquivo}.html`),
        previa.html,
        "utf8"
      );
    }
  };

  // 10 disparos da régua de 14/08 e os 11 da régua anterior.
  await gerarLista(disparosMomentos, "por-momento");
  await gerarLista(disparos, "por-disparo");

  // Um arquivo por criativo, com o assunto do disparo principal de cada um.
  const nomesCriativos = {};
  for (const [id, codigo] of Object.entries(PRINCIPAL)) {
    const disparo = TODOS_OS_DISPAROS.find((d) => d.codigo === codigo);
    const nomeArquivo = criativos[id].nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const producao = montarPeca(disparo, { baseImagens: config.baseImagens });
    await writeFile(path.join(DIST, "criativos", `${nomeArquivo}.html`), producao.html, "utf8");
    await writeFile(path.join(DIST, "criativos", `${nomeArquivo}.txt`), producao.texto, "utf8");
    relatorio.push(validar(`criativos/${nomeArquivo}`, producao.html, disparo));

    // Preview local: imagens relativas, para abrir no navegador sem CDN.
    const previa = montarPeca(disparo, { baseImagens: IMAGENS_LOCAIS });
    await writeFile(
      path.join(DIST, "preview", "criativos", `${nomeArquivo}.html`),
      previa.html,
      "utf8"
    );
    nomesCriativos[id] = nomeArquivo;
  }

  await writeFile(path.join(DIST, "preview", "index.html"), paginaAprovacao(nomesCriativos), "utf8");

  // Tabela de assuntos para o time de CRM.
  const linhaCsv = (regua) => (d) => [
    regua,
    d.codigo,
    criativos[d.criativo].nome,
    d.momento,
    d.etapa,
    d.gatilho,
    d.titulo,
    d.assunto,
    d.assunto.length,
    d.preheader
  ];
  const linhas = [
    [
      "Regua",
      "Codigo",
      "Criativo",
      "Momento",
      "Etapa",
      "Gatilho",
      "Titulo (H1)",
      "Assunto",
      "Caracteres do assunto",
      "Preheader"
    ],
    ...disparosMomentos.map(linhaCsv("14/08 - 5 momentos")),
    ...disparos.map(linhaCsv("Anterior"))
  ];
  await writeFile(
    path.join(DIST, "assuntos.csv"),
    "\uFEFF" + linhas.map((linha) => linha.map(csv).join(";")).join("\r\n"),
    "utf8"
  );

  console.log("Peça".padEnd(46), "KB".padStart(6), "Imgs".padStart(6), " Alertas");
  for (const item of relatorio) {
    console.log(
      item.nome.padEnd(46),
      (item.bytes / 1024).toFixed(1).padStart(6),
      String(item.imagens).padStart(6),
      item.alertas.length ? ` ${item.alertas.join("; ")}` : " ok"
    );
  }

  const problemas = relatorio.flatMap((item) =>
    item.alertas.filter((a) => !a.includes("placeholder")).map((a) => `${item.nome}: ${a}`)
  );
  console.log(
    `\n${disparosMomentos.length} disparos da régua de 14/08, ${disparos.length} da régua anterior ` +
      `e ${Object.keys(PRINCIPAL).length} criativos gerados em ${DIST}.`
  );
  console.log(problemas.length ? `Pendências: ${problemas.length}` : "Nenhuma pendência técnica.");

  console.log(`\nPara aprovar, abra ${DIST}/preview/index.html no navegador.`);
  if (config.baseImagens.includes("SEU-DOMINIO")) {
    console.log(
      `As peças de criativos/ e por-disparo/ buscam as imagens em ${config.baseImagens}\n` +
        "e só vão exibi-las depois que você publicar emails/assets/ nesse endereço.\n" +
        "Ajuste config.baseImagens em emails/conteudo.mjs quando tiver a URL definitiva."
    );
  }
}

await main();
