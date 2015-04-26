//Components.utils.import("resource://gre/modules/osfile.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");

//////////Functions to execute if the version of the browser has been upgraded

//Pull current version from preferences and show Welcome page
function checkPolyVersion(){
		var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                      .getService(Components.interfaces.nsIPrefService);
		
		var lastVersion = prefs.getIntPref("PolyBrowserLastVersion");
		var thisVersion = prefs.getIntPref("PolyBrowserThisVersion");
		if (thisVersion > lastVersion) { 
			pBrowserNewTabClick("http://polysuite.com/PolyBrowser/Welcome/");
			prefs.setIntPref("PolyBrowserLastVersion", thisVersion);
			}
}

try {setTimeout("checkPolyVersion()", 2000);} 
//todo add exception handling?
catch (e){}

//Check if "purgecaches file exists and clear the cache
let dirSvc = Cc["@mozilla.org/file/directory_service;1"].
             getService(Ci.nsIProperties);
let file = dirSvc.get("XREExeF", Ci.nsIFile);
file.leafName = ".purgecaches";


try {setTimeout("file.remove(false)", 2000);} 
//todo add exception handling?
catch (e){}