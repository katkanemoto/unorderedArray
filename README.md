# unorderedArray
The Animate project for an Unordered Array

`npm install` will install the dependencies of the lesson (tape, browserify, etc; see `package.json`).
`npm test` will create a `test_bundle.js` in `node_modules/lib/test`, open `node_modules/lib/test/test.html` to run lesson tests.
`npm start` will create a `bundle.js` in the root directory, `unorderedArray.html` has been altered to require the code; This code includes the lesson logic as instantiated and called by `node_modules/lib/wrapper.js`.

###Workflow - Including lesson code with Adobe Animate code

1.	turn OFF overwriting HTML in Adobe Animate
  
  this will prevent our custom changes from being overwritten when we change the Animate code
			
			File -> Publish Settings -> {Uncheck} Overwrite HTML file on publish
			
2. define an API for the browserify code to use as an addition to the createjs code
  
  positioned directly after the auto-generated Adobe Animate code
			
			e.g. var UI = {};

3. Added a new \<script\> tag to include the browserify'd code

              <script src="bundle.js"></script>

4. create a lesson

  store the lesson in: `node_modules/lib/lesson`

  store the test for the lesson in: `node_modules/lib/test`

  add a line to `node_modules/lib/test/index.js` to `require()` the test to run on `npm test`

  add any instantiation code to `node_modules/lib/wrapper.js`

5. browserify the code in step 4
  
  `npm start`, to build the `bundle.js` (in the root directory) that `unorderedArray.html` expects
  
###Adobe Animate pecularity exposing user defined methods

When coding Adobe Animate any user defined methods / variables / etc are wrapped in a closure and **NOT** exposed to the global environment; This makes it impossible to call user defined code directly.

As a workaround, if you are defining a method / property that needs to be exposed to the lesson code, then create the `_` namespace on the lib variable:

     lib._ = {};

Then include anything needing to be exposed there. It is preferred to expose **ALL** such user defined code in this way so that user defined methods / properties can be tested; As Animate does not include a ready way to test user defined code.
			
			
