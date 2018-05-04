pragma solidity ^0.4.18;

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

    function kill() external onlyOwners
    {		
        selfdestruct(msg.sender);	
    }
}

contract BetBase
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
        uint128 pot;
    }

    //Mapping of Dates to a list of bets for that day
    //Each day it checks the bets in the list that correspond to that specific day
    // @dev make sure to delete bets after they are finished to keep storage low.
    mapping(bytes32 => Bet[]) betList;

    //events
    event Payout(address winner, uint128 payout);

    function payout(address winner, uint128 balance) internal
    {
        //pay the winner
        winner.transfer(balance);

        //event
        emit Payout(winner, balance);
    }

    function determineWinner(Bet bet) internal returns(address winner)      // @dev maybe add a bool incase there is a tie or something
    {
        //determines winner using the orcalized data
        address winner;

        //implement logic for checking winner @dev


        return winner;
    }

    //Probably create a chron job that will call this function or something @dev
    function checkBets(bytes32 date) external onlyContracts
    {
        //only allows certain addresses to call this function (Namely the server hopefully)
        uint256 size = betList[date].length;
        for(uint256 i = 0; i < size; i++)
        {
            address winner = determineWinner(betList[date][i]);
            uint128 balance = betList[date][i].pot;

            //delete the bet to guard against reentrancy attack before paying out
            delete betList[date][i];

            payout(winner, balance);
        }
    }


    //adding bets
    function addBet(address g1, address g2, bytes32 t1, bytes t2, bytes32 op, bytes32 critera, uint128 pot, bytes32 date) external onlyContracts
    {
        betList[date].push(Bet.new(g1, g2, t1, t2, op, critera, pot));
    }

}