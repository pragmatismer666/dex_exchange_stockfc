const Token28912777 = artifacts.require("Token28912777");
const Exchange28912777 = artifacts.require("Exchange28912777");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token28912777);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange28912777,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

