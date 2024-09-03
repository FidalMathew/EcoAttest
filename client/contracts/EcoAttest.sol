// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract EcoAttest {
    address public owner;

    struct Organization {
        bool verified;
        string name;
        address orgAddress;
        address[] subOrganizers; // List of sub-organizers
        string imageUrl; // URL or IPFS hash of the organization's image
    }

    struct Participant {
        address user;
        string name;
        string photo;
    }

    struct Event {
        string eventName;
        uint256 maxSeats;
        uint256 registeredSeats;
        address organizer;
        bool isActive;
        uint256 dateTime; // Date and time represented as a Unix timestamp
        Participant[] participants;
    }

    mapping(address => Organization) public organizations;
    mapping(uint256 => Event) public events;
    uint256 public eventCount;
    Organization[] public organizationList; // Array of Organization structs
    mapping(address => address) subOrgToOrgAddress;

    event OrganizationAdded(address indexed orgAddress, string name);
    event OrganizationVerified(address indexed orgAddress);
    event SubOrganizerVerified(
        address indexed orgAddress,
        address indexed subOrgAddress
    );
    event EventCreated(
        uint256 indexed eventId,
        string eventName,
        uint256 maxSeats,
        uint256 dateTime,
        address indexed organizer
    );
    event ParticipantRegistered(
        uint256 indexed eventId,
        address indexed participant,
        string name
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    modifier onlyVerifiedOrganization() {
        require(
            organizations[msg.sender].verified,
            "Caller is not a verified organization"
        );
        _;
    }

    modifier onlyOrganizerOrSubOrganizer(address _orgAddress) {
        require(
            msg.sender == organizations[_orgAddress].orgAddress ||
                isSubOrganizer(msg.sender),
            "Caller is not the organizer or a sub-organizer"
        );
        _;
    }

    constructor() {
        owner = msg.sender; // Set the contract deployer as the owner
    }

    function getAllOrganizations() public view returns (Organization[] memory) {
        return organizationList;
    }

    function getOrganizationByAddress(
        address _orgAddress
    ) public view returns (Organization memory) {
        require(
            organizations[_orgAddress].orgAddress != address(0),
            "Organization not found"
        );
        return organizations[_orgAddress];
    }

    function addOrganization(
        string memory _name,
        string memory _imageUrl
    ) public {
        Organization memory newOrganization = Organization({
            verified: false, // Organizations start as unverified
            name: _name,
            orgAddress: msg.sender,
            subOrganizers: new address[](0), // Initialize empty sub-organizers list
            imageUrl: _imageUrl // Set the image URL
        });

        organizations[msg.sender] = newOrganization;
        organizationList.push(newOrganization); // Store the organization in the array

        emit OrganizationAdded(msg.sender, _name);
    }

    function verifyOrganization(address _orgAddress) public onlyOwner {
        organizations[_orgAddress].verified = true;

        // Update the organization in the array
        for (uint256 i = 0; i < organizationList.length; i++) {
            if (organizationList[i].orgAddress == _orgAddress) {
                organizationList[i].verified = true;
                break;
            }
        }

        emit OrganizationVerified(_orgAddress);
    }

    function isOrganizer() public view returns (bool) {
        // Check if msg.sender is associated with any organization
        return organizations[msg.sender].orgAddress != address(0);
    }

    function addSubOrganizer(
        address _subOrgAddress
    ) public onlyVerifiedOrganization {
        require(_subOrgAddress != address(0), "Invalid sub-organizer address");

        organizations[msg.sender].subOrganizers.push(_subOrgAddress);
        subOrgToOrgAddress[_subOrgAddress] = organizations[msg.sender]
            .orgAddress;

        // Update the organization in the array
        for (uint256 i = 0; i < organizationList.length; i++) {
            if (organizationList[i].orgAddress == msg.sender) {
                organizationList[i].subOrganizers.push(_subOrgAddress);
                break;
            }
        }
    }

    function verifySubOrganizer(
        address _orgAddress,
        address _subOrgAddress
    ) public onlyOwner {
        require(
            organizations[_orgAddress].verified,
            "Organization must be verified"
        );
        require(isSubOrganizer(_subOrgAddress), "Not a valid sub-organizer");

        emit SubOrganizerVerified(_orgAddress, _subOrgAddress);
    }

    function createEvent(
        string memory _eventName,
        uint256 _maxSeats,
        uint256 _dateTime
    ) public onlyOrganizerOrSubOrganizer(msg.sender) {
        require(_maxSeats > 0, "Maximum seats must be greater than zero");
        require(
            _dateTime > block.timestamp,
            "Event date and time must be in the future"
        );

        eventCount++;
        Event storage newEvent = events[eventCount];
        newEvent.eventName = _eventName;
        newEvent.maxSeats = _maxSeats;
        newEvent.registeredSeats = 0;
        newEvent.organizer = msg.sender;
        newEvent.isActive = true;
        newEvent.dateTime = _dateTime;
        // No need to initialize participants array; it's already done by default

        emit EventCreated(
            eventCount,
            _eventName,
            _maxSeats,
            _dateTime,
            msg.sender
        );
    }

    function registerForEvent(
        uint256 _eventId,
        string memory _participantName,
        string memory _photo
    ) public {
        Event storage eventToAttend = events[_eventId];
        require(eventToAttend.isActive, "Event is not active");
        require(
            eventToAttend.registeredSeats < eventToAttend.maxSeats,
            "No available seats"
        );
        require(
            block.timestamp < eventToAttend.dateTime,
            "Event has already occurred"
        );

        Participant memory newParticipant = Participant({
            user: msg.sender,
            name: _participantName,
            photo: _photo
        });

        eventToAttend.participants.push(newParticipant);
        eventToAttend.registeredSeats++;

        emit ParticipantRegistered(_eventId, msg.sender, _participantName);
    }

    function isSubOrganizer(address _subAddress) public view returns (bool) {
        // Check if msg.sender is a sub-organizer of any organization
        return subOrgToOrgAddress[_subAddress] != address(0);
    }

    function getOrgAddressFromSub() public view returns (address) {
        // Retrieve the organization address associated with msg.sender
        address orgAddress = subOrgToOrgAddress[msg.sender];
        require(
            orgAddress != address(0),
            "msg.sender is not a sub-organizer of any organization"
        );
        return orgAddress;
    }
}
