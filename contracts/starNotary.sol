pragma solidity ^0.4.23;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "./Strings.sol";

contract StarNotary is ERC721 { 
    string public name = "Udacity Final";
    string public symbol = "UF";


    using strings for *;

    struct Star { 
        string name;
        uint256 starId;
    }

    bytes32 public starHash;
    
    mapping(uint256 => Star) public lookUptokenIdToStarInfoMap; 
    mapping(uint256 => uint256) public starsForSale;
    mapping(bytes32 => bool) public createdTokens;


    function createStar(string _name, uint256 _starId) public { 
        Star memory newStar = Star(_name,_starId);
        starHash = keccak256(_starId);
        require(!createdTokens[starHash]);//check if this particular star coordinates have been created already
        createdTokens[starHash] = true;
        lookUptokenIdToStarInfoMap[_starId] = newStar;

        ERC721._mint(msg.sender,_starId);
    }


    function transferStar(address _to, uint256 _starId) public { 

        ERC721.transferFrom(msg.sender, _to, _starId);

    }


    function exchangeStars(address _address1, address _address2, uint256 _starId1, uint256 _starId2) public { 

        require(this.ownerOf(_starId1) == _address1);
        require(this.ownerOf(_starId2) == _address2);

        ERC721._removeTokenFrom(_address1, _starId1);
        ERC721._addTokenTo(_address2, _starId1);

        ERC721._removeTokenFrom(_address2, _starId2);
        ERC721._addTokenTo(_address1, _starId2);
    }


    function checkIfStarExists(uint256 starId) public view returns(bool) {
        bytes memory test = bytes(lookUptokenIdToStarInfoMap[starId].name);
        
        if (test.length < 1){
            return false;
        }else{
            return true;
        }
    }



    function lookUptokenIdToStarInfo(uint256 _starId) public view returns (string ){
        require(checkIfStarExists(_starId),'please check starId number and try again');//check if star exists
        Star memory result = lookUptokenIdToStarInfoMap[_starId];

        return (result.name);     
    }
    
}