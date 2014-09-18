# tmpvar-future

A stupid simple way to pass around continuations and treat them like real values until they have resolved.

## install

`npm install tmpvar-future`

## use

```javascript

var future = require('tmpvar-future');

// create a future
var f = future();

// setup an observer for when this future
// evaluates or errors
f(function(e, r) {
  // do something with e/r
});

// resolve
f(null, 1);

// late binding
setTimeout(function() {
  f(funtion(e, r) {
  	console.log(r); // outputs: 1
  });
});

```

that is it! 

## license 

[MIT](LICENSE.txt)