pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 {

    struct Star {
        string name;
    }

    //  Add a name and a symbol for your starNotary tokens

    string public name = "vasuCoin";
    string public symbol = "VASU";


    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    function createStar(string _name, uint256 _tokenId) public {
        Star memory newStar = Star(_name);

        tokenIdToStarInfo[_tokenId] = newStar;

        _mint(msg.sender, _tokenId);
    }
    
    
    
    

// Add a function lookUptokenIdToStarInfo, that looks up the stars using the Token ID, and then returns the name of the star.
        
    function lookupTokenIdToStarInfo(uint256 _tokenId) public view returns (string starName){
        starName = tokenIdToStarInfo[_tokenId].name;
    }


    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        starOwner.transfer(starCost);

        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
        starsForSale[_tokenId] = 0;
      }
      
      
      

// Add a function called exchangeStars, so 2 users can exchange their star tokens...
//Do not worry about the price, just write code to exchange stars between users.

    function exchangeStars(uint256 token1, uint256 token2) public {

        //define user 1 and user 2
        address user1 = ownerOf(token1);
        address user2 = ownerOf(token2);
        
        //make sure token and users are different
        require(token1 != token2);
        require(user1 != user2);
        
        //remove token 1 from user1 and add to user2
        _removeTokenFrom(user1, token1);
        _addTokenTo(user2, token1);
        
        //remove token 2 from user2 and add to user1
        _removeTokenFrom(user2, token2);
        _addTokenTo(user1, token2);

    }



// Write a function to Transfer a Star. The function should transfer a star from the address of the caller.
// The function should accept 2 arguments, the address to transfer the star to, and the token ID of the star.

    function transferStar(address _to, uint256 _tokenId) public payable {
         require(ownerOf(_tokenId) != _to);
         safeTransferFrom(msg.sender, _to, _tokenId);
    }

}
