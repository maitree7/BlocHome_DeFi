pragma solidity ^0.5.0;

import '../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import '../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol';
import './DealerlessAuction.sol';

contract DealerlessMarket is ERC721Full, Ownable {

    constructor() ERC721Full("DealerlessMarket", "DEAL") public {}

    using Counters for Counters.Counter;

    Counters.Counter token_ids;

    address payable foundation_address = msg.sender;

    mapping(uint => DealerlessAuction) public auctions;

    modifier landRegistered(uint token_id) {
        require(_exists(token_id), "Land not registered!");
        _;
    }

    function createAuction(uint token_id) public onlyOwner {
        auctions[token_id] = new DealerlessAuction(foundation_address);
    }

    function registerLand(string memory uri) public payable onlyOwner {
        token_ids.increment();
        uint token_id = token_ids.current();
        _mint(foundation_address, token_id);
        _setTokenURI(token_id, uri);
        createAuction(token_id);
    }

    function endAuction(uint token_id) public onlyOwner landRegistered(token_id) {
        DealerlessAuction auction = auctions[token_id];
        auction.auctionEnd();
        safeTransferFrom(owner(), auction.highestBidder(), token_id);
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

}
