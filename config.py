# config.py

import os

class Config:
    # Secret key for signing cookies
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you_can_generate_a_random_key_here'
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///volunteer.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True  # If you want to see the SQL queries being run

# You can add other configuration classes here for different environments, such as
# testing or production, which can inherit from the base Config class and override
# specific settings.
