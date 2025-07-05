from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

from validator import Validator

app = Flask(__name__)
CORS(app)

@app.route('/ping', methods=['GET'])
def ping(ping):
    # pinging the system to check if the server is running
    msg={'status':'running'}

@app.route('/verify/<claim>', methods=['GET'])
def get_test(claim):
    vali=Validator()
    res=vali.search(claim)
    return res

if __name__ == '__main__':
    app.run(host='0.0.0.0',port='8080')