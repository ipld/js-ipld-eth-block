const CID = require('cids')
const multihash = require('multihashes')

module.exports = {
  cidForHash: cidForHash,
}

function cidForHash(codec, rawhash) {
  return new CID({
    version: 1,
    codec: codec,
    hash: multihash.encode(rawhash, 'keccak-256'),
  }).toString()
}
