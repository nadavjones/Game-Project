

var blocko;
var boah;
var h20;
var nho;
var nak;
var cola;
var cl;
var inventory;
var isFirst = true;
var pot1;
var pot2;
var potions;
var reactions = new Map();
var timeoutID;
var start;

var SplashScreen = {
	preload: function(){
		game.load.image('start', "assets/start.png");
	},
	create: function(){
		start = game.add.sprite(0,0, 'start');
		start.inputEnabled = true;
		start.events.onInputDown.add(goToGameState, this);
	}
}

var GameState = {
	preload: function(){
		game.load.image('background', 'assets/Background.png');
		game.load.image('inventory','assets/Inventory.png');
		game.load.atlasJSONHash('blocko','assets/blocko.png','assets/blocko-sheet.json');
		game.load.atlas('potions','assets/potions.png', 'assets/potions.json');
	},
	create: function(){

		game.background = game.add.sprite(0, 0, 'background');
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 0;

		blocko = game.add.sprite(430, 340, 'blocko', '01.png');
		blocko.scale.setTo(2, 2);

		blocko.animations.add('chlorine-cola', [1,2,3,4,5,6,7,8,9,10, 0], 2, false);
		blocko.animations.add('endothermic', [11,12,13,14,15,16,17,18,19, 0], 1, false);
		blocko.animations.add('spark', [20, 21, 22, 23, 24, 25, 26, 27, 0], 2, false);
		blocko.animations.add('break', [30, 31, 32, 0], 2, false);
		blocko.animations.add('loser', [28, 29, 0], 1, false);

		inventory = game.add.sprite(200, 20, 'inventory');
	    inventory.moveDown();

	    var style = { font: "12px Arial", align: "center" };

		var baoh_label = game.add.text(273, 143, "BaoH\nBarium Hydroxide", style);
		var nak_label = game.add.text(590, 143, "NaK\nSodium-potassium", style);
		var nho_label = game.add.text(750, 145, "NHO\nAmmonium Nitrate", style);
		var h2o_label = game.add.text(453, 143, "H2O\nWater", style);
		var cola_label = game.add.text(947, 150, "Cola", style);
		var cl_label = game.add.text(1102, 145, "Cl\nChlorine", style);

		createPotions();

		game.physics.enable(blocko, Phaser.Physics.ARCADE);

		blocko.body.allowGravity = false;
	    blocko.body.collideWorldBounds = true;
	    blocko.body.immovable = true;
	    blocko.body.setSize(100, 100, 100, 100);

	    reactions.set([h2o, nak], "spark");
	    reactions.set([baoh, nho], "endothermic");
	    reactions.set([cola, cl], "chlorine-cola");

	},
	update: function(){
		game.physics.arcade.collide(blocko, potions, collisionHandler, null, this);
	}
};

function createPotions () {
	baoh = game.add.sprite(240, 30, 'potions', 'BaOH.png');
	h2o = game.add.sprite(400, 35, 'potions', 'H2O.png');
	nak = game.add.sprite(560, 30, 'potions', 'NaK.png');
	nho = game.add.sprite(720, 35, 'potions', 'NHO.png');
	cola = game.add.sprite(880, 35, 'potions', 'cola_00.png');
	cl = game.add.sprite(1040, 45, 'potions', 'Cl.png');

	potions = [baoh, nho, h2o, nak, cola, cl];

	for (var x in potions) {
		var pot = potions[x];
		game.physics.enable(pot, Phaser.Physics.ARCADE);
		pot.body.allowGravity = false;
		pot.inputEnabled = true;
		pot.events.onInputDown.add(potionfall, this);
		pot.body.collideWorldBounds = true;
		pot.scale.setTo(0.5, 0.5);
	}
}

function collisionHandler (obj1, obj2) {
   
   removeFromPotions(obj2);

   if (isFirst === true) {
		isFirst = false;
		obj2.destroy();
		blocko.animations.play('break');
   } else {
   		var keys = reactions.keys();
   		for (var key of keys) {
   			if (key.includes(pot1) && key.includes(pot2)) {
   				var animationName = reactions.get(key);
   				obj2.destroy();
   				blocko.animations.play(animationName);
   				isFirst = true;
   				if (potions.length === 0) {
   					timeoutID = game.time.events.add(8000, gameReset, this);
   				}
   				return;
   			}
   		}

   		obj2.destroy();
   		blocko.animations.play('loser');
   		game.state.restart();
   		isFirst = true;
   		return;

   }

}

function goToGameState (){
	game.state.start('GameState');
}

function gameReset () {
	game.state.restart();
}

function potionfall (pot) {

	game.physics.arcade.accelerateToXY(pot, 750, 640, 300);

	if (isFirst === true) {
		console.log(pot);
		pot1 = pot;
	} else {
		pot2 = pot;
	}
}

function removeFromPotions (pot) {
	potions = potions.filter(function(item) {
		return item !== pot;
	})
}

var game = new Phaser.Game(1500, 1000, Phaser.AUTO);
game.state.add('GameState', GameState);
game.state.add('SplashScreen', SplashScreen);
game.state.start('SplashScreen');