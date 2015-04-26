//////////////Functions to check if the version is current, and signal to upgrade if necessary

// Services = object with smart getters for common XPCOM services
Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource://gre/modules/DownloadUtils.jsm");
Components.utils.import("resource://gre/modules/AddonManager.jsm");

XPCOMUtils.defineLazyGetter(this, "gPrefService", function() {
  return Services.prefs;
});

const PREF_EM_HOTFIX_ID = "extensions.hotfix.id";

//Location of remote XML that contains the current version number
var updateURL = 'https://polybrowser.com/download';

function pInit(aEvent)
{
	checkRemoteVersion("display update");

  	let defaults = gPrefService.getDefaultBranch("");
  	let channelLabel = document.getElementById("currentChannel");
  
}

function checkRemoteVersion(action){
	//Grabs the actual Gecko version number
	
    var currentVersion = gPrefService.getIntPref("PolyBrowserThisVersion");                  
	var remoteVersion = "";
	
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://polysuite.com/PolyBrowser/update.xml", true);
	xhr.onload = function (e) {
 	 if (xhr.readyState === 4) {
  		  if (xhr.status === 200) {
  		    remoteVersion = xhr.responseXML.documentElement.childNodes[0].nodeValue;
  		    //Compares local and remote versions
  		    doUpdateAction(currentVersion, remoteVersion, action);
 		   } else {
   		   console.error(xhr.statusText);
  		  }
 		 }
		};
	xhr.onerror = function (e) {
 	 console.error(xhr.statusText);
		};
	xhr.send(null);
}

//Determines whether an update is needed or not, and launches About Dialog
function doUpdateAction(currentVersion, remoteVersion, action){
	switch(action){
	
		case "display update": 
			console.log("display update");
			checkDisplayUpdate(currentVersion, remoteVersion);
			break;
		case "display about dialog":
			if (currentVersion < remoteVersion) {openAboutDialog();}
			break;
	}
}

//Compares current and previous version numbers and updates About Dialog as needed
 function checkDisplayUpdate(currentVersion, remoteVersion){
 //Check remote version number vs local one
 	console.log(currentVersion + "  " + remoteVersion);
	 if (currentVersion < remoteVersion) {
        document.getElementById("noUpdateAvailable").style.display = "none";
		document.getElementById("updateAvailable").style.display = "block";
		document.getElementById("updateLink").style.display = "block";
		console.log("Higher Number");
        return;
      }
	  if (currentVersion >= remoteVersion) {
		document.getElementById("noUpdateAvailable").style.display = "block";
		document.getElementById("updateAvailable").style.display = "none";
		document.getElementById("updateLink").style.display = "none";
		console.log("Lower Number");
		return;
	  }
}

function pbUPdateInit()
{

	checkRemoteVersion("display about dialog");

}

//Check for updates after being open for 5 min
window.setTimeout(pbUPdateInit, 300000); 

//Link to download latest version directly - TODO Add Linux
function downloadLatest(){
	var thisOS = checkingOS();
	switch(thisOS){	
		case "WINNT":
				window.open("http://polysuite.com/PolyBrowser/win/latest");
				break;
		case "Darwin":
				window.open("http://polysuite.com/PolyBrowser/mac/latest");
				break;
		}
}

function checkingOS()
{
	// Returns "WINNT" on Windows Vista, XP, 2000, and NT systems;
	// "Linux" on GNU/Linux; and "Darwin" on Mac OS X.
	var osString = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).OS;
	return osString;
}	
