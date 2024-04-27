from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_required, current_user
from models import db, User, Opportunity, Interest

app = Flask(__name__)
app.config.from_object('config.Config')

db.init_app(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'  # Specify the login view

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def home():
    return "Welcome to the Volunteer Matching System!"

@app.route('/login')
def login():
    # Here you would implement your login logic
    return "Login Page Placeholder"

@app.route('/dashboard')
@login_required
def dashboard():
    if current_user.role == 'admin':
        # Fetch opportunities created by this admin
        opportunities = Opportunity.query.filter_by(creator_id=current_user.id).all()
        return render_template('admin_dashboard.html', opportunities=opportunities)
    else:
        # Fetch opportunities matching the user's interests
        interests = [interest.name for interest in current_user.interests]
        opportunities = Opportunity.query.filter(Opportunity.interest_field.in_(interests)).all()
        return render_template('user_dashboard.html', opportunities=opportunities)

if __name__ == '__main__':
    app.run(debug=True)
