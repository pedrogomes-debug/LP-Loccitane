/**
 * Captura a página inteira de um HTML local em PNG (desktop e celular).
 *
 * Uso: node capturar-pagina.mjs [arquivo.html] [largura,largura...]
 * Ex.:  node capturar-pagina.mjs index-varejo-hero-calc.html
 *       node capturar-pagina.mjs index-varejo.html 1440,768,430
 *
 * As seções da landing só aparecem depois que o IntersectionObserver dispara. Como a captura
 * de página inteira não rola a tela de verdade, emulamos prefers-reduced-motion: reduce — a
 * própria página desliga a animação nesse modo e entrega todo o conteúdo visível.
 */
import puppeteer from "puppeteer";
import path from "node:path";
import { mkdir } from "node:fs/promises";

const PAGINA = process.argv[2] ?? "index-varejo-hero-calc.html";
const LARGURAS = (process.argv[3] ?? "1440,430").split(",").map((n) => Number(n.trim()));
const SAIDA = "screenshots";

const nomeDoTamanho = (largura) => (largura >= 1024 ? "desktop" : largura >= 700 ? "tablet" : "mobile");

await mkdir(SAIDA, { recursive: true });
const navegador = await puppeteer.launch({ headless: true });

for (const largura of LARGURAS) {
  const pagina = await navegador.newPage();
  await pagina.setViewport({ width: largura, height: 900 });
  await pagina.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await pagina.goto(`file:///${path.resolve(PAGINA).replace(/\\/g, "/")}`, {
    waitUntil: "networkidle0"
  });

  // Rola até o fim para carregar as imagens com loading="lazy" e depois espera cada uma.
  await pagina.evaluate(
    () =>
      new Promise((resolve) => {
        let y = 0;
        const passo = () => {
          window.scrollTo(0, (y += 600));
          if (y < document.body.scrollHeight) requestAnimationFrame(passo);
          else {
            window.scrollTo(0, 0);
            setTimeout(resolve, 300);
          }
        };
        passo();
      })
  );
  await pagina.evaluate(() =>
    Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) => new Promise((resolve) => img.addEventListener("load", resolve, { once: true }))
        )
    )
  );

  const base = path.basename(PAGINA, ".html");
  const destino = path.join(SAIDA, `${base}-${nomeDoTamanho(largura)}.png`);
  await pagina.screenshot({ path: destino, fullPage: true });
  const altura = await pagina.evaluate(() => document.body.scrollHeight);
  console.log(`${String(largura).padStart(5)}x${String(altura).padEnd(6)} ${destino}`);
  await pagina.close();
}

await navegador.close();
