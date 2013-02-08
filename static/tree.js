var labelType, useGradients, nativeTextSupport, animate, ht, tree_json;

(function() {
    var ua = navigator.userAgent,
    iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
    typeOfCanvas = typeof HTMLCanvasElement,
    nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
    textSupport = nativeCanvasSupport
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
    //I'm setting this based on the fact that ExCanvas provides text support for IE
    //and that as of today iPhone/iPad current text support is lame
    labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
    nativeTextSupport = labelType == 'Native';
    useGradients = nativeCanvasSupport;
    animate = !(iStuff || !nativeCanvasSupport);

    //load JSON data.
    // FIXME: the url is hardcoded, maybe you have to change it
    // if the file is a variable one
    $.getJSON('static/old.json', function(json) {
      console.log('json', json);
      tree_json = json;
      inits();
    });

})();

function inits() {
    var infovis = document.getElementById('infovis');
    var w = infovis.offsetWidth + 500; var h = infovis.offsetHeight + 385;

    //init Hypertree
    ht = new $jit.Hypertree({
	//id of the visualization container
	injectInto: 'infovis',
	//canvas width and height
	width: w,
	height: h,
	//Change node and edge styles such as
	//color, width and dimensions.
	Node: {
            dim: 2.5,
            color: "#555"
	},
	Edge: {
	    lineWidth: 1,
            color: "#222"
	},

	// On hover
	Tips: {
	    enable: false,

	    onShow: function(tip, node) {
		ht.tips.config.offsetX = "10";
		ht.tips.config.offsetY = "10";
//		tip.addEventListener("click", alert('hello'), false);
 		tip.innerHTML = "<div id=\"value\" class=\"tip-title\" style=\"text-align:center;\">" + node.name + "</div>";
//		    + node.data.relation + " style=\"color:#fff;\">" + node.name + "</a></div>";
 	    }
	},

	//Attach event handlers and add text to the
	//labels. This method is only triggered on label
	//creation
	onCreateLabel: function(domElement, node){
            domElement.innerHTML = node.name;
            $jit.util.addEvent(domElement, 'click', function () {
		ht.onClick(node.id, {
                    onComplete: function() {
			ht.controller.onComplete();
                    }
		});
            });
	},
	//Change node styles when labels are placed
	//or moved.
	onPlaceLabel: function(domElement, node){
            var style = domElement.style;
            style.display = '';
            style.cursor = 'pointer';
	    ht.controller.Node.transform = false;
	    ht.controller.Edge.alpha = "0.3";
            if (node._depth == 0) {
		style.fontSize = "0.8em";
		style.color = "#111";
            } else if(node._depth == 1){
		style.fontSize = "0.9em";
		style.color = "#222";
            } // else if(node._depth == 2){
	    // 	style.fontSize = "0.7em";
	    // 	style.color = "#444";
            // }
	    else {
		style.display = 'none';
            }

            var left = parseInt(style.left);
            var w = domElement.offsetWidth;
            style.left = (left - w / 2) + 'px';
	},
    });
    ht.loadJSON(tree_json);
    //compute positions and plot.
    ht.refresh();
    //end
    ht.controller.onComplete();
}
