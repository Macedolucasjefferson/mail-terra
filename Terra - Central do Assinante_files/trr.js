var stMenu = false;

function login_efeito(){
	$(".div-login").animate({top: 36}, 100);
}

function efeito(q){
	$(q).animate({opacity: 0, left: 0}, 300);
}

function banner1() { 
	$(".bg").delay(400).fadeIn(1000);
	
	$(".trr-bn-titulo").delay(500).animate({
			opacity: 1,
			left: 25
		}, 
		500, 
		function() {}
	);
	
	$(".trr-links-opc").show();
	
	$(".opc1").delay(1000).animate({opacity: 1, top: 96, left: 20}, 400);

	$(".opc2").delay(1100).animate({opacity: 1, top: 155, left: 20}, 400);

	$(".opc3").delay(1200).animate({opacity: 1, top: 215, left: 20}, 400);

	$(".opc4").delay(1300).animate({opacity: 1, top: 275, left: 20}, 400);
	
	//setTimeout("rodar_o_banner(1);",5000);
}

function banner1_out() {
	
	$(".trr-bn-titulo").css({ opacity: 0 });
	$(".opc1").css({ opacity: 0 });
	$(".opc2").css({ opacity: 0 });
	$(".opc3").css({ opacity: 0 });
	$(".opc4").css({ opacity: 0 });
	
	$(".trr-links-opc").hide();
	
	$(".bg").fadeOut(400);
}

function banner2() {
	$(".bg2").delay(400).fadeIn(1000);
	$(".bg2-link").show();
}

function banner2_out() {
	$(".bg2").fadeOut(400);
	$(".bg2-link").hide();
}

var last_banner	= 1;
/*var banner_list = ["1","2","3"];*/
var banner_list = ["1","2"];
var jump_next	= false;
function rodar_o_banner(banner_n) {
	
	if(banner_n === false) {
		
		if(jump_next == true) {
			jump_next = false;
			return;
		}
		
		jump_next 		= false;
		var banner_n 	= parseInt(last_banner)+1;
		banner_n	 	= banner_n == banner_list.length ? 0 : banner_n;
	}
	else
		jump_next = true;
	
	eval("banner"+banner_list[last_banner]+"_out()");
	eval("banner"+banner_list[banner_n]+"();");
	
	last_banner = banner_n;
	
	$(".banner-counter-container").contents().remove();
	for(var i=0;i<banner_list.length;i++) {
		var banner_counter = $("<DIV>").addClass("banner-counter").html((i+1));
		banner_counter.prop("i",i);
		banner_counter.click(function(){
			rodar_o_banner($(this).prop("i"));
		});
		
		if(i == banner_n)
			banner_counter.addClass("banner-counter-active");
		
		$(".banner-counter-container").append(banner_counter);
	}
}

$(document).ready( function(){

	$(".div-login").delay(500).animate({
	top: 33
	}, 200, function() { login_efeito()
	});

	/*
	$(".all div, .navLink5, .navLink1").hover( function(){
		setTimeout("testeMenu(stMenu)",130);
	})
	
	$(".liMenu1").mouseenter( function(){
		$(".liMenu1 .ulsubMenu").show(130);
		setTimeout("$('.liMenu2 .ulsubMenu, .liMenu3 .ulsubMenu').hide()",130);
		stMenu = true;
	}).mouseleave(function(){
		$(".ulsubMenu").hide();
		stMenu = false;
	});
	
	$(".liMenu2").mouseenter( function(){
		$(".liMenu2 .ulsubMenu").show(130);
		setTimeout("$('.liMenu1 .ulsubMenu, .liMenu3 .ulsubMenu').hide()",130);
		stMenu = true;
	}).mouseleave(function(){
		$(".ulsubMenu").hide();
		stMenu = false;
	});
	
	$(".liMenu3").mouseenter( function(){
		$(".liMenu3 .ulsubMenu").show(130);
		setTimeout("$('.liMenu2 .ulsubMenu, .liMenu1 .ulsubMenu').hide()",130);
		stMenu = true;
	}).mouseleave(function(){
		$(".ulsubMenu").hide();
		stMenu = false;
	});

	*/
	
});


/* Google Analytics */
function gaPageTracker(url)
{
	var pageTracker = _gat._getTracker("UA-7830443-1");
	pageTracker._trackPageview(url);
}

/* Contato - Telefone capa logada */
function fecharFone(){
	document.getElementById('popup').style.display = 'none';
}

function abrirFone(){
	document.getElementById('popup').style.display = 'block';
}


/* Meus servicos */
function collapse_servicos(){
$(".box").collapse({show: function(){
		this.animate({
			height: 'toggle'
		}, 200);
	},
	hide : function() {
		
		this.animate({
			height: 'toggle'
		}, 200);
	}
});
}

/* temp */

function testeMenu(q){
	if(q != true){
		$('.ulsubMenu').hide();
	}
}