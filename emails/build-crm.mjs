/**
 * Gera as peças da régua CRM (Jornada Inícios) no layout V2 (corpo rosa).
 *
 * Saídas: dist/crm/ (ESP) e dist/preview/crm/index.html (aprovação).
 *
 * Uso: node emails/build-crm.mjs (rodar depois do build.mjs, que apaga a pasta dist).
 */
import { config, pecas } from "./conteudo-crm.mjs";
import { gerarRegua } from "./regua-v2.mjs";

await gerarRegua({
  config,
  pecas,
  pasta: "crm",
  imagens: "assets-crm",
  pagina: {
    titulo: "Régua CRM — Jornada Inícios",
    intro: `E-mails de relacionamento com a revendedora depois do primeiro pedido: boas-vindas,
      aniversário, dicas de venda, inatividade e subida para o nível Prata. Textos conforme o PDF
      "Jornada Inícios - Revenda L'Occitane", no layout V2 (corpo rosa) com o cabeçalho da
      confirmação de cadastro.`,
    notas: [
      `<strong>Níveis no D+0 (aprovar).</strong> O PDF marca "[IMAGEM NÍVEIS E VALORES?]".
      A peça usa a tabela de níveis da régua de Primeiro Pedido (Bronze a Diamante, faixas e % de
      lucro), em HTML, que continua legível com as imagens bloqueadas.`,
      `<strong>Aniversário (D+1).</strong> Sem CTA e sem benefício: a planilha não prevê
      benefício para aniversariante. A peça não tem link rastreado.`,
      `<strong>INA 04 e INA 06.</strong> Mesma peça para os dois disparos, como na planilha.
      O PDF não traz a assinatura nesta peça; ela foi incluída para manter o padrão (aprovar).`,
      `<strong>Nível Prata (aprovar).</strong> Não veio pasta de imagens para esta peça;
      a capa precisa ser definida.`
    ]
  }
});
