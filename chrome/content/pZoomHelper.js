//////////Zoom functions

var zoomOut = false;
var browserWidth;
var browserHeight;
var scrollLeftPercent;
var scrollTopPercent;
var zoomLevel = 5;
var priorZoomLevel = 5;
var defaultZoom = 5;
var zoomSliderMouse = false;
var tabAnimationCount = 0;

window.onresize = setBottomMargin;

//We set the bottom margin of browserContainer to negative values when zoomed out to clip off excess
function setBottomMargin(){
		//Also determine flex of tab bar
		window.setTimeout(setTabBarFlex, 50);
		
		var browserContainer = document.getElementById('browserContainer');
		var tabContainer = document.getElementById('polyTabContainer');
		var containerHeight = browserContainer.boxObject.height;
		var margin;
		var padding;
		if (zoomLevel < 5){zoomLevel = 5;}
		if (zoomLevel > 8){zoomLevel = 8;}
		switch(zoomLevel){
			case 5:
				margin = 0;
				padding = 5;
				break;
			case 6:
				//Keep margin at 0;
				margin = 0 - (containerHeight * .25); // + ; //+ 10
				padding = 15; // - containerHeight ; // + 5;
				browserContainer.style.overflowX = "scroll";
				break;
			case 7:
				margin = 0 - (containerHeight * .5); //+ ;
				padding = 35; // - containerHeight; //+ 5 ;
				browserContainer.style.overflowX = "scroll";
				break;
			case 8:
				margin = 0 - (containerHeight * .75); // + ;
				padding = 70; // - containerHeight; //  + 5;	
				browserContainer.style.overflowX = "scroll";
				break;
			}
		browserContainer.style.margin = margin + "px 0px 0px 0px";
		browserContainer.style.paddingTop = padding + "px";
}

///////////////Functions to set the margin of browsers when zoomed out

function setZoomMargin(event){
		var targetClick = ((event.currentTarget.id).split('-'))[1];
		setZoomMarginById(targetClick);
}

function setZoomMarginAll(){
		var browserContainer = document.getElementById('browserContainer');
		var browserArray = browserContainer.getElementsByTagName('browser');
		for(i=0;i<browserArray.length;i++)
			{
				var browserLoop = browserArray[i];
				var browserLoopId = browserLoop.id
				var targetClick = browserLoopId.split('-')[1];
				setZoomMarginById(targetClick);
			}
		window.setTimeout(checkOneTabMaximize, 100);
}

//Sets the side margins of browsers while zoomed out to keep them close together
function setZoomMarginById(id){
		var targetClick = id;
		var objActiveBrowser = document.getElementById('polyBrowser-'+targetClick);
		
		var viewerWidth = objActiveBrowser.boxObject.width;

		var objActiveContainer = document.getElementById('polyBrowserContainer-'+targetClick);
		var zoomMargin = 0;
		if (zoomLevel < 5){zoomLevel = 5;}
		if (zoomLevel > 8){zoomLevel = 8;}
		
		switch(zoomLevel){
			case 5:
				zoomMargin = 0;
				break;
			case 6:
				zoomMargin = 0 - (viewerWidth * .25);
				break;
			case 7:
				zoomMargin = 0 - (viewerWidth * .5);
				break;
			case 8:
				zoomMargin = 0 - (viewerWidth * .75);
				break;
			}
		var halfMargin = zoomMargin / 2;
		objActiveContainer.style.margin = "0 " + halfMargin + "px 0 " + halfMargin + "px";

}

//Opens popup for zoom button with slider
function openZoomPopup(event){
	var zoomButton = document.getElementById('tabContainerWithZoom');
 	var zoomControlId = document.getElementById('zoomControl'); 
 	zoomControlId.openPopup(zoomButton, "after_start", 15, 0, false, false, event);

}

var zoomTimeout;  //Declaration for global timeout

//Sets zoom based on global zoom value
function setZoomValue(){
	if(zoomSliderMouse == true){	
		var zoomSlider = document.getElementById('zoomScale');
		var zoomValue = zoomSlider.value;
		window.clearTimeout(zoomTimeout);
		zoomTimeout = window.setTimeout(delayZoom, 100, zoomValue);
		}
}

function delayZoom(zoomValue){
		zoomLevel = zoomValue;
		setZoom(zoomValue);
}

//Make sure that dragging the zoom slider doesn't affect execution of the zoom

function zoomMouseOver(){
	zoomSliderMouse = true;
}

function zoomMouseLeave(){
	zoomSliderMouse = false;
}

//Meta function that calls other zoom functions
function changeZoom(zoomChange, event){
	zoomLevel += zoomChange;
	openZoomPopup(event);
	var zoomSlider = document.getElementById('zoomScale');
	zoomSlider.value = zoomLevel;
	window.clearTimeout(zoomTimeout);
	zoomTimeout = window.setTimeout(delayZoom, 250, zoomLevel);
}

//Sets global zoom level, including adding and deleting CSS rules
function setZoom(zoomLevel){
		if (zoomLevel < 5){zoomLevel = 5;}
		if (zoomLevel > 8){zoomLevel = 8;}
		var browserContainer = document.getElementById('browserContainer');
		var rules = [];
		rules = document.styleSheets[6].cssRules;
		var priorScale;
		var newScale;
		var priorMargin;
		var newMargin;
		switch(zoomLevel){
			case 5:
				newScale = "1.0";
				break;
			case 6:
				newScale = "0.75";
				break;
			case 7:
				newScale = "0.5";
				break;
			case 8:
				newScale = "0.25";
				break;
			}
		if(zoomLevel < priorZoomLevel) {
			priorScale = newScale * .95;
			priorMargin = -30;
			newMargin = 0;
			}
		else if (zoomLevel > priorZoomLevel) {
			priorScale = newScale * 1.05;
			priorMargin = 30;
			newMargin = 0;
			}
		
		else priorScale = newScale;
		
		document.styleSheets[6].deleteRule(3);
		var browserCss = "@keyframes browserScale" + tabAnimationCount + " {0% {transform: scale(" + priorScale + ", " + priorScale + "); margin-top:" + priorMargin + "px;} 100%{transform: scale(" + newScale + ", " + newScale + ");margin-top:" + newMargin + "px; }}";
		document.styleSheets[6].insertRule(browserCss, 3);
		
		rules[0].style.animationName = 'browserScale' + tabAnimationCount;
		rules[0].style.animationIterationCount = '1';
		rules[0].style.animationPlayState = 'running';
		
		setZoomMarginAll();
		centerOnActiveBrowser();
		setBottomMargin();
		
		tabAnimationCount++;
		priorZoomLevel = zoomLevel;
}

//After zooming, we need to re-scroll the browserContainer to the correct location
function centerOnActiveBrowser(){
	var activeBrowser = window.PolyActiveBrowser();
	var activeContainer = activeBrowser.parentNode;
	var leftSibling = activeContainer.previousSibling;
	var leftScroll;
	if (leftSibling == null){leftScroll = 0;}
	else{ leftScroll = leftSibling.boxObject.x; }
	var objBrowserContainer = document.getElementById('browserContainer');
	
	var browserWidth = activeBrowser.boxObject.width;
	var browserContainerWidth = objBrowserContainer.boxObject.width;
	var computedPadding = ((browserContainerWidth - browserWidth) / 2);
				switch(zoomLevel){
			case 4:
				var adjustedPadding = computedPadding * .5;
				break;
			case 5:
				var adjustedPadding = computedPadding;
				break;
			case 6:
				var adjustedPadding = computedPadding * 1.25 + 100;
				break;
			case 7:
				var adjustedPadding = computedPadding * 1.5 + 200;
				break;
			case 8:
				var adjustedPadding = computedPadding * 1.75 + 300;
				break;
			}
	
	var finalScroll = leftScroll - adjustedPadding;
	objBrowserContainer.scrollLeft = finalScroll;
}
