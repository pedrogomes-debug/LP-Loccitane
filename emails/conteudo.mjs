/**
 * Conteúdo das peças da jornada de revenda.
 *
 * São 4 criativos (E1 Apresentação, E2 Reforço, E3 Benefício e Confirmação).
 * A régua de disparo usa esses mesmos 4 layouts em 11 momentos diferentes:
 * o que muda em cada disparo é o assunto, o título (H1) e o preheader.
 *
 * Por isso o corpo dos criativos é neutro: o E1 precisa funcionar no D+0 e no
 * reenvio do D+4, e o E3 precisa funcionar tanto como "As vantagens" quanto
 * como "Última chamada". Nada de "conforme e-mail anterior" no texto fixo.
 *
 * Fontes: régua "Jornada para a LP - L'Occitane" e documento
 * "Títulos e Assuntos - Revenda L'Occitane".
 */

export const config = {
  // TROCAR pela URL final da landing page antes de subir para o ESP.
  urlLp: "https://revendedor.loccitaneaubresil.com/",
  urlPedidos: "https://revendedor.loccitaneaubresil.com/",
  urlWhatsapp: "https://wa.me/5511975743863",
  urlInstagram: "https://www.instagram.com/loccitaneaubresil/",
  // TROCAR pelo domínio/CDN que vai hospedar as imagens (HTTPS e acesso público).
  baseImagens: "https://SEU-DOMINIO.com.br/email/revenda",
  utm: { source: "email", medium: "crm", campaign: "revenda_lp" },
  // Merge tags: ajustar a sintaxe conforme o ESP (Salesforce, RD Station, HubSpot...).
  tags: {
    descadastro: "{{URL_DESCADASTRO}}",
    preferencias: "{{URL_PREFERENCIAS}}",
    espelho: "{{URL_ESPELHO}}"
  },
  remetente: {
    nome: "L'Occitane au Brésil",
    // Subdomínio dedicado protege a reputação do domínio principal.
    email: "revenda@e.loccitaneaubresil.com.br",
    respostas: "atendimento@loccitaneaubresil.com.br",
    // TROCAR pelos dados cadastrais reais: exigência legal e critério de filtro antispam.
    razaoSocial: "[RAZÃO SOCIAL]",
    cnpj: "[CNPJ]",
    endereco: "[ENDEREÇO COMPLETO, CIDADE/UF, CEP]"
  }
};

const DEPOIMENTOS = {
  larissa: {
    texto:
      "Vender L'Occitane au Brésil é um prazer, pois cada linha conta uma história única, trazendo a riqueza da nossa terra em fragrâncias encantadoras e muito exclusivas.",
    autor: "Larissa Cecato",
    detalhe: "revendedora desde setembro de 2023"
  },
  monise: {
    texto:
      "Experiência muito positiva. Produtos maravilhosos e clientes que sempre voltam para comprar de novo.",
    autor: "Monise Vitor",
    detalhe: "revendedora desde janeiro de 2023"
  },
  andrea: {
    texto:
      "No início, ninguém conhecia a marca. Depois, com o marketing e a demonstração dos produtos para as clientes, as vendas foram um sucesso!",
    autor: "Andrea Croce",
    detalhe: "revendedora desde janeiro de 2024"
  }
};

/**
 * Cenários da peça da calculadora. Os números seguem a mesma fórmula da calculadora
 * da landing page: preço de revista = compra / (1 - desconto) e lucro = revista - compra.
 * Os valores de compra foram escolhidos dentro de cada faixa para dar resultado redondo.
 */
const SIMULACAO = [
  { compra: "R$ 360", desconto: "20%", vende: "R$ 450", lucro: "R$ 90" },
  { compra: "R$ 2.250", desconto: "25%", vende: "R$ 3.000", lucro: "R$ 750" },
  { compra: "R$ 6.300", desconto: "30%", vende: "R$ 9.000", lucro: "R$ 2.700" },
  { compra: "R$ 20.800", desconto: "35%", vende: "R$ 32.000", lucro: "R$ 11.200" }
];

const LINHAS = [
  { arquivo: "linha-roma.jpg", alt: "Produtos da linha Romã", legenda: "Linha Romã" },
  { arquivo: "linha-caju.jpg", alt: "Produtos da linha Caju", legenda: "Linha Caju" },
  { arquivo: "linha-capim.jpg", alt: "Produtos da linha Capim-Limão", legenda: "Linha Capim-Limão" }
];

const EXEMPLO_CONTA = {
  tipo: "destaque",
  titulo: "Exemplo de conta",
  texto:
    "Uma compra de R$ 360 com 20% de desconto equivale a R$ 450 em produtos pelo preço da revista. Vendendo tudo, o seu lucro é de <strong>R$ 90</strong> — e essa margem cresce conforme o valor que você compra no período."
};

/**
 * Versão do E2, que abre pela faixa de margem: ela absorveu o pilar "Margem de
 * 20% a 35%", removido dos diferenciais. O E3 segue com a versão de cima, porque
 * lá a régua de descontos vem logo antes da caixa e repetiria a informação.
 */
const EXEMPLO_CONTA_COM_MARGEM = {
  tipo: "destaque",
  titulo: "Exemplo de conta",
  texto:
    "Sua margem pode ir de 20% até 35%. Uma compra de R$ 360 com 20% de desconto, por exemplo, equivale a R$ 450 em produtos pelo preço da revista. Vendendo tudo, o seu lucro é de <strong>R$ 90</strong> e essa margem cresce conforme o valor que você compra no período."
};

/** Rótulo único de CTA nas peças de marketing. A confirmação usa o seu próprio. */
const CTA = "Quero ser revendedora L'Occitane";

/**
 * Os 4 criativos. `titulo`, `assunto` e `preheader` de cada disparo entram depois,
 * na lista `disparos`.
 */
export const criativos = {
  e1: {
    id: "e1",
    nome: "E1 — Apresentação",
    tipo: "marketing",
    capa: {
      arquivo: "hero-apresentacao.jpg",
      alt: "Revendedora L'Occitane au Brésil sorrindo com produtos da marca"
    },
    blocos: [
      {
        tipo: "texto",
        paragrafos: [
          "O Programa de Revendedoras L'Occitane au Brésil convida você a fazer parte de uma marca que une a natureza brasileira à essência francesa, e transformar essa união em uma nova fonte de renda.",
          "A lógica é simples: <strong>você compra com desconto e vende pelo preço da revista</strong>. A diferença entre os dois valores fica com você."
        ]
      },
      { tipo: "cta", rotulo: CTA },
      {
        tipo: "pilares",
        itens: [
          {
            titulo: "Desconto progressivo",
            texto:
              "Você começa com 20% e pode chegar até 35%. Quanto maior seu volume de compras no período, maior o seu desconto."
          },
          {
            titulo: "Frete grátis para todo o Brasil",
            texto:
              "A compra mínima é de R$ 360, com pagamento em até 10x sem juros no cartão ou no boleto."
          },
          {
            titulo: "Apoio de uma líder e suporte",
            texto:
              "Ela orienta seus primeiros pedidos por WhatsApp e o SAC complementa seu suporte. Você ainda recebe revistas digitais, materiais para redes sociais e amostras a cada ciclo."
          }
        ]
      },
      { tipo: "cta", rotulo: CTA },
      { tipo: "subtitulo", texto: "Produtos que suas clientes já conhecem" },
      { tipo: "trio", itens: LINHAS },
      { tipo: "depoimento", ...DEPOIMENTOS.larissa },
      {
        tipo: "nota",
        texto: "O cadastro leva cerca de 2 minutos, não tem custo e não exige CNPJ."
      }
    ]
  },

  e2: {
    id: "e2",
    nome: "E2 — Reforço",
    tipo: "marketing",
    capa: {
      arquivo: "hero-marca.jpg",
      altura: 460,
      alt: "Linhas de produtos L'Occitane au Brésil lado a lado"
    },
    blocos: [
      {
        tipo: "texto",
        paragrafos: [
          "Nossas linhas especiais Romã, Caju e Capim-Limão têm fragrância, textura e história que as clientes valorizam e reconhecem. Quem prova, compra de novo. Você entra com a indicação e a força da L'Occitane abre o caminho."
        ]
      },
      { tipo: "cta", rotulo: CTA },
      {
        tipo: "pilares",
        itens: [
          {
            titulo: "Sem burocracia",
            texto: "Cadastro gratuito, sem CNPJ, sem prova e sem meta obrigatória todo mês."
          },
          {
            titulo: "Orientação e suporte",
            texto:
              "Você conta com uma líder direta no WhatsApp e com o atendimento oficial de segunda a sexta, das 9h às 18h."
          }
        ]
      },
      { tipo: "subtitulo", texto: "Como funciona na prática" },
      {
        tipo: "passos",
        itens: [
          {
            titulo: "Faça seu cadastro",
            texto: "É online, leva cerca de 2 minutos e não tem nenhum custo."
          },
          {
            titulo: "Escolha seus produtos",
            texto:
              "Você monta o pedido no site de revendedoras, com o mínimo de R$ 360 já com o seu desconto aplicado."
          },
          {
            titulo: "Venda e receba",
            texto:
              "Os produtos chegam na sua casa com frete grátis. Você vende pelo preço da revista e fica com a diferença."
          }
        ]
      },
      EXEMPLO_CONTA_COM_MARGEM,
      { tipo: "cta", rotulo: CTA },
      { tipo: "depoimento", ...DEPOIMENTOS.monise }
    ]
  },

  e3: {
    id: "e3",
    nome: "E3 — Benefício",
    tipo: "marketing",
    capa: {
      arquivo: "hero-beneficio.jpg",
      alt: "Produtos das linhas L'Occitane au Brésil sobre fundo colorido"
    },
    blocos: [
      {
        tipo: "texto",
        paragrafos: [
          "Na revenda L'Occitane au Brésil, o seu desconto é definido pelo valor que você compra em cada período. Ele começa em 20% e chega a 35%."
        ]
      },
      { tipo: "cta", rotulo: CTA },
      { tipo: "regua" },
      EXEMPLO_CONTA,
      { tipo: "cta", rotulo: CTA },
      { tipo: "subtitulo", texto: "Perguntas rápidas" },
      {
        tipo: "pilares",
        itens: [
          {
            titulo: "Como e quanto preciso comprar?",
            texto:
              "O pedido mínimo é R$ 360, já com o seu desconto aplicado. Você escolhe os produtos, paga no cartão em até 10x sem juros e tem entrega gratuita em todo Brasil."
          },
          {
            titulo: "Preciso comprar todo mês?",
            texto:
              "Não. Você pode ficar até 6 ciclos sem comprar, e ainda dá para reativar o cadastro depois."
          },
          {
            titulo: "Preciso ter CNPJ?",
            texto: "Não. Basta ter mais de 18 anos e CPF para se cadastrar."
          }
        ]
      },
      {
        tipo: "lider",
        texto:
          "<strong>Você não começa sozinha.</strong> Uma líder fala com você pelo <a href=\"__WHATSAPP__\" style=\"color:#4A3830;\">WhatsApp</a> e te ensina a vender desde a primeira compra."
      },
      {
        tipo: "nota",
        texto: "O cadastro é gratuito e leva cerca de 2 minutos."
      }
    ]
  },

  /** M3 da régua de 14/08: leva o lead para a calculadora de ganhos da landing page. */
  calculadora: {
    id: "calculadora",
    nome: "E3 — Calculadora",
    tipo: "marketing",
    capa: {
      arquivo: "hero-calculadora.jpg",
      alt: "Águas perfumadas L'Occitane au Brésil com frutas brasileiras"
    },
    blocos: [
      {
        tipo: "texto",
        paragrafos: [
          "Você não precisa começar no escuro para saber quanto ganha. Na página do programa tem uma calculadora: você coloca o valor que pretende comprar e ela mostra na hora por quanto revender e quanto sobra para você.",
          "A conta é sempre a mesma: <strong>você compra com desconto e vende pelo preço da revista</strong>. Quanto maior a sua compra no período, maior o desconto e maior a diferença que fica no seu bolso."
        ]
      },
      { tipo: "cta", rotulo: CTA },
      { tipo: "subtitulo", texto: "Quanto dá para ganhar" },
      { tipo: "simulacao", itens: SIMULACAO },
      {
        tipo: "destaque",
        titulo: "Como ler a tabela",
        texto:
          "O desconto vem da faixa em que a sua compra cai no período: começa em 20% e chega a 35%. Você revende pelo preço da revista e a diferença é o seu lucro."
      },
      { tipo: "cta", rotulo: CTA },
      {
        tipo: "nota",
        texto:
          "Os valores acima são exemplos. Na calculadora você testa o valor que faz sentido para você, a partir da compra mínima de R$ 360."
      }
    ]
  },

  /** M4 da régua de 14/08: prova social com depoimentos de revendedoras reais. */
  provaSocial: {
    id: "provaSocial",
    nome: "E4 — Prova Social",
    tipo: "marketing",
    capa: {
      arquivo: "hero-prova-social.jpg",
      alt: "Produtos da linha Romã L'Occitane au Brésil sobre fundo rosa"
    },
    blocos: [
      {
        tipo: "texto",
        paragrafos: [
          "Quem já vende explica melhor do que qualquer anúncio. Estas são revendedoras que começaram exatamente onde você está agora: sem CNPJ, sem experiência e com uma primeira compra de R$ 360."
        ]
      },
      { tipo: "cta", rotulo: CTA },
      { tipo: "depoimento", ...DEPOIMENTOS.larissa, foto: "depo-larissa.jpg" },
      { tipo: "depoimento", ...DEPOIMENTOS.andrea, foto: "depo-andrea.jpg" },
      { tipo: "depoimento", ...DEPOIMENTOS.monise, foto: "depo-monise.jpg" },
      {
        tipo: "destaque",
        titulo: "O que elas tinham no começo",
        texto:
          "Cadastro gratuito, uma líder no WhatsApp para orientar os primeiros pedidos e frete grátis para todo o Brasil. É o mesmo ponto de partida que está disponível para você."
      },
      { tipo: "cta", rotulo: CTA },
      {
        tipo: "nota",
        texto: "O cadastro leva cerca de 2 minutos, não tem custo e não exige CNPJ."
      }
    ]
  },

  /** M5 da régua de 14/08: overview do programa inteiro, último e-mail da onda. */
  overview: {
    id: "overview",
    nome: "E5 — Overview do Programa",
    tipo: "marketing",
    capa: {
      arquivo: "hero-overview.jpg",
      alt: "Perfume Brésil da L'Occitane au Brésil com pimenta-rosa"
    },
    blocos: [
      {
        tipo: "texto",
        paragrafos: [
          "Este é o Programa de Revendedoras L'Occitane au Brésil inteiro, em um e-mail: o que você recebe, como funciona e quanto dá para ganhar."
        ]
      },
      { tipo: "cta", rotulo: CTA },
      { tipo: "subtitulo", texto: "O que você tem como revendedora" },
      {
        tipo: "pilares",
        itens: [
          {
            titulo: "Desconto de 20% a 35%",
            texto:
              "Você compra com desconto e vende pelo preço da revista. Quanto maior a compra no período, maior a sua margem."
          },
          {
            titulo: "Frete grátis e pagamento facilitado",
            texto:
              "Compra mínima de R$ 360, em até 10x sem juros no cartão ou no boleto, com entrega gratuita para todo o Brasil."
          },
          {
            titulo: "Apoio de uma líder e suporte",
            texto:
              "Ela orienta seus primeiros pedidos por WhatsApp e o SAC complementa seu suporte, de segunda a sexta, das 9h às 18h."
          },
          {
            titulo: "Sem burocracia",
            texto: "Cadastro gratuito, sem CNPJ, sem prova e sem meta obrigatória todo mês."
          }
        ]
      },
      { tipo: "subtitulo", texto: "Os níveis de desconto" },
      { tipo: "regua" },
      EXEMPLO_CONTA,
      { tipo: "cta", rotulo: CTA },
      { tipo: "subtitulo", texto: "Como começar" },
      {
        tipo: "passos",
        itens: [
          {
            titulo: "Faça seu cadastro",
            texto: "É online, leva cerca de 2 minutos e não tem nenhum custo."
          },
          {
            titulo: "Monte seu primeiro pedido",
            texto:
              "Você escolhe os produtos no site de revendedoras, com o mínimo de R$ 360 já com o seu desconto aplicado."
          },
          {
            titulo: "Venda e receba",
            texto:
              "Os produtos chegam na sua casa com frete grátis. Você vende pelo preço da revista e fica com a diferença."
          }
        ]
      },
      { tipo: "depoimento", ...DEPOIMENTOS.larissa },
      { tipo: "cta", rotulo: CTA },
      {
        tipo: "nota",
        texto: "O cadastro é gratuito, leva cerca de 2 minutos e só precisa de CPF."
      }
    ]
  },

  confirmacao: {
    id: "confirmacao",
    nome: "Confirmação de cadastro",
    tipo: "transacional",
    capa: {
      arquivo: "hero-confirmacao.jpg",
      alt: "Creme corporal da linha Romã L'Occitane au Brésil"
    },
    ctaUrl: config.urlPedidos,
    blocos: [
      {
        tipo: "texto",
        paragrafos: [
          "Seu cadastro está confirmado, e a partir de agora começa uma nova relação entre você e a L'Occitane au Brésil. A cada pedido, você compra nossos produtos com desconto e vende pelo preço da revista! Confira seus próximos passos:"
        ]
      },
      {
        tipo: "passos",
        itens: [
          {
            titulo: "Monte seu primeiro pedido",
            texto:
              "Acesse o site de revendedoras e escolha os produtos. O mínimo é R$ 360, já com o seu desconto de 20%."
          },
          {
            titulo: "Fale com a sua líder",
            texto:
              "Ela indica o que costuma vender mais rápido e tira suas dúvidas pelo WhatsApp."
          },
          {
            titulo: "Receba em casa e comece a vender",
            texto:
              "A entrega é gratuita para todo o Brasil. Você vende pelo preço da revista e fica com a diferença."
          }
        ]
      },
      { tipo: "cta", rotulo: "Acessar o site de revendedoras" },
      {
        tipo: "lider",
        texto:
          "Precisa de ajuda para começar? Fale com uma líder pelo <a href=\"__WHATSAPP__\" style=\"color:#4A3830;\">WhatsApp</a> ou com o atendimento oficial, de segunda a sexta, das 9h às 18h."
      },
      {
        tipo: "nota",
        texto:
          "Este é um e-mail automático de confirmação. Guarde-o para consultar os próximos passos quando precisar."
      }
    ]
  }
};

/**
 * Os 11 disparos da régua. Cada um aponta para um dos 4 criativos e carrega
 * o seu próprio assunto, título (H1) e preheader.
 */
export const disparos = [
  {
    codigo: "LOCCITANE_LP_M1",
    arquivo: "01-m1-apresentacao",
    criativo: "e1",
    momento: "D+0",
    etapa: "E-mail 1 — Apresentação",
    gatilho: "Entrada na jornada",
    titulo: "Bem-vinda ao universo L'Occitane au Brésil",
    assunto: "Revenda brasilidade com nosso Programa de Revendedoras L'Occitane au Brésil!",
    preheader: "Cadastro sem custo, frete grátis e desconto de 20% a 35% em cada compra."
  },
  {
    codigo: "LOCCITANE_LP_M2_ABRIU",
    arquivo: "02-m2-abriu-reforco",
    criativo: "e2",
    momento: "D+4",
    etapa: "E-mail 2 — Reforço",
    gatilho: "Abriu o E-mail 1",
    titulo: "Renda extra com produtos premiados e clientes fiéis à marca",
    assunto: "Revendedoras L'Occitane au Brésil vendem com a força de uma marca global",
    preheader: "Linhas que as clientes já reconhecem e um desconto que vira o seu lucro."
  },
  {
    codigo: "LOCCITANE_LP_M2_NAO_ABRIU",
    arquivo: "03-m2-nao-abriu-reenvio-e1",
    criativo: "e1",
    momento: "D+4",
    etapa: "Reenvio do E-mail 1 (assunto novo)",
    gatilho: "Não abriu o E-mail 1",
    titulo: "Uma oportunidade da L'Occitane au Brésil está esperando por você",
    assunto: "Empreender e lucrar com produtos que encantam pode começar hoje!",
    preheader: "Compre com desconto, venda pelo preço da revista e fique com a diferença."
  },
  {
    codigo: "LOCCITANE_LP_M3_ABRIU",
    arquivo: "04-m3-abriu-beneficio",
    criativo: "e3",
    momento: "D+7",
    etapa: "E-mail 3 — Benefício, versão 1",
    gatilho: "Abriu o E-mail 2",
    titulo: "As vantagens de revender L'Occitane au Brésil",
    assunto: "Lucre com produtos que as pessoas já amam: revenda L'Occitane au Brésil",
    preheader: "Do 20% no primeiro pedido ao 35% no nível diamante: veja a régua completa."
  },
  {
    codigo: "LOCCITANE_LP_M3_NAO_ABRIU",
    arquivo: "05-m3-nao-abriu-beneficio",
    criativo: "e3",
    momento: "D+7",
    etapa: "E-mail 3 — Benefício, versão 2",
    gatilho: "Abriu o E-mail 1 e não abriu o E-mail 2",
    titulo: "O melhor momento para empreender com beleza é agora",
    assunto: "Ainda dá tempo de começar a sua revenda L'Occitane au Brésil",
    preheader: "Dá para começar com R$ 360, sem CNPJ e sem meta obrigatória todo mês."
  },
  {
    codigo: "LOCCITANE_LP_M2_P2_ABRIU",
    arquivo: "06-m2-p2-abriu-reforco",
    criativo: "e2",
    momento: "D+7",
    etapa: "E-mail 2 — Reforço, versão 1",
    gatilho: "Abriu o reenvio do E-mail 1",
    titulo: "Por que revender L'Occitane au Brésil",
    assunto: "Renda extra com a força da L'Occitane au Brésil ao seu lado",
    preheader: "Marca reconhecida, margem de 20% a 35% e apoio de uma líder pelo WhatsApp."
  },
  {
    codigo: "LOCCITANE_LP_M2_P2_NAO_ABRIU",
    arquivo: "07-m2-p2-nao-abriu-reforco",
    criativo: "e2",
    momento: "D+7",
    etapa: "E-mail 2 — Reforço, versão 2",
    gatilho: "Não abriu o reenvio do E-mail 1",
    titulo: "Empreenda com o apoio de quem é referência em cosmética no Brasil",
    assunto: "O que a L'Occitane au Brésil preparou para quem quer empreender",
    preheader: "Líder no WhatsApp, atendimento oficial, frete grátis e pagamento em 10x."
  },
  {
    codigo: "LOCCITANE_LP_M3_P2_ABRIU",
    arquivo: "08-m3-p2-abriu-beneficio",
    criativo: "e3",
    momento: "D+10",
    etapa: "E-mail 3 — Benefício, versão 1 (lead reengajado)",
    gatilho: "Reengajou pelo reenvio do E-mail 1",
    titulo: "Comece agora a sua revenda L'Occitane au Brésil",
    assunto: "Garanta seu cadastro de revendedora L'Occitane au Brésil",
    preheader: "Só precisa de CPF, e-mail e um telefone com WhatsApp para se cadastrar."
  },
  {
    codigo: "LOCCITANE_LP_M4_ABRIU",
    arquivo: "09-m4-abriu-beneficio",
    criativo: "e3",
    momento: "D+10",
    etapa: "E-mail 3 — Benefício, versão 2",
    gatilho: "Abriu o reenvio e não abriu o E-mail 2",
    titulo: "Falta um passo pro seu negócio começar",
    assunto: "Garanta seu cadastro e seja revendedora L'Occitane au Brésil",
    preheader: "A marca, os produtos e o apoio já estão prontos. Falta o seu cadastro."
  },
  {
    codigo: "LOCCITANE_LP_M4_NAO_ABRIU",
    arquivo: "10-m4-nao-abriu-ultima-chamada",
    criativo: "e3",
    momento: "D+10",
    etapa: "E-mail 3 — Benefício, versão 3 (última chamada)",
    gatilho: "Última tentativa da jornada",
    titulo: "Última chamada para a revenda L'Occitane au Brésil",
    assunto: "Aproveite a chance e seja uma revendedora L'Occitane au Brésil!",
    preheader: "Último e-mail desta sequência sobre o programa de revenda."
  },
  {
    codigo: "LOCCITANE_LP_CONFIRMACAO_EMAIL",
    arquivo: "11-confirmacao-cadastro",
    criativo: "confirmacao",
    momento: "Automático",
    etapa: "Confirmação de cadastro",
    gatilho: "Lead se cadastrou na LP (sai da jornada)",
    titulo: "Bem-vinda ao Programa de Revendedoras L'Occitane au Brésil!",
    assunto: "A L'Occitane au Brésil recebeu suas informações e seu cadastro está confirmado!",
    preheader: "Veja os próximos passos para montar o seu primeiro pedido."
  }
];

/**
 * Régua de 14/08/2026: 5 momentos (M1 a M5) com dois assuntos cada.
 *
 * O assunto A vai para quem abriu o e-mail anterior e o B para quem não abriu — o
 * conteúdo da peça é o mesmo nos dois. A confirmação de cadastro não entra nesta
 * lista: ela é automática, dispara a qualquer momento da régua e continua sendo o
 * disparo LOCCITANE_LP_CONFIRMACAO_EMAIL, inalterado.
 *
 * Quando a régua termina, uma nova onda recomeça no M1 para quem não se cadastrou.
 */
export const disparosMomentos = [
  {
    codigo: "LOCCITANE_LP_M1_A",
    arquivo: "01-m1-convite-a",
    criativo: "e1",
    momento: "D+0",
    etapa: "M1 — Convite (assunto A)",
    gatilho: "Todos os leads da base entram por aqui",
    titulo: "Bem-vinda ao universo L'Occitane au Brésil",
    assunto: "Revenda brasilidade com nosso Programa de Revendedoras L'Occitane au Brésil!",
    preheader: "Cadastro sem custo, frete grátis e desconto de 20% a 35% em cada compra."
  },
  {
    codigo: "LOCCITANE_LP_M1_B",
    arquivo: "02-m1-convite-b",
    criativo: "e1",
    momento: "D+0",
    etapa: "M1 — Convite (assunto B, peça E1.1)",
    gatilho: "Não abriu o E1: mesmo conteúdo, assunto novo",
    titulo: "Uma oportunidade da L'Occitane au Brésil está esperando por você",
    assunto: "Empreender e lucrar com produtos que encantam pode começar hoje!",
    preheader: "Compre com desconto, venda pelo preço da revista e fique com a diferença."
  },
  {
    codigo: "LOCCITANE_LP_M2_A",
    arquivo: "03-m2-beneficios-a",
    criativo: "e3",
    momento: "D+3",
    etapa: "M2 — Benefícios (assunto A)",
    gatilho: "Abriu o M1",
    titulo: "As vantagens de revender L'Occitane au Brésil",
    assunto: "Lucre com produtos que as pessoas já amam: revenda L'Occitane au Brésil",
    preheader: "Do 20% no primeiro pedido ao 35% no nível diamante: veja a régua completa."
  },
  {
    codigo: "LOCCITANE_LP_M2_B",
    arquivo: "04-m2-beneficios-b",
    criativo: "e3",
    momento: "D+3",
    etapa: "M2 — Benefícios (assunto B)",
    gatilho: "Não abriu o M1",
    titulo: "O melhor momento para empreender com beleza é agora",
    assunto: "Ainda dá tempo de começar a sua revenda L'Occitane au Brésil",
    preheader: "Dá para começar com R$ 360, sem CNPJ e sem meta obrigatória todo mês."
  },
  {
    codigo: "LOCCITANE_LP_M3_A",
    arquivo: "05-m3-calculadora-a",
    criativo: "calculadora",
    momento: "D+5",
    etapa: "M3 — Calculadora (assunto A)",
    gatilho: "Abriu o M2",
    titulo: "Faça a conta antes de começar",
    assunto: "Simule quanto você ganha revendendo L'Occitane au Brésil",
    preheader: "Coloque o valor que pretende comprar e veja o seu lucro na hora."
  },
  {
    codigo: "LOCCITANE_LP_M3_B",
    arquivo: "06-m3-calculadora-b",
    criativo: "calculadora",
    momento: "D+5",
    etapa: "M3 — Calculadora (assunto B)",
    gatilho: "Não abriu o M2",
    titulo: "Quanto dá para ganhar por mês?",
    assunto: "Quanto sobra para você em cada venda? Faça a conta",
    preheader: "A calculadora mostra por quanto revender e quanto fica com você."
  },
  {
    codigo: "LOCCITANE_LP_M4_A",
    arquivo: "07-m4-prova-social-a",
    criativo: "provaSocial",
    momento: "D+7",
    etapa: "M4 — Prova Social (assunto A)",
    gatilho: "Abriu o M3",
    titulo: "Quem já vende conta como começou",
    assunto: "Revendedoras L'Occitane au Brésil contam como começaram",
    preheader: "Três histórias de quem começou com uma primeira compra de R$ 360."
  },
  {
    codigo: "LOCCITANE_LP_M4_B",
    arquivo: "08-m4-prova-social-b",
    criativo: "provaSocial",
    momento: "D+7",
    etapa: "M4 — Prova Social (assunto B)",
    gatilho: "Não abriu o M3",
    titulo: "Elas já começaram. E você?",
    assunto: "Elas já estão vendendo L'Occitane au Brésil. E você?",
    preheader: "Cadastro gratuito, sem CNPJ e com uma líder para orientar você."
  },
  {
    codigo: "LOCCITANE_LP_M5_A",
    arquivo: "09-m5-overview-a",
    criativo: "overview",
    momento: "D+10",
    etapa: "M5 — Overview do Programa (assunto A)",
    gatilho: "Abriu o M4",
    titulo: "Comece agora a sua revenda L'Occitane au Brésil",
    assunto: "Garanta seu cadastro de revendedora L'Occitane au Brésil",
    preheader: "Só precisa de CPF, e-mail e um telefone com WhatsApp para se cadastrar."
  },
  {
    codigo: "LOCCITANE_LP_M5_B",
    arquivo: "10-m5-overview-b",
    criativo: "overview",
    momento: "D+10",
    etapa: "M5 — Overview do Programa (assunto B)",
    gatilho: "Não abriu o M4: última tentativa da onda",
    titulo: "Última chamada para a revenda L'Occitane au Brésil",
    assunto: "Aproveite a chance e seja uma revendedora L'Occitane au Brésil!",
    preheader: "Último e-mail desta sequência sobre o programa de revenda."
  }
];
