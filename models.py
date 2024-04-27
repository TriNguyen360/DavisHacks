from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Association table for the many-to-many relationship between users and interests
user_interests = db.Table('user_interests',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('interest_id', db.Integer, db.ForeignKey('interest.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user')  # Roles include 'user' and 'admin'
    interests = db.relationship('Interest', secondary=user_interests, backref=db.backref('users', lazy='dynamic'))

class Opportunity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    organization_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(300), nullable=False)
    interest_field = db.Column(db.String(80), nullable=False)  # Should correspond to Interest.name
    location = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Link opportunity to a user (admin) who created it

class Interest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

# Define interest categories as instances of Interest that can be added to the database
interest_categories = [
    'Environment', 'Education', 'Health', 'Community Development',
    'Arts and Culture', 'Animal Welfare', 'Social Services',
    'Technology', 'Sports and Recreation', 'Disaster Relief'
]
