import json
import pymongo
def application(environ, start_response):
    status = '200 OK'       
    response_headers = [('Content-type', 'text/html'),('Access-Control-Allow-Origin', '*')]
    start_response(status, response_headers)
    recieved = environ['wsgi.input'].read(int(environ['CONTENT_LENGTH']))
    c = pymongo.Connection()
    db = c['mural']
    coll = db['data']
    d = json.loads(recieved)
    for i in d:
        coll.insert(d)
    return 'ok'

