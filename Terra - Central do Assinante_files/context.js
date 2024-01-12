/* 20130125-1037 */

var moreTerra =  true,
	idCountry = 1,
	itemMenu = "";

	
function getPath() {
	var regex = new RegExp(/(http|https):\/\/[^\/]*/);
	var results = regex.exec( window.location.href );
	
	return results[0];
}

function gup(name) {
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec( window.location.href );
	if(results == null)
		return "";
	else
		return results[1];
}





idCountry = gup("id") == "" ? 1 : gup("id");
moreTerra = gup("moreTerra") == "false" ? false : true;
itemMenu = gup("itemMenu") == "" ? "" : gup("itemMenu");
formatType = gup("format") == "" ? "superslim" : gup("format");
tgmKey = gup("tgmKey");

var jsonPath = (getPath().match("stf") || getPath().match("https"))? getPath() + "/navbar/js/json_" + idCountry + ".js" : "http://s1.trrsf.com.br/navbar/js/json_" + idCountry + ".js";
//if (idCountry != 1) jsonPath = "http://s1.trrsf.com/navbar/js/json_" + idCountry + ".js"

var country  = new Array();

country[1]  = new Array("BR","br");
country[21] = new Array("AR","es");
country[22] = new Array("PE","es");
country[24] = new Array("CO","es");
country[25] = new Array("CL","es");
country[26] = new Array("EC","es");
country[27] = new Array("VE","es");
country[28] = new Array("MX","es");
country[30] = new Array("US","en");
country[31] = new Array("US","es");
country[101] = new Array("ES","es");

modMan.start({
	configs:{
		baseURL: (getPath().match("stf") || getPath().match("https"))? getPath() + "/atm/2/core/" : null,
		pageLang:country[idCountry][1], // o valor "auto" também pode ser utilizado
		pageCountry:country[idCountry][0],
		lazyLoad:false,
		transitionEffects:false
	},
	modules:[
		{
			id:"modHeaderFooter",
			selector:"#mod-header",
			loadSkin:true,
			preLoadDependencies:true,
			params:{
				request_url: jsonPath,
				idItemMenu:itemMenu, // "home", " ", "id"
				format:formatType, //"superslim", "slim", "full"
				noLayers:true,
				moreTerra:moreTerra
			}
		}
	]
});