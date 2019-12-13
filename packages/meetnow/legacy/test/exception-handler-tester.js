import Vue from '../vue/index';

const ExceptionHandlerTester = Vue.extend({
  data() {
    return {
      testData : 'T',
    };
  },
  computed : {
    testComputed() {
      return `C - ${ this.testData }`;
    },
  },
  watch : {
    testData(val, oldVal) {
      console.warn(`TestData: ${ val } -> ${ oldVal }`);
    },
    testComputed(val, oldVal) {
      console.warn(`testComputed: ${ val } -> ${ oldVal }`);
    },
  },
  created() {
    // this.startTest();
  },
  methods : {
    startTest() {
      this.caseThrowVueException();
      this.caseReturnPromiseReject();
    },
    caseThrowVueException() {
      throw new Error('Terminated');
    },
    caseReturnPromiseReject() {
      return Promise.reject(new Error('Abort!'));
    },
  },
});

export default ExceptionHandlerTester;
