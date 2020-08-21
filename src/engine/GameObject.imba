export default class GameObject
	static def randomPosition player
		let posx = Math.random() * window.innerWidth * 100 - (window.innerWidth * 50)
		let posy = Math.random() * window.innerHeight * 100 - (window.innerHeight * 50)
		let diffx = Math.abs(posx - player.position.x)
		let diffy = Math.abs(posy - player.position.y)
		if diffx < 400 and diffy < 400
			return randomPosition(player)

		return {
			x: posx
			y: posy
		}

	def currentSector
		"{~~(position.x / 1000)}|{~~(position.y / 800)}"

	def colideCircle obj
		Math.sqrt(distanceToObjectX(obj)**2 + distanceToObjectY(obj)**2) < (size + obj.size)

	def colideQuad obj
		distanceToObjectX() < (obj.size + size) and distanceToObjectY() < (obj.size + size)

	def distanceToObjectX obj
		Math.abs(obj.position.x - position.x)

	def distanceToObjectY obj
		Math.abs(obj.position.y - position.y)

	def moveForward
		position.x -= Math.sin((rotation - 90) * 0.01745) * STATE.delta * speed
		position.y += Math.cos((rotation - 90) * 0.01745) * STATE.delta * speed

	def angleToObject obj
		let dx = obj.position.x - position.x
		let dy = obj.position.y - position.y
		-(Math.atan2(dx, dy)/0.01745 - 90) % 360        

	def angleTo x, y
		let dx = x - position.x
		let dy = y - position.y
		-(Math.atan2(dx, dy)/0.01745 + 180) % 360        

	def distanceTo x, y
		let dx = Math.abs(x - position.x)
		let dy = Math.abs(y - position.y)
		Math.sqrt(dx**2 + dy**2)