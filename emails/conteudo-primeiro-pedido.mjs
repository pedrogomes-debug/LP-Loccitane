/**
 * Régua de Primeiro Pedido (V2): 7 e-mails para quem concluiu o cadastro e ainda não fez
 * o primeiro pedido. A revendedora sai da régua quando o pedido é feito.
 *
 * Fonte: "[Correções] Régua - L'Occitane - Primeiro Pedido" (PDF). Os textos seguem o
 * documento; os pontos que ele não traz estão marcados com `sugerido` e precisam de
 * aprovação da marca:
 *   - o título (H1) de cada peça, já que o layout V2 abre com um H1 sob a capa;
 *   - o brinde: o PDF lista cremes de mãos Brésil (mais de R$ 140), mas o brinde vigente
 *     é o da arte "Iniciou, ganhou!" (Nosso Abraço, R$ 264,98), que vale para as peças;
 *   - a lista de benefícios do nível Bronze, que o PDF deixa como "*Benefícios bronze".
 *
 * Kit inicial: sugestão de cesta de best-sellers (não é obrigatório), código 0853.
 * Brinde: produto grátis que vem automaticamente no primeiro pedido, seja ou não o kit.
 */
import { config as configBase } from "./conteudo.mjs";

export const config = {
  ...configBase,
  urlCta: configBase.urlPedidos,
  /** O clube fica dentro do Escritório Virtual: não há página pública para ele. */
  urlClube: configBase.urlPedidos,
  utm: { ...configBase.utm, campaign: "revenda_primeiro_pedido" },
  tags: {
    ...configBase.tags,
    // Merge tag: ajustar a sintaxe conforme o ESP.
    nome: "{{NOME}}"
  }
};

/** Substituído pela URL do CTA (com UTM) na montagem de cada peça. */
export const URL_CTA = "__URL_CTA__";

const NOME = config.tags.nome;
const CODIGO_KIT = "0853";

/** Sugestão de kit inicial (best-sellers indicados na landing). */
const KIT = {
  tipo: "produtos",
  itens: [
    { arquivo: "kit-geleia-roma.jpg", nome: "Geleia Hidratante Romã 200 ml", alt: "Geleia Hidratante Corporal Romã 200 ml" },
    { arquivo: "kit-deo-capim.jpg", nome: "Deo Colônia Capim-Limão 100 ml", alt: "Deo Colônia Capim-Limão 100 ml" },
    { arquivo: "kit-caju-viagem.jpg", nome: "Kit Caju Viagem", alt: "Kit Caju Viagem com creme e óleo corporal" },
    { arquivo: "kit-sacolas.jpg", nome: "Sacolas para entrega", alt: "Sacola de presente L'Occitane au Brésil" }
  ]
};

const BRINDE = {
  tipo: "imagem",
  arquivo: "brinde.jpg",
  alt: "Iniciou, ganhou! Faça o seu primeiro pedido e ganhe 1 Sabonete Líquido Corporal Nosso Abraço 200 ml e 1 Deo Colônia Nosso Abraço 75 ml. Seus brindes valem R$ 264,98",
  largura: 900,
  altura: 1600,
  exibir: 320
};

const BRINDE_ITENS = ["1x Sabonete Líquido Corporal Nosso Abraço 200 ml", "1x Deo Colônia Nosso Abraço 75 ml"];
const BRINDE_VALOR = "R$&nbsp;264,98";

const NOTA_BRINDE = {
  tipo: "nota",
  texto:
    "Promoção exclusiva para novos revendedores que fizerem o primeiro pedido, válida de 29/10/2026 a 18/11/2026 ou enquanto durarem os estoques. Limitado a 1 uso por CPF. Imagens meramente ilustrativas."
};

const COMO_PEDIR = [
  { tipo: "subtitulo", texto: "Como faço o pedido?" },
  {
    tipo: "lista",
    itens: [
      `Acesse o <a href="${URL_CTA}" class="t-red" style="color:#C02031;font-weight:bold;text-decoration:underline;">Escritório Virtual do Revendedor</a>.`,
      `Escolha seus produtos favoritos e monte seu pedido. Para adicionar nossa sugestão de kit inicial ao seu carrinho, use o código: <strong>${CODIGO_KIT}</strong>`,
      "Finalize sua compra!"
    ]
  }
];

const saudacao = (pontuacao = "!") => ({ tipo: "saudacao", texto: `Olá, ${NOME}${pontuacao}` });
const ASSINATURA = { tipo: "assinatura" };

export const pecas = [
  {
    codigo: "LOCCITANE_PP_D0_BOAS_VINDAS",
    arquivo: "01-d0-boas-vindas",
    momento: "D+0",
    etapa: "Boas-vindas + login",
    gatilho: "Cadastro concluído na LP",
    assunto: "Seu cadastro de revendedora tem um presente esperando!",
    preheader: "Kit inicial e brinde exclusivo acompanham o seu primeiro pedido.",
    titulo: "Seu primeiro pedido tem um presente esperando por você",
    sugerido: ["titulo"],
    capa: { arquivo: "capa-d0.jpg", alt: "Revendedora sorrindo com produtos da linha Caju L'Occitane au Brésil" },
    blocos: [
      saudacao("!"),
      {
        tipo: "texto",
        paragrafos: [
          "Seja bem-vinda ao programa de Revendedoras! Chegou a sua hora de vender Brasilidade e trilhar um caminho de sucesso junto com a L'Occitane au Brésil!",
          "Para que esse seu começo seja especial, preparamos uma <strong>sugestão de kit inicial</strong> com os queridinhos dos nossos consumidores, com produtos com alto potencial de venda para você começar a revender com mais confiança desde o primeiro pedido!"
        ]
      },
      KIT,
      { tipo: "texto", paragrafos: ["E tem mais: o seu primeiro pedido também vem acompanhado de um <strong>brinde especial</strong> para você!"] },
      BRINDE,
      ...COMO_PEDIR,
      {
        tipo: "texto",
        paragrafos: [
          "Lembramos que nosso kit inicial é apenas uma sugestão. Você tem total liberdade de personalizar seu pedido do seu jeito e com os itens que preferir.",
          "Conclua agora seu primeiro pedido e comece a revender com os produtos que já conquistaram o Brasil!"
        ]
      },
      { tipo: "cta", rotulo: "Fazer primeiro pedido" },
      ASSINATURA,
      NOTA_BRINDE
    ]
  },
  {
    codigo: "LOCCITANE_PP_D4_BRINDE",
    arquivo: "02-d4-brinde",
    momento: "D+4",
    etapa: "Brinde",
    gatilho: "Ainda não fez o primeiro pedido",
    assunto: "Seu primeiro pedido tem um brinde especial para você!",
    preheader: "Escolha seus produtos, finalize a compra e receba um presente exclusivo",
    titulo: "Um brinde exclusivo no seu primeiro pedido",
    sugerido: ["titulo", "brinde"],
    capa: { arquivo: "capa-d4.jpg", alt: "Caixa de presente L'Occitane au Brésil com produtos da linha Bafafá" },
    blocos: [
      saudacao("!"),
      {
        tipo: "texto",
        paragrafos: [
          "Que tal começar sua revenda ganhando um presente? Ao fazer o seu primeiro pedido, você recebe um <strong>brinde exclusivo</strong> da L'Occitane au Brésil pensado especialmente para você."
        ]
      },
      BRINDE,
      {
        tipo: "texto",
        paragrafos: [
          "Além de ser um cuidado para a sua rotina, ele é uma ótima forma de experimentar a qualidade dos nossos produtos e falar sobre eles com propriedade para suas clientes."
        ]
      },
      { tipo: "subtitulo", texto: "O que você ganha:" },
      { tipo: "lista", itens: BRINDE_ITENS },
      {
        tipo: "texto",
        paragrafos: [`Conclua seu primeiro pedido e ganhe <strong>${BRINDE_VALOR}</strong> em brindes exclusivos!`]
      },
      { tipo: "cta", rotulo: "Montar meu carrinho" },
      ASSINATURA,
      NOTA_BRINDE
    ]
  },
  {
    codigo: "LOCCITANE_PP_D8_KIT",
    arquivo: "03-d8-kit-inicial",
    momento: "D+8",
    etapa: "Kit inicial",
    gatilho: "Ainda não fez o primeiro pedido",
    assunto: "Os favoritos dos nossos consumidores, direto para suas mãos",
    preheader: "Produtos escolhidos para você apresentar a marca e vender desde o início.",
    titulo: "Conheça a nossa sugestão de kit inicial",
    sugerido: ["titulo"],
    capa: { arquivo: "capa-d8.jpg", alt: "Produtos da linha Caju L'Occitane au Brésil" },
    blocos: [
      saudacao(","),
      {
        tipo: "texto",
        paragrafos: [
          "Você já conhece o brinde que acompanha o seu primeiro pedido. Agora, queremos apresentar uma <strong>sugestão de Kit Inicial</strong> para você dar seus primeiros passos como Revendedora L'Occitane au Brésil com mais confiança e segurança!"
        ]
      },
      KIT,
      {
        tipo: "texto",
        paragrafos: [
          "Selecionamos essa sugestão de kit inicial com base nos produtos mais procurados pelos nossos consumidores. Com eles em mãos, você mostra fragrâncias e texturas às suas clientes, apresenta a marca com segurança e transforma cada demonstração em oportunidade de venda.",
          "Com a nossa sugestão de kit e o brinde garantidos, você começa a revenda com tudo o que precisa para encantar suas clientes!",
          "Vale destacar que o kit é apenas uma sugestão. Você tem total liberdade de personalizar seu pedido do seu jeito e com os itens que preferir."
        ]
      },
      ...COMO_PEDIR,
      { tipo: "cta", rotulo: "Montar meu primeiro pedido" },
      ASSINATURA
    ]
  },
  {
    codigo: "LOCCITANE_PP_D12_NIVEIS",
    arquivo: "04-d12-plano-de-crescimento",
    momento: "D+12",
    etapa: "Mecânicas e vantagens de cada nível",
    gatilho: "Ainda não fez o primeiro pedido",
    assunto: "Quanto mais você vende, maior seu lucro!",
    preheader: "Do bronze ao diamante, veja como evoluir na sua revenda",
    titulo: "Quanto mais você vende, maior o seu lucro",
    sugerido: ["titulo"],
    capa: { arquivo: "capa-d12.jpg", alt: "Produtos da linha Pudim L'Occitane au Brésil" },
    blocos: [
      saudacao(","),
      {
        tipo: "texto",
        paragrafos: [
          "A sua revenda L'Occitane au Brésil conta com o <strong>Plano de Crescimento</strong>, um modelo em que o seu lucro aumenta conforme as suas vendas evoluem.",
          "Você começa no nível Bronze, com 20% de lucro. A partir daí, o valor das suas compras define até onde você pode chegar:"
        ]
      },
      { tipo: "niveis" },
      {
        tipo: "texto",
        paragrafos: [
          "Além de aumentar seu lucro a cada nível, você também conquista vantagens e promoções cada vez maiores no nosso <strong>Clube de Benefícios</strong> exclusivo!"
        ]
      },
      { tipo: "cta", rotulo: "Começar meu Plano de Crescimento" },
      ASSINATURA
    ]
  },
  {
    codigo: "LOCCITANE_PP_D16_CLUBE",
    arquivo: "05-d16-clube-de-beneficios",
    momento: "D+16",
    etapa: "Benefícios por nível",
    gatilho: "Ainda não fez o primeiro pedido",
    assunto: "Um clube de benefícios exclusivo para você!",
    preheader: "Confira todas as vantagens por nível que te esperam",
    titulo: "Um clube de benefícios que cresce com você",
    sugerido: ["titulo", "beneficios"],
    capa: { arquivo: "capa-d16.jpg", alt: "Revendedora sorrindo com produtos da linha Romã L'Occitane au Brésil" },
    blocos: [
      saudacao(","),
      {
        tipo: "texto",
        paragrafos: [
          "Além do lucro em cada venda, a sua revenda L'Occitane au Brésil dá acesso a um <strong>clube de benefícios</strong> com descontos em marcas parceiras para o seu dia a dia. E, assim como o seu lucro, as vantagens aumentam a cada nível do Plano de Crescimento.",
          "Confira as promoções e descontos que já estão disponíveis para você no nível Bronze:"
        ]
      },
      {
        tipo: "beneficios",
        nivel: "Bronze",
        itens: [
          { parceiro: "Domino's", oferta: "30% off" },
          { parceiro: "Sem Parar", oferta: "98% off por 3 meses" },
          { parceiro: "Buser e Flixbus", oferta: "15% off" },
          { parceiro: "CNA e Mondly", oferta: "descontos em cursos de idiomas" }
        ]
      },
      {
        tipo: "texto",
        paragrafos: [
          "Os benefícios se acumulam: a cada nível conquistado, você mantém as vantagens anteriores e desbloqueia novas."
        ]
      },
      { tipo: "cta", rotulo: "Fazer meu primeiro pedido" },
      { tipo: "link", rotulo: "Ver todos os benefícios do clube", url: config.urlClube },
      {
        tipo: "texto",
        paragrafos: [
          "Comece pelo primeiro pedido e aproveite um clube completo com benefícios exclusivos pensados para você!"
        ]
      },
      ASSINATURA
    ]
  },
  {
    codigo: "LOCCITANE_PP_D20_LEMBRETE",
    arquivo: "06-d20-lembrete",
    momento: "D+20",
    etapa: "Ainda não fez o primeiro pedido?",
    gatilho: "Ainda não fez o primeiro pedido",
    assunto: `${NOME}, ainda não fez seu primeiro pedido?`,
    preheader: "Nosso kit inicial e brinde exclusivo te esperam!",
    titulo: "Seu kit e seu brinde continuam esperando por você",
    sugerido: ["titulo"],
    capa: { arquivo: "capa-d20.jpg", alt: "Produtos das linhas Chamego e Bafafá L'Occitane au Brésil" },
    blocos: [
      saudacao(","),
      {
        tipo: "texto",
        paragrafos: [
          "Passando para lembrar: o <strong>kit inicial</strong> e o <strong>brinde exclusivo</strong> do seu primeiro pedido continuam disponíveis para você!"
        ]
      },
      KIT,
      BRINDE,
      {
        tipo: "texto",
        paragrafos: [
          "São dois presentes pensados para impulsionar o seu começo: produtos para apresentar às suas clientes e um brinde especial para a sua rotina.",
          "Garantir os dois leva poucos minutos: escolha seus produtos, monte o carrinho e finalize o pedido."
        ]
      },
      { tipo: "cta", rotulo: "Garantir meu kit e meu brinde" },
      { tipo: "texto", paragrafos: ["Seus presentes estão esperando. Aproveite agora!"] },
      ASSINATURA,
      NOTA_BRINDE
    ]
  },
  {
    codigo: "LOCCITANE_PP_D24_DEPOIMENTOS",
    arquivo: "07-d24-depoimentos",
    momento: "D+24",
    etapa: "Depoimentos",
    gatilho: "Ainda não fez o primeiro pedido",
    assunto: "Elas já deram o primeiro passo, agora é sua vez!",
    preheader: "Inspire-se com histórias reais de quem já vende nossa Brasilidade",
    titulo: "Elas já deram o primeiro passo. Agora é a sua vez",
    sugerido: ["titulo"],
    capa: { arquivo: "capa-d24.jpg", alt: "Revendedora sorrindo com o perfume Brésil L'Occitane au Brésil" },
    blocos: [
      saudacao(","),
      {
        tipo: "texto",
        paragrafos: [
          "Nada inspira mais do que histórias reais. Quer saber como é revender L'Occitane au Brésil na prática? Quem conta são as nossas revendedoras:"
        ]
      },
      {
        tipo: "depoimento",
        texto: "Vender L'Occitane au Brésil é um prazer, pois cada linha conta uma história única, trazendo a riqueza da nossa terra em fragrâncias encantadoras e muito exclusivas.",
        autor: "Larissa Cecato de Oliveira",
        detalhe: "revendedora desde setembro de 2023"
      },
      {
        tipo: "depoimento",
        texto: "Comecei minha jornada no mundo da beleza com a L'Occitane au Brésil e, desde então, minha vida se transformou. (...) Ser revendedora me trouxe crescimento, e liderar uma equipe me mostrou que, juntos, podemos ir ainda mais longe.",
        autor: "Jaqueline Cotrim de Almeida Lima",
        detalhe: "revendedora desde agosto de 2024"
      },
      {
        tipo: "depoimento",
        texto: "No início, não vendia porque ninguém conhecia a marca, mas depois, com o marketing da marca e a demonstração dos produtos para as clientes, as vendas foram um sucesso.",
        autor: "Andrea Dias Pinto Croce",
        detalhe: "revendedora desde janeiro de 2024"
      },
      {
        tipo: "texto",
        paragrafos: [
          "São histórias diferentes, com um ponto em comum: todas começaram com produtos em mãos e vontade de crescer. O seu kit inicial e o seu brinde continuam à sua espera para que a sua história comece também."
        ]
      },
      { tipo: "cta", rotulo: "Fazer meu primeiro pedido" },
      ASSINATURA
    ]
  }
];
