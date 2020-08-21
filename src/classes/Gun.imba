import Bullet from './Bullet'

export default class Gun
	def constructor cap, rate, spread, damage, power, projectiles, speed, reload_time, name, price, penetration=1, sounds
		rate = rate
		spread = spread
		damage = damage
		power = power
		last_shot = 0
		projectiles = projectiles
		speed = speed
		reload_time = reload_time
		cap = cap
		ammo = cap
		reloading = false
		name = name
		price = price
		penetration = penetration
		sounds = sounds
		upgrades = {}
		upgrades.cap         = 100 + price / 10
		upgrades.rate        = 100 + price / 10
		upgrades.spread      = 100 + price / 10
		upgrades.damage      = 100 + price / 10
		upgrades.power       = 100 + price / 10
		upgrades.reload_time = 100 + price / 10

	def fire
		return if reloading
		if ammo == 0
			reload()
		elif STATE.time - last_shot > 60000/rate and ammo > 0
			let audio = Audio.new(sounds.shot.src)
			audio.volume = sounds.shot.volume
			audio.play()
			firing = true
			setTimeout(&, 33) do firing = false
			ammo--
			last_shot = STATE.time
			for i in [0...projectiles]
				STATE.bullets.add(Bullet.new(spread,damage,power,speed,penetration))

	def reload
		unless ammo == cap
			reloading = reload_time

	def update
		if reloading
			if !reload_audio or reload_audio.paused
				reload_audio = Audio.new(sounds.reload.src)
				reload_audio.volume = sounds.reload.volume
				reload_audio.play()
			reloading -= STATE.delta*5
			if reloading <= 0
				reloading = false
				ammo = cap


