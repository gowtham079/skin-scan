from flask import Flask, render_template, request, jsonify, send_from_directory, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
import uuid
import json

from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

app = Flask(__name__)

# Configure database
database_url = os.environ.get('DATABASE_URL')
if database_url:
    # Render's PostgreSQL URL starts with postgres:// which SQLAlchemy 1.4+ deprecated
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # Default to local SQLite database in instance folder
    os.makedirs(os.path.join(app.root_path, 'instance'), exist_ok=True)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///skin_scan.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Email Configuration
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True').lower() in ('true', '1', 't')
app.config['MAIL_USE_SSL'] = os.environ.get('MAIL_USE_SSL', 'False').lower() in ('true', '1', 't')
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', '')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', '')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', os.environ.get('MAIL_USERNAME', 'noreply@skinscan.local'))

db = SQLAlchemy(app)
mail = Mail(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    predictions = db.relationship('Prediction', backref='user', lazy=True)

class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    image_filename = db.Column(db.String(255), nullable=False)
    predicted_class = db.Column(db.String(100), nullable=False)
    confidence_score = db.Column(db.Float, nullable=False)
    top_predictions = db.Column(db.Text, nullable=False)  # JSON string of top 3 predictions
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Create database tables
with app.app_context():
    db.create_all()

# Email Functions
def send_welcome_email(user_email, username):
    if not app.config.get('MAIL_USERNAME') or not app.config.get('MAIL_PASSWORD'):
        print("Info: Welcome email skipped (SMTP credentials not configured).")
        return False
    try:
        msg = Message(
            subject='Welcome to Skin Scan! 🏥',
            recipients=[user_email],
            html=f'''
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #667eea;">Welcome to Skin Scan, {username}! 👋</h2>
                <p>Thank you for visiting our AI-powered skin lesion detection platform.</p>
                <p>With Skin Scan, you can:</p>
                <ul>
                    <li>🔍 Analyze skin lesions with AI</li>
                    <li>📊 Get detailed prediction reports</li>
                    <li>📈 Track your scan history</li>
                    <li>🛡️ Ensure your privacy with local processing</li>
                </ul>
                <p>Your health is our priority. Stay safe and healthy!</p>
                <p>Best regards,<br>The Skin Scan Team</p>
            </div>
            '''
        )
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False

def send_prediction_report(user_email, username, prediction_data):
    if not app.config.get('MAIL_USERNAME') or not app.config.get('MAIL_PASSWORD'):
        print("Info: Prediction report email skipped (SMTP credentials not configured).")
        return False
    try:
        # Parse top predictions
        top_predictions = json.loads(prediction_data['top_predictions'])
        
        # Create prediction details HTML
        predictions_html = ""
        for i, pred in enumerate(top_predictions[:3]):
            confidence = (pred['probability'] * 100)
            predictions_html += f'''
            <tr>
                <td>{i+1}</td>
                <td>{pred['className']}</td>
                <td>{confidence:.1f}%</td>
            </tr>
            '''
        
        msg = Message(
            subject=f'Skin Scan Report - {prediction_data["predicted_class"]}',
            recipients=[user_email],
            html=f'''
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #667eea;">Skin Scan Report 📋</h2>
                <p>Hello {username},</p>
                <p>Here's your skin lesion analysis report:</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #333;">Primary Prediction</h3>
                    <p><strong>Condition:</strong> {prediction_data["predicted_class"]}</p>
                    <p><strong>Confidence:</strong> {(prediction_data["confidence_score"] * 100):.1f}%</p>
                    <p><strong>Scan Time:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                </div>
                
                <h3>Top 3 Predictions</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead>
                        <tr style="background: #667eea; color: white;">
                            <th style="padding: 10px; text-align: left;">Rank</th>
                            <th style="padding: 10px; text-align: left;">Condition</th>
                            <th style="padding: 10px; text-align: left;">Confidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {predictions_html}
                    </tbody>
                </table>
                
                <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>⚠️ Important:</strong> This is an AI-assisted analysis. Please consult with a healthcare professional for medical advice.</p>
                </div>
                
                <p>Thank you for using Skin Scan!</p>
                <p>Best regards,<br>The Skin Scan Team</p>
            </div>
            '''
        )
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False

# --- User Authentication Routes ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not username or not email or not password:
        return jsonify({'success': False, 'error': 'All fields are required.'}), 400
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'success': False, 'error': 'Username or email already exists.'}), 400
    password_hash = generate_password_hash(password)
    is_admin = data.get('is_admin', False)
    user = User(username=username, email=email, password_hash=password_hash, is_admin=is_admin)
    db.session.add(user)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Registration successful.'})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username_or_email = data.get('username')
    password = data.get('password')
    user = User.query.filter((User.username == username_or_email) | (User.email == username_or_email)).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'success': False, 'error': 'Invalid username/email or password.'}), 401
    session['user_id'] = user.id
    session['username'] = user.username
    session['is_admin'] = user.is_admin
    session['email'] = user.email
    
    # Send welcome email
    send_welcome_email(user.email, user.username)
    
    return jsonify({'success': True, 'message': 'Login successful.', 'is_admin': user.is_admin, 'username': user.username, 'email': user.email})

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully.'})

@app.route('/api/user', methods=['GET'])
def get_user():
    if 'user_id' not in session:
        return jsonify({'logged_in': False})
    return jsonify({
        'logged_in': True,
        'username': session.get('username'),
        'is_admin': session.get('is_admin'),
        'email': session.get('email')
    })

# --- Health Check Route ---
@app.route('/healthz')
@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy', 'time': datetime.utcnow().isoformat()}), 200

# --- Main and Static Routes ---
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/dashboard')
def dashboard():
    return send_from_directory('.', 'dashboard.html')

@app.route('/admin')
def admin_dashboard():
    return send_from_directory('.', 'admin_dashboard.html')

@app.route('/diseases')
def diseases():
    return send_from_directory('.', 'diseases.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

@app.route('/js/<path:filename>')
def js_files(filename):
    return send_from_directory('js', filename)

@app.route('/css/<path:filename>')
def css_files(filename):
    return send_from_directory('css', filename)

@app.route('/assets/<path:filename>')
def assets_files(filename):
    return send_from_directory('assets', filename)

@app.route('/sc_detector/<path:filename>')
def sc_detector_files(filename):
    return send_from_directory('sc_detector', filename)

# --- Prediction API ---
@app.route('/api/predictions', methods=['POST'])
def save_prediction():
    if 'user_id' not in session:
        return jsonify({'success': False, 'error': 'Authentication required.'}), 401
    try:
        data = request.get_json()
        image_filename = f"scan_{uuid.uuid4().hex}.jpg"
        prediction = Prediction(
            user_id=session['user_id'],
            image_filename=image_filename,
            predicted_class=data['predicted_class'],
            confidence_score=data['confidence_score'],
            top_predictions=data['top_predictions']
        )
        db.session.add(prediction)
        db.session.commit()
        
        # Send prediction report email
        send_prediction_report(session['email'], session['username'], data)
        
        return jsonify({
            'success': True,
            'prediction_id': prediction.id,
            'message': 'Prediction saved successfully'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    if 'user_id' not in session:
        return jsonify({'success': False, 'error': 'Authentication required.'}), 401
    try:
        if session.get('is_admin'):
            predictions = Prediction.query.order_by(Prediction.created_at.desc()).limit(50).all()
        else:
            predictions = Prediction.query.filter_by(user_id=session['user_id']).order_by(Prediction.created_at.desc()).limit(50).all()
        prediction_list = []
        for pred in predictions:
            prediction_list.append({
                'id': pred.id,
                'predicted_class': pred.predicted_class,
                'confidence_score': pred.confidence_score,
                'created_at': pred.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'top_predictions': pred.top_predictions,
                'username': pred.user.username if pred.user else None
            })
        return jsonify({'success': True, 'predictions': prediction_list})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    if 'user_id' not in session:
        return jsonify({'success': False, 'error': 'Authentication required.'}), 401
    try:
        if session.get('is_admin'):
            total_predictions = Prediction.query.count()
            class_counts = db.session.query(
                Prediction.predicted_class,
                db.func.count(Prediction.id)
            ).group_by(Prediction.predicted_class).all()
            from datetime import timedelta
            week_ago = datetime.utcnow() - timedelta(days=7)
            recent_predictions = Prediction.query.filter(
                Prediction.created_at >= week_ago
            ).count()
        else:
            total_predictions = Prediction.query.filter_by(user_id=session['user_id']).count()
            class_counts = db.session.query(
                Prediction.predicted_class,
                db.func.count(Prediction.id)
            ).filter_by(user_id=session['user_id']).group_by(Prediction.predicted_class).all()
            from datetime import timedelta
            week_ago = datetime.utcnow() - timedelta(days=7)
            recent_predictions = Prediction.query.filter(
                Prediction.user_id == session['user_id'],
                Prediction.created_at >= week_ago
            ).count()
        stats = {
            'total_predictions': total_predictions,
            'recent_predictions': recent_predictions,
            'class_distribution': dict(class_counts)
        }
        return jsonify({'success': True, 'stats': stats})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# --- Admin Routes ---
@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    if 'user_id' not in session or not session.get('is_admin'):
        return jsonify({'success': False, 'error': 'Admin access required.'}), 403
    try:
        users = User.query.all()
        user_list = []
        for user in users:
            user_list.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_admin': user.is_admin,
                'created_at': user.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'prediction_count': len(user.predictions)
            })
        return jsonify({'success': True, 'users': user_list})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/admin/predictions', methods=['GET'])
def get_all_predictions():
    if 'user_id' not in session or not session.get('is_admin'):
        return jsonify({'success': False, 'error': 'Admin access required.'}), 403
    try:
        predictions = Prediction.query.order_by(Prediction.created_at.desc()).all()
        prediction_list = []
        for pred in predictions:
            prediction_list.append({
                'id': pred.id,
                'user_id': pred.user_id,
                'username': pred.user.username if pred.user else 'Unknown',
                'predicted_class': pred.predicted_class,
                'confidence_score': pred.confidence_score,
                'created_at': pred.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'top_predictions': pred.top_predictions
            })
        return jsonify({'success': True, 'predictions': prediction_list})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/admin/predictions/<int:prediction_id>', methods=['DELETE'])
def delete_prediction(prediction_id):
    if 'user_id' not in session or not session.get('is_admin'):
        return jsonify({'success': False, 'error': 'Admin access required.'}), 403
    try:
        prediction = Prediction.query.get(prediction_id)
        if not prediction:
            return jsonify({'success': False, 'error': 'Prediction not found.'}), 404
        db.session.delete(prediction)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Prediction deleted successfully.'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    if 'user_id' not in session or not session.get('is_admin'):
        return jsonify({'success': False, 'error': 'Admin access required.'}), 403
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'error': 'User not found.'}), 404
        if user.is_admin:
            return jsonify({'success': False, 'error': 'Cannot delete admin users.'}), 400
        # Delete all predictions by this user
        Prediction.query.filter_by(user_id=user_id).delete()
        db.session.delete(user)
        db.session.commit()
        return jsonify({'success': True, 'message': 'User and all their predictions deleted successfully.'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/admin/users/<int:user_id>/toggle-admin', methods=['POST'])
def toggle_admin_status(user_id):
    if 'user_id' not in session or not session.get('is_admin'):
        return jsonify({'success': False, 'error': 'Admin access required.'}), 403
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'error': 'User not found.'}), 404
        user.is_admin = not user.is_admin
        db.session.commit()
        status = 'admin' if user.is_admin else 'regular user'
        return jsonify({'success': True, 'message': f'User {user.username} is now a {status}.'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    # Get host from environment variable or default to 0.0.0.0
    host = os.environ.get('HOST', '0.0.0.0')
    # Get debug from environment variable or default to False
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    app.run(debug=debug, host=host, port=port) 