import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig.js'
import PlayerCharacter from '../common/entity/PlayerCharacter.js'
import Identity from '../common/message/Identity.js'
import CollisionSystem from '../common/CollisionSystem.js'
import Obstacle from '../common/entity/Obstacle.js'

import followPath from './followPath.js'
import gameConstants from '../common/gameConstants.js'


class GameInstance {
    constructor() {
        this.players = new Map()
        this.instance = new nengi.Instance(nengiConfig, { port: 8079, host: '0.0.0.0' })
        this.instance.onConnect((client, clientData, callback) => {

            // create a entity for this client
            const rawEntity = new PlayerCharacter()
            // Spawn player at center of map
            rawEntity.x = gameConstants.MAP_WIDTH / 2
            rawEntity.y = gameConstants.MAP_HEIGHT / 2
    
            // make the raw entity only visible to this client
            const channel = this.instance.createChannel()
            channel.subscribe(client)
            channel.addEntity(rawEntity)
            //this.instance.addEntity(rawEntity)
            client.channel = channel

            // smooth entity is visible to everyone
            const smoothEntity = new PlayerCharacter()
            smoothEntity.collidable = true
            smoothEntity.x = rawEntity.x
            smoothEntity.y = rawEntity.y
            this.instance.addEntity(smoothEntity)

            // tell the client which entities it controls
            this.instance.message(new Identity(rawEntity.nid, smoothEntity.nid), client)

            // establish a relation between this entity and the client
            rawEntity.client = client
            client.rawEntity = rawEntity
            smoothEntity.client = client
            client.smoothEntity = smoothEntity
            client.positions = []

            // define the view (the area of the game visible to this client, all else is culled)
            client.view = {
                x: rawEntity.x,
                y: rawEntity.y,
                halfWidth: 99999,
                halfHeight: 99999
            }

            //this.players.set(rawEntity.nid, rawEntity)

            callback({ accepted: true, text: 'Welcome!' })
        })

        this.instance.onDisconnect(client => {
            this.instance.removeEntity(client.rawEntity)
            this.instance.removeEntity(client.smoothEntity)
            client.channel.destroy()
        })

        // setup a few obstacles

        const obstacles = new Map()

        const obsA = new Obstacle(150, 150, 250, 150)
        this.instance.addEntity(obsA)
        obstacles.set(obsA.nid, obsA)

        const obsB = new Obstacle(450, 600, 60, 150)
        this.instance.addEntity(obsB)
        obstacles.set(obsB.nid, obsB)

        this.obstacles = obstacles
    }


    update(delta, tick, now) {
        let cmd = null
        while (cmd = this.instance.getNextCommand()) {
            const tick = cmd.tick
            const client = cmd.client

            for (let i = 0; i < cmd.commands.length; i++) {
                const command = cmd.commands[i]
                const rawEntity = client.rawEntity
                const smoothEntity = client.smoothEntity

                if (command.protocol.name === 'MoveCommand') {
                    rawEntity.processMove(command, this.obstacles)
                    client.positions.push({
                        x: rawEntity.x,
                        y: rawEntity.y,
                        rotation: rawEntity.rotation
                    })
                }

            }
        } 

        this.instance.clients.forEach(client => {
            client.view.x = client.rawEntity.x
            client.view.y = client.rawEntity.y

            const smoothEntity = client.smoothEntity
            if (smoothEntity) {
                const maximumMovementPerFrameInPixels = 410 * delta
                followPath(smoothEntity, client.positions, maximumMovementPerFrameInPixels)
            }
        })

        // when instance.updates, nengi sends out snapshots to every client
        this.instance.update()
    }
}

export default GameInstance