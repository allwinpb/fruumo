module.exports = {
	name:"on-install-manager",
	onload: function(){
		chrome.runtime.onInstalled.addListener(function(details){
			//Google Analytics
			if(details.reason == "install")
		  		ga('send', 'event', 'Fruumo', 'install', appVersion);

			//Refresh wallpaper and weather alarm (every hour)
			chrome.alarms.create("refresh-wallpaper", {periodInMinutes:60});
			chrome.alarms.create("refresh-quote", {periodInMinutes:1440});
			chrome.alarms.create("refresh-weather", {periodInMinutes:10});
			chrome.alarms.create("check-updates", {periodInMinutes:1440});
			chrome.alarms.create("check-notifications", {periodInMinutes:120});

			window.plugins["wallpaper-manager"].refreshWallpaper();
			window.plugins["weather-manager"].refreshWeather();
			window.plugins["quote-manager"].refreshQuote();
			chrome.runtime.setUninstallURL("http://fruumo.com/uninstall", function(){});
			//Defaults
			chrome.storage.sync.get("settingsReset", function(s){
				if(s.settingsReset == undefined || s.settingsReset){
					this.resetSettings();
				}
			}.bind(this));
		}.bind(this));

		chrome.storage.onChanged.addListener(function(changes, area){
			if(area != "sync")
				return;
			if(!changes.settingsReset)
				return;
			if(changes.settingsReset.newValue == undefined)
				return;
			if(changes.settingsReset.newValue){
				this();
			} else {
			}
		}.bind(this.resetSettings));
	},
	resetSettings:function (){
		chrome.storage.sync.set({settingsReset:false});
		chrome.storage.sync.set({settingDisplayTopsites:false});
		chrome.storage.sync.set({settingFocus:false});
		chrome.storage.sync.set({settingIs24h:true});
		chrome.storage.sync.set({settingMetric:true});
		chrome.storage.sync.set({largeTopsites:false});
		chrome.storage.sync.set({disableAnimations:false});
		chrome.storage.sync.set({timeVisible:true});
		chrome.storage.sync.set({searchVisible:true});

		//localStorage.searchDomain = "http://www.blpsearch.com/search?sid=695&aid=090&src=hmp&p=";
		localStorage.searchDomain = "https://www.google.com/search?q=";
		localStorage.defaultSearchBar = "fruumo";
		localStorage.smartDomain = "true";
		chrome.storage.sync.set({bannedTopsites:[]});
		chrome.storage.sync.set({settingAutohideStatusbar:false});

		chrome.storage.local.remove("screenshots");
		chrome.storage.local.remove("customWeather");
		chrome.storage.local.remove("settingCustomWallpaper");
		chrome.storage.local.remove("searchDb");

		localStorage.intro = "false";
		delete localStorage.username;

		chrome.alarms.create("refresh-wallpaper", {when:Date.now()+1000, periodInMinutes:60});
		chrome.alarms.create("refresh-weather", {when:Date.now()+1000, periodInMinutes:10});
		chrome.alarms.create("refresh-quote", {when:Date.now()+1000, periodInMinutes:1440});
		chrome.alarms.create("check-updates", {periodInMinutes:1440});
		chrome.alarms.create("check-notifications", {periodInMinutes:120});

		console.log("Resetting settings!");
	}

}