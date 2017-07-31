<template>
  <span>
    <span><slot></slot></span>
    <transition :name="animation">
      <div :style="ddStyle" class="my-dropdown-dd" v-show="visible">
          <slot name="dropdown"></slot>
      </div>
    </transition>
  </span>
</template>

<script>

/**
 * Get the dimensions of `$ele` ele.
 * @param {HTMLElement} $ele
 * @return {object} Object with `width` and `height` properties.
 */
function getSize($ele) {
  let $clone = $ele.cloneNode(true)
  let size = {}

  $clone.style.display = 'block'
  $clone.style.visibility = 'hidden'
  $clone.style.position = 'absolute'
  $ele.parentNode.insertBefore($clone, $ele)
  size.width = $clone.offsetWidth
  size.height = $clone.offsetHeight
  $clone.remove()

  return size
}

/**
 * Set dropdown position.
 * @param {HTMLElement} $link - Html element will show the dropdown when it is pressed.
 * @param {HTMLElement} $dd - Dropdown html element.
 * @param {array} position - Dropdown position.
 */
function setPosition($link, $dd, position, margin) {
  let refSize = getSize($link)
  let cornerPos = {}
  let outStyle = {}
  let origin = {}
  let [ p1, p2, p3, p4 ] = position
  let rect = $link.getBoundingClientRect()
  let refPos = { top: 0, left: 0 }
  let dpSize = getSize($dd)
  let parentPosition = document.defaultView.getComputedStyle($link.offsetParent).position

  switch (parentPosition.toLowerCase()) {
    case 'fixed':
      refPos.left = rect.left - $link.offsetParent.offsetLeft
      refPos.top = rect.top - $link.offsetParent.offsetTop
      break

    case 'absolute':
      let parentRect = $link.offsetParent.getBoundingClientRect()
      refPos.left = rect.left - parentRect.left
      refPos.top = rect.top - parentRect.top
      break

    default:
      refPos.left = rect.left - $link.offsetParent.offsetLeft + window.pageXOffset
      refPos.top = rect.top - $link.offsetParent.offsetTop + window.pageYOffset
  }

  cornerPos.left = refPos.left
  switch (p1) {
    case 'center':
      cornerPos.left += refSize.width / 2
      break

    case 'right':
      cornerPos.left += refSize.width
      break
  }

  cornerPos.top = refPos.top
  switch (p2) {
    case 'center':
      cornerPos.top += refSize.height / 2
      break
    case 'bottom':
      cornerPos.top += refSize.height
      break
  }

  switch (p3) {
    case 'left':
      outStyle.left = Math.round(cornerPos.left)
      origin.left = 'left'
      break

    case 'center':
      outStyle.left = Math.round(cornerPos.left - dpSize.width / 2)
      origin.left = 'center'
      break

    default:
      outStyle.left = Math.round(cornerPos.left - dpSize.width)
      origin.left = 'right'
  }

  switch (p4) {
    case 'top':
      outStyle.top = Math.round(cornerPos.top)
      origin.top = 'top'
      break

    case 'center':
      outStyle.top = Math.round(cornerPos.top - dpSize.height / 2)
      origin.top = 'center'
      break

    default:
      outStyle.top = Math.round(cornerPos.top - dpSize.height)
      origin.top = 'bottom'
  }

  outStyle.left = (outStyle.left + margin[0]) + 'px'
  outStyle.top = (outStyle.top + margin[1]) + 'px'
  outStyle.transformOrigin = origin.left + ' ' + origin.top
  outStyle.position = 'absolute'
  return outStyle
}

export default {
  name: 'VueMyDropdown',

  data() {
    return {
      ddStyle: {}
    }
  },

  props: {
    // Dropdown visibility.
    visible: {
      required: true,
      type: Boolean
    },

    // Dropdown position.
    position: {
      required: false,
      type: Array,
      default: () => ['right', 'top', 'left', 'top']
    },

    // Dropdown animation.
    animation: {
      required: false,
      type: String,
      default: 'ani-slide'
    }
  },

  methods: {
    open() {
      this.setPosition()
      window.addEventListener('resize', this.resizeEvent)
      setTimeout(() => window.addEventListener('click', this.clickOutEvent), 10)
    },

    close() {
      window.removeEventListener('resize', this.resizeEvent)
      window.removeEventListener('click', this.clickOutEvent)
    },

    resizeEvent() {
      this.setPosition()
    },

    clickOutEvent(evt) {
      var $dd = this.$el.children[1]
      if (evt.target !== $dd && !$dd.contains(evt.target)) {
        this.$emit('clickout', evt)
      }
    },

    setPosition() {
      var $link = this.$el.children[0]
      var $dd = this.$el.children[1]
      this.ddStyle = setPosition($link, $dd, this.position, [0, 0])
    }
  },

  watch: {
    visible(isVisible) {
      if (isVisible) {
        this.open()
      } else {
        this.close()
      }
    }
  },

  mounted() {
    if (this.visible) {
      this.open()
    }
  }
}
</script>

<style>

.my-dropdown-dd {
  position: absolute !important;
  box-sizing: border-box !important;
}

.ani-none-leave-active, .ani-none-leave, .ani-none-enter-active, .ani-none-enter{
  transition: none;
}

.ani-slide-leave-active {
  transition: transform .3s ease, opacity .3s ease;
  transform: scale(0, 0);
  opacity: 0;
}

.ani-slide-leave {
  transform: scale(1, 1);
  opacity: 1;
}

.ani-slide-enter-active {
  transition: transform .3s ease, opacity .3s ease;
  transform: scale(1, 1);
  opacity: 1;
}

.ani-slide-enter {
  transform: scale(0, 0);
  opacity: 0;
}


.ani-slide-x-leave-active {
  transition: transform .3s ease, opacity .3s ease;
  transform: scaleX(0);
  opacity: 0;
}


.ani-slide-x-leave {
  transform: scaleX(1);
  opacity: 1;
}


.ani-slide-x-enter-active {
  transition: transform .3s ease, opacity .3s ease;
  transform: scaleX(1);
  opacity: 1;
}


.ani-slide-x-enter {
  transform: scaleX(0);
  opacity: 0;
}


.ani-slide-y-leave-active {
  transition: transform .3s ease, opacity .3s ease;
  transform: scaleY(0);
  opacity: 0;
}


.ani-slide-y-leave {
  transform: scaleY(1);
  opacity: 1;
}


.ani-slide-y-enter-active {
  transition: transform .3s ease, opacity .3s ease;
  transform: scaleY(1);
  opacity: 1;
}


.ani-slide-y-enter {
  transform: scaleY(0);
  opacity: 0;
}


.ani-fade-leave-active {
  transition: transform .3s ease, opacity .3s ease;
  opacity: 0;
}


.ani-fade-leave {
  opacity: 1;
}


.ani-fade-enter-active {
  transition: transform .3s ease, opacity .3s ease;
  opacity: 1
}


.ani-fade-enter {
  opacity: 0
}
</style>
