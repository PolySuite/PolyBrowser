/////////////Handles observers that run in the background

Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource:///modules/PlacesUIUtils.jsm");
Components.utils.import("resource://gre/modules/Downloads.jsm");


//Utility to ignore a function for a certain period of time
var delayedCallLocked = false;
var delayCallInterval;
function delayedCall(func, milliseconds){
	
	if (delayedCallLocked === false){
			window.setTimeout(func, 400);
			delayedCallLocked = true;
			delayCallInterval = window.setInterval(func, milliseconds);
			var stop = (milliseconds * 100);
			window.setTimeout(stopDelayedCall, stop);
		}	
}

function stopDelayedCall(){
			window.clearInterval(delayCallInterval);
			delayedCallLocked = false;
		}

//Pulls the number of tabs open in Firefox (hidden)
function numBackgroundTabs(){
		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
						   .getInterface(Components.interfaces.nsIWebNavigation)
						   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
						   .rootTreeItem
						   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
						   .getInterface(Components.interfaces.nsIDOMWindow);
		var tabs = mainWindow.gBrowser.tabs;
		return tabs.length;
}


//Sees if browser has visited Polysuite.com this session to allow reporting
var firstPing = false;

//Prevent double loading of tabs
var isLoadingHiddenTabs = false;
var globalSpinnerTimeout;

//Checks to see if loadHiddenTabs() is already executing to prevent double-execution
function callLoadHiddenTabs(){
		if(isLoadingHiddenTabs == true){return;}
		else{loadHiddenTabs();}
}

function setNotLoadingHiddenTabs(){	isLoadingHiddenTabs = false;}

//Loops through the hidden Firefox tabs and opens them in PolyBrowser instead
function loadHiddenTabs(){
		//Don't execute if function is already in progress
		if(isLoadingHiddenTabs == true){return;}
		isLoadingHiddenTabs = true;
		
		if(pCustomizing == true){return;}
			
			
		 //Don't execute if window is a popup
		var contentWinWrapper = new XPCNativeWrapper(window, "document");
		if(contentWinWrapper.opener != null  && !window.toolbar.visible){return;}

		
		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
							   .getInterface(Components.interfaces.nsIWebNavigation)
							   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
							   .rootTreeItem
							   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
							   .getInterface(Components.interfaces.nsIDOMWindow);
		var tabs = mainWindow.gBrowser.tabs;
		var tabsLength = tabs.length;
		var tabList = document.getElementById('tabbrowser-tabs');

		var numPolyTabs = document.getElementById('tabArrowScroller').children.length;
		
		//Show a loading spinner if there are tabs to be opened
		if (tabsLength > numPolyTabs){ 
					document.getElementById('waitIndicator').style.display = "block";
					globalSpinnerTimeout = window.setTimeout(stopGlobalSpinner, 30000);
					}
		else { 
					stopGlobalSpinner();	
					window.clearTimeout(globalSpinnerTimeout);
					}

	var tempUrl;
	var urlToOpen;
	var aboutBlankLoadedTab = 0;

		//Loop through tabs and convert them to blank after opening in PolyBrowser
		for (var i = 0; i < tabsLength; i++){
				var tab = tabs[i];
				var bTab = mainWindow.gBrowser.polyGetBrowserForTab(tab);			
				tempUrl = bTab.currentURI.spec;
				urlToOpen = tempUrl.valueOf();
				if(tempUrl.indexOf('wyciwyg://') > -1) {	} 
				else if (tempUrl == 'about:blank#loaded'){aboutBlankLoadedTab++;}
				else if (tempUrl != 'about:blank#loaded'){ 
						if(tempUrl == 'about:home' ){ urlToOpen = 'about:newtab';}
						else if(tempUrl == 'http://polysuite.com/PolyBrowser/ga/index.html' || tempUrl == 'about:blank#customizing'){ 
								urlToOpen = 'about:blank#loaded'; 
								bTab.setAttribute('src','about:blank#loaded' );
								bTab.loadURI('about:blank#loaded');
								}			

						if(urlToOpen.indexOf('about:blank') == -1 ) {	
								if(numPolyTabs > 0){ window.setTimeout(pBrowserOpenInNewTabUnfocussed, 16, urlToOpen);} 
								else{window.setTimeout(pBrowserNewTabClick, 16, urlToOpen);}
							 	urlToOpen = 'about:blank#loaded';
								bTab.setAttribute('src','about:blank#loaded' );
								bTab.loadURI('about:blank#loaded');
							 } 
					}
				if (firstPing == false && tempUrl.indexOf('about:blank#loaded') > -1) {
						//Go to PolySuite tracking site to allow reporting
						bTab.loadURI("http://polysuite.com/PolyBrowser/ga/index.html");
						firstPing = true;
						}
			}
	if(aboutBlankLoadedTab == tabsLength && aboutBlankLoadedTab == numPolyTabs){stopDelayedCall();}
	window.setTimeout(setNotLoadingHiddenTabs, 1000);
	window.setTimeout(removeHiddenTabs, 200);
	window.setTimeout(removePolyTabs, 300);
}

function stopGlobalSpinner(){ document.getElementById('waitIndicator').style.display = "none";}

//Checks to see if there are no tabs open in PolyBrowser, and loads one if needed
function alwaysOneTab(){

		 //Don't execute if window is a popup
		var contentWinWrapper = new XPCNativeWrapper(window, "document");
		if(!window.toolbar.visible){return;}

		var numPolyTabs = document.getElementById('tabArrowScroller').children.length;
		if (numPolyTabs == 0){
				var urlName = "";
				var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components. interfaces.nsIPrefBranch);
				var urlName = prefs.getCharPref('browser.startup.homepage');
				if(urlName == 'about:home' || urlName == 'chrome://branding/locale/browserconfig.properties') { pBrowserNewTabClick('about:newtab');}
				else  { pBrowserNewTabClick(urlName);}
				}
		}	
window.setTimeout(alwaysOneTab, 4000);

var lastBrowserId;

//If only one tab exists, mazimize it fill available area
function checkOneTabMaximize(){
	var numTabs = document.getElementById('tabArrowScroller').children.length;
	var BrowserContainer = document.getElementById('browserContainer');
	
	if (numTabs == 1){
		BrowserContainer.style.paddingLeft = "2px";
		BrowserContainer.style.paddingRight = "2px";
		var objActivateTab = "", StartIndex = 0, EndIndex = TabCountStart+1, TempObj, targetClick;
		for(StartIndex=0;StartIndex<EndIndex;StartIndex++)
		{
			TempObj = document.getElementById('tab-'+StartIndex);
			if(TempObj!=null)
			{
				if(TempObj.getAttribute('class') == 'tabdisabled')
				{
					TempObj.setAttribute('class', 'tabnormal');
				}
			}
		}
		
	
	}
	if ((numTabs == 1) && (zoomLevel == 5)){
		var thisBrowser = PolyActiveBrowser();
		var activeBrowser = thisBrowser.parentNode;
		lastBrowserId = ((activeBrowser.id).split('-'))[1];

		var objActivateTab = "", StartIndex = 0, EndIndex = TabCountStart+1, TempObj, targetClick;
		for(StartIndex=0;StartIndex<EndIndex;StartIndex++)
		{
			TempObj = document.getElementById('polyBrowserContainer-'+StartIndex);
			if(TempObj!=null)
			{
				if(TempObj.getAttribute('flex') == 0)
				{
					TempObj.setAttribute('flex', 1);
					document.getElementById('pContainerResizer-' + lastBrowserId).style.visibility = "collapse";
				}
			}
		}
		
		}
		
	if ((numTabs > 1) || (numTabs == 1 && zoomLevel > 5)){	
		var objActivateTab = "", StartIndex = 0, EndIndex = TabCountStart+1, TempObj, targetClick;
		for(StartIndex=0;StartIndex<EndIndex;StartIndex++)
		{
			TempObj = document.getElementById('polyBrowserContainer-'+StartIndex);
			if(TempObj!=null)
			{
				if(TempObj.getAttribute('flex') == 1)
				{
					TempObj.setAttribute('flex', 0);
					document.getElementById('pContainerResizer-' + StartIndex).style.visibility = "visible";
					break;
				}
			}
		}
		
	}
	if (numTabs > 1){		
			BrowserContainer.style.paddingLeft = "80px";
			BrowserContainer.style.paddingRight = "80px";
			}
}


try {setTimeout(checkOneTabMaximize, 1100);} 
catch (e){}


var tabCollapseState = 0;

//Adjusts the tab bar flex attribute to fill the needed space, depending on size of browser and size of tabs open
function setTabBarFlex(){
			//
			// Add Flex Property to ArrowScroller Controller
			//
			var objPolyWrapper = document.getElementById('polyHomeWrapper');
			
			var objPolyNewTab = document.getElementById('newTab');
			var objPolyUtilities = document.getElementById('utilityContainer');
			var activeTab = PolyActiveTab();
			var objPolyArrowScroller = document.getElementById('tabArrowScroller');
			var ArrowScrollWidth = 0;
			var fullTabWidth = 0;
			var tabMinusCloseButton = 0;
			if(objPolyArrowScroller)
			{
				for(iCount=0;iCount<objPolyArrowScroller.children.length;iCount++)
				{
					if(objPolyArrowScroller.children[iCount])
					{
						ArrowScrollWidth += objPolyArrowScroller.children[iCount].clientWidth;
						fullTabWidth += 99;
						tabMinusCloseButton += (activeTab.boxObject.width - 10);
					}
				}
			}
			
			var containerWidth = objPolyWrapper.boxObject.width + ArrowScrollWidth + objPolyNewTab.boxObject.width + objPolyUtilities.boxObject.width;
			var fullTabWidthTotal = objPolyWrapper.boxObject.width + fullTabWidth + objPolyNewTab.boxObject.width + objPolyUtilities.boxObject.width;
			var tabMinusCloseButtonTotal = objPolyWrapper.boxObject.width + tabMinusCloseButton + objPolyNewTab.boxObject.width + objPolyUtilities.boxObject.width;

					
			var rules = [];
			rules = document.styleSheets[6].cssRules;
			
			//Collapse so that the [+] button sticks to the right of the tabs
			if(window.innerWidth < containerWidth) { objPolyArrowScroller.setAttribute('flex','1'); }
			else { objPolyArrowScroller.setAttribute('flex','0'); }

			if(window.innerWidth < fullTabWidthTotal) {
					rules[1].style.display = 'none';
					rules[2].style.display = 'none';
					tabCollapseState = 1;
				}
			else { 
					rules[1].style.display = 'block';
					rules[2].style.display = 'block';
					tabCollapseState = 0;
				}
			
}

try {setTimeout(setTabBarFlex, 1000);} 
//todo add exception handling?
catch (e){}

//Observes background Firefox tabs and triggers a loadHiddenTabs function when needed
function tabObserver(){
		
		var numPolyTabs = document.getElementById('tabArrowScroller').children.length;
		var loadDelay = 1000 + (numPolyTabs * 200);
		// select the target node
		var target = document.getElementById('tabbrowser-tabs');
 
		// create an observer instance
		var observer = new MutationObserver(function(mutations) {

		  //   startActivitySpinner();
		     delayedCall(callLoadHiddenTabs, loadDelay);
		});
 
		// configuration of the observer:
		var config = { attributes: true, childList: true, characterData: true };
 
		// pass in the target node, as well as the observer options
		observer.observe(target, config);	
}


try {setTimeout("tabObserver()", 2000);} 
//todo add exception handling?
catch (e){}

//Observes the number of PolyBrowser tabs, and triggers certain functions when needed
function polyTabObserver(){
		// select the target node
		var target = document.getElementById('tabArrowScroller');
 
		// create an observer instance
		var observer = new MutationObserver(function(mutations) {
		    window.setTimeout(checkOneTabMaximize, 25);
		    window.setTimeout(setTabBarFlex, 25);
		    //window.setTimeout(callLoadHiddenTabs, 500);
		    delayedCall(callLoadHiddenTabs, 500);
		});
 
		// configuration of the observer:
		var config = { childList: true };
 
		// pass in the target node, as well as the observer options
		observer.observe(target, config);
}
try {setTimeout("polyTabObserver()", 2500);} 
//todo add exception handling?
catch (e){}

//Removes or adds Firefox tabs in the background to match the number of PolyBrowser tabs
 function removeHiddenTabs(){
 
 		if(pCustomizing == true){return;}

 		//Don't execute if window is a popup
		var contentWinWrapper = new XPCNativeWrapper(window, "document");
		if(contentWinWrapper.opener != null  && (!window.toolbar.visible || !window.menubar.visible)){return;}

		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
							   .getInterface(Components.interfaces.nsIWebNavigation)
							   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
							   .rootTreeItem
							   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
							   .getInterface(Components.interfaces.nsIDOMWindow);
		var tabs = mainWindow.gBrowser.tabs;
		var tabsLength = tabs.length;
		var tabsArray = collectionToArray(tabs);
		
		//Adjusting counter to match tab index, which starts at zero
		var tabsMinusOne = tabsLength - 1;
		
		//Don't open about:blank tabs in PolyBrowser
		//Initialize loop vars
		var tab;
		var bTab;
		var tabDoc; 
		
		var numPolyTabs = document.getElementById('tabArrowScroller').children.length;
		var activeTab = mainWindow.gBrowser.selectedTab;
		var activeTabIndex = tabsArray.indexOf(activeTab);
		if (activeTabIndex < 0){activeTabIndex = 0;}
		var diffTabs = 0;
		//Add FF tabs to match Poly tabs
		if (numPolyTabs > tabsLength ){
				diffTabs = numPolyTabs - tabsLength;
				for (var i = diffTabs; i > 0; i--){
						mainWindow.gBrowser.addTab("about:blank#loaded");
						}
			}		

		//Remove FF tabs to match Poly tabs
		if (tabsLength > numPolyTabs && tabsLength != 1){
				diffTabs = tabsLength - numPolyTabs;
				var t = (tabsLength - 1);
				for (var i = diffTabs; i > 0; i--){
						var tab = tabs[t];
						if (tab == activeTab){  
								t--;
								tab = tabs[t];
							} 
						var bTab = mainWindow.gBrowser.polyGetBrowserForTab(tab);
						var bTabSpec = bTab.currentURI.spec;
						if (bTabSpec == 'about:blank#loaded' || bTabSpec == 'http://polysuite.com/PolyBrowser/ga/index.html' || bTabSpec == 'about:blank#customizing' ){ //
							mainWindow.gBrowser.removeTab(tab); 	
							mainWindow.gBrowser.selectTabAtIndex(activeTabIndex);
							} 
						t--;
				}	
			}

} 



//Removes foreground PolyBrowser tabs that aren't supposed to be there (currently about:customizing)
function removePolyTabs(){
		var polyTabs = document.getElementById('tabArrowScroller').children;
		var numPolyTabs = document.getElementById('tabArrowScroller').children.length;
		for (var i = 0; i < numPolyTabs; i++){
						var TempObj = polyTabs[i];
						var targetClick = ((TempObj.id).split('-'))[1];
						objBrowser = document.getElementById('polyBrowser-'+targetClick);
						var thisURI = objBrowser.currentURI.spec;
						
						if((thisURI == "about:blank#customizing" || thisURI == "about:customizing") && pCustomizing == false){
								pCloseTab(targetClick);
								var activeTab = PolyActiveTab();
								if(activeTab == null){ 
										var newPolyTabs = document.getElementById('tabArrowScroller').children;
										var newtargetClick = newPolyTabs[0].id
										pBrowserGoTab(newtargetClick);
										}
								setBrowserFocus();
							}
						
					}

}
