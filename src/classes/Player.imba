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
    prop blood-rotation

    prop shooting
    prop reloading
    prop running
    prop attacking
    prop taking-hit

    def takeHit damage
        unless taking-hit
            blood-rotation = Math.random * 360
            taking-hit = ~~(Math.random * 2 + 1)
            window.setTimeout((do taking-hit = no), 1200)
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

    def angleToZombie zombie
        let dx = pos:x + game.width/2 - zombie.pos:x
        let dy = pos:y + game.height/2 - zombie.pos:y
        (((rotation + (Math.atan2(dx, dy)/3.1415*180.0) +200) % 360)**2)**0.5


    def bulletInitPos
        if (rotation < 360 and rotation > 280) or (rotation < 180 and rotation > 120)
            return {
                x: Math.sin((rotation + 90)* 3.1415 / 180) * 100 + pos:x
                y: Math.cos((rotation + 90)* 3.1415 / 180) * 50 - pos:y
            }
        else
            return {
                x: Math.sin((rotation + 90)* 3.1415 / 180) * 100 + pos:x
                y: Math.cos((rotation + 90)* 3.1415 / 180) * 150 - pos:y
            }

    def generateBullet
        bullets.push Bullet.new 
            player: self
            pos: bulletInitPos
            direction: rotation + (Math.random * 200/gun.accuracy - 100/gun.accuracy)
            power: gun.power
            damage: gun.damage

    def shoot
        reload unless gun.ammo or reloading
        if gun.ammo and can-shoot and !reloading
            let audio = Audio.new('sounds/shotgun_shot.wav')
            audio.play
            if gun.name == :shotgun
                for i in [0,0,0,0,0,0]
                    generateBullet
            else
                generateBullet
            gun.ammo -= 1
            can-shoot = no
            shooting = yes
            if gun.name == :shotgun
                let audio2 = Audio.new('sounds/shotgun_pump.wav')
                audio2.play
                window.setTimeout((do audio2.pause and delete audio2), 1500)

            animation = animations[gun.name]:shoot
            window.setTimeout((do delete audio),    10000)
            window.setTimeout((do can-shoot = yes), 1000/gun.rate)
            window.setTimeout((do 
                shooting = no
            ),   20)

    def attack zombies
        if can-attack
            let damage = 5
            let damage = 25 if gun.name == :knife
            for zombie in zombies
                if zombie.distanceToPlayer < 150 and angleToZombie(zombie) < 180
                    zombie.takeHit({damage: (do damage), power: (do 50)})

            can-attack = no
            attacking = yes
            animation = animations[gun.name]:attack
            window.setTimeout(( do
                can-attack = yes
                attacking = no
            ), 17 * 15 * 2)

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
