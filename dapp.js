// @TODO: Update this address to match your deployed DealerlessMarket contract!
const marketContractAddress = "0x6eCB11D6bAC9fe5b44C5CD8334e1D1E896e42113";
const rentalContractAddress = "0xE3b6c5b85Fbe797756594552bd41e86DCc4d2ff5";

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
    );

    console.log("Contract object", this.marsContract);
    console.log("Contract Rental object", this.rentalContract);
    
    this.isAdmin = this.accounts[0] == await this.marsContract.methods.owner().call();

  },
  collectVars: async function() {
    // get land tokens
    this.tokens = [];
    this.totalNumberOfItems = await this.marsContract.methods.totalNumberOfItems().call();

    // fetch json metadata from IPFS (name, description, image, etc)
    console.log();
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
  updateUI: async function() {
    console.log("updating UI");
    // refresh variables
    await this.collectVars();
    const contract_owner = this.accounts[0];
    $("#dapp-tokens").html("");
    this.tokens.forEach((token) => {
      try {
        let endAuction = `<a token-id="${token.tokenId}" class="dapp-admin" style="display:none;" href="#" onclick="dApp.endAuction(event)">End Auction</a>`;
        let bid = `<a token-id="${token.tokenId}" href="#" onclick="dApp.bid(event);">Bid</a>`;
        let owner = `Owner: ${token.owner}`;
        console.log(contract_owner)
        if (token.owner == contract_owner){
            owner += ` <br/><a class="waves-effect waves-light btn modal-trigger" id="rent-${token.tokenId}" href="#ready-to-rent-modal">Rent<i class="material-icons right">send</i></a>`;

        }
        let withdraw = `<a token-id="${token.tokenId}" href="#" onclick="dApp.withdraw(event)">Withdraw</a>`
        let pendingWithdraw = `Balance: ${token.pendingReturn} wei`;
          $("#dapp-tokens").append(
            `<div class="col m6">
              <div class="card">
                <div class="card-image">
                  <img id="dapp-image" src="https://gateway.pinata.cloud/ipfs/${token.image.replace("ipfs://", "")}">
                  <span id="dapp-name" class="card-title">${token.name}</span>
                </div>
                <div class="card-action">
                  <input type="number" min="${token.highestBid == 0? token.minBid : token.highestBid + 1}" name="dapp-wei" value="${token.highestBid == 0? token.minBid : token.highestBid + 1}" ${token.auctionEnded ? 'disabled' : ''}>
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
    const wei = Number($(event.target).prev().val());
    await this.marsContract.methods.bid(tokenId).send({from: this.accounts[0], value: wei}).on("receipt", async (receipt) => {
      M.toast({ html: "Transaction Mined! Refreshing UI..." });
      await this.updateUI();
    });
  },
  endAuction: async function(event) {
    const tokenId = $(event.target).attr("token-id");
    await this.marsContract.methods.endAuction(tokenId).send({from: this.accounts[0]}).on("receipt", async (receipt) => {
      M.toast({ html: "Transaction Mined! Refreshing UI..." });
      await this.updateUI();
    });
  },
  withdraw: async function(event) {
    const tokenId = $(event.target).attr("token-id") - 1;
    await this.tokens[tokenId].auction.methods.withdraw().send({from: this.accounts[0]}).on("receipt", async (receipt) => {
      M.toast({ html: "Transaction Mined! Refreshing UI..." });
      await this.updateUI();
    });
  },
  registerLand: async function() {
    const name = $("#dapp-register-name").val();
    const image = document.querySelector('input[type="file"]');
    const minBid =  $("#dapp-register-minBid").val()

    const pinata_api_key = $("#dapp-pinata-api-key").val();
    const pinata_secret_api_key = $("#dapp-pinata-secret-api-key").val();

    if (!pinata_api_key || !pinata_secret_api_key || !name || !image) {
      M.toast({ html: "Please fill out then entire form!" });
      return;
    }

    const image_data = new FormData();
    image_data.append("file", image.files[0]);
    image_data.append("pinataOptions", JSON.stringify({cidVersion: 1}));

    try {
      M.toast({ html: "Uploading Image to IPFS via Pinata..." });
      const image_upload_response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        mode: "cors",
        headers: {
          pinata_api_key,
          pinata_secret_api_key
        },
        body: image_data,
      });

      const image_hash = await image_upload_response.json();
      const image_uri = `ipfs://${image_hash.IpfsHash}`;

      M.toast({ html: `Success. Image located at ${image_uri}.` });
      M.toast({ html: "Uploading JSON..." });

      const reference_json = JSON.stringify({
        pinataContent: { name, image: image_uri, minBid},
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
        $("#dapp-register-name").val("");
        $("#dapp-register-minBid").val("");
        $("#dapp-register-image").val("");
        await this.updateUI();
      });

    } catch (e) {
      alert("ERROR:", JSON.stringify(e));
    }
  },
  readyToRent: async function(){
    await this.marsContract.methods.readyToRent()
  },
  main: async function() {
    // Initialize web3
    await this.init();
    await this.updateUI();
  }
};

dApp.main();
