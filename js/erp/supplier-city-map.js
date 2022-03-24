var mapData = document.getElementById('mapData').value;
	mapData = JSON.parse(mapData);
	
	if(mapData.fromCoordinate != ""){
		mapData.defaultCoordinate = mapData.fromCoordinate;
	}

var revgeocodeURL = mapData.revgeocodeURL;
var geocodeURL = mapData.geocodeURL;
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

markerArray.push(currentMarker);

// Tools for drawing circle/polygon
var drawnItems = new L.FeatureGroup();
mymap.addLayer(drawnItems);

var options = {
    draw: {
       polyline: false,
	   polygon: false,
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
		
		if(currentMarker != ""){
			mymap.removeLayer(currentMarker);	
		}
		currentMarker = layer;
		getAddress(MymaplatLong, currentMarker);
	}
   mymap.addLayer(layer);
});

var group = new L.featureGroup(markerArray);

//Get address from Lat/Long 
function getAddress(MymaplatLong, currentMarker){
	$latLong = MymaplatLong.lat + ',' + MymaplatLong.lng;	
	$geocodinate = [MymaplatLong.lat, MymaplatLong.lng];
	$address = 'Location information not available';
	
	$.ajax({
		url: revgeocodeURL,
		type: 'GET',
		data: {
			at: $latLong, 
			lang: 'en-US',
			apikey: apikey,
			async: false
		},
		success: function (response) {
			if(response){
				if(response.items.length > 0){
					$address = response.items[0].address.label;
					$county = response.items[0].address.county;
					$state = response.items[0].address.state;
					$city = response.items[0].address.city;
					$("#county").val($county);
					$("#state").val($state);
					$("#city").val($city);
				} 

				$("#latitude").val(parseFloat(MymaplatLong.lat).toFixed(7));
				$("#longitude").val(parseFloat(MymaplatLong.lng).toFixed(7));
				
				currentMarker.bindPopup('<strong>'+$address+'</strong>').openPopup();
			}
		},
		error: function(data) {
			$('html, body').animate({ scrollTop: 0 }, 400);
         	$('form').find('#response').empty().prepend(alert_error).fadeIn();
		}
	});
}

$(document).on('click', '#find-address', function(){
	var city = $('#city_name').val();
	var country = $('#country').val();
	var q = $.trim(city) + "," + country; 
	
	$(this).attr('disabled','disabled');
	$(this).html('<span class="fa fa-refresh fa-spin"></span>');
	
	$.ajax({
		url: geocodeURL,
		type: 'GET',
		data: {
			q: q, 
			lang: 'en-US',
			apikey: apikey,
			async: false
		},
		success: function (response) {
			if(response){
				if(response.items.length > 0){
					$address = response.items[0].address.label;
					$county = response.items[0].address.county;
					$state = response.items[0].address.state;
					$city = response.items[0].address.city;
					$lat = response.items[0].position.lat;
	        		$lng =  response.items[0].position.lng;
					
					$("#county").val($county);
					$("#state").val($state);
					$("#city").val($city);
					
					if($.trim($("#city_name").val()) == $.trim($city)){
						$("#is_latlng_verified").prop("checked",true);
					}
				} 

				$("#latitude").val(parseFloat($lat).toFixed(7));
				$("#longitude").val(parseFloat($lng).toFixed(7));
				
				currentMarker.setLatLng(L.latLng($lat, $lng)).bindPopup('<strong>'+$address+'</strong>').openPopup();
				mymap.fitBounds(group.getBounds(),{padding: [20,20]});
				
				$("#find-address").html('<span class="fa fa-search"></span>');
				$("#find-address").removeAttr('disabled');
			}
		},
		error: function(data) {
			$('html, body').animate({ scrollTop: 0 }, 400);
         	$('form').find('#response').empty().prepend(alert_error).fadeIn();
			$("#find-address").html('<span class="fa fa-search"></span>');
			$("#find-address").removeAttr('disabled');
		}
	});
	
});


