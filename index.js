// In Node js
// require()

// In front-end Javascript you can't use require()
// import

import { ethers } from './ethers-5.6.esm.min.js'
import { abi, contractAddress } from './constants.js'

const connect = async () => {
  if (typeof window.ethereum !== 'undefined') {
    const wallet = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    console.log(`Connected with address ${wallet[0]}`)
    document.getElementById('connectButton').innerHTML = 'Connected!'
  } else {
    console.log('No Metamask!')
    document.getElementById('connectButton').innerHTML =
      'Please install Metamask'
  }
}

// fund function

const fund = async () => {
  const ethAmount = document.querySelector('#ethAmount').value
  console.log(`Funding with ${ethAmount}`)
  if (typeof window.ethereum !== 'undefined') {
    // provider -> connection to the blockchain
    // signer -> wallet -> someone with gas
    // contract that we are interacting with -> ABI & Address
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    console.log(signer)
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      await listenForTransactionMine(transactionResponse, provider)
      console.log('Done!')
    } catch (e) {
      console.log(e)
    }
  } else {
    console.log('No Metamask!')
    document.getElementById('connectButton').innerHTML =
      'Please install Metamask'
  }
}

const listenForTransactionMine = (transactionResponse, provider) => {
  console.log(`Mining ${transactionResponse.hash}...`)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      )
      resolve()
    })
  })
}

const getBalance = async () => {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(
      `The fund contract contains ${ethers.utils.formatEther(balance)}`
    )
  }
}

// withdraw function

const withdraw = async () => {
  console.log(`Withdrawing...`)
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse, provider)
    } catch (e) {
      console.log(e)
    }
  } else {
    withdrawButton.innerHTML = 'Please install MetaMask'
  }
}

const connectButton = document.querySelector('#connectButton')
connectButton.onclick = connect
const fundButton = document.querySelector('#fundButton')
fundButton.onclick = fund
const balanceButton = document.querySelector('#balanceButton')
balanceButton.onclick = getBalance
const withdrawButton = document.querySelector('#withdrawButton')
withdrawButton.onclick = withdraw
