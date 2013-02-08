from flask import Flask
from flask import request
from flask import render_template
from flask import make_response
import json
import pymongo
import os
import glob

app = Flask(__name__)

@app.route('/',methods=['GET'])
def index():
    if request.args.has_key('json'):
        return render_template('index.html',json=request.args['json'])
    else:
        return render_template('index.html')

@app.route('/editor', methods=['GET'])
def editor():
  if request.args.has_key('json'):
    filename = request.args['json']
  else:
    filename = 'test.json'
  filename = os.path.join('static', filename)
  try:
    f = open(filename, 'r')
  except:
    f = open('static/test.json', 'r')
  buf = f.read()
  f.close()
  return render_template('editor.html', json = buf)

@app.route('/saveJSON', methods=['POST'])
def saveJSON():
  if request.form:
    data = request.form
    JSON = data['json']
    filename = os.path.join('static', data['filename'])
    f = open(filename, 'w')
    f.write(JSON)
    f.close()
    return (data, 200)
  else:
    return (json.dumps(request.form), 200) # Bad Request

@app.route('/history', methods=['GET'])
def listJSON():
  path = os.path.join('static', '*.json')
  ls = glob.glob(path)
  def sanitize(i):
    return i.split('/')[-1]
  ls = map(sanitize, ls)
  return render_template('history.html', ls=ls)


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
