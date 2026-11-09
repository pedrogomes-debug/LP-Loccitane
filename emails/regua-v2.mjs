/**
 * Montagem das réguas no layout V2 (corpo rosa) a partir de um arquivo de conteúdo
 * (config + pecas). Usado por build-crm.mjs e build-leads.mjs.
 *
 * Cabeçalho e estilos vêm do modelo V2 da confirmação de cadastro; o corpo é montado com os
 * mesmos componentes visuais da régua de Primeiro Pedido.
 *
 * Saídas de cada régua:
 *   dist/<pasta>/           → as peças para o ESP (.html + .txt) e assuntos.csv
 *   dist/preview/<pasta>/   → as mesmas peças com imagens locais + página de aprovação
 */
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { H1_DUAS_LINHAS, criarMedidor, esc, marcaInteira, paraTexto } from "./v2-comum.mjs";

const SHELL = "emails/modelos-v2/confirmacao-de-cadastro.html";

/** Marcadores de caminho: as imagens da V2 e as da régua ficam em pastas diferentes no repositório. */
const IMG = "__IMG__/";
const IMG_REGUA = "__IMG_REGUA__/";
const URL_CTA = "__URL_CTA__";

const COR = {
  vermelho: "#C02031",
  tinta: "#2B1A13",
  texto: "#4A3830",
  suave: "#6E564A",
  caixa: "#F8DDE2",
  bordaTabela: "#F0C9D0",
  linhaTabela: "#F5D8DD"
};
const FONTE = "Arial, 'Helvetica Neue', Helvetica, sans-serif";
const RESET = "margin:0;padding:0;mso-line-height-rule:exactly;";

const NIVEIS = [
  { nome: "Bronze", faixa: "De R$ 360 a R$ 1.999", pct: "20%", cor: "#C87941" },
  { nome: "Prata", faixa: "De R$ 2.000 a R$ 5.999", pct: "25%", cor: "#9C9C9C" },
  { nome: "Ouro", faixa: "De R$ 6.000 a R$ 19.999", pct: "30%", cor: "#D79A1E" },
  { nome: "Diamante", faixa: "Acima de R$ 20.000", pct: "35%", cor: "#4FA8D8" }
];
const COR_NIVEL = Object.fromEntries(NIVEIS.map((n) => [n.nome, n.cor]));

const espaco = (altura) =>
  `<tr><td style="height:${altura}px;line-height:${altura}px;font-size:0;">&nbsp;</td></tr>`;
const linha = (html, extra = "") => `<tr><td class="px" style="padding:0 32px;${extra}">${html}</td></tr>`;
const atributo = (url) => url.replace(/&(?!amp;)/g, "&amp;");

const tabelaBranca = (conteudo) => `
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border:1px solid ${COR.bordaTabela};border-radius:12px;background-color:#FFFFFF;" class="tabela">${conteudo}
        </table>`;

const C = {
  capa: ({ arquivo, alt, altura = 300 }) =>
    `<tr><td style="padding:0;font-size:0;line-height:0;"><img src="${IMG_REGUA}${arquivo}" width="600" height="${altura}" alt="${esc(alt)}" style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;text-decoration:none;" /></td></tr>`,

  titulo: (html, { tamanho, entrelinha }) =>
    `<tr><td class="px" align="center" style="padding:0 32px;"><h1 class="t-red h1" style="${RESET}font-family:${FONTE};font-size:${tamanho}px;line-height:${entrelinha}px;font-weight:bold;color:${COR.vermelho};text-align:center;">${html}</h1></td></tr>`,

  saudacao: (texto) =>
    linha(
      `<p class="t-ink" style="${RESET}font-family:${FONTE};font-size:17px;line-height:25px;font-weight:bold;color:${COR.tinta};">${esc(texto)}</p>`
    ),

  paragrafos: (lista) =>
    lista
      .map((texto, i) =>
        linha(
          `<p class="t-body" style="${RESET}font-family:${FONTE};font-size:16px;line-height:25px;color:${COR.texto};text-align:justify;">${texto}</p>`,
          i < lista.length - 1 ? "padding-bottom:14px;" : ""
        )
      )
      .join(""),

  subtitulo: (texto) =>
    linha(
      `<h2 class="t-ink" style="${RESET}font-family:${FONTE};font-size:19px;line-height:26px;font-weight:bold;color:${COR.tinta};">${esc(texto)}</h2>`
    ),

  botao: (rotulo, url) => {
    const vml = esc(rotulo);
    const texto = marcaInteira(esc(rotulo));
    return linha(`
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
          <tr>
            <td align="center" class="btn-cell" style="border-radius:26px;background-color:${COR.vermelho};">
              <!--[if mso]>
              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:52px;v-text-anchor:middle;width:460px;" arcsize="50%" stroke="f" fillcolor="${COR.vermelho}">
                <w:anchorlock/>
                <center style="color:#FFFFFF;font-family:${FONTE};font-size:16px;font-weight:bold;">${vml}</center>
              </v:roundrect>
              <![endif]-->
              <!--[if !mso]><!-->
              <a href="${url}" class="btn-a" style="display:inline-block;min-width:404px;padding:16px 28px;font-family:${FONTE};font-size:16px;line-height:20px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:26px;background-color:${COR.vermelho};text-align:center;">${texto}</a>
              <!--<![endif]-->
            </td>
          </tr>
        </table>`);
  },

  imagem: ({ arquivo, alt, largura, altura, exibir = 536 }) =>
    linha(
      `<img src="${IMG_REGUA}${arquivo}" width="${exibir}" height="${Math.round((exibir * altura) / largura)}" alt="${esc(alt)}" style="display:block;margin:0 auto;width:100%;max-width:${exibir}px;height:auto;border:0;outline:none;text-decoration:none;border-radius:12px;" />`
    ),

  /** Produto em destaque: foto à esquerda e texto à direita no desktop, empilhados no celular. */
  destaque: ({ arquivo, alt, nome, descricao, indicado, rotulo = "Indicado para:" }) =>
    linha(
      tabelaBranca(`
          <tr>
            <td class="stack" width="196" valign="top" style="width:196px;padding:0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;"><tr>
                <td align="center" style="padding:16px 16px 0 16px;">
                  <img src="${IMG_REGUA}${arquivo}" width="164" height="164" alt="${esc(alt)}" style="display:block;margin:0 auto;width:100%;max-width:164px;height:auto;border:0;outline:none;text-decoration:none;border-radius:10px;" />
                </td>
              </tr></table>
            </td>
            <td class="stack" valign="top" style="padding:0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;"><tr>
                <td style="padding:16px;font-family:${FONTE};text-align:left;">
                  <p class="t-ink" style="${RESET}font-size:17px;line-height:23px;font-weight:bold;color:${COR.tinta};">${esc(nome)}</p>
                  <p class="t-body" style="${RESET}padding-top:8px;font-size:15px;line-height:22px;color:${COR.texto};">${esc(descricao)}</p>
                  <p class="t-body" style="${RESET}padding-top:8px;font-size:15px;line-height:22px;color:${COR.texto};"><strong class="t-red" style="color:${COR.vermelho};">${esc(rotulo)}</strong> ${esc(indicado)}</p>
                </td>
              </tr></table>
            </td>
          </tr>`)
    ),

  niveis: () =>
    linha(
      tabelaBranca(
        NIVEIS.map(
          (n, i) => `
          <tr>
            <td width="6" style="width:6px;background-color:${n.cor};font-size:0;line-height:0;">&nbsp;</td>
            <td valign="middle" style="padding:12px 14px;border-top:${i ? `1px solid ${COR.linhaTabela}` : "0"};font-family:${FONTE};">
              <p class="t-ink" style="${RESET}font-size:15px;line-height:21px;font-weight:bold;color:${COR.tinta};">${n.nome}</p>
              <p class="t-muted" style="${RESET}font-size:14px;line-height:20px;color:${COR.suave};">${n.faixa}</p>
            </td>
            <td valign="middle" align="right" style="padding:12px 16px 12px 0;border-top:${i ? `1px solid ${COR.linhaTabela}` : "0"};font-family:${FONTE};">
              <p class="t-red" style="${RESET}font-size:22px;line-height:26px;font-weight:bold;color:${COR.vermelho};">${n.pct}</p>
              <p class="t-muted" style="${RESET}font-size:12px;line-height:16px;color:${COR.suave};">de lucro</p>
            </td>
          </tr>`
        ).join("")
      )
    ),

  /** Parceiros de um nível do clube: faixa na cor do nível e uma linha por parceiro. */
  beneficios: ({ nivel, itens }) =>
    linha(
      tabelaBranca(`
          <tr>
            <td width="6" rowspan="${itens.length + 1}" style="width:6px;background-color:${COR_NIVEL[nivel]};font-size:0;line-height:0;">&nbsp;</td>
            <td colspan="2" style="padding:14px 16px 6px;font-family:${FONTE};">
              <p class="t-ink" style="${RESET}font-size:16px;line-height:22px;font-weight:bold;color:${COR.tinta};">Nível ${esc(nivel)}</p>
            </td>
          </tr>${itens
            .map(
              (b) => `
          <tr>
            <td valign="top" style="padding:10px 8px 10px 16px;border-top:1px solid ${COR.linhaTabela};font-family:${FONTE};">
              <p class="t-ink" style="${RESET}font-size:15px;line-height:21px;font-weight:bold;color:${COR.tinta};">${esc(b.parceiro)}</p>
            </td>
            <td valign="top" align="right" style="padding:10px 16px 10px 0;border-top:1px solid ${COR.linhaTabela};font-family:${FONTE};">
              <p class="t-red" style="${RESET}font-size:15px;line-height:21px;font-weight:bold;color:${COR.vermelho};text-align:right;">${esc(b.oferta)}</p>
            </td>
          </tr>`
            )
            .join("")}`)
    ),

  /** Destaques do clube por nível: faixa na cor do nível, nome do nível e as ofertas. */
  clube: ({ niveis }) =>
    linha(
      tabelaBranca(
        niveis
          .map(
            (n, i) => `
          <tr>
            <td width="6" style="width:6px;background-color:${COR_NIVEL[n.nivel]};font-size:0;line-height:0;">&nbsp;</td>
            <td valign="top" style="padding:12px 16px 12px 14px;border-top:${i ? `1px solid ${COR.linhaTabela}` : "0"};font-family:${FONTE};">
              <p class="t-ink" style="${RESET}font-size:15px;line-height:21px;font-weight:bold;color:${COR.tinta};">${esc(n.nivel)}</p>
              <p class="t-body" style="${RESET}font-size:14px;line-height:20px;color:${COR.texto};">${esc(n.texto)}</p>
            </td>
          </tr>`
          )
          .join("")
      )
    ),

  lista: (itens) =>
    linha(`
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;">
          ${itens
            .map(
              (texto, i) => `
          <tr>
            <td width="12" valign="top" style="width:12px;padding:${i ? "18px" : "8px"} 0 0 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                <td width="8" height="8" class="dot" style="width:8px;height:8px;background-color:${COR.vermelho};border-radius:4px;font-size:0;line-height:0;">&nbsp;</td>
              </tr></table>
            </td>
            <td valign="top" style="padding:${i ? "10px" : "0"} 0 0 12px;font-family:${FONTE};">
              <p class="t-body" style="${RESET}font-size:16px;line-height:25px;color:${COR.texto};">${texto}</p>
            </td>
          </tr>`
            )
            .join("")}
        </table>`),

  nota: (texto) =>
    linha(
      `<p class="t-muted" style="${RESET}font-family:${FONTE};font-size:12px;line-height:17px;color:${COR.suave};">${esc(texto)}</p>`
    ),

  assinatura: () =>
    linha(
      `<p class="t-body" style="${RESET}font-family:${FONTE};font-size:16px;line-height:25px;color:${COR.texto};">Com carinho,<br /><strong class="t-ink" style="color:${COR.tinta};">Equipe L'Occitane au Brésil</strong></p>`
    )
};

/** Produtos em destaque seguidos ficam mais próximos entre si do que os demais blocos. */
const ESPACO_ENTRE = (anterior, atual) =>
  anterior?.tipo === "destaque" && atual.tipo === "destaque" ? 12 : 22;

function renderizarBloco(bloco, urlCta, comUtm) {
  switch (bloco.tipo) {
    case "saudacao":
      return C.saudacao(bloco.texto);
    case "texto":
      return C.paragrafos(bloco.paragrafos);
    case "subtitulo":
      return C.subtitulo(bloco.texto);
    case "cta":
      return C.botao(bloco.rotulo, bloco.url ? comUtm(bloco.url) : urlCta);
    case "imagem":
      return C.imagem(bloco);
    case "destaque":
      return C.destaque(bloco);
    case "niveis":
      return C.niveis();
    case "beneficios":
      return C.beneficios(bloco);
    case "clube":
      return C.clube(bloco);
    case "lista":
      return C.lista(bloco.itens);
    case "nota":
      return C.nota(bloco.texto);
    case "assinatura":
      return C.assinatura();
    default:
      throw new Error(`Bloco desconhecido: ${bloco.tipo}`);
  }
}

/**
 * Separa do modelo V2 tudo o que vem antes do corpo (head + cabeçalho) e o fechamento
 * do card. As peças saem sem rodapé: sem a faixa rosa de descadastro e dados da empresa
 * e sem a linha "Abra no navegador".
 */
async function lerShell() {
  const html = (await readFile(SHELL, "utf8")).replaceAll("../../../assets/", IMG);
  const fimCabecalho = html.indexOf("</tr>", html.indexOf('class="head"')) + "</tr>".length;
  const inicioRodape = html.lastIndexOf(
    '<tr><td style="height:28px;line-height:28px;font-size:0;">&nbsp;</td></tr>',
    html.indexOf('class="foot px"')
  );
  if (fimCabecalho < 10 || inicioRodape < fimCabecalho) {
    throw new Error("Modelo da confirmação fora do padrão esperado (cabeçalho ou rodapé).");
  }
  const depois = html
    .slice(inicioRodape)
    .replace(/\s*<tr>\s*<td class="foot px"[\s\S]*?<\/td>\s*<\/tr>/, "")
    .replace(/\s*<table\b[^>]*class="container"[^>]*>[\s\S]*?<\/table>/, "");
  if (/class="foot|URL_ESPELHO/.test(depois)) {
    throw new Error("Não foi possível remover o rodapé do modelo da confirmação.");
  }
  return { antes: html.slice(0, fimCabecalho), depois };
}

function validar(peca, html) {
  const alertas = [];
  const bytes = Buffer.byteLength(html, "utf8");
  if (bytes > 102000) alertas.push(`HTML com ${(bytes / 1024).toFixed(0)} KB: o Gmail corta acima de ~102 KB`);
  if (/__IMG/.test(html) || html.includes("../assets")) alertas.push("imagem com caminho relativo");
  if (/src="http:\/\//i.test(html) || /href="http:\/\//i.test(html)) alertas.push("link ou imagem em HTTP");
  if (/<script|<form|<iframe|<video|background-image/i.test(html)) alertas.push("recurso que clients de e-mail bloqueiam");
  const imagens = html.match(/<img\b[^>]*>/gi) || [];
  if (imagens.some((tag) => !/\balt="/.test(tag) || !/\bwidth="/.test(tag))) alertas.push("imagem sem alt ou width");
  const temCta = peca.blocos.some((b) => b.tipo === "cta");
  const utms = new Set(html.match(/utm_content=[a-z0-9_]+/g));
  if (temCta && (utms.size !== 1 || !utms.has(`utm_content=${peca.codigo.toLowerCase()}`))) {
    alertas.push(`utm_content incorreto: ${[...utms].join(", ")}`);
  }
  if (/SEU-DOMINIO/.test(html)) alertas.push("baseImagens ainda é placeholder");
  const corpo = html.slice(html.indexOf("<body"));
  const sobras = corpo.match(/\[(?:nome|foto|imagem|placeholder|bloco|cta|link)[^\]]*\]|__URL_CTA__|\{\{URL_[A-Z_]+\}\}/gi);
  if (sobras) alertas.push(`marcação do roteiro sem substituir: ${[...new Set(sobras)].join(", ")}`);
  if (peca.assunto.length > 70) alertas.push(`assunto com ${peca.assunto.length} caracteres`);
  return { nome: peca.arquivo, bytes, imagens: imagens.length, alertas };
}

const escPagina = (texto) => esc(String(texto)).replace(/"/g, "&quot;");
const csv = (valor) => `"${String(valor).replace(/"/g, '""')}"`;

function paginaAprovacao({ itens, pasta, config, pagina }) {
  const marca = (peca, campo) =>
    peca.sugerido?.includes(campo) ? ' <span class="sugerido">sugestão — aprovar</span>' : "";

  const linhas = itens
    .map(({ peca, corpoH1 }, i) => {
      const longo = peca.assunto.length > 70;
      return `        <tr>
          <td class="num">${i + 1}</td>
          <td><code>${escPagina(peca.codigo)}</code><span class="meta">${escPagina(peca.momento)} &middot; ${escPagina(peca.etapa)}</span></td>
          <td>${escPagina(peca.gatilho)}</td>
          <td>
            <span class="rotulo">Assunto</span>${escPagina(peca.assunto)}
            <span class="contagem${longo ? " contagem--alerta" : ""}">${peca.assunto.length} caracteres${longo ? " — corta no celular" : ""}</span>
            <span class="rotulo">Título (H1)${marca(peca, "titulo")}</span>${escPagina(peca.titulo)}
            <span class="contagem">${corpoH1.tamanho}px${corpoH1 === H1_DUAS_LINHAS ? ", em duas linhas" : ""}</span>
            <span class="rotulo">Preheader</span>${escPagina(peca.preheader)}
          </td>
          <td class="acoes">
            <a class="botao" href="${peca.arquivo}.html">Abrir peça</a>
            <a href="../../${pasta}/${peca.arquivo}.txt">Versão texto</a>
          </td>
        </tr>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Aprovação — ${escPagina(pagina.titulo)}</title>
<style>
  :root { --red:#C02031; --ink:#2B1A13; --muted:#6E564A; --line:#E7D8C8; --cream:#FBF1E6; }
  * { box-sizing:border-box; }
  body { margin:0; padding:32px 24px 64px; background:#F7F0E8; color:var(--ink);
    font-family:"Segoe UI",system-ui,-apple-system,sans-serif; line-height:1.55; }
  .wrap { max-width:1080px; margin:0 auto; }
  h1 { font-size:1.9rem; margin:0 0 .3rem; color:var(--red); }
  h2 { font-size:1.15rem; margin:2.5rem 0 .9rem; }
  .intro { color:var(--muted); max-width:75ch; margin:0 0 .4rem; }
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
  .sugerido { text-transform:none; letter-spacing:0; color:#B4551A; font-weight:600; }
  .contagem { display:block; font-size:.76rem; color:var(--muted); }
  .contagem--alerta { color:#B4551A; font-weight:600; }
  .acoes { white-space:nowrap; }
  .acoes a { display:block; font-size:.85rem; color:var(--red); }
  .botao { display:inline-block !important; margin-bottom:8px; padding:8px 14px; border-radius:999px;
    background:var(--red); color:#fff !important; text-decoration:none; font-weight:600; }
  .nota { margin-top:1.2rem; padding:14px 16px; background:#fff; border:1px solid var(--line);
    border-radius:12px; font-size:.86rem; color:var(--muted); }
  .nota strong { color:var(--ink); }
</style>
</head>
<body>
  <div class="wrap">
    <h1>${escPagina(pagina.titulo)}</h1>
    <p class="intro">${pagina.intro}</p>

    <h2>${itens.length} disparos</h2>
    <table>
      <thead>
        <tr><th>#</th><th>Código do template</th><th>Gatilho</th><th>Textos do disparo</th><th>Peça</th></tr>
      </thead>
      <tbody>
${linhas}
      </tbody>
    </table>

${pagina.notas.map((nota) => `    <p class="nota">${nota}</p>`).join("\n")}
    <p class="nota"><strong>Merge tag.</strong> <code>${escPagina(config.tags.nome)}</code> no assunto e
      na saudação das peças. Ajuste a sintaxe para a do ESP e defina um valor padrão para o nome.</p>
    <p class="nota">Estas cópias usam as imagens locais. As peças para o ESP estão em
      <code>dist/${pasta}</code>, com as imagens em <code>${escPagina(config.baseImagens)}</code>.
      A tabela de assuntos está em <a href="../../${pasta}/assuntos.csv">assuntos.csv</a>.</p>
  </div>
</body>
</html>`;
}

/**
 * @param {object} regua
 * @param {object} regua.config  config do arquivo de conteúdo (urlCta, utm, baseImagens...)
 * @param {object[]} regua.pecas peças do arquivo de conteúdo
 * @param {string} regua.pasta   nome da pasta em dist/ e dist/preview/
 * @param {string} regua.imagens pasta das imagens da régua dentro de emails/ (ex.: "assets-crm")
 * @param {{titulo: string, intro: string, notas: string[]}} regua.pagina textos da página de aprovação (HTML)
 */
export async function gerarRegua({ config, pecas, pasta, imagens, pagina }) {
  const DIST = `emails/dist/${pasta}`;
  const PREVIEW = `emails/dist/preview/${pasta}`;

  const comUtm = (codigo) => (url) => {
    const { source, medium, campaign } = config.utm;
    const separador = url.includes("?") ? "&" : "?";
    return atributo(
      `${url}${separador}utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}&utm_content=${codigo.toLowerCase()}`
    );
  };

  async function montarPeca(peca, shell, medidor) {
    const utm = comUtm(peca.codigo);
    const urlCta = utm(config.urlCta);
    const tituloHtml = marcaInteira(esc(peca.titulo));
    const corpoH1 = medidor ? await medidor.corpo(tituloHtml) : H1_DUAS_LINHAS;

    const blocos = peca.blocos
      .map((bloco, i) => (i ? espaco(ESPACO_ENTRE(peca.blocos[i - 1], bloco)) : "") + renderizarBloco(bloco, urlCta, utm))
      .join("")
      .replaceAll(URL_CTA, urlCta);

    const antes = shell.antes
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(peca.titulo)} — ${esc(config.remetente.nome)}</title>`)
      .replace(/(<div style="display:none;[^>]*>)([\s\S]*?)(&#847;)/, (_, abre, __, fecha) => `${abre}${esc(peca.preheader)}${fecha}`);

    const html = [antes, C.capa(peca.capa), espaco(28), C.titulo(tituloHtml, corpoH1), espaco(18), blocos, "\n        ", shell.depois].join("");
    return { html, corpoH1 };
  }

  const caminhos = (html, base, baseRegua) => html.replaceAll(IMG, base).replaceAll(IMG_REGUA, baseRegua);

  await rm(DIST, { recursive: true, force: true });
  await rm(PREVIEW, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });
  await mkdir(PREVIEW, { recursive: true });

  const shell = await lerShell();
  const medidor = process.env.SEM_PUPPETEER ? null : await criarMedidor();
  if (!medidor) console.log("puppeteer desligado ou indisponível: todos os H1 saem em 24px.\n");

  const itens = [];
  const relatorio = [];
  try {
    for (const peca of pecas) {
      const { html, corpoH1 } = await montarPeca(peca, shell, medidor);
      const producao = caminhos(html, `${config.baseImagens}/`, `${config.baseImagens}/`);
      const previa = caminhos(html, "../../../assets/", `../../../${imagens}/`);

      await writeFile(path.join(DIST, `${peca.arquivo}.html`), producao, "utf8");
      await writeFile(path.join(DIST, `${peca.arquivo}.txt`), paraTexto(producao, peca.preheader), "utf8");
      await writeFile(path.join(PREVIEW, `${peca.arquivo}.html`), previa, "utf8");

      relatorio.push({ ...validar(peca, producao), corpoH1 });
      itens.push({ peca, corpoH1 });
    }
  } finally {
    await medidor?.fechar();
  }

  await writeFile(path.join(PREVIEW, "index.html"), paginaAprovacao({ itens, pasta, config, pagina }), "utf8");

  const linhasCsv = [
    ["Codigo", "Momento", "Etapa", "Gatilho", "Titulo (H1)", "Assunto", "Caracteres do assunto", "Preheader", "Sugerido (aprovar)", "Arquivo"],
    ...pecas.map((p) => [
      p.codigo,
      p.momento,
      p.etapa,
      p.gatilho,
      p.titulo,
      p.assunto,
      p.assunto.length,
      p.preheader,
      (p.sugerido || []).join(", "),
      `${p.arquivo}.html`
    ])
  ];
  await writeFile(path.join(DIST, "assuntos.csv"), "\uFEFF" + linhasCsv.map((l) => l.map(csv).join(";")).join("\r\n"), "utf8");

  console.log("Peça".padEnd(32), "KB".padStart(6), "Imgs".padStart(5), "  H1   ", "Alertas");
  for (const item of relatorio) {
    console.log(
      item.nome.padEnd(32),
      (item.bytes / 1024).toFixed(1).padStart(6),
      String(item.imagens).padStart(5),
      `  ${String(item.corpoH1.tamanho).padStart(2)}px${item.corpoH1 === H1_DUAS_LINHAS ? "*" : " "}`,
      item.alertas.length ? item.alertas.join("; ") : "ok"
    );
  }
  const pendencias = relatorio.flatMap((item) => item.alertas.filter((a) => !/placeholder|merge tag|caracteres/.test(a)));
  console.log(`\n${pecas.length} peças geradas em ${DIST} (* = título em duas linhas).`);
  console.log(pendencias.length ? `Pendências técnicas: ${pendencias.join(" | ")}` : "Nenhuma pendência técnica.");
  console.log(`Para aprovar, abra ${PREVIEW}/index.html no navegador.`);
}
