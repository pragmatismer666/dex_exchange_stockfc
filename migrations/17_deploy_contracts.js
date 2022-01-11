const Token4969702 = artifacts.require("Token4969702");
const Exchange4969702 = artifacts.require("Exchange4969702");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token4969702);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange4969702,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

