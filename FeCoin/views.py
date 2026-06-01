from django.shortcuts import render
import os

def index(request):
    # قیمت ثابت برای توکن
    fecoin_price = "0.10"  # متغیر با این نام تعریف شده
    
    # خواندن آدرس‌های قرارداد از متغیرهای محیطی
    contract_address = os.getenv('CONTRACT_ADDRESS')
    usdt_address = os.getenv('USDT_ADDRESS')

    context = {
        'price': fecoin_price,  # <-- حالا نام متغیر صحیح است
        'contract_address': contract_address,
        'usdt_address': usdt_address,
    }
    return render(request, 'index.html', context=context)