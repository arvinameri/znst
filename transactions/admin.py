# transactions/admin.py
from django.contrib import admin
from .models import Transaction, BlogPost, Category

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('wallet_address', 'usdt_amount', 'fecoin_amount', 'timestamp', 'transaction_hash')
    list_filter = ('timestamp',)
    search_fields = ('wallet_address', 'transaction_hash')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at') 
    search_fields = ('name',)

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    # cover_image را به لیست اضافه کردیم
    list_display = ('id', 'title', 'status', 'publish_at', 'author', 'has_image')
    list_filter = ('status', 'created_at')
    search_fields = ('title', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    
    # نمایش فیلدها در صفحه ویرایش
    fields = ('title', 'slug', 'content', 'excerpt', 'cover_image', 'feature_image_path', 'categories', 'status', 'publish_at', 'author')

    # یک ستون سفارشی برای اینکه ببینیم پست عکس دارد یا نه
    def has_image(self, obj):
        return "✅" if obj.cover_image or obj.feature_image_path else "❌"
    has_image.short_description = "Image"