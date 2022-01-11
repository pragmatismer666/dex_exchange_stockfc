const Token10959356 = artifacts.require("Token10959356");
const Exchange10959356 = artifacts.require("Exchange10959356");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token10959356);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange10959356,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

