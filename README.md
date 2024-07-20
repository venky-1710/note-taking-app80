# Note-Taking Application

A full-stack note-taking application built with React for the frontend and Flask for the backend. This application allows users to register, log in, create, edit, and delete notes.

## Features

- User authentication (register and login)
- Create, read, update, and delete notes
- Secure API with JWT authentication
- Responsive design

## Technologies Used

### Frontend
- React
- React Router for navigation
- CSS for styling

### Backend
- Flask (Python)
- Flask-JWT-Extended for JWT authentication
- Flask-Bcrypt for password hashing
- PyMongo for MongoDB integration
- Flask-CORS for handling Cross-Origin Resource Sharing

### Database
- MongoDB

## Setup and Installation

1. Clone the repository
```sh
git clone https://github.com/venky-1710/note-taking-app.git
cd note-taking-app
```
2. Set up the backend
```sh
cd backend
pip install -r requirements.txt
```
3. Set up the frontend
```sh
cd frontend
npm install
```
4. Configure the database
- Create a MongoDB database and update the connection string in `app.py`

5. Start the backend server
```sh
python app.py
```
6. Start the frontend development server
```sh
npm start
```
7. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- POST `/api/register`: Register a new user
- POST `/api/login`: Log in a user
- GET `/api/protected`: Get protected user data
- POST `/api/notes`: Create a new note
- GET `/api/notes`: Get all notes for the logged-in user
- PUT `/api/notes/<note_id>`: Update a specific note
- DELETE `/api/notes/<note_id>`: Delete a specific note

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
   
