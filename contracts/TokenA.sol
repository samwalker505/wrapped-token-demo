// contracts/TokenA.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";


contract TokenA is ERC20 {

    constructor(uint256 initialSupply) ERC20("TokenA", "TKNA") {
        _mint(msg.sender, initialSupply);
    }
    // amount in Token A
    function wrap(address dest, uint256 amount) public {
        IERC20 destToken = IERC20(dest);
        require(balanceOf(_msgSender()) >= amount, "Insuffient TokenA Amount for Wrap");
        destToken.transfer(_msgSender(), amount / 2);
        _burn(_msgSender(), amount);
    }
    // amount in Token A
    function unwrap(address dest, uint256 amount) public {
        IERC20 destToken = IERC20(dest);
        require(destToken.allowance(msg.sender, address(this)) >= amount / 2, "Insuffient TokenB Amount for Wrap"); 
        destToken.transferFrom(msg.sender, address(this), amount / 2);
        _mint(msg.sender, amount);  
    }
}