var labelType, useGradients, nativeTextSupport, animate;

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
})();

function inits(){
    //init data
    var json = {
        "id": "characteristics",
        "name": "Characteristics",
        "children": [
	    // Location
	    {
		"id": "character",
		"name": "Character",
		"data": {
                    "band": "Characteristics",
                    "relation": "coordinators.html"
		},
		"children": [{
                    "id": "shiva",
                    "name": "Shiva",
                    "data": {
			"band": "Character",
			"relation": "individual_ranganathan.html"
                    },
                    "children": []

		}, {
                    "id": "parvathi",
                    "name": "Parvathi",
                    "data": {
			"band": "Character",
			"relation": "individual_sharat.html"
                    },
                    "children": []
		}, {
                    "id": "ganesha",
                    "name": "Ganesha",
                    "data": {
			"band": "Character",
			"relation": "individual_sharat.html"
                    },
                    "children": []
		},  {
                    "id": "bramha",
                    "name": "Bramha",
                    "data": {
			"band": "Character",
			"relation": "individual_sharat.html"
                    },
                    "children": []
		},  {
                    "id": "vishnu",
                    "name": "Vishnu",
                    "data": {
			"band": "Character",
			"relation": "individual_sharat.html"
                    },
                    "children": []
		}, {
                    "id": "krishna",
                    "name": "Krishna",
                    "data": {
			"band": "Character",
			"relation": "individual_muralimohan.html"
                    },
                    "children": []
		}, {
                    "id": "radha",
                    "name": "Radha",
                    "data": {
			"band": "Character",
			"relation": "individual_muralimohan.html"
                    },
                    "children": []
		}]
            }, 
    // Languages
	    {
		"id": "ornament",
		"name": "Ornament",
		"data": {
		    "band": "Characteristics",
		    "relation": "cultural.html"
		},
		"children": [{
		    "id": "jewellery",
		    "name": "Jewellery",
		    "data": {
			"band": "Ornament",
			"relation": "project_murals.html"
		    },
		    "children": [{
			"id": "ear-ring",
			"name": "Ear-ring",
			"data": {
			    "band": "Jewellery",
			    "relation": "project_murals.html"
			},
			"children": []
		    },{
			"id": "ring",
			"name": "Ring",
			"data": {
			    "band": "Jewellery",
			    "relation": "project_murals.html"
			},
			"children": []
		    },{
			"id": "nose-ring",
			"name": "Nose-ring",
			"data": {
			    "band": "Jewellery",
			    "relation": "project_murals.html"
			},
			"children": []
		    },{
			"id": "pendent",
			"name": "Pendent",
			"data": {
			    "band": "Jewellery",
			    "relation": "project_murals.html"
			},
			"children": []
		    },{
			"id": "ankelet",
			"name": "Ankelet",
			"data": {
			    "band": "Jewellery",
			    "relation": "project_murals.html"
			},
			"children": []
		    },{
			"id": "bracelet",
			"name": "Bracelet",
			"data": {
			    "band": "Jewellery",
			    "relation": "project_murals.html"
			},
			"children": []
		    },{
			"id": "bangles",
			"name": "Bangles",
			"data": {
			    "band": "Jewellery",
			    "relation": "project_murals.html"
			},
			"children": []
		    }]
		}, {
		    "id": "material",
		    "name": "Material",
		    "data": {
			"band": "Ornament",
			"relation": "project_knowledge.html"
		    },
		    "children": [{
			"id": "gold",
			"name": "Gold",
			"data": {
			    "band": "Material",
			    "relation": "project_murals.html"
			},
			"children": []
		    },{
			"id": "silver",
			"name": "Silver",
			"data": {
			    "band": "Material",
			    "relation": "project_murals.html"
			},
			"children": []
		    },{
			"id": "bronze",
			"name": "Bronze",
			"data": {
			    "band": "Material",
			    "relation": "project_murals.html"
			},
			"children": []
		    },{
			"id": "ruby",
			"name": "Ruby",
			"data": {
			    "band": "Material",
			    "relation": "project_murals.html"
			},
			"children": []
		    },{
			"id": "copper",
			"name": "Copper",
			"data": {
			    "band": "Material",
			    "relation": "project_murals.html"
			},
			"children": []
		    },{
			"id": "diamond",
			"name": "Diamond",
			"data": {
			    "band": "Material",
			    "relation": "project_murals.html"
			},
			"children": []
		    },{
			"id": "topaz",
			"name": "Topaz",
			"data": {
			    "band": "Material",
			    "relation": "project_murals.html"
			},
			"children": []
		    }]
		}]
	    }],
	"data": {
	    "relation": "index.html"
	}
    };
    //end
    var infovis = document.getElementById('infovis');
    var w = infovis.offsetWidth + 500; var h = infovis.offsetHeight + 385;
    
    //init Hypertree
    var ht = new $jit.Hypertree({
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
    //load JSON data.
    ht.loadJSON(json);
    //compute positions and plot.
    ht.refresh();
    //end
    ht.controller.onComplete();
}

document.addEventListener("DOMContentLoaded", inits, false);

    /* ****************************************************************************************************** */

// function inits(){
//     //init data
//     var jsons = {
//         "id": "narrations",
//         "name": "Narrations",
//         "children": [{
// 		"id": "kannada",
// 		"name": "Kannada",
// 		"data": {
//                     "band": "Narrations"
// 		},
// 		"children": []
//             }, {
// 		"id": "english",
// 		"name": "English",
// 		"data": {
// 		    "band": "Narrations"
// 		},
// 		"children": []
// 	    }, {
// 		"id": "hindi",
// 		"name": "Hindi",
// 		"data": {
// 		    "band": "Narrations"
// 		},
// 		"children": []
// 	    }, {
// 		"id": "tamil",
// 		"name": "Tamil",
// 		"data": {
//                     "band": "Narrations"
// 		},
// 		"children": []
//             }, {
// 		"id": "bengali",
// 		"name": "Bengli",
// 		"data": {
// 		    "band": "Narrations"
// 		},
// 		"children": []
// 	    }, {
// 		"id": "marathi",
// 		"name": "Marathi",
// 		"data": {
// 		    "band": "Narrations"
// 		},
// 		"children": []
// 	    }],
// 	"data": {
// 	    "relation": "index.html"
// 	}
//     };
//     //end
//     var infonar = document.getElementById('infonar');
//     var w = infonar.offsetWidth - 0, h = infonar.offsetHeight - 0;
    
//     //init Hypertree
//     var ht = new $jit.Hypertree({
// 	//id of the visualization container
// 	injectInto: 'infonar',
// 	//canvas width and height
// 	width: w,
// 	height: h,
// 	//Change node and edge styles such as
// 	//color, width and dimensions.
// 	Node: {
//             dim: 2.5,
//             color: "#555"
// 	},
// 	Edge: {
// 	    lineWidth: 1,
//             color: "#222"
// 	},

// 	// On hover
// 	Tips: {  
// 	    enable: false,  
// 	    onShow: function(tip, node) {
// 		ht.tips.config.offsetX = "10";
// 		ht.tips.config.offsetY = "10";
//  		tip.innerHTML = "<div id=\"value\" class=\"tip-title\" style=\"text-align:center;\">" + node.name + "</div>";
// //		    + node.data.relation + " style=\"color:#fff;\">" + node.name + "</a></div>";    
//  	    } 
// 	},  

// 	//Attach event handlers and add text to the
// 	//labels. This method is only triggered on label
// 	//creation
// 	onCreateLabel: function(domElement, node){
//             domElement.innerHTML = node.name;
//             $jit.util.addEvent(domElement, 'click', function () {
// 		ht.onClick(node.id, {
//                     onComplete: function() {
// 			ht.controller.onComplete();
//                     }
// 		});
//             });
// 	},
// 	//Change node styles when labels are placed
// 	//or moved.
// 	onPlaceLabel: function(domElement, node){
//             var style = domElement.style;
//             style.display = '';
//             style.cursor = 'pointer';
// 	    ht.controller.Node.transform = false;
// 	    ht.controller.Edge.alpha = "0.3";
//             if (node._depth == 0) {
// 		style.fontSize = "0.8em";
// 		style.color = "#111";	    
//             } else if(node._depth == 1){
// 		style.fontSize = "0.9em";
// 		style.color = "#222";
//             }
// 	    else {
// 		style.display = 'none';
//             }

//             var left = parseInt(style.left);
//             var w = domElement.offsetWidth;
//             style.left = (left - w / 2) + 'px';
// 	},
//     });
//     //load JSON data.
//     ht.loadJSON(jsons);
//     //compute positions and plot.
//     ht.refresh();
//     //end
//     ht.controller.onComplete();
// }