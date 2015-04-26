//Changes context menu and sets functions.  Should be a different .JS file
var pSelection = '';
const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
                                   .getService(Components.interfaces.nsIClipboardHelper);

//Handles events from the tab and content context menus
//TODO Re-factor this to separate functions
function ContextMenuHandler(event)
{
	
	var objClickedId = (event.currentTarget.id).toLowerCase();
	var objActivateBrowser = "", StartIndex = 0, EndIndex = TabCountStart+1, TempObj, targetClick;
	
	var tabParent,browserParent,tabCurrent,tabBrowser,TotalTabCount,AllTabChildNameToDelete,AllBrowserChildNameToDelete;
	var ChildTabNameToDelete,ChildBrowserNameToDelete,TempTabObjToDelete,TempBrowserObjToDelete, url;
	
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
	

	if(objClickedId == 'openlinkwindow')
	{
		// Open link in new window
		if(objActivateBrowser)
		{
			CurrentObj = objActivateBrowser.contentWindow.document.elementFromPoint(MouseX, MouseY);
			var DeepStart=0, DeepSearchLevel = 10, SearchStart=0;
			if(CurrentObj)
			{
				var OpenUrl = CurrentObj.href;
				if(!OpenUrl || OpenUrl==undefined)
				{
					var y = document.defaultView.getComputedStyle(CurrentObj,null).getPropertyValue('cursor');
					if(y == 'pointer')
					{
						// Find href value
						// Search Href Tag in Child Node
						if(CurrentObj.children.length > 0)
						{
							for(SearchStart=0;SearchStart<CurrentObj.children.length;SearchStart++)
							{
								if(CurrentObj.children[SearchStart].nodeName.toLowerCase()=="a")
								{
									OpenUrl = CurrentObj.children[SearchStart].href;
								}
							}
						}
						
						
						if(!OpenUrl || OpenUrl==undefined)
						{
							// Search Href Tag in Parent Node
							var thea=CurrentObj.parentNode;
							DeepStart = 0;
							while(thea.nodeName.toLowerCase()!="a" && DeepStart<DeepSearchLevel)
							{
								thea=CurrentObj.parentNode;
								DeepStart++;
							}
							OpenUrl = thea.href;
						}
					}
				}
				if(OpenUrl!=undefined)
				{
					WriteToPref('extensions.polybrowser.preweblist',OpenUrl);
					window.open('about:newtab','open_window','menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0');
				}
			}
		}
	}
	else if(objClickedId == 'openlinktabgo')
	{
		if(objActivateBrowser)
		{
			CurrentObj = objActivateBrowser.contentWindow.document.elementFromPoint(MouseX, MouseY);
			var DeepStart=0, DeepSearchLevel = 10, SearchStart=0;
			if(CurrentObj)
			{
				var OpenUrl = CurrentObj.href;
				if(!OpenUrl || OpenUrl==undefined)
				{
					var y = document.defaultView.getComputedStyle(CurrentObj,null).getPropertyValue('cursor');
					if(y == 'pointer')
					{
						if(CurrentObj.children.length > 0)
						{
							for(SearchStart=0;SearchStart<CurrentObj.children.length;SearchStart++)
							{
								if(CurrentObj.children[SearchStart].nodeName.toLowerCase()=="a")
								{
									OpenUrl = CurrentObj.children[SearchStart].href;
								}
							}
						}
						if(!OpenUrl || OpenUrl==undefined)
						{
							var thea=CurrentObj.parentNode;
							DeepStart = 0;
							while(thea.nodeName.toLowerCase()!="a" && DeepStart<DeepSearchLevel)
							{
								thea=CurrentObj.parentNode;
								DeepStart++;
							}
							OpenUrl = thea.href;
						}
					}
				}
				if(OpenUrl!=undefined)
				{
					/*pBrowserOpenInNewTabUnfocussed(OpenUrl);*/
					pBrowserNewTabClick(OpenUrl);
				}
			}
		}
	}
	else if(objClickedId == 'context-openlinkintab') //'openlinktab'
	{
		if(objActivateBrowser)
		{
			CurrentObj = objActivateBrowser.contentWindow.document.elementFromPoint(MouseX, MouseY);
			var DeepStart=0, DeepSearchLevel = 10, SearchStart=0;
			if(CurrentObj)
			{
				var OpenUrl = CurrentObj.href;

				if(!OpenUrl || OpenUrl==undefined)
				{
					var y = document.defaultView.getComputedStyle(CurrentObj,null).getPropertyValue('cursor');
					if(y == 'pointer')
					{
						// Find href value
						
						// Search Href Tag in Child Node
						if(CurrentObj.children.length > 0)
						{
							for(SearchStart=0;SearchStart<CurrentObj.children.length;SearchStart++)
							{
								if(CurrentObj.children[SearchStart].nodeName.toLowerCase()=="a")
								{
									OpenUrl = CurrentObj.children[SearchStart].href;
								}
							}
						}
						
						
						if(!OpenUrl || OpenUrl==undefined)
						{
							// Search Href Tag in Parent Node
							var thea=CurrentObj.parentNode;
							DeepStart = 0;
							while(thea.nodeName.toLowerCase()!="a" && DeepStart<DeepSearchLevel)
							{
								thea=CurrentObj.parentNode;
								DeepStart++;
							}
							OpenUrl = thea.href;
						}
					}
				}
				if(OpenUrl!=undefined)
				{
					pBrowserOpenInNewTabUnfocussed(OpenUrl);
				}
			}
		}
	}
	else if(objClickedId == 'polycopy'){gClipboardHelper.copyString(pSelection);}
	else if(objClickedId == 'gototop'){var objTop = document.getElementById('browserContainer'); if(objTop){objTop.scrollTop = 0;}}
	else if(objClickedId == 'gotobottom'){var objBottom = document.getElementById('browserContainer');if(objBottom){objBottom.scrollTop = objBottom.scrollHeight;}}
	else if(objClickedId == 'gotoback'){if(objActivateBrowser) objActivateBrowser.goBack();}
	else if(objClickedId == 'gotoforward'){if(objActivateBrowser) objActivateBrowser.goForward();}
	else if(objClickedId == 'gotoreload')
	{
		var fetchUrl = document.getElementById('polyAddressBar-'+targetClick).value;
		if(fetchUrl.indexOf('about:newtab') == -1){if(objActivateBrowser) objActivateBrowser.reload();}
	}
	else if(objClickedId == 'gotostop')
	{
		if(objActivateBrowser)
		{
			objActivateBrowser.stop();
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
	else if(objClickedId == 'bookmarkthispage')
	{
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
					try
					{		
						// Page Setup
						// PrintUtils.showPageSetup();
						
						// Print
						// PrintUtils.print(objActivateBrowser.contentWindow);
						
						// Bookmark Dialog Box Calling //
						/*
						PlacesUIUtils.showBookmarkDialog({
						  action: "add",
						  type: "bookmark",
						  uri: uri,
						  title: fetchTitle
						}, window);
						*/
					}
					catch(ee)
					{
						//(ee.message);
					}
				}
			}
		}
	}
	else if(objClickedId == 'openpagesource')
	{
		var PageSourceUrl = document.getElementById('polyAddressBar-'+targetClick).value;
		if(PageSourceUrl.indexOf('view-source:') == -1) PageSourceUrl = "view-source:"+PageSourceUrl;
		pBrowserNewTabClick(PageSourceUrl);
	}
	else if(objClickedId == 'opencache'){pBrowserNewTabClick('about:cache');}
	else if(objClickedId == 'openaddonsmanager'){pBrowserNewTabClick('about:addons');}
	else if(objClickedId == 'opennewtab'){pBrowserNewTabClick('');}
	else if(objClickedId == 'openduplicate')
	{
		var targetClick, targetAddressBar;
		if(contextMenuControl)
		{
			targetClick = (contextMenuControl.split('-'))[1];
			if(targetClick)
			{
				targetAddressBar = document.getElementById('polyAddressBar-'+targetClick);
				if(targetAddressBar){pBrowserNewTabClick(targetAddressBar.value);}
			}
		}
	}
	else if(objClickedId == 'reloadall'){reloadAll();}
	else if(objClickedId == 'closecurrent' || 
			objClickedId == 'closeother' || 
			objClickedId == 'closeleft' || 
			objClickedId == 'closeright')
	{	var targetClick;
		if(objClickedId == 'closecurrent')
		{
			if(contextMenuControl)
			{
				pBrowserCloseActive();
			}
		}
		else if(objClickedId == 'closeother' || objClickedId == 'closeleft' || objClickedId == 'closeright')
		{
			try{
			if(contextMenuControl)
			{	
				targetClick = (contextMenuControl.split('-'))[1],i=0;
				if(targetClick)
				{
				var	tabParent = document.getElementById('tabArrowScroller');
				var	browserParent = document.getElementById('browserContainer');
				var	AllTabChildNameToDelete = "";
				var	AllBrowserChildNameToDelete = "";
					
				var	tabCurrent = PolyActiveTab();
				var tabNumber = ((tabCurrent.id).split('-'))[1];	
				var	tabResizer = document.getElementById('pContainerResizer-' + tabNumber);

				
					if(objClickedId == 'closeother')
					{
						var	activeBrowser = PolyActiveBrowser().parentNode;
						var activeResizer = activeBrowser.nextSibling;
						TotalTabCount = tabParent.children.length;
						var browserCounter = TotalTabCount * 2;
						for(var i=0;i<TotalTabCount;i++)
						{
							if(tabParent.children[i] != tabCurrent )
							{
								if(i!=0) AllTabChildNameToDelete += "##--##" + tabParent.children[i].id;
								else AllTabChildNameToDelete += tabParent.children[i].id;
							}
						}
						for(i=0;i<browserCounter;i++)
						{
							if(browserParent.children[i] != activeBrowser && browserParent.children[i] != activeResizer)
							{
								if(i!=0) AllBrowserChildNameToDelete += "##--##" + browserParent.children[i].id;
								else AllBrowserChildNameToDelete = browserParent.children[i].id;
							}
						}
					}
					else if(objClickedId == 'closeleft')
					{
						var	activeBrowser = PolyActiveBrowser().parentNode;
						TotalTabCount = tabParent.children.length;
						var browserCounter = TotalTabCount * 2;
						for(i=0;i<TotalTabCount;i++)
						{
							if(tabParent.children[i] != tabCurrent ) //&& tabParent.children[i]
							{
								if(i!=0){ AllTabChildNameToDelete += "##--##" + tabParent.children[i].id; }
								else { AllTabChildNameToDelete = tabParent.children[i].id;	}
							}
							else {break;}
						}
						
						for(i=0;i< browserCounter;i++)
						{
							if(browserParent.children[i] != activeBrowser ) 
							{
								if(i!=0){ AllBrowserChildNameToDelete += "##--##" + browserParent.children[i].id; }
								else{ AllBrowserChildNameToDelete = browserParent.children[i].id; }
							}
							else {break;}
						}
					}
					else if(objClickedId == 'closeright')
					{
						var	activeBrowser = PolyActiveBrowser().parentNode;
						TotalTabCount = tabParent.children.length;
						var browserCounter = TotalTabCount * 2;
						for(i=0;i<TotalTabCount;i++)
						{
							if(tabParent.children[i] == tabCurrent ) 
							{
								for(j=i+1;j<TotalTabCount;j++)
								{
									if(j!=i+1){ AllTabChildNameToDelete += "##--##" + tabParent.children[j].id; }
									else { AllTabChildNameToDelete = tabParent.children[j].id;	}
								}
							}
						}
						
						for(i=0;i<browserCounter;i++)
						{
							if(browserParent.children[i] == activeBrowser) 
							{
								for(j=i+2;j<browserCounter;j++)
								{
									if(j==i+1){var  AllBrowserChildNameToDelete = browserParent.children[j].id;	}
									else{ AllBrowserChildNameToDelete += "##--##" + browserParent.children[j].id; }
								}
							}
						}
						
					}
					
					//Execute Close Left / Right / Other
					ChildTabNameToDelete = AllTabChildNameToDelete.split("##--##");

					for(i=0;i<ChildTabNameToDelete.length;i++)
					{
						if(ChildTabNameToDelete[i])
						{
							var TempTabObjToDelete = document.getElementById(ChildTabNameToDelete[i]);
							if(TempTabObjToDelete) TempTabObjToDelete.parentNode.removeChild(TempTabObjToDelete);
						}
					}
					
					ChildBrowserNameToDelete = AllBrowserChildNameToDelete.split("##--##");
					var ChildBrowserLoop = ChildBrowserNameToDelete.length;
					for(i=0;i<ChildBrowserLoop;i++)
					{
						if(ChildBrowserNameToDelete[i])
						{
							var TempBrowserObjToDelete = document.getElementById(ChildBrowserNameToDelete[i]);
							if(TempBrowserObjToDelete) browserParent.removeChild(TempBrowserObjToDelete);
						}
					}
					
				}
			}
			}
			catch(ee){/*alert(ee.message);*/}
		}
		
		//
		// Delete Extra Label helper objects to make application more accurate
		// Common task to perform
		
		var mainbrowserContainer = document.getElementById("browserContainer");
		var StartIndex,EndIndex,computedId;
		if(mainbrowserContainer)
		{
			computedId = mainbrowserContainer.getElementsByTagName('browser')[0].id;
			if(computedId)
			{
				EndIndex = computedId.split('-')[1];
				for(StartIndex=0;StartIndex<=EndIndex;StartIndex++)
				{
					TempObj = document.getElementById('helperLabel-'+StartIndex);
					if(TempObj!=null)
					{
						mainbrowserContainer.removeChild(TempObj);
					}
				}
			}
		}
		

		if(contextMenuControl)
		{
			targetClick = (contextMenuControl.split('-'))[1];
			var url;
			if(targetClick)
			{
				url = document.getElementById('polyAddressBar-'+targetClick).value;
				try
				{
					var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
					var browserEnumerator = wm.getEnumerator("navigator:browser");
					var found = false;
					while (!found && browserEnumerator.hasMoreElements())
					{
						var browserWin = browserEnumerator.getNext();
						var tabbrowser = browserWin.gBrowser;

						// Check each tab of this browser instance
						var numTabs = tabbrowser.browsers.length;
						for (var index = 0; index < numTabs; index++)
						{
							var currentBrowser = tabbrowser.getBrowserAtIndex(index);
							if (url == currentBrowser.currentURI.spec)
							{
								if(numTabs < 2){tabbrowser.addTab('about:newtab');}
								tabbrowser.selectedTab = tabbrowser.tabContainer.childNodes[index];
								tabbrowser.removeCurrentTab();
								found = true;			
								break;
							}
						}
					}
				}
				//TODO add exception handling?
				catch(ee){}
			}
		}
		
		//
		// Adding Flex Property to ArrowScroller Controller
		//
		var objPolyWrapper = document.getElementById('polyHomeWrapper');
		var objPolyArrowScroller = document.getElementById('tabArrowScroller');
		var objPolyNewTab = document.getElementById('newTab');
		
		var ArrowScrollWidth = 0;
		if(objPolyArrowScroller)
		{
			for(iCount=0;iCount<objPolyArrowScroller.children.length;iCount++)
			{
				if(objPolyArrowScroller.children[iCount])
				{
					ArrowScrollWidth += objPolyArrowScroller.children[iCount].clientWidth;
				}
			}
		}
		
		var containerWidth = objPolyWrapper.boxObject.width + ArrowScrollWidth + objPolyNewTab.boxObject.width+10;
		
		if(window.innerWidth < containerWidth)
			objPolyArrowScroller.setAttribute('flex','1');
		else
			objPolyArrowScroller.removeAttribute('flex');
			
		polyBrowserContainerScrolled();


	}    
	/*
	else if(objClickedId == 'wrapthispage')
	{
		objActivateBrowser.style.whiteSpace = 'pre-wrap';
	}
	*/
	
	//HACK - fixed the issue where you could only "Open in..." on right click once... MouseX and MouseY get permanently set unless container is scrolled
	var browserContainer = document.getElementById('browserContainer');
	var browserScrollLeft = browserContainer.scrollLeft;
	browserScrollLeft += 1;
	browserContainer.scrollLeft = browserScrollLeft;
	browserScrollLeft -= 1;
	browserContainer.scrollLeft = browserScrollLeft;
//	Components.utils.unload("chrome://polybrowser/content/pContexMenuHelper.js");
//s	CurrentObj = null;
}

//Loops through and reloads all tabs
function reloadAll()
{
	var browserContainer = document.getElementById('browserContainer'), i=0;
	//Array of all browser containers - contains all controls as well
	//var browserArray = browserContainer.getElementsByClassName('pBrowserContainerClass');
	
	//Use this one for affecting the webpage container only
	var browserArray = browserContainer.getElementsByTagName('browser');

	
	for(i=0;i < browserArray.length;i++)
	{
		var browserLoop = browserArray[i];
		browserLoop.reload();
	}
	
}