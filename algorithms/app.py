from flask import Flask, render_template, redirect, url_for
from flask_login import LoginManager, UserMixin, current_user
from flask_cors import CORS
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
CORS(app)  # Enable CORS for all routes

# Initialize login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# User model
class User(UserMixin):
    def __init__(self, id, username='Guest'):
        self.id = id
        self.username = username
    
    def get_id(self):
        return str(self.id)

@login_manager.user_loader
def load_user(user_id):
    return User(user_id)

# Make current_user available in templates
@app.context_processor
def inject_user():
    return {'current_user': current_user if current_user.is_authenticated else User('guest')}

@app.route('/dashboard')
def dashboard():
    try:
        return render_template('dashboard.html')
    except Exception as e:
        app.logger.error(f"Error rendering dashboard.html: {e}")
        return f"Error: {e}", 500

@app.route('/mergesort')
def mergesort():
    try:
        return render_template('mergesort.html')
    except Exception as e:
        app.logger.error(f"Error rendering mergesort.html: {e}")
        return f"Error: {e}", 500

@app.route('/')
@app.route('/index')
def index():
    try:
        return render_template('index.html')
    except Exception as e:
        app.logger.error(f"Error rendering index.html: {e}")
        return f"Error: {e}", 500

@app.route('/login', methods=['GET', 'POST'])
def login():
    try:
        return render_template('login.html')
    except Exception as e:
        app.logger.error(f"Error rendering login.html: {e}")
        return f"Error: {e}", 500

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    try:
        return render_template('signup.html')
    except Exception as e:
        app.logger.error(f"Error rendering signup.html: {e}")
        return f"Error: {e}", 500

@app.route('/dijkstra')
def dijkstra():
    try:
        return render_template('dijkstra.html')
    except Exception as e:
        app.logger.error(f"Error rendering dijkstra.html: {e}")
        return f"Error: {e}", 500

@app.route('/logout')
def logout():
    try:
        return redirect(url_for('login'))
    except Exception as e:
        app.logger.error(f"Error during logout: {e}")
        return f"Error: {e}", 500

if __name__ == '__main__':
    app.run(debug=True, port=8000, host='0.0.0.0')