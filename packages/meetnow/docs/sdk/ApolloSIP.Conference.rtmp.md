# conference.rtmp
成功加入会议后，conference实例的rtmp主要用来进行rtmp直播的会议控制

## Instance Attributes
```js
// conference为已连接会议的会议实例
const rtmp = conference.rtmp;
```

### userList
```js
// 获取rtmp用户列表，RTMP用户和普通参会用户的Object基本一致的，除了一些自有属性有差异
const userList = rtmp.userList;
```

### config
```js
// 获取默认rtmp的参数，即description.defaultRtmp的信息
const config = rtmp.config;
```

### status
```js
// 获取默认rtmp的状态，即默认的Rtmp User的信息
const status = rtmp.status;
```

## Instance Methods

### getUser()
* 获取指定的rtmp用户
```js
const entity = 'rtmp entity'; // rtmp用户的entity值

const user = conference.rtmp.getUser(entity);
```

### hasUser()
* 获取指定的rtmp用户是否存在

```js
const entity = 'rtmp entity'; // rtmp用户的entity值

const user = conference.rtmp.hasUser(entity);
```

### apply()

* 保存默认直播设置
```js
const options = {
  'mcu-session-type'  : 'AVD',         // AVD/AV/AD
  'max-video-fs'      : '720P',        // 1080P/720P/360P, 1080P仅用于转发模式
  'display-text'      : 'RTMP直播详情',
  'video-data-layout' : 'SpeechExcitation', // 直播视频布局：SpeechExcitation |PictureInPictrue | Exclusive，V23新增参数
  'web-share-url'             : '',    // 直播链接
  'show-electronic-nameplate' : false, // 电子铭牌 V24新增参数
  'show-speaker-details'      : false, // 发言者详情 V24新增参数
  'password'                  : '',    // 开启验证时密码不能为空 V24新增参数
  'verify-login'              : false, // 开启登录验证 V24新增参数
  'verify-password'           : false  // 开启密码验证 V24新增参数
}

// RTMP直播配置不会保存到下一个周期会议中，且保存即是发送
conference.rtmp.apply(options)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

### getInfo()
* 获取RTMP信息

```js
const params = {
  'enterpriseId' : 'id',      // 企业id 
  'conferencePlanId' : 'id'   // 会议planId 会议信息可查到
}

conference.rtmp.getInfo(params)
  .then((result) => {
    if (result.ret) {
      const info = result.data;
      /* info参考的结构
        info = {
          'subject': 'RTMP',
          'startTime': 1533610800000,
          'endTime': 1535686200000,
          'organizerName': '9100',
          'description': '123',
          'customLogoPath': 'rtmp/timg.png',
          'status': 'disconnected',
          'liveBroadcastStartTime': 1533609955000,
          'pullStreamUrl': {
              'highM3u8': 'http://pushlive.yealinkvc.com/2018/h3e577fc0b94d418283c746fd564f613d.m3u8?auth_key=1533631717972-0-0-58dc7cfedf5e0475f288f77d9630e222',
              'highRtmp': 'rtmp://pushlive.yealinkvc.com/2018/h3e577fc0b94d418283c746fd564f613d?auth_key=1533631717972-0-0-7e52c81f6b781aa9bcfa8578959e1fb3',
              'standardRtmp': 'rtmp://pushlive.yealinkvc.com/2018/3e577fc0b94d418283c746fd564f613d?auth_key=1533631717972-0-0-430f9a07c668a9864dad51840ba2225d',
              'standardM3u8': 'http://pushlive.yealinkvc.com/2018/3e577fc0b94d418283c746fd564f613d.m3u8?auth_key=1533631717972-0-0-caa5545c80a1ca5d19514bbe9a5f47d7'
          },
          'liveBroadcastEnable': true,
          'definition': '720P'
        }
        */
    }
  })
  .catch((e) => {
    // Your Code
  });
```

## start()
* 开始默认RTMP直播

```js
const options = {
  'mcu-session-type'  : 'AVD',         // AVD/AV/AD
  'max-video-fs'      : '720P',        // 1080P/720P/360P, 1080P仅用于转发模式
  'display-text'      : 'RTMP直播详情',
  'video-data-layout' : 'SpeechExcitation', // 直播视频布局：SpeechExcitation |PictureInPictrue | Exclusive，V23新增参数
}

conference.rtmp.start(options)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

## invite()
* 邀请第三方RTMP

```js
const options = {
  'session' : [
    {  
    	'@session-type' : 'audio-video',  // 'audio-video':主流RTMP ,'applicationsharing':辅流RTMP, 主视频流和辅流分开邀请
      'rtmp-url' : 'rtmp://send1.douyu.com/live/5466167r85OrO3qC?   wsSecret=7ed2f9dc7427d1fdf9d9910f9dd97800&wsTime=5b68118b&  wsSeek=off&wm=0&tw=0',        // 推流url
      'mcu-session-type' : 'AVD',   // 推流的媒体类型，AV表示音视频，AD表示音频和辅流(或传入Data)
      'max-video-fs' : '720P' // 1080P/720P/360P, 1080P仅用于转发模式
    }
  ]
};

conference.rtmp.invite(options)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

## inviteBatch()
* 批量邀请第三方RTMP

```js
const options = {
  'users' : [
    {
        'sessions' : [
          {  
            '@session-type' : 'audio-video',  // 'audio-video':主流RTMP ,'applicationsharing':辅流RTMP, 主视频流和辅流分开邀请
            'rtmp-url' : 'rtmp://send1.douyu.com/live/5466167r85OrO3qC?   wsSecret=7ed2f9dc7427d1fdf9d9910f9dd97800&wsTime=5b68118b&  wsSeek=off&wm=0&tw=0',        // 推流url
            'mcu-session-type' : 'AVD',   // 推流的媒体类型，AV表示音视频，AD表示音频和辅流(或传入Data)
            'max-video-fs' : '720P' // 1080P/720P/360P, 1080P仅用于转发模式
          }
        ]
    }
  ]
};

conference.rtmp.inviteBatch(options)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

## modify()
* 修改第三方RTMP直播的参数

```js
const option = {
    '@entity' : 'rtmp_1114058a-c2ca-13b6-45ab-cf33651e1bb8', // rtmp用户的entity
    'endpoint' : [
        { 
          '@entity' : 'rtmp_1114058a-c2ca-13b6-45ab-cf33651e1bb8_audio-video_720P',   // rtmp用户endpoint的entity
          '@session-type' : 'audio-video',  // 'audio-video':主流RTMP,'applicationsharing':辅流RTMP
          'rtmp-url' :    'rtmp://send1.douyu.com/live/5466167r85OrO3qC?         wsSecret=7ed2f9dc7427d1fdf9d9910f9dd97800&wsTime=5b68118b&wsSeek=off&wm=0&tw=0',  
          'mcu-session-type' : 'AVD',  // 推流的媒体类型，AV表示音视频，AD表示音频和辅流(或传入Data)
          'max-video-fs' : '480P'
        }
    ]
};

conference.rtmp.modify(options)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

## stop()
* 结束RTMP直播(包括第三方RTMP)

```js
const entity = 'rtmp entity';  // 第三方rtmp直播用户的entity

// 结束默认RTMP参数不传，第三方RTMP才需传entity
conference.rtmp.stop([ entity ])
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```
