# Conference.information #
成功加入会议后，conference实例的information会带有会议的描述信息、用户信息、以及对用户进行会控操作的方法等。
Information模块的相关参数信息可参考conference_object文档的说明，description/state/users/view与文档里的参数说明是一一对应的。
U
```js
// conference为已连接会议的会议实例
const information = conference.information
```

## Instance Attributes

### planId
* 会议的planId，部分接口需用到
```js
information.planId
```

### recordId
* 会议的recordId，部分接口需用到
```js
information.recordId
```

### description
* 会议的描述信息对象,详见information.description说明
```js
information.description
```

### state
* 会议的状态信息对象,详见information.state说明
```js
information.state
```

### privateData
* 会议的私有信息对象,私有信息需服务器支持，详见information.privateData说明
```js
information.privateData
```

### view
* 会议的布局信息对象,详见information.view说明
```js
information.view
```

### users
* 会议的用户信息对象,详见information.users说明
```js
information.users
```

### rtmpUsers
* 会议的rtmp直播用户信息对象,详见information.rtmpUsers说明
```js
information.rtmpUsers
```

### recordUsers
* 会议的录播用户信息对象,详见information.recordUsers说明
```js
information.recordUsers
```

### guests
* 会议的访客信息对象
```js
information.guests
```

### invitees
* 会议的邀请成员信息对象
```js
information.invitees
```

### relaties
* 会议的关联成员信息对象
```js
information.relaties
```

## Instance Method/Object

information Object下可以访问到以下子模块的Object，以下对这些子模块的属性、方法进行介绍

* information
  * description
  * state
  * privateData
  * view
  * users
  * rtmpUsers
  * recordUsers
  * guests
  * invitees
  * relaties

### information.users

#### userList

```js
// 当前会议的参会成员列表，每个用户的Object都有entity和uid(可能为空)的属性，在大部分接口中都会使用到
const userlist = information.users.userList;
```

#### onHoldUsers

```js
// 当前会议的等待大厅成员列表
const userlist = information.users.onHoldUsers;
```

#### presenters

```js
// 当前会议的主持人成员列表
const userlist = information.users.presenters;
```

#### demonstrators

```js
// 当前会议的演讲者成员列表
const userlist = information.users.demonstrators;
```

#### attendees

```js
// 当前会议的访客成员列表
const userlist = information.users.attendees;
```

#### getUser()

```js
const entity = 'xxxx'; // 用户的entity或uid

// 获取用户是否存在某个成员列表中
const user = information.users.getUser(entity);
```

#### hasUser()
```js
// entity可从会议的用户列表中获取
// 会议成员不一定有uid，如第三方设备
const entity = 'user entity or uid';

// 获取用户是否存在某个成员列表中
const user = information.users.hasUser(entity);
```

#### user （重点）

* user 这里指从上述各种成员列表种获取到的每个会议成员对应的Object，无论是普通参会用户、录播用户或RTMP用户都是基于此Object来获取相关的参数及操作，不同种类的用户Object存在部分独有属性差异。

* users Object下的方法与每个成员对应user Object的方法有比较多是实现同样的功能，区别主要在于如果用users的方法操作，通常需要指定控制的成员entity或uid，而使用user Object则是对某个成员进行直接操作，无需再指定对应的entity或uid

##### registered
* 获取是否已经注册
```js
// 假若用户存在,判断是否在线
user.registered === true        // 始终都是在线
```

##### entity
```js
// 用户的entity
user.entity
```

##### uid
```js
// 用户的uid
user.uid
```

##### displayText
```js
// 用户的显示名称
user.displayText
```

##### displayTextPinyin
```js
// 用户的名称拼音
user.displayTextPinyin
```

##### protocol
```js
// 用户的连接协议
user.protocol
```

##### ip
```js
// 用户的ip地址
user.ip
```

##### phone
```js
// 用户的手机
user.phone
```

##### userAgent
```js
// 用户的User Agent信息
user.userAgent
```

##### role
```js
// 用户的角色信息
user.role
```

##### endpoint
```js
// 用户的通道信息，可参考conference_object文档的参数说明
user.endpoint
```

##### rtmpType
```js
// rtmp用户的类型
user.rtmpType
```

##### rtmpStatus
```js
// rtmp用户的状态
user.rtmpStatus
```

##### recordType
```js
// 录播用户的类型
user.recordType
```
##### recordStatus
```js
// 录播用户的状态
user.recordStatus
```

##### recordServerType
```js
// 表示录播服务的类型， third-party表示第三方录播，record-type对应为default或者invite， frontend表示前端录播（如自动录播），backend表示后端录播（如强制录播），record-type对应为ylrecord
user.recordServerType
```

##### isPresenter()
```js
// 是否是主持人
user.isPresenter();
```
##### isDemonstrator()
```js
// 是否是演讲者
user.isDemonstrator();
```

##### isPresenterDemonstrator()
```js
// 是否是发言者(教育模式下)
user.isPresenterDemonstrator();
```
##### isOnHold()
```js
// 是否在会议大厅
user.isOnHold();
```

##### hold()
```js
// 将已入会成员转移到大厅
user.hold()
  .then((result) => {})
  .catch((e) => {};)
```

##### unhold()
```js
// 允许/拒绝 大厅成员
user.unhold(true)
  .then((result) => {})
  .catch((e) => {};)
```

##### isShareAvariable()
```js
// 是否有权限分享
user.isShareAvariable();
```

##### isSharing()
```js
// 是否在分享辅流
user.isSharing();
```

##### isAudioApplicant()
```js
// 是否在申请音频（发言）
user.isAudioApplicant();
```

##### isVideoApplicant()
```js
// 是否在申请视频
user.isVideoApplicant();
```

##### isCurrentUser()
```js
// 是否是当前用户
user.isCurrentUser();
```

##### isOrganizer()
```js
// 是否是组织者
user.isOrganizer();
```

##### modifyName()
```js
// 修改用户在会议中的名称 V23新增
const name = 'xxx'; 
user.modifyName(name)
  .then((result) => {})
  .catch((e) => {};)
```


##### getAudioFilter()/getVideoFilter()
```js
// 获取用户角色和权限
const { permission, demostate, presenterDemostate } = user.rolesEntry;
// permission说明
// attendee | castviewer | presenter | organizer
// demostate说明
// audience | demonstrator
// presenterDemostate说明
// audience | demonstrator

// 获取用户Audio状态
const { ingress, egress } = user.getAudioFilter();
// 获取用户Video状态
const { ingress, egress } = user.getVideoFilter();

// audio/video状态说明
// ingress egress 都为Object,结构如下
// {
//   '@blockby': String
//   '#text'   : 'block' // 'unblock' || 'unblocking'
// }

// 1) unblock      -> 解禁
// 2) unblocking   -> 正在申请解禁
// 3) block      -> 禁止
```

##### hasFECC()

* 获取当前成员是否接入可控制的摄像头，如果返回true则会议成员带有支持操作的设备，才会拥有对应camera Object
```js
// 获取information实例
const information = conference.information;
// 获取指定会议成员entity
const entity = 'user entity';
const user = information.users.getUser(entity);

if(user.hasFECC()) {
  const camera = user.camera;  // 操作摄像头的Object
  const step = 2;              // step = 1 等于用户按一下按键 默认 step = 1

  // camera 为undefined标识用户不支持摄像头控制
  if(camera)
  {
    camera.up(step)            // 摄像头操作动作-向上
    .then((result) => {
      // Your Code
    })
    .catch((e) => {
      // Your Code
    });
  }

  // 摄像头有分六种操作:上下左右以及拉近拉远
  // 其余五种调用方式如上camera.up()所示
  // camera.down(step);
  // camera.left(step);
  // camera.right(step);
  // camera.zoomin(step);
  // camera.zoomout(step);
}
```

##### getStatistics()

* 获取用户的通话统计

```js
// 获取information实例
const information = conference.information;
// 获取指定会议成员entity
const entity = 'user entity';
const user = information.users.getUser(entity);

user.getStatistics()
  .then((result) =>
  {
    let audio = result['main-audio'];
    let video = result['main-video'];
    let sharing = result['applicationsharing'];

    audio = {
      'ip',
      'codec', // 编码
      'sample-rate', // 采样率
      'bandwidth', // 带宽
      'bitrate', // 实际码率
      'lossrate', // 丢包率
      'packetlost', // 丢包数
      'jitter', // 抖动
      'rtt' // 环回延时
    };
    video = sharing = {
      'ip',
      'codec', // 编码
      'width', // 宽
      'height', // 高
      'fr', // 帧率
      'evtbr', // 估计带宽
      'bitrate', // 实际码率
      'lossrate', // 丢包率
      'packetlost', // 丢包数
      'jitter', // 抖动
      'rtt' // 环回延时
    };
  })
  .catch((e) => {
    // Your Code
  });
```

##### sendMessage()
* 发送sip消息
```js
const message = 'hello world';

user.sendMessage(message);
```

#### invite()
* 邀请成员入会
```js
// 最少需要 requestUri 和 uid 两者其中一个
const user = {
  'requestUri' : 'uri',   // 用户uri
                          // SIP、Lync用户：'sip:username@domain';
                          // H323用户：'h323:username@domain'；
                          // IP直播用户：'sip:10.86.0.19',
                          // 账号邀请：request-uri同uid填写一样内容
  'uid': 'uid',           // 用户uid
  'type' : 'audio-video'  // 邀请类型，包括 audio | video | audio-video
};

// requestUri格式说明

// SIP、Lync用户
// 'sip:username@domain'

// H323
// 'h323:username@domain'

// IP直播
// 'sip:10.86.0.199'

// RTMP邀请的结构与其他类型用户不同
const rtmpUser = {
    'session': [
      {
        '@session-type': 'audio-video', // 'audio-video':主流RTMP 'applicationsharing':辅流RTMP, 主视频流和辅流分开邀请
        'rtmp-url': 'rtmp://xxxxx',
        'mcu-session-type': 'AV',       // 推流的媒体类型，AV表示音视频，AD表示音频和辅流(或传入Data)
        'max-video-fs': '720P'          // 1080P/720P/360P, 1080P仅用于转发模式
      },
      {
        '@session-type': 'applicationsharing', // 辅流
        'rtmp-url': 'rtmp://xxxxx',
        'mcu-session-type': 'Data',
        'max-video-fs': '360P'
      }
    ]
};

conference.information.users.invite(
  [ user, rtmpUser ]
)
 .then((result) => {
   // Your Code
 })
 .catch((e) => {
   // Your Code
 });
```

#### setAudioFilter()
* 对用户禁言，服务器不再接收用户音频

* 注意 : 对举手操作的控制，也是使用该接口进行允许/拒绝发言

```js
// 获取information实例
const information = conference.information;
// 获取指定会议成员entity
const entity = 'user entity';

information.users.setAudioFilter(
  [ entity ],
  { ingress : false }  // false 禁言 true 取消禁言/允许发言
)
 .then((result) => {
   // Your Code
 })
 .catch((e) => {
   // Your Code
 });
```

#### setAudioFilter()
* 对用户闭音,服务器即使收到用户音频，也不再对其进行混合

```js
// 获取information实例
const information = conference.information;
// 获取指定会议成员entity
const entity = 'user entity';

information.users.setAudioFilter(
  [ entity ],
  { egress : false }  // false 闭音 true 取消闭音
)
 .then((result) => {
   // Your Code
 })
 .catch((e) => {
   // Your Code
 });
```

#### setVideoFilter()
* 对用户关闭视频
服务器即使收到用户音频，也不再对其进行混合

```js
// 获取information实例
const information = conference.information;
// 获取指定会议成员entity
const entity = 'user entity';

information.users.setVideoFilter(
  [ entity ],
  { ingress : false, egress : false } // egress可以不传
)
 .then((result) => {
   // Your Code
 })
 .catch((e) => {
   // Your Code
 });
```

#### kick()
* 移除成员,从会议中踢掉参会成员

```js
// 获取information实例
const information = conference.information;
// 获取指定会议成员entity
const entity = 'user entity';

information.users.kick(
  [ entity ]
)
 .then((result) => {
   // Your Code
 })
 .catch((e) => {
   // Your Code
 });
```

#### setPermission() 
*修改成员角色,参会成员的权限:主持人或访客

```js
// 获取information实例
const information = conference.information;
// 获取指定会议成员entity
const entity = 'user entity';
// 设置用户为主持人或访客
const role = 'presenter' || 'attendee';
const user = information.users.getUser(entity);

// 个人设置
user.setPermission(role)
 .then(() => {})
 .catch(() => {});

// 批量设置
information.users.setPermission(
  [ entity ]，
  role
)
 .then((result) => {
   // Your Code
 })
 .catch((e) => {
   // Your Code
 });
```

#### setPermissionBatch() 
*批量修改成员角色,参会成员的权限:主持人或访客

```js
// 获取information实例
const information = conference.information;
// 获取指定会议成员entity
const entitys = 'user entity';
// 设置用户为主持人或访客
const role = 'presenter' || 'attendee';

information.users.setPermissionBatch(
  [ entitys ]，
  role
)
 .then((result) => {
   // Your Code
 })
 .catch((e) => {
   // Your Code
 });
```

#### setDemonstrator()
* 将参会成员设置或取消为演讲者

设置参会成员演讲状态

```js
// 获取information实例
const information = conference.information;
// 获取指定会议成员entity
const entitys = 'user entity';
// 设置是否为演讲者
const enable = true || false;

information.users.setDemonstrator(
  [ entity ]，
  enable
)
 .then((result) => {
   // Your Code
 })
 .catch((e) => {
   // Your Code
 });
```

#### setPresenterDemonstrator()
* 将参会成员设置为发言者/单方全屏布局中设置为显示者

```js
// 获取information实例
const information = conference.information;
// 获取指定会议成员entity
const entitys = 'user entity';
const user = information.users.getUser(entity);
// 设置是否为发言者
const enable = true || false;

// 个人设置
user.setPresenterDemonstrator(enbale)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });

information.users.setPresenterDemonstrator(
  [ entity ]，
  enable
)
 .then((result) => {
   // Your Code
 })
 .catch((e) => {
   // Your Code
 });
```

#### hold()
* 将会议成员移动到会议大厅

将会议中的成员移动到会议的等待大厅中

```js
// 获取information实例
const information = conference.information;
// 获取指定会议成员entity
const entitys = 'user entity';

information.users.hold(
  [entity]
)
 .then((result) => {
   // Your Code
 })
 .catch((e) => {
   // Your Code
 });
```

#### unhold()
* 允许/拒绝会议大厅内的用户,允许为让用户加入到会议中,拒绝为将用户从会议大厅中踢出


```js
// 获取information实例
const information = conference.information;
// 获取指定会议成员entity
const entitys = 'user entity';
// 允许进入会议或用会议大厅中移除的标志
const granted = true || false;

information.users.unhold(
  [entity],
  granted
)
 .then((result) => {
   // Your Code
 })
 .catch((e) => {
   // Your Code
 });
```

#### getStatisticsBatch()
* 批量获取通话统计

```js
const options = {
    media : [
      {
        '@id' : '1', //媒体类型
        'columns'    : 'ip,lossrate', // 获取的字段类型
      },
      {
        '@id' : '2', // 媒体类型
        'columns'    : 'ip,lossrate', // 获取的字段类型
      }
    ]
  };

information.users.getStatisticsBatch(options)
 .then((result) => {
   /* result的数据结构  可参考获取单人的数据
    result ={
      user : [
        {
          '@entity' : '',  //用户entity
          'call-stats' : {
            'media' : [
              {
                '@id' : 1,
                'label' : 'main-audio',
                'send' : {
                  'ip' : 'xxx',
                  'lossrate' : 0
                },
                'recv' : {
                  'ip' : 'xxx',
                  'lossrate' : 0
                }
              }
              {
                '@id' : 2,
                'label' : 'main-video',
                'send' : {
                  'ip' : 'xxx',
                  'lossrate' : 0
                },
                'recv' : {
                  'ip' : 'xxx',
                  'lossrate' : 0
                }
              }
            ]
          }
        }
      ]
    }
    */
 })
 .catch((e) => {
   // Your Code
 });
```

#### modifySharePermission()
* 修改用户分享辅流权限

```js
const users = conference.users; // 或者conference.information.users
const options = {
  'presenter' : true,      // 主持人权限
  'demonstrator' : true,   // 演讲者权限
  'attendee' : true        // 访客权限
};

users.modifySharePermission(options)
  .then((result) => {})
  .catch((e) => {});
```

#### modifyName()
```js
// 修改用户在会议中的名称 V23新增
const entity = 'xxx'; // 需要修改的用户的entity
const name = 'xxx'; 

users.modifyName(entity, name)
  .then((result) => {})
  .catch((e) => {});
```

#### inviteRtsp()
```js
// 邀请rtsp用户，需服务器版本支持
const options = {
    'uid' : 'xxxx',         // 邀请rtsp的uid，可不传
    'displayText' : 'xxx',  // 显示名称, 可不指定
    'url' : 'rtsp://xxxx'   // rtsp的url
  };

users.inviteRtsp(options)
  .then((result) => {})
  .catch((e) => {});
```

#### inviteRtspBatch()
```js
// 批量邀请rtsp用户，需服务器版本支持
const options = {
    'users': [                  // 邀请列表
      {
        'uid' : 'xxxx',         // 邀请rtsp的uid，可不传
        'displayText' : 'xxx',  // 显示名称, 可不指定
        'url' : 'rtsp://xxxx'   // rtsp的url
      }
    ]
  };

users.inviteRtspBatch(options)
  .then((result) => {})
  .catch((e) => {});
```

#### setEchoDetection()
```js
// 开启会场检测 需服务器支持该功能
const options = {
    'action':  true   // 是否使能
  };

users.setEchoDetection(options)
  .then((result) => {})
  .catch((e) => {});
```

#### getEchoData()
```js
// 获取检测数据 需服务器支持该功能

users.getEchoData()
  .then((result) => {
    /*
    {
      "conferenceKeys": {
          "@confEntity": "MzczNzM="
      },
      "start-time": 1576576360082,
      "now-time": 1576576423803,
      "user-volume-list": {
          "user": {
              "@entity": "552ea48859b135466b0e21b71a64529c",
              "uid": "unauth-webrtc-uid",
              "display-text": 123,
              "username": "unauth-web-client",
              "volume": 0,
              "start-time": "2019-12-17 09:52:41"
          }
      }
    }
    */
  })
  .catch((e) => {});
```

#### getEchoRecord()
```js
// 获取检测记录 需服务器支持该功能
const options = {
    'enterpriseId':  'xxxx',      // 企业id
    'conferenceRecordId': 'xxxx'  // record id
  };

users.getEchoRecord(options)
  .then((result) => {})
  .catch((e) => {});
```

### information.state

#### sharingUser
* 辅流分享者

```js
// 在收到信息更新事件时候，可判断sharingUser是否存在，如果存在sharingUser，则代表有其他参会成员正在分享辅流，即可主动发起辅流通道连接 conference.shareChannel.connect(),辅流通道参数详见MediaChannel配置
conference.on('informationUpdated', () => {
  const user = conference.information.state.sharingUser;
})
```

#### loopVolumeState
* 会场回声检测状态 close/open
```js
conference.information.state.loopVolumeState;
```

#### rollCallStatus
* 点名状态
```js
conference.information.state.rollCallStatus; // // 会议点名状态 完成finish 正在点名pending、准备状态(没有点名)ready 已暂停(on-hold)
```

#### getLock()
* 获取会议锁定的状态(会议大厅状态)
```js
const state = conference.information.state;

const lockState = state.getLock();

let { locked, admissionPolicy, autopromote, attendeeLobbyBypass} = lockState;
```

#### setLock()
* 设置会议锁定的状态(会议大厅状态)
```js
const state = conference.information.state;

// 组织锁,目前默认false
locked = false;
// 表示哪些人在会议没有locked锁住时，可以直接加入会议，无需在Lobby大厅等待
// 有以下三个值：
// closedAuthenticated：表示主持人和邀请的用户
// openAuthenticated：表示与组织者同一个域或者联盟内的用户
// anonymous：表示任何人都可以加入会议；
admissionPolicy = 'anonymous';
// 表示哪些人加入会议后能成为主持人,
// 这个是一个整型值，有三种情况：
// None：0，由组织者安排主持人
// Everyone所有人：2147483648，默认值，转为二级制即0x80000000(bit 31)
// Company(同一个域或者联盟内的)： 32768转为二进制即0x00008000(bit 15)
autopromote = 0;
// 表示邀请的成员是否可以直接进入大厅
// false：表示邀请的成员需要进入大厅等待
// true：表示邀请的成员无需再大厅等待
attendeeLobbyBypass = true;

// 当locked=true时，其他配置失效，表示只有组织者能直接加入会议。

state.setLock({
  locked,
  admissionPolicy,
  autopromote,
  attendeeLobbyBypass
})
 .then((result) => {
   // Your Code
 })
 .catch((e) => {
   // Your Code
 });
```

#### getForwarder()
* 获取发言者

```js
const state = conference.information.state;

const user = state.getForwarder();
```

### information.description



#### internal

* 注：description Object下带有许多会议信息的属性

```js

const params = information.description.internal

// internal的结构信息,参数通过description也可以直接访问到，但对应的参数名称需改成驼峰式格式访问,具体在开发时可打印出Object,查看对应的属性
params = {
  'subject': 'api',                               // 会议主题
  'start-time': '2018-07-30 11:00:06',            // 会议开始时间
  'banner': {
    'enabled': false,                           // 横幅使能
    'display-text': 'adsdfsf',                  // 横幅内容
    'position' : 'top'                          // 横幅显示位置，顶部top | 中间medium | 底部bottom
  },
  'default-rtmp': {
    'enabled': false,                           // 默认rtmp使能
    'display-text': 'custom text',              // 默认rtmp显示名称
    'mcu-session-type': 'AVD',                  // 推流的媒体类型，音频为Audio，视频为Video，辅流为Data，可以随意组合，如AV表示音视频，AD表示音频和辅流，AVD表示音视频加辅流
    'max-video-fs': '1080P',                    // 推流的分辨率，如1080P/720P/540P/360P,1080P仅用于转发模式
    'video-data-layout': 'SpeechExcitation',    // 视频布局：SpeechExcitation/PictureInPictrue/Exclusive，V23新增参数
    'web-share-url': 'http://10.200.112.81/livestream?planId=7f9be890dbf84e05a50c4468bb56ea52&enterId=f4a4a4ee02ac4bb8875bbd08e03d4de0',     // 用于分享的RTMP直播观看地址
    'show-electronic-nameplate' : false, // 电子铭牌 V24新增参数
    'show-speaker-details'      : false, // 发言者详情 V24新增参数
    'password'                  : '',    // 开启验证时密码不能为空 V24新增参数
    'verify-login'              : false, // 开启登录验证 V24新增参数
    'verify-password'           : false  // 开启密码验证 V24新增参数
  },
  'profile': 'demonstrator',                      // 会议模式，普通模式为default，主席模式为demonstrator
  'record-id': '02dd9b892ac747bfa35ca51d65d598',  // 会议record-id
  'conf-uris': {                                  // 会议的通道URIs，可以由多个entry，每个entry包含一个通道URI，如audio-video通道
    'entry': [
      {
        '@entity': 'focus',                 // 控制通道标识
        'uri': 'sip:Conference_73952@10.86.0.220.xip.io;opaque=app:conf:focus:id:73952',    // 控制通道地址
        'display-text': 'focus',            // 控制通道显示名称
        'purpose': 'focus'
      },
      {
        '@entity': 'audio-video',           // 媒体audio-video通道
        'uri': 'sip:Conference_73952@10.86.0.220.xip.io;opaque=app:conf:audio-video:id:73952',  // 媒体通道地址
        'display-text': 'audio-video',      // 媒体通道显示名称
        'purpose': 'audio-video'
      },
      {
        '@entity': 'applicationsharing',        // 辅流通道
        'uri': 'sip:Conference_73952@10.86.0.220.xip.io;opaque=app:conf:applicationsharing:id:73952', // 辅流通道地址
        'display-text': 'applicationsharing',   // 媒体通道显示名称
        'purpose': 'applicationsharing'
      }
    ]
  },
  'organizer': {                                  // 会议组织者信息
    'display-text': '9100',                     // 显示名称
    'uid': 'c78b4c59b777463c923e657ce25dba7c',  // 用户的uid，即staffId
    'username': '9100',                         // 用户名
    'realm': '10.86.0.220.xip.io',              // 用户realm
  },
  'conference-id': '73952',     // 会议id
  'conference-number': '73952', // 会议号码
  'conference-type': 'VGCP',    // 会议类型：VMN(meetnow)、VGCP(个人平台界面绑定云会议端口的会议)、VGCM(管理员界面通过云会场管理创建的云会议)、VSC(个人平台界面绑定终端VMR，云端VMR的会议)、VSCA(亿联管理员给企业创建终端VMR或者云端VMR的时候，自动创建的可以随时入会的会议)
  'conference-number-type':'recurrence',     // 会议类型，即时会议meetnow，预约会议recurrence，固定VMR会议vmr
  'book-start-time': '2018-07-30 11:00:00',  // 预约会议开始时间
  'book-expiry-time': '2018-08-31 11:30:00', // 预约会议结束时间
  'presenter-pin': '605956',       // 会议主持人PIN码，使用该PIN码入会的成员，入会后身份为主持人；
  'attendee-pin': '605956',        // 会议与会者PIN码，使用该PIN码入会的成员，入会后身份为与会者，attendee-pin和presenter-pin码相同时，入会后身份为与会者；
  'maximum-user-count': 3000,      // 表示会议容量，是一个整型数；
  'admission-policy': 'anonymous', // 根据权限判断当前会议是否锁定，有以下三个值 closedAuthenticated表示主持人和邀请的用户;  openAuthenticated表示与组织者同一个域或者联盟内的用户;  anonymous表示任何人都可以加入会议(非此值这会议处于锁定状态，部分人员无法直接入会)
  'lobby-capable': false,          // 用户加入会议后，发现为on-hold状态，需要检查这个配置，如果是true，则说明安排在大厅里，如果为false，则客户端需要直接退出；
  'share-permission': {
    'enable': true,              // 是否开启辅流权限控制
    'presenter-share': true,     // 主持人是否可分享辅流
    'demonstrator-share': true,  // 演讲者是否可分享辅流
    'attendee-share': true       // 访客是否可分享辅流
  },
  'attendee-by-pass': true,        // 表示非主持人邀请者是否可以直接入会
  'autopromote': 0,                // 表示哪些人加入之后可以成为主持人，这个是一个整型值,有三种情况：
                  // 1) None：0，由组织者安排主持人
                  // 2) Everyone所有人：2147483648，默认值，转为二级制即0x80000000(bit 31)
                  // 3) Company(同一个域或者联盟内的)： 32768转为二进制即0x00008000(bit 15)
  'server-mode': 13,               // 会议模式
  'interactive-broadcast-enabled': false, // 是否开启广播互动，true为开启，开启后主持人为互动方，与会者为广播方；默认为false
  'enterprise-id': 'f4a4a4ee02ac4bb8875bbd08e03d4de0', // 企业id
  'video-enabled': true,  // 是否有视频，默认为true，纯音频会议为false
  'ipcall-enabled': true, //是否允许IP直拨呼入（不包括邀请）
  'webrtc-enabled': true, // 是否允许WebRTC入会
  'record-server-type': 'third-party', // 会议开启时的录播服务类型，third-party表示第三方录播服务（如旭顶录播），ylrecord表示Yealink录播服务，若admin管理员没有配置任何录播服务，也用third-party表示
  'record-privilege': 'organizer',     // 录制权限，会议允许哪些身份的会议成员可以操作录制功能，仅组织者为organizer，组织者+主持人为presenter，组织者+主持人+访客为attendee.
  'auto-recording-enabled': false,     // 会议时候开启自动录制
}
```

#### getBanner()
* 获取当前横幅

```js
const description = conference.information.description;

// 获取当前生效的横幅信息
const banner = description.getBanner()
```

#### saveBanner()
* 保存预置横幅
```js
const banner = {
  'enabled': true,            // 是否使能
  'display-text': '横幅内容',  // 显示内容
  'position': 'medium',       // 显示位置 top/medium/bottom
  'font-size': 'default',     // 字体大小 default | medium | big
  'font-color': 'white',      // 字体颜色 white | yellow | blue | red | black
  'bottom-color': 'red',      // 横幅底色 red | yellow | blue
};

const description = conference.information.description;

description.saveBanner(banner)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

#### getPresetBanner()
* 获取预置横幅

```js
const description = conference.information.description;

conference.getPresetBanner()
 .then((banner) =>
 {
   // 参考设置的参数
 })
  .catch((e) => {
    // Your Code
  });
```

#### setBanner()
* 发送横幅,发送横幅后预置横幅参数也会被修改；
```js
const banner = {
  // 是否显示横幅
  'enabled'      : true,
  // 横幅内容
  'display-text' : 'banner text'
  // 横幅位置
  'position'     : 'top' // top | medium | bottom
  'font-size'    : 'default',  // default | medium | big
  'font-color'   : 'white',    // white | yellow | blue | red | black
  'bottom-color' : 'red',      // red | yellow | blue
};

const description = conference.information.description;

description.setBanner(banner)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

#### getTitle()
* 查询预置字幕

```js
// 返回的数据结构 与设置时 传入的数据结构 相同
const description = conference.information.description;

description.getTitle()
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

#### saveTitle()
* 保存预置字幕

```js
const title = {
  // 是否启用字幕
  'enabled'         : true,
  // 字幕类型，Static:静态字幕，Dynamic:动态字幕
  'type'            : 'Static', // Static|Dynamic
  // 重复次数，动态字幕使用
  'repeat-count'    : 3,
  // 间隔时间，动态字幕使用
  'repeat-interval' : 5,
  // 持续时间，静态字幕使用
  'display-time'    : 5,
  // 字幕内容
  'display-text'    : 'title',
  // 字幕位置，top:顶部，medium:中间，bottom:底部
  'position'        : 'top',  // top|medium|bottom
  // 滚动方向，L2R:从左到右，R2L:从右到左
  'roll-direction'  : 'R2L',  // R2L|L2R
  'font-size': 'default',     // 字体大小 default | medium | big
  'font-color': 'white',      // 字体颜色 white | yellow | blue | red | black
  // 显示字幕的用户
  'target-users'    : {
    'all-attendee'  : false,
    'all-castviewer': false,
    'all-presenter' : false,
    'user' : [
      {
        '@entity' : 'entity', // 没有时可以不传
        'uid'    : 'uid'      // 用户uid（必须）
      }
    ]
  }
};

const description = conference.information.description;

description.saveTitle(title)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

#### setTitle()
* 发送字幕

```js
const title = {
  // 字幕类型，Static:静态字幕，Dynamic:动态字幕
  'type'            : 'Static', // Static|Dynamic
  // 重复次数，动态字幕使用
  'repeat-count'    : 3,
  // 间隔时间，动态字幕使用
  'repeat-interval' : 5,
  // 持续时间，静态字幕使用
  'display-time'    : 5,
  // 字幕内容
  'display-text'    : 'title',
  // 字幕位置，top:顶部，medium:中间，bottom:底部
  'position'        : 'top',  // top|medium|bottom
  // 滚动方向，L2R:从左到右，R2L:从右到左
  'roll-direction'  : 'R2L',  // R2L|L2R
  'font-size': 'default',     // 字体大小 default | medium | big
  'font-color': 'white',      // 字体颜色 white | yellow | blue | red | black
  // 显示字幕的用户
  'target-users'    : {
    'all-attendee'  : false,
    'all-castviewer': false,
    'all-presenter' : false,
    'user' : [
      {
        '@entity' : 'entity', // 没有时可以不传
        'uid'    : 'uid' // 用户uid（必须）
      }
    ]
  },
  'font-size'    : 'default',  // default | medium | big
  'font-color'   : 'white',    // white | yellow | blue | red | black
  'bottom-color' : 'red',      // red | yellow | blue
};

const description = conference.information.description;

description.setTitle(title)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

#### cancelTitle()
* 禁用/取消字幕

```js
const description = conference.information.description;

description.cancelTitle()
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

#### saveProcedure()
* 保存预置流程

```js
// 结构可参考查询预置流程返回的数据
const procedure = {
  'enable' : true
  'procedure-infos' : {
    'procedure-info' : [
      {
        '@id' : 1,
        'acitve' : true          // 是否启用
        'display-tex' : '流程1'  // 流程内容
      },
      {
        '@id' : 2,
        'acitve' : false
        'display-tex' : '流程2'
      }
    ]
  }
};

const description = conference.information.description;

description.saveProcedure(procedure)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

#### getProcedure()
* 查询预置流程

```js
const description = conference.information.description;

description.getProcedure()
  .then((result) => {
    const enable = result['enable']
    const procedureInfos = result['procedure-infos']

    if (!Array.isArray(procedureInfos['procedure-info'])) {
      procedureInfos['procedure-info'] = [ procedureInfos['procedure-info'] ];
    }

    procedureInfos['procedure-info'].forEach((info) => {
      info['@id'];
      info['active'];
      info['display-text'];
    });
  })
  .catch((e) => {
    // Your Code
  });
```

#### setProcedure()
* 发送流程

```js
const procedure = {
  'enable' : true
  'procedure-infos' : {
    'procedure-info' : [
      {
        '@id' : 1,          // 流程id
        'acitve' : true     // 是否进行中
        'display-tex' : '流程1' // 显示内容
      },
      {
        '@id' : 2,
        'acitve' : false
        'display-tex' : '流程2'
      }
    ]
  }
};

const description = conference.information.description;

description.setProcedure(procedure)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

#### getRecordServerType()
* 获取录播服务器类型

```js
const description = conference.information.description;

const type = description.getRecordServerType();  // 会议开启时的录播服务类型，third-party表示第三方录播服务（如旭顶录播），ylrecord表示Yealink录播服务，若admin管理员没有配置任何录播服务，也用third-party表示（web 后端只能查询到Yealink录播服务是否配置），会议对象开启之后，若是admin管理员改变录播服务类型，不实时更新，会议对象开启时选择使用哪种录播服务类型则一直使用，直到对象销毁
```

#### getSpeechMode()
* 获取发言模式

```js
const description = conference.information.description;

const mdoe = description.getSpeechMode(); // 演讲模式：freely / raise-hand
```

#### setSpeechMode()
* 设置发言模式

```js
const mode = 'freely'; // freely / raise-hand

const description = conference.information.description;

description.setSpeechMode(mode)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

### information.view

* conference.information.view 为布局相关的实例，包含布局的接口调用
* conference.information.view 等价于 conference.view
* 
#### getLayout()

* 获得会议布局

```js
// 获取Layout，参数参考设置接口的说明
const layout = conference.information.view.getLayout();

layout['video-layout'];
layout['video-max-view'];
layout['video-speech-ex-sensitivity'],
layout['video-round-interval'],
layout['voice-prompt-enable'],  // 入会与离会提示音使能
```

#### setLayout()
* 设置会议的布局

  1.普通模式下布局分为

  * 等分Equality
  * 语音激励SpeechExcitation(语音激励里根据max-view不同，又分为1+0语音激励和1+N)
  * 独占Exclusive

  2.主席模式(演讲者模式)下布局分为

  * 主席模式布局Presentation

  目前不支持模式之间相互切换，所以布局切换只在普通模式下三种布局之间切换；

```js
const layout = {
    'video-layout': 'SpeechExcitation', /* 表示视频布局，有四种布局：等分模式
    Equality，主席模式Presentation，语音激励模式SpeechExcitation，单方全屏Exclusive；讨论模式下可以设置等分(N*N)、语音激励(1+N)、单方全屏
    1、讨论模式下可设置 Equality、SpeechExcitation、Exclusive(单方全屏设置显示对象使用设
    置演讲者接口)
    2、主席模式下video-layout为Presentation,主席模式下video-layout、video-presenterlayout保持默认即可，主要设置广播布局模板
    */
    'video-max-view': 1, // 表示最大显示视图数 等分模式(N*N)下4,9,16,25,36,49, 语音激励模式(1+N)模式 1,5,8,10,13,17,21
    'video-presenter-layout': 'Equality', // (video-layout为Presentation此参数才有效)表示支持人看到的视频布局，有三种布局：平等模式Equality，语音激励模式SpeechExcitation，单方全屏Exclusive；
    'video-presenter-max-view': 8,        // (video-layout为Presentation此参数才有效)表示Presentation下主持人1+N布局显示上限数
    'video-round-number': 1,              // 视频轮询张数，张数不能大于video-max-view
    'video-round-interval': 15,           // 视频轮询间隔 1~3600秒
    'video-speech-ex-sensitivity': 2,     // 语音激励时间 1~10s
    'video-round-enabled': true,          // 是否使能视频轮询
    'video-speech-ex-enabled': true,      // 是否使能语音激励
    'video-data-mix-enabled': false,      // 辅流加混频开关
    'hide-osd-sitename': false,           // 是否隐藏会场名称
    'hide-osd-sitestatus': false,         // 是否隐藏会场状态
    'osd-position': 'BottomLeft',         // 会场位置：TopLeft/TopMiddle/BottomLeft/BottomMiddle, V23新增参数
    'video-big-round': false,             // 大视图是否加入轮询
    'video-big-position': 'medium',       // 2+N 置顶或居中 medium/top
    'osd-sitename-font-size': 'default',  // 会场名称字体大小 default/medium/big
    'osd-sitename-font-color': 'white',   // 会场名称字体颜色white/yellow/blue/red/black
    'voice-prompt-enable': false,         // 是否开启入会与离会提示音
}

conference.information.view.setLayout(layout)
  .then((result) => {
  // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

#### getBroadcastLayout()
* 获得广播布局

```js
const layout = conference.information.view.getBroadcastLayout();

// layout 是一个 array
Array.isArray(layout) === true;

layout.forEach((parttern) => {
  // parttern 参考设置接口的参数说明
});
```

#### setBroadcastLayout()
* 设置广播布局

支持配置多个广播布局，每个布局有一个布局id

```js
const parttern1 =  {
  "@id": 204, // 广播布局模板id 用于修改指定修改哪个模板，目前支持4个模板，每个模板都是独立
  "enabled": true, // 是否使能该布局模板
  "display-text": "", // 布局显示名称
  "video-round-enabled": true, // 是否使能视频轮询
  "video-speech-ex-enabled": false, // 是否使能语音激励
  "video-layout": "Equality", // 广播布局使用的布局 等分模式Equality，语音激励模式SpeechExcitation(包括1+N和2+N模式)，单方全屏Exclusive
  "video-max-view": 16, // 布局最大视图数 ，表示最大显示视图数等分模式(N*N)下4,9,16,25,36,49, 语音激励模式(1+N)模式 1,5,8,10,13,17,21, 2+N模式只能为10, 单方全屏为1
  "video-big-view": 1, // 布局大图视图数，支持1+N和2+N两种分别为1，2, 设置为2+N模式时需至少设置一个固定对象
  "video-round-number": 1, // 视频轮询张数 不超过布局最大视图数
  "video-big-round": false, // 大视图是否加入轮询
  "video-big-position": "medium", // 2+N 置顶或居中 medium/top
  "source-users": { // 广播布局源对象 源对象不支持allCastviewer、allRtmp、allRecord，应用对象不支持allApplicationsharing
    "v-user": [
      {
        "@cmp-key": "allCastviewer", // 与type一致
        "type": "allCastviewer" // type取值范围：allPresenter(所有主持人)、allAttendee(所有与会者)、allApplicationsharing(所有辅流)、allCastviewer(所有广播方)、allRtmp(所有rtmp用户)、allRecord(所有录播用户)；其中，源对象不支持allCastviewer、allRtmp、allRecord，应用对象不支持allApplicationsharing，固定对象只支持allApplicationsharing
      },
      {
        "@cmp-key": "allRtmp",
        "type": "allRtmp"
      }
    ],
    "user": [
      {
        "@entity": "c78b4c59b777463c923e657ce25dba7c", // 有entity和uid信息的用户，传入用户entity或uid其中一个即可
        "uid": "c78b4c59b777463c923e657ce25dba7c"
      },
      {
        "@entity": "250e26de559f75f158d193413b6a8a32" // 第三方邀请用户只有entity，设置时传entity
      }
    ]
  },
  "target-users": { // 广播布局应用对象
    "v-user": [
      {
        "@cmp-key": "allCastviewer", // 与type一致
        "type": "allCastviewer" // type取值范围：allPresenter(所有主持人)、allAttendee(所有与会者)、allApplicationsharing(所有辅流)、allCastviewer(所有广播方)、allRtmp(所有rtmp用户)、allRecord(所有录播用户)；其中，源对象不支持allCastviewer、allRtmp、allRecord，应用对象不支持allApplicationsharing，固定对象只支持allApplicationsharing
      },
      {
        "@cmp-key": "allRtmp",
        "type": "allRtmp"
      }
    ],
    "user": [
      {
        "@entity": "c78b4c59b777463c923e657ce25dba7c", // 有entity和uid信息的用户，传入用户entity或uid其中一个即可
        "uid": "c78b4c59b777463c923e657ce25dba7c"
      },
      {
        "@entity": "250e26de559f75f158d193413b6a8a32" // 第三方邀请用户只有entity，设置时传entity
      }
    ]
  },
  "appoint-users": { // 选定为固定视图的对象 固定位置中的人，必须在源对象中,如清除一个源对象，则固定位置中相应的位置也要清除。模式为2+N时至少设置一个固定对象；单方全屏模式时，也需设置一个固定对象，并且只能设置一个
    "appoint-view": [ // 根据布局模式，可设置多个固定位置
      {
        "@view-number": 1, // 设置固定位置的序号,如单方全屏只有一个默认为1,1+N模式大屏的位置为1,2+N模式大屏的位置为1和2
        "view-number": 1, // 同@view-number
        "v-user": [ // 固定位置可设置v-user或是某个用户user
          {
            "@cmp-key": "allApplicationsharing", // 与type一致
            "type": "allApplicationsharing" // 固定位置对象vuser只支持设置辅流 allApplicationsharing
          }
        ]
      },
      {
        "@view-number": 2, // 设置固定位置的序号,如单方全屏只有一个默认为1,1+N模式大屏的位置为1,2+N模式大屏的位置为1和2
        "view-number": 2, // 同@view-number
        "user": {
          "@entity": "2224390b7333e6eb8999ddd4e15896ba", // 设置固定位置为具体的用户，用户的entity,设置时传入entity或uid其中一个即可
          "uid": "2224390b7333e6eb8999ddd4e15896ba" // 用户的uid，可传entity即可
        }
      }
    ]
  }
}



const parttern2 = {
  '@id'     : 100,
  'enabled' : false,
};

const parttern3 = {
  '@id'     : 100,
  '@state'  : 'deleted', // 表示删除指定id的布局，目前应该某有这种情况。
  'enabled' : false,
};

const layout = [
  parttern,
  parttern2,
  parttern3
];

conference.information.view.setBroadcastLayout(layout)
  .then((result) => {
  // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

#### getDefaultFilter()
*  获取默认媒体过滤规则，全体成员

```js
const status = conference.view.getDefaultFilter()
```

#### setDefaultFilter()
*  设置默认媒体过滤规则,全体成员

```js
const options = {
  ingress : true, // true为mute false为unmute
  egress  : true  // true为闭音 false为解除闭音
}

conference.information.view.setDefaultFilter(options)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

#### getAttendeeFilter()
*  获取与会者媒体过滤规则

```js
const status = conference.view.getDefaultFilter()
```

#### setAttendeeFilter()
*  设置与会者媒体过滤规则

```js
const options = {
  ingress : true, // true为mute false为unmute
  egress  : true  // true为闭音 false为解除闭音
}

conference.information.view.setAttendeeFilter(options)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

#### setStudentAudioFilter()
*  设置学生禁言/解禁状态

```js
const ingress = false; // false为禁言 true为解禁

conference.information.view.setStudentAudioFilter(ingress)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  });
```

#### getSupervisionLayout()
*  获取会议监视的布局信息，监视布局的参数与广播布局基本一致

```js
conference.information.view.getSupervisionLayout()
  .then((result) => {
    // Your Code
    /*
    // 会议监视有三种布局：等分模式（默认，监视所有人），单方全屏（监视单人画面），成员视角（监视该成员看到的画面）
    // 布局的结构信息，仅列出有用参数
    result = [
      {
          '@id': 900,                       // 会议监视的布局id，不固定，每次加入都会产生一个id，设置时需保证id与下发的id一致
          '@state': 'full',
          'enabled': true,                  // 是否启用广播布局，会议监视中 等分模式/单方全屏属于广播布局，因此设置再这两种监视状态下enabled为true，如果需要监视成员视角，则enable需先设置为false
          'video-round-enabled': true,      // 视频画面轮询使能
          'video-layout': 'Exclusive',      // 布局 Equality-等分/Equality-单方
          'video-max-view': 16,             // 最大视图，支持 2*2 ~ 7*7
          'video-round-number': 1,          // 轮询数量 单张为1，否则与最大视图一样
          'appoint-users': {                // 单方全屏或成员视图时，看到的成员信息
              'appoint-view': {
                  '@view-number': 1,        // 固定位置，默认为1
                  'view-number': 1,         // 固定位置，默认为1
                  'user': {
                      '@entity': 'd624e647e10829a61fc2f98320d0132e', // 单方全屏的成员entity
                      '@cmp-key': '',
                      'display-text': '监视测试1',                    // 单方全屏的成员名称
                      'uid': ''                                      // 单方全屏的成员uid
                  }
              }
          }
      }
    ]
    */
  })
  .catch((e) => {
    // Your Code
  });
```

#### setSupervisionLayout()
*  设置会议监视的布局信息

```js
// 设置会议监视的参数与获取的参数一致，设置时仅需传入需要的设置的参数，未改变的参数可不传。
// 设置等分模式监视时 '@id'，'enabled'， 'video-round-enabled'， 'video-layout'，'video-max-view'， 'video-round-number' 这几个参数可能会涉及到
// 设置单方全屏监视时 '@id'，'enabled'，'video-layout'，'appoint-users' 这几个参数可能涉及
// 从成员视角监视切回等分模式或单方全屏时，需要将成员视角监视取消（参考成员视角监视设置接口）
// 同理从等分或单方全屏切换为成员视角监视时，需要先将广播布局关闭，即enabled需先取消设置为false，其他参数不用变，设置成功后才可设置成员视角画面参数
options = [
  {
      '@id': 900,                       // 会议监视的布局id，不固定，每次加入都会产生一个id，设置时需保证id与下发的id一致
      'enabled': true,                  // 是否启用广播布局，会议监视中 等分模式/单方全屏属于广播布局，因此设置再这两种监视状态下enabled为true，如果需要监视成员视角，则enable需先设置为false
      'video-round-enabled': true,      // 视频画面轮询使能
      'video-layout': 'Exclusive',      // 布局 Equality-等分/Equality-单方
      'video-max-view': 16,             // 最大视图，支持 2*2 ~ 7*7
      'video-round-number': 1,          // 轮询数量 单张为1，否则与最大视图一样
      'appoint-users': {                // 单方全屏或成员视图时，看到的成员信息
          'appoint-view': {
              '@view-number': 1,        // 固定位置，默认为1
              'view-number': 1,         // 固定位置，默认为1
              'user': {
                  '@entity': 'd624e647e10829a61fc2f98320d0132e', // 单方全屏的成员entity
                  '@cmp-key': '',
                  'display-text': '监视测试1',                    // 单方全屏的成员名称
                  'uid': ''                                      // 单方全屏的成员uid
              }
          }
      }
  }
]

conference.information.view.setSupervisionLayout()
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  })
```

#### setPerspective()
*  设置会议监视成员视角信息

```js
// 从成员视角切回等分模式/单方全屏监视前需将enable设置为false
const options = {
  enable : true,        // 开启成员视角
  user : 'xxxxxxxxxxx'  // 监视的成员视角所对应的用户entity
}

conference.information.view.setPerspective(options)
  .then((result) => {
    // Your Code
  })
  .catch((e) => {
    // Your Code
  })
```

### information.guests/invitees/relaties

* 访客(历史成员)\邀请成员\关联成员，三种结构相同，放到一起说明
* conference.information.invitees 为未入会成员相关的实例  conference.information.invitees 等价于 conference.invitees
* conference.information.guests 为历史入会成员相关的实例  conference.information.guests 等价于 conference.guests
* conference.information.relaties 为所有会议相关成员相关的实例  conference.information.relaties 等价于 conference.relaties

* 若使用SDK开发接入用于加入会议，这三类对象无需关注，其主要用于后台会控的使用。

#### userList
* 三种成员的用户列表
```js
// 会议访客列表（历史参会成员）
const guestList = information.guests.userList; 
// 会议邀请成员列表（未入会成员）
const inviteeList = information.invitees.userList; 
// 会议所有相关成员列表addUser
const relatiesList = information.relaties.userList; 
```

#### registered
* 列表中的成员是否注册
```js
const entity = 'user entity';
// 获取用户是否存在某个成员列表中
const guest = information.guests.getUser(entity);
const invitee = information.invitees.getUser(entity);
const relaties = information.relaties.getUser(entity);

// 假若用户存在,判断是否在线
guest.registered === false;     // 不在线
invitee.registered === true;    // 在线
relaties.registered === true;   // 在线
```

#### entity
* 列表用户的entity
```js
// 假设guest, invitee, relaties为getUser()获取的不同成员列表中user
guest.entity;
invitee.entity;
relaties.entity;
```
#### uid
* 列表用户的uid
```js
// 假设guest, invitee, relaties为getUser()获取的不同成员列表中user
guest.uid;
invitee.uid;
relaties.uid;
```

#### requestUri
* 列表用户的Uri
```js
// 假设guest, invitee, relaties为getUser()获取的不同成员列表中user
guest.requestUri;
invitee.requestUri;
relaties.requestUri;
```
#### displayText
* 列表用户的显示名称
```js
// 假设guest, invitee, relaties为getUser()获取的不同成员列表中user
guest.displayText;
invitee.displayText;
relaties.displayText;
```

#### role
* 列表用户的角色(主持人或访客)
```js
// 假设guest, invitee, relaties为getUser()获取的不同成员列表中user
guest.role;
invitee.role;
relaties.role;
```

#### confUserEntity
* 列表用户在会议中的entity
```js
// 假设guest, invitee, relaties为getUser()获取的不同成员列表中user
guest.confUserEntity;
invitee.confUserEntity;
relaties.confUserEntity;
```

#### getUser()
* 获取列表中的指定用户
```js
const entity = 'user entity';
// 获取用户是否存在某个成员列表中
const guest = information.guests.getUser(entity);
const invitee = information.invitees.getUser(entity);
const relaties = information.relaties.getUser(entity);
```

#### hasUser()
* 获取是否存在某个用户，true或false
```js
const entity = 'user entity';
// 获取用户是否存在某个成员列表中
const guest = information.guests.hasUser(entity);
const invitee = information.invitees.hasUser(entity);
const relaties = information.relaties.hasUser(entity);
```

#### invite()
* 直接将用户邀请入会
```js
// guest, invitee, relaties为已存在的user
// 直接邀请成员入会
guest.invite();
invitee.invite();
relaties.invite();
```

#### isCurrentUser()
* 判断用户是否为当前的用户，true或false
```js
// 假设guest, invitee, relaties为getUser()获取的不同成员列表中user
guest.isCurrentUser();
invitee.isCurrentUser();
relaties.isCurrentUser();
```

#### isOrganizer()
* 判断用户是否为组织者，true或false
```js
// 假设guest, invitee, relaties为getUser()获取的不同成员列表中user
guest.isOrganizer();
invitee.isOrganizer();
relaties.isOrganizer();
```


### information.answer

* conference.information.answer 为答题相关的实例，包含答题的接口调用
* conference.information.answer 等价于 conference.answer

#### info
* 会议通告的答题信息

```js
conference.answer.info;  // 在收到informationUpdated事件后读取更新后的数据

/* info的数据内容
{
  '@state'  : 'full',
  '@status' : 'ready',  // ready/start/stop
  '@sn'  : '10',
  '@type' : 'choice',
  'class' : [              // 可为多个班级
    {
      '@entity' : 'xxx',   // 班级entity
      'student' : [        // 可为多个学生
        {
          '@id' : '001',    // 学生id
          'name' : '小明',  // 学生姓名
          'answer : [       // 题目答案
            {
              '@sn' : '1',    // 题目sn
              'type' : 'choice', // 题目类型
              '#text' : 'A'     // 题目答案
            },
            {
              '@sn' : '2',
              'type' : 'multi-choice',
              '#text' : 'A,B'
            }
          ]
        }
      ]
    }
  ]
}

*/
```

#### start()
* 开始答题接口
```js
const options = {
  'type' : 'choice', // choice/multi-choice/true-or-false 答题类型：单选/多选/判断
  'time' : 1         // 答题时间，单位分钟，范围1~59
}
conference.answer.start(options)
  .then((data) => {
    // success
  })
  .catch((e) => {
    // failure
  })
```

#### stop()
* 结束答题接口
```js
conference.answer.stop()
  .then((data) => {
    // success
  })
  .catch((e) => {
    // failure
  })
```

#### setStudents()
* 设置学生信息接口
```js
const options = {
  'classEntity' : 'xxxxxx',   // 班级的entity  
  'students' : [
    {
      'id'       : '001',       // 学生id
      'name'     : '小明',      // 学生姓名
      'keypadId' : 'M30-000',   // 答题器设备ID
      'boardId'  : 'M40-000'    // 答题板设备ID
    },
    {
      'id'       : '003',       // 学生id
      'name'     : '张三',      // 学生姓名
      'keypadId' : 'M30-003',   // 答题器设备ID
    }
  ] 
}

conference.answer.setStudents(options)
  .then((data) => {
    // success
  })
  .catch((e) => {
    // failure
  })
```

#### uploadResult()
* 上传答题结果接口
```js
const options = {
  'sn'          : '1',        // 序号
  'type'      : 'choice',   // choice/multi-choice/true-or-false 答题类型：单选/多选/判断
  'classEntity' : 'xxxxxx',   // 班级的entity  
  'students' : [
    {
      'id'       : '001',       // 学生id
      'name'     : '小明',      // 学生姓名
      'answer'   : 'A,C',       // 答案
      'keypadId' : 'M30-000',   // 答题器设备ID 
      'boardId'  : 'M40-000'    // 答题板设备ID
    },
    {
      'id'       : '003',       // 学生id
      'name'     : '张三',      // 学生姓名
      'answer'   : 'B',         // 答案
      'keypadId' : 'M30-003',   // 答题器设备ID 
    }
  ] 
}

conference.answer.uploadResult(options)
  .then((data) => {
    // success
  })
  .catch((e) => {
    // failure
  })
```

#### setAnswer()

* 设置答案
  
```js
const options = {
  'sn' : 1,       // 题号
  'answer' : 'A'  // 答案
}

conference.answer.setAnswer(option)
  .then(() => {

  })
  .catch(() => {

  })

```

### information.privateData

* conference.information.privateData 为私有信息相关的实例
* conference.information.privateData 等价于 conference.privateData

#### internal
* 获取私有信息
```js
// 可访问到设置了的私有信息
conference.information.privateData.internal
```

#### modifyConferencePrivateData()
* 开始答题接口
```js
const options = {         // 自行定义数据，按照JSON格式
  'nameA' : 'selfdataA',
  'nameB' : 'selfdataB',
  'nameC' : 'selfdataC',
  'nameD' : 'selfdataD'
}

// 修改方法直接用conference调用
conference.modifyConferencePrivateData(options)
  .then((data) => {
    // success
  })
  .catch((e) => {
    // failure
  })
```
