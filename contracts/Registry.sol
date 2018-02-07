pragma solidity ^0.4.18;

contract Registry {
    
    struct Record {
        address owner;
        string ddoHash;
    }
    
    event registrationFailure();
    event registrationSuccess(string _ddoHash);
    
    mapping (bytes32 => Record) private didToHash;
    
    address private owner;
    
    function Registry() public {
        owner = msg.sender;
    }
    
    function setRecord(bytes32 did, string _newHash) public {
        bytes memory emptyTest = bytes(didToHash[did].ddoHash); 
        if (emptyTest.length != 0 && didToHash[did].owner != msg.sender) {
            registrationFailure();
            revert();
        }
        
        didToHash[did] = Record(msg.sender, _newHash);
        registrationSuccess(_newHash);
    } 
    
    function getRecord(bytes32 _did) public view returns (string) {
        return didToHash[_did].ddoHash;
    }
}
