var g_mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                       .getInterface(Components.interfaces.nsIWebNavigation)
                       .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                       .rootTreeItem
                       .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                       .getInterface(Components.interfaces.nsIDOMWindow);
var request = new XMLHttpRequest();

function MenuPropagating(event)
{
	CheckIfUserISLoggedIn();
}

function GoToMyPolymarks(event)
{
	pBrowserNewTabClick("http://polymarks.com/"+user_name);
}

function Login()
{
	pBrowserNewTabClick('http://polymarks.com/?login');
}

function CheckIfUserISLoggedIn()
{
	var getAuthRequest =  new XMLHttpRequest();
	var where_url = 'http://polymarks.com/api/check_auth/';
	getAuthRequest.open('GET', where_url, true);
	getAuthRequest.onreadystatechange = function() {
		if (getAuthRequest.readyState == 4) {
			if(getAuthRequest.status == 200) {
			var result = getAuthRequest.responseText;
			//alert(getAuthRequest.responseText);
			var obj = typeof JSON !='undefined' ?  JSON.parse(result) : eval('('+result+')');
			
			if(obj.error != 1)
				{GetPolymarks(this);}
			else
				{
				var the_menu = document.getElementById("AliBar-Post-Button-Menu-Popup-Inside");
				var the_menu2 = document.getElementById("AliBar-Post-Button-Menu-Popup");
				try{
					while(document.getElementById('__user_item__') != null)
						document.getElementById('AliBar-Post-Button-Menu-Popup').removeChild(document.getElementById('__user_item__'));
				}catch(ex){}
				document.getElementById('AliBar-Post-Button-Menu-Popup-Inside').setAttribute('hidden', 'true');
				document.getElementById('separator_id').setAttribute('hidden', 'true');
				document.getElementById('AliBar-Post-Button-Manage-PolyMarks').setAttribute('hidden', 'true');
				document.getElementById('AliBar-Post-Button-Login').setAttribute('hidden', 'false');
				}
			
			}
		}
	}
	getAuthRequest.send(null);
}

function GetPolymarks(event)
{
	var xmlhttp =  new XMLHttpRequest();
	var where_url = 'http://polymarks.com/api/get_polymarks/' + GetKey();
	xmlhttp.open('GET', where_url, true);
	xmlhttp.onreadystatechange = function() {
	if (xmlhttp.readyState == 4)
	{
		if(xmlhttp.status == 200)
		{
			var the_menu = document.getElementById("AliBar-Post-Button-Menu-Popup-Inside");
			var the_menu2 = document.getElementById("AliBar-Post-Button-Menu-Popup");
			try{
				var j=0;
				while(the_menu.getElementsByTagName('menuitem').length != 0)
					{
					the_menu.removeItemAt(0);
					}
			}catch(ex){}
			
			try{
				the_menu.removeChild(the_menu.getElementsByTagName('menuseparator')[0]);
			}catch(ex2){}
			
			try{
			while(document.getElementById('__user_item__') != null)
				document.getElementById('AliBar-Post-Button-Menu-Popup').removeChild(document.getElementById('__user_item__'));
			}catch(ex4){}

			try{
			var result = xmlhttp.responseText;
			
			document.getElementById('AliBar-Post-Button-Menu-Popup-Inside').setAttribute('hidden', 'false');
			document.getElementById('separator_id').setAttribute('hidden', 'false');
			document.getElementById('AliBar-Post-Button-Manage-PolyMarks').setAttribute('hidden', 'false');
			document.getElementById('AliBar-Post-Button-Login').setAttribute('hidden', 'true');
			
			var obj = typeof JSON !='undefined' ?  JSON.parse(result) : eval('('+result+')');
			try{
				var i=0;
				user_name = obj.login;
				var in_el = the_menu.insertItemAt( 0,obj["default"].name,obj["default"].short_name )
				in_el.setAttribute('oncommand', 'AddToExistingPolymark(this)');
					
				for (key in obj.data)
				{
					var in_el = the_menu.insertItemAt( 0,obj.data[key].name,obj.data[key].short_name )
					in_el.setAttribute('oncommand', 'AddToExistingPolymark(this)');
					
					var el = document.createElement('menuitem');
					el.setAttribute('value', obj.data[key].short_name);
					el.setAttribute('label', obj.data[key].name);
					el.setAttribute('id','__user_item__');
					el.setAttribute('oncommand', 'GoToPolymark(this)');
					the_menu2.insertBefore(el, document.getElementById('separator_id'));
				
				}
				
				var el = document.createElement('menuitem');
				el.setAttribute('value', obj["default"].short_name);
				el.setAttribute('label', obj["default"].name);
				el.setAttribute('id','__user_item__');
				el.setAttribute('oncommand', 'GoToPolymark(this)');
				the_menu2.insertBefore(el, document.getElementById('separator_id'));				
				
			}catch(in_ex){}
			//<menuitem label="No polymarks created" id="__user_item__" disabled="true"/>
			
			if(!obj || !obj.data || obj.data.length == 0)
			{
				var el = document.createElement('menuitem');
				el.setAttribute('label', 'No PolyMarks created');
				el.setAttribute('id','__user_item__');
				el.setAttribute('disabled','true');
				the_menu2.insertBefore(el, document.getElementById('separator_id'));
			}
			
			
			//the_menu.appendItem("Unfiled Bookmarks", "");
			the_menu.getElementsByTagName('menupopup')[0].appendChild( document.createElement('menuseparator') );
			var item = the_menu.appendItem("Add to New PolyMark", "");
			item.setAttribute('oncommand', 'AddToNewPolyMark(event)');
			}catch(ex3){}

			
			//the_menu.appendItem()
        }
	}};
	xmlhttp.send(null);
}

function GoToPolymark(sender)
{
	//g_mainWindow.gBrowser.selectedTab = g_mainWindow.gBrowser.addTab();
	pBrowserNewTabClick('http://polymarks.com/'+sender.value);
}

function AddToExistingPolymark(sender)
{
	var newDate = new Date;
	var xrenovina = newDate.getTime() + '","list_name":"' + sender.label ;
	var b = gBrowser.selectedTab;
	var anArray = new Array();
	var incrementer = 0;
	try {
		var url_without_http = content.document.location;
		var url_with_http = content.document.location;
		//alert(content.document.location);
		//alert(gBrowser.contentDocument.title);
		try{
		if(url_with_http.indexOf("http://") == 0)
			url_without_http = url_with_http.split("http://")[1];
			}catch(eee){}
		try{
		if(url_with_http.indexOf("https://") == 0)
			url_without_http = url_with_http.split("https://")[1];	
		}catch(eee2){}
		
		anArray[incrementer++] = '"' + encodeURIComponent(url_without_http) + '":"'+ encodeURIComponent(gBrowser.contentDocument.title) +'"' ;
	  }
	catch(ee){}
	
	
	var datate = new Date;
	var theRStrRequest = 'body={"url":{' + anArray + '},"ID":"'+ datate.getTime() +'"'+',"list_name":"' + sender.label + '"}';
	request = new XMLHttpRequest();
	request.open("POST", "http://polymarks.com/api/new_polymark", true);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	request.setRequestHeader("Content-length", theRStrRequest.length);
	request.setRequestHeader("Connection", "close");
	request.onload = function()
					{	
						//alert("Website was successfully added to " + sender.label + " PolyMark", "PolyMarks application");
						//g_mainWindow.gBrowser.selectedTab = g_mainWindow.gBrowser.addTab();
						pBrowserNewTabClick('http://polymarks.com/' + sender.value);
					};
	request.send(theRStrRequest);
}

function AddToNewPolyMark(event)
{
	var the_key = GetKey();
	if( the_key == "" || the_key == undefined)
	{
		pBrowserNewTabClick('http://polymarks.com/?login');
		return;
	}
						
	var prevReturnValue = window.returnValue; 
	window.returnValue = undefined;

	var params = 'chrome,width=222,height=96';
	var dlgReturnValue = window.showModalDialog('chrome://polybrowser/content/polyname.xul',  params);	
	if (dlgReturnValue == undefined) 
	{
		dlgReturnValue = window.returnValue;
	}
	window.returnValue = prevReturnValue;
	if(dlgReturnValue == undefined || dlgReturnValue == "")
		return;
		
	var newDate = new Date;
	var xrenovina = newDate.getTime() + '","list_name":"' + dlgReturnValue ;
	var b = gBrowser.selectedTab;
	var anArray = new Array();
	var incrementer = 0;
	try {
		var url_without_http = content.document.location;
		var url_with_http = content.document.location;
		//alert(content.document.location);
		//alert(gBrowser.contentDocument.title);
		try{
		if(url_with_http.indexOf("http://") == 0)
			url_without_http = url_with_http.split("http://")[1];
			}catch(eee){}
		try{
		if(url_with_http.indexOf("https://") == 0)
			url_without_http = url_with_http.split("https://")[1];	
		}catch(eee2){}
		
		anArray[incrementer++] = '"' + encodeURIComponent(url_without_http) + '":"'+ encodeURIComponent(gBrowser.contentDocument.title) +'"' ;
	  }
	catch(ee){}
	
	
	var datate = new Date;
	var theRStrRequest = 'body={"url":{' + anArray + '},"ID":"'+ datate.getTime() +'"'+',"list_name":"' + dlgReturnValue + '"}';
	request = new XMLHttpRequest();
	request.open("POST", "http://polymarks.com/api/new_polymark", true);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	request.setRequestHeader("Content-length", theRStrRequest.length);
	request.setRequestHeader("Connection", "close");
	request.onload = function()
	{
		var result = request.responseText;
		var obj = typeof JSON !='undefined' ?  JSON.parse(result) : eval('('+result+')');
		if(obj.error == 1)
			pBrowserNewTabClick('http://polymarks.com/?login');			
	};
	//alert(theRStrRequest);
	request.send(theRStrRequest);
}

function CreateNewPolymark(event)
{
	pBrowserNewTabClick('http://polymarks.com/collecting');
}

var user_name = "";
function PostUrls(url_to_post, xren, response_callback)
{
	var anArray = new Array();
    var incrementer = 0;
	
	var browserContainerObj = document.getElementById('browserContainer');
	var browserArray = browserContainerObj.getElementsByTagName('browser');
	var num = browserArray.length;
	for (var i = 0; i < num; i++)
	{
		var b = browserArray[i];
		try 
		{
			var url_without_http = b.currentURI.spec;
			var url_with_http = b.currentURI.spec;
			
			if( (b.currentURI.spec.indexOf("http://polymarks.com/collecting") == 0) || 
				(b.currentURI.spec.indexOf("http://wwww.polymarks.com/collecting") == 0) )
				continue;
				
			if(url_with_http.indexOf("http://") == 0)
				url_without_http = url_with_http.split("http://")[1];
				
			if(url_with_http.indexOf("https://") == 0)
				url_without_http = url_with_http.split("https://")[1];	
			
			//alert(url_without_http + "\n" + b.contentTitle);
			anArray[incrementer++] = '"' + encodeURIComponent(url_without_http) + '":"'+ encodeURIComponent(b.contentTitle) +'"' ;
		}
		catch(e)
		{  
			Components.utils.reportError(e);  
		}  
	}
	
	
	/*
    var num = gBrowser.browsers.length;
    for (var i = 0; i < num; i++) {  
      var b = gBrowser.getBrowserAtIndex(i);  
      try {
		var url_without_http = b.currentURI.spec;
		var url_with_http = b.currentURI.spec;
		
		if( (b.currentURI.spec.indexOf("http://polymarks.com/collecting") == 0) || 
			(b.currentURI.spec.indexOf("http://wwww.polymarks.com/collecting") == 0) )
			continue;
			
		if(url_with_http.indexOf("http://") == 0)
			url_without_http = url_with_http.split("http://")[1];
			
		if(url_with_http.indexOf("https://") == 0)
			url_without_http = url_with_http.split("https://")[1];	
			
		anArray[incrementer++] = '"' + encodeURIComponent(url_without_http) + '":"'+ encodeURIComponent(b.contentTitle) +'"' ;
   	  }
      catch(e) {  
        Components.utils.reportError(e);  
      }  
    }
	*/

	var theRStrRequest = 'body={"url":{' + anArray + '},"ID":"'+ xren +'"}';
	request = new XMLHttpRequest();
	request.open("POST", /*"http://polymarks.com/api/new_polymark"*/url_to_post, true);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	request.setRequestHeader("Content-length", theRStrRequest.length);
	request.setRequestHeader("Connection", "close");
	request.onload = response_callback;
	
	request.send(theRStrRequest);
}

function GetKey()
{
	try{
	var ios = Components.classes["@mozilla.org/network/io-service;1"]
            .getService(Components.interfaces.nsIIOService);
	var uri = ios.newURI("http://polymarks.com/auth/", null, null);
	var cookieSvc = Components.classes["@mozilla.org/cookieService;1"]
					  .getService(Components.interfaces.nsICookieService);
	var cookie = cookieSvc.getCookieString(uri, null);	
	return cookie.match('key=([a-zA-Z0-9]+)')[1];
	} catch(ex){return "";}
}

function handleDocumentLoad(win, topic) 
{
    var url = win.location.href;
}

function _onPageLoad(event) {
  // this is the content document of the loaded page.
	let doc = event.originalTarget;
 
	var url = doc.defaultView.location.href;
	if (( url.indexOf("http://polymarks.com/collecting") == 0) || ( url.indexOf("http://www.polymarks.com/collecting") == 0) )
	{
		var newDate = new Date;
		var xrenovina = newDate.getTime();
		
		PostUrls( "http://polymarks.com/collect/" + xrenovina, xrenovina, function()
		{
			doc.defaultView.location.href = "http://polymarks.com/collect/" + xrenovina;	
		});
    }
}

function InitObservers()
{
    //let observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
    //observerService.addObserver({observe: handleDocumentLoad}, "EndDocumentLoad", false);
	gBrowser.addEventListener("load", _onPageLoad, true);
	
	var num = gBrowser.browsers.length;  
    for (var i = 0; i < num; i++) {  
      var b = gBrowser.getBrowserAtIndex(i);  
      try {
		  if (( b.currentURI.spec.indexOf("http://polymarks.com/collecting") == 0) 
		  ||  ( b.currentURI.spec.indexOf("http://www.polymarks.com/collecting") == 0) ) 
			{
				var newDate = new Date;
				var xrenovina = newDate.getTime();
				PostUrls( "http://polymarks.com/collect/" + xrenovina, xrenovina, function()
							{
							//g_mainWindow.getBrowser().selectedBrowser.contentWindow.location.href = ;	
							pBrowserNewTabClick("http://polymarks.com/collect/" + xrenovina +"/?toolbar=ok");
							}
						);
				
				break;
			}
	  }
      catch(e) {  
        //Components.utils.reportError(e);  
      }  
    }
}

function InitButton()
{
	var addonBar = document.getElementById("nav-bar");
	if (addonBar) {
	  if (!document.getElementById("AliBar-Post-Button")) {
		var addonBarCloseButton = document.getElementById("search-container")
		addonBar.insertItem("AliBar-Post-Button", addonBarCloseButton.nextSibling);
	  }
	}
}

//main
try 
{
	setTimeout("InitObservers()", 4000);
	setTimeout("InitButton()", 2000);
} 
catch (e) 
{
alert(e);
}

