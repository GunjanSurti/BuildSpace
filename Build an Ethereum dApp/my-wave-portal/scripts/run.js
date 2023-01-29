const main = async () => {
  // const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();

  console.log("Contract Deployed to :", waveContract.address);
  // console.log("Contract Deployed by :", owner.address);
  // console.log("Contract Deployed by :", randomPerson.address);

  // await waveContract.getTotalWaves();

  /** get Contract Balance */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract Balance: ",
    hre.ethers.utils.formatEther(contractBalance)
  );
  //    hre.ethers.utils.formatEther(contractBalance) gives monet in form ether if not done then it returns in gwei or something...

  // let's send a few waves!
  const firstWaveTxn = await waveContract.wave("Hello Gunjan!");
  await firstWaveTxn.wait(); // wait for the transaction to be mined

  const secondWaveTxn = await waveContract.wave("Hello Surti");
  await secondWaveTxn.wait();

  // await waveContract.getTotalWaves();

  // const secondWaveTxn = await waveContract
  //   .connect(randomPerson)
  //   .wave("Hello Soham!");
  // await secondWaveTxn.wait();

  // await waveContract.getTotalWaves();

  /**
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);

  console.log(
    "Contract Balance After deployment: ",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
runMain();

//We're going to first work in "run.js". Remember, run.js is like our "testing grounds" where we want to make sure our contracts core functionality works before we go and deploy it. It's really hard to debug contract code and frontend code at the same time, so, we separate it out!

//The magic is on hre.ethers.utils.parseEther("0.1"),. This is where I say, "go and deploy my contract and fund it with 0.1 ETH". This will remove ETH from my wallet, and use it to fund the contract.

//I then do hre.ethers.utils.formatEther(contractBalance) to test out to see if my contract actually has a balance of 0.1. I use a function that ethers gives me here called getBalance and pass it my contract's address!

// But then, we also want to see if when we call wave if 0.0001 ETH is properly removed from the contract!! That's why I print the balance out again after I call wave.
