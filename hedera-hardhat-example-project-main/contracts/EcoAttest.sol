// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract EcoAttest {
    address public owner;

    struct Organization {
        bool verified;
        string name;
        string email;
        address orgAddress;
        Participant[] subOrganizers; // List of sub-organizers
        string imageUrl; // URL or IPFS hash of the organization's image
    }

    struct Participant {
        address user;
        string name;
        string photo;
        string programId;
    }

    struct Event {
        uint256 eventId;
        string eventName;
        string eventPhoto;
        string eventDesc;
        uint256 carbonCreds;
        uint256 maxSeats;
        uint256 registeredSeats;
        address organizer;
        bool isActive;
        uint256 dateTime; // Date and time represented as a Unix timestamp
        Participant[] participants;
    }

    mapping(address => Participant) public participants;
    mapping(address => Organization) public organizations;
    mapping(uint256 => Event) public events;
    uint256 public eventCount;
    Organization[] public organizationList; // Array of Organization structs
    mapping(address => address) subOrgToOrgAddress;
    Participant[] public participantsArray;

    event OrganizationAdded(address indexed orgAddress, string name);
    event OrganizationVerified(address indexed orgAddress);
    event SubOrganizerVerified(
        address indexed orgAddress,
        address indexed subOrgAddress
    );

    event ParticipantAdded(
        address indexed participantAddress,
        string participantName
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
        address indexed participant
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

    function createParticipant(
        string memory _participantName,
        string memory _photo
    ) public {
        // Participant memory newParticipant = Participant({
        //     user: msg.sender,
        //     name: _participantName,
        //     photo: _photo,
        //     programId: "",
        //     feedbackStoreIds: new string[](0)
        // });

        // participants[msg.sender] = newParticipant;

        Participant storage newParticipant = participants[msg.sender];

        newParticipant.user = msg.sender;
        newParticipant.name = _participantName;
        newParticipant.photo = _photo;
        newParticipant.programId = "";
        // newParticipant.feedbackStoreIds = new string[](0);
        // newParticipant.subOrganisersSeed = new address[](0);

        participantsArray.push(newParticipant);

        emit ParticipantAdded(msg.sender, _participantName);
    }

    function getParticipantByAddress(
        address user
    ) public view returns (Participant memory) {
        return participants[user];
    }

    function fetchAllParticipants() public view returns (Participant[] memory) {
        return participantsArray;
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
        string memory _email,
        string memory _imageUrl
    ) public {
        Organization storage newOrganization = organizations[msg.sender];
        newOrganization.verified = false;
        newOrganization.name = _name;
        newOrganization.email = _email;
        newOrganization.imageUrl = _imageUrl;
        newOrganization.orgAddress = msg.sender;

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

    function isOrganizer(address _org) public view returns (bool) {
        // Check if msg.sender is associated with any organization
        return organizations[_org].orgAddress != address(0);
    }

    function addSubOrganizer(
        address _subOrgAddress
    ) public onlyVerifiedOrganization {
        require(_subOrgAddress != address(0), "Invalid sub-organizer address");

        Participant memory pp = participants[_subOrgAddress];
        organizations[msg.sender].subOrganizers.push(pp);
        subOrgToOrgAddress[_subOrgAddress] = organizations[msg.sender]
            .orgAddress;

        // Update the organization in the array
        for (uint256 i = 0; i < organizationList.length; i++) {
            if (organizationList[i].orgAddress == msg.sender) {
                organizationList[i].subOrganizers.push(pp);
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
        string memory _eventPhoto,
        string memory _eventDesc,
        uint256 _carbonCreds,
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
        newEvent.eventId = eventCount;
        newEvent.eventName = _eventName;
        newEvent.maxSeats = _maxSeats;
        newEvent.registeredSeats = 0;
        newEvent.organizer = msg.sender;
        newEvent.isActive = true;
        newEvent.dateTime = _dateTime;
        newEvent.eventDesc = _eventDesc;
        newEvent.carbonCreds = _carbonCreds;
        newEvent.eventPhoto = _eventPhoto;
        // No need to initialize participants array; it's already done by default

        emit EventCreated(
            eventCount,
            _eventName,
            _maxSeats,
            _dateTime,
            msg.sender
        );
    }

    function registerForEvent(uint256 _eventId) public {
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

        Participant memory oldParticipant = participants[msg.sender];
        eventToAttend.participants.push(oldParticipant);
        eventToAttend.registeredSeats++;

        emit ParticipantRegistered(_eventId, msg.sender);
    }

    function isSubOrganizer(address _subAddress) public view returns (bool) {
        // Check if msg.sender is a sub-organizer of any organization
        return subOrgToOrgAddress[_subAddress] != address(0);
    }

    function isParticipant(address _partAddress) public view returns (bool) {
        // Check if msg.sender is a sub-organizer of any organization
        return participants[_partAddress].user != address(0);
    }

    function getOrgAddressFromSub(
        address _subAddress
    ) public view returns (address) {
        // Retrieve the organization address associated with msg.sender
        address orgAddress = subOrgToOrgAddress[_subAddress];
        require(
            orgAddress != address(0),
            "msg.sender is not a sub-organizer of any organization"
        );
        return orgAddress;
    }

    function getAllEvents() public view returns (Event[] memory) {
        // Create a temporary array to store all events
        Event[] memory allEvents = new Event[](eventCount);

        // Loop through the mapping and assign each event to the array
        for (uint256 i = 1; i <= eventCount; i++) {
            allEvents[i - 1] = events[i];
        }

        return allEvents;
    }

    function getEventById(uint256 _eventId) public view returns (Event memory) {
        require(_eventId > 0 && _eventId <= eventCount, "Event not found");
        return events[_eventId];
    }

    // nillion functions

    function updateProgramId(string memory _programId) public {
        require(
            bytes(_programId).length > 0,
            "Invalid program ID (length is 0)"
        );
        participants[msg.sender].programId = _programId;
    }

    mapping(address => address[]) t1;
    mapping(address => string[]) t2;

    function storeFeedback(
        string memory _feedbackStoreId,
        address participantAddress
    ) public {
        require(
            bytes(_feedbackStoreId).length > 0,
            "Invalid feedback store ID (length is 0)"
        );

        address[] storage temp = t1[participantAddress];
        temp.push(msg.sender);
        t1[participantAddress] = temp;

        string[] storage temp2 = t2[participantAddress];
        temp2.push(_feedbackStoreId);
        t2[participantAddress] = temp2;
    }

    function getVoters(address pp) public view returns (address[] memory) {
        return t1[pp];
    }

    function getFeedbackStoreIds(
        address pp
    ) public view returns (string[] memory) {
        return t2[pp];
    }
}
