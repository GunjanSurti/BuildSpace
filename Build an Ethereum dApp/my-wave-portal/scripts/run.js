const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log("Contract Deployed to :", waveContract.address);
  console.log("Contract Deployed by :", owner.address);
  console.log("Contract Deployed by :", randomPerson.address);

  await waveContract.getTotalWaves();

  // let's send a few waves!
  const firstWaveTxn = await waveContract.wave("Hello Gunjan!");
  await firstWaveTxn.wait(); // wait for the transaction to be mined

  await waveContract.getTotalWaves();

  const secondWaveTxn = await waveContract
    .connect(randomPerson)
    .wave("Hello Soham!");
  await secondWaveTxn.wait();

  await waveContract.getTotalWaves();

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