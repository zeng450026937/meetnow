# conference.record #
成功加入会议后，conference实例的record主要用来进行录制的会议控制

## Instance Attributes
```js
// conference为已连接会议的会议实例
const record = conference.record;
```

### userList
```js
// 录播的用户列表，录播用户和普通参会用户的Object基本一致的，除了一些自有属性有差异
const recordUser = record.userList;
```

### status
```js
// 会议的默认录播用户的状态
const status =  record.status;
```

## Instance Methods

### getUser()
* 获取当前某个录播用户是否存在
```js
const entity = 'recordUser entity'; // 录播用户的entity

const user = conference.record.getUser(entity);
```

### hasUser()
* 判断指定的录播用户是否存在

```js
const entity = 'recordUser entity'; // 录播用户的entity

const user = conference.record.hasUser(entity);
```

### start()
* 录制开始
```js
//录播参数
const version = 'V20';  // 版本分V20和V21 两版本参数不同，版本未制定默认调用V20接口
const options = {
  requestUri  : 'uri',  // V20参数 请求uri 可以不指定requestUri，表示使用系统默认录播系统，由FS向后端申请资源并进行邀请
  displayText : 'text', // V20参数 显示名称
  type : 'frontend',    // V21参数,录制类型,取值：frontend：前端录播，用户可感知操作的录播；backend：后台录播，如强制录播  
  recordFileName: ''    // V21参数,指定录播文件名
};

conference.record.start(options, version)
 .then((result) => {
   // Your Code
 })
 .catch((e) => {
   // Your Code
 });
```

### stop()
* 录制结束

```js
const version = 'V20';       // 版本分V20和V21 两版本参数不同，版本未制定默认调用V20接口
const userEntity = 'entity'; // 录播用户的entity, V20 结束支持结束多个用户，其余不支持多个用户,可以不指定userEntity，表示stop默认录播用户; V21支持需指定用户，必须传入录播用户的entity

// V20
conference.record.stop(
  [ userEntity ], 
  version
  )
 .then((result) => {
   // Your Code
 })
 .catch((e) => {
   // Your Code
 });

 // V21
conference.record.stop(userEntity, version)
 .then((result) => {
   // Your Code
 })
 .catch((e) => {
   // Your Code
 });
```

### pause()
* 录制暂停

```js
const userEntity = 'entity'; // 录播用户的entity
const version = 'V20';       // 版本分V20和V21 两版本参数不同，版本未制定默认调用V20接口

// V20可以不指定userEntity，表示hold默认录播用户
// V21支持需指定用户，必须传入录播用户的entity
conference.record.pause(userEntity, version)
 .then((result) => {
   // Your Code
 })
 .catch((e) => {
   // Your Code
 });
```

### resume()
* 录制继续

```js
const userEntity = 'entity'; // 录播用户的entity
const version = 'V20';       // 版本分V20和V21 两版本参数不同，版本未制定默认调用V20接口

// V20可以不指定userEntity，表示resume默认录播用户
// V21支持需指定用户，必须传入录播用户的entity
conference.record.resume(userEntity, version)
 .then((result) => {
   // Your Code
 })
 .catch((e) => {
   // Your Code
 });
```

### getRecordList()
* 查询录制列表
```js
const params = {
  'conferenceRecordId' : 'x',  // recordID，会议信息可获取到
  'enterpriseId'       : 'x'   // 企业ID
};

// 可以不指定userEntity，表示resume默认录播用户
conference.record.getRecordList(params)
 .then((result) => {
    // result返回的信息
    /* 
    {
      'ret': 2,
      'data': {
      'skip': null,
      'limit': null,
      'total': 0,
      'autoCount': false,
      'orderbys': [
        {
        'field': 'createTime',
        'order': -1
        }
      ],
      'data': [
        {
          'createTime': 1533002657496, //录制开始时间
          'modifyTime': 1533002657496,
          'deleted': false,
          '_id': 'c9507cecc2504107a272d6ba1a2d7bb5',
          'conferenceRecordId': '02dd9b892ac747bfa35ca5061d65d598',
          'recordingFileName':
          'http://124.72.94.27:80/ss/file/download/[in]test[2018-07-31-10-08-32][2018-07-
          31-10-08-32].mp4\n', //录播文件存放路径
          'conferenceSubject': 'api', //会议主题
          'enterpriseId': 'f4a4a4ee02ac4bb8875bbd08e03d4de0', //企业id
          'recordingTime': 1443, //录像时间
          'id': 'c9507cecc2504107a272d6ba1a2d7bb5'
        },
        {
          'createTime': 1533001085622,
          'modifyTime': 1533001085622,
          'deleted': false,
          '_id': '935ba8eadc44495a946c5039700b93fa',
          'conferenceRecordId': '02dd9b892ac747bfa35ca5061d65d598',
          'recordingFileName':
          'http://124.72.94.27:80/ss/file/download/[in]test[2018-07-31-10-06-03][2018-07-
          31-10-06-03].mp4\n',
          'conferenceSubject': 'api',
          'enterpriseId': 'f4a4a4ee02ac4bb8875bbd08e03d4de0',
          'recordingTime': 18,
          'id': '935ba8eadc44495a946c5039700b93fa'
        }
      ],
      'key': null,
      'conferenceRecordId': '02dd9b892ac747bfa35ca5061d65d598',
      'enterpriseId': 'f4a4a4ee02ac4bb8875bbd08e03d4de0'
      },
      'error': null
    }
    */
 })
 .catch((e) => {
   // Your Code
 });
```
