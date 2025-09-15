from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

from validator import Validator

app = Flask(__name__)
CORS(app)

@app.route('/ping', methods=['GET'])
def ping():
    # pinging the system to check if the server is running
    msg={'status':'running'}
    return msg

@app.route('/verify/<claim>', methods=['GET'])
def get_test(claim):
    vali=Validator()
    res=vali.openai_search(claim)
    return {'res':res}

if __name__ == '__main__':

    app.run()

