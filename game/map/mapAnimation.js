const keys = {
	w: {
		pressed: false
	},
	a: {
		pressed: false
	},
	s: {
		pressed: false
	},
	d: {
		pressed: false
	}
}

battle = {
	initiated: false
}

let lastKey = ''
window.addEventListener('keydown', (e) => {
	switch (e.key) {
		case 'w':
			keys.w.pressed = true
			lastKey = 'w'
			break
		case 'a':
			keys.a.pressed = true
			lastKey = 'a'
			break
		case 's':
			keys.s.pressed = true
			lastKey = 's'
			break
		case 'd':
			keys.d.pressed = true
			lastKey = 'd'
			break
		}	
}) 

window.addEventListener('keyup', (e) => {
	switch (e.key) {
		case 'w':
			keys.w.pressed = false
			break
		case 'a':
			keys.a.pressed = false
			break
		case 's':
			keys.s.pressed = false
			break
		case 'd':
			keys.d.pressed = false
			break
		}	
}) 

let clicked = false
addEventListener('keydown', () => {
	if (!clicked) {
		audio.Map.play()
		clicked = true
	}
})

function rectangularCollision({rectangle1, rectangle2}) {
	return(
		rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
		rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
		rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
		rectangle1.position.y + rectangle1.height >= rectangle2.position.y
	)
}

function drawGameMapComponents() {
	background.draw()
	boundaries.forEach(boundary => {
		boundary.draw()
	})
	battleZones.forEach(battleZone => {
		battleZone.draw()
	})
	player.draw()
	foreground.draw()
}

function checkToStartBattle(animationId) {
	if (battle.initiated) return

	if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
		for (let i = 0; i < battleZones.length; i++) {
			const battleZone = battleZones[i]
			const overlappingArea = 
				(Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) -
					Math.max(player.position.x, battleZone.position.x)) *
				(Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) - 
					Math.max(player.position.y, battleZone.position.y))
				
			if (rectangularCollision({rectangle1: player, rectangle2: battleZone}) 
					&& overlappingArea > (player.width * player.height) / 2 
					&& Math.random() < 0.03
				) {
					window.cancelAnimationFrame(animationId)

					audio.Map.stop()
					audio.initBattle.play()
					audio.battle.play()

					battle.initiated = true
					gsap.to('#overlappingDiv', {
						opacity: 1,
						repeat: 3,
						yoyo: true,
						duration: 0.4,
						onComplete() {
							gsap.to('#overlappingDiv', {
								opacity: 1,
								duration: 0.4,
								onComplete() {
									initBattle()
									animateBattle()
									gsap.to('#overlappingDiv', {
										opacity: 0,
										duration: 0.4
									})
								}
							})
						}
					})
					break
				}
			}
		}
}

function checkToMovePlayer() {
	let moving = true
	player.animate = false

	if (keys.w.pressed && lastKey === 'w') {
		player.animate = true
		player.image = player.sprites.up
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i]
			if (rectangularCollision({
					rectangle1: player, 
					rectangle2: {...boundary, position: {
						x: boundary.position.x,
						y: boundary.position.y + 3
					}}
			})) {
				moving = false
				break
			}
		}
		if (moving)
			movables.forEach((movable) => { 
				movable.position.y += 3
			})
	} else if (keys.a.pressed && lastKey === 'a') {
		player.animate = true
		player.image = player.sprites.left
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i]
			if (rectangularCollision({
					rectangle1: player, 
					rectangle2: {...boundary, position: {
						x: boundary.position.x + 3,
						y: boundary.position.y
					}}
			})) {
				moving = false
				break
			}
		}
		if (moving)
			movables.forEach((movable) => { 
				movable.position.x += 3
			})
	} else if (keys.s.pressed && lastKey === 's') {
		player.animate = true
		player.image = player.sprites.down
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i]
			if (rectangularCollision({
					rectangle1: player, 
					rectangle2: {...boundary, position: {
						x: boundary.position.x,
						y: boundary.position.y - 3
					}}
			})) {
				moving = false
				break
			}
		}
		if (moving)
			movables.forEach((movable) => { 
				movable.position.y -= 3
			})
	} else if (keys.d.pressed && lastKey === 'd') {
		player.animate = true
		player.image = player.sprites.right
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i]
			if (rectangularCollision({
					rectangle1: player, 
					rectangle2: {...boundary, position: {
						x: boundary.position.x - 3,
						y: boundary.position.y
					}}
			})) {
				moving = false
				break
			}
		}
		if (moving)
			movables.forEach((movable) => { 
				movable.position.x -= 3
			})
	}
}

function animate() {
	const animationId = window.requestAnimationFrame(animate)
	drawGameMapComponents()
	checkToStartBattle(animationId)
	checkToMovePlayer()
}