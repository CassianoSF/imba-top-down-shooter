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

    def anglePlayerToZombie player, zombie, game
        let dx = player.pos:x + game.width/2 - zombie.pos:x
        let dy = player.pos:y + game.height/2 - zombie.pos:y
        (((player.rotation + (Math.atan2(dx, dy)/3.1415*180.0 - 90) +200) % 360)**2)**0.5

    def update zombies, game, player
        for zombie in zombies
            # long range
            if distanceToZombie(zombie, game) < 75 
                zombie.takeHit(self)
                player.bullets.shift
                delete self
            # close range
            elif ((anglePlayerToZombie(player, zombie, game)) < 30 and zombie.distanceToPlayer(player, game) < 100) and distanceToZombie(zombie, game) < 700
                zombie.takeHit(self)
                player.bullets.shift
                delete self

    def fly player
        window.setTimeout( (do
            pos:x += Math.sin((direction + 90 ) * 3.1415 / 180) * 30
            pos:y += Math.cos((direction + 90 ) * 3.1415 / 180) * 30
            if (pos:x**2 + pos:y**2)**0.5 > 10000
                player.bullets.shift
                delete self
                return
            fly player
        ), 1);

    def initialize
        for k, v of ($1) 
            self["_{k}"] = ($1)[k] if $1
        fly player
