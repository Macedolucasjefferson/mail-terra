/* 20131122-2031 */

if (!window.jQuery) {
	throw new Error('TemplatingError » O objeto "jQuery" não foi encontrado. Por favor, verifique se o include correspondente foi realizado.');
}

try {
		
window.onerror = function (message, fileUrl, lineNumber) {
	if (window.modMan) {
		window.modMan.log.critical(
			'SyntaxError (detectado em escopo global)\n'+
			'Message » '+ message +'\n'+
			'File »  '+ fileUrl +'\n'+
			'Line » '+ lineNumber
		);
	}
	return false;
};
	
var modMan = function ($) {
	//=-=-=-=-=-=-=-=-=-=-
	// Local variables
	//=-=-=-=-=-=-=-=-=-=-
	var details = {
		prdBaseDomain:"http://s2.trrsf.com/",
		portalDir:"atm/",
		coreVersion:2,
		coreDirPath:'core/',
		lastUpdate:"20131122-2031",
		startupTime:new Date().getTime()
	};
	
	var globals = {}; // Stores section configs and shared observers
	
	
	// Error messages
	var errorMsgs = {
		defaultLNG:"br",
		br:{
			otherFrameworkFound:"modMan uses jQuery and cant work with other frameworks."
		},
		en:{
			otherFrameworkFound:"modMan uses jQuery and cant work with other frameworks."
		}
	};
	
	// Controlled Vocabulary
	var controlled = {
		defaultLNG:'br',
		defaultRGN:'BR',
		LNG:{
			br:{
				loading:"carregando"
			},
			en:{
				loading:"loading"
			},
			es:{
				loading:"cargando"
			}
		},
		RGN:{
			BR:{
				portalURL:"http://www.terra.com.br/"
			}
		}
	};	
	
	var Hosts = [
		{ locationMatchEXP:/.*\/(portal\/hlg\/atm|webdev_hlg)\/\d\//i, redirect:false, type:"DSV" },
		{ locationMatchEXP:/.+\/entregas\/[\d-]+\//i, redirect:false, type:"DSV" },
		{ locationMatchEXP:/.+mainsite.int.[^\.]+.terra.com.br\/portal\//i, redirect:false, type:"DSV" },
		{ locationMatchEXP:/hlg\.trrsf\./i, redirect:'http://hlg.trrsf.com.br/atm/2/', type:"HLG" }
	];

	/**
	@updated 20110408-2000
	Base GMT extracted from:
	- http://www.timeanddate.com/worldclock/
	- http://24timezones.com/

	* country codes expressed in ISO 3166-1 (numeric, alpha2 and alpha3)
	**/
	var Regions = {
		// Horário de verão suspenso temporariamente
		//AR:{id:1, isoAlpha2:'AR', lang:'es', isoAlpha3:'ARG', gmt:-180, domainMatchEXP:/\.?ar[\.-]|\.ar\//i, portalURL:'http://www.terra.com.ar/', dst:{gmt:-120, startLocalTimeStamp:'20091018-0000', endLocalTimeStamp:'20100315-0000'} },
		AR: { isoNumeric:'032', isoAlpha2:'AR', isoAlpha3:'ARG', lang:'es', gmt:-180, hostTestEXP:/\.?ar[\.-]|\.ar$/i, portalURL:'http://www.terra.com.ar/' },
		BR: { isoNumeric:'076', isoAlpha2:'BR', isoAlpha3:'BRA', lang:'pt', gmt:-180, hostTestEXP:/\.?br[\.-]|\.br$/i, portalURL:'http://www.terra.com.br/', dst: { gmt:-120, startLocalTimeStamp:'20131020-0000', endLocalTimeStamp:'20140217-0000' } },
		CA: { isoNumeric:'124', isoAlpha2:'CA', isoAlpha3:'CAN', lang:'en', gmt:-480, dst: { gmt:-420, startLocalTimeStamp:'20130310-0200', endLocalTimeStamp:'20131103-0200'} },
		CL: { isoNumeric:'152', isoAlpha2:'CL', isoAlpha3:'CHI', lang:'es', gmt:-240, hostTestEXP:/\.?cl[\.-]|\.cl$/i, portalURL:'http://www.terra.cl/', dst: { gmt:-180, startLocalTimeStamp:'20130808-0000', endLocalTimeStamp:'20140428-0000' } },
		CO: { isoNumeric:'170', isoAlpha2:'CO', isoAlpha3:'COL', lang:'es', gmt:-300, hostTestEXP:/\.?co[\.-]|\.co$/i, portalURL:'http://www.terra.com.co/' },
		CR: { isoNumeric:'188', isoAlpha2:'CR', isoAlpha3:'CRI', lang:'es', gmt:-360, hostTestEXP:/\.?cr[\.-]|\.cr$/i, portalURL:'http://www.terra.com/' },
		DO: { isoNumeric:'214', isoAlpha2:'DO', isoAlpha3:'DOM', lang:'es', gmt:-240, hostTestEXP:/\.?do[\.-]|\.do$/i, portalURL:'http://www.terra.com/' },
		EC: { isoNumeric:'218', isoAlpha2:'EC', isoAlpha3:'ECU', lang:'es', gmt:-300, hostTestEXP:/\.?ec[\.-]|\.ec$/i, portalURL:'http://www.terra.com.ec/' },
		ES: { isoNumeric:'714', isoAlpha2:'ES', isoAlpha3:'ESP', lang:'es', gmt:60, hostTestEXP:/\.?es[\.-]terra|\.es$/i, portalURL:'http://www.terra.com.es/', dst: { gmt:120, startLocalTimeStamp:'20130321-0200', endLocalTimeStamp:'20131027-0300' } },
		GB: { isoNumeric:'826', isoAlpha2:'GB', isoAlpha3:'GBR', lang:'en', gmt:0, hostTestEXP:/(^\w\w[^\.-]|en[\.-])+.*\.com$/i, portalURL:'http://www.terra.com/', dst: { gmt:60, startLocalTimeStamp:'20130331-0100', endLocalTimeStamp:'20131027-0200'} },
		GT: { isoNumeric:'320', isoAlpha2:'GT', isoAlpha3:'GTM', lang:'es', gmt:-360, hostTestEXP:/\.?gt[\.-]|\.gt$/i, portalURL:'http://www.terra.com/' },
		HN: { isoNumeric:'340', isoAlpha2:'HN', isoAlpha3:'HND', lang:'es', gmt:-360, hostTestEXP:/\.?hn[\.-]|\.hn$/i, portalURL:'http://www.terra.com/' },
		MX: { isoNumeric:'484', isoAlpha2:'MX', isoAlpha3:'MEX', lang:'es', gmt:-360, hostTestEXP:/\.?mx[\.-]|\.mx$/i, portalURL:'http://www.terra.com.mx/', dst: { gmt:-300, startLocalTimeStamp:'20130407-0200', endLocalTimeStamp:'20131027-0200' } }, // default for spanish
		NI: { isoNumeric:'558', isoAlpha2:'NI', isoAlpha3:'NIC', lang:'es', gmt:-360, hostTestEXP:/\.?ni[\.-]|\.ni$/i, portalURL:'http://www.terra.com/' },
		PA: { isoNumeric:'591', isoAlpha2:'PA', isoAlpha3:'PAN', lang:'es', gmt:-300, hostTestEXP:/\.?pa[\.-]|\.pa$/i, portalURL:'http://www.terra.com/' },
		PE: { isoNumeric:'604', isoAlpha2:'PE', isoAlpha3:'PER', lang:'es', gmt:-300, hostTestEXP:/\.?pe[\.-]|\.pe$/i, portalURL:'http://www.terra.com.pe/' },
		PR: { isoNumeric:'630', isoAlpha2:'PR', isoAlpha3:'PRI', lang:'es', gmt:-240, hostTestEXP:/\.?pr[\.-]|\.pr$/i, portalURL:'http://www.terra.com/' },
		PT: { isoNumeric:'620', isoAlpha2:'PT', isoAlpha3:'PRT', lang:'pt', gmt:0, hostTestEXP:/\.?pt[\.-]|\.pt$/i, portalURL:'http://www.terra.com.br/', dst: { gmt:60, startLocalTimeStamp:'20130331-0100', endLocalTimeStamp:'20131027-0200' } },
		SV: { isoNumeric:'222', isoAlpha2:'SV', isoAlpha3:'SLV', lang:'es', gmt:-360, hostTestEXP:/\.?sv[\.-]|\.sv$/i, portalURL:'http://www.terra.com/' },
		VE: { isoNumeric:'862', isoAlpha2:'VE', isoAlpha3:'VEN', lang:'es', gmt:-270, hostTestEXP:/\.?ve[\.-]|\.ve$/i, portalURL:'http://www.terra.com.ve/' },
		US: { isoNumeric:'840', isoAlpha2:'US', isoAlpha3:'USA', lang:'en', gmt:-300, hostTestEXP:/(^\w\w[^\.-]|en[\.-])+.*\.com$/i, portalURL:'http://www.terra.com/', dst: { gmt:-240, startLocalTimeStamp:'20130310-0200', endLocalTimeStamp:'20131103-0200' } },
		ZA: { isoNumeric:'710', isoAlpha2:'ZA', isoAlpha3:'ZAF', lang:'en', gmt:120 }
	};


	var Library = {
		modules:{
			baseDIR:"apps/",
			modCommunities:{ scriptPath:"communities/_js/modCommunities.js", currentVersion:"20090526-1357" },
			modMoreNews:{ scriptPath:"morenews/_js/modMoreNews.js", currentVersion:"20090526-1357" },
			modClock:{ scriptPath:"clock/_js/moduleCore.js", currentVersion:"20090526-1357" },
			modTimer:{ scriptPath:"timer/_js/moduleCore.js", currentVersion:"20090526-1357" },
			modFeaturedMedia:{ scriptPath:"featuredmedia/_js/modFeaturedMedia.js", currentVersion:"20090526-1357" },
			modFootballDirectory:{ scriptPath:"footballdirectory/_js/modFootballDirectory.js", currentVersion:"20090526-1357"},
			modChampionship:{ scriptPath:"championship/_js/modChampionship.js", currentVersion:"20090526-1357" },
			modTeams:{ scriptPath:"teams/_js/modTeams.js", currentVersion:"20090526-1357" },
			modUserTeam:{ scriptPath:"soccer/userTeam/_js/moduleCore.js", currentVersion:"20090526-1357"},
			modTop20:{ scriptPath:"soccer/top20/_js/moduleCore.js", currentVersion:"20090526-1357"},
			modUserTeamField:{ scriptPath:"soccer/userSelecao/_js/moduleCore.js", currentVersion:"20090526-1357"},
			modSonora:{ scriptPath:"sonora/_js/modSonora.js", currentVersion:"20090526-1357" },
			modTerraTv:{	scriptPath:"terratv/_js/modTerraTv.js",currentVersion:"20090526-1357" },
			modMulti: { scriptPath:"multi/_js/moduleCore.js", currentVersion:"20090526-1357"},
			modHeaderFooter:{ scriptPath:"headerfooter/_js/modHeaderFooter.js", currentVersion:"20090526-1357"},
			modHeaderAux:{ scriptPath:"headeraux/_js/modHeaderAux.js", currentVersion:"20091014-1420"},
			modAudienceHorizontal:{ scriptPath:"audiencepulse_hor/_js/moduleCore.js", currentVersion:"20090526-1357"},
			modAudiencePulseVertical:{ scriptPath:"audiencepulse_ver/_js/moduleCore.js", currentVersion:"20090526-1357"},
			modPoll:{ scriptPath:"poll/_js/moduleCore.js", currentVersion:"20090526-1357"},
			modFanzone:{ scriptPath:"fanzone/_js/moduleCore.js", currentVersion:"20090526-1357"},
			modFanzoneFull:{ scriptPath:"fanzone_full/_js/moduleCore.js", currentVersion:"20090526-1357"},
			modPhotoGallery:{ scriptPath:"photoGallery/_js/moduleCore.js", currentVersion:"20090526-1357"},
			modExpandedPicsPlayer:{ scriptPath:"expandedPics/_js/moduleCore.js", currentVersion:"20090526-1357"},
			
			modLatestNews:{ scriptPath:"latestnews/_js/moduleCore.js", currentVersion:"20090727-1638"},
			modSendFriends:{ scriptPath:"sendFriends/_js/moduleCore.js", currentVersion:"20090526-1357"},
			modToolF1:{ scriptPath:"toolF1/_js/moduleCore.js", currentVersion:"20090526-1357"},
			modSpotlightpics:{ scriptPath:"spotlightPics/_js/moduleCore.js", currentVersion:"20090526-1357"},
			modHoroscope:{ scriptPath:"horoscope/_js/moduleCore.js", currentVersion:"20090526-1357"},
			modNewspapersAndMagazines:{ scriptPath:"newspapers_and_magazines/_js/moduleCore.js", currentVersion:"20090526-1357"},
			modNavigation:{ scriptPath:"navigation/_js/moduleCore.js", currentVersion:"20090526-1357"},

			modPlayList:{ scriptPath:"music/playlist/_js/moduleCore.js", currentVersion:"20091014-1420"},
			modArtistSonora:{ scriptPath:"music/sonora/_js/moduleCore.js", currentVersion:"20091027-1900"},

			modConsole:{ scriptPath:"console/_js/modConsole.js", currentVersion:"20090607-1744"},

			modPhotos24h:{ scriptPath:"photos24h/_js/moduleCore.js", currentVersion:"20090526-1357"},
			modPPI:{ scriptPath:"ppi/_js/moduleCore.js", currentVersion:"20090526-1357"},
			modTwitterFollowers:{ scriptPath:"twitter/followers/_js/moduleCore.js", currentVersion:"20090831-1000"},

			terraTvLive:{	scriptPath:"terratv_live/_js/terraTvLive.js",currentVersion:"20090526-1357" },

			europeanFootball_games:{ scriptPath:"europeanfootball/games/_js/moduleCore.js", currentVersion:"20090626-1700"},
			europeanFootball_classification:{ scriptPath:"europeanfootball/classification/_js/moduleCore.js", currentVersion:"20090626-1700"},
			
			modWeather:{ scriptPath:"weather/_js/moduleCore.js", currentVersion:"20090526-1357" },
			modMaps:{ scriptPath:"google_maps/_js/moduleCore.js", currentVersion:"20090911-1730" },
			
			modPopularity:{ scriptPath:"popularity/_js/moduleCore.js", currentVersion:"20091202-1545" },
			modMoreLessPopular:{ scriptPath:"morelessPopular/_js/moduleCore.js", currentVersion:"20091202-1545" },      
			modThermometerPoll:{ scriptPath:"thermometerPoll/_js/modThermometerPoll.js", currentVersion:"20091203-1555" },
			modWeekParticipants:{ scriptPath:"weekParticipants/_js/modWeekParticipants.js", currentVersion:"20091204-1518" },
			modPopularityResume:{ scriptPath:"popularityResume/_js/moduleCore.js", currentVersion:"20091222-2040" },
			
			contentSharer:{ scriptPath:"contentSharer/_js/contentSharer.js", currentVersion:"20100416-1130" },
			
			// team profile
			modFansMorale:{ scriptPath:"soccer/teamProfile/fansMorale/_js/moduleCore.js", currentVersion:"20100414-1442" },
			modFansMoraleChartBar:{ scriptPath:"soccer/teamProfile/fansMoraleChartBar/_js/moduleCore.js", currentVersion:"20100428-1154" },
			modSeasonStatisticsChartPie:{ scriptPath:"soccer/teamProfile/SeasonStatisticsChartPie/_js/moduleCore.js", currentVersion:"20100414-1442" },
			
			modCup2010:{ scriptPath:"cup2010/_js/moduleCore.js", currentVersion:"20100417-1841" },
			sendMail:{ scriptPath:"sendMail/_js/moduleCore.js", currentVersion:"20100617-1841" },
			tickerLive: { scriptPath: "tickerLive/_js/modman.tickerLive.js", currentVersion: "20110824-1000" },
			tickerLiveBlog: { scriptPath: "ticker-liveblog/_js/modman.ticker-liveblog.js", currentVersion: "20110824-1000" },
			socialbox: { scriptPath: "socialbox/_js/modman.socialbox.js", currentVersion: "20111110-1456" },
			
			modCategorizedContent: { scriptPath: "categorizedcontent/_js/moduleCore.js", currentVersion: "20111206-1700" },

			modGuiaMais: { scriptPath: "guia-mais/_js/modGuiaMais.js", currentVersion: "20120530-1857" },
			modVideosBar: { scriptPath: "videosbar/_js/modVideosBar.js", currentVersion: "20120807-2130" },
			sportsClubsGuide: { scriptPath: "sports-clubs-guide/_js/modman.sportsclubsguide.js", currentVersion: "20121130-1400" }
		},
		helpers:{
			baseDIR:"_js/",
			dateOBJ:{
				scriptPath:"helper.dateOBJ.js",
				description:"Possui métodos para converter datas entre diferentes GTMs."
			},
			arrayOBJ:{
				scriptPath:"helper.arrayOBJ.js",
				description:"Possui métodos para reorganizar arrays."
			},
			stringOBJ:{
				scriptPath:"helper.stringOBJ.js",
				description:"Possui métodos para tratar strings."
			}
		},
		plugins:{
			baseDIR:"_js/",
			trrListCarousel:{
				scriptPath:"jquery.trrListCarousel.js",
				description:"Monta carrossel a partir de listas."
			},
			jprint:{
				scriptPath:"jquery.jprint.js",
				description:"Imprime o conteúdo de uma Layer"
			},
			zoomimagethumb:{
				scriptPath:"jquery.zoomimagethumb.js",
				description:"Cria efeito de layer sobreposta em mouse-over."
			},
			jcarousel_lite:{
				scriptPath:"jquery.jcarousel_lite.js",
				description:"http://www.gmarwaha.com/jquery/jcarousellite/index.php#what"
			},
			elementposition:{
				scriptPath:"jquery.elementposition.js",
				description:"http://www.gmarwaha.com/jquery/jcarousellite/index.php#what"
			},
			checkbox:{
				scriptPath:"jquery.checkbox.radiobutton.js",
				description:"http://www.gmarwaha.com/jquery/jcarousellite/index.php#what"
			},
			clickout:{
				scriptPath:"jquery.clickout.js",
				description:"http://www.gmarwaha.com/jquery/jcarousellite/index.php#what"
			},
			combobox:{
				scriptPath:"jquery.combobox.js",
				description:"http://www.gmarwaha.com/jquery/jcarousellite/index.php#what"
			},
			jqdnr:{
				scriptPath:"jquery.jqdnr.js",
				description:"http://www.gmarwaha.com/jquery/jcarousellite/index.php#what"
			},
			scrolling:{
				scriptPath:"jquery.scrolling.js",
				description:"http://www.gmarwaha.com/jquery/jcarousellite/index.php#what"
			},
			tabs:{
				scriptPath:"jquery.tabs.js",
				description:"http://www.gmarwaha.com/jquery/jcarousellite/index.php#what"
			},
			wheel:{
				scriptPath:"jquery.wheel.js",
				description:"http://www.gmarwaha.com/jquery/jcarousellite/index.php#what"
			},
			thickbox:{
				scriptPath:"jquery.thickbox.js",
				description:"For modal pop ups"
			},
			cookie:{
				scriptPath:"jquery.cookie.js",
				description:"For cookie in interface"
			},
			uicore:{
				scriptPath:"jquery.ui.core.js",
				description:"To support widgets interface jquery"
			},
			uidraggable:{
				scriptPath:"jquery.ui.draggable.js",
				description:"To drag interface elements"
			},
			jookie:{
				scriptPath:"jquery.jookie.js",
				description:"Cookies with JSON"
			},
			jquery_json:{
				scriptPath:"jquery.json-2.2.js",
				description:"Jquery with JSON encode e decode"
			},
			swfobject:{
                scriptPath:"swfobject.js",
                description:"Append swfs."
            },
			droplist:{
                scriptPath:"jquery.droplist.js",
                description:"Droplist"
            },
			jScrollPane:{
                scriptPath:"jquery.jScrollPane.js",
                description:"Scrolls stuff"
            },
			mouseWheel:{
                scriptPath:"jquery.mousewheel.js",
                description:"scrolls more stuff"
            }
		},
		components:{
			combobox:{
				plugins:['jqdnr', 'elementposition', 'wheel', 'scrolling', 'clickout', 'combobox']
			},
			scrolling:{
				plugins:['jqdnr','elementposition', 'wheel', 'scrolling']
			}
		}
	};
	// Local variables //

	
	// Forçando renovação de cache no safari
	if($.browser.safari) $.useBrowserCache = false;
	
	
	//=-=-=-=-=-=-=-=-=-
	// Section configs
	//=-=-=-=-=-=-=-=-=-
	(function(){
		
		// Page locale detection >>
		var pageRegionCodes = function() {
			// trying to extract locale from document lang attribute
			var html = document.getElementsByTagName('html')[0],
				documentLang =  html.getAttribute('lang') || html.getAttribute('xml:lang');
			
			if(documentLang) {
				var codes = documentLang.match(/\w\w/g);					
				
				if (codes && codes.length == 2) {
					codes[1] = codes[1].toUpperCase();
					return {
						lang:codes[0],
						country:codes[1],
						locale:codes[0] + '-' + codes[1]
					};
				}
			}
			
			// extract region codes from document location
			if (location.host) {
				for (var isoCode in Regions) {
					if (Regions[isoCode].hostTestEXP && Regions[isoCode].hostTestEXP.test(location.host)) {
						return {
							lang:Regions[isoCode].lang,
							country:isoCode,
							locale:Regions[isoCode].lang + '-' + isoCode
						};
					}
				}
			}
			
			// default
			return {
				lang:'pt',
				country:'BR',
				locale:'pt-BR'
			};
		}();
		
		// User locale detection >>
		var userAgentLocaleCodes = (/\w\w/g).exec(navigator.language || navigator.userLanguage || ''),
			// default
			userRegionCodes = {
				lang:'pt',
				country:'BR',
				locale:'pt-BR'
			};
			
		if (userAgentLocaleCodes && userAgentLocaleCodes.length == 2) {
			userRegionCodes.lang = userAgentLocaleCodes[0].toLowerCase();
			userRegionCodes.country  = userAgentLocaleCodes[1].toUpperCase();
			userRegionCodes.locale  = userRegionCodes.lang + '-' + userRegionCodes.country;
		}
		
		var regionDetails = Regions[pageRegionCodes.country] || null;
		
		// Stage detection >>
		var stageType = "PRD",
			baseURL = function () {
			for (var i = 0, currentHost; currentHost = Hosts[i]; i++) {
				var detected = currentHost.locationMatchEXP.exec(document.location);
				if(detected && currentHost.type) {
					stageType = currentHost.type;					
					return currentHost.redirect || detected[0].replace(/\/$/,'') + '/';
				}
			}
			
			return details.prdBaseDomain + 'fe/' + details.portalDir + details.coreVersion + '/';
		}();

		// FlashDetect
		// http://www.featureblend.com/license.txt
		if(!FlashDetect) {
			var FlashDetect=new function(){var self=this;self.installed=false;self.raw="";self.major=-1;self.minor=-1;self.revision=-1;self.revisionStr="";var activeXDetectRules=[{"name":"ShockwaveFlash.ShockwaveFlash.7","version":function(obj){return getActiveXVersion(obj);}},{"name":"ShockwaveFlash.ShockwaveFlash.6","version":function(obj){var version="6,0,21";try{obj.AllowScriptAccess="always";version=getActiveXVersion(obj);}catch(err){}; return version;}},{"name":"ShockwaveFlash.ShockwaveFlash","version":function(obj){return getActiveXVersion(obj);}}];var getActiveXVersion=function(activeXObj){var version=-1;try{version=activeXObj.GetVariable("$version");}catch(err){}; return version;};var getActiveXObject=function(name){var obj=-1;try{obj=new ActiveXObject(name);}catch(err){}; return obj;};var parseActiveXVersion=function(str){var versionArray=str.split(",");return{"raw":str,"major":parseInt(versionArray[0].split(" ")[1],10),"minor":parseInt(versionArray[1],10),"revision":parseInt(versionArray[2],10),"revisionStr":versionArray[2]};};var parseStandardVersion=function(str){var descParts=str.split(/ +/);var majorMinor=descParts[2].split(/\./);var revisionStr=descParts[3];return{"raw":str,"major":parseInt(majorMinor[0],10),"minor":parseInt(majorMinor[1],10),"revisionStr":revisionStr,"revision":parseRevisionStrToInt(revisionStr)};};var parseRevisionStrToInt=function(str){return parseInt(str.replace(/[a-zA-Z]/g,""),10)||self.revision;};self.majorAtLeast=function(version){return self.major>=version;};self.FlashDetect=function(){if(navigator.plugins&&navigator.plugins.length>0){var type='application/x-shockwave-flash';var mimeTypes=navigator.mimeTypes;if(mimeTypes&&mimeTypes[type]&&mimeTypes[type].enabledPlugin&&mimeTypes[type].enabledPlugin.description){var version=mimeTypes[type].enabledPlugin.description;var versionObj=parseStandardVersion(version);self.raw=versionObj.raw;self.major=versionObj.major;self.minor=versionObj.minor;self.revisionStr=versionObj.revisionStr;self.revision=versionObj.revision;self.installed=true;}}else if(navigator.appVersion.indexOf("Mac")==-1&&window.execScript){var version=-1;for(var i=0;i<activeXDetectRules.length&&version==-1;i++){var obj=getActiveXObject(activeXDetectRules[i].name);if(typeof obj=="object"){self.installed=true;version=activeXDetectRules[i].version(obj);if(version!=-1){var versionObj=parseActiveXVersion(version);self.raw=versionObj.raw;self.major=versionObj.major;self.minor=versionObj.minor;self.revision=versionObj.revision;self.revisionStr=versionObj.revisionStr;}}}}}();};FlashDetect.release="1.0.3";
		}
		
		// Set free section configs
		globals = {
			data:{
				log:[],
				feeds:{},
				instances:{}
			},
			stage:{
				isDSV:(stageType == "DSV"),
				type:stageType,
				staticFilesHost:details.prdBaseDomain,
				coreBaseUrl:baseURL + details.coreDirPath,
				coreVersion:details.coreVersion,
				debugging:(/debug/).test(document.location)
			},
			page:{
				contextId:(window.trrConstantData && window.trrConstantData.configs) ? window.trrConstantData.configs.contextId : undefined,
				lang:pageRegionCodes.lang,
				country:pageRegionCodes.country,
				locale:pageRegionCodes.locale,
				regionDetails:regionDetails,
				underTerra:false,
				baseURL:baseURL + details.coreDirPath,
				portalURL:regionDetails ? regionDetails.portalURL : null,
				startupTime:details.startupTime,
				ready:false,
				loaded:false,
				transitionEffects:false
			},
			user:{
				lang:userRegionCodes.lang,
				country:userRegionCodes.country,
				locale:userRegionCodes.locale,
				flash:{
					installed:FlashDetect.installed,
					version:FlashDetect.major
				}
			},
			regions:Regions
		};
		
		$(document).ready(function(){
			globals.page.ready = true;
		});
		
		$(window).load(function(){
			globals.page.loaded = true;
		});
		
		
	})(); // Just once
	
	var Log = new function(moduleId){
		var stack = globals.data.log = [],
			foundCriticalErrors = false;

		this.CONSTRUCTOR = function(moduleId){
			var profile = moduleId || "System Message";
			var instanceStartupTime = new Date().getTime();
					
			var insertMsg = function(type, text){
				var logOBJ = {
					instanceCheckpoint:new Date().getTime() - instanceStartupTime,
					sessionCheckpoint:new Date().getTime() - globals.page.startupTime,
					profile:profile,
					type:type,
					message:text
				}
				stack.push(logOBJ);
				
				if(globals.data.instances.modConsole) updateConsole();
			}
					
			var updateConsole = function(){
				globals.data.instances.modConsole[0].report();
			}
			
			this.checkpoint = function(text) { insertMsg('checkpoint', text); return undefined; }
			this.warning = function(text) { insertMsg('warning', text); return undefined; }
			this.critical = function(text) { insertMsg('critical', text); if(window.console && !foundCriticalErrors && globals.stage.debugging){foundCriticalErrors = true; console.log("Erro(s) crítico(s) encontrado(s). Acione o console para verificar mais detalhes."); } return undefined; }
			
			this.trace = function(text) { insertMsg('trace', text); return undefined; }
			this.help = function(text) { insertMsg('help', text); return undefined; }
		}
		return undefined;	
	}
	var log = new Log.CONSTRUCTOR();
	
	var require = function () {

		this.timeout = 0;

		var headElement = document.getElementsByTagName('head')[0],

			defaultAttributes = {
				link : {
					type : "text/css",
					rel : "stylesheet",
					media : "all"
				},
				script : {
					type : "text/javascript",
					charset : "utf-8"
				}
			},

			activeDependencies = globals.data.dependencies = {
				components : {},
				files : {
					css : {},
					js : {}
				},
				extensions : {},
				externalScripts : {}
			},

			jsonpQueueList = {};

		// Constructor >>
		var Stack = function () {

			var FaliedFiles = {},
				InProgress = {},
				LoadedFiles = this.LoadedFiles = {},
				LoadedComponents = this.LoadedComponents = {},
				Statements = [];

			var getRequestDetails = function (url) {
				var alternate1 = url.replace(/s1\./, 's2.'),
					alternate2 = url.replace(/s2\./, 's1.'),

					inProgress = (InProgress[alternate1] || InProgress[alternate2]),
					loaded = (LoadedFiles[alternate1] || LoadedFiles[alternate2]),
					failed = (FaliedFiles[alternate1] || FaliedFiles[alternate2]);

				return {
					inProgress : inProgress,
					loaded : loaded,
					failed : failed,
					alreadyRequested : (inProgress || loaded)
				};
			};

			this.loading = function (url) {
				InProgress[url] = true;
			};

			this.loaded = function (url, type) {
				//if (window.console) console.log('cadastrando carregamento da url ' + url);
				LoadedFiles[url] = true;

				var matchResult = queryLibraryMatch(url);
				if (matchResult) {
					activeDependencies.extensions[matchResult] = true;
				}
				if (!url.match(/(jquery|modMan)\.js$/i)) {
					activeDependencies.externalScripts[url] = true;
				}

				activeDependencies.files[type][url] = true;

				if (getRequestDetails(url).inProgress) {
					delete InProgress[url];
					Stack.update();
				}

			};

			this.failed = function (url) {
				FaliedFiles[url] = true;

				if (getRequestDetails(url).inProgress) {
					delete InProgress[url];
					Stack.update();
				}
			};

			this.register = function (statementOBJ) {
				Statements.push(statementOBJ);

				var allDependenciesArePresent = true,
					totalDependencies = statementOBJ.requires.length,
					i, currentDependency, url;
					
				for (i = 0; i < totalDependencies; i++) {
					currentDependency = statementOBJ.requires[i];
					url = currentDependency.href || currentDependency.src;

					if (currentDependency.src) {
						var matchResult = queryLibraryMatch(url);
						if (matchResult && Library.extensions[matchResult].source && typeof(Library.extensions[matchResult].source) == 'function') {
							Library.extensions[matchResult].source();
							Library.extensions[matchResult].source = true;
							log.checkpoint('Evitando request de ' + matchResult);
							Stack.loaded(url, 'js');

							continue;
						}
					}

					if (!getRequestDetails(url).alreadyRequested || statementOBJ.overwriteData) {
						allDependenciesArePresent = false;
						createElement(currentDependency, statementOBJ.error);
					}
				}

				if (allDependenciesArePresent) {
					Stack.update();
				}
			};

			this.update = function () {

				var stackedStatements = $.extend(Statements, []),
					queue = [],
					currentStatement = null,
					dependenciesQueue = [],
					criticalErrors = [],
					current, totalDependencies, i;
					
				Statements = [];
				//if (window.console) console.log('UPDATE rolando para: '+stackedStatements.length + ' statements');

				if (stackedStatements.length) {

					while (stackedStatements.length) {
						currentStatement = stackedStatements.shift();

						if (!currentStatement.dependenciesList) {
							currentStatement.dependenciesList = $.extend([], currentStatement.requires);
						}

						totalDependencies = currentStatement.dependenciesList.length;

						// loop to update dependencies status
						if (currentStatement.requires.length) {

							//if (window.console) console.log('Statement aguardando ' + currentStatement.requires.length);
							while (currentStatement.requires.length) {
								var currentDependency = currentStatement.requires.shift(),
									url = currentDependency.src || currentDependency.href;

								//if (window.console) console.log('verificando url ' + url);
								if (getRequestDetails(url).failed) {
									criticalErrors.push(url);
								}

								if (!getRequestDetails(url).loaded) {
									dependenciesQueue.push(currentDependency);
								}
							}
							//if (window.console) console.log('ainda restam ' + dependenciesQueue.length);
							if (dependenciesQueue.length) {
								currentStatement.requires = currentStatement.requires.concat(dependenciesQueue);
							}
						}

						if (!currentStatement.requires.length) {
							//if (window.console) console.log('DISPARANDO CALLBACK');
							if (currentStatement.success) {
								window.setTimeout(currentStatement.success, 100);
								if (currentStatement.overwriteData) {
									for (i = 0; totalDependencies.length; i++) {
										current = currentStatement.dependenciesList[i];
										LoadedFiles[current.src || current.href] = undefined;
									}
								}
							}
						}
						else if (criticalErrors.length) {
							if (currentStatement.errorHandler) {
								currentStatement.errorHandler();
							}
						}
						else {
							//if (window.console) console.log('adiando statement');
							queue.push(currentStatement);
						}
					}
					if (queue.length) {
						Statements = Statements.concat(queue);
					}
				}

				return undefined;
			};

			return this;
		}.call({});

		var convert2absolutePath = function (includePath) {

			if ((/^(https?:\/\/|file:)/).test(includePath)) {
				return includePath;
			}

			var base = document.location.toString().replace(/[^\/]+$/, ''),
				fileRealPath = includePath.replace(base, '').replace(/\.\.\//g, '');

			if ((/^\//).test(includePath)) {
				return (document.domain) ? location.protocol + "//" + document.domain + includePath : (/.+\//).exec(document.location)[0] + includePath.replace(/^\//, '');
			}

			if ((/^\.\.\//).test(includePath)) {
				var backDirectories = includePath.match(/(\.\.\/)/g).length;
				for (var i = 0; i < backDirectories; i++) {
					base = base.replace(/[^\/]+\/?$/, '');
				}
			}
			return base + fileRealPath;
		};

		var queryLibraryMatch = function (includeUrl) {
			for (var objectIndex in Library.extensions) {
				if (Library.extensions.hasOwnProperty(objectIndex)) {
					var referenceOBJ = Library.extensions[objectIndex];
					if (referenceOBJ.scriptPath && includeUrl.match(referenceOBJ.scriptPath)) {
						return objectIndex;
					}
				}
			}
			return false;
		};

		var checkTemplate = (function () {
			var firstLoad = {},
				tmpOBJ = {};

			var queryElements = function () {
				var elementsArray = document.getElementsByTagName('link'),
					scriptEXP = /javascript/i,
					current, currentHREF, currentSRC, url, i, totalElements;
					
				totalElements = elementsArray.length;

				for (i = 0; i < totalElements; i++) {
					current = elementsArray[i];
					currentHREF = current.href;
					if (currentHREF && current.getAttribute('rel').toLowerCase() == 'stylesheet') {
						url = convert2absolutePath(currentHREF);
						if (!firstLoad[url] && activeDependencies.files.css[url]) {
							log.critical('Include CSS replicado: <strong>' + url + '</strong>');
							continue;
						}
						tmpOBJ[url] = true;
						activeDependencies.files.css[url] = true;
						Stack.loaded(url, 'css');
					}
				}

				elementsArray = document.getElementsByTagName('script');
				totalElements = elementsArray.length;
				
				for (i = 0; i < totalElements;i++) {
					current = elementsArray[i];
					currentSRC = current.src;
					url = convert2absolutePath(currentSRC);

					if (currentSRC && (scriptEXP.test(current.getAttribute('type')) || scriptEXP.test(current.getAttribute('language')))) {
						if (!firstLoad[url] && activeDependencies.files.js[url]) {
							log.critical('Include JS replicado: <strong>' + url + '</strong>.');
							continue;
						}

						tmpOBJ[url] = true;
						activeDependencies.files.js[url] = true;

						Stack.loaded(url, 'js');
					}
				}

				firstLoad = tmpOBJ;
				return undefined;
			};

			// doubleCheck
			queryElements();
			//$(document).ready(function () {
				//queryElements();
				//checkTemplate = undefined; // release
			//});

			return undefined;
		}());

		// Constructor <<

		var autoDetectAttributes = function (url) {
			var typeAttribute, urlAttributeName;

			if ((/\.css$/i).test(url)) {
				typeAttribute = "text/css";
				urlAttributeName = "href";
			}
			else if ((/\.js$/i).test(url)) {
				typeAttribute = "text/javascript";
				urlAttributeName = "src";
			}
			else {
				log.critical('Não foi possível identificar o tipo de tag para url: \n' + url);
				return null;
			}

			var attributesOBJ = {};
			attributesOBJ.type = typeAttribute;
			attributesOBJ[urlAttributeName] = url;

			return attributesOBJ;
		};

		var attachTimeOutHandler = function (tagOBJ, timeout, errorHandler) {
			timeout = timeout || require.timeout;

			var url = tagOBJ.src || tagOBJ.href,
				checkInterval,
				check = function () {
					checkInterval = window.clearInterval(checkInterval);

					if (!Stack.LoadedFiles[url]) {
						Stack.failed(url);
						tagOBJ.onload = tagOBJ.onreadystatechange = null;
						headElement.removeChild(tagOBJ);
						//errorHandler();
					}
				};


			if (timeout) {
				checkInterval = window.setInterval(check, timeout);
			}
		};

		var monitorNewCss = function (index, url) {
			var checkInterval,

				check = function () {
					if (document.styleSheets[index]) {
						if (url) {
							var currentURL = url,
								internalAttributes = url.match(/[?&]codeVersion=[^&]+/i);

							if (internalAttributes) {
								currentURL = currentURL.replace(internalAttributes[0], '');
							}

							Stack.loaded(currentURL, 'css');
							//if (window.console) console.log("Novo include CSS:\n" + url);
						}
						checkInterval = window.clearInterval(checkInterval);
					}
				};

			checkInterval = window.setInterval(check, 100);
		};


		var createElement = function (userDefinedOBJ, errorHandler) {
			var tagName, urlAttributeName, customOptions, tagOBJ, url, attributeName;

			if ((/text\/javascript/i).test(userDefinedOBJ.type)) {
				tagName = "script";
				urlAttributeName = "src";
			}
			else if ((/text\/css/i).test(userDefinedOBJ.type)) {
				tagName = "link";
				urlAttributeName = "href";
			}
			else {
				return log.warning('Tag desconhecida para o include: ' + userDefinedOBJ.type);
			}

			// splice custom attributes
			customOptions = {};
			if (userDefinedOBJ.timeout) {
				customOptions.timeout = userDefinedOBJ.timeout;
				delete userDefinedOBJ.timeout;
			}

			// set attributes
			tagOBJ = document.createElement(tagName);

			url = userDefinedOBJ[urlAttributeName];
			Stack.loading(url);

			// attach callback
			if (tagName == "script") {
				tagOBJ.onload = tagOBJ.onreadystatechange = function () {
					if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
						var currentURL = this.src,
							internalAttributes = this.src.match(/[?&]codeVersion=[^&]+/i);

						if (internalAttributes) {
							currentURL = currentURL.replace(internalAttributes[0], '');
						}


						//if (window.console) console.log("Novo include Javascript:\n" + currentURL);

						this.onload = this.onreadystatechange = null;
						//objHead.removeChild(this);
						headElement.removeChild(tagOBJ);
						//if (window.console) console.log("agora foi "+!!$.combobox);

						//setTimeout(function () {Stack.loaded(currentURL, 'js')},1000);
						Stack.loaded(currentURL, 'js');
						log.checkpoint("Novo include Javascript:\n" + currentURL);

						return undefined;
					}
				};
			}

			for (attributeName in defaultAttributes[tagName]) {
				if (defaultAttributes[tagName].hasOwnProperty(attributeName)) {
					tagOBJ[attributeName] = defaultAttributes[tagName][attributeName];
				}
			}
			for (attributeName in userDefinedOBJ) {
				if (userDefinedOBJ.hasOwnProperty(attributeName)) {
					tagOBJ[attributeName] = userDefinedOBJ[attributeName];
				}
			}

			if (tagName == "link") {
				monitorNewCss(document.styleSheets.length, url);
			}

			if (errorHandler) {
				attachTimeOutHandler(tagOBJ, customOptions.timeout, errorHandler);
			}

			headElement.appendChild(tagOBJ);
		};

		//=-=-=-=-=-=-=-=-=-
		// Public Commands >>
		//=-=-=-=-=-=-=-=-=-
		this.files = function (statementsObjectsARRAY) {
			if (!statementsObjectsARRAY || !(statementsObjectsARRAY instanceof Object)) {
				return log.critical('Erro ao utilizar o método require.files.');
			}

			// forgiving url expressed as a String
			statementsObjectsARRAY.dependencies = (typeof(statementsObjectsARRAY.dependencies) == "string") ? [statementsObjectsARRAY.dependencies] : statementsObjectsARRAY.dependencies;

			var structErrors = modMan.tools.getStructErrors({
				data : statementsObjectsARRAY,
				model : {
					dependencies : Array
				}
			});
			if (structErrors) {
				return log.critical('Erro ao utilizar a ferramenta requires. \n' + structErrors);
			}

			var finalStack = [],
				foundTypeErrors = false,
				current, url;
			while (statementsObjectsARRAY.dependencies.length) {
				current = statementsObjectsARRAY.dependencies.shift();
				url = current.src || current.href || current;

				url = convert2absolutePath(url.replace(/^\s?|\s?$/, '').replace(/.+s\d.trrsf\.com(\.br)?\//, globals.stage.staticFilesHost)); // trim

				// if not declared, detect file type
				if (typeof(current) == "string") {
					current = autoDetectAttributes(url);
				}
				else if (current.src) {
					current.src = url;
				}
				else if (current.href) {
					current.href = url;
				}

				if (!current) {
					foundTypeErrors = true;
					continue;
				}

				finalStack.push(current);
			}

			if (foundTypeErrors && typeof(statementsObjectsARRAY.error) == 'function') {
				return statementsObjectsARRAY.error(new TypeError('Erros foram encontrados durante a detecção do tipo de include em uma ou mais urls. Verifique mais detalhes no log registrado no console.'));
			}

			Stack.register({
				requires : finalStack,
				overwriteData : !!statementsObjectsARRAY.overwriteData,
				success : statementsObjectsARRAY.success,
				error : statementsObjectsARRAY.error
			});

			return undefined;
		};

		this.extensions = function (statementOBJECT) {
			if (!statementOBJECT || !(statementOBJECT instanceof Object)) {
				return log.critical('Erro ao utilizar o método require.extensions.');
			}

			var structErrors = modMan.tools.getStructErrors({
				data : statementOBJECT,
				model : {
					dependencies : Array,
					success : Function
				},
				help : {
					dependencies : "Deve ser um objeto tipo Array, composto por identificadores (strings) das extensões desejadas."
				}
			});
			if (structErrors) {
				return log.critical('Erro ao utilizar o método require.extensions. \n' + structErrors);
			}

			var unknowExtensions = [],
				externalScriptsList = [];
			while (statementOBJECT.dependencies.length) {
				var currentId = statementOBJECT.dependencies.shift();
				if (!Library.extensions[currentId]) {
					unknowExtensions.push(currentId);
					continue;
				}

				if (Library.extensions[currentId].source) {
					if (typeof(Library.extensions[currentId].source) == 'function') {
						Library.extensions[currentId].source();
						Library.extensions[currentId].source = true;
						activeDependencies.extensions[currentId] = true;
					}
					continue;
				}

				if (typeof(Library.extensions[currentId].scriptPath) == 'string') {
					externalScriptsList.push(modMan.globals.stage.coreBaseUrl + Library.extensions.baseDIR + Library.extensions[currentId].scriptPath);
				}

			}
			if (unknowExtensions.length) {
				return log.critical('Referência(s) não encontrada(s) na biblioteca: <strong>' + unknowExtensions.join(', ') + '</strong>.');
			}

			if (externalScriptsList.length) {
				require.files({
					dependencies : externalScriptsList,
					success : statementOBJECT.success,
					error : statementOBJECT.error
				});
			}
			else if (statementOBJECT.success) {
				statementOBJECT.success();
			}
		};

		//this.components = function (componentName, callback) {
		this.components = function (nameSelectorHashObjectsARRAY) {
			if (!nameSelectorHashObjectsARRAY || !(nameSelectorHashObjectsARRAY instanceof Array)) {
				return log.critical('Erro ao utilizar o método require.components.\n');
			}

			var foundTypeErrors = [],
				current, structErrors,
				
				setProcedure = function (current) {
					var component = Library.components[current.id];
				
					require.extensions({
						dependencies : component.dependencies.extensions,
						success : component.CONSTRUCTOR ?
							function () {
								component.CONSTRUCTOR(current.selector, current.success);
							} :
							current.success,
						error : current.error
					});
				};
				
			while (nameSelectorHashObjectsARRAY.length) {
				current = nameSelectorHashObjectsARRAY.shift();
					
				structErrors = modMan.tools.getStructErrors({
					data : current,
					model : {
						id : String,
						selector : String
					}
				});
					
				if (structErrors) {
					foundTypeErrors.push(structErrors);
					continue;
				}

				if (!Library.components[current.id]) {
					foundTypeErrors.push('Referência(s) não encontrada(s) na biblioteca: <strong>' + current.id + '</strong>.');
					continue;
				}

				setProcedure(current);
			}

			if (foundTypeErrors.length) {
				return log.critical('Erros encontrados na chamada ao método require.components:\n' + foundTypeErrors.join('<br/>'));
			}
		};

		// backward compatibility
		$.include = function (pathsARRAY, callback, errorHandler) {
			if (!pathsARRAY || (!pathsARRAY.length && typeof(pathsARRAY) != 'string'))  {
				return log.critical('Erro encontrado na utilização do método $.include.');
			}

			if (typeof(pathsARRAY) == 'string') {
				pathsARRAY = [pathsARRAY];
			}

			var fileList = [];
			while (pathsARRAY.length) {
				var current = pathsARRAY.shift();
				if (!(/^https?:\/\//).test(current)) {
					current = globals.stage.coreBaseUrl + current;
				}
				fileList.push(current);
			}

			require.files({
				dependencies : fileList,
				success : callback,
				error : errorHandler
			});
		};

		this.jsonP = (function (configsOBJ) {

			var userSupportsWebStorage = (document.domain && window.localStorage && window.sessionStorage && window.JSON && window.JSON.parse && window.JSON.stringify),
				STR = {
					contingencyPrefix : "modMan_request_",
					sep : '-',
					dateSplitter : '.',
					hoursSplitter : 'h'
				},
				globalOptions = {
					struct : {
						url : String,
						wrapperName : /^[a-zA-Z][\w-_]+$/,
						cache : Boolean,
						localStorage : Boolean,
						sessionStorage : Boolean,
						callback : Function
					},
					values : {
						wrappername : "jsonp_modMan_globalWrapper",
						cache : true,
						localStorage : false,
						sessionStorage : false
					}
				},

				callbackHandler = (function () {
					var queuedCallbacks = {};

					return {
						set : function (INSTANCE) {
							var OPTIONS = INSTANCE.options,
								wrapperName = OPTIONS.wrapperName;
							if (!queuedCallbacks[wrapperName]) {
								queuedCallbacks[wrapperName] = {};
							}
							if (!queuedCallbacks[wrapperName][OPTIONS.feedStorageKey]) {
								queuedCallbacks[wrapperName][OPTIONS.feedStorageKey] = [];
							}

							queuedCallbacks[wrapperName][OPTIONS.feedStorageKey].push(OPTIONS.callback);

							require.files({
								dependencies : [{type : "text/javascript", src : OPTIONS.url}],
								overwriteData : true,
								success : function () {

									callbackHandler.trigger(OPTIONS);

								}
							});

						},
						trigger : function (OPTIONS) {
							var data = modMan.globals.data.feeds[OPTIONS.wrapperName],
								newCopy;

							//console.log('recebendo de VERDADE ' + OPTIONS.wrapperName + '\n' + data);
							log.checkpoint('Executando ' + queuedCallbacks[OPTIONS.wrapperName][OPTIONS.feedStorageKey].length + ' callback(s) para o jsonP ' + OPTIONS.url + '<br/>');

							while (queuedCallbacks[OPTIONS.wrapperName][OPTIONS.feedStorageKey].length) {
								var callback = queuedCallbacks[OPTIONS.wrapperName][OPTIONS.feedStorageKey].shift();
								
								if (typeof data == 'object') {
									newCopy = data instanceof Array ? [] : {};
									newCopy = $.extend(newCopy, data);
								} else {
									newCopy = data;
								}

								try {
									callback.call(OPTIONS, newCopy);
								}
								catch (e) {
									e.message = 'Erro em uma função de callback associada ao feed \n' + OPTIONS.url + '<br/><br/>' + e.message;
									log.critical(e);
								}
							}

							/*
							if (!OPTIONS.localStorage && !OPTIONS.sessionStorage) {
								delete modMan.globals.data.feeds[OPTIONS.wrapperName];
							}
							*/
						}
					};
				}());

			return function (userOptions) {
				if (!(this instanceof require.jsonP)) {
					return new require.jsonP(userOptions);
				}

				var INSTANCE = this,
					OPTIONS = INSTANCE.options = $.extend({}, globalOptions.values, userOptions || {}),
					structErrors = tools.getStructErrors({
						data : OPTIONS,
						model : globalOptions.struct
					}); // validation

				if (structErrors) {
					throw new TypeError('Erro encontrado ao validar o parâmetro transmitido ao método "jsonP()" » ' + structErrors);
				}

				var url = OPTIONS.url,
					wrapperName = OPTIONS.wrapperName,
					localStorage = OPTIONS.localStorage,
					sessionStorage = OPTIONS.sessionStorage,
					feedStorageKey = OPTIONS.feedStorageKey = modMan.tools.encodeURIComponent(url.replace(/\s*/, '')),

					dataOnMemmory = INSTANCE.data,
					userDesiresWebStorage = (sessionStorage || localStorage),
					feedAlreadyOnGlobalScope = typeof window[wrapperName] == 'object';

				// READING	>>
				if (OPTIONS.cache) {
					if (dataOnMemmory && userDesiresWebStorage) {
						log.checkpoint('<strong>Carregando dados da memória para o feed </strong><br/>' + OPTIONS.wrapperName);

						OPTIONS.callback.call(OPTIONS, dataOnMemmory);
						return;
					}
					else if (!dataOnMemmory && userDesiresWebStorage && userSupportsWebStorage) {

						if (localStorage && window.localStorage.getItem(feedStorageKey)) {
							log.checkpoint('<strong>Carregando dados do armazenamento local (localStorage) para o feed </strong><br/>' + OPTIONS.feedStorageKey);

							dataOnMemmory = JSON.parse(window.localStorage.getItem(feedStorageKey));

							OPTIONS.callback.call(OPTIONS, dataOnMemmory);
							return;
						}
						else if (sessionStorage && window.sessionStorage.getItem(feedStorageKey)) {
							log.checkpoint('<strong>Carregando dados armazenados para sessão (sessionStorage) para o feed </strong><br/>' + OPTIONS.feedStorageKey);

							dataOnMemmory = JSON.parse(window.sessionStorage.getItem(feedStorageKey));

							OPTIONS.callback.call(OPTIONS, dataOnMemmory);
							return;
						}
					}
				}

				if (feedAlreadyOnGlobalScope) {
					log.checkpoint('<strong>Retornando objeto armazenado em escopo global (' + window[wrapperName] + ') através de um include.</strong>. <br/>A requisição foi evitada.');
					dataOnMemmory = modMan.globals.data.feeds[wrapperName] = window[wrapperName];

					OPTIONS.callback.call(OPTIONS, dataOnMemmory);

					return;
				}
				// READING	<<

				// PREPARING
				if (window[wrapperName] && !(/function|object/).exec(typeof(window[wrapperName]))) {
					log.warning('Uma variável em escopo global possui o nome identificador indicador como "wrapperName". O modMan agregará o prefixo "' + STR.contingencyPrefix + '' + OPTIONS.wrapperName + '" à função responsável por disparar o callback.');
					wrapperName = STR.contingencyPrefix + wrapperName;
				}

				if (!OPTIONS.cache) {
					var currentDate = new Date();
					url += (OPTIONS.url.match(/\?/)) ? '&' : '?';
					url += 'cache=' + currentDate.getFullYear() + STR.dateSplitter + currentDate.getDate() + STR.dateSplitter + currentDate.getMonth() + STR.sep + currentDate.getHours() + STR.hoursSplitter + currentDate.getMinutes();
				}

				if (typeof window[wrapperName] != 'function') {
					window[wrapperName] = function (data) {
						// WRITING
						INSTANCE.data = data;
						if (userDesiresWebStorage && userSupportsWebStorage) {
							if (localStorage) {
								log.checkpoint('<strong>Armazenados localmente (localStorage) para o feed </strong><br/>' + feedStorageKey);
								window.localStorage.setItem(feedStorageKey, JSON.stringify(data));
							} else if (sessionStorage) {
								log.checkpoint('<strong>Armazenados para sessão (sessionStorage) para o feed </strong><br/>' + feedStorageKey);
								window.localStorage.setItem(feedStorageKey, JSON.stringify(data));
							}
						}
						modMan.globals.data.feeds[wrapperName] = data;
					};
				}

				setTimeout(function () {
					callbackHandler.set(INSTANCE);
				}, 0);
			};
		}());

		this.xml = function () {

		};

		this.post = function () {

		};
		// Public Methods <<

		return this;
	}.call({});
	
	var load = function(){
		//-+-+-+-+-+-+-+-+
		// Local VARS
		//-+-+-+-+-+-+-+-+
		var firstLoad = true,
			modulesQueue = [],
			modTypeInProgress = [],
			loaded = {};
		// Local VARS //
	
		var modules = function(modulesOBJ){
			if (typeof modulesOBJ === 'object' && !modulesOBJ.length) {
				modulesOBJ = [modulesOBJ];
			}
			
			var modByType = {};
			
			// Validation loop
			for(var no = 0; no < modulesOBJ.length; no++){
				var mod = modulesOBJ[no];
				
				// Valide template
				if(!mod.selector || !$(mod.selector).length) {
					log.critical(mod.id + " - Elemento container não localizado. O parâmetro '<strong>selector</strong>' está incorreto ou não foi especificado. Seu valor atual é: <strong>" + mod.selector + "</strong>");
					continue;
				}
				
				// Check if there are permission for this module in the library
				if(!Library.modules[mod.id]) {
					log.critical(mod.id + " - Script não encontrado na biblioteca.");
					continue;
				}
								
				if(!modByType[mod.id]) {
					modTypeInProgress.push(mod.id);
					modByType[mod.id] = [];
				}
				modByType[mod.id].push(mod);				
			}
			
			// Execution loop			
			for(var modType in modByType){
								
				var url = globals.page.baseURL + Library.modules.baseDIR + Library.modules[modType].scriptPath;
				log.checkpoint('Requisitando script para: ' + modType + '\n' + url);
				
				if(modType == 'modConsole'){
					$.include(url.replace(globals.page.baseURL, ''), function(){
							var moduleOBJ = window[modType],
								moduleID = moduleOBJ.info.id;
							log.checkpoint('Executando callback do: ' + moduleID);
							
							var modPrefs = modByType[moduleID].shift();
							
							
							var sameTypeQueue = modByType[moduleID],
								callModPrefs = !!!modTypeInProgress.length;
							
							//alert(modTypeInProgress.length + '\n' + moduleID + '\n' + callModPrefs);
							
							if (moduleOBJ.dependencies){
								log.checkpoint(moduleID + " - Avaliando pré-requisitos para o seletor " + modPrefs.selector);
								components(moduleOBJ, modPrefs, sameTypeQueue);
							} else {
								modulesQueue.push(modPrefs);
							}
					
					});
				
				} else {
					new tools.jsonP({
						url:url,
						wrapperName:modType,
						cache:$.useBrowserCache,
						callback:function(moduleOBJ){
							var moduleID = moduleOBJ.info.id;
							log.checkpoint('Executando callback do: ' + moduleID);
							window[moduleID] = moduleOBJ;

								var modPrefs = modByType[moduleID].shift();
							
							
							var sameTypeQueue = modByType[moduleID];
							var callModPrefs = !!!modTypeInProgress.length;
							
							//alert(modTypeInProgress.length + '\n' + moduleID + '\n' + callModPrefs);
							
							if (moduleOBJ.dependencies){
								log.checkpoint(moduleID + " - Avaliando pré-requisitos para o seletor " + modPrefs.selector);
								components(moduleOBJ, modPrefs, sameTypeQueue);
							} else {
								modulesQueue.push(modPrefs);
							}
						}
					});
				}
			}	
			
		}
		
		var components = function(modOBJ, modPrefs, sameTypeQueue){
			var loadSkin = modPrefs.loadSkin;
			var dependenciesOBJ = modOBJ.dependencies;
			var urlsOBJ = {};
			//alert('aqui \n' + modOBJ.name);
			
			
			if(dependenciesOBJ.underTerra && !globals.page.underTerra) {
				log.critical(modPrefs.id + ' - Este módulo só pode ser carregado sob o domínio do Terra');
				if(callModPrefs) preferences();
				return false;
			}
			
			if(dependenciesOBJ.flash && !globals.user.flash.installed) {
				log.warning(modPrefs.id + ' - Este módulo precisa de flash para ser instanciado');
				if(callModPrefs) preferences();
				contingency(modPrefs);
				return false;
			}
			
			if(dependenciesOBJ && dependenciesOBJ.js){
				urlsOBJ['js'] = [];
				for(var type in dependenciesOBJ.js){
					var item = dependenciesOBJ.js[type],
						//base = globals.page.baseURL + Library[type].baseDIR;
						base = Library[type].baseDIR;
					
					if(typeof(item) == 'string') urlsOBJ['js'].push(baseURL + item);
					else if(typeof(item) == 'object' && item.length){
						for (var i = 0; i < item.length; i++){
							if(!Library[type][item[i]]) {
								log.critical(item[i] + ' - não encontrado na biblioteca '+ type);
								return false;
							}
							var url =  base + Library[type][item[i]].scriptPath;
							urlsOBJ['js'].push(url);
						}
					}
					/* alert(
						'type : ' + type +'\n'+
						'itemName : ' + itemName +'\n'+
						'baseURL : ' + baseURL +'\n'
					); */
				}
				//alert(urlsOBJ.toSource());
				tools.Components.set(urlsOBJ, function(){
					var shift = modTypeInProgress.shift();
					//log.checkpoint('chamando internalTimer\n' + modPrefs.id);
					modulesQueue.push(modPrefs);
					if(sameTypeQueue.length) {
						for(var i = 0; i < sameTypeQueue.length; i++){
							modulesQueue.push(sameTypeQueue[i]);
						}
					}
					if(!modTypeInProgress.length) {
						//alert('chamando módulos. logo após ' + modPrefs.id);
						preferences();
					}
				});
			} else {				
				var shift = modTypeInProgress.shift();
				modulesQueue.push(modPrefs);
				if(sameTypeQueue.length) {
					for(var i = 0; i < sameTypeQueue.length; i++){
						modulesQueue.push(sameTypeQueue[i]);
					}
				}
				
				if(!modTypeInProgress.length) {
					preferences();
				}
			}
		}
		
		var play = function() {
			var now = function(modPrefs){
				//alert("play para " + modPrefs.id);
				
				var PARAMS = Interface(modPrefs);
				if (!PARAMS) new contingency(modPrefs);
				else {
					var extraTools = {
						log: new Log.CONSTRUCTOR(modPrefs.id),
						pageReloader:tools.pageReloader
					}
					
					try{
						extraTools.log.checkpoint("Creating new instance.");
						var instance = new window[modPrefs.id].CONSTRUCTOR(PARAMS, jQuery, extraTools);					
						if(!globals.data.instances[modPrefs.id]) globals.data.instances[modPrefs.id] = [];
							globals.data.instances[modPrefs.id].push(instance);
						
						loaded[modPrefs.id + '_' + modPrefs.selector] = true;
					} catch (errorOBJ){
						var msg = ""+
							"Erro ao instanciar módulo: "+modPrefs.id+" \n"+
							'['+errorOBJ.name+'] -> '+errorOBJ.message + "\n" +
							"Arquivo: " + errorOBJ.fileName +'\n'+
							"Linha: " + errorOBJ.lineNumber;
						
						log.critical(msg);
					}
					
					if(!modulesQueue.length && globals.page.lazyLoad) {
						$(window).unbind('scroll');
					}
				}
				
			}
			
			var onViewPort = function(modPrefs){
				if($(modPrefs.selector + ":in-viewport").length) {
					play.now(modPrefs); 
				} else {
					log.checkpoint('scrolling');
					
					$(window).scroll(function() { 		
						if(!loaded[modPrefs.id + '_' + modPrefs.selector] && $(modPrefs.selector + ":in-viewport").length) {
							new play.now(modPrefs);
						}
					});
				}
			}

			return {
				now:now,
				onViewPort:onViewPort
			}
			
		}();
		
		var preferences = function(){
			//alert('em preferences: ' + modulesQueue.length + " itens");
				if(firstLoad){		
					$(document).ready(function(){
						while(modulesQueue.length){
							var modPrefs = modulesQueue.shift();
							if(globals.page.lazyLoad) new play.onViewPort(modPrefs);
							else play.now(modPrefs);
							
							if(!modulesQueue.length) firstLoad = false;
						}
					});			
				} else {
					while(modulesQueue.length){
						var modPrefs = modulesQueue.shift();
						play.now(modPrefs);					
					}
				}
		};
		
		// Forçando a revisão da fila de módulos
		// viva o core2!
		$(document).ready(function () {
			preferences();
		});
		
		$(window).load(function () {
			preferences();
		});
		
		var Interface = function (modPrefs){
			log.checkpoint(modPrefs.id + " - Analisando interface.");
			
			
			var moduleOBJ = window[modPrefs.id];
			var CONTAINER = $(modPrefs.selector);
			
			//-+-+-+-+-+-+-+-+-+-+-+-+-+
			// Double-check for basic dependencies
			//-+-+-+-+-+-+-+-+-+-+-+-+-+
			if(!CONTAINER.length) {
				log.critical(modPrefs.id+' - Recipiente (DOM element) não encontrado. Favor, verificar seletor e template.');
				return false;
			}
					
			// Checking for module object
			if(!moduleOBJ) {
				log.critical(modPrefs.id + ' - Não foi possível localizar o script para este módulo. Confirme a localização do js e o nome do objeto carregado.' )
				return false;
			}
			
			// Checking for constructor
			if (!moduleOBJ.CONSTRUCTOR){
				log.critical(modPrefs.id + ' - Não foi possível localizar um construtor para este módulo. Verifique se o objeto possui um método chamado "CONSTRUCTOR".' )
				return false;
			}	
			
			// Checking for contingency method
			/* if (!moduleOBJ.CONTINGENCY){
				log.warning(modPrefs.id + ' - Este módulo não possui um método de contingência. Em caso de erros, apenas o procedimento padrão será adotado.' );
			}	 */		
			// Double-check for basic dependencies //
			
			
			var PARAMS = {}; // private object - stores valid params		
		
			//-+-+-+-+-+-+-+-+-+-+-+-+-+
			// Validate specific PARAMS
			//-+-+-+-+-+-+-+-+-+-+-+-+-+
			if (moduleOBJ.params) {
				var params = {};
				if(modPrefs.params) params = $.extend({}, modPrefs.params);
				
				var defaults = moduleOBJ.params.defaults || {};
				
				if(defaults) params = $.extend(defaults, modPrefs.params);				
				
				if(window.trrConstantData && window.trrConstantData && window.trrConstantData[modPrefs.id]) {
					params =  $.extend(params, window.trrConstantData[modPrefs.id]);	
					var msg = '';
					for (var paramName in window.trrConstantData[modPrefs.id]) {
						if(msg) msg += '<br/>';
						msg += '<strong>'+paramName + '</strong>: ' + window.trrConstantData[modPrefs.id][paramName];
					}
					log.checkpoint('Preservando parâemtros definidos como constantes para o módulo <em>'+modPrefs.id+'</em>, neste contexto:<br/>'+msg);
				}
				
				var required = moduleOBJ.params.required || moduleOBJ.params.needed;
				
				if (required) {
					var errors = tools.getStructErrors({
						model: required,
						data: params,
						help: moduleOBJ.params.help || {}
					});
					
					if (errors) {
						throw new Error(errors, location.href, 0);
					}
				}
				
				
				// If everything is alright
				for(var paramName in params){
					PARAMS[paramName] = params[paramName];
				}
				log.checkpoint(modPrefs.id + ' - Parâmetros OK.');
			}
			// Validate specific PARAMS //
			
			
			//-+-+-+-+-+-+-+-+-+-+-+-+-+
			// Adjust module language and region
			//-+-+-+-+-+-+-+-+-+-+-+-+-+
			PARAMS["LNG"] = {};
			PARAMS["RGN"] = {};
			if (moduleOBJ.locale) {
				// LNG
				if(moduleOBJ.locale.LNG) {
					var primaryLNG = moduleOBJ.locale.LNG[globals.page.lang],
						secondaryLNG = moduleOBJ.locale.LNG[globals.page.locale];
					
					// dealing with exception language definitions (forgiving deprecated ones)
					if(!primaryLNG && globals.page.country == 'BR') primaryLNG = moduleOBJ.locale.LNG['br'];
					else if(!primaryLNG && globals.page.country == 'AR') primaryLNG = moduleOBJ.locale.LNG['ar'];
						
					if(primaryLNG || secondaryLNG) {
						PARAMS["LNG"] = primaryLNG || {};						
						
						if(secondaryLNG) PARAMS["LNG"] = $.extend(primaryLNG, secondaryLNG);
						
						// Check for default specification
						if (!moduleOBJ.locale.defaultLNG) log.warning(modPrefs.id + ' - A propriedade "defaultLNG" não foi encontrada. Este módulo pode não funcionar corretamente em outros idiomas.');
					} else {
						// Check for default specification
						if (!moduleOBJ.locale.defaultLNG) {
							log.critical(modPrefs.id + ' - Não existem variáveis de idioma para "'+globals.user.lang+'". A propriedade "defaultLNG" também não foi definida. ');
							return false;
						}
						else {
							PARAMS["LNG"] = moduleOBJ.locale.LNG[moduleOBJ.locale.defaultLNG.toLowerCase()];
							log.warning(modPrefs.id + ' - Não existem variáveis de idioma para "'+globals.user.lang+'". O padrão foi implementado.')
						}
					}
				} else {
					log.warning(modPrefs.id+ " - O objeto 'LNG' não foi encontrado. Verifique se ele realmente é desnecessário.");
				}
				
				// RGN
				if(moduleOBJ.locale.RGN) {
					if(moduleOBJ.locale.RGN[globals.page.country.toUpperCase()]) {
						PARAMS["RGN"] = moduleOBJ.locale.RGN[globals.page.country.toUpperCase()];
						// Check for default specification
						if (!moduleOBJ.locale.defaultRGN.toUpperCase()) log.warning(modPrefs.id + ' - A propriedade "defaultRGN" não foi encontrada. Este módulo pode não funcionar corretamente em outros idiomas.');
					} else {
						// Check for default specification
						if (!moduleOBJ.locale.defaultRGN.toUpperCase()) {
							log.critical(modPrefs.id + ' - Não existem variáveis de região para "'+globals.page.country+'". A propriedade "defaultRGN" também não foi definida. ');
							return false;
						}
						else {
							PARAMS["RGN"] = moduleOBJ.locale.RGN[moduleOBJ.locale.defaultRGN.toUpperCase()];
							log.warning(modPrefs.id + ' - Não existem variáveis de região para "'+globals.page.country+'". O padrão foi implementado.')
						}
					}
				} else {
					log.warning(modPrefs.id+ " - O objeto 'RGN' não foi encontrado. Verifique se ele realmente é desnecessário.");
				}
				
			}
				
			// Extendind locale objects with controlled vocabulary
			/*
			$.extend(PARAMS['LNG'], controlled.LNG);
			$.extend(PARAMS['RGN'], controlled.RGN); 
			*/
			PARAMS['LNG']['controlled'] = controlled.LNG;
			PARAMS['RGN']['controlled'] = controlled.RGN;
			
			log.checkpoint(modPrefs.id + ' - Configurações de seção (LNG e/ou RGN) foram avaliadas.');			
			// Adjust module language and region //
			
			
			//-+-+-+-+-+-+-+-+-+-+-+-+-+
			// Skin interpretation
			//-+-+-+-+-+-+-+-+-+-+-+-+-+
					
			// Validating skin settings
			if(modPrefs.loadSkin){
				if(!moduleOBJ.skins) {
					log.critical(modPrefs.id + " - o parâmetro 'loadSkin' foi definido como 'true', mas o módulo não possui a propriedade um objeto 'skins'. Certifique-se \que módulo requer arquivos externos para habilitar esta opção.");
					return false;
				}
				
				var skinsOBJ = moduleOBJ.skins;			
				var skin = {};
				// Checking skin presence
				if(modPrefs.skinName && skinsOBJ.items[modPrefs.skinName]) {
					skin.id = modPrefs.skinName;
					log.checkpoint(modPrefs.id + " - Validando skin: " + modPrefs.skinName);
					
				} else if (skinsOBJ.items[skinsOBJ.defaultSkinName]) {				
					skin.id = skinsOBJ.defaultSkinName;
					log.checkpoint(modPrefs.id + " - Validando skin padrão.")
				} else if (skinsOBJ.items[skinsOBJ.backupSkinName]){
					skin.id = skinsOBJ.backupSkinName;
					log.critical(modPrefs.id + " - Validando skin de backup.");
					return false;
				} else {
					if (!skinsOBJ.items[skinsOBJ.defaultSkinName]) {
						log.critical(modPrefs.id + " - O skin padrão não foi localizado. Verifique se o objeto é uma pririedade de 'items' e se o o seu nome tem o sufix 'skn_'.");
						return false;
					}
				}
				
				// Validating skin interface
				var currentSkin = skinsOBJ.items[skin.id]
				if(!currentSkin.tplBody) {
					log.critical(modPrefs.id + " - o parâmetro 'tplBody' não foi encontrado.");
					return false;
				} else {
					if(typeof(currentSkin.tplBody) != 'string') {
						log.critical(modPrefs.id + " - o parâmetro 'tplBody' deve ser uma string contendo a estrutura HTML para o módulo.");
						return false;
					}
				}
				
				// Parsing template
				if (PARAMS["LNG"] || PARAMS["RGN"]) {
					var lngOBJ = (PARAMS["LNG"]) ? PARAMS["LNG"] : false;
					var rgnOBJ = (PARAMS["RGN"]) ? PARAMS["RGN"] : false;
					
					var TPL = tools.parseTPL({LNG:lngOBJ, RGN:rgnOBJ}, currentSkin.tplBody);
				}
				
				// Including styles
				if(currentSkin.css && currentSkin.css.length) {
					var moduleBaseURL = Library.modules.baseDIR + modPrefs.id.toLowerCase().replace('mod','') + '/';
					
					if(typeof(currentSkin.css) == 'string') {
						tools.Components.set({css:moduleBaseURL + currentSkin.css});
					} else {
						var newCssArray = [];
						for(var i = 0; i < currentSkin.css.length;i++){
							var currentCss = moduleBaseURL + currentSkin.css[i];
							newCssArray.push(currentCss);
						}
						tools.Components.set({css:newCssArray});
					}
				}
				
				
				if(TPL && modPrefs.loadSkin) {
					var newElement = $(TPL);
					CONTAINER.replaceWith(newElement);
					CONTAINER = newElement;
				}
			}
			// Deliver recipient
			PARAMS.preLoadedSkin = !modPrefs.loadSkin;
			PARAMS.skinName = (skin && skin.id) ? skin.id : modPrefs.skinName;
			PARAMS.recipient = CONTAINER;
			
			// Define loading state
			//PARAMS["recipient"].addClass("loading");
			
			// Applying transition effects
			if(globals.page.transitionEffects) CONTAINER.hide().fadeIn('slow');
			// Skin interpretation//
			
			//alert(PARAMS.id + '\n' +  $(modPrefs.selector).length);
			return PARAMS;
		}
		
		var contingency = function(modOBJ){
			log.checkpoint(modOBJ.id + ' - Problemas encontratos. Disparando método de contingência.');
			if($(modOBJ.selector).length) {
				var skinsOBJ = window[modOBJ.id].skins;
				var backupSkinName = skinsOBJ.backupSkinName;
				if(backupSkinName && skinsOBJ.items[backupSkinName]){
					log.checkpoint(modOBJ.id + ' - Incluindo template de backup - ' + skinsOBJ.backupSkinName);
					
					tools.Components.set(skinsOBJ.items[backupSkinName].css, function(){
						$(modOBJ.selector).html(skinsOBJ.items[backupSkinName].tplBody);
					});
					
					
				} else $(modOBJ.selector).html('Um problema foi detectado neste módulo.');
			}
			else log.critical(modOBJ.id + ' - Não foi possível localizar um elemento HTML para receber o template de backup.');
		}
		
		return {
			modules:modules
		}
	}();
	
	// Public //
	var start = function(setupOBJ){
		
		//-+-+-+-+-+-+-+-+-+-+-+-+
		// Parsing configs
		//-+-+-+-+-+-+-+-+-+-+-+-+
		if(setupOBJ.configs) {
			var version = setupOBJ.configs.coreVersion || details.coreVersion;

			if(setupOBJ.configs.reloadInterval) tools.pageReloader.on(setupOBJ.configs.reloadInterval);

			if(setupOBJ.configs.locale && typeof(setupOBJ.configs.locale) == 'string') {
				var localeLevels = setupOBJ.configs.locale.match(/\w\w/gi);
				
				// forgiving country definition
				if(localeLevels.length == 1 && Regions[localeLevels[0].toUpperCase()]){
					var correctCountry = Regions[localeLevels[0].toUpperCase()].isoAlpha2;
					localeLevels[1] = correctCountry;
					localeLevels[0] = Regions[correctCountry].lang;
				}
				
				globals.page.lang = localeLevels[0].toLowerCase();
				
				
				if(typeof(localeLevels[1]) == 'string' && localeLevels[1].match(/es/i))  localeLevels[1] = globals.page.country;
				if(localeLevels[1]) globals.page.country = localeLevels[1].toUpperCase();			
			
			} else { // deprecated params
				if(setupOBJ.configs.pageCountry && typeof(setupOBJ.configs.pageCountry) == 'string' && setupOBJ.configs.pageCountry.toLowerCase() != 'auto') globals.page.country = setupOBJ.configs.pageCountry.toUpperCase();
				if(setupOBJ.configs.pageLang && typeof(setupOBJ.configs.pageLang) == 'string' && setupOBJ.configs.pageLang.toLowerCase() != 'auto') {	
					var lngLevels = setupOBJ.configs.pageLang.match(/\w\w/gi);
					globals.page.lang = lngLevels[0].toLowerCase();
					if(lngLevels[1]) {
						globals.page.lang += '-' + lngLevels[1].toUpperCase();
						globals.page.country = lngLevels[1].toUpperCase();
					}
				}
			}
			globals.page.locale = globals.page.lang + '-' + globals.page.country;
						

			//if(!globals.stage.isDSV && setupOBJ.configs.pageCountry && !setupOBJ.configs.baseURL) globals.page.baseURL = (setupOBJ.configs.pageCountry == "BR") ? "http://s1.trrsf.com.br/atm/2/core/" + version + '/': "http://s1.trrsf.com.br/atm/2/core/" + version + '/';
			if (!globals.stage.type.match(/HLG|DSV/) && typeof setupOBJ.configs.pageCountry == 'string' && !setupOBJ.configs.baseURL) {
				globals.page.baseURL = (setupOBJ.configs.pageCountry.match(/br/i)) ? "http://s2.trrsf.com.br/atm/" + version + '/core/': "http://s2.trrsf.com/atm/" + version + '/core/';
			}
			
			if (typeof setupOBJ.configs.baseURL == 'string') {
				globals.page.baseURL = setupOBJ.configs.baseURL.replace(/\/$/,'') + '/';
				globals.stage.coreBaseUrl = globals.page.baseURL;
				globals.stage.staticFilesHost = globals.page.baseURL.match(/https?:\/\/[^\/]+\//) + '';
			}
			
			
			if (setupOBJ.configs.lazyLoad) {
				$.include(globals.page.baseURL + '/_js/jquery.viewport.js');
				globals.page.lazyLoad = true;
			}
			
			globals.page.transitionEffects = setupOBJ.configs.transitionEffects;
		}
		
		$.ImportBasePath = globals.page.baseURL;
		$.useBrowserCache = !(/trrDebug|noCache/).test(document.location);
		//if($.browser.safari) $.useBrowserCache = false;
		
		// Set locale objects
		errorMsgs = (errorMsgs[globals.user.lang]) ? errorMsgs[globals.user.lang] : errorMsgs[globals.user.lang];
		controlled.LNG = (controlled.LNG[globals.page.lang]) ? controlled.LNG[globals.page.lang] : controlled.LNG[controlled.defaultLNG.toLowerCase()];
		controlled.RGN = (controlled.RGN[globals.page.country]) ? controlled.RGN[globals.page.country] : controlled.RGN[controlled.defaultRGN.toUpperCase()];
		
		// Habilitando exception locales em CSS (exceto BR)
		if(globals.page.country != 'BR') {
			
			// primary language class
			if(globals.page.lang.match(/ar/i)) $(document.body).addClass('LNG_es' ).addClass('LNG_es-AR' ); // AR extends ES
			else $(document.body).addClass('LNG_' + globals.page.locale.match(/\w\w/g)[0]);
			
			// locale language class - always extends primary language class
			$(document.body).addClass('LNG_'+globals.page.locale);		
			
			// defined country class
			$(document.body).addClass('RGN_' + globals.page.country);
		}		
	
		if(setupOBJ.modules) load.modules(setupOBJ.modules);
		
		return modMan.start = load.modules;
	}
	
	var tools = {
	
		getShortUrl: function (service, longUrl, options, callback) {
		
			var shortUrl = null;
		
			switch (service) {
				case 'bitLy' :
				
					// default config
					var config = {
						ws: {
							url: 'http://api.bit.ly/shorten'
						},
						params: {
							version: '2.0.1',
							callback: 'bitLyCallback',
							login: 'terra',
							apiKey: 'R_fd7c471fd02e6284b9b2150d4602ee5f',
							longUrl: ((document.domain) ? longUrl : modMan.globals.page.portalURL)
						}
					};
					
					// merge config
					if (typeof options == 'object') {
						config = $.extend(config, options);
					}
					
					// request
					modMan.tools.jsonP({
						cache: true,
						wrapperName: config.params.callback,
						url: function () {
							var url = config.ws.url;
							for (var paramName in config.params) { 
								url += (url.indexOf('?') == -1) ? '?' : '&amp;';
								url += paramName + '=' + config.params[paramName];
							}
							return url;
						}(),
						callback: function (data) {
							window[config.params.callback] = undefined;
							if (data.results) {
								for (var index in data.results) {
									if (shortUrl) {
										break;
									}
									shortUrl = data.results[index].shortUrl ? modMan.tools.encodeURIComponent(data.results[index].shortUrl) : longUrl;
									callback.call(this, shortUrl);
								};
							}
						}
					});
					
				break;
			
			}
			
		},
	
		metrics:new function Metrics(){

			var currentMetricsValues = { // default values for mandatory params
				terra_info_service : window.terra_info_service,
				terra_info_channel: window.terra_info_channel,
				terra_info_type: window.terra_info_type,
				terra_info_id: window.terra_info_id,
				terra_info_channeldetail: window.terra_info_channeldetail,
				
				terra_stats_regCLK: window.terra_stats_regCLK,
				terra_stats_idCrtfc: window.terra_stats_idCrtfc,
				terra_stats_uv_c: window.uv_c || window.terra_stats_uv_c
				},
				_self = this,
				trafficRegistered = false;
			
			var hit = function(){

			}
			
			var setValues = this.setValues = function(newMetricValues){
				currentMetricsValues = $.extend(currentMetricsValues, newMetricValues || {});
			}

			this.getCurrentValues = function(){
				return currentMetricsValues;
			}

			this.reg = this.regTraffic = function(newMetricValues){
				var notFoundValues = [];
					
				if(typeof newMetricValues == 'object') setValues(newMetricValues);
				
				for(var current in currentMetricsValues){					
					if(typeof(currentMetricsValues[current]) != 'undefined') window[current] = currentMetricsValues[current];
					else {
						notFoundValues.push(current);
						delete currentMetricsValues[current];
					}
				}
				
				if(notFoundValues.length) log.critical('Não foi possível encontrar o valor para as seguintes variáveis de métricas: ' + notFoundValues.join(', ') + '. Registrando demais valores encontrados.');
				try {
					terra_stats_regTraffic();
					trafficRegistered = true;
					log.checkpoint('[Tráfego registrado] » terra_info_type: <strong>'+modMan.tools.metrics.getCurrentValues().terra_info_type+'</strong>');
				} catch(e) {
					var countryCode = (modMan.globals.page.country) ? globals.page.country.toLowerCase() : 'br',
						scriptUrl = (!document.domain || (/hlg\./i).exec(document.domain)) ? 'http://s2.trrsf.com.br/metrics/js/'+countryCode+'/content.js' : "/metrics/js/"+countryCode+"/content.js";
					
					log.critical(
						'Erro ao disparar a função que recarrega métricas: <strong>terra_stats_regTraffic</strong>. '+ 
						(!window.terra_stats_regTraffic ? 'Por favor, certifique-se que o template faz include do seguinte script: ' + scriptUrl : '» '+ e.message)
					);
				}
			}
			
			this.regEvent = function(eventId){
				if(!trafficRegistered) return log.critical('O registro do evento "'+eventId+'" foi disparado antes de contabilizar o tráfego da página (métiodo "regTraffic"").');
			
				try {
					terra_stats_regEvent({id:eventId});
					log.checkpoint('[Evento contabilizado] » <strong>'+eventId+'</strong>');
				} catch(e) {
					log.critical('Erro ao disparar a função que recarrega métricas: <strong>terra_stats_regTraffic</strong>. '+ (!window.terra_stats_regTraffic ? 'Por favor, certifique-se que o template faz include do seguinte script: ' + scriptUrl : '» '+ e.message));
				}
			}
		},
	   reloadMetrics:function(){
			var requiredMetricsVariables = ['terra_info_service', 'terra_info_channel', 'terra_info_channeldetail', 'terra_info_type', 'terra_info_id', 'terra_stats_idCrtfc', 'terra_stats_uv_c'],
				notFoundValues = [];
				   
			if(window.uv_c) var terra_stats_uv_c = window.uv_c;

			if(window.tabSelected){
				switch(window.tabSelected) {
					case "itm-article":
						  terra_info_type = "NOT";
					break;
					case "itm-video":
						  terra_info_type = "VID";
					break;
					case "itm-info":
						  terra_info_type = "INF";
					break;
					default:
						  terra_info_type = "GAL";
				}
			} else { window.tabSelected = ''; }

			for(var i = 0, current; current = requiredMetricsVariables[i]; i++){
				if(window[current]) window[current] = window[current][window.tabSelected] || window[current];

				if(window.trrConstantData && trrConstantData.metrics && trrConstantData.metrics[current]) window[current] = trrConstantData.metrics[current];

				//alert(current + ' = ' + window[current]);
				if(!window[current]) {
					notFoundValues.push(current);
					requiredMetricsVariables.splice(i,1);
					i--;
				}
			}

			if(notFoundValues.length) modMan.log.warning('Não foi possível encontrar o valor para as seguintes variáveis de métricas: ' + notFoundValues.join(', '));
			terra_stats_regTraffic();
		},
		validateGalleryLink:function(evt,url,type){
			var stop = false;			
			var specialGallery = modMan.tools.getSpecialGalleryTypeByUrl(url);
			if(type) specialGallery = type;
			if(!specialGallery) return true;			
			
			if(specialGallery == "old") {
				modMan.tools.openPopup(url,"FeaturedPhoto",800,600,0);
				stop = true;
			} else if (specialGallery == "expandedPics") {
				modMan.tools.openPopup(url,'expandedPics',parseInt(window.screen.width - 10),parseInt(window.screen.height - 50),'no');
				stop = true;
			}
			
			if (stop){
				if (evt.preventDefault) evt.preventDefault();
				else evt.returnValue = false;
			}
			
		},
		photosSpecialHover:function(recipiente) {
			$(recipiente).find(".img-news").bind("mouseover", function(evt){
				
				if(evt.target.tagName == "LI") objTarget = $(evt.target);
				else if(evt.target.tagName == "A") objTarget = $(evt.target).parent();
				else if(evt.target.tagName == "IMG") objTarget = $(evt.target).parent().parent();
				
				objTarget.find('img').attr("title", objTarget.find('img').attr("title").split("<a")[0].replace(/<\/?[^>]+>/gi, ''));
				
				if (objTarget.find('.photo').length == 0) objTarget.find('.text').html('<em class="photo">Galeria de fotos:&nbsp;</em>'+objTarget.find('.text').html())
				
				$(recipiente).find(".especialHover").css("top", objTarget.position().top - 11);
				$(recipiente).find(".especialHover").css("left", objTarget.position().left - 11);
				$(recipiente).find(".especialHover").html( objTarget.html());
				
				$(recipiente).find(".especialHover").show();
			})

			$(recipiente).find(".especialHover").bind("mouseover", function(){
				$(recipiente).find(".especialHover").show();
			})


			$(recipiente).find(".especialHover").bind("mouseout", function(){
				$(recipiente).find(".especialHover").hide();
			})
		},
		photosLayer:function(recipient){
			
			$(".ctn-expanded-pics").bind("click",function(evt){ 
					
					if (evt.target.className != "seemore"){

						evt.preventDefault();
						
						var scrollPosition = window.pageYOffset || document.documentElement.scrollTop; 
						
						var tplBody = '<div id="layer"><!-- --></div>'
							+'<div id="picsCradle">'
							+'<span class=\"close\">X</span>'
							+'<span class=\"imagem\"><!-- #foto ampliada# --></span>'
							+'<span class=\"texto\"><p><!-- #texto# --></p><em><!-- #fonte# --></em></span>'
							+'<span id=\"tgm-adv-extendedPics\"><iframe scrolling="no" frameborder="0" src="http://stf.terra.com.br/portal/core/2/advertising.html?tag=br.carnaval.home&amp;area=top&amp;site=br.terra.carnaval&amp;zone=home"></iframe></span>'
							+'<span id=\"metrics\"></span>'
							+'</div>';
						
						$(recipient).html(tplBody);
						
						var maskHeight = $(document).height();
						var maskWidth = $(window).width();
						var evento = null;
						try{
							var stringMetricas = '<iframe height="0" width="0" style="position: absolute; left: -100px; top: -100px;" src="http://s2.trrsf.com.br/portal/core/2/_tpl/metrics.html?'+
							+'terra_info_service='+terra_info_service
							+'&amp;terra_info_channel='+ terra_info_channel
							+'&amp;terra_info_channeldetail='+ terra_info_channeldetail
							+'&amp;terra_info_type='+ terra_info_type
							+'&amp;terra_info_id='+ terra_info_id
							+'&amp;terra_stats_idCrtfc='+ terra_stats_idCrtfc
							+'&amp;terra_stats_uv_c='+ terra_stats_uv_c
							+'&amp;coutnry='+ modMan.globals.page.country+'" id="metricsLoaderFrame"></iframe>';
						} catch (e){}
						
						
						if (evt.target.tagName == "SPAN")evento = $(evt.target).parent();
						else if(evt.target.tagName == "A")evento = $(evt.target).parent();
						else if (evt.target.tagName == "IMG") evento = $(evt.target).parent().parent();
						

						
						if (scrollPosition < 200) scrollPosition = 200;

						$(recipient).find("#picsCradle").css("top",scrollPosition+"px");
						$(recipient).find("#picsCradle .imagem").html('<img  src="http://p2.trrsf.com.br/image/get?o=cf&w=917&src='+evento.find("a").attr("href")+'" />');
						$(recipient).find("#picsCradle .texto p").html(evento.find(".text").html());
						$(recipient).find("#picsCradle #metrics").html(stringMetricas);
						$(recipient).find("#picsCradle").css("left", maskWidth - (468 + maskWidth/2));
						$(recipient).css("width", maskWidth);
						$(recipient).css("height", maskHeight + 200);	

						$(recipient).show();
		
						$(recipient).bind("click",function(evt){ 
								$(recipient).hide();						
						})
					}
				}
			)
		
		},
		pubMan:new function(){
						
			var _SELF = this,
				ADS_CONTAINER_SELECTOR = '.trr-ctn-advertising:last',
				CURRENT_CONTAINER_SELECTOR = ADS_CONTAINER_SELECTOR + ' > div:last',
				AD_PLACEHOLDER_SELECTOR_PREFIX = "tgm-",
				AD_CONTAINER_SELECTOR_PREFIX = "ctn-tgm-",
				PROXY_TPL_PATH,
				
				autoDetectedTags = ['top', 'right', 'particles', 'apulse', 'textlinks'],
				
				$interface = {
					adsContainer:null,
					placeholders:{},
					containers:{},
					framedAds:{}
				},
				
				info = {
					exibitions:{},
					rejected:{}
				},
				
				documentDone = false;
				
			var createIframeHTML = function(currentTagId){
				
				if (!PROXY_TPL_PATH) {
					PROXY_TPL_PATH = _SELF.getProxyTemplatePath();
				}

				var placeholdersHeigth = $interface.placeholders[currentTagId].height(),
					placeholdersWidth = $interface.placeholders[currentTagId].width(),
					HTML = '<iframe height="'+placeholdersHeigth+'" width="'+placeholdersWidth+'" src="'+PROXY_TPL_PATH+'?tag='+(window.tgmKey || "br.test2010.home")+'&amp;area='+currentTagId+'&amp;site='+(window.site || "")+'&amp;zone='+(window.zone || "")+'" frameborder="0" scrolling="no" ><//iframe>';
				
				return HTML;
			}
			
			var placeAd = function(currentTagId){				
				var $container = $interface.containers[currentTagId],
					$placeholder = $interface.placeholders[currentTagId],
					scrollPosition = (navigator.userAgent.match(/ie/i)) ? (window.pageYOffset || document.documentElement.scrollTop) : 0,
					placeholderBorderLeftWidth = parseInt(($placeholder.css('borderLeftWidth')).replace(/[^\d]+/,'')) || 0,
					leftPosition = ($placeholder.offset().left + placeholderBorderLeftWidth) - $interface.adsContainer.offset().left ,
					topPosition = $placeholder.offset().top + scrollPosition;
					
				$container.attr("style","position:absolute; display:block; top:"+topPosition+"px; left:"+leftPosition+'px;');
				
				if(!info.exibitions[currentTagId]) info.exibitions[currentTagId] = 0;
				info.exibitions[currentTagId]++;
				
				return undefined;
			}
			
			// constructor »
				$(document).ready(function(){
					documentDone = true;
				});
			// constructor «
			
			this.getInfo = function(){
				return info;
			}
			
			this.load = function(currentTagId, extraInfo, tagId){
				tagId = tagId || currentTagId;
				
				if(tagId.match(/default/)) {
					tgm.ShowArea('default');
					return true;
				}
				
				if(!documentDone && !$interface.adsContainer){
					$interface.adsContainer = $(ADS_CONTAINER_SELECTOR);
					if(!$interface.adsContainer.length){
						$interface.adsContainer = null;
						log.critical('Erro ao localizar container reponssável por receber as tags de publicidade. O elemento deve casar com o seguinte seletor: <strong>'+ ADS_CONTAINER_SELECTOR + '</strong>.');
						return false;
					}
				}
				
				if($interface.placeholders[currentTagId]) return _SELF.reload([currentTagId]);
				
				$interface.placeholders[currentTagId] = $('#' + AD_PLACEHOLDER_SELECTOR_PREFIX + currentTagId);
				$interface.containers[currentTagId] = $(CURRENT_CONTAINER_SELECTOR);
				
				if(documentDone && $interface.placeholders[currentTagId].length){
					if($interface.framedAds[currentTagId]) return _SELF.reload([currentTagId]);
					else {
						var containerElement = document.createElement('div');
							containerElement.id = AD_CONTAINER_SELECTOR_PREFIX + currentTagId;
							containerElement.innerHTML = createIframeHTML(currentTagId);
						
						if(!$interface.adsContainer.length) {
							$('#trr-ctn-general').append('<div class="'+ADS_CONTAINER_SELECTOR.replace(/^\./,'')+'"></div>');
							$interface.adsContainer = $(ADS_CONTAINER_SELECTOR);
						}
						
						$interface.adsContainer.append(containerElement);
						$interface.containers[currentTagId] = $(containerElement);
						placeAd(currentTagId);
						
						if(!info.exibitions[currentTagId]) info.exibitions[currentTagId] = 0;
						info.exibitions[currentTagId]++;
						
						return;
					}
				}
				
				if(!$interface.placeholders[currentTagId].length || !$interface.containers[currentTagId].length) {
					var errrorMsg = ''+
					'Erro ao localizar container de origem ou destino para publicidade.\n'+
					'Seletor de origem (placeholder): <strong> '+ '#'+AD_PLACEHOLDER_SELECTOR_PREFIX + currentTagId + '</strong> (elemento '+($interface.placeholders[currentTagId].length ? 'encontrado' : '<strong style="color:red;">não encontrado</strong>')+')\n'+
					'Seletor de destino (tag container): '+CURRENT_CONTAINER_SELECTOR+' (elemento '+($interface.containers[currentTagId].length ? 'encontrado' : '<strong style="color:red;">não encontrado</strong>')+')';

				
					if(!info.rejected[currentTagId]) info.rejected[currentTagId] = errrorMsg;
					
					//log.warning(errrorMsg);
					return false;
				}
				
				if(extraInfo) tgm.ShowArea(tagId, extraInfo);
				else tgm.ShowArea(tagId, 'site='+(window.site || "br.teste"), 'zone='+(window.zone || "br.home"));
				
				placeAd(currentTagId);
				
				return true;
			}
			
			this.reload = function(tagIdsARRAY){
				tagIdsARRAY = tagIdsARRAY || autoDetectedTags;
				
				
				for(var i = 0, currentTagId; currentTagId = tagIdsARRAY[i]; i++){
					
					if(!$interface.placeholders[currentTagId]) {
						$interface.placeholders[currentTagId] = $('#'+ AD_PLACEHOLDER_SELECTOR_PREFIX + currentTagId);
						$interface.containers[currentTagId] = $('#'+ AD_CONTAINER_SELECTOR_PREFIX + currentTagId);
									
						if(!$interface.placeholders[currentTagId].length || !$interface.containers[currentTagId].length) {										
							if(!$interface.placeholders[currentTagId].length) delete $interface.placeholders[currentTagId];
							if(!$interface.containers[currentTagId].length) delete $interface.containers[currentTagId];
							
							if($interface.placeholders[currentTagId] && !$interface.containers[currentTagId]) {
								//log.warning('tag inválida: '+ currentTagId);
								delete $interface.placeholders[currentTagId];
								_SELF.load(currentTagId);
							} else {									
								var errrorMsg = 'Erro ao localizar placeholder para publicidade <strong>'+currentTagId+'</strong>.';								
								if(!info.rejected[currentTagId]) info.rejected[currentTagId] = errrorMsg;									
							}
							
							continue;
						}
					}
					
				
					if ($interface.framedAds[currentTagId]) $interface.framedAds[currentTagId].get(0).src += '';
					else {								
						$interface.containers[currentTagId].html(createIframeHTML(currentTagId));
						$interface.framedAds[currentTagId] = $interface.containers[currentTagId].find('iframe:first');
					}

					if(!info.exibitions[currentTagId]) info.exibitions[currentTagId] = 0;
					info.exibitions[currentTagId]++;
					
				}
				
				return undefined;
			}
			
			this.placeAds = function(tagIdsARRAY){
				tagIdsARRAY = tagIdsARRAY || autoDetectedTags;
				if(!$interface.adsContainer) $interface.adsContainer = $(ADS_CONTAINER_SELECTOR);
				
				for(var i = 0, currentTagId; currentTagId = tagIdsARRAY[i]; i++){
					var $placeholder = $('#'+AD_PLACEHOLDER_SELECTOR_PREFIX + currentTagId),
						$container = $('#'+AD_CONTAINER_SELECTOR_PREFIX + currentTagId);
						
					if(!$interface.placeholders[currentTagId] && !$placeholder.length) {
						var errrorMsg = ''+
						'Erro ao localizar container de origem ou destino para publicidade.\n'+
						'Seletor de origem (placeholder): <strong> '+ '#'+AD_PLACEHOLDER_SELECTOR_PREFIX + currentTagId + '</strong> (elemento '+($placeholder.length ? 'encontrado' : '<strong style="color:red;">não encontrado</strong>')+')\n'+
						'Seletor de destino (tag container): '+CURRENT_CONTAINER_SELECTOR+' (elemento '+($container.length ? 'encontrado' : '<strong style="color:red;">não encontrado</strong>')+')';
					
						if(!info.rejected[currentTagId]) info.rejected[currentTagId] = errrorMsg;
					
						continue;
					}
					
					if(!$interface.placeholders[currentTagId]) $interface.placeholders[currentTagId] = $placeholder;
					if(!$interface.containers[currentTagId]) $interface.containers[currentTagId] = $container;
					
					placeAd(currentTagId);	

					return undefined;
				}				
			
			}
			
			this.getProxyTemplatePath = function () {
				var currentProjectPath = '/core/_tpl/advertising.html',
					domainRelativePath = '/atm/' + globals.stage.coreVersion + currentProjectPath,
					dsvDomainRelativePath = location.pathname.match(new RegExp('.*\/' + globals.stage.coreVersion + '\/') || '/atm/' + globals.stage.coreVersion + '/') + currentProjectPath.replace(/^\//, ''),
					absolutePath = globals.stage.staticFilesHost + domainRelativePath.replace(/^\//, '');
				
				if (modMan.globals.stage.type == 'PRD' ) {
					
					if ((/(templates|dsk\d{5})\./).test(location.host)) {
						return absolutePath;
					} else {
						return '/globalSTATIC' + domainRelativePath;
					}
					
				} else {
					return dsvDomainRelativePath;
				}
				
				return absolutePath;
			};
		},
		getStructErrors:(function() {
			var ERROR_referenceType = 'TypeError encontrado na estrutura de um ou mais parâmetros transmitidos ao método "tools.getStructErrors"',
				ERROR_referenceStruct = 'TypeError encontrado na estrutura do objeto. Verifique se ele possui variáveis tipo Object associadas às propriedades "data" e "model" (a propriedade "help" é opcional).',
				ERROR_helpReferenceType = 'TypeError encontrado no tipo da propriedade "help" (transmitidas ao método "tools.getStructErrors"). Deve ser um objecto cujas propriedades representam dicas adicionais para validação dos parâmetros configurados em "model". Somente a mensagem padrão será apresentada em caso de erro.',
				
				NO_HELP_OBJECT = {},
				STR_array = 'array',
				STR_Array = 'Array',
				STR_Object = 'Object',
				STR_object = 'object',
				STR_undefined = 'undefined',
				STR_string = 'string',
				STR_String = 'String',
				STR_number = 'number',
				STR_boolean = 'boolean',
				STR_ERROR_MESSAGES_SPLITTER = '<br/><br/>\n\n',
				EXP_VALID_STRING_MODELS = /^string|boolean|object|array|number$/,
				EXP_REGEXP_MATCHING_TYPES = /string|number/,
				EXP_CAPITALIZE_SPLITTER = /^([a-zA-Z])([\w]*)/,
				EXP_NAME_SPLITTER = /function\s+([^\s\(]*)/,
				TPL_VALUE_MARK = '${value}',
				TPL_TYPE_MARK = '${type}',
				CURRENT_VALUE_MSG_TPL = " Valor atual: <strong>"+TPL_VALUE_MARK+" ["+TPL_TYPE_MARK+"]</strong>.",
				
				capitalizeString = function(str){
					var splittedString = str.match(EXP_CAPITALIZE_SPLITTER);
					return (splittedString[1].toUpperCase() + splittedString[2]);		
				},
				
				extractCapitalizedConstructorName = function(value) {
					if (value.toString) {
						value = value.toString();
					}
					var splittedString = EXP_NAME_SPLITTER.exec(value);
					return splittedString[1];
				},
				
				getTypeName = function(value){
					if(value === undefined) {
						return STR_undefined;
					} else if(value == Array || value == STR_array || value instanceof Array){
						return STR_Array;
					} else if(value == Object){
						return STR_Object;
					} else if (typeof value == STR_string) {
						return STR_String;
					} else if (value instanceof Function) {
						return extractCapitalizedConstructorName(value);
					} else {
						return capitalizeString(typeof value);
					}
				},
				
				printCurrentValueMsg = function(value){
					var type = getTypeName(value);
					return CURRENT_VALUE_MSG_TPL.replace(TPL_VALUE_MARK, value).replace(TPL_TYPE_MARK, type);
				};
			
			return function(ref){
			
				if(typeof(ref) != STR_object || ref.length) { return ERROR_referenceType; }
				
				if(typeof(ref.data) != STR_object || typeof(ref.model) != STR_object)  { return ERROR_referenceStruct; }
				
				if(typeof(ref.help) != STR_object || ref.length) {
					if(ref.help) {
						log.warning(ERROR_helpReferenceType);
					}
					ref.help = NO_HELP_OBJECT;
				}
				
				var errorMsg = "";
				for(var key in ref.model){
					var value = ref.data[key],
						model = ref.model[key],
						
						customError = '';
						
					if(errorMsg) {
						errorMsg += STR_ERROR_MESSAGES_SPLITTER;
					}
					
					// model errors
					if(model === undefined) {
						errorMsg += "O modelo exigido para propriedade "+key+" não foi declarado corretamente. Seu valor atual é 'undefined'.";
						continue;
					}
					
					if(typeof model == STR_string && !EXP_VALID_STRING_MODELS.test(model)) {
						errorMsg += "O modelo exigido para propriedade "+key+" precisa casar com a expressão "+EXP_VALID_STRING_MODELS+" ou ser declarado como uma referênica ao construtor correspondente.";
						continue;
					}
					
					// asserts
					if(typeof model == STR_string) {
						if(model == STR_array) {
							if (value instanceof Array) {
								continue;
							}
						} if(model == STR_object) {
							if (!(value instanceof Array)) {
								continue;
							}
						} else if(model == typeof value) {
							continue;
						}
					} else if (model instanceof Function) {
						 
						if(model === Array){				
							if(value instanceof Array) { // array também pode ser instância de Object
								continue;
							}
						} else if (model === Object) {
							if(!(value instanceof Array)) {
								continue;
							}
						} else if (model === Number) { // numbers are not instances of Number
							if(typeof value == STR_number) {
								continue;
							}
						} else if (model === String) { // strings are not instances of String
							if(typeof value == STR_string) {
								continue;
							}
						} else if (model === Boolean) { // booleans are not instances of Boolean
							if(typeof value == STR_boolean) {
								continue;
							}
						} else if (value instanceof model) {
							continue;
						}
						
					} else if(model instanceof RegExp) {
						if(EXP_REGEXP_MATCHING_TYPES.test(typeof(value)) && model.test(value)) {
							continue;
						} else {
							customError += "O valor de <strong>" + key + "</strong> deve ser do tipo <em>String</em> ou <em>Number</em> e casar com a seguinte expressão: <strong>"+ref.model[key]+"</strong>. ";
						}
					}
					
					if(customError) {
						errorMsg += customError;
					} else {
						errorMsg += "O valor da propriedade <strong>"+key+"</strong> deve ser do tipo <em>"+getTypeName(model)+"</em>.";
					}
					
					// append current value and hint
					errorMsg += printCurrentValueMsg(value);
					if(ref.help[key]) {
						errorMsg += '<br/><strong>DICA: </strong>'+ref.help[key];
					}
				}
				
				if(errorMsg){
					//throw new Error('[TypeError] - '+errorMsg);
					return errorMsg;
				}
				
				return null;
			};
		}()),
		LazyLoader:function LazyLoader(){
			// toSingleton
			 if(!modMan.tools.LazyLoader.prototype._instance) {
				 if(this instanceof modMan.tools.LazyLoader) modMan.tools.LazyLoader.prototype._instance = this;
				 else return modMan.tools.LazyLoader.prototype._instance = new modMan.tools.LazyLoader();
			 } else return modMan.tools.LazyLoader.prototype._instance;
			 modMan.tools.LazyLoader.constructor = null;
			
			
			// LazyLoader constructor >> 
				var log = new Log.CONSTRUCTOR('LazyLoader'),
					$window = $(window),
					activeStack = [],
					vpH = function () {
						var height = window.innerHeight; // Safari, Opera
						var mode = document.compatMode;

						if ( (mode || !$.support.boxModel) ) { // IE, Gecko
							height = (mode == 'CSS1Compat') ?
							document.documentElement.clientHeight : // Standards
							document.body.clientHeight; // Quirks
						}

						return height;
					}(),

					isVisible = function($element, callback){
						var scrolltop = (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop),
							top = $element.offset().top,
							height = $element.height();

						if (scrolltop > (top + height) || scrolltop + vpH < top) {
							return false;
						} else if (scrolltop <= (top + height)) {
							return true;
						}
						return false;
					},
					
					checkStack = function(){
						if(activeStack.length){
							for(var i = 0, current; current = activeStack[i]; i++){
								if(isVisible(current.element)) {
									log.checkpoint('Disparando callback para o seletor <strong>'+ current.selector + ' (index #: ' + (current.index) + ')</strong>.');
									current.callback(current.element, true);
									
									activeStack.splice(i,1);
									i--;
								}
							}
						}
						
						if(!activeStack.length) $window.unbind('scroll');
					};

				$(document).ready(function(){
					checkStack();
					
					$window.bind('scroll', function(){
						checkStack();			
					});
				});
				
			// LazyLoader constructor <<
			
			this.set = function(selector, customCallback){
				var $element = $(selector);
				
				if ($element.length){
					
					$element.each(function (i) {
				
						activeStack.push({
							selector : selector.selector,
							index : i,
							element : $(this),
							callback : customCallback
						});
						
					});
					
					checkStack();
				}
			};

		},
		Cron:function Cron(secondsInterval){
			if(this == window) return new Cron(secondsInterval);

			var interval = typeof(secondsInterval) == 'number' ? secondsInterval * 1000 : 0,
				jobs = [],
				timer = null;
				
			var triggerJobs = function(){
				for(var i = 0, currentJob; currentJob = jobs[i]; i++){
					currentJob();
				}
			}
			
			this.setJob = function(jobFUNCTION) {
				if(typeof(jobFUNCTION) != 'function') return new Error('O método só recebe funcões como primeiro e único parâmetro.');
				
				jobs.push(jobFUNCTION);
				
				return this;
			}
			
			this.changeInterval = function(secondsInterval){
				if(typeof(secondsInterval) != 'number') return new Error('O método changeInterval deve receber uma variável tipo Number que represente o tempo desejado, em segundos.');
				
				return this;
			}
			
			this.start = function(){
				if(!interval || !jobs.length) return new Error('É preciso definir intervalo e funções para este objeto.');
				
				timer = window.setInterval(triggerJobs, interval);
				
				return this;
			}
			
			this.stop = function(){
				timer = window.clearInterval(timer);
				
				return this;
			}
		},
		jsonP:function(configsOBJ){
			var callback = configsOBJ.callback;
			if(!callback) {
				log.critical("É preciso indicar um método (callback) para tratar o arquivo:\n" + url );
				return false;
			}
			var wrapperName = configsOBJ.wrapperName || "jsonp";

			var url = configsOBJ.url;
			
			var extraParams = configsOBJ.extraParams || false;

			// Json in body
			if(window[wrapperName] && !configsOBJ.reuse) {
				log.checkpoint(wrapperName + " - Recuperando json do corpo da página.");
				configsOBJ.callback(window[wrapperName], extraParams);
				return true;
			}

			if (configsOBJ.cache === false) {
				var cache = new Date().getTime();
				url +=  (url.indexOf('?') != -1) ? "&" : "?";
				url += "cache=" + cache;
			}

			if(!window[wrapperName]) {
				window[wrapperName] = function(jsonOBJ){
					if (typeof(jsonOBJ) != 'object') {
						log.critical("Erro no parse do arquivo:\n" + url);
						return false;
					}
					//log.checkpoint('disparando resposta para ' + wrapperName)
					configsOBJ.callback(jsonOBJ, extraParams);

					// Reuse
					if(configsOBJ.reuse) {
						window["reuse-"+wrapperName] = jsonOBJ;
					}
				};
			} else if (configsOBJ.reuse) {
				var timeReuse = setInterval(function() {
					if (window["reuse-"+wrapperName]) {
						configsOBJ.callback(window["reuse-"+wrapperName], extraParams);
						clearInterval(timeReuse);
					}
				}, 1000);
			}

			if (!window["reuse-"+wrapperName]) {
				var objHead = document.getElementsByTagName("head")[0];
				var objScript = document.createElement("script");
				objScript.type = "text/javascript";
				objScript.src = url;
				objScript.charset ="utf-8";
				objHead.appendChild(objScript);

				objScript.onload = objScript.onreadystatechange = function(){
					if(objScript.readyState) {
						if (objScript.readyState == 'complete') objHead.removeChild(objScript);
					} else objHead.removeChild(objScript);
				}
			}
		},
		Components:function(callback){
			
			var loaded = {} // Stores references to already loaded files
			
			var matchLibrary = function(ext, url){
				if (!loaded[ext]) return false;
				else {
					for(var i = 0; i < loaded[ext].length; i++){
						if(loaded[ext][i] == url) return true;
					}					
				}
				return false;
			}
			
			var set =function(componentsOBJ, callback){
				if(typeof(componentsOBJ) != 'object' || (!componentsOBJ['js'] && !componentsOBJ['css'])) {
					if(callback) callback();
					return false;
				}
				var componentsARRAY = [];
				if(componentsOBJ['css']) componentsARRAY = componentsARRAY.concat(componentsOBJ['css']);				
				if(componentsOBJ['js']) componentsARRAY = componentsARRAY.concat(componentsOBJ['js']);
			
				if(!componentsARRAY.length) callback();
				else {
					log.checkpoint('checking components: \n' + componentsARRAY.join('\n'));
					$.include(componentsARRAY, callback);
				}
			}
			
			var confirm = function(ext, url){
				if(!loaded[ext]) loaded[ext] = [];
				loaded[ext].push(url);
			}
			
			return {
				matchLibrary:matchLibrary,
				set:set,
				confirm:confirm
			}
		}(),
		parseTPL:function (variablesOBJ, templateSTR){
			if(!variablesOBJ || !templateSTR) return templateSTR;
			
			var tagPrefix = "({|##)",
				tagSufix = "(}|##)",
				placeholderEXP = new RegExp('{\s?foreach([^{]|{[^\/])+{\/foreach}'+'|'+tagPrefix + '[\\w\\d._[\\]\'\"-]+' + tagSufix, 'gi'),
				tags = templateSTR.match(placeholderEXP);
			
			if(!tags) return templateSTR;
			
			while(tags.length){
				var currentTag = tags.shift(),
					levelsSTR = (currentTag.match(/foreach/gi)) ? currentTag.match(/from=[^}]+/)[0].replace(/from=/, '') : currentTag.replace(/\[['"]?/,'.').replace(/['"]?\]/,''),
					tagMarkersEXP = new RegExp('^' + tagPrefix + '|' + tagSufix + '$', 'gi'),
					levels = levelsSTR.replace(tagMarkersEXP,'').split('.'),
					dataOBJ = variablesOBJ;
					
				while(levels.length){
					var currentLevel = levels.shift(),
						currentData = dataOBJ[currentLevel];

					if(currentData === null) currentData = '';
					if(typeof(currentData) != 'undefined' && !levels.length) {
						if(currentTag.match(/foreach/gi) && typeof(currentData) == 'object') {
							var loopItem = currentTag.replace(/^{foreach[^}]+}|{\/foreach}$/gi,''),
								tmpData = '';

							for(var key in currentData){
								tmpData += loopItem.replace(/{value/gi,'{'+currentLevel+'["'+key+'"]').replace(/{key}/,key);
							}
							tags=tags.concat(tmpData.match(/{[^}]+}/g));
							currentData = tmpData;
						} 
						templateSTR = templateSTR.replace(currentTag, currentData);
					}
					else if(currentData) dataOBJ = currentData;
					else break;
				}
			}			

			return templateSTR;
		},		
		encodeURIComponent: function(str) {
			return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');
		},
		base64:new function(){				
			var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

			this.encode = function(input) {
				if(input){
					var output = "";
					var chr1, chr2, chr3;
					var enc1, enc2, enc3, enc4;
					var i = 0;

					do {
						chr1 = input.charCodeAt(i++);
						chr2 = input.charCodeAt(i++);
						chr3 = input.charCodeAt(i++);

						enc1 = chr1 >> 2;
						enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
						enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
						enc4 = chr3 & 63;

						if (isNaN(chr2)) {
							enc3 = enc4 = 64;
						} else if (isNaN(chr3)) {
							enc4 = 64;
						}

						output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + 
						keyStr.charAt(enc3) + keyStr.charAt(enc4);
					} while (i < input.length);	
					
					return output;
				}
			}

			this.decode = function(input) {
			   var output = "";
			   var chr1, chr2, chr3;
			   var enc1, enc2, enc3, enc4;
			   var i = 0;

			   // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
			   input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			   do {
				  enc1 = keyStr.indexOf(input.charAt(i++));
				  enc2 = keyStr.indexOf(input.charAt(i++));
				  enc3 = keyStr.indexOf(input.charAt(i++));
				  enc4 = keyStr.indexOf(input.charAt(i++));

				  chr1 = (enc1 << 2) | (enc2 >> 4);
				  chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				  chr3 = ((enc3 & 3) << 6) | enc4;

				  output = output + String.fromCharCode(chr1);

				  if (enc3 != 64) {
					 output = output + String.fromCharCode(chr2);
				  }
				  if (enc4 != 64) {
					 output = output + String.fromCharCode(chr3);
				  }
			   } while (i < input.length);

			   return output;
			}
		},
		adjustTime:function(dateOBJ){
			var time = dateOBJ.toLocaleTimeString();
			
			//var hours = time.split(':')[0];
			var hours = dateOBJ.getHours();
			//var minutes = time.split(':')[1];
			var minutes = dateOBJ.getMinutes();
			
			var usa = (modMan.globals.page.country == 'US') ? true : false;
			var sufix = false;
			var sep = "h";
			
			if(modMan.globals.page.country != 'BR') sep = ":";
			if (usa){
				if(hours>12) {
					hours = hours - 12;
					sufix = "pm";
				} else {
					sufix = "am";
				}
			}
			if(hours<10) hours = '0' + hours.toString().match(/\d$/);
			if(minutes<10) minutes = '0'+minutes.toString().match(/\d$/);
			
			var parsedTime = hours + sep + minutes;
			if(sufix) parsedTime += sufix;
			
			return parsedTime;
		},
		/*
		 * PARAMETERS
		 * - url (URL of the popup)
		 * - name (Name of the popup)
		 * - w (Width)
		 * - h (Height)
		 * - scrolling (no = 0 / yes = 1)
		 */
		openPopup:function(url,name,w,h,scrolling) {
			var leftPosition = (screen.width) ? (screen.width-w)/2 : 0;
			var topPosition = (screen.height) ? (screen.height-h)/2 : 0;
			var settings = "toolbar=no,location=no,directories=no,status=no,menubar=no,height="+h+",width="+w+",top="+topPosition+",left="+leftPosition+",scrollbars="+scrolling+",resizable=0";
			return window.open(url,name,settings);
		},
		isNewGalleryUrl:function(url){ // deprecated
			if(globals.page.country == 'BR' && (/\/galeria(s)?\//).test(url)) return false;		
			return true;
		},
		getSpecialGalleryTypeByUrl:function(){
			var CONS;
			
			return function(url){
				if(!url.match) throw new Error('O método "getGalleryTypeByUrl" deve receber uma url no formato String');
				
				if(!CONS) {
					CONS = {
						oldGalleryMatchEXP:/\/galeria(s)?\//i,
						oldGalleryId:'old',
						expandedPicsMatchEXP:/TGAP/i,
						expandedPicsId:'expandedPics'
					};
				}
				
				if(globals.page.country == 'BR' && CONS.oldGalleryMatchEXP.test(url)) { return CONS.oldGalleryId;}
			
				if(CONS.expandedPicsMatchEXP.test(url)) { return CONS.expandedPicsId;}
				
				return null;
			}
		}(),
		cookie:{
			create:function(name,value,hours, path) {
				if (hours) {
					var date = new Date();
					date.setTime(date.getTime()+(hours*60*60*1000));
					var expires = "; expires="+date.toGMTString();
				}
				else var expires = "";
				document.cookie = name+"="+value+expires+"; path="+(path||'/');
				
				return undefined;
			},
			read:function(name){
				var nameEQ = name + "=";
				var ca = document.cookie.split(';');
				for(var i=0, c; c = ca[i];i++) {
					while (c.charAt(0)==' ') c = c.substring(1,c.length);
					if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
				}
				return null;
			},
			erase:function(name){
				this.create(name,"",-1);					
				//return undefined;
			}
		},
		getQueryStringVars: (function (locationSTR) {
			var CONSTANTS;

			return function (locationSTR) {
				if (arguments.length && locationSTR !== document.location && typeof(locationSTR) != "string") {
					throw new Error("O método 'getQueryStringVars()' deve receber uma string que represente a url. Valor atual: " + locationSTR + "(" + typeof(locationSTR) + "). Caso queria extrair variáveis da página em execução, omita esse parâmetro. ");
				}

				if (!arguments.length) {
					locationSTR = location.href;
				}

				if (!CONSTANTS) {
					CONSTANTS = {
						queryStringEXP: /\?([^#]+)/,
						paramSplitter: "&",
						paramSplitterExtended: "&amp;",
						valueSplitter: '=',
						defaultValue: ''
					};
				}

				var queryString = CONSTANTS.queryStringEXP.exec(locationSTR);
				if (!queryString || !queryString[1]) {
					return null; 
				}

				var variables = queryString[1].replace(CONSTANTS.paramSplitterExtended, CONSTANTS.paramSplitter).split(CONSTANTS.paramSplitter),
					valuesOBJ = {};
				
				while (variables.length) {
					var values = variables.shift().split(CONSTANTS.valueSplitter),
						finalValue = values[1] || CONSTANTS.defaultValue;
						
					try {
						valuesOBJ[values[0]] = decodeURIComponent(finalValue);
					}
					catch (e) {
						valuesOBJ[values[0]] = unescape(finalValue);
					}
				}

				return valuesOBJ;
			};
		}()),
		pageReloader:new function(){
			var timer = null,
				cookieName = 'trrScrollPosition',
				previousReloadInterval = 0;
			
			var reloadAction = function(){
				var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
				
				tools.cookie.create(cookieName, scrollPosition);
				document.location += '';				
			}
			
			this.on = function(secondsNumber){
				secondsNumber = secondsNumber || previousReloadInterval;
				
				if(!secondsNumber) return false;
				
				if( (/voidRefresh/i).test(document.location)) {
					log.checkpoint('Auto-refresh configurado para acontecer em ' + secondsNumber + ' segundos, mas IMPEDIDO pelo parâmetro "voidRefresh" contido na url.');
					return false;
				}				
				
				previousReloadInterval = secondsNumber;				
				
				var currentCookie = tools.cookie.read(cookieName);					
				if(currentCookie) {
					window.scrollTo(0, currentCookie);
					tools.cookie.erase(cookieName)
				}
				
				log.checkpoint('Auto-refresh configurado para acontecer em ' + secondsNumber + ' segundos.');
				timer = setInterval(function(){reloadAction()}, secondsNumber * 1000);
			}			
			
			this.off = function(){
				log.checkpoint('Auto-refresh interrmpido.');
				if(timer) clearInterval(timer), timer = null;
			}
		}
	};
	
	// forgiving old popup method references
	window.abre = function (url,janela,larg,alt,scroll){
		if (!scroll) { scroll='auto' }
		window.open(url,janela,"toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars="+scroll+",resizable=no,copyhistory=no,width="+larg+",height="+alt);
	}
	
	window.validateGalleryLink = tools.validateGalleryLink;
	
	var events = {
		beforeStart:function(){
			// prepare debugging mode >>
			if(globals.stage.debugging){
				document.onkeyup = function(evt){
					var e = window.event || evt,
						keyunicode= e.charCode || e.keyCode;

					var container = $('#mod-console'),
						cookieName = 'console',
						pwd ="dDNyckA=";
						
					if(keyunicode == 113) { // F2
						if(container.length) return container.toggle('normal');
						
						var savedPass = tools.cookie.read(cookieName);
							inputPass =  savedPass || tools.base64.encode(prompt("Por favor, digite a senha."));
						
						if(inputPass && inputPass == pwd){
							tools.cookie.create('console', pwd, 1); // renew current cookie
							
							var container = document.createElement('hr');
							container.id = "consoleContainer";
							document.body.appendChild(container);
							
							load.modules([
								{
									id:"modConsole",
									selector:"#consoleContainer",
									loadSkin:true
								}
							]);
						}
					}
					
					if(container.length && keyunicode == 9) { // tab
						globals.data.instances.modConsole[0].togglePosition();
					}
				}
			}

		}(),
		load:null,
		afterEnd:null	
	}
	
	var help = function(){
		if (!log.console.active) tools.console();
		var publicMethods = [];
		for(method in tools){
			if(method != 'help') publicMethods.push(method);
		}
		var msg = ""+
		"Total de métodos transversais: " + (publicMethods.length)+".\n"+
		"São eles: " + publicMethods.join(', ') + ".";
		log.help(msg);
	}
	
	var observer = {
		list:{}, // stores cross-component methods
		set:function(name, method){
			if(!this.list[name]) this.list[name] = [];
			
			this.list[name].push(method);
		},
		play:function(name){
			if (this.list[name]) {
				for(var no = 0; no < this.list[name].length; no++){
					this.list[name][no].call();
				}
			} else log.warning(LNG.couldntFondMethodsFor + ' "' + name + '"');
		}
	}
	
	return {
		globals:globals,
		require:require,
		start:start,
		load:load.modules,
		log:log,
		tools:tools,
		help:help
	}
}(jQuery);

} catch (errorOBJ){
	var msg = ""+
		"Um erro foi encontrado no código da classe 'ModMan'. Detalhes: \n"+
		'['+errorOBJ.name+'] -> '+errorOBJ.message + "\n" +
		"Arquivo: " + errorOBJ.fileName +'\n'+
		"Linha: " + errorOBJ.lineNumber;
	
	if(window.console) console.log(msg);
	else throw new Error(msg);
}
