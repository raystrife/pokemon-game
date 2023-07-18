class Sprite {
	constructor({
		position, 
		image, 
		frames= { max: 1, hold: 10 }, 
		sprites, 
		animate = false,
		rotation = 0
	}) {
		this.position = position
		this.image = new Image()
		this.frames = {...frames, val: 0, elapsed: 0}
		this.image.onload = () => {
			this.width = this.image.width / this.frames.max
			this.height = this.image.height
		}
		this.image.src = image.src

		this.animate = animate
		this.sprites = sprites
		this.opacity = 1
		this.rotation = rotation
	}

	draw() {
		c.save()
		c.translate(
			this.position.x + this.width / 2,
			this.position.y + this.height / 2
		)
		c.rotate(this.rotation)
		c.translate(
			-this.position.x - this.width / 2,
			-this.position.y - this.height / 2
		)
		c.globalAlpha = this.opacity
		c.drawImage(
			this.image, 
			this.frames.val * this.width,	//x-coordinate of the image crop
			0,	//y-coordinate of the image crop
			this.image.width / this.frames.max, 
			this.image.height, 
			this.position.x,	//x-coordinate position of the image on the game 
			this.position.y,	//y-coordinate position of the image on the game
			this.image.width / this.frames.max, //the width of the image that will be added to the x-coordinate position
			this.image.height	//the height of the image that will be added to the y-coordinate position
		)
		c.restore()

		if (!this.animate) return

		if (this.frames.max > 1) {
			this.frames.elapsed++
		}

		if (this.frames.elapsed % this.frames.hold === 0) {
			if (this.frames.val < this.frames.max - 1) this.frames.val++
			else this.frames.val = 0
		}
	}
}

function generateBackgroundSprite() {
	const image = new Image()
	image.src = './images/pokemon-map.png'

	return new Sprite({
		position: {
			x: offset.x,
			y: offset.y
		},
		image: image
	})
}

function generatePlayerSprite() {
	const playerDownImage = new Image()
	playerDownImage.src = './images/playerDown.png'

	const playerUpImage = new Image()
	playerUpImage.src = './images/playerUp.png'

	const playerLeftImage = new Image()
	playerLeftImage.src = './images/playerLeft.png'

	const playerRightImage = new Image()
	playerRightImage.src = './images/playerRight.png'

	return new Sprite({
		position: {
			x: canvas.width / 2 - 192 / 4 / 2 , 
			y: canvas.height / 2 - 68 / 2
		},
		image: playerDownImage,
		frames: { max: 4, hold: 10 },
		sprites: {
			up: playerUpImage,
			down: playerDownImage,
			left: playerLeftImage,
			right: playerRightImage
		}
	})
}

function generateForegroundSprite() {
	const foregroundImage = new Image()
	foregroundImage.src = './images/foregroundObject.png'

	return new Sprite({
		position: {
			x: offset.x,
			y: offset.y
		},
		image: foregroundImage
	})
}

function generateBattleBackgroundSprite() {
	const battleBackgroundImage = new Image()
	battleBackgroundImage.src = "./images/battleBackground.png"

	return new Sprite({
		position: {
			x: 0,
			y: 0
		},
		image: battleBackgroundImage
	})
}