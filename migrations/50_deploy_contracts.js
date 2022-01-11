const Token12145 = artifacts.require("Token12145");
const Exchange12145 = artifacts.require("Exchange12145");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token12145);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange12145,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

