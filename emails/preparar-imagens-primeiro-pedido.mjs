/**
 * Imagens da régua de Primeiro Pedido (V2).
 *
 * Ficam em emails/assets-primeiro-pedido porque o preparar-imagens.mjs apaga de
 * emails/assets tudo o que não reconhece. No CDN, os dois conjuntos sobem para a
 * mesma pasta (config.baseImagens).
 *
 * - Capas: fotos das linhas (pasta do WeTransfer "outras-linhas"), 1200x600 para
 *   exibir a 600x300.
 * - Brinde: a arte "Iniciou, ganhou!" (Nosso Abraço) inteira, a 640px de largura
 *   para exibir a 320px.
 * - Kit inicial: a arte "Sugestão Kit Inicial" com todos os produtos, exibida a 536px.
 *   As fotos avulsas dos quatro produtos (kit-*.jpg) seguem sendo geradas, mas as peças
 *   não as usam mais.
 *
 * As fontes ficam fora do repositório; se a pasta mudar, ajuste FOTOS e ARTE_BRINDE.
 *
 * Uso: node emails/preparar-imagens-primeiro-pedido.mjs
 */
import sharp from "sharp";
import { mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const ORIGEM = "assets/web";
const FOTOS = "E:/wetransfer_outras-linhas_2026-10-30_1852 (1)";
const ARTE_BRINDE = "E:/WhatsApp Image 2026-10-29 at 17.59.19.jpeg";
const ARTE_KIT = "E:/imagens-primeiro-pedido/sugestao-kit-inicial.jpg";
const DESTINO = "emails/assets-primeiro-pedido";

/** Rosa do corpo da peça V2: as quinas transparentes dos packs somem no fundo. */
const ROSA = { r: 253, g: 236, b: 238 };

const PRODUTOS = [
  { saida: "kit-geleia-roma.jpg", origem: "pack-geleia.png" },
  { saida: "kit-deo-capim.jpg", origem: "pack-deo.png" },
  { saida: "kit-caju-viagem.jpg", origem: "pack-caju.png" },
  { saida: "kit-sacolas.jpg", origem: "pack-sacola.png" }
];

const CAPAS = [
  { saida: "capa-d0.jpg", origem: "CAJU/acfad69a-foto_14-hd.jpg", posicao: "attention" },
  { saida: "capa-d4.jpg", origem: "CHAMEGO & BAFAFA/739528d8-foto_4-md.jpg", posicao: "centre" },
  { saida: "capa-d8.jpg", origem: "CAJU/7acc06e3-foto_3-hd.jpg", posicao: "centre" },
  { saida: "capa-d12.jpg", origem: "PUDIM/78090cdd-foto_1-hd.jpg", posicao: "centre" },
  { saida: "capa-d16.jpg", origem: "ROMÃ/42193224-foto_23-hd.jpg", posicao: "centre" },
  { saida: "capa-d20.jpg", origem: "CHAMEGO & BAFAFA/99904acd-foto_20-hd.jpg", posicao: "centre" },
  { saida: "capa-d24.jpg", origem: "OUTRAS LINHAS/ec437c42-foto_18-hd.jpg", posicao: "attention" }
];

const jpeg = (pipeline, qualidade = 80) =>
  pipeline.jpeg({ quality: qualidade, progressive: true, mozjpeg: true });

async function gerarProdutos() {
  for (const { saida, origem } of PRODUTOS) {
    await jpeg(
      sharp(path.join(ORIGEM, origem))
        .resize(300, 300, { fit: "contain", background: { ...ROSA, alpha: 1 } })
        .flatten({ background: ROSA })
    ).toFile(path.join(DESTINO, saida));
  }
}

async function gerarCapas() {
  for (const { saida, origem, posicao } of CAPAS) {
    await jpeg(
      sharp(path.join(FOTOS, origem)).rotate().resize(1200, 600, { fit: "cover", position: posicao }),
      72
    ).toFile(path.join(DESTINO, saida));
  }
}

async function gerarBrinde() {
  await jpeg(sharp(ARTE_BRINDE).resize(640), 82).toFile(path.join(DESTINO, "brinde.jpg"));
}

/** A arte tem 651px de largura: sai no tamanho original para exibir a 536px. */
async function gerarKit() {
  await jpeg(sharp(ARTE_KIT).flatten({ background: "#FFFFFF" }), 85).toFile(path.join(DESTINO, "kit-inicial.jpg"));
}

await rm(DESTINO, { recursive: true, force: true });
await mkdir(DESTINO, { recursive: true });
await gerarProdutos();
await gerarCapas();
await gerarBrinde();
await gerarKit();

for (const arquivo of (await readdir(DESTINO)).sort()) {
  const { size } = await stat(path.join(DESTINO, arquivo));
  console.log(`${arquivo.padEnd(26)} ${(size / 1024).toFixed(0)} KB`);
}
