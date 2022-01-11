const Token37430352 = artifacts.require("Token37430352");
const Exchange37430352 = artifacts.require("Exchange37430352");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token37430352);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange37430352,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

