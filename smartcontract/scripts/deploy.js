// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {


  const retailerContract = await hre.ethers.deployContract("Retailer");
  await retailerContract.waitForDeployment();

  console.log(
   "Retailer Contract Address:",
    retailerContract.target
  );

  // sleep for 10 seconds
  await new Promise(r => setTimeout(r, 10000));

  const retailerAddress = retailerContract.target;

  //verify contract
  await hre.run("verify:verify", {
    address: retailerAddress,
    constructorArguments: [],
  });

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
