var fondo;
var carro;
var cursores;
var enemigos;
var timer;
var gasolina;
var timerGasolina;
var score = 0;
var scoreText;
var lives = 3;
var livesText;
var music;
var collisionSound;

var Juego = {
    preload: function(){
        juego.load.image('bg', 'img/pistav3.png');
        juego.load.image('carro', 'img/carroCeleste.png');
        juego.load.image('carroMalo', 'img/CarroEnemigoNaranja.png');
        juego.load.image('gasolina', 'img/gas.png');
        juego.load.audio('collisionSound', 'audio/collision.mp3');
        juego.load.audio('gasSound', 'audio/gas.mp3');
        juego.forceSingleUpdate = true;
    },

    create: function(){
        fondo = juego.add.tileSprite(0, 0, 290, 540, 'bg');

        carro = juego.add.sprite(juego.width/2, 496, 'carro');
        carro.anchor.setTo(0.5);
        juego.physics.arcade.enable(carro);

        timer = juego.time.events.loop(1500, this.crearCarroMalo, this);
        timerGasolina = juego.time.events.loop(2000, this.crearGasolina, this);

        cursores = juego.input.keyboard.createCursorKeys();

        enemigos = juego.add.group();
        juego.physics.arcade.enable(enemigos, true);
        enemigos.enableBody = true;
        enemigos.createMultiple(20, 'carroMalo');
        enemigos.setAll('anchor.x', 0.5);
        enemigos.setAll('anchor.y', 0.5);
        enemigos.setAll('outOfBoundsKill', true);
        enemigos.setAll('checkWorldBounds', true);

        gasolinas = juego.add.group();
        juego.physics.arcade.enable(gasolinas, true);
        gasolinas.enableBody = true;
        gasolinas.createMultiple(20, 'gasolina');
        gasolinas.setAll('anchor.x', 0.5);
        gasolinas.setAll('anchor.y', 0.5);
        gasolinas.setAll('outOfBoundsKill', true);
        gasolinas.setAll('checkWorldBounds', true);

        scoreText = juego.add.text(juego.width / 2, 16, 'Score: 0', { fontSize: '24px', fill: '#ff0000' });
        scoreText.anchor.setTo(0.5, 0); 

        livesText = juego.add.text(juego.width / 2, 40, 'Lives: 3', { fontSize: '24px', fill: '#ff0000' });
        livesText.anchor.setTo(0.5, 0); 
        
        collisionSound = juego.add.audio('collisionSound');
        gasSound = juego.add.audio('gasSound');
    },

    update: function(){
        fondo.tilePosition.y +=3;

        if(cursores.right.isDown && carro.position.x<245){
            carro.position.x +=5;
        }
        else if (cursores.left.isDown && carro.position.x>45){
            carro.position.x -=5;
        }

        juego.physics.arcade.overlap(carro, enemigos, this.hitEnemy, null, this);
        juego.physics.arcade.overlap(carro, gasolinas, this.collectGas, null, this);
    },

    crearCarroMalo: function(){
        var posicion = Math.floor(Math.random()*3)+1;
        var enemigo = enemigos.getFirstDead();
        enemigo.physicsBodyType = Phaser.Physics.ARCADE;
        enemigo.reset(posicion*73, 0);
        enemigo.body.velocity.y = 200;
        enemigo.anchor.setTo(0.5);
    },

    crearGasolina: function() {
        var posicion = Math.floor(Math.random()*3)+1;
        var gasolina = gasolinas.getFirstDead();
        gasolina.physicsBodyType = Phaser.Physics.ARCADE;
        gasolina.reset(posicion*73, 0);
        gasolina.body.velocity.y = 200;
        gasolina.anchor.setTo(0.5);
    },

    hitEnemy: function(carro, enemigo) {
        collisionSound.play();
        enemigo.kill();
        lives -= 1;
        livesText.text = 'Lives: ' + lives;

        if (lives <= 0) {
            juego.state.start('Terminado');
        }
    },

    collectGas: function(carro, gasolina) {
        gasSound.play();
        gasolina.kill();
        score += 1;
        scoreText.text = 'Score: ' + score;

        if (score >= 20) {
            juego.state.start('Ganaste');
        } else if (score >= 3 && juego.state.current === 'Juego') {
            juego.state.start('NivelDos');
        } else if (score >= 6 && juego.state.current === 'NivelDos') {
            juego.state.start('NivelTres');
        }
    }
}

var Terminado = {
    create: function() {
        var mensaje = "Ha perdido, ¿desea reiniciar?";
        var restart = confirm(mensaje);
        if (restart) {
            lives = 3;
            score = 0;
            juego.state.start('Juego');
        } else {
            juego.paused = true;
        }
    }
};

var NivelDos = {
    preload: function() {
        juego.load.image('bg', 'img/pistav3.png'); 
    },
    create: function() {
        fondo = juego.add.tileSprite(0, 0, 290, 540, 'bg');
        carro = juego.add.sprite(juego.width/2, 496, 'carro');
        carro.anchor.setTo(0.5);
        juego.physics.arcade.enable(carro);

        timer = juego.time.events.loop(1500, this.crearCarroMalo, this);
        timerGasolina = juego.time.events.loop(2000, this.crearGasolina, this);

        cursores = juego.input.keyboard.createCursorKeys();

        enemigos = juego.add.group();
        juego.physics.arcade.enable(enemigos, true);
        enemigos.enableBody = true;
        enemigos.createMultiple(20, 'carroMalo');
        enemigos.setAll('anchor.x', 0.5);
        enemigos.setAll('anchor.y', 0.5);
        enemigos.setAll('outOfBoundsKill', true);
        enemigos.setAll('checkWorldBounds', true);
        enemigos.setAll('body.velocity.y', 300); // Incrementar la velocidad de los enemigos

        gasolinas = juego.add.group();
        juego.physics.arcade.enable(gasolinas, true);
        gasolinas.enableBody = true;
        gasolinas.createMultiple(20, 'gasolina');
        gasolinas.setAll('anchor.x', 0.5);
        gasolinas.setAll('anchor.y', 0.5);
        gasolinas.setAll('outOfBoundsKill', true);
        gasolinas.setAll('checkWorldBounds', true);

        scoreText = juego.add.text(juego.width / 2, 16, 'Score: ' + score, { fontSize: '24px', fill: '#ff0000' });
        scoreText.anchor.setTo(0.5, 0); 

        livesText = juego.add.text(juego.width / 2, 40, 'Lives: ' + lives, { fontSize: '24px', fill: '#ff0000' });
        livesText.anchor.setTo(0.5, 0); 

        music = juego.add.audio('backgroundMusic');
        music.loop = true;
        music.play();

        collisionSound = juego.add.audio('collisionSound');
    },
    update: Juego.update,
    crearCarroMalo: Juego.crearCarroMalo,
    crearGasolina: Juego.crearGasolina,
    hitEnemy: Juego.hitEnemy,
    collectGas: Juego.collectGas
};

var NivelTres = {
    preload: function() {
        juego.load.image('bg', 'img/pistav3.png');
    },
    create: function() {
        fondo = juego.add.tileSprite(0, 0, 290, 540, 'bg');
        carro = juego.add.sprite(juego.width/2, 496, 'carro');
        carro.anchor.setTo(0.5);
        juego.physics.arcade.enable(carro);

        timer = juego.time.events.loop(1500, this.crearCarroMalo, this);
        timerGasolina = juego.time.events.loop(2000, this.crearGasolina, this);

        cursores = juego.input.keyboard.createCursorKeys();

        enemigos = juego.add.group();
        juego.physics.arcade.enable(enemigos, true);
        enemigos.enableBody = true;
        enemigos.createMultiple(20, 'carroMalo');
        enemigos.setAll('anchor.x', 0.5);
        enemigos.setAll('anchor.y', 0.5);
        enemigos.setAll('outOfBoundsKill', true);
        enemigos.setAll('checkWorldBounds', true);
        enemigos.setAll('body.velocity.y', 400);

        gasolinas = juego.add.group();
        juego.physics.arcade.enable(gasolinas, true);
        gasolinas.enableBody = true;
        gasolinas.createMultiple(20, 'gasolina');
        gasolinas.setAll('anchor.x', 0.5);
        gasolinas.setAll('anchor.y', 0.5);
        gasolinas.setAll('outOfBoundsKill', true);
        gasolinas.setAll('checkWorldBounds', true);

        scoreText = juego.add.text(juego.width / 2, 16, 'Score: ' + score, { fontSize: '24px', fill: '#ff0000' });
        scoreText.anchor.setTo(0.5, 0); 

        livesText = juego.add.text(juego.width / 2, 40, 'Lives: ' + lives, { fontSize: '24px', fill: '#ff0000' });
        livesText.anchor.setTo(0.5, 0); 

        music = juego.add.audio('backgroundMusic');
        music.loop = true;
        music.play();

        collisionSound = juego.add.audio('collisionSound');
    },
    update: Juego.update,
    crearCarroMalo: Juego.crearCarroMalo,
    crearGasolina: Juego.crearGasolina,
    hitEnemy: Juego.hitEnemy,
    collectGas: Juego.collectGas
};

var Portada = {
    create: function() {
        var title = juego.add.text(juego.world.centerX, juego.world.centerY, 'Roberto \n Junior \n Benitez \n Cruzado \n U17305100', { fontSize: '24px', fill: '#CC6CE7', align: 'center' });
        title.anchor.setTo(0.5);

        var startText = juego.add.text(juego.world.centerX, juego.world.centerY + 250, 
            'Haz CLICK para COMENZAR', 
            { fontSize: '12px', fill: '#fff', align: 'center' });
        startText.anchor.setTo(0.5);

        juego.input.onDown.addOnce(this.startGame, this);
    },
    startGame: function() {
        juego.state.start('Juego');
    }
};

var Ganaste = {
    preload: function() {
        juego.load.image('win', 'audio/win.mp3');
    },
    create: function() {
        var endText = juego.add.text(juego.world.centerX, juego.world.centerY, '¡GANASTE!', { fontSize: '32px', fill: '#fff', align: 'center' });
        endText.anchor.setTo(0.5);

        juego.input.onDown.addOnce(this.restartGame, this);
    },
    restartGame: function() {
        lives = 3;
        score = 0;
        juego.state.start('Portada');
    }
};