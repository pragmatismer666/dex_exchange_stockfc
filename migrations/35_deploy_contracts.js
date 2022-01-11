const Token1094 = artifacts.require("Token1094");
const Exchange1094 = artifacts.require("Exchange1094");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token1094);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange1094,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

