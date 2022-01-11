const Token2461 = artifacts.require("Token2461");
const Exchange2461 = artifacts.require("Exchange2461");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token2461);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange2461,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

