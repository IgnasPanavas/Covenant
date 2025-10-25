// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AccountabilityContract is ReentrancyGuard, Ownable {
    struct Commitment {
        address user;
        uint256 amount;
        string taskDescription;
        uint256 deadline;
        string proofHash; // IPFS hash of proof
        bool isCompleted;
        bool isVerified;
        address beneficiary; // Who gets the money if task fails
    }

    mapping(uint256 => Commitment) public commitments;
    mapping(address => uint256[]) public userCommitments;
    
    uint256 public nextCommitmentId = 1;
    uint256 public verificationPeriod = 7 days; // Time to verify after deadline
    
    event CommitmentCreated(
        uint256 indexed commitmentId,
        address indexed user,
        uint256 amount,
        string taskDescription,
        uint256 deadline
    );
    
    event ProofSubmitted(
        uint256 indexed commitmentId,
        string proofHash
    );
    
    event CommitmentCompleted(
        uint256 indexed commitmentId,
        address indexed user,
        uint256 amount
    );
    
    event CommitmentFailed(
        uint256 indexed commitmentId,
        address indexed beneficiary,
        uint256 amount
    );

    constructor() Ownable(msg.sender) {}

    function createCommitment(
        string memory _taskDescription,
        uint256 _deadline,
        address _beneficiary
    ) external payable nonReentrant {
        require(msg.value > 0, "Must stake some ETH");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_beneficiary != address(0), "Invalid beneficiary");

        Commitment storage commitment = commitments[nextCommitmentId];
        commitment.user = msg.sender;
        commitment.amount = msg.value;
        commitment.taskDescription = _taskDescription;
        commitment.deadline = _deadline;
        commitment.beneficiary = _beneficiary;
        commitment.isCompleted = false;
        commitment.isVerified = false;

        userCommitments[msg.sender].push(nextCommitmentId);

        emit CommitmentCreated(
            nextCommitmentId,
            msg.sender,
            msg.value,
            _taskDescription,
            _deadline
        );

        nextCommitmentId++;
    }

    function submitProof(
        uint256 _commitmentId,
        string memory _proofHash
    ) external {
        Commitment storage commitment = commitments[_commitmentId];
        require(commitment.user == msg.sender, "Not your commitment");
        require(!commitment.isCompleted, "Already completed");
        require(block.timestamp <= commitment.deadline, "Deadline passed");

        commitment.proofHash = _proofHash;
        
        emit ProofSubmitted(_commitmentId, _proofHash);
    }

    function verifyCommitment(uint256 _commitmentId) external onlyOwner {
        Commitment storage commitment = commitments[_commitmentId];
        require(!commitment.isCompleted, "Already completed");
        require(block.timestamp > commitment.deadline, "Deadline not reached");
        require(bytes(commitment.proofHash).length > 0, "No proof submitted");

        commitment.isVerified = true;
        commitment.isCompleted = true;

        // Return money to user
        (bool success, ) = commitment.user.call{value: commitment.amount}("");
        require(success, "Transfer failed");

        emit CommitmentCompleted(_commitmentId, commitment.user, commitment.amount);
    }

    function failCommitment(uint256 _commitmentId) external onlyOwner {
        Commitment storage commitment = commitments[_commitmentId];
        require(!commitment.isCompleted, "Already completed");
        require(block.timestamp > commitment.deadline + verificationPeriod, "Still in verification period");

        commitment.isCompleted = true;

        // Send money to beneficiary
        (bool success, ) = commitment.beneficiary.call{value: commitment.amount}("");
        require(success, "Transfer failed");

        emit CommitmentFailed(_commitmentId, commitment.beneficiary, commitment.amount);
    }

    function getUserCommitments(address _user) external view returns (uint256[] memory) {
        return userCommitments[_user];
    }

    function getCommitment(uint256 _commitmentId) external view returns (Commitment memory) {
        return commitments[_commitmentId];
    }

    function setVerificationPeriod(uint256 _newPeriod) external onlyOwner {
        verificationPeriod = _newPeriod;
    }
}
