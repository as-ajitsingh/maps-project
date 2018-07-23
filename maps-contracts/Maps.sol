pragma solidity ^0.4.23;

contract Maps{
    
    address public owner;
    
    mapping(address=>bool) users;
    
    constructor() public{
       owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    event mediaBought(string msg);
    
    function buyMedia() payable public {
        users[msg.sender] = true;
        emit mediaBought("SUCCESS");
    }
    
    function getMediaKey() public view returns(string){
        require(users[msg.sender]==true,"NOT_A_SUBSCRIBER");
        return "NjE3RDhBMTI1QTI4NERGMQ";
    }
    
}