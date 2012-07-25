SimpleCrew.controller = (function ($, dataContext, googleMap) {
    var home = '#home',
    companiesSel = "#companies",
    companySel = "#company",
    campaignsSel = "#campaigns",
    campaignSel = "#campaign",
    mapSel = "#map",
    commentSel = "#make-comment",
    logsId = "logs",
    logId = "log"
    menu = "#menu";
    
    var companyId = null;
    var campaignId = null;

    function init(){
        console.log('datacontext');
        console.log(dataContext);
        var d = $(document);
        d.bind("pagebeforechange", onPageChange);
        d.bind("pagebeforeshow", onBeforeHide);
    }

    function onBeforeHide(event, data){
        var pageId = data.prevPage.attr('id');
        switch(pageId){
            case 'companies':
            case 'campaigns':
            case 'campaign':
            case 'company':
                //$('#' + pageId + ' .content').html('');
                break;
            case 'make-comment':
                break;
            case 'home':
            case '':
                $('#loginForm #password').val('');
                $('#loginForm').removeClass('ui-disabled');    
                break;
            default:
                break;
        }
    }
    
    function logBackIn(){
        console.log('in log back in');
        if(login.email != null && login.password != null){
            //console.log(login.email);
            //console.log(login.password);
            //console.log('about to log back in');
            dataContext.login(login, function(user){
                //console.log(user);
                //console.log('in login callback');
                if(user != null){
                    //console.log('user not null');
                    //Set login to successful login credentials
                    //login = data;
                    //console.log(user);
                   /* if(user.companyRoles.length == 1){
                        //getCampaigns(user.CompanyRoles[0]._company._id);
                    }
                    else{*/
                        //console.log('multiple companies');
                        console.log('logging back in');
                        console.log('**********************************');
                        $.mobile.changePage("#companies");
                    //}
                }
                else{
                    //$('#password', this).val() = '';
                    login.email = null;
                    login.password = null;
                    //loginFailure(this);
                }
            });
        }
        else{
            //console.log('reset email and password field');
           // $('#password', this).val() = '';
            //$('#email', this).val() = 'user@email.com';
        }
    }

    function onPageChange(event, data){
        
        if ( typeof data.toPage === "string" ) {
            var urlObj = $.mobile.path.parseUrl( data.toPage );
            //console.log(data.options.pageData);

            var toPageId = urlObj.hash.replace( /\?.*$/, "" );
            console.log('to page id = ');
            console.log(toPageId);

            switch (toPageId){
                case menu:
                    console.log('in menu');
                    break;
                case home:
                 //case '':
                    //alert(toPageId);
                    //alert('going home');
                    console.log('switch: home');
                    if(data.options.pageData != undefined && data.options.pageData.logout != undefined && data.options.pageData.logout == "true"){
                      //  alert('logging out');
                        $('#loginForm #password').val('');
                    }
                    else{
                      //  alert('NO LOGOUT');
                    }
                   // alert('whaaa');
                    //logBackIn();
                    console.log('do nothing');
                    break;
                case companiesSel:
                    renderCompaniesList(toPageId + ' .content', true);    
                    break;
                case companySel:
                    companyId = data.options.pageData.companyId;
                    renderCompany(companyId, toPageId + ' .content', true);    
                    break;
                case campaignsSel:
                    companyId = data.options.pageData.companyId;
                    renderCampaignsList(companyId, toPageId);    
                    break;
                case campaignSel:
                    companyId = data.options.pageData.companyId;
                    campaignId = data.options.pageData.campaignId;
                    renderCampaignDetails(companyId, campaignId, toPageId + ' .content', true);    
                    break;
                case mapSel:
                    companyId = data.options.pageData.companyId;
                    campaignId = data.options.pageData.campaignId;
                    renderMapDetails(companyId, campaignId);
                    break;
                case commentSel:
                    var data = { 
                            campaignId: data.options.pageData.campaignId, 
                            companyId: data.options.pageData.companyId 
                    };
                    var sel = toPageId + ' .content';
                    dataContext.deleteCampaign(data.companyId, data.campaignId);
                    render(data, 'logs/post-comment', sel);
                default:
                    break;
            }
        }
    }
    

    function render(data, templateName, selector, callback){
    
        var view = $(selector);
        //console.log(selector);
        $.ajax({
            url: 'views/' + templateName + '.html',
            dataType: 'text',
            async: false,
            success: function(template){
                //console.log('successful render');
                var pagehtml = Mustache.to_html(template, data);
                //pagehtml = pagehtml.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
                //console.log(pagehtml);
                console.log('rendering...');
                
                console.log(location.hash);
                //console.log($.mobile.activePage.data('url'));
                view.html(pagehtml).trigger('create');
                if (callback && typeof(callback) === "function") {  
                    callback();  
                } 
            },
            error:function(error){ 
                //console.log('render error');
            }
        });             
    }
    
    function renderMapDetails(companyId, campaignId){
        //gets both logs and targets
        //console.log('in render map details');
        dataContext.map(companyId, campaignId, function(logs,targets){
            googleMap.initializePlot(logs, targets);    
        });
    
    }

    function renderCompaniesList(sel, loader, callback){
    	console.log('rendering companies: ' + sel + ' - '  + loader);
    	if(loader){
    		console.log('setting loader');
	        $(sel).html(ajaxLoaderDark);
    	}
        //$(pageId + " .content").iscrollview("refresh");
        dataContext.companies(function(companies){
        	console.log('got companies');
        	console.log(companies)
            companies.no_companies = companies.count ? null : noCompaniesText;
            render(companies, 'companies/list', sel);
        });
    }
    
    function renderCampaignsList(companyId, pageId){
        //console.log('render campaigns list' + companyId);
        $(pageId + ' .content').html(ajaxLoaderDark);
        dataContext.campaigns(companyId, function(campaigns){
            campaigns.log_count = function() { 
                return this._logs.length; 
            }
            render(campaigns, 'campaigns/list', pageId + ' .content');
        });
    }
    
    function renderCompany(companyId, sel, loader, callback){
        //console.log('render company' + companyId );
        if(loader){
	        $(sel).html(ajaxLoaderDark);
	    }
        dataContext.company(companyId, function(company){
            company.log_count = function() { 
                return this._logs.length; 
            }
            //console.log(pageId + ' .content - yah');
            render(company, 'companies/details', sel, callback);
        });
    }
    
    
        
    function renderCampaignDetails(companyId, campaignId, sel, loader){
        //console.log(' setting back link to ' + '#campaigns?companyId=' + companyId);
       //$('#campaign-back').attr('href','#campaigns?companyId=' + companyId );
    	localStorage.setItem("campaignId", campaignId);
		localStorage.setItem("companyId", companyId);
		if(loader){
	        $(sel).html(ajaxLoaderDark);
    	}
        $('#map-link').attr('href','#map?companyId=' + companyId + '&campaignId=' + campaignId);
        //not losing active class when clicked
        $('#upload-photo').removeClass('ui-btn-active');
        dataContext.campaign(companyId, campaignId, function(campaign){
			campaign.created_local = function() { 
				var d = new Date(this.created);
				var localtime = getAmPmTime(d);
				return month[d.getMonth()] + ' ' + d.getDate() + ' at ' + localtime; 
			}
			campaign.start_local = function() { 
				var d = new Date(this.start);
				return weekday[d.getDay()] + ', ' + d.getMonth() + '/' + d.getDate(); 
			}
			campaign.end_local = function() { 
				var d = new Date(this.end);
				return weekday[d.getDay()] + ', ' + d.getMonth() + '/' + d.getDate(); 
			}

            render(campaign, 'campaigns/details', sel, function(){ 
                $("img.lazy").lazyload({ threshold : 1000 } ); 
               // alert('attempting to refresh');
                //$(".example-wrapper").jqmData('iscrollview').refresh()
                
            });
        });
    }
   /* 
    var pullDownGeneratedCount = 0,
      pullUpGeneratedCount = 0,
      listSelector = "div#company ul.ui-listview",
      lastItemSelector = listSelector + " > li:last-child";
    */
  /* For this example, I prepend three rows to the list with the pull-down, and append
   * 3 rows to the list with the pull-up. This is only to make a clear illustration that the
   * action has been performed. A pull-down or pull-up might prepend, append, replace or modify
   * the list in some other way, modify some other page content, or may not change the page 
   * at all. It just performs whatever action you'd like to perform when the gesture has been 
   * completed by the user.
   */
   /*
  function gotPullDownData(event, data) {
    var i,
        newContent = "";        
    for (i=0; i<3; i+=1) {  // Generate some fake new content
      newContent = "<li>Pulldown-generated row " + (++pullDownGeneratedCount) + "</li>" + newContent;
      }
    $(listSelector).prepend(newContent).listview("refresh");  // Prepend new content and refresh listview
    data.iscrollview.refresh();    // Refresh the iscrollview
    }
  
  function gotPullUpData(event, data) {
    var i,
        iscrollview = data.iscrollview,
        newContent = "";
    for (i=0; i<3; i+=1) { 
      newContent += "<li>Pullup-generated row " + (++pullUpGeneratedCount) + "</li>";
      }
    $(listSelector).append(newContent).listview("refresh");
  
    // The refresh is a bit different for the pull-up, because I want to demonstrate the use
    // of refresh() callbacks. The refresh() function has optional pre and post-refresh callbacks.
    // Here, I use a post-refresh callback to do a timed scroll to the bottom of the list
    // after the new elements are added. The scroller will smoothly scroll to the bottom over
    // a 400mSec period. It's important to use the refresh() callback to insure that the scroll
    // isn't started until the scroller has first been refreshed.
    iscrollview.refresh(null, null,
      $.proxy(function afterRefreshCallback(iscrollview) { 
        this.scrollToElement(lastItemSelector, 400); 
        }, iscrollview) ); 
    }
  
  // This is the callback that is called when the user has completed the pull-down gesture.
  // Your code should initiate retrieving data from a server, local database, etc.
  // Typically, you will call some function like jQuery.ajax() that will make a callback
  // once data has been retrieved.
  //
  // For demo, we just use timeout to simulate the time required to complete the operation.
  	function onCompanyPullDown (event, data) { 
    	console.log('pulling down')
		dataContext.deleteCompany(companyId, function(){
			renderCompany(companyId, '#company .content', false, data.iscrollview.refresh()); 
		});
    }    
    
    function onCompaniesPullDown (event, data) { 
		dataContext.deleteCompanies( function() {
			console.log('companies pulldown delete calback');
			renderCompaniesList('#companies .content', false, data.iscrollview.refresh()); 
		});
    } 
    
    function onCampaignPullDown (event, data) { 
		dataContext.deleteCampaign( companyId, campaignId, function() {
			data.iscrollview.refresh()
			//console.log('companies pulldown delete calback');
			console.log( data );
			console.log( data.iscrollview );
			renderCampaignDetails(companyId, campaignId, '#campaign .content', false, $(".example-wrapper").jqmData('iscrollview').refresh());   
		});
    } 

  // Called when the user completes the pull-up gesture.
  function onPullUp (event, data) { 
    setTimeout(function fakeRetrieveDataTimeout() {
      gotPullUpData(event, data);
      }, 
      1500); 
    }    
  
  // Set-up jQuery event callbacks
 
    $(document).delegate("div#companies", "pageinit", 
    function bindPullPagePullCallbacks(event) {
		console.log('init');
		$(".iscroll-wrapper", this).bind( {
			iscroll_onpulldown : onCompaniesPullDown//,
			//iscroll_onpullup   : onPullUp
		});
    });
    
    $(document).delegate("div#company", "pageinit", 
    function bindPullPagePullCallbacks(event) {
    console.log('init');
      $(".iscroll-wrapper", this).bind( {
      iscroll_onpulldown : onCompanyPullDown//,
      //iscroll_onpullup   : onPullUp
      } );
    } ); 
    
    $(document).delegate("div#campaign", "pageinit", 
    function bindPullPagePullCallbacks(event) {
    console.log('init');
      $(".iscroll-wrapper", this).bind( {
      iscroll_onpulldown : onCampaignPullDown//,
      //iscroll_onpullup   : onPullUp
      } );
    } ); */

    return {
        init: init,
    }

})(jQuery, SimpleCrew.models, new GoogleMap( { mapId: "combo-map" } ));