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
	layers: [normalStreet]
});

L.control.layers(baseMaps).addTo(mymap);

var markerArray = []; 
var markicon = "";

//Dynamic marker - Start
for (i = 0; i < mapData.ship.length; i++) {
	markicon = L.divIcon({html:'<div class="pin2 blue">S</div>'});
  	
  	markerArray.push(
		L.marker(mapData.ship[i].fromCoordinate, {icon: markicon}).addTo(mymap)
				.bindPopup(mapData.ship[i].fromMsg)
				.openPopup()
  		);

  	markicon = L.divIcon({html:'<div class="pin2 red">S</div>'});

  	markerArray.push(
		L.marker(mapData.ship[i].toCoordinate, {icon: markicon}).addTo(mymap)
				.bindPopup(mapData.ship[i].toMsg)
				.openPopup()
  		);
} 
//Dynamic marker - End

var marker1Icon = L.divIcon({html:'<div class="pin2 red">D</div>'});
var marker2Icon = L.divIcon({html:'<div class="pin2 blue">C</div>'});

var marker1 = L.marker(mapData.toCoordinate, {icon: marker1Icon}).addTo(mymap)
		.bindPopup(mapData.toMsg)
		.openPopup();

markerArray.push(marker1);

var marker2 = L.marker(mapData.fromCoordinate, {icon: marker2Icon}).addTo(mymap)
		.bindPopup(mapData.fromMsg)
		.openPopup();

markerArray.push(marker2);

var group = new L.featureGroup(markerArray);

mymap.fitBounds(group.getBounds(),{padding: [20,20]});

//mymap.panTo(new L.LatLng(mapData.defaultCoordinate[0], mapData.defaultCoordinate[1]));
