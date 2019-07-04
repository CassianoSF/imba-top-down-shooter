export class Bullet
    prop power
    prop damage
    prop player
    prop direction
    prop pos
    prop i default: 0

    def distanceToZombieX zombie, game
        Math.abs(zombie.pos:x - pos:x)

    def distanceToZombieY zombie, game
        Math.abs(zombie.pos:y - pos:y)

    def distanceToPlayerX
        Math.abs(player.pos:x - pos:x)
    
    def distanceToPlayerY
        Math.abs(player.pos:y - pos:y)

    def deleteBullet
        var index = player.bullets.indexOf(self)
        player.bullets.splice(index, 1) if (index !== -1)
        delete self

    def update zombies, game, player
        for zombie in zombies
            # long range
            if distanceToZombieX(zombie, game) < 50 and distanceToZombieY(zombie, game) < 50 
                zombie.takeHit(self)
                deleteBullet
                return
            # close range
            elif player.angleToZombie(zombie) < 70 and zombie.distanceToPlayerX < 130 and zombie.distanceToPlayerY < 130 and distanceToZombieX(zombie, game) < 700 and distanceToZombieY(zombie, game) < 700
                zombie.takeHit(self)
                deleteBullet
                return

    def fly
        window.setTimeout( (do
            pos:x += Math.cos((direction) * 3.1415 / 180) * 60
            pos:y += Math.sin((direction) * 3.1415 / 180) * 60
            if distanceToPlayerX > 5000 and distanceToPlayerY > 5000
                deleteBullet
                return
            fly
        ), 16);

    def initialize
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1
        fly
