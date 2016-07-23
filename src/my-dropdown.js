/**
	Dropdown dialog component to Vue
	Author: David Casado Martínez <dcasadomartinez@gmail.com>
	Version: 1.0.0
	license: MIT.
	Github: https://github.com/davidnotplay/vue-my-dropdown
*/

"use strict";
import myDropdownMixin from "./my-dropdown.mixin.js";
import myDropdownComponent from "./my-dropdown.vue";


// Change version in package.json
var version = '1.0.1';

export {
	myDropdownMixin as mixin,
	myDropdownComponent as component,
	version
};
export default myDropdownMixin;

if (typeof window !== 'undefined') {
    window.myDropdown = {
    	'mixin': myDropdownMixin,
    	'component': myDropdownComponent,
    	'version': version
    };
}


