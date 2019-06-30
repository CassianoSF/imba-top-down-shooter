import Game      from './classes/Game'
import Player    from './classes/Player'
import Gun       from './classes/Gun'
import Animation from './classes/Animation'
import Crosshair from './classes/Crosshair'
import Zombie    from './classes/Zombie'

let game = Game.new 
    keys: {}
    time: 0

let animations = 
    player:
        knife:
            idle:   Animation.new
                path: "textures/knife/idle/survivor-idle_knife_"
                size: 19
                frame-length: 3
                ajust: 
                    scale: "1.15,1.15"
                    translate: "-5,0"

            move:   Animation.new
                path: "textures/knife/move/survivor-move_knife_"
                size: 19
                frame-length: 3
                ajust: 
                    scale: "1.15,1.15"
                    translate: "-5,0"

            attack: Animation.new
                path: "textures/knife/meleeattack/survivor-meleeattack_knife_"
                size: 14
                frame-length: 2
                ajust: 
                    scale: "1.3,1.3"
                    translate: "-5,5"

        handgun:
            idle:   Animation.new
                path: "textures/handgun/idle/survivor-idle_handgun_"
                size: 19
                frame-length: 3
                ajust: 
                    scale: "1,1"
                    translate: "0,0"

            move:   Animation.new
                path: "textures/handgun/move/survivor-move_handgun_"
                size: 19
                frame-length: 3
                ajust: 
                    scale: "1,1"
                    translate: "0,0"

            attack: Animation.new
                path: "textures/handgun/meleeattack/survivor-meleeattack_handgun_"
                size: 14
                frame-length: 2
                ajust: 
                    scale: "1.2,1.2"
                    translate: "0,-5"

            shoot:  Animation.new
                path: "textures/handgun/shoot/survivor-shoot_handgun_"
                size: 2
                frame-length: 3
                ajust: 
                    scale: "1,1"
                    translate: "0,0"

            reload: Animation.new
                path: "textures/handgun/reload/survivor-reload_handgun_"
                size: 14
                frame-length: 3
                ajust: 
                    scale: "1,1"
                    translate: "0,0"

        rifle:
            idle:   Animation.new
                path: "textures/rifle/idle/survivor-idle_rifle_"
                size: 19
                frame-length: 3
                ajust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"

            move:   Animation.new
                path: "textures/rifle/move/survivor-move_rifle_"
                size: 19
                frame-length: 3
                ajust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"

            attack: Animation.new
                path: "textures/rifle/meleeattack/survivor-meleeattack_rifle_"
                size: 14
                frame-length: 2
                ajust: 
                    scale: "1.45,1.45"
                    translate: "-5,-20"

            shoot:  Animation.new
                path: "textures/rifle/shoot/survivor-shoot_rifle_"
                size: 2
                frame-length: 3
                ajust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"

            reload: Animation.new
                path: "textures/rifle/reload/survivor-reload_rifle_"
                size: 14
                frame-length: 3
                ajust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"
        shotgun:
            idle:   Animation.new
                path: "textures/shotgun/idle/survivor-idle_shotgun_"
                size: 19
                frame-length: 3
                ajust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"

            move:   Animation.new
                path: "textures/shotgun/move/survivor-move_shotgun_"
                size: 19
                frame-length: 3
                ajust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"

            attack: Animation.new
                path: "textures/shotgun/meleeattack/survivor-meleeattack_shotgun_"
                size: 14
                frame-length: 2
                ajust: 
                    scale: "1.45,1.45"
                    translate: "-5,-20"

            shoot:  Animation.new
                path: "textures/shotgun/shoot/survivor-shoot_shotgun_"
                size: 2
                frame-length: 3
                ajust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"

            reload: Animation.new
                path: "textures/shotgun/reload/survivor-reload_shotgun_"
                size: 14
                frame-length: 3
                ajust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"

        flashlight:
            idle:   Animation.new
                path: "textures/flashlight/idle/survivor-idle_flashlight_"
                size: 19
                frame-length: 3
                ajust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"

            move:   Animation.new
                path: "textures/flashlight/move/survivor-move_flashlight_"
                size: 19
                frame-length: 3
                ajust: 
                    scale: "1.25,1.25"
                    translate: "0,-10"

            attack: Animation.new
                path: "textures/flashlight/meleeattack/survivor-meleeattack_flashlight_"
                size: 14
                frame-length: 2
                ajust: 
                    scale: "1.25,1.25"
                    translate: "-5,-10"

    feet:
        idle:         Animation.new
            path: "textures/feet/idle/survivor-idle_"
            size: 1
            frame-length: 3
            ajust: 
                scale: "0.9,0.9"
                translate: "0,10"

        run:          Animation.new
            path: "textures/feet/run/survivor-run_"
            size: 19
            frame-length: 3
            ajust: 
                scale: "0.9,0.9"
                translate: "0,10"

        walk:         Animation.new
            path: "textures/feet/walk/survivor-walk_"
            size: 19
            frame-length: 3
            ajust: 
                scale: "0.9,0.9"
                translate: "0,10"

        strafe_left:  Animation.new
            path: "textures/feet/strafe_left/survivor-strafe_left_"
            size: 19
            frame-length: 3
            ajust: 
                scale: "0.9,0.9"
                translate: "0,10"

        strafe_right: Animation.new
            path: "textures/feet/strafe_right/survivor-strafe_right_"
            size: 19
            frame-length: 3
            ajust: 
                scale: "0.9,0.9"
                translate: "0,10"

    zombie:
        idle:    Animation.new
            path: "textures/zombie/idle/skeleton-idle_"
            size: 16
            frame-length: 3
            ajust: 
                scale: "1,1"
                translate: "0,0"

        attack:  Animation.new
            path: "textures/zombie/attack/skeleton-attack_"
            size: 8
            frame-length: 2
            ajust: 
                scale: "1.3,1.3"
                translate: "0,0"

        move:    Animation.new
            path: "textures/zombie/move/skeleton-move_"
            size: 16
            frame-length: 3
            ajust: 
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
        power: 5
        accuracy: 30

    rifle: Gun.new
        name: :rifle
        ammo: 30
        cap: 30
        rate: 10
        damage: 10
        reload-time: 2000
        power: 8
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
for i in Array.from(Array.new(100))
    zombies.push Zombie.new 
        id: Math.random
        pos: 
            x: Math.random * 3000 
            y: Math.random * 3000 
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
                    <svg:defs>
                        <svg:pattern id="zombie-{zombie.id}" patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                            <svg:image href="{zombie.animation.path}{~~(game.time/3) % zombie.animation.size}.png" width="100" height="100">
                    <svg:rect transform="scale({zombie.animation.ajust:scale}) translate({zombie.animation.ajust:translate})" height=100 width=100 fill="url(#zombie-{zombie.id})">
                    if zombie.taking-hit
                        <svg:g transform=("rotate(-90) translate({-100}, {-50})")>
                            <svg:defs>
                                <svg:pattern id="blood-splash-{zombie.id}" patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                                    <svg:image href="textures/blood_splash/{zombie.taking-hit}.png" width="100" height="100">
                            <svg:rect height=100 width=100 fill="url(#blood-splash-{zombie.id})">

tag Survival < svg:g
    attr transform
    prop player
    prop game


    def render
        <self transform="translate({ window:innerWidth/2 + player.pos:x}, { window:innerHeight/2 + player.pos:y}) rotate({player.rotation})">
            <Shot gun=player.gun> if player.shooting
            <svg:g transform="translate({-50}, {-50})">
                <svg:defs>
                    <svg:pattern #legs patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                        <svg:image href="{player.feet-animation.path}{~~(game.time/player.feet-animation.frame-length) % player.feet-animation.size}.png" width="100" height="100">
                <svg:rect transform="scale({player.feet-animation.ajust:scale}) translate({player.feet-animation.ajust:translate})" height=100 width=100 fill="url(#legs)">
                <svg:defs>
                    <svg:pattern #survivor patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                        <svg:image href="{player.animation.path}{~~(game.time/player.animation.frame-length) % player.animation.size}.png" width="100" height="100">
                <svg:rect transform="scale({player.animation.ajust:scale}) translate({player.animation.ajust:translate})" height=100 width=100 fill="url(#survivor)">

tag Ground < svg:g
    prop player
    attr height
    attr width
    attr transform

    def mount
        schedule interval: 16.666


    def render
        <self height=70000 width=70000 transform="translate({ - 35000},{ - 35000})">
            <svg:g>
                <svg:defs>
                    <svg:pattern #floor_2 patternUnits="userSpaceOnUse" width="700" height="700" patternContentUnits="userSpaceOnUse">
                        <svg:image href="textures/the_floor/the_floor/floor_2.png" width="700" height="700">
                <svg:rect height=70000 width=70000 fill="url(#floor_2)" stroke="white">

tag Shot < svg:g
    attr transform
    prop rotation
    prop gun

    def render
        <self>
            <svg:defs>
                <svg:pattern #shot patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                    <svg:image href="textures/shoot/shoot/muzzle_flash_0.png" width="100" height="100">
            if gun.name == :handgun
                <svg:rect transform="translate(30, -25)" height=100 width=100 fill="url(#shot)">
            elif gun.name == :rifle
                <svg:rect transform="translate(55, -30)" height=100 width=100 fill="url(#shot)">

tag Projectile < svg:g
    attr transform
    prop bullet
    prop player

    def mount
        schedule interval: 1

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
                <svg:g transform="">
                    <svg:defs>
                        <svg:pattern id="blood-hud" patternUnits="userSpaceOnUse" width="{game.width/2}" height="{game.height/2}" patternContentUnits="userSpaceOnUse">
                            <svg:image href="textures/blood_hud/{player.taking-hit}.png" width="{game.width/2}" height="{game.height/2}">
                    <svg:rect transform=("translate({game.width/4}, {game.width/4}) rotate({player.blood-rotation})") .blood-hud height=game.height/1.5 width=game.width/1.5 fill="url(#blood-hud)">



tag App
    def mount
        @theme-start = no
        schedule interval: 17
        document.addEventListener 'keydown', do |e|
            keydown e
            unless @theme-start
                Audio.new('sounds/theme1.mp3').play
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
        player.gun = player.invertory:knife      if e:code == :Digit1 and player.invertory:knife
        player.gun = player.invertory:handgun    if e:code == :Digit2 and player.invertory:handgun
        player.gun = player.invertory:rifle      if e:code == :Digit3 and player.invertory:rifle
        player.gun = player.invertory:shotgun    if e:code == :Digit4 and player.invertory:shotgun
        player.gun = player.invertory:flashlight if e:code == :KeyF   and player.invertory:flashlight
        player.reload if e:code == :KeyR
        game.keys[e:code] = yes

    def keyup e
        game.keys[e:code] = no

    def shoot
        player.shoot if [:handgun, :shotgun, :rifle].includes player.gun.name
        player.attack(zombies) if [:flashlight, :knife].includes player.gun.name

    def tick
        shoot if game.keys:leftbutton
        player.attack if game.keys:rightbutton
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

    def render
        let x = player.shooting ? 2 : 0
        let y = player.shooting ? 2 : 0
        <self .container>
            <svg:svg .game transform="scale(1,-1)">
                <svg:g transform=("translate({x - player.pos:x}, {y - player.pos:y})")>
                    <Ground player=player>
                    <Survival player=player game=game>
                    for zombie in zombies
                        <Undead zombie=zombie player=player game=game>
                    for bullet in player.bullets
                        <Projectile bullet=bullet player=player> if bullet
                <Hud player=player game=game>
                <Aim crosshair=crosshair>
Imba.mount <App>

