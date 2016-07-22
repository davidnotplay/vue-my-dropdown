<template>
	<div class="my-dropdown" v-bind:class="{'my-fixed': fixed}" v-show="visible" :id="id" :transition="animation">
		<slot></slot>
	</div>
</template>

<script>
"use strict";

/* globals require */

import $ from 'jquery';

function setPosition(position, elSize, refPos, refSize) {
	var dropdownCss = {}, originLeft, originTop, cornerPos = {};
	var [pos1, pos2, pos3, pos4] = position;

	if(pos1 == 'left')
		cornerPos.left = refPos.left;

	else if(pos1 == 'center')
		cornerPos.left = refPos.left + refSize.width/2;
	else
		cornerPos.left = refPos.left + refSize.width;

	if(pos2 == 'top')
		cornerPos.top = refPos.top;
	else if(pos2 == 'center')
		cornerPos.top = refPos.top + refSize.height/2;
	else
		cornerPos.top = refPos.top + refSize.height;


	if(pos3 == 'left'){
		dropdownCss.left = Math.round(cornerPos.left) + 'px';
		originLeft = 'left';
	}
	else if(pos3 == 'center'){
		 dropdownCss.left = Math.round(cornerPos.left - elSize.width/2) + 'px';
		 originLeft = 'center';
	}
	else{
		dropdownCss.left = Math.round(cornerPos.left - elSize.width) + 'px';
		originLeft = 'right';
	}


	if(pos4 == 'top'){
		dropdownCss.top = Math.round(cornerPos.top) + 'px';
		originTop = 'top';
	}
	else if(pos4 == 'center'){
		dropdownCss.top = Math.round(cornerPos.top - elSize.height/2) + 'px';
		originTop = 'center';
	}
	else{
		dropdownCss.top = Math.round(cornerPos.top - elSize.height) + 'px';
		originTop = 'bottom';
	}

	dropdownCss['transform-origin'] = originLeft + ' ' + originTop;
	return dropdownCss;
}

export default {
	props: {
		visible:{
			type: Boolean,
			required: false,
			twoWay: false,
			default: false,
		},

		position: {
			type: Array,
			required: false,
			twoWay: false,
			default: () => {return ['right', 'top', 'left', 'top'];}
		},

		clickOut: {
			type: Boolean,
			required: false,
			twoWay: false,
			default: false
		},

		id:{
			type: String,
			required: true,
			twoWay: false,
		},

		refId:{
			type: String,
			required: true,
			twoWay: false,
		},

		animation:{
			type: String,
			required: false,
			twoWay: false,
			default: 'my-ani-scale'
		},

		fixed:{
			type: Boolean,
			required: false,
			twoWay: false,
			default: false
		}
	},

	methods: {
		show: function(){
			var refElem = $('#' + this.refId),
			el = $(this.$el);

			// Error ref element doesn't exists.
			if(!refElem.length)
				throw new Error(
					'ref-id="' + this.refId + '" in dropdown id="'+ this.id +'" not found'
				);

			var refPos = refElem.offset();
			var parent = el.offsetParent();

			if(this.fixed){
				// fixed position.
				let doc = $(document);
				refPos.top = Math.round(refPos.top - doc.scrollTop());
				refPos.left = Math.round(refPos.left - doc.scrollLeft());
			} else if(parent.prop('tagName') != 'HTML'){
				let pos = parent.offset();
				refPos.top  = Math.round(refPos.top - pos.top);
				refPos.left  = Math.round(refPos.left - pos.left);
			} else{
				refPos.top = Math.round(refPos.top);
				refPos.left = Math.round(refPos.left);
			}
			
			var refSize = {
				height: Math.round(refElem.outerHeight()),
				width: Math.round(refElem.outerWidth())
			};
			var elSize = {
				height: Math.round(el.outerHeight()),
				width: Math.round(el.outerWidth())
			};

			el.css(setPosition(this.position, elSize, refPos, refSize));

			if(this.clickOut)
				setTimeout(
					() => $(window).on('click.click-out-' + this.id, (evt) => {
						if (!el.is(evt.target) && el.has(evt.target).length === 0)
							this.$dispatch('dropdown::hide', this.id);
					}),
					0
				);
		},

		hide: function(){
			$(window).off('click.click-out-' + this.id);
		},
	},

	watch: {
		visible: function(v, oldv){
			if (v == oldv)
				return;

			if(v)
				this.show();
			else
				this.hide();

			this.$dispatch('dropdown::setVisibility', this.id, v);
		}
	},

	events: {
		'dropdown::show': function(id){
			if(id === this.id)
				this.visible = true;
			this.$broadcast('dropdown::show', id);
		},

		'dropdown::hide': function(id){
			if(id === this.id)
				this.visible = false;
			this.$broadcast('dropdown::hide', id);
		}	
	}
};

</script>

<style lang="sass">
.my-dropdown{
	display: inline-block;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 201;
}

.my-fixed{
	position: fixed !important;
}

// Animations.
.my-ani-fade-transition{
	transition: opacity .2s linear;


	&.my-ani-fade-enter, &.my-ani-fade-leave{
		opacity: 0;
	}
}

.my-ani-scale-transition{
	transition: transform .2s linear, opacity .2s linear;

	&.my-ani-scale-enter, &.my-ani-scale-leave{
		transform: scale(0, 0);
		opacity: 0;
	}
}

.my-ani-scaley-transition{
	transition: transform .2s linear, opacity .2s linear;

	&.my-ani-scaley-enter, &.my-ani-scaley-leave{
		transform: scaleY(0);
		opacity: 0;
	}
}

.my-ani-scalex-transition{
	transition: transform .2s linear, opacity .2s linear;

	&.my-ani-scalex-enter, &.my-ani-scalex-leave{
		transform: scaleX(0);
		opacity: 0;
	}
}

.my-no-ani-transition{

}

</style>

