from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'SvnPatchMakerApp.views.home'),
    url(r'^svnprojects$', 'SvnPatchMakerApp.views.svnprojects'),
    url(r'^svnconverters$', 'SvnPatchMakerApp.views.svnconverters'),
    url(r'^svnaccounts$', 'SvnPatchMakerApp.views.svnaccounts'),
    url(r'^add_or_up_project$', 'SvnPatchMakerApp.views.add_or_up_project'),
    url(r'^del_project$', 'SvnPatchMakerApp.views.del_project'),
    url(r'^add_or_up_converter$', 'SvnPatchMakerApp.views.add_or_up_converter'),
    url(r'^del_converter$', 'SvnPatchMakerApp.views.del_converter'),
    url(r'^add_or_up_user$', 'SvnPatchMakerApp.views.add_or_up_user'),
    url(r'^del_user$', 'SvnPatchMakerApp.views.del_user'),
    url(r'^svnlogdatas$', 'SvnPatchMakerApp.views.svnlogdatas'),
    url(r'^checkfiles', 'SvnPatchMakerApp.views.checkfiles'),
    url(r'^packfiles', 'SvnPatchMakerApp.views.packfiles'),
    url(r'^updateworkpath', 'SvnPatchMakerApp.views.updateworkpath'),
    url(r'^execute_command', 'SvnPatchMakerApp.views.execute_command'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
)
