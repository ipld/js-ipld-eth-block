'use strict'

const EthBlockHeader = require('ethereumjs-block/header')
const cidForHash = require('./common').cidForHash

exports.deserialize = function(data) {
  return new EthBlockHeader(data)
}

exports.serialize = function(blockHeader) {
  return blockHeader.serialize()
}

exports.cid = function(blockHeader) {
  return cidForHash('eth-block', blockHeader.hash())
}
