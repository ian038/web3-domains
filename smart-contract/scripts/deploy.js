const hre = require("hardhat");

async function main() {
  const Domains = await hre.ethers.getContractFactory("Domains");
  const domains = await Domains.deploy('spartan');

  await domains.deployed();
  console.log("Domains deployed to:", domains.address);

  let txn = await domains.register('silent', { value: hre.ethers.utils.parseEther('0.2') })
  await txn.wait()
  console.log("Minted domain silent.spartan");

  txn = await domains.setRecord("silent", "https://ianphuadev.web.app/");
  await txn.wait();
  console.log("Set record for silent.spartan");

  const address = await domains.getAddress("silent");
  console.log("Owner of domain silent:", address);

  const balance = await hre.ethers.provider.getBalance(domains.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
