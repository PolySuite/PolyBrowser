var pDragTabWindow;
var pTabDrag = null;

var dragId, tabDragTargetURL, tabDragTabContainer, tabDragParentContainer, tabDragBrowserContainer, tabDragTabContainer, tabDragHelperLabel, tabDragTabResizer;

//If true, the tab should be dropped to the left of the tab.  Otherwise drop to the right.
var dropLeft = false;

var tabPrefs = Components.classes["@mozilla.org/preferences-service;1"]
                      .getService(Components.interfaces.nsIPrefService);

//Observer on individual tabs for dragging
var listObserver = {
  onDragStart: function (event, transferData, action) {
  	
  	var dragId = event.target.id;
	tabPrefs.setCharPref("DragId", dragId);
    
    var txt = event.target.getAttribute("elem");
    transferData.data = new TransferData();
    transferData.data.addDataForFlavour("text/unicode", txt);
	
	var targetBrowser = document.getElementById('polyBrowser-'+txt);
	var targetDocument = targetBrowser.contentDocument;
	tabDragTargetURL =  targetDocument.location.toString();
	if (tabDragTargetURL == "about:newtab"){tabDragTargetURL = "about:newtab#";}
	                  
	tabPrefs.setCharPref("TabDragUrl", tabDragTargetURL);	
	tabPrefs.setCharPref("LastWindowName", window.name);
	
	tabDragTabContainer = document.getElementById('tab-'+txt);
	tabDragParentContainer = tabDragTabContainer.parentNode.children.length;
	tabDragBrowserContainer = document.getElementById('polyBrowserContainer-'+txt);
	tabDragTabContainer = document.getElementById('tab-'+txt);
	tabDragTabResizer = document.getElementById('pContainerResizer-'+txt);
 	
  }
};

//Observer on Tab Container for dragging and dropping tabs
var boardObserver = 
{
	getSupportedFlavours: function ()
	{var flavours = new FlavourSet();flavours.appendFlavour("text/unicode"); return flavours;},
	onDragStart: function (event){},
	onDragOver: function (event, flavour, session){
			var eventTarget = event.target.id;
			if(eventTarget.indexOf('tab') === 0){event.dataTransfer.dropEffect = "link";}
			else{event.dataTransfer.dropEffect = "copy";}
				},
	onDrop: function (event, dropdata, session)
	{	
		var thisDragId = tabPrefs.getCharPref("DragId");
		if(thisDragId.indexOf('tab-') != 0 ){
				tabPrefs.setCharPref("DragId", "");
				return;
				}
		tabPrefs.setCharPref("DragId", "");
		var targetClick = ((event.target.id).split('-'))[1];
		if (dropdata.data != "")
		{
		  var targetId = event.target.id;
		  var lastWindowName = tabPrefs.getCharPref("LastWindowName");
		  var sourceClick = dropdata.data;
		  if(targetId.indexOf('tab') == 0 && lastWindowName == window.name) {
						pTabIsDragging = false;
						if( targetClick != sourceClick )
						{
							var getSourceTabData = document.getElementById('tab-'+sourceClick);
							var getTargetTabData = document.getElementById('tab-'+targetClick);
							var parentElementTab = getSourceTabData.parentNode;
				
							var targetBrowser = document.getElementById('polyBrowser-'+sourceClick);
							var targetDocument = targetBrowser.contentDocument;
							var targetURL =  targetDocument.location.toString();				
							targetBrowser.src = targetURL;
				
							var getSourceContainerControl = document.getElementById('polyBrowserContainer-'+sourceClick);
							var getTargetContainerControl = document.getElementById('polyBrowserContainer-'+targetClick);
							var parentElementContainer = getSourceContainerControl.parentNode;
			
							var getSourceResizerControl = document.getElementById('pContainerResizer-'+sourceClick);
							var getTargetResizerControl = document.getElementById('pContainerResizer-'+targetClick);  
							var parentElementResizer = getSourceResizerControl.parentNode;
				
							// Before  ---- Create Dropped Element Before Target Element
							if(dropLeft == true){
									var a = parentElementTab.insertBefore(getSourceTabData, getTargetTabData);
									var b = parentElementContainer.insertBefore(getSourceContainerControl, getTargetContainerControl);
									var c = parentElementContainer.insertBefore(getSourceResizerControl, getSourceContainerControl.nextSibling);
									//var c = window.setTimeout(parentElementContainer.insertBefore, 16 getSourceResizerControl, getSourceContainerControl.nextSibling);
									
								}
							else {
									var a = parentElementTab.insertBefore(getSourceTabData, getTargetTabData.nextSibling);
									var b = parentElementContainer.insertBefore(getSourceContainerControl, getTargetContainerControl.nextSibling.nextSibling);
									var c = parentElementContainer.insertBefore(getSourceResizerControl, getSourceContainerControl.nextSibling);
									//var c = window.setTimeout(parentElementContainer.insertBefore, 16, getSourceResizerControl, getSourceContainerControl.nextSibling);
								}
							var targetBrowser = document.getElementById('polyBrowser-'+sourceClick);
							targetBrowser.loadURI(targetURL);
				
							pBrowserGoTab(sourceClick);
						}
			}
		  else{
		  		tabPrefs.setCharPref("LastWindowName", window.name);
		  		var getDragUrl = tabPrefs.getCharPref("TabDragUrl");
				if(targetId.indexOf('tab') == 0) {
						pBrowserNewTabClick(getDragUrl);
						}
				else{
						window.open(getDragUrl);
						if(tabDragBrowserContainer)
							tabDragBrowserContainer.parentNode.removeChild(tabDragBrowserContainer);
						if(tabDragTabResizer)
							tabDragTabResizer.parentNode.removeChild(tabDragTabResizer);
						if(tabDragTabContainer)
							tabDragTabContainer.parentNode.removeChild(tabDragTabContainer);
						var tabNumber = document.getElementById('tabArrowScroller').children.length;
						if(tabNumber < 1){
								//BrowserTryToClosePolyWindow();
								window.close();
							}
					}
			}
		}
	}
};



function removeDragClassByName(){
		tabDragBrowserContainer.classList.remove('tabDragSelectorClass');
		tabDragTabResizer.classList.remove('tabDragSelectorClass');
		tabDragTabContainer.classList.remove('tabDragSelectorClass');
}

function removeDragElementsByClass(event){
	tabPrefs.setCharPref("DragId", "");
	var targetId = event.target.id;
	if(targetId.indexOf('tab') == 0){
				var lastWindowName = tabPrefs.getCharPref("LastWindowName");
				if(lastWindowName == window.name){}
				else if(lastWindowName != window.name){	
						var tabNumber = document.getElementById('tabArrowScroller').children.length;
						if(tabNumber < 2){
								BrowserTryToClosePolyWindow();
								}
						if(tabDragBrowserContainer)
							tabDragBrowserContainer.parentNode.removeChild(tabDragBrowserContainer);
						if(tabDragTabResizer)
							tabDragTabResizer.parentNode.removeChild(tabDragTabResizer);
						if(tabDragTabContainer)
							tabDragTabContainer.parentNode.removeChild(tabDragTabContainer);
					}
	}
}

//Drag-over styling effects for tabs
function tabDragOver(event){
	var thisTab = document.getElementById(event.originalTarget.id);
	var tabWidth = thisTab.boxObject.width;
	var tabLoc = thisTab.boxObject.x;
	var mouseLoc = event.clientX;
	var dragPosition = mouseLoc - tabLoc;
	var tabCenter = tabWidth / 2;
	if (dragPosition > tabCenter){
		thisTab.classList.add("dragOverRight");
		thisTab.classList.remove("dragOverLeft");
		dropLeft = false;
		}
	if (dragPosition < tabCenter){
		thisTab.classList.add("dragOverLeft");
		thisTab.classList.remove("dragOverRight");
		dropLeft = true;
		}
	event.dataTransfer.dropEffect = "link";
}

function tabDragLeave(event){
		var thisTab = document.getElementById(event.originalTarget.id);
		thisTab.classList.remove("dragOverRight");
		thisTab.classList.remove("dragOverLeft");
		event.preventDefault();
}



document.addEventListener("dragend", function(event){removeDragElementsByClass(event);}, false);
//document.addEventListener("dragend", removeDragElementsByClass, true);


