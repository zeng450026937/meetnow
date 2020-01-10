<template>
  <div
    class="loading-wrap"
    v-if="loading"
  >
    <svg
      class="loading"
      width="44px"
      height="44px"
      viewBox="0 0 44 44"
    >
      <circle
        class="path"
        fill="none"
        stroke-width="4"
        stroke-linecap="round"
        cx="22"
        cy="22"
        r="20"
      ></circle>
    </svg>
  </div>
</template>

<script>
export default {
  name : '',

  components : {

  },

  props : {
    loading : {
      type    : Boolean,
      default : false,
    },
  },

  data() {
    return {

    };
  },

  computed : {

  },

  created() {

  },

  mounted() {

  },

  methods : {

  },

  watch : {

  },
};
</script>

<style lang="scss" scoped>
.loading-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  background-color: rgba($color: #fff, $alpha: 0.8);
  z-index: 99;

  .loading {
    animation: rotator 1.4s linear infinite;
  }
}
@keyframes rotator {
  0% {
    transform: scale(0.5) rotate(0deg);
  }
  100% {
    transform: scale(0.5) rotate(270deg);
  }
}
.loading .path {
  stroke: #009dd7;
  stroke-dasharray: 126;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: dash 1.4s ease-in-out infinite;
}
@keyframes dash {
  0% {
    stroke-dashoffset: 126;
  }
  50% {
    stroke-dashoffset: 63;
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: 126;
    transform: rotate(450deg);
  }
}
</style>
