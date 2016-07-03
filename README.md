# anx-demo

## setup
install node modules `npm install`

bundle our app with webpack `npm run build`

start the server `node app.js`

## NOTICE
There is some importing issues with webpack. As we import ng-ckeditor(using bower) and angular-xeditable(using npm) as modules for dependency injection. Webpack got them as "object" instead of "module". This issue leads to angular app instantiate failure(failed to setup app) because those modules can not be properly inject.

Hacky way to solve this prob: 
Add a index.js file to the root of each modules(node_modules/angular-xeditable, bower_components/ng-ckeditor). In the index.js file, simply import the main file of the module(angular-xeditable/dist/js/xeditable, ng-ckeditor/ng-ckeditor). Then simply write module.exports to export them. And make sure to modify package.json of the modules. Change the value of "main" property to "index.js", which means to let the module loader look for index.js file we've created.

The index.js file will look like this:

- node_modules/angular-xeditable/index.js:
```
require('./dist/js/xeditable');
module.exports = 'xeditable';
```
- bower_components/ng-ckeditor/index.js:
```
require('./ng-ckeditor.js');
module.exports = 'ngCkeditor';
```

Make sure to follow the steps above each time you update bower_components or install modules from none using npm.