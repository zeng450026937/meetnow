# 会议信息结构说明

* (+) = 表示可以有多个实例
* (E) = Extension，表示对RFC4575的拓展
* attr: 表示元素的属性

* conference-info(attr: entity, state, version)
  * conference-description
    * subject
    * note(E)
    * locations(E)
      * locations(+)
    * banner(E)
      * enabled
      * display-text
      * position
    * schedule-id(E)
    * profile(E)
    * conf-uris
      * entry(+)
        * uri
        * display-text
        * purpose
    * applicant(E)
      * uid
      * username
      * realm
      * display-text
    * organizer(E)
      * uid
      * username
      * realm
      * display-text
    * invitees(E)
      * invitee(+)
      * uid
      * username
      * realm
      * display-text
      * phone
      * role
      * domain
    * rtmp-invitees(E)
      * rtmp-invitee(E)(+)
        * enabled
        * session(+)(attr: session-type)
          * rtmp-url
          * mcu-session-type
          * max-video-fs
          * video-data-layout
          * web-share-url
    * conference-id(E)
    * conference-number(E)
    * conference-number-type(E)
    * presenter-pin(E)
    * attendee-pin(E)
    * maximum-user-count
    * start-time(E)
    * book-start-time(E)
    * book-expiry-time(E)
    * create-early(E)
    * recurrence-pattern(E)
    * admission-policy(E)
    * lobby-capable(E)
    * join-url(E)
    * autopromote(E)
    * server-mode(E)
    * hide-osd(E)
    * interactive-broadcast-enabled(E)
    * enterprise-id
    * video-enabled
    * ipcall-enabled
    * webrtc-enabled
    * record-server-type
    * record-privilege
    * auto-recording-enabled
  * conference-state
    * active
    * locked
    * applicationsharer
    * loop-volume-state
    * roll-call-status
  * users(attr: state, participant-count)
    * user(+)(attr: entity, state)
      * uid(E)
      * display-text(E)
      * protocol(E)
      * ip(E)
      * phone(E)
      * user-agent(E)
      * media-server-type(E)
      * roles
        * entry(+)
      * endpoint(+)(attr: entity, state, session-type)
        * status
        * mcu-call-id
        * joining-method
        * joining-info
          * when
        * media(+)(attr: id)
          * type
          * label
          * status
          * media-ingress-filter
          * media-egress-filter
  * record-users(E)(attr: state, participant-count)
    * user(+)(attr: entity, state)
      * uid(E)
      * display-text(E)
      * protocol(E)
      * ip(E)
      * phone(E)
      * user-agent(E)
      * roles
        * entry(+)
      * endpoint(+)(attr: entity, state, session-type)
        * status
        * mcu-call-id
        * joining-method
        * joining-info
          * when
        * media(+)(attr: id)
          * type
          * label
          * status
          * media-ingress-filter
          * media-egress-filter
      * record-type
      * record-status
      * record-duration
      * record-last-stop-duration
      * record-last-start-time
      * record-server-type
  * rtmp-users(E)(attr: state, participant-count)
    * user(+)(attr: entity, state)
      * display-text(E)
      * protocol(E)
      * ip(E)
      * roles
        * entry(+)
      * endpoint(+)(attr: entity, state, session-type)
        * status
        * mcu-call-id
        * joining-method
        * joining-info
          * when
        * rtmp-url
        * video-data-layout
        * max-video-fs
        * mcu-session-type
        * rtmp-type
        * rtmp-status
        * rtmp-duration
        * rtmp-last-stop-duration
        * rtmp-last-start-time
        * media(+)(attr: id)
          * type
          * label
          * status
          * media-ingress-filter
          * media-egress-filter
  * conference-view(E)(attr: state)
    * voice-prompt-enable
    * subtitle
    * entity-view(+)(attr: state, entity,uri)
      * entity-capabilities
      * entity-state
        * locked
        * mediaFiltersRules
          * initialFilters(+)(attr: entity)
            * role
            * ingressFilter
            * egressFilter
        * max-video-fs
        * max-video-fr
        * call-in-band
        * call-out-band
        * video-layout
        * video-max-view
        * video-presenter-layout
        * video-presenter-max-view
        * video-round-enabled
        * video-speech-ex-enabled
        * video-round-number
        * video-speech-ex-sensitivity
        * video-round-interval
        * entry-exit-announcements
          * enabled
        * video-big-round
        * video-big-position
        * video-data-mix-enabled
        * hide-osd-sitename
        * osd-sitename-font-size
        * osd-sitename-font-color
        * hide-osd-sitestatus
        * osd-position
        * video-broadcast-layout(E)(attr: state)
          * video-broadcast-layout-pattern(E)(+)(attr: id,state)
            * enabled
            * video-round-enabled
            * video-speech-ex-enabled
            * video-layout
            * video-max-view
            * video-big-view
            * video-round-number
            * source-users
              * all_presenter
              * all_attendee
              * user(+)(attr: entity)
                * uid
                * account-type
            * target-users
              * all_presenter
              * all_attendee
              * user(+)(attr: entity)
                * uid
                * account-type
            * appoint-users
              * appoint-view(+)
                * view-number
                * user(+)(attr: entity)
                  * uid
                  * account-type

---

* attribute属性
  * entity

    标识会议的conference-uri，目前取focus通道URI；
  * state

    有三种值，full表示完整信息，partial表示部分发生改变了的信息；deleted表示被删除的信息;

    由于会议中成员可能较多，为避免会议通告造成过多的负载，所以会议支持一种“部分通告机制”，用state=full，partial，deleted表示，WEB、客户端要能根据通告的信息自己完善会议信息，支持部分通告机制的有以下元素：

    * conference-info
    * users
    * user
    * record-users
    * rtmp-users
    * endpoint
    * conference-view
    * entity-view

    部分通告机制主要的规则如下：
    一个元素的状态是full，则它的所有子元素的状态也必须是full；
    一个元素的状态是partial，则它的子元素的状态可以是full，partial，deleted
    一个元素的状态是deleted，则它不能包含子元素或者子元素是失效的；

  * version

    从1开始增加的整型数，用户收到通告时，需要判断version大小：如果version小于当前，说明是旧的通告消息，则丢弃掉；如果发生跳增，说明用户漏掉了某一个通告，则用户需要通过getConference重新获取完整的conference-info信息；

---

## conference-description

conference-description用于描述一个会议整体的信息，包括会议进入信息、控制策略等；

* subject `会议主题`
* note `会议备注`
* locations `会议地点，可以有多个`
  * location `会议地点`
* banner `横幅`
  * enabled `是否使能横幅`
  * display-text `横幅内容`
  * position `横幅显示位置，顶部top | 中间medium | 底部bottom`
* schedule-id `预约会议对应的日程id，由会议ID和时间组成如85004_20170910`
* profile `会议模式，普通模式为default，主席模式为demonstrator`
* conf-uris `会议的通道URIs，可以由多个entry，每个entry包含一个通道URI，如audio-video通道：`

  ```xml
  <entry entity="audio-video" >
    <uri>sip:Conference_66666@fs.5060.space;opaque=app:conf:audio-video:id:66666</uri>
    <display-text>audio-video</display-text>
    <purpose>audio-video</purpose>
  </entry>
  ```

* applicant `即会议申请者信息，包含以下信息，uid、username、realm和display-text`
* organizer `即会议组织者信息，包含以下信息，uid、username、realm和display-text`

  ```xml
  <organizer>
    <display-text>1323</display- text >
    <uid>907defe73f7e4479987fe7b0dcd67dd9</uid>
    <username>1323</username>
    <realm>pbx.leucs.com</realm>
  </organizer>
  ```

* invitees`预约邀请者信息`
  * invitee`预约邀请者，包含以下信息：`
  * invitees(E)
    * invitee(+)
    * uid
    * username
    * realm
    * display-text
    * phone
    * role
    * domain
* rtmp-invitees`预约RTMP直播信息`
  * rtmp-invitee `预约RTMP直播用户，包含多个session`
    * enabled `是否启用RTMP直播，true/false`
    * session `一个RTMP直播session，包含一个推流信息`
      * rtmp-url `RTMP推流地址，如rtmp://xxx`
      * mcu-session-type `推流的媒体类型，音频为Audio，视频为Video，辅流为Data，可以随意组合，如AV表示音视频，AD表示音频和辅流，AVD表示音视频加辅流`
      * max-video-fs `推流的分辨率，如720P，360P`
      * video-data-layout `推流的视频辅流布局，VideoBig表示视频大辅流小，DataBig表示辅流大视频小`
      * web-share-url `用于分享的RTMP直播观看地址`
      * show-electronic-nameplate `电子铭牌 V24新增参数`
      * show-speaker-details `发言者详情 V24新增参数`
      * password `开启验证时密码不能为空 V24新增参数`
      * verify-login `开启登录验证 V24新增参数`
      * verify-password `开启密码验证 V24新增参数`
* conference-id `表示会议的会议ID`
* conference-number `分配给会议的Number，用于IVR接入`
* conference-number-type `会议类型，即时会议meetnow，预约会议recurrence，固定VMR会议vmr`
* presenter-pin `会议主持人PIN码，使用该PIN码入会的成员，入会后身份为主持人`
* attendee-pin `会议与会者PIN码，使用该PIN码入会的成员，入会后身份为与会者，attendee-pin和presenter-pin码相同时，入会后身份为与会者`
* maximum-user-count `表示会议容量，是一个整型数`
* start-time `会议开始时间,会议为进行中状态的时间，虚拟会议室所有人退出后会议即结束，有人重新加入后会议会重新开始，会议开始时间即该参会成员重新加入时间`
* book-start-time `预约会议开始时间,只有预约会议才有，虚拟会议室没有`
* book-expiry-time `预约会议结束时间，只有预约会议才有，虚拟会议室没有`
* reminder-early `会议提醒时间，表示会议开始前多久推送提醒，如5/10/15`
* create-early `会议提前创建时间，表示会议预约时间开始前多久提前创建，如5/10/15`
* recurrence-pattern `预约会议重复周期`
* admission-policy `表示哪些人在会议没有locked锁住时，可以直接加入会议，有以下三个值：`
  1. closedAuthenticated：`表示主持人邀请的用户`
  2. openAuthenticated：`表示与组织者同一个域或者联盟内的用户`
  3. anonymous：`表示任何人都可以加入会议`
* lobby-capable `暂不使用`
* join-url `一个HTTP URL，包含组织者信息和会议ID信息，如https://meet.yealinkuc.com/80096/51CT2SL1`
* autopromote `表示哪些人加入之后可以成为主持人，这个是一个整型值，有三种情况：`
  1. None：0 `由组织者安排主持人`
  2. Everyone所有人：2147483648 `默认值，转为二级制即0x80000000(bit 31)`
  3. Company(同一个域或者联盟内的)： `32768转为二进制即0x00008000(bit 15)`
* server-mode `会议模式,预留`
* hide-osd `是否隐藏OSD，true为开启，默认为false`
* interactive-broadcast-enabled `是否开启广播互动，true为开启，开启后主持人为互动方，与会者为广播方；默认为false`

---

## conference-state

主要用于描述会议的状态

* active `会议状态，true为激活状态`
* locked `会议锁住，不再添加成员`

---

## users

主要描述会议内成员信息，包括与会身份、endpoint通道信息等。

* attribute
  * state `部分通告机制full，partial，deleted`
  * participant-count `表示成员的数量`

* user `表示一个成员的信息，可以有多个实例；支持部分通告机制`
  * attribute
    * state `部分通告机制full，partial，deleted`
    * entity `用户标识，目前取用户的pub gruu`
  * uid `Apollo账号系统中的用户ID`
  * display-text `用户显示名字display-text`
  * protocol `用户入会使用的协议，如SIP，H323，RTMP`
  * ip `用户IP地址`
  * phone `用户加入会议使用的号码`
  * user-agent `客户端User-Agent`
  * roles `可以有多个entry，每个entry含义不一样，根据entity属性区分，包括与会身份、演讲身份和主席模式下主持人看到布局中的演讲者身份`
    1. entity=permission`表示与会身份，主要用于区分会议权限，分三种：组织者organizer(UI显示时也显示为主持人)，主持人presenter，与会者attendee，观众为castviewer`
    2. entity=demostate`表示演讲身份，主要用于在一个独占Exclusive布局和Presentation布局中表示是否在台上演讲，分两种，演讲者demonstrator和观众audience`
    3. entity=presenter-demostate`表示主席模式下，主持人看到的布局中的演讲者身份`

    ```xml
    <roles>
      <entry entity="permission">presenter</entry>
      <entry entity="demostate">demonstrator</entry>
      <entry entity="presenter-demostate">audience</entry>
    </roles>
    ```

* endpoint `表示用户建立的一个通道的信息，可以有focus、audio-video、applicationsharing、chat通道`

  ```xml
  <endpoint
    entity="0458E084-0BD6-45A1-BC95-1AD079B4776D"
    state="full"
    session-type="audio-video" >
    <status>connected</status>
    <mcu-call-id>connected</mcu-call-id>
    <joining-method>dialed-in</joining-method>
    <joining-info>
        <when>2016-10-12T12:30:54Z</when>
    </joining-info>
    <media id="1">
        <type>audio</type>
        <label>main-audio</label>
        <status>sendrecv</status>
        <media-ingress-filter>unblock</media-ingress-filter>
        <media-egress-filter>unblock</media-egress-filter>
    </media>
    <media id="2">
      <type>video</type>
      <label>main-video</label>
      <status>sendrecv</status>
    </media>
    <media id="5">
      <type>application</type>
      <label>bfcp</label>
      <status>sendrecv</status>
    </media>
    <media id="3">
      <type>video</type>
      <label>applicationsharing</label>
      <status>recvonly</status>
    </media>
  </endpoint>
  ```

  * attribute
    * entity `由服务器上生成，分配给每个endpoint的一个uuid`
    * state `支持部分通告机制`
  * session-type `endpoint所属的通道类型，如focus，audio-video`
  * endpoint-uri `endpoint所属的用户的SIP URI`
  * status `通道状态，on-hold表示被锁住，如果开启lobby大厅，则表示用户被安排在lobby大厅，connected表示已连接，disconnected表示已断开`
  * mcu-call-id `通道对应的MCU Call ID`
  * joining-method `表示加入会议的方式，分为dialed-in和dialed-out`
  * joining-info `加入信息，这里主要是一个加入会议的时间点`
  * media `表示一种媒体，可以有多个，这一部分的同RFC4566 SDP中的定义`
    * attribute
      * id `服务器上分配的media id`
    * type `表示媒体类型，同SDP中的media类型`
    * label `表示媒体标签，如main-audio`
    * status `表示媒体方向，"sendrecv"，"sendonly"，"recvonly"和"inactive"`
    * media-ingress-filter `表示是否允许媒体混入，block即表示Mute，unblock表示取消Mute，unblocking表示举手`
    * media-egress-filter `表示是否允媒体输出，block即表示闭音，unblock表示取消解闭音`

## record-users

record-users的数据信息结构和users一样，但和普通参会成员users分开，主要是录播用户不会显示给终端；

## rtmp-users

主要描述会议内RTMP直播成员信息，和users分开，主要是RTMP直播不会显示给终端。

* attribute
  * state `部分通告机制full，partial，deleted`
  * participant-count `表示成员的数量`
* user `表示一个成员的信息，可以有多个实例；支持部分通告机制`
  * attribute
    * state `部分通告机制full，partial，deleted`
    * entity `用户标识，目前取用户的pub gruu`
  * protocol `用户入会使用的协议，如SIP，H323，RTMP`
  * ip `用户IP地址`
  * roles `可以有多个entry，每个entry含义不一样，根据entity属性区分，包括与会身份、演讲身份和主席模式下主持人看到布局中的演讲者身份`
    1. entity=permission`表示与会身份，主要用于区分会议权限，分三种：组织者organizer(UI显示时也显示为主持人)，主持人presenter，与会者attendee，观众为castviewer`
    2. entity=demostate`表示演讲身份，主要用于在一个独占Exclusive布局和Presentation布局中表示是否在台上演讲，分两种，演讲者demonstrator和观众audience`
    3. entity=presenter-demostate`表示主席模式下，主持人看到的布局中的演讲者身份`

    ```xml
    <roles>
      <entry entity="permission">presenter</entry>
      <entry entity="demostate">demonstrator</entry>
      <entry entity="presenter-demostate">audience</entry>
    </roles>
    ```
  * endpoint `表示用户建立的一个通道的信息，可以有focus、audio-video、applicationsharing、chat通道，rtmp直播没有media信息`

    ```xml
    <endpoint
    entity="0458E084-0BD6-45A1-BC95-1AD079B4776D"
    state="full"
    session-type="audio-video" >
        <status>connected</status>
        <joining-method>dialed-in</joining-method>
        <joining-info>
            <when>2016-10-12T12:30:54Z</when>
        </joining-info>
    </endpoint>
    ```

    * attribute
      * entity `由服务器上生成，分配给每个endpoint的一个uuid`
      * state `支持部分通告机制`
      * session-type `endpoint所属的通道类型，如focus，audio-video`
      * endpoint-uri `endpoint所属的用户的SIP URI`
    * status `通道状态，on-hold表示被锁住，如果开启lobby大厅，则表示用户被安排在lobby大厅，connected表示已连接，disconnected表示已断开`
    * mcu-call-id `通道对应的MCU Call ID`
    * joining-method `表示加入会议的方式，分为dialed-in和dialed-out`
    * joining-info `加入信息，这里主要是一个加入会议的时间点`
    * rtmp-url `RTMP推流地址，如rtmp://xxx`
    * mcu-session-type `推流的媒体类型，音频为Audio，视频为Video，辅流为Data，可以随意组合，如AV表示音视频，AD表示音频和辅流，AVD表示音视频加辅流`
    * max-video-fs `推流的分辨率，如720P，360P`
    * video-data-layout `推流的视频辅流布局，VideoBig表示视频大辅流小，DataBig表示辅流大视频小`
    * media `添加media，是为了方便会控时可以服用闭音、闭视频控制等`

---

## conference-view

主要描述会议全局的通道信息；

* attribute
  * state `部分通告机制full，partial，deleted`
* entity-view `表示具体的某一个通道的信息，支持部分通告机制`
  * entity-capabilitie `表示MCU的能力，比如说audio-video支持audio和video`
  * entity-state `表示MCU状态信息，包括过滤规则，媒体规则等`
    * mediaFiltersRules `表示媒体过滤规则，可以有多条`
      * mediaFiltersRules `表示一个媒体过滤规则`，
        * role，表示规则适用的范围 `default表示默认，attendee表示所有与会者`
        * ingressFilter `表示媒体输入MCU方向，block表示Mute，unblock表示UnMute`
        * egressFilter `表示MCU媒体输出方向，block表示闭音，unblock表示解闭音`
    * locked `表示Lobby大厅是否开启`
    * max-video-fs `表示视频分辨率`
    * max-video-fr `表示视频帧率`
    * call-in-band `上行带宽`
    * call-out-band `下行带宽`
    * video-layout `表示视频布局，有四种布局：平等模式Equality，主席模式Presentation，语音激励模式SpeechExcitation，单方全屏Exclusive`
    * video-max-view `表示最大显示视图数`
    * presenter-video-layout `表示支持人看到的视频布局，有三种布局：平等模式Equality，语音激励模式SpeechExcitation，单方全屏Exclusive`
    * video-presenter-max-view `表示主持人布局的最大显示画面`
    * video-round-enabled `是否使能视频轮询`
    * video-speech-ex-enabled `是否使能语音激励`
    * video-round-number `视频轮询张数`
    * video-speech-ex-sensitivity `语音激励时间`
    * video-round-internal `视频轮询间隔`
    * entry-exit-announcements `表示成员加入、退出会议的语音通告`
      * enabled `表示是否开启，true/false`
    * video-broadcast-layout `广播布局`
      * video-broadcast-layout-pattern `广播布局模板`
        * attribute：
          * id `广播布局模板id`
          * state `部分通告机制full，partial，deleted`
        * enabled `是否使能广播布局`
        * video-round-enabled `是否使能视频轮询`
        * video-speech-ex-enabled `是否使能语音激励`
        * video-layout `广播布局使用的布局`
        * video-max-view `布局最大视图数 ，如1+4布局为(1+4=5)`
        * video-big-view `布局大图视图数，如2+N布局为2`
        * source-users `广播布局源对象`
        * target-users `广播布局应用对象`
        * appoint-users `选定为固定视图的对象`