import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
const ownerButton = document.getElementById("ownerButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
ownerButton.onclick = getOwner

async function connect() {
    // We are checking if there is MetaMask extension installed in our browser.
    if (typeof window.ethereum !== "undefined") {
        // Connecting MetaMask
        console.log("I see a metamask!")
        await window.ethereum.request({ method: "eth_requestAccounts" })
        // Changing state and name of our button
        connectButton.innerHTML = "Connected"
        console.log("Connected!")
    } else {
        console.log("No MetaMask Detected...")
        connectButton.innerHTML = "Please Install MetaMask"
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        // provider -> connection to the blockchain
        // signer -> wallet with some gas
        // contract that we are interacting with
        // ABI && Address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // Adding our wallet as signer
        const signer = provider.getSigner()
        const wallet = await signer.getAddress()
        console.log(`You are connected as: ${wallet}`)
        // Adding contract
        const contract = new ethers.Contract(contractAddress, abi, signer)
        // Performing Transaction Plus Adding Error Handling
        try {
            const transactionResponse = await contract.fund({ value: ethers.utils.parseEther(ethAmount) })
            // Listen for the tx to be mined
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Transaction Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("Withdrawing Funds...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const withdrawTransaction = await contract.withdraw()
            await listenForTransactionMine(withdrawTransaction, provider)
            console.log("Funds Successfully Withdrawn!")
        } catch (error) {
            console.log(error)
        }
    }
}

async function getOwner() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        const getOwner = await contract.getOwner()
        console.log(`Owner Of Contract Is: ${getOwner}`)
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    // Waiting for listener for it's listening
    // Promise is taking whole function as parameter
    return new Promise((resolve, reject) => {
        // Create listener for blockchain
        // First argument is "eventName" and second one is "listener", which for our case will be anonymous function, so () => {}
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
            resolve()
        })
    })
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        const formattedBalance = ethers.utils.formatEther(balance)
        console.log(`Current Contract Balance Is: ${formattedBalance}`)
    }
}
