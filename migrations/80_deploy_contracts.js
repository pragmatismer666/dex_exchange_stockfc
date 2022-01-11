const Token339093 = artifacts.require("Token339093");
const Exchange339093 = artifacts.require("Exchange339093");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token339093);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange339093,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

