import * as PIXI from 'pixi.js'
import PlayerCharacter from './PlayerCharacter.js'
import BackgroundGrid from './BackgroundGrid.js'
import Obstacle from './Obstacle.js'
import gameConstants from '../../common/gameConstants.js'

class PIXIRenderer {
    constructor(input, sounds) {
        this.canvas = document.getElementById('main-canvas')

        this.masterScale = 1
        this.myEntity = null
        this.entities = new Map()

        this.renderer = PIXI.autoDetectRenderer({
            width: window.innerWidth, 
            height: window.innerHeight, 
            view: this.canvas,
            antialiasing: false,
            transparent: false,
            resolution: 1
        })

        this.stage = new PIXI.Container()
        this.camera = new PIXI.Container()
        this.background = new PIXI.Container()
        this.middleground = new PIXI.Container()
        this.foreground = new PIXI.Container()

        this.camera.addChild(this.background)
        this.camera.addChild(this.middleground)
        this.camera.addChild(this.foreground)
        this.stage.addChild(this.camera)

        this.background.addChild(new BackgroundGrid())
        
        // Center the camera on the map
        this.centerCameraOnMap()

        window.addEventListener('resize', () => {
            this.resize()
            this.centerCameraOnMap()
        })

        this.resize()
    }

    drawBulletEnd(alreadyHitPlayer, x, y) {
        if (alreadyHitPlayer) return
        var effect = new ImpactEffect(x, y)
        this.camera.addChild(effect)
        this.effects.push(effect)
    }


    resize() {
        this.renderer.resize(window.innerWidth, window.innerHeight)
    }

    createEntity(entity) {
        console.log('renderer create', entity)
        if (entity.protocol.name === 'PlayerCharacter') {  
            const clientEntity = new PlayerCharacter(entity)
            this.entities.set(entity.nid, clientEntity)
            this.middleground.addChild(clientEntity)
        }

        
        if (entity.protocol.name === 'Obstacle') {
            console.log('creating an OBSTACLE')
            const clientEntity = new Obstacle(entity)
            this.entities.set(entity.nid, clientEntity)
            this.middleground.addChild(clientEntity)
        }
    }

    updateEntity(update) {
        const entity = this.entities.get(update.nid)
        entity[update.prop] = update.value
    }

    message(message) {

    }

    deleteEntity(nid) {
        if (this.entities.get(nid)) {
            this.foreground.removeChild(this.entities.get(nid))
            this.middleground.removeChild(this.entities.get(nid))
            this.entities.delete(nid)
        }
    }

    localMessage(message) {
        if (message.protocol.name === 'WeaponFired') {

        }
    }


 
    centerCameraOnMap() {
        // Calculate scale to fit map on screen while maintaining aspect ratio
        const scaleX = window.innerWidth / gameConstants.MAP_WIDTH
        const scaleY = window.innerHeight / gameConstants.MAP_HEIGHT
        
        // Use the smaller scale to ensure the entire map fits on screen
        const scale = Math.min(scaleX, scaleY) * 0.9 // 0.9 to add some padding
        
        this.camera.scale.set(scale, scale)
        
        // Center the scaled map in the middle of the screen
        this.camera.x = (window.innerWidth - gameConstants.MAP_WIDTH * scale) / 2
        this.camera.y = (window.innerHeight - gameConstants.MAP_HEIGHT * scale) / 2
    }
    
    centerCamera(entity) {
        // Camera is now static - don't move it
        // The map is already centered via centerCameraOnMap()
    }


    toWorldCoordinates(mouseX, mouseY) {
        // Account for camera position and scale
        const scale = this.camera.scale.x
        return {
            x: (mouseX - this.camera.x) / scale,
            y: (mouseY - this.camera.y) / scale
        }
    }

    move(nid, x, y, rotation) {
        const entity = this.entities.get(nid)
        entity.x = x
        entity.y = y
        entity.rotation = rotation
    }


    update(delta) {
        if (this.myEntity) {
            // Camera is static, no following
        }

        this.entities.forEach(entity => {
            entity.update(delta)
        })

        this.renderer.render(this.stage)
    }
}

export default PIXIRenderer
