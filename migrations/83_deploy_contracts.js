const Token4341 = artifacts.require("Token4341");
const Exchange4341 = artifacts.require("Exchange4341");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token4341);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange4341,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

