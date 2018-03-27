# exchange.script

It's a common language for Cryptcurrency Markets.

# Examples

     git clone ...
     cd ...
     cd examples
     edit exx.js 
     fill in the accesskey, secretkey, save.
     node exx

# design

We try to build a library to easy do automatic trading. The library could be used like:

	const okexdriver = require('exchange.okex');
	
	const options = {
	    driver:okexdriver,
	    accesskey:...
	    secretkey:...
	    cache:false
	}
	
	const Exchange = require('exchange.script');
	let okex = new Exchange(options);
	let markets = okex.getMarkets();
	let can_btc = markets['can/btc'];
	let price = can_btc.getLast().price;
	let volume = can_btc.getLast().volume;
	can_btc.sell();
	can_btc.buy();
	....

	