const { ethers } = require("hardhat");

async function main() {
  const [signer0] = await ethers.getSigners();

  console.log(signer0.address, "signer0");
  // Define the contract address and ABI
  const contractAddress = "0xe3fc547ba753f2Ce611cf3CD6b8C5861911aE44c";
  const EcoAttest = await ethers.getContractFactory("EcoAttest");

  // Attach to the deployed contract
  const ecoAttest = EcoAttest.attach(contractAddress);

  // // Example: Adding an organization
  // const tx1 = await ecoAttest.addOrganization(
  //   "Eco Organization",
  //   "ecoorganizer@eco.com",
  //   "https://example.com/image.png"
  // );
  // await tx1.wait();
  // console.log("Organization added successfully.");

  // const og = await ecoAttest.getOrganizationByAddress(
  //   "0x4c15a97eABF9CA6bAc35cb91543bD3C010f0ef9C"
  // );

  // // console.log(og);
  // // Example: Verifying an organization
  // const tx2 = await ecoAttest.verifyOrganization(
  //   "0x4c15a97eABF9CA6bAc35cb91543bD3C010f0ef9C"
  // );
  // await tx2.wait();
  // console.log("Organization verified successfully.");

  // const c = await ecoAttest.isOrganizer(
  //   "0x87cd12be2cf76239294D97Ea4978Ee9cC19Fd283"
  // );

  // console.log(c);

  // const ss = await ecoAttest.addSubOrganizer(
  //   "0x45B5175beB39B86609c9e0e7E5A7E5B0f1d65115"
  // );
  // await ss.wait();
  // console.log("Suborganiser added successfully.");

  // const v = await ecoAttest.isSubOrganizer(
  //   "0x45B5175beB39B86609c9e0e7E5A7E5B0f1d65115"
  // );

  // console.log(v, " sad");

  // // Example: Fetching an organization by address
  // const organization = await ecoAttest.getOrganizationByAddress(
  //   "0xecC6E5aA22E2Bb7aDD9296e5E7113E1A44C4D736"
  // );
  // console.log("Organization Details:", organization);

  // Example: Fetching all organizations
  // const organizations = await ecoAttest.getAllOrganizations();
  // console.log("All Organizations:", organizations);

  // // Example: Creating an event
  // const tx3 = await ecoAttest.createEvent(
  //   "Eco Event",
  //   100, // Maximum seats
  //   Math.floor(Date.now() / 1000) + 86400 // Event date/time as Unix timestamp (e.g., 1 day from now)
  // );
  // await tx3.wait();
  // console.log("Event created successfully.");

  // // Example: Fetching an event
  const event = await ecoAttest.getEventById(1); // Assuming event ID is 1
  console.log("Event Details:", event);
}

// Run the script with proper error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
