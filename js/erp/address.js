var markers = [];
var polygonMarkers = [];
var isLargeCircle = false;
var ExistSuccess = 'Ok';
var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
$(document)
		.ready(
				function() {
					$('#pac-input').keypress(function(e) {
						if (e.keyCode === 13) {
							e.preventDefault();
						}
					});

				});


$(document)
		.on(
				'click',
				'.delete-address',
				function(e) {
					e.preventDefault();

					var delete_url = $(this).data('href'), address_to_delete = $(
							this).data('address-id'), address_code_selected = $(
							this).data('address-code'), $this = $(this), return_url = window.location.href;

					if ($('#returnpath').val()) {
						return_url = $('#returnpath').val();
					}

					BootstrapDialog
							.confirm(
									'Are you sure you want to delete this Address ?',
									function(result) {
										if (result) {
											$
													.ajax({
														type : 'POST',
														url : delete_url,
														data : {
															'address_id' : address_to_delete,
															'address_code' : address_code_selected
														},
														success : function(
																response) {
															location.reload();
															window.location.href = return_url;
															localStorage
																	.setItem(
																			'response',
																			response);
														},
														error : function(
																response) {
															BootstrapDialog
																	.show({
																		title : 'Address',
																		message : 'Unable to delete this Address. Please try later.',
																		buttons : [ {
																			label : 'Close',
																			action : function(
																					dialogRef) {
																				dialogRef
																						.close();
																			}
																		} ],
																		cssClass : 'small-dialog',
																	});
														}
													});
										}
									});
				});

$(document).on('click', '#show-map', function(e) {

	var $count = $('#ajax-count').val();
	$('#show-map i').toggleClass('fa-plus-circle fa-minus-circle');
	var className = $('#show-map i').attr('class');

	if (className == 'fa fa-minus-circle') {
		$("#span-id").text("Hide Map");
		if ($count == 0) {
			loadMap();
			$('#ajax-count').val(1);
		}
	} else {
		$("#span-id").text("Show Map");
	}

});

$(document)
		.on(
				'click',
				'.edit-address,.create-address',
				function(e) {

					e.preventDefault();
					var form = '#' + $(this).closest('form').attr('id'), success = [], addressCodeForEdit = $(
							'input[name="hidden_address_id"]').val();

					function highlight(field, empty_value) {
						if (field.length > 0) {
							if (field.val().trim() === empty_value) {
								$(field).parent().addClass('highlight');
								success.push(false);
							} else {
								$(field).parent().removeClass('highlight');
								success.push(true);
							}
						}
					}

					function isAddressCodeAlresdyExist(address, button) {
						ExistSuccess = [];
						if (button.hasClass('edit-address')) {
							var type = "update";
						}
						if (button.hasClass('create-address')) {
							var type = "create";
						}

						var address_code_typed = $('#address-code').val();

						if (type == "create") {
							$.ajax({
								type : 'POST',
								url : appHome + '/address/common_ajax',
								async : false,
								data : {
									'addressCode' : address_code_typed
								},
								success : function(response) {
									if (response > 0) {
										ExistSuccess = 'Exist'
										$(address).parent().addClass(
												'highlight');
									} else {
										ExistSuccess = 'Ok'
										$(address).parent().removeClass(
												'highlight');
									}
								},
								error : function(response) {
									$('html, body').animate({
										scrollTop : 0
									}, 400);
									$('form').find('#response').empty()
											.prepend(alert_error).fadeIn();
								}
							});
						}
					}

					highlight($(form).find('#address-code'), '');
					if ($('#address-code').val() != '') {
						isAddressCodeAlresdyExist(
								$(form).find('#address-code'), $(this)); // function
						// for
						// chech
						// address
						// code
						// exist
						// or
						// not
					}

					highlight($(form).find('#company-name'), '');
					highlight($(form).find('#address1'), '');
					highlight($(form).find('#town'), '');
					highlight($(form).find('#postcode'), '');
					highlight($(form).find('#country'), '');					
					highlight($(form).find('#latitude'), '');
					highlight($(form).find('#longitude'), '');
					//highlight($(form).find('#radius'), '');
									
					if ($("#confirm-outer-region").is(":checked")
							&& $('#perimeter').val() == '') {
						// do something if the checkbox is NOT checked
						success.push(false);
						$('#perimeter').css('border', "1px solid red");
					} else {
						success.push(true);
						$('#perimeter').css('border', "1px solid grey");
					}

					if (ExistSuccess == 'Exist') {
						success.push(false);
						alert_required = '<div class="alert alert-danger alert-dismissable">'
								+ '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
								+ '<i class="fa fa-exclamation-triangle"></i>'
								+ '<strong>Uh oh!</strong> The address code already exists.</div>';

					} else {
						success.push(true);
						alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have marked location on map and also entered all of the required informations.</div>';
					}

					var check_fields = (success.indexOf(false) > -1);
					if ($(this).hasClass('create-address')) {

						if (check_fields === true) {
							$('html, body').animate({
								scrollTop : 0
							}, 400);
							$('form').find('#response').empty().prepend(alert_required).fadeIn();
						} else {
							$(this).prop('disabled', 'disabled');
							$.ajax({
								type : 'POST',
								url : appHome + '/address/add',
								data : $(form).serialize().replace(/%5B%5D/g,'[]'),
								success : function(response) {
									window.location.href = $('#returnpath').val();
									localStorage.setItem('response', response);
								},
								error : function(response) {
									$('html, body').animate({scrollTop : 0}, 400);
									$('form').find('#response').empty().prepend(alert_error).fadeIn();
								}
							});
						}
					}

					if ($(this).hasClass('edit-address')) {
						if (check_fields === true) {
							$('html, body').animate({scrollTop : 0}, 400);
							$('form').find('#response').empty().prepend(alert_required).fadeIn();
						} else {
							$(this).prop('disabled', 'disabled');
							$.ajax({
								type : 'POST',
								url : appHome + '/address/'
										+ addressCodeForEdit + '/update',
								data : $(form).serialize().replace(/%5B%5D/g,
										'[]'),
								success : function(response) {
									window.location.href = $('#returnpath').val();
									localStorage.setItem('response', response);
								},
								error : function(response) {
									$('html, body').animate({scrollTop : 0}, 400);
									$('form').find('#response').empty().prepend(alert_error).fadeIn();
								}
							});
						}
					}

				});

/**
 * To load the map
 * @returns
 */
function loadMap() {

	var latitude = 54.461520;
	var longitude = -1.176600;
	if ($('#latitude').val() != '' && $('#longitude').val() != '') {
		showMapWhenPageLoad($('#latitude').val(), $('#longitude').val());
	}
	else{
		showMapWhenPageLoad(latitude, longitude);
	}
}

var drawingManager;
var selectedShape;
var outerCirclesDrawn = [];
var circlesNew = [];
var polygonsNew = [];
var outerCirclesForPolygon = [];

/**
 * To clear the already selected items
 * @returns
 */
function clearSelection() {
	if (selectedShape) {
		$('#delete-button').css("display", "none");
		if (selectedShape.type !== 'marker') {
			selectedShape.setEditable(false);
		}
		selectedShape = null;
	}
}

/**
 * To assign the shape
 * @param shape
 * @returns
 */
function setSelection(shape) {
	if (shape.type !== 'marker') {
		clearSelection();
		shape.setEditable(true);
		$('#delete-button').css("display", "block");
	}

	selectedShape = shape;
	
	if (shape.type === 'circle') {
		circlesNew.push(shape);
	} else if (shape.type === 'polygon') {
		polygonsNew.push(shape);
	}

	
}

/**
 * To delete the selected shape
 * @returns
 */
function deleteSelectedShape() {
	if (selectedShape == undefined || selectedShape == null) {
		//skip 
	} else {
		if (selectedShape.type == 'circle') {
			// if(isLargeCircle){
			// 	$('#hidden-polygon_cords').val("");
			// }
			for (var i = 0; i < outerCirclesDrawn.length; i++) {
				outerCirclesDrawn[i].setMap(null);
			}
			if(outerCirclesForPolygon.length){
				for(var i=0; i<outerCirclesForPolygon.length;i++){
					outerCirclesForPolygon[i].setMap(null);
				}
				outerCirclesForPolygon = [];
				$('#hidden-polygon_cords').val("");
			}
			outerCirclesForPolygon = [];
			outerCirclesDrawn = [];
			$('#latitude').val("");
			$('#longitude').val("");
			$('#radius').val("");
			clearMarkersIfAny('circle');
			clearMarkersIfAny('polygon');
		} else if (selectedShape.type == 'polygon') {
			$('#hidden-polygon_cords').val("");
			$('#hidden_poly_bounds_lat').val("");
			$('#hidden_poly_bounds_lng').val("");
			
			for(var i=0; i<outerCirclesForPolygon.length;i++){
				outerCirclesForPolygon[i].setMap(null);
			}
			if(outerCirclesDrawn.length){
				for (var i = 0; i < outerCirclesDrawn.length; i++) {
					outerCirclesDrawn[i].setMap(null);
				}
				outerCirclesDrawn = [];
			}
			outerCirclesForPolygon = [];
			clearMarkersIfAny('circle');
			clearMarkersIfAny('polygon');
		}
		
		if (selectedShape) {
			selectedShape.setMap(null);
			$('#delete-button').css("display", "none");
		}
	}
}

/**
 * To load the map
 * @param latToShow
 * @param longToShow
 * @returns
 */
function showMapWhenPageLoad(latToShow, longToShow) {
	var mapLatlng = new google.maps.LatLng(latToShow, longToShow);
	var myOptions = {
		zoom : 7,
		// maxZoom : 18,
		minZoom : 3,
		center : mapLatlng,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		labels : true

	};
	var map = new google.maps.Map(document.getElementById("map"), myOptions);
	
	var marker = new google.maps.Marker({
	    position: mapLatlng,
	    map: map
	});

	var polyOptions = {
		strokeWeight : 0,
		fillOpacity : 0.45,
		editable : true,
		draggable : true,
		strokeColor: '#32CD32',
		fillColor: '#00FF00',
		zIndex : 100
	};
	
	var circleOptions = {
			strokeWeight : 0,
			fillOpacity : 0.45,
			editable : true,
			draggable : true,
			strokeColor: '#F75F5F',
			fillColor: '#F75F5F',
			zIndex : 100
		};
	
	// Creates a drawing manager attached to the map that allows the user to
	// draw
	// markers, lines, and shapes.
	drawingManager = new google.maps.drawing.DrawingManager({
		//drawingMode : google.maps.drawing.OverlayType.CIRCLE,
		drawingControlOptions : {
			position : google.maps.ControlPosition.TOP_CENTER,
			// drawingModes :  ['circle','polygon' ]
			drawingModes :  []
		},
		circleOptions : circleOptions,
		polygonOptions : polyOptions,
		map : map
	});
	// setOutOfBoundsListener(map);
	// setAutoCompletion(map, drawingManager);
	// setDrawingOptions(map, drawingManager);
}

/**
 * To remove the existing markers if any
 * @param typeToClear
 * @returns
 */
function clearMarkersIfAny(typeToClear) {
	if(typeToClear === "circle"){
		if (markers !== undefined) {
			for (var i = 0; i < markers.length; i++) {
				markers[i].setMap(null);
			}
		}
	} else if(typeToClear === "polygon"){
		if (polygonMarkers !== undefined) {
			for (var i = 0; i < polygonMarkers.length; i++) {
				polygonMarkers[i].setMap(null);
			}
		}
	}
}

/**
 * To place the marker
 * @param map
 * @param position
 * @param type
 * @returns
 */
function setMarker(map, position, type) {
	
	marker = new google.maps.Marker({
		position : position,
		map : map,
	});
	
	if(type === "circle"){
		clearMarkersIfAny("circle");
		markers.push(marker);
	} else {
		clearMarkersIfAny("polygon");
		polygonMarkers.push(marker);
	}
}

/**
 * searching posions using autocomplete places
 * @param map
 * @param drawingManager
 * @returns
 */
function setAutoCompletion(map, drawingManager) {
	var card = document.getElementById('pac-card');
	var input = document.getElementById('pac-input');

	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

	var autocomplete = new google.maps.places.Autocomplete($("#pac-input")[0],
			{});

	var marker = new google.maps.Marker({
		map : map
	});

	google.maps.event
			.addListener(
					autocomplete,
					'place_changed',
					function() {
						document.getElementById("location-error").style.display = 'none';
						marker.setVisible(false);
						var place = autocomplete.getPlace();
						if (!place.geometry) {
							document.getElementById("location-error").style.display = 'inline-block';
							document.getElementById("location-error").innerHTML = "Cannot Locate '"
									+ input.value + "' on map";
							return;
						}
						// If the place has a geometry, then present it on a
						// map.
						if (place.geometry.viewport) {
							map.fitBounds(place.geometry.viewport);
						} else {
							map.setCenter(place.geometry.location);
						}
						for (var i = 0; i < circlesNew.length; i++) {
							circlesNew[i].setMap(null);
						}
						circlesNew = [];
						setMarker(map, place.geometry.location, "circle");
						map.setZoom(7);
						deleteSelectedShape();
						$('#latitude').val(place.geometry.location.lat());
						$('#longitude').val(place.geometry.location.lng());
						//$("#confirm-outer-region").prop("checked", true);

						if ($('#radius').val() === '') {
							$('#radius').val("200");
						}
						drawRegions(map);
					});
}


/**
 * To draw the regions on map if lat/lns exist
 * @param map
 * @returns
 */
function drawRegions(map) {

	if ($('#hidden-polygon_cords').val() != '') {
		try {
			var polygonPath = JSON.parse($('#hidden-polygon_cords').val().trim());
			var coordinates = [];
			for (var i = 0; i < polygonPath.length; i++) {
				if (polygonPath[i].hasOwnProperty("latitude")) {
					coordinates.push({
						lat : polygonPath[i].latitude,
						lng : polygonPath[i].longitude
					});
				} else {
					coordinates.push({
						lat : polygonPath[i].lat,
						lng : polygonPath[i].lng
					});
				}
				
			}
			
			var currentPlace = new google.maps.Polygon({
				path : coordinates,
				strokeOpacity : 0.5,
				strokeWeight : 4,
				strokeColor : "#32CD32",
				fillOpacity : 0.4,
				fillColor : '#00FF00'
			});
			currentPlace.setMap(map);
			polygonsNew.push(currentPlace)

			var bounds = new google.maps.LatLngBounds();
			var i;
			for (i = 0; i < coordinates.length; i++) {
				bounds.extend(coordinates[i]);
			}
			
			map.fitBounds(bounds);
			var listener = google.maps.event.addListener(map, "idle", function() { 
			  	if (map.getZoom() > 7) map.setZoom(7); 
		  		google.maps.event.removeListener(listener); 
			});
			
			var movemaplat = bounds.getCenter().lat();
			var movemaplng = bounds.getCenter().lng();
			setMarker(map, new google.maps.LatLng(movemaplat, movemaplng),"polygon");
			drawOuterCircleForPolygon(map,true);
		} catch (e) {
			console.log("ERROR");
		}
	}
	else{

		if ($('#latitude').val() != '' && $('#longitude').val() != '') {
			if ($('#latitude').val().trim() != 0 && $('#longitude').val().trim() != 0) {
				var currentPlaceCords = new google.maps.LatLng($('#latitude').val(), $(
						'#longitude').val());
				var radiusVal = ($('#radius').val() != '') ? $('#radius').val()
						: "200.00";
				var res = radiusVal.split(".", 1);
				var currentPlace = new google.maps.Circle({
					center : currentPlaceCords,
					radius : parseInt(res, 10),
					strokeOpacity : 0.5,
					strokeWeight : 4,
					strokeColor : "#F75F5F",
					fillOpacity : 0.4,
					fillColor : '#F75F5F',
					zIndex : 100,
					custom_id : 001
				});
				currentPlace.setMap(map);
				circlesNew.push(currentPlace);
				
				var boundsCircle = new google.maps.LatLngBounds();
				boundsCircle.extend(new google.maps.LatLng($('#latitude').val(), $(
				'#longitude').val()))
				map.fitBounds(boundsCircle);
				var listener = google.maps.event.addListener(map, "idle", function() { 
			  	if (map.getZoom() > 7) map.setZoom(7); 
			  		google.maps.event.removeListener(listener); 
				});
				setMarker(map, new google.maps.LatLng($('#latitude').val(), $(
						'#longitude').val()),"circle");
				drawOuterCircle(map, true);
		
			}
		}
	}
}

/**
 * To set the shape drawing options circle/polygon
 * @param map
 * @param drawingManager
 * @returns
 */
function setDrawingOptions(map, drawingManager) {
	google.maps.event
			.addListener(
					drawingManager,
					'circlecomplete',
					function(circle) {
						setSelectedCircleProperties(circle, map);
						google.maps.event
								.addListener(
										circle,
										'radius_changed',
										function() {
											var rad = $('#perimeter').val();
											var convertedVal = parseFloat(rad) * 1000;
											if (this.getRadius() < 200) {
												this.setRadius(200);
											} else if (this.getRadius() > convertedVal - 200) {
												this.setRadius(convertedVal - 500);
												// showAlertDialog(rad);
												showCommonValidationAlert("Unable to draw the outer circle, since the outer perimeter specified is less than the inner circle drawn");
											}

											setSelectedCircleProperties(circle,
													map);
										});
						google.maps.event.addListener(circle, 'center_changed',
								function() {
									setSelectedCircleProperties(circle, map);
								});

					});

	google.maps.event.addListener(drawingManager, 'polygoncomplete', function(
			polygon) {

		setSelectedPolygonProperties(polygon.getPath(),map);
		google.maps.event.addListener(polygon.getPath(), 'insert_at', function(
				index, obj) {

			setSelectedPolygonProperties(polygon.getPath(),map);
		});
		google.maps.event.addListener(polygon.getPath(), 'set_at', function(
				index, obj) {

			setSelectedPolygonProperties(polygon.getPath(),map);
		});

	});

	google.maps.event
			.addListener(
					drawingManager,
					'overlaycomplete',
					function(e) {
						
						var newShape = e.overlay;
						 
						newShape.type = e.type;
						if (e.type !== google.maps.drawing.OverlayType.MARKER) {
							// Switch back to non-drawing mode after drawing a
							// shape.

							if (e.type === google.maps.drawing.OverlayType.CIRCLE) {
								for (var i = 0; i < circlesNew.length; i++) {
									circlesNew[i].setMap(null);
								}
								if(polygonsNew.length){
									for (var i = 0; i < polygonsNew.length; i++) {
										polygonsNew[i].setMap(null);
									}
									polygonsNew = [];
								}
								circlesNew = [];
								clearMarkersIfAny("circle");
								clearMarkersIfAny("polygon");
								$("#hidden-polygon_cords").val("");
							} else if (e.type === google.maps.drawing.OverlayType.POLYGON) {
								for (var i = 0; i < polygonsNew.length; i++) {
									polygonsNew[i].setMap(null);
								}
								if(circlesNew.length){
									for (var i = 0; i < circlesNew.length; i++) {
										circlesNew[i].setMap(null);
									}
									circlesNew = [];
								}
								polygonsNew = [];
								clearMarkersIfAny("polygon");
								clearMarkersIfAny("circle");
								if($("#hidden-polygon_cords").val() != ""){
									$("#latitude").attr('readonly', true);
									$("#longitude").attr('readonly', true);
									$("#radius").attr('readonly', true);
								}
							}

							drawingManager.setDrawingMode(null);

							// Add an event listener that selects the
							// newly-drawn shape when the user
							// mouses down on it.
							google.maps.event
									.addListener(
											newShape,
											'click',
											function(e) {
												if (e.vertex !== undefined) {
													if (newShape.type === google.maps.drawing.OverlayType.POLYGON) {
														var path = newShape
																.getPaths()
																.getAt(e.path);
														path.removeAt(e.vertex);
														if (path.length < 3) {
															newShape
																	.setMap(null);
														}
													}
												}
												setSelection(newShape);
											});
							setSelection(newShape);
						} else {
							google.maps.event.addListener(newShape, 'click',
									function(e) {
										setSelection(newShape);
									});
							setSelection(newShape);
						}

					});

	// Clear the current selection when the drawing mode is changed, or when the
	// map is clicked.
	google.maps.event.addListener(drawingManager, 'drawingmode_changed',
			clearSelection);
	google.maps.event.addListener(map, 'click', clearSelection);
	google.maps.event.addDomListener(document.getElementById('delete-button'),
			'click', deleteSelectedShape);
	drawRegions(map)
}

/**
 * Setiing the lat/lng properties while drawing circle
 * @param circleInfo
 * @param map
 * @returns
 */
function setSelectedCircleProperties(circleInfo, map) {
	$('#latitude').val(circleInfo.getCenter().lat());
	$('#longitude').val(circleInfo.getCenter().lng());
	$('#radius').val(circleInfo.getRadius());
	setMarker(map, new google.maps.LatLng(circleInfo.getCenter().lat(),
			circleInfo.getCenter().lng()),"circle");
	drawOuterCircle(map, false);
}

/**
 * Setting the polygon cordinates while drawing polygon shape
 * @param polygonInfo
 * @param map
 * @returns
 */
function setSelectedPolygonProperties(polygonInfo,map) {
	var coordinates = [];

	for (var i = 0; i < polygonInfo.length; i++) {
		coordinates.push({
			latitude : polygonInfo.getAt(i).lat(),
			longitude : polygonInfo.getAt(i).lng()
		});
	}
	var polygonJsonString = JSON.stringify(coordinates);
	$('#hidden-polygon_cords').val(polygonJsonString);
	
	var polygonPath = JSON.parse(polygonJsonString);
	var coordinatesArray = [];
	for (var i = 0; i < polygonPath.length; i++) {
		coordinatesArray.push({
				lat : polygonPath[i].latitude,
				lng : polygonPath[i].longitude
			});
	}
	
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < coordinatesArray.length; i++) {
		bounds.extend(coordinatesArray[i]);
	}
	
	var movemaplat = bounds.getCenter().lat();
	var movemaplng = bounds.getCenter().lng();
	$("#latitude").val(movemaplat);
	$("#longitude").val(movemaplng);
	$('#hidden_poly_bounds_lat').val(movemaplat);
	$('#hidden_poly_bounds_lng').val(movemaplng);
	setMarker(map, new google.maps.LatLng(movemaplat,movemaplng),"polygon");
	
	drawOuterCircleForPolygon(map, false);
}

/**
 * To setting restrictions while dragging or zoomchanged the map, to avoid while area
 * @param map
 * @returns
 */
function setOutOfBoundsListener(map) {
	var lastValidCenter;
	var minZoomLevel = 3;
	google.maps.event.addListener(map, 'dragend', function() {
		checkLatitude(map, lastValidCenter, minZoomLevel);
	});
	google.maps.event.addListener(map, 'idle', function() {
		checkLatitude(map, lastValidCenter, minZoomLevel);
	});
	google.maps.event.addListener(map, 'zoom_changed', function() {
		checkLatitude(map, lastValidCenter, minZoomLevel);
	});

};

function checkLatitude(map, lastValidCenter, minZoomLevel) {
	try {
		if (minZoomLevel) {
			if (map.getZoom() < minZoomLevel) {
				map.setZoom(parseInt(minZoomLevel));
			}
		}
		var bounds = map.getBounds();
		var sLat = map.getBounds().getSouthWest().lat();
		var nLat = map.getBounds().getNorthEast().lat();
		if (sLat < -85 || nLat > 85) {
			// the map has gone beyone the world's max or min latitude - gray
			// areas
			// are visible
			// return to a valid position
			if (lastValidCenter) {
				map.setCenter(lastValidCenter);
			} else {
				map.setCenter({
					lat : 55.3781,
					lng : 3.4360
				})
			}
		} else {
			lastValidCenter = map.getCenter();
		}

	} catch (e) {
		console.log("ERROR");
	}
}

function NumberValues(fld, e) {
	var strCheckRadius = '0123456789.';
	var key = '';
	var whichCodeNum = (window.Event) ? e.which : e.keyCode;

	if (window.navigator.userAgent.indexOf("MSIE") > -1) {
		whichCodeNum = e.keyCode;
	}

	if (whichCodeNum == 5 || whichCodeNum == 8 || whichCodeNum == 13
			|| whichCodeNum == 0)
		return true; // Enter

	key = String.fromCharCode(whichCodeNum);

	if (strCheckRadius.indexOf(key) == -1)
		return false; // Not a valid key
}

function NumberOnly(fld, e) {
	var strCheckRadius = '0123456789';
	var key = '';
	var whichCodeNum = (window.Event) ? e.which : e.keyCode;

	if (window.navigator.userAgent.indexOf("MSIE") > -1) {
		whichCodeNum = e.keyCode;
	}

	if (whichCodeNum == 5 || whichCodeNum == 8 || whichCodeNum == 13
			|| whichCodeNum == 0)
		return true; // Enter

	key = String.fromCharCode(whichCodeNum);

	if (strCheckRadius.indexOf(key) == -1)
		return false; // Not a valid key
}

$(document)
		.on(
				'click',
				'.view-address',
				function(e) {

					$("#view-address-code").text(
							$(this).closest('tr').find('td :eq(0)').text());
					$("#view-company").text(
							$(this).closest('tr').find('td :eq(1)').text());
					$("#view-address1").text(
							$(this).closest('tr').find('td :eq(2)').text());
					$("#view-address2").text($(this).data('addressline2'));
					$("#view-town").text(
							$(this).closest('tr').find('td :eq(3)').text());
					$("#view-state").text(
							$(this).closest('tr').find('td :eq(4)').text());
					$("#view-pin").text(
							$(this).closest('tr').find('td :eq(5)').text());
					$("#view-country").text(
							$(this).closest('tr').find('td :eq(6)').text());
					$("#view-load").text(
							$(this).closest('tr').find('td :eq(7)').text());
					$("#view-ship").text(
							$(this).closest('tr').find('td :eq(8)').text());
					$("#view-rail").text(
							$(this).closest('tr').find('td :eq(9)').text());
					$("#view-tip").text(
							$(this).closest('tr').find('td :eq(10)').text());
					$("#view-depot").text(
							$(this).closest('tr').find('td :eq(11)').text());
					$("#view-longitude").text($(this).data('longitude'));
					$("#view-latitude").text($(this).data('latitude'));
				});

/**
 * To set and unset outer perimeter
 * @returns
 */
function setOuterRegion() {
	// Get the checkbox
	var checkBox = document.getElementById("confirm-outer-region");
	var showRegion = document.getElementById("set-outer-region");
	
	// If the checkbox is checked, display the output text
	if (checkBox.checked == true) {
		showRegion.style.display = "block";
	} else {
		showRegion.style.display = "none";
	}

		markers = [];
		polygonMarkers = [];
		drawingManager = null;
		selectedShape = null;
		outerCirclesDrawn = [];
		circlesNew = [];
		polygonsNew = [];
		outerCirclesForPolygon = [];
		loadMap();

}

/*
 * To draw the outer perimeter for circle
 */
function drawOuterCircle(map, isInEDitMode) {
	for (var i = 0; i < outerCirclesDrawn.length; i++) {
		outerCirclesDrawn[i].setMap(null);
	}
	outerCirclesDrawn = [];
	if(outerCirclesForPolygon.length){
		for (var i = 0; i < outerCirclesForPolygon.length; i++) {
			outerCirclesForPolygon[i].setMap(null);
		}
	}
	outerCirclesForPolygon = [];
	var checkBox = document.getElementById("confirm-outer-region");
	if ($('#latitude').val() != '' && $('#longitude').val() != ''
			&& checkBox.checked == true) {

		var innerCircleRadius = $('#radius').val();
		var convertedInnerRadius = parseFloat(innerCircleRadius);

		var currentPlaceCords = new google.maps.LatLng($('#latitude').val(), $(
				'#longitude').val());
		var outerCircleradius = ($('#perimeter').val() != '') ? $('#perimeter')
				.val() : "50";
		var convertedOuterRadiusInMeters = parseFloat(outerCircleradius) * 1000;
		if (convertedInnerRadius > convertedOuterRadiusInMeters) {
			isLargeCircle = true;
			showCommonValidationAlert("Inner circle radius is greater than the outer circle radius. Please increase the outer circle radius.");
			deleteSelectedShape();
		} else {
			var outerPlace = new google.maps.Circle({
				center : currentPlaceCords,
				radius : convertedOuterRadiusInMeters,
				strokeOpacity : 0.5,
				strokeWeight : 4,
				strokeColor : "#FFD700",
				fillOpacity : 0.4,
				fillColor : '#FFFF00',
				zIndex : 10
			});
			outerPlace.setMap(map);
			if (isInEDitMode) {
				circlesNew.push(outerPlace);
			} else {
				outerCirclesDrawn.push(outerPlace);
			}
			
			var boundsOuterCircle = new google.maps.LatLngBounds();
			boundsOuterCircle.extend(new google.maps.LatLng($('#latitude').val(), $(
			'#longitude').val()))
			map.fitBounds(boundsOuterCircle);
			var listener = google.maps.event.addListener(map, "idle", function() { 
		  	if (map.getZoom() > 7) map.setZoom(7); 
		  		google.maps.event.removeListener(listener); 
			});

			/*map.setCenter(new google.maps.LatLng($('#latitude').val(), $(
					'#longitude').val()));
			map.setZoom(10);*/
		}

	}
}


function showAlertDialog(radiusVal) {
	BootstrapDialog.show({
		title : 'Warning',
		message : 'Radius must be below ' + radiusVal
				+ ' KMs. Please try again.',
		buttons : [ {
			label : 'Close',
			action : function(dialogRef) {
				deleteSelectedShape();
				dialogRef.close();
			}
		} ],
		cssClass : 'small-dialog',
	});
}

function showCommonValidationAlert(msg) {
	BootstrapDialog.show({
		title : 'Warning',
		message : msg,
		buttons : [ {
			label : 'Close',
			action : function(dialogRef) {
				dialogRef.close();
			}
		} ],
		cssClass : 'small-dialog',
	});
}

/*$(document).on('click', '#locate_address', function(e) {
	e.preventDefault();
	var addressToGeocode = "";
	if ($('#company-name').val() != '') {
		addressToGeocode = $('#company-name').val();
	}

	if ($('#address1').val() != '') {
		if (addressToGeocode === '') {
			addressToGeocode = $('#address1').val();
		} else {
			addressToGeocode = addressToGeocode + ",";
			addressToGeocode = addressToGeocode + $('#address1').val();
		}
	}

	if ($('#town').val() != '') {
		if (addressToGeocode === '') {
			addressToGeocode = $('#town').val();
		} else {
			addressToGeocode = addressToGeocode + ",";
			addressToGeocode = addressToGeocode + $('#town').val();
		}
	}

	if ($('#country').val() != '') {
		if (addressToGeocode === '') {
			addressToGeocode = $('#country').val();
		} else {
			addressToGeocode = addressToGeocode + ",";
			addressToGeocode = addressToGeocode + $('#country').val();
		}

	}

	if (addressToGeocode === '') {
		showCommonValidationAlert('Address fields empty! Please enter')
	} else {
		$('html, body').animate({
			scrollTop : $("#map-div").offset().top
		}, 1000);
		$('#pac-input').val("");
		locateAddressCordinates(addressToGeocode);
	}

});*/

/**
 * To get the coordinates from entered address
 * 
 * @param addressVal
 * @returns
 */
function locateAddressCordinates(addressVal) {
	var latitude = "0";
	var longitude = "0";
	var geocoder = new google.maps.Geocoder();
	addressVal = 'Digital Mesh Softech India (P) Limited Unit 1: 43-A, E Block, 2nd Floor, Cochin Special Economic Zone, Kakkanad, Kochi – 682 037, Kerala, India .';
	geocoder
			.geocode(
					{
						'address' : addressVal
					},
					function(results, status) {
						if (status === 'OK') {
							latitude = results[0].geometry.location.lat();
							longitude = results[0].geometry.location.lng();
							$('#latitude').val(latitude);
							$('#longitude').val(longitude);
							//$("#confirm-outer-region").prop("checked", true);

							if ($('#radius').val().trim() === '') {
								$('#radius').val("200");
							}
							showMapWhenPageLoad(latitude, longitude);
						} else {
							showCommonValidationAlert('Unable to locate the address using entered fields. Please try the search option otherwise locate it manually');
						}
					});

}

/*
 *To draw the outer perimeter for polygon
 */
function drawOuterCircleForPolygon(map, isInEDitMode){
	
	for (var i = 0; i < outerCirclesForPolygon.length; i++) {
		outerCirclesForPolygon[i].setMap(null);
	}
	outerCirclesForPolygon = [];
	if(outerCirclesDrawn.length){
		for (var i = 0; i < outerCirclesDrawn.length; i++) {
			outerCirclesDrawn[i].setMap(null);
		}
	}
	outerCirclesDrawn = [];
	var checkBox = document.getElementById("confirm-outer-region");
	
	if ($('#hidden-polygon_cords').val() != '' && checkBox.checked == true) {
		
		var polygonPath = JSON.parse($('#hidden-polygon_cords').val().trim());
		var coordinates = [];
		for (var i = 0; i < polygonPath.length; i++) {
			if (polygonPath[i].hasOwnProperty("latitude")) {
				coordinates.push({
					lat : polygonPath[i].latitude,
					lng : polygonPath[i].longitude
				});
			} else {
				coordinates.push({
					lat : polygonPath[i].lat,
					lng : polygonPath[i].lng
				});
			}	
		}
		
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0; i < coordinates.length; i++) {
			bounds.extend(coordinates[i]);
		}
		
		var movemaplat = bounds.getCenter().lat();
		var movemaplng = bounds.getCenter().lng();
		
		var currentPlaceCords = new google.maps.LatLng(movemaplat, movemaplng);
		var outerCircleradius = ($('#perimeter').val() != '') ? $('#perimeter')
				.val() : "50";
		var convertedOuterRadiusInMeters = parseFloat(outerCircleradius) * 1000;
		
			var outerPlace = new google.maps.Circle({
				center : currentPlaceCords,
				radius : convertedOuterRadiusInMeters,
				strokeOpacity : 0.5,
				strokeWeight : 4,
				strokeColor : "#FFD700",
				fillOpacity : 0.4,
				fillColor : '#FFFF00',
				zIndex : 10
			});
			
			outerPlace.setMap(map);
			
			outerCirclesForPolygon.push(outerPlace);
			
			var boundsOuterCircle = new google.maps.LatLngBounds();
			boundsOuterCircle.extend(new google.maps.LatLng(movemaplat, movemaplng));
			map.fitBounds(boundsOuterCircle);
			var listener = google.maps.event.addListener(map, "idle", function() { 
		  	if (map.getZoom() > 7) map.setZoom(7); 
		  		google.maps.event.removeListener(listener); 
			});

	}
}

/*
* Draw circle
*/
function drawCircle(region){
	if ($('#latitude').val() != '' && $('#longitude').val() != '') {

		var mapLatlng = new google.maps.LatLng($('#latitude').val(), $('#longitude').val());
		var myOptions = {
			zoom : 7,
			// maxZoom : 18,
			minZoom : 3,
			center : mapLatlng,
			mapTypeId : google.maps.MapTypeId.HYBRID,
			labels : true

		};
		var map = new google.maps.Map(document.getElementById("map"), myOptions);
		if ($('#latitude').val().trim() != 0 && $('#longitude').val().trim() != 0) {
			var currentPlaceCords = new google.maps.LatLng($('#latitude').val(), $(
					'#longitude').val());
			var radiusVal = ($('#radius').val() != '') ? $('#radius').val()
			 			: "200.00";
			// if(region == 0){
			// 	var radiusVal = ($('#radius').val() != '') ? $('#radius').val()
			// 			: "200.00";
			// }
			// else{
			// 	var radiusVal = ($('#perimeter').val() != '') ? $('#perimeter').val()
			// 			: "50.00";
			// }
			var res = radiusVal.split(".", 1);
			var currentPlace = new google.maps.Circle({
				center : currentPlaceCords,
				radius : parseInt(res, 10),
				strokeOpacity : 0.5,
				strokeWeight : 4,
				strokeColor : "#F75F5F",
				fillOpacity : 0.4,
				fillColor : '#F75F5F',
				zIndex : 100,
				custom_id : 001
			});
			currentPlace.setMap(map);
			circlesNew.push(currentPlace);
			
			var boundsCircle = new google.maps.LatLngBounds();
			boundsCircle.extend(new google.maps.LatLng($('#latitude').val(), $(
			'#longitude').val()))
			map.fitBounds(boundsCircle);
			var listener = google.maps.event.addListener(map, "idle", function() { 
			  	if (map.getZoom() > 7) map.setZoom(7); 
		  		google.maps.event.removeListener(listener); 
			});
			setMarker(map, new google.maps.LatLng($('#latitude').val(), $(
					'#longitude').val()),"circle");
			drawOuterCircle(map, true);
	
		}
	}
}

/*
* On change radius
*/
$(document).on('blur', '#latitude,#longitude', function(){
	loadMap();
});

//Autocomplete
$("#unlocode_disp").autocomplete({
	  source: function(request, response) {
		 	$.ajax({
		            url: appHome+'/unlocodes/codelist',
		            dataType: "json",
		            data: {
		                term : request.term,
		                country : $("#country").val()
		            },
		            success: function(data) {
		                response(data);
		            }
		        });
		  },

      minLength: 1,
      type: "GET",
      success: function (event, ui) {},
	  select: function (event, ui) {
    	event.preventDefault();
		$(this).val(ui.item.label);
		$('#unlocode').val(ui.item.value);
		return false;
	  },
	  focus: function(event, ui) {
	        event.preventDefault();
	        $(this).val(ui.item.label);
	  },
	  change: function (event, ui) {
         if (ui.item === null) {
            $(this).val('');
			$('#unlocode').val('');
         }
	  }
  });

