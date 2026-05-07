#!/usr/bin/env node
/**
 * Renders /ey-portfolio in headless Chromium and prints a high-resolution
 * Letter-format PDF. Run with `npm run export:ey-pdf` (server must be running)
 * or `npm run export:ey-pdf -- --serve` to spin up `next start` automatically.
 */

import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_PATH = resolve(ROOT, "public/ey-portfolio/justin-parra-ey-portfolio.pdf");
const URL_DEFAULT = process.env.EY_PORTFOLIO_URL || "http://localhost:3000/ey-portfolio/";
const SERVE = process.argv.includes("--serve");

function waitForServer(url, timeoutMs = 60_000) {
  const start = Date.now();
  return new Promise((res, rej) => {
    const tick = async () => {
      try {
        const r = await fetch(url, { method: "GET" });
        if (r.ok) return res();
      } catch {}
      if (Date.now() - start > timeoutMs) return rej(new Error(`Timed out waiting for ${url}`));
      setTimeout(tick, 500);
    };
    tick();
  });
}

async function withServer(fn) {
  if (!SERVE) return fn();
  console.log("Starting `next start` on :3000…");
  const proc = spawn("npx", ["next", "start", "-p", "3000"], { cwd: ROOT, stdio: "inherit" });
  try {
    await waitForServer("http://localhost:3000/ey-portfolio/");
    return await fn();
  } finally {
    proc.kill("SIGTERM");
  }
}

async function run() {
  console.log(`Rendering ${URL_DEFAULT}…`);
  const browser = await puppeteer.launch({
    headless: "shell",
    acceptInsecureCerts: true,
    args: [
      "--no-sandbox",
      "--font-render-hinting=none",
      "--ignore-certificate-errors",
    ],
  });
  try {
    const page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.setViewport({ width: 1480, height: 2000, deviceScaleFactor: 2 });

    page.on("console", (m) => {
      if (m.type() === "error") console.log("[page error]", m.text());
    });
    page.on("requestfailed", (req) => {
      console.log("[request failed]", req.url(), req.failure()?.errorText);
    });

    await page.goto(URL_DEFAULT, { waitUntil: "domcontentloaded", timeout: 60_000 });
    // Babel-standalone compiles the JSX scripts in the browser, so wait for
    // the React app to mount instead of relying on `networkidle` (the Next dev
    // server keeps an HMR socket open, which never goes idle).
    await page.waitForSelector(".hero, .topnav, .intro-curtain", { timeout: 30_000 });

    // Dismiss the intro curtain by clicking Start; if it's already gone, skip.
    await page.evaluate(async () => {
      const btn = document.querySelector(".intro-curtain__start");
      if (btn) btn.click();
      await new Promise((r) => setTimeout(r, 1300));
      const curtain = document.querySelector(".intro-curtain");
      if (curtain) curtain.remove();
    });

    // Force every scroll-reveal element to be visible so PDF capture isn't
    // dependent on intersection-observer firing during a scripted scroll.
    await page.addStyleTag({
      content: `
        html.js-reveal-ready .reveal,
        html.js-reveal-ready .reveal.is-visible { opacity: 1 !important; transform: none !important; }
        html.js-reveal-ready .word-reveal { overflow: visible !important; }
        html.js-reveal-ready .word-reveal__inner { transform: none !important; }
        * { animation-duration: 0s !important; transition-duration: 0s !important; }
        @page { size: Letter; margin: 12mm; }
      `,
    });

    // Walk the page so lazy images / fonts settle.
    await page.evaluate(async () => {
      const step = 600;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo(0, 0);
    });

    await page.evaluateHandle("document.fonts.ready");
    await new Promise((r) => setTimeout(r, 500));

    await mkdir(dirname(OUT_PATH), { recursive: true });
    const pdf = await page.pdf({
      path: OUT_PATH,
      format: "Letter",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "12mm", bottom: "12mm", left: "12mm", right: "12mm" },
    });
    console.log(`Wrote ${OUT_PATH} (${(pdf.length / 1024).toFixed(0)} KB)`);
  } finally {
    await browser.close();
  }
}

withServer(run).catch((err) => {
  console.error(err);
  process.exit(1);
});
