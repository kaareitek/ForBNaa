from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Integer, ForeignKey, UniqueConstraint, ForeignKeyConstraint
from sqlalchemy.orm import relationship, sessionmaker

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:lmnlmn@localhost/projectdatabase'
db = SQLAlchemy(app)

class TrainingSession(db.Model):
    __tablename__ = 'session'
    userID = db.Column(db.String(30), primary_key = True)
    sessionID = db.Column(db.String(10), primary_key = True)
    comment = db.Column(db.String(50))

class Position(db.Model):
    __tablename__ = 'position'
    timestamp = db.Column(db.String(20), primary_key = True)
    userID = db.Column(db.String(30))
    sessionID = db.Column(db.String(10))
    position = db.Column(db.String(30))
    __table_args__ = (ForeignKeyConstraint([userID, sessionID],[TrainingSession.userID, TrainingSession.sessionID]), {})

class Temperature(db.Model):
    __tablename__ = 'temperature'
    timestamp = db.Column(db.String(20), primary_key = True)
    userID = db.Column(db.String(30))
    sessionID = db.Column(db.String(10))
    temperature = db.Column(db.String(30))
    __table_args__ = (ForeignKeyConstraint([userID, sessionID],[TrainingSession.userID, TrainingSession.sessionID]), {})
