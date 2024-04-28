from flask import Flask, request, redirect, url_for, render_template, flash, jsonify
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
    if current_user.is_authenticated:
        logout_user()
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

@app.route('/event', methods=['GET'])
@login_required
def event():
    interests = Interest.query.all()
    return render_template('event.html', interests=interests)

@app.route('/add-event', methods=['POST'])
@login_required
def add_event():
    organization_name = request.form['organization_name']
    description = request.form['description']
    interest_id = request.form['interest']
    location = request.form['location']
    date = request.form['date']

    # Debug print to trace the received data
    print(f"Received data - Organization Name: {organization_name}, Description: {description}, Interest ID: {interest_id}, Location: {location}, Date: {date}")

    # Create a new event instance
    new_event = Opportunity(
        organization_name=organization_name,
        description=description,
        interest_field=Interest.query.get(interest_id).name if Interest.query.get(interest_id) else 'Unknown',  # Ensure interest is found or set as 'Unknown'
        location=location,
        date=date,
        creator_id=current_user.id  # Assuming the creator is the logged-in user
    )

    # Add the event to the session and commit to the database
    db.session.add(new_event)
    try:
        db.session.commit()
        print(f"Event added successfully: {new_event.organization_name} on {new_event.date}")
        flash('Event successfully added!')
    except Exception as e:
        db.session.rollback()
        print(f"Failed to add event: {str(e)}")
        flash('Failed to add event, please try again.')

    return redirect(url_for('dashboard'))

@app.route('/explore')
@login_required
def explore():
    # Fetch user interests
    user_interests = current_user.interests

    # Fetch opportunities that match any of the user's interests
    matched_opportunities = Opportunity.query.join(Interest, Opportunity.interest_field == Interest.name)\
        .filter(Interest.id.in_([interest.id for interest in user_interests])).all()

    return render_template('explore.html', opportunities=matched_opportunities)

@app.route('/api/opportunities')
@login_required  # Ensure only logged-in users can access this
def api_opportunities():
    if not current_user.is_authenticated:
        return jsonify({'error': 'User not authenticated'}), 401

    user_interests = current_user.interests
    matched_opportunities = Opportunity.query.join(Interest, Opportunity.interest_field == Interest.name)\
        .filter(Interest.id.in_([interest.id for interest in user_interests])).all()

    return jsonify([{
        'image': 'path/to/image.png',  # Adjust according to your actual image handling
        'organization_name': opp.organization_name,
        'description': opp.description,
        'interest_field': opp.interest_field,
        'location': opp.location,
        'date': opp.date
    } for opp in matched_opportunities])


if __name__ == '__main__':
    app.run(debug=True)
