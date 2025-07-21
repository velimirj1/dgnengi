import createCommandBuffer from '../snapshot/writer/createCommandBuffer.js'
class Outbound {
    constructor(protocols, websocket, config) {
        this.config = config
        this.protocols = protocols
        this.websocket = websocket
        this.unconfirmedCommands = new Map()
        this.sendQueue = new Map()
        this.clientTick = 0
        this.confirmedTick = null
        this.lastSentTick = -1
    }

    update() {
        for (var i = this.lastSentTick + 1; i < this.clientTick; i++) {
            this.sendCommands(i)
            this.lastSentTick = i
        }
        this.clientTick++
    }

    addCommand(command) {
        var tick = this.clientTick
        //command.tick = tick
        command[this.config.TYPE_PROPERTY_NAME] = this.protocols.getIndex(command.protocol)

        if (this.sendQueue.has(tick)) {
            this.sendQueue.get(tick).push(command)
        } else {
            this.sendQueue.set(tick, [command])
        }

        if (!this.unconfirmedCommands.has(tick)) {
            this.unconfirmedCommands.set(tick, [command])
        } else {
            this.unconfirmedCommands.get(tick).push(command)
        }
    }

    sendCommands(tick) {
        if (this.websocket && this.websocket.readyState === 1) {
            if (this.sendQueue.has(tick)) {
                this.websocket.send(createCommandBuffer(tick, this.sendQueue.get(tick)).byteArray)
                this.sendQueue.delete(tick)
            } else {
                // TODO: Do we need to do this?
                this.websocket.send(createCommandBuffer(tick, []).byteArray)
            }
        }
    }

    confirmCommands(tick) {
        this.unconfirmedCommands.forEach((command, key) => {
            if (key <= tick) {
                this.unconfirmedCommands.delete(key)
            }
        })
        this.confirmedTick = tick
    }

    getUnconfirmedCommands() {
        return this.unconfirmedCommands
    }
}

export default Outbound