import BinaryType from '../../binary/BinaryType.js';
import Binary from '../../binary/Binary.js';
import countBatchBits from '../../protocol/countBits/countBatchBits.js';

function addBatchBits(total, batch) {
    return total + countBatchBits(batch)
}

function countBatchesBits(batches) {
    var bits = 0
    if (batches.length > 0) {
        bits += Binary[BinaryType.UInt8].bits
        bits += Binary[BinaryType.UInt16].bits
        bits = batches.reduce(addBatchBits, bits)
    }
    return bits
}

export default countBatchesBits;