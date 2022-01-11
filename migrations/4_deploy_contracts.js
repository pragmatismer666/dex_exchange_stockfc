const Token21428649 = artifacts.require("Token21428649");
const Exchange21428649 = artifacts.require("Exchange21428649");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token21428649);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange21428649,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

