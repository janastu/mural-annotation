var labelType, animate, useGradients, nativeTextSupport, RGraph;
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

var ontology_json;

function initAnnotationTree() {
  //Log.write('Loading ontology file');
  $('#annotation-tree').modal();
  $('#annotation-tree').on('shown', function() {
    loadOntologyJSON();
  });
}

function initNodeListEvents() {
// register event handler for list of nodes that comes in the stats box.
// click on the nodes in the stats box will center them in the graph and
// update the stats box.
  $('.list-nodes').unbind('click');
  $('.list-nodes').click(function(event) {
    var id = $(event.currentTarget).attr('id').split('-')[1];
    var node = RGraph.graph.getNode(id);
    centerNode(event, node);
  });
}

function loadOntologyJSON() {
  // if the file is already loaded, no need to load again
  if(typeof ontology_json === 'object') {
    drawRGraph();
    return;
  }
  console.log('Loading ontology file');
  var url = 'static/graphs/Hampi_GirijaKalyana.json'
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    success: function(data) {
      console.log('Ontology JSON loaded');
      ontology_json = data;
      drawRGraph();
    },
    error: function(xhr, errtype, errtext) {
      console.log('Could not load Ontology JSON!');
      console.log(errtype, ':', errtext);
    }
  });
}

var Log = {
  elem: document.getElementById('status'),
  write: function(msg) {
    this.elem.innerHTML = msg;
  }
};

var Stats = {
  init: function() {
    this.node_info = document.getElementById('node-info');
    this.selected_info = document.getElementById('selected-nodes');
  },
  write: function(msg) {
    this.node_info.innerHTML = msg;
  },
  appendSelectedList: function() {
    var html = '<h4>Selected:</h4>';
    if(!sweet.nodes.length) {
      html += '<b>None</b>';
    }
    else {
      html += '<ul>';
      for(var i in sweet.nodes) {
        html += '<li id="selected-'+ sweet.nodes[i] +'">' + sweet.nodes[i] +
          ' <span> <a href="javascript:void(0);" onclick="removeItem(event);">&times;</a></span></li>';
      }
      html += '</ul>';
    }
    this.selected_info.innerHTML = html;
  }
};

var removeItem = function(event) {
  console.log($(event.currentTarget));
  var id = $(event.currentTarget).parent().parent().attr('id');
  var node = id.split('-')[1];
  $(event.currentTarget).parent().parent().remove();
  sweet.remove(node);
}

// return "add node" template button creating an id for it
var addNodeTemplate = function(node) {
  return '<button onclick="addNode(event);" class="btn" id="add-'+
    node +'">Add '+ node +'</button>';
};

// add node to the selected list to be sweeted.
function addNode(event) {
  var id = $(event.currentTarget).attr('id');
  var node = id.split('-')[1];
  sweet.add(node);
  //Log.write('Added node ' + node);
}

//center the given node in the graph and update the stats box
function centerNode(event, node) {
  if(event.stopPropagation) {
    event.stopPropagation();
  }
  //Log.write('centering node ', node.name);
  console.log('centering node', node.name);
  RGraph.onClick(node.id, {   
    hideLabels: false,  
    onComplete: function() {  
      //Log.write("done");  
    }
  });  
  var html = '<h4>' + node.name + '</h4><b>Links To:</b>:<ul>';
  node.eachAdjacency(function(adj) {
    html += '<li><a class="list-nodes" href="#" id="list-' + adj.nodeTo.id + '">' +
      adj.nodeTo.name + '</a></li>';
  });
  html += '</ul>';
  html += addNodeTemplate(node.name);
  Stats.write(html);
  Stats.appendSelectedList();
  initNodeListEvents();
  return false;
}

var sweet = {
  nodes: [],
  swts: [],
  type: 'idh-mowl',
  add: function(node) {
    if(_.indexOf(node, this.nodes) === -1) {
      sweet.nodes.push(node);
    }
    Stats.appendSelectedList();
  },
  remove: function(node) {
    console.log(node);
    var idx = _.indexOf(sweet.nodes, node);
    if(idx !== -1) {
      sweet.nodes.splice(idx, 1);
    }
  },
  save: function() {
    var resource = window.location.search ? window.location.search.split('=')[1] :
      'default';
    resource = decodeURIComponent(resource).replace('"', '', 'gi');
    var data = {
      user: user,
      type: this.type,
      uri: resource,
      nodes: this.nodes,
    };
    if(attribs.hasOwnProperty('top') &&
        attribs.hasOwnProperty('bottom') &&
        attribs.hasOwnProperty('right') &&
        attribs.hasOwnProperty('left')) {
      data.top = attribs.top;
      data.bottom = attribs.bottom;
      data.left = attribs.left;
      data.right = attribs.right;
    }
    if(attribs.hasOwnProperty('xpath')) {
      data.xpath = attribs.xpath;
    }
    this.swts.push(data);
    this.nodes = [];
  },
  publish: function() {
    if(!this.swts.length) {
      return;
    }
    $('#publish').attr('disabled', 'disabled');
    $.ajax({
      type: 'POST',
      url: config.indexer + '/submit',
      data: {'data': JSON.stringify(this.swts)},
      success: function() {
        /*$.ajax({
          type: 'POST',
          url: config.postTweetUrl,
          data: {'data': JSON.stringify(this.swts)},
          success: function() {
            $('#posted').show();
            this.swts = [];
          },
          error: function() {
            $('#fail-posting').show();
          }
        });*/
        $('#posted').show();
        var swts = '';
        for(var i in sweet.swts) {
          var data = sweet.swts[i];
          console.log(data);
          var swt = '@'+data.user+' '+data.type+' '+data.uri;
          if(data.hasOwnProperty('xpath')) {
            swt += ' xpath: '+data.xpath;
          }
          if(data.hasOwnProperty('top')) {
            swt += ' #['+data.top+','+data.right+','+data.bottom+','+data.left+']';
          }
          swt += ' ' + data.nodes.join();
          swts += swt + '\n';
        }
        console.log(swts);
        $('#sweeted').show();
        $('#sweet').html(swts);
        sweet.swts = [];
      },
      error: function() {
        //$('#fail-posting').show();
      }
    });
  }
};

function closeAnnotationTree() {
  $('#annotation-tree').modal('hide');
  $('#infovis').html('');
  $('#node-info').html('');
  $('#selected-nodes').html('');
  sweet.save();
  $('#publish').attr('disabled', false);
}

function drawRGraph() {
  var rgraph = new $jit.RGraph({
    injectInto: 'infovis',
    Navigation: {
      enable: true,
      //panning: 'avoid nodes',
      zooming: 10
    },
    Node: {
      overridable: true,
      //span: 5,
      //height: 40,
      //width: 150,
      angularWidth: 100,
      //autoHeight: true,
      //autoWidth: true,
      dim: 10
    },
    Edge: {
      overridable: true
    },
    Label: {
      overridable: true,
      type: labelType, //Native or HTML
      size: 14
    },
    interpolation: 'polar',
    transition: $jit.Trans.Sine.easeIn,
    levelDistance: 150,
    onCreateLabel: function(domElement, node) {
      console.log('oncreatelabel');
    },
    onPlaceLabel: function(domElement, node) {
      console.log('onplacelabel');
      /*var style = domElement.style;
      var top = parseInt(style.top);
      console.log('top :', top);
      style.top = (top - 40) + 'px';*/
    },
    Events: {
      enable: true,
      type: 'Native',
      onMouseEnter: function() {
        rgraph.canvas.getElement().style.cursor = 'pointer';
      },
      onMouseLeave: function() {
        rgraph.canvas.getElement().style.cursor = '';
      },
      onClick: function(node, event_info, e) {
        console.log(node, event_info, e);
        if(!node) {
          return;
        }
        centerNode(e, node);
      }
    }
  });

  rgraph.loadJSON(ontology_json);
  rgraph.refresh();
  rgraph.controller.onBeforeCompute(rgraph.graph.getNode(rgraph.root));
  //Log.write('Done');
  console.log('done drawing');

  RGraph = rgraph;
  Stats.init();
}

