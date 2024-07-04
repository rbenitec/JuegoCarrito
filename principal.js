var juego = new Phaser.Game(290, 540, Phaser.CANVAS, 'bloque_juego');

juego.state.add('Juego', Juego);
juego.state.add('Terminado', Terminado);
juego.state.add('NivelDos', NivelDos);
juego.state.add('NivelTres', NivelTres);
juego.state.add('Portada', Portada);
juego.state.add('Ganaste', Ganaste);
juego.state.start('Portada');