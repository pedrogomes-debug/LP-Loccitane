/**
 * Gera os disparos da régua de 14/08 no layout V2 (corpo rosa).
 *
 * Os criativos V2 foram ajustados à mão e ficam em emails/modelos-v2. Cada modelo
 * traz os textos do assunto A do seu momento; aqui cada disparo recebe o seu
 * <title>, preheader, H1 e utm_content, e as imagens passam a apontar para o CDN.
 *
 * Saídas:
 *   dist/V2/por-momento/          → 10 disparos + confirmação, prontos para o ESP (.html + .txt)
 *   dist/V2/assuntos.csv          → códigos, assuntos, títulos e preheaders
 *   dist/preview/V2/              → modelos e disparos com imagens locais + página de aprovação
 *
 * Uso: node emails/build-v2.mjs (rodar depois do build.mjs, que apaga a pasta dist).
 */
import { mkdir, readFile, writeFile, rm, copyFile } from "node:fs/promises";
import path from "node:path";
import { config, disparos, disparosMomentos } from "./conteudo.mjs";
import { H1_DUAS_LINHAS, criarMedidor, esc, marcaInteira, paraTexto } from "./v2-comum.mjs";

const MODELOS = "emails/modelos-v2";
const DIST = "emails/dist/V2";
const PREVIEW = "emails/dist/preview/V2";

const ARQUIVO_MODELO = {
  e1: "e1-apresentacao",
  e2: "e2-reforco",
  e3: "e3-beneficio",
  calculadora: "e3-calculadora",
  provaSocial: "e4-prova-social",
  overview: "e5-overview-do-programa",
  confirmacao: "confirmacao-de-cadastro"
};

const NOME_CRIATIVO = {
  e1: "E1 — Apresentação",
  e2: "E2 — Reforço",
  e3: "E3 — Benefício",
  calculadora: "E3 — Calculadora",
  provaSocial: "E4 — Prova Social",
  overview: "E5 — Overview do Programa",
  confirmacao: "Confirmação de cadastro"
};

const CAPA = {
  e1: "hero-apresentacao.jpg",
  e2: "hero-marca.jpg",
  e3: "hero-beneficio.jpg",
  calculadora: "hero-calculadora.jpg",
  provaSocial: "hero-prova-social.jpg",
  overview: "hero-overview.jpg",
  confirmacao: "hero-confirmacao.jpg"
};

const confirmacao = disparos.find((d) => d.codigo === "LOCCITANE_LP_CONFIRMACAO_EMAIL");
const REGUA = [...disparosMomentos, confirmacao];

const IMAGENS_MODELO = "../../../assets/";
const IMAGENS_PREVIEW = "../../../../assets/";

const RE_TITLE = /<title>[\s\S]*?<\/title>/;
const RE_PREHEADER = /(<div style="display:none;[^>]*>)([\s\S]*?)(&#847;)/;
const RE_H1 = /(<h1\b[^>]*?font-size:)(\d+)px;line-height:(\d+)px;([^>]*>)([\s\S]*?)(<\/h1>)/;
const RE_UTM = /utm_content=[a-z0-9_]+/g;

async function corpoDoTitulo(medidor, tituloHtml, modelo) {
  if (medidor) return medidor.corpo(tituloHtml);
  return modelo.tituloOriginal.length >= tituloHtml.length
    ? { tamanho: modelo.tamanho, entrelinha: modelo.entrelinha }
    : H1_DUAS_LINHAS;
}

function validar(nome, html, disparo) {
  const alertas = [];
  const bytes = Buffer.byteLength(html, "utf8");
  if (bytes > 102000) alertas.push(`HTML com ${(bytes / 1024).toFixed(0)} KB: o Gmail corta acima de ~102 KB`);
  if (html.includes(IMAGENS_MODELO)) alertas.push("imagem com caminho relativo");
  if (/src="http:\/\//i.test(html) || /href="http:\/\//i.test(html)) alertas.push("link ou imagem em HTTP");
  const utms = new Set(html.match(RE_UTM));
  if (utms.size !== 1 || !utms.has(`utm_content=${disparo.codigo.toLowerCase()}`)) {
    alertas.push(`utm_content incorreto: ${[...utms].join(", ")}`);
  }
  if (!html.includes(config.tags.descadastro)) alertas.push("sem link de descadastro");
  if (/SEU-DOMINIO/.test(html)) alertas.push("baseImagens ainda é placeholder (trocar pelo CDN)");
  if (disparo.assunto.length > 70) alertas.push(`assunto com ${disparo.assunto.length} caracteres (corta no celular)`);
  return { nome, bytes, alertas };
}

async function lerModelo(id) {
  const html = await readFile(path.join(MODELOS, `${ARQUIVO_MODELO[id]}.html`), "utf8");
  const h1 = html.match(RE_H1);
  if (!h1 || !RE_PREHEADER.test(html) || !RE_TITLE.test(html)) {
    throw new Error(`Modelo ${ARQUIVO_MODELO[id]} fora do padrão esperado (title, preheader ou H1).`);
  }
  return {
    html,
    tamanho: Number(h1[2]),
    entrelinha: Number(h1[3]),
    tituloOriginal: h1[5]
  };
}

async function montarDisparo(disparo, modelo, medidor) {
  const tituloHtml = marcaInteira(esc(disparo.titulo));
  const corpo =
    tituloHtml === modelo.tituloOriginal
      ? { tamanho: modelo.tamanho, entrelinha: modelo.entrelinha }
      : await corpoDoTitulo(medidor, tituloHtml, modelo);

  const base = modelo.html
    .replace(RE_TITLE, `<title>${esc(disparo.titulo)} — ${esc(config.remetente.nome)}</title>`)
    .replace(RE_PREHEADER, (_, abre, __, fecha) => `${abre}${esc(disparo.preheader)}${fecha}`)
    .replace(
      RE_H1,
      (_, abre, __, ___, meio, ____, fecha) =>
        `${abre}${corpo.tamanho}px;line-height:${corpo.entrelinha}px;${meio}${tituloHtml}${fecha}`
    )
    .replace(RE_UTM, `utm_content=${disparo.codigo.toLowerCase()}`);

  return {
    producao: base.replaceAll(IMAGENS_MODELO, `${config.baseImagens}/`),
    previa: base.replaceAll(IMAGENS_MODELO, IMAGENS_PREVIEW),
    corpo
  };
}

const csv = (valor) => `"${String(valor).replace(/"/g, '""')}"`;
const escPagina = (texto) => esc(String(texto)).replace(/"/g, "&quot;");

function paginaAprovacao(itens) {
  const cartoes = Object.entries(ARQUIVO_MODELO)
    .map(
      ([id, arquivo]) => `      <a class="cartao" href="${arquivo}.html">
        <img src="../../../assets/${CAPA[id]}" alt="" />
        <div class="cartao__corpo">
          <strong>${escPagina(NOME_CRIATIVO[id])}</strong>
          <span>${id === "e2" ? "Sem momento na régua de 14/08" : "Modelo da peça"}</span>
        </div>
      </a>`
    )
    .join("\n");

  const linhas = itens
    .map(({ disparo, corpo }, indice) => {
      const longo = disparo.assunto.length > 70;
      return `        <tr>
          <td class="num">${indice < disparosMomentos.length ? indice + 1 : "—"}</td>
          <td><code>${escPagina(disparo.codigo)}</code><span class="meta">${escPagina(disparo.etapa)}<br />${escPagina(NOME_CRIATIVO[disparo.criativo])} &middot; ${escPagina(disparo.momento)}</span></td>
          <td>${escPagina(disparo.gatilho)}</td>
          <td>
            <span class="rotulo">Assunto</span>${escPagina(disparo.assunto)}
            <span class="contagem${longo ? " contagem--alerta" : ""}">${disparo.assunto.length} caracteres${longo ? " — corta no celular" : ""}</span>
            <span class="rotulo">Título (H1)</span>${escPagina(disparo.titulo)}
            <span class="contagem">${corpo.tamanho}px${corpo === H1_DUAS_LINHAS ? ", em duas linhas" : ""}</span>
            <span class="rotulo">Preheader</span>${escPagina(disparo.preheader)}
          </td>
          <td class="acoes">
            <a class="botao" href="por-momento/${disparo.arquivo}.html">Abrir peça</a>
            <a href="../../V2/por-momento/${disparo.arquivo}.txt">Versão texto</a>
          </td>
        </tr>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Aprovação V2 — E-mails da jornada de revenda</title>
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
  code { font-size:.78rem; background:var(--cream); padding:2px 6px; border-radius:5px; }
  .num { color:var(--muted); font-variant-numeric:tabular-nums; }
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
    <h1>E-mails da jornada de revenda — V2</h1>
    <p class="intro">Todos os disparos da régua de 14/08 no layout V2 (corpo rosa). Cada momento
      tem dois disparos com a mesma peça: o assunto A vai para quem abriu o e-mail anterior e o B
      para quem não abriu. Mudam o assunto, o título (H1), o preheader e o utm_content.</p>

    <h2>Os ${Object.keys(ARQUIVO_MODELO).length} modelos</h2>
    <div class="cartoes">
${cartoes}
    </div>

    <h2>Régua de 14/08 — ${disparosMomentos.length} disparos em 5 momentos + confirmação</h2>
    <table>
      <thead>
        <tr><th>#</th><th>Código do template</th><th>Gatilho</th><th>Textos do disparo</th><th>Peça</th></tr>
      </thead>
      <tbody>
${linhas}
      </tbody>
    </table>

    <p class="nota">Estas cópias usam as imagens locais, só para conferência. As peças que vão
      para o ESP estão em <code>dist/V2/por-momento</code>, com as imagens apontando para
      <code>${escPagina(config.baseImagens)}</code>. A tabela de assuntos está em
      <a href="../../V2/assuntos.csv">dist/V2/assuntos.csv</a>.</p>
  </div>
</body>
</html>`;
}

async function main() {
  await rm(DIST, { recursive: true, force: true });
  await rm(path.join(PREVIEW, "por-momento"), { recursive: true, force: true });
  await mkdir(path.join(DIST, "por-momento"), { recursive: true });
  await mkdir(path.join(PREVIEW, "por-momento"), { recursive: true });

  for (const arquivo of Object.values(ARQUIVO_MODELO)) {
    await copyFile(path.join(MODELOS, `${arquivo}.html`), path.join(PREVIEW, `${arquivo}.html`));
  }

  const modelos = {};
  for (const id of Object.keys(ARQUIVO_MODELO)) modelos[id] = await lerModelo(id);

  const medidor = await criarMedidor();
  if (!medidor) console.log("puppeteer indisponível: corpo do H1 estimado pelo tamanho do título.\n");

  const itens = [];
  const relatorio = [];
  try {
    for (const disparo of REGUA) {
      const { producao, previa, corpo } = await montarDisparo(disparo, modelos[disparo.criativo], medidor);
      const destino = path.join(DIST, "por-momento", disparo.arquivo);
      await writeFile(`${destino}.html`, producao, "utf8");
      await writeFile(`${destino}.txt`, paraTexto(producao, disparo.preheader), "utf8");
      await writeFile(path.join(PREVIEW, "por-momento", `${disparo.arquivo}.html`), previa, "utf8");
      relatorio.push({ ...validar(disparo.arquivo, producao, disparo), corpo });
      itens.push({ disparo, corpo });
    }
  } finally {
    await medidor?.fechar();
  }

  await writeFile(path.join(PREVIEW, "index.html"), paginaAprovacao(itens), "utf8");

  const linhasCsv = [
    ["Codigo", "Criativo", "Momento", "Etapa", "Gatilho", "Titulo (H1)", "Assunto", "Caracteres do assunto", "Preheader", "Arquivo"],
    ...REGUA.map((d) => [
      d.codigo,
      NOME_CRIATIVO[d.criativo],
      d.momento,
      d.etapa,
      d.gatilho,
      d.titulo,
      d.assunto,
      d.assunto.length,
      d.preheader,
      `por-momento/${d.arquivo}.html`
    ])
  ];
  await writeFile(
    path.join(DIST, "assuntos.csv"),
    "\uFEFF" + linhasCsv.map((linha) => linha.map(csv).join(";")).join("\r\n"),
    "utf8"
  );

  console.log("Disparo".padEnd(32), "KB".padStart(6), "  H1   ", "Alertas");
  for (const item of relatorio) {
    console.log(
      item.nome.padEnd(32),
      (item.bytes / 1024).toFixed(1).padStart(6),
      `  ${String(item.corpo.tamanho).padStart(2)}px${item.corpo === H1_DUAS_LINHAS ? "*" : " "}`,
      item.alertas.length ? item.alertas.join("; ") : "ok"
    );
  }
  const pendencias = relatorio.flatMap((item) =>
    item.alertas.filter((a) => !a.includes("placeholder") && !a.includes("caracteres"))
  );
  console.log(`\n${REGUA.length} peças geradas em ${DIST}/por-momento (* = título em duas linhas).`);
  console.log(pendencias.length ? `Pendências técnicas: ${pendencias.length}` : "Nenhuma pendência técnica.");
  console.log(`Para aprovar, abra ${PREVIEW}/index.html no navegador.`);
}

await main();
