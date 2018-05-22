// MetaMask injects the web3 library for us.
window.onload = function() 
{
  if (typeof web3 === 'undefined') 
  {
	document.getElementById('meta-mask-required').innerHTML = 'You need <a href="https://metamask.io/">MetaMask</a> browser plugin to run this program';
	return false;	//need to test whether this automatically goes away or if the page needs to be refreshed.
  }
  else
  {
	  web3.eth.getAccounts(function(err, accounts){
		if (err != null)
		{
			document.getElementById('meta-mask-required').innerHTML = 'An error occured' + err;
			return false;	//need to test whether this automatically goes away or if the page needs to be refreshed.
		}
		else 
		{
			if (accounts.length == 0) 
			{
				document.getElementById('meta-mask-required').innerHTML = 'You need to log in to your metamask account';
				return false;		//need to test whether this automatically goes away or if the page needs to be refreshed.
			}
		}		
		});
   }
   
	var contractAddress = "0x0481A30cEcfb10036f4fb0c4B5DF67AC8B415f41";		//need updated address
	var abiOfContract = [ { "constant": false, "inputs": [ { "name": "g1", "type": "address" }, { "name": "g2", "type": "address" }, { "name": "t1", "type": "bytes32" }, { "name": "t2", "type": "bytes32" }, { "name": "op", "type": "bytes32" }, { "name": "critera", "type": "bytes32" }, { "name": "pot", "type": "uint256" }, { "name": "date", "type": "bytes32" } ], "name": "addBetEx", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "deleteOwner", "type": "address" } ], "name": "removeOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "kill", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "bid", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "p1", "type": "bytes32" }, { "name": "p2", "type": "bytes32" }, { "name": "comp", "type": "bytes32" }, { "name": "compCrit", "type": "bytes32" }, { "name": "cost", "type": "uint256" }, { "name": "date", "type": "bytes32" } ], "name": "addAuction", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "currentDate", "type": "bytes32" } ], "name": "cleanUpAuctions", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "newContract", "type": "address" } ], "name": "addContract", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "withdrawBalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "showOwners", "outputs": [ { "name": "ownerNumbers", "type": "uint256", "value": "1" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "addOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "getAuction", "outputs": [ { "name": "player1", "type": "bytes32", "value": "0x0000000000000000000000000000000000000000000000000000000000000000" }, { "name": "player2", "type": "bytes32", "value": "0x0000000000000000000000000000000000000000000000000000000000000000" }, { "name": "comparisonOp", "type": "bytes32", "value": "0x0000000000000000000000000000000000000000000000000000000000000000" }, { "name": "comparisonCriteria", "type": "bytes32", "value": "0x0000000000000000000000000000000000000000000000000000000000000000" }, { "name": "cost", "type": "uint256", "value": "0" }, { "name": "writer", "type": "address", "value": "0x0000000000000000000000000000000000000000" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "cancelAuction", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "availableAuctions", "outputs": [ { "name": "auctions", "type": "uint256[]", "value": [] } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "deleteContract", "type": "address" } ], "name": "removeContract", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "date", "type": "bytes32" } ], "name": "numBets", "outputs": [ { "name": "size", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "writer", "type": "address" }, { "indexed": false, "name": "id", "type": "uint256" } ], "name": "AuctionCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "writer", "type": "address" }, { "indexed": false, "name": "id", "type": "uint256" } ], "name": "AuctionCancelled", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "winner", "type": "address" }, { "indexed": false, "name": "payout", "type": "uint256" } ], "name": "Payout", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "g1", "type": "address" }, { "indexed": false, "name": "g2", "type": "address" }, { "indexed": false, "name": "p1", "type": "bytes32" }, { "indexed": false, "name": "p2", "type": "bytes32" }, { "indexed": false, "name": "comp", "type": "bytes32" }, { "indexed": false, "name": "compCrit", "type": "bytes32" }, { "indexed": false, "name": "pot", "type": "uint256" }, { "indexed": false, "name": "date", "type": "bytes32" } ], "name": "BetCreated", "type": "event" } ];
	var contractABI = web3.eth.contract(abiOfContract);
	var myContract = contractABI.at(contractAddress);
	
	int[] array = myContract.availableAuctions();
	document.getElementById('openAuctions').innerHTML = "<div class='list-group'>";
	
	for(int i=0; i < array.length(); i++)
	{
		//not sure how to get multiple different variables from this return statement.
		// @dev
		myContract.getAuction(array[i]);	
		document.getElementById('openAuctions').innerHTML += "<a class='list-group-item clickable-row' onclick=acceptBet(" + array[i] + ", " + cost + ")>";
		document.getElementById('openAuctions').innerHTML += team1 + " beats " + team2 + "<br> Cost (in Wei)" + cost + "<br> Click to accept Bet </a>";
		
	}
   document.getElementById('openAuctions').innerHTML += "</div>";
}

function send() 
{
  web3.eth.sendTransaction({
	from: web3.eth.coinbase,
	to: '0x9D5A2e6b7B556A80fc9164d41d4e6433c5D3CB3d',
	value: web3.toWei(document.getElementById("amount").value, 'ether')
  }, function(error, result) {
	if (!error) {
	  document.getElementById('response').innerHTML = 'Success: <a href="https://testnet.etherscan.io/tx/' + result + '"> success </a>'	
	} else {
	  document.getElementById('response').innerHTML = '<pre>' + error + '</pre>'
	}
  });
}

function acceptBet(int id, int cost)
{
	var contractAddress = "0x0481A30cEcfb10036f4fb0c4B5DF67AC8B415f41";		//need updated address
	var abiOfContract = [ { "constant": false, "inputs": [ { "name": "g1", "type": "address" }, { "name": "g2", "type": "address" }, { "name": "t1", "type": "bytes32" }, { "name": "t2", "type": "bytes32" }, { "name": "op", "type": "bytes32" }, { "name": "critera", "type": "bytes32" }, { "name": "pot", "type": "uint256" }, { "name": "date", "type": "bytes32" } ], "name": "addBetEx", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "deleteOwner", "type": "address" } ], "name": "removeOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "kill", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "bid", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "p1", "type": "bytes32" }, { "name": "p2", "type": "bytes32" }, { "name": "comp", "type": "bytes32" }, { "name": "compCrit", "type": "bytes32" }, { "name": "cost", "type": "uint256" }, { "name": "date", "type": "bytes32" } ], "name": "addAuction", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "currentDate", "type": "bytes32" } ], "name": "cleanUpAuctions", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "newContract", "type": "address" } ], "name": "addContract", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "withdrawBalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "showOwners", "outputs": [ { "name": "ownerNumbers", "type": "uint256", "value": "1" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "addOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "getAuction", "outputs": [ { "name": "player1", "type": "bytes32", "value": "0x0000000000000000000000000000000000000000000000000000000000000000" }, { "name": "player2", "type": "bytes32", "value": "0x0000000000000000000000000000000000000000000000000000000000000000" }, { "name": "comparisonOp", "type": "bytes32", "value": "0x0000000000000000000000000000000000000000000000000000000000000000" }, { "name": "comparisonCriteria", "type": "bytes32", "value": "0x0000000000000000000000000000000000000000000000000000000000000000" }, { "name": "cost", "type": "uint256", "value": "0" }, { "name": "writer", "type": "address", "value": "0x0000000000000000000000000000000000000000" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "cancelAuction", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "availableAuctions", "outputs": [ { "name": "auctions", "type": "uint256[]", "value": [] } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "deleteContract", "type": "address" } ], "name": "removeContract", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "date", "type": "bytes32" } ], "name": "numBets", "outputs": [ { "name": "size", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "writer", "type": "address" }, { "indexed": false, "name": "id", "type": "uint256" } ], "name": "AuctionCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "writer", "type": "address" }, { "indexed": false, "name": "id", "type": "uint256" } ], "name": "AuctionCancelled", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "winner", "type": "address" }, { "indexed": false, "name": "payout", "type": "uint256" } ], "name": "Payout", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "g1", "type": "address" }, { "indexed": false, "name": "g2", "type": "address" }, { "indexed": false, "name": "p1", "type": "bytes32" }, { "indexed": false, "name": "p2", "type": "bytes32" }, { "indexed": false, "name": "comp", "type": "bytes32" }, { "indexed": false, "name": "compCrit", "type": "bytes32" }, { "indexed": false, "name": "pot", "type": "uint256" }, { "indexed": false, "name": "date", "type": "bytes32" } ], "name": "BetCreated", "type": "event" } ];
	var contractABI = web3.eth.contract(abiOfContract);
	var myContract = contractABI.at(contractAddress);
	
	myContract.bid(id, {"value": cost}, function(error, result){
		if(error)
		{
			console.log(error);
		}
		});
}

	