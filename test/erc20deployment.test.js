const { expect } = require("chai");

describe("Factory", function () {
  let Token;
  let Factory;
  let token;
  let factory;
  let owner;
  let recipient;
  const initialSupply = ethers.utils.parseEther("1000000");

  beforeEach(async function () {
    [owner, recipient] = await ethers.getSigners();

    // Deploy Token contract
    Token = await ethers.getContractFactory("Token");
    token = await Token.connect(owner).deploy("MyToken", "MTK", initialSupply);

    // Deploy Factory contract
    Factory = await ethers.getContractFactory("Factory");
    factory = await Factory.connect(owner).deploy();
    console.log("Factory address: ", factory.address);
    console.log("-------------------------------------------")
  });

  it("Should deploy Factory and create a new Token", async function () {
    // Deploy a new Token using the Factory
    await factory.deployToken("NewToken", "NTK", initialSupply);

    // Retrieve the deployed Token address from the Factory
    const deployedTokenAddress = await factory.tokens(0);

    // Connect to the deployed Token contract
    const deployedToken = Token.attach(deployedTokenAddress);

    console.log("Token address: ", deployedToken.address);
    console.log("Token name: ", await deployedToken.name());
    console.log("Token symbol: ", await deployedToken.symbol());
    console.log("Token total supply: ", (await deployedToken.totalSupply()).toString());
    console.log("Token balance of owner: ", (await deployedToken.balanceOf(owner.address)).toString());
    console.log("-------------------------------------------")

    // Check whether the Token was deployed successfully
    expect(await deployedToken.name()).to.equal("NewToken");
    expect(await deployedToken.symbol()).to.equal("NTK");
    expect((await deployedToken.totalSupply()).toString()).to.equal(initialSupply.toString());
    expect((await deployedToken.balanceOf(owner.address)).toString()).to.equal(initialSupply.toString());
  });

  it("Should transfer tokens from owner to recipient", async function () {
    // Deploy a new Token using the Factory
    await factory.deployToken("TransferToken", "TTK", initialSupply);

    // Retrieve the deployed Token address from the Factory
    console.log(await factory.tokens(0));
    const deployedTokenAddress = await factory.tokens(0);

    // Connect to the deployed Token contract
    const deployedToken = Token.attach(deployedTokenAddress);

    // Transfer tokens from the owner to the recipient
    const transferAmount = ethers.utils.parseEther("100");
    await deployedToken.connect(owner).transferTokens(recipient.address, transferAmount);

    // Check if the tokens are transferred successfully
    console.log("Token address: ", deployedToken.address);
    console.log("Token name: ", await deployedToken.name());
    console.log("Token symbol: ", await deployedToken.symbol());
    console.log("Token total supply: ", (await deployedToken.totalSupply()).toString());
    console.log("Token balance of owner: ", (await deployedToken.balanceOf(owner.address)).toString());

    expect((await deployedToken.balanceOf(owner.address)).toString()).to.equal(initialSupply.sub(transferAmount).toString());
    expect((await deployedToken.balanceOf(recipient.address)).toString()).to.equal(transferAmount.toString());
  });
});
