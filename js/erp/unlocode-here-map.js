var currentMarker = [];
var geoFenceCount = 1;
var geoFenceDivHtml = "";
var geoFenceLayerObject = [];

//Input elements for form
if(geoFenceDivHtml == ""){
	clondiv = $("#geofence_div").clone();
	clondiv.find('textarea[id^=geofence_coordinates]').value = '';
	clondiv.find('input[id^=geofence_shape]').value = '';
	clondiv.find('input[id^=geofence_latcenter]').value = '';
	clondiv.find('input[id^=geofence_lngcenter]').value = '';
	clondiv.find('input[id^=geofence_radious]').value = '';
	clondiv.find('input[id^=geofence_name]').value = '';
	clondiv.find('input[id^=geofence_id]').value = '';
	clondiv.find('input[id^=geofence_country]').value = '';
	clondiv.find('.geofence_ref').value = '';
	
	geoFenceDivHtml = clondiv[0].outerHTML;
	geoFenceDivHtml = geoFenceDivHtml.replace(/geofence_div/g, 'geofence_div_x');
}

geoFenceCount = $('input[id^=geofence_name]').length;	
	
var mapData = document.getElementById('mapData').value;
	mapData = JSON.parse(mapData);
	
	if(mapData.fromCoordinate != ""){
		mapData.defaultCoordinate = mapData.fromCoordinate;
	}
	
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
	layers: [normalStreet],
});

L.control.layers(baseMaps).addTo(mymap);

var markerArray = []; 
var markicon = "";

var currentMarker = L.marker(mapData.defaultCoordinate).addTo(mymap);
if(mapData.fromMsg != ""){
	currentMarker.bindPopup(mapData.fromMsg)
	.openPopup();
}

markerArray.push(currentMarker);
createPolygon();
	
// Tools for drawing circle/polygon
var drawnItems = new L.FeatureGroup();
mymap.addLayer(drawnItems);

var options = {
    draw: {
       polyline: false,
	   circle : false,
       rectangle: true, 
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
		$("#un_latitude").val(parseFloat(MymaplatLong.lat).toFixed(7));
		$("#un_longitude").val(parseFloat(MymaplatLong.lng).toFixed(7)); //MymaplatLong.lng % 180  = we take reminder of 180 because map increase the value of longiture in multiple of 180
		$("#un_latitude_char").val(LatLongDMS_Converter(MymaplatLong.lat, "LAT"));
		$("#un_longitude_char").val(LatLongDMS_Converter(MymaplatLong.lng, "LONG"));
		
		if(currentMarker != ""){
			mymap.removeLayer(currentMarker);	
		}
		currentMarker = layer;
		
	}else if(type == 'polygon' || type == 'rectangle'){
		var final_coordinates = [];
   		var used_coordinates = [];
   		var polygon_coordinates = layer.toGeoJSON();
   		var points = layer.getBounds().getCenter();

   		if(polygon_coordinates){
   			polygon_coordinates = polygon_coordinates.geometry.coordinates[0];
			$.each(polygon_coordinates, function( index, value ) {
				var latlngKey = value[0]+"_"+value[1];
				if(used_coordinates.indexOf(latlngKey) === -1){
			  		final_coordinates.push([value[1], value[0]]);
			  		used_coordinates.push(latlngKey);
			  	}
			});
	   	}

		var divName = "#geofence_div";
		var firstDivSaveStatus = $(".geofencediv-class").eq(0).find(".geofence_saved").val();
		
		if((geoFenceCount >= 1 && firstDivSaveStatus == "saved") || firstDivSaveStatus == undefined){
			geoFenceCount += 1;
			sourceDivHtml = geoFenceDivHtml.replace(/geofence_div_x/g, 'geofence_div_' + geoFenceCount);	
			$("#geofence_btn_div").append(sourceDivHtml);
			divName = '#geofence_div_' + geoFenceCount;
		} else {
			geoFenceCount += 1;
		}

		getLocation(points.lat, points.lng, divName); //Get country iso

		$(divName).find('textarea[id^=geofence_coordinates]').val(JSON.stringify(final_coordinates));
		$(divName).find('input[id^=geofence_shape]').val(type);
		$(divName).find('input[id^=geofence_latcenter]').val(points.lat);
		$(divName).find('input[id^=geofence_lngcenter]').val(points.lng);
		$(divName).find('input[id^=geofence_radious]').val('');
		$(divName).find('input[id^=geofence_name]').val('');
		$(divName).find('input[id^=geofence_id]').val('');
		$(divName).find('.geofence_ref').val(geoFenceCount);
		$(divName).find('input[id^=geofence_saved]').val('saved');
		
		//add layout to variable to remove later
		geoFenceLayerObject[geoFenceCount] = layer;
		
		var changecount = $("#geofence-change-count").val();
			changecount = parseInt(changecount);
			changecount += 1;
			$("#geofence-change-count").val(changecount);
		
	}else if(type == 'circle'){
		var center_points = layer.getLatLng();
        var radius = layer.getRadius();
		//lat = center_points.lat
		//long = center_points.lng
	}

   mymap.addLayer(layer);
});

var group = new L.featureGroup(markerArray);
if(geoFenceLayerObject.length != 0){
	mymap.fitBounds(group.getBounds(),{padding: [20,20]});	
}

$('.rem-layer').live('click', function(e) {
	var layerPosition = $(this).parents().find('.geofence_ref').val();
	mymap.removeLayer(geoFenceLayerObject[layerPosition]);
	$(this).closest('.form-group').remove();
	
	var changecount = $("#geofence-change-count").val();
		changecount = parseInt(changecount);
		changecount += 1;
		$("#geofence-change-count").val(changecount);		
});

$('.geofencename').live('change', function(e) {
	var changecount = $("#geofence-change-count").val();
		changecount = parseInt(changecount);
		changecount += 1;
		$("#geofence-change-count").val(changecount);
});

//Create polygon
function createPolygon(){
	$count = 1;
	$('textarea[id^=geofence_coordinates]').each(function (){
		if($(this).val() != ""){
			var polygon_coordinates = JSON.parse($(this).val());
			if(polygon_coordinates != ''){
				var poly_options = {
				   color: '#f06eaa',
				   fillColor: '#f06eaa',
				   fillOpacity: 0.5
				}
		
				var polygon = L.polygon(polygon_coordinates, poly_options).addTo(mymap);
				markerArray.push(polygon);
				
				geoFenceLayerObject[$count++] = polygon;
			}
		}
	})
}


function LatLongDMS_Converter(latlng, type){
	var deg = 0;
	var min = 0;
	var absLatlng = 0;
	
	var result = "";
	var direction = "";
	var degString = "";
	var minString = "";
	
	if(type == "LAT"){
		if(latlng < 0){
			direction = "S";
		} else {
			direction = "N";
		}	
	} else {
		if(latlng < 0){
			direction = "W";
		} else {
			direction = "E";
		}		
	}
	
	//if(type == "LONG"){
	//	latlng = latlng % 180; //we take reminder of 180 because map increase the value of longiture in multiple of 180
	//}
	
	absLatlng = Math.abs(latlng);
	deg = Math.trunc(absLatlng);
	degString = "000" + deg.toString();
	
	min = (absLatlng - deg) * 60;
	min = Math.trunc(min);  
	if(min < 10){
		minString = "0" + min.toString() + "00";
	} else {
		minString = min.toString() + "00";	
	}
	
	if(type == "LAT"){
		result = degString.slice(-2).toString() + minString.slice(0,2).toString() + direction;
	} else {
		result = degString.slice(-3).toString() + minString.slice(0,2).toString() + direction;
	}
	
	return result;
}

//Reverse geocode
function getLocation(latitude, longitude, divName){
	var coordinate = latitude+','+longitude;
	
	$.ajax({
		url: 'https://revgeocode.search.hereapi.com/v1/revgeocode',
		type: 'GET',
		data: {
			at: coordinate,
			lang: 'en-US',
			apikey: apikey
		},
		success: function (response) {
			if(response){
				if(response.items.length > 0){
					countryCode = response.items[0].address.countryCode;
					$(divName).find('input[id^=geofence_country]').val(countryCode);
				}
			}
			
		},
		error: function(data) {}
	});
}

//mymap.panTo(new L.LatLng(mapData.defaultCoordinate[0], mapData.defaultCoordinate[1]));
