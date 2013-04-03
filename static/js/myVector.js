var map, vectorLayer;
var mapBounds = new OpenLayers.Bounds( 0.0, -4668.0, 31110.0, 0.0);
var mapMinZoom = 0;
var mapMaxZoom = 7;
var boxes;
var box_extents = [
  [3759.0000, -1614.33337, 4079.0000, -1274.33337],
  [3719, -1825, 3783, -1771]
];
var box_extents1 = [
  [4263.0000, -1630.33337, 4559.0000, -1342.33337]
];
var myJSON = [];
var ans = {
  ans: [],
  count: 0

};
var user;
// avoid pink tiles
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
OpenLayers.Util.onImageLoadErrorColor = "transparent";
var handler={
  check: false,
  check1: false,
  check2: false,
  trigger: function() {
		myjson = {"temple":[
	    {"period": "16th century"},
	    {"location":"13.80338 - 77.61067"},
	    {"sthapati":"Shivakumar"},
	    {"innerloc": "MaharangaMandapa"}
		],
							"size": "311110px X 4668 px",
							"narrative": "Narrative",
							"muralTradition": "XYZ",
							"muralTechnique": "Foo",
							"muralContent": "Bar"
						 };
		onMyFeatureSelect(map,myjson,15555, -2334);
  },
  trigger1: function() {
	  myjson = {"face":[
			{"character":"Shiva"}
	  ],
							"size": "310px X 460px"  // jewellery:earring; material: silver,
						 };
		onMyFeatureSelect(map,myjson,3915,- 1438);
  },
  trigger2: function() {
	  myjson = {"ornament":[
			{"jewelery":"Pendant"},
			{"Material":"Silver"}
	  ],
							"size": "50px X 90px"
						 };
		onMyFeatureSelect(map,myjson,3751,-1802)
  }

};
function onFeatureSelect(feature)
{
 for(var i in ans.ans)
  {
		if(feature.geometry.bounds['left'] == ans.ans[i]['left'] && feature.geometry.bounds['right'] == ans.ans[i]['right'] && feature.geometry.bounds['top'] == ans.ans[i]['top'] && feature.geometry.bounds['bottom'] == ans.ans[i]['bottom'])
		{
	    str = {};
	    if(ans.ans[i]['character'])
				str['character'] = ans.ans[i]['character'];
	    else
	    {
				str['material'] = ans.ans[i]['material'];
				//	str['jewellery'] = ans.ans[i]['jewellery']
	    }
	    z = new OpenLayers.Popup.FramedCloud(
				"test",
				feature.geometry.getBounds().getCenterLonLat(),
				new OpenLayers.Size(640,480),
				JSON.stringify(str,null,'  '),null,true);
	    feature.popup = z;
	    z.panMapIfOutOfView = true;
	    map.addPopup(z);
	    break;
		}
		else{
	    if(i == ans.count-1)
	    {
				z = new OpenLayers.Popup.FramedCloud(
					"test",
					feature.geometry.getBounds().getCenterLonLat(),
					new OpenLayers.Size(640,480),
					'<iframe width="480" height="360" src="http://www.youtube.com/embed/WwNUnmZ_aww" frameborder="0" allowfullscreen></iframe>',null,true);
				feature.popup = z;
				z.panMapIfOutOfView = true;
				map.addPopup(z);
	    }
		}
  }

}
function onFeatureSelect1(feature)
{
  z = new OpenLayers.Popup.FramedCloud(
		"test",
		feature.geometry.getBounds().getCenterLonLat(),
		new OpenLayers.Size(640,480),
		'<iframe width="480" height="360" src="http://www.youtube.com/embed/WwNUnmZ_aww" frameborder="0" allowfullscreen></iframe>',null,true);
  feature.popup = z;
  z.panMapIfOutOfView = true;
  map.addPopup(z);
}
function onMyFeatureSelect(feature, json, x, y)
{
  json = "<pre><code>"+ JSON.stringify(json, null, ' ') +"</code></pre>";
  json = json.replace(/\{\n/g, '').replace(/\}[,]*/g, '').replace(/\[/g, '').replace(/\][,]/g, '').
    replace(/\"/g, '');
  z = new OpenLayers.Popup.FramedCloud(
		"test",
    new OpenLayers.LonLat(x, y),  // Always should be at the center of the map, not the center of viewport.
		new OpenLayers.Size(640,480),
		json
		,null,true);
  feature.popup = z;
  z.panMapIfOutOfView = true;
  map.addPopup(z);
}
function init(url){
	box2 = new OpenLayers.Layer.Vector( "Boxes");
	box3 = new OpenLayers.Layer.Vector( "Boxes");
	if(url != undefined)
	{
		var options = {
			controls: [],
			maxExtent: new OpenLayers.Bounds(  0.0, -928.0, 6744.0, 0.0 ),
			maxResolution: 32.000000,
			numZoomLevels: 6
		};
		map = new OpenLayers.Map('map', options);

		$.get(config.indexer+"/fetch",{url:decodeURIComponent(window.location.search.split("=")[1]).replace("\"","","gi")} , function(data){
			if (data != undefined)
			{
				ans.ans = data;
				for(var i in ans.ans)
				{
					ans.count+=1;
					makeBoxes(ans.ans[i]);
				}

			}

		});


		buffer0 = new OpenLayers.Layer.TMS( "TMS Layer","static/withpiv/",
																				{  url: '', serviceVersion: '.', layername: 'buffer0', alpha: true,
																					 type: 'png', getURL: overlay_getTileURL, buffer:0, singleTile: false
																				});

		buffer1 = new OpenLayers.Layer.TMS( "TMS Layer","static/withpiv/",
																				{  url: '', serviceVersion: '.', layername: 'buffer1', alpha: true,
																					 type: 'png', getURL: overlay_getTileURL, buffer:1, singleTile: false
																				});

		buffer2 = new OpenLayers.Layer.TMS( "TMS Layer","static/withpiv/",
																				{  url: '', serviceVersion: '.', layername: 'buffer2', alpha: true,
																					 type: 'png', getURL: overlay_getTileURL, buffer:2, singleTile: false
																				});

		var layer = new OpenLayers.Layer.TMS( "TMS Layer","static/withpiv/",
																					{  url: '', serviceVersion: '.', layername: '.', alpha: true,
																						 type: 'png', getURL: overlay_getTileURL, isBaseLayer:true
																					});
	}
	else{
		var options = {
			controls: [],
			maxExtent: new OpenLayers.Bounds(  0.0, -4668.0, 31110.0, 0.0 ),
			maxResolution: 128.000000,
			numZoomLevels: 8
		};
		map = new OpenLayers.Map('map', options);
		$.get(config.indexer+"/fetch",{url:window.location.href} , function(data){
			if (data != undefined)
			{
				ans.ans = data;
				for(var i in ans.ans)
				{
					ans.count+=1;
					makeBoxes(ans.ans[i]);
				}

			}

		});

		buffer0 = new OpenLayers.Layer.TMS( "TMS Layer","static/",
																				{  url: '', serviceVersion: '.', layername: 'buffer0', alpha: true,
																					 type: 'png', getURL: overlay_getTileURL, buffer:0, singleTile: false
																				});

		buffer1 = new OpenLayers.Layer.TMS( "TMS Layer","static/",
																				{  url: '', serviceVersion: '.', layername: 'buffer1', alpha: true,
																					 type: 'png', getURL: overlay_getTileURL, buffer:1, singleTile: false
																				});

		buffer2 = new OpenLayers.Layer.TMS( "TMS Layer","static/",
																				{  url: '', serviceVersion: '.', layername: 'buffer2', alpha: true,
																					 type: 'png', getURL: overlay_getTileURL, buffer:2, singleTile: false
																				});

		var layer = new OpenLayers.Layer.TMS( "TMS Layer","static/",
																					{  url: '', serviceVersion: '.', layername: '.', alpha: true,
																						 type: 'png', getURL: overlay_getTileURL, isBaseLayer:true
																					});


		addLabel('3759.0000','-1274.33337','Face');
		addLabel('3719','-1771','Jewelery');
		addLabel('4263.0000','-1345.33337', 'Video');

		for (var i = 0; i < box_extents.length; i++) {
			ext = box_extents[i];
			bounds = OpenLayers.Bounds.fromArray(ext);

			box = new OpenLayers.Feature.Vector(bounds.toGeometry());
			box2.addFeatures(box);
		}
		for (var i = 0; i < box_extents1.length; i++) {
			ext = box_extents1[i];
			bounds = OpenLayers.Bounds.fromArray(ext);

			box = new OpenLayers.Feature.Vector(bounds.toGeometry());
			box3.addFeatures(box);
		}

	}
  boxes = new OpenLayers.Layer.Vector( "Boxes" );
  map.addLayers([layer, buffer0, buffer1, buffer2, boxes]);

	layer.wrapDateLine = true;
  boxes.events.register('featureadded', boxes, myfeatureadded);

  map.addLayers([box2, box3]);

  selectControl = new OpenLayers.Control.SelectFeature(box3,
																											 {hover:true, clickout: true, onSelect: onFeatureSelect});

  drawControls = {
	  box : new OpenLayers.Control.DrawFeature(boxes,
																						 OpenLayers.Handler.RegularPolygon, {
																							 handlerOptions: {
																								 sides: 4,
																								 irregular: true
																							 }
																						 }
																						),
	  select: selectControl
  };


  for(var key in drawControls){
		map.addControl(drawControls[key]);
  }
  drawControls['select'].activate();
  map.addControl(new OpenLayers.Control.PanZoomBar());
  map.addControl(new OpenLayers.Control.MousePosition());
  map.addControl(new OpenLayers.Control.Navigation());
  map.addControl(new OpenLayers.Control.KeyboardDefaults());
  map.addControl(new OpenLayers.Control.LayerSwitcher());
  map.zoomToExtent( options['maxExtent'] );
  //document.getElementById('noneToggle').checked = true;
}
function addLabel(left, top, name)
{
  var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
  renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

  vectorLayer = new OpenLayers.Layer.Vector("Simple Geometry", {
    styleMap: new OpenLayers.StyleMap({'default':{
      strokeColor: "#000",
      strokeOpacity: 1,
      strokeWidth: 3,
      fillColor: "#FFF",
      fillOpacity: 1,
      pointRadius: 2,
      pointerEvents: "visiblePainted",
      // label with \n linebreaks
      label : "${name}\n",
			//\nage: ${age}",

      fontColor: "#000",
      fontSize: "16px",
      fontFamily: "Georgia, Serif",
      fontWeight: "bold",
      labelAlign: "${align}",
      labelXOffset: "${xOffset}",
      labelYOffset: "${yOffset}",
      labelOutlineColor: "white",
      labelOutlineWidth: 3
		}}),
    renderers: renderer
  });

  var labelOffsetPoint = new OpenLayers.Geometry.Point(left, top)
  var labelFeature = new OpenLayers.Feature.Vector(labelOffsetPoint);
  labelFeature.attributes = {
    align: 'cm',
    favColor: 'blue',
  };
  labelFeature.attributes['name'] = name;
  map.addLayer(vectorLayer);
  vectorLayer.drawFeature(labelFeature);
  vectorLayer.addFeatures([labelFeature]);
}
function makeBoxes(x)
{

  bounds = new OpenLayers.Bounds(x['left'], x['bottom'], x['right'], x['top']);
  box = new OpenLayers.Feature.Vector(bounds.toGeometry());
  box3.addFeatures(box);
  addLabel(x['left'],x['top'],x['name']);
}
// function onmouse(data){
//     console.log(data);
// }
function myfeatureadded(myObj)
{
  var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
  renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

  vectorLayer = new OpenLayers.Layer.Vector("Simple Geometry", {
    styleMap: new OpenLayers.StyleMap({'default':{
      strokeColor: "#000",
      strokeOpacity: 1,
      strokeWidth: 3,
      fillColor: "#FF5500",
      fillOpacity: 0.5,
      pointRadius: 2,
      pointerEvents: "visiblePainted",
      // label with \n linebreaks
      label : "${name}\n",
			//\nage: ${age}",

      fontColor: "#000",
      fontSize: "16px",
      fontFamily: "Georgia, Serif",
      fontWeight: "bold",
      labelAlign: "${align}",
      labelXOffset: "${xOffset}",
      labelYOffset: "${yOffset}",
      labelOutlineColor: "white",
      labelOutlineWidth: 3
    }}),
    renderers: renderer
  });

  var labelOffsetPoint = new OpenLayers.Geometry.Point(myObj.feature.geometry.bounds.left, myObj.feature.geometry.bounds.top);
  var labelFeature = new OpenLayers.Feature.Vector(labelOffsetPoint);
  labelFeature.attributes = {
    align: 'cm',
		favColor: 'blue',
  };
  labelFeature.attributes['name'] = prompt("Enter a label for the annotation..");
	user = prompt("Enter your name");
  if(labelFeature.attributes['name'])
  {
		topValue = myObj.feature.geometry.bounds.top;
		bottom = myObj.feature.geometry.bounds.bottom;
		left = myObj.feature.geometry.bounds.left;
		right = myObj.feature.geometry.bounds.right;
		name = labelFeature.attributes['name'];
		map.addLayer(vectorLayer);
		vectorLayer.drawFeature(labelFeature);
		vectorLayer.addFeatures([labelFeature]);
		initAnnotationTree();
		attribs = {
	    "top": topValue,
	    "bottom": bottom,
	    "right": right,
	    "left": left,
	    "name": name
		};
  }
  else
	  myObj.feature.destroy();
}

function toggleControl(element) {
  var id = $(element).attr('id');
  var control_name = id.split('-')[1];
  for(var control in drawControls) {
    if(control === control_name) {
      drawControls[control].activate();
    }
    else {
      drawControls[control].deactivate();
    }
  }
}

function overlay_getTileURL(bounds) {
  var res = this.map.getResolution();
  var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
  var y = Math.round((bounds.bottom - this.maxExtent.bottom) / (res * this.tileSize.h));
  var z = this.map.getZoom();
  if (x >= 0 && y >= 0) {
		return this.url + z + "/" + x + "/" + y + "." + this.type;
  } else {
		return "http://www.maptiler.org/img/none.png";
  }
}

function getWindowHeight() {
  if (self.innerHeight) return self.innerHeight;
  if (document.documentElement && document.documentElement.clientHeight)
		return document.documentElement.clientHeight;
  if (document.body) return document.body.clientHeight;
  return 0;
}

function getWindowWidth() {
  if (self.innerWidth) return self.innerWidth;
  if (document.documentElement && document.documentElement.clientWidth)
		return document.documentElement.clientWidth;
  if (document.body) return document.body.clientWidth;
  return 0;
}

function resize() {
  var map = document.getElementById("map");
  var header = document.getElementById("header");
  var subheader = document.getElementById("map-credits");
  map.style.height = (getWindowHeight()-180) +"px";
  map.style.width = (getWindowWidth()-60) + "px";
  //header.style.width = (getWindowWidth()-60) + "px";
  subheader.style.width = (getWindowWidth()-60) + "px";
  if (map.updateSize) { map.updateSize(); };
}
function allowPan(element) {
  var stop = !element.checked;
  for(var key in drawControls){
		drawControls[key].handler.stopDown = stop;
		drawControls[key].handler.stopUp = stop;
  }
}
onresize=function(){ resize();};
function publish()
{
	if(myJSON.length < 1){
		return;}
	for(var i in myJSON){
		jString = JSON.stringify(myJSON[i]).replace(/\{/g, '').replace(/\}[,]*/g, '').replace(/\[/g, '').replace(/\][,]/g, '').
			replace(/\"/g, '');
		myJSON[i].text = ' annotated '+window.location.href+"#[top="+myJSON[i].top+",bottom="+myJSON[i].bottom+",left="+myJSON[i].left+",right="+myJSON[i].right+"] as "+myJSON[i].name+" "+jString+" #swtr"; //The string which gets posted as a tweet.
		myJSON[i].text = encodeURIComponent(myJSON[i].text);
		myJSON[i].user = user; // User need not know the modification to the JSON.
		if(window.location.search == ""){
			myJSON[i].title = 'Annotation for '+window.location.href;
			myJSON[i].url = window.location.href;
		}
		else{
			myJSON[i].title = 'Annotation for '+ decodeURIComponent(window.location.search.split("=")[1]).replace("\"","","gi");
			myJSON[i].url = decodeURIComponent(window.location.search.split("=")[1]).replace("\"","","gi");
		}
	}
	$.post(config.indexer+'/submit', JSON.stringify(myJSON),function(){
		$.post(config.postTweetUrl, {"data":JSON.stringify(myJSON)}, function(data) {
	    $('#posted').show();
			myJSON = [];
	  });
	});
}
var config = {
	'postTweetUrl':'http://192.168.100.14:5001',
	'indexer':'http://localhost:5000'
}

