"""
Views for serving the React/Expo web frontend as a Single Page Application (SPA).
All non-API, non-admin, non-static routes get served the frontend's index.html,
allowing React Router / React Navigation to handle client-side routing.
"""
import os
from django.conf import settings
from django.http import HttpResponse, FileResponse
from django.views.decorators.cache import cache_control


@cache_control(max_age=0, no_cache=True, no_store=True, must_revalidate=True)
def serve_react_app(request):
    """
    Serve the React/Expo web app. If the requested path corresponds to a real file
    in the frontend build directory (like favicon.png or manifest.json), serve that file.
    Otherwise, serve index.html to support client-side SPA routing.
    """
    frontend_dir = getattr(settings, 'FRONTEND_DIR', os.path.join(settings.BASE_DIR, 'frontend_build'))
    
    # Get clean relative path
    path_info = request.path.lstrip('/')
    if not path_info:
        path_info = 'index.html'
        
    file_path = os.path.join(frontend_dir, path_info)
    
    # If a specific static file (like favicon or manifest) is requested and exists, serve it
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(open(file_path, 'rb'))
        
    # Otherwise, fallback to index.html to let React Router handle the routing
    index_path = os.path.join(frontend_dir, 'index.html')
    if os.path.exists(index_path):
        return FileResponse(open(index_path, 'rb'), content_type='text/html')
    
    # Fallback: if frontend build doesn't exist, show a helpful message
    return HttpResponse(
        '<html><body style="font-family:sans-serif;text-align:center;padding:50px;">'
        '<h1>PinkCycle</h1>'
        '<p>Frontend build not found. The API is available at <a href="/api/">/api/</a></p>'
        '</body></html>',
        content_type='text/html',
        status=200
    )


def serve_media(request, path):
    """
    Serve media files in production (when DEBUG=False).
    In production on Fly.io, media files are stored on the container's filesystem.
    """
    media_path = os.path.join(settings.MEDIA_ROOT, path)
    if os.path.exists(media_path):
        return FileResponse(open(media_path, 'rb'))
    from django.http import Http404
    raise Http404("Media file not found")
