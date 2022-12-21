import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")

connectButton.onclick = connect
fundButton.onclick = fund

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
    const ethAmount = "0.1"
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
            const transaction = await contract.fund({ value: ethers.utils.parseEther(ethAmount) })
        } catch (error) {
            console.log(error)
        }
    }
}
