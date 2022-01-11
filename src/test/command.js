//Example
//node command.js privatekey=0x00 Toaddress=0x99 Fromaddress=0x11
process.argv.forEach( (param, index) => {
})

//Other Example
//node command.js --privatekey=0x00 --ToAddress=0x30 --FromAddress=0x10
var argv = require('minimist')(process.argv.slice(2));
