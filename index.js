import puppeteer from "puppeteer";

const LINK_SITE = "https://tve.ba.gov.br/craque";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });

  while (true) {
    await votacaoRecursiva(page);
  }
})();

async function votacaoRecursiva(page) {
  await page.goto(LINK_SITE);

  const formCard = await page.$$("button");
  let i = 0;
  for (const button of formCard) {
    if (i === 8) {
      await button.click();

      await page.setRequestInterception(true);
      await page.waitForSelector(".swal2-confirm");
      page.on("request", handleRequest);

      const btnVoto = await page.$(".swal2-confirm");
      await btnVoto.click();

      page.off("request", handleRequest);
      await page.setRequestInterception(false);

      await new Promise((resolve) => setTimeout(resolve, 15000));
    }
    i++;
  }
}
const handleRequest = async (interceptedRequest) => {
  console.log(interceptedRequest.url());
  if (interceptedRequest.url().includes("voto-craque")) {
    console.log("Aguardando...");
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  interceptedRequest.continue();
};
