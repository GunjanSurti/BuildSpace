import React, { useEffect , useState } from "react"
import { ethers } from "ethers"
import "./App.css"

import abi from "./utils/WavePortal.json"

const getEthereumObject = () => window.ethereum

/*
 * This function returns the first linked account found.
 * If there is no account linked, it will return null.
 */
const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject()
    /*
    * First make sure we have access to the Ethereum object.
    */
    if(!ethereum) {
      console.log("Make Sure you have MetaMask account")
      return null
    }
    console.log("We have the Ethereum Object", ethereum)
    const accounts = await ethereum.request({method : "eth_accounts"})

    if(accounts.length !==0) {
      const account = accounts[0]
      console.log("Found an authorized account:" , account)
      return account
    } else{
      console.error("No authorized account found")
      return null
    }
  }
  catch(error){
    console.error(error)
    return null
  }
}

const App = () => {
 const [currentAccount , setCurrentAccount] = useState("")
  /* All state property to store all waves */
  const [allWaves, setAllWaves] = useState([]);    
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0xc65AB016b27F21650368f9f8b2Dd8463BEA173e1"
  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi
  
  /* create a method that gets all waves from your contract*/
  const getAllWaves = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)

        // call the getAllWaves method from your Smart Contract
        const waves = await wavePortalContract.getAllWaves()

        // we only need address , timestamp and message in our UI so Lets
        // pick those out
        let wavesCleaned = []
        waves.forEach(wave =>{
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          })
        })
        // store our data in react state
        setAllWaves(wavesCleaned)
        
      } else {
        console.log("Ethereum Object dosen't exist!")
      }
    } catch (error) {
      console.error(error)      
    }
  }
   getAllWaves()

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject()
      if(!ethereum){
        alert("Get MetaMask!")
        return
      }
      const accounts = await ethereum.request({
        method:"eth_requestAccounts"
      }) 
      console.log("Connected", accounts[0])
      setCurrentAccount(accounts[0])
    } catch(error){
      console.error(error)
    }
  }
  
  // function checkIfWalletIsConnected = async () => {
  //   if(connectWallect && )
  // }

  const wave = async () => {
    try {
      const { ethereum } = window
      
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()

         /*
        * You're using contractABI here
        */
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)
               
        let count = await wavePortalContract.getTotalWaves()
        console.log("Retrived total wave count...", count.toNumber())

        /*Execute the actual wave from your smart contract*/
        
        const waveTxn = await wavePortalContract.wave("Surti")
        console.log("Mining...", waveTxn.hash)

        await waveTxn.wait()
        console.log("Mined -- ", waveTxn.hash)
        getAllWaves()
        
      } else {
        console.log("Ethereum object dosen't exist!")
      }
    } catch (error) {
      console.error(error)
      
    }
  }
  /*
   * The passed callback function will be run when the page loads.
   * More technically, when the App component "mounts".
   */
  useEffect(async () => {
  const account = await findMetaMaskAccount()
     if (account !== null) {
       setCurrentAccount(account)
       
     }
   
  },[])

  return (
    <div className="MainContainer">
      <div className ="dataContainer"> 
        <div className="header" class="header">
          My First DApp 🔥
        </div>  
        
        <div className="bio">
           I am Gunjan Surti and Connect your Ethereum wallet and wave at me!
        </div>
        <div>
          <form>
            <input type="text" class="txbx"></input>  
          </form>
        </div>
        
        <button classsName="waveButton" class="wave"onClick={wave}>
        Wave At Me
        </button>
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>      
        )}

        
        {allWaves.map((wave, index) => {
// basically we go through all waves and creates new divs for every single wave and show that data on screen
      return(
        <div key={index} style={{backgroundColor: "OldLace", marginTop: "16px", padding: "8px"}}>
        <div>Message: {wave.message}</div>
        <div>From: {wave.address}</div>
        <div>Time: {wave.timestamp.toString().slice(0,25)}</div>
        </div>)
        })}
      </div>
    </div>
  ) 
}

export default App