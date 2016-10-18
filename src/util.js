'use strict'

const EthBlockHeader = require('ethereumjs-block/header')

exports.deserialize = function(data) {
  return new EthBlockHeader(data)
}

exports.serialize = function(blockHeader) {
  return blockHeader.serialize()
}