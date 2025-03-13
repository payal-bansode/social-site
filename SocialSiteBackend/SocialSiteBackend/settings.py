import os

from pathlib import Path
import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Initialize environ
env = environ.Env()

# Read the .env file
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))



# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool('DJANGO_DEBUG', default=False)

ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS', default=['localhost'])

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',  # Add this
     "corsheaders",
    
    
    'account',
    'post',
    
    'djoser',
]

# custome user modle
AUTH_USER_MODEL = 'account.CustomUser'




# REST_FRAMEWORK SETTINGS

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}



# Simple JWT Settings
from datetime import timedelta

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=env.int('ACCESS_TOKEN_TIME_DJOSER', default=120)),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=env.int('REFRESH_TOKEN_TIME_DJOSER', default=2)),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ('Bearer',),
}


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    
     "corsheaders.middleware.CorsMiddleware",
    
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
# CORS
CORS_ALLOWED_ORIGINS = env.list('DJANGO_CORS_ALLOWED_ORIGINS', default=["http://localhost:80"])



ROOT_URLCONF = 'SocialSiteBackend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'SocialSiteBackend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

# Database settings (SQLite)
DATABASES = {
    'default': {
        'ENGINE': env('DJANGO_DB_ENGINE'),
        'NAME': BASE_DIR / env('DJANGO_DB_NAME'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = '/static/'
MEDIA_URL = "/media/"
    
    

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# if DEBUG:
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')






# Email Configuration
EMAIL_BACKEND = env('EMAIL_BACKEND', default='django.core.mail.backends.smtp.EmailBackend')
EMAIL_HOST = env('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = env.int('EMAIL_PORT', default=587)
EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS', default=True)
EMAIL_HOST_USER = env('EMAIL_ID')

EMAIL_HOST_PASSWORD =env('EMAIL_PASSWORD')



# STATIC_URL = 'static/'
# STATIC_ROOT=os.path.join(BASE_DIR,'static')

# # Media files (uploads)
# MEDIA_URL = '/media/'
# MEDIA_ROOT = os.path.join(BASE_DIR, 'media')



# DJOSER
DJOSER = {
    # User Identification
    'USER_ID_FIELD': env('DJOSER_USER_ID_FIELD', default='username'),  # Use 'username' as the unique identifier for users
    'LOGIN_FIELD': env('DJOSER_LOGIN_FIELD', default='email'),  # Specify 'email' as the field for login

    # URL Configuration for Frontend Pages
    # These URLs are used to redirect users to the appropriate pages on the frontend when actions like password reset or account activation occur.

    'PASSWORD_RESET_CONFIRM_URL': env('DJOSER_PASSWORD_RESET_CONFIRM_URL', default='reset-account-password/{uid}/{token}/'),
    'USERNAME_RESET_CONFIRM_URL': env('DJOSER_USERNAME_RESET_CONFIRM_URL', default='reset-email/{uid}/{token}/'),
    'ACTIVATION_URL': env('DJOSER_ACTIVATION_URL', default='activate-account/{uid}/{token}/'),



    # Email Frontend Customization
    # These settings customize the URLs and site information used in email messages sent to users.
  'EMAIL_FRONTEND_PROTOCOL': env('DJOSER_EMAIL_FRONTEND_PROTOCOL', default='http'),  # Protocol to be used in email links
    'EMAIL_FRONTEND_DOMAIN': env('DJOSER_EMAIL_FRONTEND_DOMAIN', default='localhost:3000'),  # Domain to be used in email links
    'EMAIL_FRONTEND_SITE_NAME': env('DJOSER_EMAIL_FRONTEND_SITE_NAME', default='Steno Console'),  # The name of the site

    # Email Features
    # Enable/disable specific email notifications for user actions.
    # Email Features
    'SEND_ACTIVATION_EMAIL': env.bool('DJOSER_SEND_ACTIVATION_EMAIL', default=True),
    'SEND_CONFIRMATION_EMAIL': env.bool('DJOSER_SEND_CONFIRMATION_EMAIL', default=True),
    'PASSWORD_CHANGED_EMAIL_CONFIRMATION': env.bool('DJOSER_PASSWORD_CHANGED_EMAIL_CONFIRMATION', default=True),
    'USERNAME_CHANGED_EMAIL_CONFIRMATION': env.bool('DJOSER_USERNAME_CHANGED_EMAIL_CONFIRMATION', default=True),

    # Password & Username Retype Validation
    # Enforce retyping of critical fields to avoid accidental mismatches.
    'USER_CREATE_PASSWORD_RETYPE': env.bool('DJOSER_USER_CREATE_PASSWORD_RETYPE', default=True),
    'SET_USERNAME_RETYPE': env.bool('DJOSER_SET_USERNAME_RETYPE', default=True),
    'SET_PASSWORD_RETYPE': env.bool('DJOSER_SET_PASSWORD_RETYPE', default=True),
    'PASSWORD_RESET_CONFIRM_RETYPE': env.bool('DJOSER_PASSWORD_RESET_CONFIRM_RETYPE', default=True),
    'USERNAME_RESET_CONFIRM_RETYPE': env.bool('DJOSER_USERNAME_RESET_CONFIRM_RETYPE', default=True),

    # Disable the `set_username` endpoint to prevent direct username changes
    # 'DISABLE_ENDPOINTS': ['set_username'],  # Disable the 'set_username' endpoint for all users

    # Permissions for Views
    'PERMISSIONS': {
        
        # permission to update the user 
         'user': ['djoser.permissions.CurrentUserOrAdminOrReadOnly'],
        # Restrict Access to User List
        # Only admin users can view the list of all users (/users/ endpoint).
        'user_list': ['rest_framework.permissions.IsAdminUser'],
},
    
   'DISABLE_ENDPOINTS': ['set_email'],  # Disable the direct username update endpoint
    
    'SERIALIZERS': {
        'user': 'account.searilizers.CustomUserSerializer',
        'current_user': 'account.searilizers.CustomUserSerializer',  # Explicitly specify for user/me/ endpoint
    },
}