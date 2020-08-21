import Zombie from '../classes/Zombie'

tag player-store

	def buyGun gun
		if gun.price <= STATE.player.score
			STATE.player.score -= gun.price
			var index = STATE.store.indexOf(gun)
			STATE.store.splice(index, 1) if (index != -1)
			STATE.player.inventory.push(gun)

	def upgradeGun gun
		STATE.shop.upgrade-gun = gun

	def equipGun gun
		STATE.player.equip(gun)

	def toggleShop
		if STATE.player.inSafeZone()
			STATE.shop.open = not STATE.shop.open

	def nextDay
		for own key, sector of STATE.zombies
			sector.clear()

		for i in Array.from(Array(50000 + 5000 * (STATE.day ** 1.4)))
			let zombie = Zombie.new(STATE.player, STATE.day, STATE.animations.zombie)
			STATE.zombies[zombie.currentSector()] ||= Set.new
			STATE.zombies[zombie.currentSector()].add(zombie)

		STATE.shop.open = no


	def healPlayer
		return unless STATE.player.score >= STATE.day * 40
		STATE.player.score -= STATE.day * 40
		STATE.player.life = STATE.player.max-life

	def buyAmmo
		return unless STATE.player.score >= STATE.day * 200
		STATE.player.score -= STATE.day * 200
		STATE.player.life = STATE.player.max-life

	def upgradeHealth
		return unless STATE.player.score >= STATE.shop.health
		STATE.player.score -= STATE.shop.health
		STATE.player.max-life += 10 
		STATE.shop.health *= 2

	def upgradeSpeed
		return unless STATE.player.score >= STATE.shop.speed
		STATE.player.score -= STATE.shop.speed
		STATE.player.max-speed += 0.05
		STATE.shop.speed *= 2

	def upgradeStamina
		return unless STATE.player.score >= STATE.shop.stamina
		STATE.player.score -= STATE.shop.stamina
		STATE.player.max-stamina += 300 
		STATE.shop.max-stamina *= 10 

	def upgradeHolster
		return unless STATE.player.score >= STATE.shop.slots
		STATE.player.score -= STATE.shop.slots
		STATE.player.slots += 1
		STATE.shop.slots *= 2

	def back
		STATE.shop.upgrade-gun = null

	def buyUpgrade stat
		return if STATE.player.score < STATE.shop.upgrade-gun.upgrades[stat]
		STATE.player.score -=  STATE.shop.upgrade-gun.upgrades[stat]
		STATE.shop.upgrade-gun.upgrades[stat] *= 2
		let upgrade =
			cap:         do STATE.shop.upgrade-gun.cap         += ~~(1 + STATE.shop.upgrade-gun.cap * 0.1)
			rate:        do STATE.shop.upgrade-gun.rate        += ~~(STATE.shop.upgrade-gun.rate * 0.1)
			spread:      do STATE.shop.upgrade-gun.spread      -= ~~(STATE.shop.upgrade-gun.spread * 0.1)
			damage:      do STATE.shop.upgrade-gun.damage      += ~~(STATE.shop.upgrade-gun.damage * 0.1)
			power:       do STATE.shop.upgrade-gun.power       += ~~(STATE.shop.upgrade-gun.power * 0.1)
			reload_time: do STATE.shop.upgrade-gun.reload_time -= ~~(STATE.shop.upgrade-gun.reload_time * 0.1)
	
		upgrade[stat]()

	def render
		<self .{STATE.player.inSafeZone() ? "fadeIn" : "fadeOut"}>
			if not STATE.shop.open
				<.hud .open-store  .fadeOut=(STATE.player.dead)>
					<.buy-row :click.toggleShop>
						<.back>
							"Open shop"
			if STATE.shop.open and STATE.shop.upgrade-gun
				<.hud .store>
					<h1>
						"UPGRADES"
					<h3>
						STATE.shop.upgrade-gun.name
					<.buy-row :click.buyUpgrade('cap')>
						<.item>
							"Capacity"
						<.prices>
							STATE.shop.upgrade-gun.upgrades.cap
					<.buy-row :click.buyUpgrade('rate')>
						<.item>
							"Rate of fire"
						<.prices>
							STATE.shop.upgrade-gun.upgrades.rate
					<.buy-row :click.buyUpgrade('spread')>
						<.item>
							"Accuracy"
						<.prices>
							STATE.shop.upgrade-gun.upgrades.spread
					<.buy-row :click.buyUpgrade('damage')>
						<.item>
							"Damage"
						<.prices>
							STATE.shop.upgrade-gun.upgrades.damage
					<.buy-row :click.buyUpgrade('power')>
						<.item>
							"Power"
						<.prices>
							STATE.shop.upgrade-gun.upgrades.power
					<.buy-row :click.buyUpgrade('reload_time')>
						<.item>
							"Reload Speed"
						<.prices>
							STATE.shop.upgrade-gun.upgrades.reload_time
					<.row>
						<.next-day>
							""
						<.back :click.back>
							"Back"
			if STATE.shop.open and not STATE.shop.upgrade-gun
				<.hud .store .fadeOut=(STATE.player.dead)>
					<h1>
						"SHOP"
					<.buy-row>
						<.item>
							"Item"
						<.prices>
							"price"
					<.row css:margin-top="5%">
					<.buy-row :click.healPlayer>
						<.item>
							"Heal"
						<.prices>
							STATE.day * 40
					<.buy-row :click.buyAmmo>
						<.item>
							"Buy Ammo"
						<.prices>
							STATE.day * 200
					<.row css:margin-top="5%">
					<.buy-row :click.upgradeHealth>
						<.item>
							"Upgrade health"
						<.prices>
							STATE.shop.health
					<.buy-row :click.upgradeSpeed>
						<.item>
							"Upgrade speed"
						<.prices>
							STATE.shop.speed
					<.buy-row :click.upgradeStamina>
						<.item>
							"Upgrade stamina"
						<.prices>
							STATE.shop.max-stamina
					if STATE.player.slots < 6
						<.buy-row :click.upgradeHolster>
							<.item>
								"Upgrade holster"
							<.prices>
								"{STATE.shop.slots}"
					<.row css:margin-top="5%">
					for gun in STATE.store
						<.buy-row :click.buyGun(gun)>
							<.item>
								"buy {gun.name}"
							<.prices>
								gun.price
					<.row css:margin-top="5%">

					<h1>
						"INVERTORY"
					for gun in STATE.player.inventory
						<.row>
							<.item>
								gun.name
							<.action :click.equipGun(gun)>
								"Equip"
							<.action :click.upgradeGun(gun)>
								"Upgrade"
					<.row css:margin-top="5%">
					<.row>
						<.next-day :click.nextDay>
							"Go to next day"
						<.close :click.toggleShop>
							"Close"
	css .hud 
		position: fixed
		z-index: 1
		font-family: Typewriter
		color: white
		border-color: white
		border: 1px
		cursor: pointer
		top: 2%
		left: 50%
		transform: translate(-50%,0)

	css .row, .buy-row 
		display: flex

	css .item, .next-day
		width: 300px

	css .prices, .close 
		text-align: right
		flex-grow: 1

	css .action
		text-align: right
		width: 8vw

	css .buy-row@hover
		.prices 
			transform: translate(-1vw,0) scale(1.3,1.3)

	css .action@hover
		transform: scale(1.3,1.3)

	css .next-day@hover 
		transform: scale(1.3,1.3) translate(1vw,0)

	css .close@hover 
		transform: scale(1.3,1.3) translate(-1vw,0)

	css .back@hover 
		transform: scale(1.3,1.3)

	css .buy-row@hover, .action@hover, .next-day@hover, .close@hover, .back@hover 
		text-shadow: 0px 0px 5px #F00

	css .store 
		font-size: calc(10px + .6vw)
		background-color: rgba(0,0,0,0.8)
		padding: 30px

	css .open-store 
		cursor: none
		font-size: calc(15px + .8vw)
		text-align: center
		top: 25%

