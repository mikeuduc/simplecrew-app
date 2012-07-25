var ajaxLoaderDark = '<div class="ajax-loader-dark vert-align">Loading...</div>',
    noCompaniesText = 'No companies available at this time.';

function onBodyLoad()
{		
    $.Tache.SetTimeout(60);
    SimpleCrew.controller.init();
   // $("img.lazy").lazyload({ threshold : 500 });
    document.addEventListener("deviceready", onDeviceReady, false);
}


/* Login */
$("#loginForm").live('submit', function(event)
{
    event.preventDefault();
    
    var data = { email: $('#email', this).val(), 
        password: $('#password', this).val() };
    
    $(this).addClass('ui-disabled');    
    
    login(data, function(user){
    	console.log('success');
		if(user != null){
			console.log('user not null');
			//Set localstorage login credentials
			setLogin(data);
			$.mobile.changePage( "#companies" );
		}
		else{
			$('#loginForm #password').val('');
			$("#loginForm").removeClass('ui-disabled');    
			alert('Password/Username incorrect.');
		}
		console.log(user);
    });
});

function login(data, callback){
	$.ajax({
        type: 'POST',
        url: api_url + '/mobile/login',
        data: data,
        success: function(user){
            if (callback && typeof(callback) === "function") {
                    // execute the callback, passing parameters as necessary
                    callback(user);
                }
                return;
        },
        error: function(error){
            $("#loginForm").removeClass('ui-disabled'); 
            alert('Sorry, unable to login at this time.');
        },
        dataType: 'json'
    });
}
function setLogin(login){
    if (typeof(localStorage) == 'undefined' ) {
        console.log('local storage not enabled');
    } else {
        try {
            localStorage.setItem("email", login.email); //saves email to the database
            localStorage.setItem("password", login.password); //saves password to the database
           } catch (e) {
             if (e == QUOTA_EXCEEDED_ERR) {
                 console.log('quota exceeded'); //data wasn't successfully saved due to quota exceed so throw an error
            }
        }
        //document.write(localStorage.getItem("name")); //Hello World!
        //localStorage.removeItem("name"); //deletes the matching item from the database
    }

}

/* Logout */
$("#logout").live('click', function(event)
{
    event.preventDefault();
    
    //delete local storage login creds
            
    
    $.ajax({
        type: 'POST',
        url: api_url + '/mobile/logout',
        success: function(data){
            localStorage.removeItem("email")
            localStorage.removeItem("password")
            $.mobile.changePage( '#home', { changeHash: false } );
        },
        error: function(error){
            $.mobile.changePage( '#home', { changeHash: false } );
            alert('Error logging out');
        },
        dataType: 'json'
    });
    
});

/* footer */
$("#upload-photo").live('click', function(event){
    event.preventDefault();
    $('#campaign .content').html(ajaxLoaderDark);
    console.log('capturing photo....');
    capturePhoto();
});

/* make-comment */
$("#submit_comment").live('click', function(event){
    event.preventDefault();
    submitComment();
    $('#log_update_form').submit();

});

$('#log_update_form').live('submit',function(event){
	console.log('attempting to submit');
	$('#focusable').focus();
	return false;
});

function submitComment(){
	$('#submit_comment').addClass('ui-disabled');      
    console.log('*******************');
    //console.log($('#log_update_form').serialize());
    var cid = $('#log_update_form input#companyId').val(),
        id = $('#log_update_form input#campaignId').val();
    $.ajax({
        type: 'PUT',
        url: api_url + '/companies/' + cid + '/campaigns/' + id + '/logs/' + logId,
        data: { comment: $('#log_update_form input#comment').val() },
        success: function(log){
            console.log('commented!');
            console.log(log);
            $.mobile.changePage( '#campaign?companyId=' + cid + '&campaignId=' + id, { changeHash: false } );
        },
        error: function(error){
            alert('Sorry, comment could not be processed at this time.');
            $.mobile.changePage( '#campaign?companyId=' + cid + '&campaignId=' + id, { changeHash: false } );
        },
        dataType: 'json'
    });    
}


$(document).bind("mobileinit", function(){

  $.mobile.defaultPageTransition = 'none';
  $.support.cors = true;
  //$.mobile.iscrollview.prototype.options.refreshDelay = 3000;
  $.mobile.allowCrossDomainPages = true;
  //SimpleCrew.controller.init();

});


function onDeviceReady()
{

	var pass = window.localStorage.getItem("password");
	var email = window.localStorage.getItem("email");

    if (pass != null) {
        $('#password').val(pass);
    }
    if (email != null) {
        $('#email').val(email);
    }
  console.log('device is ready...');
  pictureSource=navigator.camera.PictureSourceType;
  destinationType=navigator.camera.DestinationType;
  document.addEventListener("resume", onResume, false);

}

function onResume() {
    console.log('in on resume');
    // Handle the pause event
    setTimeout(function() {
        // TODO: do your thing!
        //$.mobile.changePage( '#campaign?companyId=' + cid + '&campaignId=' + id, { changeHash: false } );
        var curUrl = $.mobile.activePage.data('url');
        //alert(curUrl);
        if(curUrl != 'home'){
        //console.log('reloading page #' + $.mobile.activePage.data('url'));
           // $.mobile.changePage('#' + $.mobile.activePage.data('url'), { changeHash: false });
          //  alert(curUrl);
        }
       	//alert(localStorage.getItem("email"));
    	//alert(localStorage.getItem("password"));

    }, 0);
}



function uploadGeoPhoto(imageURI) {
  //$('#campaign_details').addClass('hidden');
  //$('#uploading').removeClass('hidden');
  //$('#').hide();
  uploadImageURI = imageURI;
  navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, { enableHighAccuracy: true });
}

function onGeoSuccess(position) {
  console.log(uploadImageURI);
  console.log(position.coords.longitude);
 // alert('lat : '+ position.coords.latitude);

  uploadPhoto(uploadImageURI, position);
}

// onError Callback receives a PositionError object
//
function onGeoError(error) {
  $('#uploading').addClass('hidden');
  $('#campaign_details').removeClass('hidden');
  alert('You must enable position for SimpleCrew photo uploads in Settings > Location Services');
}

function GetDate(jsonDate) {
  var value = new Date(parseInt(jsonDate.substr(6)));
  return value.getMonth() + 1 + "/" + value.getDate() + "/" + value.getFullYear();
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //'
  alert("data:image/jpeg;base64," + imageData);
  smallImage.src = "data:image/jpeg;base64," + imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
  // Uncomment to view the image file URI 
  // console.log(imageURI);
  
  // Get image handle
  //
  var largeImage = document.getElementById('largeImage');
  
  // Unhide image elements
  //
  largeImage.style.display = 'block';
  
  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  largeImage.src = imageURI;
}

// A button will call this function
//
function capturePhoto() {
  // Take picture using device camera and retrieve image as base64-encoded string
  //alert(destinationType.DATA_URL);
  
  navigator.camera.getPicture(uploadGeoPhoto, onFail, { quality: 10, 
                              destinationType: destinationType.FILE_URI,
                              correctOrientation: true, saveToPhotoAlbum: true });
}



// A button will call this function
//
function capturePhotoEdit() {
  // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
  //navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
  //                          destinationType.DATA_URL });
}


function uploadPhoto(imageURI, position) {
  var params = new Object();
  //params.uid = userId;
  params.cid = localStorage.getItem("companyId");
  params.id = localStorage.getItem("campaignId");
  console.log('params#####');
  console.log(params);
  $.mobile.changePage( "#make-comment?companyId=" + params.cid + "&campaignId=" + params.id, { transition: "none"} );

  var options = new FileUploadOptions();
  options.fileKey="file";
  options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
  options.mimeType="image/jpeg";
  
  
  console.log(params.id);
  //alert(params.cid);
  var currentURL = $.mobile.activePage.data('url');
  console.log('current url');
  console.log(currentURL);
  //[alert(params.id);
  params.lng = position.coords.longitude;
  params.lat = position.coords.latitude;
  
  params.coord = [ position.coords.longitude, position.coords.latitude ];
  
  options.params = params;
  options.chunkedMode = false;
  console.log('changing page to make-comment');

  //var largeImage = document.getElementById('largeImage');
  
  // Unhide image elements
  //
  //largeImage.style.display = 'block';
  
  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  //largeImage.src = imageURI;
  var ft = new FileTransfer();
  console.log('upload file...');
  console.log(api_url + "/companies/" + params.cid + "/campaigns/" + params.id + "/logs/");
  ft.upload(imageURI, api_url + "/companies/" + params.cid + "/campaigns/" + params.id + "/logs/", win, fail, options);
}

function win(r) {
    if(r.responseCode != 200){
        console.log('page id is' + $.mobile.activePage.attr('id'));
        console.log($.mobile.activePage.html());
        var cid = $('input#companyId', $.mobile.activePage).val();
        var id = $('input#campaignId', $.mobile.activePage).val();
        $.mobile.changePage( "#campaign?companyId=" + cid + "&campaignId=" + id, { transition: "none", changeHash: false } );
        alert('Upload failed. Please try again.');
    }
    else{
        console.log('WIN RESPONSE**********');
        console.log(r);
        console.log(unescape(r.response));
        logId = unescape(r.response);
        logId = logId.replace(/("|')/g,"");   //"
        //$('#upload_text').html('Finished Uploading Photo');
        //$('#upload_img').addClass('hidden');
        if(logId != 'error'){
        //    var formAction = base_url + '/api-mobile-1.0/companies/' + $('input#companyId').val() + '/campaigns/' + $('input#campaignId').val() + '/logs/' + logId;
            //alert(formAction);
          //  $('#log_update_form').attr('action', formAction);
          //alert(logId);
        }
        else{
            console.log('logID = ' + logId);
            console.log('page id is' + $.mobile.activePage.attr('id'));
            console.log($.mobile.activePage.html());
            var cid = $('input#companyId', $.mobile.activePage).val();
            var id = $('input#campaignId', $.mobile.activePage).val();
            $.mobile.changePage( "#campaign?companyId=" + cid + "&campaignId=" + id, { transition: "none"} );
            alert('Upload failed. Please try again.');
        }
        //$('#comment_submit_container').removeClass('hidden');
       // $('#log_update_form input[type="submit"]').button('enable');
        $('#submit_comment').removeClass('ui-disabled');      
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
    }
}
                          
function fail(error) {
  params.cid = $('input#companyId', $.mobile.activePage).val();
  params.id = $('input#campaignId', $.mobile.activePage).val();
  $.mobile.changePage( "#campaign?companyId=" + params.cid + "&campaignId=" + params.id, { transition: "none"} );
}
   
function onFail(message) {
    //alert('Failed because: ' + message);
    var url = $.url();
    console.log('chaning page');
    console.log('#' + url.attr('anchor'));
    $.mobile.changePage('#' + url.attr('anchor'), { changeHash: false });
}    

function getAmPmTime(d){
	var a_p = "";
	var curr_hour = d.getHours();
	if (curr_hour < 12){
	   a_p = "am";
	}
	else
	   {
	   a_p = "pm";
	   }
	if (curr_hour == 0)
	   {
	   curr_hour = 12;
	   }
	if (curr_hour > 12)
	   {
	   curr_hour = curr_hour - 12;
	   }

	var curr_min = d.getMinutes();

	curr_min = curr_min + "";

	if (curr_min.length == 1){
	   curr_min = "0" + curr_min;
	 }
	
	return curr_hour + ":" + curr_min + a_p
}

var month=new Array();
month[0]="Jan";
month[1]="Feb";
month[2]="Mar";
month[3]="Apr";
month[4]="May";
month[5]="Jun";
month[6]="Jul";
month[7]="Aug";
month[8]="Sep";
month[9]="Oct";
month[10]="Nov";
month[11]="Dec";

var weekday=new Array(7);
weekday[0]="Sun";
weekday[1]="Mon";
weekday[2]="Tue";
weekday[3]="Wed";
weekday[4]="Thu";
weekday[5]="Fri";
weekday[6]="Sat";

