const { ethers, artifacts } = require("hardhat");
const path = require("path");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy Token contract
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy("MyToken", "MTK", 10000);
  await token.deployed();

  console.log("Token address:", token.address);

  // Deploy Factory contract
  const Factory = await ethers.getContractFactory("Factory");
  const factory = await Factory.deploy();
  await factory.deployed();

  console.log("Factory address:", factory.address);

  // Deploy Marketplace contract
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy();
  await marketplace.deployed();

  console.log("Token address:", token.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles({ Token: token.address, Factory: factory.address, Marketplace: marketplace.address });
}

function saveFrontendFiles(addresses) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "front", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify(addresses, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("Token");
  const FactoryArtifact = artifacts.readArtifactSync("Factory");
  const MarketplaceArtifact = artifacts.readArtifactSync("Marketplace");

  fs.writeFileSync(
    path.join(contractsDir, "Token.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );

  fs.writeFileSync(
    path.join(contractsDir, "Factory.json"),
    JSON.stringify(FactoryArtifact, null, 2)
  );

  fs.writeFileSync(
    path.join(contractsDir, "Market.json"),
    JSON.stringify(MarketplaceArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
