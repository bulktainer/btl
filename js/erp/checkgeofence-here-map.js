var mapData = document.getElementById('mapData').value;
	mapData = JSON.parse(mapData);
var apikey = mapData.hereKey;

var mapboxAttribution = '<a href="https://bulktainerlogistics.com/">Bulk Tainer Logistics</a>';
var normalStreetURL = 'https://1.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?apiKey=' + apikey;
var TerrainURL = 'https://1.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/terrain.day/{z}/{x}/{y}/256/png8?apiKey=' + apikey;
var SatelliteURL = 'https://1.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/png8?apiKey=' + apikey;
var HybridURL = 'https://1.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/hybrid.day/{z}/{x}/{y}/256/png8?lg=dut&apiKey=' + apikey;
var TollZoneURL = 'https://1.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?congestion=undefined&apiKey=' + apikey;
var HiResMapURL = 'https://1.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?ppi=320&apiKey=' + apikey;
var TruckRestrictionURL = 'https://1.base.maps.ls.hereapi.com/maptile/2.1/trucktile/newest/normal.day/{z}/{x}/{y}/256/png8?apiKey=' + apikey;
var TrafficURL = 'https://1.traffic.maps.ls.hereapi.com/maptile/2.1/traffictile/newest/normal.day/{z}/{x}/{y}/256/png8?apiKey=' + apikey;

var normalStreet = L.tileLayer(normalStreetURL, {id: 'mapbox.streets', maxZoom: 18, attribution: mapboxAttribution}),
Terrain   = L.tileLayer(TerrainURL, {id: 'mapbox.streets', maxZoom: 18, attribution: mapboxAttribution}),
Satellite = L.tileLayer(SatelliteURL, {id: 'mapbox.streets', maxZoom: 18, attribution: mapboxAttribution}),
Hybrid = L.tileLayer(HybridURL, {id: 'mapbox.streets', maxZoom: 18, attribution: mapboxAttribution}),
TruckRestriction = L.tileLayer(TruckRestrictionURL, {id: 'mapbox.streets', maxZoom: 18, attribution: mapboxAttribution}),
TollZone = L.tileLayer(TollZoneURL, {id: 'mapbox.streets', maxZoom: 18, attribution: mapboxAttribution}),
HiResMap = L.tileLayer(HiResMapURL, {id: 'mapbox.streets', maxZoom: 18, attribution: mapboxAttribution}),
Traffic = L.tileLayer(TrafficURL, {id: 'mapbox.streets', maxZoom: 18, attribution: mapboxAttribution});

var baseMaps = {
	"Normal Street Map": normalStreet,
	"Terrain Map": Terrain,
	"Satellite Map" : Satellite,
	"Hybrid Map" : Hybrid,
	"Truck restriction Map" : TruckRestriction,
	"Toll Zone Map" : TollZone,
	"Hi-Res Map Tiles" : HiResMap,
	"Traffic Map" : Traffic
};

var mymap = L.map(mapData.mapdiv, {
	center: mapData.defaultCoordinate,
	zoom: mapData.zoom,
	layers: [normalStreet]
});

L.control.layers(baseMaps).addTo(mymap);

var markerArray = []; 
var markicon = "";
var currentMarker = L.marker(mapData.defaultCoordinate).addTo(mymap);

if(mapData.fromMsg != ""){
	currentMarker.bindPopup(mapData.fromMsg)
	.openPopup();
}

// Tools for drawing circle/polygon
var drawnItems = new L.FeatureGroup();
mymap.addLayer(drawnItems);

var options = {
    draw: {
       polygon: false,
       polyline: false,
	   circle : false,
       rectangle: false, 
       marker: true
    }
};

var drawControl = new L.Control.Draw(options);
mymap.addControl(drawControl);

// Drawing event
mymap.on(L.Draw.Event.CREATED, function (e) {
   	var type = e.layerType,
        layer = e.layer;

	if(type == 'marker'){
		var MymaplatLong = e.layer.getLatLng();
		$("#un_latitude_char").val(parseFloat(MymaplatLong.lat).toFixed(7));
		$("#un_longitude_char").val(parseFloat(MymaplatLong.lng).toFixed(7));
		
		if(currentMarker != ""){
			mymap.removeLayer(currentMarker);	
		}
		currentMarker = layer;
	}

   mymap.addLayer(layer);
});


$('.checkFence').click(function(e){
		var lat = $("#un_latitude_char").val();
		var lng =  $("#un_longitude_char").val();
		var ajaxImg = appHome + '/../images/ajax-loader-large.gif';
		var ajaxLoader = '<div class="text-center"><img src="' + ajaxImg + '"></div>';
		$("#fencedata").html(ajaxLoader);

		if(lat != "" && lng != ""){
    		$.ajax({
    			type: "POST",
    			cache: false,
    			url: appHome+'/geofence/common_ajax',
    			dataType: "text",
    			data: ({
    				'action_type':'check_geofence',
    				'lat' : lat,
    				'lng' : lng
    			}), 
    			success: function(result)
    			{ 
    				$("#fencedata").html(result);
    			}  
    		});
		}
});


$('.getFencelist').click(function(e){
		var ajaxImg = appHome + '/../images/ajax-loader-large.gif';
		var ajaxLoader = '<div class="text-center"><img src="' + ajaxImg + '"></div>';
		$("#fencedata").html(ajaxLoader);

		$.ajax({
			type: "POST",
			cache: false,
			url: appHome+'/geofence/common_ajax',
			dataType: "text",
			data: ({
				'action_type':'get_geofencelist',
			}), 
			success: function(result)
			{ 
				$("#fencedata").html(result);
			}  
		});
});
