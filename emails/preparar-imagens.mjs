/**
 * Gera as imagens das peças de e-mail a partir dos assets da landing page.
 *
 * Regras aplicadas (compatibilidade com clients de e-mail):
 * - JPEG progressivo nas fotos: renderiza em 100% dos clients, inclusive Outlook e Gmail app.
 * - Sem WebP/AVIF/SVG: Outlook, Yahoo e clients antigos não renderizam.
 * - Arquivo no dobro da largura de exibição (retina), com peso alvo abaixo de ~100 KB.
 * - PNG só onde a transparência é necessária (logo sobre a faixa vermelha).
 * - Metadados/EXIF removidos: menos peso e sem risco de orientação errada.
 *
 * Uso: node emails/preparar-imagens.mjs
 */
import sharp from "sharp";
import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGEM = "assets/web";
const DESTINO = "emails/assets";

const CREME = { r: 251, g: 241, b: 230 };

/**
 * Uma capa por criativo. Exibição a 600px de largura, arquivo a 1200px (retina).
 * `exibicao` é a altura em que a capa aparece no e-mail — o E2 usa uma capa mais alta
 * porque a foto da parede de produtos é vertical e ficava decepada em 2:1.
 */
const CAPAS = [
  { saida: "hero-apresentacao.jpg", origem: "hero-revendedora.jpg", posicao: "top" },
  { saida: "hero-marca.jpg", origem: "galeria-3.jpg", posicao: "bottom", exibicao: 460 },
  { saida: "hero-beneficio.jpg", origem: "galeria-2.jpg", posicao: "top" },
  { saida: "hero-confirmacao.jpg", origem: "hero-roma-banner.jpg", posicao: "center" },
  { saida: "hero-calculadora.jpg", origem: "hero-capim.jpg", posicao: "center" },
  // Capim-limão no verde já é a capa do M3, que sai dois dias antes: aqui vai a linha Romã.
  { saida: "hero-prova-social.jpg", origem: "galeria-5.jpg", posicao: "center" },
  { saida: "hero-overview.jpg", origem: "hero-bresil.jpg", posicao: "center" }
];

/**
 * Rostos dos depoimentos do E4, exibidos a 48px (arquivo a 96px para retina).
 * As fontes têm só ~85x104px, então o corte é pelo topo para não perder o rosto.
 */
const ROSTOS = [
  { saida: "depo-larissa.jpg", origem: "depoimento-1.jpg" },
  { saida: "depo-monise.jpg", origem: "depoimento-2.jpg" },
  { saida: "depo-andrea.jpg", origem: "depoimento-3.jpg" }
];

/** Trio de linhas do E1: 172px de exibição, arquivo a 352px. */
const LINHAS = ["linha-roma.jpg", "linha-caju.jpg", "linha-capim.jpg"];

const jpeg = (pipeline, qualidade = 72) =>
  pipeline.jpeg({ quality: qualidade, progressive: true, mozjpeg: true });

/** Teto por capa. Acima disso a imagem começa a pesar na abertura em rede móvel. */
const LIMITE_CAPA = 90 * 1024;

async function gerarCapas() {
  for (const { saida, origem, posicao, exibicao = 300 } of CAPAS) {
    const base = () =>
      sharp(path.join(ORIGEM, origem))
        .rotate()
        .resize(1200, exibicao * 2, { fit: "cover", position: posicao })
        .flatten({ background: CREME });

    // Foto detalhada (folhagem, textura) e capa mais alta geram arquivo maior no mesmo
    // nível de qualidade, então a qualidade cede até o arquivo caber no limite.
    let buffer;
    for (const qualidade of [72, 66, 60, 54, 48]) {
      buffer = await jpeg(base(), qualidade).toBuffer();
      if (buffer.length <= LIMITE_CAPA) break;
    }
    await writeFile(path.join(DESTINO, saida), buffer);
  }
}

async function gerarLinhas() {
  for (const arquivo of LINHAS) {
    await jpeg(
      sharp(path.join(ORIGEM, arquivo)).rotate().resize(352, 352, { fit: "cover", position: "top" })
    ).toFile(path.join(DESTINO, arquivo));
  }
}

async function gerarApoio() {
  await jpeg(
    sharp(path.join(ORIGEM, "lider-rosto.jpg")).rotate().resize(200, 200, { fit: "cover" })
  ).toFile(path.join(DESTINO, "lider.jpg"));

  for (const { saida, origem } of ROSTOS) {
    await jpeg(
      sharp(path.join(ORIGEM, origem)).rotate().resize(96, 96, { fit: "cover", position: "top" }),
      78
    ).toFile(path.join(DESTINO, saida));
  }

  await gerarLogoCabecalho();
}

/**
 * O logo disponível é vermelho sobre fundo transparente, e o cabeçalho da peça é
 * vermelho. Aqui a silhueta do logo é reaproveitada como máscara para pintá-lo em
 * creme, mantendo o fundo transparente.
 */
async function gerarLogoCabecalho() {
  const origem = sharp(path.join(ORIGEM, "logo-branco-transparente.png")).resize(380, null, {
    fit: "inside"
  });
  const { width, height } = await origem.clone().toBuffer({ resolveWithObject: true }).then(
    ({ info }) => info
  );
  const mascara = await origem.clone().extractChannel("alpha").toBuffer();

  await sharp({
    create: { width, height, channels: 3, background: CREME }
  })
    .joinChannel(mascara)
    .png({ compressionLevel: 9 })
    .toFile(path.join(DESTINO, "logo-cabecalho.png"));
}

const esperados = new Set([
  ...CAPAS.map((c) => c.saida),
  ...ROSTOS.map((r) => r.saida),
  ...LINHAS,
  "lider.jpg",
  "logo-cabecalho.png"
]);

await mkdir(DESTINO, { recursive: true });
await gerarCapas();
await gerarLinhas();
await gerarApoio();

// Remove sobras de execuções anteriores para o ESP não receber asset sem uso.
for (const arquivo of await readdir(DESTINO)) {
  if (!esperados.has(arquivo)) await unlink(path.join(DESTINO, arquivo));
}

let total = 0;
for (const arquivo of (await readdir(DESTINO)).sort()) {
  const { size } = await stat(path.join(DESTINO, arquivo));
  total += size;
  console.log(`${arquivo.padEnd(30)} ${(size / 1024).toFixed(0)} KB`);
}
console.log(`\n${esperados.size} imagens, ${(total / 1024).toFixed(0)} KB no total`);
