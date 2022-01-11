const Token37536795 = artifacts.require("Token37536795");
const Exchange37536795 = artifacts.require("Exchange37536795");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token37536795);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange37536795,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

