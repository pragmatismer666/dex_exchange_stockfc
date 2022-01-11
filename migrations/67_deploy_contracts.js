const Token7993 = artifacts.require("Token7993");
const Exchange7993 = artifacts.require("Exchange7993");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token7993);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange7993,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

