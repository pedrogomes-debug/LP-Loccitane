/**
 * Régua de Intenções (Leads): 5 e-mails para quem se cadastrou como revendedora e ainda
 * não fez o primeiro pedido, com e sem documentação completa.
 *
 * Fonte: "L'Occitane - Jornada - Intencoes_Leads (Sem e com doc completa)" (PDF). Os textos
 * seguem o documento; os pontos que ele não traz estão marcados com `sugerido` e precisam
 * de aprovação da marca:
 *   - o título (H1) de cada peça, já que o layout V2 abre com um H1 sob a capa;
 *   - a assinatura no D+5 e no D+8 e a saudação no D+8, que o PDF não traz.
 *
 * Imagens: pasta "imagens_leads", tratadas por preparar-imagens-leads.mjs.
 */
import { config as configBase } from "./conteudo.mjs";

export const config = {
  ...configBase,
  urlCta: configBase.urlPedidos,
  /** O clube fica dentro do Escritório Virtual: não há página pública para ele. */
  urlClube: configBase.urlPedidos,
  utm: { ...configBase.utm, campaign: "revenda_leads" },
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

const linkWhatsapp = (rotulo) =>
  `<a href="${config.urlWhatsapp}" class="t-red" style="color:#C02031;font-weight:bold;text-decoration:underline;">${rotulo}</a>`;

const DESTAQUES_BEST_SELLERS = [
  {
    tipo: "destaque",
    arquivo: "crm-d30-capim-limao.jpg",
    alt: "Deo Colônia Capim-Limão 100 ml",
    nome: "Deo Colônia Capim-Limão 100 ml",
    descricao: "Fragrância cítrica, refrescante e unissex, que traz uma sensação de vigor e frescor no dia a dia.",
    rotulo: "Ideal para:",
    indicado: "quem busca aquele frescor ideal no dia a dia."
  },
  {
    tipo: "destaque",
    arquivo: "crm-d30-bafafa.jpg",
    alt: "Mist Desodorante Perfumado Bafafá 75 ml",
    nome: "Mist Desodorante Perfumado Bafafá 75 ml",
    descricao:
      "Explosão frutada de pitanga e toranja, com toque floral e fundo de âmbar e baunilha, em uma fórmula leve e desodorante.",
    rotulo: "Ideal para:",
    indicado: "quem ama fragrâncias tropicais e cheias de atitude, especialmente nos dias quentes."
  },
  {
    tipo: "destaque",
    arquivo: "crm-d30-roma.jpg",
    alt: "Combo Hidratação e Spray Perfumado Romã",
    nome: "Combo Hidratação e Spray Perfumado Romã",
    descricao:
      "Spray perfumado e geleia hidratante com acorde de frutas vermelhas, inspirado nos doces de compota brasileiros. A geleia conta com uma textura bifásica leve e refrescante.",
    rotulo: "Ideal para:",
    indicado: "quem deseja uma experiência sensorial divertida e leve durante a rotina de cuidado."
  },
  {
    tipo: "destaque",
    arquivo: "leads-sabonete-caju.jpg",
    alt: "Sabonete Líquido em Óleo Caju 250 ml",
    nome: "Sabonete Líquido em Óleo Caju 250 ml",
    descricao:
      "Com extrato de caju, este sabonete se transforma em uma espuma cremosa em contato com a água. Hidrata e limpa a pele, além de deixar um perfume suave e delicado.",
    rotulo: "Ideal para:",
    indicado: "quem quer transformar o banho em um momento sensorial e leve. Agrada todos os tipos de pele."
  }
];

export const pecas = [
  {
    codigo: "LOCCITANE_LEADS_D1_BOAS_VINDAS",
    arquivo: "01-d1-boas-vindas",
    momento: "D+1",
    etapa: "Boas-vindas + brinde + Clube de Benefícios",
    gatilho: "Cadastro feito, sem primeiro pedido",
    assunto: `${NOME}, que bom ter você com a gente!`,
    preheader: "Um brinde de boas-vindas e diversas vantagens te esperam.",
    titulo: "Falta um passo para você começar a lucrar",
    sugerido: ["titulo"],
    capa: { arquivo: "leads-capa-d1.jpg", alt: "Produtos da linha Brésil L'Occitane au Brésil" },
    blocos: [
      saudacao("!"),
      {
        tipo: "texto",
        paragrafos: [
          "Seja muito bem-vinda! Agora, falta um passo para você começar a lucrar e construir sua história junto da L'Occitane au Brésil: o seu <strong>primeiro pedido</strong>."
        ]
      },
      { tipo: "subtitulo", texto: "Um brinde e um Clube de Benefícios esperam por você!" },
      {
        tipo: "texto",
        paragrafos: [
          "Ao finalizar seu primeiro pedido, você recebe um <strong>brinde especial de boas-vindas</strong> para celebrar o início da sua jornada. E, a cada nível conquistado, você também desbloqueia promoções e descontos exclusivos no nosso <strong>Clube de Benefícios</strong>."
        ]
      },
      { tipo: "subtitulo", texto: "Um lucro que cresce junto com você!" },
      {
        tipo: "texto",
        paragrafos: [
          "Toda revendedora já começa com um lucro de <strong>20%, no nível Bronze</strong>, e com benefícios especiais do Clube desde o início. Conforme suas vendas crescem, esse lucro pode chegar a <strong>35% no nível Diamante</strong> e suas vantagens aumentam a cada nível conquistado.",
          "Para subir de nível existem dois caminhos: atingir o valor de uma faixa dentro de um único ciclo ou somar seus pedidos ao longo do Período de Apuração, e ao final o valor total define se você sobe, mantém ou desce de nível.",
          "Finalize seu primeiro pedido no botão abaixo e comece a trilhar sua história junto com a L'Occitane au Brésil!"
        ]
      },
      { tipo: "cta", rotulo: "Fazer meu primeiro pedido" },
      ASSINATURA
    ]
  },
  {
    codigo: "LOCCITANE_LEADS_D3_DUVIDAS",
    arquivo: "02-d3-duvidas",
    momento: "D+3",
    etapa: "Principais dúvidas",
    gatilho: "Ainda não fez o primeiro pedido",
    assunto: "Dúvidas sobre a revenda?",
    preheader: "Veja como funciona o modelo do programa e as dúvidas mais comuns",
    titulo: "Tire suas dúvidas sobre a revenda",
    sugerido: ["titulo"],
    capa: { arquivo: "leads-capa-d3.jpg", alt: "Mulher sorrindo com produtos da linha Caju L'Occitane au Brésil" },
    blocos: [
      saudacao("!"),
      {
        tipo: "texto",
        paragrafos: [
          "Começar algo novo sempre costuma trazer dúvidas, e é natural querer entender tudo antes de realizar o primeiro pedido.",
          "Reunimos as dúvidas mais comuns que surgem antes de virar uma revendedora L'Occitane au Brésil, para você começar com mais segurança e confiança:"
        ]
      },
      { tipo: "subtitulo", texto: "Como e quanto preciso comprar?" },
      {
        tipo: "texto",
        paragrafos: [
          "O pedido mínimo é de <strong>R$&nbsp;360</strong>, já com o seu desconto aplicado. Você escolhe os produtos, paga no cartão em até <strong>10x sem juros</strong> e tem <strong>entrega gratuita</strong> em todo o Brasil."
        ]
      },
      { tipo: "subtitulo", texto: "O modelo funciona por consignação?" },
      {
        tipo: "texto",
        paragrafos: [
          "Não. Você compra com o seu percentual de revendedora e os produtos passam a ser seus, para vender no seu ritmo e lucrar a cada venda."
        ]
      },
      { tipo: "subtitulo", texto: "Nunca vendi e não sei para quem vender. Por onde começo?" },
      {
        tipo: "texto",
        paragrafos: [
          "A maioria das revendedoras começa exatamente assim. Suas primeiras clientes já estão por perto: família, amigas, colegas de trabalho. Você também conta com o acompanhamento da sua <strong>líder</strong>, que te orienta nos primeiros pedidos e mostra o que funciona na prática."
        ]
      },
      { tipo: "subtitulo", texto: "Recebo materiais para me apoiar nas vendas?" },
      {
        tipo: "texto",
        paragrafos: [
          "Você recebe a <strong>revista digital</strong> com os produtos e lançamentos de todos os ciclos, além de materiais de divulgação para as suas redes sociais. Você também ganha <strong>amostras</strong> em cada ciclo em que fizer pedido."
        ]
      },
      { tipo: "cta", rotulo: "Fazer meu primeiro pedido" },
      { tipo: "subtitulo", texto: "Ainda tem dúvidas?" },
      {
        tipo: "texto",
        paragrafos: [
          `Fale com um atendente pelo WhatsApp ${linkWhatsapp("clicando aqui")}. Nosso suporte funciona de segunda a sexta, das 9h às 18h.`
        ]
      },
      ASSINATURA
    ]
  },
  {
    codigo: "LOCCITANE_LEADS_D5_PRODUTOS",
    arquivo: "03-d5-quais-produtos-vender",
    momento: "D+5",
    etapa: "Quais produtos vender?",
    gatilho: "Ainda não fez o primeiro pedido",
    assunto: "Por quais produtos começar?",
    preheader: "Confira uma seleção com os queridinhos dos clientes",
    titulo: "Por quais produtos começar?",
    sugerido: ["titulo", "assinatura"],
    capa: { arquivo: "leads-capa-d5.jpg", alt: "Produtos da linha Jenipá L'Occitane au Brésil" },
    blocos: [
      saudacao(","),
      {
        tipo: "texto",
        paragrafos: [
          "Montar o primeiro pedido fica mais fácil quando você aposta no que já faz sucesso. Por isso, separamos quatro best sellers da L'Occitane au Brésil, que conquistaram nossos clientes e são ótimos para começar a revender."
        ]
      },
      ...DESTAQUES_BEST_SELLERS,
      { tipo: "subtitulo", texto: "Cada pedido conta para o seu crescimento" },
      {
        tipo: "texto",
        paragrafos: [
          "Com o primeiro pedido, você já começa no nível Bronze, com <strong>20% de lucro</strong>, e pode chegar a <strong>35% no nível Diamante</strong>.",
          "Ao atingir o valor de uma faixa em um ciclo, você sobe de nível automaticamente no ciclo seguinte. Seus pedidos também se somam ao longo do Período de Apuração, uma janela de quatro ciclos, e ao final dela o valor total define se você sobe, se mantém ou desce de nível."
        ]
      },
      { tipo: "cta", rotulo: "Fazer primeiro pedido" },
      ASSINATURA
    ]
  },
  {
    codigo: "LOCCITANE_LEADS_D8_BENEFICIOS",
    arquivo: "04-d8-beneficios-e-plano",
    momento: "D+8",
    etapa: "Principais benefícios e Plano de Crescimento",
    gatilho: "Ainda não fez o primeiro pedido",
    assunto: "Empreenda com uma marca que você ama",
    preheader: "Conheça as vantagens que crescem junto com seus pedidos",
    titulo: "Empreenda com uma marca que você ama",
    sugerido: ["titulo", "saudacao", "assinatura"],
    capa: { arquivo: "leads-capa-d8.jpg", alt: "Kit presente Bafafá L'Occitane au Brésil" },
    blocos: [
      saudacao(","),
      {
        tipo: "texto",
        paragrafos: [
          "Ser revendedora L'Occitane au Brésil é ter a oportunidade de empreender com o respaldo e a excelência de uma marca reconhecida mundialmente, com autonomia para construir uma renda que é sua.",
          "Além disso, nosso programa conta com uma estrutura completa para você vender e crescer conosco."
        ]
      },
      { tipo: "subtitulo", texto: "Vantagens desde o início" },
      {
        tipo: "lista",
        itens: [
          "Entrega gratuita para todo o Brasil",
          "Parcelamento em até 10x",
          "Amostras grátis em cada ciclo",
          "Acompanhamento e orientação de uma líder"
        ]
      },
      { tipo: "subtitulo", texto: "Um Clube de Benefícios que acompanha cada conquista" },
      {
        tipo: "clube",
        niveis: [
          { nivel: "Bronze", texto: "Domino's (30% off) e Sem Parar (98% off por 3 meses)" },
          { nivel: "Prata", texto: "Dafiti (até 80% off) e Extra.com (até 25% off)" },
          { nivel: "Ouro", texto: "Decolar (até R$ 200 de desconto) e cinemas (até 40% off)" },
          { nivel: "Diamante", texto: "Canon e Panasonic (até 30% off) e Thermas da Mata (22% off)" }
        ]
      },
      { tipo: "subtitulo", texto: "Quanto maior o valor dos seus pedidos, maior o seu lucro" },
      { tipo: "niveis" },
      {
        tipo: "texto",
        paragrafos: [
          "Você sobe de nível de duas formas: atingindo o valor de uma faixa em um único ciclo, o que garante a subida já no ciclo seguinte, ou somando pedidos ao longo do Período de Apuração, uma janela de quatro ciclos.",
          "Ao final do período, o valor total define se você sobe, se mantém ou desce de nível. Na prática, com <strong>R$&nbsp;500 em pedidos por ciclo</strong>, você chega ao Prata no período seguinte.",
          "Confira abaixo os benefícios disponíveis para você já no nível Bronze:"
        ]
      },
      { tipo: "cta", rotulo: "Benefícios nível Bronze", url: config.urlClube },
      ASSINATURA
    ]
  },
  {
    codigo: "LOCCITANE_LEADS_D10_RENDA_EXTRA",
    arquivo: "05-d10-renda-extra",
    momento: "D+10",
    etapa: "Gatilhos emocionais (renda extra, lucro de até 35%, trabalhe de casa)",
    gatilho: "Ainda não fez o primeiro pedido",
    assunto: "Sua nova fonte de renda começa agora",
    preheader: "Trabalhe de casa, defina seus horários e cresça a cada ciclo",
    titulo: "Sua nova fonte de renda começa agora",
    sugerido: ["titulo"],
    capa: { arquivo: "leads-capa-d10.jpg", alt: "Mulher sorrindo com o perfume Pudim L'Occitane au Brésil" },
    blocos: [
      saudacao(","),
      {
        tipo: "texto",
        paragrafos: [
          "Já imaginou ter uma renda extra fazendo algo de que você gosta, no seu tempo e de onde estiver? Com a revenda L'Occitane au Brésil, essa possibilidade começa com um único passo."
        ]
      },
      { tipo: "subtitulo", texto: "Do seu jeito, no seu ritmo" },
      {
        tipo: "texto",
        paragrafos: [
          "Você define os seus horários, escolhe como e para quem vender e pode trabalhar de casa, conciliando a revenda com a sua rotina."
        ]
      },
      { tipo: "subtitulo", texto: "Seu lucro pode chegar a 35%" },
      {
        tipo: "texto",
        paragrafos: [
          "Toda revendedora começa no nível Bronze, com <strong>20% de lucro</strong>. À medida que os seus pedidos crescem, seja em um único ciclo ou somados ao longo dos quatro ciclos do Período de Apuração, você avança de nível até chegar a <strong>35% no Diamante</strong>. Quanto mais você investe na sua revenda, maior é o retorno.",
          "A cada nível, você ainda desbloqueia descontos e promoções exclusivas em marcas parceiras no Clube de Benefícios.",
          "E o seu primeiro pedido ainda vem com um <strong>brinde especial de boas-vindas</strong>!"
        ]
      },
      { tipo: "cta", rotulo: "Fazer meu primeiro pedido" },
      ASSINATURA
    ]
  }
];
