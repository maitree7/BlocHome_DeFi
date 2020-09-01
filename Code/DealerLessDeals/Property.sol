pragma solidity ^0.5.0;

//import "https://github.com/kohshiba/ERC-X/blob/master/contracts/ERCX/Contract/ERCXFull.sol";


contract Property {
    //constructor() ERCXFull("DealerlessRentals", "RENT") public {}
    address public owner;
    uint deposit;
    uint rent;
    address public tenant;
    string public house;
    struct LeasePeriod {
        uint fromTimestamp;
        uint toTimestamp;
    }
    
    enum State {Available, Created, Approved, Started, Terminated}
    State public state;
    LeasePeriod leasePeriod;
    
    modifier onlyTenant() {
        require (msg.sender != tenant, 'Not a Tenant!') ;
        _;
    }
    
    modifier onlyOwner() {
        require (msg.sender != owner, 'Not an owner!') ;
        _;
    }
    
    modifier inState(State _state) {
        require (state == _state, 'State is !');
        _;
    }
    
    constructor (address _owner, uint _rent, uint _deposit) public{
        owner = _owner;
        rent = _rent;
        deposit = _deposit;
        state = State.Available;
    }
    
    function isAvailable() view public returns(bool) {
        if (state == State.Available){
            return true;
        }
        return false;
    }

    function createTenantRightAgreement(address _tenant, uint fromTimestamp, uint toTimestamp)  inState(State.Available) public {
        tenant = _tenant;
        leasePeriod.toTimestamp = toTimestamp;
        leasePeriod.fromTimestamp = fromTimestamp;
        state = State.Created;
    }
    
    function setStatusApproved()  inState(State.Approved) public onlyOwner{
        require(owner != address(0x0), 'Property not available for rentals!');
        state = State.Approved;
    }
    
    function confirmAgreement() inState(State.Approved) onlyTenant public{
        state = State.Started;
    }

    function clearTenant() public{
        tenant = address(0x0);
    }
}