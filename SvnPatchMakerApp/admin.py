from django.contrib import admin
from SvnPatchMakerApp.models import SvnProject, SvnAccount, SvnConverter

class SvnProjectAdmin(admin.ModelAdmin):
    list_display = ('projectname', 'svnurl', 'svnpath', 'workpath', 'savepath', )
    search_fields = ('projectname', )

class SvnAccountAdmin(admin.ModelAdmin):
    list_display = ('username', 'password', )
    search_fields = ('username', )

class SvnConverterAdmin(admin.ModelAdmin):
    list_display = ('key', 'value', )
    search_fields = ('key', )

# Register your models here.
admin.site.register(SvnProject, SvnProjectAdmin)
admin.site.register(SvnAccount, SvnAccountAdmin)
admin.site.register(SvnConverter, SvnConverterAdmin)