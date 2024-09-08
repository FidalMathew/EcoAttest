const { ethers } = require("hardhat");

async function main() {
  const [signer0] = await ethers.getSigners();

  console.log(signer0.address, "signer0");
  // Define the contract address and ABI
  const contractAddress = "0xa11ff608DB42F526180543260d9eb135a3c30cFe";
  const EcoAttest = await ethers.getContractFactory("EcoAttest");

  // Attach to the deployed contract
  const ecoAttest = EcoAttest.attach(contractAddress);

  // // Example: Adding an organization / requesting to be an organisation
  // const tx1 = await ecoAttest.addOrganization(
  //   "Eco Organization",
  //   "ecoorganizer@eco.com",
  //   "https://example.com/image.png"
  // );
  // await tx1.wait();
  // console.log("Organization added successfully.");

  // const og = await ecoAttest.getOrganizationByAddress(
  //   "0xdd4dB825306bFEeC56Bb74dcC66FE30C300B6f5A"
  // );

  // const og = await ecoAttest.getAllOrganizations()

  // console.log(og);
  // Example: Verifying an organization
  // const tx2 = await ecoAttest.verifyOrganization(
  //   "0x4c15a97eABF9CA6bAc35cb91543bD3C010f0ef9C"
  // );
  // await tx2.wait();
  // console.log("Organization verified successfully.");

  // const c = await ecoAttest.isOrganizer(
  //   "0xdd4dB825306bFEeC56Bb74dcC66FE30C300B6f5A"
  // );

  // console.log(c);

  // const ss = await ecoAttest.addSubOrganizer(
  //   "0x7FdcE937855028606f8bd1C082F463fD92369cbf"
  // );
  // await ss.wait();
  // console.log("Suborganiser added successfully.");

  // const v = await ecoAttest.isSubOrganizer(
  //   "0x7FdcE937855028606f8bd1C082F463fD92369cbf"
  // );

  // console.log(v, " sad");

  const s = await ecoAttest.getOrgAddressFromSub();
  console.log(s, "Sads");

  // // Example: Fetching an organization by address
  // const organization = await ecoAttest.getOrganizationByAddress(
  //   "0xecC6E5aA22E2Bb7aDD9296e5E7113E1A44C4D736"
  // );
  // console.log("Organization Details:", organization);

  // Example: Fetching all organizations
  const organizations = await ecoAttest.getAllOrganizations();
  console.log("All Organizations:", organizations);

  // // Example: Creating an event
  // const tx3 = await ecoAttest.createEvent(
  //   "Eco Event",
  //   "bafybeigah35eq2w4hu3h7bots6w6sqso5y267ywxixotxi5456yzxze46y",
  //   "description",
  //   100,
  //   100, // Maximum seats
  //   Math.floor(Date.now() / 1000) + 86400 // Event date/time as Unix timestamp (e.g., 1 day from now)
  // );
  // await tx3.wait();
  // console.log("Event created successfully.");

  // // Example: Fetching an event
  // const event = await ecoAttest.getEventById(1); // Assuming event ID is 1
  // console.log("Event Details:", event);

  // const events = await ecoAttest.getAllEvents();

  // console.log(events, 'events')

  // const eventCount = await ecoAttest.events(1)

  // console.log(JSON.stringify(eventCount), 'event count')

  // const tx3 = await ecoAttest.createParticipant("jaydeep", "https://lh3.googleusercontent.com/a/ACg8ocKpFYfYlp22RpaC8jETUwDp3y7dXV6GWDMI0AIicTWbGSQphQk=s96-c")
  // await tx3.wait();
  // console.log("Participant added successfully.");

  // const register = await ecoAttest.registerForEvent(1);
  // await register.wait();

  // const partipant = await ecoAttest.participants("0xdd4dB825306bFEeC56Bb74dcC66FE30C300B6f5A");
  // console.log(JSON.stringify(partipant), 'participant')

  // const ispart = await ecoAttest.isParticipant("0xdd4dB825306bFEeC56Bb74dcC66FE30C300B6f5A")
  // console.log(ispart, 'ispart')

  // const allParticipants = await ecoAttest.fetchAllParticipants();
  // console.log(allParticipants, 'allParticipants')


  // const participant = await ecoAttest.getParticipantByAddress("0xdd4dB825306bFEeC56Bb74dcC66FE30C300B6f5A")
  // console.log(participant, 'participant')
  // const val = await ecoAttest.participants("0xdd4dB825306bFEeC56Bb74dcC66FE30C300B6f5A");
  // console.log(val, 'val')
}

// Run the script with proper error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
