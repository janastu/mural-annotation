from flask import Flask
from flask import request
from flask import render_template
import json
import pymongo

app = Flask(__name__)

@app.route('/',methods=['GET'])
def index():
    if request.args.has_key('json'):
        return render_template('index.html',json=request.args['json'])
    else:
        return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')

# #from bson.code import *
# #from urllib import unquote_plus
# def application(environ, start_response):
#     status = '200 OK'
#     response_headers = [('Content-type', 'application/json'),('Access-Control-Allow-Origin', '*')]
#     start_response(status, response_headers)
#     c = pymongo.Connection()
#     db = c['mural']
#     coll = db['data']
#     ret = {}
#     x = 0
#     for i in coll.find():
#         del(i['_id'])
#         ret[x] =  i
#         x = x + 1
#            #return repr(recieved)
#     return json.dumps(ret)
