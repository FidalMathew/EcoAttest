async function main() {
  // Define the contract address and ABI
  const contractAddress = "0x33Aace9A6AE283939b423e97F1f015A182dbCe92";
  const EcoAttest = await ethers.getContractFactory("EcoAttest");

  // Attach to the deployed contract
  const ecoAttest = await EcoAttest.attach(contractAddress);

  // Example: Adding an organization
  const tx1 = await ecoAttest.addOrganization(
    "Eco Organization",
    "0xecC6E5aA22E2Bb7aDD9296e5E7113E1A44C4D736",
    "https://example.com/image.png"
  );
  await tx1.wait();
  console.log("Organization added successfully.");

  // Example: Verifying an organization
  const tx2 = await ecoAttest.verifyOrganization(
    "0xecC6E5aA22E2Bb7aDD9296e5E7113E1A44C4D736"
  );
  await tx2.wait();
  console.log("Organization verified successfully.");

  // Example: Fetching an organization by address
  const organization = await ecoAttest.getOrganizationByAddress(
    "0xecC6E5aA22E2Bb7aDD9296e5E7113E1A44C4D736"
  );
  console.log("Organization Details:", organization);

  // Example: Fetching all organizations
  const organizations = await ecoAttest.getAllOrganizations();
  console.log("All Organizations:", organizations);

  // Example: Creating an event
  const tx3 = await ecoAttest.createEvent(
    "Eco Event",
    100, // Maximum seats
    Math.floor(Date.now() / 1000) + 86400 // Event date/time as Unix timestamp (e.g., 1 day from now)
  );
  await tx3.wait();
  console.log("Event created successfully.");

  // Example: Fetching an event
  const event = await ecoAttest.events(1); // Assuming event ID is 1
  console.log("Event Details:", event);
}

// Run the script with proper error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
