from flask import Flask, request, redirect, url_for, render_template, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Opportunity, Interest
import os

app = Flask(__name__)
app.config.from_object('config.Config')

db.init_app(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password')
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        interest_id = request.form.get('interest')
        
        if User.query.filter_by(email=email).first():
            flash('Email already exists!')
        else:
            hashed_password = generate_password_hash(password)
            new_user = User(email=email, password=hashed_password)
            interest = Interest.query.get(interest_id)
            new_user.interests.append(interest)
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user)
            return redirect(url_for('dashboard'))
    
    return render_template('register.html', interests=Interest.query.all())

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/dashboard')
@login_required
def dashboard():
    # Fetch opportunities matching the user's interests
    user_interest_names = [interest.name for interest in current_user.interests]
    opportunities = Opportunity.query.filter(Opportunity.interest_field.in_(user_interest_names)).all()
    return render_template('user_dashboard.html', opportunities=opportunities)

@app.route('/add_event', methods=['GET', 'POST'])
@login_required
def add_event():
    if request.method == 'POST':
        organization_name = request.form['organization_name']
        description = request.form['description']
        interest_field = request.form['interest_field']
        location = request.form['location']
        date = request.form['date']
        
        new_opportunity = Opportunity(
            organization_name=organization_name,
            description=description,
            interest_field=interest_field,
            location=location,
            date=date,
            creator_id=current_user.id
        )
        db.session.add(new_opportunity)
        db.session.commit()
        return redirect(url_for('dashboard'))

    return render_template('add_event.html', interests=Interest.query.all())

if __name__ == '__main__':
    app.run(debug=True)
