# ApollopSIP

ApolloSIP库用于快速接入加入到会议中，或者进行会议控制

# 加入会议

如果需要实现WebRTC入会，用户需要熟悉UA、Conference、MediaChannel、Channel章节，
同时用户需要知道如何使用Web API获取当前终端的音视频设备，并通过我们提供的接口，设置本地音视频（摄像头及麦克风）以及音频输出（扬声器），具体参考MediaChannel的介绍

# 会议控制

如果需要对会议进行功能控制，用户需要额外熟悉information、record、rollcall、rtmp、lobby等章节

# 退出会议

注意：加入会议后，如果需要退出，需调用断开的接口，确保服务器收到退出的指令，否则可能导致会议的成员信息更新不及时，数据不准确

# Demo

我们提供示例包含了：注册UA、连接会议、以及加入会议后远端及本地的视频展示、退出会议等操作，通过示例可以方便地了解ApolloSIP的使用

# conference_object

conference_object文档是关于会议通告的数据，conference.information里的数据结构来源于conference_object，通过conference_object可以了解会议信息相关的说明
