let draggle
let emby
let renderedSprites
let battleAnimationId
let queue

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
	if (queue.length > 0) {
		queue[0]()
		queue.shift()
	} else {
		e.currentTarget.style.display = 'none'
	}	
})

function checkMonsterFaint(monster) {
	if (monster.health <= 0) {
		queue.push(() => {
			monster.faint()
		})
		queue.push(() => {
			gsap.to('#overlappingDiv', {
				opacity: 1,
				onComplete: () => {
					cancelAnimationFrame(battleAnimationId)
					animate()
					document.querySelector('#userInterface').style.display = 'none'

					gsap.to('#overlappingDiv', {
						opacity: 0
					})

					battle.initiated = false
					audio.victory.stop()
					audio.Map.play()
				}
			})
		})
	}
}

function initBattle() {
	document.querySelector('#userInterface').style.display = 'block'
	document.querySelector('#dialogueBox').style.display = 'none'
	document.querySelector('#enemyHealthBar').style.width = '100%'
	document.querySelector('#playerHealthBar').style.width = '100%'
	document.querySelector('#attacksBox').replaceChildren()

	draggle = new Monster(monsters.Draggle)
	emby = new Monster(monsters.Emby)
	renderedSprites = [draggle, emby]
	queue = []

	emby.attacks.forEach(attack => {
		const button = document.createElement('button')
		button.innerHTML = attack.name
		document.querySelector('#attacksBox').append(button)
	})

	document.querySelectorAll('button').forEach((button) => {
		button.addEventListener('click', (e) => {
			const selectedAttack = attacks[e.currentTarget.innerHTML]
			emby.attack({
				attackChoice: selectedAttack,
				recipient: draggle,
				renderedSprites
			})

			checkMonsterFaint(draggle)

			const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]

			queue.push(() => {
				draggle.attack({
					attackChoice: randomAttack,
					recipient: emby,
					renderedSprites
				})

				checkMonsterFaint(emby)
			})
		})

		button.addEventListener('mouseenter', (e) => {
			const selectedAttack = attacks[e.currentTarget.innerHTML]
			document.querySelector('#attackType').innerHTML = selectedAttack.type
			document.querySelector('#attackType').style.color = selectedAttack.color
		})
	})
}

function animateBattle() {
	battleAnimationId = window.requestAnimationFrame(animateBattle)
	battleBackground.draw()

	renderedSprites.forEach((sprite) => {
		sprite.draw()
	})
}