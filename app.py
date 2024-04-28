from flask import Flask, request, redirect, url_for, render_template, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models.models import db, User, Opportunity, Interest
import os
from flask_migrate import Migrate

app = Flask(__name__)
app.config.from_object('config.Config')

db.init_app(app)
migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.cli.command("seed-db")
def seed_db():
    """Seed the database with initial data."""
    if Interest.query.first() is None:
        interests = [
            'Environment', 'Education', 'Health', 'Community Development',
            'Arts and Culture', 'Animal Welfare', 'Social Services',
            'Technology', 'Sports and Recreation', 'Disaster Relief'
        ]
        for name in interests:
            interest = Interest(name=name)
            db.session.add(interest)
        db.session.commit()
        print("Database seeded!")
    else:
        print("Database already seeded.")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        
        if user:
            print(f"User found in database: {user.email}")  # Debug print
        else:
            print(f"No user found with email: {email}")  # Debug print

        if user and check_password_hash(user.password, password):
            login_user(user)
            print(f"Login successful for: {user.email}")  # Debug print
            return redirect(url_for('dashboard'))  # Assuming 'dashboard' is the function name for your home route
        else:
            flash('Invalid email or password')
            print(f"Failed login attempt for email: {email}")  # Debug print
            return render_template('login.html')
    
    return render_template('login.html')



@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        print("User is already authenticated, redirecting to home.")
        return redirect(url_for('home'))
    
    print("Registration endpoint hit with method: ", request.method)  # Confirm method

    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        interest_id = request.form['interest']
        print(f"Form data received - Email: {email}, Password: {password}, Interest ID: {interest_id}")

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            print("Email already exists in the database.")
            flash('Email already exists!')
            return render_template('register.html')
        
        hashed_password = generate_password_hash(password)
        new_user = User(email=email, password=hashed_password)
        interest = Interest.query.get(interest_id)
        if interest is None:
            print("Invalid interest selected.")
            flash('Invalid interest selected')
            return render_template('register.html')
        
        new_user.interests.append(interest)
        db.session.add(new_user)
        
        try:
            db.session.commit()
            print(f"New user created successfully: {new_user.email}, ID: {new_user.id}")
            login_user(new_user)
            return redirect(url_for('home'))
        except Exception as e:
            print(f"Failed to commit the transaction: {str(e)}")
            db.session.rollback()  # Roll back the session in case of failure to avoid session being in a bad state
            return render_template('register.html')
    
    return render_template('register.html')



@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))  # Redirects user to home page after logging out


@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('home.html')


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return "Internal Server Error", 500  # Modified to return a simple error message

if __name__ == '__main__':
    app.run(debug=True)
