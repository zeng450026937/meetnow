# MeetNow

## 基础用法

```js
import MeetNow from 'path/to/sdk';

// setup
MeetNow.setup();

const conference = await MeetNow.connect({
  number: '666666.66666',
});

const lifecycles = [
  'connecting',
  'connected',
  'disconnecting',
  'disconnected',
];

lifecycles.forEach(event => {
  conference.on(event, () => console.log(event));
});

await conference.join();
```

## 媒体入会

```js
import MeetNow from 'path/to/sdk';

// setup
MeetNow.setup();

// connect
const conference = await MeetNow.connect({
  number: '666666.66666',
});

const lifecycles = [
  'connecting',
  'connected',
  'disconnecting',
  'disconnected',
];

lifecycles.forEach(event => {
  conference.on(event, () => console.log(event));
});

// join
await conference.join();
// connect media session
await conference.mediaChannel.connect();
```

## 辅流入会

```js
import MeetNow from 'path/to/sdk';

// setup
MeetNow.setup();

// connect
const conference = await MeetNow.connect({
  number: '666666.66666',
});

const lifecycles = [
  'connecting',
  'connected',
  'disconnecting',
  'disconnected',
];

lifecycles.forEach(event => {
  conference.on(event, () => console.log(event));
});

// join
await conference.join();
// connect share session
await conference.share();
```

## 会议控制

```js
import MeetNow from 'path/to/sdk';

// setup
MeetNow.setup();

const conference = await MeetNow.connect({
  number: '666666.66666',
});

const lifecycles = [
  'connecting',
  'connected',
  'disconnecting',
  'disconnected',
];

lifecycles.forEach(event => {
  conference.on(event, () => console.log(event));
});

conference.once('information', async () => {
  const { users } = conference;
  // user list
  const userlist = users.getUserList();
  // mute all
  await users.mute();
  // unmute all
  await users.unmute();
});

await conference.join();
```
