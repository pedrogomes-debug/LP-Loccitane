/**
 * Régua CRM (Jornada Inícios): e-mails de relacionamento com a revendedora depois do
 * primeiro pedido.
 *
 * Fonte: "Jornada Inícios - Revenda L'Occitane" (PDF). Os textos seguem o documento; os
 * pontos que ele não traz estão marcados com `sugerido` e precisam de aprovação da marca:
 *   - o título (H1) de cada peça, já que o layout V2 abre com um H1 sob a capa;
 *   - no D+0, a tabela de níveis no lugar de "[IMAGEM NÍVEIS E VALORES?]";
 *   - no INA, a assinatura, que o PDF não traz nessa peça;
 *   - a peça de Comportamento (nível Prata), que não veio com imagens.
 *
 * Imagens: zips "D+0 - Email Boas-vindas", "D+1 - Relacionamento com a base aniversariante",
 * "D+30 - Dicas de venda" e "INA 04 E INA 06", tratados por preparar-imagens-crm.mjs.
 */
import { config as configBase } from "./conteudo.mjs";

export const config = {
  ...configBase,
  urlCta: configBase.urlPedidos,
  /** O clube fica dentro do Escritório Virtual: não há página pública para ele. */
  urlClube: configBase.urlPedidos,
  utm: { ...configBase.utm, campaign: "revenda_crm" },
  tags: {
    ...configBase.tags,
    // Merge tag: ajustar a sintaxe conforme o ESP.
    nome: "{{NOME}}"
  }
};

/** Substituído pela URL do CTA (com UTM) na montagem de cada peça. */
export const URL_CTA = "__URL_CTA__";

const NOME = config.tags.nome;

const saudacao = (pontuacao = "!") => ({ tipo: "saudacao", texto: `Olá, ${NOME}${pontuacao}` });
const ASSINATURA = { tipo: "assinatura" };

export const pecas = [
  {
    codigo: "LOCCITANE_CRM_D0_BOAS_VINDAS",
    arquivo: "01-d0-boas-vindas",
    momento: "D+0",
    etapa: "Boas-vindas + resumo do Plano de Crescimento + pontos de apoio (Líder e SAC)",
    gatilho: "Primeiro pedido realizado",
    assunto: "Do Bronze ao Diamante: sua jornada começa agora",
    preheader: "Veja como aumentar seu lucro e desbloquear benefícios exclusivos",
    titulo: "Do Bronze ao Diamante: sua jornada começa agora",
    sugerido: ["titulo", "niveis"],
    capa: { arquivo: "crm-capa-d0.jpg", alt: "Revendedora sorrindo com o perfume Brésil L'Occitane au Brésil" },
    blocos: [
      saudacao("!"),
      {
        tipo: "texto",
        paragrafos: [
          "É um prazer dar as boas-vindas a você como revendedora L'Occitane au Brésil!",
          "Agora que o seu primeiro pedido foi realizado, chegou a hora de levar até suas clientes uma marca de alma francesa e coração brasileiro, que transforma a riqueza do nosso país em fragrâncias, texturas e cuidados únicos!"
        ]
      },
      { tipo: "subtitulo", texto: "O seu crescimento só depende de você!" },
      {
        tipo: "texto",
        paragrafos: [
          "Toda revendedora começa no nível Bronze, com <strong>20% de lucro</strong>, e pode chegar até <strong>35% no nível Diamante</strong>. A cada nível conquistado, você também desbloqueia descontos e promoções exclusivas em nosso <strong>Clube de Benefícios</strong>."
        ]
      },
      { tipo: "niveis" },
      {
        tipo: "texto",
        paragrafos: [
          "Ao atingir o valor de uma faixa em um ciclo, você sobe de nível automaticamente no ciclo seguinte. Seus pedidos também se somam ao longo do <strong>Período de Apuração</strong>, que reúne quatro ciclos, e ao final dele o valor total define se você sobe, mantém ou desce de nível."
        ]
      },
      { tipo: "subtitulo", texto: "Como faturar mais?" },
      {
        tipo: "lista",
        itens: [
          "Defina metas a cada ciclo e acompanhe suas vendas.",
          "Aproveite as promoções de cada ciclo para aumentar seu lucro.",
          "Ofereça kits e fique de olho nas datas comemorativas.",
          "Participe das lives e dos treinamentos para conhecer novas estratégias.",
          "Produza conteúdo em suas redes sociais."
        ]
      },
      { tipo: "subtitulo", texto: "Conte com a gente" },
      {
        tipo: "texto",
        paragrafos: [
          "Você não está sozinha nessa jornada! Sempre que surgir uma dúvida, conte com a sua <strong>Líder</strong> ou com o nosso <strong>SAC</strong> para receber orientação e seguir vendendo com tranquilidade."
        ]
      },
      { tipo: "cta", rotulo: "Conheça o Clube de Benefícios" },
      ASSINATURA
    ]
  },
  {
    codigo: "LOCCITANE_CRM_D1_ANIVERSARIO",
    arquivo: "02-d1-aniversario",
    momento: "D+1",
    etapa: "Relacionamento com a base aniversariante",
    gatilho: "Aniversário da revendedora no mês",
    assunto: `${NOME}, este mês é todo seu!`,
    preheader: "Hoje, celebramos seu dia e tudo que você constrói com nossa marca",
    titulo: "Feliz aniversário! Bon anniversaire!",
    sugerido: ["titulo"],
    capa: { arquivo: "crm-capa-d1.jpg", alt: "Mulher sentindo o aroma do creme Pudim Moça L'Occitane au Brésil" },
    blocos: [
      saudacao("!"),
      {
        tipo: "texto",
        paragrafos: [
          "Este mês tem um motivo especial para celebrar: o seu aniversário!",
          "Queremos aproveitar a data para te agradecer por fazer parte da nossa rede de revendedoras e por crescer conosco a cada ciclo!",
          "A cada produto que você vende, um pouco da beleza do Brasil e da essência da L'Occitane au Brésil chega à vida e à rotina de cuidado de mais pessoas, e isso também merece ser comemorado.",
          "Que a sua nova fase seja repleta de conquistas, encontros especiais e momentos que perfumam a vida.",
          "<strong>Feliz aniversário!<br />Bon anniversaire!</strong>"
        ]
      },
      ASSINATURA
    ]
  },
  {
    codigo: "LOCCITANE_CRM_D30_DICAS_DE_VENDA",
    arquivo: "03-d30-dicas-de-venda",
    momento: "D+30",
    etapa: "Dicas de venda, best sellers e claims por ocasião",
    gatilho: "30 dias após o primeiro pedido",
    assunto: "Conheça nossos campeões de venda",
    preheader: "Três best sellers e estratégias para vendê-los",
    titulo: "Conheça nossos campeões de venda",
    sugerido: ["titulo"],
    capa: { arquivo: "crm-capa-d30.jpg", alt: "Best sellers L'Occitane au Brésil" },
    blocos: [
      saudacao(","),
      {
        tipo: "texto",
        paragrafos: [
          "Sabe aquele produto que praticamente se vende sozinho? Na L'Occitane au Brésil, alguns conquistaram tantas clientes que viraram campeões de vendas. Separamos três deles para você, com dicas de uso e como indicar cada um."
        ]
      },
      {
        tipo: "destaque",
        arquivo: "crm-d30-capim-limao.jpg",
        alt: "Deo Colônia Capim-Limão 100 ml",
        nome: "Deo Colônia Capim-Limão 100 ml",
        descricao:
          "Fragrância cítrica, refrescante e unissex que traz uma sensação de vigor que renova os sentidos e traz frescor no dia a dia.",
        indicado: "desodorizar e perfumar a pele."
      },
      {
        tipo: "destaque",
        arquivo: "crm-d30-bafafa.jpg",
        alt: "Mist Desodorante Perfumado Bafafá 75 ml",
        nome: "Mist Desodorante Perfumado Bafafá 75 ml",
        descricao:
          "Explosão frutada de pitanga e toranja, com notas florais e fundo de âmbar e baunilha, em uma fórmula leve e desodorante. Indicado para clientes que amam fragrâncias tropicais, joviais e cheias de atitude.",
        indicado: "uso diário, especialmente nos dias quentes e ensolarados."
      },
      {
        tipo: "destaque",
        arquivo: "crm-d30-roma.jpg",
        alt: "Combo Hidratação e Spray Perfumado Romã",
        nome: "Combo Hidratação e Spray Perfumado Romã",
        descricao:
          "Reúne o Spray Perfumado Romã 150 ml e a Geleia Hidratante Desodorante Corporal Romã 200 ml, com um acorde de frutas vermelhas inspirado nos doces de compota brasileiros. A geleia tem textura bifásica leve, refrescante e deixa a pele hidratada e macia, enquanto o spray perfuma e desodoriza.",
        indicado: "uma experiência sensorial divertida e leve durante a rotina de cuidado."
      },
      { tipo: "subtitulo", texto: "Estratégias que fazem diferença" },
      {
        tipo: "lista",
        itens: [
          "Ofereça combinações e fique de olho nas datas comemorativas.",
          "Produza conteúdo nas suas redes sociais para ser encontrada por novas clientes.",
          "Aproveite as promoções de cada ciclo para aumentar seu lucro."
        ]
      },
      { tipo: "cta", rotulo: "Fazer meu próximo pedido" },
      ASSINATURA
    ]
  },
  {
    codigo: "LOCCITANE_CRM_INA_SUBA_DE_NIVEL",
    arquivo: "04-ina-suba-de-nivel",
    momento: "INA 04 e INA 06",
    etapa: "Inatividade: 60 dias sem novos pedidos",
    gatilho: "60 dias sem passar novos pedidos",
    assunto: "Suba de nível e aumente seu lucro",
    preheader: "Veja como chegar ao nível Prata e desbloquear novos benefícios",
    titulo: "Suba de nível e aumente seu lucro",
    sugerido: ["titulo", "assinatura"],
    capa: { arquivo: "crm-capa-ina.jpg", alt: "Revendedora sorrindo com a deo colônia Caju L'Occitane au Brésil" },
    blocos: [
      saudacao(","),
      {
        tipo: "texto",
        paragrafos: [
          "Que tal aumentar o seu lucro nos próximos ciclos? No Plano de Crescimento, a passagem do nível Bronze para o Prata eleva o seu lucro de <strong>20% para 25%</strong> e ainda libera novas vantagens no Clube de Benefícios."
        ]
      },
      { tipo: "subtitulo", texto: "Duas formas de avançar:" },
      {
        tipo: "lista",
        itens: [
          "<strong>Em um único ciclo:</strong> ao fazer R$&nbsp;2.000 em pedidos dentro de um ciclo, você sobe automaticamente para o Prata no ciclo seguinte.",
          "<strong>Aos poucos:</strong> seus pedidos se somam ao longo dos quatro ciclos do Período de Apuração. Com R$&nbsp;500 por ciclo, você chega aos R$&nbsp;2.000 e começa o período seguinte no nível Prata."
        ]
      },
      { tipo: "subtitulo", texto: "O que muda no clube:" },
      {
        tipo: "texto",
        paragrafos: [
          "Além do lucro maior, o nível Prata amplia o seu Clube de Benefícios com marcas de moda, esporte e presentes:"
        ]
      },
      {
        tipo: "beneficios",
        nivel: "Prata",
        itens: [
          { parceiro: "Dafiti", oferta: "até 80% off" },
          { parceiro: "Extra.com", oferta: "até 25% off em todo o site" },
          { parceiro: "Conquer", oferta: "28% off" },
          { parceiro: "Giuliana Flores", oferta: "18% off" },
          { parceiro: "Netshoes, Mizuno e Fila", oferta: "descontos" }
        ]
      },
      {
        tipo: "texto",
        paragrafos: [
          "<strong>Fique atenta:</strong> para que o pedido conte no plano, o boleto à vista precisa estar pago e aprovado até o último dia do ciclo."
        ]
      },
      { tipo: "cta", rotulo: "Montar meu próximo pedido" },
      ASSINATURA
    ]
  },
  {
    codigo: "LOCCITANE_CRM_NIVEL_PRATA",
    arquivo: "05-comportamento-nivel-prata",
    momento: "Comportamento",
    etapa: "Subiu para o nível Prata",
    gatilho: "Revendedora atingiu o nível Prata",
    assunto: "Parabéns! Você chegou ao nível Prata",
    preheader: "Confira os novos benefícios disponíveis para você",
    titulo: "Parabéns! Você chegou ao nível Prata",
    sugerido: ["titulo", "capa"],
    capa: { arquivo: "crm-capa-prata.jpg", alt: "Revendedora sorrindo com produtos da linha Romã L'Occitane au Brésil" },
    blocos: [
      saudacao("!"),
      {
        tipo: "texto",
        paragrafos: [
          "Parabéns! Você acaba de chegar ao nível Prata! Essa conquista é resultado da sua dedicação, e agora a sua revenda passa a render ainda mais!",
          "A partir de agora, seu lucro passa de <strong>20% para 25%</strong>."
        ]
      },
      { tipo: "subtitulo", texto: "Mais marcas no seu clube" },
      {
        tipo: "texto",
        paragrafos: [
          "Além dos benefícios que você já aproveitava, o seu Clube de Benefícios ganha novas parcerias e descontos exclusivos:"
        ]
      },
      {
        tipo: "beneficios",
        nivel: "Prata",
        itens: [
          { parceiro: "Dafiti", oferta: "até 80% off" },
          { parceiro: "Extra.com", oferta: "até 25% off em todo o site" },
          { parceiro: "Conquer", oferta: "28% off" },
          { parceiro: "Giuliana Flores", oferta: "18% off" },
          { parceiro: "Integralmédica, Mizuno, Fila, Nova Flor e Darkness", oferta: "15% off" },
          { parceiro: "Netshoes", oferta: "10% off" }
        ]
      },
      { tipo: "subtitulo", texto: "Seu próximo destino: nível Ouro" },
      {
        tipo: "texto",
        paragrafos: [
          "Para chegar ao nível Ouro e obter <strong>30% de lucro</strong>, você tem dois caminhos: fazer R$&nbsp;6.000 em pedidos em um único ciclo, ou somar R$&nbsp;6.000 ao longo de todo o Período de Apuração (4 ciclos), o equivalente a R$&nbsp;1.500 por ciclo."
        ]
      },
      { tipo: "cta", rotulo: "Ver meus novos benefícios" },
      ASSINATURA
    ]
  }
];
