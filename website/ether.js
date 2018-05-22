// MetaMask injects the web3 library for us.
    window.onload = function() 
	{
      if (typeof web3 === 'undefined') 
	  {
        document.getElementById('meta-mask-required').innerHTML = 'You need <a href="https://metamask.io/">MetaMask</a> browser plugin to run this example';
      }
	  else
	  {
		  web3.eth.getAccounts(function(err, accounts){
			if (err != null)
				document.getElementById('meta-mask-required').innerHTML = 'An error occured' + err;
			else 
				if (accounts.length == 0) 
					document.getElementById('meta-mask-required').innerHTML = 'You need to log in to your metamask account'
			});
	   }
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
	
	function testingStuff() 
	{
		/**********Gets the balance of ether at a specified address ***************
		var address = document.getElementById("address").value;
		console.log(address);
		var balance = web3.eth.getBalance(address, function(error, result) {
			if (!error) {
			  document.getElementById('response').innerHTML = 'Success: <a>' + web3.fromWei(result, 'ether') + '</a>'		//outputs the amount of ether at the input address in the rinkby network.
			} else {
			  document.getElementById('response').innerHTML = '<pre>' + error + '</pre>'
			}
		});
		***************************************************/
		
		
		//gets balance of generic card game at a address.
		/*
		var contractAddress = "0x4D10a823165027c93206D3d8092c825CeE5e4cc2";
		var abiOfContract = [ { "constant": true, "inputs": [ { "name": "_interfaceID", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string", "value": "GenericCardGame" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" } ], "name": "approve", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256", "value": "52" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" } ], "name": "transferFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256[]" } ], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "cardIndexToApproved", "outputs": [ { "name": "", "type": "address", "value": "0x0000000000000000000000000000000000000000" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_tokenId", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "name": "owner", "type": "address", "value": "0x9d5a2e6b7b556a80fc9164d41d4e6433c5d3cb3d" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "newContractAddress", "outputs": [ { "name": "", "type": "address", "value": "0x0000000000000000000000000000000000000000" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "count", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "cardIndexToOwner", "outputs": [ { "name": "", "type": "address", "value": "0x9d5a2e6b7b556a80fc9164d41d4e6433c5d3cb3d" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "secondsPerBlock", "outputs": [ { "name": "", "type": "uint256", "value": "15" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "tokensOfOwner", "outputs": [ { "name": "ownerTokens", "type": "uint256[]", "value": [] } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getCard", "outputs": [ { "name": "suit", "type": "uint16", "value": "0" }, { "name": "value", "type": "uint16", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string", "value": "GCG" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" } ], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "from", "type": "address" }, { "indexed": false, "name": "to", "type": "address" }, { "indexed": false, "name": "tokenId", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "owner", "type": "address" }, { "indexed": false, "name": "approved", "type": "address" }, { "indexed": false, "name": "tokenId", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "owner", "type": "address" }, { "indexed": false, "name": "cardID", "type": "uint256" }, { "indexed": false, "name": "suit", "type": "uint16" }, { "indexed": false, "name": "value", "type": "uint16" } ], "name": "Birth", "type": "event" } ];
		var contractABI = web3.eth.contract(abiOfContract);
		var myContract = contractABI.at(contractAddress);*/
		
		/*
		//0x719A2789cB4e2922D11E5cC6CE3fB6e183c8415b		//laptop
		//0x9D5A2e6b7B556A80fc9164d41d4e6433c5D3CB3d		//desktop
		myContract.balanceOf("0x719A2789cB4e2922D11E5cC6CE3fB6e183c8415b", function(error, result){
			//console.log(result);
		});
		
		//Gets the card value using the card id
		var cardID = 2;
		myContract.getCard(cardID, function(error, result){
			//console.log(result);
			console.log('suit: ' + result[0]['c'][0]);
			console.log('value: ' + result[1]['c'][0]);
		});*/
		
		/*
		//Transfer single generic cards
		var tokens = [4];
		myContract.transfer('0x9D5A2e6b7B556A80fc9164d41d4e6433c5D3CB3d', tokens, function(error, result){
			if (!error) {
			  //console.log(result);		//returns the TxHash
			} else {
			  console.log(error);
			}
		});
		*/
		/*
		//Transfer multiple generic cards
		var tokens = [2,3];
		myContract.transfer('0x9D5A2e6b7B556A80fc9164d41d4e6433c5D3CB3d', tokens, function(error, result){
			if (!error) {
			  //console.log(result);		//returns the TxHash
			} else {
			  console.log(error);
			}
		});*/
		
		var contractAddress = "0x930c33F869303D3FbEAb7EdE98c2e6b409946ce5";
		var abiOfContract = [ { "constant": true, "inputs": [ { "name": "_interfaceID", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string", "value": "birthing" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" } ], "name": "approve", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "deleteOwner", "type": "address" } ], "name": "removeOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256", "value": "52" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" } ], "name": "transferFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256[]" } ], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "cardIndexToApproved", "outputs": [ { "name": "", "type": "address", "value": "0x0000000000000000000000000000000000000000" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "createCardPack", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "getCurrentPriceOfPack", "outputs": [ { "name": "currentPrice", "type": "uint256", "value": "500000000000000000" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "kill", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "withdrawBalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "showOwners", "outputs": [ { "name": "ownerAddresses", "type": "address[]", "value": [ "0x2212e9408450d64fa9aec83c6169eb82ec4f9b14", "0x0000000000000000000000000000000000000000" ] } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_tokenId", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "name": "owner", "type": "address", "value": "0x9d5a2e6b7b556a80fc9164d41d4e6433c5d3cb3d" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "newContractAddress", "outputs": [ { "name": "", "type": "address", "value": "0x0000000000000000000000000000000000000000" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "addOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "count", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "cardIndexToOwner", "outputs": [ { "name": "", "type": "address", "value": "0x9d5a2e6b7b556a80fc9164d41d4e6433c5d3cb3d" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "secondsPerBlock", "outputs": [ { "name": "", "type": "uint256", "value": "15" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "tokensOfOwner", "outputs": [ { "name": "ownerTokens", "type": "uint256[]", "value": [] } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getCard", "outputs": [ { "name": "suit", "type": "uint16", "value": "0" }, { "name": "value", "type": "uint16", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string", "value": "birth" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" } ], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "newPrice", "type": "uint256" } ], "name": "changeCardPackPrice", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "tokenId1", "type": "uint256" }, { "indexed": false, "name": "tokenId2", "type": "uint256" }, { "indexed": false, "name": "tokenId3", "type": "uint256" }, { "indexed": false, "name": "tokenId4", "type": "uint256" }, { "indexed": false, "name": "tokenId5", "type": "uint256" }, { "indexed": false, "name": "tokenId6", "type": "uint256" }, { "indexed": false, "name": "tokenId7", "type": "uint256" }, { "indexed": false, "name": "tokenId8", "type": "uint256" } ], "name": "CardPackCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "from", "type": "address" }, { "indexed": false, "name": "to", "type": "address" }, { "indexed": false, "name": "tokenId", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "owner", "type": "address" }, { "indexed": false, "name": "approved", "type": "address" }, { "indexed": false, "name": "tokenId", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "owner", "type": "address" }, { "indexed": false, "name": "cardID", "type": "uint256" }, { "indexed": false, "name": "suit", "type": "uint16" }, { "indexed": false, "name": "value", "type": "uint16" } ], "name": "Birth", "type": "event" } ];
		var contractABI = web3.eth.contract(abiOfContract);
		var myContract = contractABI.at(contractAddress);
			
			//another example of sending money
			//{"value": web3.toWei("1.0", "ether")}
		
		//sends the specified value from the contract and gets a card pack in return.
		myContract.getCurrentPriceOfPack(function(error, result){
			var amount = result.toNumber();
			
			myContract.createCardPack({"value": amount}, function(error, result){
			if(error)
			{
				console.log(error);
			}
			});
		});		
		
		/* 
		//only works if you are one of the owners.
		myContract.changeCardPackPrice(web3.toWei("1.0", "ether"), function(error, result){
		
		});
		*/
		
    }
	
	
	function createAuction()
	{
		var team1 = document.getElementById("team1").value;
		var team2 = document.getElementById("team2").value;
		var winner = document.getElementById("winner").value;
		var cost = document.getElementById("cost").value;
		var date = document.getElementById("date").value;
		var greaterOp = ">";
		var score = "Score";
		
		//convert all string variables to bytes32
		
		var contractAddress = "0x930c33F869303D3FbEAb7EdE98c2e6b409946ce5";		//need updated address
		var abiOfContract = //input without quotes
		var contractABI = web3.eth.contract(abiOfContract);
		var myContract = contractABI.at(contractAddress);
		
		
		//not entirely sure amount the value thing 
		//ie how it works with other variables...
		if(winner == team1)
		{
			myContract.createAuction(team1, team2, greaterOp, score, cost, date, {"value": amount}, function(error, result){
			if(error)
			{
				console.log(error);
			}
			});
		}
		else
		{
			myContract.createAuction(team2, team1, greaterOp, score, cost, date, {"value": amount}, function(error, result){
			if(error)
			{
				console.log(error);
			}
			});
		}	
		
	}
	