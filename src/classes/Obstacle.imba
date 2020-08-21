import GameObject from '../engine/GameObject'

export default class Obstacle < GameObject
	def constructor player, size
		super
		position = GameObject.randomPosition(player)
		rotation = 0
		size = size