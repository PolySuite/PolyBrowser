Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource:///modules/CustomizableUI.jsm");

//////////////////Functions to execute on first load of PolyBrowser

//Move Extension toolbar into PolyBrowser
var navigatorToolbox = document.getElementById('navigator-toolbox');
var navBar = document.getElementById('nav-bar');
var tabContainerWithZoomObj = document.getElementById('tabContainerWithZoom');
var utilityContainerObj = document.getElementById('utilityContainer');

function moveExtensionBar() {
	var utilityContainerObj = document.getElementById('utilityContainer');
	navigatorToolbox.removeChild(navBar);
	utilityContainerObj.insertBefore(navBar, tabContainerWithZoomObj);
	navBar.style.visibility = "visible";
	document.getElementById('tabview-button').setAttribute("hidden", true);	
}

try {setTimeout("moveExtensionBar()", 750);} 
//todo add exception handling?
catch (e){}


//Hide certain UI elements on load
function hideTools() {
		//Dev Tools
		document.getElementById('menu_devToolbox').setAttribute("hidden", true);
		document.getElementById('menuitem_inspector').setAttribute("hidden", true);
		document.getElementById('menuitem_webconsole').setAttribute("hidden", true);
		document.getElementById('menuitem_jsdebugger').setAttribute("hidden", true);
		document.getElementById('menuitem_styleeditor').setAttribute("hidden", true);
		document.getElementById('menuitem_jsprofiler').setAttribute("hidden", true);
		document.getElementById('menuitem_netmonitor').setAttribute("hidden", true);
		document.getElementById('menu_devtools_separator').setAttribute("hidden", true);
		document.getElementById('menu_responsiveUI').setAttribute("hidden", true);
		document.getElementById('menu_devtools_connect').setAttribute("hidden", true);
		document.getElementById('devToolsEndSeparator').setAttribute("hidden", true);
		document.getElementById('getMoreDevtools').setAttribute("hidden", true);
		document.getElementById('sync-setup').setAttribute("hidden", true);
		document.getElementById('sync-syncnowitem').setAttribute("hidden", true);		
		document.getElementById('sync-reauthitem').setAttribute("hidden", true);
		document.getElementById('superstart-toolbar-icon').setAttribute("hidden", true);
		document.getElementById('sync-button').setAttribute("hidden", true);
		document.getElementById('tabview-button').setAttribute("hidden", true);
		document.getElementById('find-button').setAttribute("oncommand", "findLaunch()");
}
	
try {setTimeout("hideTools()", 1000);} 
//todo add exception handling?
catch (e){}	
	
//Force YouTube to use HTML 5 video (Windows only)	
function setYouTubeHTML(){
if(checkingOS() == 'Linux' || checkingOS() == 'Darwin')
	{
		//Windows only
	}
	else{
var url = "http://youtube.com";
var cookieString = "PREF=f2=40000000;domain=.youtube.com"; //&fv=12.0.0&f5=30

var cookieUri = Components.classes["@mozilla.org/network/io-service;1"]
    .getService(Components.interfaces.nsIIOService)
    .newURI(url, null, null);

Components.classes["@mozilla.org/cookieService;1"]
    .getService(Components.interfaces.nsICookieService)
    .setCookieString(cookieUri, null, cookieString, null);
	}
}

try {setTimeout("setYouTubeHTML()", 1000);} 
//todo add exception handling?
catch (e){}

//////////Listener for keystrokes to perform certain actions

var pShiftKeyDown = false;
var pControlKeyDown = false;

//Control-tab to switch tabs
document.addEventListener("keydown", function(e) {
    if (e.keyCode ==  16) {pShiftKeyDown = true;}
    if (e.keyCode ==  17) {pControlKeyDown = true;}
    if (e.keyCode ==  9) { //tab
        if (pShiftKeyDown == true && pControlKeyDown == true){
        			pBrowserPrevTab();
        			return;
        			}
		if (pControlKeyDown == true){
					pBrowserNextTab();
					return;
					}
        	}	
   }, true);

document.addEventListener("keyup", function(e) {
        switch (e.keyCode){
        case 16: pShiftKeyDown = false; break;
        case 17: pControlKeyDown = false; break;
        case 9: //tab
        }
   }, false);


///////////////Functions when going in and out of Customize mode

function startCustomizeExtensionBar() {
	var utilityContainerObj = document.getElementById('utilityContainer');
	var navBar = document.getElementById('nav-bar');
	var tabContainerWithZoomObj = document.getElementById('tabContainerWithZoom');
	var navigatorToolbox = document.getElementById('navigator-toolbox');
	
//	utilityContainerObj.removeChild(navBar);
	navigatorToolbox.appendChild(navBar);
	navBar.style.visibility = "visible";
}

function endCustomizeExtensionBar() {
	var utilityContainerObj = document.getElementById('utilityContainer');
	var navBar = document.getElementById('nav-bar');
	var tabContainerWithZoomObj = document.getElementById('tabContainerWithZoom');
	var navigatorToolbox = document.getElementById('navigator-toolbox');
	
	navigatorToolbox.removeChild(navBar);
	tabContainerWithZoomObj.appendChild(navBar);
	navBar.style.visibility = "visible";
}

//Listener for Customize mode

var pCustomizing = false;

var pCustomizingTracker = {
	onCustomizeStart: function (aWindow) { 
			pCustomizing = true;
			
			var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
							   .getInterface(Components.interfaces.nsIWebNavigation)
							   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
							   .rootTreeItem
							   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
							   .getInterface(Components.interfaces.nsIDOMWindow);
			
			function PSelect(){
					startCustomizeExtensionBar();	
					}
		
			window.setTimeout(PSelect, 100);
	
			let pVisibleTabs = document.getElementById('content').visibleTabs;
			
			},
	onCustomizeEnd: function (aWindow) {
			endCustomizeExtensionBar();
			var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
							   .getInterface(Components.interfaces.nsIWebNavigation)
							   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
							   .rootTreeItem
							   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
							   .getInterface(Components.interfaces.nsIDOMWindow);
			

			function PSelect(){
					mainWindow.gBrowser.tabContainer.advanceSelectedTab(-1, true);
					}
			
			var theDeck = document.getElementById('content-deck');
			theDeck.setAttribute("selectedIndex", 0);
			theDeck.selectedIndex = 0;
			pCustomizing = false;
			isLoadingHiddenTabs = false;
			removePolyTabs();
			  }
};

CustomizableUI.addListener(pCustomizingTracker);

//Toggles going in and out of customize
function pCustomizeModeToggle(){
		
		
		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
							   .getInterface(Components.interfaces.nsIWebNavigation)
							   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
							   .rootTreeItem
							   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
							   .getInterface(Components.interfaces.nsIDOMWindow);
		
		if (pCustomizing == false){
				pCustomizing = true;
				pBrowserNewTabClick('about:blank#customizing');
				gCustomizeMode.toggle();
				return;
			//	window.setTimeout(pBrowserNewTabClick, 30, 'about:blank#customizing');
			}
		if (pCustomizing == true){	
				
				gCustomizeMode.toggle();
				
			//	console.log("pCustomizeModeToggle");
			}
}

////////////Hides about: pages from Firefox and aren't apropriate

/**
 * Register a component that replaces an about page
 *
 * @param {String} The ClassID of the class being registered (you create this yourself, standard UUID)
 * @param {String} The name of the class being registered.
 * @param {String} The type of about to be disabled (config/addons/privatebrowsing)
 * @returns {Object} The factory to be used to unregister
 */

Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

function disableAbout(aClass, aClassName, aboutType) {

  var gAbout = {
    newChannel : function (aURI) {
      var url = "SOME URL";
      var channel = Services.io.newChannel(url, null, null);
      channel.originalURI = aURI;
      return channel;
    }  ,
    getURIFlags : function getURIFlags(aURI) {
      return Ci.nsIAboutModule.HIDE_FROM_ABOUTABOUT;
    },

    QueryInterface: XPCOMUtils.generateQI([Ci.nsIAboutModule]),

    createInstance: function(outer, iid) {
       return this.QueryInterface(iid);
    }, 
  };

  var registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
  registrar.registerFactory(aClass, aClassName, "@mozilla.org/network/protocol/about;1?what=" + aboutType, gAbout);
  return gAbout;
} 

var classUUID =  uuidGenerator.generateUUID();
var classID = Components.ID( classUUID.toString());
/*
//Remove about:
var factory = disableAbout(classID, "PolyBrowser - about", "");
var registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
registrar.unregisterFactory(classID, factory);
*/
/*
//Remove about:addons
var factory = disableAbout(classID, "PolyBrowser - addons", "addons");
var registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
registrar.unregisterFactory(classID, factory);
*/
//Remove about:credits
var factory = disableAbout(classID, "PolyBrowser - credits", "credits");
var registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
registrar.unregisterFactory(classID, factory);

//Remove about:license
var factory = disableAbout(classID, "PolyBrowser - license", "license");
var registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
registrar.unregisterFactory(classID, factory);

//Remove about:healthreport
var factory = disableAbout(classID, "PolyBrowser - healthreport", "healthreport");
var registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
registrar.unregisterFactory(classID, factory);
/*
//Remove about:home
var factory = disableAbout(classID, "PolyBrowser - home", "home");
var registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
registrar.unregisterFactory(classID, factory);
*/
//Remove about:mozilla
var factory = disableAbout(classID, "PolyBrowser - mozilla", "mozilla");
var registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
registrar.unregisterFactory(classID, factory);

//Remove about:rights
var factory = disableAbout(classID, "PolyBrowser - rights", "rights");
var registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
registrar.unregisterFactory(classID, factory);

//Remove about:robots
var factory = disableAbout(classID, "PolyBrowser - robots", "robots");
var registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
registrar.unregisterFactory(classID, factory);
/*
//Remove about:sessionrestore
var factory = disableAbout(classID, "PolyBrowser - sessionrestore", "sessionrestore");
var registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
registrar.unregisterFactory(classID, factory);
*/
//Remove about:telemetry
var factory = disableAbout(classID, "PolyBrowser - telemetry", "telemetry");
var registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
registrar.unregisterFactory(classID, factory);


