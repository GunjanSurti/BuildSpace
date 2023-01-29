const main = async () => {
  // const [deployer] = await hre.ethers.getSigners();
  // const accountBalance = await deployer.getBalance();

  // console.log("Deploying contract with account", deployer.address);
  // console.log("Account Balance", accountBalance.toString());

  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });

  await waveContract.deployed();
  // And I also added await waveContract.deployed() to make it easy for me to know when it's deployed!

  // below address is to use in our frond end as it the address where our contract is located
  // so we need to change the address of contract in our frontend and change abi also
  console.log("Wave Portal address : ", waveContract.address);
  // this tells us the fund of contract for now 0.1 Eth (goerli)
  // console.log(
  //   (contractBalance = await hre.ethers.provider.getBalance(
  //     waveContract.address
  //   ))
  // );
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
