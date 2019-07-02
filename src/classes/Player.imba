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
    prop cancel-reloading

    prop shooting
    prop reloading
    prop running
    prop attacking
    prop taking-hit

    def takeHit damage
        unless taking-hit
            let audio = Audio.new("sounds/survivor_yell/3yell{~~(Math.random * 10)}.wav")
            audio.play
            let audio = Audio.new("sounds/zombie_hit/{~~(Math.random * 4)}.wav")
            audio.play
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
        if (rotation < 360 and rotation > 280) or (rotation < 180 and rotation > 90)
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

    def changeGun to
        cancel-reloading = yes if reloading
        reloading = no
        attacking = no
        gun = invertory[to]

    def shoot
        reload unless gun.ammo or reloading
        return attack if [:flashlight, :knife].includes gun.name
        if gun.ammo and can-shoot and !reloading
            let audio = Audio.new('sounds/shotgun_shot.wav')
            audio:volume = 0.6
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
            window.setTimeout((do shooting = no),30)

    def attack zombies
        if can-attack
            let audio = Audio.new("sounds/melee{~~(Math.random * 3)}.wav")
            audio:volume = 0.6
            audio.play
            window.setTimeout((do delete audio), 1500)
            can-attack = no
            attacking = yes
            animation = animations[gun.name]:attack
            window.setTimeout(( do
                let damage = 5
                let damage = 25 if gun.name == :knife
                for zombie in zombies
                    if zombie.distanceToPlayer < 120 and angleToZombie(zombie) < 180
                        zombie.takeHit({damage: (do damage), power: (do 50)})
            ), 10 * 15 * 1)
            window.setTimeout(( do
                can-attack = yes
                attacking = no
            ), 10 * 15 * 3.8)

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
                reloading = no
                delete audio
                audio2.pause
                delete audio2
                if cancel-reloading
                    cancel-reloading = no
                else
                    can-shoot = yes
                    gun.ammo = gun.cap
            ), gun.reload-time)

    def initialize
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1
