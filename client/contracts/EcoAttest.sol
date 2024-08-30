// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EcoAttest {

    address public owner;

    struct Organization {
        bool verified;  
        string name;    
        address orgAddress; 
        uint256 reputationScore; // Reputation score based on participant feedback
    }

    struct Event {
        string eventName;
        uint256 maxSeats;
        uint256 registeredSeats;
        address organizer;
        bool isActive;
        uint256 dateTime;  // Date and time represented as a Unix timestamp
    }

    mapping(address => Organization) public organizations;
    mapping(uint256 => Event) public events;
    uint256 public eventCount;

    event OrganizationAdded(address indexed orgAddress, string name);
    event OrganizationVerified(address indexed orgAddress);
    event EventCreated(uint256 indexed eventId, string eventName, uint256 maxSeats, uint256 dateTime, address indexed organizer);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    modifier onlyVerifiedOrganization() {
        require(organizations[msg.sender].verified, "Caller is not a verified organization");
        _;
    }

    constructor() {
        owner = msg.sender; // Set the contract deployer as the owner
    }

    function addOrganization(string memory _name, address _orgAddress) public {
        organizations[_orgAddress] = Organization({
            verified: false,  // Organizations start as unverified
            name: _name,
            orgAddress: _orgAddress,
            reputationScore: 0  // Initial reputation score
        });

        emit OrganizationAdded(_orgAddress, _name);
    }

    function verifyOrganization(address _orgAddress) public onlyOwner {
        organizations[_orgAddress].verified = true;
        emit OrganizationVerified(_orgAddress);
    }

    function createEvent(string memory _eventName, uint256 _maxSeats, uint256 _dateTime) public onlyVerifiedOrganization {
        require(_maxSeats > 0, "Maximum seats must be greater than zero");
        require(_dateTime > block.timestamp, "Event date and time must be in the future");

        eventCount++;
        events[eventCount] = Event({
            eventName: _eventName,
            maxSeats: _maxSeats,
            registeredSeats: 0,
            organizer: msg.sender,
            isActive: true,
            dateTime: _dateTime
        });

        emit EventCreated(eventCount, _eventName, _maxSeats, _dateTime, msg.sender);
    }

    // Additional functions can be added here to manage events (e.g., registration, cancellation)
}
