const Token225000 = artifacts.require("Token225000");
const Exchange225000 = artifacts.require("Exchange225000");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token225000);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange225000,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

