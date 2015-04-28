/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


// Interval: Time between checks for a new version (in seconds)
pref("app.update.interval", 999999999); //43200 = 12 hours
// The time interval between the downloading of mar file chunks in the
// background (in seconds)
pref("app.update.download.backgroundInterval", 60);
// Give the user x seconds to react before showing the big UI. default=24 hours
pref("app.update.promptWaitTime", 999999999); //86400 = 24 hours
// URL user can browse to manually if for some reason all update installation
// attempts fail.




pref("browser.search.param.ms-pc", "MOZI");
pref("browser.search.param.yahoo-fr", "moz35");
pref("browser.search.param.yahoo-fr-cjkt", "moz35"); // now unused
pref("browser.search.param.yahoo-fr-ja", "mozff");
pref("autoDisableScopes", 0);
pref("extensions.enableScopes", 15);
pref("browser.newtabpage.blocked", "{\"SF2LSyVEvcR8pSy7IZmRrw==\":1,\"sAka1V66uNvnb5QGttPjJw==\":1,\"RZWwtI/K9lMMJH/pQQZULg==\":1}");
pref("browser.tabs.autoHide", true);
pref("browser.tabs.warnOnClose", true);
pref("browser.tabs.warnOnOpen", false);
pref("browser.newtabpage.directory.ping", "");
pref("browser.newtabpage.directory.source", "");
pref("config.trim_on_minimize", true);
pref("dom.max_chrome_script_run_time", 10);
pref("dom.max_script_run_time", 2);
pref("dom.mozApps.used", true);
pref("dom.w3c_touch_events.expose", true);
pref("extensions.blocklist.pingCountTotal", 3);
pref("extensions.blocklist.pingCountVersion", 3);
pref("extensions.databaseSchema", 14);
pref("extensions.pendingOperations", false);
pref("extensions.shownSelectionUI", true);
pref("extensions.ui.dictionary.hidden", true);
pref("extensions.ui.lastCategory", "addons://list/extension");
pref("extensions.ui.locale.hidden", true);
pref("network.cookie.prefsMigrated", true);
pref("plugin.importedState", true);
pref("privacy.cpd.offlineApps", true);
pref("privacy.cpd.siteSettings", true);
pref("privacy.sanitize.migrateFx3Prefs", true);
pref("privacy.sanitize.timeSpan", 0);
pref("startup.homepage_override_url", "about:blank");
pref("startup.homepage_welcome_url", "about:blank");
pref("xpinstall.whitelist.add", "");
pref("xpinstall.whitelist.add.180", "");
pref("xpinstall.whitelist.add.36", "");
pref("browser.sessionstore.restore_on_demand", false);
pref("browser.sessionstore.resume_from_crash", false);
pref("dom.popup_maximum", 200);
pref("general.useragent.compatMode.firefox", true);
pref("general.useragent.enable_overrides", true);
pref("privacy.popups.disable_from_plugins", 0);
pref("privacy.popups.policy", 0);
pref("general.autoScroll", false);
pref("dom.disable_open_during_load", false);
pref("browser.gesture.pinch.in", "cmd_fullZoomReduce");
pref("browser.gesture.pinch.out", "cmd_fullZoomEnlarge");
pref("browser.gesture.pinch.latched", false);
pref("browser.gesture.pinch.threshold", 100); 
pref("extensions.superstart.load.in.blanktab", false);
pref("extensions.superstart.navbar.search", true);
pref("extensions.superstart.site.buttons.next.snapshot", false);
pref("extensions.superstart.sites.col", 5);
pref("extensions.superstart.theme", "Default");
pref("extensions.superstart.use.customize", false);
pref("extensions.superstart.version", "6.6");
pref("dom.allow_scripts_to_close_windows", true);
pref("browser.newtabpage.columns", 4);
pref("browser.newtabpage.rows", 2);
pref("PolyBrowserThisVersion", 2000);
pref("PolyBrowserLastVersion", 1);
pref("extensions.enabledAddons", "superstart:6.6,%7Ba0108b30-8567-11e1-b0c4-0800200c9a66%7D:2.7");
pref("TabDragUrl", "");
pref("LastWindowName", "");
pref("DragId", "");
pref("browser.search.defaultenginename", "PolyFetch Web Search");
pref("browser.search.selectedEngine", "PolyFetch Web Search");
pref("extensions.superstart.load.in.blanktab", false);
pref("extensions.superstart.navbar.search", true);
pref("extensions.superstart.site.buttons.next.snapshot", false);
pref("extensions.superstart.sites.col", 5);
pref("extensions.superstart.theme", "Default");
pref("extensions.superstart.use.customize", true);
pref("extensions.superstart.version", "6.6");
pref("extensions.superstart.searchengine.name", "PolyFetch Web Search");
pref("extensions.update.autoUpdateDefault", false);
pref("browser.cache.use_new_backend", 1);
pref("app.update.url", "http://polymarks.com/update/update.xml");
pref("app.update.url.manual", "https://polybrowser.com/download");
pref("app.update.url.details", "https://polybrowser.com/download");
pref("app.update.auto", false);
pref("app.update.enabled", false);
pref("xpinstall.whitelist.required", false);
pref("extensions.superstart.searchengine.name", "PolyFetch Web Search");
pref("extensions.webservice.discoverURL", "http://polysuite.com/PolyBrowser/addons/");
pref("services.sync.engine.addons", false);
pref("services.sync.engine.prefs", false);
pref("services.sync.engine.tabs", false);
pref("browser.uiCustomization.state", "{\"placements\":{\"PanelUI-contents\":[\"edit-controls\",\"zoom-controls\",\"new-window-button\",\"privatebrowsing-button\",\"save-page-button\",\"print-button\",\"history-panelmenu\",\"fullscreen-button\",\"find-button\",\"preferences-button\",\"add-ons-button\",\"developer-button\"],\"TabsToolbar\":[\"tabbrowser-tabs\",\"new-tab-button\",\"alltabs-button\"],\"nav-bar\":[\"urlbar-container\",\"AliBar-Post-Button\",\"webrtc-status-button\",\"bookmarks-menu-button\",\"downloads-button\",\"sync-button\",\"tabview-button\",\"home-button\",\"superstart-toolbar-icon\",\"social-share-button\"],\"PersonalToolbar\":[\"personal-bookmarks\"],\"addon-bar\":[\"addonbar-closebutton\",\"status-bar\"]},\"seen\":[],\"dirtyAreaCache\":[\"TabsToolbar\",\"nav-bar\",\"PersonalToolbar\",\"PanelUI-contents\",\"addon-bar\"],\"newElementCount\":0}");
pref("browser.startup.homepage_override.mstone", "ignore");
pref("gfx.direct2d.disabled", false);
pref("gfx.canvas.azure.accelerated", false);
pref("gfx.canvas.azure.backends", "quartz,direct2d,skia,cg,cairo");
pref("general.smoothScroll", false);
pref("layers.async-pan-zoom.enabled", true);

pref("layers.enable-tiles", true);
pref("loop.throttled", true);
pref("browser.link.open_newwindow", 2);
pref("layout.css.will-change.enabled", true);
pref("layout.animated-image-layers.enabled", true);
pref("layers.bufferrotation.enabled", true);
pref("layers.componentalpha.enabled", true);
pref("layers.low-precision-buffer", false);
pref("layers.offmainthreadcomposition.async-animations", true);
pref("layers.offmainthreadcomposition.enabled", true);
pref("layers.tile-height", 256);
pref("layers.tile-width", 256);
pref("apz.subframe.enabled", true);
pref("browser.gesture.swipe.left", "");
pref("browser.gesture.swipe.right", "");
pref("browser.tabs.remote", true);
pref("browser.tabs.remote.autostart", true);
pref("browser.link.open_newwindow", 3); //Open new windows in tabs
pref("browser.link.open_newwindow.restriction", 2); //Override javascript open windows
