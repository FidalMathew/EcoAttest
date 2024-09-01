// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract EcoAttest {
    address public owner;

    struct Organization {
        bool verified;
        string name;
        address orgAddress;
        uint256 reputationScore; // Reputation score based on participant feedback
        address[] subOrganizers; // List of sub-organizers
        string imageUrl; // URL or IPFS hash of the organization's image
    }

    struct Event {
        string eventName;
        uint256 maxSeats;
        uint256 registeredSeats;
        address organizer;
        bool isActive;
        uint256 dateTime; // Date and time represented as a Unix timestamp
    }

    mapping(address => Organization) public organizations;
    mapping(uint256 => Event) public events;
    uint256 public eventCount;
    Organization[] public organizationList; // Array of Organization structs

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
                isSubOrganizer(_orgAddress, msg.sender),
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

    function addOrganization(
        string memory _name,
        address _orgAddress,
        string memory _imageUrl
    ) public {
        Organization memory newOrganization = Organization({
            verified: false, // Organizations start as unverified
            name: _name,
            orgAddress: _orgAddress,
            reputationScore: 0, // Initial reputation score
            subOrganizers: new address[](0), // Initialize empty sub-organizers list
            imageUrl: _imageUrl // Set the image URL
        });

        organizations[_orgAddress] = newOrganization;
        organizationList.push(newOrganization); // Store the organization in the array

        emit OrganizationAdded(_orgAddress, _name);
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

    function addSubOrganizer(
        address _subOrgAddress
    ) public onlyVerifiedOrganization {
        require(_subOrgAddress != address(0), "Invalid sub-organizer address");
        organizations[msg.sender].subOrganizers.push(_subOrgAddress);

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
        require(
            isSubOrganizer(_orgAddress, _subOrgAddress),
            "Not a valid sub-organizer"
        );

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
        events[eventCount] = Event({
            eventName: _eventName,
            maxSeats: _maxSeats,
            registeredSeats: 0,
            organizer: msg.sender,
            isActive: true,
            dateTime: _dateTime
        });

        emit EventCreated(
            eventCount,
            _eventName,
            _maxSeats,
            _dateTime,
            msg.sender
        );
    }

    function isSubOrganizer(
        address _orgAddress,
        address _subOrgAddress
    ) internal view returns (bool) {
        address[] memory subOrganizers = organizations[_orgAddress]
            .subOrganizers;
        for (uint256 i = 0; i < subOrganizers.length; i++) {
            if (subOrganizers[i] == _subOrgAddress) {
                return true;
            }
        }
        return false;
    }
}
