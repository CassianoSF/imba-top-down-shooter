import GameObject from '../engine/GameObject'

export default class Bullet < GameObject
	def constructor spread, damage, power, speed, penetration
		super
		spread = spread
		damage = damage
		power = power
		speed = speed
		penetration = penetration
		position = {
			x: STATE.player.position.x + Math.cos((STATE.player.rotation + 60) * 0.01745) * 30
			y: STATE.player.position.y + Math.sin((STATE.player.rotation + 60) * 0.01745) * 30
		}
		rotation = STATE.player.rotation + 90 + (Math.random() * spread - (spread/2))

	def update
		checkColision()
		position.x += Math.cos((rotation) * 0.01745) * speed * STATE.delta
		position.y += Math.sin((rotation) * 0.01745) * speed * STATE.delta
		if distanceToObjectX(STATE.player) > window.innerWidth or distanceToObjectY(STATE.player) > window.innerHeight
			STATE.bullets.delete(self)

	def checkColision
		for zombie of STATE.zombies[currentSector()]
			if distanceToObjectX(zombie) < (speed*2) and distanceToObjectY(zombie) < (speed*2)
				zombie.takeHit(self)
				penetration--
				if penetration <= 0
					STATE.bullets.delete(self)
