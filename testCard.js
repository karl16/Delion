pragma solidity ^0.4.18;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public{		//not sure about the public thing
    owner = msg.sender;
  }


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }


  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) onlyOwner public
  {	
    if (newOwner != address(0)) 
	{
      owner = newOwner;
    }
  }

}


//************************************************************************************************************************************************************************

/// @title Interface for contracts conforming to ERC-721: Non-Fungible Tokens
/// @author Dieter Shirley <dete@axiomzen.co> (https://github.com/dete)
contract ERC721 {
    // Required methods
    function totalSupply() public view returns (uint256 total);
    function balanceOf(address _owner) public view returns (uint256 balance);
    function ownerOf(uint256 _tokenId) external view returns (address owner);
    function approve(address _to, uint256 _tokenId) external;
    function transfer(address _to, uint256 _tokenId) external;		//maybe take out this one
	function transfer(address _to, uint256[] _tokenId) external;
    function transferFrom(address _from, address _to, uint256 _tokenId) external;

    // Events
    event Transfer(address from, address to, uint256 tokenId);
    event Approval(address owner, address approved, uint256 tokenId);

    // Optional
    // function name() public view returns (string name);
    // function symbol() public view returns (string symbol);
    // function tokensOfOwner(address _owner) external view returns (uint256[] tokenIds);
    // function tokenMetadata(uint256 _tokenId, string _preferredTransport) public view returns (string infoUrl);

    // ERC-165 Compatibility (https://github.com/ethereum/EIPs/issues/165)
    function supportsInterface(bytes4 _interfaceID) external view returns (bool);
}

//*********************************************************************************************************************************************************************************************

contract CardBase {
    /*** EVENTS ***/

    /// @dev The Birth event is fired whenever a new kitten comes into existence. This obviously
    ///  includes any time a cat is created through the giveBirth method, but it is also called
    ///  when a new gen0 cat is created.
    event Birth(address owner, uint256 cardID, uint16 suit, uint16 value);
    //@TODO maybe delete birth
    
    
    /// @dev Transfer event as defined in current draft of ERC721. Emitted every time a kitten
    ///  ownership is assigned, including births.
    event Transfer(address from, address to, uint256 tokenId);

    /*** DATA TYPES ***/

    /// @dev The main Kitty struct. Every cat in CryptoKitties is represented by a copy
    ///  of this structure, so great care was taken to ensure that it fits neatly into
    ///  exactly two 256-bit words. Note that the order of the members in this structure
    ///  is important because of the byte-packing rules used by Ethereum.
    ///  Ref: http://solidity.readthedocs.io/en/develop/miscellaneous.html
    struct Card {
        //Suit is the suit of the card (Hearts, Spades, etc.)
		// 1 corresponds to Spades, 2 corresponds to Clubs, 3 corresponds to Hearts, and 4 corresponds to Diamonds.
		//Joker has value 0
        uint16 suit;
        
        //The value of the card (Ace, two, Jack, etc.)
        //Jacks will have value 11, Queens value 12, Kings value 13
		//Joker has value 0
        uint16 value;
    }

    /*** CONSTANTS ***/

    // An approximation of currently how many seconds are in between blocks.
    uint256 public secondsPerBlock = 15;

    /*** STORAGE ***/

    /// @dev An array containing the Kitty struct for all Kitties in existence. The ID
    ///  of each cat is actually an index into this array. Note that ID 0 is a negacat,
    ///  the unKitty, the mythical beast that is the parent of all gen0 cats. A bizarre
    ///  creature that is both matron and sire... to itself! Has an invalid genetic code.
    ///  In other words, cat ID 0 is invalid... ;-)
    Card[] cards;

    /// @dev A mapping from cat IDs to the address that owns them. All cats have
    ///  some valid owner address, even gen0 cats are created with a non-zero owner.
    mapping (uint256 => address) public cardIndexToOwner;

    // @dev A mapping from owner address to count of tokens that address owns.
    //  Used internally inside balanceOf() to resolve ownership count.
    mapping (address => uint256) ownershipTokenCount;

    /// @dev A mapping from KittyIDs to an address that has been approved to call
    ///  transferFrom(). Each Kitty can only have one approved address for transfer
    ///  at any time. A zero value means no approval is outstanding.
    mapping (uint256 => address) public cardIndexToApproved;

    /// @dev Assigns ownership of a specific Card to an address.
    function _transfer(address _from, address _to, uint256 _tokenId) internal {			//maybe take out this one.
        // Since the number of kittens is capped to 2^32 we can't overflow this
        ownershipTokenCount[_to]++;
        // transfer ownership
        cardIndexToOwner[_tokenId] = _to;
        // When creating new kittens _from is 0x0, but we can't account that address.
        if (_from != address(0)) {
            ownershipTokenCount[_from]--;
            // clear any previously approved ownership exchange
            delete cardIndexToApproved[_tokenId];
        }
        // Emit the transfer event.
        Transfer(_from, _to, _tokenId);
    }
	
	function _transfer(address _from, address _to, uint256[] _tokenId) internal 
	{
        for(uint256 i = 0; i < _tokenId.length; i++)
		{
			ownershipTokenCount[_to]++;
			// transfer ownership
			cardIndexToOwner[_tokenId[i]] = _to;
			
			// When creating new kittens _from is 0x0, but we can't account that address.
			if (_from != address(0)) {
				ownershipTokenCount[_from]--;
				// clear any previously approved ownership exchange
				delete cardIndexToApproved[_tokenId[i]];
			}
			// Emit the transfer event.
			Transfer(_from, _to, _tokenId[i]);
		}
         
    }

	
    /// @dev An internal method that creates a new kitty and stores it. This
    ///  method doesn't do any checking and should only be called when the
    ///  input data is known to be valid. Will generate both a Birth event
    ///  and a Transfer event.
    function _createCard(uint16 _suit, uint16 _value, address _owner) internal returns (uint)
    {
        // These requires are not strictly necessary, our calling code should make
        // sure that these conditions are never broken. However! _createKitty() is already
        // an expensive call (for storage), and it doesn't hurt to be especially careful
        // to ensure our data structures are always valid.
		
		/* Not sure what exactly this does. Some type of data validation.
        require(_matronId == uint256(uint32(_matronId)));
        require(_sireId == uint256(uint32(_sireId)));
        require(_generation == uint256(uint16(_generation)));
		*/

        // New kitty starts with the same cooldown as parent gen/2

        Card memory _card = Card({
            suit: _suit,
            value: _value
        });
        uint256 newCardId = cards.push(_card) - 1;

        // It's probably never going to happen, 4 billion cats is A LOT, but
        // let's just be 100% sure we never let this happen.
		// Again some weird data validation that I am not sure what it does.
        require(newCardId == uint256(uint32(newCardId)));

        // emit the birth event
        Birth(_owner, newCardId, _card.suit, _card.value);

        // This will assign ownership, and also emit the Transfer event as
        // per ERC721 draft
        _transfer(0, _owner, newCardId);

        return newCardId;
    }
	
}

//***********************************************************************************************************************************************************************

contract CardOwnership is CardBase, ERC721 {

    /// @notice Name and symbol of the non fungible token, as defined in ERC721.
    string public constant name = "birthing";
    string public constant symbol = "birth";

    bytes4 constant InterfaceSignature_ERC165 =
        bytes4(keccak256('supportsInterface(bytes4)'));

    bytes4 constant InterfaceSignature_ERC721 =
        bytes4(keccak256('name()')) ^
        bytes4(keccak256('symbol()')) ^
        bytes4(keccak256('totalSupply()')) ^
        bytes4(keccak256('balanceOf(address)')) ^
        bytes4(keccak256('ownerOf(uint256)')) ^
        bytes4(keccak256('approve(address,uint256)')) ^
        bytes4(keccak256('transfer(address,uint256)')) ^
		bytes4(keccak256('transfer(address,uint256[])')) ^
        bytes4(keccak256('transferFrom(address,address,uint256)')) ^
        bytes4(keccak256('tokensOfOwner(address)')) ^
        bytes4(keccak256('tokenMetadata(uint256,string)'));

    /// @notice Introspection interface as per ERC-165 (https://github.com/ethereum/EIPs/issues/165).
    ///  Returns true for any standardized interfaces implemented by this contract. We implement
    ///  ERC-165 (obviously!) and ERC-721.
    function supportsInterface(bytes4 _interfaceID) external view returns (bool)
    {
        // DEBUG ONLY
        //require((InterfaceSignature_ERC165 == 0x01ffc9a7) && (InterfaceSignature_ERC721 == 0x9a20483d));

        return ((_interfaceID == InterfaceSignature_ERC165) || (_interfaceID == InterfaceSignature_ERC721));
    }


    // Internal utility functions: These functions all assume that their input arguments
    // are valid. We leave it to public methods to sanitize their inputs and follow
    // the required logic.

    /// @dev Checks if a given address is the current owner of a particular Kitty.
    /// @param _claimant the address we are validating against.
    /// @param _tokenId kitten id, only valid when > 0
    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) 
	{
        return cardIndexToOwner[_tokenId] == _claimant;
    }

    /// @dev Checks if a given address currently has transferApproval for a particular Kitty.
    /// @param _claimant the address we are confirming kitten is approved for.
    /// @param _tokenId kitten id, only valid when > 0
    function _approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool) 
	{
        return cardIndexToApproved[_tokenId] == _claimant;
    }

    /// @dev Marks an address as being approved for transferFrom(), overwriting any previous
    ///  approval. Setting _approved to address(0) clears all transfer approval.
    ///  NOTE: _approve() does NOT send the Approval event. This is intentional because
    ///  _approve() and transferFrom() are used together for putting Kitties on auction, and
    ///  there is no value in spamming the log with Approval events in that case.
    function _approve(uint256 _tokenId, address _approved) internal 
	{
        cardIndexToApproved[_tokenId] = _approved;
    }

    /// @notice Returns the number of Kitties owned by a specific address.
    /// @param _owner The owner address to check.
    /// @dev Required for ERC-721 compliance
    function balanceOf(address _owner) public view returns (uint256 count) 
	{
        return ownershipTokenCount[_owner];
    }

    /// @notice Transfers a Kitty to another address. If transferring to a smart
    ///  contract be VERY CAREFUL to ensure that it is aware of ERC-721 (or
    ///  CryptoKitties specifically) or your Kitty may be lost forever. Seriously.
    /// @param _to The address of the recipient, can be a user or contract.
    /// @param _tokenId The ID of the Kitty to transfer.
    /// @dev Required for ERC-721 compliance.
    function transfer(address _to, uint256 _tokenId) external		//leaving for ERC-721 compliance (Don't think that it is used ever.)
    {
        // Safety check to prevent against an unexpected 0x0 default.
        require(_to != address(0));
        // Disallow transfers to this contract to prevent accidental misuse.

        require(_to != address(this));

        // You can only send your own cat.
        require(_owns(msg.sender, _tokenId));

        // Reassign ownership, clear pending approvals, emit Transfer event.
        _transfer(msg.sender, _to, _tokenId);
    }
	
	
	function transfer(address _to, uint256[] _tokenId) external
    {
        // Safety check to prevent against an unexpected 0x0 default.
        require(_to != address(0));
        // Disallow transfers to this contract to prevent accidental misuse.
        require(_to != address(this));

        // You can only send your own cat.
		for(uint256 i = 0; i < _tokenId.length; i++)
		{
			require(_owns(msg.sender, _tokenId[i]));
		}
        

        // Reassign ownership, clear pending approvals, emit Transfer event.
        _transfer(msg.sender, _to, _tokenId);
    }

    /// @notice Grant another address the right to transfer a specific Kitty via
    ///  transferFrom(). This is the preferred flow for transfering NFTs to contracts.
    /// @param _to The address to be granted transfer approval. Pass address(0) to
    ///  clear all approvals.
    /// @param _tokenId The ID of the Kitty that can be transferred if this call succeeds.
    /// @dev Required for ERC-721 compliance.
    function approve(address _to, uint256 _tokenId) external
    {
        // Only an owner can grant transfer approval.
        require(_owns(msg.sender, _tokenId));

        // Register the approval (replacing any previous approval).
        _approve(_tokenId, _to);

        // Emit approval event.
        Approval(msg.sender, _to, _tokenId);
    }

    /// @notice Transfer a Kitty owned by another address, for which the calling address
    ///  has previously been granted transfer approval by the owner.
    /// @param _from The address that owns the Kitty to be transfered.
    /// @param _to The address that should take ownership of the Kitty. Can be any address,
    ///  including the caller.
    /// @param _tokenId The ID of the Kitty to be transferred.
    /// @dev Required for ERC-721 compliance.
    function transferFrom(address _from, address _to, uint256 _tokenId) external
    {
        // Safety check to prevent against an unexpected 0x0 default.
        require(_to != address(0));
        // Disallow transfers to this contract to prevent accidental misuse.
        require(_to != address(this));
        // Check for approval and valid ownership
        require(_approvedFor(msg.sender, _tokenId));
        require(_owns(_from, _tokenId));

        // Reassign ownership (also clears pending approvals and emits Transfer event).
        _transfer(_from, _to, _tokenId);
    }

    /// @notice Returns the total number of Kitties currently in existence.
    /// @dev Required for ERC-721 compliance.
    function totalSupply() public view returns (uint) 
	{
        return cards.length - 1;
    }

    /// @notice Returns the address currently assigned ownership of a given Kitty.
    /// @dev Required for ERC-721 compliance.
    function ownerOf(uint256 _tokenId) external view returns (address owner)
    {
        owner = cardIndexToOwner[_tokenId];

        require(owner != address(0));
    }

	
	//Don't think I will use this method....
	
    /// @notice Returns a list of all Kitty IDs assigned to an address.
    /// @param _owner The owner whose Kitties we are interested in.
    /// @dev This method MUST NEVER be called by smart contract code. First, it's fairly
    ///  expensive (it walks the entire Kitty array looking for cats belonging to owner),
    ///  but it also returns a dynamic array, which is only supported for web3 calls, and
    ///  not contract-to-contract calls.
    function tokensOfOwner(address _owner) external view returns(uint256[] ownerTokens) 
	{
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) 
		{
            // Return an empty array
            return new uint256[](0);
        } 
		else 
		{
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalCards = totalSupply();
            uint256 resultIndex = 0;

            // We count on the fact that all cats have IDs starting at 1 and increasing
            // sequentially up to the totalCat count.
            uint256 cardId;

            for (cardId = 1; cardId <= totalCards; cardId++) 
			{
                if (cardIndexToOwner[cardId] == _owner) 
				{
                    result[resultIndex] = cardId;
                    resultIndex++;
                }
            }

            return result;
        }
    }

}

contract CardMinting is CardOwnership
{
	struct CardPack 	//card packs come in packs of 8
	{
        
        uint16 suit1;
        uint16 value1;
		
		uint16 suit2;
        uint16 value2;
		
		uint16 suit3;
        uint16 value3;
		
		uint16 suit4;
        uint16 value4;
		
		uint16 suit5;
        uint16 value5;
		
		uint16 suit6;
        uint16 value6;
		
		uint16 suit7;
        uint16 value7;
		
		uint16 suit8;
        uint16 value8;
     
    }
	
	//for creating new cards
	//would need to automate the timing of creating new cards.
	//(Maybe have a button that when clicked creates a pack and sends to your address)
	function createCardPack(address buyer) external
	{
		//@TODO send money
		
		//function to create the cards in a pack with a specific rarity
		CardPack memory cardPack = generateCardPack();
		
		_createCard(cardPack.suit1, cardPack.value1, buyer);
		_createCard(cardPack.suit2, cardPack.value2, buyer);
		_createCard(cardPack.suit3, cardPack.value3, buyer);
		_createCard(cardPack.suit4, cardPack.value4, buyer);
		_createCard(cardPack.suit5, cardPack.value5, buyer);
		_createCard(cardPack.suit6, cardPack.value6, buyer);
		_createCard(cardPack.suit7, cardPack.value7, buyer);
		_createCard(cardPack.suit8, cardPack.value8, buyer);
		
	}
	
	function generateCardPack() internal pure returns (CardPack memory cardValues)		//might eventually have to take out pure part
	{
		// @TODO random values based off of some seed
		
		cardValues.suit1 = 5;
		cardValues.value1 = 1;
		cardValues.suit2 = 5;
		cardValues.value2 = 2;
		cardValues.suit3 = 5;
		cardValues.value3 = 3;
		cardValues.suit4 = 5;
		cardValues.value4 = 4;
		cardValues.suit5 = 5;
		cardValues.value5 = 5;
		cardValues.suit6 = 5;
		cardValues.value6 = 6;
		cardValues.suit7 = 5;
		cardValues.value7 = 7;
		cardValues.suit8 = 5;
		cardValues.value8 = 8;
		
		return cardValues;
	}
}


//*********************************************************************************************************************************************************************

contract CardCore is CardMinting {

    // This is the main CryptoKitties contract. In order to keep our code seperated into logical sections,
    // we've broken it up in two ways. First, we have several seperately-instantiated sibling contracts
    // that handle auctions and our super-top-secret genetic combination algorithm. The auctions are
    // seperate since their logic is somewhat complex and there's always a risk of subtle bugs. By keeping
    // them in their own contracts, we can upgrade them without disrupting the main contract that tracks
    // kitty ownership. The genetic combination algorithm is kept seperate so we can open-source all of
    // the rest of our code without making it _too_ easy for folks to figure out how the genetics work.
    // Don't worry, I'm sure someone will reverse engineer it soon enough!
    //
    // Secondly, we break the core contract into multiple files using inheritence, one for each major
    // facet of functionality of CK. This allows us to keep related code bundled together while still
    // avoiding a single giant file with everything in it. The breakdown is as follows:
    //
    //      - CardBase: This is where we define the most fundamental code shared throughout the core
    //             functionality. This includes our main data storage, constants and data types, plus
    //             internal functions for managing these items.
    //
    //
    //      - CardOwnership: This provides the methods required for basic non-fungible token
    //             transactions, following the draft ERC-721 spec (https://github.com/ethereum/EIPs/issues/721).


    // Set in case the core contract is broken and an upgrade is required
    address public newContractAddress;
	address[] owners;

    /// @notice Creates the main CryptoKitties smart contract instance.
    function CardCore() public {
        // Starts paused.
        //paused = true;		// Not sure about commenting this out.
		
		owners.push(msg.sender);		//adds the person creating the contract as the first owner.
		_createCard(0, 0, address(0x9D5A2e6b7B556A80fc9164d41d4e6433c5D3CB3d));		//sends to my ether address on rinkby ;)
		
		uint16 suit;
		uint16 value;
		for(suit = 1; suit <= 4; suit++)
		{
			for(value = 1; value <= 13; value++)
			{
				_createCard(suit, value, address(0x9D5A2e6b7B556A80fc9164d41d4e6433c5D3CB3d)); //sends all the cards to me mwhahahah
			}
		}
    }
	
	modifier onlyOwners()
	{
		var found = false;
		
		for(uint256 i = 0; i < owners.length; i++)
		{
			if(owners[i] == msg.sender)
			{
				found = true;
				break;
			}
		}
		if(!found)
		{
			revert();
		}
		_;
	}
	
	function kill() onlyOwners external
	{	
		selfdestruct(owners[0]);
	}
	
	function addOwner(address newOwner) onlyOwners external
	{
		var zeros = false;
		
		if (newOwner != address(0)) 
		{
			//if the owner array has null addresses then new owners should override those addresses
			//this will make sure that we don't have a huge owners array of null addresses.
			for(uint256 i = 0; i < owners.length; i++)
			{
				if (owners[i] == address(0))
				{
					owners[i] = newOwner;
					zeros = true;
					break;
				}
			}
		}
		//only pushes at the end if the owner array doesn't have any null addresses
		if(!zeros)
		{
			owners.push(newOwner);
		}
    }
	
	function removeOwner(address deleteOwner) onlyOwners external
	{
		require(owners.length > 1);
		
		for(uint256 i = 0; i < owners.length; i++)
		{
			if(owners[i] == deleteOwner)
			{
				if(i == owners.length-1)
				{
					delete owners[i];
				}
				else
				{
					owners[i] = owners[owners.length-1];
					delete owners[owners.length-1];	
				}	
			}
		}			
	}
	
	function showOwners() external view returns(address[] ownerAddresses)
	{
		return owners;
	}
	
	
		
/*
    /// @dev Used to mark the smart contract as upgraded, in case there is a serious
    ///  breaking bug. This method does nothing but keep track of the new contract and
    ///  emit a message indicating that the new address is set. It's up to clients of this
    ///  contract to update to the new contract address in that case. (This contract will
    ///  be paused indefinitely if such an upgrade takes place.)
    /// @param _v2Address new address
    function setNewAddress(address _v2Address) external onlyCEO whenPaused {
        // See README.md for updgrade plan
        newContractAddress = _v2Address;
        ContractUpgrade(_v2Address);
    }
*/


    /// @notice Returns all the relevant information about a specific kitty.
    /// @param _id The ID of the kitty of interest.
	//not sure why they used uint256 for all the values even if they were normally smaller.
    function getCard(uint256 _id) external view returns (uint16 suit, uint16 value) 
	{
        Card storage card = cards[_id];

		suit = card.suit;
		value = card.value;
    }


    // @dev Allows the CFO to capture the balance available to the contract.
    function withdrawBalance() external onlyOwners 
	{
        uint256 balance = this.balance;
		owners[0].transfer(balance);
    }
	
}



