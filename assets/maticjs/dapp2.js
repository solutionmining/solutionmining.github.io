let web3;

const contractAddress = "0xc99F9767dd2A4be698732431f09bc5dFe8aeE1B3"; //solution mining

var spAccount = "Invalid Wallet!";
var contract;
var defaultAccount;
var prevAccount;

var availableBNB = 0;
var tokenBalance = 0;
var isMobile = false;
var hasWeb3 = false;
var contractLoaded = false;

window.addEventListener('load', Connect)

async function Connect() {
	
    if (window.ethereum) 
	{
        console.log('Ethereum Detected!');	
		web3 = new web3js.myweb3(window.ethereum);
        try {
            await ethereum.enable()

            let accounts = await web3.eth.getAccounts()
            defaultAccount = accounts[0]
			anyUpdate();
		    hasWeb3 = true;
            return
        } catch (error) {
            console.error(error)
        }
    
	}else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider)
        let accounts = await web3.eth.getAccounts()
        defaultAccount = accounts[0]
        anyUpdate();
        return
    }
    /*else{
		console.log('No Web3 Detected... using HTTP Provider')
		web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.binance.org:443"));
		loadContract();
	}	
	*/
    setTimeout(checkForBinanceChain, 1500)
}

async function checkForBinanceChain() {
    try {
        await window.BinanceChain.enable()
        console.log(typeof(window.BinanceChain))
        if (window.BinanceChain) {
            console.log('BinanceChain')
            await BinanceChain.enable()
            window.web3 = new Web3(window.BinanceChain)
            let accounts = await web3.eth.getAccounts()
            defaultAccount = accounts[0]
            anyUpdate()
            return
        }
    } catch (e) {}
} 


function anyUpdate() {
	loadContract();
	loadAccount();	
	setTimeout(anyUpdate, 10000)	
}


async function loadContract()
{
	contract = new web3.eth.Contract(contractABI, contractAddress);
	console.log('Contract Loaded: ' + contract);
    
    
    let balance = await web3.eth.getBalance(contractAddress);
	$('#contractBalance').html(parseFloat(web3.utils.fromWei(balance, 'ether')).toFixed(4) + ' POL');
    
    let num;
	await contract.methods.invested().call().then(function(result){ num = result; });
	let invested = web3.utils.fromWei(num, 'ether');
	$('#invested').html(parseFloat(invested).toFixed(4) + ' POL');
	
	await contract.methods.ref_bonus().call().then(function(result){ num = result; });
	$('#rewards').html(parseFloat(web3.utils.fromWei(num, 'ether')).toFixed(4) + ' POL');
	
	await contract.methods.withdrawn().call().then(function(result){ num = result; });
	let withdrawn = web3.utils.fromWei(num, 'ether');
	$('#withdrawn').html(parseFloat(withdrawn).toFixed(4) + ' POL');
	
}


async function loadAccount()
{
    let addrs = await window.ethereum.enable();
	defaultAccount = web3.utils.toChecksumAddress(addrs[0]);
	console.log('Loading default Account..'+defaultAccount);    
     
    //$('#my-wallet1').html(defaultAccount); 
     
    let balance1 = await web3.eth.getBalance(defaultAccount);
	myBalance = web3.utils.fromWei(balance1, 'ether');
	$('#my-balance').html( parseFloat(myBalance).toFixed(4) + ' POL');
    $('#my-balance2').html( parseFloat(myBalance).toFixed(4) + ' POL');
    console.log('MATIC Balance: ' + parseFloat(myBalance).toFixed(4));
    
    await contract.methods.balanceOf(defaultAccount).call().then(function(result){ 
        tokenBalance = parseFloat(web3.utils.fromWei(result)).toFixed(3);
        $('#token-balance').html(tokenBalance);
        $('#token-balance2').html(tokenBalance);
    });
    
    await contract.methods.userInfo(defaultAccount).call().then(function(result){ 
			
		availableBNB = parseFloat(web3.utils.fromWei(result[0])).toFixed(6);
		console.log('Available BNB:' + availableBNB);
		$('#my-bnb').html(availableBNB);
        
        let inv = parseFloat(web3.utils.fromWei(result[1]));    	
        console.log('My Investments:' + inv);
		$('#my-investments').html(parseFloat( inv ).toFixed(4) + ' POL');
        
        let harvested = parseFloat(web3.utils.fromWei(result[2]));
        console.log('Withdrawn:' + harvested);
		$('#my-harvests').html(parseFloat( harvested ).toFixed(4) + ' POL');
        
        let refbonus = parseFloat(web3.utils.fromWei(result[3]));
        console.log('Commissions:' + refbonus);
		$('#my-drb').html(parseFloat( refbonus ).toFixed(4) + ' POL');
        
		var structure = result[6];
        for (let i = 0; i < structure.length; i++) {
            $('#referralsCountAtLevel' + (i + 1)).html(structure[i])
        }
         
        if(inv > 0){
            console.log('Displaying ref link..');
            $('#my-referral').val('https://solutionmining.github.io/index.html?ref='+defaultAccount);
        }else{
            $('#my-referral').val('You will have your REF link after your activation.');
        }
     }); 
     
   
    await contract.methods.players(defaultAccount).call().then(function(result){ 
        //$('#withdrawalByUser').html(parseFloat(web3.utils.fromWei(result[7])).toFixed(4) );
		if(result[0] != '0x0000000000000000000000000000000000000000')
		{
		    spAccount = result[0];
	        $('#sp-address').html(spAccount); 
		}
		console.log('SpAccount: '+spAccount);
		
    });	
		
		
	prevAccount = defaultAccount;
	
    var acct = defaultAccount.toString(); 
    var connectedAddr = acct[0] + 
                                acct[1] + 
                                acct[2] + 
                                acct[3] + 
                                acct[4] + 
                                acct[5] + '...' +
                                acct[acct.length-6] + 
                                acct[acct.length-5] + 
                                acct[acct.length-4] + 
                                acct[acct.length-3] + 
                                acct[acct.length-2] + 
                                acct[acct.length-1];
    
    $("#connect-wallet").html(connectedAddr);	
    
    connectedAddr = acct[0] + 
                                acct[1] + 
                                acct[2] + 
                                acct[3] + 
                                acct[4] + 
                                acct[5] + 
                                acct[6] + '...' +
                                acct[acct.length-6] + 
                                acct[acct.length-5] + 
                                acct[acct.length-4] + 
                                acct[acct.length-3] + 
                                acct[acct.length-2] + 
                                acct[acct.length-1];
    
    $("#my-wallet1").html(connectedAddr);	
    
}



function timeConverter(createdAt) {
    var date = new Date(createdAt);
	date.toUTCString()
	var year = date.getUTCFullYear();
	var month = date.getUTCMonth()+1;
	var day = date.getUTCDate();
	
	var hour = date.getUTCHours();
	var minute = date.getUTCMinutes();
	var second = date.getUTCSeconds();
	
	return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
}


async function deposit1() {
    if (!web3 || defaultAccount === '' || spAccount === '' || defaultAccount === '---' || spAccount === 'Invalid Wallet!') {
        console.error("Invalid wallet or web3 setup.");
        return false;
    }

    try {
        const value = web3.utils.toWei($("#txtamount1").val(), "ether");
        const gasPrice = await web3.eth.getGasPrice();

        console.log(`Initiating deposit1...`);
        const transaction = await contract.methods.MakeDeposit(spAccount, "210").send({
            from: defaultAccount,
            value: value,
            gasPrice
        });

        const receipt = await web3.eth.getTransactionReceipt(transaction.transactionHash);

        // Calculate gas fee
        const gasUsed = receipt.gasUsed;
        const totalGasFeeInWei = BigInt(gasUsed) * BigInt(gasPrice);
        const gasFeeInEth = web3.utils.fromWei(totalGasFeeInWei.toString(), 'ether');

        console.log(`Deposit1 successful!`);
        console.log(`Transaction Fee: ${gasFeeInEth} ETH`);
        console.log(`Gas Price: ${web3.utils.fromWei(gasPrice, 'gwei')} Gwei`);
        console.log(`Gas Limit & Usage by Txn: ${transaction.gas} | ${gasUsed} (${((gasUsed / transaction.gas) * 100).toFixed(2)}%)`);

        loadContract();
        loadAccount();
    } catch (err) {
        console.error("Deposit1 failed:", err);
    }
}

async function deposit2() {
    if (!web3 || defaultAccount === '' || spAccount === '' || defaultAccount === '---' || spAccount === 'Invalid Wallet!') {
        console.error("Invalid wallet or web3 setup.");
        return false;
    }

    try {
        const value = web3.utils.toWei($("#txtamount2").val(), "ether");
        const gasPrice = await web3.eth.getGasPrice();

        console.log(`Initiating deposit2...`);
        const transaction = await contract.methods.MakeDeposit(spAccount, "240").send({
            from: defaultAccount,
            value: value,
            gasPrice
        });

        const receipt = await web3.eth.getTransactionReceipt(transaction.transactionHash);

        // Calculate gas fee
        const gasUsed = receipt.gasUsed;
        const totalGasFeeInWei = BigInt(gasUsed) * BigInt(gasPrice);
        const gasFeeInEth = web3.utils.fromWei(totalGasFeeInWei.toString(), 'ether');

        console.log(`Deposit2 successful!`);
        console.log(`Transaction Fee: ${gasFeeInEth} ETH`);
        console.log(`Gas Price: ${web3.utils.fromWei(gasPrice, 'gwei')} Gwei`);
        console.log(`Gas Limit & Usage by Txn: ${transaction.gas} | ${gasUsed} (${((gasUsed / transaction.gas) * 100).toFixed(2)}%)`);

        loadContract();
        loadAccount();
    } catch (err) {
        console.error("Deposit2 failed:", err);
    }
}

async function deposit3() {
    if (!web3 || defaultAccount === '' || spAccount === '' || defaultAccount === '---' || spAccount === 'Invalid Wallet!') {
        console.error("Invalid wallet or web3 setup.");
        return false;
    }

    try {
        const value = web3.utils.toWei($("#txtamount3").val(), "ether");
        const gasPrice = await web3.eth.getGasPrice();

        console.log(`Initiating deposit3...`);
        const transaction = await contract.methods.MakeDeposit(spAccount, "270").send({
            from: defaultAccount,
            value: value,
            gasPrice
        });

        const receipt = await web3.eth.getTransactionReceipt(transaction.transactionHash);

        // Calculate gas fee
        const gasUsed = receipt.gasUsed;
        const totalGasFeeInWei = BigInt(gasUsed) * BigInt(gasPrice);
        const gasFeeInEth = web3.utils.fromWei(totalGasFeeInWei.toString(), 'ether');

        console.log(`Deposit3 successful!`);
        console.log(`Transaction Fee: ${gasFeeInEth} ETH`);
        console.log(`Gas Price: ${web3.utils.fromWei(gasPrice, 'gwei')} Gwei`);
        console.log(`Gas Limit & Usage by Txn: ${transaction.gas} | ${gasUsed} (${((gasUsed / transaction.gas) * 100).toFixed(2)}%)`);

        loadContract();
        loadAccount();
    } catch (err) {
        console.error("Deposit3 failed:", err);
    }
}

async function collectDividends() {
    if (!web3 || defaultAccount === '') {
        console.error("Invalid wallet or web3 setup.");
        return false;
    }

    try {
        console.log(`Initiating collectDividends...`);
        const transaction = await contract.methods.getDividends().send({ from: defaultAccount });
        const receipt = await web3.eth.getTransactionReceipt(transaction.transactionHash);

        console.log(`Dividends collected successfully!`);
        console.log(`Gas Used: ${receipt.gasUsed}`);
        loadContract();
        loadAccount();
    } catch (err) {
        console.error("Failed to collect dividends:", err);
    }
}
