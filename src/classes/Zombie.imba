import GameObject from '../engine/GameObject'

let DRIFT = 0
let AGGRO = 1
let ATTACK = 2
let DEAD = 3

export default class Zombie < GameObject
	def constructor player, day, animations
		super
		player = player
		position = GameObject.randomPosition(player) 
		rotation = Math.random() * 360
		sector = "{~~(position.x / 1000)}|{~~(position.y / 800)}"
		self.state = 0
		speed = .2
		base_speed = .2
		max_speed = .6 + (day / 20)
		size = 20
		turn = 0
		life = 50 + (day*3)
		death = 0
		animations = animations
		animation = animations.idle
		animation-STATE = 'idle'

	def update
		updateSector()
		checkColisions()
		if self.state is DEAD   then execDead()
		if self.state is DRIFT  then execDrift()
		if self.state is AGGRO  then execAggro()
		if self.state is ATTACK then execAttack()
		animation = animations[animation-STATE]

	def execDead
		if STATE.time - death > 5000
			STATE.killed.delete(self)
			delete self

	def execAttack
		animation-STATE = 'attack'
		if not start_attack
			Audio.new("sounds/zombie_attack/{~~(Math.random() * 3)}.ogg").play()
			start_attack = STATE.time
		if STATE.time - start_attack > 100 and playerIsClose(size * 2) and not player_beaten
			player_beaten = yes
			player.takeHit(10)
		if STATE.time - start_attack > 500
			start_attack = no
			player_beaten = no
			speed = 0
			self.state = AGGRO

	def execDrift
		if playerDetected()
			self.state = AGGRO
		if STATE.time % 200 == 0
			turn = Math.floor(Math.random() * 2)
			speed = Math.random() * base_speed
			if speed < 0.1
				animation-STATE = 'idle'
			else
				animation-STATE = 'move'
		if STATE.time % 3 == 0
			if turn == 0
				rotation += Math.random() * 3
			elif turn == 1
				rotation -= Math.random() * 3
		moveForward()

	def execAggro
		animation-STATE = 'move'
		if player.inSafeZone()
			self.state = DRIFT
		if playerIsClose(size * 2.1)
			self.state = ATTACK
		speed += max_speed/12 unless speed >= max_speed
		rotation = angleToObject(player)
		moveForward()

	def findColision obj-sectors
		obj-sectors[sector] ||= Set.new
		for obj of obj-sectors[sector]
			if colideCircle(obj)
				return obj unless obj is self
		return no

	def playerOnSight
		Math.abs((angleToObject(player) - rotation) % 360) < 30

	def playerIsClose distance
		distanceToObjectX(player) < distance and distanceToObjectY(player) < distance

	def playerDetected
		(playerOnSight() and playerIsClose(750) or playerIsClose(40)) and not player.inSafeZone()

	def updateSector()
		let temp_sector = currentSector()
		if temp_sector != sector
			STATE.zombies[sector] ||= Set.new
			STATE.zombies[sector].delete(self)
			sector = temp_sector
			STATE.zombies[sector] ||= Set.new
			STATE.zombies[sector].add(self)

	def checkColisions
		let obj = findColision(STATE.bushes) or findColision(STATE.barrels)
		if obj
			let dx = Math.sin((angleToObject(obj) + 90) * 0.01745) * speed * STATE.delta
			let dy = Math.cos((angleToObject(obj) + 90) * 0.01745) * speed * STATE.delta
			position.x -= dx * 1.5
			position.y += dy * 1.5
		let zom_col = findColision(STATE.zombies)
		if zom_col
			let dx = Math.sin((angleToObject(zom_col) + 90) * 0.01745) * speed * STATE.delta
			let dy = Math.cos((angleToObject(zom_col) + 90) * 0.01745) * speed * STATE.delta
			zom_col.position.x += dx * 0.5
			zom_col.position.y -= dy * 0.5
			position.x -= dx
			position.y += dy

	def takeHit(bullet)
		unless findColision(STATE.bushes)
			position.x -= Math.sin((bullet.rotation - 90) * 0.01745) * bullet.power
			position.y += Math.cos((bullet.rotation - 90) * 0.01745) * bullet.power
		self.state = AGGRO
		life -= bullet.damage
		speed -= bullet.power / 30 unless speed < 0
		unless taking_hit
			Audio.new("sounds/zombie_hit/{~~(Math.random() * 4)}.wav").play()
			Audio.new("sounds/zombie_sound/{~~(Math.random() * 6)}.mp3").play()
		taking_hit = true
		setTimeout(&, 50) do taking_hit = false

		if life <= 0
			STATE.zombies[sector].delete(self)
			STATE.killed.add(self)
			self.state = DEAD
			player.score += 90 + 10 * STATE.day
			death = STATE.time