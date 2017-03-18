console.log 

var game = new Phaser.Game(800, 600, Phaser.AUTO);
var potion1;
var blocko;
var inventory;

var GameState = {
	preload: function(){
		// this.load.image('background', 'assets/images.jpg');
		game.load.image('blocko1', 'assets/Blocko-Test2.png');
		game.load.image('potion1', 'assets/potion.jpg');
		game.load.image('fire1', 'assets/fire1.jpg');
		game.load.image('inventory','assets/Inventory.png');
	},
	create: function(){

		// this.background = this.game.add.sprite(0, 0, 'background');
		// this.background.scale.setTo(2);
		game.stage.backgroundColor = "#CC0000";
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 100;


		blocko = game.add.sprite(300, 400, 'blocko1');
		// blocko.width = game.world.width / 2;
		// blocko.height = game.world.height / 2;

		potion1 = game.add.sprite(375, 10, 'potion1');
		potion1.width = 50;
		potion1.height = 50;

		game.physics.enable([potion1, blocko], Phaser.Physics.ARCADE);
		
		potion1.body.allowGravity = false;
		blocko.body.allowGravity = false;

		potion1.inputEnabled = true;
	    potion1.events.onInputDown.add(potionfall, this);
	    potion1.body.collideWorldBounds = true;

	    blocko.body.collideWorldBounds = true;
	    blocko.body.immovable = true;

	    inventory = game.add.sprite(200, 20, 'inventory');
	    inventory.sendToBack();


	},
	update: function(){
		game.physics.arcade.collide(blocko, potion1, collisionHandler, null, this);
	},


};

function collisionHandler (obj1, obj2) {
   obj2.loadTexture('fire1', 0);
}

function potionfall () {
	potion1.body.allowGravity = true;

}
game.state.add('GameState', GameState);
game.state.start('GameState');