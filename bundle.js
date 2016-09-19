(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//creating a namespace in the only globally viewable variable exposed by AA at generation time
lib._ = {};

//used to manipulate the AA generated UI elements as exposed in `lib`
var lesson_UI = require('lib/UI/lesson_UI');

//expose the lesson_UI code to the calling code in unorderedArray.html
lib._.lesson_UI = lesson_UI;

//the lesson logic itself
var lesson = require('lib/lesson/unordered_array_linear_search');

//exposing to the calling code in unorderedArray.html
lib._.lesson = lesson;

//exposing primitives to calling code in unorderedArray.html
var primitives = require("lib/util/primitives");
lib._.primitives = primitives;
},{"lib/UI/lesson_UI":16,"lib/lesson/unordered_array_linear_search":21,"lib/util/primitives":27}],2:[function(require,module,exports){
/*globals define, module, Symbol */

(function (globals) {
  'use strict';

  var strings, messages, predicates, functions,
      assert, not, maybe, collections, slice;

  strings = {
    v: 'value',
    n: 'number',
    s: 'string',
    b: 'boolean',
    o: 'object',
    t: 'type',
    a: 'array',
    al: 'array-like',
    i: 'iterable',
    d: 'date',
    f: 'function',
    l: 'length'
  };

  messages = {};
  predicates = {};

  [
    { n: 'equal', f: equal, s: 'v' },
    { n: 'undefined', f: isUndefined, s: 'v' },
    { n: 'null', f: isNull, s: 'v' },
    { n: 'assigned', f: assigned, s: 'v' },
    { n: 'includes', f: includes, s: 'v' },
    { n: 'zero', f: zero, s: 'n' },
    { n: 'infinity', f: infinity, s: 'n' },
    { n: 'number', f: number, s: 'n' },
    { n: 'integer', f: integer, s: 'n' },
    { n: 'even', f: even, s: 'n' },
    { n: 'odd', f: odd, s: 'n' },
    { n: 'greater', f: greater, s: 'n' },
    { n: 'less', f: less, s: 'n' },
    { n: 'between', f: between, s: 'n' },
    { n: 'greaterOrEqual', f: greaterOrEqual, s: 'n' },
    { n: 'lessOrEqual', f: lessOrEqual, s: 'n' },
    { n: 'inRange', f: inRange, s: 'n' },
    { n: 'positive', f: positive, s: 'n' },
    { n: 'negative', f: negative, s: 'n' },
    { n: 'string', f: string, s: 's' },
    { n: 'emptyString', f: emptyString, s: 's' },
    { n: 'nonEmptyString', f: nonEmptyString, s: 's' },
    { n: 'contains', f: contains, s: 's' },
    { n: 'match', f: match, s: 's' },
    { n: 'boolean', f: boolean, s: 'b' },
    { n: 'object', f: object, s: 'o' },
    { n: 'emptyObject', f: emptyObject, s: 'o' },
    { n: 'instanceStrict', f: instanceStrict, s: 't' },
    { n: 'instance', f: instance, s: 't' },
    { n: 'like', f: like, s: 't' },
    { n: 'array', f: array, s: 'a' },
    { n: 'emptyArray', f: emptyArray, s: 'a' },
    { n: 'arrayLike', f: arrayLike, s: 'al' },
    { n: 'iterable', f: iterable, s: 'i' },
    { n: 'date', f: date, s: 'd' },
    { n: 'function', f: isFunction, s: 'f' },
    { n: 'hasLength', f: hasLength, s: 'l' },
  ].map(function (data) {
    messages[data.n] = 'Invalid ' + strings[data.s];
    predicates[data.n] = data.f;
  });

  functions = {
    apply: apply,
    map: map,
    all: all,
    any: any
  };

  collections = [ 'array', 'arrayLike', 'iterable', 'object' ];
  slice = Array.prototype.slice;

  functions = mixin(functions, predicates);
  assert = createModifiedPredicates(assertModifier, assertImpl);
  not = createModifiedPredicates(notModifier, notImpl);
  maybe = createModifiedPredicates(maybeModifier, maybeImpl);
  assert.not = createModifiedModifier(assertModifier, not);
  assert.maybe = createModifiedModifier(assertModifier, maybe);

  collections.forEach(createOfPredicates);
  createOfModifiers(assert, assertModifier);
  createOfModifiers(not, notModifier);
  collections.forEach(createMaybeOfModifiers);

  exportFunctions(mixin(functions, {
    assert: assert,
    not: not,
    maybe: maybe
  }));

  /**
   * Public function `equal`.
   *
   * Returns true if `lhs` and `rhs` are strictly equal, without coercion.
   * Returns false otherwise.
   */
  function equal (lhs, rhs) {
    return lhs === rhs;
  }

  /**
   * Public function `undefined`.
   *
   * Returns true if `data` is undefined, false otherwise.
   */
  function isUndefined (data) {
    return data === undefined;
  }

  /**
   * Public function `null`.
   *
   * Returns true if `data` is null, false otherwise.
   */
  function isNull (data) {
    return data === null;
  }

  /**
   * Public function `assigned`.
   *
   * Returns true if `data` is not null or undefined, false otherwise.
   */
  function assigned (data) {
    return ! isUndefined(data) && ! isNull(data);
  }

  /**
   * Public function `zero`.
   *
   * Returns true if `data` is zero, false otherwise.
   */
  function zero (data) {
    return data === 0;
  }

  /**
   * Public function `infinity`.
   *
   * Returns true if `data` is positive or negative infinity, false otherwise.
   */
  function infinity (data) {
    return data === Number.POSITIVE_INFINITY || data === Number.NEGATIVE_INFINITY;
  }

  /**
   * Public function `number`.
   *
   * Returns true if `data` is a number, false otherwise.
   */
  function number (data) {
    return typeof data === 'number' &&
      isNaN(data) === false &&
      data !== Number.POSITIVE_INFINITY &&
      data !== Number.NEGATIVE_INFINITY;
  }

  /**
   * Public function `integer`.
   *
   * Returns true if `data` is an integer, false otherwise.
   */
  function integer (data) {
    return number(data) && data % 1 === 0;
  }

  /**
   * Public function `even`.
   *
   * Returns true if `data` is an even number, false otherwise.
   */
  function even (data) {
    return number(data) && data % 2 === 0;
  }

  /**
   * Public function `odd`.
   *
   * Returns true if `data` is an odd number, false otherwise.
   */
  function odd (data) {
    return integer(data) && !even(data);
  }

  /**
   * Public function `greater`.
   *
   * Returns true if `lhs` is a number greater than `rhs`, false otherwise.
   */
  function greater (lhs, rhs) {
    return number(lhs) && lhs > rhs;
  }

  /**
   * Public function `less`.
   *
   * Returns true if `lhs` is a number less than `rhs`, false otherwise.
   */
  function less (lhs, rhs) {
    return number(lhs) && lhs < rhs;
  }

  /**
   * Public function `between`.
   *
   * Returns true if `data` is a number between `x` and `y`, false otherwise.
   */
  function between (data, x, y) {
    if (x < y) {
      return greater(data, x) && less(data, y);
    }

    return less(data, x) && greater(data, y);
  }

  /**
   * Public function `greaterOrEqual`.
   *
   * Returns true if `lhs` is a number greater than or equal to `rhs`, false
   * otherwise.
   */
  function greaterOrEqual (lhs, rhs) {
    return number(lhs) && lhs >= rhs;
  }

  /**
   * Public function `lessOrEqual`.
   *
   * Returns true if `lhs` is a number less than or equal to `rhs`, false
   * otherwise.
   */
  function lessOrEqual (lhs, rhs) {
    return number(lhs) && lhs <= rhs;
  }

  /**
   * Public function `inRange`.
   *
   * Returns true if `data` is a number in the range `x..y`, false otherwise.
   */
  function inRange (data, x, y) {
    if (x < y) {
      return greaterOrEqual(data, x) && lessOrEqual(data, y);
    }

    return lessOrEqual(data, x) && greaterOrEqual(data, y);
  }

  /**
   * Public function `positive`.
   *
   * Returns true if `data` is a positive number, false otherwise.
   */
  function positive (data) {
    return greater(data, 0);
  }

  /**
   * Public function `negative`.
   *
   * Returns true if `data` is a negative number, false otherwise.
   */
  function negative (data) {
    return less(data, 0);
  }

  /**
   * Public function `string`.
   *
   * Returns true if `data` is a string, false otherwise.
   */
  function string (data) {
    return typeof data === 'string';
  }

  /**
   * Public function `emptyString`.
   *
   * Returns true if `data` is the empty string, false otherwise.
   */
  function emptyString (data) {
    return data === '';
  }

  /**
   * Public function `nonEmptyString`.
   *
   * Returns true if `data` is a non-empty string, false otherwise.
   */
  function nonEmptyString (data) {
    return string(data) && data !== '';
  }

  /**
   * Public function `contains`.
   *
   * Returns true if `data` is a string that contains `substring`, false
   * otherwise.
   */
  function contains (data, substring) {
    return string(data) && data.indexOf(substring) !== -1;
  }

  /**
   * Public function `match`.
   *
   * Returns true if `data` is a string that matches `regex`, false otherwise.
   */
  function match (data, regex) {
    return string(data) && !! data.match(regex);
  }

  /**
   * Public function `boolean`.
   *
   * Returns true if `data` is a boolean value, false otherwise.
   */
  function boolean (data) {
    return data === false || data === true;
  }

  /**
   * Public function `object`.
   *
   * Returns true if `data` is a plain-old JS object, false otherwise.
   */
  function object (data) {
    return Object.prototype.toString.call(data) === '[object Object]';
  }

  /**
   * Public function `emptyObject`.
   *
   * Returns true if `data` is an empty object, false otherwise.
   */
  function emptyObject (data) {
    return object(data) && Object.keys(data).length === 0;
  }

  /**
   * Public function `instanceStrict`.
   *
   * Returns true if `data` is an instance of `prototype`, false otherwise.
   */
  function instanceStrict (data, prototype) {
    try {
      return data instanceof prototype;
    } catch (error) {
      return false;
    }
  }

  /**
   * Public function `instance`.
   *
   * Returns true if `data` is an instance of `prototype`, false otherwise.
   * Falls back to testing constructor.name and Object.prototype.toString
   * if the initial instanceof test fails.
   */
  function instance (data, prototype) {
    try {
      return instanceStrict(data, prototype) ||
        data.constructor.name === prototype.name ||
        Object.prototype.toString.call(data) === '[object ' + prototype.name + ']';
    } catch (error) {
      return false;
    }
  }

  /**
   * Public function `like`.
   *
   * Tests whether `data` 'quacks like a duck'. Returns true if `data` has all
   * of the properties of `archetype` (the 'duck'), false otherwise.
   */
  function like (data, archetype) {
    var name;

    for (name in archetype) {
      if (archetype.hasOwnProperty(name)) {
        if (data.hasOwnProperty(name) === false || typeof data[name] !== typeof archetype[name]) {
          return false;
        }

        if (object(data[name]) && like(data[name], archetype[name]) === false) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Public function `array`.
   *
   * Returns true if `data` is an array, false otherwise.
   */
  function array (data) {
    return Array.isArray(data);
  }

  /**
   * Public function `emptyArray`.
   *
   * Returns true if `data` is an empty array, false otherwise.
   */
  function emptyArray (data) {
    return array(data) && data.length === 0;
  }

  /**
   * Public function `arrayLike`.
   *
   * Returns true if `data` is an array-like object, false otherwise.
   */
  function arrayLike (data) {
    return assigned(data) && number(data.length);
  }

  /**
   * Public function `iterable`.
   *
   * Returns true if `data` is an iterable, false otherwise.
   */
  function iterable (data) {
    if (typeof Symbol === 'undefined') {
      // Fall back to `arrayLike` predicate in pre-ES6 environments.
      return arrayLike(data);
    }

    return assigned(data) && isFunction(data[Symbol.iterator]);
  }

  /**
   * Public function `includes`.
   *
   * Returns true if `data` contains `value`, false otherwise.
   */
  function includes (data, value) {
    var iterator, iteration;

    if (not.assigned(data)) {
      return false;
    }

    try {
      if (typeof Symbol !== 'undefined' && data[Symbol.iterator] && isFunction(data.values)) {
        iterator = data.values();

        do {
          iteration = iterator.next();

          if (iteration.value === value) {
            return true;
          }
        } while (! iteration.done);

        return false;
      }

      Object.keys(data).forEach(function (key) {
        if (data[key] === value) {
          throw 0;
        }
      });
    } catch (ignore) {
      return true;
    }

    return false;
  }

  /**
   * Public function `hasLength`.
   *
   * Returns true if `data` has a length property that equals `length`, false
   * otherwise.
   */
  function hasLength (data, length) {
    return assigned(data) && data.length === length;
  }

  /**
   * Public function `date`.
   *
   * Returns true if `data` is a valid date, false otherwise.
   */
  function date (data) {
    try {
      return instance(data, Date) && integer(data.getTime());
    } catch (error) {
      return false;
    }
  }

  /**
   * Public function `function`.
   *
   * Returns true if `data` is a function, false otherwise.
   */
  function isFunction (data) {
    return typeof data === 'function';
  }

  /**
   * Public function `apply`.
   *
   * Maps each value from the `data` to the corresponding predicate and returns
   * the result array. If the same function is to be applied across all of the
   * data, a single predicate function may be passed in.
   *
   */
  function apply (data, predicates) {
    assert.array(data);

    if (isFunction(predicates)) {
      return data.map(function (value) {
        return predicates(value);
      });
    }

    assert.array(predicates);
    assert.hasLength(data, predicates.length);

    return data.map(function (value, index) {
      return predicates[index](value);
    });
  }

  /**
   * Public function `map`.
   *
   * Maps each value from the `data` to the corresponding predicate and returns
   * the result object. Supports nested objects. If the `data` is not nested and
   * the same function is to be applied across all of it, a single predicate
   * function may be passed in.
   *
   */
  function map (data, predicates) {
    assert.object(data);

    if (isFunction(predicates)) {
      return mapSimple(data, predicates);
    }

    assert.object(predicates);

    return mapComplex(data, predicates);
  }

  function mapSimple (data, predicate) {
    var result = {};

    Object.keys(data).forEach(function (key) {
      result[key] = predicate(data[key]);
    });

    return result;
  }

  function mapComplex (data, predicates) {
    var result = {};

    Object.keys(predicates).forEach(function (key) {
      var predicate = predicates[key];

      if (isFunction(predicate)) {
        if (not.assigned(data)) {
          result[key] = !!predicate._isMaybefied;
        } else {
          result[key] = predicate(data[key]);
        }
      } else if (object(predicate)) {
        result[key] = mapComplex(data[key], predicate);
      }
    });

    return result;
  }

  /**
   * Public function `all`
   *
   * Check that all boolean values are true
   * in an array (returned from `apply`)
   * or object (returned from `map`).
   *
   */
  function all (data) {
    if (array(data)) {
      return testArray(data, false);
    }

    assert.object(data);

    return testObject(data, false);
  }

  function testArray (data, result) {
    var i;

    for (i = 0; i < data.length; i += 1) {
      if (data[i] === result) {
        return result;
      }
    }

    return !result;
  }

  function testObject (data, result) {
    var key, value;

    for (key in data) {
      if (data.hasOwnProperty(key)) {
        value = data[key];

        if (object(value) && testObject(value, result) === result) {
          return result;
        }

        if (value === result) {
          return result;
        }
      }
    }

    return !result;
  }

  /**
   * Public function `any`
   *
   * Check that at least one boolean value is true
   * in an array (returned from `apply`)
   * or object (returned from `map`).
   *
   */
  function any (data) {
    if (array(data)) {
      return testArray(data, true);
    }

    assert.object(data);

    return testObject(data, true);
  }

  function mixin (target, source) {
    Object.keys(source).forEach(function (key) {
      target[key] = source[key];
    });

    return target;
  }

  /**
   * Public modifier `assert`.
   *
   * Throws if `predicate` returns false.
   */
  function assertModifier (predicate, defaultMessage) {
    return function () {
      assertPredicate(predicate, arguments, defaultMessage);
    };
  }

  function assertPredicate (predicate, args, defaultMessage) {
    var message = args[args.length - 1];
    assertImpl(predicate.apply(null, args), nonEmptyString(message) ? message : defaultMessage);
  }

  function assertImpl (value, message) {
    if (value === false) {
      throw new Error(message || 'Assertion failed');
    }
  }

  /**
   * Public modifier `not`.
   *
   * Negates `predicate`.
   */
  function notModifier (predicate) {
    return function () {
      return notImpl(predicate.apply(null, arguments));
    };
  }

  function notImpl (value) {
    return !value;
  }

  /**
   * Public modifier `maybe`.
   *
   * Returns true if predicate argument is  null or undefined,
   * otherwise propagates the return value from `predicate`.
   */
  function maybeModifier (predicate) {
    var modifiedPredicate = function () {
      if (not.assigned(arguments[0])) {
        return true;
      }

      return predicate.apply(null, arguments);
    };

    // Hackishly indicate that this is a maybe.xxx predicate.
    // Without this flag, the alternative would be to iterate
    // through the maybe predicates or use indexOf to check,
    // which would be time-consuming.
    modifiedPredicate._isMaybefied = true;

    return modifiedPredicate;
  }

  function maybeImpl (value) {
    if (assigned(value) === false) {
      return true;
    }

    return value;
  }

  /**
   * Public modifier `of`.
   *
   * Applies the chained predicate to members of the collection.
   */
  function ofModifier (target, type, predicate) {
    return function () {
      var collection, args;

      collection = arguments[0];

      if (target === 'maybe' && not.assigned(collection)) {
        return true;
      }

      if (!type(collection)) {
        return false;
      }

      collection = coerceCollection(type, collection);
      args = slice.call(arguments, 1);

      try {
        collection.forEach(function (item) {
          if (
            (target !== 'maybe' || assigned(item)) &&
            !predicate.apply(null, [ item ].concat(args))
          ) {
            // TODO: Replace with for...of when ES6 is required.
            throw 0;
          }
        });
      } catch (ignore) {
        return false;
      }

      return true;
    };
  }

  function coerceCollection (type, collection) {
    switch (type) {
      case arrayLike:
        return slice.call(collection);
      case object:
        return Object.keys(collection).map(function (key) {
          return collection[key];
        });
      default:
        return collection;
    }
  }

  function createModifiedPredicates (modifier, object) {
    return createModifiedFunctions([ modifier, predicates, object ]);
  }

  function createModifiedFunctions (args) {
    var modifier, object, functions, result;

    modifier = args.shift();
    object = args.pop();
    functions = args.pop();

    result = object || {};

    Object.keys(functions).forEach(function (key) {
      Object.defineProperty(result, key, {
        configurable: false,
        enumerable: true,
        writable: false,
        value: modifier.apply(null, args.concat(functions[key], messages[key]))
      });
    });

    return result;
  }

  function createModifiedModifier (modifier, modified) {
    return createModifiedFunctions([ modifier, modified, null ]);
  }

  function createOfPredicates (key) {
    predicates[key].of = createModifiedFunctions(
      [ ofModifier.bind(null, null), predicates[key], predicates, null ]
    );
  }

  function createOfModifiers (base, modifier) {
    collections.forEach(function (key) {
      base[key].of = createModifiedModifier(modifier, predicates[key].of);
    });
  }

  function createMaybeOfModifiers (key) {
    maybe[key].of = createModifiedFunctions(
      [ ofModifier.bind(null, 'maybe'), predicates[key], predicates, null ]
    );
    assert.maybe[key].of = createModifiedModifier(assertModifier, maybe[key].of);
    assert.not[key].of = createModifiedModifier(assertModifier, not[key].of);
  }

  function exportFunctions (functions) {
    if (typeof define === 'function' && define.amd) {
      define(function () {
        return functions;
      });
    } else if (typeof module !== 'undefined' && module !== null && module.exports) {
      module.exports = functions;
    } else {
      globals.check = functions;
    }
  }
}(this));

},{}],3:[function(require,module,exports){
module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};
},{}],4:[function(require,module,exports){
/* MIT license */
var colorNames = require('color-name');
var swizzle = require('simple-swizzle');

var reverseNames = {};

// create a list of reverse color names
for (var name in colorNames) {
	if (colorNames.hasOwnProperty(name)) {
		reverseNames[colorNames[name]] = name;
	}
}

var cs = module.exports = {
	to: {}
};

cs.get = function (string) {
	var prefix = string.substring(0, 3).toLowerCase();
	var val;
	var model;
	switch (prefix) {
		case 'hsl':
			val = cs.get.hsl(string);
			model = 'hsl';
			break;
		case 'hwb':
			val = cs.get.hwb(string);
			model = 'hwb';
			break;
		default:
			val = cs.get.rgb(string);
			model = 'rgb';
			break;
	}

	if (!val) {
		return null;
	}

	return {model: model, value: val};
};

cs.get.rgb = function (string) {
	if (!string) {
		return null;
	}

	var abbr = /^#([a-fA-F0-9]{3})$/;
	var hex = /^#([a-fA-F0-9]{6})$/;
	var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var keyword = /(\D+)/;

	var rgb = [0, 0, 0, 1];
	var match;
	var i;

	if (match = string.match(abbr)) {
		match = match[1];

		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i] + match[i], 16);
		}
	} else if (match = string.match(hex)) {
		match = match[1];

		for (i = 0; i < 3; i++) {
			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
			var i2 = i * 2;
			rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
		}
	} else if (match = string.match(rgba)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i + 1], 0);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = string.match(per)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = string.match(keyword)) {
		if (match[1] === 'transparent') {
			return [0, 0, 0, 0];
		}

		rgb = colorNames[match[1]];

		if (!rgb) {
			return null;
		}

		rgb[3] = 1;

		return rgb;
	}

	for (i = 0; i < rgb.length; i++) {
		rgb[i] = clamp(rgb[i], 0, 255);
	}
	rgb[3] = clamp(rgb[3], 0, 1);

	return rgb;
};

cs.get.hsl = function (string) {
	if (!string) {
		return null;
	}

	var hsl = /^hsla?\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
	var match = string.match(hsl);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var s = clamp(parseFloat(match[2]), 0, 100);
		var l = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

		return [h, s, l, a];
	}
};

cs.get.hwb = function (string) {
	if (!string) {
		return null;
	}

	var hwb = /^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
	var match = string.match(hwb);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var w = clamp(parseFloat(match[2]), 0, 100);
		var b = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
		return [h, w, b, a];
	}
};

cs.to.hex = function (rgb) {
	return '#' + hexDouble(rgb[0]) + hexDouble(rgb[1]) + hexDouble(rgb[2]);
};

cs.to.rgb = function () {
	var rgba = swizzle(arguments);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + rgba[0] + ', ' + rgba[1] + ', ' + rgba[2] + ')'
		: 'rgba(' + rgba[0] + ', ' + rgba[1] + ', ' + rgba[2] + ', ' + rgba[3] + ')';
};

cs.to.rgb.percent = function () {
	var rgba = swizzle(arguments);

	var r = Math.round(rgba[0] / 255 * 100);
	var g = Math.round(rgba[1] / 255 * 100);
	var b = Math.round(rgba[2] / 255 * 100);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};

cs.to.hsl = function () {
	var hsla = swizzle(arguments);
	return hsla.length < 4 || hsla[3] === 1
		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
cs.to.hwb = function () {
	var hwba = swizzle(arguments);

	var a = '';
	if (hwba.length >= 4 && hwba[3] !== 1) {
		a = ', ' + hwba[3];
	}

	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};

cs.to.keyword = function (rgb) {
	return reverseNames[rgb.slice(0, 3)];
};

// helpers
function clamp(num, min, max) {
	return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
	var str = num.toString(16).toUpperCase();
	return (str.length < 2) ? '0' + str : str;
}

},{"color-name":3,"simple-swizzle":39}],5:[function(require,module,exports){
module.exports=[
	"xx-small",
	"x-small",
	"small",
	"medium",
	"large",
	"x-large",
	"xx-large",
	"larger",
	"smaller"
]

},{}],6:[function(require,module,exports){
module.exports=[
	"normal",
	"condensed",
	"semi-condensed",
	"extra-condensed",
	"ultra-condensed",
	"expanded",
	"semi-expanded",
	"extra-expanded",
	"ultra-expanded"
]

},{}],7:[function(require,module,exports){
module.exports=[
	"normal",
	"italic",
	"oblique"
]

},{}],8:[function(require,module,exports){
module.exports=[
	"normal",
	"bold",
	"bolder",
	"lighter",
	"100",
	"200",
	"300",
	"400",
	"500",
	"600",
	"700",
	"800",
	"900"
]

},{}],9:[function(require,module,exports){
module.exports=[
	"inherit",
	"initial",
	"unset"
]

},{}],10:[function(require,module,exports){
var t = require('tcomb');

var Options = t.struct({
	last: t.maybe(t.Boolean)
});

var helpers = {

	split: function(value, separators, options) {
		return split(value, separators, options || {});
	},

	splitBySpaces: t.func(t.String, t.Array).of(
		function(value) {
			var spaces = [' ', '\n', '\t'];
			return helpers.split(value, spaces);
		}
	),

	splitByCommas: t.func(t.String, t.Array).of(
		function(value) {
			var comma = ',';
			return helpers.split(value, [comma], { last: true });
		}
	)

};

var split = t.func([t.String, t.Array, Options], t.Array).of(
	function(value, separators, options) {
		var array   = [];
		var current = '';
		var split   = false;

		var func    = 0;
		var quote   = false;
		var escape  = false;

		for (var i = 0; i < value.length; i++) {
			var char = value[i];

			if (quote) {
				if (escape) {
					escape = false;
				} else if (char === '\\') {
					escape = true;
				} else if (char === quote) {
					quote = false;
				}
			} else if (char === '"' || char === '\'') {
				quote = char;
			} else if (char === '(') {
				func += 1;
			} else if (char === ')') {
				if (func > 0) {
					func -= 1;
				}
			} else if (func === 0) {
				if (separators.indexOf(char) !== -1) {
					split = true;
				}
			}

			if (split) {
				if (current !== '') {
					array.push(current.trim());
				}
				current = '';
				split = false;
			} else {
				current += char;
			}
		}

		if (options.last || current !== '') {
			array.push(current.trim());
		}
		return array;
	}
);

module.exports = helpers;

},{"tcomb":40}],11:[function(require,module,exports){
module.exports=[
	"caption",
	"icon",
	"menu",
	"message-box",
	"small-caption",
	"status-bar"
]

},{}],12:[function(require,module,exports){
'use strict';
module.exports = function (hex) {
	if (typeof hex !== 'string') {
		throw new TypeError('Expected a string');
	}

	hex = hex.replace(/^#/, '');

	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}

	var num = parseInt(hex, 16);

	return [num >> 16, num >> 8 & 255, num & 255];
};

},{}],13:[function(require,module,exports){
'use strict';

module.exports = function isArrayish(obj) {
	if (!obj) {
		return false;
	}

	return obj instanceof Array || Array.isArray(obj) ||
		(obj.length >= 0 && (obj.splice instanceof Function ||
			(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
};

},{}],14:[function(require,module,exports){
module.exports = array_UI;

var check = require('check-types');
var primitives = require("lib/util/primitives");

function array_UI(options) {
	if (!(this instanceof array_UI)) return new array_UI(options);
	
	//requires primitives.lib and primitives.createjs
	this._createjs = primitives.get('createjs');
	if (check.undefined(this._createjs) || check.not.object(this._createjs)) {
		throw new ReferenceError("'createjs' undefined or not object in primitives object.");
	}
	
	this._lib = primitives.get('lib');
	if (check.undefined(this._lib) || check.not.object(this._lib)) {
		throw new ReferenceError("'lib' undefined or not object in primitives object.");
	}
	
	//requires argument length, how big to make the array (should be integer > 0)
	if (check.undefined(options) || check.undefined(options.length) || check.not.integer(options.length) || options.length <= 0) {
		throw new TypeError("Require argument object with property 'length'. 'length' should be an integer > 0.");
	}
	
	//check for arrow specific options, optional
	var arrow_options = {
		name : "tail",
	};
	if (check.not.undefined(options) && check.not.undefined(options.arrow) && check.object(options.arrow)) {
		if (check.not.undefined(options.arrow.name)) {
			if (check.string(options.arrow.name)) {
				arrow_options.name = options.arrow.name;
			} else {
				throw new TypeError("Optional argument: arrow.name, should be String.");
			}
		}
	}
	
	//TODO: remove containers and just make container of ArrayElements
	//create an array of containers containing ArrayElements, we'll place the Text objects in the inner containers later when we assign a value to an index
	this._array = this._make_array(options.length);
	
	//decorate outer container with an array that will map to the values contained in the array holding the UI elements
	//	when they're added with the methods added below
	this._array = this._decorate_value_array(this._array);
	
	//decorate the outer container with an iterator() method, to get a UI arrow that acts as an iterator over the array
	this.array = this._decorate_iterator(this._array);
	
	//get the arrow associated with the array, points at the first elements in the array
	//	the arrow implements the iterator protocol and is assigned a next() function that will traverse the array,
	//	returning values in the array as well as move()ing the UI arrow to the next position in the array
	this._arrow = this._iterator(this._array, arrow_options.name);
	//adding the arrow to the array container to allow relative positioning of both UI elements as a unit
	//(the arrow is NOT traversed by a call to next() on the arrow, even though it is in the array container)
	this._array.addChild(this._arrow);
	//decorate the arrow onto the array, to allow referencing by calling functions
	this._array._.arrow = this._arrow;
	
	//decorate outer container with convenience methods that:
	//	handle adding values to the array
	//		this methods handles the UI aspects of adding value (move()) and the logical aspect (updating the internal logical / UI containers with the values added)
	this._array = this._decorate_method_push(this._array, this._arrow);
	
	//add the move() method to the array
	this._array = this._decorate_move(this._array);
	
	return this._array;
}

array_UI.prototype = {
	//METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS
	
	//creates an array of ArrayElement's, with maximum size length
	//each child in the array is a container containing an ArrayElement, when we're adding values, the values are added to they're associated container
	//each child is decorated with a _ namespace that is used later to add functionality
	//each child is decorated with a _.index property that matches its index in the array
	//the Container containing the the children is decorated with a _ namespace, to add functionality
	//the Container containing the the children is decorated with a _.length property to indicate its maximum size
	_make_array : function(length) {
		var offsetX = 0;
		var outer_container = new this._createjs.Container();
		
		for (var i = 0; i < length; i++) {
			//create the array element in a container, so 
			var arrayElement = new this._lib.ArrayElement();
			var inner_container = new this._createjs.Container();
			inner_container.addChild(arrayElement);
			
			//offset each subcontainer by the size of the array element box
			inner_container.x = offsetX;
			
			//create a new namespace to decorate into
			inner_container._ = {};
			
			//BUG:
			//for some reason the width as returned by getBounds() is about half of the ArrayElement length as shown on the canvas
			//	using 50px as workaround
			//offsetX += arrayElement.getBounds().width;
			offsetX += 50;
			
			//setting associated index (displays below ArrayElement figure, configured by AA)
			arrayElement.index_txt.text = String(i);
			//inner_container._.index = i;	//setting index for iteration by the tail arrow
			
			outer_container.addChild(inner_container);
		}
		
		//set bounds on the array, for using place() later
		//NOTE: having to guess at the height of the container, as arrayElement's don't have correct bounds
		outer_container.setBounds(0, 0, offsetX, 50 + 20);
		
		//create a namespace to decorate into
		outer_container._ = {};
		
		//add a length property, to show the maximum size of the array
		outer_container._.length = length;
		
		return outer_container;
	},
	
	//decorates a values array onto the array Container, that is meant to contain the numeric values added to the array
	_decorate_value_array : function(array) {
		array._.values = [];
		return array;
	},
	
	//add a method to the array to return an iterator arrow over the array
	//(name is required and cannot be empty)
	_decorate_iterator : function(array) {
		var instance = this;
		array._.iterator = function(name) {
			if(check.undefined(name) || check.emptyString(name)) {
				throw new TypeError("Required argument 'name' missing, should be non-empty String");
			}
			
			return instance._iterator(array, name);
		}
	},
	
	//TODO: adjust arrow_UI to allow for empty labels
	//add an arrow pointing at the 0th position of the array, labeled name (name is required and cannot be empty)
	//the arrow acts as a UI element and iterator, such that it will logically traverse the values array (above)
	//	as well as move() itself on the stage when its next() function is called
	//	as next() tracks indices according to the size of the array NOT using the size of the array.children array as its guide to how many children there are
	//decorates an "index" property into the _ namespace of the arrow, to track which index in the array the arrow is pointing to
	_iterator : function(array, name) {
		var arrow_UI = require('lib/UI/arrow_UI');
		
		var args = {
			name: String(name),
			//place the arrow initially under the 0th child
			position: {x:array.children[0].x + 22, y:70},
			//arrow is pointing at the 0th child
			pointed_at: array.children[0],
		};
		
		var arrow = arrow_UI(args);
		
		//decorate an "index" property
		//	and point it at the first index in the array
		arrow._.index = 0;
		
		function arrow_next(options) {
			//default to tweening the arrow around the stage
			//	if options.tween is false, then avoid tweening and set the new position instead
			var tween = true;
			if (check.not.undefined(options)) {
				if (check.not.undefined(options.tween)) {
					if (check.not.boolean(options.tween)) {
						throw new TypeError("Optional argument: 'tween', should be true or false.");
					} else {
						tween = options.tween;
					}
				}
			}
			
			if (arrow._.index + 1 > array._.length) {
				//going to be out of bounds case
				return {done : true};
			} else {
				var ret = {value : undefined, done : undefined};
				//increment to the next child, return its value and done === false
				//	move() arrow below next child
				var new_index = arrow._.index + 1;
				if (new_index < array._.length) {
					arrow._.pointed_at = array.children[new_index];
					
					//TODO: extract the value if any of the child pointed at and assign to ret.value
					//ret.value = this.pointed_at
					ret.value = undefined;
					ret.done = false;
				} else {
					arrow._.pointed_at = undefined;
					ret.value = undefined;
					ret.done = true;
				}
				
				//update the internal index to reflect the move
				arrow._.index = new_index;
				
				//move 50 px beyond the last child (this handles moving underneath children AND moving beyond the array)
				if (tween) {
					arrow._.move.to({x:array.children[new_index - 1].x + 50 + 22, y:70});
				} else {
					arrow.x = array.children[new_index - 1].x + 50 + 22;
					arrow.y = 70;
				}
				
				//value is always undefined, as we use the arrow to point to indices in the array which have no content (as it's the tail arrow)
				return ret;
			}
		};	//end function arrow_next()

		//register the next() function on the arrow (for iteration)
		arrow._.register_next(arrow_next);
		
		return arrow;
	},
	
	//add a method to push values onto the array
	//takes a createjs Text object, whose value is a number
	//tweens the Text object to the first available position in the UI array
	//	the index where the tail arrow is currently pointing, before move()d to the next position in the array
	//adds the value in the Text object to the "values" array (decorated in the _ namespace, above)
	//returns an error if the array is full
	_decorate_method_push : function(array, arrow) {
		array._.push = function(options) {
			if (check.undefined(options) || check.not.object(options)) {
				throw new TypeError("Requires a options object.");
			}
			
			//value should be a createjs.Text object, whose text value is a number
			if(check.not.instanceStrict(options.value, createjs.Text) || check.not.number(Number(options.value.text))) {
				throw new TypeError("Required argument: 'value', should be a createjs.Text object whose value is a number.");
			}
			
			//error if array is full
			if (array._.values.length === array._.length) {
				throw new RangeError("Array is full, cannot push() new value.");
			}
			
			//determines whether push() will tween the object around the stage or simply place it in the array
			var tween = true;
			if (check.not.undefined(options.tween)) {
				if (check.not.boolean(options.tween)) {
					throw new TypeError("Optional argument: 'tween', should be true or false.");
				} else {
					tween = options.tween;
				}
			}
			
			var value = options.value;
			
			//get the index where we can insert (from arrow)
			var insertion_index = arrow._.index;
			
			if (tween) {
				//move() value to that index
				var move = require('lib/util/move');
				var value_move = move(value);
				
				var initial_point;
				//BUG: Equality testing does not work when comparing the stage to itself
				if (check.null(value.parent.parent)) {
					//if value is on the stge, then:
					//translate the initial point of the value, to the local coordinate space of the array
					initial_point = array.children[insertion_index].globalToLocal(value.x, value.y);
				} else {
					//else the object is inside some container, so translate the coordinates from inside that container, to the coordinates of the target container
					initial_point = value.localToLocal(value.x, value.y, array.children[insertion_index]);
					
					//if the container has a _.values decorated array, then subtract the value from the array at the source
					var possible_array = value.parent.parent;
					
					if(check.object(possible_array._) && check.array(possible_array._.values)) {
						//find the value in the source's values array
						var index = possible_array._.values.findIndex(function(element, index, array) {
							if (element === Number(value.text)) return true;
							return false;
						});
						
						//if found (return was not -1) ...
						if (index >= 0) {
							//...then remove the value at that index
							possible_array._.values.splice(index, 1);
						} else {
							//...if not, throw to alert the user of some issue
							throw new Error("Unknown error, when attempting to push() a value (" + Number(value.text) + ") onto this array, the source array containing that value did NOT have that value in its internal values array (source_array._.values)");
						}
					}
				}
				
				//before moving the value into the array container, set its position such that it will appear not to have moved after translating to the new coordinate space inside the container
				value.x = initial_point.x;
				value.y = initial_point.y;
				
				//add the value to the array as a child of the container at the insertion_index
				array.children[insertion_index].addChild(value);
				
				//just move the value to the location within the child container inside the array, since each ArrayElement has its own container, we place relative to that, which is always within the same position relative to the ArrayElement on the canvas
				value_move.to( {x:9, y:15} );
			} else {
				//else if we're not moving, then just add it to the array with manual positioning
				array.children[insertion_index].addChild(value);
				value.x = 9;
				value.y = 15;
			}
			
			//add Number(value.text) to values array
			array._.values.push(Number(value.text));
			
			//return the new length of the array, as per Array.prototype.push()
			return array._.values.length;
		};
		
		return array;
	},
	
	_decorate_move : function(array) {
		var move = require('lib/util/move');
		array._.move = move(array);
		return array;
	},
	
	//PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES
	_createjs : undefined,		//holds a reference to the local createjs instance, avoiding the global
	_lib : undefined,			//holds a reference to the lib object, created by AA and used to access objects created by AA
	_array : undefined,			//internal reference to the array created
	_arrow : undefined,			//internal reference to the associated arrow to the array
};

array_UI.is_array = function(obj) {
	if (check.object(obj) &&
		check.object(obj._) &&
		check.function(obj._.push) &&
		check.array(obj._.values) &&
		check.integer(obj._.length)
		) {
			return true;
		}
	return false;
};
},{"check-types":2,"lib/UI/arrow_UI":15,"lib/util/move":25,"lib/util/primitives":27}],15:[function(require,module,exports){
module.exports = arrow_UI;

var check = require('check-types');
var primitives = require("lib/util/primitives");

function arrow_UI(options) {
	if (!(this instanceof arrow_UI)) return new arrow_UI(options);
	
	//requires primitives.createjs
	//TODO: will need primitives.lib once we're done using mock arrow
	this._createjs = primitives.get('createjs');
	if (check.undefined(this._createjs) || check.not.object(this._createjs)) {
		throw new ReferenceError("'createjs' undefined or not object in primitives object.");
	}
	
	if (check.undefined(options)) {
		throw new TypeError("Require argument object.");
	}
	
	//required argument: name (makes a createjs.Text object associated with the arrow)
	if (check.undefined(options.name) || check.not.string(options.name)) {
		throw new TypeError("Require argument object with property 'name', should be String.");
	}
	
	//required argument: position (object with x and y properties, that are both numeric)
	//	where to initially position the arrow on the stage
	if (check.undefined(options.position) || check.not.object(options.position) || check.not.number(options.position.x) || check.not.number(options.position.y)) {
		throw new TypeError("Require argument object with property 'position', should be Object with numeric properties x and y.");
	}
	
	//required argument: pointed_at (object)
	//	a reference to the UI object that the arrow is pointed at
	if (check.undefined(options.pointed_at) || check.not.object(options.pointed_at)) {
		throw new TypeError("Require argument object with property 'pointed_at', should be Object.");
	}
	
	this._arrow = this._make_arrow(options.name);
	
	this._arrow = this._decorate(this._arrow, options);
	
	return this._arrow;
};

arrow_UI.prototype = {
	//METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS
	_make_arrow : function(name) {
		var arrow_factory = require('lib/factory/arrow_factory');
		var af = arrow_factory();
		af.arrow({direction: "up"});
		
		var arrow = af.get();
		
		var c = new this._createjs.Container();
		c.addChild(arrow);
		
		//append the name to the arrow and decorate onto the arrow for reference
		var text_factory = require('lib/factory/text_factory');
		var tf = text_factory();
		tf.text({text:name});
		var label = tf.get();
		
		//lifted from 'lib/util/place', below()
		label.x = arrow.x - label.getBounds().x;
		label.y = arrow.y + arrow.getBounds().height - label.getBounds().y;
		
		//slight correction: down and to the left, to be centered under the arrow
		label.y += 5;
		label.x += -10;
		
		c.addChild(label);
		
		return c;
	},
	
	_decorate : function(arrow, options) {
		//setup namespace to decorate into
		arrow._ = {};
		
		//decorate with the name of the arrow
		arrow._.name = options.name;
		
		//position the arrow
		arrow.x = options.position.x
		arrow.y = options.position.y
		
		//store the reference of the object the arrow is pointed at
		arrow._.pointed_at = options.pointed_at
		
		//add move() functionality
		var move = require('lib/util/move');
		arrow._.move = move(arrow);
		
		//add functionality to register a next() function on the arrow
		//	the next function should implement the iterator protocol
		arrow._.register_next = function(func) {
			//required argument: next (function)
			//	manipulates the arrow as it iterates (moves around the stage, updates its internal variables, etc)
			if (check.undefined(func) || check.not.function(func)) {
				throw new TypeError("Required argument 'func', should be function.");
			}
			
			arrow._.next = func;
		}
		
		return arrow;
	},
	
	//PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES
	_createjs : undefined,		//holds a reference to the local createjs instance, avoiding the global
	_arrow : undefined,			//internal reference to the arrow created
};

arrow_UI.is_arrow = function(obj) {
	if (check.object(obj) &&
		check.object(obj._) &&
		check.string(obj._.name) &&
		check.function(obj._.register_next)
		) {
			return true;
		}
	return false;
};
},{"check-types":2,"lib/factory/arrow_factory":17,"lib/factory/text_factory":20,"lib/util/move":25,"lib/util/primitives":27}],16:[function(require,module,exports){
module.exports = lesson_UI;

var check = require('check-types');
var primitives = require("lib/util/primitives");

function lesson_UI(options) {
	if (!(this instanceof lesson_UI)) return new lesson_UI(options);
	
	//if we don't have a stage, createjs or lib object, can't continue, error
	this._createjs = primitives.get('createjs');
	if (check.undefined(this._createjs) || check.not.object(this._createjs)) {
		throw new ReferenceError("'createjs' undefined or not object in primitives object.");
	}
	
	this._stage = primitives.get('stage');
	if (check.undefined(this._stage) || check.not.object(this._stage)) {
		throw new ReferenceError("'stage' undefined or not object in primitives object.");
	}
	
	this._lib = primitives.get('lib');
	if (check.undefined(this._lib) || check.not.object(this._lib)) {
		throw new ReferenceError("'lib' undefined or not object in primitives object.");
	}
	
	//if we have a lesson argument, then it should be a function, otherwise not required
	if (check.not.undefined(options) && check.not.undefined(options.lesson)) {
		if (check.function(options.lesson)) {
			this._lesson = options.lesson;
		} else {
			throw new TypeError("Optional argument: 'lesson', should be function");
		}
	}
	
	this._state = this._INIT;
	
	//setup intial UI elements
	this._title_screen = this._setup_title_screen();
	this._start_button = this._setup_start_button();
	
	//add the title screen to the stage
	//	(start button is already added as a child of the title screen object) 
	this._stage.addChild(this._title_screen);
	
	this._state = this._PRE_LESSON;
	
	//play the initial title screen animation
	this._title_screen.gotoAndPlay("open");
};

lesson_UI.prototype = {
	//METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS
	
	//PRIVATE-PRIVATE-PRIVATE-PRIVATE-PRIVATE-PRIVATE-PRIVATE-PRIVATE-PRIVATE-PRIVATE-PRIVATE-PRIVATE
	
	//PRE_LESSON setup calls
	_setup_title_screen : function() {
		var title_screen = new this._lib.TitleScreen();
		title_screen.x = 192;
		title_screen.y = 256;
		
		//return the title screen to add to the stage
		return title_screen;
	},
	
	_setup_start_button : function() {
		//insert_btn is automatically populated inside the title screen object by AA
		var start_button = this._title_screen.insert_btn;
		
		//on button press for the insert button
		//next() to transition to the next state and play the close animation on the title screen
		var instance = this;
		start_button.addEventListener("click", function() {
			instance.next();
		});
		
		return start_button;
	},
	//PRE_LESSON setup calls END
	
	//LESSON setup calls
	_setup_array_screen : function() {
		var array_screen = new this._lib.ArrayScreen();	//setup by AA
		array_screen.x = 0;
		array_screen.y = 0;
		
		return array_screen;
	},
	
	//add a text input to the array_screen to capture user input
	_setup_text_input : function() {
		//get the text input
		var html_factory = require('lib/factory/html_factory');
		var hf = html_factory();
		hf.html({type:'text'});
		var text_input = hf.get();
		
		//position the text input
		text_input.x = 100;
		text_input.y = 100;
		
		//var instance = this;
		//decorate method to get value of text input
		text_input._.get = function() {
			//no matter what is entered the "value" property is always a string
			//emtpy string case / no input, Number returns 0 for this?
			if (text_input.children[0].htmlElement.value.length === 0) {
				return Number.NaN;
			}
			
			//despite the docs, this is a static method, so allocating it as per the docs (new Number), results in NaN on non-number input being wrapped in an object in a non-standard way that is undetectable by:
			//Number.Nan, equality checking with NaN, Number.isNaN() and typeof
			return Number(text_input.children[0].htmlElement.value);
		};
		
		//...and a method to set the value
		text_input._.set = function(value) {
			text_input.children[0].htmlElement.value = String(value);
		};
		
		//...and a convenience method to clear the text input
		text_input._.clear = function() {
			text_input.children[0].htmlElement.value = "";
		};
		
		return text_input;
	},
	
	//add a point to control the stepping of the lesson
	_setup_next_button : function() {
		var shape_factory = require('lib/factory/shape_factory');
		var sf = shape_factory();
		sf.color({color:'red'});
		sf.text({text:"Next"});
		sf.shape({type:"box"});
		
		var next_button = sf.get();
		
		//position next to the text input
		next_button.x = 300;
		next_button.y = 100;
		
		//adding pub/sub to event listener, so we can subscribe to click events later
		var pub_sub = require('pubsub-js');
		
		//add an event handler to the shape to listen for clicks
		next_button.children[0].addEventListener("click", function() {
			pub_sub.publish("click.next_button");
		});
		
		//decorate pub_sub on the object
		next_button._.pub_sub = pub_sub;
		
		//return for adding to the array screen
		return next_button;
	},
	
	//setup the text output and expose a control object with conenience methods
	_setup_text_output : function() {
		var text_factory = require('lib/factory/text_factory');
		var tf = text_factory();
		tf.text({text:""});	//set blank initially
		var output = tf.get();
		
		//decorate with convenience methods
		function get() {
			return output.text;
		}
		
		function set(value) {
			output.text = String(value);
		}
		
		function clear() {
			output.text = "";
		}
		
		output._.set = set;
		output._.get = get;
		output._.clear = clear;
		
		output.x = 100;	//aligned with the text input
		output.y = 420;	//position the text at the bottom of the screen
		
		return output;
	},
	//LESSON setup calls END
	
	//LESSON
	
	//INIT calls
	//setup a public namespace to allow registration of objects...
	register : {
		lesson : {
			//...that should be displayed on the canvas
			display : function() {},
			//...and called during the LESSON state
			call : function() {},
		},
	},
	//INIT calls END
	
	//method to create a createjs.Text object to tween on the canvas, that visually appears near the text input
	//	visualizes inputing information from the text input into the UI array
	_text_input_to_canvas : function() {
		if (this._state !== this._LESSON) return;
		
		input = this._text_input._.get();
		if (Number.isNaN(input)) return;
		
		var text_factory = require('lib/factory/text_factory');
		var tf = text_factory();
		tf.text({text:input});
		var ret = tf.get();
		
		//position near text input, to be ready for tweening
		//	the text input overlays any canvas element, so make the input appear just below the text input
		ret.x = this._text_input.x;
		ret.y = this._text_input.y + 20;
		
		//clear the text input
		this._text_input._.clear();
		
		//add the Text object to the stage
		ret._.add_to_stage();
		
		//return the text object so it can be tweened by the caller
		return ret;
	},
	
	//PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC
	
	//proceed through the states of the lesson
	next : function() {
		if (this._state === this._INIT) return;	//do nothing if in the INIT state
		
		//handling for title screen, before the lesson UI is displayed
		//	called from click of the Start button on the title screen
		if (this._state === this._PRE_LESSON) {
			//set the state into lesson to allow the transition to the lesson logic
			this._state = this._LESSON;
			
			this._title_screen.gotoAndPlay("close");
			
			this.next();
			
			//de-allocate the title screen
			this._title_screen = undefined;
			
			return;
		}
		
		//handling for lesson screen, after pre-lesson has ended
		//	called by the PRE_LESSON handler on title screen close
		if (this._state === this._LESSON) {
			this._array_screen = this._setup_array_screen();
			
			//add the text input HTML to the array screen
			//	cannot add earlier as appears over canvas even though not added to stage
			this._text_input = this._setup_text_input();
			
			//get the canvas_container div to attach the text input to
			var canvas_container = document.getElementById('canvas_container');
			
			//make text_input a child of the canvas_container
			this._text_input._.append_to(canvas_container);
			
			//add it to the array screen
			this._array_screen.addChild(this._text_input);
			
			//add a next button next to the text input to control the lesson
			this._next_button = this._setup_next_button();
			
			//add it to the array screen
			this._array_screen.addChild(this._next_button);
			
			//setup a createjs.Text object at the bottom of the screen to give the user instruction
			this._text_output = this._setup_text_output();
			
			//add it to the array screen
			this._array_screen.addChild(this._text_output);
			
			//add the array screen to the stage to draw it and all of its children
			this._stage.addChild(this._array_screen);
			
			//call the lesson with the proxy to finish the UI setup
			if (check.not.undefined(this._lesson)) {
				var proxy = this.get_proxy();
				this._lesson_instance = this._lesson({UI:proxy});
			}
			
			//after the above setup, do the opening animation for the array screen
			this._array_screen.gotoAndPlay("open");
			
			return;
		}
	},
	
	//return a proxy object that allows control of the UI by the lesson code
	get_proxy : function() {
		if (this._state !== this._LESSON) return undefined;
		
		var pub_sub = require('pubsub-js');
		var instance = this;
		
		//NOTE: `self` variables
		//	due to the closure, when attempting to access properties with static values (x, y)
		//	we'll get the values back, but be unable to set them on the parent object
		//	thus we've set the `self` variables in the individual namespaces to allow access to configure those parts of the UI
		return {
			input : {
				get : instance._text_input._.get,
				set : instance._text_input._.set,
				clear : instance._text_input._.clear,
				//have to call() here as if this is called from the proxy,
				//then the `this` variable (in _text_input_to_canvas()) becomes the `input` namespace within the proxy
				//causing bizarre errors
				get_canvas_element : function() {
					return instance._text_input_to_canvas.call(instance);
				},
				self : instance._text_input,
			},
			output : {
				get : instance._text_output._.get,
				set : instance._text_output._.set,
				clear : instance._text_output._.clear,
				self : instance._text_output,
			},
			next_button : instance._next_button,
			stage : {
				//as we only need to manipulate the UI in the lesson stage
				//just make changes to this._array_screen
				add : function(obj) {
					if(check.not.object(obj) || check.not.instanceStrict(obj, instance._createjs.DisplayObject)) {
						throw new TypeError("Bad argument to stage.add(), should be createjs.DisplayObject");
					}
					instance._array_screen.addChild(obj);
					instance._stage.update();
				},
				del : function(obj) {
					var result = instance._array_screen.removeChild(obj);
					instance._stage.update();
					return result;
				},
			},
			pub_sub : pub_sub,
		};
	},	//end get_proxy()
	
	//internal variables
	_stage : undefined,			//holds a reference to the createjs stage (of type lib.unorderedArray, created in AA)
	_createjs : undefined,		//holds a reference to the local createjs instance, avoiding the global
	_lib : undefined,			//holds a reference to the lib object, created by AA and used to access objects created by AA
	_title_screen : undefined,	//reference to an object of type TitleScreen (created in AA)
	_start_button : undefined,	//reference to the insert button object (AA)
	_array_screen : undefined,	//reference to the array screen object (AA)
	_text_input : undefined,	//reference to the text input created, that's attached to the array screen
	_next_button : undefined,	//reference to the next button, used in lesson, to continue the lesson once started
	_lesson : undefined,		//reference to the lesson, a function that we pass a proxy object to while calling in the LESSON state
	
	//state tracking variables
	_state : undefined,
	_INIT : 0,
	_PRE_LESSON : 1,
	_LESSON : 2,
};
},{"check-types":2,"lib/factory/html_factory":18,"lib/factory/shape_factory":19,"lib/factory/text_factory":20,"lib/util/primitives":27,"pubsub-js":36}],17:[function(require,module,exports){
//used to construct UI arrow (three strokes, forming a <- pattern)
//defaults from LaFore: 20px long, 12px wide, red, poiting to the left
//	the vertical distance along the arrow body that the arrowhead extends, is also 6px

var check = require('check-types');
var argument_check = require("lib/util/argument_check");
var type_of = require('lib/util/type_of');
var primitives = require("lib/util/primitives");

module.exports = arrow_factory;

function arrow_factory(options) {
	if (!(this instanceof arrow_factory)) return new arrow_factory(options);
	
	//is createjs already registered?
	this._createjs = primitives.get('createjs');
	if (check.undefined(this._createjs) || check.not.object(this._createjs)) {
		throw new ReferenceError("'createjs' undefined or not object in primitives object.");
	}
		
	//angle is counted as rotating to the RIGHT for positive values (counterintuitively)
	//so a left facing arrow has an angle value of -180 degrees
	//the below code will build an arrow that faces to the left by default, so initial angle is zero
	this._arrow_options = {length: 20, width: 12, color: 'red', angle: 0};
	
	this._container_options = {x:0, y:0};
	
	this._default_directions = {'left':0, 'right':-180, 'up':-270, 'down':-90};
}

arrow_factory.prototype = {
	//METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS
	
	//sets up a new arrow, with optional argument: length, width, color, angle and direction
	//	where direction is a convenience alias for angle and accepts: 'left', 'right', 'up' and 'down'
	//	angle is internally translated from standard standard left hand rotation (e.g. 90 degrees points up as normal, instead of down as per the canvas)
	arrow : function(options) {
		if(!(check.object(options) || check.undefined(options))) {
			throw new TypeError("Incorrect argument type, requires Object or undefined.");
		}
		
		//validated options: type, id
		var validated_options;
		try {
			validated_options = argument_check(options);
		} catch(error) {
			throw error;
		}
		
		//check arguments unique to arrow construction
		//validated options: angle, length, direction
		if(!(check.number(validated_options.angle) || check.undefined(validated_options.angle))) {
			throw new TypeError("Variable: " + "angle" + " was " + type_of(validated_options.angle) + ", should be: " + "number");
		}
		if(!(check.number(validated_options.length) || check.undefined(validated_options.length))) {
			throw new TypeError("Variable: " + "length" + " was " + type_of(validated_options.length) + ", should be: " + "number");
		} else {
			if (check.number(validated_options.length) && validated_options.length <= 0) {
				throw new TypeError("Variable: " + "length" + " was " + validated_options.length + ", should be greater than zero.");
			}
		}
		if(!(check.string(validated_options.direction) || check.undefined(validated_options.direction))) {
			throw new TypeError("Variable: " + "direction" + " was " + type_of(validated_options.direction) + ", should be: " + "string");
		} else {
			if (check.string(validated_options.direction) && !(validated_options.direction in this._default_directions)) {
				throw new TypeError("Variable: " + "direction" + " was " + validated_options.direction + ", should be: " 
				+ "one of these: " + "'left', 'right', 'up' or 'down'");
			}
		}
		
		//it's an error to have both angle and direction passed
		if (check.number(validated_options.angle) && check.string(validated_options.direction)) {
			throw new Error('Cannot have options "angle" and "direction" defined at the same time.');
		}
		
		//translate normal angle notation to special angle notation used by canvas
		if (check.number(validated_options.angle)) {
			validated_options.angle = -validated_options.angle;
		}
		
		//if direction is set, then translate that into an angle and unset direction before setting options on _arrow_options
		if(check.string(validated_options.direction)) {
			validated_options.angle = this._default_directions[validated_options.direction];
			delete validated_options.direction;
		}
		
		//copy settings for arrow creation on get()
		for (option in validated_options) {
			this._arrow_options[option] = validated_options[option];
		}
	},
	
	//return a createjs Shape of the tip of the arrow
	_get_tip : function() {
		var tip = new this._createjs.Shape();
		
		//start drawing at the top, then move to the very end of the tip, then to the bottom
		//creating an open ended triangle whose base is twice as long as it is tall
		tip.graphics.beginStroke(this._arrow_options.color)
			.moveTo((this._arrow_options.width/2), -(this._arrow_options.width/2))
			.lineTo(0, 0)
			.lineTo((this._arrow_options.width/2), (this._arrow_options.width/2));
			
		return tip;
	},
	
	//return a createjs Shape of the line composing the rest of the arrow
	_get_line : function() {
		var line = new this._createjs.Shape();
		
		//start at the tip of the arrow (0, 0) and create a line that is as long as the length property
		line.graphics.setStrokeStyle(1)
			.beginStroke(this._arrow_options.color).moveTo(0, 0).lineTo(this._arrow_options.length, 0);
			
		return line;
	},
	
	//return a createjs Container, containing the tip and line, forming the arrow
	_bundle : function(tip, line) {
		var container = new this._createjs.Container();
		container.addChild(tip);
		container.addChild(line);
		return container;
	},
	
	_decorate : function(container) {
		container._ = {};
		
		//apply bounds of the arrow
		container.setBounds(0, 0, this._arrow_options.length, this._arrow_options.width);
		
		//add placing functionality to container
		var place = require('lib/util/place');
		container._.place = place(container);
		
		//add add_to_stage functionality
		var add_to_stage = require('lib/util/add_to_stage');
		container._.add_to_stage = add_to_stage(container);
		
		return container;
	},
	
	//set user options (positioning) as passed to get(), then apply angle of rotation to the container
	_set_props : function(container, options) {
		//copy settings for arrow creation on get()
		for (option in options) {
			this._container_options[option] = options[option];
		}
		
		//copy container options to container for return
		for (option in this._container_options) {
			container[option] = this._container_options[option];
		}
		
		//apply the angle of rotation to the arrow
		container.rotation = this._arrow_options.angle;
		
		return container;
	},
	
	//takes positioning (and other) options on the container
	get : function(options) {
		if(!(check.object(options) || check.undefined(options))) {
			throw new TypeError("Incorrect argument type, requires Object.");
		}
		
		//validated options: x, y
		var validated_options;
		try {
			validated_options = argument_check(options);
		} catch(error) {
			throw error;
		}
		
		var tip = this._get_tip();
		var line = this._get_line();
		var container = this._bundle(tip, line);
		container = this._decorate(container);
		return this._set_props(container, validated_options);
	},
	
	//TODO
	//takes two points, resturns an arrow whose origin is origin and whose terminal point (which point it points at) is terminal
	//	points are of the form: [x, y] (where x and y are numbers)
	/* get_arrow_between : function(origin, terminal) {
		if (!(
			check.array(origin) && 
			check.array(terminal) && 
			check.number(origin[0]) && 
			check.number(origin[1]) && 
			check.number(terminal[0]) && 
			check.number(terminal[1])
			)
			) {
			throw new TypeError("Incorrect argument type, should be array: [x, y] (where x and y are numbers)");
		}
		
		//calculate distance between the points
		var distance = require('euclidean-distance');
		var l = distance(origin, terminal);
		
		//then update the arrow, so that it is that length
		this.arrow({length:l});
		
		//calculate the angle needed to have the tip of the arrow rest on the terminal, given that the initial point is at origin
		
		//get an arrow, such that it's initial point is set at origin
		var a = this.get({x:origin[0], y:origin[1]});
		
		
	}, */
	
	//PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES
	_arrow_options : {},			//holds options for arrows
	_default_directions : {},		//default direction strings that an arrow accepts mapping to angle values
	_container_options : {},		//options applied to the container, used for positiong of the figure, etc
};
},{"check-types":2,"lib/util/add_to_stage":22,"lib/util/argument_check":24,"lib/util/place":26,"lib/util/primitives":27,"lib/util/type_of":31}],18:[function(require,module,exports){
//create a variety of HTML input controls
//each element is created via the document global then wrapped in a createjs.DOMElement for positioning through createjs
//then the DOMElement and an optional text field are wrapped in a createjs.Container
//each container is then appended with properties / methods:
//	allow access to the underlying HTML
//	a method apply_to(), that allows it to be attached to another HTML element in the DOM
//	e.g.
//		var target = document.getElementById(dom_element);
//		target.appendChild(html_element);

//initial supported HTML input controls supported:
//	button, radio button & text input

//	TODO: breakout handling of different types of HTML controls into their own code and require() here
module.exports = html_factory;

var check = require('check-types');
var argument_check = require("lib/util/argument_check");
var primitives = require("lib/util/primitives");

function html_factory(options) {
	//get an instance if we just call it
	if(!(this instanceof html_factory)) return new html_factory(options);
	
	//is createjs already registered?
	this._createjs = primitives.get('createjs');
	if (check.undefined(this._createjs) || check.not.object(this._createjs)) {
		throw new ReferenceError("'createjs' undefined or not object in primitives object.");
	}
	
	//create the text factory instance for getting Text for our Shapes
	var text_factory = require('lib/factory/text_factory');
	this._text_factory = text_factory();
	//default text should be empty string
	this._text_factory.text({text:''});
	
	//options for the raw HTML element
	this._html_options = {};
	
	//options for the container
	this._container_options = {x:0, y:0};
	
	//default HTML types
	this._default_types = ['radio', 'text', 'button'];
	
	this._name = '';
};

html_factory.prototype = {
	//METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS
	
	//public
	//configures the value of the text, defaults to an empty string
	//optionally takes text positioning and configuration options (font, color, x, y, etc)
	//	and text (a String()-able object or a createjs Text object) to set the value of the text to
	//pass in empty string for empty text
	text : function(options) {
		this._text_factory.text(options)
	},
	
	//TODO: if 'type' option already set, then don't complain about 'type' not being an argument
	//public
	//configures the raw HTML input element as returned from document.createElement
	//	validated options: type, id (is String'd if present)
	//	type is required, id is optional
	//	if id is undefined, then a unique id is generated and exposed as a decorated property at get() time
	html : function(options) {
		if(!check.object(options)) {
			throw new TypeError("Incorrect argument type, requires Object.");
		}
		
		//validated options: type, id
		var validated_options;
		try {
			validated_options = argument_check(options);
		} catch(error) {
			throw error;
		}
		
		//if type isn't passed...
		if (!("type" in validated_options)) {
			throw new TypeError("argument 'type' is required, should be non-empty String");
		}
		
		//type was passed, but unsupported type
		if (this._default_types.indexOf(validated_options.type) === -1) {
			throw new TypeError("argument 'type' was unsupported: " + String(validated_options.type));
		}
		
		//generate an id if we need one
		if(!("id" in validated_options)) {
			var unique_id = require('lib/util/unique_id');
			var id_str = unique_id(validated_options.type);
			validated_options.id = id_str;
		} else {
			//...else if the user passed us one, just String it
			validated_options.id = String(validated_options.id);
		}
		
		//if the type was 'button', then we can take an optional 'label' argument, but not allowed on any other HTML type
		if (validated_options.type !== 'button' && !(check.undefined(validated_options.label))) {
			throw new TypeError("argument 'label' is only used with 'button' HTML type");
		}
			
		//set HTML options for producing HTML in _get_html() later		
		for (option in validated_options) {
			this._html_options[option] = validated_options[option];
		}
	},
	
	//public
	//decorate an optional name value on the HTML for identification purposes
	name : function(value) {
		if(!check.undefined(value)) this._name = String(value);
	},
	
	//private
	//returns a configured createjs Text() object as configured in text()
	_get_text : function() {
		return this._text_factory.get();
	},
	
	//private
	//returns a configured HTML option as configured in html()
	_get_html : function() {
		var html = document.createElement('input');
		html.type = this._html_options.type;
		html.id = this._html_options.id;
		//positions html at (0, 0) on canvas
		html.style.top = 0;
		html.style.left = 0;
		
		//copy any other user options to the html object
		for (option in this._html_options) {
			if (option === 'label') {
				//string anything the user passed in for the label
				//NOTE: as incorrectly documented on MDN, to apply a label to a button use the 'value' property instead of 'label'
				//https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
				html.value = String(this._html_options['label']);
				continue;
			}
			html[option] = this._html_options[option];
		}
		
		return html;
	},
	
	//private
	//wraps the raw HTML object in a createjs.DOMElement
	//	where the raw HTML can be found as the htmlElement property on the DOMElement object
	_get_dom_element : function (html) {
		return new this._createjs.DOMElement(html);
	},
	
	//private
	//bundle the DOMElement and text together in a createjs.container
	//adding properties for convenience methods on the container from the html and text
	_bundle : function(DOMElement, text) {
		var container = new this._createjs.Container();
		
		//adding text last, such that it appears above the HTML
		container.addChild(DOMElement);
		container.addChild(text);
		
		//adding convenience methods for accessing internal objects for later
		//	within the _ namespace
		container._ = {};
		container._.htmlElement = DOMElement.htmlElement;
		container._.text = text.text;	//get the value of the text, not the Text object
		
		return container;
	},
	
	//private
	//add additional convenience methods to the container for ease of accessing and using the HTML object
	_decorate : function(container) {
		var append_to = require('lib/util/append_to');
		container._.append_to = append_to(container);
		
		//TODO, setup place commands on container for easy positioning
		//	the DOMElement can't calculate its own bounds, so we have no reliable way to getting the bounds of the HTML object
		//	the Element interface DOES have some ways of calculating the dimensions of the elements, but they're marked as experimental at this time:
		//	https://developer.mozilla.org/en-US/docs/Web/API/Element
		/* var place = require('lib/util/place');
		container._.place = place(container); */
		
		//add add_to_stage functionality
		var add_to_stage = require('lib/util/add_to_stage');
		container._.add_to_stage = add_to_stage(container);
		
		//add optional name
		//if name is unset, attempt to attach 'label' property as name on container
		//otherwise 'name' is ''
		if (this._name.length === 0) {
			if (!(check.undefined(this._html_options.label))) container._.name = String(this._html_options.label);
		} else {
			container._.name = this._name;
		}
		
		return container;
	},
	
	_set_props : function(container, options) {
		//save the user options
		for (option in options) {
			this._container_options[option] = options[option];
		}
		
		//...and apply any new options to the container
		for (option in this._container_options) {
			container[option] = this._container_options[option];
		}
		
		return container;
	},
	
	get : function(options) {
		if(!(check.object(options) || check.undefined(options))) {
			throw new TypeError("Incorrect argument type, requires Object.");
		}
		
		if (!("type" in this._html_options)) {
			throw new TypeError("Unknown type of HTML to create, run html() first before calling get()");
		}
		
		//validated options: x, y
		var validated_options;
		try {
			validated_options = argument_check(options);
		} catch(error) {
			throw error;
		}
		
		var html = this._get_html();							//get the raw HTML
		var text = this._get_text();							//get the optional Text
		var de = this._get_dom_element(html);					//wrap the raw HTML in a createjs.DOMElement
		var container = this._bundle(de, text);					//bundle the DOMElement and text together in a createjs.container
		container = this._decorate(container)					//add additional convenience methods specific to the HTML to the container
		return this._set_props(container, validated_options);	//set last minute user defined properties on the container
	},
	
	//PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES
	_text_factory : undefined,	//holds the text_factory instance
	_html_options : {},			//options for the raw HTML element
	_container_options : {},	//options for the container
	_default_types : [],		//default HTML types
	_shape_type : undefined,	//HTML input type setup in html()
	_name : '',					//optional name to attach to the HTML
	_createjs : undefined,		//local reference to the createjs object
};
},{"check-types":2,"lib/factory/text_factory":20,"lib/util/add_to_stage":22,"lib/util/append_to":23,"lib/util/argument_check":24,"lib/util/primitives":27,"lib/util/unique_id":32}],19:[function(require,module,exports){
module.exports = shape_factory;

var check = require('check-types');
var argument_check = require("lib/util/argument_check");
var primitives = require("lib/util/primitives");

function shape_factory(options) {
	//get an instance if we just call it
	if(!(this instanceof shape_factory)) return new shape_factory(options);
	
	//is createjs already registered?
	this._createjs = primitives.get('createjs');
	if (check.undefined(this._createjs) || check.not.object(this._createjs)) {
		throw new ReferenceError("'createjs' undefined or not object in primitives object.");
	}
	
	//configure defaults for color of Shape
	this._color_options = {fill:undefined, stroke:null}
	
	//create the text factory instance for getting Text for our Shapes
	var text_factory = require('lib/factory/text_factory');
	this._text_factory = text_factory();
	
	//default sizing and positioning options for the Shape
	//	default h and w for rect shapes come from LaFore defaults
	//TODO: radius = 1, is a placeholder until we can measure the radius of circles used in LaFore
	this._shape_options = {radius: 1, height:18, width:36, x:0, y:0},
	
	//default options for the container (that will hold both the Shape and Text)
	//users can set persistent options for the container by passing options to get()
	this._container_options = {x:0, y:0};
	
	//configure default shapes the factory knows about
	//'rectangle' and 'box' are aliases for 'rect'
	this._default_shapes = ["circle", "rect", "rectangle", "box"];
	
	//configured in shape() then used in _get_shape() to return the Shape object
	this._shape_type = undefined;
};

shape_factory.prototype = {
	//METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS
	
	//public
	//configures the fill and stroke of the shape returned
	//default behavior for the fill is getting a random color that has good contrast with the text color
	//default for stroke is null
	//takes optional values for fill and stroke
	color : function(options) {
		if(!(check.object(options) || check.undefined(options))) {
			throw new TypeError("Incorrect argument type, requires Object.");
		}
		
		//validated options: color (alias for fill), fill, stroke
		var validated_options;
		try {
			validated_options = argument_check(options);
		} catch(error) {
			throw error;
		}
		
		if ('fill' in validated_options) {
			this._color_options['fill'] = validated_options['fill'];
		}
		
		if ('color' in validated_options) {
			this._color_options['fill'] = validated_options['color'];
		}
		
		if ('stroke' in validated_options) {
			this._color_options['stroke'] = validated_options['stroke'];
		}
	},
	
	//public
	//configures the value of the text, defaults to a random integer between 0 and 1000
	//optionally takes text positioning and configuration options (font, color, x, y, etc)
	//	and text (a String()-able object or a createjs Text object) to set the value of the text to
	//pass in empty string for empty text
	text : function(options) {
		this._text_factory.text(options)
	},
	
	//public
	//configures the type of shape to return, 'type' must be a known string (circle, rect, etc)
	//includes defaults for size
	shape : function(options) {
		if(!(check.object(options) || check.undefined(options))) {
			throw new TypeError("Incorrect argument type, requires Object.");
		}
		
		//validated options:
		//	height, width (for rect shapes)
		//	radius (for circle shapes)
		var validated_options;
		try {
			validated_options = argument_check(options);
		} catch(error) {
			throw error;
		}
		
		//if type isn't passed...
		if (!("type" in validated_options)) {
			throw new TypeError("argument 'type' is required, should be non-empty String");
		}
		
		if(this._default_shapes.indexOf(validated_options.type) === -1) {
			throw new TypeError("argument 'type' was unknown shape type: " + String(validated_options.type));
		}
		
		if (validated_options.type === "circle") {
			//if there are configuration options, then use them, otherwise the defaults
			if(validated_options.radius) this._shape_options.radius = validated_options.radius;
			
			this._shape_type = "circle"
			return;
		}
		
		if (validated_options.type === "rectangle" || validated_options.type === "rect" || validated_options.type === "box") {
			//if there are confgiuration options, then use them, otherwise the defaults
			if(validated_options.width) this._shape_options.width = validated_options.width;
			if(validated_options.height) this._shape_options.height = validated_options.height;
			
			this._shape_type = "rect"
			return;
		}
	},
	
	//private
	//configured by color(), returns user defined CSS hex color string(s) if supplied
	//	otherwise a random fill color that has good contrast with the text color and null for the stroke
	_get_color : function() {
		var fill, stroke;
		
		//if the fill is undefined (the default) then get a random color with good constrast with the text color
		if (check.undefined(this._color_options.fill)) {
			fill = (require('lib/util/random_color'))(this._text_factory.color());
		} else {
			fill = this._color_options.fill;
		}
		stroke = this._color_options.stroke;
		
		return {fill:fill, stroke:stroke};
	},
	
	//private
	//returns a configured createjs Text() object as configured in text()
	_get_text : function() {
		return this._text_factory.get();
	},
	
	//private
	//returns a configured createjs Shape object, as configured by shape()
	_get_shape : function(shape_color) {
		if (check.undefined(this._shape_type)) {
			throw new TypeError("Unknown type of Shape to create, run shape() first before calling get()");
		}
		
		var shape = new this._createjs.Shape();
		
		//assign color (stroke and fill) BEFORE applying shape for some reason (createjs idiom)
		shape.graphics.beginFill(shape_color.fill);
		shape.graphics.beginStroke(shape_color.stroke);
		
		//assign (x, y) coordinates to the Shape in _get_shape() rather than on the Graphic (createjs idiom)
		shape.x = this._shape_options.x;
		shape.y = this._shape_options.y;
		
		//circle specific Shape handling
		if (this._shape_type === 'circle') {
			shape.graphics.drawCircle(0, 0, this._shape_options.radius);
			
			//set bounds on the Shape for later
			//Note: we set the (x, y) coordinates to the top left hand corner of the "bounding box"
			//	as such the (x, y) coordinates are always negative, as we are always above and to the left of center
			//	where the (x, y) coordinates of how the Shape is placed is figured by createjs
			shape.setBounds(-this._shape_options.radius, 
				-this._shape_options.radius, 
				2*this._shape_options.radius,
				2*this._shape_options.radius
				);
		}
		
		//rectangle specific Shape handling
		if (this._shape_type === 'rect') {
			shape.graphics.drawRect(0, 0, this._shape_options.width, this._shape_options.height);
			
			//set bounds on the Shape for later
			shape.setBounds(0, 0,
				this._shape_options.width,
				this._shape_options.height
				);
		}
		
		//assign any other user options to the Shape
		for (shape_option in this._shape_options) {
			//...except for those we've already covered
			if (shape_option in {radius:null, height:null, width:null, x:null, y:null}) continue;
			shape[shape_option] = this._shape_options[shape_option];
		}
		
		//return the Shape
		return shape;
	},
	
	//private
	//returns a createjs container with the configured shape and text objects inside
	//	such that the text is viewable, overlaying the Shape
	_bundle : function(shape, text) {
		var container = new this._createjs.Container();
		container.addChild(shape);
		container.addChild(text);
		return container;
	},
	
	//private
	//set convenience accessor properties on the container, as well as any positioning / transform options passed to get()
	_set_props : function(container, options) {
		var validated_options;
		try {
			validated_options = argument_check(options);
		} catch(error) {
			throw error;
		}
		
		//set user options in _container_options to save state
		for (option in validated_options) {
			this._container_options[option] = validated_options[option];
		}
		
		//... and then apply to container
		for (option in this._container_options) {
			container[option] = this._container_options[option];
		}
		
		return container;
	},
	
	//TODO: modify to have color items decorated on to shape object
	//	then just append them to the container in _decorate here
	_decorate : function(container, color) {
		var shape = container.children[0];
		var text = container.children[1];
		
		container._ = {};
		
		//set the container's event listener methods, to point to the Shape's event listener methods
		container._.on = shape.on;
		container._.off = shape.off;
		container._.addEventListener = shape.addEventListener;
		container._.hasEventListener = shape.hasEventListener;
		container._.removeAllEventListeners = shape.removeAllEventListeners;
		container._.removeEventListener = shape.removeEventListener;
		
		//manually set container bounds to Shape bounds
		//as the container bounds can inherit from the Text bounds which are apparently set automatically while the Shape is not?
		container.setBounds(shape.getBounds().x, shape.getBounds().y, shape.getBounds().width, shape.getBounds().height);
		
		//setup place commands on container for easy positioning
		var place = require('lib/util/place');
		container._.place = place(container);
		
		//add add_to_stage functionality
		var add_to_stage = require('lib/util/add_to_stage');
		container._.add_to_stage = add_to_stage(container);
		
		//setup properties for the Shape stroke and fill
		container._.shape_fill = color.fill;
		container._.shape_stroke = color.stroke;
		
		return container;
	},
	
	//public
	//allocate a new shape of the configured type
	get : function (options) {
		if(!(check.object(options) || check.undefined(options))) {
			throw new TypeError("Incorrect argument type, requires Object.");
		}
		
		//template pattern, build the shape object
		//where options can be positioning and transform options as applied to the container
		var shape_color = this._get_color();				//get the color string used in shape construction
		var shape_text = this._get_text();					//the text value to display with the shape
		var shape = this._get_shape(shape_color);			//get the shape itself
		var container = this._bundle(shape, shape_text);	//bundle the shape and text into a createjs container
		container = this._decorate(container, shape_color);	//add additional convenience methods specific to the Shape to the container
		return this._set_props(container, options);			//add properties user propertier to container
	},
	
	//PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES
	//private
	//the color used on the shape, if undefined then just use random
	_color_options : {},
	//private
	//text factory, used in setting up Text objects for Shape's
	_text_factory : undefined,
	//private
	//shape options and type as set in shape()
	_shape_options : {},
	//private
	//defines what method is used to construct the Shape, once configured in shape()
	_shape_type : undefined,
	//private
	//options for the container pased back to the caller
	_container_options : {},
	
	_createjs : undefined,		//local reference to the createjs object
};
},{"check-types":2,"lib/factory/text_factory":20,"lib/util/add_to_stage":22,"lib/util/argument_check":24,"lib/util/place":26,"lib/util/primitives":27,"lib/util/random_color":28}],20:[function(require,module,exports){
module.exports = text_factory;

var check = require('check-types');
var argument_check = require("lib/util/argument_check");
var primitives = require("lib/util/primitives");

function text_factory(options) {
	//get an instance if we just call it
	if(!(this instanceof text_factory)) return new text_factory(options);
	
	//is createjs already registered?
	this._createjs = primitives.get('createjs');
	if (check.undefined(this._createjs) || check.not.object(this._createjs)) {
		throw new ReferenceError("'createjs' undefined or not object in primitives object.");
	}
	
	//configure defaults for Text
	this._text_options = {color:"black", font:"18px Arial", text:undefined};
};

text_factory.prototype = {
	//METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS
	
	//public
	//returns the createjs.Text object as configured in text()
	//if there are last minute options by the user, then shortcut to configure via text() and return the configured object
	get : function(options) {
		if (options) this.text(options);
		var text = this._get_text();
		return this._decorate(text);
	},
	
	//public
	//configures the value of the text, defaults to a random integer between 0 and 1000
	//optionally takes text positioning and configuration options (font, color, x, y, etc)
	//	and text (a String()-able object or a createjs Text object) to set the value of the text to
	//pass in empty string for blank text
	text : function(options) {
		if(!(check.object(options) || check.undefined(options))) {
			throw new TypeError("Incorrect argument type, requires Object.");
		}
		
		//validated arguments: color, font, x, y, text, textAlign
		var validated_options;
		try {
			validated_options = argument_check(options);
		} catch(error) {
			throw error;
		}
		
		//text handler
		//if text is set, then verify it's either a createjs Text() object or something we can String()
		if(!check.undefined(validated_options.text)) {
			if (!(check.instance(validated_options.text, this._createjs.Text))) {
				validated_options.text = String(validated_options.text);
			}
		}
		
		//append / overwrite any options passed in
		for (variable in validated_options) {
			this._text_options[variable] = validated_options[variable];
		}
	},
	
	//public
	//getter functions, used for exposing internal options
	color : function() {return this._text_options.color;},
	font : function() {return this._text_options.font;},
	
	//private
	//returns a configured createjs Text() object as configured in text()
	_get_text : function() {
		var value;
		//if default, then create a random number to assign to the Text
		if (check.undefined(this._text_options.text)) {
			var random_integer = require('lib/util/random_integer');
			value = String(random_integer());
		}
		
		//if user defined, then assign it (always a String)
		if (check.string(this._text_options.text)) {
			value = this._text_options.text;
		}
		
		//if a Text object, then just return that
		if (check.instance(this._text_options.text, this._createjs.Text)) {
			return this._text_options.text;
		}
		
		//...otherwise create new Text object, initialize to value
		var text = new this._createjs.Text(value);
		
		//...and copy options that was set in text() to the Text object
		for (text_option in this._text_options) {
			//skipping text, as we don't want to overwrite what we initialized it to
			if (text_option === 'text') continue;
			text[text_option] = this._text_options[text_option];
		}
		
		return text;
	},
	
	//private
	//returns a decorated text object
	_decorate : function(text) {
		text._ = {};
		
		//TODO: why does this do it this way?
		//NOTE: this wierdly makes tests in other factories fail, claiming that bounds are not set on the object?
		//UPDATE: this might have something to do with empty string Text objects do NOT have bounds set on them
		//add place() functionality
		/* var place = require('lib/util/place');
		text._.place = place(text); */
		
		//add add_to_stage functionality
		var add_to_stage = require('lib/util/add_to_stage');
		text._.add_to_stage = add_to_stage(text);
		
		return text;
	},

	//PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES
	
	//private
	_text_options : {},		//text options and values as set by text()
	_createjs : undefined,	//internal refrence to the createjs object
};
},{"check-types":2,"lib/util/add_to_stage":22,"lib/util/argument_check":24,"lib/util/primitives":27,"lib/util/random_integer":30}],21:[function(require,module,exports){
var check = require('check-types')

function lesson(options) {
	if (!(this instanceof lesson)) return new lesson(options);
	
	//if we don't have a UI object, can't continue, error
	if (!(check.object(options) && check.object(options.UI))) {
		throw new TypeError("Argument 'UI' (object) is required, argument should be object.");
	}
	
	this._UI = options.UI;
	
	//SETUP
	//initial setup state
	this._state = this._INIT;
	
	//setup the UI array used during the lesson
	var array_size = 4;
	var result = this._setup_array(array_size);
	this._array = result;
	this._arrow = result._.arrow;
	
	//insert random values into the array
	this._array = this._populate_array(this._array, this._arrow);
	
	//register the UI elements with the UI
	//	only add the array as the arrow is a child of the array component
	this._UI.stage.add(this._array);
	
	var next = this.next;
	var pre_start = this.pre_start;
	var instance = this;
	//setup event handler on Next button
	//NOTE: had to use call() here, methods were being called with the window assigned to `this` as they were being called from inside an event handler
	this._UI.pub_sub.subscribe("click.next_button", function() {
		//if we're tweening, do nothing that would involve an animation
		var move = require('lib/util/move');
		if (move.is_moving()) return;
		//otherwise either start or continue with a lesson
		next.call(instance);
	});
	
	//all done with initial setup
	this._state = this._READY;
};

lesson.prototype = {
	//METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS
	
	//PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC-PUBLIC
	
	//public function to handle calling internal lesson logic
	next : function() {
		return this._next({UI: this._UI, array:this._array, arrow:this._arrow});
	},
	
	//PRIVATE-PRIVATE-PRIVATE-PRIVATE-PRIVATE-PRIVATE-PRIVATE-PRIVATE-PRIVATE-PRIVATE-PRIVATE-PRIVATE
	
	_next : function(options) {
		//requires arguments
		if (check.undefined(options)) {
			throw new TypeError("Requires argument object.");
		}
		
		if (check.not.object(options.UI)) {
			throw new TypeError("Required argument: UI, should be object (proxy to control the UI)");
		}
		var UI = options.UI;
		
		var array_UI = require('lib/UI/array_UI');
		if (!array_UI.is_array(options.array)){
			throw new TypeError("Required argument: array, should be type array_UI.");
		}
		var array = options.array;
		
		var arrow_UI = require('lib/UI/arrow_UI');
		if (!arrow_UI.is_arrow(options.arrow)) {
			throw new TypeError("Required argument: arrow, should be type arrow_UI");
		}
		var arrow = options.arrow;
		
		//pre-lesson logic
		//	checks user input, gathers state of the UI, etc
		if (this._state === this._READY) {
			//get user input to use during the lesson
			this._input_tmp = UI.input.get();
			
			//if user input is NaN, then unusable, print error and return
			//NOTE: Number.isNaN() returns true on undefined
			if (Number.isNaN(this._input_tmp)) {
				UI.output.set(
					"The input is not a number.\n" +
					"Please enter a number and press\n" +
					"the 'Next' button to begin the\n" +
					"lesson.\n");
				this._input_tmp = undefined;
				return;
			}
			
			//after we've got the input, then disable the text input, until we're ready for another lesson
			UI.input.self._.htmlElement.disabled = true;
			
			//change state to enter lesson
			this._state = this._RUN;
			this._step_state = this._STEP_1;
		}
		
		//do nothing if not in the RUN state
		if (this._state !== this._RUN) return false;
			
		//state what we're doing
		if (this._step_state === this._STEP_1) {
			//save the original position, to restore after this step
			var original_y = UI.output.self.y;
			
			var output = "We'll allocate a find arrow, then" + "\n" +
						"look through each item in the array" + "\n" +
						"for the value: " + String(this._input_tmp) + ", if we found it" + "\n" + 
						"then we'll report which index it was" + "\n" +
						"found in, if we didn't then we'll" + "\n" +
						"report an error.";
			
			//adjust the text output to make room for the overview
			UI.output.self.y -= 20;
			
			UI.output.set(output);
			
			this._step_state = this._STEP_2;
			
			//restore the text output to its original position
			UI.output.self.y = original_y;
			
			return {value:output, done:false};
		}
		
		//allocate a find arrow
		if (this._step_state === this._STEP_2) {
			var output = "Allocating a 'find' arrow" + "\n" +
			"and pointing at the start of the"  + "\n" +
			"array.";
			
			this._find_arrow = array._.iterator("find");
			array.addChild(this._find_arrow);
			
			UI.output.set(output);
			
			this._step_state = this._STEP_SEARCHING_1;
			
			return {value:output, done:false};
		}
		
		//check the current item for a match to what we're searching for
		//OR
		//we're at the end of the array so we didn't find it
		if (this._step_state === this._STEP_SEARCHING_1) {
			//end of the array / not found case
			if (this._find_arrow._.index === this._arrow._.index) {
				var output = "The 'find' arrow is pointing to the" + "\n" +
				"same place as the 'tail' arrow" + "\n" +
				"which means we're at the end of" + "\n" +
				"the array and did not find the" + "\n" +
				"value: " + String(this._input_tmp);
				
				UI.output.set(output);
				
				this._step_state = this._STEP_END_NOT_FOUND;
				
				return {value:output, done:false};
			}
			
			var current_index = this._find_arrow._.index;
			var output = "Is the value at the index of the 'find'" + "\n" +
			"arrow " + "(" + String(array._.values[current_index]) + ")" + " equal to what we're" + "\n" +
			"searching for " + "(" + String(this._input_tmp) + ")?";
			
			if (array._.values[current_index] === this._input_tmp) {
				//found case
				this._step_state = this._STEP_END_FOUND;
			} else {
				this._step_state = this._STEP_SEARCHING_2;
			}
			
			UI.output.set(output);
			
			return {value:output, done:false};
		}
		
		//not found, so check the next index
		if (this._step_state === this._STEP_SEARCHING_2) {
			var current_index = this._find_arrow._.index;
			var output = String(array._.values[current_index]) + " != " + String(this._input_tmp) + ", so increment the 'find' arrow"  + "\n" +
			"to the next index and check if we've" + "\n" +
			"found the value there.";
			
			this._find_arrow._.next();
			
			this._step_state = this._STEP_SEARCHING_1;
			
			UI.output.set(output);
			
			return {value:output, done:false};
		}
		
		//found at the current index case
		if (this._step_state === this._STEP_END_FOUND) {
			var current_index = this._find_arrow._.index;
			var output = "We found it! We'd then report that" + "\n" +
			"we found the value (" + String(this._input_tmp) + ")" + "\n" +
			"at index: " + String(current_index) + ".";
			
			this._step_state = this._STEP_CLEANUP;
			
			UI.output.set(output);
			
			return {value:output, done:false};
		}
		
		//not found in the array case
		if (this._step_state === this._STEP_END_NOT_FOUND) {
			var output = "Which means we could not find it" + "\n" +
			"in the array." + "\n" +
			"We'd then report an error.";
			
			this._step_state = this._STEP_CLEANUP;
			
			UI.output.set(output);
			
			return {value:output, done:false};
		}
		
		//cleanup step
		if (this._step_state === this._STEP_CLEANUP) {
			var output = "Deallocating the 'find' arrow," + "\n" +
			"to clean up before the next search.";
			
			array.removeChild(this._find_arrow);
			
			this._step_state = undefined;
			this._state = this._READY;
			
			UI.output.set(output);
			
			//re-enabling the text input to get input for the next lesson
			UI.input.self._.htmlElement.disabled = false;
			
			return {done:true};
		}
	},
	
	//sets up an array UI component, for registration with the UI during INIT
	_setup_array : function(size) {
		var array_UI = require('lib/UI/array_UI');
		var result = array_UI({length:size});
		
		//TODO: allow config of positioning
		//positioning array
		result.x = 100;
		result.y = 150;
		
		return result;
	},
	
	//populates an UI array with random numbers
	_populate_array : function(array, arrow) {
		var text_factory = require('lib/factory/text_factory');
		var tf = text_factory();
		
		for (var i = 0; i < array._.length; i++) {
			//makes a createjs Text object whose value is a random integer
			var value = tf.get();
			
			array._.push({value:value, tween:false});
			arrow._.next({tween:false});
		}
		
		return array;
	},
	
	//private variables
	_UI :			undefined,	//local pointer to the UI object
	_array : 		undefined,	//reference to the UI array setup in the constructor and registered with the UI
	_arrow : 		undefined,	//reference to the UI arrow setup with the array and registered with the UI
	_input_tmp :	undefined,	//used to hold user input during the lesson
	_find_arrow : 	undefined,	//reference to the find arrow, used during the lesson
	
	//state and constants associated
	_DONE : 3,			//if we can no longer run the lesson, then set this state which makes the lesson unresponsive
	_RUN : 2,			//currently traversing the lesson
	_READY : 1,			//ready to start the lesson, done with all of the setup, not currently in the lesson
	_INIT : 0,			//initial state, setting up object for lesson, should not be able to interact at this step
	_state : undefined,	//tracks the state of the lesson
	
	//states for when stepping through a lesson
	_STEP_CLEANUP		: 6,
	_STEP_END_NOT_FOUND	: 5,
	_STEP_END_FOUND		: 4,
	_STEP_SEARCHING_2	: 3,
	_STEP_SEARCHING_1	: 2,
	_STEP_2 			: 1,
	_STEP_1 			: 0,
	_step_state : undefined,
};

module.exports = lesson;
},{"check-types":2,"lib/UI/array_UI":14,"lib/UI/arrow_UI":15,"lib/factory/text_factory":20,"lib/util/move":25}],22:[function(require,module,exports){
var primitives = require("lib/util/primitives");
var check = require('check-types');
var type_of = require('lib/util/type_of');

//used to add functionality to createjs objects, such that they can add themselves to the stage
//	if an object is already on the stage, then the function does nothing
function add_to_stage(obj) {
	//is argument a createjs object?
	if(!(check.instanceStrict(obj, createjs.DisplayObject))) {
		throw new TypeError('Cannot add object of type: ' + type_of(obj) + " to stage, requires createjs DisplayObject");
	}
	
	//is the stage already registered?
	var stage = primitives.get('stage');
	if (check.undefined(stage) || check.not.object(stage)) {
		throw new ReferenceError("'stage' undefined or not object in primitives object.");
	}
	
	var ret;
	
	//create a function used to decorate the createjs object, so it can be called to have the object add itself to the stage
	ret = function() {
		//is the object already on the stage?
		if(!(stage.contains(obj))) {
			//if not then add it
			stage.addChild(obj);
			stage.update();
		}
		//if it's already on the stage, do nothing
	};
	
	return ret;
};

module.exports = add_to_stage;
},{"check-types":2,"lib/util/primitives":27,"lib/util/type_of":31}],23:[function(require,module,exports){
//duck typing
//takes an object with properties of:
//	obj._.htmlElement (of type Element)
//	obj.htmlElement (of type Element)
//	obj.children (where append_to() calls append_to() on the children, if they have such a function)
//returns a function that either:
//	appends an html object to a parent html object in the dom (via appendChild())
//	calls append_to() on its children, if it has any
//the function accepts an html element
//	the html is then appended to an html element on the DOM
//		(or passed to child append_to() on a recursive call)
//	or an error is thrown if the object passed is not a valid html element
//source:https://github.com/substack/browserify-handbook#reusable-components

var check = require('check-types');

function append_to(obj) {
	if(!check.object(obj)) {
		throw new TypeError("Incorrect argument type, requires Object.");
	}
	
	//used to point to the correct HTML element, given the different forms the object can take (as below)
	var child_node;
	
	//the function used to apply an html Element (or container of one) directly to an Element in the DOM
	function direct_append_to(target) {
		if( !(check.instanceStrict(target, Element)) ) {
			throw new TypeError("Incorrect argument type, requires HTML Element.");
		}
		
		target.appendChild(child_node);
	}
	
	//form: obj.htmlElement
	if (!check.undefined(obj.htmlElement)) {
		if(check.instanceStrict(obj.htmlElement, Element)) {
			child_node = obj.htmlElement;
			return direct_append_to;	//return the function used to append the Element to the DOM
		} else {
			throw new TypeError("Incorrect property type, obj.htmlElement should be of type: HTML Element.");
		}
	}
	
	//form: obj._.htmlElement
	if (check.object(obj._)) {
		if (!check.undefined(obj._.htmlElement)) {
			if (check.instanceStrict(obj._.htmlElement, Element)) {
				child_node = obj._.htmlElement;
				return direct_append_to;	//return the function used to append the Element to the DOM
			} else {
				throw new TypeError("Incorrect property type, obj._.htmlElement should be of type: HTML Element.");
			}
		}
	}
	
	//function to use on containers, calls child append_to() functions on children
	//	will error at run time if not all children have an append_to function
	function indirect_append_to(target) {
		if( !(check.instanceStrict(target, Element)) ) {
			throw new TypeError("Incorrect argument type, requires HTML Element.");
		}
		
		//iterate through the children, append_to() on each, so we attach all HTML / DOMElement children to target
		//	(assuming that append_to() has been applied to the ._. namepsace)
		for (var i = 0; i < obj.children.length; i++) {
			if ( check.function(obj.children[i]._.append_to) ) {
				obj.children[i]._.append_to(target);
			} /* else {
				var type_of = require('lib/util/type_of');
				throw new TypeError('append_to on child ' + String(i) + ' was of type: ' + type_of(obj.children[i]._.append_to) + ', expected function.');
			} */
		}
	}
	
	//form: obj.children
	if (!check.undefined(obj.children)) {
		if(check.array(obj.children)) {
			return indirect_append_to;
		} else {
			throw new TypeError("Property 'children' should be of type array.");
		}
	}
	
	throw new TypeError("Object was of incorrect form, see documentation for acceptable forms.");
};

module.exports = append_to;
},{"check-types":2}],24:[function(require,module,exports){
//check if an argument object has valid parameters, throws with informative error if does not
//usage: 
//in function, wrap in a try...catch block, if it throws then there's an error with the type of arguments passed
//if not then all arguments pass their tests, get back an object with validated argument or empty object on no options passed

//https://www.npmjs.com/package/check-types
var check = require('check-types');	//used for checking types of arguments
var default_argument_types = {
	width : {
		is_correct_type: function(n) {
				if (!check.number(n)) return false;
				if (n <= 0) return false;
				return true;
			},
		should_be: "number ( greater than zero )",
		},
	height : {
		is_correct_type: function(n) {
				if (!check.number(n)) return false;
				if (n <= 0) return false;
				return true;
			},
		should_be: "number ( greater than zero )",
		},
	radius : {
		is_correct_type: function(n) {
				if (!check.number(n)) return false;
				if (n <= 0) return false;
				return true;
			},
		should_be: "number ( greater than zero )",
		},
	x : {
		is_correct_type: check.number,
		should_be: "number",
		},
	y : {
		is_correct_type: check.number,
		should_be: "number",
		},
	fill : {
		is_correct_type: function(str) {
				if (check.null(str)) return true;
				if (!check.nonEmptyString(str)) return false;
				var colorString = require("color-string");
				if(!colorString.get(str)) return false;
				return true;
			},
		should_be: "non-empty String (of a valid CSS color) or null",
		},
	stroke : {
		is_correct_type: function(str) {
				if (check.null(str)) return true;
				if (!check.nonEmptyString(str)) return false;
				var colorString = require("color-string");
				if(!colorString.get(str)) return false;
				return true;
			},
		should_be: "non-empty String (of a valid CSS color) or null",
		},
	font : {
		is_correct_type: function(str) {
			if (!check.nonEmptyString(str)) return false;
			
			var parseCssFont = require('parse-css-font');
			try {
				parseCssFont(str);
			} catch(e) {
				return false;
			}
			
			return true;
		},
		should_be: "non-empty String (of a valid CSS font)",
		},
	//text, we can String() anything, so just let the caller turn it into a String as required
	color : {
		is_correct_type: function(str) {
				if (check.null(str)) return true;
				if (!check.nonEmptyString(str)) return false;
				var colorString = require("color-string");
				if(!colorString.get(str)) return false;
				return true;
			},
		should_be: "non-empty String (of a valid CSS color) or null",
		},
	textAlign : {
		is_correct_type: function(str) {
				if (!check.nonEmptyString(str)) return false;
				
				//Array.includes() is not available?
				if (Array.from(["start", "end", "left", "right", "center"]).indexOf(str) === -1) return false;
				
				return true;
			},
		should_be: 'non-empty String (of one of these: ' + String("start, end, left, right, center") + ')',
		},
	//used in factories
	type: {
		is_correct_type: check.nonEmptyString,
		should_be: 'non-empty String',
		},
};

//improved version of `typeof`, used for getting actual type for printing error messages
var type_of = require('lib/util/type_of');

module.exports = function(arguments) {
	//if empty or undefined, just return empty
	if(check.emptyObject(arguments) || check.undefined(arguments)) {
		return {};
	}
	
	//otherwise argument should be an object
	if(!check.object(arguments)) {
		throw new TypeError("Arguments to argument_check was " + type_of(arguments) + ", should be: object");
	}
	
	var ret = {};
	
	//check through each property of the argument object passed in
	for (argument in arguments) {
		//if we have a default rule for what a named argument's type should be ...
		if (argument in default_argument_types) {
			var argument_name = "'" + String(argument) + "'";
			var argument_value = arguments[argument];
			var argument_type = type_of(argument_value);	//get a string of the detected type
			var argument_type_should_be_type = default_argument_types[argument].should_be;
			var error_msg = "Variable: " + argument_name + " was " + argument_type + ", should be: " + argument_type_should_be_type;
			
			//...and if it doesn't pass the type check...
			if (!default_argument_types[argument].is_correct_type(argument_value)) {
				//...then throw with information on: 
				//	what type was detected
				//	and what type it needs to be
				throw new TypeError(error_msg);
			}
		} else {
			//...we don't have a rule for it, but no argument should have a value of "undefined"
			if (check.undefined(arguments[argument])) {
				var error_msg = "Variable: " + argument + " was undefined.";
				throw new TypeError(error_msg);
			}
		}
		
		//...if there is no default rule and no error, then just the argument and its value to the return object, validated
		ret[argument] = arguments[argument];
	}
	return ret;
};
},{"check-types":2,"color-string":4,"lib/util/type_of":31,"parse-css-font":33}],25:[function(require,module,exports){
//tween an object from one location to another
//	if another move is already taking place, then do nothing (mutex)

//move() is decorated on to an object with the idiom:
//	source_object._.move.to(destination)
//(see below for method definitions)

var check = require('check-types');
var primitives = require("lib/util/primitives");

//internal mutex, tracks if an animation is currently occuring
var _is_moving = false;

//source should be an object to be tweened, with position values (x, y)
//destination arguments (methods, below) should be an object with properties (coordinates) ({x:value, y:value})
//	optional: duration, a numeric value for how long the tween should take (set in the constructor, but can be overriden on methods, below)
function move(source, options) {
	if (!(this instanceof move)) return new move(source, options);
	
	//is createjs already registered?
	this._createjs = primitives.get('createjs');
	if (check.undefined(this._createjs) || check.not.object(this._createjs)) {
		throw new ReferenceError("'createjs' undefined or not object in primitives object.");
	}
	
	this._argument_check(source);
	this._source = source;
	
	//1 second default tween duration
	this._duration = 1000;
	if (check.object(options) && check.number(options.duration) && options.duration >= 0) {
		//else use an optional duration for the tween
		this._duration = options.duration;
	}
}

move.prototype = {
	//METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS-METHODS
	
	//TODO: add functionality to only tween a single property at a time
	//	(only requires x or y, but not both and only the set one is used)
	
	//private
	//check if arg is an object and has properties (x, y), if not then throws with informative error
	//(all methods should have this type of argument)
	_argument_check : function(arg) {
		if (check.not.object(arg)) {
			throw new TypeError('Requires argument, object');
		}
		
		if (check.undefined(arg.x) || check.not.number(arg.x)) {
			throw new TypeError("Argument requires numeric property x.");
		}
		
		if (check.undefined(arg.y) || check.not.number(arg.y)) {
			throw new TypeError("Argument requires numeric property y.");
		}
		
		return true;
	},
	
	//public
	//tween an object (source, as passed to constructor, above) to a destination (an object with (x, y) properties)
	//	taking an optional duration argument
	to : function(destination, options) {
		this._argument_check(destination);
		
		var duration = this._duration;
		if (check.object(options) && check.number(options.duration) && options.duration > 0) {
			//else use an optional duration for the tween
			duration = options.duration;
		}
		
		if (_is_moving) {
			//if we're currently tweening, then do nothing
			return false;
		} else {
			_is_moving = true;
			createjs.Tween.get(this._source).to({x:destination.x, y:destination.y}, duration).call(function() {
				//once tween is finished, then unlock the mutex to allow other tweens to execute
				_is_moving = false;
			});
			return true;
		}
	},
	
	//PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES-PROPERTIES
	_createjs : undefined,	//reference to the createjs object used to Tween
	_source : undefined,	//the object to be move()d
	_duration : undefined,	//the amount of time a tween should take (can be overriden in each method)
};

//static method, returns if a tween is currently occuring
move.is_moving = function() {
	return _is_moving;
}

module.exports = move;
},{"check-types":2,"lib/util/primitives":27}],26:[function(require,module,exports){
module.exports = place;

//allows setting of convenience methods on object
//such that we can position a Shape(like) object:
//shape.place.(a position near)(other_shape)

var check = require('check-types');

function place(context, options) {
	if (!(this instanceof place)) return new place(context, options);
	
	this._argument_check(context);
	
	this._context = context;
}

place.prototype = {
	//NOTE: in all setter methods, we use the idiom:
	//	shape.x = target.x - shape.bounds.(x, y)
	//	this is to take into account the special requirements of positioning circles correctly
	//	circles are placed with their center at their (x, y) coordinate, while rectangles are placed with their top left hand corner at their (x, y)
	//	thus when we set bounds we include the amount of offset in x and y between the center of the circle and the top left hand corner of the circle
	//	thus if we subtract the values from their bounds, we get positive amounts of offset
	//	that is required to place the circles directly under other figures, without overlap
	
	//shape.place.under(other_shape);
	//adjust position of shape, such that it is directly below other_shape
	below : function(target) {
		this._argument_check(target);
		
		this._context.x = target.x - this._context.getBounds().x;
		this._context.y = target.y + target.getBounds().height - this._context.getBounds().y;
	},
	
	//shape.place.above(other_shape);
	//adjust position of shape, such that it is directly above other_shape
	above : function(target) {
		this._argument_check(target);
		
		this._context.x = target.x - this._context.getBounds().x;
		this._context.y = target.y + this._context.getBounds().y;
	},
	
	//TODO: for left and right positioning, align circular shapes with the centers of their targets
	//	maybe some sort of transform such that the x and y position of circles is counted as their top left corners?
	
	//shape.place.to_the_left_of(other_shape);
	//adjust position of shape, such that it is directly to the left of other_shape
	to_the_left_of : function(target) {
		this._argument_check(target);
		
		this._context.x = target.x + this._context.getBounds().x;
		this._context.y = target.y
	},
	
	//shape.place.to_the_right_of(other_shape);
	//adjust position of shape, such that it is directly to the right of other_shape
	to_the_right_of : function(target) {
		this._argument_check(target);
		
		this._context.x = target.x + target.getBounds().width - this._context.getBounds().x;
		this._context.y = target.y;
	},
	
	_argument_check : function(obj) {
		if (check.undefined(obj.x) || check.undefined(obj.y)) {
			throw new TypeError("argument should be like a createjs.Shape (needs x and y properties).");
		}
		
		if(check.null(obj.getBounds())) {
			throw new ReferenceError("argument should have bounds set, such that getBounds() returns object.");
		}
	},
	
	//private
	//holds the reference to the Shape to manipulate with functions ^
	_context : undefined,
}
},{"check-types":2}],27:[function(require,module,exports){
//provides a unified require()able interface for those objects are assumed globals in the Animate code
//	implimented by a singleton javascript Map

//by convention keys are the same name as the global variables form which they are sourced
//	e.g. the global "createjs" has a key "createjs" referencing the createjs object

var _primitives;

if (!_primitives) {
	_primitives = new Map();
}

module.exports = _primitives;
},{}],28:[function(require,module,exports){
//get a random CSS color (a string: # followed 3 hex digits)
//or optionally, given a hex color string find a random color whose WCAG color contrast score is at least AA
module.exports = function(color) {
	var check = require('check-types');
	if (!check.maybe.string(color)) {
		throw new TypeError('Argument should be string or undefined');
	}
	
	var random_hex = require('lib/util/random_hex');
	var colorString = require("color-string");	//check for valid color strings, colorString.get() returns null on invalid string
	if (check.undefined(color) || check.null(color)) {
		//just get a random hex color
		//as everything contrasts with no color or we just wanted a random color
		return "#" + random_hex(3);
	} else {
		if (!colorString.get(color)) {
			throw new TypeError('Argument should be valid CSS color (#000 - #fff)');
		}
		
		//get a random color that has good contrast with the argument color
		var contrast = require('wcag-contrast');
		while (true) {
			var random_color = random_hex(3);
			var contrast_score = contrast.score(contrast.hex(random_color, color));
			if (contrast_score === 'AA' || contrast_score === 'AAA') {
				return '#' + random_color;
			}
		}
	}
};
},{"check-types":2,"color-string":4,"lib/util/random_hex":29,"wcag-contrast":90}],29:[function(require,module,exports){
//generate random hex number, of optional amount count (default 1)

var random;

module.exports = function(count) {
	var check = require('check-types');
	if (!check.maybe.number(count)) {
		throw new TypeError('Argument should be number or undefined');
	}
	
	if (count <= 0) {
		throw new RangeError('Argument should be greater than or equal to 1');
	}
	
	if (!random) random = require("random-js")();
	
	return random.hex(count || 1);
};
},{"check-types":2,"random-js":37}],30:[function(require,module,exports){
//generate a random integer in the given bounds (default from 0 to 1000 inclusive, as per LaFore)
var random;

module.exports = function(start, end) {
	if (!(arguments.length === 2 || arguments.length === 0)) {
		throw new Error('Incorrect number of arguments: either two (lower and upper bound) or zero (using defaults: [0, 1000]).');
	}
	
	var check = require('check-types');
	if (!check.maybe.number(start)) {
		throw new TypeError('Argument should be number or undefined');
	}
	if (!check.maybe.number(end)) {
		throw new TypeError('Argument should be number or undefined');
	}
	
	if (start >= end) {
		throw new Error('Value Error: lower bound should be less than upper bound.');
	}
	
	if (!random) random = require("random-js")();
	
	return random.integer(start || 0, end || 1000);
};
},{"check-types":2,"random-js":37}],31:[function(require,module,exports){
//replacing broken javascript typeof
//return a String representation of the type of value

var check = require('check-types');

module.exports = function type_of(value) {
	if (Number.isNaN(value)) {return "NaN";}
	if (check.emptyString(value)) {return "empty String";}
	//https://www.npmjs.com/package/type-of-is
	return (require('type-of-is')).string(value);
}
},{"check-types":2,"type-of-is":88}],32:[function(require,module,exports){
var check = require('check-types');
var primitives = require("lib/util/primitives");

function unique_id(prefix) {
	var p = '';
	
	if (!check.undefined(prefix)) {
		p = String(prefix);
	}
	
	//is createjs already registered?
	var createjs = primitives.get('createjs');
	if (check.undefined(createjs) || check.not.object(createjs)) {
		throw new ReferenceError("'createjs' undefined or not object in primitives object.");
	}
	
	//UID is createjs's method of generating unique id's
	//http://www.createjs.com/docs/easeljs/classes/UID.html
	return p + '_' + createjs.UID.get();
}

module.exports = unique_id;
},{"check-types":2,"lib/util/primitives":27}],33:[function(require,module,exports){
var t = require('tcomb');
var unquote = require('unquote');
var globalKeywords = require('css-global-keywords');
var systemFontKeywords = require('css-system-font-keywords');
var fontWeightKeywords = require('css-font-weight-keywords');
var fontStyleKeywords = require('css-font-style-keywords');
var fontStretchKeywords = require('css-font-stretch-keywords');
var cssListHelpers = require('css-list-helpers');

var helpers = require('./lib/helpers');

var SystemFont = t.struct({
	system: t.String
});

var Font = t.struct({
	style: t.String,
	variant: t.String,
	weight: t.String,
	stretch: t.String,
	size: t.String,
	lineHeight: t.union([t.String, t.Number]),
	family: t.list(t.String)
});

var Result = t.union([Font, SystemFont]);

module.exports = t.func(t.String, t.Object).of(
	function(value) {

		if (value === '') {
			throw error('Cannot parse an empty string.');
		}

		if (systemFontKeywords.indexOf(value) !== -1) {
			return SystemFont({ system: value });
		}

		var font = {
			style: 'normal',
			variant: 'normal',
			weight: 'normal',
			stretch: 'normal',
			lineHeight: 'normal'
		};

		var isLocked = false;
		var tokens = cssListHelpers.splitBySpaces(value);
		var token = tokens.shift();
		for (; !t.Nil.is(token); token = tokens.shift()) {

			if (token === 'normal' || globalKeywords.indexOf(token) !== -1) {
				['style', 'variant', 'weight', 'stretch'].forEach(function(prop) {
					font[prop] = token;
				});
				isLocked = true;
				continue;
			}

			if (fontWeightKeywords.indexOf(token) !== -1) {
				if (isLocked) {
					continue;
				}
				font.weight = token;
				continue;
			}

			if (fontStyleKeywords.indexOf(token) !== -1) {
				if (isLocked) {
					continue;
				}
				font.style = token;
				continue;
			}

			if (fontStretchKeywords.indexOf(token) !== -1) {
				if (isLocked) {
					continue;
				}
				font.stretch = token;
				continue;
			}

			if (helpers.isSize(token)) {
				var parts = cssListHelpers.split(token, ['/']);
				font.size = parts[0];
				if (!t.Nil.is(parts[1])) {
					font.lineHeight = parseLineHeight(parts[1]);
				}
				if (!tokens.length) {
					throw error('Missing required font-family.');
				}
				font.family = cssListHelpers.splitByCommas(tokens.join(' ')).map(unquote);
				return Font(font);
			}

			if (font.variant !== 'normal') {
				throw error('Unknown or unsupported font token: ' + font.variant);
			}

			if (isLocked) {
				continue;
			}
			font.variant = token;
		}

		throw error('Missing required font-size.');
	}
);

function error(message) {
	return new Error('[parse-css-font] ' + message);
}

function parseLineHeight(value) {
	var parsed = parseFloat(value);
	if (parsed.toString() === value) {
		return parsed;
	}
	return value;
}

},{"./lib/helpers":34,"css-font-stretch-keywords":6,"css-font-style-keywords":7,"css-font-weight-keywords":8,"css-global-keywords":9,"css-list-helpers":10,"css-system-font-keywords":11,"tcomb":40,"unquote":89}],34:[function(require,module,exports){
var cssFontSizeKeywords = require('css-font-size-keywords');

module.exports = {

	isSize: function(value) {
		return /^[\d\.]/.test(value)
			|| value.indexOf('/') !== -1
			|| cssFontSizeKeywords.indexOf(value) !== -1
		;
	}

};

},{"css-font-size-keywords":5}],35:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
    try {
        cachedSetTimeout = setTimeout;
    } catch (e) {
        cachedSetTimeout = function () {
            throw new Error('setTimeout is not defined');
        }
    }
    try {
        cachedClearTimeout = clearTimeout;
    } catch (e) {
        cachedClearTimeout = function () {
            throw new Error('clearTimeout is not defined');
        }
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        return setTimeout(fun, 0);
    } else {
        return cachedSetTimeout.call(null, fun, 0);
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        clearTimeout(marker);
    } else {
        cachedClearTimeout.call(null, marker);
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],36:[function(require,module,exports){
/*
Copyright (c) 2010,2011,2012,2013,2014 Morgan Roderick http://roderick.dk
License: MIT - http://mrgnrdrck.mit-license.org

https://github.com/mroderick/PubSubJS
*/
(function (root, factory){
	'use strict';

    if (typeof define === 'function' && define.amd){
        // AMD. Register as an anonymous module.
        define(['exports'], factory);

    } else if (typeof exports === 'object'){
        // CommonJS
        factory(exports);

    }

    // Browser globals
    var PubSub = {};
    root.PubSub = PubSub;
    factory(PubSub);
    
}(( typeof window === 'object' && window ) || this, function (PubSub){
	'use strict';

	var messages = {},
		lastUid = -1;

	function hasKeys(obj){
		var key;

		for (key in obj){
			if ( obj.hasOwnProperty(key) ){
				return true;
			}
		}
		return false;
	}

	/**
	 *	Returns a function that throws the passed exception, for use as argument for setTimeout
	 *	@param { Object } ex An Error object
	 */
	function throwException( ex ){
		return function reThrowException(){
			throw ex;
		};
	}

	function callSubscriberWithDelayedExceptions( subscriber, message, data ){
		try {
			subscriber( message, data );
		} catch( ex ){
			setTimeout( throwException( ex ), 0);
		}
	}

	function callSubscriberWithImmediateExceptions( subscriber, message, data ){
		subscriber( message, data );
	}

	function deliverMessage( originalMessage, matchedMessage, data, immediateExceptions ){
		var subscribers = messages[matchedMessage],
			callSubscriber = immediateExceptions ? callSubscriberWithImmediateExceptions : callSubscriberWithDelayedExceptions,
			s;

		if ( !messages.hasOwnProperty( matchedMessage ) ) {
			return;
		}

		for (s in subscribers){
			if ( subscribers.hasOwnProperty(s)){
				callSubscriber( subscribers[s], originalMessage, data );
			}
		}
	}

	function createDeliveryFunction( message, data, immediateExceptions ){
		return function deliverNamespaced(){
			var topic = String( message ),
				position = topic.lastIndexOf( '.' );

			// deliver the message as it is now
			deliverMessage(message, message, data, immediateExceptions);

			// trim the hierarchy and deliver message to each level
			while( position !== -1 ){
				topic = topic.substr( 0, position );
				position = topic.lastIndexOf('.');
				deliverMessage( message, topic, data, immediateExceptions );
			}
		};
	}

	function messageHasSubscribers( message ){
		var topic = String( message ),
			found = Boolean(messages.hasOwnProperty( topic ) && hasKeys(messages[topic])),
			position = topic.lastIndexOf( '.' );

		while ( !found && position !== -1 ){
			topic = topic.substr( 0, position );
			position = topic.lastIndexOf( '.' );
			found = Boolean(messages.hasOwnProperty( topic ) && hasKeys(messages[topic]));
		}

		return found;
	}

	function publish( message, data, sync, immediateExceptions ){
		var deliver = createDeliveryFunction( message, data, immediateExceptions ),
			hasSubscribers = messageHasSubscribers( message );

		if ( !hasSubscribers ){
			return false;
		}

		if ( sync === true ){
			deliver();
		} else {
			setTimeout( deliver, 0 );
		}
		return true;
	}

	/**
	 *	PubSub.publish( message[, data] ) -> Boolean
	 *	- message (String): The message to publish
	 *	- data: The data to pass to subscribers
	 *	Publishes the the message, passing the data to it's subscribers
	**/
	PubSub.publish = function( message, data ){
		return publish( message, data, false, PubSub.immediateExceptions );
	};

	/**
	 *	PubSub.publishSync( message[, data] ) -> Boolean
	 *	- message (String): The message to publish
	 *	- data: The data to pass to subscribers
	 *	Publishes the the message synchronously, passing the data to it's subscribers
	**/
	PubSub.publishSync = function( message, data ){
		return publish( message, data, true, PubSub.immediateExceptions );
	};

	/**
	 *	PubSub.subscribe( message, func ) -> String
	 *	- message (String): The message to subscribe to
	 *	- func (Function): The function to call when a new message is published
	 *	Subscribes the passed function to the passed message. Every returned token is unique and should be stored if
	 *	you need to unsubscribe
	**/
	PubSub.subscribe = function( message, func ){
		if ( typeof func !== 'function'){
			return false;
		}

		// message is not registered yet
		if ( !messages.hasOwnProperty( message ) ){
			messages[message] = {};
		}

		// forcing token as String, to allow for future expansions without breaking usage
		// and allow for easy use as key names for the 'messages' object
		var token = 'uid_' + String(++lastUid);
		messages[message][token] = func;

		// return token for unsubscribing
		return token;
	};

	/* Public: Clears all subscriptions
	 */
	PubSub.clearAllSubscriptions = function clearAllSubscriptions(){
		messages = {};
	};

	/*Public: Clear subscriptions by the topic
	*/
	PubSub.clearSubscriptions = function clearSubscriptions(topic){
		var m; 
		for (m in messages){
			if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0){
				delete messages[m];
			}
		}
	};

	/* Public: removes subscriptions.
	 * When passed a token, removes a specific subscription.
	 * When passed a function, removes all subscriptions for that function
	 * When passed a topic, removes all subscriptions for that topic (hierarchy)
	 *
	 * value - A token, function or topic to unsubscribe.
	 *
	 * Examples
	 *
	 *		// Example 1 - unsubscribing with a token
	 *		var token = PubSub.subscribe('mytopic', myFunc);
	 *		PubSub.unsubscribe(token);
	 *
	 *		// Example 2 - unsubscribing with a function
	 *		PubSub.unsubscribe(myFunc);
	 *
	 *		// Example 3 - unsubscribing a topic
	 *		PubSub.unsubscribe('mytopic');
	 */
	PubSub.unsubscribe = function(value){
		var isTopic    = typeof value === 'string' && messages.hasOwnProperty(value),
			isToken    = !isTopic && typeof value === 'string',
			isFunction = typeof value === 'function',
			result = false,
			m, message, t;

		if (isTopic){
			delete messages[value];
			return;
		}

		for ( m in messages ){
			if ( messages.hasOwnProperty( m ) ){
				message = messages[m];

				if ( isToken && message[value] ){
					delete message[value];
					result = value;
					// tokens are unique, so we can just stop here
					break;
				}

				if (isFunction) {
					for ( t in message ){
						if (message.hasOwnProperty(t) && message[t] === value){
							delete message[t];
							result = true;
						}
					}
				}
			}
		}

		return result;
	};
}));

},{}],37:[function(require,module,exports){
/*jshint eqnull:true*/
(function (root) {
  "use strict";

  var GLOBAL_KEY = "Random";

  var imul = (typeof Math.imul !== "function" || Math.imul(0xffffffff, 5) !== -5 ?
    function (a, b) {
      var ah = (a >>> 16) & 0xffff;
      var al = a & 0xffff;
      var bh = (b >>> 16) & 0xffff;
      var bl = b & 0xffff;
      // the shift by 0 fixes the sign on the high part
      // the final |0 converts the unsigned value into a signed value
      return (al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0;
    } :
    Math.imul);

  var stringRepeat = (typeof String.prototype.repeat === "function" && "x".repeat(3) === "xxx" ?
    function (x, y) {
      return x.repeat(y);
    } : function (pattern, count) {
      var result = "";
      while (count > 0) {
        if (count & 1) {
          result += pattern;
        }
        count >>= 1;
        pattern += pattern;
      }
      return result;
    });

  function Random(engine) {
    if (!(this instanceof Random)) {
      return new Random(engine);
    }

    if (engine == null) {
      engine = Random.engines.nativeMath;
    } else if (typeof engine !== "function") {
      throw new TypeError("Expected engine to be a function, got " + typeof engine);
    }
    this.engine = engine;
  }
  var proto = Random.prototype;

  Random.engines = {
    nativeMath: function () {
      return (Math.random() * 0x100000000) | 0;
    },
    mt19937: (function (Int32Array) {
      // http://en.wikipedia.org/wiki/Mersenne_twister
      function refreshData(data) {
        var k = 0;
        var tmp = 0;
        for (;
          (k | 0) < 227; k = (k + 1) | 0) {
          tmp = (data[k] & 0x80000000) | (data[(k + 1) | 0] & 0x7fffffff);
          data[k] = data[(k + 397) | 0] ^ (tmp >>> 1) ^ ((tmp & 0x1) ? 0x9908b0df : 0);
        }

        for (;
          (k | 0) < 623; k = (k + 1) | 0) {
          tmp = (data[k] & 0x80000000) | (data[(k + 1) | 0] & 0x7fffffff);
          data[k] = data[(k - 227) | 0] ^ (tmp >>> 1) ^ ((tmp & 0x1) ? 0x9908b0df : 0);
        }

        tmp = (data[623] & 0x80000000) | (data[0] & 0x7fffffff);
        data[623] = data[396] ^ (tmp >>> 1) ^ ((tmp & 0x1) ? 0x9908b0df : 0);
      }

      function temper(value) {
        value ^= value >>> 11;
        value ^= (value << 7) & 0x9d2c5680;
        value ^= (value << 15) & 0xefc60000;
        return value ^ (value >>> 18);
      }

      function seedWithArray(data, source) {
        var i = 1;
        var j = 0;
        var sourceLength = source.length;
        var k = Math.max(sourceLength, 624) | 0;
        var previous = data[0] | 0;
        for (;
          (k | 0) > 0; --k) {
          data[i] = previous = ((data[i] ^ imul((previous ^ (previous >>> 30)), 0x0019660d)) + (source[j] | 0) + (j | 0)) | 0;
          i = (i + 1) | 0;
          ++j;
          if ((i | 0) > 623) {
            data[0] = data[623];
            i = 1;
          }
          if (j >= sourceLength) {
            j = 0;
          }
        }
        for (k = 623;
          (k | 0) > 0; --k) {
          data[i] = previous = ((data[i] ^ imul((previous ^ (previous >>> 30)), 0x5d588b65)) - i) | 0;
          i = (i + 1) | 0;
          if ((i | 0) > 623) {
            data[0] = data[623];
            i = 1;
          }
        }
        data[0] = 0x80000000;
      }

      function mt19937() {
        var data = new Int32Array(624);
        var index = 0;
        var uses = 0;

        function next() {
          if ((index | 0) >= 624) {
            refreshData(data);
            index = 0;
          }

          var value = data[index];
          index = (index + 1) | 0;
          uses += 1;
          return temper(value) | 0;
        }
        next.getUseCount = function() {
          return uses;
        };
        next.discard = function (count) {
          uses += count;
          if ((index | 0) >= 624) {
            refreshData(data);
            index = 0;
          }
          while ((count - index) > 624) {
            count -= 624 - index;
            refreshData(data);
            index = 0;
          }
          index = (index + count) | 0;
          return next;
        };
        next.seed = function (initial) {
          var previous = 0;
          data[0] = previous = initial | 0;

          for (var i = 1; i < 624; i = (i + 1) | 0) {
            data[i] = previous = (imul((previous ^ (previous >>> 30)), 0x6c078965) + i) | 0;
          }
          index = 624;
          uses = 0;
          return next;
        };
        next.seedWithArray = function (source) {
          next.seed(0x012bd6aa);
          seedWithArray(data, source);
          return next;
        };
        next.autoSeed = function () {
          return next.seedWithArray(Random.generateEntropyArray());
        };
        return next;
      }

      return mt19937;
    }(typeof Int32Array === "function" ? Int32Array : Array)),
    browserCrypto: (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function" && typeof Int32Array === "function") ? (function () {
      var data = null;
      var index = 128;

      return function () {
        if (index >= 128) {
          if (data === null) {
            data = new Int32Array(128);
          }
          crypto.getRandomValues(data);
          index = 0;
        }

        return data[index++] | 0;
      };
    }()) : null
  };

  Random.generateEntropyArray = function () {
    var array = [];
    var engine = Random.engines.nativeMath;
    for (var i = 0; i < 16; ++i) {
      array[i] = engine() | 0;
    }
    array.push(new Date().getTime() | 0);
    return array;
  };

  function returnValue(value) {
    return function () {
      return value;
    };
  }

  // [-0x80000000, 0x7fffffff]
  Random.int32 = function (engine) {
    return engine() | 0;
  };
  proto.int32 = function () {
    return Random.int32(this.engine);
  };

  // [0, 0xffffffff]
  Random.uint32 = function (engine) {
    return engine() >>> 0;
  };
  proto.uint32 = function () {
    return Random.uint32(this.engine);
  };

  // [0, 0x1fffffffffffff]
  Random.uint53 = function (engine) {
    var high = engine() & 0x1fffff;
    var low = engine() >>> 0;
    return (high * 0x100000000) + low;
  };
  proto.uint53 = function () {
    return Random.uint53(this.engine);
  };

  // [0, 0x20000000000000]
  Random.uint53Full = function (engine) {
    while (true) {
      var high = engine() | 0;
      if (high & 0x200000) {
        if ((high & 0x3fffff) === 0x200000 && (engine() | 0) === 0) {
          return 0x20000000000000;
        }
      } else {
        var low = engine() >>> 0;
        return ((high & 0x1fffff) * 0x100000000) + low;
      }
    }
  };
  proto.uint53Full = function () {
    return Random.uint53Full(this.engine);
  };

  // [-0x20000000000000, 0x1fffffffffffff]
  Random.int53 = function (engine) {
    var high = engine() | 0;
    var low = engine() >>> 0;
    return ((high & 0x1fffff) * 0x100000000) + low + (high & 0x200000 ? -0x20000000000000 : 0);
  };
  proto.int53 = function () {
    return Random.int53(this.engine);
  };

  // [-0x20000000000000, 0x20000000000000]
  Random.int53Full = function (engine) {
    while (true) {
      var high = engine() | 0;
      if (high & 0x400000) {
        if ((high & 0x7fffff) === 0x400000 && (engine() | 0) === 0) {
          return 0x20000000000000;
        }
      } else {
        var low = engine() >>> 0;
        return ((high & 0x1fffff) * 0x100000000) + low + (high & 0x200000 ? -0x20000000000000 : 0);
      }
    }
  };
  proto.int53Full = function () {
    return Random.int53Full(this.engine);
  };

  function add(generate, addend) {
    if (addend === 0) {
      return generate;
    } else {
      return function (engine) {
        return generate(engine) + addend;
      };
    }
  }

  Random.integer = (function () {
    function isPowerOfTwoMinusOne(value) {
      return ((value + 1) & value) === 0;
    }

    function bitmask(masking) {
      return function (engine) {
        return engine() & masking;
      };
    }

    function downscaleToLoopCheckedRange(range) {
      var extendedRange = range + 1;
      var maximum = extendedRange * Math.floor(0x100000000 / extendedRange);
      return function (engine) {
        var value = 0;
        do {
          value = engine() >>> 0;
        } while (value >= maximum);
        return value % extendedRange;
      };
    }

    function downscaleToRange(range) {
      if (isPowerOfTwoMinusOne(range)) {
        return bitmask(range);
      } else {
        return downscaleToLoopCheckedRange(range);
      }
    }

    function isEvenlyDivisibleByMaxInt32(value) {
      return (value | 0) === 0;
    }

    function upscaleWithHighMasking(masking) {
      return function (engine) {
        var high = engine() & masking;
        var low = engine() >>> 0;
        return (high * 0x100000000) + low;
      };
    }

    function upscaleToLoopCheckedRange(extendedRange) {
      var maximum = extendedRange * Math.floor(0x20000000000000 / extendedRange);
      return function (engine) {
        var ret = 0;
        do {
          var high = engine() & 0x1fffff;
          var low = engine() >>> 0;
          ret = (high * 0x100000000) + low;
        } while (ret >= maximum);
        return ret % extendedRange;
      };
    }

    function upscaleWithinU53(range) {
      var extendedRange = range + 1;
      if (isEvenlyDivisibleByMaxInt32(extendedRange)) {
        var highRange = ((extendedRange / 0x100000000) | 0) - 1;
        if (isPowerOfTwoMinusOne(highRange)) {
          return upscaleWithHighMasking(highRange);
        }
      }
      return upscaleToLoopCheckedRange(extendedRange);
    }

    function upscaleWithinI53AndLoopCheck(min, max) {
      return function (engine) {
        var ret = 0;
        do {
          var high = engine() | 0;
          var low = engine() >>> 0;
          ret = ((high & 0x1fffff) * 0x100000000) + low + (high & 0x200000 ? -0x20000000000000 : 0);
        } while (ret < min || ret > max);
        return ret;
      };
    }

    return function (min, max) {
      min = Math.floor(min);
      max = Math.floor(max);
      if (min < -0x20000000000000 || !isFinite(min)) {
        throw new RangeError("Expected min to be at least " + (-0x20000000000000));
      } else if (max > 0x20000000000000 || !isFinite(max)) {
        throw new RangeError("Expected max to be at most " + 0x20000000000000);
      }

      var range = max - min;
      if (range <= 0 || !isFinite(range)) {
        return returnValue(min);
      } else if (range === 0xffffffff) {
        if (min === 0) {
          return Random.uint32;
        } else {
          return add(Random.int32, min + 0x80000000);
        }
      } else if (range < 0xffffffff) {
        return add(downscaleToRange(range), min);
      } else if (range === 0x1fffffffffffff) {
        return add(Random.uint53, min);
      } else if (range < 0x1fffffffffffff) {
        return add(upscaleWithinU53(range), min);
      } else if (max - 1 - min === 0x1fffffffffffff) {
        return add(Random.uint53Full, min);
      } else if (min === -0x20000000000000 && max === 0x20000000000000) {
        return Random.int53Full;
      } else if (min === -0x20000000000000 && max === 0x1fffffffffffff) {
        return Random.int53;
      } else if (min === -0x1fffffffffffff && max === 0x20000000000000) {
        return add(Random.int53, 1);
      } else if (max === 0x20000000000000) {
        return add(upscaleWithinI53AndLoopCheck(min - 1, max - 1), 1);
      } else {
        return upscaleWithinI53AndLoopCheck(min, max);
      }
    };
  }());
  proto.integer = function (min, max) {
    return Random.integer(min, max)(this.engine);
  };

  // [0, 1] (floating point)
  Random.realZeroToOneInclusive = function (engine) {
    return Random.uint53Full(engine) / 0x20000000000000;
  };
  proto.realZeroToOneInclusive = function () {
    return Random.realZeroToOneInclusive(this.engine);
  };

  // [0, 1) (floating point)
  Random.realZeroToOneExclusive = function (engine) {
    return Random.uint53(engine) / 0x20000000000000;
  };
  proto.realZeroToOneExclusive = function () {
    return Random.realZeroToOneExclusive(this.engine);
  };

  Random.real = (function () {
    function multiply(generate, multiplier) {
      if (multiplier === 1) {
        return generate;
      } else if (multiplier === 0) {
        return function () {
          return 0;
        };
      } else {
        return function (engine) {
          return generate(engine) * multiplier;
        };
      }
    }

    return function (left, right, inclusive) {
      if (!isFinite(left)) {
        throw new RangeError("Expected left to be a finite number");
      } else if (!isFinite(right)) {
        throw new RangeError("Expected right to be a finite number");
      }
      return add(
        multiply(
          inclusive ? Random.realZeroToOneInclusive : Random.realZeroToOneExclusive,
          right - left),
        left);
    };
  }());
  proto.real = function (min, max, inclusive) {
    return Random.real(min, max, inclusive)(this.engine);
  };

  Random.bool = (function () {
    function isLeastBitTrue(engine) {
      return (engine() & 1) === 1;
    }

    function lessThan(generate, value) {
      return function (engine) {
        return generate(engine) < value;
      };
    }

    function probability(percentage) {
      if (percentage <= 0) {
        return returnValue(false);
      } else if (percentage >= 1) {
        return returnValue(true);
      } else {
        var scaled = percentage * 0x100000000;
        if (scaled % 1 === 0) {
          return lessThan(Random.int32, (scaled - 0x80000000) | 0);
        } else {
          return lessThan(Random.uint53, Math.round(percentage * 0x20000000000000));
        }
      }
    }

    return function (numerator, denominator) {
      if (denominator == null) {
        if (numerator == null) {
          return isLeastBitTrue;
        }
        return probability(numerator);
      } else {
        if (numerator <= 0) {
          return returnValue(false);
        } else if (numerator >= denominator) {
          return returnValue(true);
        }
        return lessThan(Random.integer(0, denominator - 1), numerator);
      }
    };
  }());
  proto.bool = function (numerator, denominator) {
    return Random.bool(numerator, denominator)(this.engine);
  };

  function toInteger(value) {
    var number = +value;
    if (number < 0) {
      return Math.ceil(number);
    } else {
      return Math.floor(number);
    }
  }

  function convertSliceArgument(value, length) {
    if (value < 0) {
      return Math.max(value + length, 0);
    } else {
      return Math.min(value, length);
    }
  }
  Random.pick = function (engine, array, begin, end) {
    var length = array.length;
    var start = begin == null ? 0 : convertSliceArgument(toInteger(begin), length);
    var finish = end === void 0 ? length : convertSliceArgument(toInteger(end), length);
    if (start >= finish) {
      return void 0;
    }
    var distribution = Random.integer(start, finish - 1);
    return array[distribution(engine)];
  };
  proto.pick = function (array, begin, end) {
    return Random.pick(this.engine, array, begin, end);
  };

  function returnUndefined() {
    return void 0;
  }
  var slice = Array.prototype.slice;
  Random.picker = function (array, begin, end) {
    var clone = slice.call(array, begin, end);
    if (!clone.length) {
      return returnUndefined;
    }
    var distribution = Random.integer(0, clone.length - 1);
    return function (engine) {
      return clone[distribution(engine)];
    };
  };

  Random.shuffle = function (engine, array, downTo) {
    var length = array.length;
    if (length) {
      if (downTo == null) {
        downTo = 0;
      }
      for (var i = (length - 1) >>> 0; i > downTo; --i) {
        var distribution = Random.integer(0, i);
        var j = distribution(engine);
        if (i !== j) {
          var tmp = array[i];
          array[i] = array[j];
          array[j] = tmp;
        }
      }
    }
    return array;
  };
  proto.shuffle = function (array) {
    return Random.shuffle(this.engine, array);
  };

  Random.sample = function (engine, population, sampleSize) {
    if (sampleSize < 0 || sampleSize > population.length || !isFinite(sampleSize)) {
      throw new RangeError("Expected sampleSize to be within 0 and the length of the population");
    }

    if (sampleSize === 0) {
      return [];
    }

    var clone = slice.call(population);
    var length = clone.length;
    if (length === sampleSize) {
      return Random.shuffle(engine, clone, 0);
    }
    var tailLength = length - sampleSize;
    return Random.shuffle(engine, clone, tailLength - 1).slice(tailLength);
  };
  proto.sample = function (population, sampleSize) {
    return Random.sample(this.engine, population, sampleSize);
  };

  Random.die = function (sideCount) {
    return Random.integer(1, sideCount);
  };
  proto.die = function (sideCount) {
    return Random.die(sideCount)(this.engine);
  };

  Random.dice = function (sideCount, dieCount) {
    var distribution = Random.die(sideCount);
    return function (engine) {
      var result = [];
      result.length = dieCount;
      for (var i = 0; i < dieCount; ++i) {
        result[i] = distribution(engine);
      }
      return result;
    };
  };
  proto.dice = function (sideCount, dieCount) {
    return Random.dice(sideCount, dieCount)(this.engine);
  };

  // http://en.wikipedia.org/wiki/Universally_unique_identifier
  Random.uuid4 = (function () {
    function zeroPad(string, zeroCount) {
      return stringRepeat("0", zeroCount - string.length) + string;
    }

    return function (engine) {
      var a = engine() >>> 0;
      var b = engine() | 0;
      var c = engine() | 0;
      var d = engine() >>> 0;

      return (
        zeroPad(a.toString(16), 8) +
        "-" +
        zeroPad((b & 0xffff).toString(16), 4) +
        "-" +
        zeroPad((((b >> 4) & 0x0fff) | 0x4000).toString(16), 4) +
        "-" +
        zeroPad(((c & 0x3fff) | 0x8000).toString(16), 4) +
        "-" +
        zeroPad(((c >> 4) & 0xffff).toString(16), 4) +
        zeroPad(d.toString(16), 8));
    };
  }());
  proto.uuid4 = function () {
    return Random.uuid4(this.engine);
  };

  Random.string = (function () {
    // has 2**x chars, for faster uniform distribution
    var DEFAULT_STRING_POOL = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";

    return function (pool) {
      if (pool == null) {
        pool = DEFAULT_STRING_POOL;
      }

      var length = pool.length;
      if (!length) {
        throw new Error("Expected pool not to be an empty string");
      }

      var distribution = Random.integer(0, length - 1);
      return function (engine, length) {
        var result = "";
        for (var i = 0; i < length; ++i) {
          var j = distribution(engine);
          result += pool.charAt(j);
        }
        return result;
      };
    };
  }());
  proto.string = function (length, pool) {
    return Random.string(pool)(this.engine, length);
  };

  Random.hex = (function () {
    var LOWER_HEX_POOL = "0123456789abcdef";
    var lowerHex = Random.string(LOWER_HEX_POOL);
    var upperHex = Random.string(LOWER_HEX_POOL.toUpperCase());

    return function (upper) {
      if (upper) {
        return upperHex;
      } else {
        return lowerHex;
      }
    };
  }());
  proto.hex = function (length, upper) {
    return Random.hex(upper)(this.engine, length);
  };

  Random.date = function (start, end) {
    if (!(start instanceof Date)) {
      throw new TypeError("Expected start to be a Date, got " + typeof start);
    } else if (!(end instanceof Date)) {
      throw new TypeError("Expected end to be a Date, got " + typeof end);
    }
    var distribution = Random.integer(start.getTime(), end.getTime());
    return function (engine) {
      return new Date(distribution(engine));
    };
  };
  proto.date = function (start, end) {
    return Random.date(start, end)(this.engine);
  };

  if (typeof define === "function" && define.amd) {
    define(function () {
      return Random;
    });
  } else if (typeof module !== "undefined" && typeof require === "function") {
    module.exports = Random;
  } else {
    (function () {
      var oldGlobal = root[GLOBAL_KEY];
      Random.noConflict = function () {
        root[GLOBAL_KEY] = oldGlobal;
        return this;
      };
    }());
    root[GLOBAL_KEY] = Random;
  }
}(this));
},{}],38:[function(require,module,exports){
// # Relative luminance
//
// http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
// https://en.wikipedia.org/wiki/Luminance_(relative)
// https://en.wikipedia.org/wiki/Luminosity_function
// https://en.wikipedia.org/wiki/Rec._709#Luma_coefficients

// red, green, and blue coefficients
var rc = 0.2126,
    gc = 0.7152,
    bc = 0.0722,
    // low-gamma adjust coefficient
    lowc = 1 / 12.92;

function adjustGamma(_) {
    return Math.pow((_ + 0.055) / 1.055, 2.4);
}

module.exports = function(rgb) {
    var rsrgb = rgb[0] / 255,
        gsrgb = rgb[1] / 255,
        bsrgb = rgb[2] / 255;

    var r = (rsrgb <= 0.03928) ? (rsrgb * lowc) : adjustGamma(rsrgb),
        g = (gsrgb <= 0.03928) ? (gsrgb * lowc) : adjustGamma(gsrgb),
        b = (bsrgb <= 0.03928) ? (bsrgb * lowc) : adjustGamma(bsrgb);

    return r * rc + g * gc + b * bc;
};

},{}],39:[function(require,module,exports){
'use strict';

var isArrayish = require('is-arrayish');

var concat = Array.prototype.concat;
var slice = Array.prototype.slice;

var swizzle = module.exports = function swizzle(args) {
	var results = [];

	for (var i = 0, len = args.length; i < len; i++) {
		var arg = args[i];

		if (isArrayish(arg)) {
			// http://jsperf.com/javascript-array-concat-vs-push/98
			results = concat.call(results, slice.call(arg));
		} else {
			results.push(arg);
		}
	}

	return results;
};

swizzle.wrap = function (fn) {
	return function () {
		return fn(swizzle(arguments));
	};
};

},{"is-arrayish":13}],40:[function(require,module,exports){
/*! @preserve
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2016 Giulio Canti
 *
 */

// core
var t = require('./lib/assert');

// types
t.Any = require('./lib/Any');
t.Array = require('./lib/Array');
t.Boolean = require('./lib/Boolean');
t.Date = require('./lib/Date');
t.Error = require('./lib/Error');
t.Function = require('./lib/Function');
t.Nil = require('./lib/Nil');
t.Number = require('./lib/Number');
t.Object = require('./lib/Object');
t.RegExp = require('./lib/RegExp');
t.String = require('./lib/String');

// short alias are deprecated
t.Arr = t.Array;
t.Bool = t.Boolean;
t.Dat = t.Date;
t.Err = t.Error;
t.Func = t.Function;
t.Num = t.Number;
t.Obj = t.Object;
t.Re = t.RegExp;
t.Str = t.String;

// combinators
t.dict = require('./lib/dict');
t.declare = require('./lib/declare');
t.enums = require('./lib/enums');
t.irreducible = require('./lib/irreducible');
t.list = require('./lib/list');
t.maybe = require('./lib/maybe');
t.refinement = require('./lib/refinement');
t.struct = require('./lib/struct');
t.tuple = require('./lib/tuple');
t.union = require('./lib/union');
t.func = require('./lib/func');
t.intersection = require('./lib/intersection');
t.subtype = t.refinement;

// functions
t.assert = t;
t.update = require('./lib/update');
t.mixin = require('./lib/mixin');
t.isType = require('./lib/isType');
t.is = require('./lib/is');
t.getTypeName = require('./lib/getTypeName');
t.match = require('./lib/match');

module.exports = t;

},{"./lib/Any":41,"./lib/Array":42,"./lib/Boolean":43,"./lib/Date":44,"./lib/Error":45,"./lib/Function":46,"./lib/Nil":47,"./lib/Number":48,"./lib/Object":49,"./lib/RegExp":50,"./lib/String":51,"./lib/assert":52,"./lib/declare":54,"./lib/dict":55,"./lib/enums":56,"./lib/func":59,"./lib/getTypeName":61,"./lib/intersection":62,"./lib/irreducible":63,"./lib/is":64,"./lib/isType":75,"./lib/list":78,"./lib/match":79,"./lib/maybe":80,"./lib/mixin":81,"./lib/refinement":82,"./lib/struct":84,"./lib/tuple":85,"./lib/union":86,"./lib/update":87}],41:[function(require,module,exports){
var irreducible = require('./irreducible');

module.exports = irreducible('Any', function () { return true; });

},{"./irreducible":63}],42:[function(require,module,exports){
var irreducible = require('./irreducible');
var isArray = require('./isArray');

module.exports = irreducible('Array', isArray);

},{"./irreducible":63,"./isArray":65}],43:[function(require,module,exports){
var irreducible = require('./irreducible');
var isBoolean = require('./isBoolean');

module.exports = irreducible('Boolean', isBoolean);

},{"./irreducible":63,"./isBoolean":66}],44:[function(require,module,exports){
var irreducible = require('./irreducible');

module.exports = irreducible('Date', function (x) { return x instanceof Date; });

},{"./irreducible":63}],45:[function(require,module,exports){
var irreducible = require('./irreducible');

module.exports = irreducible('Error', function (x) { return x instanceof Error; });

},{"./irreducible":63}],46:[function(require,module,exports){
var irreducible = require('./irreducible');
var isFunction = require('./isFunction');

module.exports = irreducible('Function', isFunction);

},{"./irreducible":63,"./isFunction":67}],47:[function(require,module,exports){
var irreducible = require('./irreducible');
var isNil = require('./isNil');

module.exports = irreducible('Nil', isNil);

},{"./irreducible":63,"./isNil":70}],48:[function(require,module,exports){
var irreducible = require('./irreducible');
var isNumber = require('./isNumber');

module.exports = irreducible('Number', isNumber);

},{"./irreducible":63,"./isNumber":71}],49:[function(require,module,exports){
var irreducible = require('./irreducible');
var isObject = require('./isObject');

module.exports = irreducible('Object', isObject);

},{"./irreducible":63,"./isObject":72}],50:[function(require,module,exports){
var irreducible = require('./irreducible');

module.exports = irreducible('RegExp', function (x) { return x instanceof RegExp; });

},{"./irreducible":63}],51:[function(require,module,exports){
var irreducible = require('./irreducible');
var isString = require('./isString');

module.exports = irreducible('String', isString);

},{"./irreducible":63,"./isString":73}],52:[function(require,module,exports){
var isFunction = require('./isFunction');
var isNil = require('./isNil');
var fail = require('./fail');
var stringify = require('./stringify');

function assert(guard, message) {
  if (guard !== true) {
    if (isFunction(message)) { // handle lazy messages
      message = message();
    }
    else if (isNil(message)) { // use a default message
      message = 'Assert failed (turn on "Pause on exceptions" in your Source panel)';
    }
    assert.fail(message);
  }
}

assert.fail = fail;
assert.stringify = stringify;

module.exports = assert;
},{"./fail":57,"./isFunction":67,"./isNil":70,"./stringify":83}],53:[function(require,module,exports){
(function (process){
var isType = require('./isType');
var isStruct = require('./isStruct');
var getFunctionName = require('./getFunctionName');
var assert = require('./assert');
var stringify = require('./stringify');

// creates an instance of a type, handling the optional new operator
module.exports = function create(type, value, path) {
  if (isType(type)) {
    // for structs the new operator is allowed
    return isStruct(type) ? new type(value, path) : type(value, path);
  }

  if (process.env.NODE_ENV !== 'production') {
    // here type should be a class constructor and value some instance, just check membership and return the value
    path = path || [getFunctionName(type)];
    assert(value instanceof type, function () { return 'Invalid value ' + stringify(value) + ' supplied to ' + path.join('/'); });
  }

  return value;
};
}).call(this,require('_process'))
},{"./assert":52,"./getFunctionName":60,"./isStruct":74,"./isType":75,"./stringify":83,"_process":35}],54:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var isType = require('./isType');
var isNil = require('./isNil');
var mixin = require('./mixin');
var getTypeName = require('./getTypeName');

// All the .declare-d types should be clearly different from each other thus they should have
// different names when a name was not explicitly provided.
var nextDeclareUniqueId = 1;

module.exports = function declare(name) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isTypeName(name), function () { return 'Invalid argument name ' + name + ' supplied to declare([name]) (expected a string)'; });
  }

  var type;

  function Declare(value, path) {
    if (process.env.NODE_ENV !== 'production') {
      assert(!isNil(type), function () { return 'Type declared but not defined, don\'t forget to call .define on every declared type'; });
    }
    return type(value, path);
  }

  Declare.define = function (spec) {
    if (process.env.NODE_ENV !== 'production') {
      assert(isType(spec), function () { return 'Invalid argument type ' + assert.stringify(spec) +  ' supplied to define(type) (expected a type)'; });
      assert(isNil(type), function () { return 'Declare.define(type) can only be invoked once'; });
      assert(isNil(spec.meta.name) && Object.keys(spec.prototype).length === 0, function () { return 'Invalid argument type ' + assert.stringify(spec) + ' supplied to define(type) (expected a fresh, unnamed type)'; });
    }

    type = spec;
    mixin(Declare, type, true); // true because it overwrites Declare.displayName
    if (name) {
      type.displayName = Declare.displayName = name;
      Declare.meta.name = name;
    }
    // ensure identity is still false
    Declare.meta.identity = false;
    Declare.prototype = type.prototype;
    return Declare;
  };

  Declare.displayName = name || ( getTypeName(Declare) + "$" + nextDeclareUniqueId++ );
  // in general I can't say if this type will be an identity, for safety setting to false
  Declare.meta = { identity: false };
  Declare.prototype = null;
  return Declare;
};

}).call(this,require('_process'))
},{"./assert":52,"./getTypeName":61,"./isNil":70,"./isType":75,"./isTypeName":76,"./mixin":81,"_process":35}],55:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var isFunction = require('./isFunction');
var getTypeName = require('./getTypeName');
var isIdentity = require('./isIdentity');
var isObject = require('./isObject');
var create = require('./create');
var is = require('./is');

function getDefaultName(domain, codomain) {
  return '{[key: ' + getTypeName(domain) + ']: ' + getTypeName(codomain) + '}';
}

function dict(domain, codomain, name) {

  if (process.env.NODE_ENV !== 'production') {
    assert(isFunction(domain), function () { return 'Invalid argument domain ' + assert.stringify(domain) + ' supplied to dict(domain, codomain, [name]) combinator (expected a type)'; });
    assert(isFunction(codomain), function () { return 'Invalid argument codomain ' + assert.stringify(codomain) + ' supplied to dict(domain, codomain, [name]) combinator (expected a type)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to dict(domain, codomain, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(domain, codomain);
  var domainNameCache = getTypeName(domain);
  var codomainNameCache = getTypeName(codomain);
  var identity = isIdentity(domain) && isIdentity(codomain);

  function Dict(value, path) {

    if (process.env.NODE_ENV === 'production') {
      if (identity) {
        return value; // just trust the input if elements must not be hydrated
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      path = path || [displayName];
      assert(isObject(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/'); });
    }

    var idempotent = true; // will remain true if I can reutilise the input
    var ret = {}; // make a temporary copy, will be discarded if idempotent remains true
    for (var k in value) {
      if (value.hasOwnProperty(k)) {
        k = create(domain, k, ( process.env.NODE_ENV !== 'production' ? path.concat(domainNameCache) : null ));
        var actual = value[k];
        var instance = create(codomain, actual, ( process.env.NODE_ENV !== 'production' ? path.concat(k + ': ' + codomainNameCache) : null ));
        idempotent = idempotent && ( actual === instance );
        ret[k] = instance;
      }
    }

    if (idempotent) { // implements idempotency
      ret = value;
    }

    if (process.env.NODE_ENV !== 'production') {
      Object.freeze(ret);
    }

    return ret;
  }

  Dict.meta = {
    kind: 'dict',
    domain: domain,
    codomain: codomain,
    name: name,
    identity: identity
  };

  Dict.displayName = displayName;

  Dict.is = function (x) {
    if (!isObject(x)) {
      return false;
    }
    for (var k in x) {
      if (x.hasOwnProperty(k)) {
        if (!is(k, domain) || !is(x[k], codomain)) {
          return false;
        }
      }
    }
    return true;
  };

  Dict.update = function (instance, patch) {
    return Dict(assert.update(instance, patch));
  };

  return Dict;
}

dict.getDefaultName = getDefaultName;
module.exports = dict;

}).call(this,require('_process'))
},{"./assert":52,"./create":53,"./getTypeName":61,"./is":64,"./isFunction":67,"./isIdentity":68,"./isObject":72,"./isTypeName":76,"_process":35}],56:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var forbidNewOperator = require('./forbidNewOperator');
var isString = require('./isString');
var isObject = require('./isObject');

function getDefaultName(map) {
  return Object.keys(map).map(function (k) { return assert.stringify(k); }).join(' | ');
}

function enums(map, name) {

  if (process.env.NODE_ENV !== 'production') {
    assert(isObject(map), function () { return 'Invalid argument map ' + assert.stringify(map) + ' supplied to enums(map, [name]) combinator (expected a dictionary of String -> String | Number)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to enums(map, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(map);

  function Enums(value, path) {

    if (process.env.NODE_ENV !== 'production') {
      forbidNewOperator(this, Enums);
      path = path || [displayName];
      assert(Enums.is(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (expected one of ' + assert.stringify(Object.keys(map)) + ')'; });
    }

    return value;
  }

  Enums.meta = {
    kind: 'enums',
    map: map,
    name: name,
    identity: true
  };

  Enums.displayName = displayName;

  Enums.is = function (x) {
    return map.hasOwnProperty(x);
  };

  return Enums;
}

enums.of = function (keys, name) {
  keys = isString(keys) ? keys.split(' ') : keys;
  var value = {};
  keys.forEach(function (k) {
    value[k] = k;
  });
  return enums(value, name);
};

enums.getDefaultName = getDefaultName;
module.exports = enums;


}).call(this,require('_process'))
},{"./assert":52,"./forbidNewOperator":58,"./isObject":72,"./isString":73,"./isTypeName":76,"_process":35}],57:[function(require,module,exports){
module.exports = function fail(message) {
  throw new TypeError('[tcomb] ' + message);
};
},{}],58:[function(require,module,exports){
var assert = require('./assert');
var getTypeName = require('./getTypeName');

module.exports = function forbidNewOperator(x, type) {
  assert(!(x instanceof type), function () { return 'Cannot use the new operator to instantiate the type ' + getTypeName(type); });
};
},{"./assert":52,"./getTypeName":61}],59:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var FunctionType = require('./Function');
var isArray = require('./isArray');
var list = require('./list');
var isObject = require('./isObject');
var create = require('./create');
var isNil = require('./isNil');
var isBoolean = require('./isBoolean');
var tuple = require('./tuple');
var getFunctionName = require('./getFunctionName');
var getTypeName = require('./getTypeName');

function getDefaultName(domain, codomain) {
  return '(' + domain.map(getTypeName).join(', ') + ') => ' + getTypeName(codomain);
}

function isInstrumented(f) {
  return FunctionType.is(f) && isObject(f.instrumentation);
}

function func(domain, codomain, name) {

  domain = isArray(domain) ? domain : [domain]; // handle handy syntax for unary functions

  if (process.env.NODE_ENV !== 'production') {
    assert(list(FunctionType).is(domain), function () { return 'Invalid argument domain ' + assert.stringify(domain) + ' supplied to func(domain, codomain, [name]) combinator (expected an array of types)'; });
    assert(FunctionType.is(codomain), function () { return 'Invalid argument codomain ' + assert.stringify(codomain) + ' supplied to func(domain, codomain, [name]) combinator (expected a type)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to func(domain, codomain, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(domain, codomain);

  function FuncType(value, curried) {

    if (!isInstrumented(value)) { // automatically instrument the function
      return FuncType.of(value, curried);
    }

    if (process.env.NODE_ENV !== 'production') {
      assert(FuncType.is(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + displayName; });
    }

    return value;
  }

  FuncType.meta = {
    kind: 'func',
    domain: domain,
    codomain: codomain,
    name: name,
    identity: true
  };

  FuncType.displayName = displayName;

  FuncType.is = function (x) {
    return isInstrumented(x) &&
      x.instrumentation.domain.length === domain.length &&
      x.instrumentation.domain.every(function (type, i) {
        return type === domain[i];
      }) &&
      x.instrumentation.codomain === codomain;
  };

  FuncType.of = function (f, curried) {

    if (process.env.NODE_ENV !== 'production') {
      assert(FunctionType.is(f), function () { return 'Invalid argument f supplied to func.of ' + displayName + ' (expected a function)'; });
      assert(isNil(curried) || isBoolean(curried), function () { return 'Invalid argument curried ' + assert.stringify(curried) + ' supplied to func.of ' + displayName + ' (expected a boolean)'; });
    }

    if (FuncType.is(f)) { // makes FuncType.of idempotent
      return f;
    }

    function fn() {
      var args = Array.prototype.slice.call(arguments);
      var len = curried ?
        args.length :
        domain.length;
      var argsType = tuple(domain.slice(0, len));

      args = argsType(args); // type check arguments

      if (len === domain.length) {
        return create(codomain, f.apply(this, args));
      }
      else {
        var g = Function.prototype.bind.apply(f, [this].concat(args));
        var newdomain = func(domain.slice(len), codomain);
        return newdomain.of(g, curried);
      }
    }

    fn.instrumentation = {
      domain: domain,
      codomain: codomain,
      f: f
    };

    fn.displayName = getFunctionName(f);

    return fn;

  };

  return FuncType;

}

func.getDefaultName = getDefaultName;
module.exports = func;

}).call(this,require('_process'))
},{"./Function":46,"./assert":52,"./create":53,"./getFunctionName":60,"./getTypeName":61,"./isArray":65,"./isBoolean":66,"./isNil":70,"./isObject":72,"./isTypeName":76,"./list":78,"./tuple":85,"_process":35}],60:[function(require,module,exports){
module.exports = function getFunctionName(f) {
  return f.displayName || f.name || '<function' + f.length + '>';
};
},{}],61:[function(require,module,exports){
var isType = require('./isType');
var getFunctionName = require('./getFunctionName');

module.exports = function getTypeName(constructor) {
  if (isType(constructor)) {
    return constructor.displayName;
  }
  return getFunctionName(constructor);
};
},{"./getFunctionName":60,"./isType":75}],62:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var isFunction = require('./isFunction');
var isArray = require('./isArray');
var forbidNewOperator = require('./isIdentity');
var is = require('./is');
var getTypeName = require('./getTypeName');

function getDefaultName(types) {
  return types.map(getTypeName).join(' & ');
}

function intersection(types, name) {

  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(types) && types.every(isFunction) && types.length >= 2, function () { return 'Invalid argument types ' + assert.stringify(types) + ' supplied to intersection(types, [name]) combinator (expected an array of at least 2 types)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to intersection(types, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(types);

  function Intersection(value, path) {

    if (process.env.NODE_ENV !== 'production') {
      forbidNewOperator(this, Intersection);
      path = path || [displayName];
      assert(Intersection.is(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/'); });
    }

    return value;
  }

  Intersection.meta = {
    kind: 'intersection',
    types: types,
    name: name,
    identity: true
  };

  Intersection.displayName = displayName;

  Intersection.is = function (x) {
    return types.every(function (type) {
      return is(x, type);
    });
  };

  Intersection.update = function (instance, patch) {
    return Intersection(assert.update(instance, patch));
  };

  return Intersection;
}

intersection.getDefaultName = getDefaultName;
module.exports = intersection;


}).call(this,require('_process'))
},{"./assert":52,"./getTypeName":61,"./is":64,"./isArray":65,"./isFunction":67,"./isIdentity":68,"./isTypeName":76,"_process":35}],63:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isString = require('./isString');
var isFunction = require('./isFunction');
var forbidNewOperator = require('./forbidNewOperator');

module.exports = function irreducible(name, predicate) {

  if (process.env.NODE_ENV !== 'production') {
    assert(isString(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to irreducible(name, predicate) (expected a string)'; });
    assert(isFunction(predicate), 'Invalid argument predicate ' + assert.stringify(predicate) + ' supplied to irreducible(name, predicate) (expected a function)');
  }

  function Irreducible(value, path) {

    if (process.env.NODE_ENV !== 'production') {
      forbidNewOperator(this, Irreducible);
      path = path || [name];
      assert(predicate(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/'); });
    }

    return value;
  }

  Irreducible.meta = {
    kind: 'irreducible',
    name: name,
    predicate: predicate,
    identity: true
  };

  Irreducible.displayName = name;

  Irreducible.is = predicate;

  return Irreducible;
};

}).call(this,require('_process'))
},{"./assert":52,"./forbidNewOperator":58,"./isFunction":67,"./isString":73,"_process":35}],64:[function(require,module,exports){
var isType = require('./isType');

// returns true if x is an instance of type
module.exports = function is(x, type) {
  if (isType(type)) {
    return type.is(x);
  }
  return x instanceof type; // type should be a class constructor
};

},{"./isType":75}],65:[function(require,module,exports){
module.exports = function isArray(x) {
  return x instanceof Array;
};
},{}],66:[function(require,module,exports){
module.exports = function isBoolean(x) {
  return x === true || x === false;
};
},{}],67:[function(require,module,exports){
module.exports = function isFunction(x) {
  return typeof x === 'function';
};
},{}],68:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var Boolean = require('./Boolean');
var isType = require('./isType');
var getTypeName = require('./getTypeName');

// return true if the type constructor behaves like the identity function
module.exports = function isIdentity(type) {
  if (isType(type)) {
    if (process.env.NODE_ENV !== 'production') {
      assert(Boolean.is(type.meta.identity), function () { return 'Invalid meta identity ' + assert.stringify(type.meta.identity) + ' supplied to type ' + getTypeName(type); });
    }
    return type.meta.identity;
  }
  // for tcomb the other constructors, like ES6 classes, are identity-like
  return true;
};
}).call(this,require('_process'))
},{"./Boolean":43,"./assert":52,"./getTypeName":61,"./isType":75,"_process":35}],69:[function(require,module,exports){
var isType = require('./isType');

module.exports = function isMaybe(x) {
  return isType(x) && ( x.meta.kind === 'maybe' );
};
},{"./isType":75}],70:[function(require,module,exports){
module.exports = function isNil(x) {
  return x === null || x === void 0;
};
},{}],71:[function(require,module,exports){
module.exports = function isNumber(x) {
  return typeof x === 'number' && isFinite(x) && !isNaN(x);
};
},{}],72:[function(require,module,exports){
var isNil = require('./isNil');
var isArray = require('./isArray');

module.exports = function isObject(x) {
  return !isNil(x) && typeof x === 'object' && !isArray(x);
};
},{"./isArray":65,"./isNil":70}],73:[function(require,module,exports){
module.exports = function isString(x) {
  return typeof x === 'string';
};
},{}],74:[function(require,module,exports){
var isType = require('./isType');

module.exports = function isStruct(x) {
  return isType(x) && ( x.meta.kind === 'struct' );
};
},{"./isType":75}],75:[function(require,module,exports){
var isFunction = require('./isFunction');
var isObject = require('./isObject');

module.exports = function isType(x) {
  return isFunction(x) && isObject(x.meta);
};
},{"./isFunction":67,"./isObject":72}],76:[function(require,module,exports){
var isNil = require('./isNil');
var isString = require('./isString');

module.exports = function isTypeName(name) {
  return isNil(name) || isString(name);
};
},{"./isNil":70,"./isString":73}],77:[function(require,module,exports){
var isType = require('./isType');

module.exports = function isUnion(x) {
  return isType(x) && ( x.meta.kind === 'union' );
};
},{"./isType":75}],78:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var isFunction = require('./isFunction');
var getTypeName = require('./getTypeName');
var isIdentity = require('./isIdentity');
var create = require('./create');
var is = require('./is');
var isArray = require('./isArray');

function getDefaultName(type) {
  return 'Array<' + getTypeName(type) + '>';
}

function list(type, name) {

  if (process.env.NODE_ENV !== 'production') {
    assert(isFunction(type), function () { return 'Invalid argument type ' + assert.stringify(type) + ' supplied to list(type, [name]) combinator (expected a type)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to list(type, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(type);
  var typeNameCache = getTypeName(type);
  var identity = isIdentity(type); // the list is identity iif type is identity

  function List(value, path) {

    if (process.env.NODE_ENV === 'production') {
      if (identity) {
        return value; // just trust the input if elements must not be hydrated
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      path = path || [displayName];
      assert(isArray(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (expected an array of ' + typeNameCache + ')'; });
    }

    var idempotent = true; // will remain true if I can reutilise the input
    var ret = []; // make a temporary copy, will be discarded if idempotent remains true
    for (var i = 0, len = value.length; i < len; i++ ) {
      var actual = value[i];
      var instance = create(type, actual, ( process.env.NODE_ENV !== 'production' ? path.concat(i + ': ' + typeNameCache) : null ));
      idempotent = idempotent && ( actual === instance );
      ret.push(instance);
    }

    if (idempotent) { // implements idempotency
      ret = value;
    }

    if (process.env.NODE_ENV !== 'production') {
      Object.freeze(ret);
    }

    return ret;
  }

  List.meta = {
    kind: 'list',
    type: type,
    name: name,
    identity: identity
  };

  List.displayName = displayName;

  List.is = function (x) {
    return isArray(x) && x.every(function (e) {
      return is(e, type);
    });
  };

  List.update = function (instance, patch) {
    return List(assert.update(instance, patch));
  };

  return List;
}

list.getDefaultName = getDefaultName;
module.exports = list;

}).call(this,require('_process'))
},{"./assert":52,"./create":53,"./getTypeName":61,"./is":64,"./isArray":65,"./isFunction":67,"./isIdentity":68,"./isTypeName":76,"_process":35}],79:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isFunction = require('./isFunction');
var isType = require('./isType');
var Any = require('./Any');

module.exports = function match(x) {
  var type, guard, f, count;
  for (var i = 1, len = arguments.length; i < len; ) {
    type = arguments[i];
    guard = arguments[i + 1];
    f = arguments[i + 2];

    if (isFunction(f) && !isType(f)) {
      i = i + 3;
    }
    else {
      f = guard;
      guard = Any.is;
      i = i + 2;
    }

    if (process.env.NODE_ENV !== 'production') {
      count = (count || 0) + 1;
      assert(isType(type), function () { return 'Invalid type in clause #' + count; });
      assert(isFunction(guard), function () { return 'Invalid guard in clause #' + count; });
      assert(isFunction(f), function () { return 'Invalid block in clause #' + count; });
    }

    if (type.is(x) && guard(x)) {
      return f(x);
    }
  }
  assert.fail('Match error');
};

}).call(this,require('_process'))
},{"./Any":41,"./assert":52,"./isFunction":67,"./isType":75,"_process":35}],80:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var isFunction = require('./isFunction');
var isMaybe = require('./isMaybe');
var isIdentity = require('./isIdentity');
var Any = require('./Any');
var create = require('./create');
var Nil = require('./Nil');
var forbidNewOperator = require('./forbidNewOperator');
var is = require('./is');
var getTypeName = require('./getTypeName');

function getDefaultName(type) {
  return '?' + getTypeName(type);
}

function maybe(type, name) {

  if (isMaybe(type) || type === Any || type === Nil) { // makes the combinator idempotent and handle Any, Nil
    return type;
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(isFunction(type), function () { return 'Invalid argument type ' + assert.stringify(type) + ' supplied to maybe(type, [name]) combinator (expected a type)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to maybe(type, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(type);

  function Maybe(value, path) {
    if (process.env.NODE_ENV !== 'production') {
      forbidNewOperator(this, Maybe);
    }
    return Nil.is(value) ? null : create(type, value, path);
  }

  Maybe.meta = {
    kind: 'maybe',
    type: type,
    name: name,
    identity: isIdentity(type)
  };

  Maybe.displayName = displayName;

  Maybe.is = function (x) {
    return Nil.is(x) || is(x, type);
  };

  return Maybe;
}

maybe.getDefaultName = getDefaultName;
module.exports = maybe;

}).call(this,require('_process'))
},{"./Any":41,"./Nil":47,"./assert":52,"./create":53,"./forbidNewOperator":58,"./getTypeName":61,"./is":64,"./isFunction":67,"./isIdentity":68,"./isMaybe":69,"./isTypeName":76,"_process":35}],81:[function(require,module,exports){
(function (process){
var isNil = require('./isNil');
var assert = require('./assert');

// safe mixin, cannot override props unless specified
module.exports = function mixin(target, source, overwrite) {
  if (isNil(source)) { return target; }
  for (var k in source) {
    if (source.hasOwnProperty(k)) {
      if (overwrite !== true) {
        if (process.env.NODE_ENV !== 'production') {
          assert(!target.hasOwnProperty(k), function () { return 'Invalid call to mixin(target, source, [overwrite]): cannot overwrite property "' + k + '" of target object'; });
        }
      }
      target[k] = source[k];
    }
  }
  return target;
};
}).call(this,require('_process'))
},{"./assert":52,"./isNil":70,"_process":35}],82:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var isFunction = require('./isFunction');
var forbidNewOperator = require('./forbidNewOperator');
var isIdentity = require('./isIdentity');
var create = require('./create');
var is = require('./is');
var getTypeName = require('./getTypeName');
var getFunctionName = require('./getFunctionName');

function getDefaultName(type, predicate) {
  return '{' + getTypeName(type) + ' | ' + getFunctionName(predicate) + '}';
}

function refinement(type, predicate, name) {

  if (process.env.NODE_ENV !== 'production') {
    assert(isFunction(type), function () { return 'Invalid argument type ' + assert.stringify(type) + ' supplied to refinement(type, predicate, [name]) combinator (expected a type)'; });
    assert(isFunction(predicate), function () { return 'Invalid argument predicate supplied to refinement(type, predicate, [name]) combinator (expected a function)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to refinement(type, predicate, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(type, predicate);
  var identity = isIdentity(type);

  function Refinement(value, path) {

    if (process.env.NODE_ENV !== 'production') {
      forbidNewOperator(this, Refinement);
      path = path || [displayName];
    }

    var x = create(type, value, path);

    if (process.env.NODE_ENV !== 'production') {
      assert(predicate(x), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/'); });
    }

    return x;
  }

  Refinement.meta = {
    kind: 'subtype',
    type: type,
    predicate: predicate,
    name: name,
    identity: identity
  };

  Refinement.displayName = displayName;

  Refinement.is = function (x) {
    return is(x, type) && predicate(x);
  };

  Refinement.update = function (instance, patch) {
    return Refinement(assert.update(instance, patch));
  };

  return Refinement;
}

refinement.getDefaultName = getDefaultName;
module.exports = refinement;

}).call(this,require('_process'))
},{"./assert":52,"./create":53,"./forbidNewOperator":58,"./getFunctionName":60,"./getTypeName":61,"./is":64,"./isFunction":67,"./isIdentity":68,"./isTypeName":76,"_process":35}],83:[function(require,module,exports){
module.exports = function stringify(x) {
  try { // handle "Converting circular structure to JSON" error
    return JSON.stringify(x, null, 2);
  }
  catch (e) {
    return String(x);
  }
};
},{}],84:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var String = require('./String');
var Function = require('./Function');
var isArray = require('./isArray');
var isObject = require('./isObject');
var create = require('./create');
var mixin = require('./mixin');
var isStruct = require('./isStruct');
var getTypeName = require('./getTypeName');
var dict = require('./dict');

function getDefaultName(props) {
  return '{' + Object.keys(props).map(function (prop) {
    return prop + ': ' + getTypeName(props[prop]);
  }).join(', ') + '}';
}

function extend(mixins, name) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(mixins) && mixins.every(function (x) {
      return isObject(x) || isStruct(x);
    }), function () { return 'Invalid argument mixins supplied to extend(mixins, name), expected an array of objects or structs'; });
  }
  var props = {};
  var prototype = {};
  mixins.forEach(function (struct) {
    if (isObject(struct)) {
      mixin(props, struct);
    }
    else {
      mixin(props, struct.meta.props);
      mixin(prototype, struct.prototype);
    }
  });
  var ret = struct(props, name);
  mixin(ret.prototype, prototype);
  return ret;
}

function struct(props, name) {

  if (process.env.NODE_ENV !== 'production') {
    assert(dict(String, Function).is(props), function () { return 'Invalid argument props ' + assert.stringify(props) + ' supplied to struct(props, [name]) combinator (expected a dictionary String -> Type)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to struct(props, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(props);

  function Struct(value, path) {

    if (Struct.is(value)) { // implements idempotency
      return value;
    }

    if (process.env.NODE_ENV !== 'production') {
      path = path || [displayName];
      assert(isObject(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (expected an object)'; });
    }

    if (!(this instanceof Struct)) { // `new` is optional
      return new Struct(value, path);
    }

    for (var k in props) {
      if (props.hasOwnProperty(k)) {
        var expected = props[k];
        var actual = value[k];
        this[k] = create(expected, actual, ( process.env.NODE_ENV !== 'production' ? path.concat(k + ': ' + getTypeName(expected)) : null ));
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      Object.freeze(this);
    }

  }

  Struct.meta = {
    kind: 'struct',
    props: props,
    name: name,
    identity: false
  };

  Struct.displayName = displayName;

  Struct.is = function (x) {
    return x instanceof Struct;
  };

  Struct.update = function (instance, patch) {
    return new Struct(assert.update(instance, patch));
  };

  Struct.extend = function (structs, name) {
    return extend([Struct].concat(structs), name);
  };

  return Struct;
}

struct.getDefaultName = getDefaultName;
struct.extend = extend;
module.exports = struct;

}).call(this,require('_process'))
},{"./Function":46,"./String":51,"./assert":52,"./create":53,"./dict":55,"./getTypeName":61,"./isArray":65,"./isObject":72,"./isStruct":74,"./isTypeName":76,"./mixin":81,"_process":35}],85:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var isFunction = require('./isFunction');
var getTypeName = require('./getTypeName');
var isIdentity = require('./isIdentity');
var isArray = require('./isArray');
var create = require('./create');
var is = require('./is');

function getDefaultName(types) {
  return '[' + types.map(getTypeName).join(', ') + ']';
}

function tuple(types, name) {

  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(types) && types.every(isFunction), function () { return 'Invalid argument types ' + assert.stringify(types) + ' supplied to tuple(types, [name]) combinator (expected an array of types)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to tuple(types, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(types);
  var identity = types.every(isIdentity);

  function Tuple(value, path) {

    if (process.env.NODE_ENV === 'production') {
      if (identity) {
        return value;
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      path = path || [displayName];
      assert(isArray(value) && value.length === types.length, function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (expected an array of length ' + types.length + ')'; });
    }

    var idempotent = true;
    var ret = [];
    for (var i = 0, len = types.length; i < len; i++) {
      var expected = types[i];
      var actual = value[i];
      var instance = create(expected, actual, ( process.env.NODE_ENV !== 'production' ? path.concat(i + ': ' + getTypeName(expected)) : null ));
      idempotent = idempotent && ( actual === instance );
      ret.push(instance);
    }

    if (idempotent) { // implements idempotency
      ret = value;
    }

    if (process.env.NODE_ENV !== 'production') {
      Object.freeze(ret);
    }

    return ret;
  }

  Tuple.meta = {
    kind: 'tuple',
    types: types,
    name: name,
    identity: identity
  };

  Tuple.displayName = displayName;

  Tuple.is = function (x) {
    return isArray(x) &&
      x.length === types.length &&
      types.every(function (type, i) {
        return is(x[i], type);
      });
  };

  Tuple.update = function (instance, patch) {
    return Tuple(assert.update(instance, patch));
  };

  return Tuple;
}

tuple.getDefaultName = getDefaultName;
module.exports = tuple;
}).call(this,require('_process'))
},{"./assert":52,"./create":53,"./getTypeName":61,"./is":64,"./isArray":65,"./isFunction":67,"./isIdentity":68,"./isTypeName":76,"_process":35}],86:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isTypeName = require('./isTypeName');
var isFunction = require('./isFunction');
var getTypeName = require('./getTypeName');
var isIdentity = require('./isIdentity');
var isArray = require('./isArray');
var create = require('./create');
var is = require('./is');
var forbidNewOperator = require('./forbidNewOperator');
var isType = require('./isType');
var isUnion = require('./isUnion');
var isNil = require('./isNil');

function getDefaultName(types) {
  return types.map(getTypeName).join(' | ');
}

function union(types, name) {

  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(types) && types.every(isFunction) && types.length >= 2, function () { return 'Invalid argument types ' + assert.stringify(types) + ' supplied to union(types, [name]) combinator (expected an array of at least 2 types)'; });
    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to union(types, [name]) combinator (expected a string)'; });
  }

  var displayName = name || getDefaultName(types);
  var identity = types.every(isIdentity);

  function Union(value, path) {

    if (process.env.NODE_ENV === 'production') {
      if (identity) {
        return value;
      }
    }

    var type = Union.dispatch(value);
    if (!type && Union.is(value)) {
      return value;
    }

    if (process.env.NODE_ENV !== 'production') {
      forbidNewOperator(this, Union);
      path = path || [displayName];
      assert(isType(type), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (no constructor returned by dispatch)'; });
      path[path.length - 1] += '(' + getTypeName(type) + ')';
    }

    return create(type, value, path);
  }

  Union.meta = {
    kind: 'union',
    types: types,
    name: name,
    identity: identity
  };

  Union.displayName = displayName;

  Union.is = function (x) {
    return types.some(function (type) {
      return is(x, type);
    });
  };

  Union.dispatch = function (x) { // default dispatch implementation
    for (var i = 0, len = types.length; i < len; i++ ) {
      var type = types[i];
      if (isUnion(type)) { // handle union of unions
        var t = type.dispatch(x);
        if (!isNil(t)) {
          return t;
        }
      }
      else if (is(x, type)) {
        return type;
      }
    }
  };

  Union.update = function (instance, patch) {
    return Union(assert.update(instance, patch));
  };

  return Union;
}

union.getDefaultName = getDefaultName;
module.exports = union;


}).call(this,require('_process'))
},{"./assert":52,"./create":53,"./forbidNewOperator":58,"./getTypeName":61,"./is":64,"./isArray":65,"./isFunction":67,"./isIdentity":68,"./isNil":70,"./isType":75,"./isTypeName":76,"./isUnion":77,"_process":35}],87:[function(require,module,exports){
(function (process){
var assert = require('./assert');
var isObject = require('./isObject');
var isFunction = require('./isFunction');
var isArray = require('./isArray');
var isNumber = require('./isNumber');
var mixin = require('./mixin');

function getShallowCopy(x) {
  if (isArray(x)) {
    return x.concat();
  }
  if (x instanceof Date || x instanceof RegExp) {
    return x;
  }
  if (isObject(x)) {
    return mixin({}, x);
  }
  return x;
}

function update(instance, patch) {

  if (process.env.NODE_ENV !== 'production') {
    assert(isObject(patch), function () { return 'Invalid argument patch ' + assert.stringify(patch) + ' supplied to function update(instance, patch): expected an object containing commands'; });
  }

  var value = getShallowCopy(instance);
  var isChanged = false;
  for (var k in patch) {
    if (patch.hasOwnProperty(k)) {
      if (update.commands.hasOwnProperty(k)) {
        value = update.commands[k](patch[k], value);
        isChanged = true;
      }
      else {
        var newValue = update(value[k], patch[k]);
        isChanged = isChanged || ( newValue !== value[k] );
        value[k] = newValue;
      }
    }
  }
  return isChanged ? value : instance;
}

// built-in commands

function $apply(f, value) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isFunction(f), 'Invalid argument f supplied to immutability helper { $apply: f } (expected a function)');
  }
  return f(value);
}

function $push(elements, arr) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(elements), 'Invalid argument elements supplied to immutability helper { $push: elements } (expected an array)');
    assert(isArray(arr), 'Invalid value supplied to immutability helper $push (expected an array)');
  }
  return arr.concat(elements);
}

function $remove(keys, obj) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(keys), 'Invalid argument keys supplied to immutability helper { $remove: keys } (expected an array)');
    assert(isObject(obj), 'Invalid value supplied to immutability helper $remove (expected an object)');
  }
  for (var i = 0, len = keys.length; i < len; i++ ) {
    delete obj[keys[i]];
  }
  return obj;
}

function $set(value) {
  return value;
}

function $splice(splices, arr) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(splices) && splices.every(isArray), 'Invalid argument splices supplied to immutability helper { $splice: splices } (expected an array of arrays)');
    assert(isArray(arr), 'Invalid value supplied to immutability helper $splice (expected an array)');
  }
  return splices.reduce(function (acc, splice) {
    acc.splice.apply(acc, splice);
    return acc;
  }, arr);
}

function $swap(config, arr) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isObject(config), 'Invalid argument config supplied to immutability helper { $swap: config } (expected an object)');
    assert(isNumber(config.from), 'Invalid argument config.from supplied to immutability helper { $swap: config } (expected a number)');
    assert(isNumber(config.to), 'Invalid argument config.to supplied to immutability helper { $swap: config } (expected a number)');
    assert(isArray(arr), 'Invalid value supplied to immutability helper $swap (expected an array)');
  }
  var element = arr[config.to];
  arr[config.to] = arr[config.from];
  arr[config.from] = element;
  return arr;
}

function $unshift(elements, arr) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(elements), 'Invalid argument elements supplied to immutability helper {$unshift: elements} (expected an array)');
    assert(isArray(arr), 'Invalid value supplied to immutability helper $unshift (expected an array)');
  }
  return elements.concat(arr);
}

function $merge(obj, value) {
  return mixin(mixin({}, value), obj, true);
}

update.commands = {
  $apply: $apply,
  $push: $push,
  $remove: $remove,
  $set: $set,
  $splice: $splice,
  $swap: $swap,
  $unshift: $unshift,
  $merge: $merge
};

module.exports = update;

}).call(this,require('_process'))
},{"./assert":52,"./isArray":65,"./isFunction":67,"./isNumber":71,"./isObject":72,"./mixin":81,"_process":35}],88:[function(require,module,exports){
(function (factory) {  
  if (typeof exports == 'object') {
    module.exports = factory();
  } else if ((typeof define == 'function') && define.amd) {
    define(factory);
  }
}(function () {

  var isBuiltIn = (function () {
    var built_ins = [
      Object,
      Function,
      Array,
      String,
      Boolean,
      Number,
      Date,
      RegExp,
      Error
    ];
    var built_ins_length = built_ins.length;

    return function (_constructor) {
      for (var i = 0; i < built_ins_length; i++) {
        if (built_ins[i] === _constructor) {
          return true;
        }
      }
      return false;
    };
  })();

  var stringType = (function () {
    var _toString = ({}).toString;

    return function (obj) {
      // For now work around this bug in PhantomJS
      // https://github.com/ariya/phantomjs/issues/11722
      if (obj === null) {
        return 'null';
      } else if (obj === undefined) {
        return 'undefined';
      }

      // [object Blah] -> Blah
      var stype = _toString.call(obj).slice(8, -1);

      // Temporarily elided see commented on line 37 above
      // if ((obj === null) || (obj === undefined)) {
      //   return stype.toLowerCase();
      // }

      var ctype = of(obj);

      if (ctype && !isBuiltIn(ctype)) {
        return ctype.name;
      } else {
        return stype;
      }
    };
  })();

  function of (obj) {
    if ((obj === null) || (obj === undefined)) {
      return obj;
    } else {
      return obj.constructor;
    }
  }

  function is (obj, test) {
    var typer = (of(test) === String) ? stringType : of;
    return (typer(obj) === test);
  }
  
  function instance (obj, test) {
    return (obj instanceof test);
  }

  function extension (_Extension, _Base) {
    return instance(_Extension.prototype, _Base);
  }

  function any (obj, tests) {
    if (!is(tests, Array)) {
      throw ("Second argument to .any() should be array")
    }
    for (var i = 0; i < tests.length; i++) {
      var test = tests[i];
      if (is(obj, test)) {
        return true;
      }
    }
    return false;
  }
  
  var exports = function (obj, type) {
    if (arguments.length == 1) {
      return of(obj);
    } else {
      if (is(type, Array)) {
        return any(obj, type);
      } else {
        return is(obj, type);
      }
    }
  }

  exports.instance  = instance;
  exports.string    = stringType;
  exports.of        = of;
  exports.is        = is;
  exports.any       = any;
  exports.extension = extension;
  return exports;

}));

},{}],89:[function(require,module,exports){
var reg = /[\'\"]/

module.exports = function unquote(str) {
  if (!str) {
    return ''
  }
  if (reg.test(str.charAt(0))) {
    str = str.substr(1)
  }
  if (reg.test(str.charAt(str.length - 1))) {
    str = str.substr(0, str.length - 1)
  }
  return str
}

},{}],90:[function(require,module,exports){
var luminance = require('relative-luminance');
var hexRgb = require('hex-rgb');

// http://www.w3.org/TR/WCAG20/#contrast-ratiodef

module.exports.luminance = fromLum;
module.exports.rgb = fromRGB;
module.exports.hex = fromHex;
module.exports.score = score;

/*
 * @param {number} a luminance value
 * @param {number} b luminance value
 * @returns {number} contrast ratio
 */
function fromLum(a, b) {
    var l1 = Math.max(a, b),
        l2 = Math.min(a, b);
    return (l1 + 0.05) / (l2 + 0.05);
}

/*
 * @param {array} a rgb value
 * @param {array} b rgb value
 * @returns {number} contrast ratio
 */
function fromRGB(a, b) {
    return fromLum(luminance(a), luminance(b));
}

/*
 * @param {string} a hex value
 * @param {string} b hex value
 * @returns {number} contrast ratio
 */
function fromHex(a, b) {
    return fromRGB(hexRgb(a), hexRgb(b));
}

/*
 * @param {array} a rgb value
 * @param {array} b rgb value
 * @returns {number} contrast ratio
 */
function score(contrast) {
    return (contrast >= 7) ? 'AAA' : (contrast >= 4.5) ? 'AA' : '';
}

},{"hex-rgb":12,"relative-luminance":38}]},{},[1]);
