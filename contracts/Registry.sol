pragma solidity ^0.4.18;

contract Registry {
    
    struct Record {
        address owner;
        bytes32 ddoHash;
    }
    
    event registrationFailure();
    event registrationSuccess(bytes32 _ddoHash);
    
    mapping (bytes32 => Record) private didToHash;
    
    address private owner;
    
    function Registry() public {
        owner = msg.sender;
    }
    
    function setRecord(bytes32 did, bytes32 _newHash) public {
        if (didToHash[did].ddoHash != 0 && didToHash[did].owner != msg.sender) {
            registrationFailure();
            revert();
        }
        
        didToHash[did] = Record(msg.sender, _newHash);
        registrationSuccess(_newHash);
    } 
    
    function getRecord(bytes32 _did) public view returns (bytes32) {
        return didToHash[_did].ddoHash;
    }
}
