/**
 * Template e componentes das peças de e-mail.
 *
 * Decisões de compatibilidade (do client mais antigo ao mais novo):
 * - Layout em tabelas com role="presentation", largura fixa de 600px e uma única coluna.
 * - Todo estilo que importa vai inline; a tag <style> só carrega melhorias progressivas
 *   (media query, dark mode), porque Gmail Web/Yahoo mantêm <style> mas Gmail em contas
 *   não-Google e alguns webmails antigos descartam.
 * - Botões em VML (roundrect) para Outlook 2007-2019 no Windows, que ignora border-radius
 *   e padding em <a>.
 * - Nada de WebP, SVG, background-image essencial, JavaScript, formulário ou iframe.
 * - Fonte Arial/Helvetica: webfont não renderiza em Outlook, Gmail app e Yahoo.
 * - Imagens com width/height, alt descritivo e display:block para não deixar vão no Outlook.
 */

export const CORES = {
  vermelho: "#C02031",
  vermelhoEscuro: "#96121F",
  creme: "#FBF1E6",
  cremeMedio: "#F5E2CF",
  fundo: "#F0E3D6",
  tinta: "#2B1A13",
  texto: "#4A3830",
  suave: "#6E564A",
  branco: "#FFFFFF",
  borda: "#E7D8C8"
};

const FONTE = "Arial, 'Helvetica Neue', Helvetica, sans-serif";
const RESET_TEXTO = "margin:0;padding:0;mso-line-height-rule:exactly;";

export const escapar = (texto) =>
  String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Espaço vertical que o Outlook também respeita. */
export const espaco = (altura = 24) =>
  `<tr><td style="height:${altura}px;line-height:${altura}px;font-size:0;">&nbsp;</td></tr>`;

const linhaConteudo = (html, extra = "") =>
  `<tr><td class="px" style="padding:0 32px;${extra}">${html}</td></tr>`;

export const titulo = (texto) =>
  linhaConteudo(
    `<h1 class="t-red h1" style="${RESET_TEXTO}font-family:${FONTE};font-size:27px;line-height:34px;font-weight:bold;color:${CORES.vermelho};">${escapar(texto)}</h1>`
  );

export const subtitulo = (texto) =>
  linhaConteudo(
    `<h2 class="t-ink" style="${RESET_TEXTO}font-family:${FONTE};font-size:19px;line-height:26px;font-weight:bold;color:${CORES.tinta};">${escapar(texto)}</h2>`
  );

/** Parágrafos de corpo. Aceita <strong> e <a> já escapados pelo conteúdo. */
export const paragrafos = (lista) =>
  lista
    .map((texto, indice) =>
      linhaConteudo(
        `<p class="t-body" style="${RESET_TEXTO}font-family:${FONTE};font-size:16px;line-height:25px;color:${CORES.texto};">${texto}</p>`,
        indice < lista.length - 1 ? "padding-bottom:14px;" : ""
      )
    )
    .join("");

/** Botão à prova de Outlook: VML para MSO, âncora com padding para o resto. */
export const botao = (rotulo, url, { largura = 320 } = {}) => {
  const texto = escapar(rotulo);
  return linhaConteudo(`
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
          <tr>
            <td align="center" style="border-radius:26px;background-color:${CORES.vermelho};">
              <!--[if mso]>
              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:52px;v-text-anchor:middle;width:${largura}px;" arcsize="50%" stroke="f" fillcolor="${CORES.vermelho}">
                <w:anchorlock/>
                <center style="color:#FFFFFF;font-family:${FONTE};font-size:16px;font-weight:bold;">${texto}</center>
              </v:roundrect>
              <![endif]-->
              <!--[if !mso]><!-->
              <a href="${url}" class="btn-a" style="display:inline-block;min-width:${largura - 56}px;padding:16px 28px;font-family:${FONTE};font-size:16px;line-height:20px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:26px;background-color:${CORES.vermelho};text-align:center;">${texto}</a>
              <!--<![endif]-->
            </td>
          </tr>
        </table>`);
};

/** Lista de diferenciais: marcador quadrado + título + explicação. */
export const pilares = (itens) =>
  linhaConteudo(`
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;">
          ${itens
            .map(
              (item, indice) => `
          <tr>
            <td width="12" valign="top" style="width:12px;padding:${indice ? "14px" : "0"} 0 0 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                <td width="8" height="8" style="width:8px;height:8px;background-color:${CORES.vermelho};border-radius:4px;font-size:0;line-height:0;">&nbsp;</td>
              </tr></table>
            </td>
            <td valign="top" style="padding:${indice ? "10px" : "0"} 0 0 12px;font-family:${FONTE};">
              <p class="t-ink" style="${RESET_TEXTO}font-size:16px;line-height:23px;font-weight:bold;color:${CORES.tinta};">${item.titulo}</p>
              <p class="t-body" style="${RESET_TEXTO}padding-top:3px;font-size:15px;line-height:22px;color:${CORES.texto};">${item.texto}</p>
            </td>
          </tr>`
            )
            .join("")}
        </table>`);

/** Régua de descontos em linhas (mais legível no celular que 4 colunas). */
export const regua = () => {
  const niveis = [
    { nome: "Bronze", faixa: "De R$ 360 a R$ 1.999", pct: "20%", cor: "#C87941" },
    { nome: "Prata", faixa: "De R$ 2.000 a R$ 5.999", pct: "25%", cor: "#9C9C9C" },
    { nome: "Ouro", faixa: "De R$ 6.000 a R$ 19.999", pct: "30%", cor: "#D79A1E" },
    { nome: "Diamante", faixa: "Acima de R$ 20.000", pct: "35%", cor: "#4FA8D8" }
  ];
  return linhaConteudo(`
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border:1px solid ${CORES.borda};border-radius:12px;background-color:${CORES.branco};" class="box">
          ${niveis
            .map(
              (nivel, indice) => `
          <tr>
            <td width="6" style="width:6px;background-color:${nivel.cor};font-size:0;line-height:0;">&nbsp;</td>
            <td valign="middle" style="padding:12px 14px;border-top:${indice ? `1px solid ${CORES.borda}` : "0"};font-family:${FONTE};">
              <p class="t-ink" style="${RESET_TEXTO}font-size:15px;line-height:21px;font-weight:bold;color:${CORES.tinta};">${nivel.nome}</p>
              <p class="t-muted" style="${RESET_TEXTO}font-size:14px;line-height:20px;color:${CORES.suave};">${nivel.faixa}</p>
            </td>
            <td valign="middle" align="right" style="padding:12px 16px 12px 0;border-top:${indice ? `1px solid ${CORES.borda}` : "0"};font-family:${FONTE};font-size:22px;line-height:26px;font-weight:bold;color:${CORES.vermelho};" class="t-red">${nivel.pct}</td>
          </tr>`
            )
            .join("")}
        </table>`);
};

/**
 * Cenários de ganho em duas colunas (compra + desconto de um lado, lucro do outro).
 * Duas colunas em vez de três porque no celular estreito três valores monetários
 * lado a lado quebram a linha e embaralham a leitura.
 */
export const simulacao = (itens) =>
  linhaConteudo(`
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border:1px solid ${CORES.borda};border-radius:12px;background-color:${CORES.branco};" class="box">
          ${itens
            .map(
              (item, indice) => `
          <tr>
            <td valign="middle" style="padding:12px 14px;border-top:${indice ? `1px solid ${CORES.borda}` : "0"};font-family:${FONTE};">
              <p class="t-ink" style="${RESET_TEXTO}font-size:15px;line-height:21px;font-weight:bold;color:${CORES.tinta};">Compra de ${escapar(item.compra)}</p>
              <p class="t-muted" style="${RESET_TEXTO}font-size:14px;line-height:20px;color:${CORES.suave};">${escapar(item.desconto)} de desconto &middot; vende por ${escapar(item.vende)}</p>
            </td>
            <td valign="middle" align="right" style="padding:12px 16px 12px 0;border-top:${indice ? `1px solid ${CORES.borda}` : "0"};font-family:${FONTE};">
              <p class="t-muted" style="${RESET_TEXTO}font-size:12px;line-height:16px;letter-spacing:0.06em;text-transform:uppercase;color:${CORES.suave};">Lucro</p>
              <p class="t-red" style="${RESET_TEXTO}font-size:20px;line-height:26px;font-weight:bold;color:${CORES.vermelho};">${escapar(item.lucro)}</p>
            </td>
          </tr>`
            )
            .join("")}
        </table>`);

/** Caixa de destaque em creme (exemplo de conta, aviso, resumo). */
export const destaque = ({ titulo: tituloCaixa, texto }) =>
  linhaConteudo(`
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;background-color:${CORES.creme};border-radius:12px;" class="box">
          <tr>
            <td style="padding:18px 20px;font-family:${FONTE};">
              ${tituloCaixa ? `<p class="t-red" style="${RESET_TEXTO}font-size:13px;line-height:18px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:${CORES.vermelho};padding-bottom:6px;">${escapar(tituloCaixa)}</p>` : ""}
              <p class="t-body" style="${RESET_TEXTO}font-size:16px;line-height:24px;color:${CORES.texto};">${texto}</p>
            </td>
          </tr>
        </table>`);

/** Três imagens em colunas que viram uma coluna no celular. */
export const trio = (itens) =>
  linhaConteudo(`
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;">
          <tr>
            ${itens
              .map(
                (item, indice) => `
            <td class="stack" width="172" valign="top" style="width:172px;padding:0 ${indice === itens.length - 1 ? "0" : "10px"} 0 0;">
              <img src="${item.src}" width="172" height="172" alt="${escapar(item.alt)}" style="display:block;width:100%;max-width:172px;height:auto;border:0;outline:none;text-decoration:none;border-radius:10px;" />
              <p class="t-muted" style="${RESET_TEXTO}padding-top:8px;font-family:${FONTE};font-size:14px;line-height:20px;color:${CORES.suave};text-align:center;">${escapar(item.legenda)}</p>
            </td>`
              )
              .join("")}
          </tr>
        </table>`);

/** Depoimento com foto opcional. */
export const depoimento = ({ texto, autor, detalhe, foto }) =>
  linhaConteudo(`
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;background-color:${CORES.cremeMedio};border-radius:12px;" class="box">
          <tr>
            <td style="padding:20px;font-family:${FONTE};">
              <p class="t-ink" style="${RESET_TEXTO}font-size:16px;line-height:25px;color:${CORES.tinta};font-style:italic;">&ldquo;${escapar(texto)}&rdquo;</p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="padding-top:14px;">
                <tr>
                  ${foto ? `<td width="48" valign="middle" style="width:48px;padding-right:12px;"><img src="${foto}" width="48" height="48" alt="" style="display:block;width:48px;height:48px;border:0;outline:none;border-radius:24px;" /></td>` : ""}
                  <td valign="middle">
                    <p class="t-ink" style="${RESET_TEXTO}font-size:15px;line-height:20px;font-weight:bold;color:${CORES.tinta};">${escapar(autor)}</p>
                    <p class="t-muted" style="${RESET_TEXTO}font-size:13px;line-height:19px;color:${CORES.suave};">${escapar(detalhe)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`);

/** Passos numerados. */
export const passos = (itens) =>
  linhaConteudo(`
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;">
          ${itens
            .map(
              (item, indice) => `
          <tr>
            <td width="34" valign="top" style="width:34px;padding:${indice ? "16px" : "0"} 12px 0 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="34" style="width:34px;"><tr>
                <td align="center" valign="middle" height="34" style="width:34px;height:34px;background-color:${CORES.vermelho};border-radius:17px;font-family:${FONTE};font-size:16px;line-height:34px;font-weight:bold;color:#FFFFFF;">${indice + 1}</td>
              </tr></table>
            </td>
            <td valign="top" style="padding:${indice ? "18px" : "2px"} 0 0 0;font-family:${FONTE};">
              <p class="t-ink" style="${RESET_TEXTO}font-size:16px;line-height:22px;font-weight:bold;color:${CORES.tinta};">${escapar(item.titulo)}</p>
              <p class="t-body" style="${RESET_TEXTO}padding-top:3px;font-size:15px;line-height:22px;color:${CORES.texto};">${item.texto}</p>
            </td>
          </tr>`
            )
            .join("")}
        </table>`);

/** Bloco da líder no WhatsApp. */
export const lider = ({ src, texto }) =>
  linhaConteudo(`
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;background-color:${CORES.creme};border-radius:12px;" class="box">
          <tr>
            <td width="76" valign="middle" style="width:76px;padding:16px 0 16px 16px;">
              <img src="${src}" width="60" height="60" alt="" style="display:block;width:60px;height:60px;border:0;outline:none;border-radius:30px;" />
            </td>
            <td valign="middle" style="padding:16px;font-family:${FONTE};">
              <p class="t-body" style="${RESET_TEXTO}font-size:15px;line-height:22px;color:${CORES.texto};">${texto}</p>
            </td>
          </tr>
        </table>`);

export const divisor = () =>
  linhaConteudo(
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;"><tr><td height="1" style="height:1px;background-color:${CORES.borda};font-size:0;line-height:0;">&nbsp;</td></tr></table>`
  );

/**
 * Imagem larga (topo da peça). A altura acompanha o recorte do arquivo: o atributo `height`
 * precisa bater com a proporção real, senão o Outlook reserva o espaço errado.
 */
export const capa = ({ src, alt, altura = 300 }) =>
  `<tr><td style="padding:0;font-size:0;line-height:0;"><img src="${src}" width="600" height="${altura}" alt="${escapar(alt)}" style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;text-decoration:none;" /></td></tr>`;

/** Texto pequeno centralizado (encerramento, avisos). */
export const notaFinal = (texto) =>
  linhaConteudo(
    `<p class="t-muted" style="${RESET_TEXTO}font-family:${FONTE};font-size:14px;line-height:21px;color:${CORES.suave};text-align:center;">${texto}</p>`
  );

/**
 * Monta o HTML completo da peça.
 */
export function montarEmail({ assunto, preheader, corpo, rodape, urlEspelho, tituloDocumento }) {
  // O preheader precisa de "enchimento" invisível, senão o client completa a prévia
  // com as primeiras palavras do corpo.
  const enchimento = "&#847;&zwnj;&nbsp;".repeat(60);

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="pt-BR">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
<meta name="color-scheme" content="light dark" />
<meta name="supported-color-schemes" content="light dark" />
<title>${escapar(tituloDocumento || assunto)}</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<style type="text/css">
  body, table, td, p, h1, h2, a { font-family: Arial, sans-serif !important; }
  table { border-collapse: collapse !important; }
</style>
<![endif]-->
<style type="text/css">
  html, body { margin:0 !important; padding:0 !important; width:100% !important; }
  body { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; border-collapse:collapse; }
  img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; }
  a { text-decoration:underline; }
  a[x-apple-data-detectors] { color:inherit !important; text-decoration:none !important; font-size:inherit !important; font-family:inherit !important; font-weight:inherit !important; line-height:inherit !important; }
  .im { color:inherit !important; }
  u + #corpo .gmail { width:100% !important; }
  @media only screen and (max-width:620px) {
    .container { width:100% !important; max-width:100% !important; }
    .px { padding-left:20px !important; padding-right:20px !important; }
    .h1 { font-size:24px !important; line-height:31px !important; }
    .stack { display:block !important; width:100% !important; max-width:100% !important; padding:0 0 16px 0 !important; text-align:center !important; }
    .stack img { margin:0 auto !important; max-width:240px !important; }
    .btn-a { display:block !important; width:100% !important; min-width:0 !important; box-sizing:border-box !important; }
  }
  @media (prefers-color-scheme:dark) {
    .body-bg { background-color:#1C110C !important; }
    .card { background-color:#2A1A13 !important; }
    .box { background-color:#3A2519 !important; border-color:#4A3223 !important; }
    .foot { background-color:#241610 !important; }
    .t-ink, .t-body { color:#F7EBE0 !important; }
    .t-muted { color:#D8C5B7 !important; }
    .t-red { color:#FF9BA3 !important; }
    .t-foot { color:#C9B4A5 !important; }
  }
</style>
</head>
<body id="corpo" class="body-bg" style="margin:0;padding:0;width:100%;background-color:${CORES.fundo};">
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;color:${CORES.fundo};">${escapar(preheader)}${enchimento}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="body-bg gmail" style="width:100%;background-color:${CORES.fundo};">
  <tr>
    <td align="center" style="padding:16px 10px;">
      <!--[if mso]><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" align="center"><tr><td><![endif]-->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container card" style="width:600px;max-width:600px;background-color:${CORES.branco};border-radius:16px;overflow:hidden;">
        <tr>
          <td align="center" style="padding:22px 20px;background-color:${CORES.vermelho};">
            <img src="${corpo.logo}" width="176" height="54" alt="L'Occitane au Brésil" style="display:block;width:176px;height:auto;border:0;outline:none;text-decoration:none;" />
          </td>
        </tr>
        ${corpo.html}
        ${espaco(28)}
        <tr>
          <td class="foot px" style="padding:24px 32px;background-color:${CORES.creme};">
            ${rodape}
          </td>
        </tr>
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="width:600px;max-width:600px;">
        <tr>
          <td align="center" style="padding:14px 20px 6px;font-family:${FONTE};font-size:12px;line-height:18px;color:${CORES.suave};" class="t-foot">
            Não consegue ver esta mensagem? <a href="${urlEspelho}" style="color:${CORES.suave};text-decoration:underline;">Abra no navegador</a>.
          </td>
        </tr>
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td>
  </tr>
</table>
</body>
</html>`;
}

export { FONTE, RESET_TEXTO };
