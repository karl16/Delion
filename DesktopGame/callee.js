//This is the contract that will act as a proxy to the logic contract
pragma solidity ^0.4.18;

contract Callee
{
	Proxy p;
	
	function Callee() public
	{
		address addr = address(0x72F2eF8100400Aac1dE259Da8b6eDd4CAE3db387);
		p = Proxy(addr);
	}
	
	function kill() external
	{		
		selfdestruct(msg.sender);	
	}
	
	function getN() external view returns(uint256 _n)
	{
		return p.n();
	}
	
	function setN(uint256 _n) external
	{
		p.setN(_n);
	}
}

//This is the contract that will act as a proxy to the logic contract
pragma solidity ^0.4.18;

contract Proxy
{
	uint256 public n = 2;
	
	function setN(uint256 _n) external
	{
		n = _n + 2;
	}
}