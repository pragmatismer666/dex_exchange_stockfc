const Token96090 = artifacts.require("Token96090");
const Exchange96090 = artifacts.require("Exchange96090");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token96090);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange96090,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

