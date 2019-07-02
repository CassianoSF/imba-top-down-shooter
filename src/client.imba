import Game      from './classes/Game'
import Player    from './classes/Player'
import Gun       from './classes/Gun'
import Animation from './classes/Animation'
import Crosshair from './classes/Crosshair'
import Zombie    from './classes/Zombie'



let audios = 
    theme1:            Audio.new('sounds/theme1.mp3')
    theme0:            Audio.new('sounds/theme0.mp3')
    theme2:            Audio.new('sounds/theme2.mp3')
    theme3:            Audio.new('sounds/theme3.mp3')
    shotgun_shot:      Audio.new('sounds/shotgun_shot.wav')
    shotgun_pump:      Audio.new('sounds/shotgun_pump.wav')
    shotgun_reload:    Audio.new('sounds/shotgun_reload.wav')

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

for i in Array.from(Array.new(30))
    barrels.push 
        x: Math.random * 2000
        y: Math.random * 2000
        rotation: Math.random * 360
        id: Math.random

let boxes = []

for i in Array.from(Array.new(30))
    boxes.push
        x: Math.random * 2000
        y: Math.random * 2000
        rotation: Math.random * 360
        id: Math.random

let game = Game.new 
    keys: {}
    time: 0
    barrels: barrels
    boxes: boxes

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

    rifle: Gun.new
        name: :rifle
        ammo: 30
        cap: 30
        rate: 10
        damage: 10
        reload-time: 2000
        power: 15
        accuracy: 10

    shotgun: Gun.new
        name: :shotgun
        ammo: 4
        cap: 4
        rate: 0.75
        damage: 25
        reload-time: 3000
        power: 25
        accuracy: 8

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
        speed: 1
        max-speed: 6
        game: game
        zombies: zombies
        player: player


let crosshair = Crosshair.new(x:0, y:0)

tag Undead < svg:g
    attr transform
    prop player
    prop game
    prop zombie

    def render
        if zombie
            zombie.update player, game, zombies
            <self transform=("translate({zombie.pos:x},{zombie.pos:y}) rotate({zombie.rotation})")>
                <svg:g transform="translate({-50}, {-50})">
                    <svg:rect transform="scale({zombie.animation.adjust:scale}) translate({zombie.animation.adjust:translate})" height=100 width=100 fill="url(#zombie-{zombie.animation.path}-{~~(game.time/zombie.animation.frame-length % zombie.animation.size)})">
                    if zombie.taking-hit
                        <svg:g transform=("rotate(-90) translate({-100}, {-50})")>
                            <svg:rect height=100 width=100 fill="url(#blood-splash-{zombie.taking-hit})">

tag Survival < svg:g
    attr transform
    prop player
    prop game


    def render
        <self transform="translate({ window:innerWidth/2 + player.pos:x}, { window:innerHeight/2 + player.pos:y}) rotate({player.rotation})">
            <Shot gun=player.gun> if player.shooting
            <svg:g transform="translate({-50}, {-50})">
                <svg:rect transform="scale({player.feet-animation.adjust:scale}) translate({player.feet-animation.adjust:translate})" height=100 width=100 fill="url(#{player.feet-animation.name}-{~~(game.time/player.feet-animation.frame-length) % player.feet-animation.size})">
                <svg:rect transform="scale({player.animation.adjust:scale}) translate({player.animation.adjust:translate})" height=100 width=100 fill="url(#{player.animation.name}-{~~(game.time/player.animation.frame-length) % player.animation.size})">

tag Ground < svg:g
    prop player
    attr height
    attr width
    attr transform

    def render
        <self height=70000 width=70000 transform="translate({ - 35000},{ - 35000})">
            <svg:g>
                <svg:rect height=70000 width=70000 fill="url(#floor_2)" stroke="white">

tag Shot < svg:g
    attr transform
    prop rotation
    prop gun

    def render
        <self>
            if gun.name == :handgun
                <svg:rect transform="translate(30, -25)" height=100 width=100 fill="url(#shot)">
            elif gun.name == :rifle or gun.name == :shotgun
                <svg:rect transform="translate(55, -30)" height=100 width=100 fill="url(#shot)">

tag Projectile < svg:g
    attr transform
    prop bullet
    prop player

    def render
        bullet.update zombies, game, player
        <self transform="translate({ window:innerWidth/2 + bullet.pos:x}, { window:innerHeight/2 - bullet.pos:y}) rotate({bullet.direction})">
            <svg:rect height=1 width=50 fill="yellow">


tag Aim < svg:g
    attr transform
    prop crosshair

    def render
        <self transform="translate({crosshair.x}, {crosshair.y + window:innerHeight})">
            <svg:circle r=10 stroke="rgb(60,255,60)">
            <svg:circle r=8 fill="rgb(60,255,60)">
            <svg:circle r=2 fill="black">

tag Hud < svg:g
    attr height
    attr width
    prop player
    prop game

    def render
        <self>
            if player.taking-hit
                <svg:g transform="translate({game.width/2}, {game.height/2})">
                    <svg:rect transform=("rotate({player.blood-rotation})") .blood-hud height=game.height/1.5 width=game.width/1.5 fill="url(#blood-hud-{player.taking-hit})">


tag Barrel < svg:g
    attr transform
    prop barrel

    def render
        <self transform="translate({barrel:x},{barrel:y}) rotate({barrel:rotation})">
            <svg:g transform="translate({-25}, {-25})">
                <svg:rect height=50 width=50 fill="url(#barrel)">

tag Box < svg:g
    attr transform
    prop box
    prop images_loaded default: 0

    def render
        <self transform="translate({box:x},{box:y}) rotate({box:rotation})">
            <svg:g transform="translate({-50}, {-50})">
                <svg:rect height=100 width=100 fill="url(#box)">

tag App
    prop survival-animations
    prop feet-animation
    prop images-loaded default: {}
    prop shot-loaded
    prop audios-loaded default: {}

    def build
        survival-animations = loadSurvivalAnimations
        feet-animation = loadFeetAnimations

    def mount
        let images = Array.from(document.getElementsByTagName('image'))
        for i in images
            i:onload = do images-loaded[i:attributes:href:value] = true

        for k, audio of audios
            console.log k
            audio:oncanplaythrough = do audios-loaded[k] = true


        let shot = Audio.new('sounds/shotgun_shot.wav')
        shot:oncanplaythrough = do shot-loaded = true

        @theme-start = no
        schedule interval: 16
        document.addEventListener 'keydown', do |e|
            keydown e
            unless @theme-start
                let theme0 = Audio.new('sounds/theme1.mp3')
                theme0:volume = 0.5
                let theme1 = Audio.new('sounds/theme0.mp3')
                theme1:volume = 0.5
                let theme2 = Audio.new('sounds/theme2.mp3')
                theme2:volume = 0.5
                let theme3 = Audio.new('sounds/theme3.mp3')
                theme3:volume = 0.5
                theme0:onended = (do theme1.play)
                theme1:onended = (do theme2.play)
                theme2:onended = (do theme3.play)
                theme3:onended = (do theme0.play)
                theme0.play
                @theme-start=yes

        document.addEventListener 'keyup', do |e|
            keyup e

        document.addEventListener 'mousemove', do |e|
            aim e

        document.addEventListener 'mousedown' do |e|
            game.keys['leftbutton'] = yes if e:button == 0
            game.keys['rightbutton'] = yes if e:button == 2
            shoot if e:button == 0
            player.attack(zombies) if e:button == 2

        document.addEventListener 'mouseup' do |e|
            game.keys['rightbutton'] = no if e:button == 2
            game.keys['leftbutton'] = no if e:button == 0

        document.addEventListener 'contextmenu', do |e|
            e.preventDefault

    def aim e
        crosshair.x = e:x
        crosshair.y = -e:y
        player.rotation = ((Math.atan2(e:x - window:innerWidth/2, e:y - window:innerHeight/2)/3.1415*180.0 - 90) + 720) % 360 

    def keydown e
        player.changeGun :knife      if e:code == :Digit1 and player.invertory:knife
        player.changeGun :handgun    if e:code == :Digit2 and player.invertory:handgun
        player.changeGun :rifle      if e:code == :Digit3 and player.invertory:rifle
        player.changeGun :shotgun    if e:code == :Digit4 and player.invertory:shotgun
        player.changeGun :flashlight if e:code == :KeyF   and player.invertory:flashlight
        player.reload if e:code == :KeyR
        game.keys[e:code] = yes

    def keyup e
        game.keys[e:code] = no

    def shoot
        player.shoot if [:handgun, :shotgun, :rifle].includes player.gun.name
        player.attack(zombies) if [:flashlight, :knife].includes player.gun.name

    def tick
        shoot if game.keys:leftbutton
        player.attack(zombies) if game.keys:rightbutton
        game.width = window:innerWidth
        game.height = window:innerHeight
        let directions = []
        directions.push :left  if game.keys:KeyA
        directions.push :right if game.keys:KeyD
        directions.push :down  if game.keys:KeyS
        directions.push :up    if game.keys:KeyW
        player.running = game.keys:ShiftLeft
        player.move directions
        game.time += 1
        render

    def loadImg
        images_loaded += 1

    def loadSurvivalAnimations
        for gun, anims of animations:player
            for action, anim of anims
                for a, i in Array.from(Array.new(anim.size))
                    <svg:defs>
                        <svg:pattern id="{anim.name}-{i}" patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                            <svg:image href="{anim.path}{i}.png" width="100" height="100">

    def loadFeetAnimations
        for name, anim of animations:feet
            for a, i in Array.from(Array.new(anim.size))
                <svg:defs>
                    <svg:pattern id="{anim.name}-{i}" patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                        <svg:image href="{anim.path}{i}.png" width="100" height="100">

    def render
        console.log Object.keys(audios-loaded):length
        let x = player.shooting ? Math.random*15 - 7.5 : 0
        let y = player.shooting ? Math.random*15 - 7.5 : 0
        <self .container>
            <svg:svg .game transform="scale(1,-1)">
                survival-animations
                feet-animation

                <svg:defs>
                    <svg:pattern #floor_2 patternUnits="userSpaceOnUse" width="700" height="700" patternContentUnits="userSpaceOnUse">
                        <svg:image href="textures/the_floor/the_floor/floor_2.png" width="700" height="700">

                <svg:defs>
                    <svg:pattern #shot patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                        <svg:image href="textures/shoot/shoot/muzzle_flash_0.png" width="100" height="100">
                # BARREL
                <svg:defs>
                    <svg:pattern id="barrel" patternUnits="userSpaceOnUse" width="50" height="50" patternContentUnits="userSpaceOnUse">
                        <svg:image href="textures/the_floor/the_floor/barrel.png" width="50" height="50">
                # BOX
                <svg:defs>
                    <svg:pattern id="box" patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                        <svg:image href="textures/the_floor/the_floor/crate_1.png" width="100" height="100">


                # BLOOD HUD
                <svg:defs>
                    <svg:pattern id="blood-hud-1" patternUnits="userSpaceOnUse" width="{window:innerWidth/2}" height="{window:innerHeight/2}" patternContentUnits="userSpaceOnUse">
                        <svg:image href="textures/blood_hud/1.png" width="{window:innerWidth/2}" height="{window:innerHeight/2}">
                <svg:defs>
                    <svg:pattern id="blood-hud-2" patternUnits="userSpaceOnUse" width="{window:innerWidth/2}" height="{window:innerHeight/2}" patternContentUnits="userSpaceOnUse">
                        <svg:image href="textures/blood_hud/2.png" width="{window:innerWidth/2}" height="{window:innerHeight/2}">


                # BLOOD SPLASH
                for a, i in Array.from(Array.new(6))
                    <svg:defs>
                        <svg:pattern id="blood-splash-{i+1}" patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                            <svg:image href="textures/blood_splash/{i+1}.png" width="100" height="100">
                
                # ZOMBIE ANIMATIONS
                for a, i in Array.from(Array.new(17))
                    <svg:defs>
                        <svg:pattern id="zombie-idle-{i}" patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                            <svg:image href="textures/zombie/idle/skeleton-idle_{i}.png" width="100" height="100">

                for a, i in Array.from(Array.new(17))
                    <svg:defs>
                        <svg:pattern id="zombie-move-{i}" patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                            <svg:image href="textures/zombie/move/skeleton-move_{i}.png" width="100" height="100">

                for a, i in Array.from(Array.new(9))
                    <svg:defs>
                        <svg:pattern id="zombie-attack-{i}" patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                            <svg:image href="textures/zombie/attack/skeleton-attack_{i}.png" width="100" height="100">

                if Object.keys(images-loaded):length == 440 and Object.keys(audios-loaded):length == 27
                    <svg:g transform=("translate({x - player.pos:x}, {y - player.pos:y})")>
                        <Ground player=player>
                        <Survival player=player game=game>
                        for zombie in zombies
                            <Undead zombie=zombie player=player game=game>
                        for bullet in player.bullets
                            <Projectile bullet=bullet player=player> if bullet
                        # for box in game.boxes
                        #     <Box box=box>
                        # for barrel in game.barrels
                        #     <Barrel barrel=barrel>
                    <Hud player=player game=game>
                    <Aim crosshair=crosshair>
                else
                    <svg:g transform="translate({window:innerWidth/2},{window:innerHeight/2}) scale(1, -1)">
                        <svg:text fill="black">
                            "LOADING.... {~~(Object.keys(images-loaded):length/8.8 + Object.keys(audios-loaded):length/0.54)}%"
                    <svg:g transform="translate({window:innerWidth/2},{window:innerHeight/2 + 100}) scale(1, -1)">
                        <svg:text fill="black">
                            "Tip: ZoomOut to 80%"
Imba.mount <App>

