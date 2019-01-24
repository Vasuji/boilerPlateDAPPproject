//import 'babel-polyfill';
const StarNotary = artifacts.require('./StarNotary.sol')

let instance;
let accounts;

contract('StarNotary', async (accs) => {
    accounts = accs;
    instance = await StarNotary.deployed();
  });

  it('can Create a Star', async() => {
    let tokenId = 1;
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
  });

  it('lets user1 put up their star for sale', async() => {
    let user1 = accounts[1]
    let starId = 2;
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    assert.equal(await instance.starsForSale.call(starId), starPrice)
  });

  it('lets user1 get the funds after the sale', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 3
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user1)
    await instance.buyStar(starId, {from: user2, value: starPrice})
    let balanceOfUser1AfterTransaction = web3.eth.getBalance(user1)
    assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(), balanceOfUser1AfterTransaction.toNumber());
  });

  it('lets user2 buy a star, if it is put up for sale', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 4
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user2)
    await instance.buyStar(starId, {from: user2, value: starPrice});
    assert.equal(await instance.ownerOf.call(starId), user2);
  });

  it('lets user2 buy a star and decreases its balance in ether', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 5
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user2)
    const balanceOfUser2BeforeTransaction = web3.eth.getBalance(user2)
    await instance.buyStar(starId, {from: user2, value: starPrice, gasPrice:0})
    const balanceAfterUser2BuysStar = web3.eth.getBalance(user2)
    assert.equal(balanceOfUser2BeforeTransaction.sub(balanceAfterUser2BuysStar), starPrice);
  });

  // Write Tests for:
// 1) The token name and token symbol are added properly.

  it('token name and symbol added properly', async() => {
      
    // token name and symbols
    assert.equal(await instance.name.call(), 'vasuCoin');
    assert.equal(await instance.symbol.call(), 'VASU');
      
    let tokenId = 6;
      
    //create a star at account[0]  
    await instance.createStar('vasustar 1', tokenId, {from:accounts[0]})
      
    // checking star name too
    let starName = await instance.lookupTokenIdToStarInfo(tokenId, {from:accounts[0]});
    assert.equal(starName, 'vasustar 1');  
      
  });




// 2) 2 users can exchange their stars.
  it('two users can exchange their stars', async() => {
    let token1 = 7;
    let token2 = 8;
      
    // create 2 seperate star
    await instance.createStar('vasustar 2', token1, {from:accounts[0]})
    await instance.createStar('namoonastar 2', token2, {from:accounts[1]})
      
    //get them exchanged  
    await instance.exchangeStars(token1, token2);
      
    // check if onwer are exchanged  
    assert.equal(await instance.ownerOf.call(token1), accounts[1]);
    assert.equal(await instance.ownerOf.call(token2), accounts[0]);
  });




// 3) Stars Tokens can be transferred from one address to another.
  it('Stars Tokens can be transferred from one address to another', async() => {
      
    let token1 = 9;
      
    let receiver = accounts[1];
      
    //create star at account[0]
    await instance.createStar('vasustar 3', token1, {from:accounts[0]})
      
    // transfer to account[1]
    await instance.transferStar(receiver, token1, {from:accounts[0]});
      
    //check the owner
    assert.equal(await instance.ownerOf.call(token1), receiver);
});





