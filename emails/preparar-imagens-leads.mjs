/**
 * Imagens da régua de Intenções (Leads).
 *
 * Ficam em emails/assets-leads porque o preparar-imagens.mjs apaga de emails/assets tudo o
 * que não reconhece. No CDN, sobem para a mesma pasta de assets/ (config.baseImagens).
 *
 * - Capas: uma imagem por peça, 1200x600 para exibir a 600x300.
 * - D+5: os quatro best sellers, exibidos a 164px no desktop; arquivo a 330px, em fundo
 *   branco como o card do produto. Os três primeiros têm o mesmo nome de arquivo da régua
 *   CRM, que usa as mesmas fotos.
 *
 * As fontes ficam fora do repositório; se a pasta mudar, ajuste ORIGEM.
 *
 * Uso: node emails/preparar-imagens-leads.mjs
 */
import sharp from "sharp";
import { mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const ORIGEM = "E:/imagens_leads";
const DESTINO = "emails/assets-leads";

/** As pastas chegam com acentos corrompidos; pastas e arquivos são achados pelo começo do nome. */
const CAPAS = [
  { saida: "leads-capa-d1.jpg", pasta: /^D\+1$/, nome: /^5344c1ab/, posicao: "attention" },
  { saida: "leads-capa-d3.jpg", pasta: /^D\+3/, nome: /^Linha Caju/, posicao: "north" },
  { saida: "leads-capa-d5.jpg", pasta: /^D\+5/, nome: /^capa/, posicao: "attention" },
  { saida: "leads-capa-d8.jpg", pasta: /^D\+8/, nome: /^Kit Bafaf/, posicao: "attention" },
  { saida: "leads-capa-d10.jpg", pasta: /^D\+10/, nome: /^Perfume Pudim/, posicao: "attention" }
];

const PRODUTOS = [
  { saida: "crm-d30-capim-limao.jpg", pasta: /^D\+5/, nome: /^Deo Colonia Capim/ },
  { saida: "crm-d30-bafafa.jpg", pasta: /^D\+5/, nome: /^Mist Desodorante/ },
  { saida: "crm-d30-roma.jpg", pasta: /^D\+5/, nome: /^Spray \+ geleia/ },
  { saida: "leads-sabonete-caju.jpg", pasta: /^D\+5/, nome: /^Sabonete/ }
];

const BRANCO = { r: 255, g: 255, b: 255 };

const jpeg = (pipeline, qualidade = 80) =>
  pipeline.jpeg({ quality: qualidade, progressive: true, mozjpeg: true });

async function raiz() {
  const [pasta] = await readdir(ORIGEM);
  return path.join(ORIGEM, pasta);
}

async function achar(base, pasta, nome) {
  const dir = path.join(base, (await readdir(base)).find((p) => pasta.test(p)) ?? "");
  const arquivo = (await readdir(dir)).find((f) => nome.test(f));
  if (!arquivo) throw new Error(`Imagem ${nome} não encontrada em ${dir}`);
  return path.join(dir, arquivo);
}

async function gerarCapas(base) {
  for (const { saida, pasta, nome, posicao } of CAPAS) {
    await jpeg(
      sharp(await achar(base, pasta, nome))
        .rotate()
        .flatten({ background: BRANCO })
        .resize(1200, 600, { fit: "cover", position: posicao }),
      72
    ).toFile(path.join(DESTINO, saida));
  }
}

async function gerarProdutos(base) {
  for (const { saida, pasta, nome } of PRODUTOS) {
    await jpeg(
      sharp(await sharp(await achar(base, pasta, nome)).flatten({ background: BRANCO }).trim({ threshold: 12 }).toBuffer())
        .resize(300, 300, { fit: "contain", background: { ...BRANCO, alpha: 1 } })
        .extend({ top: 15, bottom: 15, left: 15, right: 15, background: BRANCO }),
      82
    ).toFile(path.join(DESTINO, saida));
  }
}

const base = await raiz();
await rm(DESTINO, { recursive: true, force: true });
await mkdir(DESTINO, { recursive: true });
await gerarCapas(base);
await gerarProdutos(base);

for (const arquivo of (await readdir(DESTINO)).sort()) {
  const { size } = await stat(path.join(DESTINO, arquivo));
  console.log(`${arquivo.padEnd(26)} ${(size / 1024).toFixed(0)} KB`);
}
