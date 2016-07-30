(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
lib._ = {};

var lesson = require('lib/lesson/unordered_array_lesson');
//var l = lesson({UI: UI});

lib._.lesson = lesson;

var lesson_UI = require('lib/UI/lesson_UI');
//var lu = lesson_UI({stage:lib._._stage});

lib._.UI = lesson_UI;
},{"lib/UI/lesson_UI":3,"lib/lesson/unordered_array_lesson":4}],2:[function(require,module,exports){
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
module.exports = lesson_UI;

var check = require('check-types');

function lesson_UI(options) {
	if (!(this instanceof lesson_UI)) return new lesson_UI(options);
	
	//if we don't have a stage, createjs or lib object, can't continue, error
	if (!(check.object(options) && check.object(options.stage))) {
		throw new TypeError("Argument 'stage' (object) is required, argument should be object.");
	}
	
	if (!(check.object(options) && check.object(options.lib))) {
		throw new TypeError("Argument 'lib' (object) is required, argument should be object.");
	}
	
	if (!(check.object(options) && check.object(options.createjs))) {
		throw new TypeError("Argument 'createjs' (object) is required, argument should be object.");
	}
	
	//TODO: singleton
	
	this._state = this._INIT;
	
	this._stage = options.stage;
	this._createjs = options.createjs;
	this._lib = options.lib;
	
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
		
		for (var i = 0; i < size; i++) {
			var arrayElement = new this._lib.ArrayElement(); 
			
			arrayElement.x = offsetX;
			//BUG:
			//for some reason the width as returned by getBounds() is about half of the ArrayElement length as shown on the canvas
			//	using 50px as workaround
			//offsetX += arrayElement.getBounds().width;
			offsetX += 50;
			
			//setting associated index (displays below ArrayElement figure, configured by AA)
			arrayElement.index_txt.text = String(i);
			
			container.addChild(arrayElement);
		}
		
		return container;
	},
	
	//public
	//proceed through the states of the lesson
	next : function() {
		if (this._state === this._INIT) return;	//do nothing if in the INIT state
		
		//handling for title screen, before the lesson UI is displayed
		if (this._state === this._PRE_LESSON) {			
			//set the state into lesson to allow the transition to the lesson logic
			this._state = this._LESSON;
			
			//TODO: add code here to delete title screen object from the stage and the reference here, to free memory
			this._title_screen.gotoAndPlay("close");
			
			this.next();
			
			return;
		}
		
		//handling for lesson screen, after pre-lesson has ended
		if (this._state === this._LESSON) {
			this._array_screen.gotoAndPlay("open");	//do the opening animation for the array screen
			
			//add the generated array to the screen
			this._array_screen.addChild(this._array);
			this._stage.addChild(this._array_screen);
			
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
	
	//state tracking variables
	_state : undefined,
	_INIT : 0,
	_PRE_LESSON : 1,
	_LESSON : 2,
};
},{"check-types":2}],4:[function(require,module,exports){
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
},{"check-types":2}]},{},[1]);
