# transactions/models.py
from django.db import models
from django.contrib.auth.models import User

# ==========================================
# 1. مدل تراکنش‌ها (بدون تغییر)
# ==========================================
class Transaction(models.Model):
    wallet_address = models.CharField(max_length=42)
    usdt_amount = models.DecimalField(max_digits=20, decimal_places=6)
    fecoin_amount = models.DecimalField(max_digits=20, decimal_places=6)
    transaction_hash = models.CharField(max_length=66, unique=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.wallet_address} - {self.usdt_amount} USDT"

# ==========================================
# 2. مدل دسته‌بندی‌ها (بدون تغییر)
# ==========================================
class Category(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# ==========================================
# 3. مدل مقالات وبلاگ (آپدیت شده برای آپلود عکس)
# ==========================================
class BlogPost(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('publish', 'Published'),
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255)
    content = models.TextField() # متن کامل HTML
    excerpt = models.TextField(blank=True, null=True) # چکیده
    
    # --- بخش سئو ---
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    
    # --- 📸 بخش تصاویر (استراتژی دوگانه) ---
    
    # 1. آدرس عکس برای ربات اتوماسیون (فیلد متنی)
    feature_image_path = models.CharField(
        max_length=500, 
        blank=True, 
        null=True,
        help_text="توسط ربات اتوماسیون پر می‌شود"
    )
    
    # 2. ✅ فیلد جدید برای آپلود دستی در ادمین
    cover_image = models.ImageField(
        upload_to='blog_covers/', 
        blank=True, 
        null=True, 
        verbose_name="آپلود دستی تصویر"
    )
    
    # --- وضعیت و تاریخ ---
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    comment_status = models.CharField(max_length=10, default='open')
    
    publish_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # --- روابط ---
    categories = models.ManyToManyField(Category, blank=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.title

    # ✅ متد هوشمند برای دریافت لینک عکس در HTML
    @property
    def get_image_url(self):
        """
        اولویت با عکسی است که دستی آپلود شده (cover_image).
        اگر عکس دستی نبود، لینک عکس ربات (feature_image_path) را برمی‌گرداند.
        """
        if self.cover_image:
            return self.cover_image.url
        if self.feature_image_path:
            return self.feature_image_path
        return "" # یا یک عکس پیش‌فرض اگر هیچکدام نبود