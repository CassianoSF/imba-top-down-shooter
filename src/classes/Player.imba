import Bullet from './Bullet'

export class Player
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
    prop bullets default: []
    prop life default: 100

    prop shooting
    prop reloading
    prop running
    prop attacking

    def takeHit damage
        life -= damage

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
        reload unless gun.ammo or reloading
        if gun.ammo and can-shoot and !reloading
            let audio = Audio.new('sounds/shotgun_shot.wav')
            audio.play
            bullets.push Bullet.new 
                player: self
                pos: 
                    # x: 0
                    x: Math.sin((rotation + 90)* 3.1415 / 180) * 100 + pos:x
                    y: Math.cos((rotation + 90)* 3.1415 / 180) * 100 - pos:y
                direction: rotation
                power: gun.power
                damage: gun.damage
            gun.ammo -= 1
            can-shoot = no
            shooting = yes
            animation = animations[gun.name]:shoot
            window.setTimeout((do delete audio),    10000)
            window.setTimeout((do can-shoot = yes), 1000/gun.rate)
            window.setTimeout((do shooting = no),   20)

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
        if gun.ammo != gun.cap and !reloading
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
