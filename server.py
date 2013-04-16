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
import json
import urllib

app = Flask(__name__)


@app.route('/', methods=['GET'])
def index():
    if request.args.has_key('url'):
        return render_template('index.html', url=request.args['url'])
    else:
        return render_template('index.html')


@app.route('/fetch', methods=['GET'])
def fetch():
    connection = pymongo.Connection()
    db = connection['mural']
    collection = db['data']
    ret = {}
    x = 0
    resource = "default"
    if request.args.has_key('uri'):
        resource = request.args['uri']
    for i in collection.find({'uri':resource}):
        del(i['_id'])
        ret[x] = i
        x = x + 1
    else:
        for i in collection.find():
            del(i['_id'])
            ret[x] = i
            x = x + 1
    if len(ret) == 0:
        ret['error'] = "Sorry! No re-treats for you."
    return jsonify(ret)

@app.route('/sweets', methods=['GET'])
def displaySweet():
    return render_template('sweets.html')

@app.route('/search', methods=['GET'])
def search():
    connection = pymongo.Connection()
    db = connection['mural']
    collection = db['data']
    y = 0
    ret = {}
    keywords_dict = json.loads(request.args['data'])
    #keywords = json.loads(keywords_dict)['data']
    for i in collection.find():
        for keyword in keywords_dict:
            try:
                if keyword in i['nodes']:
                    del(i['_id'])
                    ret[y] = i
                    y = y + 1
            except:
                pass
    return render_template('blank.html', content = ret)


@app.route('/submit', methods=['POST'])
def submit():
    c = pymongo.Connection()
    db = c['mural']
    coll = db['data']
    requestData = json.loads(request.form['data'])
    try:
        for i in requestData:
            coll.insert(i)
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.status = '200 OK'
        response.status_code = 200
        return response
    except:
        response = make_response()
        response.status = "500"
        response.data = "Your post could not be saved. Try posting again."
        return response

@app.route('/web', methods=['GET'])
def web():
  return render_template('web.html')

@app.route('/SWeeText', methods=['GET'])
def SWeeText():
    if request.args.has_key('url'):
        # Log -- comment them
        print "Got URL " + request.args['url'] + " .. Fetching and Parsing.."
        myhandler1 = urllib2.Request(request.args['url'], headers={'User-Agent': "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:20.0) Gecko/20100101 Firefox/20.0"})
        a = urllib2.urlopen(myhandler1)
        page = a.read()
        a.close()
        try:
            page = unicode(page, 'utf-8')
        except UnicodeDecodeError:
            pass
        root = lxml.html.parse(StringIO.StringIO(page)).getroot()
        root.make_links_absolute(request.args['url'], resolve_base_href = True)
        # Log -- comment them
        print "Page parsed.. Preparing to send.."

        # inject the JS toolbar to annotate text
        jq = root.makeelement('script')
        jq.set('src', 'static/jquery-1.9.1.min.js')

        script = root.makeelement('script')
        script.set('src', 'static/text-annotation.js')

        tree = root.makeelement('script')
        tree.set('src', 'static/tree.js')

        bs_js = root.makeelement('script')
        bs_js.set('src', 'static/bootstrap.js')

        jit = root.makeelement('script')
        jit.set('src', 'static/jit.js')

        us = root.makeelement('script')
        us.set('src', 'static/underscore-min-1.4.4.js')

        link = root.makeelement('link')
        link.set('href', 'static/text-annotation.css')
        link.set('type', 'text/css')
        link.set('rel', 'stylesheet')

        bs = root.makeelement('link')
        bs.set('href', 'static/bootstrap.css')
        bs.set('type', 'text/css')
        bs.set('rel', 'stylesheet')

        tree_css = root.makeelement('link')
        tree_css.set('href', 'static/tree.css')
        tree_css.set('type', 'text/css')
        tree_css.set('rel', 'stylesheet')

        root.head.append(bs)
        root.head.append(link)
        root.head.append(tree_css)

        root.head.append(jq)
        root.head.append(bs_js)
        root.head.append(jit)
        root.head.append(us)
        root.head.append(tree)
        root.head.append(script)

        return lxml.html.tostring(root)


#Log the errors, don't depend on apache to log it for you.
    fil = FileHandler(os.path.join(os.path.dirname(__file__), 'logme'),mode='a')
    fil.setLevel(logging.ERROR)
    app.logger.addHandler(fil)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')

