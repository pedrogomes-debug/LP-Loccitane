/**
 * Gera as peças da régua de Intenções (Leads) no layout V2 (corpo rosa).
 *
 * Saídas: dist/leads/ (ESP) e dist/preview/leads/index.html (aprovação).
 *
 * Uso: node emails/build-leads.mjs (rodar depois do build.mjs, que apaga a pasta dist).
 */
import { config, pecas } from "./conteudo-leads.mjs";
import { gerarRegua } from "./regua-v2.mjs";

await gerarRegua({
  config,
  pecas,
  pasta: "leads",
  imagens: "assets-leads",
  pagina: {
    titulo: "Régua de Intenções — Leads",
    intro: `Cinco e-mails para quem se cadastrou como revendedora e ainda não fez o primeiro pedido
      (D+1, D+3, D+5, D+8 e D+10), com e sem documentação completa. Textos conforme o PDF
      "L'Occitane - Jornada - Intencoes_Leads", no layout V2 (corpo rosa) com o cabeçalho da
      confirmação de cadastro.`,
    notas: [
      `<strong>D+8 (aprovar).</strong> O PDF não traz saudação nem assinatura nesta peça; as duas
      foram incluídas para manter o padrão. O CTA "Benefícios nível Bronze" leva ao Escritório
      Virtual, onde o clube fica, porque não há página pública do clube.`,
      `<strong>D+5 (aprovar).</strong> O PDF não traz a assinatura; ela foi incluída. Os três primeiros
      produtos usam as mesmas fotos da régua CRM.`,
      `<strong>D+3.</strong> O link "clicando aqui" leva ao WhatsApp do suporte e fica sem UTM.`,
      `<strong>Textos soltos do PDF.</strong> As páginas finais trazem trechos sem e-mail definido
      (descrição do Sabonete Caju como brinde, "Sua líder acompanha os primeiros pedidos pelo
      WhatsApp" e variações de "Conclua seu pedido inicial..."). Eles não entraram nas peças.`
    ]
  }
});
