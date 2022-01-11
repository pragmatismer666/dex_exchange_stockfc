const Token539961 = artifacts.require("Token539961");
const Exchange539961 = artifacts.require("Exchange539961");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token539961);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange539961,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

