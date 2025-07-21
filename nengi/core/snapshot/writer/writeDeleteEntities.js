import { Chunk } from '../Chunk.js';
import BinaryType from '../../binary/BinaryType.js';
import Binary from '../../binary/Binary.js';
import writeDeleteId from '../../protocol/write/writeDeleteId.js';
//var config = require('../../../config')


function writeDeleteEntities(chunkType, bitStream, ids, config) {
    if (ids.length > 0) {
        bitStream[Binary[BinaryType.UInt8].write](chunkType)
        bitStream[Binary[BinaryType.UInt16].write](ids.length)
        for (var i = 0; i < ids.length; i++) {
            writeDeleteId(bitStream, config.ID_BINARY_TYPE, ids[i])
        }
    }
}

export default writeDeleteEntities;