class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion1', './assets/explosion38.wav');
        this.load.audio('sfx_explosion2', './assets/explosion1.mp3');
        this.load.audio('sfx_explosion3', './assets/explosion2.mp3');
        this.load.audio('sfx_explosion4', './assets/explosion3.mp3');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.image('starfield', './assets/starfield.png');
    }

    create() {
    // set background image
    this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
    // add title text
    let titleConfig = {
      fontFamily: 'Montserrat',
      fontSize: '72px',
      color: '#FFFFFF',
      align: 'center',
    };
    this.add.text(game.config.width/2, game.config.height/2 - 150, 'ROCKET PATROL', titleConfig).setOrigin(0.5);

    // add subtitle text
    let subtitleConfig = {
      fontFamily: 'Montserrat',
      fontSize: '36px',
      color: '#FFFFFF',
      align: 'center',
    };
    this.add.text(game.config.width/2, game.config.height/2 - 50, 'DEFEND YOUR CITY', subtitleConfig).setOrigin(0.5);

    // add instructions text
    let instructionsConfig = {
      fontFamily: 'Montserrat',
      fontSize: '24px',
      color: '#FFFFFF',
      align: 'center',
    };
    this.add.text(game.config.width/2, game.config.height/2 + 75, 'Use ←→ arrows to move & (F) to fire', instructionsConfig).setOrigin(0.5);

    // add difficulty selection text
    let difficultyConfig = {
      fontFamily: 'Montserrat',
      fontSize: '24px',
      color: '#FFFFFF',
      align: 'center',
    };
    this.add.text(game.config.width/2, game.config.height/2 + 150, 'Press ← for Novice or → for Expert', difficultyConfig).setOrigin(0.5);

    // set up input keys
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
  }

  update() {
    this.starfield.tilePositionX -= 4;
    // handle input key presses
    if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
      this.starfield.alpha = 1;
      game.settings = {
        spaceshipSpeed: 3,
        gameTimer: 60000    
      }
      this.sound.play('sfx_select');
      this.scene.start("playScene");
    }
    if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
      game.settings = {
        spaceshipSpeed: 4,
        gameTimer: 45000    
      }
      this.sound.play('sfx_select');
      this.scene.start("playScene");   
    }
  }
}