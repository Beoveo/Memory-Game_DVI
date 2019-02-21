/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};
/**
 * Constructora de MemoryGame
 */
MemoryGame = function (gs) {

	var msg; //Mensaje que irá cambiando según las acciones
	var fin; 	//Entero que nos indica si ya ha finalizado el juego (conseguir las 8 parejas)
	var inter; 	//Valor que devuelve setInterval para resetear el intervalo
	var hasClicked = false;		//Para ignorar otros eventos de ratón mientras da la vuelta a las cartas

	this.tipos = ["potato", "8-ball", "dinosaur", "kronos", "rocket", "unicorn",
		"guy", "zeppelin", "potato", "8-ball", "dinosaur", "kronos", "rocket", "unicorn", "guy", "zeppelin"];

	this.pareja = [-1, -1]; //Array que guarda las dos cartas seleccionadas.

	this.maze = new Array(16);
	this.initGame = function () {
		msg = "Memory Game";
		gs.drawMessage(msg);

		fin = 0;
		this.tipos = this.tipos.sort(function () { return Math.random() - 0.5 }); //Crea las cartas y las desordena

		for (var i = 0; i < 16; i++) {
			this.maze[i] = new MemoryGameCard(this.tipos[i]);
			gs.draw("back", i); //Inicialmente todas las cartas estan dadas la vuelta
		}

		this.loop(); //Comienza el bucle
	}

	this.draw = function () {

		if (fin == 8) {
			msg = "You win!!";
			clearInterval(inter);

			gs.drawMessage(msg);


			//Espera 2 segundos y reinicia la partida
			var a = this;
			setTimeout(function () { a.initGame(); }, 2000);

		}

		gs.drawMessage(msg);

		for (var i = 0; i < 16; i++) {
			this.maze[i].draw(gs, this.tipos[i]);
		}
	}

	this.loop = function () {
		var a = this;
		inter = setInterval(function () { a.draw(); }, 16);
	}



	this.onClick = function (cardId) {

		if (!hasClicked) {//Mientras no esté dando la vuelta a las cartas
			if (fin != 8) { //Si no ha finalizado el juego
				if (!this.maze[cardId].isMatch()) {//Si la carta clicada no estaba ya encontrada

					if (this.pareja[0] == -1 && this.pareja[1] == -1) {//Si no hay ninguna seleccionada, selecciona una
						msg = "Memory Game";
						this.maze[cardId].flip();
						this.maze[cardId].draw(gs, cardId);
						this.pareja[0] = cardId;

					} else {//Si hay una carta, leemos la otra.

						if (this.pareja[0] != cardId) {
							this.maze[cardId].flip();
							this.maze[cardId].draw(gs, cardId);
							this.pareja[1] = cardId;

							if (this.maze[this.pareja[0]].compareTo(this.tipos[cardId])) {
								msg = "It´s a match!!";
								//Marcamos
								this.maze[this.pareja[0]].found();
								this.maze[this.pareja[1]].found();

								this.pareja[0] = -1;
								this.pareja[1] = -1;

								fin++;

							} else {
								msg = "Try again";
								this.maze[this.pareja[0]].flip();
								this.maze[this.pareja[1]].flip();

								var a = this;
								hasClicked = true;
								setTimeout(function () { a.putBack(); }, 1000);
							}
						}

					}
				}

			}
		}

		this.putBack = function () {

			this.maze[this.pareja[0]].draw(gs, this.pareja[0]);
			this.maze[this.pareja[1]].draw(gs, this.pareja[1]);
			//Resetea 
			this.pareja[0] = -1;
			this.pareja[1] = -1;

			hasClicked = false; //Reseteamos la variable para que coja los clicks
		}
	}
};



/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function (id) {
	var abajo = true; //Booleano que nos dice si la carta está boca abajo. (back)
	var encontrado = false;//Si se encuentran las dos cartas.

	this.isMatch = function () {
		return encontrado;
	}

	this.flip = function () {
		if (abajo)
			abajo = false;
		else
			abajo = true;
	}

	this.found = function () {
		encontrado = true;
	}

	this.compareTo = function (otherCard) {
		return (id === otherCard);
	}


	this.draw = function (gs, pos) {
		if (!encontrado) {
			if (!abajo) //Si anteriormente estaba boca abajo, despues de flip esta boca arriba
				gs.draw(id, pos);
			else
				gs.draw("back", pos);//Si esta de cara, le damos la vuelta
		}
	}

};
