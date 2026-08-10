import { chromium } from "playwright-core";
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

const APP_URL = "https://corporate-brain-delta.vercel.app";
const OUTPUT_DIR = path.resolve("assets/submission/video/raw");

await mkdir(OUTPUT_DIR, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--disable-notifications", "--hide-scrollbars"],
});

const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
  recordVideo: {
    dir: OUTPUT_DIR,
    size: { width: 1280, height: 720 },
  },
});

const page = await context.newPage();
const pause = (milliseconds) => page.waitForTimeout(milliseconds);

async function caption(text, tone = "blue") {
  await page.evaluate(
    ({ text, tone }) => {
      let node = document.querySelector("#corporate-brain-demo-caption");
      if (!node) {
        node = document.createElement("div");
        node.id = "corporate-brain-demo-caption";
        Object.assign(node.style, {
          position: "fixed",
          left: "50%",
          bottom: "18px",
          transform: "translateX(-50%)",
          zIndex: "2147483647",
          width: "min(1040px, calc(100vw - 48px))",
          padding: "13px 20px",
          borderRadius: "12px",
          color: "white",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          fontSize: "18px",
          fontWeight: "650",
          lineHeight: "1.35",
          textAlign: "center",
          boxShadow: "0 12px 38px rgba(15,23,42,.28)",
          pointerEvents: "none",
          transition: "opacity .2s ease",
        });
        document.body.appendChild(node);
      }
      node.textContent = text;
      node.style.background =
        tone === "green"
          ? "rgba(6,95,70,.94)"
          : tone === "amber"
            ? "rgba(146,64,14,.94)"
            : "rgba(15,39,92,.94)";
    },
    { text, tone },
  );
}

async function clearCaption() {
  await page.evaluate(() => {
    document.querySelector("#corporate-brain-demo-caption")?.remove();
  });
}

async function titleCard() {
  await page.evaluate(() => {
    const card = document.createElement("div");
    card.id = "corporate-brain-title-card";
    Object.assign(card.style, {
      position: "fixed",
      inset: "0",
      zIndex: "2147483646",
      display: "grid",
      placeItems: "center",
      padding: "72px",
      color: "white",
      textAlign: "center",
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      background:
        "radial-gradient(circle at 20% 0%, #2157f3 0%, #0b1f4b 42%, #061225 100%)",
    });
    card.innerHTML = `
      <div>
        <div style="font-size:18px;letter-spacing:.18em;text-transform:uppercase;opacity:.78;margin-bottom:18px">Build with DataHub: The Agent Hackathon</div>
        <h1 style="font-size:64px;line-height:1;margin:0 0 22px">Corporate Brain</h1>
        <p style="font-size:27px;line-height:1.35;max-width:920px;margin:0 auto;color:#dbeafe">Governed company metadata becomes decisions people can verify, approve, and remember.</p>
        <div style="margin-top:32px;font-size:17px;color:#a7f3d0">Live DataHub MCP · role-aware evidence · human-confirmed write-back</div>
      </div>`;
    document.body.appendChild(card);
  });
}

try {
  await page.goto(APP_URL, { waitUntil: "networkidle", timeout: 60000 });
  await page.getByText("Live DataHub MCP connected", { exact: true }).waitFor({ timeout: 30000 });

  await titleCard();
  await pause(6500);
  await page.evaluate(() => document.querySelector("#corporate-brain-title-card")?.remove());

  await caption("Corporate Brain connects every recommendation to governed DataHub evidence.");
  await pause(4500);

  await page.getByRole("button", { name: "EN", exact: true }).click();
  await page.getByLabel("Demo persona").selectOption("maya-growth");
  await page.getByText("Data available to Data analyst", { exact: true }).waitFor({ timeout: 20000 });
  await caption("The Data Analyst profile sees only authorized Ecommerce, Product, CX, Operations, Growth, and shared context.", "green");
  await pause(6500);

  await page.getByRole("button", { name: "Show all data" }).click();
  await page.getByText("Available data", { exact: true }).scrollIntoViewIfNeeded();
  await caption("Before asking a question, the analyst can inspect owners, freshness, quality, sensitivity, key fields, and lineage.");
  await pause(8500);

  const readinessQuestion = "Do we have everything needed to build an Ecommerce control dashboard and configure stockout and product complaint alerts?";
  await page.getByRole("button", { name: readinessQuestion }).click();
  await page.getByLabel("What decision are you facing?").scrollIntoViewIfNeeded();
  await caption("A business outcome becomes an explicit capability check—not a vague chat response.", "amber");
  await pause(4500);
  await page.getByRole("button", { name: "Build decision brief" }).click();

  await page.getByText("Capability readiness", { exact: true }).waitFor({ timeout: 90000 });
  await caption("Corporate Brain evaluates seven deterministic requirements against live, role-authorized DataHub evidence.", "green");
  await page.getByRole("heading", { name: "Capability coverage", exact: true }).scrollIntoViewIfNeeded();
  await pause(9000);

  await page.getByRole("heading", { name: "Source connections", exact: true }).scrollIntoViewIfNeeded();
  await caption("The result explains which assets support each requirement and how sources connect through lineage.");
  await pause(8000);

  await page.getByText("Configure proposed alerts", { exact: true }).scrollIntoViewIfNeeded();
  await caption("Two editable operational controls are proposed: star-product stockout risk and critical complaint escalation.", "amber");
  await pause(8500);

  const thresholdInputs = page.getByLabel(/^Threshold:/);
  if ((await thresholdInputs.count()) > 0) {
    const firstAlertToggle = page.getByLabel(/^Star product stockout risk:/);
    if (!(await firstAlertToggle.isChecked())) {
      await firstAlertToggle.check();
    }
    await thresholdInputs.first().fill("12");
  }
  await caption("Thresholds and recipients remain visible and editable; no alert or shared memory is created silently.");
  await pause(7000);

  await page.getByRole("button", { name: "Save operational plan" }).scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Save operational plan" }).click();
  await page.getByText("Confirm shared write", { exact: true }).waitFor({ timeout: 10000 });
  await caption("A human must explicitly confirm the bounded DataHub write-back.", "green");
  await pause(7500);

  await page.getByRole("button", { name: "Confirm and save" }).click();
  await page.getByText("Saved", { exact: true }).first().waitFor({ timeout: 60000 });
  await caption("The approved plan is recomputed server-side and written to Corporate Memory with its evidence and DataHub URNs.", "green");
  await pause(9000);

  await page.getByRole("button", { name: "Corporate Memory" }).click();
  await page.getByText("Corporate Memory", { exact: true }).first().waitFor({ timeout: 15000 });
  await caption("Corporate Brain is not another chatbot over company data. It is a governed decision loop that knows when to help—and when to abstain.");
  await pause(10000);

  await caption("Corporate Brain · governed evidence into accountable action", "green");
  await pause(5500);
  await clearCaption();
} finally {
  await context.close();
  await browser.close();
}

const files = await readdir(OUTPUT_DIR);
const videos = [];
for (const file of files) {
  if (!file.endsWith(".webm")) continue;
  const filePath = path.join(OUTPUT_DIR, file);
  const fileStat = await stat(filePath);
  videos.push({ filePath, modified: fileStat.mtimeMs, size: fileStat.size });
}
videos.sort((a, b) => b.modified - a.modified);
if (!videos[0]) throw new Error("Playwright did not produce a video file.");
console.log(JSON.stringify(videos[0]));
