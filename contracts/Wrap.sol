// contracts/Wrap.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Wrap {
    address private _baseTokenAddress;

    constructor(address baseAddress) {
        _baseTokenAddress = baseAddress;
    }
    // amount in Token A
    function wrap(address dest, uint256 amount) public {
        IERC20 destToken = IERC20(dest);
        IERC20 baseToken = IERC20(_baseTokenAddress);
        require(baseToken.allowance(msg.sender, address(this)) >= amount, "Insuffient TokenA Amount for Wrap");
        require(destToken.balanceOf(address(this)) >= amount / 2, "Insuffient TokenB Amount for Wrap");
        baseToken.transferFrom(msg.sender, address(this), amount);
        destToken.transfer(msg.sender, amount / 2);
    }
    // amount in Token A
    function unwrap(address dest, uint256 amount) public {
        IERC20 destToken = IERC20(dest);
        IERC20 baseToken = IERC20(_baseTokenAddress);
        require(destToken.allowance(msg.sender, address(this)) >= amount / 2, "Insuffient TokenB Amount for Wrap"); 
        require(baseToken.balanceOf(address(this)) >= amount, "Insuffient TokenA Amount for Wrap"); 
        destToken.transferFrom(msg.sender, address(this), amount / 2);
        baseToken.transfer(msg.sender, amount);  
    }
}