import EVENTS from '../constants/events';

// Exception classify : Vue Error & API exception

class ExceptionHandler {
  constructor(options) {
    this.context = options.context;
  }

  handlerVueException(error, context, info) {
    console.warn(error, context, info);
  }

  handlerVueWarning(message, context, trace) {
    console.warn(message, context, trace);
  }

  handlerApiException(response, context, info) {
    const error = response.data;

    if (!error.bizCode) return;

    this.$emit(EVENTS.API_ERROR, { error, bizCode: error.bizCode, response });
  }
}

export default ExceptionHandler;
