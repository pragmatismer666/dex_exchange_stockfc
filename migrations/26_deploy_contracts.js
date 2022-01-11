const Token3259 = artifacts.require("Token3259");
const Exchange3259 = artifacts.require("Exchange3259");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token3259);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange3259,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

