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
// avoid pink tiles
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
OpenLayers.Util.onImageLoadErrorColor = "transparent";
var handler={
    check: false,
    check1: false,
    check2: false,
    trigger: function() {
	// if(handler.check == false)
	// {
	//     handler.check = true;
	//     myjson = {"temple":[
	// 	{"period": "16th century"},
	// 	{"location":"13.80338 - 77.61067"},
	// 	{"sthapati":"Shivakumar"},
	// 	{"innerloc": "MaharangaMandapa"}
	//     ],
	// 	      "size": "311110px X 4668 px",
	// 	      "narrative": "Narrative",
	// 	      "muralTradition": "XYZ",
	// 	      "muralTechnique": "Foo",
	// 	      "muralContent": "Bar"
	// 	     };
	//     var x = document.getElementById("content");
	//     for (var i in myjson)
	//     {
	// 	if(i == "temple")
	// 	{
	// 	    for(var y =0; y <myjson[i].length;y++)
	// 	    {
	// 		for(var z in myjson[i][y])
	// 		{
	// 		    x.innerHTML += z+': '+'<i>'+myjson[i][y][z]+'</i>; ';
	// 		}
	// 	    }
	// 	}
	// 	else{
	// 	    x.innerHTML += i+': '+'<i>'+myjson[i]+'</i>; ';
	// 	}
	//     }
	// }
	// else{
	//     var x = document.getElementById("content");
	//     x.innerHTML ='';
	//     handler.check = false;
	// }
	onMyFeatureSelect(map);
    },
    trigger1: function() {
	if(handler.check1 == false)
	{
	    handler.check1 = true;
	    myjson = {"face":[
		{"character":"Shiva"}
	    ],
		      "size": "310px X 460px"  // jewellery:earring; material: silver,
		     };
	    var x = document.getElementById("content1");
	    for (var i in myjson)
	    {
		if(i == "face")
		{
		    for(var y =0; y <myjson[i].length;y++)
		    {
			for(var z in myjson[i][y])
			{
			    x.innerHTML += z+': '+'<i>'+myjson[i][y][z]+'</i>; ';
			}
		    }
		}
		else{
		    x.innerHTML += i+': '+'<i>'+myjson[i]+'</i>; ';
		}
	    }
	}
	else{
	    var x = document.getElementById("content1");
	    x.innerHTML ='';
	    handler.check1 = false;
	}
    },
    trigger2: function() {
	if(handler.check2 == false)
	{
	    handler.check2 = true;
	    myjson = {"ornament":[
		{"jewelery":"Pendant"},
		{"Material":"Silver"}
	    ],
		      "size": "50px X 90px"  
		     };
	    var x = document.getElementById("content2");
	    for (var i in myjson)
	    {
		if(i == "ornament")
		{
		    for(var y =0; y <myjson[i].length;y++)
		    {
			for(var z in myjson[i][y])
			{
			    x.innerHTML += z+': '+'<i>'+myjson[i][y][z]+'</i>; ';
			}
		    }
		}
		else{
		    x.innerHTML += i+': '+'<i>'+myjson[i]+'</i>; ';
		}
	    }
	}
    else{
	var x = document.getElementById("content2");
	x.innerHTML ='';
	handler.check2 = false;
    }
    }

};
function onFeatureSelect(feature)
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
function onMyFeatureSelect(feature)
{
    z = new OpenLayers.Popup.FramedCloud(
	"test",
        new OpenLayers.LonLat(15555, -2334),  // Always should be at the center of the map, not the center of viewport.
	new OpenLayers.Size(640,480),
	"<pre><b><center>Temple</center></b>\n"+
	    "period: 16th century\n"+
	    "location: 13.80338 - 77.61067\n"+
	    "sthapati: Shivakumar\n"+
	    "innerloc: MaharangaMandapa\n"+
	    "size: 311110px X 4668 px\n"+
	    "narrative: Narrative\n"+
	    "muralTradition: XYZ\n"+
	    "muralTechnique: Foo\n"+
	    "muralContent: Bar</pre>"
	,null,true);
    feature.popup = z;
    z.panMapIfOutOfView = true;
    map.addPopup(z);
}
function init(){
    var options = {
	controls: [],
	maxExtent: new OpenLayers.Bounds(  0.0, -4668.0, 31110.0, 0.0 ),
	maxResolution: 128.000000,
	numZoomLevels: 8
    };
    map = new OpenLayers.Map('map', options);
    
    var layer = new OpenLayers.Layer.TMS( "TMS Layer","",
					  {  url: '', serviceVersion: '.', layername: '.', alpha: true,
					     type: 'png', getURL: overlay_getTileURL 
					  });			
    boxes = new OpenLayers.Layer.Vector( "Boxes" );
    map.addLayers([layer, boxes]);
    
    boxes.events.register('featureadded', boxes, myfeatureadded);
    box2 = new OpenLayers.Layer.Vector( "Boxes" );
    for (var i = 0; i < box_extents.length; i++) {
        ext = box_extents[i];
        bounds = OpenLayers.Bounds.fromArray(ext);
                    
        box = new OpenLayers.Feature.Vector(bounds.toGeometry());
        box2.addFeatures(box);
    }
    box3 = new OpenLayers.Layer.Vector( "Boxes");
    for (var i = 0; i < box_extents1.length; i++) {
        ext = box_extents1[i];
        bounds = OpenLayers.Bounds.fromArray(ext);
                    
        box = new OpenLayers.Feature.Vector(bounds.toGeometry());
        box3.addFeatures(box);
    }
    map.addLayers([box2, box3]);

    selectControl = new OpenLayers.Control.SelectFeature(box3,
							 {onSelect: onFeatureSelect});
    
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
    map.zoomToExtent( mapBounds );	
    for(var key in drawControls){
	map.addControl(drawControls[key]);
    }
    drawControls['select'].activate();
    addLabel('3759.0000','-1274.33337','Face');
    addLabel('3719','-1771','Jewelery');
    addLabel('4263.0000','-1630.33337', 'Video')
    map.addControl(new OpenLayers.Control.PanZoomBar());
    map.addControl(new OpenLayers.Control.MousePosition());
    map.addControl(new OpenLayers.Control.MouseDefaults());
    map.addControl(new OpenLayers.Control.KeyboardDefaults());
    map.zoomToExtent( mapBounds );
    document.getElementById('noneToggle').checked = true;
}
function addLabel(left, top, name)
{
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
            renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
            
            vectorLayer = new OpenLayers.Layer.Vector("Simple Geometry", {
                styleMap: new OpenLayers.StyleMap({'default':{
                    strokeColor: "#00FF00",
                    strokeOpacity: 1,
                    strokeWidth: 3,
                    fillColor: "#FF5500",
                    fillOpacity: 0.5,
                    pointRadius: 6,
                    pointerEvents: "visiblePainted",
                    // label with \n linebreaks
                    label : "${name}\n",
//\nage: ${age}",
                    
                    fontColor: "${favColor}",
                    fontSize: "16px",
                    fontFamily: "Courier New, monospace",
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
function onmouse(data){
    console.log(data);
}
function myfeatureadded(myObj)
{
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
            renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
            
            vectorLayer = new OpenLayers.Layer.Vector("Simple Geometry", {
                styleMap: new OpenLayers.StyleMap({'default':{
                    strokeColor: "#00FF00",
                    strokeOpacity: 1,
                    strokeWidth: 3,
                    fillColor: "#FF5500",
                    fillOpacity: 0.5,
                    pointRadius: 6,
                    pointerEvents: "visiblePainted",
                    // label with \n linebreaks
                    label : "${name}\n",
//\nage: ${age}",
                    
                    fontColor: "${favColor}",
                    fontSize: "16px",
                    fontFamily: "Courier New, monospace",
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
    labelFeature.attributes['name'] = prompt("Enter a name");
    console.log(labelFeature.attributes['name']);
    if(labelFeature.attributes['name'])
    {
	console.log("here");
	map.addLayer(vectorLayer);
	vectorLayer.drawFeature(labelFeature);
	vectorLayer.addFeatures([labelFeature]);
    }
    else
	    myObj.feature.destroy();
}
function toggleControl(element) {
    for(key in drawControls) {
        var control = drawControls[key];
        if(element.value == key && element.checked) {
            control.activate();
	}
	else {
            control.deactivate();
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
    var subheader = document.getElementById("subheader");  
    map.style.height = (getWindowHeight()-80) +"px";
    map.style.width = (getWindowWidth()-20) + "px";
    header.style.width = (getWindowWidth()-20) + "px";
    subheader.style.width = (getWindowWidth()-20) + "px";
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
