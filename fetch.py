from flask import Flask
from flask import request
from flask import render_template
from flask import make_response
from flask import jsonify
import logging
from logging import FileHandler
import pymongo
import os
import lxml.html
import urllib2
import StringIO

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

@app.route('/SWeeText',methods=['GET'])
def SWeeText():
    if request.args.has_key('url'):
        myhandler1 = urllib2.Request(request.args['url'], headers={'User-Agent': "Mozilla/5.0(X11; U; Linux i686) Gecko/20071127 Firefox/2.0.0.11"})
        a = urllib2.urlopen(myhandler1)
        page = a.read()
        a.close()
        try:
            page = unicode(page,'utf-8')
        except UnicodeDecodeError:
            pass
        root = lxml.html.parse(StringIO.StringIO(page)).getroot()
        root.make_links_absolute(request.args['url'], resolve_base_href = True)
        return lxml.html.tostring(root)
#Log the errors, don't depend on apache to log it for you.
    fil = FileHandler(os.path.join(os.path.dirname(__file__), 'logme'),mode='a')
    fil.setLevel(logging.ERROR)
    app.logger.addHandler(fil)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')

