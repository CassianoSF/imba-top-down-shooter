export class Zombie
    prop pos
    prop rotation
    prop animation
    prop animations
    prop life
    prop speed
    prop max-speed
    prop id
    prop turn
    prop state default: :random
    prop damage default: 10
    prop already-turned
    prop taking-hit
    prop attacking

    prop player
    prop zombies
    prop game

    def takeHit bullet
        pos:x -= Math.sin((angleToPlayer + 90 ) * 3.1415 / 180) * bullet.power
        pos:y -= -Math.cos((angleToPlayer + 90 ) * 3.1415 / 180) * bullet.power
        life -= bullet.damage
        unless taking-hit
            taking-hit = parseInt(Math.random * 5 + 1)
            window.setTimeout((do taking-hit = no), 50)
        state = :aggro

    def distanceToPlayer
        let dx = player.pos:x - pos:x + game.width/2
        let dy = player.pos:y - pos:y + game.height/2
        (dy**2 + dx**2)**0.5

    def angleToPlayer
        let dx = player.pos:x - pos:x + game.width/2
        let dy = player.pos:y - pos:y + game.height/2
        -(Math.atan2(dx, dy)/3.1415*180.0 - 90) % 360

    def distanceToZombie zombie
        let dx = zombie.pos:x - pos:x
        let dy = zombie.pos:y - pos:y
        (dy**2 + dx**2)**0.5

    def moveForward
        pos:x += Math.sin((rotation + 90 ) * 3.1415 / 180) * speed
        pos:y += -Math.cos((rotation + 90 ) * 3.1415 / 180) * speed

    def moveBackward
        pos:x -= Math.sin((rotation + 90 ) * 3.1415 / 180) * speed
        pos:y -= -Math.cos((rotation + 90 ) * 3.1415 / 180) * speed

    def colide
        for zombie in zombies
            if distanceToZombie(zombie) < 30 and zombie != self
                return true
        return no

    def playerDetected
        let angle-diff = angleToPlayer - rotation
        (angle-diff**2)**0.5 < 30 and distanceToPlayer < 500 or distanceToPlayer < 100 

    def update player, game, zombies
        switch state
            when :aggro
                execAggro
            when :attack
                execAttack
            when :random
                execRandom
            when :walk-arround
                execWalkArround

    def execAggro
        if distanceToPlayer < 40
            state = :attack
        elif colide
            state = :walk-arround
            window.setTimeout((do state = :aggro), 300)
        else
            speed = max-speed
            rotation = angleToPlayer 
            animation = animations:move
            moveForward  
        
    def execAttack
        if distanceToPlayer < 40 and !attacking
            attacking = true
            animation = animations:attack
            window.setTimeout((do 
                if distanceToPlayer < 60
                    player.takeHit(damage)
                attacking = false
            ), 300)
        elif colide
            state = :walk-arround
            window.setTimeout((do state = :aggro), 300)
        else
            state = :aggro

    def execRandom
        if distanceToPlayer < 40
            state = :attack
        
        elif playerDetected
            state = :aggro

        else
            if 5000 % game.time == 0
                turn = [:turn_left, :turn_right][parseInt(Math.random * 2)]
                speed = parseInt(Math.random * max-speed)
            if turn == :turn_right
                rotation += 1
            if turn == :turn_left
                rotation -= 1
            moveForward  

    def execWalkArround
        unless already-turned
            already-turned = true
            speed = 3
            rotation += [30, 50, 70, 90, -90, -70, -50, -30][parseInt(Math.random * 7)]
            window.setTimeout((do already-turned = false), 1000)
        moveForward  


    def initialize player, game, zombies
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1

