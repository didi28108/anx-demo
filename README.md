# anx-demo
Website of NYUST ANX department

## Stack
- Node.js + Express
- Mongodb (Mongoose as ODM)
- Angular 1.x
- Bootstrap 3
- Webpack

## App Structure

```
root/
├─ node_modules/
├─ bower_components/
├─ config/                // server configs
├─ api/                   // db accessing apis
├─ routes/                // server routes
├─ public/
│   ├─ controllers/
│   ├─ css/
│   ├─ directives/
│   ├─ fonts/
│   ├─ image/
│   ├─ js/
│   ├─ modules/
│   ├─ services/
│   ├─ views/             // html templates
│   ├─ index.js           // webpack entry file
│   └─ index.html
│
├─ app.js                 // node app
├─ bower.json
├─ package.json
└─ webpack.comfig.js
```

## NOTES
There is some importing issues with webpack. As we import ng-ckeditor(using bower) and angular-xeditable(using npm) as modules for dependency injection. Webpack got them as "object" instead of "module". This issue leads to angular app instantiate failure(failed to setup app) because those modules can not be properly inject.

A Hacky way to solve this prob: 
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