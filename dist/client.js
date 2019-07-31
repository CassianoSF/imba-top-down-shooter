/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {



var Imba = {VERSION: '1.4.4'};



Imba.setTimeout = function (delay,block){
	return setTimeout(function() {
		block();
		return Imba.commit();
	},delay);
};



Imba.setInterval = function (interval,block){
	return setInterval(function() {
		block();
		return Imba.commit();
	},interval);
};



Imba.clearInterval = function (id){
	return clearInterval(id);
};



Imba.clearTimeout = function (id){
	return clearTimeout(id);
};


Imba.subclass = function (obj,sup){
	for (let k in sup){
		let v;
		v = sup[k];if (sup.hasOwnProperty(k)) { obj[k] = v };
	};
	
	obj.prototype = Object.create(sup.prototype);
	obj.__super__ = obj.prototype.__super__ = sup.prototype;
	obj.prototype.initialize = obj.prototype.constructor = obj;
	return obj;
};



Imba.iterable = function (o){
	return o ? ((o.toArray ? o.toArray() : o)) : [];
};



Imba.await = function (value){
	if (value instanceof Array) {
		console.warn("await (Array) is deprecated - use await Promise.all(Array)");
		return Promise.all(value);
	} else if (value && value.then) {
		return value;
	} else {
		return Promise.resolve(value);
	};
};

var dashRegex = /-./g;
var setterCache = {};

Imba.toCamelCase = function (str){
	if (str.indexOf('-') >= 0) {
		return str.replace(dashRegex,function(m) { return m.charAt(1).toUpperCase(); });
	} else {
		return str;
	};
};

Imba.toSetter = function (str){
	return setterCache[str] || (setterCache[str] = Imba.toCamelCase('set-' + str));
};

Imba.indexOf = function (a,b){
	return (b && b.indexOf) ? b.indexOf(a) : [].indexOf.call(a,b);
};

Imba.len = function (a){
	return a && ((a.len instanceof Function) ? a.len.call(a) : a.length) || 0;
};

Imba.prop = function (scope,name,opts){
	if (scope.defineProperty) {
		return scope.defineProperty(name,opts);
	};
	return;
};

Imba.attr = function (scope,name,opts){
	if(opts === undefined) opts = {};
	if (scope.defineAttribute) {
		return scope.defineAttribute(name,opts);
	};
	
	let getName = Imba.toCamelCase(name);
	let setName = Imba.toCamelCase('set-' + name);
	let proto = scope.prototype;
	
	if (opts.dom) {
		proto[getName] = function() { return this.dom()[name]; };
		proto[setName] = function(value) {
			if (value != this[name]()) {
				this.dom()[name] = value;
			};
			return this;
		};
	} else {
		proto[getName] = function() { return this.getAttribute(name); };
		proto[setName] = function(value) {
			this.setAttribute(name,value);
			return this;
		};
	};
	return;
};

Imba.propDidSet = function (object,property,val,prev){
	let fn = property.watch;
	if (fn instanceof Function) {
		fn.call(object,val,prev,property);
	} else if ((typeof fn=='string'||fn instanceof String) && object[fn]) {
		object[fn](val,prev,property);
	};
	return;
};



var emit__ = function(event,args,node) {
	// var node = cbs[event]
	var prev,cb,ret;
	
	while ((prev = node) && (node = node.next)){
		if (cb = node.listener) {
			if (node.path && cb[node.path]) {
				ret = args ? cb[node.path].apply(cb,args) : cb[node.path]();
			} else {
				// check if it is a method?
				ret = args ? cb.apply(node,args) : cb.call(node);
			};
		};
		
		if (node.times && --node.times <= 0) {
			prev.next = node.next;
			node.listener = null;
		};
	};
	return;
};


Imba.listen = function (obj,event,listener,path){
	var cbs,list,tail;
	cbs = obj.__listeners__ || (obj.__listeners__ = {});
	list = cbs[event] || (cbs[event] = {});
	tail = list.tail || (list.tail = (list.next = {}));
	tail.listener = listener;
	tail.path = path;
	list.tail = tail.next = {};
	return tail;
};


Imba.once = function (obj,event,listener){
	var tail = Imba.listen(obj,event,listener);
	tail.times = 1;
	return tail;
};


Imba.unlisten = function (obj,event,cb,meth){
	var node,prev;
	var meta = obj.__listeners__;
	if (!meta) { return };
	
	if (node = meta[event]) {
		while ((prev = node) && (node = node.next)){
			if (node == cb || node.listener == cb) {
				prev.next = node.next;
				
				node.listener = null;
				break;
			};
		};
	};
	return;
};


Imba.emit = function (obj,event,params){
	var cb;
	if (cb = obj.__listeners__) {
		if (cb[event]) { emit__(event,params,cb[event]) };
		if (cb.all) { emit__(event,[event,params],cb.all) }; 
	};
	return;
};

Imba.observeProperty = function (observer,key,trigger,target,prev){
	if (prev && typeof prev == 'object') {
		Imba.unlisten(prev,'all',observer,trigger);
	};
	if (target && typeof target == 'object') {
		Imba.listen(target,'all',observer,trigger);
	};
	return this;
};

module.exports = Imba;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var Imba = __webpack_require__(0);

Imba.Pointer = function Pointer(){
	this._button = -1;
	this._event = {x: 0,y: 0,type: 'uninitialized'};
	return this;
};

Imba.Pointer.prototype.button = function (){
	return this._button;
};

Imba.Pointer.prototype.touch = function (){
	return this._touch;
};

Imba.Pointer.prototype.update = function (e){
	this._event = e;
	this._dirty = true;
	return this;
};


Imba.Pointer.prototype.process = function (){
	var e1 = this._event;
	
	if (this._dirty) {
		this._prevEvent = e1;
		this._dirty = false;
		
		
		if (e1.type == 'mousedown') {
			this._button = e1.button;
			
			if ((this._touch && this._button != 0)) {
				return;
			};
			
			
			if (this._touch) { this._touch.cancel() };
			this._touch = new Imba.Touch(e1,this);
			this._touch.mousedown(e1,e1);
		} else if (e1.type == 'mousemove') {
			if (this._touch) { this._touch.mousemove(e1,e1) };
		} else if (e1.type == 'mouseup') {
			this._button = -1;
			
			if (this._touch && this._touch.button() == e1.button) {
				this._touch.mouseup(e1,e1);
				this._touch = null;
			};
			
		};
	} else if (this._touch) {
		this._touch.idle();
	};
	return this;
};

Imba.Pointer.prototype.x = function (){
	return this._event.x;
};
Imba.Pointer.prototype.y = function (){
	return this._event.y;
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var Imba = __webpack_require__(1), $1, $2, _1 = Imba.createElement;
var Game = __webpack_require__(15).Game;
var Player = __webpack_require__(16).Player;
var Gun = __webpack_require__(18).Gun;
var Animation = __webpack_require__(19).Animation;
var Crosshair = __webpack_require__(20).Crosshair;
var Zombie = __webpack_require__(21).Zombie;

var App = __webpack_require__(22).App;

let audios = {
	theme1: new Audio('sounds/theme1.mp3'),
	theme0: new Audio('sounds/theme0.mp3'),
	theme2: new Audio('sounds/theme2.mp3'),
	theme3: new Audio('sounds/theme3.mp3'),
	shotgunShot: new Audio('sounds/shotgun_shot.wav'),
	shotgun_pump: new Audio('sounds/shotgun_pump.wav'),
	shotgun_reload: new Audio('sounds/shotgun_reload.wav'),
	shotgun0: new Audio('sounds/shotgun0.wav'),
	shotgun1: new Audio('sounds/shotgun1.wav'),
	pistol: new Audio('sounds/pistol.wav')
};

for (let j = 0, items = iter$(Object.keys(Array.from(new Array(10)))), len = items.length, i; j < len; j++) {
	i = items[j];
	audios[("survivor_yell" + i)] = new Audio(("sounds/survivor_yell/3yell" + i + ".wav"));
};
for (let j = 0, items = iter$(Object.keys(Array.from(new Array(4)))), len = items.length, i; j < len; j++) {
	i = items[j];
	audios[("zombie_hit" + i)] = new Audio(("sounds/zombie_hit/" + i + ".wav"));
};
for (let j = 0, items = iter$(Object.keys(Array.from(new Array(3)))), len = items.length, i; j < len; j++) {
	i = items[j];
	audios[("melee" + i)] = new Audio(("sounds/melee" + i + ".wav"));
};
for (let j = 0, items = iter$(Object.keys(Array.from(new Array(4)))), len = items.length, i; j < len; j++) {
	i = items[j];
	audios[("zombie_hit" + i)] = new Audio(("sounds/zombie_hit/" + i + ".wav"));
};
for (let j = 0, items = iter$(Object.keys(Array.from(new Array(3)))), len = items.length, i; j < len; j++) {
	i = items[j];
	audios[("zombie-attack" + i)] = new Audio(("sounds/zombie-attack" + i + ".ogg"));
};

let barrels = [];

for (let j = 0, items = iter$(Array.from(new Array(100))), len = items.length; j < len; j++) {
	barrels.push(
		{x: Math.random() * 5000 - 2000,
		y: Math.random() * 5000,
		rotation: Math.random() * 360,
		id: Math.random(),
		size: 30}
	);
};

let boxes = [];

for (let j = 0, items = iter$(Array.from(new Array(100))), len = items.length; j < len; j++) {
	boxes.push(
		{x: Math.random() * 5000 - 2000,
		y: Math.random() * 5000,
		rotation: Math.random() * 360,
		id: Math.random(),
		size: 70}
	);
};

let crosshair = new Crosshair({x: 0,y: 0});

let sectors = {};
for (let i = 0, len = boxes.length, box; i < len; i++) {
	box = boxes[i];
	sectors[$1 = ("x" + (~~(box.x / 500)) + "y" + (~~(box.y / 500)))] || (sectors[$1] = []);
	sectors[("x" + (~~(box.x / 500)) + "y" + (~~(box.y / 500)))].push(box);
};

for (let i = 0, len = barrels.length, barrel; i < len; i++) {
	barrel = barrels[i];
	sectors[$2 = ("x" + (~~(barrel.x / 500)) + "y" + (~~(barrel.y / 500)))] || (sectors[$2] = []);
	sectors[("x" + (~~(barrel.x / 500)) + "y" + (~~(barrel.y / 500)))].push(barrel);
};

let game = new Game(
	{keys: {},
	time: 0,
	barrels: barrels,
	boxes: boxes,
	crosshair: crosshair,
	sectors: sectors,
	menu: true}
);

let animations = {
	player: {
		knife: {
			idle: new Animation(
				{path: "textures/knife/idle/survivor-idle_knife_",
				name: "knife-idle",
				size: 19,
				frameLength: 3,
				adjust: {
					scale: "1.15,1.15",
					translate: "-5,0"
				}}
			),
			
			move: new Animation(
				{path: "textures/knife/move/survivor-move_knife_",
				name: "knife-move",
				size: 19,
				frameLength: 3,
				adjust: {
					scale: "1.15,1.15",
					translate: "-5,0"
				}}
			),
			
			attack: new Animation(
				{path: "textures/knife/meleeattack/survivor-meleeattack_knife_",
				name: "knife-meleeattack",
				size: 14,
				frameLength: 2,
				adjust: {
					scale: "1.3,1.3",
					translate: "-5,5"
				}}
			)
		},
		
		handgun: {
			idle: new Animation(
				{path: "textures/handgun/idle/survivor-idle_handgun_",
				name: "handgun-idle",
				size: 19,
				frameLength: 3,
				adjust: {
					scale: "1,1",
					translate: "0,0"
				}}
			),
			
			move: new Animation(
				{path: "textures/handgun/move/survivor-move_handgun_",
				name: "handgun-move",
				size: 19,
				frameLength: 3,
				adjust: {
					scale: "1,1",
					translate: "0,0"
				}}
			),
			
			attack: new Animation(
				{path: "textures/handgun/meleeattack/survivor-meleeattack_handgun_",
				name: "handgun-meleeattack",
				size: 14,
				frameLength: 2,
				adjust: {
					scale: "1.2,1.2",
					translate: "0,-5"
				}}
			),
			
			shoot: new Animation(
				{path: "textures/handgun/shoot/survivor-shoot_handgun_",
				name: "handgun-shoot",
				size: 2,
				frameLength: 3,
				adjust: {
					scale: "1,1",
					translate: "0,0"
				}}
			),
			
			reload: new Animation(
				{path: "textures/handgun/reload/survivor-reload_handgun_",
				name: "handgun-reload",
				size: 14,
				frameLength: 3,
				adjust: {
					scale: "1,1",
					translate: "0,0"
				}}
			)
		},
		
		rifle: {
			idle: new Animation(
				{path: "textures/rifle/idle/survivor-idle_rifle_",
				name: "rifle-idle",
				size: 19,
				frameLength: 3,
				adjust: {
					scale: "1.25,1.25",
					translate: "0,-10"
				}}
			),
			
			move: new Animation(
				{path: "textures/rifle/move/survivor-move_rifle_",
				name: "rifle-move",
				size: 19,
				frameLength: 3,
				adjust: {
					scale: "1.25,1.25",
					translate: "0,-10"
				}}
			),
			
			attack: new Animation(
				{path: "textures/rifle/meleeattack/survivor-meleeattack_rifle_",
				name: "rifle-meleeattack",
				size: 14,
				frameLength: 2,
				adjust: {
					scale: "1.45,1.45",
					translate: "-5,-20"
				}}
			),
			
			shoot: new Animation(
				{path: "textures/rifle/shoot/survivor-shoot_rifle_",
				name: "rifle-shoot",
				size: 2,
				frameLength: 3,
				adjust: {
					scale: "1.25,1.25",
					translate: "0,-10"
				}}
			),
			
			reload: new Animation(
				{path: "textures/rifle/reload/survivor-reload_rifle_",
				name: "rifle-reload",
				size: 14,
				frameLength: 3,
				adjust: {
					scale: "1.25,1.25",
					translate: "0,-10"
				}}
			)
		},
		shotgun: {
			idle: new Animation(
				{path: "textures/shotgun/idle/survivor-idle_shotgun_",
				name: "shotgun-idle",
				size: 19,
				frameLength: 3,
				adjust: {
					scale: "1.25,1.25",
					translate: "0,-10"
				}}
			),
			
			move: new Animation(
				{path: "textures/shotgun/move/survivor-move_shotgun_",
				name: "shotgun-move",
				size: 19,
				frameLength: 3,
				adjust: {
					scale: "1.25,1.25",
					translate: "0,-10"
				}}
			),
			
			attack: new Animation(
				{path: "textures/shotgun/meleeattack/survivor-meleeattack_shotgun_",
				name: "shotgun-meleeattack",
				size: 14,
				frameLength: 2,
				adjust: {
					scale: "1.45,1.45",
					translate: "-5,-20"
				}}
			),
			
			shoot: new Animation(
				{path: "textures/shotgun/shoot/survivor-shoot_shotgun_",
				name: "shotgun-shoot",
				size: 2,
				frameLength: 3,
				adjust: {
					scale: "1.25,1.25",
					translate: "0,-10"
				}}
			),
			
			reload: new Animation(
				{path: "textures/shotgun/reload/survivor-reload_shotgun_",
				name: "shotgun-reload",
				size: 14,
				frameLength: 3,
				adjust: {
					scale: "1.25,1.25",
					translate: "0,-10"
				}}
			)
		},
		
		flashlight: {
			idle: new Animation(
				{path: "textures/flashlight/idle/survivor-idle_flashlight_",
				name: "flashlight-idle",
				size: 19,
				frameLength: 3,
				adjust: {
					scale: "1.25,1.25",
					translate: "0,-10"
				}}
			),
			
			move: new Animation(
				{path: "textures/flashlight/move/survivor-move_flashlight_",
				name: "flashlight-move",
				size: 19,
				frameLength: 3,
				adjust: {
					scale: "1.25,1.25",
					translate: "0,-10"
				}}
			),
			
			attack: new Animation(
				{path: "textures/flashlight/meleeattack/survivor-meleeattack_flashlight_",
				name: "flashlight-meleeattack",
				size: 14,
				frameLength: 2,
				adjust: {
					scale: "1.25,1.25",
					translate: "-5,-10"
				}}
			)
		}
	},
	
	feet: {
		idle: new Animation(
			{path: "textures/feet/idle/survivor-idle_",
			name: "feet-idle",
			size: 1,
			frameLength: 3,
			adjust: {
				scale: "0.9,0.9",
				translate: "0,10"
			}}
		),
		
		run: new Animation(
			{path: "textures/feet/run/survivor-run_",
			name: "feet-run",
			size: 19,
			frameLength: 3,
			adjust: {
				scale: "0.9,0.9",
				translate: "0,10"
			}}
		),
		
		walk: new Animation(
			{path: "textures/feet/walk/survivor-walk_",
			name: "feet-walk",
			size: 19,
			frameLength: 3,
			adjust: {
				scale: "0.9,0.9",
				translate: "0,10"
			}}
		),
		
		strafe_left: new Animation(
			{path: "textures/feet/strafe_left/survivor-strafe_left_",
			name: "feet-strafe_left",
			size: 19,
			frameLength: 3,
			adjust: {
				scale: "0.9,0.9",
				translate: "0,10"
			}}
		),
		
		strafe_right: new Animation(
			{path: "textures/feet/strafe_right/survivor-strafe_right_",
			name: "feet-strafe_right",
			size: 19,
			frameLength: 3,
			adjust: {
				scale: "0.9,0.9",
				translate: "0,10"
			}}
		)
	},
	
	zombie: {
		idle: new Animation(
			{path: "idle",
			size: 16,
			frameLength: 3,
			adjust: {
				scale: "1,1",
				translate: "0,0"
			}}
		),
		
		attack: new Animation(
			{path: "attack",
			size: 8,
			frameLength: 2,
			adjust: {
				scale: "1.3,1.3",
				translate: "0,0"
			}}
		),
		
		move: new Animation(
			{path: "move",
			size: 16,
			frameLength: 3,
			adjust: {
				scale: "1.3,1.3",
				translate: "0,0"
			}}
		)
	}
};

let guns = {
	knife: new Gun(
		{name: 'knife',
		ammo: 0,
		cap: 0,
		rate: 1.5,
		damage: 25,
		reloadTime: 0,
		power: 10}
	),
	
	handgun: new Gun(
		{name: 'handgun',
		ammo: 15,
		cap: 15,
		rate: 3,
		damage: 25,
		reloadTime: 1000,
		power: 10,
		accuracy: 30,
		shootSounds: [
			{src: audios.pistol.src,volume: 1}
		]}
	),
	
	rifle: new Gun(
		{name: 'rifle',
		ammo: 30,
		cap: 30,
		rate: 15,
		damage: 25,
		reloadTime: 1500,
		power: 15,
		accuracy: 10,
		shootSounds: [
			{src: audios.shotgunShot.src,volume: 0.6}
		]}
	),
	
	shotgun: new Gun(
		{name: 'shotgun',
		ammo: 8,
		cap: 8,
		rate: 1.2,
		damage: 35,
		reloadTime: 2500,
		power: 25,
		accuracy: 8,
		shootSounds: [
			{src: audios.shotgun0.src,volume: 1}
		]}
	),
	
	flashlight: new Gun(
		{name: 'flashlight',
		ammo: 0,
		cap: 0,
		rate: 0,
		damage: 0,
		reloadTime: 1,
		power: 0,
		accuracy: 0}
	)
};

let player = new Player(
	{invertory: guns,
	gun: guns.handgun,
	pos: {
		x: 0,
		y: 0
	},
	rotation: 0,
	canShoot: true,
	canAttack: true,
	speed: 3,
	animation: animations.player.knife.idle,
	animations: animations.player,
	feetAnimation: animations.feet.idle,
	feetAnimations: animations.feet,
	game: game,
	boxes: boxes,
	barrels: barrels}
);

game.setPlayer(player);

let zombies = [];
for (let j = 0, items = iter$(Array.from(new Array(70))), len = items.length; j < len; j++) {
	zombies.push(new Zombie(
		{id: Math.random(),
		pos: {
			x: player.pos().x + Math.random() * 4000 - 2000 + window.innerWidth / 2,
			y: player.pos().y + Math.random() * 4000 - 2000 + window.innerHeight / 2
		},
		rotation: Math.random() * 360,
		animation: animations.zombie.idle,
		animations: animations.zombie,
		state: 'random',
		life: 100,
		maxLife: 100,
		speed: 1,
		maxSpeed: 5,
		game: game,
		zombies: zombies,
		player: player,
		boxes: boxes,
		barrels: barrels}
	));
};

player.setZombies(zombies);
game.setZombies(zombies);

Imba.mount((_1(App)).setCrosshair(crosshair).setZombies(zombies).setPlayer(player).setGuns(guns).setAnimations(animations).setAudios(audios).setBoxes(boxes).setBarrels(barrels).setGame(game).end());



/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var Imba = __webpack_require__(0);
var activate = false;
var ns = ((typeof window !== 'undefined') ? window : (((typeof global !== 'undefined') ? global : null)));

if (ns && ns.Imba) {
	console.warn(("Imba v" + (ns.Imba.VERSION) + " is already loaded."));
	Imba = ns.Imba;
} else if (ns) {
	ns.Imba = Imba;
	activate = true;
	if (ns.define && ns.define.amd) {
		ns.define("imba",[],function() { return Imba; });
	};
};

module.exports = Imba;

if (true) {
	__webpack_require__(6);
	__webpack_require__(7);
};

if (activate) {
	Imba.EventManager.activate();
};

if (false) {};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var Imba = __webpack_require__(0);

var requestAnimationFrame; 
var cancelAnimationFrame;

if (false) {};

if (true) {
	cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitRequestAnimationFrame;
	requestAnimationFrame = window.requestAnimationFrame;
	requestAnimationFrame || (requestAnimationFrame = window.webkitRequestAnimationFrame);
	requestAnimationFrame || (requestAnimationFrame = window.mozRequestAnimationFrame);
	requestAnimationFrame || (requestAnimationFrame = function(blk) { return setTimeout(blk,1000 / 60); });
};

function Ticker(){
	var self = this;
	self._queue = [];
	self._stage = -1;
	self._scheduled = false;
	self._ticker = function(e) {
		self._scheduled = false;
		return self.tick(e);
	};
	self;
};

Ticker.prototype.stage = function(v){ return this._stage; }
Ticker.prototype.setStage = function(v){ this._stage = v; return this; };
Ticker.prototype.queue = function(v){ return this._queue; }
Ticker.prototype.setQueue = function(v){ this._queue = v; return this; };

Ticker.prototype.add = function (item,force){
	if (force || this._queue.indexOf(item) == -1) {
		this._queue.push(item);
	};
	
	if (!this._scheduled) { return this.schedule() };
};

Ticker.prototype.tick = function (timestamp){
	var items = this._queue;
	if (!this._ts) { this._ts = timestamp };
	this._dt = timestamp - this._ts;
	this._ts = timestamp;
	this._queue = [];
	this._stage = 1;
	this.before();
	if (items.length) {
		for (let i = 0, ary = iter$(items), len = ary.length, item; i < len; i++) {
			item = ary[i];
			if (item instanceof Function) {
				item(this._dt,this);
			} else if (item.tick) {
				item.tick(this._dt,this);
			};
		};
	};
	this._stage = 2;
	this.after();
	this._stage = this._scheduled ? 0 : (-1);
	return this;
};

Ticker.prototype.schedule = function (){
	if (!this._scheduled) {
		this._scheduled = true;
		if (this._stage == -1) {
			this._stage = 0;
		};
		requestAnimationFrame(this._ticker);
	};
	return this;
};

Ticker.prototype.before = function (){
	return this;
};

Ticker.prototype.after = function (){
	if (Imba.TagManager) {
		Imba.TagManager.refresh();
	};
	return this;
};

Imba.TICKER = new Ticker();
Imba.SCHEDULERS = [];

Imba.ticker = function (){
	return Imba.TICKER;
};

Imba.requestAnimationFrame = function (callback){
	return requestAnimationFrame(callback);
};

Imba.cancelAnimationFrame = function (id){
	return cancelAnimationFrame(id);
};




var commitQueue = 0;

Imba.commit = function (params){
	commitQueue++;
	
	Imba.emit(Imba,'commit',(params != undefined) ? [params] : undefined);
	if (--commitQueue == 0) {
		Imba.TagManager && Imba.TagManager.refresh();
	};
	return;
};



Imba.Scheduler = function Scheduler(target){
	var self = this;
	self._id = counter++;
	self._target = target;
	self._marked = false;
	self._active = false;
	self._marker = function() { return self.mark(); };
	self._ticker = function(e) { return self.tick(e); };
	
	self._dt = 0;
	self._frame = {};
	self._scheduled = false;
	self._timestamp = 0;
	self._ticks = 0;
	self._flushes = 0;
	
	self.onevent = self.onevent.bind(self);
	self;
};

var counter = 0;

Imba.Scheduler.event = function (e){
	return Imba.emit(Imba,'event',e);
};



Imba.Scheduler.prototype.__raf = {watch: 'rafDidSet',name: 'raf'};
Imba.Scheduler.prototype.raf = function(v){ return this._raf; }
Imba.Scheduler.prototype.setRaf = function(v){
	var a = this.raf();
	if(v != a) { this._raf = v; }
	if(v != a) { this.rafDidSet && this.rafDidSet(v,a,this.__raf) }
	return this;
};
Imba.Scheduler.prototype.__interval = {watch: 'intervalDidSet',name: 'interval'};
Imba.Scheduler.prototype.interval = function(v){ return this._interval; }
Imba.Scheduler.prototype.setInterval = function(v){
	var a = this.interval();
	if(v != a) { this._interval = v; }
	if(v != a) { this.intervalDidSet && this.intervalDidSet(v,a,this.__interval) }
	return this;
};
Imba.Scheduler.prototype.__events = {watch: 'eventsDidSet',name: 'events'};
Imba.Scheduler.prototype.events = function(v){ return this._events; }
Imba.Scheduler.prototype.setEvents = function(v){
	var a = this.events();
	if(v != a) { this._events = v; }
	if(v != a) { this.eventsDidSet && this.eventsDidSet(v,a,this.__events) }
	return this;
};
Imba.Scheduler.prototype.marked = function(v){ return this._marked; }
Imba.Scheduler.prototype.setMarked = function(v){ this._marked = v; return this; };

Imba.Scheduler.prototype.rafDidSet = function (bool){
	if (bool && this._active) this.requestTick();
	return this;
};

Imba.Scheduler.prototype.intervalDidSet = function (time){
	clearInterval(this._intervalId);
	this._intervalId = null;
	if (time && this._active) {
		this._intervalId = setInterval(this.oninterval.bind(this),time);
	};
	return this;
};

Imba.Scheduler.prototype.eventsDidSet = function (new$,prev){
	if (this._active && new$ && !prev) {
		return Imba.listen(Imba,'commit',this,'onevent');
	} else if (!(new$) && prev) {
		return Imba.unlisten(Imba,'commit',this,'onevent');
	};
};



Imba.Scheduler.prototype.active = function (){
	return this._active;
};



Imba.Scheduler.prototype.dt = function (){
	return this._dt;
};



Imba.Scheduler.prototype.configure = function (options){
	var v_;
	if(options === undefined) options = {};
	if (options.raf != undefined) { (this.setRaf(v_ = options.raf),v_) };
	if (options.interval != undefined) { (this.setInterval(v_ = options.interval),v_) };
	if (options.events != undefined) { (this.setEvents(v_ = options.events),v_) };
	return this;
};



Imba.Scheduler.prototype.mark = function (){
	this._marked = true;
	if (!this._scheduled) {
		this.requestTick();
	};
	return this;
};



Imba.Scheduler.prototype.flush = function (){
	this._flushes++;
	this._target.tick(this);
	this._marked = false;
	return this;
};



Imba.Scheduler.prototype.tick = function (delta,ticker){
	this._ticks++;
	this._dt = delta;
	
	if (ticker) {
		this._scheduled = false;
	};
	
	this.flush();
	
	if (this._raf && this._active) {
		this.requestTick();
	};
	return this;
};

Imba.Scheduler.prototype.requestTick = function (){
	if (!this._scheduled) {
		this._scheduled = true;
		Imba.TICKER.add(this);
	};
	return this;
};



Imba.Scheduler.prototype.activate = function (immediate){
	if(immediate === undefined) immediate = true;
	if (!this._active) {
		this._active = true;
		this._commit = this._target.commit;
		this._target.commit = function() { return this; };
		this._target && this._target.flag  &&  this._target.flag('scheduled_');
		Imba.SCHEDULERS.push(this);
		
		if (this._events) {
			Imba.listen(Imba,'commit',this,'onevent');
		};
		
		if (this._interval && !this._intervalId) {
			this._intervalId = setInterval(this.oninterval.bind(this),this._interval);
		};
		
		if (immediate) {
			this.tick(0);
		} else if (this._raf) {
			this.requestTick();
		};
	};
	return this;
};



Imba.Scheduler.prototype.deactivate = function (){
	if (this._active) {
		this._active = false;
		this._target.commit = this._commit;
		let idx = Imba.SCHEDULERS.indexOf(this);
		if (idx >= 0) {
			Imba.SCHEDULERS.splice(idx,1);
		};
		
		if (this._events) {
			Imba.unlisten(Imba,'commit',this,'onevent');
		};
		
		if (this._intervalId) {
			clearInterval(this._intervalId);
			this._intervalId = null;
		};
		
		this._target && this._target.unflag  &&  this._target.unflag('scheduled_');
	};
	return this;
};

Imba.Scheduler.prototype.track = function (){
	return this._marker;
};

Imba.Scheduler.prototype.oninterval = function (){
	this.tick();
	Imba.TagManager.refresh();
	return this;
};

Imba.Scheduler.prototype.onevent = function (event){
	if (!this._events || this._marked) { return this };
	
	if (this._events instanceof Function) {
		if (this._events(event,this)) this.mark();
	} else if (this._events instanceof Array) {
		if (this._events.indexOf((event && event.type) || event) >= 0) {
			this.mark();
		};
	} else {
		this.mark();
	};
	return this;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var Imba = __webpack_require__(0);

__webpack_require__(8);
__webpack_require__(9);

Imba.TagManager = new Imba.TagManagerClass();

__webpack_require__(10);
__webpack_require__(11);
__webpack_require__(2);
__webpack_require__(12);
__webpack_require__(13);

if (true) {
	__webpack_require__(14);
};

if (false) {};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var Imba = __webpack_require__(0);

Imba.TagManagerClass = function TagManagerClass(){
	this._inserts = 0;
	this._removes = 0;
	this._mounted = [];
	this._mountables = 0;
	this._unmountables = 0;
	this._unmounting = 0;
	this;
};

Imba.TagManagerClass.prototype.mounted = function (){
	return this._mounted;
};

Imba.TagManagerClass.prototype.insert = function (node,parent){
	this._inserts++;
	if (node && node.mount) { this.regMountable(node) };
	
	
	
	return;
};

Imba.TagManagerClass.prototype.remove = function (node,parent){
	return this._removes++;
};


Imba.TagManagerClass.prototype.changes = function (){
	return this._inserts + this._removes;
};

Imba.TagManagerClass.prototype.mount = function (node){
	return;
};

Imba.TagManagerClass.prototype.refresh = function (force){
	if(force === undefined) force = false;
	if (false) {};
	if (!force && this.changes() == 0) { return };
	
	if ((this._inserts && this._mountables > this._mounted.length) || force) {
		this.tryMount();
	};
	
	if ((this._removes || force) && this._mounted.length) {
		this.tryUnmount();
	};
	
	this._inserts = 0;
	this._removes = 0;
	return this;
};

Imba.TagManagerClass.prototype.unmount = function (node){
	return this;
};

Imba.TagManagerClass.prototype.regMountable = function (node){
	if (!(node.FLAGS & Imba.TAG_MOUNTABLE)) {
		node.FLAGS |= Imba.TAG_MOUNTABLE;
		return this._mountables++;
	};
};


Imba.TagManagerClass.prototype.tryMount = function (){
	var count = 0;
	var root = document.body;
	var items = root.querySelectorAll('.__mount');
	
	for (let i = 0, ary = iter$(items), len = ary.length, el; i < len; i++) {
		el = ary[i];
		if (el && el._tag) {
			if (this._mounted.indexOf(el._tag) == -1) {
				this.mountNode(el._tag);
			};
		};
	};
	return this;
};

Imba.TagManagerClass.prototype.mountNode = function (node){
	if (this._mounted.indexOf(node) == -1) {
		this.regMountable(node);
		this._mounted.push(node);
		
		node.FLAGS |= Imba.TAG_MOUNTED;
		if (node.mount) { node.mount() };
		
		
		
		
		
	};
	return;
};

Imba.TagManagerClass.prototype.tryUnmount = function (){
	this._unmounting++;
	
	var unmount = [];
	var root = document.body;
	for (let i = 0, items = iter$(this._mounted), len = items.length, item; i < len; i++) {
		item = items[i];
		if (!item) { continue; };
		if (!document.documentElement.contains(item._dom)) {
			unmount.push(item);
			this._mounted[i] = null;
		};
	};
	
	this._unmounting--;
	
	if (unmount.length) {
		this._mounted = this._mounted.filter(function(item) { return item && unmount.indexOf(item) == -1; });
		for (let i = 0, len = unmount.length, item; i < len; i++) {
			item = unmount[i];
			item.FLAGS = item.FLAGS & ~Imba.TAG_MOUNTED;
			if (item.unmount && item._dom) {
				item.unmount();
			} else if (item._scheduler) {
				item.unschedule();
			};
		};
	};
	return this;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var Imba = __webpack_require__(0);
__webpack_require__(2);

var native$ = [
	'keydown','keyup','keypress',
	'textInput','input','change','submit',
	'focusin','focusout','focus','blur',
	'contextmenu','selectstart','dblclick','selectionchange',
	'mousewheel','wheel','scroll',
	'beforecopy','copy','beforepaste','paste','beforecut','cut',
	'dragstart','drag','dragend','dragenter','dragover','dragleave','dragexit','drop',
	'mouseup','mousedown','mouseenter','mouseleave','mouseout','mouseover','mousemove',
	'transitionstart','transitionend','transitioncancel',
	'animationstart','animationiteration','animationend'
];



Imba.EventManager = function EventManager(node,pars){
	var self = this;
	if(!pars||pars.constructor !== Object) pars = {};
	var events = pars.events !== undefined ? pars.events : [];
	self._shimFocusEvents = true && window.netscape && node.onfocusin === undefined;
	self.setRoot(node);
	self.setListeners([]);
	self.setDelegators({});
	self.setDelegator(function(e) {
		self.delegate(e);
		return true;
	});
	
	for (let i = 0, items = iter$(events), len = items.length; i < len; i++) {
		self.register(items[i]);
	};
	
	return self;
};

Imba.EventManager.prototype.root = function(v){ return this._root; }
Imba.EventManager.prototype.setRoot = function(v){ this._root = v; return this; };
Imba.EventManager.prototype.count = function(v){ return this._count; }
Imba.EventManager.prototype.setCount = function(v){ this._count = v; return this; };
Imba.EventManager.prototype.__enabled = {'default': false,watch: 'enabledDidSet',name: 'enabled'};
Imba.EventManager.prototype.enabled = function(v){ return this._enabled; }
Imba.EventManager.prototype.setEnabled = function(v){
	var a = this.enabled();
	if(v != a) { this._enabled = v; }
	if(v != a) { this.enabledDidSet && this.enabledDidSet(v,a,this.__enabled) }
	return this;
}
Imba.EventManager.prototype._enabled = false;
Imba.EventManager.prototype.listeners = function(v){ return this._listeners; }
Imba.EventManager.prototype.setListeners = function(v){ this._listeners = v; return this; };
Imba.EventManager.prototype.delegators = function(v){ return this._delegators; }
Imba.EventManager.prototype.setDelegators = function(v){ this._delegators = v; return this; };
Imba.EventManager.prototype.delegator = function(v){ return this._delegator; }
Imba.EventManager.prototype.setDelegator = function(v){ this._delegator = v; return this; };

var initialBind = [];

Imba.EventManager.prototype.enabledDidSet = function (bool){
	bool ? this.onenable() : this.ondisable();
	return this;
};

Imba.EventManager.bind = function (name){
	if (Imba.Events) {
		return Imba.Events.autoregister(name);
	} else if (initialBind.indexOf(name) == -1 && native$.indexOf(name) >= 0) {
		return initialBind.push(name);
	};
};

Imba.EventManager.activate = function (){
	var Imba_;
	if (Imba.Events) { return Imba.Events };
	Imba.Events = new Imba.EventManager(Imba.document(),{events: []});
	if (false) {};
	
	Imba.POINTER || (Imba.POINTER = new Imba.Pointer());
	
	var hasTouchEvents = window && window.ontouchstart !== undefined;
	
	if (hasTouchEvents) {
		Imba.Events.listen('touchstart',function(e) {
			return Imba.Touch.ontouchstart(e);
		});
		
		Imba.Events.listen('touchmove',function(e) {
			return Imba.Touch.ontouchmove(e);
		});
		
		Imba.Events.listen('touchend',function(e) {
			return Imba.Touch.ontouchend(e);
		});
		
		Imba.Events.listen('touchcancel',function(e) {
			return Imba.Touch.ontouchcancel(e);
		});
	};
	
	Imba.Events.register('click',function(e) {
		// Only for main mousebutton, no?
		if ((e.timeStamp - Imba.Touch.LastTimestamp) > Imba.Touch.TapTimeout) {
			e._imbaSimulatedTap = true;
			var tap = new Imba.Event(e);
			tap.setType('tap');
			tap.process();
			if (tap._responder && tap.defaultPrevented) {
				return e.preventDefault();
			};
		};
		
		return Imba.Events.delegate(e);
	});
	
	Imba.Events.listen('mousedown',function(e) {
		if ((e.timeStamp - Imba.Touch.LastTimestamp) > Imba.Touch.TapTimeout) {
			if (Imba.POINTER) { return Imba.POINTER.update(e).process() };
		};
	});
	
	Imba.Events.listen('mouseup',function(e) {
		if ((e.timeStamp - Imba.Touch.LastTimestamp) > Imba.Touch.TapTimeout) {
			if (Imba.POINTER) { return Imba.POINTER.update(e).process() };
		};
	});
	
	Imba.Events.register(['mousedown','mouseup']);
	Imba.Events.register(initialBind);
	Imba.Events.setEnabled(true);
	return Imba.Events;
};




Imba.EventManager.prototype.register = function (name,handler){
	if(handler === undefined) handler = true;
	if (name instanceof Array) {
		for (let i = 0, items = iter$(name), len = items.length; i < len; i++) {
			this.register(items[i],handler);
		};
		return this;
	};
	
	if (this.delegators()[name]) { return this };
	
	
	var fn = this.delegators()[name] = (handler instanceof Function) ? handler : this.delegator();
	if (this.enabled()) { return this.root().addEventListener(name,fn,true) };
};

Imba.EventManager.prototype.autoregister = function (name){
	if (native$.indexOf(name) == -1) { return this };
	return this.register(name);
};

Imba.EventManager.prototype.listen = function (name,handler,capture){
	if(capture === undefined) capture = true;
	this.listeners().push([name,handler,capture]);
	if (this.enabled()) { this.root().addEventListener(name,handler,capture) };
	return this;
};

Imba.EventManager.prototype.delegate = function (e){
	var event = Imba.Event.wrap(e);
	event.process();
	if (this._shimFocusEvents) {
		if (e.type == 'focus') {
			Imba.Event.wrap(e).setType('focusin').process();
		} else if (e.type == 'blur') {
			Imba.Event.wrap(e).setType('focusout').process();
		};
	};
	return this;
};



Imba.EventManager.prototype.create = function (type,target,pars){
	if(!pars||pars.constructor !== Object) pars = {};
	var data = pars.data !== undefined ? pars.data : null;
	var source = pars.source !== undefined ? pars.source : null;
	var event = Imba.Event.wrap({type: type,target: target});
	if (data) { (event.setData(data),data) };
	if (source) { (event.setSource(source),source) };
	return event;
};



Imba.EventManager.prototype.trigger = function (){
	return this.create.apply(this,arguments).process();
};

Imba.EventManager.prototype.onenable = function (){
	for (let o = this.delegators(), handler, i = 0, keys = Object.keys(o), l = keys.length, name; i < l; i++){
		name = keys[i];handler = o[name];this.root().addEventListener(name,handler,true);
	};
	
	for (let i = 0, items = iter$(this.listeners()), len = items.length, item; i < len; i++) {
		item = items[i];
		this.root().addEventListener(item[0],item[1],item[2]);
	};
	
	if (true) {
		window.addEventListener('hashchange',Imba.commit);
		window.addEventListener('popstate',Imba.commit);
	};
	return this;
};

Imba.EventManager.prototype.ondisable = function (){
	for (let o = this.delegators(), handler, i = 0, keys = Object.keys(o), l = keys.length, name; i < l; i++){
		name = keys[i];handler = o[name];this.root().removeEventListener(name,handler,true);
	};
	
	for (let i = 0, items = iter$(this.listeners()), len = items.length, item; i < len; i++) {
		item = items[i];
		this.root().removeEventListener(item[0],item[1],item[2]);
	};
	
	if (true) {
		window.removeEventListener('hashchange',Imba.commit);
		window.removeEventListener('popstate',Imba.commit);
	};
	
	return this;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var Imba = __webpack_require__(0);

Imba.CSSKeyMap = {};

Imba.TAG_BUILT = 1;
Imba.TAG_SETUP = 2;
Imba.TAG_MOUNTING = 4;
Imba.TAG_MOUNTED = 8;
Imba.TAG_SCHEDULED = 16;
Imba.TAG_AWAKENED = 32;
Imba.TAG_MOUNTABLE = 64;
Imba.TAG_AUTOCLASS_GLOBALS = true;
Imba.TAG_AUTOCLASS_LOCALS = true;
Imba.TAG_AUTOCLASS_SVG = true;



Imba.document = function (){
	return window.document;
};



Imba.root = function (){
	return Imba.getTagForDom(Imba.document().body);
};

Imba.static = function (items,typ,nr){
	items._type = typ;
	items.static = nr;
	return items;
};



Imba.mount = function (node,into){
	into || (into = Imba.document().body);
	into.appendChild(node.dom());
	Imba.TagManager.insert(node,into);
	node.scheduler().configure({events: true}).activate(false);
	Imba.TagManager.refresh();
	return node;
};


Imba.createTextNode = function (node){
	if (node && node.nodeType == 3) {
		return node;
	};
	return Imba.document().createTextNode(node);
};





Imba.Tag = function Tag(dom,ctx){
	this.setDom(dom);
	this.$ = TagCache.build(this);
	this.$up = this._owner_ = ctx;
	this._tree_ = null;
	this.FLAGS = 0;
	this.build();
	this;
};


Imba.Tag.buildNode = function (){
	var dom = Imba.document().createElement(this._nodeType || 'div');
	if (this._classes) {
		var cls = this._classes.join(" ");
		if (cls) { dom.className = cls };
	};
	return dom;
};

Imba.Tag.createNode = function (){
	var proto = (this._protoDom || (this._protoDom = this.buildNode()));
	return proto.cloneNode(false);
};

Imba.Tag.build = function (ctx){
	return new this(this.createNode(),ctx);
};

Imba.Tag.dom = function (){
	return this._protoDom || (this._protoDom = this.buildNode());
};

Imba.Tag.end = function (){
	return this.commit(0);
};



Imba.Tag.inherit = function (child){
	child._protoDom = null;
	
	if (this._nodeType) {
		child._nodeType = this._nodeType;
		child._classes = this._classes.slice();
		
		if (child._flagName) {
			return child._classes.push(child._flagName);
		};
	} else {
		child._nodeType = child._name;
		child._flagName = null;
		return child._classes = [];
	};
};



Imba.Tag.prototype.optimizeTagStructure = function (){
	if (false) {};
	var ctor = this.constructor;
	let keys = Object.keys(this);
	
	if (keys.indexOf('mount') >= 0) {
		if (ctor._classes && ctor._classes.indexOf('__mount') == -1) {
			ctor._classes.push('__mount');
		};
		
		if (ctor._protoDom) {
			ctor._protoDom.classList.add('__mount');
		};
	};
	
	for (let i = 0, items = iter$(keys), len = items.length, key; i < len; i++) {
		key = items[i];
		if ((/^on/).test(key)) { Imba.EventManager.bind(key.slice(2)) };
	};
	return this;
};


Imba.attr(Imba.Tag,'accesskey');
Imba.attr(Imba.Tag,'autocapitalize');
Imba.attr(Imba.Tag,'contenteditable');
Imba.attr(Imba.Tag,'contextmenu');
Imba.attr(Imba.Tag,'dir');
Imba.attr(Imba.Tag,'draggable');
Imba.attr(Imba.Tag,'dropzone');
Imba.attr(Imba.Tag,'hidden');
Imba.attr(Imba.Tag,'inputmode');
Imba.attr(Imba.Tag,'itemid');
Imba.attr(Imba.Tag,'itemprop');
Imba.attr(Imba.Tag,'itemref');
Imba.attr(Imba.Tag,'itemscope');
Imba.attr(Imba.Tag,'itemtype');
Imba.attr(Imba.Tag,'lang');
Imba.attr(Imba.Tag,'name');
Imba.attr(Imba.Tag,'role');
Imba.attr(Imba.Tag,'slot');
Imba.attr(Imba.Tag,'spellcheck');
Imba.attr(Imba.Tag,'tabindex');
Imba.Tag.prototype.title = function(v){ return this.getAttribute('title'); }
Imba.Tag.prototype.setTitle = function(v){ this.setAttribute('title',v); return this; };
Imba.attr(Imba.Tag,'translate');

Imba.Tag.prototype.dom = function (){
	return this._dom;
};

Imba.Tag.prototype.setDom = function (dom){
	dom._tag = this;
	this._dom = this._slot_ = dom;
	return this;
};

Imba.Tag.prototype.ref = function (){
	return this._ref;
};

Imba.Tag.prototype.root = function (){
	return this._owner_ ? this._owner_.root() : this;
};



Imba.Tag.prototype.ref_ = function (ref){
	this.flag(this._ref = ref);
	return this;
};



Imba.Tag.prototype.setData = function (data){
	this._data = data;
	return this;
};



Imba.Tag.prototype.data = function (){
	return this._data;
};


Imba.Tag.prototype.bindData = function (target,path,args){
	return this.setData(args ? target[path].apply(target,args) : target[path]);
};



Imba.Tag.prototype.setHtml = function (html){
	if (this.html() != html) {
		this._dom.innerHTML = html;
	};
	return this;
};



Imba.Tag.prototype.html = function (){
	return this._dom.innerHTML;
};

Imba.Tag.prototype.on$ = function (slot,handler,context){
	let handlers = this._on_ || (this._on_ = []);
	let prev = handlers[slot];
	
	if (slot < 0) {
		if (prev == undefined) {
			slot = handlers[slot] = handlers.length;
		} else {
			slot = prev;
		};
		prev = handlers[slot];
	};
	
	handlers[slot] = handler;
	if (prev) {
		handler.state = prev.state;
	} else {
		handler.state = {context: context};
		if (true) { Imba.EventManager.bind(handler[0]) };
	};
	return this;
};


Imba.Tag.prototype.setId = function (id){
	if (id != null) {
		this.dom().id = id;
	};
	return this;
};

Imba.Tag.prototype.id = function (){
	return this.dom().id;
};



Imba.Tag.prototype.setAttribute = function (name,value){
	var old = this.dom().getAttribute(name);
	
	if (old == value) {
		value;
	} else if (value != null && value !== false) {
		this.dom().setAttribute(name,value);
	} else {
		this.dom().removeAttribute(name);
	};
	return this;
};

Imba.Tag.prototype.setNestedAttr = function (ns,name,value,modifiers){
	if (this[ns + 'SetAttribute']) {
		this[ns + 'SetAttribute'](name,value,modifiers);
	} else {
		this.setAttributeNS(ns,name,value);
	};
	return this;
};

Imba.Tag.prototype.setAttributeNS = function (ns,name,value){
	var old = this.getAttributeNS(ns,name);
	
	if (old != value) {
		if (value != null && value !== false) {
			this.dom().setAttributeNS(ns,name,value);
		} else {
			this.dom().removeAttributeNS(ns,name);
		};
	};
	return this;
};




Imba.Tag.prototype.removeAttribute = function (name){
	return this.dom().removeAttribute(name);
};



Imba.Tag.prototype.getAttribute = function (name){
	return this.dom().getAttribute(name);
};


Imba.Tag.prototype.getAttributeNS = function (ns,name){
	return this.dom().getAttributeNS(ns,name);
};


Imba.Tag.prototype.set = function (key,value,mods){
	let setter = Imba.toSetter(key);
	if (this[setter] instanceof Function) {
		this[setter](value,mods);
	} else {
		this._dom.setAttribute(key,value);
	};
	return this;
};


Imba.Tag.prototype.get = function (key){
	return this._dom.getAttribute(key);
};



Imba.Tag.prototype.setContent = function (content,type){
	this.setChildren(content,type);
	return this;
};



Imba.Tag.prototype.setChildren = function (nodes,type){
	// overridden on client by reconciler
	this._tree_ = nodes;
	return this;
};



Imba.Tag.prototype.setTemplate = function (template){
	if (!this._template) {
		if (this.render == Imba.Tag.prototype.render) {
			this.render = this.renderTemplate; 
		};
	};
	
	this.template = this._template = template;
	return this;
};

Imba.Tag.prototype.template = function (){
	return null;
};



Imba.Tag.prototype.renderTemplate = function (){
	var body = this.template();
	if (body != this) { this.setChildren(body) };
	return this;
};




Imba.Tag.prototype.removeChild = function (child){
	var par = this.dom();
	var el = child._slot_ || child;
	if (el && el.parentNode == par) {
		Imba.TagManager.remove(el._tag || el,this);
		par.removeChild(el);
	};
	return this;
};



Imba.Tag.prototype.removeAllChildren = function (){
	if (this._dom.firstChild) {
		var el;
		while (el = this._dom.firstChild){
			true && Imba.TagManager.remove(el._tag || el,this);
			this._dom.removeChild(el);
		};
	};
	this._tree_ = this._text_ = null;
	return this;
};



Imba.Tag.prototype.appendChild = function (node){
	if ((typeof node=='string'||node instanceof String)) {
		this.dom().appendChild(Imba.document().createTextNode(node));
	} else if (node) {
		this.dom().appendChild(node._slot_ || node);
		Imba.TagManager.insert(node._tag || node,this);
		
	};
	return this;
};



Imba.Tag.prototype.insertBefore = function (node,rel){
	if ((typeof node=='string'||node instanceof String)) {
		node = Imba.document().createTextNode(node);
	};
	
	if (node && rel) {
		this.dom().insertBefore((node._slot_ || node),(rel._slot_ || rel));
		Imba.TagManager.insert(node._tag || node,this);
		
	};
	return this;
};

Imba.Tag.prototype.detachFromParent = function (){
	if (this._slot_ == this._dom) {
		this._slot_ = (this._dom._placeholder_ || (this._dom._placeholder_ = Imba.document().createComment("node")));
		this._slot_._tag || (this._slot_._tag = this);
		
		if (this._dom.parentNode) {
			Imba.TagManager.remove(this,this._dom.parentNode);
			this._dom.parentNode.replaceChild(this._slot_,this._dom);
		};
	};
	return this;
};

Imba.Tag.prototype.attachToParent = function (){
	if (this._slot_ != this._dom) {
		let prev = this._slot_;
		this._slot_ = this._dom;
		if (prev && prev.parentNode) {
			Imba.TagManager.insert(this);
			prev.parentNode.replaceChild(this._dom,prev);
		};
	};
	
	return this;
};



Imba.Tag.prototype.orphanize = function (){
	var par;
	if (par = this.parent()) { par.removeChild(this) };
	return this;
};



Imba.Tag.prototype.text = function (v){
	return this._dom.textContent;
};



Imba.Tag.prototype.setText = function (txt){
	this._tree_ = txt;
	this._dom.textContent = (txt == null || this.text() === false) ? '' : txt;
	this;
	return this;
};




Imba.Tag.prototype.dataset = function (key,val){
	if (key instanceof Object) {
		for (let v, i = 0, keys = Object.keys(key), l = keys.length, k; i < l; i++){
			k = keys[i];v = key[k];this.dataset(k,v);
		};
		return this;
	};
	
	if (arguments.length == 2) {
		this.setAttribute(("data-" + key),val);
		return this;
	};
	
	if (key) {
		return this.getAttribute(("data-" + key));
	};
	
	var dataset = this.dom().dataset;
	
	if (!dataset) {
		dataset = {};
		for (let i = 0, items = iter$(this.dom().attributes), len = items.length, atr; i < len; i++) {
			atr = items[i];
			if (atr.name.substr(0,5) == 'data-') {
				dataset[Imba.toCamelCase(atr.name.slice(5))] = atr.value;
			};
		};
	};
	
	return dataset;
};



Imba.Tag.prototype.render = function (){
	return this;
};



Imba.Tag.prototype.build = function (){
	return this;
};



Imba.Tag.prototype.setup = function (){
	return this;
};



Imba.Tag.prototype.commit = function (){
	if (this.beforeRender() !== false) this.render();
	return this;
};

Imba.Tag.prototype.beforeRender = function (){
	return this;
};



Imba.Tag.prototype.tick = function (){
	if (this.beforeRender() !== false) this.render();
	return this;
};



Imba.Tag.prototype.end = function (){
	this.setup();
	this.commit(0);
	this.end = Imba.Tag.end;
	return this;
};


Imba.Tag.prototype.$open = function (context){
	if (context != this._context_) {
		this._tree_ = null;
		this._context_ = context;
	};
	return this;
};



Imba.Tag.prototype.synced = function (){
	return this;
};




Imba.Tag.prototype.awaken = function (){
	return this;
};



Imba.Tag.prototype.flags = function (){
	return this._dom.classList;
};



Imba.Tag.prototype.flag = function (name,toggler){
	// it is most natural to treat a second undefined argument as a no-switch
	// so we need to check the arguments-length
	if (arguments.length == 2) {
		if (this._dom.classList.contains(name) != !!toggler) {
			this._dom.classList.toggle(name);
		};
	} else {
		// firefox will trigger a change if adding existing class
		if (!this._dom.classList.contains(name)) { this._dom.classList.add(name) };
	};
	return this;
};



Imba.Tag.prototype.unflag = function (name){
	this._dom.classList.remove(name);
	return this;
};



Imba.Tag.prototype.toggleFlag = function (name){
	this._dom.classList.toggle(name);
	return this;
};



Imba.Tag.prototype.hasFlag = function (name){
	return this._dom.classList.contains(name);
};


Imba.Tag.prototype.flagIf = function (flag,bool){
	var f = this._flags_ || (this._flags_ = {});
	let prev = f[flag];
	
	if (bool && !prev) {
		this._dom.classList.add(flag);
		f[flag] = true;
	} else if (prev && !bool) {
		this._dom.classList.remove(flag);
		f[flag] = false;
	};
	
	return this;
};



Imba.Tag.prototype.setFlag = function (name,value){
	let flags = this._namedFlags_ || (this._namedFlags_ = {});
	let prev = flags[name];
	if (prev != value) {
		if (prev) { this.unflag(prev) };
		if (value) { this.flag(value) };
		flags[name] = value;
	};
	return this;
};




Imba.Tag.prototype.scheduler = function (){
	return (this._scheduler == null) ? (this._scheduler = new Imba.Scheduler(this)) : this._scheduler;
};



Imba.Tag.prototype.schedule = function (options){
	if(options === undefined) options = {events: true};
	this.scheduler().configure(options).activate();
	return this;
};



Imba.Tag.prototype.unschedule = function (){
	if (this._scheduler) { this.scheduler().deactivate() };
	return this;
};




Imba.Tag.prototype.parent = function (){
	return Imba.getTagForDom(this.dom().parentNode);
};



Imba.Tag.prototype.children = function (sel){
	let res = [];
	for (let i = 0, items = iter$(this._dom.children), len = items.length, item; i < len; i++) {
		item = items[i];
		res.push(item._tag || Imba.getTagForDom(item));
	};
	return res;
};

Imba.Tag.prototype.querySelector = function (q){
	return Imba.getTagForDom(this._dom.querySelector(q));
};

Imba.Tag.prototype.querySelectorAll = function (q){
	var items = [];
	for (let i = 0, ary = iter$(this._dom.querySelectorAll(q)), len = ary.length; i < len; i++) {
		items.push(Imba.getTagForDom(ary[i]));
	};
	return items;
};



Imba.Tag.prototype.matches = function (sel){
	var fn;
	if (sel instanceof Function) {
		return sel(this);
	};
	
	if (sel.query instanceof Function) { sel = sel.query() };
	if (fn = (this._dom.matches || this._dom.matchesSelector || this._dom.webkitMatchesSelector || this._dom.msMatchesSelector || this._dom.mozMatchesSelector)) {
		return fn.call(this._dom,sel);
	};
};



Imba.Tag.prototype.closest = function (sel){
	return Imba.getTagForDom(this._dom.closest(sel));
};



Imba.Tag.prototype.contains = function (node){
	return this.dom().contains(node._dom || node);
};




Imba.Tag.prototype.log = function (){
	var $0 = arguments, i = $0.length;
	var args = new Array(i>0 ? i : 0);
	while(i>0) args[i-1] = $0[--i];
	args.unshift(console);
	Function.prototype.call.apply(console.log,args);
	return this;
};

Imba.Tag.prototype.css = function (key,val,mod){
	if (key instanceof Object) {
		for (let v, i = 0, keys = Object.keys(key), l = keys.length, k; i < l; i++){
			k = keys[i];v = key[k];this.css(k,v);
		};
		return this;
	};
	
	var name = Imba.CSSKeyMap[key] || key;
	
	if (val == null) {
		this.dom().style.removeProperty(name);
	} else if (val == undefined && arguments.length == 1) {
		return this.dom().style[name];
	} else if (name.match(/^--/)) {
		this.dom().style.setProperty(name,val);
	} else {
		if ((typeof val=='number'||val instanceof Number) && (name.match(/width|height|left|right|top|bottom/) || (mod && mod.px))) {
			this.dom().style[name] = val + "px";
		} else {
			this.dom().style[name] = val;
		};
	};
	return this;
};

Imba.Tag.prototype.setStyle = function (style){
	return this.setAttribute('style',style);
};

Imba.Tag.prototype.style = function (){
	return this.getAttribute('style');
};



Imba.Tag.prototype.trigger = function (name,data){
	if(data === undefined) data = {};
	return true && Imba.Events.trigger(name,this,{data: data});
};



Imba.Tag.prototype.focus = function (){
	this.dom().focus();
	return this;
};



Imba.Tag.prototype.blur = function (){
	this.dom().blur();
	return this;
};

Imba.Tag.prototype.toString = function (){
	return this.dom().outerHTML;
};


Imba.Tag.prototype.initialize = Imba.Tag;

Imba.SVGTag = function SVGTag(){ return Imba.Tag.apply(this,arguments) };

Imba.subclass(Imba.SVGTag,Imba.Tag);
Imba.SVGTag.namespaceURI = function (){
	return "http://www.w3.org/2000/svg";
};

Imba.SVGTag.buildNode = function (){
	var dom = Imba.document().createElementNS(this.namespaceURI(),this._nodeType);
	if (this._classes) {
		var cls = this._classes.join(" ");
		if (cls) { dom.className.baseVal = cls };
	};
	return dom;
};

Imba.SVGTag.inherit = function (child){
	child._protoDom = null;
	
	if (this == Imba.SVGTag) {
		child._nodeType = child._name;
		return child._classes = [];
	} else {
		child._nodeType = this._nodeType;
		var classes = (this._classes || []).slice(0);
		if (Imba.TAG_AUTOCLASS_SVG) {
			classes.push("_" + child._name.replace(/_/g,'-'));
		};
		return child._classes = classes;
	};
};


Imba.HTML_TAGS = "a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr".split(" ");
Imba.HTML_TAGS_UNSAFE = "article aside header section".split(" ");

Imba.HTML_ATTRS = {
	a: "href target hreflang media download rel type ping referrerpolicy",
	audio: "autoplay controls crossorigin loop muted preload src",
	area: "alt coords download href hreflang ping referrerpolicy rel shape target",
	base: "href target",
	video: "autoplay buffered controls crossorigin height loop muted preload poster src width playsinline",
	fieldset: "disabled form name",
	form: "method action enctype autocomplete target",
	button: "autofocus type form formaction formenctype formmethod formnovalidate formtarget value name",
	embed: "height src type width",
	input: "accept disabled form list max maxlength min minlength pattern required size step type",
	label: "accesskey for form",
	img: "alt src srcset crossorigin decoding height importance intrinsicsize ismap referrerpolicy sizes width usemap",
	link: "rel type href media",
	iframe: "allow allowfullscreen allowpaymentrequest height importance name referrerpolicy sandbox src srcdoc width frameborder align longdesc scrolling",
	meta: "property content charset desc http-equiv color-scheme name scheme",
	map: "name",
	optgroup: "label",
	option: "label",
	output: "for form",
	object: "type data width height",
	param: "name type value valuetype",
	progress: "max",
	script: "src type async defer crossorigin integrity nonce language nomodule",
	select: "size form multiple",
	source: "sizes src srcset type media",
	textarea: "rows cols minlength maxlength form wrap",
	track: "default kind label src srclang",
	td: "colspan rowspan headers",
	th: "colspan rowspan"
};


Imba.HTML_PROPS = {
	input: "autofocus autocomplete autocapitalize autocorrect value placeholder required disabled multiple checked readOnly spellcheck",
	textarea: "autofocus autocomplete autocapitalize autocorrect value placeholder required disabled multiple checked readOnly spellcheck",
	form: "novalidate",
	fieldset: "disabled",
	button: "disabled",
	select: "autofocus disabled required readOnly multiple",
	option: "disabled selected value",
	optgroup: "disabled",
	progress: "value",
	fieldset: "disabled",
	canvas: "width height"
};

var extender = function(obj,sup) {
	for (let v, i = 0, keys = Object.keys(sup), l = keys.length, k; i < l; i++){
		k = keys[i];v = sup[k];(obj[k] == null) ? (obj[k] = v) : obj[k];
	};
	
	obj.prototype = Object.create(sup.prototype);
	obj.__super__ = obj.prototype.__super__ = sup.prototype;
	obj.prototype.constructor = obj;
	if (sup.inherit) { sup.inherit(obj) };
	return obj;
};



function Tag(){
	return function(dom,ctx) {
		this.initialize(dom,ctx);
		return this;
	};
};

Imba.Tags = function Tags(){
	this;
};

Imba.Tags.prototype.__clone = function (ns){
	var clone = Object.create(this);
	clone._parent = this;
	return clone;
};

Imba.Tags.prototype.ns = function (name){
	return this['_' + name.toUpperCase()] || this.defineNamespace(name);
};

Imba.Tags.prototype.defineNamespace = function (name){
	var clone = Object.create(this);
	clone._parent = this;
	clone._ns = name;
	this['_' + name.toUpperCase()] = clone;
	return clone;
};

Imba.Tags.prototype.baseType = function (name,ns){
	return (Imba.indexOf(name,Imba.HTML_TAGS) >= 0) ? 'element' : 'div';
};

Imba.Tags.prototype.defineTag = function (fullName,supr,body){
	if(body==undefined && typeof supr == 'function') body = supr,supr = '';
	if(supr==undefined) supr = '';
	if (body && body._nodeType) {
		supr = body;
		body = null;
	};
	
	if (this[fullName]) {
		console.log("tag already exists?",fullName);
	};
	
	
	var ns;
	var name = fullName;
	let nsidx = name.indexOf(':');
	if (nsidx >= 0) {
		ns = fullName.substr(0,nsidx);
		name = fullName.substr(nsidx + 1);
		if (ns == 'svg' && !supr) {
			supr = 'svg:element';
		};
	};
	
	supr || (supr = this.baseType(fullName));
	
	let supertype = ((typeof supr=='string'||supr instanceof String)) ? this.findTagType(supr) : supr;
	let tagtype = Tag();
	
	tagtype._name = name;
	tagtype._flagName = null;
	
	if (name[0] == '#') {
		Imba.SINGLETONS[name.slice(1)] = tagtype;
		this[name] = tagtype;
	} else if (name[0] == name[0].toUpperCase()) {
		if (Imba.TAG_AUTOCLASS_LOCALS) {
			tagtype._flagName = name;
		};
	} else {
		if (Imba.TAG_AUTOCLASS_GLOBALS) {
			tagtype._flagName = "_" + fullName.replace(/[_\:]/g,'-');
		};
		this[fullName] = tagtype;
	};
	
	extender(tagtype,supertype);
	
	if (body) {
		body.call(tagtype,tagtype,tagtype.TAGS || this);
		if (tagtype.defined) { tagtype.defined() };
		this.optimizeTag(tagtype);
	};
	return tagtype;
};

Imba.Tags.prototype.defineSingleton = function (name,supr,body){
	return this.defineTag(name,supr,body);
};

Imba.Tags.prototype.extendTag = function (name,supr,body){
	if(body==undefined && typeof supr == 'function') body = supr,supr = '';
	if(supr==undefined) supr = '';
	var klass = (((typeof name=='string'||name instanceof String)) ? this.findTagType(name) : name);
	
	if (body) { body && body.call(klass,klass,klass.prototype) };
	if (klass.extended) { klass.extended() };
	this.optimizeTag(klass);
	return klass;
};

Imba.Tags.prototype.optimizeTag = function (tagtype){
	var prototype_;
	return (prototype_ = tagtype.prototype) && prototype_.optimizeTagStructure  &&  prototype_.optimizeTagStructure();
};

Imba.Tags.prototype.findTagType = function (type){
	var attrs, props;
	let klass = this[type];
	if (!klass) {
		if (type.substr(0,4) == 'svg:') {
			klass = this.defineTag(type,'svg:element');
		} else if (Imba.HTML_TAGS.indexOf(type) >= 0) {
			klass = this.defineTag(type,'element');
			
			if (attrs = Imba.HTML_ATTRS[type]) {
				for (let i = 0, items = iter$(attrs.split(" ")), len = items.length; i < len; i++) {
					Imba.attr(klass,items[i]);
				};
			};
			
			if (props = Imba.HTML_PROPS[type]) {
				for (let i = 0, items = iter$(props.split(" ")), len = items.length; i < len; i++) {
					Imba.attr(klass,items[i],{dom: true});
				};
			};
		};
	};
	return klass;
};

Imba.createElement = function (name,ctx,ref,pref){
	var type = name;
	var parent;
	if (name instanceof Function) {
		type = name;
	} else {
		if (null) {};
		type = Imba.TAGS.findTagType(name);
	};
	
	if (ctx instanceof TagMap) {
		parent = ctx.par$;
	} else if (pref instanceof Imba.Tag) {
		parent = pref;
	} else {
		parent = (ctx && pref != undefined) ? ctx[pref] : ((ctx && ctx._tag || ctx));
	};
	
	var node = type.build(parent);
	
	if (ctx instanceof TagMap) {
		ctx.i$++;
		node.$key = ref;
	};
	
	if (ctx && ref != undefined) {
		ctx[ref] = node;
	};
	
	return node;
};

Imba.createTagCache = function (owner){
	var item = [];
	item._tag = owner;
	return item;
};

Imba.createTagMap = function (ctx,ref,pref){
	var par = ((pref != undefined) ? pref : ctx._tag);
	var node = new TagMap(ctx,ref,par);
	ctx[ref] = node;
	return node;
};

Imba.createTagList = function (ctx,ref,pref){
	var node = [];
	node._type = 4;
	node._tag = ((pref != undefined) ? pref : ctx._tag);
	ctx[ref] = node;
	return node;
};

Imba.createTagLoopResult = function (ctx,ref,pref){
	var node = [];
	node._type = 5;
	node.cache = {i$: 0};
	return node;
};


function TagCache(owner){
	this._tag = owner;
	this;
};
TagCache.build = function (owner){
	var item = [];
	item._tag = owner;
	return item;
};



function TagMap(cache,ref,par){
	this.cache$ = cache;
	this.key$ = ref;
	this.par$ = par;
	this.i$ = 0;
};

TagMap.prototype.$iter = function (){
	var item = [];
	item._type = 5;
	item.cache = this;
	return item;
};

TagMap.prototype.$prune = function (items){
	let cache = this.cache$;
	let key = this.key$;
	let clone = new TagMap(cache,key,this.par$);
	for (let i = 0, ary = iter$(items), len = ary.length, item; i < len; i++) {
		item = ary[i];
		clone[item.key$] = item;
	};
	clone.i$ = items.length;
	return cache[key] = clone;
};

Imba.TagMap = TagMap;
Imba.TagCache = TagCache;
Imba.SINGLETONS = {};
Imba.TAGS = new Imba.Tags();
Imba.TAGS.element = Imba.TAGS.htmlelement = Imba.Tag;
Imba.TAGS['svg:element'] = Imba.SVGTag;

Imba.attr(Imba.Tag,'is');

Imba.defineTag = function (name,supr,body){
	if(body==undefined && typeof supr == 'function') body = supr,supr = '';
	if(supr==undefined) supr = '';
	return Imba.TAGS.defineTag(name,supr,body);
};

Imba.defineSingletonTag = function (id,supr,body){
	if(body==undefined && typeof supr == 'function') body = supr,supr = 'div';
	if(supr==undefined) supr = 'div';
	return Imba.TAGS.defineTag(this.name(),supr,body);
};

Imba.extendTag = function (name,body){
	return Imba.TAGS.extendTag(name,body);
};

Imba.getTagSingleton = function (id){
	var klass;
	var dom,node;
	
	if (klass = Imba.SINGLETONS[id]) {
		if (klass && klass.Instance) { return klass.Instance };
		
		
		if (dom = Imba.document().getElementById(id)) {
			// we have a live instance - when finding it through a selector we should awake it, no?
			// console.log('creating the singleton from existing node in dom?',id,type)
			node = klass.Instance = new klass(dom);
			node.awaken(dom); 
			return node;
		};
		
		dom = klass.createNode();
		dom.id = id;
		node = klass.Instance = new klass(dom);
		node.end().awaken(dom);
		return node;
	} else if (dom = Imba.document().getElementById(id)) {
		return Imba.getTagForDom(dom);
	};
};

var svgSupport = typeof SVGElement !== 'undefined';


Imba.getTagForDom = function (dom){
	if (!dom) { return null };
	if (dom._dom) { return dom };
	if (dom._tag) { return dom._tag };
	if (!dom.nodeName) { return null };
	
	var name = dom.nodeName.toLowerCase();
	var type = name;
	var ns = Imba.TAGS;
	
	if (dom.id && Imba.SINGLETONS[dom.id]) {
		return Imba.getTagSingleton(dom.id);
	};
	
	if (svgSupport && (dom instanceof SVGElement)) {
		type = ns.findTagType("svg:" + name);
	} else if (Imba.HTML_TAGS.indexOf(name) >= 0) {
		type = ns.findTagType(name);
	} else {
		type = Imba.Tag;
	};
	
	return new type(dom,null).awaken(dom);
};


if (false) {
	var styles = window.getComputedStyle(document.documentElement,'');
	
	for (let i = 0, items = iter$(styles), len = items.length, prefixed; i < len; i++) {
		prefixed = items[i];
		var unprefixed = prefixed.replace(/^-(webkit|ms|moz|o|blink)-/,'');
		var camelCase = unprefixed.replace(/-(\w)/g,function(m,a) { return a.toUpperCase(); });
		
		
		if (prefixed != unprefixed) {
			if (styles.hasOwnProperty(unprefixed)) { continue; };
		};
		
		
		Imba.CSSKeyMap[unprefixed] = Imba.CSSKeyMap[camelCase] = prefixed;
	};
	
	
	if (!document.documentElement.classList) {
		Imba.extendTag('element', function(tag){
			
			tag.prototype.hasFlag = function (ref){
				return new RegExp('(^|\\s)' + ref + '(\\s|$)').test(this._dom.className);
			};
			
			tag.prototype.addFlag = function (ref){
				if (this.hasFlag(ref)) { return this };
				this._dom.className += (this._dom.className ? ' ' : '') + ref;
				return this;
			};
			
			tag.prototype.unflag = function (ref){
				if (!this.hasFlag(ref)) { return this };
				var regex = new RegExp('(^|\\s)*' + ref + '(\\s|$)*','g');
				this._dom.className = this._dom.className.replace(regex,'');
				return this;
			};
			
			tag.prototype.toggleFlag = function (ref){
				return this.hasFlag(ref) ? this.unflag(ref) : this.flag(ref);
			};
			
			tag.prototype.flag = function (ref,bool){
				if (arguments.length == 2 && !!bool === false) {
					return this.unflag(ref);
				};
				return this.addFlag(ref);
			};
		});
	};
};

Imba.Tag;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var Imba = __webpack_require__(0);

Imba.defineTag('fragment', 'element', function(tag){
	tag.createNode = function (){
		return Imba.document().createDocumentFragment();
	};
});

Imba.extendTag('html', function(tag){
	tag.prototype.parent = function (){
		return null;
	};
});

Imba.extendTag('canvas', function(tag){
	tag.prototype.context = function (type){
		if(type === undefined) type = '2d';
		return this.dom().getContext(type);
	};
});

function DataProxy(node,path,args){
	this._node = node;
	this._path = path;
	this._args = args;
	if (this._args) { this._setter = Imba.toSetter(this._path) };
};

DataProxy.bind = function (receiver,data,path,args){
	let proxy = receiver._data || (receiver._data = new this(receiver,path,args));
	proxy.bind(data,path,args);
	return receiver;
};

DataProxy.prototype.bind = function (data,key,args){
	if (data != this._data) {
		this._data = data;
	};
	return this;
};

DataProxy.prototype.getFormValue = function (){
	return this._setter ? this._data[this._path]() : this._data[this._path];
};

DataProxy.prototype.setFormValue = function (value){
	return this._setter ? this._data[this._setter](value) : ((this._data[this._path] = value));
};


var isArray = function(val) {
	return val && val.splice && val.sort;
};

var isSimilarArray = function(a,b) {
	let l = a.length,i = 0;
	if (l != b.length) { return false };
	while (i++ < l){
		if (a[i] != b[i]) { return false };
	};
	return true;
};

Imba.extendTag('input', function(tag){
	tag.prototype.lazy = function(v){ return this._lazy; }
	tag.prototype.setLazy = function(v){ this._lazy = v; return this; };
	tag.prototype.number = function(v){ return this._number; }
	tag.prototype.setNumber = function(v){ this._number = v; return this; };
	
	tag.prototype.bindData = function (target,path,args){
		DataProxy.bind(this,target,path,args);
		return this;
	};
	
	tag.prototype.checked = function (){
		return this._dom.checked;
	};
	
	tag.prototype.setChecked = function (value){
		if (!!value != this._dom.checked) {
			this._dom.checked = !!value;
		};
		return this;
	};
	
	tag.prototype.setValue = function (value,source){
		if (this._localValue == undefined || source == undefined) {
			this.dom().value = this._value = value;
			this._localValue = undefined;
		};
		return this;
	};
	
	tag.prototype.setType = function (value){
		this.dom().type = this._type = value;
		return this;
	};
	
	tag.prototype.value = function (){
		let val = this._dom.value;
		return (this._number && val) ? parseFloat(val) : val;
	};
	
	tag.prototype.oninput = function (e){
		let val = this._dom.value;
		this._localValue = val;
		if (this._data && !(this.lazy()) && this.type() != 'radio' && this.type() != 'checkbox') {
			this._data.setFormValue(this.value(),this);
		};
		return;
	};
	
	tag.prototype.onchange = function (e){
		this._modelValue = this._localValue = undefined;
		if (!(this.data())) { return };
		
		if (this.type() == 'radio' || this.type() == 'checkbox') {
			let checked = this.checked();
			let mval = this._data.getFormValue(this);
			let dval = (this._value != undefined) ? this._value : this.value();
			
			if (this.type() == 'radio') {
				return this._data.setFormValue(dval,this);
			} else if (this.dom().value == 'on' || this.dom().value == undefined) {
				return this._data.setFormValue(!!checked,this);
			} else if (isArray(mval)) {
				let idx = mval.indexOf(dval);
				if (checked && idx == -1) {
					return mval.push(dval);
				} else if (!checked && idx >= 0) {
					return mval.splice(idx,1);
				};
			} else {
				return this._data.setFormValue(dval,this);
			};
		} else {
			return this._data.setFormValue(this.value());
		};
	};
	
	tag.prototype.onblur = function (e){
		return this._localValue = undefined;
	};
	
	
	tag.prototype.end = function (){
		if (this._localValue !== undefined || !this._data) {
			return this;
		};
		
		let mval = this._data.getFormValue(this);
		if (mval === this._modelValue) { return this };
		if (!isArray(mval)) { this._modelValue = mval };
		
		if (this.type() == 'radio' || this.type() == 'checkbox') {
			let dval = this._value;
			let checked = isArray(mval) ? (
				mval.indexOf(dval) >= 0
			) : ((this.dom().value == 'on' || this.dom().value == undefined) ? (
				!!mval
			) : (
				mval == this._value
			));
			
			this.setChecked(checked);
		} else {
			this._dom.value = mval;
		};
		return this;
	};
});

Imba.extendTag('textarea', function(tag){
	tag.prototype.lazy = function(v){ return this._lazy; }
	tag.prototype.setLazy = function(v){ this._lazy = v; return this; };
	
	tag.prototype.bindData = function (target,path,args){
		DataProxy.bind(this,target,path,args);
		return this;
	};
	
	tag.prototype.setValue = function (value,source){
		if (this._localValue == undefined || source == undefined) {
			this.dom().value = value;
			this._localValue = undefined;
		};
		return this;
	};
	
	tag.prototype.oninput = function (e){
		let val = this._dom.value;
		this._localValue = val;
		if (this._data && !(this.lazy())) { return this._data.setFormValue(this.value(),this) };
	};
	
	tag.prototype.onchange = function (e){
		this._localValue = undefined;
		if (this._data) { return this._data.setFormValue(this.value(),this) };
	};
	
	tag.prototype.onblur = function (e){
		return this._localValue = undefined;
	};
	
	tag.prototype.render = function (){
		if (this._localValue != undefined || !this._data) { return };
		if (this._data) {
			let dval = this._data.getFormValue(this);
			this._dom.value = (dval != undefined) ? dval : '';
		};
		return this;
	};
});

Imba.extendTag('option', function(tag){
	tag.prototype.setValue = function (value){
		if (value != this._value) {
			this.dom().value = this._value = value;
		};
		return this;
	};
	
	tag.prototype.value = function (){
		return this._value || this.dom().value;
	};
});

Imba.extendTag('select', function(tag){
	tag.prototype.bindData = function (target,path,args){
		DataProxy.bind(this,target,path,args);
		return this;
	};
	
	tag.prototype.setValue = function (value,syncing){
		let prev = this._value;
		this._value = value;
		if (!syncing) { this.syncValue(value) };
		return this;
	};
	
	tag.prototype.syncValue = function (value){
		let prev = this._syncValue;
		
		if (this.multiple() && (value instanceof Array)) {
			if ((prev instanceof Array) && isSimilarArray(prev,value)) {
				return this;
			};
			
			value = value.slice();
		};
		
		this._syncValue = value;
		
		if (typeof value == 'object') {
			let mult = this.multiple() && (value instanceof Array);
			
			for (let i = 0, items = iter$(this.dom().options), len = items.length, opt; i < len; i++) {
				opt = items[i];
				let oval = (opt._tag ? opt._tag.value() : opt.value);
				if (mult) {
					opt.selected = value.indexOf(oval) >= 0;
				} else if (value == oval) {
					this.dom().selectedIndex = i;
					break;
				};
			};
		} else {
			this.dom().value = value;
		};
		return this;
	};
	
	tag.prototype.value = function (){
		if (this.multiple()) {
			let res = [];
			for (let i = 0, items = iter$(this.dom().selectedOptions), len = items.length, option; i < len; i++) {
				option = items[i];
				res.push(option._tag ? option._tag.value() : option.value);
			};
			return res;
		} else {
			let opt = this.dom().selectedOptions[0];
			return opt ? ((opt._tag ? opt._tag.value() : opt.value)) : null;
		};
	};
	
	tag.prototype.onchange = function (e){
		if (this._data) { return this._data.setFormValue(this.value(),this) };
	};
	
	tag.prototype.end = function (){
		if (this._data) {
			this.setValue(this._data.getFormValue(this),1);
		};
		
		if (this._value != this._syncValue) {
			this.syncValue(this._value);
		};
		return this;
	};
});


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var Imba = __webpack_require__(0);










Imba.Touch = function Touch(event,pointer){
	// @native  = false
	this.setEvent(event);
	this.setData({});
	this.setActive(true);
	this._button = event && event.button || 0;
	this._suppress = false; 
	this._captured = false;
	this.setBubble(false);
	pointer = pointer;
	this.setUpdates(0);
	return this;
};

Imba.Touch.LastTimestamp = 0;
Imba.Touch.TapTimeout = 50;



var touches = [];
var count = 0;
var identifiers = {};

Imba.Touch.count = function (){
	return count;
};

Imba.Touch.lookup = function (item){
	return item && (item.__touch__ || identifiers[item.identifier]);
};

Imba.Touch.release = function (item,touch){
	var v_, $1;
	(((v_ = identifiers[item.identifier]),delete identifiers[item.identifier], v_));
	((($1 = item.__touch__),delete item.__touch__, $1));
	return;
};

Imba.Touch.ontouchstart = function (e){
	for (let i = 0, items = iter$(e.changedTouches), len = items.length, t; i < len; i++) {
		t = items[i];
		if (this.lookup(t)) { continue; };
		var touch = identifiers[t.identifier] = new this(e); 
		t.__touch__ = touch;
		touches.push(touch);
		count++;
		touch.touchstart(e,t);
	};
	return this;
};

Imba.Touch.ontouchmove = function (e){
	var touch;
	for (let i = 0, items = iter$(e.changedTouches), len = items.length, t; i < len; i++) {
		t = items[i];
		if (touch = this.lookup(t)) {
			touch.touchmove(e,t);
		};
	};
	
	return this;
};

Imba.Touch.ontouchend = function (e){
	var touch;
	for (let i = 0, items = iter$(e.changedTouches), len = items.length, t; i < len; i++) {
		t = items[i];
		if (touch = this.lookup(t)) {
			touch.touchend(e,t);
			this.release(t,touch);
			count--;
		};
	};
	
	
	
	
	return this;
};

Imba.Touch.ontouchcancel = function (e){
	var touch;
	for (let i = 0, items = iter$(e.changedTouches), len = items.length, t; i < len; i++) {
		t = items[i];
		if (touch = this.lookup(t)) {
			touch.touchcancel(e,t);
			this.release(t,touch);
			count--;
		};
	};
	return this;
};

Imba.Touch.onmousedown = function (e){
	return this;
};

Imba.Touch.onmousemove = function (e){
	return this;
};

Imba.Touch.onmouseup = function (e){
	return this;
};


Imba.Touch.prototype.phase = function(v){ return this._phase; }
Imba.Touch.prototype.setPhase = function(v){ this._phase = v; return this; };
Imba.Touch.prototype.active = function(v){ return this._active; }
Imba.Touch.prototype.setActive = function(v){ this._active = v; return this; };
Imba.Touch.prototype.event = function(v){ return this._event; }
Imba.Touch.prototype.setEvent = function(v){ this._event = v; return this; };
Imba.Touch.prototype.pointer = function(v){ return this._pointer; }
Imba.Touch.prototype.setPointer = function(v){ this._pointer = v; return this; };
Imba.Touch.prototype.target = function(v){ return this._target; }
Imba.Touch.prototype.setTarget = function(v){ this._target = v; return this; };
Imba.Touch.prototype.handler = function(v){ return this._handler; }
Imba.Touch.prototype.setHandler = function(v){ this._handler = v; return this; };
Imba.Touch.prototype.updates = function(v){ return this._updates; }
Imba.Touch.prototype.setUpdates = function(v){ this._updates = v; return this; };
Imba.Touch.prototype.suppress = function(v){ return this._suppress; }
Imba.Touch.prototype.setSuppress = function(v){ this._suppress = v; return this; };
Imba.Touch.prototype.data = function(v){ return this._data; }
Imba.Touch.prototype.setData = function(v){ this._data = v; return this; };
Imba.Touch.prototype.__bubble = {chainable: true,name: 'bubble'};
Imba.Touch.prototype.bubble = function(v){ return v !== undefined ? (this.setBubble(v),this) : this._bubble; }
Imba.Touch.prototype.setBubble = function(v){ this._bubble = v; return this; };
Imba.Touch.prototype.timestamp = function(v){ return this._timestamp; }
Imba.Touch.prototype.setTimestamp = function(v){ this._timestamp = v; return this; };

Imba.Touch.prototype.gestures = function(v){ return this._gestures; }
Imba.Touch.prototype.setGestures = function(v){ this._gestures = v; return this; };



Imba.Touch.prototype.capture = function (){
	this._captured = true;
	this._event && this._event.stopPropagation();
	if (!this._selblocker) {
		this._selblocker = function(e) { return e.preventDefault(); };
		Imba.document().addEventListener('selectstart',this._selblocker,true);
	};
	return this;
};

Imba.Touch.prototype.isCaptured = function (){
	return !!this._captured;
};



Imba.Touch.prototype.extend = function (plugin){
	// console.log "added gesture!!!"
	this._gestures || (this._gestures = []);
	this._gestures.push(plugin);
	return this;
};



Imba.Touch.prototype.redirect = function (target){
	this._redirect = target;
	return this;
};



Imba.Touch.prototype.suppress = function (){
	// collision with the suppress property
	this._active = false;
	
	return this;
};

Imba.Touch.prototype.setSuppress = function (value){
	console.warn('Imba.Touch#suppress= is deprecated');
	this._supress = value;
	this;
	return this;
};

Imba.Touch.prototype.touchstart = function (e,t){
	this._event = e;
	this._touch = t;
	this._button = 0;
	this._x = t.clientX;
	this._y = t.clientY;
	this.began();
	this.update();
	if (e && this.isCaptured()) { e.preventDefault() };
	return this;
};

Imba.Touch.prototype.touchmove = function (e,t){
	this._event = e;
	this._x = t.clientX;
	this._y = t.clientY;
	this.update();
	if (e && this.isCaptured()) { e.preventDefault() };
	return this;
};

Imba.Touch.prototype.touchend = function (e,t){
	this._event = e;
	this._x = t.clientX;
	this._y = t.clientY;
	this.ended();
	
	Imba.Touch.LastTimestamp = e.timeStamp;
	
	if (this._maxdr < 20) {
		var tap = new Imba.Event(e);
		tap.setType('tap');
		tap.process();
	};
	
	if (e && this.isCaptured()) {
		e.preventDefault();
	};
	
	return this;
};

Imba.Touch.prototype.touchcancel = function (e,t){
	return this.cancel();
};

Imba.Touch.prototype.mousedown = function (e,t){
	var self = this;
	self._event = e;
	self._button = e.button;
	self._x = t.clientX;
	self._y = t.clientY;
	self.began();
	self.update();
	self._mousemove = function(e) { return self.mousemove(e,e); };
	Imba.document().addEventListener('mousemove',self._mousemove,true);
	return self;
};

Imba.Touch.prototype.mousemove = function (e,t){
	this._x = t.clientX;
	this._y = t.clientY;
	this._event = e;
	if (this.isCaptured()) { e.preventDefault() };
	this.update();
	this.move();
	return this;
};

Imba.Touch.prototype.mouseup = function (e,t){
	this._x = t.clientX;
	this._y = t.clientY;
	this.ended();
	return this;
};

Imba.Touch.prototype.idle = function (){
	return this.update();
};

Imba.Touch.prototype.began = function (){
	this._timestamp = Date.now();
	this._maxdr = this._dr = 0;
	this._x0 = this._x;
	this._y0 = this._y;
	
	var dom = this.event().target;
	var node = null;
	
	this._sourceTarget = dom && Imba.getTagForDom(dom);
	
	while (dom){
		node = Imba.getTagForDom(dom);
		if (node && node.ontouchstart) {
			this._bubble = false;
			this.setTarget(node);
			this.target().ontouchstart(this);
			if (!this._bubble) { break; };
		};
		dom = dom.parentNode;
	};
	
	this._updates++;
	return this;
};

Imba.Touch.prototype.update = function (){
	var target_;
	if (!this._active || this._cancelled) { return this };
	
	var dr = Math.sqrt(this.dx() * this.dx() + this.dy() * this.dy());
	if (dr > this._dr) { this._maxdr = dr };
	this._dr = dr;
	
	
	if (this._redirect) {
		if (this._target && this._target.ontouchcancel) {
			this._target.ontouchcancel(this);
		};
		this.setTarget(this._redirect);
		this._redirect = null;
		if (this.target().ontouchstart) { this.target().ontouchstart(this) };
		if (this._redirect) { return this.update() }; 
	};
	
	
	this._updates++;
	if (this._gestures) {
		for (let i = 0, items = iter$(this._gestures), len = items.length; i < len; i++) {
			items[i].ontouchupdate(this);
		};
	};
	
	(target_ = this.target()) && target_.ontouchupdate  &&  target_.ontouchupdate(this);
	if (this._redirect) this.update();
	return this;
};

Imba.Touch.prototype.move = function (){
	var target_;
	if (!this._active || this._cancelled) { return this };
	
	if (this._gestures) {
		for (let i = 0, items = iter$(this._gestures), len = items.length, g; i < len; i++) {
			g = items[i];
			if (g.ontouchmove) { g.ontouchmove(this,this._event) };
		};
	};
	
	(target_ = this.target()) && target_.ontouchmove  &&  target_.ontouchmove(this,this._event);
	return this;
};

Imba.Touch.prototype.ended = function (){
	var target_;
	if (!this._active || this._cancelled) { return this };
	
	this._updates++;
	
	if (this._gestures) {
		for (let i = 0, items = iter$(this._gestures), len = items.length; i < len; i++) {
			items[i].ontouchend(this);
		};
	};
	
	(target_ = this.target()) && target_.ontouchend  &&  target_.ontouchend(this);
	this.cleanup_();
	return this;
};

Imba.Touch.prototype.cancel = function (){
	if (!this._cancelled) {
		this._cancelled = true;
		this.cancelled();
		this.cleanup_();
	};
	return this;
};

Imba.Touch.prototype.cancelled = function (){
	var target_;
	if (!this._active) { return this };
	
	this._cancelled = true;
	this._updates++;
	
	if (this._gestures) {
		for (let i = 0, items = iter$(this._gestures), len = items.length, g; i < len; i++) {
			g = items[i];
			if (g.ontouchcancel) { g.ontouchcancel(this) };
		};
	};
	
	(target_ = this.target()) && target_.ontouchcancel  &&  target_.ontouchcancel(this);
	return this;
};

Imba.Touch.prototype.cleanup_ = function (){
	if (this._mousemove) {
		Imba.document().removeEventListener('mousemove',this._mousemove,true);
		this._mousemove = null;
	};
	
	if (this._selblocker) {
		Imba.document().removeEventListener('selectstart',this._selblocker,true);
		this._selblocker = null;
	};
	
	return this;
};



Imba.Touch.prototype.dr = function (){
	return this._dr;
};



Imba.Touch.prototype.dx = function (){
	return this._x - this._x0;
};



Imba.Touch.prototype.dy = function (){
	return this._y - this._y0;
};



Imba.Touch.prototype.x0 = function (){
	return this._x0;
};



Imba.Touch.prototype.y0 = function (){
	return this._y0;
};



Imba.Touch.prototype.x = function (){
	return this._x;
};



Imba.Touch.prototype.y = function (){
	return this._y;
};



Imba.Touch.prototype.tx = function (){
	this._targetBox || (this._targetBox = this._target.dom().getBoundingClientRect());
	return this._x - this._targetBox.left;
};



Imba.Touch.prototype.ty = function (){
	this._targetBox || (this._targetBox = this._target.dom().getBoundingClientRect());
	return this._y - this._targetBox.top;
};



Imba.Touch.prototype.button = function (){
	return this._button;
}; 

Imba.Touch.prototype.sourceTarget = function (){
	return this._sourceTarget;
};

Imba.Touch.prototype.elapsed = function (){
	return Date.now() - this._timestamp;
};


Imba.TouchGesture = function TouchGesture(){ };

Imba.TouchGesture.prototype.__active = {'default': false,name: 'active'};
Imba.TouchGesture.prototype.active = function(v){ return this._active; }
Imba.TouchGesture.prototype.setActive = function(v){ this._active = v; return this; }
Imba.TouchGesture.prototype._active = false;

Imba.TouchGesture.prototype.ontouchstart = function (e){
	return this;
};

Imba.TouchGesture.prototype.ontouchupdate = function (e){
	return this;
};

Imba.TouchGesture.prototype.ontouchend = function (e){
	return this;
};



/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var Imba = __webpack_require__(0);

var keyCodes = {
	esc: 27,
	tab: 9,
	enter: 13,
	space: 32,
	up: 38,
	down: 40
};

var el = Imba.Tag.prototype;
el.stopModifier = function (e){
	return e.stop() || true;
};
el.preventModifier = function (e){
	return e.prevent() || true;
};
el.silenceModifier = function (e){
	return e.silence() || true;
};
el.bubbleModifier = function (e){
	return e.bubble(true) || true;
};
el.ctrlModifier = function (e){
	return e.event().ctrlKey == true;
};
el.altModifier = function (e){
	return e.event().altKey == true;
};
el.shiftModifier = function (e){
	return e.event().shiftKey == true;
};
el.metaModifier = function (e){
	return e.event().metaKey == true;
};
el.keyModifier = function (key,e){
	return e.keyCode() ? ((e.keyCode() == key)) : true;
};
el.delModifier = function (e){
	return e.keyCode() ? ((e.keyCode() == 8 || e.keyCode() == 46)) : true;
};
el.selfModifier = function (e){
	return e.event().target == this._dom;
};
el.leftModifier = function (e){
	return (e.button() != undefined) ? ((e.button() === 0)) : el.keyModifier(37,e);
};
el.rightModifier = function (e){
	return (e.button() != undefined) ? ((e.button() === 2)) : el.keyModifier(39,e);
};
el.middleModifier = function (e){
	return (e.button() != undefined) ? ((e.button() === 1)) : true;
};

el.getHandler = function (str,event){
	if (this[str]) {
		return this;
	};
	if (this._owner_ && this._owner_.getHandler) {
		return this._owner_.getHandler(str,event);
	};
};



Imba.Event = function Event(e){
	this.setEvent(e);
	this._bubble = true;
};



Imba.Event.prototype.event = function(v){ return this._event; }
Imba.Event.prototype.setEvent = function(v){ this._event = v; return this; };

Imba.Event.prototype.prefix = function(v){ return this._prefix; }
Imba.Event.prototype.setPrefix = function(v){ this._prefix = v; return this; };

Imba.Event.prototype.source = function(v){ return this._source; }
Imba.Event.prototype.setSource = function(v){ this._source = v; return this; };

Imba.Event.prototype.data = function(v){ return this._data; }
Imba.Event.prototype.setData = function(v){ this._data = v; return this; };

Imba.Event.prototype.responder = function(v){ return this._responder; }
Imba.Event.prototype.setResponder = function(v){ this._responder = v; return this; };

Imba.Event.wrap = function (e){
	return new this(e);
};

Imba.Event.prototype.setType = function (type){
	this._type = type;
	this;
	return this;
};



Imba.Event.prototype.type = function (){
	return this._type || this.event().type;
};
Imba.Event.prototype.native = function (){
	return this._event;
};

Imba.Event.prototype.name = function (){
	return this._name || (this._name = this.type().toLowerCase().replace(/\:/g,''));
};


Imba.Event.prototype.bubble = function (v){
	if (v != undefined) {
		this.setBubble(v);
		return this;
	};
	return this._bubble;
};

Imba.Event.prototype.setBubble = function (v){
	this._bubble = v;
	return this;
};



Imba.Event.prototype.stop = function (){
	this.setBubble(false);
	return this;
};

Imba.Event.prototype.stopPropagation = function (){
	return this.stop();
};
Imba.Event.prototype.halt = function (){
	return this.stop();
};


Imba.Event.prototype.prevent = function (){
	if (this.event().preventDefault) {
		this.event().preventDefault();
	} else {
		this.event().defaultPrevented = true;
	};
	this.defaultPrevented = true;
	return this;
};

Imba.Event.prototype.preventDefault = function (){
	console.warn("Event#preventDefault is deprecated - use Event#prevent");
	return this.prevent();
};



Imba.Event.prototype.isPrevented = function (){
	return this.event() && this.event().defaultPrevented;
};



Imba.Event.prototype.cancel = function (){
	console.warn("Event#cancel is deprecated - use Event#prevent");
	return this.prevent();
};

Imba.Event.prototype.silence = function (){
	this._silenced = true;
	return this;
};

Imba.Event.prototype.isSilenced = function (){
	return !!this._silenced;
};



Imba.Event.prototype.target = function (){
	return Imba.getTagForDom(this.event()._target || this.event().target);
};



Imba.Event.prototype.responder = function (){
	return this._responder;
};



Imba.Event.prototype.redirect = function (node){
	this._redirect = node;
	return this;
};

Imba.Event.prototype.processHandlers = function (node,handlers){
	let i = 1;
	let l = handlers.length;
	let bubble = this._bubble;
	let state = handlers.state || (handlers.state = {});
	let result;
	
	if (bubble) {
		this._bubble = 1;
	};
	
	while (i < l){
		let isMod = false;
		let handler = handlers[i++];
		let params = null;
		let context = node;
		let checkSpecial = false;
		
		if (handler instanceof Array) {
			params = handler.slice(1);
			checkSpecial = true;
			handler = handler[0];
		};
		
		if (typeof handler == 'string') {
			if (keyCodes[handler]) {
				params = [keyCodes[handler]];
				handler = 'key';
			};
			
			let mod = handler + 'Modifier';
			
			if (node[mod]) {
				isMod = true;
				params = (params || []).concat([this,state]);
				handler = node[mod];
			};
		};
		
		
		
		if (typeof handler == 'string') {
			let el = node;
			let fn = null;
			let ctx = state.context;
			
			if (ctx) {
				if (ctx.getHandler instanceof Function) {
					ctx = ctx.getHandler(handler,this);
				};
				
				if (ctx[handler] instanceof Function) {
					handler = fn = ctx[handler];
					context = ctx;
				};
			};
			
			if (!fn) {
				console.warn(("event " + this.type() + ": could not find '" + handler + "' in context"),ctx);
			};
			
			
			
			
			
			
			
			
			
			
			
		};
		
		if (handler instanceof Function) {
			// what if we actually call stop inside function?
			// do we still want to continue the chain?
			
			// loop through special variables from params?
			
			if (checkSpecial) {
				// replacing special params
				for (let i = 0, items = iter$(params), len = items.length, param; i < len; i++) {
					param = items[i];
					if (typeof param == 'string' && param[0] == '~' && param[1] == '$') {
						let name = param.slice(2);
						if (name == 'event') {
							params[i] = this;
						} else if (this[name] instanceof Function) {
							params[i] = this[name]();
						} else if (node[name] instanceof Function) {
							params[i] = node[name]();
						} else {
							console.warn(("Missing special handler $" + name));
						};
					};
				};
			};
			
			let res = handler.apply(context,params || [this]);
			
			if (!isMod) {
				this._responder || (this._responder = node);
			};
			
			if (res == false) {
				// console.log "returned false - breaking"
				break;
			};
			
			if (res && !this._silenced && (res.then instanceof Function)) {
				res.then(Imba.commit);
			};
		};
	};
	
	
	if (this._bubble === 1) {
		this._bubble = bubble;
	};
	
	return null;
};

Imba.Event.prototype.process = function (){
	var name = this.name();
	var meth = ("on" + (this._prefix || '') + name);
	var args = null;
	var domtarget = this.event()._target || this.event().target;
	var domnode = domtarget._responder || domtarget;
	
	var result;
	var handlers;
	
	while (domnode){
		this._redirect = null;
		let node = domnode._dom ? domnode : domnode._tag;
		
		if (node) {
			if (handlers = node._on_) {
				for (let i = 0, items = iter$(handlers), len = items.length, handler; i < len; i++) {
					handler = items[i];
					if (!handler) { continue; };
					let hname = handler[0];
					if (name == handler[0] && this.bubble()) {
						this.processHandlers(node,handler);
					};
				};
				if (!(this.bubble())) { break; };
			};
			
			if (this.bubble() && (node[meth] instanceof Function)) {
				this._responder || (this._responder = node);
				this._silenced = false;
				result = args ? node[meth].apply(node,args) : node[meth](this,this.data());
			};
			
			if (node.onevent) {
				node.onevent(this);
			};
		};
		
		
		if (!(this.bubble() && (domnode = (this._redirect || (node ? node.parent() : domnode.parentNode))))) {
			break;
		};
	};
	
	this.processed();
	
	
	
	if (result && (result.then instanceof Function)) {
		result.then(this.processed.bind(this));
	};
	return this;
};


Imba.Event.prototype.processed = function (){
	if (!this._silenced && this._responder) {
		Imba.emit(Imba,'event',[this]);
		Imba.commit(this.event());
	};
	return this;
};



Imba.Event.prototype.x = function (){
	return this.native().x;
};



Imba.Event.prototype.y = function (){
	return this.native().y;
};

Imba.Event.prototype.button = function (){
	return this.native().button;
};
Imba.Event.prototype.keyCode = function (){
	return this.native().keyCode;
};
Imba.Event.prototype.ctrl = function (){
	return this.native().ctrlKey;
};
Imba.Event.prototype.alt = function (){
	return this.native().altKey;
};
Imba.Event.prototype.shift = function (){
	return this.native().shiftKey;
};
Imba.Event.prototype.meta = function (){
	return this.native().metaKey;
};
Imba.Event.prototype.key = function (){
	return this.native().key;
};



Imba.Event.prototype.which = function (){
	return this.event().which;
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var self = {};
// externs;

var Imba = __webpack_require__(0);

var removeNested = function(root,node,caret) {
	// if node/nodes isa String
	// 	we need to use the caret to remove elements
	// 	for now we will simply not support this
	if (node instanceof Array) {
		for (let i = 0, items = iter$(node), len = items.length; i < len; i++) {
			removeNested(root,items[i],caret);
		};
	} else if (node && node._slot_) {
		root.removeChild(node);
	} else if (node != null) {
		// what if this is not null?!?!?
		// take a chance and remove a text-elementng
		let next = caret ? caret.nextSibling : root._dom.firstChild;
		if ((next instanceof Text) && next.textContent == node) {
			root.removeChild(next);
		} else {
			throw 'cannot remove string';
		};
	};
	
	return caret;
};

var appendNested = function(root,node) {
	if (node instanceof Array) {
		let i = 0;
		let c = node.taglen;
		let k = (c != null) ? ((node.domlen = c)) : node.length;
		while (i < k){
			appendNested(root,node[i++]);
		};
	} else if (node && node._dom) {
		root.appendChild(node);
	} else if (node != null && node !== false) {
		root.appendChild(Imba.createTextNode(node));
	};
	
	return;
};






var insertNestedBefore = function(root,node,before) {
	if (node instanceof Array) {
		let i = 0;
		let c = node.taglen;
		let k = (c != null) ? ((node.domlen = c)) : node.length;
		while (i < k){
			insertNestedBefore(root,node[i++],before);
		};
	} else if (node && node._dom) {
		root.insertBefore(node,before);
	} else if (node != null && node !== false) {
		root.insertBefore(Imba.createTextNode(node),before);
	};
	
	return before;
};


self.insertNestedAfter = function (root,node,after){
	var before = after ? after.nextSibling : root._dom.firstChild;
	
	if (before) {
		insertNestedBefore(root,node,before);
		return before.previousSibling;
	} else {
		appendNested(root,node);
		return root._dom.lastChild;
	};
};

var reconcileCollectionChanges = function(root,new$,old,caret) {
	
	var newLen = new$.length;
	var lastNew = new$[newLen - 1];
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	var newPosition = [];
	
	
	var prevChain = [];
	
	var lengthChain = [];
	
	
	var maxChainLength = 0;
	var maxChainEnd = 0;
	
	var hasTextNodes = false;
	var newPos;
	
	for (let idx = 0, items = iter$(old), len = items.length, node; idx < len; idx++) {
		// special case for Text nodes
		node = items[idx];
		if (node && node.nodeType == 3) {
			newPos = new$.indexOf(node.textContent);
			if (newPos >= 0) { new$[newPos] = node };
			hasTextNodes = true;
		} else {
			newPos = new$.indexOf(node);
		};
		
		newPosition.push(newPos);
		
		if (newPos == -1) {
			root.removeChild(node);
			prevChain.push(-1);
			lengthChain.push(-1);
			continue;
		};
		
		var prevIdx = newPosition.length - 2;
		
		
		while (prevIdx >= 0){
			if (newPosition[prevIdx] == -1) {
				prevIdx--;
			} else if (newPos > newPosition[prevIdx]) {
				// Yay, we're bigger than the previous!
				break;
			} else {
				// Nope, let's walk back the chain
				prevIdx = prevChain[prevIdx];
			};
		};
		
		prevChain.push(prevIdx);
		
		var currLength = (prevIdx == -1) ? 0 : (lengthChain[prevIdx] + 1);
		
		if (currLength > maxChainLength) {
			maxChainLength = currLength;
			maxChainEnd = idx;
		};
		
		lengthChain.push(currLength);
	};
	
	var stickyNodes = [];
	
	
	
	var cursor = newPosition.length - 1;
	while (cursor >= 0){
		if (cursor == maxChainEnd && newPosition[cursor] != -1) {
			stickyNodes[newPosition[cursor]] = true;
			maxChainEnd = prevChain[maxChainEnd];
		};
		
		cursor -= 1;
	};
	
	
	for (let idx = 0, items = iter$(new$), len = items.length, node; idx < len; idx++) {
		node = items[idx];
		if (!stickyNodes[idx]) {
			// create textnode for string, and update the array
			if (!(node && node._dom)) {
				node = new$[idx] = Imba.createTextNode(node);
			};
			
			var after = new$[idx - 1];
			self.insertNestedAfter(root,node,(after && after._slot_ || after || caret));
		};
		
		caret = node._slot_ || (caret && caret.nextSibling || root._dom.firstChild);
	};
	
	
	return lastNew && lastNew._slot_ || caret;
};



var reconcileCollection = function(root,new$,old,caret) {
	var k = new$.length;
	var i = k;
	var last = new$[k - 1];
	
	
	if (k == old.length && new$[0] === old[0]) {
		// running through to compare
		while (i--){
			if (new$[i] !== old[i]) { break; };
		};
	};
	
	if (i == -1) {
		return last && last._slot_ || last || caret;
	} else {
		return reconcileCollectionChanges(root,new$,old,caret);
	};
};



var reconcileLoop = function(root,new$,old,caret) {
	var nl = new$.length;
	var ol = old.length;
	var cl = new$.cache.i$; 
	var i = 0,d = nl - ol;
	
	
	
	
	while (i < ol && i < nl && new$[i] === old[i]){
		i++;
	};
	
	
	if (cl > 1000 && (cl - nl) > 500) {
		new$.cache.$prune(new$);
	};
	
	if (d > 0 && i == ol) {
		// added at end
		while (i < nl){
			root.appendChild(new$[i++]);
		};
		return;
	} else if (d > 0) {
		let i1 = nl;
		while (i1 > i && new$[i1 - 1] === old[i1 - 1 - d]){
			i1--;
		};
		
		if (d == (i1 - i)) {
			let before = old[i]._slot_;
			while (i < i1){
				root.insertBefore(new$[i++],before);
			};
			return;
		};
	} else if (d < 0 && i == nl) {
		// removed at end
		while (i < ol){
			root.removeChild(old[i++]);
		};
		return;
	} else if (d < 0) {
		let i1 = ol;
		while (i1 > i && new$[i1 - 1 + d] === old[i1 - 1]){
			i1--;
		};
		
		if (d == (i - i1)) {
			while (i < i1){
				root.removeChild(old[i++]);
			};
			return;
		};
	} else if (i == nl) {
		return;
	};
	
	return reconcileCollectionChanges(root,new$,old,caret);
};


var reconcileIndexedArray = function(root,array,old,caret) {
	var newLen = array.taglen;
	var prevLen = array.domlen || 0;
	var last = newLen ? array[newLen - 1] : null;
	
	
	if (prevLen > newLen) {
		while (prevLen > newLen){
			var item = array[--prevLen];
			root.removeChild(item._slot_);
		};
	} else if (newLen > prevLen) {
		// find the item to insert before
		let prevLast = prevLen ? array[prevLen - 1]._slot_ : caret;
		let before = prevLast ? prevLast.nextSibling : root._dom.firstChild;
		
		while (prevLen < newLen){
			let node = array[prevLen++];
			before ? root.insertBefore(node._slot_,before) : root.appendChild(node._slot_);
		};
	};
	
	array.domlen = newLen;
	return last ? last._slot_ : caret;
};




var reconcileNested = function(root,new$,old,caret) {
	
	// var skipnew = new == null or new === false or new === true
	var newIsNull = new$ == null || new$ === false;
	var oldIsNull = old == null || old === false;
	
	
	if (new$ === old) {
		// remember that the caret must be an actual dom element
		// we should instead move the actual caret? - trust
		if (newIsNull) {
			return caret;
		} else if (new$._slot_) {
			return new$._slot_;
		} else if ((new$ instanceof Array) && new$.taglen != null) {
			return reconcileIndexedArray(root,new$,old,caret);
		} else {
			return caret ? caret.nextSibling : root._dom.firstChild;
		};
	} else if (new$ instanceof Array) {
		if (old instanceof Array) {
			// look for slot instead?
			let typ = new$.static;
			if (typ || old.static) {
				// if the static is not nested - we could get a hint from compiler
				// and just skip it
				if (typ == old.static) { // should also include a reference?
					for (let i = 0, items = iter$(new$), len = items.length; i < len; i++) {
						// this is where we could do the triple equal directly
						caret = reconcileNested(root,items[i],old[i],caret);
					};
					return caret;
				} else {
					removeNested(root,old,caret);
				};
				
				
			} else {
				// Could use optimized loop if we know that it only consists of nodes
				return reconcileCollection(root,new$,old,caret);
			};
		} else if (!oldIsNull) {
			if (old._slot_) {
				root.removeChild(old);
			} else {
				// old was a string-like object?
				root.removeChild(caret ? caret.nextSibling : root._dom.firstChild);
			};
		};
		
		return self.insertNestedAfter(root,new$,caret);
		
	} else if (!newIsNull && new$._slot_) {
		if (!oldIsNull) { removeNested(root,old,caret) };
		return self.insertNestedAfter(root,new$,caret);
	} else if (newIsNull) {
		if (!oldIsNull) { removeNested(root,old,caret) };
		return caret;
	} else {
		// if old did not exist we need to add a new directly
		let nextNode;
		
		if (old instanceof Array) {
			removeNested(root,old,caret);
		} else if (old && old._slot_) {
			root.removeChild(old);
		} else if (!oldIsNull) {
			// ...
			nextNode = caret ? caret.nextSibling : root._dom.firstChild;
			if ((nextNode instanceof Text) && nextNode.textContent != new$) {
				nextNode.textContent = new$;
				return nextNode;
			};
		};
		
		
		return self.insertNestedAfter(root,new$,caret);
	};
};


Imba.extendTag('element', function(tag){
	
	// 1 - static shape - unknown content
	// 2 - static shape and static children
	// 3 - single item
	// 4 - optimized array - only length will change
	// 5 - optimized collection
	// 6 - text only
	
	tag.prototype.setChildren = function (new$,typ){
		// if typeof new == 'string'
		// 	return self.text = new
		var old = this._tree_;
		
		if (new$ === old && (!(new$) || new$.taglen == undefined)) {
			return this;
		};
		
		if (!old && typ != 3) {
			this.removeAllChildren();
			appendNested(this,new$);
		} else if (typ == 1) {
			let caret = null;
			for (let i = 0, items = iter$(new$), len = items.length; i < len; i++) {
				caret = reconcileNested(this,items[i],old[i],caret);
			};
		} else if (typ == 2) {
			return this;
		} else if (typ == 3) {
			let ntyp = typeof new$;
			
			if (ntyp != 'object') {
				return this.setText(new$);
			};
			
			if (new$ && new$._dom) {
				this.removeAllChildren();
				this.appendChild(new$);
			} else if (new$ instanceof Array) {
				if (new$._type == 5 && old && old._type == 5) {
					reconcileLoop(this,new$,old,null);
				} else if (old instanceof Array) {
					reconcileNested(this,new$,old,null);
				} else {
					this.removeAllChildren();
					appendNested(this,new$);
				};
			} else {
				return this.setText(new$);
			};
		} else if (typ == 4) {
			reconcileIndexedArray(this,new$,old,null);
		} else if (typ == 5) {
			reconcileLoop(this,new$,old,null);
		} else if ((new$ instanceof Array) && (old instanceof Array)) {
			reconcileNested(this,new$,old,null);
		} else {
			// what if text?
			this.removeAllChildren();
			appendNested(this,new$);
		};
		
		this._tree_ = new$;
		return this;
	};
	
	tag.prototype.content = function (){
		return this._content || this.children().toArray();
	};
	
	tag.prototype.setText = function (text){
		if (text != this._tree_) {
			var val = (text === null || text === false) ? '' : text;
			(this._text_ || this._dom).textContent = val;
			this._text_ || (this._text_ = this._dom.firstChild);
			this._tree_ = text;
		};
		return this;
	};
});


var proto = Imba.Tag.prototype;
proto.setContent = proto.setChildren;


var apple = typeof navigator != 'undefined' && (navigator.vendor || '').indexOf('Apple') == 0;
if (apple) {
	proto.setText = function (text){
		if (text != this._tree_) {
			this._dom.textContent = ((text === null || text === false) ? '' : text);
			this._tree_ = text;
		};
		return this;
	};
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
function Game(_0){
	var dict;
	for (let k in dict = (_0)){
		let v;
		v = dict[k];if (_0) { this[("_" + k)] = (_0)[k] };
	};
};
exports.Game = Game; // export class 
Game.prototype.keys = function(v){ return this._keys; }
Game.prototype.setKeys = function(v){ this._keys = v; return this; };
Game.prototype.time = function(v){ return this._time; }
Game.prototype.setTime = function(v){ this._time = v; return this; };
Game.prototype.height = function(v){ return this._height; }
Game.prototype.setHeight = function(v){ this._height = v; return this; };
Game.prototype.width = function(v){ return this._width; }
Game.prototype.setWidth = function(v){ this._width = v; return this; };
Game.prototype.barrels = function(v){ return this._barrels; }
Game.prototype.setBarrels = function(v){ this._barrels = v; return this; };
Game.prototype.boxes = function(v){ return this._boxes; }
Game.prototype.setBoxes = function(v){ this._boxes = v; return this; };
Game.prototype.themeStarted = function(v){ return this._themeStarted; }
Game.prototype.setThemeStarted = function(v){ this._themeStarted = v; return this; };
Game.prototype.player = function(v){ return this._player; }
Game.prototype.setPlayer = function(v){ this._player = v; return this; };
Game.prototype.crosshair = function(v){ return this._crosshair; }
Game.prototype.setCrosshair = function(v){ this._crosshair = v; return this; };
Game.prototype.zombies = function(v){ return this._zombies; }
Game.prototype.setZombies = function(v){ this._zombies = v; return this; };
Game.prototype.sectors = function(v){ return this._sectors; }
Game.prototype.setSectors = function(v){ this._sectors = v; return this; };
Game.prototype.menu = function(v){ return this._menu; }
Game.prototype.setMenu = function(v){ this._menu = v; return this; };

Game.prototype.startTheme = function (){
	if (this.themeStarted()) { return };
	this.setThemeStarted(true);
	let theme0 = new Audio('sounds/theme1.mp3');
	theme0.volume = 0.5;
	let theme1 = new Audio('sounds/theme0.mp3');
	theme1.volume = 0.5;
	let theme2 = new Audio('sounds/theme2.mp3');
	theme2.volume = 0.5;
	let theme3 = new Audio('sounds/theme3.mp3');
	theme3.volume = 0.5;
	theme0.onended = function() { return theme1.play(); };
	theme1.onended = function() { return theme2.play(); };
	theme2.onended = function() { return theme3.play(); };
	theme3.onended = function() { return theme0.play(); };
	return theme0.play();
};

Game.prototype.initListners = function (){
	var self = this;
	document.addEventListener('keydown',function(e) {
		if (self.menu()) { return };
		self.keydown(e);
		return self.startTheme();
	});
	
	document.addEventListener('keyup',function(e) {
		if (e.code == 'Escape') {
			self.setMenu(!(self.menu()));
		};
		if (self.menu()) { return };
		return self.keyup(e);
	});
	
	document.addEventListener('mousemove',function(e) {
		return self.aim(e);
	});
	
	document.addEventListener('mousedown',function(e) {
		if (self.menu()) { return };
		if (e.button == 0) { self.keys().leftbutton = true };
		if (e.button == 2) { self.keys().rightbutton = true };
		if (e.button == 0) { self.player().shoot() };
		if (e.button == 2) { return self.player().attack() };
	});
	
	document.addEventListener('mouseup',function(e) {
		if (self.menu()) { return };
		if (e.button == 2) { self.keys().rightbutton = false };
		if (e.button == 0) { return self.keys().leftbutton = false };
	});
	
	return document.addEventListener('contextmenu',function(e) {
		return e.preventDefault();
	});
};

Game.prototype.aim = function (e){
	var v_;
	this.crosshair().setX(e.x);
	this.crosshair().setY(-e.y);
	return (this.player().setRotation(v_ = ((Math.atan2(e.x - window.innerWidth / 2,e.y - window.innerHeight / 2) / 3.1415 * 180.0 - 90) + 720) % 360),v_);
};

Game.prototype.keydown = function (e){
	if (this.menu()) { return };
	if (e.code == 'Digit1' && this.player().invertory().knife) { this.player().changeGun('knife') };
	if (e.code == 'Digit2' && this.player().invertory().handgun) { this.player().changeGun('handgun') };
	if (e.code == 'Digit3' && this.player().invertory().rifle) { this.player().changeGun('rifle') };
	if (e.code == 'Digit4' && this.player().invertory().shotgun) { this.player().changeGun('shotgun') };
	if (e.code == 'KeyF' && this.player().invertory().flashlight) { this.player().changeGun('flashlight') };
	if (e.code == 'KeyR') { this.player().reload() };
	return this.keys()[e.code] = true;
};

Game.prototype.keyup = function (e){
	return this.keys()[e.code] = false;
};


Game.prototype.update = function (){
	var v_;
	if (this.menu()) { return };
	for (let i = 0, items = iter$(this.zombies()), len = items.length, zombie; i < len; i++) {
		zombie = items[i];
		if (zombie) { zombie.update() };
	};
	for (let i = 0, items = iter$(this.player().bullets()), len = items.length, bullet; i < len; i++) {
		bullet = items[i];
		if (bullet) { bullet.update(this.zombies(),this,this.player()) };
	};
	
	if (this.keys().leftbutton) { this.player().shoot() };
	if (this.keys().rightbutton) { this.player().attack() };
	this.setWidth(window.innerWidth);
	this.setHeight(window.innerHeight);
	let directions = [];
	if (this.keys().KeyA) { directions.push('left') };
	if (this.keys().KeyD) { directions.push('right') };
	if (this.keys().KeyS) { directions.push('down') };
	if (this.keys().KeyW) { directions.push('up') };
	this.player().setRunning(this.keys().ShiftLeft);
	this.player().move(directions);
	return (this.setTime(v_ = this.time() + 1),v_);
};




/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var Bullet = __webpack_require__(17).Bullet;

function Player(_0){
	var dict;
	for (let k in dict = (_0)){
		let v;
		v = dict[k];if (_0) { this[("_" + k)] = (_0)[k] };
	};
};
exports.Player = Player; // export class 
Player.prototype.invertory = function(v){ return this._invertory; }
Player.prototype.setInvertory = function(v){ this._invertory = v; return this; };
Player.prototype.gun = function(v){ return this._gun; }
Player.prototype.setGun = function(v){ this._gun = v; return this; };
Player.prototype.pos = function(v){ return this._pos; }
Player.prototype.setPos = function(v){ this._pos = v; return this; };
Player.prototype.rotation = function(v){ return this._rotation; }
Player.prototype.setRotation = function(v){ this._rotation = v; return this; };
Player.prototype.canShoot = function(v){ return this._canShoot; }
Player.prototype.setCanShoot = function(v){ this._canShoot = v; return this; };
Player.prototype.canAttack = function(v){ return this._canAttack; }
Player.prototype.setCanAttack = function(v){ this._canAttack = v; return this; };
Player.prototype.speed = function(v){ return this._speed; }
Player.prototype.setSpeed = function(v){ this._speed = v; return this; };
Player.prototype.running = function(v){ return this._running; }
Player.prototype.setRunning = function(v){ this._running = v; return this; };
Player.prototype.__reputation = {'default': 0,name: 'reputation'};
Player.prototype.reputation = function(v){ return this._reputation; }
Player.prototype.setReputation = function(v){ this._reputation = v; return this; }
Player.prototype._reputation = 0;
Player.prototype.animation = function(v){ return this._animation; }
Player.prototype.setAnimation = function(v){ this._animation = v; return this; };
Player.prototype.animations = function(v){ return this._animations; }
Player.prototype.setAnimations = function(v){ this._animations = v; return this; };
Player.prototype.feetAnimation = function(v){ return this._feetAnimation; }
Player.prototype.setFeetAnimation = function(v){ this._feetAnimation = v; return this; };
Player.prototype.feetAnimations = function(v){ return this._feetAnimations; }
Player.prototype.setFeetAnimations = function(v){ this._feetAnimations = v; return this; };
Player.prototype.game = function(v){ return this._game; }
Player.prototype.setGame = function(v){ this._game = v; return this; };
Player.prototype.zombies = function(v){ return this._zombies; }
Player.prototype.setZombies = function(v){ this._zombies = v; return this; };
Player.prototype.barrels = function(v){ return this._barrels; }
Player.prototype.setBarrels = function(v){ this._barrels = v; return this; };
Player.prototype.boxes = function(v){ return this._boxes; }
Player.prototype.setBoxes = function(v){ this._boxes = v; return this; };
Player.prototype.__bullets = {'default': [],name: 'bullets'};
Player.prototype.bullets = function(v){ return this._bullets; }
Player.prototype.setBullets = function(v){ this._bullets = v; return this; }
Player.prototype._bullets = [];
Player.prototype.__life = {'default': 100,name: 'life'};
Player.prototype.life = function(v){ return this._life; }
Player.prototype.setLife = function(v){ this._life = v; return this; }
Player.prototype._life = 100;
Player.prototype.bloodRotation = function(v){ return this._bloodRotation; }
Player.prototype.setBloodRotation = function(v){ this._bloodRotation = v; return this; };
Player.prototype.cancelReloading = function(v){ return this._cancelReloading; }
Player.prototype.setCancelReloading = function(v){ this._cancelReloading = v; return this; };

Player.prototype.shooting = function(v){ return this._shooting; }
Player.prototype.setShooting = function(v){ this._shooting = v; return this; };
Player.prototype.reloading = function(v){ return this._reloading; }
Player.prototype.setReloading = function(v){ this._reloading = v; return this; };
Player.prototype.running = function(v){ return this._running; }
Player.prototype.setRunning = function(v){ this._running = v; return this; };
Player.prototype.attacking = function(v){ return this._attacking; }
Player.prototype.setAttacking = function(v){ this._attacking = v; return this; };
Player.prototype.takingHit = function(v){ return this._takingHit; }
Player.prototype.setTakingHit = function(v){ this._takingHit = v; return this; };


Player.prototype.takeHit = function (damage){
	var self = this, v_;
	if (!(self.takingHit())) {
		let audio = new Audio(("sounds/survivor_yell/3yell" + (~~(Math.random() * 10)) + ".wav"));
		audio.play();
		audio = new Audio(("sounds/zombie_hit/" + (~~(Math.random() * 4)) + ".wav"));
		audio.play();
		self.setBloodRotation(Math.random() * 360);
		self.setTakingHit(~~(Math.random() * 2 + 1));
		setTimeout(function() { return (self.setTakingHit(false),false); },1200);
	};
	return (self.setLife(v_ = self.life() - damage),v_);
};

Player.prototype.distanceToX = function (obj){
	return Math.abs(obj.x - this.pos().x);
};

Player.prototype.distanceToY = function (obj){
	return Math.abs(obj.y - this.pos().y);
};

Player.prototype.colisionObj = function (){
	let sector = ("x" + (~~(this.pos().x / 500)) + "y" + (~~(this.pos().y / 500)));
	for (let i = 0, items = iter$(this.game().sectors()[sector]), len = items.length, obj; i < len; i++) {
		obj = items[i];
		if (this.distanceToX(obj) < obj.size && this.distanceToY(obj) < obj.size) {
			return true;
		};
	};
	return false;
};

Player.prototype.move = function (directions){
	var v_;
	if (this.running() && directions.length) { (this.setFeetAnimation(v_ = this.feetAnimations().run),v_) };
	if (!(this.running()) && directions.length) { (this.setFeetAnimation(v_ = this.feetAnimations().walk),v_) };
	if (!directions.length) { (this.setFeetAnimation(v_ = this.feetAnimations().idle),v_) };
	let step;
	if (!(this.reloading()) && !(this.shooting()) && !(this.attacking())) {
		if (directions.length) { (this.setAnimation(v_ = this.animations()[this.gun().name()].move),v_) };
		if (!directions.length) { (this.setAnimation(v_ = this.animations()[this.gun().name()].idle),v_) };
	};
	if (directions.length > 1) {
		step = this.speed() * 0.7;
	} else {
		step = this.speed();
	};
	
	if (this.running()) {
		step *= 2;
	};
	
	for (let i = 0, items = iter$(directions), len = items.length; i < len; i++) {
		switch (items[i]) {
			case 'left': {
				this.pos().x -= step;
				break;
			}
			case 'right': {
				this.pos().x += step;
				break;
			}
			case 'down': {
				this.pos().y -= step;
				break;
			}
			case 'up': {
				this.pos().y += step;
				break;
			}
		};
	};
	
	if (this.colisionObj()) {
		let res = [];
		for (let i = 0, items = iter$(directions), len = items.length; i < len; i++) {
			switch (items[i]) {
				case 'left': {
					res.push((this.pos().x += step));
					break;
				}
				case 'right': {
					res.push((this.pos().x -= step));
					break;
				}
				case 'down': {
					res.push((this.pos().y += step));
					break;
				}
				case 'up': {
					res.push((this.pos().y -= step));
					break;
				}
			};
		};
		return res;
	};
};

Player.prototype.angleToZombie = function (zombie){
	let dx = this.pos().x - zombie.pos().x;
	let dy = this.pos().y - zombie.pos().y;
	return Math.abs(this.rotation() + (Math.atan2(dx,dy) / 3.1415 * 180.0) + 150) % 360;
};

Player.prototype.bulletInitPos = function (){
	if ((this.rotation() < 360 && this.rotation() > 280) || (this.rotation() < 180 && this.rotation() > 90)) {
		return {
			x: Math.cos((this.rotation()) * 3.1415 / 180) * 100 + this.pos().x,
			y: Math.sin((this.rotation()) * 3.1415 / 180) * 50 + this.pos().y
		};
	} else {
		return {
			x: Math.cos((this.rotation()) * 3.1415 / 180) * 100 + this.pos().x,
			y: Math.sin((this.rotation()) * 3.1415 / 180) * 150 + this.pos().y
		};
	};
};

Player.prototype.generateBullet = function (){
	return this.bullets().push(new Bullet(
		{player: this,
		pos: this.bulletInitPos(),
		direction: this.rotation() + (Math.random() * 200 / this.gun().accuracy() - 100 / this.gun().accuracy()),
		power: this.gun().power(),
		damage: this.gun().damage()}
	));
};

Player.prototype.changeGun = function (to){
	if (this.reloading()) { (this.setCancelReloading(true),true) };
	this.setReloading(false);
	this.setAttacking(false);
	return (this.setGun(this.invertory()[to]),this.invertory()[to]);
};

Player.prototype.shoot = function (){
	var self = this, gun_;
	if (!(self.gun().ammo() || self.reloading())) self.reload();
	if (['flashlight','knife'].includes(self.gun().name())) { return self.attack() };
	if (self.gun().ammo() && self.canShoot() && !(self.reloading())) {
		let shot = self.gun().shootSounds()[~~(Math.random() * self.gun().shootSounds().length)];
		let audio = new Audio(shot.src);
		audio.volume = shot.volume;
		audio.play();
		if (self.gun().name() == 'shotgun') {
			for (let j = 0, items = [0,0,0,0,0,0], len = items.length; j < len; j++) {
				self.generateBullet();
			};
		} else {
			self.generateBullet();
		};
		(gun_ = self.gun()).setAmmo(gun_.ammo() - 1);
		self.setCanShoot(false);
		self.setShooting(true);
		self.setAnimation(self.animations()[self.gun().name()].shoot);
		setTimeout(function() { return (self.setCanShoot(true),true); },1000 / self.gun().rate());
		return setTimeout(function() { return (self.setShooting(false),false); },30);
	};
};

Player.prototype.attack = function (){
	var self = this;
	if (self.canAttack()) {
		let audio = new Audio(("sounds/melee" + (~~(Math.random() * 3)) + ".wav"));
		audio.volume = 0.6;
		audio.play();
		setTimeout(function() { var v_;
		return (((v_ = audio),delete audio, v_)); },1500);
		self.setCanAttack(false);
		self.setAttacking(true);
		self.setAnimation(self.animations()[self.gun().name()].attack);
		setTimeout(function() {
			let damage = 5;
			if (self.gun().name() == 'knife') { let damage = 25 };
			let res = [];
			for (let i = 0, items = iter$(self.zombies()), len = items.length, zombie; i < len; i++) {
				zombie = items[i];
				res.push((zombie.distanceToPlayerX() < 120 && zombie.distanceToPlayerY() < 120 && self.angleToZombie(zombie) < 180) && (
					zombie.takeHit({damage: function() { return damage; },power: function() { return 50; }})
				));
			};
			return res;
		},10 * 15 * 1);
		return setTimeout(function() {
			self.setCanAttack(true);
			return (self.setAttacking(false),false);
		},10 * 15 * 3.8);
	};
};

Player.prototype.reload = function (){
	var self = this;
	if (self.gun().ammo() != self.gun().cap() && !(self.reloading())) {
		self.game().setTime(0);
		let audio = new Audio('sounds/shotgun_reload.wav');
		let audio2 = new Audio('sounds/shotgun_pump.wav');
		audio.play();
		audio2.play();
		self.setCanShoot(false);
		self.setReloading(true);
		self.setAnimation(self.animations()[self.gun().name()].reload);
		return setTimeout(function() {
			var v_, $1, cap_;
			self.setReloading(false);
			(((v_ = audio),delete audio, v_));
			audio2.pause();
			((($1 = audio2),delete audio2, $1));
			if (self.cancelReloading()) {
				return (self.setCancelReloading(false),false);
			} else {
				self.setCanShoot(true);
				return (self.gun().setAmmo(cap_ = self.gun().cap()),cap_);
			};
		},self.gun().reloadTime());
	};
};




/***/ }),
/* 17 */
/***/ (function(module, exports) {

function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
function Bullet(_0){
	var dict;
	for (let k in dict = (_0)){
		let v;
		v = dict[k];if (_0) { this[("_" + k)] = (_0)[k] };
	};
	this.fly();
};
exports.Bullet = Bullet; // export class 
Bullet.prototype.power = function(v){ return this._power; }
Bullet.prototype.setPower = function(v){ this._power = v; return this; };
Bullet.prototype.damage = function(v){ return this._damage; }
Bullet.prototype.setDamage = function(v){ this._damage = v; return this; };
Bullet.prototype.player = function(v){ return this._player; }
Bullet.prototype.setPlayer = function(v){ this._player = v; return this; };
Bullet.prototype.direction = function(v){ return this._direction; }
Bullet.prototype.setDirection = function(v){ this._direction = v; return this; };
Bullet.prototype.pos = function(v){ return this._pos; }
Bullet.prototype.setPos = function(v){ this._pos = v; return this; };
Bullet.prototype.__i = {'default': 0,name: 'i'};
Bullet.prototype.i = function(v){ return this._i; }
Bullet.prototype.setI = function(v){ this._i = v; return this; }
Bullet.prototype._i = 0;

Bullet.prototype.distanceToZombieX = function (zombie,game){
	return Math.abs(zombie.pos().x - this.pos().x);
};

Bullet.prototype.distanceToZombieY = function (zombie,game){
	return Math.abs(zombie.pos().y - this.pos().y);
};

Bullet.prototype.distanceToPlayerX = function (){
	return Math.abs(this.player().pos().x - this.pos().x);
};

Bullet.prototype.distanceToPlayerY = function (){
	return Math.abs(this.player().pos().y - this.pos().y);
};

Bullet.prototype.deleteBullet = function (){
	var v_;
	var index = this.player().bullets().indexOf(this);
	if ((index !== -1)) { this.player().bullets().splice(index,1) };
	return (((v_ = this),delete this, v_));
};

Bullet.prototype.update = function (zombies,game,player){
	let res = [];
	for (let i = 0, items = iter$(zombies), len = items.length, zombie; i < len; i++) {
		// long range
		zombie = items[i];
		if (this.distanceToZombieX(zombie,game) < 50 && this.distanceToZombieY(zombie,game) < 50) {
			zombie.takeHit(this);
			this.deleteBullet();
			return;
		} else if (player.angleToZombie(zombie) < 70 && zombie.distanceToPlayerX() < 130 && zombie.distanceToPlayerY() < 130 && this.distanceToZombieX(zombie,game) < 700 && this.distanceToZombieY(zombie,game) < 700) {
			zombie.takeHit(this);
			this.deleteBullet();
			return;
		};
	};
	return res;
};

Bullet.prototype.fly = function (){
	var self = this;
	return window.setTimeout(function() {
		self.pos().x += Math.cos((self.direction()) * 3.1415 / 180) * 60;
		self.pos().y += Math.sin((self.direction()) * 3.1415 / 180) * 60;
		if (self.distanceToPlayerX() > 5000 && self.distanceToPlayerY() > 5000) {
			self.deleteBullet();
			return;
		};
		return self.fly();
	},16);;
};




/***/ }),
/* 18 */
/***/ (function(module, exports) {

function Gun(_0){
	var dict;
	for (let k in dict = (_0)){
		let v;
		v = dict[k];if (_0) { this[("_" + k)] = (_0)[k] };
	};
};
exports.Gun = Gun; // export class 
Gun.prototype.ammo = function(v){ return this._ammo; }
Gun.prototype.setAmmo = function(v){ this._ammo = v; return this; };
Gun.prototype.cap = function(v){ return this._cap; }
Gun.prototype.setCap = function(v){ this._cap = v; return this; };
Gun.prototype.rate = function(v){ return this._rate; }
Gun.prototype.setRate = function(v){ this._rate = v; return this; };
Gun.prototype.damage = function(v){ return this._damage; }
Gun.prototype.setDamage = function(v){ this._damage = v; return this; };
Gun.prototype.reloadTime = function(v){ return this._reloadTime; }
Gun.prototype.setReloadTime = function(v){ this._reloadTime = v; return this; };
Gun.prototype.name = function(v){ return this._name; }
Gun.prototype.setName = function(v){ this._name = v; return this; };
Gun.prototype.power = function(v){ return this._power; }
Gun.prototype.setPower = function(v){ this._power = v; return this; };
Gun.prototype.accuracy = function(v){ return this._accuracy; }
Gun.prototype.setAccuracy = function(v){ this._accuracy = v; return this; };
Gun.prototype.shootSounds = function(v){ return this._shootSounds; }
Gun.prototype.setShootSounds = function(v){ this._shootSounds = v; return this; };




/***/ }),
/* 19 */
/***/ (function(module, exports) {

function Animation(_0){
	var dict;
	for (let k in dict = (_0)){
		let v;
		v = dict[k];if (_0) { this[("_" + k)] = (_0)[k] };
	};
};
exports.Animation = Animation; // export class 
Animation.prototype.path = function(v){ return this._path; }
Animation.prototype.setPath = function(v){ this._path = v; return this; };
Animation.prototype.size = function(v){ return this._size; }
Animation.prototype.setSize = function(v){ this._size = v; return this; };
Animation.prototype.__time = {'default': 0,name: 'time'};
Animation.prototype.time = function(v){ return this._time; }
Animation.prototype.setTime = function(v){ this._time = v; return this; }
Animation.prototype._time = 0;
Animation.prototype.frameLength = function(v){ return this._frameLength; }
Animation.prototype.setFrameLength = function(v){ this._frameLength = v; return this; };
Animation.prototype.name = function(v){ return this._name; }
Animation.prototype.setName = function(v){ this._name = v; return this; };
Animation.prototype.adjust = function(v){ return this._adjust; }
Animation.prototype.setAdjust = function(v){ this._adjust = v; return this; };




/***/ }),
/* 20 */
/***/ (function(module, exports) {

function Crosshair(_0){
	var dict;
	for (let k in dict = (_0)){
		let v;
		v = dict[k];if (_0) { this[("_" + k)] = (_0)[k] };
	};
};
exports.Crosshair = Crosshair; // export class 
Crosshair.prototype.x = function(v){ return this._x; }
Crosshair.prototype.setX = function(v){ this._x = v; return this; };
Crosshair.prototype.y = function(v){ return this._y; }
Crosshair.prototype.setY = function(v){ this._y = v; return this; };




/***/ }),
/* 21 */
/***/ (function(module, exports) {

function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
function Zombie(_0){
	var dict;
	for (let k in dict = (_0)){
		let v;
		v = dict[k];if (_0) { this[("_" + k)] = (_0)[k] };
	};
};
exports.Zombie = Zombie; // export class 
Zombie.prototype.pos = function(v){ return this._pos; }
Zombie.prototype.setPos = function(v){ this._pos = v; return this; };
Zombie.prototype.rotation = function(v){ return this._rotation; }
Zombie.prototype.setRotation = function(v){ this._rotation = v; return this; };
Zombie.prototype.animation = function(v){ return this._animation; }
Zombie.prototype.setAnimation = function(v){ this._animation = v; return this; };
Zombie.prototype.animations = function(v){ return this._animations; }
Zombie.prototype.setAnimations = function(v){ this._animations = v; return this; };
Zombie.prototype.life = function(v){ return this._life; }
Zombie.prototype.setLife = function(v){ this._life = v; return this; };
Zombie.prototype.maxLife = function(v){ return this._maxLife; }
Zombie.prototype.setMaxLife = function(v){ this._maxLife = v; return this; };
Zombie.prototype.speed = function(v){ return this._speed; }
Zombie.prototype.setSpeed = function(v){ this._speed = v; return this; };
Zombie.prototype.maxSpeed = function(v){ return this._maxSpeed; }
Zombie.prototype.setMaxSpeed = function(v){ this._maxSpeed = v; return this; };
Zombie.prototype.id = function(v){ return this._id; }
Zombie.prototype.setId = function(v){ this._id = v; return this; };
Zombie.prototype.turn = function(v){ return this._turn; }
Zombie.prototype.setTurn = function(v){ this._turn = v; return this; };
Zombie.prototype.__state = {'default': 'random',name: 'state'};
Zombie.prototype.state = function(v){ return this._state; }
Zombie.prototype.setState = function(v){ this._state = v; return this; }
Zombie.prototype._state = 'random';
Zombie.prototype.__damage = {'default': 10,name: 'damage'};
Zombie.prototype.damage = function(v){ return this._damage; }
Zombie.prototype.setDamage = function(v){ this._damage = v; return this; }
Zombie.prototype._damage = 10;
Zombie.prototype.alreadyTurned = function(v){ return this._alreadyTurned; }
Zombie.prototype.setAlreadyTurned = function(v){ this._alreadyTurned = v; return this; };
Zombie.prototype.takingHit = function(v){ return this._takingHit; }
Zombie.prototype.setTakingHit = function(v){ this._takingHit = v; return this; };
Zombie.prototype.attacking = function(v){ return this._attacking; }
Zombie.prototype.setAttacking = function(v){ this._attacking = v; return this; };

Zombie.prototype.__colisionTimes = {'default': 0,name: 'colisionTimes'};
Zombie.prototype.colisionTimes = function(v){ return this._colisionTimes; }
Zombie.prototype.setColisionTimes = function(v){ this._colisionTimes = v; return this; }
Zombie.prototype._colisionTimes = 0;

Zombie.prototype.player = function(v){ return this._player; }
Zombie.prototype.setPlayer = function(v){ this._player = v; return this; };
Zombie.prototype.zombies = function(v){ return this._zombies; }
Zombie.prototype.setZombies = function(v){ this._zombies = v; return this; };
Zombie.prototype.barrels = function(v){ return this._barrels; }
Zombie.prototype.setBarrels = function(v){ this._barrels = v; return this; };
Zombie.prototype.boxes = function(v){ return this._boxes; }
Zombie.prototype.setBoxes = function(v){ this._boxes = v; return this; };
Zombie.prototype.game = function(v){ return this._game; }
Zombie.prototype.setGame = function(v){ this._game = v; return this; };

Zombie.prototype.takeHit = function (hit){
	var self = this, v_;
	let audio = new Audio(("sounds/zombie_hit/" + (~~(Math.random() * 4)) + ".wav"));
	audio.play();
	self.pos().x -= Math.sin((self.angleToPlayer() + 90) * 3.1415 / 180) * hit.power();
	self.pos().y -= -Math.cos((self.angleToPlayer() + 90) * 3.1415 / 180) * hit.power();
	if (!(self.takingHit())) {
		self.setLife(self.life() - hit.damage());
		self.setTakingHit(~~(Math.random() * 5 + 1));
		setTimeout(function() {
			return (self.setTakingHit(false),false);
		},50);
	};
	return (self.setState(v_ = 'aggro'),v_);
};

Zombie.prototype.distanceToPlayerX = function (){
	return Math.abs((this.player().pos().x - this.pos().x));
};

Zombie.prototype.distanceToPlayerY = function (){
	return Math.abs((this.player().pos().y - this.pos().y));
};

Zombie.prototype.angleToPlayer = function (){
	let dx = this.player().pos().x - this.pos().x;
	let dy = this.player().pos().y - this.pos().y;
	return -(Math.atan2(dx,dy) / 3.1415 * 180.0 - 90) % 360;
};

Zombie.prototype.distanceToZombieX = function (zombie){
	return Math.abs((zombie.pos().x - this.pos().x));
};

Zombie.prototype.distanceToZombieY = function (zombie){
	return Math.abs((zombie.pos().y - this.pos().y));
};

Zombie.prototype.moveForward = function (){
	var self = this, v_;
	if (self.colideObj()) {
		self.setColisionTimes(self.colisionTimes() + 1);
		self.pos().x -= Math.sin((self.rotation() + 90) * 3.1415 / 180) * self.speed();
		self.pos().y -= -Math.cos((self.rotation() + 90) * 3.1415 / 180) * self.speed();
		if (self.colisionTimes() > 20) {
			self.setState('walkArroundObject');
			setTimeout(function() { var v_;
			return (self.setState(v_ = 'random'),v_); },1000);
			return (self.setColisionTimes(v_ = 0),v_);
		};
	} else {
		self.pos().x += Math.sin((self.rotation() + 90) * 3.1415 / 180) * self.speed();
		return self.pos().y += -Math.cos((self.rotation() + 90) * 3.1415 / 180) * self.speed();
	};
};

Zombie.prototype.moveBackward = function (){
	this.pos().x -= Math.sin((this.rotation() + 90) * 3.1415 / 180) * this.speed();
	return this.pos().y -= -Math.cos((this.rotation() + 90) * 3.1415 / 180) * this.speed();
};

Zombie.prototype.distanceToX = function (obj){
	return Math.abs((obj.x - this.pos().x));
};

Zombie.prototype.distanceToY = function (obj){
	return Math.abs((obj.y - this.pos().y));
};

Zombie.prototype.colideZombie = function (){
	for (let i = 0, items = iter$(this.zombies()), len = items.length, zombie; i < len; i++) {
		zombie = items[i];
		if (this.distanceToZombieX(zombie) < 30 && this.distanceToZombieY(zombie) < 30 && zombie != this) {
			return true;
		};
	};
	return false;
};

Zombie.prototype.colideObj = function (){
	let sector = ("x" + (~~(this.pos().x / 500)) + "y" + (~~(this.pos().y / 500)));
	for (let i = 0, items = iter$(this.game().sectors()[sector]), len = items.length, obj; i < len; i++) {
		obj = items[i];
		if (this.distanceToX(obj) < obj.size && this.distanceToY(obj) < obj.size) {
			return true;
		};
	};
	return false;
};

Zombie.prototype.playerDetected = function (){
	let angleDiff = this.angleToPlayer() - this.rotation();
	return Math.abs(angleDiff < 30 && this.distanceToPlayerX() < 3000 && this.distanceToPlayerY() < 3000 || (this.distanceToPlayerX() < 100 && this.distanceToPlayerY() < 100));
};


Zombie.prototype.deleteZombie = function (){
	var player_, v_;
	this.zombies().push(new Zombie(
		{id: Math.random(),
		pos: {
			x: this.player().pos().x + Math.random() * 2000 - 1000,
			y: this.player().pos().y + Math.random() * 2000 - 1000
		},
		rotation: Math.random() * 360,
		animation: this.animations().idle,
		animations: this.animations(),
		state: 'random',
		life: this.maxLife() + 20,
		maxLife: this.maxLife() + 20,
		speed: this.speed() + 0.2,
		maxSpeed: this.speed() + 0.2,
		game: this.game(),
		player: this.player(),
		zombies: this.zombies(),
		boxes: this.boxes(),
		barrels: this.barrels()}
	));
	
	var index = this.zombies().indexOf(this);
	if ((index !== -1)) { this.zombies().splice(index,1) };
	return ((player_ = this.player()).setReputation(v_ = player_.reputation() + 10),v_);
};

Zombie.prototype.update = function (){
	if (this.life() < 0) { return this.deleteZombie() };
	if (this.distanceToPlayerX() < this.game().width() && this.distanceToPlayerY() < this.game().height()) {
		switch (this.state()) {
			case 'aggro': {
				return this.execAggro();
				break;
			}
			case 'attack': {
				return this.execAttack();
				break;
			}
			case 'random': {
				return this.execRandom();
				break;
			}
			case 'walkArroundZombie': {
				return this.execWalkArroundZombie();
				break;
			}
			case 'walkArroundObject': {
				return this.execWalkArroundObject();
				break;
			}
		};
	};
};

Zombie.prototype.execAggro = function (){
	var self = this, v_;
	if (self.distanceToPlayerX() < 50 && self.distanceToPlayerY() < 50) {
		return (self.setState(v_ = 'attack'),v_);
	} else if (self.colideZombie()) {
		self.setState('walkArroundZombie');
		return setTimeout(function() { var $1;
		return (self.setState($1 = 'aggro'),$1); },300);
	} else {
		self.setSpeed(self.maxSpeed());
		self.setRotation(self.angleToPlayer());
		self.setAnimation(self.animations().move);
		return self.moveForward();
	};
};

Zombie.prototype.execAttack = function (){
	var self = this, v_;
	if (self.distanceToPlayerX() < 100 && self.distanceToPlayerY() < 100 && !(self.attacking())) {
		let audio = new Audio(("sounds/zombie-attack" + (~~(Math.random() * 3)) + ".ogg"));
		audio.volume = 0.6;
		audio.play();
		self.setAttacking(true);
		self.setAnimation(self.animations().attack);
		return setTimeout(function() {
			var v_;
			if (self.distanceToPlayerX() < 100 && self.distanceToPlayerY() < 100) {
				self.player().takeHit(self.damage());
			};
			self.setAttacking(false);
			if (self.colideZombie()) {
				self.setState('walkArroundZombie');
				return setTimeout(function() {
					var v_;
					return (self.setState(v_ = 'aggro'),v_);
				},300);
			} else {
				return (self.setState(v_ = 'aggro'),v_);
			};
		},300);
	} else if (!(self.attacking())) {
		return (self.setState(v_ = 'aggro'),v_);
	};
};

Zombie.prototype.execRandom = function (){
	var v_;
	if (this.distanceToPlayerX() < 40 && this.distanceToPlayerY() < 40) {
		return (this.setState(v_ = 'attack'),v_);
	} else if (this.playerDetected()) {
		return (this.setState(v_ = 'aggro'),v_);
	} else {
		if (5000 % this.game().time() == 0) {
			this.setTurn(['turn_left','turn_right'][~~(Math.random() * 2)]);
			this.setSpeed(~~(Math.random() * this.maxSpeed()));
		};
		if (this.turn() == 'turn_right') {
			this.setRotation(this.rotation() + 1);
		};
		if (this.turn() == 'turn_left') {
			this.setRotation(this.rotation() - 1);
		};
		return this.moveForward();
	};
};

Zombie.prototype.execWalkArroundZombie = function (){
	var self = this;
	if (!(self.alreadyTurned())) {
		self.setAlreadyTurned(true);
		self.setSpeed(3);
		self.setRotation(self.rotation() + [30,50,70,90,-90,-70,-50,-30][~~(Math.random() * 8)]);
		setTimeout(function() {
			return (self.setAlreadyTurned(false),false);
		},1000);
	};
	return self.moveForward();
};

Zombie.prototype.execWalkArroundObject = function (){
	var self = this;
	if (!(self.alreadyTurned())) {
		self.setAlreadyTurned(true);
		self.setSpeed(3);
		self.setRotation(self.rotation() + [90,135,180,-135,-90][~~(Math.random() * 5)]);
		setTimeout(function() {
			return (self.setAlreadyTurned(false),false);
		},1000);
	};
	return self.moveForward();
};





/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var Imba = __webpack_require__(1), _2 = Imba.createTagList, _3 = Imba.createTagMap, _1 = Imba.createElement;
var Undead = Imba.defineTag('Undead', 'svg:g', function(tag){
	tag.prototype.transform = function(v){ return this.getAttribute('transform'); }
	tag.prototype.setTransform = function(v){ this.setAttribute('transform',v); return this; };
	tag.prototype.player = function(v){ return this._player; }
	tag.prototype.setPlayer = function(v){ this._player = v; return this; };
	tag.prototype.game = function(v){ return this._game; }
	tag.prototype.setGame = function(v){ this._game = v; return this; };
	tag.prototype.zombie = function(v){ return this._zombie; }
	tag.prototype.setZombie = function(v){ this._zombie = v; return this; };
	tag.prototype.zombies = function(v){ return this._zombies; }
	tag.prototype.setZombies = function(v){ this._zombies = v; return this; };
	
	tag.prototype.render = function (){
		var $ = this.$;
		return this.$open(0).setTransform((("translate(" + (this.zombie().pos().x) + "," + (this.zombie().pos().y) + ") rotate(" + (this.zombie().rotation()) + ")"))).setChildren(
			$[0] || _1('svg:g',$,0,this)
		,2).synced((
			$[0].set('transform',("translate(" + (-50) + ", " + (-50) + ")")).setContent([
				($[1] || _1('svg:rect',$,1,0).set('height',100).set('width',100)).set('transform',("scale(" + (this.zombie().animation().adjust().scale) + ") translate(" + (this.zombie().animation().adjust().translate) + ")")).set('fill',("url(#zombie-" + (this.zombie().animation().path()) + "-" + (~~(this.game().time() / this.zombie().animation().frameLength() % this.zombie().animation().size())) + ")")).end(),
				this.zombie().takingHit() ? (
					($[2] || _1('svg:g',$,2,0).setContent(
						$[3] || _1('svg:rect',$,3,2).set('height',100).set('width',100)
					,2)).set('transform',(("rotate(-90) translate(" + ([-100,-110,-120,-130,-140,-150][~~(Math.random() * 5)]) + ", " + (-50) + ")"))).end((
						$[3].set('fill',("url(#blood-splash-" + (this.zombie().takingHit()) + ")")).end()
					,true))
				) : void(0)
			],1).end()
		,true));
	};
});

var Survivor = Imba.defineTag('Survivor', 'svg:g', function(tag){
	tag.prototype.transform = function(v){ return this.getAttribute('transform'); }
	tag.prototype.setTransform = function(v){ this.setAttribute('transform',v); return this; };
	tag.prototype.player = function(v){ return this._player; }
	tag.prototype.setPlayer = function(v){ this._player = v; return this; };
	tag.prototype.game = function(v){ return this._game; }
	tag.prototype.setGame = function(v){ this._game = v; return this; };
	
	tag.prototype.render = function (){
		var $ = this.$;
		return this.$open(0).setTransform(("translate(" + (this.player().pos().x) + ", " + (this.player().pos().y) + ") rotate(" + (this.player().rotation()) + ")")).setChildren([
			this.player().shooting() ? (($[0] || _1(Shot,$,0,this)).setGun(this.player().gun()).end()) : void(0),
			($[1] || _1('svg:g',$,1,this).setContent([
				_1('svg:rect',$,2,1).set('height',100).set('width',100),
				_1('svg:rect',$,3,1).set('height',100).set('width',100)
			],2)).set('transform',("translate(" + (-50) + ", " + (-50) + ")")).end((
				$[2].set('transform',("scale(" + (this.player().feetAnimation().adjust().scale) + ") translate(" + (this.player().feetAnimation().adjust().translate) + ")")).set('fill',("url(#" + (this.player().feetAnimation().name()) + "-" + (~~(this.game().time() / this.player().feetAnimation().frameLength()) % this.player().feetAnimation().size()) + ")")).end(),
				$[3].set('transform',("scale(" + (this.player().animation().adjust().scale) + ") translate(" + (this.player().animation().adjust().translate) + ")")).set('fill',("url(#" + (this.player().animation().name()) + "-" + (~~(this.game().time() / this.player().animation().frameLength()) % this.player().animation().size()) + ")")).end()
			,true))
		],1).synced();
	};
});

var Ground = Imba.defineTag('Ground', 'svg:g', function(tag){
	tag.prototype.player = function(v){ return this._player; }
	tag.prototype.setPlayer = function(v){ this._player = v; return this; };
	tag.prototype.height = function(v){ return this.getAttribute('height'); }
	tag.prototype.setHeight = function(v){ this.setAttribute('height',v); return this; };
	tag.prototype.width = function(v){ return this.getAttribute('width'); }
	tag.prototype.setWidth = function(v){ this.setAttribute('width',v); return this; };
	tag.prototype.transform = function(v){ return this.getAttribute('transform'); }
	tag.prototype.setTransform = function(v){ this.setAttribute('transform',v); return this; };
	
	tag.prototype.render = function (){
		var $ = this.$;
		return this.$open(0).setHeight(70000).setWidth(70000).setTransform(("translate(" + (-35000) + "," + (-35000) + ")")).setChildren(
			$[0] || _1('svg:g',$,0,this).setContent(
				$[1] || _1('svg:rect',$,1,0).set('height',70000).set('width',70000).set('fill',"url(#floor_2)").set('stroke',"white")
			,2)
		,2).synced((
			$[0].end((
				$[1].end()
			,true))
		,true));
	};
});

var Shot = Imba.defineTag('Shot', 'svg:g', function(tag){
	tag.prototype.transform = function(v){ return this.getAttribute('transform'); }
	tag.prototype.setTransform = function(v){ this.setAttribute('transform',v); return this; };
	tag.prototype.rotation = function(v){ return this._rotation; }
	tag.prototype.setRotation = function(v){ this._rotation = v; return this; };
	tag.prototype.gun = function(v){ return this._gun; }
	tag.prototype.setGun = function(v){ this._gun = v; return this; };
	
	tag.prototype.render = function (){
		var $ = this.$;
		return this.$open(0).setChildren(
			(this.gun().name() == 'handgun') ? (
				($[0] || _1('svg:rect',$,0,this).set('transform',"translate(30, -25)").set('height',100).set('width',100).set('fill',"url(#shot)")).end()
			) : ((this.gun().name() == 'rifle' || this.gun().name() == 'shotgun') ? (
				($[1] || _1('svg:rect',$,1,this).set('transform',"translate(55, -30)").set('height',100).set('width',100).set('fill',"url(#shot)")).end()
			) : void(0))
		,3).synced();
	};
});

var Projectile = Imba.defineTag('Projectile', 'svg:g', function(tag){
	tag.prototype.transform = function(v){ return this.getAttribute('transform'); }
	tag.prototype.setTransform = function(v){ this.setAttribute('transform',v); return this; };
	tag.prototype.bullet = function(v){ return this._bullet; }
	tag.prototype.setBullet = function(v){ this._bullet = v; return this; };
	tag.prototype.player = function(v){ return this._player; }
	tag.prototype.setPlayer = function(v){ this._player = v; return this; };
	tag.prototype.zombies = function(v){ return this._zombies; }
	tag.prototype.setZombies = function(v){ this._zombies = v; return this; };
	tag.prototype.game = function(v){ return this._game; }
	tag.prototype.setGame = function(v){ this._game = v; return this; };
	
	tag.prototype.render = function (){
		var $ = this.$;
		return this.$open(0).setTransform(("translate(" + (this.bullet().pos().x) + ", " + (this.bullet().pos().y) + ") rotate(" + (this.bullet().direction()) + ")")).setChildren(
			$[0] || _1('svg:rect',$,0,this).set('height',1).set('width',50).set('fill',"yellow")
		,2).synced((
			$[0].end()
		,true));
	};
});

var Aim = Imba.defineTag('Aim', 'svg:g', function(tag){
	tag.prototype.transform = function(v){ return this.getAttribute('transform'); }
	tag.prototype.setTransform = function(v){ this.setAttribute('transform',v); return this; };
	tag.prototype.crosshair = function(v){ return this._crosshair; }
	tag.prototype.setCrosshair = function(v){ this._crosshair = v; return this; };
	
	tag.prototype.render = function (){
		var $ = this.$;
		return this.$open(0).setTransform(("translate(" + (this.crosshair().x()) + ", " + (this.crosshair().y() + window.innerHeight) + ")")).setChildren($.$ = $.$ || [
			_1('svg:circle',$,0,this).set('r',10).set('stroke',"rgb(60,255,60)"),
			_1('svg:circle',$,1,this).set('r',8).set('fill',"rgb(60,255,60)"),
			_1('svg:circle',$,2,this).set('r',2).set('fill',"black")
		],2).synced((
			$[0].end(),
			$[1].end(),
			$[2].end()
		,true));
	};
});

var Hud = Imba.defineTag('Hud', 'svg:g', function(tag){
	tag.prototype.height = function(v){ return this.getAttribute('height'); }
	tag.prototype.setHeight = function(v){ this.setAttribute('height',v); return this; };
	tag.prototype.width = function(v){ return this.getAttribute('width'); }
	tag.prototype.setWidth = function(v){ this.setAttribute('width',v); return this; };
	tag.prototype.player = function(v){ return this._player; }
	tag.prototype.setPlayer = function(v){ this._player = v; return this; };
	tag.prototype.game = function(v){ return this._game; }
	tag.prototype.setGame = function(v){ this._game = v; return this; };
	
	tag.prototype.render = function (){
		var $ = this.$;
		return this.$open(0).setChildren([
			($[0] || _1('svg:g',$,0,this).setContent([
				_1('svg:g',$,1,0).setContent(
					$[2] || _1('svg:text',$,2,1).flag('noselect').set('fill',"yellow").set('font-family',"MenofNihilist").set('font-size',"50")
				,2),
				_1('svg:g',$,3,0).set('transform',"scale(1,-1)").setContent(
					$[4] || _1('svg:text',$,4,3).flag('noselect').set('fill',"yellow").set('font-family',"MenofNihilist").set('font-size',"50")
				,2),
				_1('svg:g',$,5,0).set('transform',"scale(1,-1) translate(0,50)").setContent(
					$[6] || _1('svg:text',$,6,5).flag('noselect').set('font-family',"MenofNihilist").set('font-size',"50")
				,2)
			],2)).set('transform',("translate(" + (this.game().width() - 300) + ", " + (this.game().height() / 10) + ")")).end((
				$[1].set('transform',("scale(1,-1) translate(-200," + (150 - this.game().height()) + ")")).end((
					$[2].setText("reputation " + (this.player().reputation())).end()
				,true)),
				$[3].end((
					$[4].setText("life " + (this.player().life())).end()
				,true)),
				$[5].end((
					$[6].set('fill',((this.player().gun().ammo() < this.player().gun().cap() / 3) ? "red" : "yellow")).setText("ammo " + (this.player().gun().ammo())).end()
				,true))
			,true)),
			this.player().takingHit() ? (
				($[7] || _1('svg:g',$,7,this).setContent(
					$[8] || _1('svg:rect',$,8,7).flag('blood-hud')
				,2)).set('transform',("translate(" + (this.game().width() / 2) + ", " + (this.game().height() / 2) + ")")).end((
					$[8].set('transform',(("rotate(" + (this.player().bloodRotation()) + ")"))).set('height',this.game().height() / 1.5).set('width',this.game().width() / 1.5).set('fill',("url(#blood-hud-" + (this.player().takingHit()) + ")")).end()
				,true))
			) : void(0)
		],1).synced();
	};
});

var Barrel = Imba.defineTag('Barrel', 'svg:g', function(tag){
	tag.prototype.transform = function(v){ return this.getAttribute('transform'); }
	tag.prototype.setTransform = function(v){ this.setAttribute('transform',v); return this; };
	tag.prototype.barrel = function(v){ return this._barrel; }
	tag.prototype.setBarrel = function(v){ this._barrel = v; return this; };
	
	tag.prototype.render = function (){
		var $ = this.$;
		return this.$open(0).setTransform(("translate(" + (this.barrel().x) + "," + (this.barrel().y) + ") rotate(" + (this.barrel().rotation) + ")")).setChildren(
			$[0] || _1('svg:g',$,0,this).setContent(
				$[1] || _1('svg:rect',$,1,0).set('height',50).set('width',50).set('fill',"url(#barrel)")
			,2)
		,2).synced((
			$[0].set('transform',("translate(" + (-25) + ", " + (-25) + ")")).end((
				$[1].end()
			,true))
		,true));
	};
});

var Box = Imba.defineTag('Box', 'svg:g', function(tag){
	tag.prototype.transform = function(v){ return this.getAttribute('transform'); }
	tag.prototype.setTransform = function(v){ this.setAttribute('transform',v); return this; };
	tag.prototype.box = function(v){ return this._box; }
	tag.prototype.setBox = function(v){ this._box = v; return this; };
	
	tag.prototype.render = function (){
		var $ = this.$;
		return this.$open(0).setTransform(("translate(" + (this.box().x) + "," + (this.box().y) + ") rotate(" + (this.box().rotation) + ")")).setChildren(
			$[0] || _1('svg:g',$,0,this).setContent(
				$[1] || _1('svg:rect',$,1,0).set('height',100).set('width',100).set('fill',"url(#box)")
			,2)
		,2).synced((
			$[0].set('transform',("translate(" + (-50) + ", " + (-50) + ")")).end((
				$[1].end()
			,true))
		,true));
	};
});

var Loader = Imba.defineTag('Loader', 'svg:g', function(tag){
	
	tag.prototype.render = function (){
		var $ = this.$;
		return this.$open(0).setChildren([
			// FLOOR
			$[0] || _1('svg:defs',$,0,this).setContent(
				$[1] || _1('svg:pattern',$,1,0).setId('floor_2').set('patternUnits',"userSpaceOnUse").set('width',"700").set('height',"700").set('patternContentUnits',"userSpaceOnUse").setContent(
					$[2] || _1('svg:image',$,2,1).set('href',"textures/the_floor/the_floor/floor_2.png").set('width',"700").set('height',"700")
				,2)
			,2),
			
			
			$[3] || _1('svg:defs',$,3,this).setContent(
				$[4] || _1('svg:pattern',$,4,3).setId('shot').set('patternUnits',"userSpaceOnUse").set('width',"100").set('height',"100").set('patternContentUnits',"userSpaceOnUse").setContent(
					$[5] || _1('svg:image',$,5,4).set('href',"textures/shoot/shoot/muzzle_flash_0.png").set('width',"100").set('height',"100")
				,2)
			,2),
			
			$[6] || _1('svg:defs',$,6,this).setContent(
				$[7] || _1('svg:pattern',$,7,6).set('id',"barrel").set('patternUnits',"userSpaceOnUse").set('width',"50").set('height',"50").set('patternContentUnits',"userSpaceOnUse").setContent(
					$[8] || _1('svg:image',$,8,7).set('href',"textures/the_floor/the_floor/barrel.png").set('width',"50").set('height',"50")
				,2)
			,2),
			
			$[9] || _1('svg:defs',$,9,this).setContent(
				$[10] || _1('svg:pattern',$,10,9).set('id',"box").set('patternUnits',"userSpaceOnUse").set('width',"100").set('height',"100").set('patternContentUnits',"userSpaceOnUse").setContent(
					$[11] || _1('svg:image',$,11,10).set('href',"textures/the_floor/the_floor/crate_1.png").set('width',"100").set('height',"100")
				,2)
			,2),
			
			
			$[12] || _1('svg:defs',$,12,this).setContent(
				$[13] || _1('svg:pattern',$,13,12).set('id',"blood-hud-1").set('patternUnits',"userSpaceOnUse").set('patternContentUnits',"userSpaceOnUse").setContent(
					$[14] || _1('svg:image',$,14,13).set('href',"textures/blood_hud/1.png")
				,2)
			,2),
			$[15] || _1('svg:defs',$,15,this).setContent(
				$[16] || _1('svg:pattern',$,16,15).set('id',"blood-hud-2").set('patternUnits',"userSpaceOnUse").set('patternContentUnits',"userSpaceOnUse").setContent(
					$[17] || _1('svg:image',$,17,16).set('href',"textures/blood_hud/2.png")
				,2)
			,2),
			
			
			(function tagLoop($0) {
				var t0;
				for (let i = 0, items = iter$(Array.from(new Array(6))), len = $0.taglen = items.length; i < len; i++) {
					(t0 = $0[i] || (t0=_1('svg:defs',$0,i)).setContent(
						t0.$.A || _1('svg:pattern',t0.$,'A',t0).set('patternUnits',"userSpaceOnUse").set('width',"100").set('height',"100").set('patternContentUnits',"userSpaceOnUse").setContent(
							t0.$.B || _1('svg:image',t0.$,'B','A').set('width',"100").set('height',"100")
						,2)
					,2)).end((
						t0.$.A.set('id',("blood-splash-" + (i + 1))).end((
							t0.$.B.set('href',("textures/blood_splash/" + (i + 1) + ".png")).end()
						,true))
					,true));
				};return $0;
			})($[18] || _2($,18)),
			
			
			(function tagLoop($0) {
				var t0;
				for (let i = 0, items = iter$(Array.from(new Array(17))), len = $0.taglen = items.length; i < len; i++) {
					(t0 = $0[i] || (t0=_1('svg:defs',$0,i)).setContent(
						t0.$.A || _1('svg:pattern',t0.$,'A',t0).set('patternUnits',"userSpaceOnUse").set('width',"100").set('height',"100").set('patternContentUnits',"userSpaceOnUse").setContent(
							t0.$.B || _1('svg:image',t0.$,'B','A').set('width',"100").set('height',"100")
						,2)
					,2)).end((
						t0.$.A.set('id',("zombie-idle-" + i)).end((
							t0.$.B.set('href',("textures/zombie/idle/skeleton-idle_" + i + ".png")).end()
						,true))
					,true));
				};return $0;
			})($[19] || _2($,19)),
			
			(function tagLoop($0) {
				var t0;
				for (let i = 0, items = iter$(Array.from(new Array(17))), len = $0.taglen = items.length; i < len; i++) {
					(t0 = $0[i] || (t0=_1('svg:defs',$0,i)).setContent(
						t0.$.A || _1('svg:pattern',t0.$,'A',t0).set('patternUnits',"userSpaceOnUse").set('width',"100").set('height',"100").set('patternContentUnits',"userSpaceOnUse").setContent(
							t0.$.B || _1('svg:image',t0.$,'B','A').set('width',"100").set('height',"100")
						,2)
					,2)).end((
						t0.$.A.set('id',("zombie-move-" + i)).end((
							t0.$.B.set('href',("textures/zombie/move/skeleton-move_" + i + ".png")).end()
						,true))
					,true));
				};return $0;
			})($[20] || _2($,20)),
			
			(function tagLoop($0) {
				var t0;
				for (let i = 0, items = iter$(Array.from(new Array(9))), len = $0.taglen = items.length; i < len; i++) {
					(t0 = $0[i] || (t0=_1('svg:defs',$0,i)).setContent(
						t0.$.A || _1('svg:pattern',t0.$,'A',t0).set('patternUnits',"userSpaceOnUse").set('width',"100").set('height',"100").set('patternContentUnits',"userSpaceOnUse").setContent(
							t0.$.B || _1('svg:image',t0.$,'B','A').set('width',"100").set('height',"100")
						,2)
					,2)).end((
						t0.$.A.set('id',("zombie-attack-" + i)).end((
							t0.$.B.set('href',("textures/zombie/attack/skeleton-attack_" + i + ".png")).end()
						,true))
					,true));
				};return $0;
			})($[21] || _2($,21))
		],1).synced((
			$[0].end((
				$[1].end((
					$[2].end()
				,true))
			,true)),
			$[3].end((
				$[4].end((
					$[5].end()
				,true))
			,true)),
			$[6].end((
				$[7].end((
					$[8].end()
				,true))
			,true)),
			$[9].end((
				$[10].end((
					$[11].end()
				,true))
			,true)),
			$[12].end((
				$[13].set('width',("" + (window.innerWidth / 2))).set('height',("" + (window.innerHeight / 2))).end((
					$[14].set('width',("" + (window.innerWidth / 2))).set('height',("" + (window.innerHeight / 2))).end()
				,true))
			,true)),
			$[15].end((
				$[16].set('width',("" + (window.innerWidth / 2))).set('height',("" + (window.innerHeight / 2))).end((
					$[17].set('width',("" + (window.innerWidth / 2))).set('height',("" + (window.innerHeight / 2))).end()
				,true))
			,true))
		,true));
	};
});




var Menu = Imba.defineTag('Menu', function(tag){
	tag.prototype.game = function(v){ return this._game; }
	tag.prototype.setGame = function(v){ this._game = v; return this; };
	
	tag.prototype.close = function (){
		return (this.game().setMenu(false),false);
	};
	
	tag.prototype.render = function (){
		var $ = this.$;
		return this.$open(0).setChildren(
			$[0] || _1('div',$,0,this).flag('modal').flag('fadeIn').flag('animated').flag('show').setStyle("display: block;").setContent(
				$[1] || _1('div',$,1,0).flag('modal-lg').flag('modal-dialog').setContent(
					$[2] || _1('div',$,2,1).flag('modal-content').flag('model-form-content').flag('animated').flag('fadeInUp').setContent([
						_1('div',$,3,2).flag('modal-header').setContent(
							$[4] || _1('h5',$,4,3).flag('modal-title').setText("MENU")
						,2),
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						_1('div',$,5,2).flag('modal-footer').setContent(
							$[6] || _1('button',$,6,5).setType("button").flag('btn').flag('btn-link').on$(0,['tap','close'],this).setText('Close')
						,2)
					],2)
				,2)
			,2)
		,2).synced((
			$[0].end((
				$[2].flagIf('fadeOutDown',(this._closing)).end((
					$[6].end()
				,true))
			,true))
		,true));
	};
});

var App = Imba.defineTag('App', function(tag){
	tag.prototype.survivalAnimations = function(v){ return this._survivalAnimations; }
	tag.prototype.setSurvivalAnimations = function(v){ this._survivalAnimations = v; return this; };
	tag.prototype.feetAnimation = function(v){ return this._feetAnimation; }
	tag.prototype.setFeetAnimation = function(v){ this._feetAnimation = v; return this; };
	tag.prototype.__imagesLoaded = {'default': {},name: 'imagesLoaded'};
	tag.prototype.imagesLoaded = function(v){ return this._imagesLoaded; }
	tag.prototype.setImagesLoaded = function(v){ this._imagesLoaded = v; return this; }
	tag.prototype._imagesLoaded = {};
	tag.prototype.__audiosLoaded = {'default': {},name: 'audiosLoaded'};
	tag.prototype.audiosLoaded = function(v){ return this._audiosLoaded; }
	tag.prototype.setAudiosLoaded = function(v){ this._audiosLoaded = v; return this; }
	tag.prototype._audiosLoaded = {};
	
	tag.prototype.crosshair = function(v){ return this._crosshair; }
	tag.prototype.setCrosshair = function(v){ this._crosshair = v; return this; };
	tag.prototype.zombies = function(v){ return this._zombies; }
	tag.prototype.setZombies = function(v){ this._zombies = v; return this; };
	tag.prototype.player = function(v){ return this._player; }
	tag.prototype.setPlayer = function(v){ this._player = v; return this; };
	tag.prototype.guns = function(v){ return this._guns; }
	tag.prototype.setGuns = function(v){ this._guns = v; return this; };
	tag.prototype.animations = function(v){ return this._animations; }
	tag.prototype.setAnimations = function(v){ this._animations = v; return this; };
	tag.prototype.audios = function(v){ return this._audios; }
	tag.prototype.setAudios = function(v){ this._audios = v; return this; };
	tag.prototype.boxes = function(v){ return this._boxes; }
	tag.prototype.setBoxes = function(v){ this._boxes = v; return this; };
	tag.prototype.barrels = function(v){ return this._barrels; }
	tag.prototype.setBarrels = function(v){ this._barrels = v; return this; };
	tag.prototype.game = function(v){ return this._game; }
	tag.prototype.setGame = function(v){ this._game = v; return this; };
	
	tag.prototype.mount = function (){
		var self = this, dict;
		self.setSurvivalAnimations(self.loadSurvivorAnimations());
		self.setFeetAnimation(self.loadFeetAnimations());
		self.render();
		let images = Array.from(document.getElementsByTagName('image'));
		for (let j = 0, items = iter$(images), len = items.length, i; j < len; j++) {
			i = items[j];
			i.onload = function() { return self.imagesLoaded()[i.attributes.href.value] = true; };
		};
		
		for (let k in dict = self.audios()){
			let audio;
			audio = dict[k];audio.oncanplaythrough = function() { return self.audiosLoaded()[k] = true; };
		};
		
		self.schedule({interval: 16});
		return self.game().initListners();
	};
	
	tag.prototype.tick = function (){
		this.game().update();
		return this.render();
	};
	
	tag.prototype.loadSurvivorAnimations = function (){
		var dict, t0;
		let res = [];
		for (let gun in dict = this.animations().player){
			let anims;
			anims = dict[gun];let res1 = [];
			for (let action in anims){
				let anim;
				anim = anims[action];let res2 = [];
				for (let i = 0, items = iter$(Array.from(new Array(anim.size()))), len = items.length; i < len; i++) {
					res2.push((t0 = (t0=_1('svg:defs')).setContent(
						t0.$.A || _1('svg:pattern',t0.$,'A',t0).set('patternUnits',"userSpaceOnUse").set('width',"100").set('height',"100").set('patternContentUnits',"userSpaceOnUse").setContent(
							t0.$.B || _1('svg:image',t0.$,'B','A').set('width',"100").set('height',"100")
						,2)
					,2)).end((
						t0.$.A.set('id',("" + (anim.name()) + "-" + i)).end((
							t0.$.B.set('href',("" + (anim.path()) + i + ".png")).end()
						,true))
					,true)));
				};
				res1.push(res2);
			};
			res.push(res1);
		};
		return res;
	};
	
	tag.prototype.loadFeetAnimations = function (){
		var dict, t0;
		let res = [];
		for (let name in dict = this.animations().feet){
			let anim;
			anim = dict[name];let res1 = [];
			for (let i = 0, items = iter$(Array.from(new Array(anim.size()))), len = items.length; i < len; i++) {
				res1.push((t0 = (t0=_1('svg:defs')).setContent(
					t0.$.A || _1('svg:pattern',t0.$,'A',t0).set('patternUnits',"userSpaceOnUse").set('width',"100").set('height',"100").set('patternContentUnits',"userSpaceOnUse").setContent(
						t0.$.B || _1('svg:image',t0.$,'B','A').set('width',"100").set('height',"100")
					,2)
				,2)).end((
					t0.$.A.set('id',("" + (anim.name()) + "-" + i)).end((
						t0.$.B.set('href',("" + (anim.path()) + i + ".png")).end()
					,true))
				,true)));
			};
			res.push(res1);
		};
		return res;
	};
	
	
	tag.prototype.isNotLoading = function (){
		return Object.keys(this.imagesLoaded()).length == 440 && Object.keys(this.audiosLoaded()).length == Object.keys(this.audios()).length;
	};
	
	tag.prototype.render = function (){
		var $ = this.$, self = this;
		let x = self.player().shooting() ? (Math.random() * self.player().gun().power() - self.player().gun().power() / 2) : 0;
		let y = self.player().shooting() ? (Math.random() * self.player().gun().power() - self.player().gun().power() / 2) : 0;
		return self.$open(0).flag('container').setChildren([
			(self.game().menu() && self.isNotLoading()) ? (($[0] || _1(Menu,$,0,self)).setGame(self.game()).end()) : void(0),
			($[1] || _1('svg:svg',$,1,self).flag('game').set('transform',"scale(1,-1)")).setContent([
				self.survivalAnimations(),
				self.feetAnimation(),
				($[2] || _1(Loader,$,2,1)).end(),
				
				self.isNotLoading() ? Imba.static([
					($[3] || _1('svg:g',$,3,1)).set('transform',(("translate(" + (x - self.player().pos().x + self.game().width() / 2) + ", " + (y - self.player().pos().y + self.game().height() / 2) + ")"))).setContent([
						($[4] || _1(Ground,$,4,3)).setPlayer(self.player()).end(),
						(function tagLoop($0) {
							for (let i = 0, items = iter$(self.game().boxes()), len = $0.taglen = items.length; i < len; i++) {
								($0[i] || _1(Box,$0,i)).setBox(items[i]).end();
							};return $0;
						})($[5] || _2($,5,$[3])),
						(function tagLoop($0) {
							for (let i = 0, items = iter$(self.game().barrels()), len = $0.taglen = items.length; i < len; i++) {
								($0[i] || _1(Barrel,$0,i)).setBarrel(items[i]).end();
							};return $0;
						})($[6] || _2($,6,$[3])),
						($[7] || _1(Survivor,$,7,3)).setPlayer(self.player()).setGame(self.game()).end(),
						(function tagLoop($0) {
							var $$ = $0.$iter();
							for (let i = 0, items = iter$(self.zombies()), len = items.length, zombie; i < len; i++) {
								zombie = items[i];
								if (zombie) { $$.push(($0[i] || _1(Undead,$0,i)).setZombies(self.zombies()).setZombie(zombie).setPlayer(self.player()).setGame(self.game()).end()) };
							};return $$;
						})($[8] || _3($,8,$[3])),
						(function tagLoop($0) {
							var $$ = $0.$iter();
							for (let i = 0, items = iter$(self.player().bullets()), len = items.length, bullet; i < len; i++) {
								bullet = items[i];
								if (bullet) { $$.push(($0[i] || _1(Projectile,$0,i)).setBullet(bullet).setPlayer(self.player()).setZombies(self.zombies()).setGame(self.game()).end()) };
							};return $$;
						})($[9] || _3($,9,$[3]))
					],1).end(),
					($[10] || _1(Hud,$,10,1)).setPlayer(self.player()).setGame(self.game()).end(),
					($[11] || _1(Aim,$,11,1)).setCrosshair(self.crosshair()).end()
				],2,1) : Imba.static([
					($[12] || _1('svg:g',$,12,1).setContent(
						$[13] || _1('svg:text',$,13,12).set('fill',"red").set('font-family',"MenofNihilist").set('font-size',"150").setText("Zombie Shooter")
					,2)).set('transform',("translate(" + (window.innerWidth / 4) + "," + (window.innerHeight / 2) + ") scale(1, -1)")).end((
						$[13].end()
					,true)),
					($[14] || _1('svg:g',$,14,1).setContent(
						$[15] || _1('svg:text',$,15,14).set('fill',"red").set('font-family',"MenofNihilist").set('font-size',"90")
					,2)).set('transform',("translate(" + (window.innerWidth / 3) + "," + (window.innerHeight / 3) + ") scale(1, -1)")).end((
						$[15].setText("LOADING.... " + (~~(Object.keys(self.imagesLoaded()).length / 440 * 40 + Object.keys(self.audiosLoaded()).length / Object.keys(self.audios()).length * 60)) + "%").end()
					,true)),
					($[16] || _1('svg:g',$,16,1).setContent(
						$[17] || _1('svg:text',$,17,16).set('fill',"red").set('font-family',"MenofNihilist").set('font-size',"15").setText("Tip: ZoomOut to 80%")
					,2)).set('transform',("translate(" + (window.innerWidth / 2) + "," + (window.innerHeight / 4) + ") scale(1, -1)")).end((
						$[17].end()
					,true)),
					($[18] || _1('svg:g',$,18,1).setContent(
						$[19] || _1('svg:text',$,19,18).set('fill',"red").set('font-family',"MenofNihilist").set('font-size',"15").setText("built with imba")
					,2)).set('transform',("translate(" + (window.innerWidth - 200) + "," + (window.innerHeight - 200) + ") scale(1, -1)")).end((
						$[19].end()
					,true))
				],2,2)
			],1).end()
		],1).synced();
	};
})
exports.App = App;


/***/ })
/******/ ]);