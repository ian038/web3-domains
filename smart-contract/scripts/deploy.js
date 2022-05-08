const hre = require("hardhat");

async function main() {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const Domains = await hre.ethers.getContractFactory("Domains");
  const domains = await Domains.deploy();

  await domains.deployed();

  console.log("Domains deployed to:", domains.address);
  console.log("Domains deployed by:", owner.address);

  const txn = await domains.register('abc')
  await txn.wait()

  const domainOwner = await domains.getAddress('abc')
  console.log('Domain owner is:', domainOwner)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
