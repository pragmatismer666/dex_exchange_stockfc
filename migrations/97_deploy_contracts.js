const Token37391634 = artifacts.require("Token37391634");
const Exchange37391634 = artifacts.require("Exchange37391634");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token37391634);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange37391634,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

