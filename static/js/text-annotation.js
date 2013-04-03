var user, label, attribs = {};
var attributes = {};
(function() {
  window.onload = function() {
    init();
  };

  var init = function() {
    var toolbar = document.createElement('div');
    toolbar.id = 'annotate-bar';
    document.body.appendChild(toolbar);
    toolbar.innerHTML = toolbar_template();
    var modal = document.createElement('div');
    modal.id = 'modal-wrap';
    document.body.appendChild(modal);
    modal.innerHTML = modal_template();
    $('#publish').click(function() {
      sweet.publish();
    });
  };
  window.initSelect = function() {
    var nodes = document.getElementsByTagName('*');
    var bar = document.getElementById('annotate-bar');
    bar.style.display = 'none';
    for(var i in nodes) {
      if(nodes[i].localName == 'html' ||
        nodes[i].localName == 'body') {
          continue;
      }
      if(nodes[i].addEventListener) {
        nodes[i].addEventListener('mouseover', onHover);
        nodes[i].addEventListener('mouseout', onHoverOut);
      }
    }
  };
  var removeSelect = function() {
    var nodes = document.getElementsByTagName('*');
    var bar = document.getElementById('annotate-bar');
    bar.style.display = 'block';
    for(var i in nodes) {
      if(nodes[i].removeEventListener) {
        nodes[i].removeEventListener('mouseover', onHover);
        nodes[i].removeEventListener('mouseout', onHoverOut);
      }
    }
  };
  var toolbar_template = function() {
    return '<div class="toolbar"><button class="btn" id="anno-btn" onclick="initSelect();">'+
      'Annotate</button> <button class="btn" id="publish">Publish</button></div>' + 
      '<div class="alert alert-error" id="sweeted"><button type="button" class="close" data-dismiss="alert">&times;</button><div id="sweet"></div></div>'+
      '<div id="posted" class="alert alert-success" style="display: none; width: 300px; margin: auto;"><button type="button" class="close" data-dismiss="alert">&times;</button><b>Success!</b> </div><div id="fail-posting" class="alert alert-error" style="display: none; width: 300px; margin: auto;"><button type="button" class="close" data-dismiss="alert">&times;</button><b>Error!</b> Something went wrong. Could not post.</div>';
  };
  var modal_template = function() {
 return '<div id="annotation-tree" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">    <div class="modal-header">      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>      <div id="myModalLabel">        <h3>Annotation attributes</h3>        <small>Select attributes for annotation</small>      </div>    </div>    <div class="modal-body">      <div id="stats">        <div id="node-info"></div>        <div id="selected-nodes"></div>      </div>      <div id="infovis"></div>      <div id="status"></div>    </div>    <div class="modal-footer">      <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>      <button class="btn btn-primary" onclick="closeAnnotationTree();">Save changes</button>    </div>  </div>';
  };

  var onHover = function(event) {
    var elem = event.currentTarget;
    //console.log(elem.style);
    elem.addEventListener('click', onClick, false);
    elem.style.border = '1px solid black';
    elem.style.boxShadow = '1px 5px 5px #ccc';
    //elem.style.background = 'red';
    //elem.style.opacity = '0.4';
    //console.log(elem);
  };
  var onHoverOut = function(event) {
    var elem = event.currentTarget;
    elem.style.border = 'none';
    elem.style.boxShadow = '';
    //elem.style.background = '';
    //elem.style.opacity = '1';
    elem.removeEventListener('click', onClick);
  };
  var onClick = function(event) {
    console.log(event);
    //$(event).preventDefault();
    event.stopPropagation();
    var elem = event.currentTarget;
    elem.style.border = 'none';
    elem.style.boxShadow = '';
    //console.log('clicked', elem);
    attribs.xpath = DOM.getXpath(elem);
    removeSelect();
    user = prompt('Enter your name: ');
    label = prompt('Enter a label for annotation: ');
    initAnnotationTree();
    return false;
  };


var DOM = {
    getXpath : function (element)
    {
	var str = '';
	var currentNode = element;
	var path = '';
	var index = -1;

	if (currentNode.nodeName != "#text")
	{
	    path = DOM.makePath(currentNode);
	}
	else
	{
	    path = DOM.makePath(currentNode.parentNode);
	}


	return path;
    },
    getElementIdx : function getElementIdx(elt)
    {
	var count = 1;
	for (var sib = elt.previousSibling; sib ; sib = sib.previousSibling)
	{
	    if(sib.nodeType == 1 && sib.tagName == elt.tagName)count++
	}

	return count;
    },

    makePath : function makePath(elt){
	var path = '';
	for (; elt && elt.nodeType == 1; elt = elt.parentNode)
	{
	    if(elt.id == "")
	    {
		idx = DOM.getElementIdx(elt);
		xname = elt.tagName;
		if (idx > 1)
		    xname += "[" + idx + "]";
		path = "/" + xname + path;
	    }
	    else
	    {
		path = "//*[@id='"+elt.id+"']"+path;
		break;
	    }
	}
	return path;
    },
    settextContent : function(element, content){
	$(element).html(content);
    },
    gettextContent:function(element)
    {
	return $(element).html();
    },
};
})();
var config = {
	'postTweetUrl':'http://localhost:5001',
	'indexer':'http://localhost:5000'
};
