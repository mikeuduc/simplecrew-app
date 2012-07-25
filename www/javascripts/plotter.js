
function GoogleMap(options){
	this.mapId = options.mapId;
	
	this.placeMarker = function(location) {
	   var clickedLocation = new google.maps.LatLng(location);
	   var marker = new google.maps.Marker({
	       position: location,
	       map: this.map,
	       icon: this.targetPin
	   });
	   this.addTargetListener(marker); 
	   
	   var target = { loc: {lng: location.Va, lat: location.Ua }};
	   //this.vent.trigger('addTarget', target);
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
	
	this.initializePlot = function(logs, targets){

	//	if(mapNotLoaded){
			//alert('initializing map');
		
			if(logs.length == 1){
				this.loadMap(logs[0].coord[1], logs[0].coord[0]);
			}
			else{
				this.loadMap(0, 0);
			}		
			
			//$('#map').show();			
		//}
			//this.loadMap(0, 0);
			this.plotLogs(logs);
			this.plotTargets(targets);
	};
	
	this.addTargetListener = function(marker){
		console.log('adding Target Listener');
		var self = this;
		google.maps.event.addListener(marker, 'click', function() {
			console.log( marker.position);
	    var location = marker.position;
	    var target = { loc: {lng: location.Va, lat: location.Ua }};
	    //self.vent.trigger('removeTarget', target);
	    //marker.setMap(null);
		}); 
	};
	
	this.plotLogs = function(logs){
		console.log('plotting logs');
		var self = this;
		$.each(logs, function(i) {
			console.log(this);
			var content = '<img class="map-thumb" src="' + this.images.thumb84 + '"><br>' + this._creator.name.first + ' ' + this._creator.name.last + '<br>' + new Date(this.created).toUTCString(); 
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
	this.plotPoints = function(logs){
		console.log('plotting points');
		var self = this;
		$.each(logs, function(i) {
			var content = '<img src="' + this.images.thumb84 + '"><br>' + user.name.first + ' ' + user.name.last + '<br>' + datetime; 
			self.plotPoint(this._creator, this.imageUrl, this.coord[1], this.coord[0], new Date(this.created).toUTCString() , i);
		});	
	};
	
	this.loadMap = function(latCent,longCent){
		console.log('loading map');
		this.map = new google.maps.Map(document.getElementById(this.mapId), {
	     	zoom: 14,
	     	center: new google.maps.LatLng(latCent,longCent),
	    	mapTypeId: google.maps.MapTypeId.ROADMAP
	  	});
		var self = this;
		google.maps.event.addListener(this.map, 'click', function(event) {
		   //self.placeMarker(event.latLng);
		});
		
		console.log('map loaded');
		this.infowindow = new google.maps.InfoWindow();
		this.bounds = new google.maps.LatLngBounds();
		this.mapNotLoaded = false;
	};
	
	this.plotPoint = function(content, latitude, longitude, i, icon){
		var latlangpoint2 = new google.maps.LatLng(latitude, longitude);	
		marker = this.makeMarker(latlangpoint2, name, content, icon);
		this.addListener(marker, content, i);
		this.bounds.extend(latlangpoint2);
		//if(checkins.length > 1){
		this.map.fitBounds(this.bounds);
		//}
	};
	
	this.plotTarget = function(content, latitude, longitude, i, icon){
		var latlangpoint2 = new google.maps.LatLng(latitude, longitude);	
		marker = this.makeMarker(latlangpoint2, name, content, icon);
		this.addTargetListener(marker);
		//this.addListener(marker, content, i);
		this.bounds.extend(latlangpoint2);
		//if(checkins.length > 1){
		this.map.fitBounds(this.bounds);
		//}
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