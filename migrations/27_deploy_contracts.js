const Token22897102 = artifacts.require("Token22897102");
const Exchange22897102 = artifacts.require("Exchange22897102");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token22897102);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange22897102,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

