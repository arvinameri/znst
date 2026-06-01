import yfinance as yf

# این ضریب ممکن است نیاز به تنظیم دقیق داشته باشد.
# از تقسیم آخرین قیمت واقعی LME بر آخرین قیمت دلاری ETF بدست می آید.
SCALING_FACTOR = 226 

def get_simulated_lme_price():
    try:
        print("در حال دریافت داده‌های ETF از Yahoo Finance...")
        
        # 1. دریافت داده های ETF و نرخ تبدیل ارز
        zinc_etf = yf.Ticker("ZINC.L")
        gbp_usd = yf.Ticker("GBPUSD=X")
        
        zinc_hist = zinc_etf.history(period="5d")
        gbp_usd_hist = gbp_usd.history(period="5d")

        if zinc_hist.empty or gbp_usd_hist.empty:
            print("❌ خطا: داده‌ای دریافت نشد.")
            return

        # 2. استخراج آخرین قیمت ها
        latest_price_gbp = zinc_hist['Close'].iloc[-1]
        latest_exchange_rate = gbp_usd_hist['Close'].iloc[-1]
        
        # 3. تبدیل قیمت ETF به دلار
        latest_price_usd = latest_price_gbp * latest_exchange_rate
        
        print(f"\n✅ داده‌های خام دریافت شد:")
        print(f" - قیمت ETF به دلار: ${latest_price_usd:.2f}")
        
        # 4. شبیه سازی قیمت LME با استفاده از ضریب مقیاس
        simulated_lme_price = latest_price_usd * SCALING_FACTOR
        print(f" - قیمت شبیه‌سازی شده LME: ${simulated_lme_price:,.2f} (این عدد به قیمت واقعی نزدیک است)")

        # 5. اعمال فرمول نهایی شما
        zndt_price = simulated_lme_price / 2000
        
        print("-" * 30)
        print(f"✅ قیمت نهایی محاسبه شده برای هر توکن ZNDT: ${zndt_price:.4f}")
        print("-" * 30)

    except Exception as e:
        print(f"\n❌ یک خطای پیش‌بینی نشده رخ داد: {e}")

# --- اجرای تابع ---
if __name__ == "__main__":
    get_simulated_lme_price()