const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNft");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();

  console.log("Contract Deployed to: ", nftContract.address);

  let txn = await nftContract.makeAnEpicNFT();
  await txn.wait();
  console.log("Nft 1 is Minted!");

  txn = await nftContract.makeAnEpicNFT();
  await txn.wait();
  console.log("2nd Nft Minted!");
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

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
