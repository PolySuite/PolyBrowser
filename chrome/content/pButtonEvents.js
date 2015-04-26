Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource:///modules/ContentSearch.jsm");

const nsIBrowserSearchService = Components.interfaces.nsIBrowserSearchService;




///////////Functions for browser controls on each website

function pBrowserCloseButtonClick(event)
{
	var targetClick = ((event.currentTarget.id).split('-'))[1];
	pCloseTab(targetClick);
}

function pBrowserCloseActive()
{
	var targetClick = ((PolyActiveBrowser().id).split('-'))[1];
	pCloseTab(targetClick);
}


function pCloseTab(targetClick){
	var activeTabNum = ((PolyActiveTab().id).split('-'))[1];
	var numPolyTabs = document.getElementById('tabArrowScroller').children.length;
	if(activeTabNum === targetClick && numPolyTabs > 1){
		var prevTab = PolyActiveTab().previousSibling;
		if(prevTab == null) {pBrowserNextTab();} 
		else {pBrowserPrevTab();}
		}
	var url;

	url = document.getElementById('polyAddressBar-'+targetClick).value;
	var BrowserContainer = document.getElementById('polyBrowserContainer-'+targetClick);
	if(BrowserContainer){
		//BrowserContainer.parentNode.removeChild(BrowserContainer);
		function func1(){BrowserContainer.parentNode.removeChild(BrowserContainer);};
		window.setTimeout(func1, 100);
		}
	var TabContainer = document.getElementById('tab-'+targetClick);
	if(TabContainer){
		//TabContainer.parentNode.removeChild(TabContainer);
		function func2(){TabContainer.parentNode.removeChild(TabContainer);}
		window.setTimeout(func2, 100);
		}
	var PContainerResizer = document.getElementById('pContainerResizer-'+targetClick);
	if(PContainerResizer){
		//PContainerResizer.parentNode.removeChild(PContainerResizer);
		function func3(){PContainerResizer.parentNode.removeChild(PContainerResizer);}
		window.setTimeout(func3, 100);
	}

	function checkOneTab(){
		var numPolyTabs = document.getElementById('tabArrowScroller').children.length;
		if(numPolyTabs == 0)
		{
			pBrowserNewTabClick('');
		}
	}
	window.setTimeout(checkOneTab, 300);

	polyBrowserContainerScrolled();
	setBrowserFocus();
}

//
// This function used when user click Go Button
//
function polyGoButtonClicked(e)
{
	try
	{
		var targetClick = ((e.originalTarget.id).split('-'))[1];
		if(!targetClick){targetClick = ((e.currentTarget.id).split('-'))[1];}
		
		var activeBrowserControl = document.getElementById('polyBrowser-'+targetClick);
		var activeAddressBarControl = document.getElementById('polyAddressBar-'+targetClick);
		var urlName = "", checkDomainWithDot=0;	
		var UrlPart="";
		
		if(activeBrowserControl && activeAddressBarControl)
		{
			urlName = activeAddressBarControl.value;
			UrlPart = urlName.split('.')[1];
			if(UrlPart) checkDomainWithDot = UrlPart.length;
			if(urlName.indexOf(' ') > -1){checkDomainWithDot = 0;} //Spaces mean search term
			if(urlName.indexOf('://') > -1 || urlName.indexOf('about:')>-1)
			{
			
			}
			else if(checkDomainWithDot > 0)
			{
				urlName = "http://"+urlName;
			}
			else
			{
				var ss = Components.classes["@mozilla.org/browser/search-service;1"]
						 .getService(nsIBrowserSearchService);
				//	urlName = "http://polyfetch.com/default.aspx#gsc.tab=0&gsc.q="+urlName;
				var searchSubmission = ss.currentEngine.getSubmission(urlName);
				urlName = searchSubmission.uri.spec;
			}
			activeBrowserControl.setAttribute("src",urlName);
		}

	}
	//TODO add exception handling?
	catch(ee){}
}

////////////Functions that control the Back button functionality

function polyGoBack(e)
{
	var targetClick = ((e.originalTarget.id).split('-'))[1];
	polyGoBackFunction(targetClick);
}

function polyGoBackActive(){
	var targetClick = ((PolyActiveBrowser().id).split('-'))[1];
	polyGoBackFunction(targetClick);
}

function polyGoBackFunction(targetClick){
	var activeBrowserControl = 'polyBrowser-'+targetClick;
	if(activeBrowserControl)
	{
		var objActiveBrowserControl = document.getElementById(activeBrowserControl);
		if(objActiveBrowserControl){if(objActiveBrowserControl.canGoBack){}	objActiveBrowserControl.goBack();}
	}
}

////////////Functions that control the Forward button functionality

function polyGoForward(e)
{
	var targetClick = ((e.originalTarget.id).split('-'))[1];
	polyGoForwardFunction(targetClick);
}

function polyGoForwardActive(){
	var targetClick = ((PolyActiveBrowser().id).split('-'))[1];
	polyGoForwardFunction(targetClick);
}

function polyGoForwardFunction(targetClick)
{
	var activeBrowserControl = 'polyBrowser-'+targetClick;
	if(activeBrowserControl)
	{
		var objActiveBrowserControl = document.getElementById(activeBrowserControl);
		if(objActiveBrowserControl)
		{
			if(objActiveBrowserControl.canGoForward)
			{
				var FavIcon = document.getElementById('tabFavIcon-'+targetClick);
				if(FavIcon){FavIcon.setAttribute('src','chrome://polybrowser/skin/loading.gif');}
			}
			objActiveBrowserControl.goForward();
		}
	}
}

function polyGoStop(e)
{
	var targetClick = ((e.originalTarget.id).split('-'))[1];
	var activeBrowserControl = 'polyBrowser-'+targetClick, PolyStopButton , PolyReloadButton;
	if(activeBrowserControl)
	{
		var objActiveBrowserControl = document.getElementById(activeBrowserControl);
		if(objActiveBrowserControl)
		{
			PolyStopButton = document.getElementById('polyStop-'+targetClick);
			PolyReloadButton = document.getElementById('polyReload-'+targetClick);
			objActiveBrowserControl.stop();
			if(PolyStopButton)
			{
				PolyReloadButton.setAttribute('hidden','false');
				PolyStopButton.setAttribute('hidden','true');
			}
		}
		
		var FavIcon = document.getElementById('tabFavIcon-'+targetClick);
		var objLoc = document.getElementById('polyAddressBar-'+targetClick);
		var objLocVal;
		if(FavIcon && objLoc)
		{
			objLocVal = objLoc.value;
			objLocVal = objLocVal.replace('http://','');
			objLocVal = objLocVal.substring(0,objLocVal.indexOf('/'));
			FavIcon.setAttribute("src","http://www.google.com/s2/favicons?domain="+objLocVal);
		}
	}
}

////////////Functions that control Bookmarking functionality

function polyBookmarkActive(){
	var targetClick = ((PolyActiveBrowser().id).split('-'))[1];
	polyBookmarkTarget(targetClick);
}

function polyBookmark(e)  {
  var targetClick = ((e.originalTarget.id).split('-'))[1];
  polyBookmarkTarget(targetClick);
}

function polyBookmarkTarget(targetClick){
		try
		{
		var targetClick = targetClick;
 		var bookmarkButton = document.getElementById('polyBookmark-'+targetClick);
		var fetchTitle = document.getElementById('polyTitle-'+targetClick).firstChild.textContent;
		var fetchUrl = document.getElementById('polyAddressBar-'+targetClick).value;
		
		if (typeof fetchTitle === 'undefined'){}
		else if(typeof fetchUrl === 'undefined'){}
		else if(fetchUrl == 'about:blank' && fetchTitle == 'Untitled'){}
		else if(fetchUrl == 'about:newtab'){}
		else
		{
			if(fetchTitle!="" && fetchUrl!="")
			{

				var bmsvc = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Components.interfaces.nsINavBookmarksService);
				var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
				var uri = ios.newURI(fetchUrl, null, null);
				if (!bmsvc.isBookmarked(uri)) 
				{
					bmsvc.insertBookmark(bmsvc.toolbarFolder, uri, bmsvc.DEFAULT_INDEX, fetchTitle); 
					bmsvc.insertBookmark(bmsvc.bookmarksMenuFolder, uri, bmsvc.TYPE_BOOKMARK, fetchTitle); 
					bookmarkButton.setAttribute('src','chrome://polybrowser/skin/bookmarkEnable.png');
				}
				else
				{
					var bookmarksArray = bmsvc.getBookmarkIdsForURI(uri, {});
					for(i=0;i<bookmarksArray.length;i++)
					{
						bmsvc.removeItem(bookmarksArray[i]);
					}
					bookmarkButton.setAttribute('src','chrome://polybrowser/skin/bookmarkDisable.png');
				}
			}
		}
	}
	//TODO add exception handling?
	catch(ee){}
}

////////////Functions that control the Reload functionality

function polyReloadActive(){

	var targetClick = ((PolyActiveBrowser().id).split('-'))[1];
	polyReloadFunction(targetClick);
}

function polyReload(e)
{
	var targetClick = ((e.originalTarget.id).split('-'))[1];
	polyReloadFunction(targetClick);
}

function polyReloadFunction(targetClick)
{
	var activeBrowserControl = 'polyBrowser-'+targetClick, activeAddressControl = 'polyAddressBar-'+targetClick;
	if(targetClick)
	{
		var objActiveBrowserControl = document.getElementById(activeBrowserControl);
		objActiveAddressControl = document.getElementById(activeAddressControl).value;
		if(objActiveBrowserControl)
		{
			if(objActiveAddressControl!="" && objActiveAddressControl.indexOf('about:newtab') == -1)
				objActiveBrowserControl.reload();
				objActiveBrowserControl.setAttribute('src', objActiveAddressControl);
		}
	}
}

function polyBrowserReloadSkipCache() {
  // Bypass proxy and cache.
  var targetClick = ((PolyActiveBrowser().id).split('-'))[1];
  const reloadFlags = nsIWebNavigation.LOAD_FLAGS_BYPASS_PROXY | nsIWebNavigation.LOAD_FLAGS_BYPASS_CACHE;
  
  var activeBrowserControl = 'polyBrowser-'+targetClick, activeAddressControl = 'polyAddressBar-'+targetClick;
	if(targetClick)
	{
		var objActiveBrowserControl = document.getElementById(activeBrowserControl);
		objActiveAddressControl = document.getElementById(activeAddressControl).value;
		if(objActiveBrowserControl)
		{
			if(objActiveAddressControl!="" && objActiveAddressControl.indexOf('about:newtab') == -1)
				objActiveBrowserControl.reload(reloadFlags);
				objActiveBrowserControl.setAttribute('src', objActiveAddressControl);
		}
	}
  
  
}

//home button
function polyLoadHome(e)
{
	var targetClick = ((e.originalTarget.id).split('-'))[1];
	var activeBrowserControl = 'polyBrowser-'+targetClick;
	var activeAddressBarControl = 'polyAddressBar-'+targetClick;
	var objectActiveAddressBarControl = document.getElementById(activeAddressBarControl);
	var urlName = "";
	
	var objActiveBrowserControl = document.getElementById(activeBrowserControl);
	if(objActiveBrowserControl)
	{		
		var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components. interfaces.nsIPrefBranch);
		var urlName = prefs.getCharPref('browser.startup.homepage');
		if (urlName=='about:home'  || urlName=='chrome://branding/locale/browserconfig.properties'){
			objActiveBrowserControl.loadURI("about:newtab");
			objectActiveAddressBarControl.value = "about:newtab";
			var FavButtonId = "tabFavIcon-"+targetClick;
			var FavButton = document.getElementById(FavButtonId);
			FavButton.setAttribute('src','chrome://polybrowser/skin/favicons.png');
			}
		if (urlName=='about:blank'){
			objActiveBrowserControl.loadURI("about:home");
			objectActiveAddressBarControl.value = "about:blank";
			var FavButtonId = "tabFavIcon-"+targetClick;
			var FavButton = document.getElementById(FavButtonId);
			FavButton.setAttribute('src','chrome://polybrowser/skin/favicons.png');
			}

		if (urlName!='about:home'  && urlName!='chrome://branding/locale/browserconfig.properties' && urlName!='about:blank') {
			objActiveBrowserControl.setAttribute("src", urlName);	
			}
	}

}

//Escape key to exit fullscreen mode
function escapeKey(){
	if(window.fullScreen){
				BrowserFullScreen();
		}
}

//Simple test function 
function testButton (){alert("Works");}