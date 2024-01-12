var menu_lock = false;

function abre(url,nome,prop){
	window.open(url,nome,prop);
}

function expandeMenu(id, altura){
	var obj = document.getElementById(id);

	if(obj.style.display == "none"){
		obj.style.display = "block";
	}
	else{
		obj.style.display = "none";
	}

	/*if(!menu_lock){
		var obj_tw;

		if(parseInt(obj.style.height) > 0){
			obj_tw = new Tween(obj.style, "height", Tween.elasticEaseIn, altura, 0, 0.8, "px");
			obj_tw.onMotionFinished = function(){
				menu_lock = !menu_lock;
				obj.style.display = "none";
			}
		}
		else{
			obj.style.display = "block";
			obj_tw = new Tween(obj.style, "height", Tween.elasticEaseOut, 0, altura, 0.8, "px");
			obj_tw.onMotionFinished = function(){
				menu_lock = !menu_lock;
			}
		}

		menu_lock = !menu_lock;
		obj_tw.start();
	}*/
}

function expandeForma(id, altura){
	var obj = document.getElementById(id);

	if(!menu_lock){
		var obj_tw;

		if(parseInt(obj.style.height) > 0){
			obj_tw = new Tween(obj.style, "height", Tween.elasticEaseIn, altura, 0, 0.8, "px");
			obj_tw.onMotionFinished = function(){
				menu_lock = !menu_lock;
				obj.style.display = "none";
			}
		}
		else{
			obj.style.display = "block";
			obj_tw = new Tween(obj.style, "height", Tween.elasticEaseOut, 0, altura, 0.8, "px");
			obj_tw.onMotionFinished = function(){
				menu_lock = !menu_lock;
			}
		}

		menu_lock = !menu_lock;
		obj_tw.start();
	}
}

function doPost(idTitulo) {
	document.titulos._idTitulo.value = idTitulo;
	document.titulos.submit();
	return true;
}


/* -- Funcoes do opt-in sms -- */
var optIn = {
	optInId:"_optInSMS",
	dddCelId:"_celddd",
	numCelId:"_celfone",
	wrapper:"opt-in_wrapper",
	test:function() {
    	var chOptIn = document.getElementById(optIn.optInId);
    	var dddCel = document.getElementById(optIn.dddCelId);
    	var numCel = document.getElementById(optIn.numCelId);
    	var wrapper = document.getElementById(optIn.wrapper);
    	if(dddCel.value == "" || numCel.value == "") {
			wrapper.style.display = "none";
			chOptIn.checked = false;
    		chOptIn.disabled = true;
		} else {
            wrapper.style.display = "block";
			chOptIn.disabled = false;
		}
	}
}
/* -- Fim das funcoes do opt-in sms -- */

/**
 *
 * @access public
 * @return void
 **/
function formatData(data){
	//var tmp = data.split(" ");
	//data = tmp[0];
	return data.split(" ",1);
}

function getId(id){ return document.getElementById(id) }
var contractMessage = {
  id:'contractNum_message',
	show:function(){
  	getId(this.id).style.display = 'block';
  	return false;
	},
	hide:function(){
  	getId(this.id).style.display = 'none';
  	return false;
	}
}