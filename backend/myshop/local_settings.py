import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Security
SECRET_KEY = os.environ.get(
    'SECRET_KEY',
    'django-insecure-+(@clydi&^06dxoa98e^xudb%cuw)!ju=!j-kxww^!g%jq1&v9'
)
DEBUG = os.environ.get('DEBUG', 'False').lower() in ('true', '1', 'yes')

ALLOWED_HOSTS = [
    '*',
    '.fly.dev',
    'pinkcycle.fly.dev',
    'pinkcycle-wandering-lagoon-7811.fly.dev',
    'pinkcycle.co.ke',
    'www.pinkcycle.co.ke',
    'localhost',
    '127.0.0.1',
]

CSRF_TRUSTED_ORIGINS = [
    'https://pinkcycle.fly.dev',
    'https://pinkcycle-wandering-lagoon-7811.fly.dev',
    'https://*.fly.dev',
    'https://pinkcycle.co.ke',
    'https://www.pinkcycle.co.ke',
    'http://localhost',
    'http://127.0.0.1',
]

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'None'
SESSION_COOKIE_SAMESITE = 'None'

# Database & Media on persistent volume if available
DATA_DIR = Path('/data')
if DATA_DIR.exists() and os.access(str(DATA_DIR), os.W_OK):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': DATA_DIR / 'db.sqlite3',
        }
    }
    MEDIA_ROOT = str(DATA_DIR / 'media')
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
    MEDIA_ROOT = os.environ.get('MEDIA_ROOT', str(BASE_DIR / 'media'))

# Stripe settings
STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY', 'pk_test_placeholder')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY', 'sk_test_placeholder')
STRIPE_API_VERSION = os.environ.get('STRIPE_API_VERSION', '2024-04-10')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET', 'whsec_placeholder')

GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', 'placeholder-google-client-id')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET', 'placeholder-google-client-secret')
