<template>
  <div class="main-form">
    <div class="form__view">
      <div class="form__item">
        <input
          v-model="number"
          type="text"
          placeholder="会议号码"
        >
      </div>
      <div class="form__item">
        <input
          v-model="password"
          type="text"
          placeholder="会议密码"
        >
      </div>
      <div class="form__item">
        <input
          v-model="displayName"
          type="text"
          placeholder="昵称"
        >
      </div>
      <div class="form__button">
        <button @click="joinConf">加入会议</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name : 'MainForm',

  props : {

  },

  data() {
    return {
      number      : '220461.10001',
      password    : '',
      displayName : 'test',
    };
  },

  computed : {

  },

  created() {

  },

  methods : {
    joinConf() {
      const {
        number,
        password,
        displayName,
      } = this;

      this.$emit('joinConf', {
        number,
        password,
        displayName,
      });
    },
  },

  watch : {

  },
};
</script>

<style lang="scss" scoped>
.main-form {
  position: relative;
  display: flex;

  align-items: center;
  justify-content: flex-end;

  width: 100%;
  height: 100%;
}

.form__view {
  width: 360px;

  padding: 20px;

  margin: 60px;

  border-radius: 8px;

  background-color: rgba($color: #000000, $alpha: 0.25);

  .form__item:nth-of-type(1) {
    margin-top: 30px;
  }

  .form__item {
    width: 100%;
    padding-bottom: 20px;
    box-sizing: border-box;

    input {
      width: 100%;
      height: 36px;
      border: none;
      border-bottom: 1px solid #fff;
      padding: 0 12px;
      box-sizing: border-box;
      background-color: transparent;
      font-size: 14px;
      color: #fff;

      &:focus {
        outline: none;
      }

      &::placeholder {
        color: #fff;
      }
    }
  }
}
.form__divide {
  margin: 10px;
  color: #fff;
}

.form__button {
  width: 100%;

  margin-top: 20px;
  margin-bottom: 30px;

  button {
    width: 100%;
    height: 36px;
    border: none;
    border-radius: 36px;
    background-color: #10c29b;
    color: #fff;

    &:hover {
      cursor: pointer;
    }

    &:focus {
      outline: none;
    }
  }
}
</style>
