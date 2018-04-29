# Nebulas JavaScript API

[![NPM](https://nodei.co/npm/nebulas.png)](https://nodei.co/npm/nebulas/)

This is the Nebulas compatible JavaScript API. Users can use it in browser and node.js. This javascript library also support API for our Repl console. Users can sign/send transactions and deploy/call smart contract with it. [neb.js](https://github.com/nebulasio/neb.js)


## Install && Package

Use the `npm` installation dependencies

```
npm install
```

Use `gulp` to package the neb.js:

```
gulp
```

Now we can check the newly created files in `/dist`

Here you should see a bunch of js files. 

 * `neb.js`:Used in browser side. Including outside dependency.
 * `neb-light.js`:Used in Repl console. Not including outside dependency.
 * `nebulas.js`: Fully functional in the browser. Users can create an address, sign a transaction, and deploy/call a smart contract.

## Documentation


<a target="_blank" href="https://nebulasio.github.io/neb.js/index.html">Public API documentation link</a>

For build API documentation run `gulp documentation` task.

Generated documentation you can check in `/documentation` folder.

## Usage
`neb.js` is a useful library for nebulas developers. It provides rich underlying support in web and node.js's dapp. It implements the following functions.

* The RPC interface for the nebulas node is encapsulated;
* Create and manage the private key and address of the nebulas;
* Generate the transaction object and sign the transaction.

The use of neb.js can be used as examples:

* [web-example](example/example.html) 
* [nodejs-example](example/node-example.js)

## Extra 
Rollup is a module bundler for JavaScript which compiles small pieces of code into something larger and more complex, such as a library or application.

Next step go to the neb.js folder in your Nebulas dir and
Build neb-node.js by using [rollup](https://rollupjs.org/):

```
rollup -c
```


