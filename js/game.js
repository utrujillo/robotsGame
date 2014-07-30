(function( $ ){

	//======================================
    //			Variables
    //======================================
    var o = {

    	// Iniciar Juego
    	btnIniciar 		: $( '#iniciarJuego' ),
    	iniciaJuego		: false,

		// robot
		stage			: $( 'section' ),
		robotPosicion	: 50,
		robot 			: $( '#robot' ),
		
		// Disparos
		aciertos		: 0,
		insertaAciertos	: $( '#noAciertos' ),
		activaDisparo	: true, // Si el usuario puede o no disparar nuevamente
		nuevoDisparo	: 2000, // Cada cuando podra disparar nuevamente 1000 = 1 seg
		numeroDisparo	: 0, 	//La cantidad de disparos que ha realizado el jugador
		insertaDisparo	: $( '#noDisparos' ),
		//Velocidad en que el disparo llegara a su objetivo
		disparoLento	: 2400,	
		disparoMedio	: 1200,
		disparoRapido	: 600,

		// evilMinion
		evilMinion 		: $( '#evilMinion' ),
		evilPosicion	: 0,
		desplazamiento	: [ 'linear', 'swing', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeOutCubic', 'easeInCubic', 'easeInOutCubic', 'easeInExpo', 'easeOutExpo', 'easeInOutExpo' ],
		velocidadMinion : [ 600, 1200, 1800, 2400 ],

		// Cronometro
		detener 		: 1,
		segundos 		: 60, // 60 segundos = 1 minuto

		// Resultado
		resultado		: $( '#resultados' ),
		reiniciarJuego	: $( '#reiniciarJuego' )
		
	}

	//======================================
    //			Metodos
    //======================================
	var methods = {
	    // Funcion para escoger un elemento aleatorio
	    rangoRandom		: function( min, max ){ return Math.floor(Math.random() * (max - min + 1)) + min; },
	    // Mueve el robot hacia arriba
	    moverArriba 	: function(){

	    	// Verificamos que el robot no pase el limite
	    	if( o.robotPosicion > 50 ){
	    		// Obtenemos la posicion del robot
	    		o.robotPosicion = o.robot.position().top - 100;
	    		// Movemos el robot hacia arriba
	    		o.robot.css( 'top', o.robotPosicion );
	    	}

	    },
	    // Mueve el robot hacia abajo
	    moverAbajo 		: function(){

	    	// Verificamos que el robot no pase el limite
	    	if( o.robotPosicion < 450 ){
	    		// Obtenemos la posicion del robot
	    		o.robotPosicion = o.robot.position().top + 100;
	    		// Movemos el robot hacia abajo
	    		o.robot.css( 'top', o.robotPosicion );
	    	}

	    },
	    // Cuando el usuario deja presionada la barra espaciadora
	    cargarBarra		: function(){
	    	o.robot.css( 'background', 'url(images/spriteRobot.png) -120px 0px no-repeat' );
	    },
	    // Al desactivar el robot, este no puede disparar hasta que pasen los segundos indicados en nuevoDisparo
	    desactivaRobot	: function(){
	    	o.robot.css( 'background', 'url(images/spriteRobot.png) -360px 0px no-repeat' );
	    	o.activaDisparo = false;
	    	setTimeout(function() {
	    		methods.activaRobot();
	    	}, o.nuevoDisparo);
	    	
	    },
	    // Activamos el robot para que pueda volver a disparar
	    activaRobot		: function(){
	    	
	    	o.robot.css( 'background', 'url(images/spriteRobot.png) 0px 0px no-repeat' );
	    	o.activaDisparo = true;
	    	
	    },
	    // Lanzamos el disparo
	    dispara 		: function(){
	    	
	    	// Calculando la posicion del disparo
	    	disparoPosicion = o.robotPosicion + 12;
	    	
	    	// Creando nuevo elemento de disparo
	    	var agregaDisparo = $( '<span id="shot'+ o.numeroDisparo +'" class="shot"></span>' );
	    	agregaDisparo.css({
	    		background: 'url(images/spriteShoot.png) left center no-repeat',
				top: disparoPosicion
	    	});

	    	// Insertando disparo al juego
	    	o.stage.append( agregaDisparo );

			$( '#shot' + o.numeroDisparo ).animate( { left: '1025px'}, {
				duration: o.disparoMedio,
				step: function(){
					
					if( ( $( this ).position().left >= 800 ) && ( $( this ).position().left <= 900 ) ){

						switch( $( this ).position().top ){
							// Procesando colision en el punto 1
							case 62: {
								if( ( o.evilMinion.position().top >= 50 ) && ( o.evilMinion.position().top < 130 ) ){
									methods.realizaExplosion( $( this ), 1 );
								}
							} break;
							// Procesando colision en el punto 2
							case 162: {
								if( ( o.evilMinion.position().top  >= 150 ) && ( o.evilMinion.position().top < 230 ) ){
									methods.realizaExplosion( $( this ), 2 );
								}
							} break;
							// Procesando colision en el punto 3
							case 262: {
								if( ( o.evilMinion.position().top  >= 250 ) && ( o.evilMinion.position().top < 330 ) ){
									methods.realizaExplosion( $( this ), 3 );
								}
							} break;
							// Procesando colision en el punto 4
							case 362: {
								if( ( o.evilMinion.position().top  >= 350 ) && ( o.evilMinion.position().top < 430 ) ){
									methods.realizaExplosion( $( this ), 4 );
								}
							} break;
							// Procesando colision en el punto 5
							case 462: {
								if( ( o.evilMinion.position().top  >= 450 ) && ( o.evilMinion.position().top < 530 ) ){
									methods.realizaExplosion( $( this ), 5 );
								}
							} break;

						}
					}

				},
				complete: function(){
					$( this ).remove();
				}
			});

	    	// Incrementamos el numero de disparo para saber que elemento borraremos
	    	o.numeroDisparo++;
	    	

	    },
	    realizaExplosion 		: function ( idShot, idPosicion ){
	    	
	    	o.aciertos++;
	    	
	    	o.evilMinion.css( 'background', 'none' );
			$( '#explosion'+ idPosicion ).css( 'display', 'block' );
			idShot.stop();
			idShot.remove();

			// Restaurando borrando explosion, restaurando Minion
			setTimeout(function() {
				o.evilMinion.css( 'background', 'url(images/evilMinion.png) center center no-repeat;' );
				$( '#explosion'+ idPosicion ).css( 'display', 'none' );
			}, 1000);

	    },
	    bajandoEvilMinion 		: function(){

	    	var item = methods.rangoRandom( 0, 10 ),
	    		itemMinion = methods.rangoRandom( 0, 4 );

			o.evilMinion.animate( { top: '450px' }, {
			    easing: o.desplazamiento[ item ],
			    duration: o.velocidadMinion[ itemMinion ],
			    complete: function(){
			    	methods.subiendoEvilMinion();
			    }
			});

	    },
	    subiendoEvilMinion 		: function(){
			
			var item = methods.rangoRandom( 0, 10 ),
				itemMinion = methods.rangoRandom( 0, 4 );
			o.evilMinion.animate( { top: '50px' }, {
			    easing: o.desplazamiento[ item ],
			    duration: o.velocidadMinion[ itemMinion ],
			    complete: function(){
			    	methods.bajandoEvilMinion();
			    }
			});

	    },
	    timer		: function(){

			d = new Date(o.segundos * 1000);
			var hora = Math.floor( o.segundos/3600);
			var hora = (hora < 10) ? "0" + hora:hora;
			var minuto = (d.getMinutes() < 10) ? "0" + d.getMinutes():d.getMinutes();
			var segundo = (d.getSeconds() < 10) ? "0" + d.getSeconds():d.getSeconds();
			$("#crono").text( minuto+":"+segundo );

			if( o.detener == 0)
			{
				o.segundos = o.segundos - 1;
				if( o.segundos < 0){
					methods.endGame( );
				}else{
					setTimeout(function() {
						methods.timer();
					}, 1000);
				}
			}

		},
		endGame		: function(){
			o.insertaAciertos.html( o.aciertos );
			o.insertaDisparo.html( o.numeroDisparo );
			
			o.resultado.fadeIn( 'slow' );
			o.reiniciarJuego.fadeIn( 'slow' );
			o.iniciaJuego = false;
			o.evilMinion.stop();
		}

	};
	
	// Codigo ASCII de las teclas
	// 38 tecla arriba
	// 40 tecla abajo
	// 32 barra espaciadora
	// 13 enter

	//Identificando tecla presionada
	function callkeydownhandler( evt ) {
		var ev 	= (evt) ? evt : event;
		var code = (ev.which) ? ev.which : event.keyCode;
		
		if( o.iniciaJuego ){

			switch( code ){
				case 38: { methods.moverArriba(); } break;
				case 40: { methods.moverAbajo(); } break;
				case 32: { 
					// Solo si podemos disparar realizamos la siguiente accion
					if( o.activaDisparo ){
						methods.cargarBarra(); 
					}
				} break;
			}

		}
	   
	}

	// Identificando cuando la tecla es levantada
	function callkeyuphandler( evt ){
		
		// Verificamos si podemos realizar el disparo
		if( o.activaDisparo && o.iniciaJuego ){

			var ev 	= (evt) ? evt : event;
			var code = (ev.which) ? ev.which : event.keyCode;

			switch( code ){
		   		case 32: { 
		   			methods.dispara(); 
		   			methods.desactivaRobot(); 
		   		} break;
			}

		}
	}
	
	// Escuchando tecla presionada
	if (window.document.addEventListener) {
		window.document.addEventListener( "keydown", callkeydownhandler, false );
		window.document.addEventListener( "keyup", callkeyuphandler, false );
	} else {
	   	window.document.attachEvent( "onkeydown" , callkeydownhandler);
	   	window.document.attachEvent( "onkeyup", callkeyuphandler );
	}


	o.btnIniciar.click(function(){
		$( this ).fadeOut( 'slow' );
		o.iniciaJuego = true;
		methods.bajandoEvilMinion();
		o.detener = 0; methods.timer();
	});

	o.reiniciarJuego.click( function(){
		window.location.reload();
	});


})( jQuery );