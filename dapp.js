// @TODO: Update this address to match your deployed DealerlessMarket contract!
//const marketContractAddress = "0xd22c15A4eC20963ee61e741f96F3f65Ecf5DaAF0";
//const rentalContractAddress = "0x33E81cfF891EC074721e879753C0B752FaD81ee8";

const marketContractAddress = "0x32813a28AF59d90381A6cFBF57A57B069E0690a3";
const rentalContractAddress = "0xD7cE93961EB65dd39DcEf12FcF343889FbF77879";


const dApp = {
  ethEnabled: function() {
    // If the browser has an Ethereum provider (MetaMask) installed
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
      return true;
    }
    return false;
  },
  init: async function() {
    // Initialize web3
    if (!this.ethEnabled()) {
      alert("Please install MetaMask to use this dApp!");
    }

    this.accounts = await window.web3.eth.getAccounts();
    this.marketContractAddress = marketContractAddress;
    this.propertyJson = await (await fetch("./build/contracts/Property.json")).json();
    this.marketJson = await (await fetch("./build/contracts/DealerlessMarket.json")).json();
    this.auctionJson = await (await fetch("./build/contracts/DealerlessAuction.json")).json();
    this.rentalsJson = await (await fetch("./build/contracts/DealerlessRental.json")).json();
    this.marsContract = new window.web3.eth.Contract(
      this.marketJson,
      this.marketContractAddress,
      { defaultAccount: this.accounts[0] }
    );
    
    this.rentalContract = new window.web3.eth.Contract(
      this.rentalsJson,
      this.rentalContractAddress,
      { defaultAccount: this.accounts[0] }
    ).deploy({
      arguments: [0x33E81cfF891EC074721e879753C0B752FaD81ee8],
    });

    console.log("Contract object", this.marsContract);
    console.log("Contract Rental object", this.rentalContract);
    
    this.isAdmin = this.accounts[0] == await this.marsContract.methods.owner().call();

  },
  collectVars: async function() {
    // get land tokens
    this.tokens = [];
    this.totalNumberOfItems = await this.marsContract.methods.totalNumberOfItems().call();

    // fetch json metadata from IPFS (name, description, image, etc)
    
    const fetchMetadata = (reference_uri) => fetch(`https://gateway.pinata.cloud/ipfs/${reference_uri.replace("ipfs://", "")}`, { mode: "cors" }).then((resp) => resp.json());

    for (let i = 1; i <= this.totalNumberOfItems; i++) {
      try {
        const token_uri = await this.marsContract.methods.itemURI(i).call();
        console.log('Item uri', token_uri)
        const token_json = await fetchMetadata(token_uri);
        console.log('Item json', token_json)
        this.tokens.push({
          tokenId: i,
          highestBid: Number(await this.marsContract.methods.highestBid(i).call()),
          auctionEnded: Boolean(await this.marsContract.methods.auctionEnded(i).call()),
          pendingReturn: Number(await this.marsContract.methods.pendingReturn(i, this.accounts[0]).call()),
          auction: new window.web3.eth.Contract(
            this.auctionJson,
            await this.marsContract.methods.auctions(i).call(),
            { defaultAccount: this.accounts[0] }
          ),
          owner: await this.marsContract.methods.ownerOf(i).call(),
          ...token_json
        });
      } catch (e) {
        console.log(JSON.stringify(e));
      }
    }
  },
  setAdmin: async function() {
    // if account selected in MetaMask is the same as owner then admin will show
    if (this.isAdmin) {
      $(".dapp-admin").show();
    } else {
      $(".dapp-admin").hide();
    }
  },
  getOwnerDiv : async function(token){
   // if (token.owner == contract_owner){
      
        //return owner;
  },
  updateUI: async function() {
    console.log("updating UI");
    // refresh variables
    await this.collectVars();
    const contract_owner = this.accounts[0];
    
    $("#content div.row").html(this.tokens.length==0?"<div class='col text-center'>No Property Available..</div>" : '');
    this.tokens.forEach((token) => {
      try {
        let endAuction = `<a token-id="${token.tokenId}" class="dapp-admin" style="display:none;" href="#" onclick="dApp.endAuction(event)">End Auction</a>`;
        let bid = `<a token-id="${token.tokenId}" href="#" onclick="dApp.bid(event);">Bid</a>`;
        let owner = `Owner: ${token.owner}`;
        console.log(contract_owner)
        //owner = this.getOwnerDiv(token);
        let optRent = '<div class="btn"><span>Owner</span></div>';
        if (token.owner == contract_owner){
          optRent = `<div >
                    <button id="rent-${token.tokenId}" type="button" class="btn btn-danger waves-effect waves-light" data-toggle="modal" data-target="#rentalModal" data-tokenId='${token.tokenId}' data-whatever="@mdo">RENT</button>
                  </div>`
        }
        owner = `
            <div class="file-field input-field">
                ${optRent}
              <div class="file-path-wrapper left-pad">
                <input class="validate" type="text" value="${token.owner}" disabled>
              </div
            </div>`;
            //owner += ` <br/><a class="waves-effect waves-light btn modal-trigger" id="rent-${token.tokenId}" href="#ready-to-rent-modal">Rent<i class="material-icons right">send</i></a>`;

        let withdraw = `<a token-id="${token.tokenId}" href="#" onclick="dApp.withdraw(event)">Withdraw</a>`
        let pendingWithdraw = `<p>Balance: ${token.pendingReturn} wei</p>`;
          $("#content div.row").append(
            `<div class="col-md-6">
              <div class="properties-item card">
                <div class="card-image">
                  <img id="dapp-image" src="${token.image}">
                  <span id="dapp-name" class="card-title properties-info text-white">${token['address-1']}
                  <p><i class="fa fa-map-marker"></i> ${token['address-2']}</p></span>
                 
                </div>
                <div class="card-action">
                    <div class="file-field input-field">
                      <div class="btn">
                        <span>WEI</span>
                      </div>
                      <div class="file-path-wrapper">
                        <input id='wei-${token.tokenId}' class='form-control' type="number" min="${token.highestBid == 0? token.minBid : token.highestBid + 1}" name="dapp-wei" value="${token.highestBid == 0? token.minBid : token.highestBid + 1}" ${token.auctionEnded ? 'disabled' : ''}>
                      </div>
                  </div>
                  ${token.auctionEnded ? owner : bid}
                  ${token.pendingReturn > 0 ? withdraw : ''}
                  ${token.pendingReturn > 0 ? pendingWithdraw : ''}
                  ${this.isAdmin && !token.auctionEnded ? endAuction : ''}
                </div>
              </div>
            </div>`
          );
      } catch (e) {
        alert(JSON.stringify(e));
      }
    });

    // hide or show admin functions based on contract ownership
    this.setAdmin();
  },
  bid: async function(event) {
    const tokenId = $(event.target).attr("token-id");
	//alert($(event.target));
	alert($('#wei-'+tokenId).val());
    const wei = Number($('#wei-'+tokenId).val());
    console.log(wei);
    await this.marsContract.methods.bid(tokenId).send({from: this.accounts[0], value: wei}).on("receipt", async (receipt) => {
      M.toast({ html: "Transaction Mined! Refreshing UI..." });
      await this.updateUI();
    });
  },
  endAuction: async function(event) {
	  	alert("endAuction async function This is to test Alert()");

    const tokenId = $(event.target).attr("token-id");
    await this.marsContract.methods.endAuction(tokenId).send({from: this.accounts[0]}).on("receipt", async (receipt) => {
      M.toast({ html: "Transaction Mined! Refreshing UI..." });
      await this.updateUI();
    });
  },
  withdraw: async function(event) {
	  	alert("withdraw async function This is to test Alert()");

    const tokenId = $(event.target).attr("token-id") - 1;
    await this.tokens[tokenId].auction.methods.withdraw().send({from: this.accounts[0]}).on("receipt", async (receipt) => {
      M.toast({ html: "Transaction Mined! Refreshing UI..." });
      await this.updateUI();
    });
  },
  registerLand: async function() {
    const form_data = $('#admin-section form').serializeArray()
    const house_data = {};
    form_data.forEach(function(data){
      if (!data.value) {
        M.toast({ html: "Please fill out then entire form!" });
        return;
      }
      house_data[data.name] = data.value;
    });
    pinata_api_key = house_data['pinata-public-key'];
    pinata_secret_api_key = house_data['pinata-private-key'];

    delete house_data['pinata-public-key'];
    delete house_data['pinata-private-key'];

    console.log(house_data);
    try {
      M.toast({ html: "Uploading JSON..." });

      const reference_json = JSON.stringify({
        pinataContent: house_data,
        pinataOptions: {cidVersion: 1}
      });

      const json_upload_response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          pinata_api_key,
          pinata_secret_api_key
        },
        body: reference_json
      });

      const reference_hash = await json_upload_response.json();
      const reference_uri = `ipfs://${reference_hash.IpfsHash}`;

      M.toast({ html: `Success. Reference URI located at ${reference_uri}.` });
      M.toast({ html: "Sending to blockchain..." });

      await this.marsContract.methods.registerLand(reference_uri).send({from: this.accounts[0]}).on("receipt", async (receipt) => {
        M.toast({ html: "Transaction Mined! Refreshing UI..." });
        window.location.reload()
        //await this.updateUI();
      });

    } catch (e) {
      alert("ERROR:", JSON.stringify(e));
    }
  },
  readyToRent: async function(event){
    const tokenId = $('#rentalModal #tokenId').val();
    const deposit = +$('#rentalModal #deposit').val();
    const rent = +$('#rentalModal #rent').val();
	alert(deposit);
	alert(rent);
    await this.rentalContract.methods.readyToRent(tokenId, deposit, rent).send({from: this.accounts[0]}).on("receipt", async (receipt) => {
      M.toast({ html: "Updated Successfully..." });
      await this.updateUI();
    });
  },
  isUnderRental : async function(tokenId){

  },
  main: async function() {
    // Initialize web3
    await this.init();
    await this.updateUI();
  }
};

dApp.main();