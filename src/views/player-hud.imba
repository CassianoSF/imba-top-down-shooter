tag fps-counter
	def mount
		setInterval(update.bind(this), 200)
		update()

	def update
		fps = ~~(1/(STATE.delta/200))
		if fps < 50 
			color = '#F99' 
		elif fps < 60
			color = '#FF9' 
		else
			color = '#9F9' 


	<self style="color: {color};position: fixed; margin: 5px">
		fps

tag score-hud
	def mount
		bounce = true
		score = STATE.player.score
		setInterval(checkScoreChange.bind(this, 100))

	def checkScoreChange
		if score != STATE.player.score
			diff = STATE.player.score - score
			score = STATE.player.score
			bounce = false
			render()
			setTimeout(&, 100) do
				bounce = true
				render()

	<self.hud.score>
		<div>
			"Score "
			<b .bounce=(bounce)>
				score
		<div [text-align: right font-size: 20px] .fadeOutUp=(bounce)>
			"+ {diff}"

tag player-hud
	prop selected_gun
	prop stamina

	def calcStamina
		~~(STATE.player.stamina / STATE.player.max-stamina * 100)

	def render
		<self>
			<fps-counter>
			<.fadeOut=(STATE.player.dead) .fadeIn=(!STATE.player.dead)>
				<.hud.day css:font-size="30px">
					"Day "
					<b>
						STATE.day
				<.hud.stamina css:font-size="20px" css:color="{calcStamina() < 1 ? "red" : "white"}">
					"Stamina "
					<b>
						"{calcStamina()}%"
				<score-hud>
				<.hud.life>
					"Life "
					<b css:font-size="50px">
						STATE.player.life
					
				<.hud.slots .select-slot=(selected_gun)>
					for i in [0...STATE.player.slots]
						<.onHand=(STATE.player.gun == STATE.player.holsters[i])>
							"{i + 1}. {((STATE.player.holsters[i] or {}).name or '')}"
				<.hud.ammo>
					<b css:font-size="50px">
						"{STATE.player.gun.ammo}/{STATE.player.gun.cap}"
					" Ammo"
			if STATE.player.dead
				<div .you-died .fadeIn>
					"you died"

	css .you-died
		left: 33%
		top: 20%
		font-size: 15vw
		color: #900
		position: fixed
		z-index: 1
		font-family: MenofNihilist


	css .hud
		position: fixed
		z-index: 1
		font-family: Typewriter
		color: white


	css .day
		top: 2%
		left: 2%


	css .stamina
		bottom: 10%
		right: 2%
		font-size: 15px


	css .score
		top: 2%
		right: 2%
		font-size: 30px


	css .life
		bottom: 2%
		right: 2%
		font-size: 30px

	css .slots
		left: 2%
		bottom: 10%
		font-size: 16px


	css .select-slot
		color: green


	css .ammo
		bottom: 2%
		left: 2%
		font-size: 30px


	css .onHand
		color: yellow



