require('./ticker.scss');
module.exports = {
	name:'ticker',
	DOM:['.ticker'],
	tickerStrings:[],
	greetings:['Bonjour', 'Namaste', 'Hi', 'Konnichiwa'],
	currentTick:0,
	onload: function(){
		var date = new Date();
		this.tickerStrings.push(this.dateToString(date.getDay(), date.getDate(), date.getMonth(), date.getFullYear()));
		this.DOM[0][0].style.opacity = 0;
		this.DOM[0][0].innerHTML = this.greetings[Math.floor(Math.random() * this.greetings.length)] + (localStorage.username == ""?".":(" "+localStorage.username+"."));
		this.DOM[0][0].style.opacity = 1;
		setTimeout(function(){
			this.tick();
		}.bind(this), 2000);
		setInterval(this.tick.bind(this), 8000);
		this.updateWeather();
		chrome.storage.onChanged.addListener(function(changes,area){
			if(area != "local") return;
			if(changes.weather || changes.location){
				this.updateWeather();
			}
		}.bind(this));
	},
	tick: function(){
		if(this.DOM[0][0].innerHTML != this.tickerStrings[this.currentTick]){
			this.DOM[0][0].style.opacity = 0;
			setTimeout(function(){
				this.DOM[0][0].innerHTML = this.tickerStrings[this.currentTick];
				this.DOM[0][0].style.opacity = 1;
				this.currentTick++;
				if(this.currentTick >= this.tickerStrings.length){
					this.currentTick = 0;
				}
			}.bind(this),400);
		}
	},
	dateToString: function(day,d,m,y){
		var monthArray = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var DayArray = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var day = DayArray[day];
		var month =  monthArray[m];
		var suffix = "";
		if(d === 3 || d === 23){
			suffix = "rd";
		}else if(d === 1 || d === 21 || d === 31){
			suffix = "st";
		}else if(d == 2 || d == 22){
			suffix = "nd";
		} else if(d !== 1 || d !== 21 || d !== 31){
			suffix = "th";
		} 

		return chrome.i18n.getMessage("dateFormat", [chrome.i18n.getMessage(day),d+"", chrome.i18n.getMessage(suffix),chrome.i18n.getMessage(month), y+""]);	
	},
	updateWeather: function(){
		chrome.storage.sync.get({settingMetric:true}, function(storage){
			chrome.storage.local.get({weather:null,location:null},function(weather){
				if(weather.weather == null || weather.location == null)
					return;
				var temp;
				if(storage.settingMetric)
					temp = Math.round((weather.weather.results.channel.item.condition.temp-32)*5/9) + " &deg;C";
				else
					temp = Math.round((weather.weather.results.channel.item.condition.temp))+ " &deg;F"
				this.tickerStrings[1] = "It's " + temp + " and "+weather.weather.results.channel.item.condition.text+" in " + weather.location.city+".";

			}.bind(this));
		}.bind(this));
	}
};