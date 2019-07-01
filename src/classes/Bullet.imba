export class Bullet
    prop power
    prop damage
    prop player
    prop direction
    prop pos
    prop i default: 0

    def distanceToZombie zombie, game
        let dx = zombie.pos:x - (pos:x + game.width/2)
        let dy = zombie.pos:y - (-pos:y + game.height/2)
        (dy**2 + dx**2)**0.5

    def distanceToPlayer
        let dx = player.pos:x - (pos:x)
        let dy = player.pos:y - (-pos:y)
        (dy**2 + dx**2)**0.5

    def deleteBullet
        var index = player.bullets.indexOf(self)
        player.bullets.splice(index, 1) if (index !== -1)
        delete self

    def update zombies, game, player
        for zombie in zombies
            # long range
            if distanceToZombie(zombie, game) < 50 
                zombie.takeHit(self)
                deleteBullet
                return
            # close range
            elif player.angleToZombie(zombie) < 80 and zombie.distanceToPlayer < 100 and distanceToZombie(zombie, game) < 700
                zombie.takeHit(self)
                deleteBullet
                return

    def fly player
        window.setTimeout( (do
            pos:x += Math.sin((direction + 90 ) * 3.1415 / 180) * 60
            pos:y += Math.cos((direction + 90 ) * 3.1415 / 180) * 60
            if distanceToPlayer > 5000
                deleteBullet
                return
            fly player
        ), 16);

    def initialize
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1
        fly player
