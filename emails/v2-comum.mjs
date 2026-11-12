/**
 * Funções compartilhadas pelos geradores do layout V2 (build-v2.mjs e build-primeiro-pedido.mjs).
 */

/** Largura útil do H1: 600px do card menos 32px de padding de cada lado. */
const LARGURA_H1 = 536;
const MAIOR_H1 = 27;
const MENOR_H1 = 22;
export const H1_DUAS_LINHAS = { tamanho: 24, entrelinha: 31 };

export const esc = (texto) =>
  String(texto).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Impede que "L'Occitane" se separe de "au Brésil" na quebra de linha. */
export const marcaInteira = (html) => html.replace(/L'Occitane au Brésil/g, "L'Occitane&nbsp;au&nbsp;Brésil");

export const entrelinha = (tamanho) => Math.round(tamanho * 1.26);

/**
 * Mede o H1 no Chromium para escolher o maior corpo (27px a 22px) em que o título
 * cabe numa linha; se não couber, 24px em duas linhas. Retorna null sem puppeteer.
 */
export async function criarMedidor() {
  if (process.env.SEM_MEDIDOR) return null;
  let puppeteer;
  try {
    puppeteer = (await import("puppeteer")).default;
  } catch {
    return null;
  }
  let navegador;
  try {
    navegador = await puppeteer.launch({
      headless: true,
      ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
    });
  } catch {
    return null;
  }
  const pagina = await navegador.newPage();

  const linhas = (html, tamanho) =>
    pagina.evaluate(
      (conteudo, px, lh, largura) => {
        document.body.innerHTML = `<div id="m" style="width:${largura}px;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-weight:bold;font-size:${px}px;line-height:${lh}px;text-align:center;">${conteudo}</div>`;
        return Math.round(document.getElementById("m").getBoundingClientRect().height / lh);
      },
      html,
      tamanho,
      entrelinha(tamanho),
      LARGURA_H1
    );

  return {
    async corpo(html) {
      for (let tamanho = MAIOR_H1; tamanho >= MENOR_H1; tamanho--) {
        if ((await linhas(html, tamanho)) === 1) return { tamanho, entrelinha: entrelinha(tamanho) };
      }
      return H1_DUAS_LINHAS;
    },
    fechar: () => navegador.close()
  };
}

/**
 * Corpo do H1 já gravado em cada peça de `pasta`, por arquivo, quando o título não mudou.
 * Serve de reserva para quando o medidor não está disponível, para o build não trocar
 * os tamanhos medidos antes pelo padrão de duas linhas.
 */
export async function lerH1Anteriores(pasta, pecas) {
  const { readFile } = await import("node:fs/promises");
  const anteriores = new Map();
  for (const peca of pecas) {
    let html;
    try {
      html = await readFile(`${pasta}/${peca.arquivo}.html`, "utf8");
    } catch {
      continue;
    }
    const h1 = html.match(/<h1\b[^>]*font-size:(\d+)px;line-height:(\d+)px;[^>]*>([\s\S]*?)<\/h1>/);
    if (h1 && h1[3] === marcaInteira(esc(peca.titulo))) {
      anteriores.set(peca.arquivo, { tamanho: Number(h1[1]), entrelinha: Number(h1[2]) });
    }
  }
  return anteriores;
}

/** Corpo do HTML → texto puro, para a parte text/plain do multipart. */
export function paraTexto(html, preheader) {
  const corpo = html
    .slice(html.indexOf("<body"), html.indexOf("</body>"))
    .replace(/<div style="display:none;[\s\S]*?<\/div>/, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<img\b[^>]*>/gi, "")
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "$2 ($1)")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h1|h2|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&bull;/g, "•")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&middot;/g, "·")
    .replace(/&zwnj;|&#847;/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  const paragrafos = corpo
    .split("\n")
    .map((linha) => linha.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const [titulo, ...resto] = paragrafos;
  return [`${titulo}\n${"=".repeat(Math.min(titulo.length, 60))}`, preheader, ...resto].join("\n\n");
}
