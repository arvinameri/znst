import os
import time
import json
import traceback  # اضافه شد برای نمایش دقیق خطاها
from dotenv import load_dotenv
import yfinance as yf
from tronpy import Tron
from tronpy.keys import PrivateKey
from tronpy.providers import HTTPProvider
from requests.exceptions import ConnectionError, Timeout # اضافه شد برای اطمینان

# --- ۱. بارگذاری تنظیمات از فایل .env ---
load_dotenv()

# خواندن متغیرها از فایل .env
PRIVATE_KEY_STR = os.getenv("PRIVATE_KEY")
ZNDT_SALE_ADDRESS = os.getenv("ZNDT_SALE_ADDRESS")

# --- ۲. تنظیمات اولیه و ثابت‌ها ---
# ضریب مقیاس برای شبیه سازی قیمت LME
SCALING_FACTOR = 226

# --- ⏱️ تنظیم زمان آپدیت: هفته‌ای یک بار ---
# فرمول: 7 روز * 24 ساعت * 60 دقیقه * 60 ثانیه = 604800 ثانیه
UPDATE_INTERVAL_SECONDS = 604800 

def get_live_price_in_cents():
    try:
        json_path = "zinc_price.json"
        
        if not os.path.exists(json_path):
            print("⚠️ Waiting for scraper...")
            return None

        with open(json_path, 'r') as f:
            data = json.load(f)
        
        # قیمت الان دقیقاً همان قیمت جهانی است (مثلاً 3090 دلار)
        lme_price = float(data['price'])
        
        # ⚠️ فرمول جدید:
        # اگر می‌خواهی قیمت دقیقاً برابر قیمت جهانی باشد:
        final_price = lme_price 
        
        # اگر توکن شما معادل 1 کیلوگرم روی است (قیمت جهانی تقسیم بر 1000):
        # final_price = lme_price / 1000

        # تبدیل به سنت (ضرب در 100)
        price_in_cents = int(final_price * 100)
        
        print(f"✅ Price from JSON: ${lme_price} -> Oracle Cents: {price_in_cents}")
        return price_in_cents

    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def update_smart_contract_price(client, contract, price_in_cents):
    """
    این تابع به قرارداد هوشمند متصل شده و تابع updateLmeZincPrice را صدا می زند.
    """
    try:
        # ساخت کلید خصوصی و آدرس کیف پول
        private_key = PrivateKey(bytes.fromhex(PRIVATE_KEY_STR))
        wallet_addr = private_key.public_key.to_base58check_address()
        
        print(f"👤 آدرس اوراکل: {wallet_addr}")

        # بررسی موجودی TRX برای جلوگیری از فیل شدن تراکنش
        try:
            balance = client.get_account_balance(wallet_addr)
            print(f"💰 موجودی کیف پول: {balance} TRX")
            
            if balance < 50:
                print("⚠️ هشدار جدی: موجودی ترون برای پرداخت کارمزد کم است!")
        except Exception as e:
            print(f"⚠️ نتوانستم موجودی را چک کنم (ادامه می دهم): {e}")

        # ساخت تراکنش (Transaction Builder)
        txn = (
            contract.functions.updateLmeZincPrice(price_in_cents)
            .with_owner(wallet_addr)
            .fee_limit(100_000_000) # لیمیت 100 ترون برای اطمینان
            .build()
            .sign(private_key)
        )
        
        print("📤 در حال ارسال تراکنش به شبکه...")
        result = txn.broadcast().wait()
        
        # بررسی نتیجه تراکنش
        if result.get('result') == True:
            print(f"🚀 موفقیت! قیمت در بلاکچین آپدیت شد.")
            print(f"🔗 هش تراکنش: {result['id']}")
            return True
        else:
            print(f"❌ تراکنش توسط شبکه رد شد: {result}")
            # اگر پیامی از سمت قرارداد باشد چاپ می کند
            if 'message' in result:
                print(f"پیام خطا: {bytes.fromhex(result['message']).decode('utf-8', errors='ignore')}")
            return False

    except Exception as e:
        print(f"❌ خطای بحرانی در ارسال تراکنش: {e}")
        # چاپ جزئیات دقیق خطا برای دیباگ
        traceback.print_exc()
        return False

# --- ۳. حلقه اصلی اجرای برنامه ---
def run_oracle():
    # بررسی وجود متغیرهای محیطی
    if not PRIVATE_KEY_STR or not ZNDT_SALE_ADDRESS:
        print("❌ خطا: فایل .env تنظیم نشده است (کلید خصوصی یا آدرس قرارداد نیست).")
        return

    print("🌍 در حال اتصال به شبکه اصلی TRON (Mainnet)...")
    
    # اتصال به نود اصلی
    try:
        client = Tron() 
        # تست اتصال
        block = client.get_latest_block_number()
        print(f"✅ اتصال برقرار شد. آخرین بلاک: {block}")

        # گرفتن آبجکت قرارداد
        contract = client.get_contract(ZNDT_SALE_ADDRESS)
        print(f"✅ قرارداد فروش شناسایی شد: {ZNDT_SALE_ADDRESS}")
        
    except Exception as e:
        print(f"❌ خطا در اتصال اولیه به شبکه ترون: {e}")
        print("لطفاً اینترنت یا VPN خود را چک کنید.")
        return

    print("🚀 سیستم اوراکل شروع به کار کرد (فاصله آپدیت: هر 7 روز).")
    print("برای توقف برنامه، کلیدهای Ctrl + C را فشار دهید.")
    
    # حلقه بی پایان
    while True:
        try:
            print("\n" + "=" * 50)
            print(f"⏰ زمان اجرا: {time.ctime()}")
            
            # 1. دریافت قیمت
            new_price = get_live_price_in_cents()
            
            # 2. ارسال به قرارداد (اگر قیمت معتبر بود)
            if new_price:
                update_smart_contract_price(client, contract, new_price)
            else:
                print("⚠️ قیمت دریافت نشد. تلاش مجدد در دور بعد...")
            
            # 3. خواب زمستانی
            print(f"💤 خواب زمستانی برای 1 هفته ({UPDATE_INTERVAL_SECONDS} ثانیه)...")
            time.sleep(UPDATE_INTERVAL_SECONDS)
            
        except KeyboardInterrupt:
            print("\n🛑 برنامه توسط کاربر متوقف شد.")
            break
        except Exception as e:
            print(f"❌ خطای پیش‌بینی نشده در حلقه اصلی: {e}")
            print("تلاش مجدد پس از 60 ثانیه...")
            time.sleep(60)

if __name__ == "__main__":
    run_oracle()