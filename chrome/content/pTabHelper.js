///////////These functions build new tabs and browsers
///////////TODO pBrowserNewTabClick and pBrowserOpenInNewTabUnfocussed should be refactored into one function because they share so much common code

//Creates a new tab, makes it active and goes to it
function pBrowserNewTabClick(urlname)
{
	try
	{	
		///////////Builds the Tab
		var objTabContainer = document.getElementById('tabContainer');
		var objBrowserContainer = document.getElementById('browserContainer');
	
		
		var objNewTab = document.getElementById('newTab');
		var objTabContainer = objNewTab.parentNode;
		var objMainTabContainerWithScroller = objTabContainer.childNodes[1];
		
		var MainControlCounter = TabCountStart + 1;
		var NewIdToAssign = TabCountStart + 1;
		var NewTabIdToAssign = "tab-"+NewIdToAssign;
		
		var FavButtonId = "tabFavIcon-"+NewIdToAssign;
		var CloseButtonId = "tabClose-"+NewIdToAssign;
		
		var newTab = document.createElement('hbox');
		newTab.setAttribute('id',NewTabIdToAssign);
		newTab.setAttribute('class','tabdisabled');
		newTab.setAttribute('pack','center');
		newTab.setAttribute('onmousedown','pBrowserTabClick(event)');
		newTab.setAttribute('draggable',true);
		newTab.setAttribute('elem',''+MainControlCounter);
		newTab.setAttribute('ondraggesture','nsDragAndDrop.startDrag(event, listObserver)');
		newTab.setAttribute('ondragover', 'tabDragOver(event)');
		newTab.setAttribute('ondragleave', 'tabDragLeave(event)');
	//	newTab.setAttribute('ondragstart', 'tabDragStart(event)');
		newTab.setAttribute('onmouseenter','showLabel(event)');
		newTab.setAttribute('onmouseleave','hideLabel(event)');
	//	newTab.setAttribute('flex', 1);
	//	newTab.setAttribute('flex-shrink', 1);
	//	newTab.setAttribute('min-width', 15);
	//	newTab.setAttribute('max-width', 96);
		
		var nHbox = document.createElement('hbox');
		nHbox.setAttribute('id','TabLabelContainerHbox-'+MainControlCounter);
		nHbox.setAttribute('elem',''+MainControlCounter);
		nHbox.setAttribute('ondraggesture','nsDragAndDrop.startDrag(event, listObserver)');
		nHbox.setAttribute('height',16);
		
		var nFavButton = document.createElement('image');
		nFavButton.setAttribute('elem',''+MainControlCounter);
		nFavButton.setAttribute('ondraggesture','nsDragAndDrop.startDrag(event, listObserver)');
		nFavButton.setAttribute('src','chrome://polybrowser/skin/favicons.png');					
		nFavButton.setAttribute('id',FavButtonId);
		nFavButton.setAttribute('control',NewTabIdToAssign);
		
		var nFavButtonContain = document.createElement('vbox');
		nFavButtonContain.setAttribute('pack','center');
		nFavButtonContain.appendChild(nFavButton);
		
		var nCloseButton = document.createElement('image');
		nCloseButton.setAttribute('src','chrome://polybrowser/skin/Tab_Closenormal.png');
		nCloseButton.setAttribute('id',CloseButtonId);
		nCloseButton.setAttribute('onclick','pBrowserCloseButtonClick(event)');
		nCloseButton.setAttribute('control',NewTabIdToAssign);
		nCloseButton.setAttribute('onmouseover','buttonMouseOver(event)');
		nCloseButton.setAttribute('onmouseout','buttonMouseOut(event)');
		nCloseButton.setAttribute('width',16);
		nCloseButton.setAttribute('height',16);
		nCloseButton.setAttribute('class','hidetabclose');
		
		var nElemVBox = document.createElement('vbox');
		nElemVBox.setAttribute('pack','center');
		nElemVBox.setAttribute('id','TabLabelContainerVbox-'+MainControlCounter);
		nElemVBox.setAttribute('elem',''+MainControlCounter);
		nElemVBox.setAttribute('ondraggesture','nsDragAndDrop.startDrag(event, listObserver)');
		
		var nElemLabel = document.createElement('label');
		nElemLabel.setAttribute('value','Untitled');
		nElemLabel.setAttribute('control',NewTabIdToAssign);
		nElemLabel.setAttribute('class','tabTitle');
		nElemLabel.setAttribute('id','tabPanelLabel-'+MainControlCounter);
		nElemLabel.setAttribute('elem',''+MainControlCounter);
		nElemLabel.setAttribute('ondraggesture','nsDragAndDrop.startDrag(event, listObserver)');
		nElemLabel.setAttribute('class','hidetablabel');
		
		var nCover = document.createElement('vbox');
		nCover.setAttribute('class','dragCover');
		
		var nStack = document.createElement('stack');
		nStack.setAttribute('flex','1');
		nStack.setAttribute('class','dragCover');		
		
		var nCloseContain = document.createElement('vbox');
		nCloseContain.setAttribute('pack','center');
		nCloseContain.appendChild(nCloseButton);
		
		nElemVBox.appendChild(nElemLabel);
		
		nHbox.appendChild(nFavButtonContain);
		nHbox.appendChild(nElemVBox);

		nStack.appendChild(nHbox);
		nStack.appendChild(nCover);
		
		newTab.appendChild(nStack);
		newTab.appendChild(nCloseContain);

		

		
		////////// Builds individual browser
		
		//
		// Back Button
		//
		
		var newBackButton = document.createElement('image');
		newBackButton.setAttribute('id','polyBack-'+MainControlCounter);
		newBackButton.setAttribute('src','chrome://polybrowser/skin/Toolbar_BackBtnnormal.png');
		newBackButton.setAttribute('tooltiptext','Go Back');
		newBackButton.setAttribute('onclick','polyGoBack(event);');
		newBackButton.setAttribute('observes','canGoBack');
		newBackButton.setAttribute('onmouseover','buttonMouseOver(event)');
		newBackButton.setAttribute('onmouseout','buttonMouseOut(event)');
		newBackButton.setAttribute('onmousedown','buttonMouseDown(event)');
		newBackButton.setAttribute('onmouseup','buttonMouseUp(event)');

		//
		// Forward Button
		//
		var newForwardButton = document.createElement('image');
		newForwardButton.setAttribute('id','polyForward-'+MainControlCounter);
		newForwardButton.setAttribute('src','chrome://polybrowser/skin/Toolbar_ForwardBtnnormal.png');
		newForwardButton.setAttribute('tooltiptext','Go Forward');
		newForwardButton.setAttribute('onclick','polyGoForward(event);');
		newForwardButton.setAttribute('observes','canGoForward');
		newForwardButton.setAttribute('onmouseover','buttonMouseOver(event)');
		newForwardButton.setAttribute('onmouseout','buttonMouseOut(event)');
		newForwardButton.setAttribute('onmousedown','buttonMouseDown(event)');
		newForwardButton.setAttribute('onmouseup','buttonMouseUp(event)');
		
		//
		// Stop Button
		//
		var newStopButton = document.createElement('image');
		newStopButton.setAttribute('id','polyStop-'+MainControlCounter);
		newStopButton.setAttribute('src','chrome://polybrowser/skin/Toolbar_StopBtnnormal.png');
		newStopButton.setAttribute('tooltiptext','Stop');	
		newStopButton.setAttribute('hidden','true');
		newStopButton.setAttribute('onclick','polyGoStop(event);');
		newStopButton.setAttribute('onmouseover','buttonMouseOver(event)');
		newStopButton.setAttribute('onmouseout','buttonMouseOut(event)');
		newStopButton.setAttribute('onmousedown','buttonMouseDown(event)');
		newStopButton.setAttribute('onmouseup','buttonMouseUp(event)');
		
		//
		// Reload Button
		//
		var newReloadButton = document.createElement('image');
		newReloadButton.setAttribute('id','polyReload-'+MainControlCounter);
		newReloadButton.setAttribute('src','chrome://polybrowser/skin/Toolbar_ReloadBtnnormal.png');

	// CSS - Based swapping code TODO - Use CSS sprites rather than javascript to switch images
	//	newReloadButton.setAttribute('class','button-4-state');
	//	newReloadButton.style.backgroundImage = "url(chrome://polybrowser/skin/Toolbar_ReloadBtn.png)";
	//	newReloadButton.setAttribute('width','16');
	//	newReloadButton.setAttribute('height','16');
	
		newReloadButton.setAttribute('tooltiptext','Reload');
		newReloadButton.setAttribute('onclick','polyReload(event);');
		newReloadButton.setAttribute('onmouseover','buttonMouseOver(event)');
		newReloadButton.setAttribute('onmouseout','buttonMouseOut(event)');
		newReloadButton.setAttribute('onmousedown','buttonMouseDown(event)');
		newReloadButton.setAttribute('onmouseup','buttonMouseUp(event)');
		
		//
		// Functionality to show or hide Stop and Reload Button
		// 
		if(urlname!="" && urlname.indexOf('about:newtab') == -1)
		{
			newReloadButton.setAttribute('hidden','true');
			newStopButton.setAttribute('hidden','false');
		}
		else
		{
			newReloadButton.setAttribute('hidden','false');
			newStopButton.setAttribute('hidden','true');
		}
		
		//
		// Home Button
		//
		var newHomeButton = document.createElement('image');
		newHomeButton.setAttribute('id','polyHome-'+MainControlCounter);
		newHomeButton.setAttribute('src','chrome://polybrowser/skin/Toolbar_HomeBtnnormal.png');
		newHomeButton.setAttribute('tooltiptext','Go home');
		newHomeButton.setAttribute('onclick','polyLoadHome(event);');
		newHomeButton.setAttribute('onmouseover','buttonMouseOver(event)');
		newHomeButton.setAttribute('onmouseout','buttonMouseOut(event)');
		newHomeButton.setAttribute('onmousedown','buttonMouseDown(event)');
		newHomeButton.setAttribute('onmouseup','buttonMouseUp(event)');
		
		//
		// Address Bar
		//
		var newVboxAddressBar = document.createElement('vbox');
		newVboxAddressBar.setAttribute('flex','1');
		
		
			var newAddressBar = document.createElement('textbox');
			newAddressBar.setAttribute('id','polyAddressBar-'+MainControlCounter);
			newAddressBar.setAttribute('flex','1');
			newAddressBar.setAttribute('type','autocomplete');
			
			if(urlname!="")
				newAddressBar.setAttribute('value',urlname);
			else
				newAddressBar.setAttribute('value','about:newtab');
				
			newAddressBar.setAttribute('enablehistory','true');
			newAddressBar.setAttribute('autocompletesearch','history');
			newAddressBar.setAttribute('completeselectedindex','true');
			newAddressBar.setAttribute('maxrows','14');
			newAddressBar.setAttribute('autocompletepopup','PopupAutoComplete');
			newAddressBar.setAttribute('ontextentered','polyGoButtonClicked(event);');
			newAddressBar.setAttribute('onkeydown','TextOnKeyEntered(event)');
			newAddressBar.setAttribute('class','pAddressBar');
				
		newVboxAddressBar.appendChild(newAddressBar);
		
		//
		// Go Button
		//
		var newGoButton = document.createElement('image');
		newGoButton.setAttribute('id','polyGo-'+MainControlCounter);
		newGoButton.setAttribute('src','chrome://polybrowser/skin/Toolbar_GoBtnnormal.png');
		newGoButton.setAttribute('tooltiptext','Go');
		newGoButton.setAttribute('onclick','polyGoButtonClicked(event);');
		newGoButton.setAttribute('onmouseover','buttonMouseOver(event)');
		newGoButton.setAttribute('onmouseout','buttonMouseOut(event)');
		newGoButton.setAttribute('onmousedown','buttonMouseDown(event)');
		newGoButton.setAttribute('onmouseup','buttonMouseUp(event)');
		//
		// Bookmark Button
		//
		var newBookmarkButton = document.createElement('image');
		newBookmarkButton.setAttribute('id','polyBookmark-'+MainControlCounter);
		newBookmarkButton.setAttribute('src','chrome://polybrowser/skin/bookmarkDisablenormal.png');
		newBookmarkButton.setAttribute('tooltiptext','Bookmark this site');
		newBookmarkButton.setAttribute('onclick','polyBookmark(event);');

		
		var newSeparater = document.createElement('separator');
		newSeparater.setAttribute('width','10');
		newSeparater.setAttribute('class','pTitle');
		
		//
		// Website Title Element
		//
		var newTitle = document.createElement('vbox');
		newTitle.setAttribute('pack','center');
		newTitle.setAttribute('id','polyTitle-'+MainControlCounter);
		newTitle.setAttribute('class','pTitle');
		var newTitleText = document.createTextNode(' ');
		newTitle.appendChild(newTitleText);
		
		
		var newSeparater1 = document.createElement('separator');
		newSeparater1.setAttribute('width','10');
		newSeparater1.setAttribute('class','pTitle');
		
		//
		// Close Button
		//
		var newAddTab = document.createElement('image');
		newAddTab.setAttribute('id','polyCloseTab-'+MainControlCounter);
		newAddTab.setAttribute('src','chrome://polybrowser/skin/Toolbar_NewTabBtnnormal.png');
		newAddTab.setAttribute('tooltiptext','Close Tab');
		newAddTab.setAttribute('onclick','pBrowserCloseButtonClick(event)');
		newAddTab.setAttribute('onmouseover','buttonMouseOver(event)');
		newAddTab.setAttribute('onmouseout','buttonMouseOut(event)');
	
		
		var newBrowserControlPanel = document.createElement('hbox');
		newBrowserControlPanel.setAttribute('class','browserControlPanel');
		newBrowserControlPanel.setAttribute('id','polyBrowserControlPanel-'+MainControlCounter);
		
		var browserGap = document.createElement('hbox');
		browserGap.setAttribute('style','height:6px;width:100%;');
		
		
		
		var newBrowserContainer = document.createElement('vbox');
		newBrowserContainer.setAttribute('style','width:800px;flex-direction:column;');
		newBrowserContainer.setAttribute('id','polyBrowserContainer-'+MainControlCounter);
		newBrowserContainer.setAttribute('class','pBrowserContainerClass');
		newBrowserContainer.setAttribute('flex', '0');
		newBrowserContainer.setAttribute('onmousedown', 'activateBrowser(this.id)');

		
		//		
		////////////// Add new browser to browserContainer
		//
		var newBrowser = document.createElement('browser');
		newBrowser.setAttribute('id','polyBrowser-'+MainControlCounter);
		newBrowser.setAttribute('type','content');
		newBrowser.setAttribute('autocompletepopup','polybrowser_autocomplete');
		newBrowser.setAttribute('onresize','setZoomMargin(event)');
		if(urlname!="")
		{
			newBrowser.setAttribute('src',urlname);
		}
		else{newBrowser.setAttribute('src','about:newtab');}
		
		newBrowser.setAttribute('width','1000');
		newBrowser.setAttribute('height','750');
		newBrowser.setAttribute('scrollTop','0');
		newBrowser.setAttribute('class','pBrowserActive');
		newBrowser.setAttribute('flex','1');
		newBrowser.setAttribute('oldUrl', 'null');
		
		var newNotificationBox = document.createElement('notificationbox');
		newNotificationBox.setAttribute('flex','0');
		
		newBrowserControlPanel.appendChild(newBackButton);
		newBrowserControlPanel.appendChild(newForwardButton);
		newBrowserControlPanel.appendChild(newStopButton);
		newBrowserControlPanel.appendChild(newReloadButton);
		newBrowserControlPanel.appendChild(newHomeButton);
		newBrowserControlPanel.appendChild(newVboxAddressBar);
		newBrowserControlPanel.appendChild(newGoButton);
		newBrowserControlPanel.appendChild(newBookmarkButton);
		newBrowserControlPanel.appendChild(newSeparater);
		
		newBrowserControlPanel.appendChild(newTitle);
		newBrowserControlPanel.appendChild(newSeparater1);
		newBrowserControlPanel.appendChild(newAddTab);

		newBrowserContainer.appendChild(newBrowserControlPanel);
		newBrowserContainer.appendChild(browserGap);
		newBrowserContainer.appendChild(newNotificationBox);
		newBrowserContainer.appendChild(newBrowser);
				
		objMainTabContainerWithScroller.appendChild(newTab);
		
		//Resizer controls
		var resizerBox = document.createElement('vbox');
		resizerBox.setAttribute('id', 'pContainerResizer-' + MainControlCounter);
		
		var resizerStack = document.createElement('stack');
		resizerStack.setAttribute('flex', '1');
		resizerStack.setAttribute('width', '14');
		resizerBox.appendChild(resizerStack);
		var resizerTarget = 'polyBrowserContainer-' + MainControlCounter;
		
		var resizeRight = document.createElement('resizer');
		resizeRight.setAttribute('class', 'widthResizer');
		resizeRight.setAttribute('dir', 'right');
		resizeRight.setAttribute('width', '14');
		resizeRight.setAttribute('height', '300');
		resizeRight.setAttribute('right', '0');
		resizeRight.setAttribute('top', '0');
		resizeRight.setAttribute('style', '-moz-appearance: none;background-image:url(chrome://polybrowser/skin/resizer.png);'); 
		resizeRight.setAttribute('element', resizerTarget);
		resizerStack.appendChild(resizeRight);
		
		var resizeLeft = document.createElement('vbox');
		
		var resizeLeftResizer = document.createElement('resizer');
		resizeLeftResizer.setAttribute('dir', 'left');
		resizeLeftResizer.setAttribute('width', '14');
		resizeLeftResizer.setAttribute('height', '300');
		resizeLeftResizer.setAttribute('element', resizerTarget);
		resizeLeftResizer.setAttribute('style', 'transform:rotate(180deg);width:14px;height:300px;-moz-appearance: none;background-image:url(chrome://polybrowser/skin/resizer.png);');
		resizeLeft.appendChild(resizeLeftResizer);
		
		resizeLeft.setAttribute('id', 'pResizeLeft-' + MainControlCounter);
		resizeLeft.setAttribute('class', 'widthResizer');
		resizeLeft.setAttribute('flex', '0');
		resizeLeft.setAttribute('width', '14');
		resizeLeft.setAttribute('height', '300');
		resizeLeft.setAttribute('style', 'width:14px;height:300px;position:absolute;left:-19px;margin-top:-325px;'); 

		newBrowserContainer.appendChild(resizeLeft);

		
		objBrowserContainer.appendChild(newBrowserContainer);
		objBrowserContainer.appendChild(resizerBox);
		
		//Set margins based on zoom level
		window.setTimeout(setZoomMarginAll, 10);
		//Select active address bar
		window.setTimeout(delaySelectAddressBar, 800, MainControlCounter);
		
		//Global tab counter
		TabCountStart++;
		
		//
		// Adding Listener to recently added browsers
		//
		var objBrowserAddedRecently = document.getElementById('polyBrowser-'+MainControlCounter);
		objBrowserAddedRecently.addEventListener('load', polyBrowserLoadComplete , true);	
		objBrowserAddedRecently.addProgressListener(PolyBrowserListener);
		//
		// Resize Browser Control
		//
		//Global function for setting browser size
		var loadingContainer = objBrowserAddedRecently.parentNode;
		pBrowserSetSize(objBrowserAddedRecently, loadingContainer);

		
		
		//Analytics
		var iframe = document.createElement('iframe');
//		iframe.setAttribute("type", "content");
		iframe.setAttribute("src", "http://polysuite.com/PolyBrowser/ga/new-tab.html");
		iframe.setAttribute("style", "overflow:hidden;width:0;height:0;position:absolute");
		objBrowserAddedRecently.appendChild(iframe); 
		
		window.setTimeout(pBrowserGoTabLast, 150);
		

	}
	catch(ee)
	{
		//alert(ee.message);
	}
}

//Focus on new tab URL bar
function delaySelectAddressBar(MainControlCounter){
		var selectBar = document.getElementById('polyAddressBar-' + MainControlCounter);
		selectBar.select();
}

//Creates new tab and adds it to the browserContainer, but doesn't navigate to it
function pBrowserOpenInNewTabUnfocussed(urlname)
{
	try
	{
	
		//////////////Build Tab
		
		var objTabContainer = document.getElementById('tabContainer');
		var objBrowserContainer = document.getElementById('browserContainer');
		
		var objNewTab = document.getElementById('newTab');
		var objTabContainer = objNewTab.parentNode;
		var objMainTabContainerWithScroller = objTabContainer.childNodes[1];
		
		var MainControlCounter = TabCountStart + 1;
		var NewIdToAssign = TabCountStart + 1;
		var NewTabIdToAssign = "tab-"+NewIdToAssign;
		
		var FavButtonId = "tabFavIcon-"+NewIdToAssign;
		var CloseButtonId = "tabClose-"+NewIdToAssign;
		
		var newTab = document.createElement('hbox');
		newTab.setAttribute('id',NewTabIdToAssign);
		newTab.setAttribute('class','tabdisabled');
		newTab.setAttribute('pack','center');
		newTab.setAttribute('onmousedown','pBrowserTabClick(event)');
		newTab.setAttribute('draggable',true);
		newTab.setAttribute('elem',''+MainControlCounter);
		newTab.setAttribute('ondraggesture','nsDragAndDrop.startDrag(event, listObserver)');
		newTab.setAttribute('ondragover', 'tabDragOver(event)');
		newTab.setAttribute('ondragleave', 'tabDragLeave(event)');
	//	newTab.setAttribute('ondragstart', 'tabDragStart(event)');
		newTab.setAttribute('onmouseenter','showLabel(event)');
		newTab.setAttribute('onmouseleave','hideLabel(event)');
		
		var nHbox = document.createElement('hbox');
		nHbox.setAttribute('id','TabLabelContainerHbox-'+MainControlCounter);
		nHbox.setAttribute('elem',''+MainControlCounter);
		nHbox.setAttribute('ondraggesture','nsDragAndDrop.startDrag(event, listObserver)');
		nHbox.setAttribute('height',16);
		
		var nFavButton = document.createElement('image');
		nFavButton.setAttribute('elem',''+MainControlCounter);
		nFavButton.setAttribute('ondraggesture','nsDragAndDrop.startDrag(event, listObserver)');
		nFavButton.setAttribute('src','chrome://polybrowser/skin/favicons.png');					
		nFavButton.setAttribute('id',FavButtonId);
		nFavButton.setAttribute('control',NewTabIdToAssign);
		
		var nFavButtonContain = document.createElement('vbox');
		nFavButtonContain.setAttribute('pack','center');
		nFavButtonContain.appendChild(nFavButton);
		
		var nCloseButton = document.createElement('image');
		nCloseButton.setAttribute('src','chrome://polybrowser/skin/Tab_Closenormal.png');
	//	nCloseButton.style.backgroundImage = 'chrome://polybrowser/skin/Tab_Close.png';
		nCloseButton.setAttribute('id',CloseButtonId);
		nCloseButton.setAttribute('onclick','pBrowserCloseButtonClick(event)');
		nCloseButton.setAttribute('control',NewTabIdToAssign);
		nCloseButton.setAttribute('onmouseover','buttonMouseOver(event)');
		nCloseButton.setAttribute('onmouseout','buttonMouseOut(event)');
		nCloseButton.setAttribute('width',16);
		nCloseButton.setAttribute('height',16);
		nCloseButton.setAttribute('class','hidetabclose');
		
		var nElemVBox = document.createElement('vbox');
		nElemVBox.setAttribute('pack','center');
		nElemVBox.setAttribute('id','TabLabelContainerVbox-'+MainControlCounter);
		nElemVBox.setAttribute('elem',''+MainControlCounter);
		nElemVBox.setAttribute('ondraggesture','nsDragAndDrop.startDrag(event, listObserver)');
		
		var nElemLabel = document.createElement('label');
		nElemLabel.setAttribute('value','Untitled');
		nElemLabel.setAttribute('control',NewTabIdToAssign);
		nElemLabel.setAttribute('class','tabTitle');
		nElemLabel.setAttribute('id','tabPanelLabel-'+MainControlCounter);
		nElemLabel.setAttribute('elem',''+MainControlCounter);
		nElemLabel.setAttribute('ondraggesture','nsDragAndDrop.startDrag(event, listObserver)');
		nElemLabel.setAttribute('class','hidetablabel');
		
		var nCover = document.createElement('vbox');
		nCover.setAttribute('class','dragCover');
		
		var nStack = document.createElement('stack');
		nStack.setAttribute('flex','1');
		nStack.setAttribute('class','dragCover');		
		
		var nCloseContain = document.createElement('vbox');
		nCloseContain.setAttribute('pack','center');
		nCloseContain.appendChild(nCloseButton);
		
		nElemVBox.appendChild(nElemLabel);
		
		nHbox.appendChild(nFavButtonContain);
		nHbox.appendChild(nElemVBox);

		nStack.appendChild(nHbox);
		nStack.appendChild(nCover);
		
		newTab.appendChild(nStack);
		newTab.appendChild(nCloseContain);

		////////////////Creates new browser to add to browserContainer
		//
		// Back Button
		//
		
		var newBackButton = document.createElement('image');
		newBackButton.setAttribute('id','polyBack-'+MainControlCounter);
		newBackButton.setAttribute('src','chrome://polybrowser/skin/Toolbar_BackBtnnormal.png');
		newBackButton.setAttribute('tooltiptext','Go Back');
		newBackButton.setAttribute('onclick','polyGoBack(event);');
		newBackButton.setAttribute('observes','canGoBack');
		newBackButton.setAttribute('onmouseover','buttonMouseOver(event)');
		newBackButton.setAttribute('onmouseout','buttonMouseOut(event)');
		newBackButton.setAttribute('onmousedown','buttonMouseDown(event)');
		newBackButton.setAttribute('onmouseup','buttonMouseUp(event)');

		//
		// Forward Button
		//
		var newForwardButton = document.createElement('image');
		newForwardButton.setAttribute('id','polyForward-'+MainControlCounter);
		newForwardButton.setAttribute('src','chrome://polybrowser/skin/Toolbar_ForwardBtnnormal.png');
		newForwardButton.setAttribute('tooltiptext','Go Forward');
		newForwardButton.setAttribute('onclick','polyGoForward(event);');
		newForwardButton.setAttribute('observes','canGoForward');
		newForwardButton.setAttribute('onmouseover','buttonMouseOver(event)');
		newForwardButton.setAttribute('onmouseout','buttonMouseOut(event)');
		newForwardButton.setAttribute('onmousedown','buttonMouseDown(event)');
		newForwardButton.setAttribute('onmouseup','buttonMouseUp(event)');
		
		//
		// Stop Button
		//
		var newStopButton = document.createElement('image');
		newStopButton.setAttribute('id','polyStop-'+MainControlCounter);
		newStopButton.setAttribute('src','chrome://polybrowser/skin/Toolbar_StopBtnnormal.png');
		newStopButton.setAttribute('tooltiptext','Stop');	
		newStopButton.setAttribute('hidden','true');
		newStopButton.setAttribute('onclick','polyGoStop(event);');
		newStopButton.setAttribute('onmouseover','buttonMouseOver(event)');
		newStopButton.setAttribute('onmouseout','buttonMouseOut(event)');
		newStopButton.setAttribute('onmousedown','buttonMouseDown(event)');
		newStopButton.setAttribute('onmouseup','buttonMouseUp(event)');
		
		//
		// Reload Button
		//
		var newReloadButton = document.createElement('image');
		newReloadButton.setAttribute('id','polyReload-'+MainControlCounter);
		newReloadButton.setAttribute('src','chrome://polybrowser/skin/Toolbar_ReloadBtnnormal.png');
		newReloadButton.setAttribute('tooltiptext','Reload');
		newReloadButton.setAttribute('onclick','polyReload(event);');
		newReloadButton.setAttribute('onmouseover','buttonMouseOver(event)');
		newReloadButton.setAttribute('onmouseout','buttonMouseOut(event)');
		newReloadButton.setAttribute('onmousedown','buttonMouseDown(event)');
		newReloadButton.setAttribute('onmouseup','buttonMouseUp(event)');
		
		//
		// Functionality to show or hide Stop and Reload Button
		// 
		if(urlname!="" && urlname.indexOf('about:newtab') == -1)
		{
			newReloadButton.setAttribute('hidden','true');
			newStopButton.setAttribute('hidden','false');
		}
		else
		{
			newReloadButton.setAttribute('hidden','false');
			newStopButton.setAttribute('hidden','true');
		}
		
		//
		// Home Button
		//
		var newHomeButton = document.createElement('image');
		newHomeButton.setAttribute('id','polyHome-'+MainControlCounter);
		newHomeButton.setAttribute('src','chrome://polybrowser/skin/Toolbar_HomeBtnnormal.png');
		newHomeButton.setAttribute('tooltiptext','Go home');
		newHomeButton.setAttribute('onclick','polyLoadHome(event);');
		newHomeButton.setAttribute('onmouseover','buttonMouseOver(event)');
		newHomeButton.setAttribute('onmouseout','buttonMouseOut(event)');
		newHomeButton.setAttribute('onmousedown','buttonMouseDown(event)');
		newHomeButton.setAttribute('onmouseup','buttonMouseUp(event)');
		
		//
		// Address Bar
		//
		var newVboxAddressBar = document.createElement('vbox');
		newVboxAddressBar.setAttribute('flex','1');
		
			var newAddressBar = document.createElement('textbox');
			newAddressBar.setAttribute('id','polyAddressBar-'+MainControlCounter);
			newAddressBar.setAttribute('flex','1');
			newAddressBar.setAttribute('type','autocomplete');
			
			if(urlname!="")
				newAddressBar.setAttribute('value',urlname);
			else
				newAddressBar.setAttribute('value','about:newtab');
				
			newAddressBar.setAttribute('enablehistory','true');
			newAddressBar.setAttribute('autocompletesearch','history');
			newAddressBar.setAttribute('completeselectedindex','true');
			newAddressBar.setAttribute('maxrows','14');
			newAddressBar.setAttribute('autocompletepopup','PopupAutoComplete');
			newAddressBar.setAttribute('ontextentered','polyGoButtonClicked(event);');
			newAddressBar.setAttribute('onkeydown','TextOnKeyEntered(event)');
			newAddressBar.setAttribute('class','pAddressBar');
				
		newVboxAddressBar.appendChild(newAddressBar);
		
		//
		// Go Button
		//
		var newGoButton = document.createElement('image');
		newGoButton.setAttribute('id','polyGo-'+MainControlCounter);
		newGoButton.setAttribute('src','chrome://polybrowser/skin/Toolbar_GoBtnnormal.png');
		newGoButton.setAttribute('tooltiptext','Go');
		newGoButton.setAttribute('onclick','polyGoButtonClicked(event);');
		newGoButton.setAttribute('onmouseover','buttonMouseOver(event)');
		newGoButton.setAttribute('onmouseout','buttonMouseOut(event)');
		newGoButton.setAttribute('onmousedown','buttonMouseDown(event)');
		newGoButton.setAttribute('onmouseup','buttonMouseUp(event)');
		//
		// Bookmark Button
		//
		var newBookmarkButton = document.createElement('image');
		newBookmarkButton.setAttribute('id','polyBookmark-'+MainControlCounter);
		newBookmarkButton.setAttribute('src','chrome://polybrowser/skin/bookmarkDisablenormal.png');
		newBookmarkButton.setAttribute('tooltiptext','Bookmark this site');
		newBookmarkButton.setAttribute('onclick','polyBookmark(event);');

		
		var newSeparater = document.createElement('separator');
		newSeparater.setAttribute('width','10');
		newSeparater.setAttribute('class','pTitle');
		
		//
		// Website Title Element
		//
		var newTitle = document.createElement('vbox');
		newTitle.setAttribute('pack','center');
		newTitle.setAttribute('id','polyTitle-'+MainControlCounter);
		newTitle.setAttribute('class','pTitle');
		var newTitleText = document.createTextNode(' ');
		newTitle.appendChild(newTitleText);
		
		var newSeparater1 = document.createElement('separator');
		newSeparater1.setAttribute('width','10');
		newSeparater1.setAttribute('class','pTitle');
		
		//
		// Close Button
		//
		var newAddTab = document.createElement('image');
		newAddTab.setAttribute('id','polyCloseTab-'+MainControlCounter);
		newAddTab.setAttribute('src','chrome://polybrowser/skin/Toolbar_NewTabBtnnormal.png');
		newAddTab.setAttribute('tooltiptext','Close Tab');
		newAddTab.setAttribute('onclick','pBrowserCloseButtonClick(event)');
		newAddTab.setAttribute('onmouseover','buttonMouseOver(event)');
		newAddTab.setAttribute('onmouseout','buttonMouseOut(event)');
		
		var newBrowserControlPanel = document.createElement('hbox');
		newBrowserControlPanel.setAttribute('class','browserControlPanelDisabled');
		newBrowserControlPanel.setAttribute('id','polyBrowserControlPanel-'+MainControlCounter);
		
		
		var newBrowserContainer = document.createElement('vbox');
		newBrowserContainer.setAttribute('style','width:800px;flex-direction:column;');
		newBrowserContainer.setAttribute('id','polyBrowserContainer-'+MainControlCounter);
		newBrowserContainer.setAttribute('class','pBrowserContainerClass');
		newBrowserContainer.setAttribute('flex','0');
		newBrowserContainer.setAttribute('onmousedown', 'activateBrowser(this.id)');

		var browserGap = document.createElement('hbox');
		browserGap.setAttribute('style','height:6px;width:100%;');
		//		
		///////////// Add individual browser to browserContainer
		//
		var newBrowser = document.createElement('browser');
		newBrowser.setAttribute('id','polyBrowser-'+MainControlCounter);
		newBrowser.setAttribute('type','content');
		newBrowser.setAttribute('autocompletepopup','polybrowser_autocomplete');
		newBrowser.setAttribute('flex','1');
		newBrowser.setAttribute('onresize','setZoomMargin(event)');
		newBrowser.setAttribute('width','1000');
		newBrowser.setAttribute('height','750');
		newBrowser.setAttribute('scrollTop','0');
		newBrowser.setAttribute('class','pBrowser');
		newBrowser.setAttribute('oldUrl', 'null');
		newBrowser.setAttribute('onscroll', 'activateOnScroll(this)');
		
		var newNotificationBox = document.createElement('notificationbox');
		newNotificationBox.setAttribute('flex','0');
		
		newBrowserControlPanel.appendChild(newBackButton);
		newBrowserControlPanel.appendChild(newForwardButton);
		newBrowserControlPanel.appendChild(newStopButton);
		newBrowserControlPanel.appendChild(newReloadButton);
		newBrowserControlPanel.appendChild(newHomeButton);
		newBrowserControlPanel.appendChild(newVboxAddressBar);
		newBrowserControlPanel.appendChild(newGoButton);
		newBrowserControlPanel.appendChild(newBookmarkButton);
		newBrowserControlPanel.appendChild(newSeparater);
		
		newBrowserControlPanel.appendChild(newTitle);
		newBrowserControlPanel.appendChild(newSeparater1);
		newBrowserControlPanel.appendChild(newAddTab);

		newBrowserContainer.appendChild(newBrowserControlPanel);
		newBrowserContainer.appendChild(browserGap);
		newBrowserContainer.appendChild(newNotificationBox);
		newBrowserContainer.appendChild(newBrowser);
		
		if(urlname!="")
		{
			newBrowser.setAttribute('src',urlname);
		}
		else{newBrowser.setAttribute('src','about:newtab');}
		
		
		//Resizer controls
		var resizerBox = document.createElement('vbox');
		resizerBox.setAttribute('id', 'pContainerResizer-' + MainControlCounter);
		
		var resizerStack = document.createElement('stack');
		resizerStack.setAttribute('flex', '1');
		resizerStack.setAttribute('width', '14');
		resizerBox.appendChild(resizerStack);
		var resizerTarget = 'polyBrowserContainer-' + MainControlCounter;
		
		var resizeRight = document.createElement('resizer');
		resizeRight.setAttribute('class', 'widthResizer');
		resizeRight.setAttribute('dir', 'right');
		resizeRight.setAttribute('width', '14');
		resizeRight.setAttribute('height', '300');
		resizeRight.setAttribute('right', '0');
		resizeRight.setAttribute('top', '0');
		resizeRight.setAttribute('style', '-moz-appearance: none;background-image:url(chrome://polybrowser/skin/resizer.png);'); 
		resizeRight.setAttribute('element', resizerTarget);
		resizerStack.appendChild(resizeRight);
		
		var resizeLeft = document.createElement('vbox');
		
		var resizeLeftResizer = document.createElement('resizer');
		resizeLeftResizer.setAttribute('dir', 'left');
		resizeLeftResizer.setAttribute('width', '14');
		resizeLeftResizer.setAttribute('height', '300');
		resizeLeftResizer.setAttribute('element', resizerTarget);
		resizeLeftResizer.setAttribute('style', 'transform:rotate(180deg);width:14px;height:300px;-moz-appearance: none;background-image:url(chrome://polybrowser/skin/resizer.png);');
		resizeLeft.appendChild(resizeLeftResizer);
		
		resizeLeft.setAttribute('id', 'pResizeLeft-' + MainControlCounter);
		resizeLeft.setAttribute('class', 'widthResizer');
		resizeLeft.setAttribute('flex', '0');
		resizeLeft.setAttribute('width', '14');
		resizeLeft.setAttribute('height', '300');
		resizeLeft.setAttribute('style', 'width:14px;height:300px;position:absolute;left:-19px;margin-top:-325px;'); 
		
		newBrowserContainer.appendChild(resizeLeft);
		
		var numPolyTabs = document.getElementById('tabArrowScroller').children.length;
		var currentTab = PolyActiveTab().nextSibling;
		
		if(numPolyTabs > 1 && currentTab != null){
				//Insert new site next to current tab
				var clickTabNumber = (currentTab.id.split('-'))[1];
				var currentContainer = document.getElementById('polyBrowserContainer-'+clickTabNumber);
				
				objMainTabContainerWithScroller.insertBefore(newTab, currentTab);
				objBrowserContainer.insertBefore(newBrowserContainer, currentContainer);	
				objBrowserContainer.insertBefore(resizerBox, currentContainer);
			}
		else{
				//Insert new site at end
				objMainTabContainerWithScroller.appendChild(newTab);
				objBrowserContainer.appendChild(newBrowserContainer);
				objBrowserContainer.appendChild(resizerBox);
			}		
		window.setTimeout(setZoomMarginAll, 10);
		
		TabCountStart++;
		
		//
		// Adding Listener to recently added browsers
		//
		var objBrowserAddedRecently = document.getElementById('polyBrowser-'+MainControlCounter);
		objBrowserAddedRecently.addEventListener('load', polyBrowserLoadComplete , true);	
		objBrowserAddedRecently.addProgressListener(PolyBrowserListener);
				
		//
		// Resize Browser Control
		//
		
					
			
		//Global function for setting browser size
		var loadingContainer = objBrowserAddedRecently.parentNode;
		pBrowserSetSize(objBrowserAddedRecently, loadingContainer);
					
		
		//Analytics
		var iframe = document.createElement('iframe');
//		iframe.setAttribute("type", "content");
		iframe.setAttribute("src", "http://polysuite.com/PolyBrowser/ga/new-tab.html");
		iframe.setAttribute("style", "overflow:hidden;width:0;height:0;position:absolute");
		objBrowserAddedRecently.appendChild(iframe); 
		
		
	}
	catch(ee)
	{
		//alert(ee.message);
	}
}




