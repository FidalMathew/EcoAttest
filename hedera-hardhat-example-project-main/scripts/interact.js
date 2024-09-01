async function main() {
  const contractAddress = "0xcDb92Efa941b936fFEeA2Dc69dF624F27E4ed9A5";
  const Greeter = await ethers.getContractFactory("Greeter");
  const greeter = await Greeter.attach(contractAddress);

  // Call the greet function
  let greeting = await greeter.greet();
  console.log("Current Greeting:", greeting);

  // Call the setGreeting function
  let tx = await greeter.setGreeting("Hi there!");
  await tx.wait();

  // Call the greet function again to see the new greeting
  greeting = await greeter.greet();
  console.log("New Greeting:", greeting);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
