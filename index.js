let boundaries = generateMapCollision()
let battleZones = generateMapBattleZones()

const player = generatePlayerSprite()
const background = generateBackgroundSprite()
const foreground = generateForegroundSprite()
const battleBackground = generateBattleBackgroundSprite()

const movables = [background, ...boundaries, foreground, ...battleZones]

animate()