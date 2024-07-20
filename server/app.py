from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt #is used for password hashing.
# JWTManager, create_access_token, jwt_required, and get_jwt_identity are used for JSON Web Token (JWT) authentication.
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS # is used for Cross-Origin Resource Sharing (CORS) support.
from pymongo import MongoClient # used for connecting to a MongoDB
from pymongo.errors import DuplicateKeyError # is used for handling duplicate key errors in MongoDB.
from bson.objectid import ObjectId # is used for working with MongoDB ObjectIds.
import re

import secrets
from flask_mail import Mail, Message
from datetime import timedelta, datetime

import os
from dotenv import load_dotenv

load_dotenv()


app = Flask(__name__)

# Configurations
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

mail = Mail(app)

# Initialize extensions
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app, resources={r"/api/*": {
    "origins": ["https://note-taking-app80.netlify.app"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}})

# Initialize MongoDB
client = MongoClient(os.getenv('MONGODB_URI'))
db = client['user_database']
users_collection = db['users']
notes_collection = db['notes']

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "API is working"}), 200

@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    
    user = users_collection.find_one({'email': email})
    if not user:
        return jsonify({"message": "No account with that email address exists."}), 404
    
    token = secrets.token_urlsafe(20)
    expiration = datetime.utcnow() + timedelta(hours=1)
    
    users_collection.update_one(
        {'email': email},
        {'$set': {'reset_token': token, 'reset_token_exp': expiration}}
    )
    
    reset_url = f"https://note-taking-app80.netlify.app/reset-password/{token}"
    
    try:
        msg = Message('Password Reset Request',
                      sender=app.config['MAIL_USERNAME'],
                      recipients=[email])
        msg.body = f'''To reset your password, visit the following link:
{reset_url}
If you did not make this request then simply ignore this email and no changes will be made.
'''
        mail.send(msg)
        return jsonify({"message": "Reset password email sent."}), 200
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return jsonify({"message": "Error sending reset email. Please try again later."}), 500

@app.route('/api/reset-password/<token>', methods=['POST'])
def reset_password(token):
    data = request.get_json()
    new_password = data.get('new_password')
    
    user = users_collection.find_one({
        'reset_token': token,
        'reset_token_exp': {'$gt': datetime.utcnow()}
    })
    
    if not user:
        return jsonify({"message": "Invalid or expired token"}), 400
    
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    
    users_collection.update_one(
        {'_id': user['_id']},
        {
            '$set': {'password': hashed_password},
            '$unset': {'reset_token': "", 'reset_token_exp': ""}
        }
    )
    
    return jsonify({"message": "Your password has been updated."}), 200

# Helper function to validate email
def validate_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email) is not None

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not validate_email(email):
        return jsonify({"message": "Invalid email format"}), 400

    # Check if email already exists
    existing_email = users_collection.find_one({'email': email})
    if existing_email:
        return jsonify({"message": "Email already registered"}), 400

    # Check if username already exists
    existing_username = users_collection.find_one({'username': username})
    if existing_username:
        return jsonify({"message": "Username already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        users_collection.insert_one({
            'username': username,
            'password': hashed_password,
            'email': email
        })
    except DuplicateKeyError:
        return jsonify({"message": "An error occurred during registration"}), 400

    return jsonify({"message": "User registered successfully. Please log in."}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier')
    password = data.get('password')

    query = {'$or': [{'username': identifier}, {'email': identifier}]}
    user = users_collection.find_one(query)

    if user is None:
        return jsonify({"message": "User does not exist"}), 404
    if not bcrypt.check_password_hash(user['password'], password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity={'username': user['username']})
    return jsonify(access_token=access_token, username=user['username'], message="Login successful"), 200

@app.route('/api/notes', methods=['POST'])
@jwt_required()
def add_note():
    data = request.get_json()
    current_user = get_jwt_identity()
    note = {
        'user': current_user['username'],
        'title': data.get('title'),
        'content': data.get('content')
    }
    notes_collection.insert_one(note)
    return jsonify({"message": "Note added successfully"}), 201

@app.route('/api/notes', methods=['GET'])
@jwt_required()
def get_notes():
    current_user = get_jwt_identity()
    notes = list(notes_collection.find({'user': current_user['username']}))
    for note in notes:
        note['_id'] = str(note['_id'])
    return jsonify(notes), 200

@app.route('/api/notes/<note_id>', methods=['PUT'])
@jwt_required()
def update_note(note_id):
    data = request.get_json()
    current_user = get_jwt_identity()
    notes_collection.update_one(
        {'_id': ObjectId(note_id), 'user': current_user['username']},
        {'$set': {'title': data.get('title'), 'content': data.get('content')}}
    )
    return jsonify({"message": "Note updated successfully"}), 200

@app.route('/api/notes/<note_id>', methods=['DELETE'])
@jwt_required()
def delete_note(note_id):
    current_user = get_jwt_identity()
    notes_collection.delete_one({'_id': ObjectId(note_id), 'user': current_user['username']})
    return jsonify({"message": "Note deleted successfully"}), 200

@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(username=current_user['username']), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)