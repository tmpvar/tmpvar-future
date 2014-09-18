var test = require('tape');
var future = require('./tmpvar-future');

test('create', function(t) {
  var f = future();
  t.equal(typeof f, 'function');
  t.ok(f.isFuture);
  t.end();
});

test('chain', function(t) {
  var f = future();

  t.equal(f, f(function() {}));
  t.end();
});

test('notify after next tick', function(t) {
  var count = 0;
  future()(function(e, r) {
    t.equal(count, 1);
    t.end();
  })();
  count++;
});

test('handle listeners', function(t) {
  future()(function(e, r) {
    t.equal(r, 'ok');
    t.ok(!e);
    t.end();
  })(null, 'ok')
});

test('nesting', function(t) {
  var f = future();
  var f2 = future();
  f(f2);

  f(null, 'hello');

  f2(function(e, r) {
    t.equal(r, 'hello');
    t.end();
  });
});

test('recursive nextTick protection', function(t) {
  var root = future();
  var last = root;
  for (var i=0; i<100000; i++) {
    var c = future();
    last(c)
    last = c;
  }

  last(function(e, r) {
    t.equal(r, 1);
    t.end();
  });

  root(null, 1)
});

test('late binding', function(t) {

  var f = future();
  f(null, 1);

  setImmediate(function() {
    f(function(e, r) {
      t.ok(r);
      t.ok(!e);
      t.end();
    });
  });
});
