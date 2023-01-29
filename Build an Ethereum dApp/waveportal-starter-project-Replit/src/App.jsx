import React, { useEffect , useState } from "react"
import { ethers } from "ethers"
import "./App.css"
import abi from "./utils/WavePortal.json"

// checkIfWalletIsConnected(). I'll leave it to you to figure it out. Remember, we want to call it when we know for sure we have a connected + authorized account!

const getEthereumObject = () => window.ethereum

const App = () => {
 const [currentAccount , setCurrentAccount] = useState("")
  /* All state property to store all waves */
  // here below line is in array from so we can retrive data later
  const [allWaves, setAllWaves] = useState([]);    
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  // const contractAddress = "0xc65AB016b27F21650368f9f8b2Dd8463BEA173e1"
  // const contractAddress = "0x1F11b461cac53E9A51024BeBe80D9c47d104bc50"
  // const contractAddress = "0x5DB49d29231ACeA4C05E5d59911280D4632829a9"
  const contractAddress = "0x4e62AE67b0AA9c1A8A33013AEC9623F7A980ee80"
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
        // let wavesCleaned = []
        // waves.forEach(wave => {
        //   wavesCleaned.push({
        //     address: wave.waver,
        //     timestamp: new Date(wave.timestamp * 1000),
        //     message: wave.message
        //   })
        // })
        const wavesCleaned = waves.map(wave => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          }
        })
        
        // store our data in react state
        setAllWaves(wavesCleaned.reverse())
        
      } else {
        console.log("Ethereum Object dosen't exist!")
      }
    } catch (error) {
      console.error(error)      
    }
  }

  const checkIfWalletIsConnected  = async () => {
    try {
      const { ethereum } = window;

      /*
      * First make sure we have access to the Ethereum object.
      */
      if(!ethereum) {
        console.log("Make Sure you have MetaMask account")
        return 
      } else {        
        console.log("We have the Ethereum Object", ethereum)
      }
      
      const accounts = await ethereum.request({method : "eth_accounts"})
      
      if(accounts.length !== 0) {
        const account = accounts[0]
        console.log("Found an authorized account:" , account)
        setCurrentAccount(account)
        getAllWaves()

      } else{
        console.error("No authorized account found")
      }
    }
    catch(error){
      console.log(error)
    }
 }

   

  const connectWallet = async () => {
    try {
      const { ethereum } = window
      
      if(!ethereum){
        alert("Get MetaMask!")
        return
      }
      const accounts = await ethereum.request({
        method:"eth_requestAccounts"
      }) 
      console.log("Connected", accounts[0])
      setCurrentAccount(accounts[0])
      getAllWaves()


    } catch(error){
      console.error(error)
    }
  }


  const wave = async () => {
    // taking text from textarea for wave
    const text = document.getElementById("text").value
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
        // we add gas limit as if when code has to use gas more than estimated by metamask it dosent cancel
        const waveTxn = await wavePortalContract.wave(text, {gasLimit: 300000})
        console.log("Mining...", waveTxn.hash)

        await waveTxn.wait()
        console.log("Mined -- ", waveTxn.hash)
        
        count = await wavePortalContract.getTotalWaves()
        console.log("Retrived total wave count...", count.toNumber())
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

  /**
 * Listen in for emitter events!
 */
  useEffect(() => {
  checkIfWalletIsConnected()
    // let wavePortalContract;
    
    // const onNewWave = (from, timestamp, message) => {
    //   console.log("NewWave", from, timestamp, message)
    //   setAllWaves(prevState => [
    //     ...prevState,
    //     {
    //     address: from,
    //     timestamp: new Date(timestamp * 1000),
    //     message: message,
    //     }
    //   ])
    // }

    // if (window.ethereum) {
    //   const provider = new ethers.providers.Web3Provider(window.ethereum)
    //   const signer = provider.getSigner()

    //   wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)
    //   wavePortalContract.on("NewWave", onNewWave)
    // }
    // return () => {
    //   if (wavePortalContract) {
    //     wavePortalContract.off("NewWave", onNewWave)
    //   }
    // }   
  },[])
  
  


  return (
    <div className="mainContainer">
      <div className ="dataContainer"> 
        <div className="header" >
          My First DApp 🔥
        </div>  
        
        <div className="bio">
           I am Gunjan Surti and Connect your Ethereum wallet and wave at me!
        </div>
        <div>
          <form>
            <lable className="bio" > Write any thing you love to do!</lable>
            <textarea class="txar" rows="4" cols="50" id="text"> </textarea>  
          </form>
        </div>
        
        <button className="waveButton"  onClick={wave}>
        Wave At Me
        </button>
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>      
        )}

        
        {allWaves.map((wave, index) => {
  // basically we go through all waves and creates new divs for every single wave and show     that data on screen
      // key ={index} is used to give index to message(each div)
      return(
        <div key={index} style={{backgroundColor: "OldLace", marginTop: "16px", padding: "8px"}}>
           <table>
             <tr>
               <td>
                <em> {index + 1}.</em>
             </td>
             </tr>
              <tr>
                <td>Message:</td> 
                <td>{wave.message}</td>
              </tr>
              <tr>
                <td>From:</td> 
                <td>{wave.address}</td>
              </tr>
              <tr>
                <td>Time:</td> 
                <td>{wave.timestamp.toString().slice(0,25)}</td>
              </tr>
  
            </table>
          </div>)
        })}
      </div>
    </div>
  ) 
}

export default App



// <div>Message: {wave.message}</div>
//         <div>From: {wave.address}</div>
//         <div>Time: {wave.timestamp.toString().slice(0,25)}</div>


/*
 * This function returns the first linked account found.
 * If there is no account linked, it will return null.
 */
// const findMetaMaskAccount = async () => {
//   try {
//     const ethereum = getEthereumObject()
//     /*
//     * First make sure we have access to the Ethereum object.
//     */
//     if(!ethereum) {
//       console.log("Make Sure you have MetaMask account")
//       return null
//     }
//     console.log("We have the Ethereum Object", ethereum)
//     const accounts = await ethereum.request({method : "eth_accounts"})
    
//     if(accounts.length !==0) {
//       const account = accounts[0]
//       console.log("Found an authorized account:" , account)
      
//       return account
//     } else{
//       console.error("No authorized account found")
//       return null
//     }
//   }
//   catch(error){
//     console.error(error)
//     return null
//   }
// }
