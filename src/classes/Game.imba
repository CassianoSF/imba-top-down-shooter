export default global class Game
	def constructor renderer
		theme_start = false
		current_theme = 1
		renderer = renderer
		current_date = Date.new
		STATE.first_date = Date.new
		STATE.last_date = Date.new
		STATE.frame = 0
		window.addEventListener('keydown', keydownEvent.bind(this))
		window.addEventListener('keyup', keyupEvent.bind(this))
		window.addEventListener('mousemove', mousemoveEvent.bind(this))
		window.addEventListener('mousedown', mousedownEvent.bind(this))
		window.addEventListener('mouseup', mouseupEvent.bind(this))
		setInterval(update.bind(this), 16)

	def playTheme
		let theme = Audio.new("sounds/theme0{current_theme}.ogg")
		theme.onended = playNext.bind(this)
		theme.play()
	
	def playNext
		current_theme++
		current_theme = 0 if current_theme == 8
		let theme = Audio.new("sounds/theme0{current_theme}.ogg")
		theme.onended = playNext.bind(this)
		theme.play()

	def startGame
		STATE.loading = false
		imba.commit()

	def update
		current_date = Date.new
		STATE.frame += 1
		STATE.diff =  current_date.getTime() - STATE.first_date.getTime()
		STATE.delta = (current_date - STATE.last_date) / 5
		STATE.time = current_date - STATE.first_date
		STATE.last_date = current_date
		STATE.player.update()

		for bullet of STATE.bullets
			bullet.update() if bullet

		for zombie of STATE.player.nearZombies
			zombie.update() if zombie

		for zombie of STATE.killed
			zombie.update() if zombie

		renderer.render()

	def keydownEvent e
		playTheme() unless theme_start
		theme_start ||= true
		STATE.player.onKeyEvent(e.code)
		STATE.keys[e.code] = true

	def keyupEvent e
		STATE.keys[e.code] = false

	def mousemoveEvent e
		STATE.mouse.x = e.clientX
		STATE.mouse.y = window.innerHeight - e.clientY

	def mousedownEvent e
		STATE.mouse.press = true

	def mouseupEvent e
		STATE.mouse.press = false