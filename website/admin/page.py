from django.contrib import admin
from website.models import Page, PageContentText


class PageContextTextInline(admin.TabularInline):
    model = PageContentText


class PageAdmin(admin.ModelAdmin):
    inlines = [PageContextTextInline]


admin.site.register(Page, PageAdmin)
