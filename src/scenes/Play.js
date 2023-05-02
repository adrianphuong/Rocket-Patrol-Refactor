// Display the time remaining (in seconds) on the screen (10)
// Create a new title screen (e.g., new artwork, typography, layout) (10)
// Implement a new timing/scoring mechanism that adds time to the clock for successful hits (15)
// Implement the speed increase that happens after 30 seconds in the original game (5)
// Added parallax scrolling to the menu screen (10)
// Added new spaceship sprites that move faster and worth more points (15)
// space music (5)
// new background (5)
// is firing with movement (5)
// random explosion SFX
// Curr total: 90/100
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
// preload method: called once per scene before the create() method.
// Preload assets, such as images and audio, that will be used in the scene.
preload() {
    // load images and spritesheets
    this.load.audio('music', 'assets/spacemusic.mp3');
    this.load.image('rocket', './assets/rocket.png');
    this.load.image('spaceship', './assets/spaceship.png');
    this.load.image('fastspaceship', `./assets/spaceship.gif`);
    this.load.image('stars', './assets/stars.png');
    this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
}

// create method: called once per scene after the preload() method.
// Create game objects and initialize the scene.
create() {
    // set up the background
    this.stars = this.add.tileSprite(0, 0, 640, 480, 'stars').setOrigin(0, 0);
    // create borders
    this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
    this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
    this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
    this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
    this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

    // create game objects
    this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
    this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
    this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
    this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'fastspaceship', 0, 10).setOrigin(0,0);

    // set up keyboard input
    keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    // create explosion animation
    this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', { 
            start: 0, 
            end: 9, 
            first: 0
        }),
        frameRate: 30
    });

    // create a text object to display the remaining time
    let timeConfig = {
        fontFamily: 'Courier',
        fontSize: '28px',
        backgroundColor: '#F3B141',
        color: '#843605',
        align: 'right',
        padding: {
        top: 5,
        bottom: 5,
        },
        fixedWidth: 0
    };
    this.timeLeft = this.add.text(game.config.width - borderUISize - borderPadding, borderUISize + borderPadding*2, '', timeConfig).setOrigin(1, 0);
    
    // set fast space ship speed
    this.ship03.moveSpeed += 1;
    // start the game timer
    this.initialTime = game.settings.gameTimer / 1000; // convert milliseconds to seconds
    this.timeElapsed = 0;
    this.gameTimer = this.time.addEvent({
        delay: 1000, // 1 second
        callback: function() {
        this.timeElapsed++;
        let timeRemaining = this.initialTime - this.timeElapsed;
        if (timeRemaining <= 0) {
            timeRemaining = 0;
            this.gameTimer.remove(false);
        }
        this.timeLeft.text = 'Time: ' + timeRemaining;
        },
        callbackScope: this,
        loop: true
    });
    // add the music to the scene
    let music = this.sound.add('music');
    // play the music in a loop
    music.play({ loop: true });

    // set up score tracking
    this.p1Score = 0;
    let scoreConfig = {
        fontFamily: 'Courier',
        fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.gameOver = false;
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
    // check if 30 seconds have passed
    if (this.initialTime - this.timeElapsed == 30) {
        // increase the speed of the spaceships
        this.ship01.moveSpeed += .05;
        this.ship02.moveSpeed += .05;
        this.ship03.moveSpeed += .05;
    }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        this.stars.tilePositionX -= 4;
        if(!this.gameOver) {
            this.p1Rocket.update();
             this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        if(ship == this.ship03) { // if fast ship
            this.p1Score += 40;
        }
        else{
            this.p1Score += ship.points;
        }
        this.scoreLeft.text = this.p1Score;
    
        // Add extra time for each destroyed ship
        this.initialTime += 3; // Add 3 seconds to the initial time
        this.timeLeft.text = 'Time: ' + (this.initialTime - this.timeElapsed); // Update the time left text
        var rand = Phaser.Math.Between(1, 4);
        if(rand == 1) {
            this.sound.play('sfx_explosion1');
        }
        else if (rand == 2) {
            this.sound.play('sfx_explosion2');
        }
        else if (rand == 3) {
            this.sound.play('sfx_explosion3');
        }
        else {
            this.sound.play('sfx_explosion4');
        }
    }
}