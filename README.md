![bloc_spot-2](./frontend/img/bloc_spot-2.gif)
# BLOC HOME

### Smart Contract Real Estate Application - SMARTER, SECURE & FASTER
---
BlocHome is a platform that provides services for sell (through auction), rent and real estate launch in the property registry using smart contracts
  * Develop a digital real estate blockchain platform for the management of luxury home, apartments, investment property,  property rentals, and sales.
  * Utilize Digital Token Technology to manage the distribution of real estate smart contacts.
  * Utilize computer algorithms, blockchain, location data, predictive analytics and more to help investors locate and sell properties, find renters and maximize their real estate investments.

#### Property Management Process Details
---
* Property Listing Management
* Auctions
* Token Management
* Smart Contracts
    * Lease / Rental 
    * Owner Tenant / Seller / Buyer
    * Security Deposit
* Online Web Portal


#### Financial Transaction Management
---

##### Blockchain Technology

Blockchain Technology has been adopted and adapted for use by the commercial real estate (CRE) industry. Blockchain technology can potentially transform core CRE operations such as property transactions like purchase, sale, financing, leasing, and management transactions.

Blockchain technology has impacted the real estate industry in a variety of ways, including offering a new means for buyers and sellers to connect with one another.

Blockchain could be used to cut intermediaries out of the real estate transaction process, thereby reducing costs.

This technology could also help to codify the practice of fractional ownership of real estate.

##### Digital Wallet - Metamask

* Software that manages private keys and converts it to blockchain address format.
* It’s a so-called digital wallet that runs as a Chrome extension. It stores Ethereum assets and shows transactions.

##### Ethereum Gas

Gas refers to the fee, or pricing value, required to successfully conduct a transaction or execute a contract on the Ethereum blockchain platform.
* Every single operation that takes part in Ethereum, be it a simple transaction, or a smart contract, or even an ICO takes some amount of gas.
* Incentivizes nodes for participating in the network and computing jobs to deploy smart contracts.
* Miners get paid an amount in Ether which is equivalent to the total amount of gas it took them to execute a complete operation. In that way it motivates the mines to compute jobs
* Motivates developers to deploy efficient code to optimize the use of deployed protocols

##### Smart Contracts

A smart contract is an agreement that needs no external action to execute the terms of the contract. Once the conditions for its execution have been met, the smart contract completes the agreed actions automatically. 

Blockchain technology maintains a record of transactions is maintained across several computers linked in a peer-to-peer network. This allows smart contracts to be self-executing, with the terms of the agreement between buyer and seller directly written into lines of code existing on a decentralized network.

Ethereum allows developers to write smart contracts which define the EVM* instructions. (Ethereum Virtual Machine, Decentralized database – allows functional code to be distributed along the decentralized set of nodes.)

Smart contracts render transactions traceable, transparent, and irreversible.

Ethereum Real Estate Contracts are Flexible as contracts may be written so that any number of final sales prices, reductions in price, or increases, can be triggered based on specific events agreed to by the parties.

##### Digital Tokens - Non-Fungible Tokens(NFT)

1. **[ERC721 Standard](https://eips.ethereum.org/EIPS/eip-721)**

      ERC-721 is a free, open standard that describes how to build non-fungible or unique tokens on the Ethereum blockchain. While most tokens are fungible (every token is the same as every other token), ERC-721 tokens are all unique.
    
    * ERC-721 defines a minimum interface a smart contract must implement to allow unique tokens to be managed, owned, and traded. It does not mandate a standard for token metadata or restrict adding supplemental functions.
    
    * Conduct Auctions on ERC721 standard and record payout information on blockchain
    
    
2. **[ERCX - EIP 2615](https://github.com/kohshiba/ERC-X)**

      An extension to ERC721 (NFTs) to support rental and mortgage functions.
      
      With ERC2615, NFT owners will be able to rent out their NFTs and take out a mortgage by collateralizing their NFTs. For example, this standard can apply to:

    * Virtual items (in-game assets, virtual artwork, etc.)
    * Physical items (houses, automobiles, etc.)
    * Intellectual property rights
    * DAO membership tokens
    
     NFT developers are also able to easily integrate ERC2615 since it is fully backwards-compatible with the ERC721 standard. 
     
     One notable point is that the person who has the right to use an application is not the owner but the user (i.e. tenant).

#### Development Platforms

![dev_platforms](./frontend/img/dev_platforms.png)

   The development platform Back-end interface includes: 

**[InterPlanetary File System (IPFS)](https://pinata.cloud/)** 
    is a protocol and peer-to-peer network for storing and sharing data in a distributed file system. IPFS uses content-addressing to uniquely identify each file in a global namespace connecting all computing devices.
IPFS  is talking to metamask, ganache, remix, and running solidity, python (Web3.py) , and github pages for the front-end interfacing.

**[MetaMask](https://metamask.io/)**
    is a browser plugin that allows users to make Ethereum transactions through regular websites. It facilitates the adoption of Ethereum because it bridges the gap between the user interfaces for Ethereum
    
**[Web3.py](https://github.com/ethereum/web3.py)** 
    helps in access Ethereum node from Python.
    
    
#### Housing Model Analysis - Machine Learning Model
---
Trains Models to to identify, categorize and value Housing Sales Price per sqft and Price. 
    
* **Data Highlights - AMES, IOWA Assessor's Home Sales(2006 - 2010)**
      
     * 2930 Rows * 82 columns (23 nominal, 23 ordinal, 14 discrete, and 20 continuous variables)
     * Nominal Variables : Identifies the type of dwelling involved in the sale and zoning classification
     * Ordinal: General shape of property and type of utilities
     * Discrete: Original construction dates
     * Continuous: Masonry veneer area in square feet

* **Cluster Analysis (K = Number of Clusters in the dataset = 7)**
      
     * Sale Price by Price / Sqft by Cluster
     
    <img src="./frontend/img/cluster.png" width="500"/><img src="./frontend/img/cluster_profile.png" width="500"/>
    
* **Regression Model to Predict - Sales Price** 
    
    Sales Price
    <img src="./frontend/img/reg_model_sp.png" width="500"/>
    
    Sale Price per Sqft
    <img src="./frontend/img/reg_model_sqft.png" width="500"/>
    
* **Deep Learning Model - Predict Sales Price**

    Sales Price
    <img src="./frontend/img/dl_sp.png" width="500"/>
    
    Sale Price per Sqft
    <img src="./frontend/img/dl_spft.png" width="500"/>

* **Model Comparison / Model Selection**

![model_cmp](./frontend/img/model_cmp.png)

### DEMO 
---

[BLOC HOME WEBSITE](https://maitree7.github.io/BlocHome_DeFi/)

With Admin Rights (Property Listing)

Owner / Leasor  

Tenant / Leasee















    
    

      
      








     

      
    
            











