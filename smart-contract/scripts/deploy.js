const hre = require("hardhat");

async function main() {
  const [owner, superCoder] = await hre.ethers.getSigners();
  const Domains = await hre.ethers.getContractFactory("Domains");
  const domains = await Domains.deploy('spartan');
  await domains.deployed();
  console.log("Domains deployed to:", domains.address);

  let txn = await domains.register('joking', { value: hre.ethers.utils.parseEther('0.1') })
  await txn.wait()

  txn = await domains.setRecord("joking", "https://joking.web.app/");
  await txn.wait();

  const balance = await hre.ethers.provider.getBalance(domains.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

  try {
    txn = await domains.connect(superCoder).withdraw();
    await txn.wait();
  } catch (error) {
    console.log("Could not rob contract");
  }

  let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log("Balance of owner before withdrawal:", hre.ethers.utils.formatEther(ownerBalance));

  txn = await domains.connect(owner).withdraw();
  await txn.wait();

  const contractBalance = await hre.ethers.provider.getBalance(domains.address);
  ownerBalance = await hre.ethers.provider.getBalance(owner.address);

  console.log("Contract balance after withdrawal:", hre.ethers.utils.formatEther(contractBalance));
  console.log("Balance of owner after withdrawal:", hre.ethers.utils.formatEther(ownerBalance));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
