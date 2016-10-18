'use strict'

const CID = require('cids')
const multihash = require('multihashes')
const util = require('./util')


exports = module.exports

exports.multicodec = 'eth-block'

/*
 * resolve: receives a path and a block and returns the value on path,
 * throw if not possible. `block` is an IPFS Block instance (contains data + key)
 */
exports.resolve = (block, path) => {
  let node = util.deserialize(block.data)

  // root

  if (!path || path === '/') {
    return { value: node, remainderPath: '' }
  }

  // within scope

  const tree = exports.tree(block)
  let result

  tree.forEach((item) => {
    if (item.path === path) {
      result = { value: item.value, remainderPath: '' }
    }
  })

  if (result) {
    return result
  }

  // out of scope

  let pathParts = path.split('/')
  let firstPart = pathParts.unshift()
  let remainderPath = pathParts.join('/')

  let lookupResult = exports.tree(block).find(key => key === firstPart)

  if (!lookupResult) {
    throw new Error('Path not found.')
  }

  return {
    value: lookupResult,
    remainderPath: remainderPath,
  }

}

/*
 * tree: returns a flattened array with paths: values of the project. options
 * are option (i.e. nestness)
 */

// eth-block
// eth-block-list (uncles)
// eth-tx-trie
// eth-tx-receipt-trie
// eth-tx
// eth-state-trie
// eth-account

exports.tree = (block, options) => {
  if (!options) {
    options = {}
  }

  const blockHeader = util.deserialize(block.data)
  const paths = []

  

  // external links
  paths.push({
    path: 'parent',
    value: { '/': cidForHash(blockHeader.parentHash) },
  })
  paths.push({
    path: 'uncles',
    value: { '/': cidForHash(blockHeader.uncleHash) },
  })
  paths.push({
    path: 'transactions',
    value: { '/': cidForHash(blockHeader.transactionsTrie) },
  })
  paths.push({
    path: 'transactionReceipts',
    value: { '/': cidForHash(blockHeader.receiptTrie) },
  })
  paths.push({
    path: 'state',
    value: { '/': cidForHash(blockHeader.stateRoot) },
  })

  // external links as data
  paths.push({
    path: 'parentHash',
    value: blockHeader.parentHash,
  })
  paths.push({
    path: 'uncleHash',
    value: blockHeader.uncleHash,
  })
  paths.push({
    path: 'transactionTrieRoot',
    value: blockHeader.transactionsTrie,
  })
  paths.push({
    path: 'transactionReceiptTrieRoot',
    value: blockHeader.receiptTrie,
  })
  paths.push({
    path: 'authorAddress',
    value: blockHeader.coinbase,
  })
  paths.push({
    path: 'stateRoot',
    value: blockHeader.stateRoot,
  })

  // internal data
  paths.push({
    path: 'bloom',
    value: blockHeader.bloom,
  })
  paths.push({
    path: 'difficulty',
    value: blockHeader.difficulty,
  })
  paths.push({
    path: 'number',
    value: blockHeader.number,
  })
  paths.push({
    path: 'gasLimit',
    value: blockHeader.gasLimit,
  })
  paths.push({
    path: 'gasUsed',
    value: blockHeader.gasUsed,
  })
  paths.push({
    path: 'timestamp',
    value: blockHeader.timestamp,
  })
  paths.push({
    path: 'extraData',
    value: blockHeader.extraData,
  })
  paths.push({
    path: 'mixHash',
    value: blockHeader.mixHash,
  })
  paths.push({
    path: 'nonce',
    value: blockHeader.nonce,
  })

  return paths

}

function cidForHash(rawhash) {
  return new CID({
    version: 1,
    codec: exports.multicodec,
    hash: multihash.encode(rawhash, 'keccak-256'),
  })
}
