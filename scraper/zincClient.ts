// C:\Users\ameri\Desktop\FeCoin_V2\scraper\zincClient.ts

import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Browser, Page } from "playwright";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

// 1. فعال‌سازی حالت مخفی (Stealth Mode) برای فریب دادن آنتی‌ربات‌ها
chromium.use(StealthPlugin());

// 2. تنظیم مسیر خروجی فایل JSON
// با استفاده از .. از پوشه scraper خارج می‌شویم و فایل را در روت پروژه (کنار oracle.py) می‌سازیم
const OUTPUT_FILE = path.join(__dirname, "../zinc_price.json");

export class ZincScraperEngine {
  private browser: Browser | null = null;
  private page: Page | null = null;

  // آدرس دقیق صفحه روی (Zinc) در TGJU
  private readonly TARGET_URL = "https://www.tgju.org/profile/basemetal-zinc";

  // هدرهای جعلی برای شبیه‌سازی مرورگر واقعی کروم
  private readonly FAKE_HEADERS = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,fa;q=0.8",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  };

  constructor() {
    console.log("💎 Zinc Scraper Engine Initialized.");
    console.log(`📂 Data will be saved to: ${OUTPUT_FILE}`);
    this.startLoop();
  }

  // حلقه اصلی برنامه
  private startLoop() {
    console.log("🚀 Starting price fetch loop...");

    // اجرای فوری برای بار اول
    this.fetchPrice();

    // اجرای مداوم هر 60 ثانیه (برای جلوگیری از بلاک شدن IP)
    setInterval(async () => {
      await this.fetchPrice();
    }, 60000);
  }

  async fetchPrice() {
    // روش الف: درخواست سریع (HTML Request)
    // این روش زیر 1 ثانیه طول می‌کشد و منابع سیستم را مصرف نمی‌کند
    const success = await this.fetchViaHtml();

    // روش ب: اگر روش الف شکست خورد، مرورگر سنگین باز می‌شود
    if (!success) {
      console.warn("⚠️ HTML fetch failed. Engaging Heavy Browser Mode...");
      await this.fetchViaBrowser();
    }
  }

  // --- روش 1: دانلود متن صفحه و استخراج با Regex ---
  private async fetchViaHtml(): Promise<boolean> {
    try {
      const response = await fetch(this.TARGET_URL, {
        headers: this.FAKE_HEADERS,
      });
      if (!response.ok) return false;

      const html = await response.text();

      // 🎯 شکار دقیق: جستجو برای data-col="info.last_trade.PDrCotVal"
      // این پترن دنبال عددی می‌گردد که بعد از تگ بسته شده (>) بیاید
      const pattern =
        /data-col="info\.last_trade\.PDrCotVal"[^>]*>\s*([\d,.]+)/;

      const match = html.match(pattern);
      if (match && match[1]) {
        const priceStr = match[1].replace(/,/g, "").trim(); // حذف کاما
        const price = parseFloat(priceStr);

        if (price > 0) {
          this.saveToFile(price, "FAST_HTML");
          return true;
        }
      }
      return false;
    } catch (e) {
      console.error("HTML Fetch Error:", e);
      return false;
    }
  }

  // --- روش 2: باز کردن مرورگر واقعی (Playwright) ---
  private async fetchViaBrowser() {
    try {
      // اگر مرورگر باز نیست، بازش کن
      if (!this.browser) {
        this.browser = await chromium.launch({
          headless: true, // مرورگر مخفی باشد
          args: ["--no-sandbox"], // برای اجرا روی سرورهای لینوکسی هم امن است
        });
        this.page = await this.browser.newPage();
      }

      console.log("🌐 Navigating with Browser...");
      await this.page!.goto(this.TARGET_URL, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      // پیدا کردن المنت با استفاده از سلکتور CSS دقیق
      const priceText = await this.page!.$eval(
        '[data-col="info.last_trade.PDrCotVal"]',
        (el) => el.textContent
      );

      if (priceText) {
        const price = parseFloat(priceText.replace(/,/g, "").trim());
        if (price > 0) {
          this.saveToFile(price, "BROWSER_DOM");
        }
      }
    } catch (error) {
      console.error("🔥 Browser Error:", error);
      // اگر مرورگر کرش کرد، ببندش تا رم سیستم پر نشود
      if (this.browser) {
        await this.browser.close().catch(() => {});
        this.browser = null;
        this.page = null;
      }
    }
  }

  // --- ذخیره نهایی در فایل JSON ---
  private saveToFile(price: number, source: string) {
    const data = {
      symbol: "LME_ZINC",
      price: price,
      last_updated: Date.now(),
      readable_time: new Date().toLocaleString("fa-IR"),
      source: source,
    };

    // نوشتن فایل (اگر وجود نداشت می‌سازد، اگر بود جایگزین می‌کند)
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));

    console.log(
      `✅ [${new Date().toLocaleTimeString(
        "en-GB"
      )}] Price Updated: $${price} (via ${source})`
    );
  }
}

// شروع برنامه
new ZincScraperEngine();
