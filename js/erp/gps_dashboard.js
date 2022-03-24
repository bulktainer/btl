var alert_error = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Something went wrong, please try again later.</div>';
var mymap;
var gps_latitude;
var gps_longitude;
var last_latitude;
var last_longitude;

$(document).ready(function(){
	
	var mapData = $('#mapData').val();
		mapData = JSON.parse(mapData);
		
		if(mapData.fromCoordinate != ""){
			mapData.defaultCoordinate = mapData.fromCoordinate;
	}
	gps_latitude = mapData.gpsCoordinate[0];
	gps_longitude = mapData.gpsCoordinate[1];
	var apikey = mapData.hereKey;
	var baseUrl = appHome.replace('erp.php','');
	var direction = mapData.direction;
	$('#api_key').val(apikey);
	$('#base_url').val(baseUrl);
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

	mymap = L.map(mapData.mapdiv, {
		center: mapData.defaultCoordinate,
		zoom: mapData.zoom,
		layers: [normalStreet]
	});

	L.control.layers(baseMaps).addTo(mymap);

	var markerArray = []; 
	var markicon = "";

	var marker1Icon = L.divIcon({html:'<div class="pin2 red">D</div>'});
	var marker2Icon = L.divIcon({html:'<div class="pin2 blue">C</div>'});
	if(mapData.speed > 0){
	 	var marker3Icon = L.divIcon({html:'<div class="icon-div"><div class="icon arrow-blue" style="transform: rotate('+direction+');"><span class="inner-bg"></span></div></div>'
	            	  });
	}
	else{
	 	var marker3Icon = L.divIcon({html:'<div class="icon-div"><div class="map-icon-holder map-red"><span class="inner-white"></span></div></div>'
	 	            	  });
	}
	
	var marker1 = L.marker(mapData.toCoordinate, {icon: marker1Icon}).addTo(mymap)
			.bindPopup(mapData.toMsg)
			.openPopup();

	markerArray.push(marker1);

	var marker2 = L.marker(mapData.fromCoordinate, {icon: marker2Icon}).addTo(mymap)
			.bindPopup(mapData.fromMsg)
			.openPopup();

	markerArray.push(marker2);

	address = 'Location information not available';

	$.ajax({
		url: 'https://revgeocode.search.hereapi.com/v1/revgeocode',
		type: 'GET',
		data: {
			at: mapData.gps_data,
			lang: 'en-US',
			apikey: apikey,
			async: false
		},
		success: function (response) {
			if(response){
				if(response.items.length > 0){
					address = response.items[0].address.label;
				}
				$('.location-name').text(address);

				drawGPSRoute(mapData.location_data, mymap, baseUrl, markerArray);
				
				var marker3 = L.marker(mapData.gpsCoordinate, {icon: marker3Icon}).addTo(mymap)
					.bindPopup('<strong>'+address+'</strong>')
					.openPopup();

				markerArray.push(marker3);

				var group = new L.featureGroup(markerArray);

				mymap.fitBounds(group.getBounds(),{padding: [20,20]});
				$('.icon-div').parent().addClass('top-icon');
			}
			else{
				drawGPSRoute(mapData.location_data, mymap, baseUrl, markerArray);

				var marker3 = L.marker(mapData.gpsCoordinate, {icon: marker3Icon}).addTo(mymap)
					.bindPopup('<strong>'+address+'</strong>')
					.openPopup();

				markerArray.push(marker3);

				var group = new L.featureGroup(markerArray);
				mymap.fitBounds(group.getBounds(),{padding: [20,20]});
				$('.location-name').text(address);
				$('.icon-div').parent().addClass('top-icon');
			}
		},
		error: function(data) {
			$('html, body').animate({ scrollTop: 0 }, 400);
         	$('form').find('#response').empty().prepend(alert_error).fadeIn();
		}
	});

	/**
	 * Creates a H.map.Polyline from the shape of the route and adds it to the map.
	 * @param {Object} route A route as received from the H.service.RoutingService
	 */
	function drawGPSRoute(location_data, mymap, baseUrl, markerArray){
		var polyline = [];
		var period = [];
		var period_date = '';
		var valve_temp = [];
		var liquid_temp = [];
		var ambient_temp = [];
		var end_valve_temp = '';
		var end_liquid_temp = '';
		var end_ambient_temp = '';
		var status = 0;
		var result_count = $('#result_count').val();
		if(result_count < 500){
			polyline.push(L.latLng(mapData.gpsCoordinate[0], mapData.gpsCoordinate[1]));
		}
		$.each(location_data, function( key, value ) {
			//marker
			if(value.status == 1){
			 	if(period.length){
			 		period_date = period[0];
			 		css_class = 'map-rose';
			 		inner_class = 'inner-yellow';
			 		end_valve_temp = valve_temp[0];
			 		end_liquid_temp = liquid_temp[0];
			 		end_ambient_temp = ambient_temp[0];
			 	}
			 	else{
			 		css_class = 'map-blue';
			 		period_date = '';
			 		inner_class = 'inner-green';
			 	}
			 	var html_string= '<div class=""><div class="device_history map-icon-holder '+css_class+'" data-latitude="'+value.latitude+'"'
			 	 	+' data-longitude="'+value.longitude+'" data-datetime="'+value.datetime+'" data-period="'+period_date+'" data-valve-temp="'+
			 	 	value.valve_temp+'" data-liquid-temp="'+value.liquid_temp+'" data-ambient-temp="'+value.ambient_temp+
			 	 	'" data-end-valve-temp="'+end_valve_temp+'" data-end-liquid-temp="'+end_liquid_temp+'" data-end-ambient-temp="'+end_ambient_temp+
			 	 	'" ><span class="'+inner_class+'"></span></div></div>';
     			var markerIcon = L.divIcon({html: html_string });
				coordinate = [value.latitude, value.longitude];
				var marker = L.marker(coordinate, {icon: markerIcon}).addTo(mymap).bindPopup('')
						.openPopup();

				markerArray.push(marker);

				polyline.push(L.latLng(value.latitude, value.longitude));
				if(status == 0){
					last_latitude = value.latitude;
					last_longitude = value.longitude;
					status = 1;
				}
				period = [];
			}
			else{
				period.push(value.period);
				valve_temp.push(value.valve_temp);
				liquid_temp.push(value.liquid_temp);
				ambient_temp.push(value.ambient_temp);

			}
		});
		
		var group = new L.featureGroup(markerArray);
		mymap.fitBounds(group.getBounds(),{padding: [20,20]});
	  
		polylineLayer = L.polyline(polyline, {
	        color: 'rgba(0, 100, 0, 0.7)',
	        weight: 2
		});

		//Remove previously drawn route 
		if(polylineLayer != ""){
		    //polylineLayer.removeFrom(mymap);
		    polylineLayer.remove();
		}

		polylineLayer.addTo(mymap);
		mymap.fitBounds(polylineLayer.getBounds());
	}

	// if($('#date_from').val() != '' || $('#date_to').val() != ''){
	// 	getHistoryLocation();
	// }
});

// Map 
$(document).on('click', '#map_btn', function(){
    $('#map_btn i').toggleClass('fa-minus-circle fa-plus-circle');
});

// filter 
$(document).on('click', '#filter_section', function(){
    $('#filter_section i').toggleClass('fa-minus-circle fa-plus-circle');
});

// Tank Number auto complete
//Autocomplete function to fetch the tank numbers
if($("#gps_tanknumber").length > 0){
	
	$("#gps_tanknumber").autocomplete({
	    source:  appHome+'/gps-settings/get-tanknumbers-gps',
	    minLength: 2,
	    type: "GET",
	    success: function (event, ui) {},
		select: function (event, ui) {
	    	event.preventDefault();
			$(this).val(ui.item.label);
			$('#hdn_tank_num').val(ui.item.value);
			return false;
		},
		focus: function(event, ui) {
		        event.preventDefault();
		        $(this).val(ui.item.label);
		},
		change: function (event, ui) {
	        if (ui.item === null) {
	        	BootstrapDialog.show({title: 'Error', message : 'Not a valid Tank',
				buttons: [{label: 'Close',action: function(dialogRef){dialogRef.close();}}],cssClass: 'small-dialog',	
				});
	            $(this).val('');
	            $('#hdn_tank_num').val('');
	        }
		}
	});
}

$(document).on('click', '.device_history', function(){
	var latitude = $(this).data('latitude');
	var longitude = $(this).data('longitude');
	var datetime = $(this).data('datetime');
	var period = $(this).data('period');
	var coordinate = latitude+','+longitude;
	var coordinate_array = [latitude, longitude];
	var baseUrl = $('#base_url').val();
	$('.leaflet-popup-content').addClass('ajax-loader');
	$('.leaflet-popup-content').html('<img src="'+baseUrl+'images/ajax.gif">');
	var address = 'Location information not available';
	var valve_temp = $(this).data('valve-temp');
	var liquid_temp = $(this).data('liquid-temp');
	var ambient_temp = $(this).data('ambient-temp');
	if(valve_temp == undefined || valve_temp == ''){
		valve_temp = '-';
	}
	if(liquid_temp == undefined || liquid_temp == ''){
		liquid_temp = '-';
	}
	if(ambient_temp == undefined || ambient_temp == ''){
		ambient_temp = '-';
	}
	var temperature = '';
	
	if(period){
		datetime = datetime + ' - '+period;
		var end_valve_temp = $(this).data('end-valve-temp');
		var end_liquid_temp = $(this).data('end-liquid-temp');
		var end_ambient_temp = $(this).data('end-ambient-temp');
		if(end_valve_temp == undefined || end_valve_temp == ''){
			end_valve_temp = '-';
		}
		if(end_liquid_temp == undefined || end_liquid_temp == ''){
			end_liquid_temp = '-';
		}
		if(end_ambient_temp == undefined || end_ambient_temp == ''){
			end_ambient_temp = '-';
		}
		temperature = '<br>Steam Inlet Temp(°C) : '+valve_temp+' : '+end_valve_temp+
			'<br>Product Temp(°C) : '+liquid_temp+' : '+end_liquid_temp+
			'<br>Ambient Temp(°C) : '+ambient_temp+' : '+end_ambient_temp;
	}
	else{
		temperature = '<br>Steam Inlet Temp(°C) : '+valve_temp+'<br>Product Temp(°C) : '+liquid_temp+
						'<br>Ambient Temp(°C) : '+ambient_temp;
	}
	$.ajax({
		url: 'https://revgeocode.search.hereapi.com/v1/revgeocode',
		type: 'GET',
		data: {
			at: coordinate,
			lang: 'en-US',
			apikey: $('#api_key').val()
		},
		success: function (response) {
			if(response){
				if(response.items.length > 0){
					address = response.items[0].address.label;
					$('.leaflet-popup-content').html('<strong>'+address+'<br>DateTime : '+datetime+' GMT<strong>'+temperature);
				}
				else{
					$('.leaflet-popup-content').html('<strong>'+address+'<br>DateTime : '+datetime+' GMT<strong>'+temperature);
				}
			}
			else{
				$('.leaflet-popup-content').html('<strong>'+address+'<br>DateTime : '+datetime+' GMT<strong>');
			}
		},
		error: function(data) {
			$('html, body').animate({ scrollTop: 0 }, 400);
         	$('form').find('#response').empty().prepend(alert_error).fadeIn();
		}
	});
});

$(document).on('click', '#history_btn', function(){
    $('#history_btn i').toggleClass('fa-minus-circle fa-plus-circle');
});

function getHistoryLocation(){
	var address = 'Location not found';
	var coordinate_address = {};
	$(".location-info").each(function(){
        id = $(this).attr('id');
        coordinate = $(this).data('latlong');

        if(coordinate in coordinate_address){
        	$('#'+id).removeClass('fa fa-spinner fa-spin');
			$('#'+id).text(coordinate_address[coordinate]);
        }
        else{
	        $.ajax({
				url: 'https://revgeocode.search.hereapi.com/v1/revgeocode',
				type: 'GET',
				async: false,
				data: {
					at: coordinate,
					lang: 'en-US',
					apikey: $('#api_key').val()
				},
				success: function (response) {
					if(response){
						if(response.items.length > 0){
							address = response.items[0].address.label;
							$('#'+id).removeClass('fa fa-spinner fa-spin');
							$('#'+id).text(address);
							coordinate_address[coordinate] = address;
						}
						else{
							$('#'+id).removeClass('fa fa-spinner fa-spin');
							$('#'+id).text(address);
							coordinate_address[coordinate] = address;
						}
					}
					else{
						$('#'+id).removeClass('fa fa-spinner fa-spin');
						$('#'+id).text(address);
						coordinate_address[coordinate] = address;
					}
				},
				error: function(data) {
					$('html, body').animate({ scrollTop: 0 }, 400);
		         	$('form').find('#response').empty().prepend(alert_error).fadeIn();
				}
			});

		}
    });
}	

function getGPSHistory(form){ 
	
	var h = $('.overlay-complete-loader').height();
	if(h == 0) { h = 100; }
	$('.btl_overlay').height(h);  
	$('.btl_relative').show();
	var button = $('.btn_more');
	
	$.ajax({ 
        type: 'POST',
       	url: appHome+'/gps-settings/common-ajax',
        data: $(form).serialize(),
        success: function(response){
        	button.find('span').removeClass("fa fa-spinner fa-spin");
        	$('.btl_relative').hide();
        	$('.view-list').remove();
        	$('#history_table tbody tr:first').before(response);
        	$('#next_row_key').val($('#table_row_key').val());
        	$('#next_partition_key').val($('#table_partition_key').val());
        	$('#result_count').val($('#table_result_count').val());
        	var location_data = $('#location_data').val();
			location_data = JSON.parse(location_data);
			drawPolyline(location_data, $('#table_result_count').val());
        },
        error: function(response){
          	$('html, body').animate({ scrollTop: 0 }, 400);
          	$('form').find('#response').empty().prepend(alert_error).fadeIn();
       	  	button.removeAttr('disabled');
        }
    });
}

$(document).on('click', '.btn_more', function(){ 
	var form = '#gps_form';
	var button = $('.btn_more');
	button.find('span').addClass("fa fa-spinner fa-spin");
 	button.attr('disabled','disabled');
	getGPSHistory(form);
});

function drawPolyline(location_data, result_count){
	var markerArray = [];
	var polyline = [];
	var period = [];
	var period_date = '';
	var valve_temp = [];
	var liquid_temp = [];
	var ambient_temp = [];
	var end_valve_temp = '';
	var end_liquid_temp = '';
	var end_ambient_temp = '';
	var status = 0;

	if(result_count < 500){
		polyline.push(L.latLng(gps_latitude, gps_longitude));
	}
	$.each(location_data, function( key, value ) {
		//marker
		if(value.status == 1){
		 	if(period.length){
		 		period_date = period[0];
		 		css_class = 'map-rose';
		 		inner_class = 'inner-yellow';
		 		end_valve_temp = valve_temp[0];
		 		end_liquid_temp = liquid_temp[0];
		 		end_ambient_temp = ambient_temp[0];
		 	}
		 	else{
		 		css_class = 'map-blue';
		 		period_date = '';
		 		inner_class = 'inner-green';
		 	}
		 	var html_string= '<div class=""><div class="device_history map-icon-holder '+css_class+'" data-latitude="'+value.latitude+'"'
		 	 	+' data-longitude="'+value.longitude+'" data-datetime="'+value.datetime+'" data-period="'+period_date+'" data-valve-temp="'+
		 	 	value.valve_temp+'" data-liquid-temp="'+value.liquid_temp+'" data-ambient-temp="'+value.ambient_temp+
		 	 	'" data-end-valve-temp="'+end_valve_temp+'" data-end-liquid-temp="'+end_liquid_temp+'" data-end-ambient-temp="'+end_ambient_temp+
		 	 	'" ><span class="'+inner_class+'"></span></div></div>';
 			var markerIcon = L.divIcon({html: html_string });
			coordinate = [value.latitude, value.longitude];
			var marker = L.marker(coordinate, {icon: markerIcon}).addTo(mymap).bindPopup('');
					//.openPopup();

			markerArray.push(marker);
			polyline.push(L.latLng(value.latitude, value.longitude));
			if(status == 0){
				last_latitude_temp = value.latitude;
				last_longitude_temp = value.longitude;
				status = 1;
			}	
			period = [];
		}
		else{
			period.push(value.period);
			valve_temp.push(value.valve_temp);
			liquid_temp.push(value.liquid_temp);
			ambient_temp.push(value.ambient_temp);

		}
	});
	polyline.push(L.latLng(last_latitude, last_longitude));
	last_latitude = last_latitude_temp;
	last_longitude = last_longitude_temp;
	var group = new L.featureGroup(markerArray);
	mymap.fitBounds(group.getBounds(),{padding: [20,20]});
  
	polylineLayer = L.polyline(polyline, {
        color: 'rgba(0, 100, 0, 0.7)',
        weight: 2
	});

	//Remove previously drawn route 
	if(polylineLayer != ""){
	    //polylineLayer.removeFrom(mymap);
	    polylineLayer.remove();
	}

	polylineLayer.addTo(mymap);
	mymap.fitBounds(polylineLayer.getBounds());
}