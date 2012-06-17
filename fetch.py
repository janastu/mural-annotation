import json
import pymongo
#from bson.code import *
#from urllib import unquote_plus
def application(environ, start_response):
    status = '200 OK'       
    response_headers = [('Content-type', 'application/json'),('Access-Control-Allow-Origin', '*')]
    start_response(status, response_headers)
    c = pymongo.Connection()
    db = c['mural']
    coll = db['data']
    ret = {}
    x = 0
    for i in coll.find():
        del(i['_id'])
        ret[x] =  i
        x = x + 1
           #return repr(recieved)
    return json.dumps(ret)
