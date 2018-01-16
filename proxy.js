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
	function DataProxy() public
	{
		_createCardInternal(0, 0, msg.sender);		//sends to the contract creators address
		_createCardInternal(1, 1, msg.sender);
	}
	
	//add in the functions to actually change the data.
	function balanceOfAddr(address _owner) external view returns (uint256 count) 
	{
        return ownershipTokenCount[_owner];
    }
	function totalAmount() external view returns (uint) 
	{
        return cards.length - 1;
    }
	function cardOwner(uint256 _tokenId) external view returns(address owner)
	{
        owner = cardIndexToOwner[_tokenId];
	}
	
	/// Returns a list of all Card IDs assigned to an address.
    /// @param _owner The owner whose Cards we are interested in.
    /// @dev This method MUST NEVER be called by smart contract code. First, it's fairly
    ///  expensive (it walks the entire Card array looking for Cards belonging to owner),
    ///  but it also returns a dynamic array, which is only supported for web3 calls, and
    ///  not contract-to-contract calls.
	function tokensOfOwner(address _owner) external view returns(uint256[] ownerTokens) 			
	{
        uint256 tokenCount = ownershipTokenCount[_owner];

        if (tokenCount == 0) 
		{
            // Return an empty array
            return new uint256[](0);
        } 
		else 
		{
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalCards = cards.length - 1;
            uint256 resultIndex = 0;

            // We count on the fact that all Cards have IDs starting at 1 and increasing
            // sequentially up to the totalCards count.
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
	
	event Creation(address owner, uint256 cardID, uint16 suit, uint16 value);
    
    /// Transfer event as defined in current draft of ERC721.
    event Transfer(address from, address to, uint256 tokenId);	
	
	
	function _owns(address _claimant, uint256 _tokenId) external view onlyContracts returns (bool)
	{
		return cardIndexToOwner[_tokenId] == _claimant;
	}
	function _transfer(address _from, address _to, uint256 _tokenId) external onlyContracts {
        // Since the number of cards is capped to 2^32 we can't overflow this
        ownershipTokenCount[_to]++;
        // transfer ownership
        cardIndexToOwner[_tokenId] = _to;
        // When creating new Cards _from is 0x0, but we can't account that address.
        if (_from != address(0)) {
            ownershipTokenCount[_from]--;
            // clear any previously approved ownership exchange
            delete cardIndexToApproved[_tokenId];
        }
        // Emit the transfer event.
        Transfer(_from, _to, _tokenId);		
    }
	function _transfer(address _from, address _to, uint256[] _tokenId) external onlyContracts
	{
        for(uint256 i = 0; i < _tokenId.length; i++)
		{
			// Since the number of cards is capped to 2^32 we can't overflow this
			ownershipTokenCount[_to]++;
			// transfer ownership
			cardIndexToOwner[_tokenId[i]] = _to;
			
			// When creating new cards _from is 0x0, but we can't account that address.
			if (_from != address(0)) {
				ownershipTokenCount[_from]--;
				// clear any previously approved ownership exchange
				delete cardIndexToApproved[_tokenId[i]];
			}
			// Emit the transfer event.
			Transfer(_from, _to, _tokenId[i]);
		}
         
    }
	function _createCard(uint16 _suit, uint16 _value, address _owner) external onlyContracts returns (uint)
    {
		
        Card memory _card = Card({
            suit: _suit,
            value: _value
        });
        uint256 newCardId = cards.push(_card) - 1;
		
		//Caps the amount of cards to be 4 billion
        require(newCardId == uint256(uint32(newCardId)));

        // emit the Creation event
        Creation(_owner, newCardId, _suit, _value);

        // This will assign ownership, and also emit the Transfer event as
        // per ERC721 draft
        _transferInternal(0, _owner, newCardId);

        return newCardId;
    }
	
	/// Checks if a given address currently has transferApproval for a particular Card.
	function _approvedFor(address _claimant, uint256 _tokenId) external onlyContracts view returns (bool) 
	{
        return cardIndexToApproved[_tokenId] == _claimant;
    }
	
	/// Marks an address as being approved for transferFrom(), overwriting any previous
    /// approval. Setting _approved to address(0) clears all transfer approval.
    /// NOTE: _approve() does NOT send the Approval event.
	function _approve(uint256 _tokenId, address _approved) external onlyContracts 
	{
        cardIndexToApproved[_tokenId] = _approved;
    }
	
	function _createCardInternal(uint16 _suit, uint16 _value, address _owner) internal returns (uint)
    {
		
        Card memory _card = Card({
            suit: _suit,
            value: _value
        });
        uint256 newCardId = cards.push(_card) - 1;
		//uint256 newCardId = dataProxy.addNewCard(_suit, _value);
		
		//Caps the amount of cards to be 4 billion
        require(newCardId == uint256(uint32(newCardId)));

        // emit the Creation event
        Creation(_owner, newCardId, _suit, _value);

        // This will assign ownership, and also emit the Transfer event as
        // per ERC721 draft
        _transferInternal(0, _owner, newCardId);

        return newCardId;
    }
	function _transferInternal(address _from, address _to, uint256 _tokenId) internal {
        // Since the number of cards is capped to 2^32 we can't overflow this
        ownershipTokenCount[_to]++;
        // transfer ownership
        cardIndexToOwner[_tokenId] = _to;
        // When creating new Cards _from is 0x0, but we can't account that address.
        if (_from != address(0)) {
            ownershipTokenCount[_from]--;
            // clear any previously approved ownership exchange
            delete cardIndexToApproved[_tokenId];
        }
        // Emit the transfer event.
        Transfer(_from, _to, _tokenId);		
    }
	
	function _getCard(uint256 _id) external view returns (uint16 suit, uint16 value) 
	{
		
        Card memory card = cards[_id];

		suit = card.suit;
		value = card.value;
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