const Token28575699 = artifacts.require("Token28575699");
const Exchange28575699 = artifacts.require("Exchange28575699");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token28575699);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange28575699,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

