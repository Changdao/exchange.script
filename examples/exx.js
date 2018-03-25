"use strict";

let Exchange = require('../index').Exchange;
console.log(Exchange);

let EXX      = require('../exx');



let options = {
    driver: EXX,
    accessKey : "",
    secretKey : ''
};


let exx = new Exchange(options);

function usage(){
    console.log('node exx.js <command>');
    console.log('\tbalance');
    console.log('\tlist-markets');
    console.log('\tbuy <market> <price> <amount>');
}


var commands = {
    'balance':function() {
        exx.getBalance().then(function(bal){
            console.log('balance:',bal);
        }).catch(function(err){
            console.error('error:',err);
        });

    },
    'list-markets':function(market) {
        console.log('You can not get markets:'+market);
    }
};


function main(){
    var commandOptions;
    commandOptions=process.argv.map(function(arg){
        return arg;
    });
    console.log(commandOptions);
    if(commandOptions.length<3){
        console.log('Bad usage.');
        usage();
        process.exit();
    }
    var action = commandOptions[2];
    if(commands[action])
    {
        commands[action].apply(this,commandOptions.slice(3));
    }
    else
    {
        usage();
    }
}




main();