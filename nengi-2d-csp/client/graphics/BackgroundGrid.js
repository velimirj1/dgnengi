import * as PIXI from 'pixi.js'
import gameConstants from '../../common/gameConstants.js'

class BackgroundGrid extends PIXI.Container {
    constructor()  {
        super()

        // Draw grid lines
        for (var i = 0; i <= gameConstants.MAP_WIDTH / 100; i++) {           
            let line = new PIXI.Graphics()
            line.lineStyle(2, 0x333333)
            line.moveTo(i * 100, 0)
            line.lineTo(i * 100, gameConstants.MAP_HEIGHT)
            this.addChild(line)
        }

        for (var i = 0; i <= gameConstants.MAP_HEIGHT / 100; i++) {           
            let line = new PIXI.Graphics()
            line.lineStyle(2, 0x333333)
            line.moveTo(0, i * 100)
            line.lineTo(gameConstants.MAP_WIDTH, i * 100)
            this.addChild(line)
        }
        
        // Draw boundaries
        const boundary = new PIXI.Graphics()
        boundary.lineStyle(4, 0xff0000)
        boundary.drawRect(0, 0, gameConstants.MAP_WIDTH, gameConstants.MAP_HEIGHT)
        this.addChild(boundary)
    }
}

export default BackgroundGrid;