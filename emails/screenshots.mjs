/**
 * Renderiza as peças de dist/preview em PNG e avisa se alguma imagem não carregou.
 *
 * Não substitui teste em client real: VML do botão, dark mode e Outlook só dão para validar
 * no Litmus/Email on Acid. Serve para pegar erro de layout e imagem quebrada antes disso.
 *
 * Uso: node emails/screenshots.mjs
 * Se o Chromium do puppeteer não estiver baixado, aponte para um Chrome local:
 *   $env:CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
 */
import puppeteer from "puppeteer";
import path from "node:path";
import { readdir } from "node:fs/promises";

const PREVIEW = path.resolve("emails/dist/preview");

/** Os criativos ganham desktop e celular; os disparos, só desktop (mudam apenas nos textos). */
const PASTAS = [
  { pasta: "criativos", tamanhos: [["desktop", 700], ["mobile", 390]] },
  { pasta: "por-disparo", tamanhos: [["desktop", 700]] }
];

const navegador = await puppeteer.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
});

let quebradas = 0;

for (const { pasta, tamanhos } of PASTAS) {
  const diretorio = path.join(PREVIEW, pasta);
  const arquivos = (await readdir(diretorio)).filter((arquivo) => arquivo.endsWith(".html"));

  for (const arquivo of arquivos) {
    for (const [nome, largura] of tamanhos) {
      const pagina = await navegador.newPage();
      const falhas = [];
      pagina.on("requestfailed", (requisicao) => falhas.push(requisicao.url()));
      pagina.on("response", (resposta) => {
        if (resposta.status() >= 400) falhas.push(resposta.url());
      });

      await pagina.setViewport({ width: largura, height: 900 });
      await pagina.goto(`file:///${path.join(diretorio, arquivo).replace(/\\/g, "/")}`, {
        waitUntil: "networkidle0"
      });
      await pagina.screenshot({
        path: path.join(diretorio, arquivo.replace(".html", `-${nome}.png`)),
        fullPage: true
      });

      const altura = await pagina.evaluate(() => document.body.scrollHeight);
      quebradas += falhas.length;
      console.log(
        `${`${pasta}/${arquivo.replace(".html", "")}`.padEnd(42)} ${nome.padEnd(8)} ${String(altura).padStart(5)}px` +
          (falhas.length ? `  IMAGENS QUEBRADAS: ${falhas.length}` : "")
      );
      await pagina.close();
    }
  }
}

await navegador.close();
console.log(quebradas ? `\n${quebradas} recurso(s) não carregaram.` : "\nTodas as imagens carregaram.");
