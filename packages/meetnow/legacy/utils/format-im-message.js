const padTime = (number) => String(number).padStart(2, '0');

export const formatRemoteIM = (message) => message;
export const formatLocalIM = (message) => message;
//
// const formatIM = (message, { entity, displayText }, direction = 'remote') => {
//   const isRemote = direction !== 'local';
//   const date = isRemote
//     ? new Date(message['im-timestamp'])
//     : new Date();
//
//   const formatMessage = isRemote ? {
//     direction : entity === message['sender-entity'] ? 'outgoing' : 'incoming', // 两种 direction incoming outgoing
//     source    : message['sender-display-text'],
//     target    : message['is-private'] ? displayText : 'default',
//     content   : message['im-context'],
//     isPublic  : !message['is-private'],
//     date      : `${padTime(date.getHours())}:${padTime(date.getMinutes())}`,
//   }
//     : {
//       ...message,
//       date     : `${padTime(date.getHours())}:${padTime(date.getMinutes())}`,
//       isPublic : message.target,
//     };
//
//
//   return formatMessage;
// };
//
// export default formatIM;
