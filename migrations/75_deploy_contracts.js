const Token6022 = artifacts.require("Token6022");
const Exchange6022 = artifacts.require("Exchange6022");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token6022);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange6022,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

