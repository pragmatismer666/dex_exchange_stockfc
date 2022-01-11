const Token95334 = artifacts.require("Token95334");
const Exchange95334 = artifacts.require("Exchange95334");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token95334);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange95334,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

