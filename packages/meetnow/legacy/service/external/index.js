import Vue from '../../vue/index';
import { isSuccess } from '../../utils/index';
import ERRORS from '../../constants/errors';

const External = Vue.extend({
  data() {
    return {

    };
  },
  methods : {
    async getConfInfo(params = {}) {
      let { longNumber, server } = params;

      server = server || await this.$root.ua.setServer();
      longNumber = longNumber || this.$root.ua.userInfo.longNumber;

      const number = longNumber.split('.')[1];
      const confUrl = `${ number }@${ server }`;

      let result = '';
      try {
        result = await this.$api.getShortConfInfo({ confUrl });
      }
      catch (e) {
        console.warn(e);
      }

      if (result && isSuccess(result.bizCode)) return result.data;

      result = await this.$api.getOfflineConfInfo({ longNumber });

      return isSuccess(result.bizCode)
        ? await Promise.resolve(result.data)
        : await Promise.reject(ERRORS.NO_CONF);
    },
  },
});

export default External;
