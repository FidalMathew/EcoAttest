// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ISP} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {Attestation} from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import {DataLocation} from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";

contract EventAttend {
    ISP public spInstance = ISP(0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD);
    // https://testnet-scan.sign.global/schema/onchain_evm_84532_0x1a2
    // base sepolia -- contract deployed

    uint64 public schemaId;

    // events
    event IssuedGymMembership(address indexed customer, uint64 attestationId);

    struct AttestEvent {
        address orgAddress;
        address subOrgAddress;
        address participantAddress;
        uint256 eventId;
        uint256 score;
    }

    function setSchemaID(uint64 schemaId_) external {
        schemaId = schemaId_;
    }

    // function getAttestation(
    //     uint64 attestationId
    // ) public view returns (Attestation memory) {
    //     return spInstance.getAttestation(attestationId);
    // }

    function issueAttestion(
        address orgAddress,
        address participantAddress,
        uint256 eventId,
        uint256 score
    ) public returns (uint64) {
        // issue attestation
        AttestEvent memory attestation = AttestEvent({
            orgAddress: orgAddress,
            subOrgAddress: msg.sender,
            participantAddress: participantAddress,
            eventId: eventId,
            score: score
        });

        // Encode AttestEvent instance
        bytes memory encodedAttestEvent = abi.encode(attestation);

        bytes[] memory recipients = new bytes[](2);
        recipients[0] = abi.encode(participantAddress);
        recipients[1] = abi.encode(msg.sender);
        Attestation memory a = Attestation({
            schemaId: schemaId,
            linkedAttestationId: 0,
            attestTimestamp: 0,
            revokeTimestamp: 0,
            attester: address(this),
            validUntil: 0,
            dataLocation: DataLocation.ONCHAIN,
            revoked: false,
            recipients: recipients,
            data: encodedAttestEvent
        });

        uint64 attestationId = spInstance.attest(a, "", "", "");
        emit IssuedGymMembership(participantAddress, attestationId);
        return attestationId;
    }
}
