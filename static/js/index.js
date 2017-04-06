'use strict'
var ethUtil = require('ethereumjs-util');
ethUtil.crypto = require('crypto');
ethUtil.scrypt = require('scryptsy');
ethUtil.Tx = require('ethereumjs-tx');
ethUtil.uuid = require('uuid');
var abi = require('ethereumjs-abi');
var BN = require('bn.js');
ethUtil.BN = BN;
ethUtil.abi = abi;
window.ethUtil = ethUtil;
var Wallet = require('./wallet.js');
window.Wallet = Wallet;
var BigNumber = require('bignumber.js');
window.BigNumber = BigNumber;
var metaMaskEnabled = false;
var Web3 = require('web3');
if (typeof web3 !== 'undefined') {
  // Web3 has been injected by the browser (Mist/MetaMask)
  console.log("Using metamask!!");
  web3 = new Web3(web3.currentProvider);
  window.metaMaskEnabled = true;
  window.web3 = web3;
} else {
  //console.log(web3);
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  var tWeb3 = new Web3(new Web3.providers.HttpProvider("http://88.99.173.109:8545"));
  window.metaMaskEnabled = false;
  window.web3 = tWeb3;
  console.log("MetaMask is not available!!");
}
var EtherWordChain = require('./wordchain.js');
window.EtherWordChain = EtherWordChain;
