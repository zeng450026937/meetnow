# MediaChannel

MediaChannel是媒体通道、辅流通道的核心,MediaChannel继承Channel,含有Channel有的属性、方法及事件

## Instance Attributes

```js
// conference 为已加入会议的实例
const mediaChannel = conference.mediaChannel; // 媒体通道
const shareChannel = conference.mediaChannel; // 辅流通道
```

### entity
会议的entity
```js
mediaChannel.entity
```

### media
通道媒体信息
```js
mediaChannel.media
// 媒体通道发送设置示例 screenMedia为通过Web接口mediaDevices.getUserMedia()获取到的视频流，
// 最新浏览器版支持通过navigator.mediaDevices.getDisplayMedia 获取辅流，详细请查找Web API相关文档
mediaChannel.media.constraints = screenMedia.constraints;
mediaChannel.media.stream = screenMedia.stream;
mediaChannel.media.receiveAudio = true;  // 如果是主动分享辅流，音频接收就置为false，通常默认置为true
mediaChannel.media.receiveVideo = true;  // 如果是主动分享辅流，视频接收就置为false，通常默认置为true

// 辅流通道接收设置示例
shareChannel.media.constraints = { audio: false, video: false }; // 接收时不需要去获取音视频
shareChannel.media.stream = null;         // 接收时候stream不需要设置
shareChannel.media.receiveAudio = false;  // 用于sdp协商时，是否接受音频
shareChannel.media.receiveVideo = true;   // 用于sdp协商时，是否接受视频
```

### statistics
RTC的状态信息
```js
mediaChannel.statistics

// statistics.inbound.audio/statistics.inbound.video   带有当前通话接收的统计信息
// statistics.outbound.audio/statistics.outbound.audio 带有当前通话发送的统计信息
```

### localStream
本地媒体流
```js
mediaChannel.localStream
```

### remoteStream
远端的媒体流
```js
mediaChannel.remoteStream
```

## Instance Methods

### addLocalStream()
* 添加本地媒体流
```js
// stream为要设置的视频流
mediaChannel.addLocalStream(stream);
```

### removeLocalStream()
* 删除本地媒体流
```js
mediaChannel.removeLocalStream();
```

### getLocalStream()
* 获取本地媒体流
```js
const localStream = mediaChannel.getLocalStream()
```

### getRemoteStream()
* 获取远端媒体流，即接收的远端视频流
```js
const localStream = mediaChannel.getRemoteStream()
```

### replaceLocalStream()
* 替换本地媒体流,用于用户切换音视频输入设备
```js
const renegotiation = false;  // 是否触发重协商 true 触发SDP重协商 false 不重协商，当前最新的浏览器版本大多都支持replaceTrack，来替换stream中track，即直接将发送的流替换掉，但部分老版本是不支持，当使用chrome时，如果会议的conference.information.description.interactiveBroadcastEnabled为true时候且chrome版本小于65，renegotiation需要置为true

//stream即用MediaDevices.getUserMedia()接口获取到的某个设备的音视频流
mediaChannel.replaceLocalStream(stream, renegotiation);
```

## Events

继承于Channel，相关事件查看Channel的事件说明
