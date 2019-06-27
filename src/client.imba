class Game
    prop keys
    prop time

    def initialize 
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1

class Player
    prop invertory
    prop gun
    prop pos
    prop rotation
    prop can-shoot
    prop can-attack
    prop animation
    prop speed
    prop running
    prop reputation
    prop animations

    prop shooting
    prop reloading
    prop running
    prop attacking

    def move directions
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
                    pos:y += step        
                when :up
                    pos:y -= step

    def shoot
        if gun.ammo and can-shoot
            Audio.new('sounds/shotgun_shot.wav').play
            gun.ammo -= 1
            can-shoot = no
            shooting = yes
            animation = animations[gun.name]:shoot
            Imba.setTimeout 1000/gun.rate, do
                can-shoot = yes

            Imba.setTimeout 50, do
                shooting = no

    def attack
        if can-attack
            gun.ammo -= 1
            can-attack = no
            attacking = yes
            animation = animations[gun.name]:attack
            Imba.setTimeout 1000, do
                can-attack = yes
                attacking = no        

    def reload
        if gun.ammo != gun.cap
            Audio.new('sounds/shotgun_reload.wav').play
            can-shoot = no
            reloading = yes
            animation = animations[gun.name]:reload
            Imba.setTimeout gun.reload-time, do
                can-shoot = yes
                reloading = no
                gun.ammo = gun.cap

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
    animation: animations:player:knife:idle
    speed: 10
    animations: animations:player

tag Survival < svg:g
    attr transform
    prop player
    prop game

    def render
        <self transform="translate(500, 350) rotate({player.rotation})">
            <Shot> if player.shooting
            <svg:g transform="translate({-50}, {-50})">
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
        <self height=70000 width=70000 transform="translate({-player.pos:x - 35000},{player.pos:y - 35000})">
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

tag App
    attr height
    attr width

    def mount
        Audio.new('sounds/theme1.mp3').play
        schedule interval: 40
        document.addEventListener 'keydown', do |e|
            keydown e

        document.addEventListener 'keyup', do |e|
            keyup e

        document.addEventListener 'mousemove', do |e|
            aim e

        document.addEventListener 'mousedown' do |e|
            shoot

    def aim e
        player.rotation = Math.atan2(e:x - 500, e:y - 350)/3.1415*180.0 - 90;

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
        <self style="height: 700px; width: 1000px; background-color: black">
            <svg:svg height="700px" width="1000px" transform="scale(1,-1)">
                <svg:g transform=("translate({x}, {y})")>
                    <Ground player=player>
                    <Survival player=player game=game>
Imba.mount <App>

