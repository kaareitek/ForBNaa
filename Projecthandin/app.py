from flask import Flask, render_template, url_for, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Integer, ForeignKey, UniqueConstraint, ForeignKeyConstraint, and_
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.sql import exists
import Models
from Models import app, db
import paho.mqtt.client as mqtt
import re

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))

    client.subscribe("datagremlins/#")

def on_message(client, userdate, msg):
    print(msg.topic + " " + str(msg.payload))

    payload = str(msg.payload)

    strip = "'b"

    for char in strip:
        payload = payload.replace(char, "")

    print(payload)

    sessID = payload[0]
    print(sessID)
    uID = re.search("datagremlins/(.*)/", msg.topic)
    print(uID.group(1))

    sessionRow = Models.TrainingSession(userID = uID.group(1), sessionID = sessID)

    exists = db.session.query(db.exists().where(and_(Models.TrainingSession.userID == sessionRow.userID, Models.TrainingSession.sessionID == sessionRow.sessionID))).scalar()
    print(exists)

    if not exists:
        db.session.add(sessionRow)

    time = re.search("_(.*)_", payload)
    print(time.group(1))

    if "position" in msg.topic:
        pos = payload[-19:]
        print(pos)
        print("position")
        prow = Models.Position(timestamp = time.group(1), userID = uID.group(1), sessionID = sessID, position = pos)
        print(prow)
        db.session.add(prow)

    elif "temperature" in msg.topic:
        temp = payload[-5:]
        print(temp)
        print("temperature")
        trow = Models.Temperature(timestamp = time.group(1), userID = uID.group(1), sessionID = sessID, temperature = temp)
        print(trow)
        db.session.add(trow)

    db.session.commit()

def mqttSetup():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect("test.mosquitto.org", 1883)

    client.loop_start()

db.create_all()
db.session.commit()

mqttSetup()

uID = ""
sess = ""

@app.route('/', methods=['GET', 'POST'])
def index():
    res = db.session.query(Models.TrainingSession).all()

    return render_template("index.html", res = res)

@app.route('/user', methods=['GET', 'POST'])
def user():
    global uID
    uID = request.form['user']

    res = db.session.query(Models.TrainingSession).filter(Models.TrainingSession.userID == uID).all()

    return render_template("user.html", res = res)

@app.route('/session', methods=['GET', 'POST'])
def session():
    global sess
    sess = request.form['session']

    com = db.session.query(Models.TrainingSession).filter(Models.TrainingSession.userID == uID).filter(Models.TrainingSession.sessionID == sess).all()
    pos = db.session.query(Models.Position).filter(Models.Position.userID == uID).filter(Models.Position.sessionID == sess).all()
    temp = db.session.query(Models.Temperature).filter(Models.Temperature.userID == uID).filter(Models.Temperature.sessionID == sess).all()

    return render_template("session.html", pos = pos, temp = temp, com = com)

@app.route('/addComment', methods=['GET', 'POST'])
def addComment():
    commentToAdd = request.form['comment']

    user = db.session.query(Models.TrainingSession).filter(Models.TrainingSession.userID == uID).\
        filter(Models.TrainingSession.sessionID == sess).update(dict(comment=commentToAdd))

    db.session.commit()

    return render_template("session.html")

#@app.route('/update_map')
#def update_map():
#    pos = db.session.query(Models.Position).filter(Models.Position.userID == uID).filter(Models.Position.sessionID == sess).order_by(Models.Position.timestamp.desc()).first()

#    pos = { "position" : str(pos)}

#    return jsonify(pos)

if __name__ == '__main__':
    import os
    HOST = os.environ.get('SERVER_HOST', 'localhost')
    try:
        PORT = int(os.environ.get('SERVER_PORT', '5555'))
    except ValueError:
        PORT = 5555
    app.run(HOST, PORT)