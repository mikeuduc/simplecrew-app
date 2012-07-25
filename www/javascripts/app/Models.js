SimpleCrew.models = (function ($){

    /*var base_url = "http://app.simplecrew.com";
    var api_version = 'v1.0';
    var api_url = base_url + '/api/' + api_version;*/
    
    function login(data, callback){
        console.log('in models login');
                
        $.ajax({
            type: 'POST',
            url: api_url + '/mobile/login',
            data: data,
            success: function(user){
                console.log('success login');
                if (callback && typeof(callback) === "function") { 
                    console.log('about to callback');
                    console.log(user);
                    callback(user);  
                }               
            },
            error: function(error){
                $.mobile.changePage( "#home" );
                alert('Uable to login at this time.');
            },
            dataType: 'json'
        });
        
    
    }
    
    function handleError(error){
        
        var data = { email: localStorage.getItem("email"), 
                    password: localStorage.getItem("password") };
        console.log(data);
        if( data.email != null && data.password != null){
            login(data, function(user) {
                if(user != null){
                    $.mobile.changePage( "#companies" );
                    return true;
                }
                else{
                    errorLoginFailed();
                    return false;
                }
            });
        }
        else{
            errorLoginFailed();
            return false;
        }
    }
    
    function errorLoginFailed(){
        //delete local storage login credentials
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        $.mobile.changePage( "#home" );
        alert('Sorry, we were unable to log you back in');
    }
    
    function companies(callback){
        console.log('getting companies');
        console.log(api_url + '/companies/');
        $.Tache.Get({
            type: 'GET',
            async: 'false',
            url: api_url + '/companies/',
            success: function(companies){
                if (callback && typeof(callback) === "function") {
                    // execute the callback, passing parameters as necessary
                    callback(companies);
                }
                return;
            },
            error: function(error){
                handleError(error);
            },
            dataType: 'json'
        });
    }
    
    function campaigns(companyId, callback){
        console.log('getting campaigns');
        console.log(api_url + '/companies/' + companyId + '/campaigns/');
        $.Tache.Get({
            type: 'GET',
            async: 'false',
            url: api_url + '/companies/' + companyId + '/campaigns/',
            success: function(campaigns){
                console.log(campaigns);
                if (callback && typeof(callback) === "function") {
                    // execute the callback, passing parameters as necessary
                    callback(campaigns);
                }
                return;
            },
            error: function(error){
                handleError(error);
            },
            dataType: 'json'
        });
    }
    
    function campaign(companyId, campaignId, callback){
        console.log('getting campaign');
        console.log(api_url + '/companies/' + companyId + '/campaigns/' + campaignId)
        $.Tache.Get({
            type: 'GET',
            async: 'false',
            url: api_url + '/companies/' + companyId + '/campaigns/' + campaignId,
            success: function(campaign){
                if (callback && typeof(callback) === "function") {
                    // execute the callback, passing parameters as necessary
                    callback(campaign);
                }
                return;
            },
            error: function(error){
                handleError(error);
            },
            dataType: 'json'
        });
    }
    
     function company(companyId, callback){
        console.log('getting company');
        console.log(api_url + '/companies/' + companyId );
        $.Tache.Get({
            type: 'GET',
            async: 'false',
            url: api_url + '/companies/' + companyId,
            success: function(company){
                if (callback && typeof(callback) === "function") {
                    // execute the callback, passing parameters as necessary
                    callback(company);
                }
                return;
            },
            error: function(error){
                handleError(error);
            },
            dataType: 'json'
        });
    }
    
    function map(companyId, campaignId, callback){
        console.log('getting map');
        console.log(api_url + '/companies/' + companyId + '/campaigns/' + campaignId + '/map');
        $.Tache.Get({
            type: 'GET',
            async: 'false',
            url: api_url + '/companies/' + companyId + '/campaigns/' + campaignId + '/map',
            success: function(map){
                if (callback && typeof(callback) === "function") {
                    // execute the callback, passing parameters as necessary
                    console.log('map success');
                    callback(map.logs, map.targets);
                }
                return;
            },
            error: function(error){
                console.log('map error');
                handleError(error);
            },
            dataType: 'json'
        });
    }
    
    /* Delete Caches */
    
    function deleteCompany(companyId, callback){
    	console.log('removing campaigns cache');
        console.log(api_url + '/companies/' + companyId);
        
        $.Tache.Delete({
			type: "GET",
			url: api_url + '/companies/' + companyId,
			dataType: 'json',
			success: function(){
				if (callback && typeof(callback) === "function") {
                    // execute the callback, passing parameters as necessary
                    callback(company);
                }
                return;
			}
		});
    }
	
	function deleteCompanies( callback ){
    	console.log('removing campaigns cache');
        console.log(api_url + '/companies/');
        
        $.Tache.Delete({
			type: "GET",
			url: api_url + '/companies/',
			dataType: 'json',
			success: function(){
				console.log('delete companies success callback');
				if (callback && typeof(callback) === "function") {
								console.log('calling back');
								console.log(callback);
                    // execute the callback, passing parameters as necessary
                    callback();
                }
                return;
			}
		});
    }

    
    function deleteCampaign(companyId, campaignId, callback){
    	console.log('removing campaign cache**************');
        console.log(api_url + '/companies/' + companyId + '/campaigns/' + campaignId);
        $.Tache.Delete({
			type: "GET",
            url: api_url + '/companies/' + companyId + '/campaigns/' + campaignId,
            dataType: 'json',
            success: function(){
				console.log('delete campaign success callback');
				if (callback && typeof(callback) === "function") {
								console.log('calling back');
								console.log(callback);
                    // execute the callback, passing parameters as necessary
                    callback();
                }
                return;
			}
        });
    }
    
    return {
        login: login,
        companies: companies,
        company: company,
        campaigns: campaigns,
        campaign: campaign,
        map: map,
        deleteCompany: deleteCompany,
        deleteCompanies: deleteCompanies,
        deleteCampaign: deleteCampaign
        
    };
    
})(jQuery);