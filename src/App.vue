<template>
  <div id="app">
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { createUA } from '../packages/meetnow/src/user-agent';

export default Vue.extend({
  name : 'app',

  created() {
    const ua = createUA();
    ua.setup().connect({ number: '123456.11111', password: '123456' });
  },
});
</script>

<style>

</style>
