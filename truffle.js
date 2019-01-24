// Allows us to use ES6 in our migrations and tests.
require('babel-register')

// Edit truffle.config file should have settings to deploy the contract to the Rinkeby Public Network.
// Infura should be used in the truffle.config file for deployment to Rinkeby.


// Need to install truffle -hdwallet-provider by npm install 'name' --save
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    rinkeby: {
      provider: function() {

        // put your secret words and rinkeby-infura address here
        return new HDWalletProvider("diet swift develop year extra course blossom insect february lounge velvet small",
                                    "https://rinkeby.infura.io/v3/60a510a02599498aa4b7fcd0f1e673ae")
      },
      network_id: '*',
      gas: 4500000,
      gasPrice: 10000000000,
	}
  }
}
