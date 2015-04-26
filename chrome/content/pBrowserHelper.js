var TabCountStart = 0,oldURL,MouseX=0, MouseY=0,checkPageLoad = 0,polyoldURL;
var contextMenuControl="";
// Adding Listener for Bookmark Entry
var myExt_urlBarListener = { QueryInterface: function(aIID){if (aIID.equals(Components.interfaces.nsIWebProgressListener) || aIID.equals(Components.interfaces.nsISupportsWeakReference) || aIID.equals(Components.interfaces.nsISupports)) return this; throw Components.results.NS_NOINTERFACE;},onLocationChange: function(aProgress, aRequest, aURI){ListenerForDefaultAddressBar(aURI);},onStateChange: function(aProgress,aRequest,aFlag,aStatus) {startActivitySpinner();},onProgressChange: function(aProgress, aRequest, aURI){startActivitySpinner();},onStatusChange: function(a, b, c, d) {startActivitySpinner();},onSecurityChange: function(a, b, c) {}};


//Variables for resizing of browsers
var oldURI ="", oldHeight = 0, newURI, uriChange = false, heightChange = false;
document.createAttribute('oldUrl');
//Variables for operations on FF tabs
var tabCount = 0;


// Bookmark Utilities
Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource:///modules/PlacesUIUtils.jsm");
Components.utils.import("resource://gre/modules/Downloads.jsm");
/////////////////////

var uuidGenerator = Components.classes["@mozilla.org/uuid-generator;1"]
                    .getService(Components.interfaces.nsIUUIDGenerator);
                    
if(window.name == ""){window.name = uuidGenerator.generateUUID();}


//Stub for checking operating system
function checkingOS()
{
	// Returns "WINNT" on Windows Vista, XP, 2000, and NT systems;
	// "Linux" on GNU/Linux; and "Darwin" on Mac OS X.
	var osString = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).OS;
	return osString;
}

var thisOS = checkingOS();


//Listens for requests for new browsers
var PolyBrowserListener = {

	//method of nsISupports interface
	QueryInterface: function(aIID){
	   if (aIID.equals(Components.interfaces.nsIWebProgressListener) || aIID.equals(Components.interfaces.nsISupportsWeakReference) || aIID.equals(Components.interfaces.nsISupports)) return this;
	   throw Components.results.NS_NOINTERFACE;},

	//Watches for new activity
	  onStateChange: function(aWebProgress, aRequest, aFlag, aStatus)
	  {
		try
		{
			var targetClick, FavIcon;
			var TempId, PolyStopButton, PolyReloadButton, LoadingBrowser, loadingContainer;
		//Activates at the BEGINNING of activity
		if ((aFlag & Components.interfaces.nsIWebProgressListener.STATE_START) &&
		(aFlag & Components.interfaces.nsIWebProgressListener.STATE_IS_WINDOW))
		{
			//Detects if activity is at the top level, not in iframes or other
			if (aWebProgress.DOMWindow == aWebProgress.DOMWindow.top)
			{
				var window = null;
				
				//Callbacks are for storing groups of calls
				var callbacks = aRequest.notificationCallbacks ? aRequest.notificationCallbacks : aRequest.loadGroup.notificationCallbacks;
				if(callbacks)
				{
					//Finds the tab associated with the DOM window				
					window = callbacks.getInterface(Components.interfaces.nsIDOMWindow);
					
					//Events generated in the frame bubble up to its chromeEventHandler - Assigned to TempID
					var TempId = window.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation)
                       .QueryInterface(Ci.nsIDocShell).chromeEventHandler.id;
					if(TempId)
					{
						//targetClick is created to capture event IDs
						targetClick = (TempId.split('-'))[1];
						var FavIcon = document.getElementById('tabFavIcon-'+targetClick);
						//Sets spinner gif while loading.
						FavIcon.setAttribute('src','chrome://polybrowser/skin/loading.gif');
						//Automatically timeout spinner after 45 seconds 
						window.setTimeout(stopSpinner, 45000, FavIcon);
							
						if(targetClick)
						{
							PolyStopButton = document.getElementById('polyStop-'+targetClick);
							PolyReloadButton = document.getElementById('polyReload-'+targetClick);
							if(PolyReloadButton)
							{
								PolyReloadButton.setAttribute('hidden','true');
								PolyStopButton.setAttribute('hidden','false');
							}
							setBrowserFocus();
						}
					}
				}
			}
		}
		
		//Activates at the END of activity - Repeated code below?  Check for unnecessary duplication...
		if (aFlag & Components.interfaces.nsIWebProgressListener.STATE_STOP)
		{
			//Detects if URL is loading into top level, rather than iframe.  May be inefficient... See https://developer.mozilla.org/en-US/docs/XUL/School_tutorial/Intercepting_Page_Loads?redirectlocale=en-US&redirectslug=XUL_School%2FIntercepting_Page_Loads
			if (aWebProgress.DOMWindow == aWebProgress.DOMWindow.top)
			{
				var window = null;
				var callbacks = aRequest.notificationCallbacks ? aRequest.notificationCallbacks : aRequest.loadGroup.notificationCallbacks;
				if(callbacks)
				{
					window = callbacks.getInterface(Components.interfaces.nsIDOMWindow);
					var TempId = window.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation)
                       .QueryInterface(Ci.nsIDocShell).chromeEventHandler.id;
					if(TempId)
					{
						targetClick = (TempId.split('-'))[1];
						FavIcon = document.getElementById('tabFavIcon-'+targetClick);
						if(FavIcon.src=="chrome://polybrowser/skin/loading.gif")
						{
							url = aRequest.originalURI.host;
							if(!url){url = aRequest.URI.host;}
								//Generic favicon if no URI is present:
							if(!url){FavIcon.setAttribute('src',"chrome://polybrowser/skin/favicons.png");}
							else {
									FavIcon.setAttribute('src',"http://www.google.com/s2/favicons?domain="+url);
									objActiveTabFavIcon.setAttribute("width", "16");
									objActiveTabFavIcon.setAttribute("height", "16");
									
								}
							
							if(url.indexOf('file:///') > -1 ){ stopSpinner(FavIcon);}
						}
						if(targetClick)
						{
							PolyStopButton = document.getElementById('polyStop-'+targetClick);
							PolyReloadButton = document.getElementById('polyReload-'+targetClick);
							if(PolyReloadButton)
							{
								PolyReloadButton.setAttribute('hidden','false');
								PolyStopButton.setAttribute('hidden','true');
							}
						}
						
						LoadingBrowser = document.getElementById('polyBrowser-'+targetClick);
						loadingContainer = document.getElementById('polyBrowserContainer-'+targetClick);
						if(LoadingBrowser)
						{
						pBrowserSetSize(loadingBrowser, loadingContainer);
						}	
						setBrowserFocus();
					}
				}
			}
		}
	}
	catch(ee){}}, onLocationChange: function(aProgress, aRequest, aURI){}, onProgressChange: function(aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot) { }, onStatusChange: function(aWebProgress, aRequest, aStatus, aMessage) { }, onSecurityChange: function(aWebProgress, aRequest, aState) { },

}

//Used to read document contents and set width of browsers.  Referenced in multiple functions.
function pBrowserSetSize (loadingBrowser, loadingContainer){
		var loadingBrowser = loadingBrowser;
		var loadingContainer = loadingContainer;
		var TempHeight = loadingBrowser.contentWindow.document.documentElement.height;
		var TempWidth = loadingBrowser.contentWindow.document.width;
		
							//Checks and sets document width. 
							if(!TempWidth){TempWidth = loadingBrowser.contentWindow.document.documentElement.scrollWidth;}
							if(TempWidth > 1000)
							{
								loadingContainer.width = TempWidth + 2; 
								if (TempWidth > 1400){ loadingContainer.width = 1400;}
							}
							//Leaves the width at minimum of 1000
							else if(TempWidth <= 1000)
							{
								loadingContainer.width = 1050;
							}
							// If width  = Null
							else {
								loadingContainer.width = 1150;
								}
							
							//Set the margin based on zoom
							var loadingMarginId = ((loadingContainer.id).split('-'))[1];
							setZoomMarginById(loadingMarginId);
}


//Double-clicking the tab bar creates a new tab.  Creates problems in full-screen mode.
function polyTabPanelDoubleClicked(e){if(e.originalTarget){if(e.originalTarget.id == 'tabContainer'){pBrowserNewTabClick('');}}}

var noPolyChrome = false;

//Looks at sites loaded in Firefox and loads them into PolyBrowser instead
function ListenerForDefaultAddressBar(aURI)
{

	var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
						   .getInterface(Components.interfaces.nsIWebNavigation)
						   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
						   .rootTreeItem
						   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
						   .getInterface(Components.interfaces.nsIDOMWindow);
		var tabs = mainWindow.gBrowser.tabs;

		//Check if window is a popup and hide poly chrome
		var contentWinWrapper = new XPCNativeWrapper(content, "document");
		var browserContainer = document.getElementById('browserContainer');
		if(contentWinWrapper.opener != null  && !window.toolbar.visible) //&& browserContainer.childNodes.length <= 1
				{ 
				noPolyChrome = true;
				var polyTabContainer = document.getElementById('polyTabContainer');
				polyTabContainer.classList.add("hidden");
				browserContainer.classList.add("hidden");
				var tabBrowser = document.getElementById('content');
				tabBrowser.setAttribute('style', '');
				tabBrowser.setAttribute('flex', '1');
				return;
					}	
		//Don't execute if it's the same URI
		if (aURI.spec == this.oldURL){
			document.getElementById('waitIndicator').style.display = "none";
			return;
			}
		this.oldURL = aURI.spec;
		var numPolyTabs = document.getElementById('tabArrowScroller').children.length;
		var loadDelay = 3000 + (numPolyTabs * 200);
		delayedCall("callLoadHiddenTabs()", loadDelay);
		
}

//Start global spinner
function startActivitySpinner(){
			document.getElementById('waitIndicator').style.display = "block";
}

//Limits the amount of time the spinner will show (for downloads)
function stopSpinner(favicon){
	favicon.setAttribute('src','chrome://polybrowser/skin/favicons.png');
}

//Selects the url bar on tab focus
function pBrowserFocus(event)
{
	var targetClick = ((event.currentTarget.id).split('-'))[1];
	var AddressBarElement = document.getElementById('polyAddressBar-'+targetClick);
	var thisFocus = document.activeElement.classList[0];
	var thisIndex = thisFocus.indexOf('textbox')
	if(AddressBarElement.value == "about:newtab"){
			AddressBarElement.value = "";
			AddressBarElement.focus();
			AddressBarElement.select();
			}
}

//
// This function will be used when location bar is visible
//
function newWebOpened(event)
{
	if (event.keyCode == event.DOM_VK_RETURN)
	{
		var LocationBar = document.getElementById("urlbar");
		pBrowserNewTabClick(LocationBar.value);
	}
}


//Once the browser load is complete - Code is necessary for PolyMarks to work
function polyBrowserLoadComplete(event)
{
	try
	{
		var targetClick = ((event.currentTarget.id).split('-'))[1];
		
		var activeBrowserControl = 'polyBrowser-'+targetClick;
		var activeAddressBarControl = 'polyAddressBar-'+targetClick;
		var activeTitleBarControl = 'polyTitle-'+targetClick;
		var activeTabPanel = 'tab-'+targetClick;
		var activeTabPanelLabel = 'tabPanelLabel-'+targetClick;
		var activeBookmarkButton = 'polyBookmark-'+targetClick;
		
		var activeTabFavIcon = 'tabFavIcon-'+targetClick;
		
		var urlName = "";
		var titleName = "";
		
		if(activeBrowserControl)
		{
			var objActiveBrowserControl = document.getElementById(activeBrowserControl);
			var objActiveAddressBar = document.getElementById(activeAddressBarControl);
			var objActiveTitle = document.getElementById(activeTitleBarControl);
			var objActiveTabPanel = document.getElementById(activeTabPanel);
			var objActiveTabPanelLabel = document.getElementById(activeTabPanelLabel);
			var objActiveBookmarkButton = document.getElementById(activeBookmarkButton);
			var objActiveTabFavIcon = document.getElementById(activeTabFavIcon);
			
			titleName = event.currentTarget.contentTitle;
			if(titleName.length >= 10)
			{
				titleName = titleName.substring(0,7);
				titleName = titleName + "...";
			}
			
		//	var barHasFocus = objActiveAddressBar.hasFocus();
			var addressValue = event.currentTarget.currentURI.spec;
			if (addressValue.indexOf('about:newtab') > -1) {} //alert("New Tab");
			else {objActiveAddressBar.value = event.currentTarget.currentURI.spec;}
		//	objActiveAddressBar.value = event.currentTarget.currentURI.spec;
			if(objActiveTitle)
			{
				//objActiveTitle.setAttribute("innerHTML",titleName);
				if(titleName == "")
					titleName = "Untitled";
				objActiveTitle.firstChild.data = titleName;
			}
			if(objActiveTabPanelLabel)
				objActiveTabPanelLabel.value = titleName;
			
			if(objActiveTabFavIcon && event.currentTarget.currentURI.spec == 'about:blank'){
						objActiveTabFavIcon.setAttribute("src","chrome://polybrowser/skin/favicons.png"); 
						}
			
			if(objActiveTabFavIcon && (event.currentTarget.currentURI.spec != 'about:newtab' && event.currentTarget.currentURI.spec != 'about:blank'))
			{
				try{host = event.currentTarget.currentURI.host;}
				catch(ee){host = event.currentTarget.currentURI.spec;}
				if(host) {objActiveTabFavIcon.setAttribute("src","http://www.google.com/s2/favicons?domain="+host);}
				else{objActiveTabFavIcon.setAttribute("src","chrome://polybrowser/skin/favicons.png");}
					objActiveTabFavIcon.setAttribute("width", "16");
					objActiveTabFavIcon.setAttribute("height", "16");
			}
			
			var bmsvc = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Components.interfaces.nsINavBookmarksService);
			var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
			var uri = ios.newURI(event.currentTarget.currentURI.spec, null, null);
			if (bmsvc.isBookmarked(uri))
			{
				objActiveBookmarkButton.setAttribute('src','chrome://polybrowser/skin/bookmarkEnable.png');
			}
			else
			{
				objActiveBookmarkButton.setAttribute('src','chrome://polybrowser/skin/bookmarkDisable.png');
			}
			
			//
			// Adding Flex Property to ArrowScroller Controller
			//
			var objPolyWrapper = document.getElementById('polyHomeWrapper');
			var objPolyArrowScroller = document.getElementById('tabArrowScroller');
			var objPolyNewTab = document.getElementById('newTab');
			
			var ArrowScrollWidth = 0;		
			var containerWidth = objPolyWrapper.boxObject.width + ArrowScrollWidth + objPolyNewTab.boxObject.width+10;
			var loadingContainer = objActiveBrowserControl.parentNode;
			
			//Only resize the browser once per URL - Detect old URL
			var oldURL = objActiveBrowserControl.getAttribute('oldUrl');
			if (oldURL != host){
					pBrowserSetSize(objActiveBrowserControl, loadingContainer);  //Global function for setting browser size
				}
			objActiveBrowserControl.setAttribute('oldUrl', host);
		
			//
			// Support for Polymark Page
			//
			var currentDomain = objActiveBrowserControl.contentWindow.document.domain;
			var currentDoc, PolymarkLaunchButtonArray,iLaunch=0, objPrevElement, objBody;
			if(currentDomain)
			{
				objActiveBrowserControl.contentWindow.document
				currentDomain = currentDomain.toLowerCase();
				if(currentDomain.indexOf('polymarks.com') > -1)
				{
					currentDoc = objActiveBrowserControl.contentWindow.document;
					objPrevElement = currentDoc.getElementById('polybrowserPrev');
					if(!objPrevElement)
					{
						if(currentDoc)
						{
							PolymarkLaunchButtonArray = currentDoc.getElementsByClassName('orange_btn');
							if(PolymarkLaunchButtonArray.length > 0)
							{
								// Add PrevElement
								objPrevElement = currentDoc.createElement('input');
								objPrevElement.setAttribute('id','polybrowserPrev');
								objPrevElement.setAttribute('type','text');
								objPrevElement.setAttribute('style','display:none');
								objBody = currentDoc.getElementsByTagName('body')[0];
								if(objBody){objBody.appendChild(objPrevElement);}
								
								for(iLaunch=0;iLaunch<PolymarkLaunchButtonArray.length;iLaunch++)
								{
									PolymarkLaunchButtonArray[iLaunch].setAttribute('onclick','');
									PolymarkLaunchButtonArray[iLaunch].addEventListener('click', polyLaunchListener,true);
								}
							}
						}
					}
				}
			}
			
			// Support for polymark extension to collect website name		
			// let doc = event.originalTarget;
			// var currentDomain = objActiveBrowserControl.contentWindow.document.domain;
			// var url = doc.defaultView.location.href;
			var url = objActiveBrowserControl.contentWindow.document.location.href;
			if (( url.indexOf("http://polymarks.com/collecting") == 0) || ( url.indexOf("http://www.polymarks.com/collecting") == 0) )
			{
				var newDate = new Date;
				var xrenovina = newDate.getTime();
				
				PostUrls( "http://polymarks.com/collect/" + xrenovina, xrenovina, function()
				{
					//doc.defaultView.location.href = "http://polymarks.com/collect/" + xrenovina;	
					objActiveBrowserControl.contentWindow.document.location.href = "http://polymarks.com/collect/" + xrenovina;
				});
			}
			
		}
	}
	catch(ee)
	{
		
	}
}

//Listens for PolyMarks "Launch" button
function polyLaunchListener(event)
{
	try
	{
		// Search The Accurate Browser Object
		// in which Launch Button pressed
		var TempFetchBrowserName = event.view.name;
		var TargetBrowser, objActiveBrowserControl;
		if(TempFetchBrowserName.indexOf('polyBrowser') > -1){TargetBrowser = TempFetchBrowserName;}
		var TargetLinkArray,i=0,tempUrl;
		if(TargetBrowser)
		{
			objActiveBrowserControl = document.getElementById(TargetBrowser);
			if(objActiveBrowserControl)
			{
				var currentDomain = objActiveBrowserControl.contentWindow.document.domain, currentDoc, objBody;
				if(currentDomain.indexOf('polymarks.com') > -1)
				{
					currentDoc = objActiveBrowserControl.contentWindow.document;
					objBody = currentDoc.getElementsByTagName('body')[0];
					var TargetLinkArray = currentDoc.getElementsByClassName('check_in');
					if(TargetLinkArray.length > 0)
					{
						for(i=0;i<TargetLinkArray.length;i++)
						{
							if(TargetLinkArray[i].checked)
							{
								tempUrl = TargetLinkArray[i].alt;
								if(tempUrl && tempUrl!="")
								{
									pBrowserNewTabClick('http://'+tempUrl);
								}
							}
						}
					}
				}
			}
		}
	}
	//TODO add exception handling?
	catch(ee){}
}

//When PolyBrowser tab is clicked, 
function pBrowserTabClick(e){
	var clickTabNumber = ((e.originalTarget.id).split('-'))[1];
	pBrowserGoTab(clickTabNumber);	
}

//Returns the currently active browser object
function PolyActiveBrowser(){
	try
	{
		var objActivateBrowser = "", StartIndex = 0, EndIndex = TabCountStart+1, TempObj, targetClick;
		
		//Set default browser
		var browserCollection = document.getElementsByTagName('browser');
		var browserArray = collectionToArray(browserCollection);
		objActivateBrowser = browserArray[0];
		
		for(StartIndex=0;StartIndex<EndIndex;StartIndex++)
		{
			TempObj = document.getElementById('tab-'+StartIndex);
			if(TempObj!=null)
			{
				if(TempObj.getAttribute('class') == 'tabnormal')
				{
					targetClick = ((TempObj.id).split('-'))[1];
					objActivateBrowser = document.getElementById('polyBrowser-'+targetClick);
				}
			}
		}

	return objActivateBrowser;
	}
	catch(ee)
	{
		alert(ee.message);
	}
}

//Returns the currently active tab object
function PolyActiveTab(){
	try
	{
		var objActivateTab = "", StartIndex = 0, EndIndex = TabCountStart+1, TempObj, targetClick;
		
		//Set default tab object
		var polyTabs = document.getElementById('tabArrowScroller').children;
		var tabArray = collectionToArray(polyTabs);
		objActivateTab = tabArray[0];
		
		for(StartIndex=0;StartIndex<EndIndex;StartIndex++)
		{
			TempObj = document.getElementById('tab-'+StartIndex);
			if(TempObj!=null)
			{
				if(TempObj.getAttribute('class') == 'tabnormal')
				{
					objActivateTab = TempObj;
					
				}
			}
		}	
		return objActivateTab;
	}
	catch(ee)
	{
		alert(ee.message);
	}
}

//Activate browser's tab on click anywhere in browser
function activateBrowser(id){
		var currentTab = PolyActiveTab();
		var currentTabNumber = ((currentTab.id).split('-'))[1];
		var clickTabNumber = ((id).split('-'))[1];
		
		if (currentTabNumber == clickTabNumber){return;}
		
		var clickedTab = document.getElementById('tab-'+clickTabNumber);
		var clickedBrowser = document.getElementById('polyBrowser-'+clickTabNumber);
		var clickedControlPanel = document.getElementById('polyBrowserControlPanel-'+clickTabNumber);
		clickedTab.setAttribute('class','tabnormal');
		clickedBrowser.setAttribute('class','pBrowserActive');
		clickedControlPanel.setAttribute('class','browserControlPanel');
		
		var polyTabs = document.getElementById('tabArrowScroller').children;
		var numPolyTabs = document.getElementById('tabArrowScroller').children.length;

		for(var i = 0; i < numPolyTabs; i++){	
			if(clickedTab != polyTabs[i]){
					polyTabs[i].setAttribute('class','tabdisabled');
					var thisNumber = ((polyTabs[i].id).split('-'))[1];
					document.getElementById('polyBrowser-' + thisNumber).setAttribute('class','pBrowserHidden');
					document.getElementById('polyBrowserControlPanel-' + thisNumber).setAttribute('class','browserControlPanelDisabled');
				}
		}

		setBrowserFocus();
}

//Sets the browser as active - for "this" references in extensions
function setBrowserFocus(){

	var focusManager = Components.classes["@mozilla.org/focus-manager;1"]
                     .getService(Components.interfaces.nsIFocusManager);
	
	var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)  
					.getInterface(Components.interfaces.nsIWebNavigation)  
					.QueryInterface(Components.interfaces.nsIDocShellTreeItem)  
					.rootTreeItem  
					.QueryInterface(Components.interfaces.nsIInterfaceRequestor)  
					.getInterface(Components.interfaces.nsIDOMWindow); 
	var gBrowser = mainWindow.gBrowser;
	var _this = PolyActiveBrowser();
	focusManager.setFocus(_this, 1);

	mainWindow.gBrowser.updateCurrentBrowser(true);

}


//Activates a tab when scrolled (ex. a wheel mouse hover and scroll)
var lastScrolledBrowser = 0;
function activateOnScroll(browser){
		var browserNumber = ((browser.id).split('-'))[1];
		if(browserNumber != lastScrolledBrowser){
			var thisBrowser = "polyBrowser-" + browserNumber;
			activateBrowser(thisBrowser);
			}
}

//Get next sibling of active tab and go
function pBrowserNextTab(){
	var e = PolyActiveTab(); 
	e = e.nextSibling.id;
	var clickTabNumber = (e.split('-'))[1];
	pBrowserGoTab(clickTabNumber);
}

//Get previous sibling of active tab and go
function pBrowserPrevTab(){
	var e = PolyActiveTab(); 
	e = e.previousSibling.id;
	var clickTabNumber = (e.split('-'))[1];
	pBrowserGoTab(clickTabNumber);
}


//activate and scroll to tab
function pBrowserGoTab(clickTabNumber){
	try
	{
		var clickTabNumber = clickTabNumber;
		var clickedTab = document.getElementById('tab-'+clickTabNumber);
		var clickedBrowser = document.getElementById('polyBrowserContainer-'+clickTabNumber);
		var clickedIndex = -1,counter;
		var clickedParent;
		var computedPadding = null;
		// Finding accurate element index here
		if(clickedTab)
		{
			clickedParent = clickedTab.parentNode;
			for(counter=0;counter<clickedParent.children.length;counter++)
			{
				if(clickedParent.children[counter] == clickedTab){clickedIndex = counter+1; break;}
			}
		}
		
		// Scroll the horizontal scroller
		if(clickedIndex != -1)
		{
			var objBrowserContainer = document.getElementById('browserContainer');
			var browserWidth = clickedBrowser.boxObject.width;
			if (browserWidth < objBrowserContainer.boxObject.width) {
				computedPadding = (objBrowserContainer.boxObject.width - browserWidth) / 2;
				}
			else {computedPadding = 0;}
			var LeftPos = clickedBrowser.boxObject.x;
		//Turned off due to performance reasons
			polyAnimateScroll(LeftPos - computedPadding - 16);
		}
		var thisId = clickedTab.id;
		window.setTimeout(activateBrowser, 32, thisId);
		
		//Select corresponding background FF tab
		if(pCustomizing == false){
				var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
								   .getInterface(Components.interfaces.nsIWebNavigation)
								   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
								   .rootTreeItem
								   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
								   .getInterface(Components.interfaces.nsIDOMWindow);
				var activeBrowser = document.getElementById('polyBrowser-' + clickTabNumber);
				var browserCollection = document.getElementsByTagName('browser');
				var browserArray = collectionToArray(browserCollection);
				var tabIndex = browserArray.indexOf(activeBrowser);
			//	console.log("clickedTab " + tabIndex);

				mainWindow.gBrowser.selectTabAtIndex(tabIndex);
			}
	}
	//TODO add exception handling?
	catch(ee){}


}

//Go to a particular tab based on index
function pBrowserGoTabIndex(tabIndex){
	var tabContainer = document.getElementById('tabArrowScroller');
	var thisTab = tabContainer.childNodes[tabIndex].id
	var clickTabNumber = (thisTab.split('-'))[1];
	pBrowserGoTab(clickTabNumber);
}

//Go to the last tab
function pBrowserGoTabLast(){
	var tabContainer = document.getElementById('tabArrowScroller');
	var tabList = tabContainer.childNodes;
	var lastTab = tabList.length - 1;
	var thisTab = tabContainer.childNodes[lastTab].id;
	var clickTabNumber = (thisTab.split('-'))[1];
	pBrowserGoTab(clickTabNumber);
}

//Go to the user's homepage
function polyGoHome(){
	var urlName = "";
	var thisTab = PolyActiveBrowser();
	var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components. interfaces.nsIPrefBranch);
	var urlName = prefs.getCharPref('browser.startup.homepage');
	if(urlName!='' && urlName.indexOf('://')>-1){ }
	else{urlName = "http://polyfetch.com/default.aspx#gsc.tab=0&gsc.q="+urlName;}
	thisTab.setAttribute('src', urlName);
}

//Scroll browserContainer to the correct position when a new tab is created
function pBrowserNewNodeBrowserScroll(clickTab)
{
	var clickTabNumber = parseInt(clickTab.replace('tab-',''));
	var objBrowserContainer = document.getElementById('browserContainer');
	
	var ComputedPadding = (objBrowserContainer.clientWidth - 1000)/2;
	var LeftPos = (1000*(clickTabNumber-1))+2*(ComputedPadding*clickTabNumber);
	
	var BrowserContainerArray = objBrowserContainer.getElementsByTagName('browser');
	
	if(clickTabNumber==1) LeftPos = 0;
	else if(clickTabNumber == BrowserContainerArray.length){}
	else LeftPos = LeftPos-20;
	
	objBrowserContainer.scrollLeft = LeftPos;
	var StartIndex = 0, EndIndex = TabCountStart+1, TempObj;
	for(StartIndex=0;StartIndex<EndIndex;StartIndex++)
	{
		TempObj = document.getElementById('tab-'+StartIndex);
		if(TempObj!=null){TempObj.setAttribute('class','tabdisabled');}
	}
	(document.getElementById(clickTab)).setAttribute('class','tabnormal');
	var objArrowScroll = document.getElementById('tabArrowScroller');
	if(objArrowScroll){objArrowScroll.scrollByIndex(clickTabNumber);}
	return;
}

//Reads scroll distance of browserContainer and activates tabs according to what browser is shown (Not currently used)
function polyBrowserContainerScrolled()
{

	if(middleDrag == true || zoomLevel > 5){return;}
	var StartIndex = 0, EndIndex = TabCountStart+1, TempObj;
	for(StartIndex=0;StartIndex<EndIndex;StartIndex++)
	{
		TempObj = document.getElementById('tab-'+StartIndex);
		if(TempObj!=null){TempObj.setAttribute('class','tabdisabled');}
	}

	var BrowserContainer = document.getElementById('browserContainer');
	var ComputedPadding = (BrowserContainer.clientWidth - 1000)/2;
	var ScrolledElement = parseInt((BrowserContainer.scrollLeft + ComputedPadding)/1030);
	
	// Work for last tab position
	if((BrowserContainer.scrollLeft + 1030 + (2*ComputedPadding)) > BrowserContainer.scrollWidth)
	{
		ScrolledElement = (BrowserContainer.getElementsByTagName('browser')).length;
		ScrolledElement = ScrolledElement - 1;
	}
		
	var MainTabContainer = document.getElementById('tabArrowScroller');
	if(MainTabContainer)
	{
		(MainTabContainer.children[ScrolledElement]).setAttribute('class','tabnormal');
	}

}

//Slides browserContainer to the correct position on tab click
function polyAnimateScroll(position){
	
	var numPolyTabs = document.getElementById('tabArrowScroller').children.length;
	if (numPolyTabs <= 1)return;
	
	var objBrowserContainer = document.getElementById('browserContainer');
	var currentPos = objBrowserContainer.scrollLeft;
	
	if(position - currentPos > 1) var distance = position - currentPos;
	else var distance = currentPos - position;
	
	//Animated slide.  Removed for performance reasons
/*
	if(distance > 100){
	
			var rules = [];
			rules = document.styleSheets[6].cssRules;
	
			if(position > currentPos){var newLeft = 25;}
			else {var newLeft = -25;}
	
			document.styleSheets[6].deleteRule(4);
			var browserCss = "@keyframes browserSlide" + tabAnimationCount + " {0% {margin-left:" + newLeft + "px; } 100% {margin-left:2px; }}";
			document.styleSheets[6].insertRule(browserCss, 4);
	
			rules[5].style.animationName = 'browserSlide' + tabAnimationCount;
		//	rules[5].style.animationIterationCount = '1';
		//	rules[5].style.animationPlayState = 'running';
		}
*/	
	objBrowserContainer.scrollLeft = position;
	tabAnimationCount++;
}

//Pulls URL info out of URL bar and executes Go button on Return
function TextOnKeyEntered(event)
{
	if(event.keyCode==13 && (event.ctrlKey))
	{
		var targetClick = ((event.originalTarget.id).split('-'))[1];
		if(!targetClick){targetClick = ((event.currentTarget.id).split('-'))[1];}
		var objActiveAddressBar = document.getElementById('polyAddressBar-'+targetClick);
		
		var GetValue="";
		if(objActiveAddressBar)
		{
			GetValue = objActiveAddressBar.value;
			if(GetValue.indexOf('http://') == -1){GetValue = "http://"+GetValue;}
			objActiveAddressBar.value = GetValue;
			polyGoButtonClicked(event);
		}
	}
	else if(event.keyCode==13){polyGoButtonClicked(event);}
}

function ReadFromPref(keyname)
{
	var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components. interfaces.nsIPrefBranch);
	return prefs.getCharPref(keyname);
}

function WriteToPref(keyname,keyvalue)
{
	var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components. interfaces.nsIPrefBranch);
	prefs.setCharPref(keyname,keyvalue);
}


//On load, looks at the websites open from last time (not working yet).
function pBrowserOnload()
{
	//const urlbar = document.getElementById("nav-bar");
	//urlbar.addEventListener('keypress', newWebOpened , true);
	
	try
	{
		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)  
							.getInterface(Components.interfaces.nsIWebNavigation)  
							.QueryInterface(Components.interfaces.nsIDocShellTreeItem)  
							.rootTreeItem  
							.QueryInterface(Components.interfaces.nsIInterfaceRequestor)  
							.getInterface(Components.interfaces.nsIDOMWindow); 
		
		var gBrowser = mainWindow.gBrowser;
		gBrowser.addProgressListener(myExt_urlBarListener, Components.interfaces.nsIWebProgress.NOTIFY_LOCATION);
	}
	catch(ee1){}
	
	
	var urlList = ReadFromPref('extensions.polybrowser.preweblist');
	WriteToPref('extensions.polybrowser.preweblist','');
	
	var urlListDisableMode = ReadFromPref('extensions.polybrowser.predisablemode');
	WriteToPref('extensions.polybrowser.predisablemode','');
	//
	// Adding Listener for first tab 
	//
	if(urlList == "")
	{
		if(urlListDisableMode != "")
		{
			urlListDis = urlListDisableMode.split('##--##');
			for(i=0;i<urlListDis.length;i++)
			{
				pBrowserNewTabClick(urlListDis[i]);
			}
		}
		else
		{
			pBrowserNewTabClick('about:newtab');
		}
	}
	else 
	{
		pBrowserNewTabClick(urlList);
	}
	var objBrowser = document.getElementById("polyBrowser-1");
	if(objBrowser)
	{
		objBrowser.addEventListener('load', polyBrowserLoadComplete , true);
		objBrowser.addProgressListener(PolyBrowserListener);
	}
	
	
	
}

//pBrowserOnLoad();


//Selects text of URL bar of the active tab
function selectActiveAddressBar(){
		var activeBrowser = PolyActiveBrowser();
		var controlCounter = ((activeBrowser.id).split('-'))[1];
		var selectBar = document.getElementById('polyAddressBar-' + controlCounter);
		selectBar.select();
}

function PolyPrintSupport()
{
	try
	{
		var objActivateBrowser = "", StartIndex = 0, EndIndex = TabCountStart+1, TempObj, targetClick;
		for(StartIndex=0;StartIndex<EndIndex;StartIndex++)
		{
			TempObj = document.getElementById('tab-'+StartIndex);
			if(TempObj!=null)
			{
				if(TempObj.getAttribute('class') == 'tabnormal')
				{
					targetClick = ((TempObj.id).split('-'))[1];
					objActivateBrowser = document.getElementById('polyBrowser-'+targetClick);
				}
			}
		}
		if(objActivateBrowser)
		{
			PrintUtils.print(objActivateBrowser.contentWindow);
			//PrintUtils.enterPrintPreview(objActivateBrowser.contentWindow);
		}
	}
	catch(ee)
	{
		//alert(ee.message);
	}
}

function PolyPrintPreviewSupport()
{
	try
	{
		var objActivateBrowser = "", StartIndex = 0, EndIndex = TabCountStart+1, TempObj, targetClick;
		for(StartIndex=0;StartIndex<EndIndex;StartIndex++)
		{
			TempObj = document.getElementById('tab-'+StartIndex);
			if(TempObj!=null)
			{
				if(TempObj.getAttribute('class') == 'tabnormal')
				{
					targetClick = ((TempObj.id).split('-'))[1];
					objActivateBrowser = document.getElementById('polyBrowser-'+targetClick);
				}
			}
		}
		if(objActivateBrowser)
		{
			//PrintUtils.print(objActivateBrowser.contentWindow);
			PrintUtils.enterPrintPreview(objActivateBrowser.contentWindow);
		}
	}
	catch(ee)
	{
		//alert(ee.message);
	}
}

function PolyBookmarkSupport()
{
	var objActivateBrowser = "", StartIndex = 0, EndIndex = TabCountStart+1, TempObj, targetClick;
	for(StartIndex=0;StartIndex<EndIndex;StartIndex++)
	{
		TempObj = document.getElementById('tab-'+StartIndex);
		if(TempObj!=null)
		{
			if(TempObj.getAttribute('class') == 'tabnormal')
			{
				targetClick = ((TempObj.id).split('-'))[1];
				objActivateBrowser = document.getElementById('polyBrowser-'+targetClick);
			}
		}
	}
	if(objActivateBrowser && targetClick)
	{
		var fetchTitle = document.getElementById('polyTitle-'+targetClick).firstChild.textContent;
		var fetchUrl = document.getElementById('polyAddressBar-'+targetClick).value;
		var objbookmark = document.getElementById('polyBookmark-'+targetClick);
		
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
					bmsvc.insertBookmark(bmsvc.bookmarksMenuFolder, uri, bmsvc.DEFAULT_INDEX, fetchTitle); 
					objbookmark.setAttribute('src','chrome://polybrowser/skin/bookmarkEnable.png');
				}
				else
				{
					var bookmarksArray = bmsvc.getBookmarkIdsForURI(uri, {});
					for(i=0;i<bookmarksArray.length;i++){bmsvc.removeItem(bookmarksArray[i]);}
					objbookmark.setAttribute('src','chrome://polybrowser/skin/bookmarkDisable.png');
				}
			}
		}
	}
}

function PolySaveActive(){
		var thisPage = PolyActiveBrowser().contentDocument;
		saveDocument(thisPage);
}

//Adds listener to default URL bar
function RepositionNewTab()  // Including onload functionality if there is no tab opened, Read/write from preferences
{
	try
	{
		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)  
						.getInterface(Components.interfaces.nsIWebNavigation)  
						.QueryInterface(Components.interfaces.nsIDocShellTreeItem)  
						.rootTreeItem  
						.QueryInterface(Components.interfaces.nsIInterfaceRequestor)  
						.getInterface(Components.interfaces.nsIDOMWindow); 
	
		var gBrowser = mainWindow.gBrowser;
		gBrowser.addProgressListener(myExt_urlBarListener, Components.interfaces.nsIWebProgress.NOTIFY_STATE_REQUEST);
	//	gBrowser.addProgressListener(myExt_urlBarListener, Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT);
	}
	catch(e1){}
	
}

function openSideBar(){
	toggleSidebar("viewHistorySidebar");

	
	var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		 .getInterface(Components.interfaces.nsIWebNavigation)
		 .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
		 .rootTreeItem
		 .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		 .getInterface(Components.interfaces.nsIDOMWindow);
	
	var sidebarWindow = mainWindow.document.getElementById("sidebar");
	
		openWebPanel("PolyFetch Web Search", "http://polysuite.com/PolyBrowser/search/index.html");
}

try {setTimeout("RepositionNewTab()", 150);} 
//todo add exception handling?
catch (e){}



//Observe the global download list
var dJsm = Components.utils.import("resource://gre/modules/Downloads.jsm").Downloads;
var tJsm = Components.utils.import("resource://gre/modules/Task.jsm").Task;
var fuJsm = Components.utils.import("resource://gre/modules/FileUtils.jsm").FileUtils;
var nsiPromptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
var MODULE_REQUIRES = ['DownloadsAPI'];
/*
var dm = new DownloadsAPI.downloadManager();
var controller = mozmill.getBrowserController;
dm.open(controller, true);
*/
var view = {
   onDownloadChanged: function (download) {
   		BrowserDownloadsUI();
   		dm.open(controller, true);
      if (download.succeeded && download.target.path.substr(-4) == ".scn") {
         var file = fuJsm.File(download.target.path);
         var moveToDir = fuJsm.File(prefs.getCharPref("destination_directory")); //var dir = fuJsm.File('C:\\blah\\blah');
         if (moveToDir.exists()) {
            file.moveTo(moveToDir, file.leafName);
         } else {
            nsiPromptService.alert(null, "Error", 'Directory does not exist!');
         }
      }
   }
};
tJsm.spawn(function () {
   let list = yield dJsm.getList(Downloads.ALL);
   list.addView(view);
}).then(null, Components.utils.reportError);

//Utility function to convert HTML collections to arrays
function collectionToArray(aCollection){
			    var ary = [];
				for(var i=0, len = aCollection.length; i < len; i++)
				{
					ary.push(aCollection[i]);
				}
          		return ary;
}