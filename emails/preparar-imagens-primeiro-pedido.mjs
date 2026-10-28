/**
 * Imagens da régua de Primeiro Pedido.
 *
 * Ficam em emails/assets-primeiro-pedido porque o preparar-imagens.mjs apaga de
 * emails/assets tudo o que não reconhece. No CDN, os dois conjuntos sobem para a
 * mesma pasta (config.baseImagens).
 *
 * - Kit inicial: os quatro produtos sugeridos na landing, exibidos a 128px no desktop
 *   e até ~175px no celular; arquivo a 300px.
 * - Brinde: ainda não há foto. Sai uma imagem provisória, bem sinalizada, no tamanho
 *   final (536x280 de exibição, arquivo a 1072x560). Basta substituir o arquivo.
 *
 * Uso: node emails/preparar-imagens-primeiro-pedido.mjs
 */
import sharp from "sharp";
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

const ORIGEM = "assets/web";
const DESTINO = "emails/assets-primeiro-pedido";

/** Rosa do corpo da peça V2: as quinas transparentes dos packs somem no fundo. */
const ROSA = { r: 253, g: 236, b: 238 };

const PRODUTOS = [
  { saida: "kit-geleia-roma.jpg", origem: "pack-geleia.png" },
  { saida: "kit-deo-capim.jpg", origem: "pack-deo.png" },
  { saida: "kit-caju-viagem.jpg", origem: "pack-caju.png" },
  { saida: "kit-sacolas.jpg", origem: "pack-sacola.png" }
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

async function gerarBrindeProvisorio() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1072" height="560">
  <rect width="1072" height="560" fill="#F8DDE2"/>
  <rect x="24" y="24" width="1024" height="512" rx="24" fill="none" stroke="#C02031" stroke-width="4" stroke-dasharray="18 14"/>
  <text x="536" y="260" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="bold" fill="#C02031">FOTO DO BRINDE</text>
  <text x="536" y="330" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#6E564A">Imagem provisória: substituir antes do envio</text>
</svg>`;
  await jpeg(sharp(Buffer.from(svg)), 82).toFile(path.join(DESTINO, "brinde.jpg"));
}

await mkdir(DESTINO, { recursive: true });
await gerarProdutos();
await gerarBrindeProvisorio();

for (const arquivo of (await readdir(DESTINO)).sort()) {
  const { size } = await stat(path.join(DESTINO, arquivo));
  console.log(`${arquivo.padEnd(26)} ${(size / 1024).toFixed(0)} KB`);
}
