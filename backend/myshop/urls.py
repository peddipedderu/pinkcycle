"""
URL configuration for myshop project.

The `urlpatterns` list routes URLs to views. For more information
please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import
        include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from .spa_views import serve_react_app, serve_media

urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),

    # API routes (these must come before the SPA catch-all)
    path('', include('shop.api.urls', namespace='api')),

    # Media files in production
    re_path(r'^media/(?P<path>.*)$', serve_media, name='serve_media'),

    # React SPA catch-all: all other routes are handled by the React frontend
    # This MUST be last so API and admin routes are matched first
    re_path(r'^(?!api/|admin/|static/|media/).*$', serve_react_app, name='spa'),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )
