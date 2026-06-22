# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '<your secret key>'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']
CSRF_TRUSTED_ORIGINS = ['https://accepting-statement-rarely-southeast.trycloudflare.com', 'https://*.hopto.org', 'http://localhost', 'http://127.0.0.1']
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'None'
SESSION_COOKIE_SAMESITE = 'None'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

#DATABASES = {
#    'default': {
#        'ENGINE': 'django.db.backends.postgresql',
#        'NAME': 'finesauces',
#        'USER': 'finesaucesadmin',
#        'PASSWORD': 'faraday7',
#        'HOST': 'localhost'
#    }
#}

STRIPE_PUBLISHABLE_KEY='pk_test_placeholder_key_here'
STRIPE_SECRET_KEY='sk_test_placeholder_secret_here'
STRIPE_API_VERSION = '2024-04-10'

#EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
#EMAIL_HOST = 'smtp.gmail.com'
#EMAIL_HOST_USER ='khaemba.nganga1111@gmail.com'
#EMAIL_HOST_PASSWORD ='faraday7'
#EMAIL_PORT = 587
#EMAIL_USE_SSL = True
#DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
GOOGLE_CLIENT_ID = 'placeholder-google-client-id.apps.googleusercontent.com'
GOOGLE_CLIENT_SECRET = 'placeholder-google-client-secret'

