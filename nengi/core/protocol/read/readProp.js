import Binary from '../../binary/Binary.js';

var readProp = function(bitStream, type, arrayIndexType) {
    var binaryMeta = Binary[type]
    if (typeof arrayIndexType === 'number') {
        var arrayIndexMeta = Binary[arrayIndexType]
        var length = bitStream[arrayIndexMeta.read]()

        var arr = new Array(length)
        for (var i = 0; i < length; i++) {
            if (binaryMeta.customRead) {
                var value = binaryMeta.read(bitStream)
                arr[i] = value
            } else {
                var value = bitStream[binaryMeta.read]()
                arr[i] = value
            }
        }
        return arr

    } else {
        if (binaryMeta.customRead) {
            return binaryMeta.read(bitStream)
        } else {
            return bitStream[binaryMeta.read]()
        }
    }
}

export default readProp;