
Vue my dropdown component
=========================

Handle dropdown menu easily with this Vuejs component.

Requisites
----------
* Vue >= 1.0
* jQuery >= 2.0

Install
-------
You can add my-dropdown.min.js file, directly in the html code of your project. After you add the mixin in your Vue instance.

```javascript
new Vue({
	el: 'body',
	mixins: [window.myDropdown.mixin]
});
```
Or you can install the library using npm

```
$ npm insall vue-my-dropdown
```

```javascript
var myDropdown = require('vue-my-dropdown');

new Vue({
	el: 'body',
	mixins: [myDropdown.mixin]
});
```


Guide & examples
----------------
[Official documentation](https://davidnotplay.github.io/vue-my-dropdown/)

LICENSE
-------
The license is MIT. See `LICENSE` file to more info.

