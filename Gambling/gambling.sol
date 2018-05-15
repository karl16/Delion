pragma solidity ^0.4.18;

contract Executive
{
	//no way to show all of the owners addresses though
	//so make sure to delete old addresses!
    mapping(address => uint16) owners;
    mapping(address => uint16) contracts;
    uint256 numberOfOwners;

    /*
    function Executive() public
    {
        owners[msg.sender] = 1;
        numberOfOwners++;
    }
    */

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


//Once 2 parties have agreed
contract BetBase is Executive
{
    struct Bet
    {
        //address of person who creates the bet
        address gambler1;

        //address of person who accepts the bet
        address gambler2;
        
        //length can't be more than 32 characters!!! IMPORTANT @dev

        //The player or teams that are the subject of the bet
        //playerOrTeam2 is optional
        bytes32 playerOrTeam1;
        bytes32 playerOrTeam2;

        //The operator for comparing (i.e. > if looking for the person or team with a greator value based on the comparison critera)
        bytes32 comparisonOperator;

        //What you are comparing (i.e. touchdowns, yards, or simple win)
        bytes32 comparisonCriteria;

        //Money to be won (x2 since both parties have to put the money up at the beginning)
        uint256 pot;
    }

    //Mapping of Dates to a list of bets for that day
    //Each day it checks the bets in the list that correspond to that specific day
    // @dev make sure to delete bets after they are finished to keep storage low.
    mapping(bytes32 => Bet[]) betList;
    uint256 tmpTesting = 0;

    //events
    event Payout(address winner, uint256 payout);
    event BetCreated(address g1, address g2, bytes32 p1, bytes32 p2, bytes32 comp, bytes32 compCrit, uint256 pot, bytes32 date);

    function _createBetTemp(address sender) internal
    {
        address t = sender;
        t = 0x0;
        tmpTesting++;
    }
    function tmp() external view returns(uint256 num)
    {
        num = tmpTesting;
    }

    /*
    function _payout(address winner, uint256 balance) internal
    {
        //pay the winner
        winner.transfer(balance);

        //event
        emit Payout(winner, balance);
    }
    */
    /*
    function _determineWinner(Bet bet) internal returns(address winner)      // @dev maybe add a bool incase there is a tie or something
    {
        //determines winner using the orcalized data
        address winner;

        //implement logic for checking winner @dev


        return winner;
    }
    */
    /*
    //Probably create a chron job that will call this function or something @dev
    function checkBets(bytes32 date) external onlyContracts
    {
        //only allows certain addresses to call this function (Namely the server hopefully)
        uint256 size = betList[date].length;
        for(uint256 i = 0; i < size; i++)
        {
            address winner = _determineWinner(betList[date][i]);
            uint256 balance = betList[date][i].pot;

            //delete the bet to guard against reentrancy attack before paying out
            delete betList[date][i];

            _payout(winner, balance);
        }
    }
*/
    /*
    //adding bets
    function _addBet(address g1, address g2, bytes32 t1, bytes t2, bytes32 op, bytes32 critera, uint256 pot, bytes32 date) internal
    {
        betList[date].push(Bet.new(g1, g2, t1, t2, op, critera, pot));

        //event
        emit BetCreated(g1, g2, t1, t2, op, critera, pot, date);
    }
    */

}


contract AuctionBase is BetBase
{
    struct Auction
    {
        //address of person who creates the bet
        address writer;
        
        //length can't be more than 32 characters!!! IMPORTANT @dev

        //The player or teams that are the subject of the bet
        //playerOrTeam2 is optional
        bytes32 playerOrTeam1;
        bytes32 playerOrTeam2;

        //The operator for comparing (i.e. > if looking for the person or team with a greator value based on the comparison critera)
        bytes32 comparisonOperator;

        //What you are comparing (i.e. touchdowns, yards, or simple win)
        bytes32 comparisonCriteria;

        //Cost of bet
        uint256 cost;

        //date of completion
        bytes32 date;

        //id of auction
        uint256 id;   
    }
    uint256 numberOfAuctions = 1;
    uint256 numLiveAuctions = 0;
    //Auction[] auctionArray;
    mapping(uint256 => Auction) auctionMapping;
    //mapping(uint256 => bool) liveAuction;

    event AuctionCreated(address writer, uint256 id);
    event AuctionCancelled(address writer, uint256 id);

    function _addAuction(Auction a) internal
    {
        require(a.cost > 0);
        //maybe do a require to check if that id has already been used  @dev @TODO

        a.id = numberOfAuctions;

        auctionMapping[numberOfAuctions] = a;
        //liveAuction[numberOfAuctions] = true;

        numberOfAuctions++;
        numLiveAuctions++;

        emit AuctionCreated(a.writer, a.id);
    }

    function _cancelAuction(Auction a, address sender) internal
    {
        //require(a.writer == sender);

        //remove auction
        _removeAuction(a.id);
        numLiveAuctions--;

        //pay the owner back
        sender.transfer(a.cost);

        emit AuctionCancelled(a.writer, a.id);
    }

    function _removeAuction(uint256 id) internal
    {
        delete auctionMapping[id];
        //liveAuction[id] = false;
    }

    function _bid(uint256 id, address sender) internal 
    {
        Auction storage a = auctionMapping[id];

        //This verifies that the auction is still live.
        //If the auction is live then cost is gaurenteed to be greater than 0.
        require(a.cost > 0);

        //delete auction before creating the bet
        _removeAuction(a.id);
        numLiveAuctions--;

        //create the bets now
        //not sure if this will actually will create the new bet.
        //_addBet(a.writer, sender, a.playerOrTeam1, a.playerOrTeam2, a.comparisonOperator, a.comparisonCriteria, a.cost*2, a.date);
        _createBetTemp(sender);

    }

    function _isLive(Auction a) internal pure returns (bool flag)
    {
        return (a.cost > 0);
    }


}

contract AuctionMain is AuctionBase
{
    function addAuction(bytes32 p1, bytes32 p2, bytes32 comp, bytes32 compCrit, uint256 cost, bytes32 date) external payable
    {
        require(cost > 0);
        //not entirely sure how this works but it is similar to what crypto kitties did on line 1428
        //something about making sure you don't overflow
        require(cost == uint256(uint128(cost)));
        require(msg.value >= cost);

        //Need to do a check that the date has not already passed @dev @TODO

        Auction memory auction = Auction(
            msg.sender,
            p1,
            p2,
            comp,
            compCrit, 
            cost,
            date,
            0
        );
        _addAuction(auction);
    }

    function cancelAuction(uint256 id) external
    {
        //make sure the auction is live
        //require(liveAuction[id] == true);
        Auction storage a = auctionMapping[id];
        //make sure that the person cancelling it is the person who created it
        require(msg.sender == a.writer);


        _cancelAuction(a, msg.sender);
    }

    function bid(uint256 id) external payable
    {
        Auction storage a = auctionMapping[id];

        require(a.cost > 0);
        require(msg.value >= a.cost);
        require(msg.sender != a.writer);    //can't accept your own bet (has to be a new person)

        //Need to do a check that the date has not already passed @dev @TODO
        _bid(id, msg.sender);
    }

    //Should not be called by contract code because it'll be hella expensive
    //Also can't return a dynamic array to other contracts.
    function availableAuctions() external view returns (uint256[] auctions)
    {
        if(numLiveAuctions == 0)
        {
            return new uint256[](0);
        }

        uint256[] memory result = new uint256[](numLiveAuctions);
        uint256 currIndex = 0;
        for(uint256 i = 0; i < numberOfAuctions; i++)
        {
            if(currIndex == numLiveAuctions)
            {
                break;
            }

            if(_isLive(auctionMapping[i]))
            {
                result[currIndex] = i;
                currIndex++;
            }
        }
        return result;
    }

    function getAuction(uint256 id) external view returns(bytes32 player1, bytes32 player2,
     bytes32 comparisonOp, bytes32 comparisonCriteria, uint256 cost, address writer)
    {
        Auction storage a = auctionMapping[id];

        //returns these values based off of the method declaration
        player1 = a.playerOrTeam1;
        player2 = a.playerOrTeam2;
        comparisonOp = a.comparisonOperator;
        comparisonCriteria = a.comparisonCriteria;
        cost = a.cost;
        writer = a.writer;
    }

    function () external payable
	{

    }

}


contract Core is AuctionMain
{
    function Core() public
    {
        owners[msg.sender] = 1;
        numberOfOwners++;
    }

    function withdrawBalance() external onlyOwners 
	{
        address c = this;
        uint256 balance = c.balance;
        msg.sender.transfer(balance);
    }

    function kill() external onlyOwners
    {		
        selfdestruct(msg.sender);	
    }
}