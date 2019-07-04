export class Zombie
    prop pos
    prop rotation
    prop animation
    prop animations
    prop life
    prop max-life
    prop speed
    prop max-speed
    prop id
    prop turn
    prop state default: :random
    prop damage default: 10
    prop already-turned
    prop taking-hit
    prop attacking
    prop sector
    prop colision-times default: 0

    prop player
    prop zombies
    prop barrels
    prop boxes
    prop game

    def takeHit hit
        let audio = Audio.new("sounds/zombie_hit/{~~(Math.random * 4)}.wav")
        audio.play
        pos:x -= Math.sin((angleToPlayer + 90 ) * 3.1415 / 180) * hit.power
        pos:y -= -Math.cos((angleToPlayer + 90 ) * 3.1415 / 180) * hit.power
        unless taking-hit
            life -= hit.damage
            taking-hit = ~~(Math.random * 5 + 1)
            setTimeout(&, 50) do 
                taking-hit = no
        state = :aggro

    def distanceToPlayerX
        ((player.pos:x - pos:x)**2)**0.5

    def distanceToPlayerY
        ((player.pos:y - pos:y)**2)**0.5

    def angleToPlayer
        let dx = player.pos:x - pos:x
        let dy = player.pos:y - pos:y
        -(Math.atan2(dx, dy)/3.1415*180.0 - 90) % 360

    def distanceToZombieX zombie
        ((zombie.pos:x - pos:x)**2)**0.5

    def distanceToZombieY zombie
        ((zombie.pos:y - pos:y)**2)**0.5

    def moveForward
        if colideObj
            colision-times += 1
            pos:x -= Math.sin((rotation + 90 ) * 3.1415 / 180) * speed
            pos:y -= -Math.cos((rotation + 90 ) * 3.1415 / 180) * speed
            if colision-times > 20
                state = :walk-arround-object
                setTimeout((do state = :random), 1000)
                colision-times = 0
        else
            pos:x += Math.sin((rotation + 90 ) * 3.1415 / 180) * speed
            pos:y += -Math.cos((rotation + 90 ) * 3.1415 / 180) * speed

    def moveBackward
        pos:x -= Math.sin((rotation + 90 ) * 3.1415 / 180) * speed
        pos:y -= -Math.cos((rotation + 90 ) * 3.1415 / 180) * speed

    def distanceToX obj
        ((obj:x - pos:x)**2)**0.5
        
    def distanceToY obj
        ((obj:y - pos:y)**2)**0.5
        
    def colideZombie
        for zombie in zombies
            if distanceToZombieX(zombie) < 30 and distanceToZombieY(zombie) < 30 and zombie != self
                return true
        return no

    def colideObj
        for obj in game.sectors[sector]
            if distanceToX(obj) < obj:size and distanceToY(obj)
                return true
        return no

    def playerDetected
        let angle-diff = angleToPlayer - rotation
        (angle-diff**2)**0.5 < 30 and distanceToPlayerX < 3000 and distanceToPlayerY < 3000 or (distanceToPlayerX < 100 and distanceToPlayerY < 100)


    def deleteZombie
        zombies.push Zombie.new 
            id: Math.random
            pos: 
                x: player.pos:x + Math.random * 2000 - 1000
                y: player.pos:y + Math.random * 2000 - 1000
            rotation: Math.random * 360
            animation: animations:idle
            animations: animations
            state: :random
            life: max-life + 20
            max-life: max-life + 20
            speed: speed + 0.2
            max-speed: speed + 0.2
            game: game
            player: player
            zombies: zombies
            boxes: boxes
            barrels: barrels

        var index = zombies.indexOf(self)
        zombies.splice(index, 1) if (index !== -1)

    def update
        sector = "x{~~(pos:x/100)}y{~~(pos:y/100)}"
        return deleteZombie if life < 0 
        if distanceToPlayerX < game.width and distanceToPlayerY < game.height
            switch state
                when :aggro
                    execAggro
                when :attack
                    execAttack
                when :random
                    execRandom
                when :walk-arround-zombie
                    execWalkArroundZombie
                when :walk-arround-object
                    execWalkArroundObject

    def execAggro
        if distanceToPlayerX < 50 and distanceToPlayerY < 50
            state = :attack
        elif colideZombie
            state = :walk-arround-zombie
            setTimeout((do state = :aggro), 300)
        else
            speed = max-speed
            rotation = angleToPlayer 
            animation = animations:move
            moveForward  
        
    def execAttack
        if distanceToPlayerX < 100 and distanceToPlayerY < 100 and !attacking
            let audio = Audio.new("sounds/zombie-attack{~~(Math.random * 3)}.ogg")
            audio:volume = 0.6
            audio.play
            attacking = true
            animation = animations:attack
            setTimeout(&, 300) do 
                if distanceToPlayerX < 100 and distanceToPlayerY < 100
                    player.takeHit(damage)
                attacking = false
                if colideZombie
                    state = :walk-arround-zombie
                    setTimeout(&, 300) do 
                        state = :aggro
                else
                    state = :aggro
        elif !attacking
            state = :aggro

    def execRandom
        if distanceToPlayerX < 40 and distanceToPlayerY < 40
            state = :attack
        
        elif playerDetected
            state = :aggro

        else
            if 5000 % game.time == 0
                turn = [:turn_left, :turn_right][~~(Math.random * 2)]
                speed = ~~(Math.random * max-speed)
            if turn == :turn_right
                rotation += 1
            if turn == :turn_left
                rotation -= 1
            moveForward  

    def execWalkArroundZombie
        unless already-turned
            already-turned = true
            speed = 3
            rotation += [30, 50, 70, 90, -90, -70, -50, -30][~~(Math.random * 7)]
            setTimeout(&, 1000) do
                already-turned = false
        moveForward  

    def execWalkArroundObject
        unless already-turned
            already-turned = true
            speed = 3
            rotation += [90, 135, 180, -135, -90][~~(Math.random * 4)]
            setTimeout(&, 1000) do
                already-turned = false
        moveForward 

    def initialize player, game, zombies
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1

