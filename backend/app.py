from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///study.db'  # Use SQLite for simplici
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)


# Import routes to register them
from routes import *

if __name__ == '__main__':
    db.create_all()  # Create tables if they don't exist
    app.run(debug=True)
