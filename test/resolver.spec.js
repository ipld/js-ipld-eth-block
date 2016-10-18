/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const dagEthBlock = require('../src')
const resolver = dagEthBlock.resolver
const IpfsBlock = require('ipfs-block')
const EthBlockHeader = require('ethereumjs-block/header')
const ethUtils = require('ethereumjs-util')

describe('IPLD format resolver (local)', () => {
  let testIpfsBlock
  let testData = {
    //                            12345678901234567890123456789012
    parentHash:       new Buffer('0100000000000000000000000000000000000000000000000000000000000000', 'hex'),
    uncleHash:        new Buffer('0200000000000000000000000000000000000000000000000000000000000000', 'hex'),
    coinbase:         new Buffer('0300000000000000000000000000000000000000', 'hex'),
    stateRoot:        new Buffer('0400000000000000000000000000000000000000000000000000000000000000', 'hex'),
    transactionsTrie: new Buffer('0500000000000000000000000000000000000000000000000000000000000000', 'hex'),
    receiptTrie:      new Buffer('0600000000000000000000000000000000000000000000000000000000000000', 'hex'),
    // bloom:            new Buffer('07000000000000000000000000000000', 'hex'),
    difficulty:       new Buffer('0800000000000000000000000000000000000000000000000000000000000000', 'hex'),
    number:           new Buffer('0900000000000000000000000000000000000000000000000000000000000000', 'hex'),
    gasLimit:         new Buffer('1000000000000000000000000000000000000000000000000000000000000000', 'hex'),
    gasUsed:          new Buffer('1100000000000000000000000000000000000000000000000000000000000000', 'hex'),
    timestamp:        new Buffer('1200000000000000000000000000000000000000000000000000000000000000', 'hex'),
    extraData:        new Buffer('1300000000000000000000000000000000000000000000000000000000000000', 'hex'),
    mixHash:          new Buffer('1400000000000000000000000000000000000000000000000000000000000000', 'hex'),
    nonce:            new Buffer('1500000000000000000000000000000000000000000000000000000000000000', 'hex'),
  }

  before(() => {
    const testEthBlock = new EthBlockHeader(testData)
    testIpfsBlock = new IpfsBlock(dagEthBlock.util.serialize(testEthBlock))
  })

  it('multicodec is eth-block', () => {
    expect(resolver.multicodec).to.equal('eth-block')
  })

  describe('eth-block paths', () => {
    
    describe('resolver.resolve', () => {
      
      it('path within scope', () => {
        const result = resolver.resolve(testIpfsBlock, 'number')
        expect(result.value.toString('hex')).to.equal(testData.number.toString('hex'))
      })

      describe.skip('path outside scope')

    })

    it('resolver.tree', () => {
      const paths = resolver.tree(testIpfsBlock)
      expect(Array.isArray(paths)).to.eql(true)
    })

  })
})
