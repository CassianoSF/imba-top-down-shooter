import GameObject from '../engine/GameObject'

export default class Player < GameObject
	def constructor inventory, animations, feet-animations
		super
		position = {x:0,y:0}
		rotation = 0
		size = 20
		inventory = inventory
		score = 100000
		gun = inventory[0]
		holsters = inventory
		speed = 0
		max-speed = .8
		nearZombies = Set.new
		nearBushes = Set.new
		nearBarrels = Set.new
		max-life = 100
		life = 100
		slots = 3
		safe = true
		stamina = 300
		max-stamina = 500
		animations = animations
		animation = animations.rifle.idle
		animation-state = 'idle'

		feet-animations = feet-animations
		feet-animation = feet-animations.idle
		feet-animation-state = 'idle'

	def checkShop
		STATE.shop.open = false unless inSafeZone()

	def update
		return if dead
		gun.update()
		move()
		rotate()
		shoot()
		updateNearObjects(STATE.bushes, nearBushes)
		updateNearObjects(STATE.zombies, nearZombies)
		updateNearObjects(STATE.barrels, nearBarrels)
		checkColision(STATE.bushes)
		checkColision(STATE.zombies)
		checkColision(STATE.barrels)
		checkShop()
		if gun.reloading
			animation-state = 'reload'
		animation = animations[gun.name][animation-state]
		feet-animation = feet-animations[feet-animation-state]

	def updateNearObjects obj-sectors,prop-set
		let x = ~~((position.x) / 1000)
		let y = ~~((position.y) / 800)
		prop-set.clear()
		for i in [-1,0,1]
			for j in [-1,0,1]
				for val of (obj-sectors["{x + i}|{y + j}"])
					prop-set.add(val)

	def shoot
		return if inSafeZone()
		gun.fire() if STATE.mouse.press

	def rotate
		let diffX = STATE.mouse.x - window.innerWidth/2
		let diffY = STATE.mouse.y - window.innerHeight/2
		rotation = -Math.atan2(diffX, diffY) * 57.2974694

	def move
		let slower
		let key-count = (~~STATE.keys.KeyA + ~~STATE.keys.KeyD + ~~STATE.keys.KeyW + ~~STATE.keys.KeyS)

		# Aceleration
		if key-count and STATE.keys.ShiftLeft and stamina
			stamina--
			speed += (max-speed/20) unless speed >= max-speed 
			animation-state = 'move'
			feet-animation-state = 'run'
		elif key-count
			stamina++ unless (stamina >= max-stamina or STATE.keys.ShiftLeft)
			speed += (max-speed/20) unless speed >= max-speed / 2
			speed -= (max-speed/20) if     speed >= max-speed / 2
			animation-state = 'move'
			feet-animation-state = 'walk'
		else
			stamina++ unless (stamina >= max-stamina or STATE.keys.ShiftLeft)
			speed = 0
			feet-animation-state = 'idle'
			animation-state = 'idle'

		# Diagonal correction
		if ((STATE.keys.KeyA or 0) + (STATE.keys.KeyD or 0) + (STATE.keys.KeyW or 0) + (STATE.keys.KeyS or 0)) > 1
			slower = 0.707
		else
			slower = 1

		position.x -= speed * STATE.delta * slower if STATE.keys.KeyA
		position.x += speed * STATE.delta * slower if STATE.keys.KeyD
		position.y += speed * STATE.delta * slower if STATE.keys.KeyW
		position.y -= speed * STATE.delta * slower if STATE.keys.KeyS

	def checkColision obj-sectors
		obj-sectors[currentSector()] ||= Set.new
		for obj of obj-sectors[currentSector()]
			if colideCircle(obj)
				position.x -= Math.sin((angleToObject(obj) + 90) * 0.01745) * ((obj.speed * 1.5) or speed) * STATE.delta * 1.8
				position.y += Math.cos((angleToObject(obj) + 90) * 0.01745) * ((obj.speed * 1.5) or speed) * STATE.delta * 1.8

	def changeGun slot
		Audio.new('sounds/weapswitch.ogg').play()
		if holsters[slot]
			gun.reloading = false
			gun = holsters[slot]

	def onKeyEvent key
		let actions = {
			'Digit1': do changeGun(0)
			'Digit2': do changeGun(1)
			'Digit3': do changeGun(2)
			'Digit4': do changeGun(3)
			'Digit5': do changeGun(4)
			'KeyR': do gun.reload()
		}
		actions[key] and actions[key]()

	def takeHit damage
		return if dead

		Audio.new("sounds/survivor_yell/3yell{~~(Math.random() * 10)}.wav").play()
		life -= damage
		if life <= 0
			dead = true

	def inSafeZone
		Math.abs(position.x) < 100 and Math.abs(position.y) < 100

	def usingGun gun
		holsters.find(do |g| g == gun)

	def equip gun
		return if holsters.find(do |g| g == gun)
		if holsters[slots - 1]
			holsters.pop()
		holsters.unshift(gun)
		gun = gun