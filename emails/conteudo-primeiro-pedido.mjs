/**
 * Régua de Primeiro Pedido: 7 e-mails para quem concluiu o cadastro e ainda não fez
 * o primeiro pedido. A revendedora sai da régua quando o pedido é feito.
 *
 * Fonte: "Régua - L'Occitane - Primeiro Pedido" (PDF). Os textos seguem o documento;
 * os pontos que o documento não traz estão marcados com `sugerido` e precisam de
 * aprovação da marca:
 *   - o título (H1) de cada peça, já que o layout V2 abre com um H1 sob a capa;
 *   - o preheader do D16, que veio em branco.
 *
 * Kit inicial: sugestão de cesta de best-sellers (não é obrigatório). Brinde: produto
 * grátis que vem automaticamente no primeiro pedido, seja ou não o kit sugerido.
 */
import { config as configBase } from "./conteudo.mjs";

export const config = {
  ...configBase,
  urlCta: configBase.urlPedidos,
  utm: { ...configBase.utm, campaign: "revenda_primeiro_pedido" },
  tags: {
    ...configBase.tags,
    // Merge tags: ajustar a sintaxe conforme o ESP.
    nome: "{{NOME}}",
    clube: "{{URL_CLUBE_BENEFICIOS}}"
  }
};

const NOME = config.tags.nome;

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
  alt: "Brinde exclusivo do primeiro pedido L'Occitane au Brésil",
  altura: 280
};

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
    capa: { arquivo: "hero-apresentacao.jpg", alt: "Revendedora L'Occitane au Brésil sorrindo com produtos da marca" },
    blocos: [
      saudacao("!"),
      {
        tipo: "texto",
        paragrafos: [
          "Seja bem-vinda ao Programa de Revendedoras L'Occitane au Brésil! Chegou a sua hora de vender Brasilidade e trilhar um caminho de sucesso junto com a L'Occitane au Brésil!",
          "Para que esse seu começo seja especial, preparamos um <strong>kit inicial</strong> com os queridinhos dos nossos consumidores, com produtos com alto potencial de venda para você começar a revender com mais confiança desde o primeiro pedido!"
        ]
      },
      KIT,
      { tipo: "texto", paragrafos: ["E tem mais: o seu primeiro pedido também vem acompanhado de um <strong>brinde especial</strong> para você!"] },
      BRINDE,
      { tipo: "texto", paragrafos: ["Faça seu primeiro pedido e comece a revender com os produtos que já conquistaram o Brasil!"] },
      { tipo: "cta", rotulo: "Fazer primeiro pedido" },
      ASSINATURA
    ]
  },
  {
    codigo: "LOCCITANE_PP_D4_BRINDE",
    arquivo: "02-d4-brinde",
    momento: "D+4",
    etapa: "Brinde",
    gatilho: "Ainda não fez o primeiro pedido",
    assunto: "Seu primeiro pedido tem um brinde especial para você!",
    preheader: "Escolha seus produtos, finalize a compra e receba um presente exclusivo.",
    titulo: "Um brinde exclusivo no seu primeiro pedido",
    sugerido: ["titulo"],
    capa: { arquivo: "hero-confirmacao.jpg", alt: "Creme corporal da linha Romã L'Occitane au Brésil" },
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
          "Além de ser um cuidado para a sua rotina, ele é uma ótima forma de experimentar a qualidade dos nossos produtos e falar sobre eles com propriedade para as suas clientes.",
          "Para garantir o seu, é simples: escolha os produtos que deseja revender, monte o seu carrinho e finalize o pedido. O brinde chega junto com a sua compra!"
        ]
      },
      { tipo: "cta", rotulo: "Montar meu carrinho" },
      ASSINATURA
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
    titulo: "Conheça o kit inicial da sua revenda",
    sugerido: ["titulo"],
    capa: { arquivo: "hero-beneficio.jpg", alt: "Produtos L'Occitane au Brésil em destaque" },
    blocos: [
      saudacao(","),
      {
        tipo: "texto",
        paragrafos: [
          "Você já conhece o brinde que acompanha o seu primeiro pedido. Agora queremos apresentar o outro presente que preparamos para o seu começo: o <strong>kit inicial</strong> da sua revenda."
        ]
      },
      KIT,
      {
        tipo: "texto",
        paragrafos: [
          "Os produtos foram escolhidos entre os mais procurados pelos nossos consumidores. Com eles em mãos, você mostra fragrâncias e texturas às suas clientes, apresenta a marca com segurança e transforma cada demonstração em oportunidade de venda.",
          "Com o kit e o brinde garantidos, você começa a revenda com tudo o que precisa para encantar suas clientes."
        ]
      },
      { tipo: "cta", rotulo: "Garantir meu kit inicial" },
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
    preheader: "Do bronze ao diamante, veja como evoluir na sua revenda.",
    titulo: "Quanto mais você vende, maior o seu lucro",
    sugerido: ["titulo"],
    capa: { arquivo: "hero-calculadora.jpg", alt: "Produtos da linha Capim-Limão L'Occitane au Brésil" },
    blocos: [
      saudacao(","),
      {
        tipo: "texto",
        paragrafos: [
          "A sua revenda L'Occitane au Brésil conta com o <strong>Plano de Crescimento</strong>, um modelo em que o seu lucro aumenta conforme as suas vendas evoluem.",
          "Toda revendedora começa no nível Bronze, com 20% de lucro. A partir daí, o valor das suas compras define até onde você pode chegar:"
        ]
      },
      { tipo: "niveis" },
      { tipo: "subtitulo", texto: "Dois caminhos para crescer" },
      {
        tipo: "pilares",
        itens: [
          {
            titulo: "Dentro do ciclo",
            texto: "Ao atingir o valor de uma faixa dentro de um ciclo, você sobe de nível automaticamente a partir do ciclo seguinte."
          },
          {
            titulo: "No Período de Apuração",
            texto: "Seus pedidos também se somam ao longo do Período de Apuração, que reúne quatro ciclos. Ao final dele, o valor total define o seu nível no período seguinte: você pode subir, se manter ou descer."
          }
        ]
      },
      {
        tipo: "destaque",
        titulo: "Na prática",
        texto: "Com R$ 500 em pedidos por ciclo, você soma R$ 2.000 no período e começa o próximo no nível <strong>Prata</strong>. Com R$ 1.500 por ciclo, chega ao <strong>Ouro</strong>. Com R$ 5.000, ao <strong>Diamante</strong>."
      },
      {
        tipo: "destaque",
        titulo: "Fique atenta",
        texto: "Para que o pedido conte no plano, o boleto à vista precisa estar pago e aprovado até o último dia do ciclo."
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
    preheader: "Descontos em marcas parceiras que aumentam a cada nível da sua revenda.",
    titulo: "Um clube de benefícios que cresce com você",
    sugerido: ["titulo", "preheader"],
    capa: { arquivo: "hero-overview.jpg", alt: "Perfume Brésil da L'Occitane au Brésil com pimenta-rosa" },
    blocos: [
      saudacao(","),
      {
        tipo: "texto",
        paragrafos: [
          "Além do lucro em cada venda, a sua revenda L'Occitane au Brésil dá acesso a um <strong>clube de benefícios</strong> com descontos em marcas parceiras para o seu dia a dia. E, assim como o seu lucro, as vantagens aumentam a cada nível do Plano de Crescimento."
        ]
      },
      {
        tipo: "beneficios",
        itens: [
          {
            nivel: "Bronze",
            texto: "Desde o início, você aproveita descontos em parceiros como Domino's (30% off), Sem Parar (98% off por 3 meses), Buser e Flixbus (15% off), além de cursos de idiomas no CNA e no Mondly."
          },
          {
            nivel: "Prata",
            texto: "Chegam as marcas de moda e esporte: até 80% off na Dafiti, até 25% off em todo o site do Extra.com, 28% off na Conquer e descontos na Netshoes, na Mizuno e na Fila."
          },
          {
            nivel: "Ouro",
            texto: "O clube ganha viagens, lazer e educação: até R$ 200 de desconto na Decolar, até 40% off em cinemas, 70% off na Open English, até 67% off na Wizard e planos da Alia Seguros a partir de R$ 39,90 por mês."
          },
          {
            nivel: "Diamante",
            texto: "O nível mais alto reúne parceiros premium: até 30% off em Canon e Panasonic, 22% off no Thermas da Mata, 15% off na Meliá Hotéis e condições exclusivas na Vivara e na Chandon."
          }
        ]
      },
      {
        tipo: "texto",
        paragrafos: [
          "E os benefícios se acumulam: a cada nível conquistado, você mantém as vantagens anteriores e desbloqueia novas."
        ]
      },
      { tipo: "cta", rotulo: "Fazer meu primeiro pedido" },
      { tipo: "link", rotulo: "Ver todos os benefícios do clube", url: config.tags.clube },
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
    capa: { arquivo: "hero-marca.jpg", alt: "Parede de produtos L'Occitane au Brésil", altura: 460 },
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
      ASSINATURA
    ]
  },
  {
    codigo: "LOCCITANE_PP_D24_DEPOIMENTOS",
    arquivo: "07-d24-depoimentos",
    momento: "D+24",
    etapa: "Depoimentos",
    gatilho: "Ainda não fez o primeiro pedido",
    assunto: "Elas já deram o primeiro passo, agora é sua vez!",
    preheader: "Inspire-se com histórias reais de quem já vende nossa Brasilidade.",
    titulo: "Elas já deram o primeiro passo. Agora é a sua vez",
    sugerido: ["titulo"],
    capa: { arquivo: "hero-prova-social.jpg", alt: "Produtos da linha Romã L'Occitane au Brésil sobre fundo rosa" },
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
