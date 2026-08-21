const puppeteer = require("puppeteer");
const sharp = require("sharp");
const path = require("path");

const url = "file:///" + path.resolve(__dirname, "index.html").replace(/\\/g, "/");

async function prime(page) {
  await page.evaluate(async () => {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
    document.querySelectorAll("img[loading]").forEach((img) => {
      img.loading = "eager";
    });
    await new Promise((resolve) => {
      let y = 0;
      const timer = setInterval(() => {
        window.scrollTo(0, y);
        y += 400;
        if (y > document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 50);
    });
    window.scrollTo(0, 0);
    await Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map((img) => new Promise((res) => { img.onload = img.onerror = res; }))
    );
  });
  await new Promise((r) => setTimeout(r, 1200));
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: "networkidle0" });
  await prime(page);
  await page.screenshot({ path: "shot-desktop-fold.png" });
  await page.screenshot({ path: "shot-desktop-full.png", fullPage: true });

  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.reload({ waitUntil: "networkidle0" });
  await prime(page);
  await page.screenshot({ path: "shot-mobile-fold.png" });
  await page.screenshot({ path: "shot-mobile-full.png", fullPage: true });

  await browser.close();

  const meta = await sharp("shot-desktop-full.png").metadata();
  const parts = 4;
  const h = Math.ceil(meta.height / parts);
  for (let i = 0; i < parts; i++) {
    await sharp("shot-desktop-full.png")
      .extract({ left: 0, top: i * h, width: meta.width, height: Math.min(h, meta.height - i * h) })
      .resize(900)
      .png()
      .toFile(`shot-part-${i + 1}.png`);
  }
  console.log("ok", meta.width + "x" + meta.height);
})();
