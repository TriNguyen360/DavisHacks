# config.py

import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///mydatabase.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'your-secret-key'

# You can add other configuration classes here for different environments, such as
# testing or production, which can inherit from the base Config class and override
# specific settings.
