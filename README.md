# Nebulas JavaScript API

[![](https://data.jsdelivr.com/v1/package/npm/nebulas/badge)](https://www.jsdelivr.com/package/npm/nebulas)

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

###### CDN Support
neb.js has been released to [NPM](https://www.npmjs.com/package/nebulas), and developers can use the following code through [CDN](https://www.jsdelivr.com/package/npm/nebulas) addition.

```html
<script src="https://cdn.jsdelivr.net/npm/nebulas@0.5.2/dist/nebulas.js"></script>
```

## Documentation


<a target="_blank" href="https://nebulasio.github.io/neb.js/index.html">Public API documentation link</a>

For build API documentation run `gulp documentation` task.

Generated documentation you can check in `/documentation` folder.

## Usage
`neb.js` is a useful library for nebulas developers. It provides rich underlying support in web and node.js's dapp. It implements the following functions.

* The RPC interface for the nebulas node is encapsulated;
* Create and manage the private key and address of the nebulas;
* Generate the transaction object and sign the transaction.
* Deploy/call smart contract, breakpoint debugging support.

The use of neb.js can be used as examples:

* [web-example](example/example.html) 
* [nodejs-example](example/node-example.js)
* [node-nvm](example/node-nvm.js)

## Contribution

We are very glad that you are considering to help Nebulas Team or go-nebulas project, including but not limited to source code, documents or others.

If you'd like to contribute, please fork, fix, commit and send a pull request for the maintainers to review and merge into the main code base. If you wish to submit more complex changes though, please check up with the core devs first on our [slack channel](http://nebulasio.herokuapp.com) to ensure those changes are in line with the general philosophy of the project and/or get some early feedback which can make both your efforts much lighter as well as our review and merge procedures quick and simple.

Please refer to our [contribution guideline](https://github.com/nebulasio/wiki/blob/master/contribute.md) for more information.

Thanks.

## License

The go-nebulas project is licensed under the [GNU Lesser General Public License Version 3.0 (“LGPL v3”)](https://www.gnu.org/licenses/lgpl-3.0.en.html).

For the more information about licensing, please refer to [Licensing](https://github.com/nebulasio/wiki/blob/master/licensing.md) page.

