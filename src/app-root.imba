import './state'
import './views/player-hud'
import './views/player-store'
tag app-root
	def build
		arrow_path = "M0 0l254.38 454.78c-230.68,-167.78 -274.65,-164.19 -508.77,0l254.38 -454.78z"
		player = STATE.player
		animations = []
		loadAnimations()

		rand-ground = []
		for i in Array.from(Array(1000).keys())
			rand-ground.push({
				r: Math.random() * 500
				x: Math.random() * 10000
				y: Math.random() * 10000
			})

	def mount
		STATE.game.new(self)

	def cameraPosX
		window.innerWidth / 2 - player.position.x

	def cameraPosY
		window.innerHeight / 2 - player.position.y

	def transformCamera
		if STATE.time - player.gun.last_shot < 30
			let power = (player.gun.power * player.gun.projectiles) / 2
			let x = cameraPosX() + Math.random() * power - power/2
			let y = cameraPosY() + Math.random() * power - power/2
			"translate({x}, {y})"
		else
			"translate({cameraPosX()}, {cameraPosY()})"

	def transformPlayer
		"translate({player.position.x}, {player.position.y}) rotate({player.rotation})"

	def transformBullet bullet
		"translate({bullet.position.x}, {bullet.position.y}) rotate({bullet.rotation})"

	def transformZombie zombie
		"translate({zombie.position.x}, {zombie.position.y}) rotate({zombie.rotation})"

	def transformObstacle obs
		"translate({obs.position.x}, {obs.position.y}) rotate({obs.rotation})"

	def transformShopArrow
		let pos = player.position
		let rotation = -(Math.atan2(pos.x, pos.y)/0.01745 + 180) % 360
		"translate({pos.x}, {pos.y}) rotate({rotation})"

	def playerTexture
		let time = STATE.time / 16
		let anim = player.animation
		"url(#{anim.name}-{~~(time / anim.frame-length % anim.size)})"

	def feetTexture
		let time = STATE.time / 16
		let anim = player.feet-animation
		"url(#{anim.name}-{~~(time / anim.frame-length % anim.size)})"

	def zombieTexture zombie
		let time = STATE.time / 16
		let anim = zombie.animation
		"url(#{anim.name}-{~~(time / anim.frame-length % anim.size)})"

	def animationAdjust
		let adjust = player.animation.adjust
		"translate({adjust.translate}) scale({adjust.scale})"

	def feetAdjust
		let adjust = player.feet-animation.adjust
		"translate({adjust.translate}) scale({adjust.scale})"

	def zombieAdjust zombie
		let adjust = zombie.animation.adjust
		"translate({adjust.translate}) scale({adjust.scale})"

	def loadAnimations
		for own gun, anims of STATE.animations.player
			for own action, anim of anims
				for a, i in Array.from(Array(anim.size).keys())
					animations.push({
						name: "{anim.name}-{i}"
						path: "{anim.path}{i}"
					})
		for own action, anim of STATE.animations.feet
			for a, i in Array.from(Array(anim.size).keys())
				animations.push({
					name: "{anim.name}-{i}"
					path: "{anim.path}{i}"
				})
		for own action, anim of STATE.animations.zombie
			for a, i in Array.from(Array(anim.size).keys())
				animations.push({
					name: "{anim.name}-{i}"
					path: "{anim.path}{i}"
				})

	def render
		<self>
			if STATE.loading
				<h1>
					"Carregando"
			else
				<.darkness=(!player.gun.firing) style="transform: translate(-500vw, -150vh) rotate({-player.rotation + 90}deg)">
				<.ui>
					<player-hud>
					<player-store>
				<svg transform="scale(1,-1)" height="100%" width="100%">
					<defs>
						for animation in animations
							<pattern id="{animation.name}" patternUnits="userSpaceOnUse" width=100 height=100 patternContentUnits="userSpaceOnUse">
								<image href="{animation.path}.png" width=100 height=100>
						<pattern id="Mud" patternUnits="userSpaceOnUse" width=500 height=500 patternContentUnits="userSpaceOnUse">
							<image href="textures/the_floor/the_floor/Mud.png" width=500 height=500>
						<pattern id="Rock" patternUnits="userSpaceOnUse" width=500 height=500 patternContentUnits="userSpaceOnUse">
							<image href="textures/the_floor/the_floor/Rock.png" width=500 height=500>
						<pattern id="Forest" patternUnits="userSpaceOnUse" width=500 height=500 patternContentUnits="userSpaceOnUse">
							<image href="textures/the_floor/the_floor/Forest.png" width=500 height=500>
						<pattern id="bush" patternUnits="userSpaceOnUse" width=110 height=110 patternContentUnits="userSpaceOnUse">
							<image href="textures/the_floor/the_floor/bush.png" width=110 height=110>
						<pattern id="barrel" patternUnits="userSpaceOnUse" width=40 height=40 patternContentUnits="userSpaceOnUse">
							<image href="textures/the_floor/the_floor/barrel.png" width=40 height=40>
						<pattern id="blood" patternUnits="userSpaceOnUse" width=100 height=100 patternContentUnits="userSpaceOnUse">
							<image href="textures/the_floor/the_floor/blood_0.png" width=100 height=100>
						<pattern id="shot" patternUnits="userSpaceOnUse" width=100 height=100 patternContentUnits="userSpaceOnUse">
							<image href="textures/shoot/shoot/0.png" width=100 height=100>

							

					# CAMERA
					<g transform=transformCamera() .fadeOut=(player.dead)>
						# GROUND
						<rect height=100000 width=100000 transform='translate(-40000,-40000)' opacity=0.33 fill="url(#Mud)">
						<rect height=100000 width=100000 transform='translate(-40000,-40000)' opacity=0.33 fill="url(#Forest)">
						<rect height=100000 width=100000 transform='translate(-40000,-40000)' opacity=0.33 fill="url(#Rock)">
						# SHOP
						<rect x="0" y="0" transform="translate(-100,-100)"  height=200 width=200 stroke="#888" stroke-width='5px' fill="rgba(0,255,0,0.1)">

						for obj of player.nearBushes
							<g transform=transformObstacle(obj)>
								<rect fill="url(#bush)" height=(obj.size*2 + 10) width=(obj.size*2 + 10) transform="translate({-obj.size - 5},{-obj.size - 5})">

						for obj of player.nearBarrels
							<g transform=transformObstacle(obj)>
								<rect fill="url(#barrel)" height=(obj.size*2) width=(obj.size*2) transform="translate({-obj.size},{-obj.size})">

						# SHOP ARROW
						if player.distanceTo(0,0) > 1000
							<g transform=transformShopArrow() .fadeIn>
								<g transform="translate(0,350) rotate(180) scale(0.08,0.08)">
									<path fill="rgba(0,255,0,0.4)" d=arrow_path>

						# PLAYER
						<g transform=transformPlayer()>
							<g transform=feetAdjust()>
								<rect width=100 height=100 
									transform="rotate(90) translate(-50,-50)" 
									fill=feetTexture()>
							<g transform=animationAdjust()>
								<rect width=100 height=100 
									transform="rotate(90) translate(-50,-50)" 
									fill=playerTexture()>
							if player.gun.firing
								<rect width=100 height=100 
									transform="rotate(90) translate(30,-65)" 
									fill="url(#shot)">


						# BULLETS
						for bullet of STATE.bullets
							<g transform=transformBullet(bullet)>
								<rect width=(bullet.speed*4) height="1" fill="yellow">

						# ZOMBIES
						for zombie of player.nearZombies
							<g transform=transformZombie(zombie)>
								<g transform=zombieAdjust(zombie)>
									<rect width=100 height=100 
										transform="translate(-50,-50)" 
										fill=zombieTexture(zombie)>
									if zombie.taking_hit
										<rect width=100 height=100 
											transform="rotate({Math.random() * 10 - 105}) translate(-50,{Math.random() * 10 - 100})" 
											fill='url(#blood)'>

						# BODIES
						for zombie of STATE.killed
							<g transform=transformZombie(zombie) .fadeOut>
								<g transform=zombieAdjust(zombie)>
									<rect width=100 height=100 
										transform="translate(-50,-50)" 
										fill=zombieTexture(zombie)>

					# CROSSHAIR
					<g transform="translate({STATE.mouse.x}, {STATE.mouse.y})">
						<line y1=4 y2=10 stroke='#5F5'>
						<line y1=-4 y2=-10 stroke='#5F5'>
						<line x1=4 x2=10 stroke='#5F5'>
						<line x1=-4 x2=-10 stroke='#5F5'>

	css &
		display: block 
		position: relative
		background-color: black
		position: fixed
		bottom: 0
		top: 0
		left: 0
		right: 0

	css .darkness
		z-index: 1
		position: absolute
		top: 0
		left: 0
		height: 400vh
		width: 1100vw
		background-image: radial-gradient(ellipse at 0% 50% , rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.98) 35.8%, rgba(0, 0, 0, 1) 100%)

	css .fadeOut
		-webkit-animation-duration: 1.5s
		animation-duration: 1.5s
		-webkit-animation-fill-mode: both
		animation-fill-mode: both
		-webkit-animation-name: fadeOut
		animation-name: fadeOut

	css .fadeIn
		-webkit-animation-duration: 1.5s
		animation-duration: 1.5s
		-webkit-animation-fill-mode: both
		animation-fill-mode: both
		-webkit-animation-name: fadeIn
		animation-name: fadeIn

	css .ui
		position: fixed
		z-index: 10




imba.mount(<app-root>)