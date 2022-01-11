// Parameter type
// Run Example
// node SendTokens.js --contractAddr=0x324324324 --fromPrivateKey=
const args = require('minimist')(process.argv.slice(2))

//Parameter
// TokenAddress : contract address in binance smart chain
// TokenAmount : token amount to send
// PrivatekeyOfSender : privatekey of sender. this must be needed because of function parameter
// AddressOfSender : sender address
// AddressOfReceiver : receiver address
//Parameter Example

var TokenAddress, TokenAmount, TokenPrice, Type, AddressOfSender;
TokenAddress = args.TokenAddress;
TokenAmount = args.TokenAmount;
TokenPrice = args.TokenPrice;
Type = args.Type;
AddressOfSender = args.AddressOfSender;

function makeOrder(TokenAddress, TokenAmount, TokenPrice, Type, AddressOfSender){
    if(TokenAddress && TokenAmount && TokenPrice && Type && AddressOfSender)
    {
        //main part

    }
    else{
        //except
    }
}



//Running function
makeOrder(TokenAddress, TokenAmount, TokenPrice, Type, AddressOfSender);