
//Function to set focus on the Find textbox
function focusTimeout(){ 
		var finderBar = document.getElementById('FindToolbar');
		finderBar.startFind();
	} 

function findLaunch(){
		var finderBar = document.getElementById('FindToolbar');
		finderBar.removeAttribute('hidden');
		finderBar.style.display = "block";
		var activeBrowser = PolyActiveBrowser();
		finderBar.browser = activeBrowser;
		window.setTimeout(focusTimeout, 100);
}

function findbarCloseAction(){
		var finderBar = document.getElementById('FindToolbar');
		finderBar.style.display = "none";
		finderBar.close();
}


//Loop to switch the focused browser for the findbar to the active browser
function findBarBrowserSwitch(){
		var finderBar = document.getElementById('FindToolbar');
		if (finderBar.hidden){return;}
		else {	
				var activeBrowser = PolyActiveBrowser();
				finderBar.browser = activeBrowser;
			}
}

try {setInterval(findBarBrowserSwitch, 500);} 
//todo add exception handling?
catch (e){}
