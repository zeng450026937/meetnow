# Channel

Channel是控制通道、媒体通道、辅流通道的核心

## Instance Attributes

```js
// conference 为已加入会议的实例
const focusChannel = conference.focusChannel;
```

### target
* 连接的目标地址,如果单独控制通道的连接，在连接前必须设置target
```js
channel.target
```

### session
* 该通道的会话实例，实际的连接会话
```js
channel.session
```

### options
* channel的配置
```js
focusChannel.options
```

## Instance Methods

### connect()
*  连接建立会话
  
```js
// conference 为已加入会议的实例，
const focusChannel = conference.focusChannel;

// 通过监听事件判断是否连接成功
focusChannel.connect();
```

### disconnect()

* 断开建立的会话
```js
// conference 为已加入会议的实例
const focusChannel = conference.focusChannel;

// 通过监听事件判断
focusChannel.disconnect();
```

## Events

* 通道的事件由内部已经进行处理，从conference事件中可以得知是否连接/断开等状态，若想自行监控通道的状态，可监听confirmed/ended/finished/failed几个主要的事件，进行状态监控。

### peerconnection
RTCPeerConnection创建底层后触发
```js
var datachannel;

focusChannel.on('peerconnection', function(data) {
  datachannel = data.peerconnection.createDataChannel('chat');
});
```

### connecting
session连接时，初始化Invite请求之后触发
```js
focusChannel.on('connecting', function(data) {
  
});
```

### sending
session连接时，发送invite，可以用来修改invite请求或是修改sdp，仅在拨出时候才有此事件
```js
focusChannel.on('sending', function(data) {
  // Your Code
});
```

### progress
session连接时，处理sdp之前触发
```js
focusChannel.on('progress', function(data) {
  // Your Code
});
```

### accepted
session连接时，接收/发送 2XX
```js
focusChannel.on('accepted', function(data) {
  // Your Code
});
```

### confirmed
session连接时，接收/发送ACK时触发
```js
focusChannel.on('confirmed', function(data) {
  // Your Code
});
```

### ended
呼叫终止时，即session结束
```js
focusChannel.on('ended', function(data) {
  // Your Code
});
```

### finished
呼叫完成时，即session结束
```js
focusChannel.on('finished', function(data) {
  // Your Code
});
```

### failed
呼叫失败时，即session无法建立
```js
focusChannel.on('failed', function(data) {
  // Your Code
});
```

### newDTMF
传入新的DTMF
```js
focusChannel.on('newDTMF', function(data) {
  // Your Code
});
```

### newInfo
传入新的SIP消息
```js
focusChannel.on('newInfo', function(data) {
  // Your Code
});
```

### hold
对方hold的时候触发
```js
focusChannel.on('hold', function(data) {
  // Your Code
});
```

### unhold
对方unhold的时候触发
```js
focusChannel.on('unhold', function(data) {
  // Your Code
});
```

### muted
本地静音的时候触发
```js
focusChannel.on('muted', function(data) {
  // Your Code
});
```

### unmuted
本地取消静音的时候触发
```js
focusChannel.on('unmuted', function(data) {
  // Your Code
});
```

### reinvite
收到对话内的reINVITE请求
```js
focusChannel.on('reinvite', function(data) {
  // Your Code
});
```

### update
收到对话内的update
```js
focusChannel.on('update', function(data) {
  // Your Code
});
```

### refer
收到对话内的refer请求
```js
focusChannel.on('refer', function(data) {
  // Your Code
});
```

### replaces
收到对话内的replace请求
```js
focusChannel.on('replaces', function(data) {
  // Your Code
});
```

### sdp 
发送本地sdp或接受远端sdp时触发，可以用来修改sdp
```js
focusChannel.on('sdp', function(data) {
  // Your Code
});
```

### icecandidate
请求RTCPeerConnection时触发
```js
focusChannel.on('icecandidate', function(data) {
  // Your Code
});
```

### getusermediafailed
getUserMedia()失败时触发
```js
focusChannel.on('getusermediafailed', function(data) {
  // Your Code
});
```

### createofferfailed
createOffer()失败时触发
```js
focusChannel.on('createofferfailed', function(data) {
  // Your Code
});
```

### createanswerfailed
createAnswer()失败时触发
```js
focusChannel.on('createanswerfailed', function(data) {
  // Your Code
});
```

### setlocaldescriptionfailed
createAnswer()失败时触发
```js
focusChannel.on('setlocaldescriptionfailed', function(data) {
  // Your Code
});
```

### setremotedescriptionfailed
setRemoteDescription()失败时触发
```js
focusChannel.on('setremotedescriptionfailed', function(data) {
  // Your Code
});
```
