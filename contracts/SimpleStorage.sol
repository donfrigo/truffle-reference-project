pragma solidity ^0.5.0;

contract SimpleStorage {
  uint storedData;
  uint storedData2;

  function set(uint x, uint y) public {
    storedData = x;
    storedData2 = y;
  }

  function get1() public view returns (uint) {
    return storedData;
  }
  
   function get2() public view returns (uint) {
    return storedData2;
  }
  
  
  function getContractValue() public view returns (uint) {
    return address(this).balance;
  }
  
  
  function payMFO() external payable returns (uint) {
    return msg.value;
  }
}
