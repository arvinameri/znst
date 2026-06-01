# transactions/urls.py
# 💎 ZNST URL CONFIGURATION - FINAL COMPLETE VERSION 💎

from django.urls import path
from . import views

urlpatterns = [
    # صفحه اصلی
    path('', views.index, name='index'), 
    
    # چارت و قیمت و هوش مصنوعی
    path('api/record_transaction/', views.record_transaction, name='record_transaction'),
    path('api/ask_ai/', views.ask_ai, name='ask_ai'),
    path('api/get_zinc_price_data/', views.get_zinc_price_data, name='get_zinc_price_data'),

    # --- موتور سواپ و خرید (Backend-Driven Endpoints) ---
    
    # 1. دریافت نرخ تبدیل
    path('api/get_swap_rate/', views.get_swap_rate, name='get_swap_rate'),
    
    # 2. چک کردن مجوز برداشت
    path('api/check_allowance/', views.check_allowance, name='check_allowance'),
    
    # 3. ساخت تراکنش‌های سواپ
    path('api/create_swap_approve_tx/', views.create_swap_approve_tx, name='create_swap_approve_tx'),
    path('api/create_swap_tx/', views.create_swap_tx, name='create_swap_tx'),
    
    # 4. ساخت تراکنش‌های خرید مستقیم ZNST
    path('api/create_approve_tx/', views.create_approve_transaction, name='create_approve_tx'),
    path('api/create_buy_tokens_tx/', views.create_buy_tokens_transaction, name='create_buy_tokens_tx'),
    
    # 5. پخش تراکنش در شبکه
    path('api/broadcast_transaction/', views.broadcast_transaction, name='broadcast_transaction'),

    # ========================================================
    # 🤖 اتوماسیون تولید محتوا (Content Automation API)
    # ========================================================
    
    # 1. آپلود تصویر مقاله
    path('api/v1/remote/upload/insert', views.remote_upload_image, name='remote_upload'),
    
    # 2. دریافت و انتشار مقاله
    path('api/v1/remote/blog-post/insert', views.remote_create_post, name='remote_create_post'),
    path('blog/', views.blog_list, name='blog_list'),
    path('blog/<slug:slug>/', views.blog_detail, name='blog_detail'),
    path('whitepaper/', views.whitepaper, name='whitepaper'),
]