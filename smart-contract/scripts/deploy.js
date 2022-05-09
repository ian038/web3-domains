const hre = require("hardhat");

async function main() {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const Domains = await hre.ethers.getContractFactory("Domains");
  const domains = await Domains.deploy('spartan');

  await domains.deployed();

  console.log("Domains deployed to:", domains.address);
  console.log("Domains deployed by:", owner.address);

  let txn = await domains.register('abc', { value: hre.ethers.utils.parseEther('10.0') })
  await txn.wait()

  const domainOwner = await domains.getAddress('abc')
  console.log('Domain owner is:', domainOwner)

  const balance = await hre.ethers.provider.getBalance(domains.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
