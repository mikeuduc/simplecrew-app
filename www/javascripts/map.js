function GoogleMap(options){
	this.mapId = options.mapId;
	this.editTargets = options.editTargets;
	this.singleClick = false;
	this.companyId = options.companyId;
	this.campaignId = options.campaignId;
	
	this.placeMarker = function(coord) {
		console.log('first loc');
		console.log(coord);
		var marker = new google.maps.Marker({
					position: coord,
					map: this.map,
					icon: this.targetPin
	   });
	   this.addTargetListener(marker); 
	   console.log("ADD TARGET VIA AJAX HERE");
	   $.ajax({
       type: 'POST',
       url: '/companies/' + this.companyId + '/campaigns/' + this.campaignId + '/targets/',
       success: function(data){ 
       },
       data: { lng: coord.lng(), lat: coord.lat() }
     });
     
	   //*** ADD TARGET HERE AJAX
	   //var target = { loc: {lng: location.Va, lat: location.Ua }};

	}
	
  this.logColor = "FE7569";
  this.logPin = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + this.logColor,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));

  this.targetColor = "009ACD";
  this.targetPin = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + this.targetColor,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));
  
  this.pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
      new google.maps.Size(40, 37),
      new google.maps.Point(0, 0),
      new google.maps.Point(12, 35));
	
	this.plot = function(logs, targets){
		if(logs.length == 1){
			this.loadMap(logs[0].coord[1], logs[0].coord[0]);
		}
		else{
			this.loadMap(40.758224, -73.917404); ///NYC
		}		
		
		if(logs.length)
			this.plotLogs(logs);
		if(targets.length)
			this.plotTargets(targets);
	};
	
	this.addTargetListener = function(marker){
		var self = this;
		google.maps.event.addListener(marker, 'click', function() {
			console.log( marker.position);
	    var coord = marker.position;
	    //*** REMOVE TARGET HERE
		  $.ajax({
	       type: 'POST',
	       url: '/companies/' + self.companyId + '/campaigns/' + self.campaignId + '/targets/',
	       success: function(data){ 
	       },
	       data: { lng: coord.lng(), lat: coord.lat(), remove: true }
	    });
	    marker.setMap(null);
		}); 
	};
	
	this.plotLogs = function(logs){
		console.log('plotting logs');
		var self = this;
		$.each(logs, function(i) {
			console.log(this);
			var content = '<img class="map-thumb" src="' + this.images.thumb160 + '"><br>by ' + this._creator.name.first + ' ' + this._creator.name.last + ' at ' + this.created; 
			self.plotPoint(content, this.coord[1], this.coord[0], i, self.logPin);
		});	
	};
	
	this.plotTargets = function(targets){
		console.log('plotting targets');
		var self = this;
		$.each(targets, function(i) { 
			var content = '<a>delete</a>';
			self.plotTarget(content, this.coord[1], this.coord[0], i, self.targetPin);
		});	
	};
	
	this.loadMap = function(latCent,longCent){
		console.log('loading map');
		console.log(this.mapId);
		this.map = new google.maps.Map(document.getElementById(this.mapId), {
	     	zoom: 14,
	     	center: new google.maps.LatLng(latCent,longCent),
	    	mapTypeId: google.maps.MapTypeId.ROADMAP
	  	});
		var self = this;
		if(this.editTargets){
			
			google.maps.event.addListener(this.map, 'click', function(event) {
				self.singleClick = true;
				setTimeout(function() {
					if(self.singleClick){
						console.log('SINGLE CLICK')
						console.log(event.latLng);
						self.placeMarker(event.latLng);
					}
				}, 500);
			});
			
			google.maps.event.addListener(this.map, 'dblclick', function(event) {// duh! :-( google map zoom on double click!
				console.log('double click');
				self.singleClick = false;
			});	
		}
		console.log('map loaded');
		this.infowindow = new google.maps.InfoWindow();
		this.bounds = new google.maps.LatLngBounds();
		this.mapNotLoaded = false;
	};
	
	//combine PLOT POINT AND PLOT TARGET
	this.plotPoint = function(content, latitude, longitude, i, icon){
		var latlangpoint2 = new google.maps.LatLng(latitude, longitude);	
		marker = this.makeMarker(latlangpoint2, name, content, icon);
		this.addListener(marker, content, i);
		this.bounds.extend(latlangpoint2);
		this.map.fitBounds(this.bounds);
		//}
	};
	
	this.plotTarget = function(content, latitude, longitude, i, icon){
		var latlangpoint2 = new google.maps.LatLng(latitude, longitude);	
		marker = this.makeMarker(latlangpoint2, name, content, icon);
		this.addTargetListener(marker);
		this.bounds.extend(latlangpoint2);
		this.map.fitBounds(this.bounds);
	};
	
	this.makeMarker = function (loc, name, content, icon){
		marker = new google.maps.Marker({
				position: loc,
				title: name,
				content: content,
				map: this.map,
				icon: icon
			});
		return marker;
	};
	
	this.addListener = function (marker, content, i){
		var self = this;
		google.maps.event.addListener(marker, 'mouseover', ( function(marker, i) {
				return function() {
					self.infowindow.setContent(content);
					self.infowindow.open(this.map, marker);
				}
			})(marker, i));	
	};
}