from flask import Flask
from flask import request
from flask import render_template
from flask import make_response
from flask import jsonify
import logging
from logging import FileHandler
import pymongo
import os

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    if request.args.has_key('url'):
        return render_template('index.html', url=request.args['url'])
    else:
        return render_template('index.html')

@app.route('/fetch',methods=['GET'])
def fetch():
    connection = pymongo.Connection()
    db = connection['mural']
    collection = db['data']
    ret = {}
    x = 0
    resource = "default"
    if request.args.has_key('res'):
        resource = request.args['res']
    for i in collection.find({'res':resource}):
        del(i['_id'])
        ret[x] = i
        x = x + 1
    return jsonify(ret)


#Log the errors, don't depend on apache to log it for you.
    fil = FileHandler(os.path.join(os.path.dirname(__file__), 'logme'),mode='a')
    fil.setLevel(logging.ERROR)
    app.logger.addHandler(fil)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')

