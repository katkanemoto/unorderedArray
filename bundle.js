(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//creating a namespace in the only globally viewable varaible exposed by AA at generation time
lib._ = {};

//used to manipulate the AA generated UI elements as exposed in `lib`
var lesson_UI = require('lib/UI/lesson_UI');

//expose the lesson_UI code to the calling code in unorderedArray.html
lib._.lesson_UI = lesson_UI;

//the lesson logic itself
var lesson = require('lib/lesson/unordered_array_lesson');

//exposing to the calling code in unorderedArray.html
lib._.lesson = lesson;

//exposing primitives to calling code in unorderedArray.html
var primitives = require("lib/util/primitives");
lib._.primitives = primitives;
},{"lib/UI/lesson_UI":13,"lib/lesson/unordered_array_lesson":16,"lib/util/primitives":20}],2:[function(require,module,exports){
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

},{"color-name":3,"simple-swizzle":28}],5:[function(require,module,exports){
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

},{"tcomb":29}],11:[function(require,module,exports){
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

module.exports = function isArrayish(obj) {
	if (!obj) {
		return false;
	}

	return obj instanceof Array || Array.isArray(obj) ||
		(obj.length >= 0 && (obj.splice instanceof Function ||
			(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
};

},{}],13:[function(require,module,exports){
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
	
	//TODO: singleton
	
	this._state = this._INIT;
	
	//setup UI elements
	this._setup_title_screen();
	this._setup_insert_button();
	this._setup_array_screen();
	this._setup_array();
	
	this._state = this._PRE_LESSON;
	
	//play the initial title screen animation
	this._title_screen.gotoAndPlay("open");
};

lesson_UI.prototype = {
	_setup_title_screen : function() {
		this._title_screen = new this._lib.TitleScreen();
		this._title_screen.x = 192;
		this._title_screen.y = 256;
		
		this._stage.addChild(this._title_screen);	//add the title screen to the stage
	},
	
	_setup_insert_button : function() {
		//insert_btn is automatically populated inside the title screen object by AA
		this._insert_button = this._title_screen.insert_btn;
		
		//on button press for the insert button
		//next() to transition to the next state and play the close animation on the title screen
		var instance = this;
		this._insert_button.addEventListener("click", function() {
			instance.next();
		});
	},
	
	_setup_array_screen : function() {
		this._array_screen = new this._lib.ArrayScreen();	//setup by AA
		this._array_screen.x = 0;
		this._array_screen.y = 0;
	},
	
	_setup_array : function() {
		var size = 5;
		this._array = this._make_array(size);
		
		//TODO: allow config of positioning
		//positioning array
		this._array.x = 100;
		this._array.y = 200;
	},
	
	_make_array : function(size) {
		var offsetX = 0;
		var container = new this._createjs.Container();
		
		var random_integer = require('lib/util/random_integer');
		
		for (var i = 0; i < size; i++) {
			//create a sub-container to contain the array element and its text
			var c = new this._createjs.Container();
			
			var arrayElement = new this._lib.ArrayElement();
			var text = new this._createjs.Text(String(random_integer()), "20px Arial");
			//positioning text to be centered within the array element figure
			text.x = 9;
			text.y = 15;
			c.addChild(arrayElement);
			c.addChild(text);
			
			//offset each subcontainer by the size of the array element box
			c.x = offsetX;
			
			//BUG:
			//for some reason the width as returned by getBounds() is about half of the ArrayElement length as shown on the canvas
			//	using 50px as workaround
			//offsetX += arrayElement.getBounds().width;
			offsetX += 50;
			
			//setting associated index (displays below ArrayElement figure, configured by AA)
			arrayElement.index_txt.text = String(i);
			
			container.addChild(c);
		}
		
		return container;
	},
	
	//add a text input to the array_screen to capture user input
	_setup_text_input : function() {
		//get the text input
		var html_factory = require('lib/factory/html_factory');
		var hf = html_factory();
		hf.html({type:'text'});
		this._text_input = hf.get();
		
		//get the canvas_container div to attach to
		var canvas_container = document.getElementById('canvas_container');
		
		//position the text input
		this._text_input.x = 100;
		this._text_input.y = 100;
		
		var instance = this;
		//decorate method to get value of text input
		this._text_input._.get_text_input_value = function() {
			//no matter what is entered the "value" property is always a string
			//emtpy string case / no input, Number returns 0 for this?
			if (instance._text_input.children[0].htmlElement.value.length === 0) {
				return Number.NaN;
			}
			
			//despite the docs, this is a static method, so allocating it as per the docs (new Number), results in NaN on non-number input being wrapped in an object in a non-standard way that is undetectable by:
			//Number.Nan, equality checking with NaN, Number.isNaN() and typeof
			return Number(instance._text_input.children[0].htmlElement.value);
		};
		
		//...and set the value
		this._text_input._.set = function(value) {
			instance._text_input.children[0].htmlElement.value = String(value);
		};
		
		//...and a convenience method to clear the text input
		this._text_input._.clear = function() {
			instance._text_input.children[0].htmlElement.value = "";
		};
		
		//make text_input a child of the canvas_container
		this._text_input._.append_to(canvas_container);
		
		//add it as a child of the array_screen
		this._array_screen.addChild(this._text_input);
	},
	
	//public
	//proceed through the states of the lesson
	next : function() {
		if (this._state === this._INIT) return;	//do nothing if in the INIT state
		
		//handling for title screen, before the lesson UI is displayed
		//	called from click of the "insert" button on the title screen
		if (this._state === this._PRE_LESSON) {
			//set the state into lesson to allow the transition to the lesson logic
			this._state = this._LESSON;
			
			//TODO: add code here to delete title screen object from the stage and the reference here, to free memory
			this._title_screen.gotoAndPlay("close");
			
			this.next();
			
			return;
		}
		
		//handling for lesson screen, after pre-lesson has ended
		//	called by the PRE_LESSON handler on title screen close
		if (this._state === this._LESSON) {
			this._array_screen.gotoAndPlay("open");	//do the opening animation for the array screen
			
			//add the generated array to the screen
			this._array_screen.addChild(this._array);
			this._stage.addChild(this._array_screen);
			
			//add the text input HTML to the array screen
			//	cannot add earlier as appears over canvas even though not added to stage
			this._setup_text_input();
			
			return;
		}
	},
	
	//internal variables
	_stage : undefined,			//holds a reference to the createjs stage (of type lib.unorderedArray, created in AA)
	_createjs : undefined,		//holds a reference to the local createjs instance, avoiding the global
	_lib : undefined,			//holds a reference to the lib object, created by AA and used to access objects created by AA
	_title_screen : undefined,	//reference to an object of type TitleScreen (created in AA)
	_insert_button : undefined,	//reference to the insert button object (AA)
	_array_screen : undefined,	//reference to the array screen object (AA)
	_array : undefined,			//reference to the array created for the array screen
	_text_input : undefined,	//reference to the text input created, that's attached to the array screen
	
	//state tracking variables
	_state : undefined,
	_INIT : 0,
	_PRE_LESSON : 1,
	_LESSON : 2,
};
},{"check-types":2,"lib/factory/html_factory":14,"lib/util/primitives":20,"lib/util/random_integer":21}],14:[function(require,module,exports){
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
},{"check-types":2,"lib/factory/text_factory":15,"lib/util/add_to_stage":17,"lib/util/append_to":18,"lib/util/argument_check":19,"lib/util/primitives":20,"lib/util/unique_id":23}],15:[function(require,module,exports){
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
},{"check-types":2,"lib/util/add_to_stage":17,"lib/util/argument_check":19,"lib/util/primitives":20,"lib/util/random_integer":21}],16:[function(require,module,exports){
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
	
	var next = this.next;
	var pre_start = this.pre_start;
	//attach event handler for 'insert' button
	this._UI.insert_button.addEventListener("click", function() {
		pre_start();
	});
	
	//attach even handler for 'next' button
	this._UI.next_button.addEventListener("click", function() {
		next();
	});
	
	//all done with initial setup
	this._state = this._READY;
};

lesson.prototype = {
	//public
	//method used before the start of the lesson
	//	checks user input, gathers state of the UI, etc
	//	does nothing if traversing a lesson
	pre_start : function() {
		if (this._state !== this._READY) {
			//do nothing if we're setting up or in the middle of a lesson
			return;
		}
		
		//get user input to use during the lesson
		this._input_tmp = this._UI.input.get();
		
		//if user input is NaN, then unusable, print error and return
		//NOTE: Number.isNaN() returns true on undefined
		if (Number.isNaN(this._input_tmp)) {
			this._UI.output.set("The input is not a number.\n Please enter a number and press the insert button to insert the number into the array.");
			this._input_tmp = undefined;
			return;
		}
		
		//gather the state of the working array before lesson start
		if (this._UI.array.working.length === this._UI.array.working.size) {
			this._array_full = true;
		} else {
			this._array_full = false;
		}
		
		//change state to enter lesson
		this._state = this._RUN;
		this._step_state = this._STEP_1;
		
		//call the first step in the lesson
		return this.next();
	},
	//public
	//once running the lesson, used to get the next step in the lesson
	//	does nothing if not traversing a lesson
	next : function() {
		if (this._state !== this._RUN) {
			//do nothing as we're not in the lesson yet
			return;
		}
		
		if (this._array_full) {
			//array full case
			
			//create new array step
			if (this._step_state === this._STEP_1) {
				//allocate the new array and store a reference
				this._array_tmp = this._UI.array.get({size:this._UI.array.working.size*2, nodes:0});
				
				//allocate a new tail arrow for the new array
				this._arrow_tmp = this._UI.arrow.get({name:'tail', array:this._array_tmp, index:0});
				
				var message = "Array is full. Allocating new array of twice the length of the old one.";
				this._UI.output.set(message);
				
				this._step_state = this._STEP_2;
				
				return {value:message, done:false};
			}
			
			//create a move pointer, step
			if (this._step_state === this._STEP_2) {
				//allocate a new move arrow, on the old array, at index 0
				this._move_pointer = this._UI.arrow.get({name:'move', array:this._UI.array.working, index:0});
				
				var message = "Creating a move pointer at index 0 on the old array.";
				this._UI.output.set(message);
				
				this._step_state = this._STEP_MOVING;
				
				return {value:message, done:false};
			}
			
			//move content from old array to new array, step
			if (this._step_state === this._STEP_MOVING) {
				//exit condition
				//if the move pointer is pointing at the same index as the tail pointer in the old array
				if (this._move_pointer.index === this._UI.arrow.working.index) {
					var message = "The 'move' pointer is at the same index as the 'tail' pointer on the old array, we've finished moving the values.";
					this._UI.output.set(message);
				
					this._step_state = this._STEP_3;
					return {value:message, done:false};
				}
				
				//else, move the value at the current index
				var src_idx = this._move_pointer.index;
				var dst_idx = this._arrow_tmp.index;
				
				this._UI.array.move(
					{
						from_array: this._UI.array.working,
						from_index: src_idx,
						to_array: this._array_tmp,
						to_index: dst_idx,
					}
				);
				
				this._array_tmp[dst_idx] = this._UI.array.working[src_idx];
				//not removing value from old array, wait until array de-allocates
				
				//increment the move pointer
				this._move_pointer.increment();
				
				//increment the pointer in the new array, since we just put in a new value
				this._arrow_tmp.increment();
				
				var message = "Moved value " + String(this._array_tmp[dst_idx]) + ", from old array to new.";
				this._UI.output.set(message);
				
				return {value:message, done:false};
			}
			
			if (this._step_state === this._STEP_3) {
				//set array_full to false, now that we have a new array with more space
				this._array_full = false;
				
				//remove the old array and arrow from the UI
				this._UI.array.del(this._UI.array.working);
				this._UI.arrow.del(this._UI.arrow.working);
				
				//update the working array, to be the array we just got finished moving to
				this._UI.array.working = this._array_tmp;
				this._UI.arrow.working = this._arrow_tmp;
				this._array_tmp = undefined;
				this._arrow_tmp = undefined;
				
				//remove the 'move' arrow
				this._UI.arrow.del(this._move_pointer);
				this._move_pointer = undefined;
				
				var message = "Removing the old array and the move pointer.";
				this._UI.output.set(message);
				
				//set step and array_full to the appropriate values such that on next()
				//	we will re-use the logic below to copy the value from the input to the new array, that now has room
				this._step_state = this._STEP_1;
				
				return {value:message, done:false};
			}
		} else {
			//array not full case
			
			//move step
			if (this._step_state === this._STEP_1) {
				//move user input from input array to working array, at "tail" pointer location
				this._UI.array.move(
					{
						from_array: this._UI.array.input,
						from_index: 0,	//only a single index in input array
						to_array: this._UI.array.working,
						to_index: this._UI.arrow.working.index,
					}
				);
				
				//moving logic
				//NOTE: instead of using delete using pop(), as delete does not properly update length?
				//delete this._UI.array.input[0];
				this._UI.array.input.pop();
				this._UI.array.working[this._UI.arrow.working.index] = this._input_tmp;
				
				//set output to state what's been done
				var message = "Added the value " + String(this._input_tmp) + " to the array."
				this._UI.output.set(message);
				
				this._input_tmp = undefined;
				
				//increment the step state to do the next step on next()
				this._step_state = this._STEP_2;
				
				return {value:message, done:false};
			}
			
			//tail pointer increment step
			if (this._step_state === this._STEP_2) {
				this._UI.arrow.working.increment();	//increment tail pointer
				
				//set output to state what's been done
				var message = "Moved the 'tail' pointer to index: " + String(this._UI.arrow.working.index) + ", to prepare for the next insertion.";
				this._UI.output.set(message);
				
				//reset step state for next call
				this._step_state = undefined;
				
				//set state of lesson to accept another user input for insertion
				this._state = this._READY;
				
				//return done
				return {value:message, done:true};
			}
		}
	},
	
	//private variables
	_UI : 			undefined,	//local pointer to the UI object
	_input_tmp :	undefined,	//local storage for input while traversing a lesson
	_array_full : 	false,		//marks the case of the array being full or not, causing different lesson logic
	_array_tmp :	undefined,	//holds a reference to a new array object, used on _array_full === true case to allocate a new larger array
	_arrow_tmp :	undefined,	//holds a reference to a new arrow object for the a new array, on _array_full === true case
	_move_pointer : undefined,	//holds a reference to an arrow object, used in copy on _array_full === true case
	
	//state and constants associated
	_RUN : 2,			//currently traversing the lesson
	_READY : 1,			//ready to start the lesson, done with all of the setup, not currently in the lesson
	_INIT : 0,			//initial state, setting up object for lesson, should not be able to interact at this step
	_state : undefined,	//tracks the state of the lesson
	
	//states for when stepping through a lesson
	_STEP_3 : 3,
	_STEP_MOVING : 0,
	_STEP_2 : 2,
	_STEP_1 : 1,
	_step_state : undefined,
};

module.exports = lesson;
},{"check-types":2}],17:[function(require,module,exports){
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
},{"check-types":2,"lib/util/primitives":20,"lib/util/type_of":22}],18:[function(require,module,exports){
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
},{"check-types":2}],19:[function(require,module,exports){
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
},{"check-types":2,"color-string":4,"lib/util/type_of":22,"parse-css-font":24}],20:[function(require,module,exports){
//provides a unified require()able interface for those objects are assumed globals in the Animate code
//	implimented by a singleton javascript Map

//by convention keys are the same name as the global variables form which they are sourced
//	e.g. the global "createjs" has a key "createjs" referencing the createjs object

var _primitives;

if (!_primitives) {
	_primitives = new Map();
}

module.exports = _primitives;
},{}],21:[function(require,module,exports){
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
},{"check-types":2,"random-js":27}],22:[function(require,module,exports){
//replacing broken javascript typeof
//return a String representation of the type of value

var check = require('check-types');

module.exports = function type_of(value) {
	if (Number.isNaN(value)) {return "NaN";}
	if (check.emptyString(value)) {return "empty String";}
	//https://www.npmjs.com/package/type-of-is
	return (require('type-of-is')).string(value);
}
},{"check-types":2,"type-of-is":77}],23:[function(require,module,exports){
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
},{"check-types":2,"lib/util/primitives":20}],24:[function(require,module,exports){
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

},{"./lib/helpers":25,"css-font-stretch-keywords":6,"css-font-style-keywords":7,"css-font-weight-keywords":8,"css-global-keywords":9,"css-list-helpers":10,"css-system-font-keywords":11,"tcomb":29,"unquote":78}],25:[function(require,module,exports){
var cssFontSizeKeywords = require('css-font-size-keywords');

module.exports = {

	isSize: function(value) {
		return /^[\d\.]/.test(value)
			|| value.indexOf('/') !== -1
			|| cssFontSizeKeywords.indexOf(value) !== -1
		;
	}

};

},{"css-font-size-keywords":5}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
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

},{"is-arrayish":12}],29:[function(require,module,exports){
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

},{"./lib/Any":30,"./lib/Array":31,"./lib/Boolean":32,"./lib/Date":33,"./lib/Error":34,"./lib/Function":35,"./lib/Nil":36,"./lib/Number":37,"./lib/Object":38,"./lib/RegExp":39,"./lib/String":40,"./lib/assert":41,"./lib/declare":43,"./lib/dict":44,"./lib/enums":45,"./lib/func":48,"./lib/getTypeName":50,"./lib/intersection":51,"./lib/irreducible":52,"./lib/is":53,"./lib/isType":64,"./lib/list":67,"./lib/match":68,"./lib/maybe":69,"./lib/mixin":70,"./lib/refinement":71,"./lib/struct":73,"./lib/tuple":74,"./lib/union":75,"./lib/update":76}],30:[function(require,module,exports){
var irreducible = require('./irreducible');

module.exports = irreducible('Any', function () { return true; });

},{"./irreducible":52}],31:[function(require,module,exports){
var irreducible = require('./irreducible');
var isArray = require('./isArray');

module.exports = irreducible('Array', isArray);

},{"./irreducible":52,"./isArray":54}],32:[function(require,module,exports){
var irreducible = require('./irreducible');
var isBoolean = require('./isBoolean');

module.exports = irreducible('Boolean', isBoolean);

},{"./irreducible":52,"./isBoolean":55}],33:[function(require,module,exports){
var irreducible = require('./irreducible');

module.exports = irreducible('Date', function (x) { return x instanceof Date; });

},{"./irreducible":52}],34:[function(require,module,exports){
var irreducible = require('./irreducible');

module.exports = irreducible('Error', function (x) { return x instanceof Error; });

},{"./irreducible":52}],35:[function(require,module,exports){
var irreducible = require('./irreducible');
var isFunction = require('./isFunction');

module.exports = irreducible('Function', isFunction);

},{"./irreducible":52,"./isFunction":56}],36:[function(require,module,exports){
var irreducible = require('./irreducible');
var isNil = require('./isNil');

module.exports = irreducible('Nil', isNil);

},{"./irreducible":52,"./isNil":59}],37:[function(require,module,exports){
var irreducible = require('./irreducible');
var isNumber = require('./isNumber');

module.exports = irreducible('Number', isNumber);

},{"./irreducible":52,"./isNumber":60}],38:[function(require,module,exports){
var irreducible = require('./irreducible');
var isObject = require('./isObject');

module.exports = irreducible('Object', isObject);

},{"./irreducible":52,"./isObject":61}],39:[function(require,module,exports){
var irreducible = require('./irreducible');

module.exports = irreducible('RegExp', function (x) { return x instanceof RegExp; });

},{"./irreducible":52}],40:[function(require,module,exports){
var irreducible = require('./irreducible');
var isString = require('./isString');

module.exports = irreducible('String', isString);

},{"./irreducible":52,"./isString":62}],41:[function(require,module,exports){
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
},{"./fail":46,"./isFunction":56,"./isNil":59,"./stringify":72}],42:[function(require,module,exports){
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
},{"./assert":41,"./getFunctionName":49,"./isStruct":63,"./isType":64,"./stringify":72,"_process":26}],43:[function(require,module,exports){
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
},{"./assert":41,"./getTypeName":50,"./isNil":59,"./isType":64,"./isTypeName":65,"./mixin":70,"_process":26}],44:[function(require,module,exports){
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
},{"./assert":41,"./create":42,"./getTypeName":50,"./is":53,"./isFunction":56,"./isIdentity":57,"./isObject":61,"./isTypeName":65,"_process":26}],45:[function(require,module,exports){
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
},{"./assert":41,"./forbidNewOperator":47,"./isObject":61,"./isString":62,"./isTypeName":65,"_process":26}],46:[function(require,module,exports){
module.exports = function fail(message) {
  throw new TypeError('[tcomb] ' + message);
};
},{}],47:[function(require,module,exports){
var assert = require('./assert');
var getTypeName = require('./getTypeName');

module.exports = function forbidNewOperator(x, type) {
  assert(!(x instanceof type), function () { return 'Cannot use the new operator to instantiate the type ' + getTypeName(type); });
};
},{"./assert":41,"./getTypeName":50}],48:[function(require,module,exports){
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
},{"./Function":35,"./assert":41,"./create":42,"./getFunctionName":49,"./getTypeName":50,"./isArray":54,"./isBoolean":55,"./isNil":59,"./isObject":61,"./isTypeName":65,"./list":67,"./tuple":74,"_process":26}],49:[function(require,module,exports){
module.exports = function getFunctionName(f) {
  return f.displayName || f.name || '<function' + f.length + '>';
};
},{}],50:[function(require,module,exports){
var isType = require('./isType');
var getFunctionName = require('./getFunctionName');

module.exports = function getTypeName(constructor) {
  if (isType(constructor)) {
    return constructor.displayName;
  }
  return getFunctionName(constructor);
};
},{"./getFunctionName":49,"./isType":64}],51:[function(require,module,exports){
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
},{"./assert":41,"./getTypeName":50,"./is":53,"./isArray":54,"./isFunction":56,"./isIdentity":57,"./isTypeName":65,"_process":26}],52:[function(require,module,exports){
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
},{"./assert":41,"./forbidNewOperator":47,"./isFunction":56,"./isString":62,"_process":26}],53:[function(require,module,exports){
var isType = require('./isType');

// returns true if x is an instance of type
module.exports = function is(x, type) {
  if (isType(type)) {
    return type.is(x);
  }
  return x instanceof type; // type should be a class constructor
};

},{"./isType":64}],54:[function(require,module,exports){
module.exports = function isArray(x) {
  return x instanceof Array;
};
},{}],55:[function(require,module,exports){
module.exports = function isBoolean(x) {
  return x === true || x === false;
};
},{}],56:[function(require,module,exports){
module.exports = function isFunction(x) {
  return typeof x === 'function';
};
},{}],57:[function(require,module,exports){
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
},{"./Boolean":32,"./assert":41,"./getTypeName":50,"./isType":64,"_process":26}],58:[function(require,module,exports){
var isType = require('./isType');

module.exports = function isMaybe(x) {
  return isType(x) && ( x.meta.kind === 'maybe' );
};
},{"./isType":64}],59:[function(require,module,exports){
module.exports = function isNil(x) {
  return x === null || x === void 0;
};
},{}],60:[function(require,module,exports){
module.exports = function isNumber(x) {
  return typeof x === 'number' && isFinite(x) && !isNaN(x);
};
},{}],61:[function(require,module,exports){
var isNil = require('./isNil');
var isArray = require('./isArray');

module.exports = function isObject(x) {
  return !isNil(x) && typeof x === 'object' && !isArray(x);
};
},{"./isArray":54,"./isNil":59}],62:[function(require,module,exports){
module.exports = function isString(x) {
  return typeof x === 'string';
};
},{}],63:[function(require,module,exports){
var isType = require('./isType');

module.exports = function isStruct(x) {
  return isType(x) && ( x.meta.kind === 'struct' );
};
},{"./isType":64}],64:[function(require,module,exports){
var isFunction = require('./isFunction');
var isObject = require('./isObject');

module.exports = function isType(x) {
  return isFunction(x) && isObject(x.meta);
};
},{"./isFunction":56,"./isObject":61}],65:[function(require,module,exports){
var isNil = require('./isNil');
var isString = require('./isString');

module.exports = function isTypeName(name) {
  return isNil(name) || isString(name);
};
},{"./isNil":59,"./isString":62}],66:[function(require,module,exports){
var isType = require('./isType');

module.exports = function isUnion(x) {
  return isType(x) && ( x.meta.kind === 'union' );
};
},{"./isType":64}],67:[function(require,module,exports){
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
},{"./assert":41,"./create":42,"./getTypeName":50,"./is":53,"./isArray":54,"./isFunction":56,"./isIdentity":57,"./isTypeName":65,"_process":26}],68:[function(require,module,exports){
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
},{"./Any":30,"./assert":41,"./isFunction":56,"./isType":64,"_process":26}],69:[function(require,module,exports){
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
},{"./Any":30,"./Nil":36,"./assert":41,"./create":42,"./forbidNewOperator":47,"./getTypeName":50,"./is":53,"./isFunction":56,"./isIdentity":57,"./isMaybe":58,"./isTypeName":65,"_process":26}],70:[function(require,module,exports){
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
},{"./assert":41,"./isNil":59,"_process":26}],71:[function(require,module,exports){
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
},{"./assert":41,"./create":42,"./forbidNewOperator":47,"./getFunctionName":49,"./getTypeName":50,"./is":53,"./isFunction":56,"./isIdentity":57,"./isTypeName":65,"_process":26}],72:[function(require,module,exports){
module.exports = function stringify(x) {
  try { // handle "Converting circular structure to JSON" error
    return JSON.stringify(x, null, 2);
  }
  catch (e) {
    return String(x);
  }
};
},{}],73:[function(require,module,exports){
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
},{"./Function":35,"./String":40,"./assert":41,"./create":42,"./dict":44,"./getTypeName":50,"./isArray":54,"./isObject":61,"./isStruct":63,"./isTypeName":65,"./mixin":70,"_process":26}],74:[function(require,module,exports){
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
},{"./assert":41,"./create":42,"./getTypeName":50,"./is":53,"./isArray":54,"./isFunction":56,"./isIdentity":57,"./isTypeName":65,"_process":26}],75:[function(require,module,exports){
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
},{"./assert":41,"./create":42,"./forbidNewOperator":47,"./getTypeName":50,"./is":53,"./isArray":54,"./isFunction":56,"./isIdentity":57,"./isNil":59,"./isType":64,"./isTypeName":65,"./isUnion":66,"_process":26}],76:[function(require,module,exports){
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
},{"./assert":41,"./isArray":54,"./isFunction":56,"./isNumber":60,"./isObject":61,"./mixin":70,"_process":26}],77:[function(require,module,exports){
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

},{}],78:[function(require,module,exports){
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

},{}]},{},[1]);
