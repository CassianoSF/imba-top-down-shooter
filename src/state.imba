import Game from './classes/Game'
import Gun from './classes/Gun'
import Player from './classes/Player'
import Zombie from './classes/Zombie'
import Obstacle from './classes/Obstacle'

let animations = 
	player:
		knife:
			idle:
				path: "textures/knife/idle/survivor-idle_knife_"
				name: "knife-idle"
				size: 19
				frame-length: 3
				adjust: 
					scale: "1.15,1.15"
					translate: "-5,0"

			move:
				path: "textures/knife/move/survivor-move_knife_"
				name: "knife-move"
				size: 19
				frame-length: 3
				adjust: 
					scale: "1.15,1.15"
					translate: "-5,0"

			attack:
				path: "textures/knife/meleeattack/survivor-meleeattack_knife_"
				name: "knife-meleeattack"
				size: 14
				frame-length: 2
				adjust: 
					scale: "1.3,1.3"
					translate: "-5,5"

		handgun:
			idle:
				path: "textures/handgun/idle/survivor-idle_handgun_"
				name: "handgun-idle"
				size: 19
				frame-length: 3
				adjust: 
					scale: "-0.8,0.8"
					translate: "0,5"

			move:
				path: "textures/handgun/move/survivor-move_handgun_"
				name: "handgun-move"
				size: 19
				frame-length: 3
				adjust: 
					scale: "-0.8,0.8"
					translate: "0,5"

			attack:
				path: "textures/handgun/meleeattack/survivor-meleeattack_handgun_"
				name: "handgun-meleeattack"
				size: 14
				frame-length: 2
				adjust: 
					scale: "-0.8,0.8"
					translate: "0,5"

			shoot:
				path: "textures/handgun/shoot/survivor-shoot_handgun_"
				name: "handgun-shoot"
				size: 2
				frame-length: 3
				adjust: 
					scale: "-0.8,0.8"
					translate: "0,5"

			reload:
				path: "textures/handgun/reload/survivor-reload_handgun_"
				name: "handgun-reload"
				size: 14
				frame-length: 3
				adjust: 
					scale: "-0.8,0.8"
					translate: "0,5"

		rifle:
			idle:
				path: "textures/rifle/idle/survivor-idle_rifle_"
				name: "rifle-idle"
				size: 19
				frame-length: 3
				adjust: 
					scale: "-1,1"
					translate: "0,16"

			move:
				path: "textures/rifle/move/survivor-move_rifle_"
				name: "rifle-move"
				size: 19
				frame-length: 3
				adjust: 
					scale: "-1,1"
					translate: "0,16"

			attack:
				path: "textures/rifle/meleeattack/survivor-meleeattack_rifle_"
				name: "rifle-meleeattack"
				size: 14
				frame-length: 2
				adjust: 
					scale: "-1,1"
					translate: "0,16"

			shoot:
				path: "textures/rifle/shoot/survivor-shoot_rifle_"
				name: "rifle-shoot"
				size: 2
				frame-length: 3
				adjust: 
					scale: "-1,1"
					translate: "0,16"

			reload:
				path: "textures/rifle/reload/survivor-reload_rifle_"
				name: "rifle-reload"
				size: 14
				frame-length: 3
				adjust: 
					scale: "-1,1"
					translate: "0,16"
		shotgun:
			idle:
				path: "textures/shotgun/idle/survivor-idle_shotgun_"
				name: "shotgun-idle"
				size: 19
				frame-length: 3
				adjust: 
					scale: "-1,1"
					translate: "0,16"

			move:
				path: "textures/shotgun/move/survivor-move_shotgun_"
				name: "shotgun-move"
				size: 19
				frame-length: 3
				adjust: 
					scale: "-1,1"
					translate: "0,16"

			attack:
				path: "textures/shotgun/meleeattack/survivor-meleeattack_shotgun_"
				name: "shotgun-meleeattack"
				size: 14
				frame-length: 2
				adjust: 
					scale: "-1,1"
					translate: "0,16"

			shoot:
				path: "textures/shotgun/shoot/survivor-shoot_shotgun_"
				name: "shotgun-shoot"
				size: 2
				frame-length: 3
				adjust: 
					scale: "-1,1"
					translate: "0,16"

			reload:
				path: "textures/shotgun/reload/survivor-reload_shotgun_"
				name: "shotgun-reload"
				size: 14
				frame-length: 3
				adjust: 
					scale: "-1,1"
					translate: "0,16"

		flashlight:
			idle:
				path: "textures/flashlight/idle/survivor-idle_flashlight_"
				name: "flashlight-idle"
				size: 19
				frame-length: 3
				adjust: 
					scale: "1.25,1.25"
					translate: "0,-10"

			move:
				path: "textures/flashlight/move/survivor-move_flashlight_"
				name: "flashlight-move"
				size: 19
				frame-length: 3
				adjust: 
					scale: "1.25,1.25"
					translate: "0,-10"

			attack:
				path: "textures/flashlight/meleeattack/survivor-meleeattack_flashlight_"
				name: "flashlight-meleeattack"
				size: 14
				frame-length: 2
				adjust: 
					scale: "1.25,1.25"
					translate: "-5,-10"

	feet:
		idle:
			path: "textures/feet/idle/survivor-idle_"
			name: "feet-idle"
			size: 1
			frame-length: 3
			adjust: 
				scale: "-0.6,0.6"
				translate: "3,0"

		run:
			path: "textures/feet/run/survivor-run_"
			name: "feet-run"
			size: 19
			frame-length: 3
			adjust: 
				scale: "-0.6,0.6"
				translate: "3,0"

		walk:
			path: "textures/feet/walk/survivor-walk_"
			name: "feet-walk"
			size: 19
			frame-length: 3
			adjust: 
				scale: "-0.6,0.6"
				translate: "3,0"

		strafe_left:
			path: "textures/feet/strafe_left/survivor-strafe_left_"
			name: "feet-strafe_left"
			size: 19
			frame-length: 3
			adjust: 
				scale: "-0.6,0.6"
				translate: "3,0"

		strafe_right:
			path: "textures/feet/strafe_right/survivor-strafe_right_"
			name: "feet-strafe_right"
			size: 19
			frame-length: 3
			adjust: 
				scale: "-0.7,0.7"
				translate: "3,0"

	zombie:
		idle:
			path: "textures/zombie/idle/skeleton-idle_"
			name: "idle"
			size: 16
			frame-length: 5
			adjust: 
				scale: ".70,.70"
				translate: "6,-1"

		attack:
			path: "textures/zombie/attack/skeleton-attack_"
			name: "attack"
			size: 8
			frame-length: 5
			adjust: 
				scale: ".94,.94"
				translate: "6,-1"

		move:
			path: "textures/zombie/move/skeleton-move_"
			name: "move"
			size: 16
			frame-length: 5
			adjust: 
				scale: ".92,.92"
				translate: "6,-1"








var guns = [   
	#       cap,   rate,  spread, damage, power, projectiles, speed, reload_time,  name,        price. penetration
	Gun.new(12,    150,   8,      13,     20,    1,           12,     1000,         'handgun',   500, 1,{
		shot:   {src: 'sounds/pistol_shot.ogg', volume: 1}
		reload: {src: 'sounds/reload.ogg',   volume: 1}
	})
	Gun.new(5,     60,    15,     12,     16,    6,           12,     2200,         'shotgun',   20000, 1, {
		shot:   {src: 'sounds/shotgun_shot.ogg', volume: 1}
		reload: {src: 'sounds/reload.ogg',   volume: 1}
	})
	Gun.new(15,    500,   10,     40,     28,    1,           22,    1500,         'rifle',     30000, 3,{
		shot:   {src: 'sounds/rifle_shot.ogg', volume: 1}
		reload: {src: 'sounds/reload.ogg',   volume: 1}
	})
]
# [   #       cap,   rate,  spread, damage, power, projectiles, speed, reload_time,  name,               price
#     Gun.new(6,     150,   6,      30,     15,    1,           8,     2000,         'revolver',         0)
#     Gun.new(12,    280,   10,     13,     15,    1,           7,     1000,         'usp45',            500)
#     Gun.new(7,     100,   20,     50,     30,    1,           8,     1400,         'desert eagle',     5000)
#     Gun.new(30,    1000,  15,     13,     5,     1,           8,     1000,         'mp5',              10000)
#     Gun.new(5,     60,    25,     12,     16,    6,           8,     2200,         'pump shotgun',     20000)
#     Gun.new(15,    600,   20,     40,     20,    1,           12,    1500,         'ak47',             30000)
#     Gun.new(25,    800,   15,     30,     15,    1,           13,    1200,         'm4a1',             33000)
#     Gun.new(5,     60,    4,      100,    20,    1,           15,    1600,         'm95',              18000)
# ]
var player = Player.new(guns, animations.player, animations.feet)
let zombies = {} 
for i in Array.from(Array.new(50000).keys())
	let zombie = Zombie.new(player, 1, animations.zombie)
	zombies[zombie.currentSector()] ||= Set.new
	zombies[zombie.currentSector()].add(zombie)

let bushes = {}
for i in Array.from(Array.new(200000).keys())
	let obj = Obstacle.new(player,50)
	bushes[obj.currentSector()] ||= Set.new
	bushes[obj.currentSector()].add(obj)

let barrels = {}
for i in Array.from(Array.new(20000).keys())
	let obj = Obstacle.new(player,20)
	barrels[obj.currentSector()] ||= Set.new
	barrels[obj.currentSector()].add(obj)

global.STATE = 
	game: Game
	time: 0
	keys: []
	mouse: {x: 0, y: 0}
	player: player
	bullets: Set.new
	camera: {}
	zombies: zombies
	killed: Set.new
	delta: 1
	day: 1
	bushes: bushes
	barrels: barrels
	svg: 
		height: 1
		width: 1
	store: guns.slice(1,guns.len)
	shop: {
		guns: []
		upgrade-gun: null
		health: 500
		speed: 500
		max-stamina: 500
		slots: 5000
	}
	animations: animations