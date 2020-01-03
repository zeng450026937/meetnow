<template>
  <div id="app">
    <!-- <div class="left">
      <main-form
        ref="form"
        @join="joinConf"
      ></main-form>
    </div>
    <div class="right">
      <conference
        :conf="conf"
        ref="conf"
        @exit="exitConf"
      ></conference>
    </div> -->
  </div>
</template>

<script lang="js">
import Vue from 'vue';
import meetnow from '@meetnow/meetnow/src/index';
// import MainForm from '@/components/main-form.vue';
// import Conference from '@/components/conference.vue';

console.log(meetnow);

export default Vue.extend({
  name : 'app',

  components : {
    // MainForm,
    // Conference,
  },

  data() {
    return {
      conf : {},
    };
  },

  async created() {
    meetnow.setup();

    const ua = meetnow.createUA();

    this.ua = ua;
    const conf = await ua.connect({ number: '666666.66666' });
    conf.join();
    setTimeout(() => {
      conf.leave();
    }, 11000);

    window.conf = conf;

    setTimeout(() => {
      conf.share();
      conf.mediaChannel && conf.mediaChannel.connect();
      setTimeout(() => {
        // conf.shareChannel && conf.shareChannel.connect();
      }, 5000);
    }, 5000);
  },

  methods : {
    // async joinConf({ number, password }: { number: number; password: number }) {
    //   const conf = await this.ua.connect({ number, password });
    //   conf.join();
    //   conf.leave();

    //   this.conf = conf;
    // },

    // async exitConf() {
    //   const { conf }: { conf: any } = this;
    //   conf.leave();
    // },
  },
});
</script>

<style>
#app {
  display: flex;

  justify-content: space-between;
}
.left {
  width: 50%;
}
.right {
  display: flex;

  justify-content: flex-start;

  width: 50%;
}
</style>
