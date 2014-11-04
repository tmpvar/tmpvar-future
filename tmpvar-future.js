module.exports = createFuture;

// avoid nextTick recursion by grouping every
// callback that needs to be run, under the same
// nextTick
var nextTickHandlers = [];
function next(fn) {

  if (!nextTickHandlers.length) {
    process.nextTick(function() {
      while (nextTickHandlers.length) {
        nextTickHandlers.shift()();
      }
    });
  }

  nextTickHandlers.push(fn);
}

function createFuture(retrigger) {
  var watchers = [];
  var value = null;
  var error = null;
  var resolved = false;

  function notifyWatchers() {
    if (retrigger) {
      var l = watchers.length;
      for (var i=0; i<l; i++) {
        watchers[i](error, value);
      }
    } else {
      while (watchers.length) {
        watchers.shift()(error, value);
      }
      resolved = true;
    }
  }

  function future(e, r) {
    if (typeof e === 'function') {
      if (resolved) {
        e(error, value);

        if (retrigger) {
          watchers.push(e);
        }
      } else {
        watchers.push(e);
      }
    } else {
      error = e;
      value = r;

      next(notifyWatchers);
    }

    // enable "chaining"
    return future;
  }


  future.isFuture = true;

  return future;
}
