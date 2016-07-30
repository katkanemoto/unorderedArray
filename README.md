# unorderedArray
The Animate project for an Unordered Array

`npm install` will install the dependencies of the lesson (tape, browserify, etc; see `package.json`).

`npm test` will create a `test_bundle.js` in `node_modules/lib/test`, open `node_modules/lib/test/test.html` to run tests.

`npm start` will create a `bundle.js` in the root directory, `unorderedArray.html` has been altered to require the code; This code includes logic `node_modules/lib/wrapper.js` which populates the `lib._` namespace with classes used during the program.

###Workflow - Including lesson code with Adobe Animate code

1.	turn OFF overwriting HTML in Adobe Animate
  
  this will prevent our custom changes from being overwritten when we change the Animate code
			
			File -> Publish Settings -> {Uncheck} Overwrite HTML file on publish
			
2. `unorderedArray.html` expects browserified code in `bundle.js` (see step 4)

              <script src="bundle.js"></script>

3. create a lesson

  store the lesson in: `node_modules/lib/lesson`

  store the test for the lesson in: `node_modules/lib/test/lesson`

  add a line to `node_modules/lib/test/index.js` to `require()` the test to run on `npm test`

  add any `require()` code to `node_modules/lib/wrapper.js` and populate methods / properties into the `lib._` namespace

4. browserify the code in step 3
  
  `npm start`, to build the `bundle.js` (in the root directory) that `unorderedArray.html` expects; `npm start` browserifies code in `wrapper.js`, so any code that is `require()` into `wrapper.js` is included into `bundle.js`. Due to weird scoping that takes place `unorderedArray.html` code, all user defined code should be defined in the `lib._` namespace to ensure it is properly scoped during execution.
  
###Adobe Animate UI code

Has been removed from Adobe Animate proper and is included in the `node_modules/lib/UI/lesson_UI.js`, which is included in `wrapper.js` (as per the above workflow) and is instantiated in `unorderedArray.html -> handleComplete()` to allow it to load after all of the assets from Adobe Animate have been loaded.

**Discussion:** Adobe Animate uses some odd event based method of loading its assets. Given they might be binary files, this makes sense up to a point; Since they need to be downloaded from a potentially remote location. But it does not expose methods or objects to add custom code on such events (in any obvious way); As such any user defined code may be executed *out of order* with the assets being loaded (which includes Adobe Animate generated javascript files). Given that any user defined code is scoped to a closure and any primitvies (e.g. the stage used to manipulate the canvas) used during animation are also scoped into the odd event based method they have included as part of their "publishing" process, it becomes very difficult if not impossible to create JS code that manipulate their animations or their states.

Thus all animation code had been removed to allow modern tools (e.g. browserify) to be used on the animation code as well as to expose the code to testing (which is nearly impossible when embeded inside the closures as generated from Adobe Animate).
