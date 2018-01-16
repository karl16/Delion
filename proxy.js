//This is the contract that will act as a proxy to the logic contract
pragma solidity ^0.4.18;


//@TODO figure out how to make this code only show up once rather than in both contracts


//holds things such as data and other aspects that will not change.... hopefully


//setting the owners.
contract Executive
{
	//no way to show all of the owners addresses though
	//so make sure to delete old addresses!
	mapping(address => uint16) owners;
	mapping(address => uint16) contracts;
	uint256 numberOfOwners;
	
	
	function Executive() public
	{
		owners[msg.sender] = 1;
		numberOfOwners++;
	}

	modifier onlyOwners()
	{
		require (owners[msg.sender] != 0);
		_;
	}
	
	
	function addOwner(address newOwner) onlyOwners external
	{
		require(newOwner != address(0));
		owners[newOwner] = 1;
		numberOfOwners++;
    }
	
	function removeOwner(address deleteOwner) onlyOwners external
	{
		require(numberOfOwners > 1);
		owners[deleteOwner] = 0;
		numberOfOwners--;
	}

	function showOwners() external view returns(uint256 ownerNumbers)
	{
		return numberOfOwners;
	}
	
	/* Section for adding contracts to the white list */
	modifier onlyContracts()
	{
		require(contracts[msg.sender] != 0);
		_;
	}
	
	function addContract(address newContract) external onlyOwners
	{
		contracts[newContract] = 1;
	}
	
	function removeContract(address deleteContract) external onlyOwners
	{
		contracts[deleteContract] = 0;
	}
	
}

contract DataProxy is Executive
{
	/// Main Card struct
	/// Take great care to make sure it fits in the 256-blocks perfectly
	/// Take note that the order of the members in this structure
    /// Is important because of the byte-packing rules used by Ethereum.
    /// Ref: http://solidity.readthedocs.io/en/develop/miscellaneous.html
    struct Card {
        // Suit is the suit of the card (Hearts, Spades, etc.)
		// 1 corresponds to Spades, 2 corresponds to Clubs, 3 corresponds to Hearts, and 4 corresponds to Diamonds.
		// Joker has value 0
        uint16 suit;
        
        // The value of the card (Ace, two, Jack, etc.)
        // Jacks will have value 11, Queens value 12, Kings value 13
		// Joker has value 0
        uint16 value;
    }

    /*** CONSTANTS ***/

    /*** STORAGE ***/


	/// Array holding all of the cards (Card struct) in exsistance using their ID as the index
    Card[] cards;

    /// A mapping from Card IDs to the address that owns them.
    mapping (uint256 => address) public cardIndexToOwner;

    // A mapping from owner address to count of tokens that address owns.
    // Used internally inside balanceOf() to resolve ownership count.
    mapping (address => uint256) ownershipTokenCount;

    /// A mapping from Card IDs to an address that has been approved to call
    /// transferFrom(). Each Card can only have one approved address for transfer
    /// at any time. A zero value means no approval is outstanding.
    mapping (uint256 => address) public cardIndexToApproved;
	
	
	
	function kill() external onlyOwners
	{		
		selfdestruct(msg.sender);	
	}
	
	function setN(uint256 _n) external onlyContracts
	{
		n = _n;
	}
	
	
	
	
	
	
	
	/*
	 //Don't think I need this anymore but am leaving it for future reference if needed.
	
	function delegateSetN() external
	{
		address addr = address(0x26E21AED5843C28d1e97bbcdbdB8A81628963dB7);
		if(addr.delegatecall(bytes4(keccak256("setN(uint256)")), 10))
		{}
	}
	
	function callSetN() external
	{
		address addr = address(0x26E21AED5843C28d1e97bbcdbdB8A81628963dB7);
		if(addr.call(bytes4(keccak256("setN(uint256)")), 10))
		{}
	}
	
	*/	
}