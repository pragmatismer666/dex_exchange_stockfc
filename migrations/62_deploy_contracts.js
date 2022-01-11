const Token1343 = artifacts.require("Token1343");
const Exchange1343 = artifacts.require("Exchange1343");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token1343);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange1343,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

