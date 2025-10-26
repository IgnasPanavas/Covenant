// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract AccountabilityContract is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    struct Commitment {
        address user;
        string description;
        uint256 deadline;
        address beneficiary;
        uint256 stakeAmount;
        address token; // ETH (0x0) or ERC20 token address
        uint256 status; // 0: Active, 1: Completed, 2: Failed
        string proofHash; // IPFS hash of proof (for reference)
        bool verified; // Manual verification result
        string verificationReason; // Reason for verification decision
    }

    mapping(uint256 => Commitment) public commitments;
    mapping(address => uint256[]) public userCommitments;
    mapping(address => bool) public supportedTokens;
    address public defaultToken;
    
    uint256 public commitmentCount;
    uint256 public totalStaked;
    
    event CommitmentCreated(uint256 indexed commitmentId, address indexed user, string description, uint256 deadline, uint256 stakeAmount, address token);
    event ProofSubmitted(uint256 indexed commitmentId, string proofHash);
    event CommitmentCompleted(uint256 indexed commitmentId, address indexed user);
    event CommitmentFailed(uint256 indexed commitmentId, address indexed user, address beneficiary);
    event CommitmentVerified(uint256 indexed commitmentId, bool verified, string reason);
    
    constructor(address _defaultToken) {
        defaultToken = _defaultToken;
        supportedTokens[_defaultToken] = true;
    }

    function createCommitment(
        string memory _description,
        uint256 _deadline,
        address _beneficiary,
        address _token,
        uint256 _amount
    ) external payable nonReentrant {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_beneficiary != address(0), "Invalid beneficiary");
        require(_amount > 0, "Amount must be greater than 0");
        require(supportedTokens[_token], "Token not supported");

        uint256 commitmentId = commitmentCount;
        commitmentCount++;

        // Handle token transfer
        if (_token == address(0)) {
            // ETH transfer
            require(msg.value == _amount, "ETH amount mismatch");
        } else {
            // ERC20 transfer
            IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        }

        commitments[commitmentId] = Commitment({
            user: msg.sender,
            description: _description,
            deadline: _deadline,
            beneficiary: _beneficiary,
            stakeAmount: _amount,
            token: _token,
            status: 0, // Active
            proofHash: "",
            verified: false,
            verificationReason: ""
        });

        userCommitments[msg.sender].push(commitmentId);
        totalStaked += _amount;

        emit CommitmentCreated(commitmentId, msg.sender, _description, _deadline, _amount, _token);
    }

    function submitProof(uint256 _commitmentId, string memory _proofHash) external {
        require(_commitmentId < commitmentCount, "Invalid commitment ID");
        Commitment storage commitment = commitments[_commitmentId];
        require(commitment.user == msg.sender, "Not your commitment");
        require(commitment.status == 0, "Commitment not active");
        require(block.timestamp <= commitment.deadline, "Deadline passed");

        commitment.proofHash = _proofHash;
        emit ProofSubmitted(_commitmentId, _proofHash);
    }

    function verifyCommitment(uint256 _commitmentId, bool _verified, string memory _reason) external onlyOwner {
        require(_commitmentId < commitmentCount, "Invalid commitment ID");
        Commitment storage commitment = commitments[_commitmentId];
        require(commitment.status == 0, "Commitment not active");

        commitment.verified = _verified;
        commitment.verificationReason = _reason;

        if (_verified) {
            commitment.status = 1; // Completed
            _completeCommitment(_commitmentId);
        } else {
            commitment.status = 2; // Failed
            _failCommitment(_commitmentId);
        }

        emit CommitmentVerified(_commitmentId, _verified, _reason);
    }

    function _completeCommitment(uint256 _commitmentId) internal {
        Commitment storage commitment = commitments[_commitmentId];
        
        if (commitment.token == address(0)) {
            // ETH transfer
            (bool success, ) = commitment.user.call{value: commitment.stakeAmount}("");
            require(success, "ETH transfer failed");
        } else {
            // ERC20 transfer
            IERC20(commitment.token).safeTransfer(commitment.user, commitment.stakeAmount);
        }

        totalStaked -= commitment.stakeAmount;
        emit CommitmentCompleted(_commitmentId, commitment.user);
    }

    function _failCommitment(uint256 _commitmentId) internal {
        Commitment storage commitment = commitments[_commitmentId];
        
        if (commitment.token == address(0)) {
            // ETH transfer
            (bool success, ) = commitment.beneficiary.call{value: commitment.stakeAmount}("");
            require(success, "ETH transfer failed");
        } else {
            // ERC20 transfer
            IERC20(commitment.token).safeTransfer(commitment.beneficiary, commitment.stakeAmount);
        }

        totalStaked -= commitment.stakeAmount;
        emit CommitmentFailed(_commitmentId, commitment.user, commitment.beneficiary);
    }

    // Admin functions
    function addSupportedToken(address _token) external onlyOwner {
        supportedTokens[_token] = true;
    }

    function removeSupportedToken(address _token) external onlyOwner {
        supportedTokens[_token] = false;
    }

    function setDefaultToken(address _token) external onlyOwner {
        defaultToken = _token;
    }

    function getTokenBalance(address _token) external view returns (uint256) {
        if (_token == address(0)) {
            return address(this).balance;
        } else {
            return IERC20(_token).balanceOf(address(this));
        }
    }

    function getUserCommitments(address _user) external view returns (uint256[] memory) {
        return userCommitments[_user];
    }

    function getCommitment(uint256 _commitmentId) external view returns (Commitment memory) {
        require(_commitmentId < commitmentCount, "Invalid commitment ID");
        return commitments[_commitmentId];
    }

    // Emergency functions
    function emergencyWithdraw(address _token, uint256 _amount) external onlyOwner {
        if (_token == address(0)) {
            (bool success, ) = owner().call{value: _amount}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20(_token).safeTransfer(owner(), _amount);
        }
    }
}