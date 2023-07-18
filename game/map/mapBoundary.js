class Boundary {
	static width = 48
	static height = 48
	constructor({position}) {
		this.position = position
		this.width = 48
		this.height = 48
	}

	draw() {
		c.fillStyle = 'rgba(255, 0, 0, 0)'
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
}

function generateMapCollision() {
	let collisionsMap = []
	for (let i = 0; i < collisions.length; i += 70) {
		collisionsMap.push(collisions.slice(i, i + 70))
	}

	const boundaries = []
	collisionsMap.forEach((row, i) => {
		row.forEach((symbol, j) => {
			if (symbol === 1025)
				boundaries.push(new Boundary({
					position: {
						x: j * Boundary.width + offset.x,
						y: i * Boundary.height + offset.y
					}
				}))
		})
	})

	return boundaries
}

function generateMapBattleZones() {
	let battleZonesMap = []
	for (let i = 0; i < battleZonesData.length; i += 70) {
		battleZonesMap.push(battleZonesData.slice(i, i + 70))
	}

	const battleZones = []
	battleZonesMap.forEach((row, i) => {
		row.forEach((symbol, j) => {
			if (symbol === 1025)
				battleZones.push(new Boundary({
					position: {
						x: j * Boundary.width + offset.x,
						y: i * Boundary.height + offset.y
					}
				}))
		})
	})

	return battleZones
}