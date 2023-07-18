class Monster extends Sprite {
	constructor({
		position, 
		image, 
		frames= { max: 1, hold: 10 }, 
		sprites, 
		animate = false,
		rotation = 0,
		isEnemy = false ,
		name,
		attacks
	}) {
		super({
			position,
			image, 
			frames, 
			sprites, 
			animate,
			rotation,
		})
		this.health = 100
		this.isEnemy = isEnemy
		this.name = name
		this.attacks = attacks
	}

	faint() {
		audio.battle.stop()
		document.querySelector('#dialogueBox').innerHTML = this.name + ' fainted!'

		const tl = gsap.timeline()
		tl.to(this.position, {
			y: this.position.y + 20
		}, 0)
		.to(this, {
			opacity: 0,
		}, 0)
		.to(this.position, {
			y: this.position.y
		})
		audio.victory.play()
	}

	fireballAttack({recipient, renderedSprites, healthBar, rotation}) {
		audio.initFireball.play()
		const fireballImage = new Image()
		fireballImage.src = './images/fireball.png'
		const fireball = new Sprite({
			position: {
				x: this.position.x,
				y: this.position.y
			},
			image: fireballImage,
			frames: {
				max: 4,
				hold: 10
			},
			animate: true,
			rotation
		})
		renderedSprites.splice(1, 0, fireball)

		gsap.to(fireball.position, {
			x: recipient.position.x,
			y: recipient.position.y,
			onComplete: () => {
				audio.fireballHit.play()
				gsap.to(healthBar, {
	  				width: recipient.health + '%'
		  		})

	  			gsap.to(recipient.position, {
	  				x: recipient.position.x + 10,
	  				yoyo: true,
	  				repeat: 5,
	  				duration: 0.08
	  			})

	  			gsap.to(recipient, {
	  				opacity: 0,
	  				yoyo: true,
	  				repeat: 5,
	  				duration: 0.08
	  			})
				renderedSprites.splice(1, 1)
			}
		})
	}

	tackleAttack({recipient, healthBar}) {
		const tl = gsap.timeline()

		let movementDistance = 20
		if (this.isEnemy) movementDistance = -20

		tl.to(this.position, {
			x: this.position.x - movementDistance
		})
		  .to(this.position, {
	  		x: this.position.x + movementDistance * 2,
	  		duration: 0.1,
	  		onComplete: () => {
	  			audio.tackleHit.play()
	  			gsap.to(healthBar, {
	  				width: recipient.health + '%'
	  			})

	  			gsap.to(recipient.position, {
	  				x: recipient.position.x + 10,
	  				yoyo: true,
	  				repeat: 5,
	  				duration: 0.08
	  			})

	  			gsap.to(recipient, {
	  				opacity: 0,
	  				yoyo: true,
	  				repeat: 5,
	  				duration: 0.08
	  			})
	  		}
	  	})
		  .to(this.position, {
	  		x: this.position.x
	  	})
	}

	attack({attackChoice, recipient, renderedSprites}) {
		document.querySelector('#dialogueBox').style.display = 'block'
		document.querySelector('#dialogueBox').innerHTML = this.name + ' used ' + attackChoice.name

		let healthBar = '#enemyHealthBar'
		if (this.isEnemy) healthBar = '#playerHealthBar'

		let rotation = 1
		if (this.isEnemy) rotation = -2.2

		recipient.health -= attackChoice.damage

		switch(attackChoice.name) {
			case 'Fireball':
				this.fireballAttack({
					recipient: recipient, 
					renderedSprites: renderedSprites, 
					healthBar: healthBar,
					rotation: rotation
				})
				break;
			case 'Tackle':
				this.tackleAttack({
					recipient: recipient, 
					healthBar: healthBar
				})
				break;
		}
	}
}

