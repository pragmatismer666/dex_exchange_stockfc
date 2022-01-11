const Token6970 = artifacts.require("Token6970");
const Exchange6970 = artifacts.require("Exchange6970");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token6970);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange6970,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

