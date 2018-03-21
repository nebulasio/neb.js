# Nebulas JavaScript API

This readme will get you started with using the `neb.js` file.
This file can be found in [neb.js](https://github.com/nebulasio/neb.js).

This is the Nebulas compatible JavaScript API. Users can use it in brower and node.js.This javascript library also support API for our Repl console. 


## Step 1: We need to use NPM to install the dependencies before using neb.js:

Download Node.js:

Note: npm is a Node.js package manager. So this means you need to install Node.js in order to use `npm install` [Node.js](https://nodejs.org/en/)

Once you have Node.js installed we can go to the neb.js folder.

Example 1: in the terminal

```
cd neb.js
npm install
```


## Step 2: We need to use the `gulp` command

Package neb.js:

Note: In order to use the `gulp` command we need to install [gulp](https://gulpjs.com/):

Example 2 in the terminal:

```
gulp
```

Now we can check the newly created files in `/dist`

Here you should see a bunch of js files. 


## Extra 
Rollup is a module bundler for JavaScript which compiles small pieces of code into something larger and more complex, such as a library or application.

Next step go to the neb.js folder in your Nebulas dir and
Build neb-node.js by using [rollup](https://rollupjs.org/):

```
rollup -c
```

## Library

 * `neb.js`:Used in brower side. Including outside dependency.
 * `neb-node.js`: Used in node.js. Including outside dependency.
