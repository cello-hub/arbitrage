// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import 'hardhat/console.sol';

contract FlashBot is Ownable {
  // WETH on ETH or WBNB on BSC
  address immutable WETH;

  constructor(address _WETH) {
    WETH = _WETH;
  }

  function getProfit(address pool0, address pool1) external view returns (uint256 profit, address baseToken) {

    return (100, pool0);
  }

  function flashArbitrage(address pool0, address pool1) external {}

  function addBaseToken(address token) external onlyOwner {}

  function getBaseTokens() external view returns (address[] memory tokens){
  }
}
