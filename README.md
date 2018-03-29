# Nebulas JavaScript API

[![NPM](https://nodei.co/npm/nebulas.png)](https://nodei.co/npm/nebulas/)

This readme will get you started with using the `neb.js` file.
This file can be found in [neb.js](https://github.com/nebulasio/neb.js).

This is the Nebulas compatible JavaScript API. Users can use it in brower and node.js. This javascript library also support API for our Repl console. Users can sign/send transactions and deploy/call smart contract with it. 


## Browser

use `gulp` to package the neb.js:

```
gulp
```

Now we can check the newly created files in `/dist`

Here you should see a bunch of js files. 

## Documentation
For build API documentation run `gulp documentation` task.

Generated documentation you can check in `/documentation` folder.

## Extra 
Rollup is a module bundler for JavaScript which compiles small pieces of code into something larger and more complex, such as a library or application.

Next step go to the neb.js folder in your Nebulas dir and
Build neb-node.js by using [rollup](https://rollupjs.org/):

```
rollup -c
```

## Library

 * `neb.js`:Used in brower side. Including outside dependency.
 * `neb-light.js`:Used in Repl console. Not including outside dependency.
 * `nebulas.js`: Fully functional in the browser. Users can create an address, sign a transaction, and deploy/call a smart contract.
