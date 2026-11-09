/**
 * Imagens da régua CRM (Jornada Inícios).
 *
 * Ficam em emails/assets-crm porque o preparar-imagens.mjs apaga de emails/assets tudo o
 * que não reconhece. No CDN, sobem para a mesma pasta de assets/ (config.baseImagens).
 *
 * - Capas: fotos dos zips de cada peça, 1200x600 para exibir a 600x300.
 * - D+30: os três best sellers, exibidos a 164px no desktop; arquivo a 330px, em fundo
 *   branco como o card do produto.
 * - Nível Prata: não veio foto; usa a capa Romã da régua de Primeiro Pedido até a marca
 *   definir outra.
 *
 * As fontes ficam fora do repositório (zips extraídos em ORIGEM); se a pasta mudar, ajuste ORIGEM.
 *
 * Uso: node emails/preparar-imagens-crm.mjs
 */
import sharp from "sharp";
import { mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const ORIGEM = "E:/crm-imagens-origem";
const DESTINO = "emails/assets-crm";
const PRIMEIRO_PEDIDO = "emails/assets-primeiro-pedido";

const D0 = "D+0 - Email Boas-vindas/D+0 - Email Boas-vindas";
const D1 = "D+1 - Relacionamento com a base aniversariante/D+1 - Relacionamento com a base aniversariante";
const D30 = "D+30 - Dicas de venda/D+30 - Dicas de venda";
const INA = "INA 04 E INA 06/INA 04 E INA 06";

/** Os nomes dos zips chegam com acentos corrompidos; os arquivos são achados pelo começo do nome. */
const CAPAS = [
  { saida: "crm-capa-d0.jpg", pasta: D0, nome: /^Email Boas Vindas/, posicao: "attention" },
  { saida: "crm-capa-d1.jpg", pasta: D1, nome: /^e403a192/, posicao: "centre" },
  { saida: "crm-capa-d30.jpg", pasta: D30, nome: /^foto 1/, posicao: "attention" },
  { saida: "crm-capa-ina.jpg", pasta: INA, nome: /^Suba de n/, posicao: "attention" }
];

const PRODUTOS = [
  { saida: "crm-d30-capim-limao.jpg", pasta: D30, nome: /^Deo Colonia Capim/ },
  { saida: "crm-d30-bafafa.jpg", pasta: D30, nome: /^Mist Desodorante/ },
  { saida: "crm-d30-roma.jpg", pasta: D30, nome: /^Spray \+ geleia/ }
];

const BRANCO = { r: 255, g: 255, b: 255 };

const jpeg = (pipeline, qualidade = 80) =>
  pipeline.jpeg({ quality: qualidade, progressive: true, mozjpeg: true });

async function achar(pasta, nome) {
  const dir = path.join(ORIGEM, pasta);
  const arquivo = (await readdir(dir)).find((f) => nome.test(f));
  if (!arquivo) throw new Error(`Imagem ${nome} não encontrada em ${dir}`);
  return path.join(dir, arquivo);
}

async function gerarCapas() {
  for (const { saida, pasta, nome, posicao } of CAPAS) {
    await jpeg(
      sharp(await achar(pasta, nome)).rotate().resize(1200, 600, { fit: "cover", position: posicao }),
      72
    ).toFile(path.join(DESTINO, saida));
  }
  await jpeg(sharp(path.join(PRIMEIRO_PEDIDO, "capa-d16.jpg")), 72).toFile(path.join(DESTINO, "crm-capa-prata.jpg"));
}

async function gerarProdutos() {
  for (const { saida, pasta, nome } of PRODUTOS) {
    await jpeg(
      sharp(await sharp(await achar(pasta, nome)).flatten({ background: BRANCO }).trim({ threshold: 12 }).toBuffer())
        .resize(300, 300, { fit: "contain", background: { ...BRANCO, alpha: 1 } })
        .extend({ top: 15, bottom: 15, left: 15, right: 15, background: BRANCO }),
      82
    ).toFile(path.join(DESTINO, saida));
  }
}

await rm(DESTINO, { recursive: true, force: true });
await mkdir(DESTINO, { recursive: true });
await gerarCapas();
await gerarProdutos();

for (const arquivo of (await readdir(DESTINO)).sort()) {
  const { size } = await stat(path.join(DESTINO, arquivo));
  console.log(`${arquivo.padEnd(26)} ${(size / 1024).toFixed(0)} KB`);
}
