const hre = require("hardhat");

async function main() {
  const Domains = await hre.ethers.getContractFactory("Domains");
  const domains = await Domains.deploy();

  await domains.deployed();

  console.log("Domains deployed to:", domains.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
