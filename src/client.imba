import Game      from './classes/Game'
import Player    from './classes/Player'
import Gun       from './classes/Gun'
import Animation from './classes/Animation'
import Crosshair from './classes/Crosshair'
import Zombie    from './classes/Zombie'

import App from './tags/App'

let audios = 
    theme1:            Audio.new('sounds/theme1.mp3')
    theme0:            Audio.new('sounds/theme0.mp3')
    theme2:            Audio.new('sounds/theme2.mp3')
    theme3:            Audio.new('sounds/theme3.mp3')
    shotgun-shot:      Audio.new('sounds/shotgun_shot.wav')
    shotgun_pump:      Audio.new('sounds/shotgun_pump.wav')
    shotgun_reload:    Audio.new('sounds/shotgun_reload.wav')
    shotgun0:          Audio.new('sounds/shotgun0.wav')
    shotgun1:          Audio.new('sounds/shotgun1.wav')
    pistol:            Audio.new('sounds/pistol.wav')

for i in Object.keys(Array.from(Array.new(10)))
    audios["survivor_yell{i}"] = Audio.new("sounds/survivor_yell/3yell{i}.wav")
for i in Object.keys(Array.from(Array.new(4)))
    audios["zombie_hit{i}"] = Audio.new("sounds/zombie_hit/{i}.wav")
for i in Object.keys(Array.from(Array.new(3)))
    audios["melee{i}"] = Audio.new("sounds/melee{i}.wav")
for i in Object.keys(Array.from(Array.new(4)))
    audios["zombie_hit{i}"] = Audio.new("sounds/zombie_hit/{i}.wav")
for i in Object.keys(Array.from(Array.new(3)))
    audios["zombie-attack{i}"] = Audio.new("sounds/zombie-attack{i}.ogg")

let barrels = []

for i in Array.from(Array.new(100))
    barrels.push 
        x: Math.random * 5000 - 2000
        y: Math.random * 5000
        rotation: Math.random * 360
        id: Math.random
        size: 30

let boxes = []

for i in Array.from(Array.new(100))
    boxes.push
        x: Math.random * 5000 - 2000
        y: Math.random * 5000
        rotation: Math.random * 360
        id: Math.random
        size: 70

let crosshair = Crosshair.new(x:0, y:0)

let game = Game.new 
    keys: {}
    time: 0
    barrels: barrels
    boxes: boxes
    crosshair: crosshair

let animations = 
    player:
        knife:
            idle:   Animation.new
                path: "textures/knife/idle/survivor-idle_knife_"
                name: "knife-idle"
                size: 19
                frame-length: 3
                adjust: 
                    scale: "1.15,1.15"
                    translate: "-5,0"

            move:   Animation.new
                path: "textures/knife/move/survivor-move_knife_"
                name: "knife-move"
                size: 19
                frame-length: 3
                adjust: 
                    scale: "1.15,1.15"
                    translate: "-5,0"

            attack: Animation.new
                path: "textures/knife/meleeattack/survivor-meleeattack_knife_"
                name: "knife-meleeattack"
                size: 14
                frame-length: 2
                adjust: 
                    scale: "1.3,1.3"
                    translate: "-5,5"

        handgun:
            idle:   Animation.new
                path: "textures/handgun/idle/survivor-idle_handgun_"
                name: "handgun-idle"
                size: 19
                frame-length: 3
                adjust: 
                    scale: "1,1"
                    translate: "0,0"

            move:   Animation.new
                path: "textures/handgun/move/survivor-move_handgun_"
                name: "handgun-move"
                size: 19
                frame-length: 3
                adjust: 
                    scale: "1,1"
                    translate: "0,0"

            attack: Animation.new
                path: "textures/handgun/meleeattack/survivor-meleeattack_handgun_"
                name: "handgun-meleeattack"
                size: 14
                frame-length: 2
                adjust: 
                    scale: "1.2,1.2"
                    translate: "0,-5"

            shoot:  Animation.new
                path: "textures/handgun/shoot/survivor-shoot_handgun_"
                name: "handgun-shoot"
                size: 2
                frame-length: 3
                adjust: 
                    scale: "1,1"
                    translate: "0,0"

            reload: Animation.new
                path: "textures/handgun/reload/survivor-reload_handgun_"
                name: "handgun-reload"
                size: 14
                frame-length: 3
                adjust: 
                    scale: "1,1"
                    translate: "0,0"

        rifle:
            idle:   Animation.new
                path: "textures/rifle/idle/survivor-idle_rifle_"
                name: "rifle-idle"
                size: 19
                frame-length: 3
                adjust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"

            move:   Animation.new
                path: "textures/rifle/move/survivor-move_rifle_"
                name: "rifle-move"
                size: 19
                frame-length: 3
                adjust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"

            attack: Animation.new
                path: "textures/rifle/meleeattack/survivor-meleeattack_rifle_"
                name: "rifle-meleeattack"
                size: 14
                frame-length: 2
                adjust: 
                    scale: "1.45,1.45"
                    translate: "-5,-20"

            shoot:  Animation.new
                path: "textures/rifle/shoot/survivor-shoot_rifle_"
                name: "rifle-shoot"
                size: 2
                frame-length: 3
                adjust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"

            reload: Animation.new
                path: "textures/rifle/reload/survivor-reload_rifle_"
                name: "rifle-reload"
                size: 14
                frame-length: 3
                adjust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"
        shotgun:
            idle:   Animation.new
                path: "textures/shotgun/idle/survivor-idle_shotgun_"
                name: "shotgun-idle"
                size: 19
                frame-length: 3
                adjust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"

            move:   Animation.new
                path: "textures/shotgun/move/survivor-move_shotgun_"
                name: "shotgun-move"
                size: 19
                frame-length: 3
                adjust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"

            attack: Animation.new
                path: "textures/shotgun/meleeattack/survivor-meleeattack_shotgun_"
                name: "shotgun-meleeattack"
                size: 14
                frame-length: 2
                adjust: 
                    scale: "1.45,1.45"
                    translate: "-5,-20"

            shoot:  Animation.new
                path: "textures/shotgun/shoot/survivor-shoot_shotgun_"
                name: "shotgun-shoot"
                size: 2
                frame-length: 3
                adjust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"

            reload: Animation.new
                path: "textures/shotgun/reload/survivor-reload_shotgun_"
                name: "shotgun-reload"
                size: 14
                frame-length: 3
                adjust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"

        flashlight:
            idle:   Animation.new
                path: "textures/flashlight/idle/survivor-idle_flashlight_"
                name: "flashlight-idle"
                size: 19
                frame-length: 3
                adjust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"

            move:   Animation.new
                path: "textures/flashlight/move/survivor-move_flashlight_"
                name: "flashlight-move"
                size: 19
                frame-length: 3
                adjust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"

            attack: Animation.new
                path: "textures/flashlight/meleeattack/survivor-meleeattack_flashlight_"
                name: "flashlight-meleeattack"
                size: 14
                frame-length: 2
                adjust: 
                    scale: "1.25,1.25"
                    translate: "-5,-10"

    feet:
        idle:         Animation.new
            path: "textures/feet/idle/survivor-idle_"
            name: "feet-idle"
            size: 1
            frame-length: 3
            adjust: 
                scale: "0.9,0.9"
                translate: "0,10"

        run:          Animation.new
            path: "textures/feet/run/survivor-run_"
            name: "feet-run"
            size: 19
            frame-length: 3
            adjust: 
                scale: "0.9,0.9"
                translate: "0,10"

        walk:         Animation.new
            path: "textures/feet/walk/survivor-walk_"
            name: "feet-walk"
            size: 19
            frame-length: 3
            adjust: 
                scale: "0.9,0.9"
                translate: "0,10"

        strafe_left:  Animation.new
            path: "textures/feet/strafe_left/survivor-strafe_left_"
            name: "feet-strafe_left"
            size: 19
            frame-length: 3
            adjust: 
                scale: "0.9,0.9"
                translate: "0,10"

        strafe_right: Animation.new
            path: "textures/feet/strafe_right/survivor-strafe_right_"
            name: "feet-strafe_right"
            size: 19
            frame-length: 3
            adjust: 
                scale: "0.9,0.9"
                translate: "0,10"

    zombie:
        idle:    Animation.new
            path: "idle"
            size: 16
            frame-length: 3
            adjust: 
                scale: "1,1"
                translate: "0,0"

        attack:  Animation.new
            path: "attack"
            size: 8
            frame-length: 2
            adjust: 
                scale: "1.3,1.3"
                translate: "0,0"

        move:    Animation.new
            path: "move"
            size: 16
            frame-length: 3
            adjust: 
                scale: "1.3,1.3"
                translate: "0,0"

let guns = 
    knife: Gun.new
        name: :knife
        ammo: 0
        cap: 0
        rate: 2
        damage: 25
        reload-time: 0
        power: 10

    handgun: Gun.new
        name: :handgun
        ammo: 10
        cap: 10
        rate: 2
        damage: 25
        reload-time: 1200
        power: 10
        accuracy: 30
        shoot-sounds: [
            {src: audios:pistol:src, volume: 1}
        ]

    rifle: Gun.new
        name: :rifle
        ammo: 30
        cap: 30
        rate: 10
        damage: 25
        reload-time: 2000
        power: 15
        accuracy: 10
        shoot-sounds: [
            {src: audios:shotgun-shot:src, volume: 0.6}
        ]

    shotgun: Gun.new
        name: :shotgun
        ammo: 4
        cap: 4
        rate: 0.75
        damage: 35
        reload-time: 3000
        power: 25
        accuracy: 8
        shoot-sounds: [
            {src: audios:shotgun0:src, volume: 1}
        ]

    flashlight: Gun.new
        name: :flashlight
        ammo: 0
        cap: 0
        rate: 0
        damage: 0
        reload-time: 1
        power: 0
        accuracy: 0

let player = Player.new
    invertory: guns
    gun: guns:handgun
    pos:
        x: 0
        y: 0
    rotation: 0
    can-shoot: yes
    can-attack: yes
    speed: 3
    animation: animations:player:knife:idle
    animations: animations:player
    feet-animation: animations:feet:idle
    feet-animations: animations:feet
    game: game
    boxes: boxes
    barrels: barrels

game.player = player

let zombies = []
for i in Array.from(Array.new(70))
    zombies.push Zombie.new 
        id: Math.random
        pos: 
            x: player.pos:x + Math.random * 4000 - 2000 + window:innerWidth/2
            y: player.pos:y + Math.random * 4000 - 2000 + window:innerHeight/2
        rotation: Math.random*360
        animation: animations:zombie:idle
        animations: animations:zombie
        state: :random
        life: 100
        max-life: 100
        speed: 1
        max-speed: 5
        game: game
        zombies: zombies
        player: player
        boxes: boxes
        barrels: barrels

player.zombies = zombies

Imba.mount <App 
    crosshair=crosshair
    zombies=zombies
    player=player
    guns=guns
    animations=animations
    audios=audios
    boxes=boxes
    barrels=barrels
    game=game
>

