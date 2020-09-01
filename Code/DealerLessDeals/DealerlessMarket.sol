pragma solidity ^0.5.0;

//import "../node-modules/kohshiba/ERC-X/contracts/ERCX/Contract/ERCXFull.sol";
import "https://github.com/kohshiba/ERC-X/blob/master/contracts/ERCX/Contract/ERCXFull.sol";
//import '../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol';
import './DealerlessAuction.sol';
import './Property.sol';

contract DealerlessMarket is ERCXFull{

    constructor() ERCXFull("DealerlessMarket", "DEAL") public {}
    
    uint owner_layer = 2;

    using Counters for Counters.Counter;

    Counters.Counter token_ids;

     address payable private foundation_address = msg.sender;

    mapping(uint => DealerlessAuction) public auctions;
    

    modifier landRegistered(uint item_id) {
        require(_exists(item_id, owner_layer), "Land not registered!");
        _;
    }
    
    modifier onlyOwner() {
        require (msg.sender == foundation_address, 'Only Admin have previlage !') ;
        _;
    }
    
    function owner() public view returns(address){
        return foundation_address;
    }
    
    function createAuction(uint token_id) public onlyOwner {
        auctions[token_id] = new DealerlessAuction(foundation_address);
    }

    function registerLand(string memory uri) public payable onlyOwner {
        token_ids.increment();
        uint token_id = token_ids.current();
        _mint(foundation_address, token_id);
        _setItemURI(token_id, uri);
        createAuction(token_id);
    }

    function endAuction(uint token_id) public onlyOwner landRegistered(token_id) {
        DealerlessAuction auction = auctions[token_id];
        auction.auctionEnd();
        safeTransferFrom(ownerOf(token_id), auction.highestBidder(), token_id);
    }

    function auctionEnded(uint token_id) public view landRegistered(token_id) returns(bool) {
        DealerlessAuction auction = auctions[token_id];
        return auction.ended();
    }

    function highestBid(uint token_id) public view landRegistered(token_id) returns(uint) {
        DealerlessAuction auction = auctions[token_id];
        return auction.highestBid();
    }

    function pendingReturn(uint token_id, address sender) public view landRegistered(token_id) returns(uint) {
        DealerlessAuction auction = auctions[token_id];
        return auction.pendingReturn(sender);
    }

    function bid(uint token_id) public payable landRegistered(token_id) {
        DealerlessAuction auction = auctions[token_id];
        auction.bid.value(msg.value)(msg.sender);
    }
    event delegate_event(
        address _from,
        address _tenant,
        uint i
    );
    
    function delegatecallex(address tenant, uint i) public{
        emit delegate_event(msg.sender, tenant, i);
    }
    
}

contract DealerlessRental{

    DealerlessMarket dealerlessMarketDeployer;
    mapping(uint => Property) public rentalProperty;
    
    modifier isRentalAvailable(uint item_id) {
        require (rentalProperty[item_id].isAvailable(), 'Property is not available for Rental!');
        _;
    }
    
    modifier onlyOwner(uint token_id) {
        require (msg.sender == dealerlessMarketDeployer.ownerOf(token_id), 'Only owner has previlage !') ;
        _;
    }
    
    constructor (address dealerlessMarketAddress) public {
        dealerlessMarketDeployer = DealerlessMarket(dealerlessMarketAddress);
    }
    
    function getRental(uint itemId) public view returns(Property){
        return rentalProperty[itemId];
    }
    
    function readyToRent(uint itemId, uint rent, uint deposit) public onlyOwner(itemId){
        rentalProperty[itemId] = new Property(msg.sender, rent, deposit);
    }
    
    //Tenant request for Tenant right approval for the first time
    function requestForTenantRight(uint itemId, uint fromTimeStamp, uint toTimeStamp) public isRentalAvailable(itemId) {
        require(msg.sender!= dealerlessMarketDeployer.ownerOf(itemId), 'Owner cannot be a Tenant!');
        require(dealerlessMarketDeployer.getApprovedTenantRight(itemId) == address(0x0), 'Property is under approval for other Renter!');
        Property rental = rentalProperty[itemId];
        rental.createTenantRightAgreement(msg.sender, fromTimeStamp, toTimeStamp);
    }
    
    function approveTenantRight(address tenant, uint256 itemId) public onlyOwner(itemId) returns(bool, bool, bytes memory, bytes memory){
        (bool status, bytes memory data) = address(dealerlessMarketDeployer).delegatecall(abi.encodeWithSignature("delegatecallex(address,uint256)", tenant, itemId));
          //  abi.encodePacked(bytes4(keccak256("delegatecallex(uint160, uint)")), tenant, itemId));

        (bool status1, bytes memory data1) = address(dealerlessMarketDeployer).delegatecall(abi.encodeWithSignature("approveTenantRight(address,uint256)", tenant, itemId));
        /*
        //dealerlessMarketDeployer.approveTenantRight(tenant, itemId);
        if (status) {
            Property rental = rentalProperty[itemId];
            rental.setStatusApproved();
        }*/
        return (status, status1, data, data1);
    }
    
    function setTenantRight(uint itemId) public returns(bool){
        (bool status,) = address(dealerlessMarketDeployer).delegatecall(abi.encodeWithSignature("setTenantRight(uint256)", itemId));
        Property rental = rentalProperty[itemId];
        rental.confirmAgreement();
        return status;
    }
}
