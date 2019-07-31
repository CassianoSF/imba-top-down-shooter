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
    prop reputation default: 0
    prop animation
    prop animations
    prop feet-animation
    prop feet-animations
    prop game
    prop zombies
    prop barrels
    prop boxes
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
            setTimeout(&, 1200) do taking-hit = no
        life -= damage

    def distanceToX obj
        Math.abs(obj:x - pos:x)

    def distanceToY obj
        Math.abs(obj:y - pos:y)

    def colisionObj
        let sector = "x{~~(pos:x/500)}y{~~(pos:y/500)}"
        for obj in game.sectors[sector]
            if distanceToX(obj) < obj:size and distanceToY(obj) < obj:size
                return true
        return no

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

        if colisionObj
            for d in directions
                switch d
                    when :left
                        pos:x += step
                    when :right
                        pos:x -= step
                    when :down
                        pos:y += step        
                    when :up
                        pos:y -= step

    def angleToZombie zombie
        let dx = pos:x - zombie.pos:x
        let dy = pos:y - zombie.pos:y
        Math.abs(rotation + (Math.atan2(dx, dy)/3.1415*180.0) +150) % 360

    def bulletInitPos
        if (rotation < 360 and rotation > 280) or (rotation < 180 and rotation > 90)
            return {
                x: Math.cos((rotation)* 3.1415 / 180) * 100 + pos:x
                y: Math.sin((rotation)* 3.1415 / 180) * 50 + pos:y
            }
        else
            return {
                x: Math.cos((rotation)* 3.1415 / 180) * 100 + pos:x
                y: Math.sin((rotation)* 3.1415 / 180) * 150 + pos:y
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
            let shot = gun.shoot-sounds[~~(Math.random * gun.shoot-sounds:length)]
            let audio = Audio.new shot:src
            audio:volume = shot:volume
            audio.play
            if gun.name == :shotgun
                for i in [0,0,0,0,0,0]
                    generateBullet
            else
                generateBullet
            gun.ammo -= 1
            can-shoot = no
            shooting = yes
            animation = animations[gun.name]:shoot
            setTimeout(&, 1000/gun.rate) do can-shoot = yes
            setTimeout(&, 30) do shooting = no 

    def attack
        if can-attack
            let audio = Audio.new("sounds/melee{~~(Math.random * 3)}.wav")
            audio:volume = 0.6
            audio.play
            setTimeout(&, 1500) do delete audio
            can-attack = no
            attacking = yes
            animation = animations[gun.name]:attack
            setTimeout(&, 10 * 15 * 1) do
                let damage = 5
                let damage = 25 if gun.name == :knife
                for zombie in zombies
                    if zombie.distanceToPlayerX < 120 and zombie.distanceToPlayerY < 120 and angleToZombie(zombie) < 180
                        zombie.takeHit({damage: (do damage), power: (do 50)})
            setTimeout(&, 10 * 15 * 3.8) do
                can-attack = yes
                attacking = no

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
            setTimeout(&, gun.reload-time) do
                reloading = no
                delete audio
                audio2.pause
                delete audio2
                if cancel-reloading
                    cancel-reloading = no
                else
                    can-shoot = yes
                    gun.ammo = gun.cap

    def initialize
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1
