const Token5007 = artifacts.require("Token5007");
const Exchange5007 = artifacts.require("Exchange5007");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token5007);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange5007,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

