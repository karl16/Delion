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
   
	var contractAddress = "0x930c33F869303D3FbEAb7EdE98c2e6b409946ce5";		//need updated address
	var abiOfContract = //input without quotes
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
	var contractAddress = "0x930c33F869303D3FbEAb7EdE98c2e6b409946ce5";		//need updated address
	var abiOfContract = //input without quotes
	var contractABI = web3.eth.contract(abiOfContract);
	var myContract = contractABI.at(contractAddress);
	
	myContract.bid(id, {"value": cost}, function(error, result){
		if(error)
		{
			console.log(error);
		}
		});
}

	