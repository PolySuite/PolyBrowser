var  XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

var gPrintSettingsAreGlobal = false;
var gSavePrintSettings = false;

var PrintUtils = {

  showPageSetup: function ()
  {
    try {
      var printSettings = this.getPrintSettings();
      var PRINTPROMPTSVC = Components.classes["@mozilla.org/embedcomp/printingprompt-service;1"]
                                     .getService(Components.interfaces.nsIPrintingPromptService);
      PRINTPROMPTSVC.showPageSetup(window, printSettings, null);
      if (gSavePrintSettings) {
        // Page Setup data is a "native" setting on the Mac
        var PSSVC = Components.classes["@mozilla.org/gfx/printsettings-service;1"]
                              .getService(Components.interfaces.nsIPrintSettingsService);
        PSSVC.savePrintSettingsToPrefs(printSettings, true, printSettings.kInitSaveNativeData);
      }
    } catch (e) {
      dump("showPageSetup "+e+"\n");
      return false;
    }
    return true;
  },

  print: function (aWindow)
  {
    var webBrowserPrint = this.getWebBrowserPrint(aWindow);
    var printSettings = this.getPrintSettings();
    try {
      webBrowserPrint.print(printSettings, null);
      if (gPrintSettingsAreGlobal && gSavePrintSettings) {
        var PSSVC = Components.classes["@mozilla.org/gfx/printsettings-service;1"].getService(Components.interfaces.nsIPrintSettingsService);
        PSSVC.savePrintSettingsToPrefs(printSettings, true, printSettings.kInitSaveAll);
        PSSVC.savePrintSettingsToPrefs(printSettings, false,printSettings.kInitSavePrinterName);
      }
    } catch (e) {
      // Pressing cancel is expressed as an NS_ERROR_ABORT return value,
      // causing an exception to be thrown which we catch here.
      // Unfortunately this will also consume helpful failures, so add a
      // dump("print: "+e+"\n"); // if you need to debug
    }
  },

  printPreview: function (aEnterPPCallback, aExitPPCallback, aWindow)
  {
    // if we're already in PP mode, don't set the callbacks; chances
    // are they're null because someone is calling printPreview() to
    // get us to refresh the display.
    var pptoolbar = document.getElementById("print-preview-toolbar");
    if (!pptoolbar) {
      this._onEnterPP = aEnterPPCallback;
      this._onExitPP  = aExitPPCallback;
    } else {
      // hide the toolbar here -- it will be shown in
      // onEnterPrintPreview; this forces a reflow which fixes display
      // issues in bug 267422.
      pptoolbar.hidden = true;
    }

    this._webProgressPP = {};
    var ppParams        = {};
    var notifyOnOpen    = {};
    var webBrowserPrint = this.getWebBrowserPrint(aWindow);
    var printSettings   = this.getPrintSettings();
    // Here we get the PrintingPromptService so we can display the PP Progress from script
    // For the browser implemented via XUL with the PP toolbar we cannot let it be
    // automatically opened from the print engine because the XUL scrollbars in the PP window
    // will layout before the content window and a crash will occur.
    // Doing it all from script, means it lays out before hand and we can let printing do it's own thing
    var PPROMPTSVC = Components.classes["@mozilla.org/embedcomp/printingprompt-service;1"]
                               .getService(Components.interfaces.nsIPrintingPromptService);
    // just in case we are already printing, 
    // an error code could be returned if the Prgress Dialog is already displayed
    try {
      PPROMPTSVC.showProgress(this, webBrowserPrint, printSettings, this._obsPP, false,
                              this._webProgressPP, ppParams, notifyOnOpen);
      if (ppParams.value) {
        var webNav = getBrowser().webNavigation;
        ppParams.value.docTitle = webNav.document.title;
        ppParams.value.docURL   = webNav.currentURI.spec;
      }

      // this tells us whether we should continue on with PP or 
      // wait for the callback via the observer
      if (!notifyOnOpen.value.valueOf() || this._webProgressPP.value == null)
        this.enterPrintPreview();
    } catch (e) {
      this.enterPrintPreview();
    }
  },

  getWebBrowserPrint: function (aWindow)
  {
    var contentWindow = aWindow || window.content;
    return contentWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIWebBrowserPrint);
  },

  ////////////////////////////////////////
  // "private" methods. Don't use them. //
  ////////////////////////////////////////

  setPrinterDefaultsForSelectedPrinter: function (aPSSVC, aPrintSettings)
  {
    if (!aPrintSettings.printerName)
      aPrintSettings.printerName = aPSSVC.defaultPrinterName;

    // First get any defaults from the printer 
    aPSSVC.initPrintSettingsFromPrinter(aPrintSettings.printerName, aPrintSettings);
    // now augment them with any values from last time
    aPSSVC.initPrintSettingsFromPrefs(aPrintSettings, true,  aPrintSettings.kInitSaveAll);
  },

  getPrintSettings: function ()
  {
    var pref = Components.classes["@mozilla.org/preferences-service;1"]
                         .getService(Components.interfaces.nsIPrefBranch);
    if (pref) {
      gPrintSettingsAreGlobal = pref.getBoolPref("print.use_global_printsettings", false);
      gSavePrintSettings = pref.getBoolPref("print.save_print_settings", false);
    }

    var printSettings;
    try {
      var PSSVC = Components.classes["@mozilla.org/gfx/printsettings-service;1"]
                            .getService(Components.interfaces.nsIPrintSettingsService);
      if (gPrintSettingsAreGlobal) {
        printSettings = PSSVC.globalPrintSettings;
        this.setPrinterDefaultsForSelectedPrinter(PSSVC, printSettings);
      } else {
        printSettings = PSSVC.newPrintSettings;
      }
    } catch (e) {
      dump("getPrintSettings: "+e+"\n");
    }
    return printSettings;
  },

  _chromeState: {},
  _closeHandlerPP: null,
  _webProgressPP: null,
  _onEnterPP: null,
  _onExitPP: null,

  // This observer is called once the progress dialog has been "opened"
  _obsPP: 
  {
    observe: function(aSubject, aTopic, aData)
    {
      // delay the print preview to show the content of the progress dialog
      setTimeout(function () { PrintUtils.enterPrintPreview(); }, 0);
    },

    QueryInterface : function(iid)
    {
      if (iid.equals(Components.interfaces.nsIObserver) || iid.equals(Components.interfaces.nsISupportsWeakReference))
        return this;   
      throw Components.results.NS_NOINTERFACE;
    }
  },

  enterPrintPreview: function (aWindow)
  {
    var webBrowserPrint = this.getWebBrowserPrint(aWindow);
    var printSettings   = this.getPrintSettings();
    try {
      webBrowserPrint.printPreview(printSettings, null, this._webProgressPP.value);
    } catch (e) {
      // Pressing cancel is expressed as an NS_ERROR_ABORT return value,
      // causing an exception to be thrown which we catch here.
      // Unfortunately this will also consume helpful failures, so add a
      // dump(e); // if you need to debug
      return;
    }

    var printPreviewTB = document.getElementById("print-preview-toolbar");
    if (printPreviewTB) {
      printPreviewTB.updateToolbar();
      printPreviewTB.hidden = false;
      return;
    }

    // show the toolbar after we go into print preview mode so
    // that we can initialize the toolbar with total num pages
    printPreviewTB = document.createElementNS(XUL_NS, "toolbar");
    printPreviewTB.setAttribute("printpreview", true);
    printPreviewTB.setAttribute("id", "print-preview-toolbar");


    getBrowser().parentNode.insertBefore(printPreviewTB, getBrowser());

    // Tab browser...
    if ("getStripVisibility" in getBrowser()) {
      this._chromeState.hadTabStrip = getBrowser().getStripVisibility();
      getBrowser().setStripVisibilityTo(false);
    }


    // copy the window close handler
    if (document.documentElement.hasAttribute("onclose"))
      this._closeHandlerPP = document.documentElement.getAttribute("onclose");
    else
      this._closeHandlerPP = null;
    document.documentElement.setAttribute("onclose", "PrintUtils.exitPrintPreview(); return false;");

    // disable chrome shortcuts...
    window.addEventListener("keypress", this.onKeyPressPP, true);
 
    var contentWindow = aWindow || window.content;
    contentWindow.focus();

    // on Enter PP Call back
    if (this._onEnterPP) {
      this._onEnterPP();
      this._onEnterPP = null;
    }
  },

  exitPrintPreview: function (aWindow)
  {
    window.removeEventListener("keypress", this.onKeyPressPP, true);

#ifdef MOZ_THUNDERBIRD
    BrowserExitPrintPreview(); // make the traditional call..don't do any of the inline toolbar browser stuff
    return;
#endif

    // restore the old close handler
    document.documentElement.setAttribute("onclose", this._closeHandlerPP);
    this._closeHandlerPP = null;

    if ("getStripVisibility" in getBrowser())
      getBrowser().setStripVisibilityTo(this._chromeState.hadTabStrip);

    var webBrowserPrint = this.getWebBrowserPrint(aWindow);
    webBrowserPrint.exitPrintPreview(); 

    // remove the print preview toolbar
    var printPreviewTB = document.getElementById("print-preview-toolbar");
    getBrowser().parentNode.removeChild(printPreviewTB);

    var contentWindow = aWindow || window.content;
    contentWindow.focus();

    // on Exit PP Call back
    if (this._onExitPP) {
      this._onExitPP();
      this._onExitPP = null;
    }
  },

  onKeyPressPP: function (aEvent)
  {
    var closeKey;
    try {
      closeKey = document.getElementById("key_close").getAttribute("key");
      closeKey = aEvent["DOM_VK_"+closeKey];
    } catch (e) {}
    var isModif = aEvent.ctrlKey || aEvent.metaKey;
    // ESC and Ctrl-W exits the PP
    if (aEvent.keyCode == aEvent.DOM_VK_ESCAPE || isModif &&
        (aEvent.charCode == closeKey || aEvent.charCode == closeKey + 32)) {
      PrintUtils.exitPrintPreview();
    }
    else if (isModif) {
      var printPreviewTB = document.getElementById("print-preview-toolbar");
      var printKey = document.getElementById("printKb").getAttribute("key").toUpperCase();
      var pressedKey = String.fromCharCode(aEvent.charCode).toUpperCase();
      if (printKey == pressedKey) {
	  PrintUtils.print();
      }
    }
    // cancel shortkeys
    if (isModif) {
      aEvent.preventDefault();
      aEvent.stopPropagation();
    }
  }
}