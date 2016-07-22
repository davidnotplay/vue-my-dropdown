"use strict";
import Vue from 'vue';
import myDropdownComponent from "./my-dropdown.vue";

export default Vue.extend({
	data: () => {
		return {
			visibility: {}
		};
	},
	components: {
		'my-dropdown': myDropdownComponent,
	},

	methods: {
		showDropdown: function(id){
			this.$broadcast('dropdown::show', id);
		},
		hideDropdown: function(id){
			this.$broadcast('dropdown::hide', id);
		},
		isVisibleDropdown: function(id){
			return this.visibility[id] || false;
		},
		toggleDropdown: function(id){
			if(this.isVisibleDropdown(id))
				this.hideDropdown(id);
			else
				this.showDropdown(id);
		}
	},

	events: {
		'dropdown::setVisibility': function(id, v){
			Vue.set(this.visibility, id, v);
		}
	}, 
});