// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDC is ERC20, Ownable {
    constructor() ERC20("Mock USDC", "mUSDC") Ownable() {
        // Mint 1,000,000 USDC to the deployer for testing
        _mint(msg.sender, 1000000 * 10**6); // 6 decimals like real USDC
    }
    
    // Function to mint tokens for testing
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    // Function to get decimals (USDC has 6 decimals)
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
