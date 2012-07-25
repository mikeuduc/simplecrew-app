function getUrlVars(urlString) {
	var vars = {};
	var parts = urlString.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}