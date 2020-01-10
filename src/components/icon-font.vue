<template>
  <svg class="icon"
       aria-hidden="true"
       :style="iconStyles">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>

export default {
  name  : 'SvgIcon',
  props : {
    type : {
      type : String,
    },
    size : {
      type    : [Number, String],
      default : 24, // default 24px small 16px mini: 14 可以传数字
    },
  },
  computed : {
    iconName() {
      return `#${ this.type }`;
    },
    iconStyles() {
      const isNumber = typeof Number(this.size) === 'number';

      if (!isNumber) return {};

      return {
        width    : `${ this.size }px`,
        height   : `${ this.size }px`,
        fontSize : `${ this.size }px`,
      };
    },
  },
};
</script>

<style>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
