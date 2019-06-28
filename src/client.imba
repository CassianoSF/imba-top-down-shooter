class Game
    prop keys
    prop time

    def initialize 
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1

let bullets = []

class Player
    prop invertory
    prop gun
    prop pos
    prop rotation
    prop can-shoot
    prop can-attack
    prop speed
    prop running
    prop reputation
    prop animation
    prop animations
    prop feet-animation
    prop feet-animations
    prop game

    prop shooting
    prop reloading
    prop running
    prop attacking

    def move directions
        feet-animation = feet-animations:run if running and directions:length
        feet-animation = feet-animations:walk if !running and directions:length
        feet-animation = feet-animations:idle if !directions:length
        let step
        if !reloading and !shooting and !attacking 
            animation = animations[gun.name]:move if directions:length
            animation = animations[gun.name]:idle unless directions:length
        if directions:length > 1
            step = speed * 0.7
        else
            step = speed

        if running
            step *= 2

        for d in directions
            switch d
                when :left
                    pos:x -= step
                when :right
                    pos:x += step
                when :down
                    pos:y -= step        
                when :up
                    pos:y += step

    def shoot
        reload unless gun.ammo
        if gun.ammo and can-shoot
            game.time = 0
            let audio = Audio.new('sounds/shotgun_shot.wav')
            audio.play
            bullets.push Bullet.new
                pos: 
                    # x: 0
                    x: Math.sin((rotation + 90)* 3.1415 / 180) * 100
                    y: Math.cos((rotation + 90)* 3.1415 / 180) * 100
                direction: rotation
            gun.ammo -= 1
            can-shoot = no
            shooting = yes
            animation = animations[gun.name]:shoot
            window.setTimeout((do delete audio),    10000)
            window.setTimeout((do can-shoot = yes), 1000/gun.rate)
            window.setTimeout((do shooting = no),   50)

    def attack
        if can-attack
            game.time = 0
            can-attack = no
            attacking = yes
            animation = animations[gun.name]:attack
            window.setTimeout(( do
                can-attack = yes
                attacking = no        
            ), 600)

    def reload
        if gun.ammo != gun.cap
            game.time = 0
            let audio = Audio.new('sounds/shotgun_reload.wav')
            let audio2 = Audio.new('sounds/shotgun_pump.wav')
            audio.play
            audio2.play
            can-shoot = no
            reloading = yes
            animation = animations[gun.name]:reload
            window.setTimeout((do
                can-shoot = yes
                reloading = no
                delete audio
                audio2.pause
                delete audio2
                gun.ammo = gun.cap
            ), gun.reload-time)

    def initialize
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1

class Gun
    prop ammo
    prop cap
    prop rate
    prop damage
    prop reload-time
    prop name

    def initialize
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1

class Animation
    prop path
    prop size
    prop time default: 0

    def initialize
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1


class Bullet
    prop direction
    prop pos

    def fly
        window.setTimeout( (do
            pos:x += Math.sin((direction + 90 ) * 3.1415 / 180) * 30
            pos:y += Math.cos((direction + 90 ) * 3.1415 / 180) * 30
            if pos:x**2 + pos:y**2 > 10000000
                delete self
                bullets.shift
                return
            fly
        ), 1);

    def initialize
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1
        fly


class Crosshair
    prop x
    prop y

    def initialize
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1

let game = Game.new 
    keys: {}
    time: 0

let animations = 
    player:
        knife:
            idle:   Animation.new(path: "textures/knife/idle/survivor-idle_knife_", size: 19)
            move:   Animation.new(path: "textures/knife/move/survivor-move_knife_", size: 19)
            attack: Animation.new(path: "textures/knife/meleeattack/survivor-meleeattack_knife_", size: 14)
        handgun:
            idle:   Animation.new(path: "textures/handgun/idle/survivor-idle_handgun_", size: 19)
            move:   Animation.new(path: "textures/handgun/move/survivor-move_handgun_", size: 19)
            attack: Animation.new(path: "textures/handgun/meleeattack/survivor-meleeattack_handgun_", size: 14)
            shoot:  Animation.new(path: "textures/handgun/shoot/survivor-shoot_handgun_", size: 2)
            reload: Animation.new(path: "textures/handgun/reload/survivor-reload_handgun_", size: 14)
    feet:
        idle:         Animation.new(path: "textures/feet/idle/survivor-idle_", size: 1)
        run:          Animation.new(path: "textures/feet/run/survivor-run_", size: 19)
        walk:         Animation.new(path: "textures/feet/walk/survivor-walk_", size: 19)
        strafe_left:  Animation.new(path: "textures/feet/strafe_left/survivor-strafe_left_", size: 19)
        strafe_right: Animation.new(path: "textures/feet/strafe_right/survivor-strafe_right_", size: 19)

let guns = 
    knife: Gun.new
        name: :knife
        ammo: 0
        cap: 0
        rate: 3
        damage: 50
        reload-time: 0

    handgun: Gun.new
        name: :handgun
        ammo: 10
        cap: 10
        rate: 3
        damage: 33
        reload-time: 1000

let player = Player.new
    invertory: guns
    gun: guns:handgun
    pos:
        x: 0
        y: 0
    rotation: 0
    can-shoot: yes
    can-attack: yes
    speed: 10
    animation: animations:player:knife:idle
    animations: animations:player
    feet-animation: animations:feet:idle
    feet-animations: animations:feet
    game: game


let crosshair = Crosshair.new(x:0, y:0)

tag Survival < svg:g
    attr transform
    prop player
    prop game

    def render
        <self transform="translate({ window:innerWidth/2 }, { window:innerHeight/2 }) rotate({player.rotation})">
            <Shot> if player.shooting
            <svg:g transform="translate({-50}, {-50})">
                <svg:defs>
                    <svg:pattern #legs patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                        <svg:image href="{player.feet-animation.path}{game.time % player.feet-animation.size}.png" width="100" height="100">
                <svg:rect height=100 width=100 fill="url(#legs)">
                <svg:defs>
                    <svg:pattern #survivor patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                        <svg:image href="{player.animation.path}{game.time % player.animation.size}.png" width="100" height="100">
                <svg:rect height=100 width=100 fill="url(#survivor)">

tag Ground < svg:g
    prop player
    attr height
    attr width
    attr transform

    def mount
        schedule interval: 16.666


    def render
        <self height=70000 width=70000 transform="translate({-player.pos:x - 35000},{-player.pos:y - 35000})">
            <svg:g>
                <svg:defs>
                    <svg:pattern #floor_2 patternUnits="userSpaceOnUse" width="700" height="700" patternContentUnits="userSpaceOnUse">
                        <svg:image href="textures/the_floor/the_floor/floor_2.png" width="700" height="700">
                <svg:rect height=70000 width=70000 fill="url(#floor_2)" stroke="white">

tag Shot < svg:g
    prop rotation
    attr transform

    def render
        <self transform="translate(30, -25)">
            <svg:defs>
                <svg:pattern #shot patternUnits="userSpaceOnUse" width="100" height="100" patternContentUnits="userSpaceOnUse">
                    <svg:image href="textures/shoot/shoot/muzzle_flash_0.png" width="100" height="100">
            <svg:rect height=100 width=100 fill="url(#shot)">

tag Projectile < svg:g
    attr transform
    prop bullet
    prop player

    def render
        <self transform="translate({ window:innerWidth/2 + bullet.pos:x}, { window:innerHeight/2 - bullet.pos:y}) rotate({bullet.direction})">
            <svg:rect height=1 width=100 fill="yellow">


tag Aim < svg:g
    attr transform
    prop crosshair

    def render
        <self transform="translate({crosshair.x}, {crosshair.y + window:innerHeight})">
            <svg:circle r=10 stroke="rgb(60,255,60)">
            <svg:circle r=8 fill="rgb(60,255,60)">
            <svg:circle r=2 fill="black">

tag App

    def mount
        # Audio.new('sounds/theme1.mp3').play

        schedule interval: 40
        document.addEventListener 'keydown', do |e|
            keydown e

        document.addEventListener 'keyup', do |e|
            keyup e

        document.addEventListener 'mousemove', do |e|
            aim e

        document.addEventListener 'mousedown' do |e|
            shoot if e:button == 0
            player.attack if e:button == 2

        document.addEventListener 'contextmenu', do |e|
            e.preventDefault

    def aim e
        crosshair.x = e:x
        crosshair.y = -e:y
        player.rotation = Math.atan2(e:x -  window:innerWidth/2, e:y -  window:innerHeight/2)/3.1415*180.0 - 90;

    def keydown e
        player.gun = player.invertory:knife   if e:code == :Digit1 and player.invertory:knife
        player.gun = player.invertory:handgun if e:code == :Digit2 and player.invertory:handgun
        player.reload if e:code == :KeyR
        game.keys[e:code] = true

    def keyup e
        game.keys[e:code] = false

    def shoot
        player.shoot if [:handgun, :shotgun, :rifle].includes player.gun.name
        player.attack if [:flashlight, :knife].includes player.gun.name

    def tick
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
                <svg:g transform=("translate({x}, {y})")>
                    <Ground player=player>
                    <Survival player=player game=game>
                <Aim crosshair=crosshair>
                for bullet in bullets
                    <Projectile bullet=bullet player=player>
Imba.mount <App>

