const Token16827155 = artifacts.require("Token16827155");
const Exchange16827155 = artifacts.require("Exchange16827155");



module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts()

  await deployer.deploy(Token16827155);

             
  const feeAccount = accounts[5]
  const feePercent = 4
  const feeAccount1 = accounts[6]
  const feePercent1 = 3
  const feeAccount2 = accounts[7]
  const feePercent2 = 3
  
  await deployer.deploy(Exchange16827155,  feeAccount, feePercent, feeAccount1, feePercent1, feeAccount2, feePercent2);


};

