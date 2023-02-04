import React, {useEffect, useState} from 'react';
import ReactDOM from "react-dom"
import './styles/App.css';
import { ethers } from "ethers"
import twitterLogo from './assets/twitter-logo.svg';
import myEpicNft from './utils/MyEpicNFT.json';

// Constants
const TWITTER_HANDLE = 'SurtiGunjan';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/squarenft-zzpfqgftdk';
const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = "0x7647253b8fb55a2Ae3A7f0e89cB5E99c55EaD5f3"

const App = () => {  
   //Just a state variable we use to store our user's public wallet. Don't forget to import useState.
    const [currentAccount, setCurrentAccount] = useState("");
  
  //   const { ethereum } = window
  // if (ethereum) {
  //       // Same stuff again
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const TokenContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
  //   let asd =  TokenContract.pickRandomFirstWord(24)
  //       console.log(asd)
  // }
  
    
  //Gotta make sure this is async.
    const checkIfWalletIsConnected = async () => {
      
      //First makesure we have access to window.ethereum
        const { ethereum } = window
    
        if(!ethereum) {
          console.log("Make sure you have MetaMask")
          return
        } else {
          console.log("We have Ethereum Object",ethereum)
        }
      
      //Check if we're authorized to access the user's wallet
         const accounts =  await ethereum.request({method: 'eth_accounts'})
         let chainId = await ethereum.request({ method: 'eth_chainId' });
         console.log("Connected to chain " + chainId);

          // String, hex code of the chainId of the Goerli test network
        const goerliChainId = "0x5"; 
        if (chainId !== goerliChainId) {
        	alert("You are not connected to the Goerli Test Network!");
        }
       
       //User can have multiple authorized accounts, we grab the first one if its there!
        if (accounts.length !== 0) {
          const account = accounts[0]
          console.log("Found an authorized account:", account)
          setCurrentAccount(account)
          // Setup listener! This is for the case where a user comes to our site
          // and ALREADY had their wallet connected + authorized.
          setupEventListener()
        } else {
          console.log("No Authorize account found")
        }
  }
// Implement your connectWallet method here

  const connectWallet = async () => {
    try {
      const { ethereum } = window
      if (!ethereum){
        console.log("Get MetaMask")
        return
      } 
      // fancy method to request access to account
      const accounts = await ethereum.request({method: "eth_requestAccounts"})

      // boom! this should print out public address once we authorize MetaMask
      console.log("Connected",accounts[0])
      setCurrentAccount(accounts[0])
      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener() 
    } catch (error){
      console.log(error)
    }
  }

   // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
             // ReactDOM.render(<h3 style={{color: "white"}}>{`${tokenId.toNumber()}/10 NFTs Minted so far!` } </h3>, document.getElementById("mNft"))
          
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
      
  const askContractToMintNft = async () =>{

    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer)

        console.log("Going to pop wallet now to pay gas...")
      let nftTxn = await connectedContract.makeAnEpicNFT();
        ReactDOM.render(<h3 style={{color : "white"}}>{"Wait for 15 sec..."}</h3>, document.getElementById("mNft"))
      console.log("Mining...please wait.")
      await nftTxn.wait();
      
      console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);
        
      } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
      limitReached()
    console.log(error)
  }
}
  
  const startMinting = () => (
    <h3 className="mintedNft">Start Minting NFTs</h3>
  )
  
  
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );
    const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint NFT
    </button>
  )
  // change link everytime when contract is deployed again
  const openSeaLink = () => (
              <> 
                <a href={OPENSEA_LINK}>
                    <button className="cta-button connect-wallet-button">
                      View OpenSea Collection  
                    </button>
                </a>
              </>
              )
  const nftLink = () => (
              <>
                <a href={`https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`}>
                  <button  className="cta-button connect-wallet-button">
                    Minted NFT Link 
                  </button>
                </a>
              </>
              )          
        
  const nothing = () => (
    <h3></h3>
  )

  const getTotalNFTsMintedSoFar = () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          if (tokenId.toNumber() <= 3){
            const show = (
              <>
                <h3 style={{color: "white"}}>{`${tokenId.toNumber()}/10 NFTs Minted so far!` } </h3>    
                <a href={`https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`}>
                  <button  className="cta-button connect-wallet-button">
                    Minted NFT Link 
                  </button>
                </a>
              </>
            )
               ReactDOM.render(show, document.getElementById("mNft"))
            
          } else {
            
            limitReached()
          }
          
        })

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
   const limitReached = () => {
     const lt = (<h3 className="mNft">{"❌Cannot Mint more, Limit Reached!!!"}</h3> )
     ReactDOM.render(lt, document.getElementById("mNft"))
     console.log("limit")
   }
  
  
  // This runs our function when the page loads.
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
//   Added a conditional render! We don't want to show Connect to Wallet if we're already connected :).

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? renderNotConnectedContainer(): renderMintUI()}
           
        </div>
        <div id="mNft" display="inline-block "></div>
        <div>
           {currentAccount === "" ?  startMinting() : getTotalNFTsMintedSoFar()}
        </div>
        <div className="nftLink"> 
        </div>
        <div className="openSealink"> 
          {currentAccount === "" ?  openSeaLink() : openSeaLink()}

        </div>
        
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

           // {currentAccount === "" ?  nothing() : nftLink()}
