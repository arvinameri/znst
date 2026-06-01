"""
Django settings for FeCoin project.
FIXED: CSRF Verification Failed (403) & HTTPS Handling
"""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# =========================================================
# 🔐 SECURITY SETTINGS
# =========================================================

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-CHANGE_THIS_TO_A_VERY_LONG_RANDOM_STRING_FOR_PRODUCTION')

# فعلاً True باشد تا اگر ارور دیگری بود ببینیم
DEBUG = True 

ALLOWED_HOSTS = [
    'znstcrypto.com', 
    'www.znstcrypto.com', 
    '45.149.154.109', 
    'localhost', 
    '127.0.0.1',
    '*'
]

# =========================================================
# 🚨 تنظیمات حیاتی برای حل مشکل 403 CSRF
# =========================================================

# ۱. لیست دامنه‌های مجاز (با https)
CSRF_TRUSTED_ORIGINS = [
    'https://znstcrypto.com',
    'https://www.znstcrypto.com',
    'https://45.149.154.109'
]

# ۲. به جنگو می‌گوییم به هدرهای پروکسی اعتماد کند (حل مشکل Origin Check)
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# ۳. چون سایت شما HTTPS است، این‌ها باید همیشه True باشند (حتی در Debug)
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

# =========================================================
# 📦 INSTALLED APPS
# =========================================================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'whitenoise.runserver_nostatic', 
    'django.contrib.staticfiles',
    'transactions',
    'django_extensions',
]

MIDDLEWARE = [
    'FeCoin.middleware.FixDuplicateProxyHeadersMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'FeCoin.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
            os.path.join(BASE_DIR, 'FeCoin', 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'FeCoin.wsgi.application'

# =========================================================
# 🗄️ DATABASE
# =========================================================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# =========================================================
# 🔒 PASSWORD VALIDATION
# =========================================================

AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]

# =========================================================
# 🌍 INTERNATIONALIZATION
# =========================================================

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# =========================================================
# 🎨 STATIC & MEDIA
# =========================================================

STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# =========================================================
# 📝 CONTENT AUTOMATION TOKEN
# =========================================================
CONTENT_AUTOMATION_TOKEN = "znst_live_8f4a2b9c1d3e5f7a9b2c4d6e8f0a1b3c5d7e9f2a4b6c8d0e1f3a5b7c9d1e2f3"