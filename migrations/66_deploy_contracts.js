const Token9274 = artifacts.require("Token9274");
const Exchange9274 = artifacts.require("Exchange9274");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token9274);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange9274,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

