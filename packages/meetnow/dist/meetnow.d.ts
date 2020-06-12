import axios from 'axios';
import { AxiosInstance } from 'axios';
import { AxiosPromise } from 'axios';
import { AxiosRequestConfig } from 'axios';
import debug from 'debug';
import { Method } from 'axios';

declare type ActionType = 'PanLeft' | 'PanRight' | 'TiltDown' | 'TiltUp' | 'ZoomOut' | 'ZoomIn' | 'FocusOut' | 'FocusIn';

export declare function adapter(config: AxiosRequestConfig): AxiosPromise;

declare interface Api {
    readonly interceptors: AxiosInstance['interceptors'];
    request: <T extends ApiNames = ApiNames>(apiName: T) => Request<ApiDataMap[T], ApiParamsMap[T], ApiHeaderMap[T]>;
    delegate: AxiosInstance;
}

declare interface ApiDataMap {
    [apiName: string]: any;
    'login': {
        'principle': string;
        'mobileCode'?: string;
        'credential': string;
        'number'?: string;
        'accountType'?: '0' | '1' | '9';
    };
    'selectAccount': {};
    'logout': {};
    'refreshToken': {};
    'sendMobileLoginVerifyCode': {
        'mobileNo': string;
        'mobileCode'?: string;
    };
    'polling': CtrlApiData & {
        'version': number;
    };
    'keepalive': CtrlApiData;
    'rejectLobbyUserAll': CtrlApiData;
    'acceptLobbyUserAll': CtrlApiData;
    'acceptLobbyUser': CtrlApiData & {
        'user-entity': string;
    };
    'waitLobbyUserAll': CtrlApiData;
    'waitLobbyUser': CtrlApiData & {
        'user-entity': string;
    };
    'holdUser': CtrlApiData & {
        'user-entity': string;
    };
    'holdUserAll': CtrlApiData;
    'muteAll': CtrlApiData;
    'unmuteAll': CtrlApiData;
    'rejectHandupAll': CtrlApiData;
    'deleteUser': CtrlApiData & {
        'user-entity': string;
    };
    'setFocusVideo': CtrlApiData & {
        'user-entity': string;
    };
    'setSpeakMode': CtrlApiData & {
        'speak-mode': 'free' | 'hand-up';
    };
    'setFreeLayout': CtrlApiData & {
        'video-layout': 'Equality' | 'SpeechExcitation' | 'Exclusive';
        'speech-excitation-video-big-view'?: number;
        'speech-excitation-video-max-view'?: number;
        'equality-video-max-view'?: number;
        'ext-video-as-focus': number;
        'speech-excitation-video-round-enabled'?: boolean;
        'speech-excitation-video-round-number'?: number;
        'speech-excitation-video-round-interval'?: number;
        'equality-video-round-enabled'?: boolean;
        'equality-video-round-number'?: number;
        'equality-video-round-interval'?: number;
    };
    'setCustomizeLayout': CtrlApiData & {
        'enable'?: boolean;
        'viewer'?: 'presenter' | 'attendee' | 'castviewer';
        'video-layout': 'Equality' | 'SpeechExcitation' | 'Exclusive';
        'speech-excitation-video-big-view'?: number;
        'speech-excitation-video-max-view'?: number;
        'equality-video-max-view'?: number;
        'ext-video-as-focus'?: number;
        'speech-excitation-video-round-enabled': boolean;
        'speech-excitation-video-round-number': number;
        'speech-excitation-video-round-interval': number;
        'equality-video-round-enabled'?: boolean;
        'equality-video-round-number'?: number;
        'equality-video-round-interval'?: number;
        'applied-to-attendee': boolean;
        'applied-to-cast-viewer': boolean;
        'selected-user-entity'?: string[];
        'pos'?: number;
        'entity'?: string;
    };
    'setGlobalLayout': CtrlApiData & {
        'hide-osd-site-name': boolean;
        'hide-osd-site-icon': boolean;
    };
    'setFecc': CtrlApiData & {
        'user-entity': string;
        'action': string;
    };
    'setTitle': CtrlApiData & {
        'position': string;
        'type': string;
        'display-time': number;
        'repeat-count': number;
        'repeat-interval': number;
        'roll-direction': string;
    };
    'sendTitle': CtrlApiData & {
        'display-text': string;
        'all-presenter': boolean;
        'all-attendee': boolean;
        'all-castviewer': boolean;
    };
    'setRecord': CtrlApiData & {
        'operate': string;
    };
    'setRTMP': CtrlApiData & {
        'operate': string;
    };
    'getFullInfo': CtrlApiData;
    'getBasicInfo': CtrlApiData & {
        'conference-url': string;
    };
    'getBasicInfoOffline': CtrlApiData & {
        'long-number': string;
    };
    'getURL': {
        'long-number': string;
    };
    'pushMessage': CtrlApiData & {
        'user-entity-list'?: string[];
        'im-context': string;
    };
    'pullMessage': CtrlApiData & {
        'count'?: number;
    };
    'joinFocus': {
        'conference-url': string;
        'conference-pwd'?: string;
        'user-agent'?: string;
        'client-url'?: string;
        'client-display-text'?: string;
        'client-type': string;
        'client-info'?: string;
        'pure-ctrl-channel': boolean;
        'is-webrtc'?: boolean;
        'is-wechat'?: boolean;
    };
    'joinWechat': {
        'conference-url': string;
        'conference-pwd'?: string;
        'user-agent'?: string;
        'client-url'?: string;
        'client-display-text'?: string;
        'client-type': string;
        'client-info'?: string;
        'pure-ctrl-channel': boolean;
        'is-webrtc'?: boolean;
        'is-wechat'?: boolean;
        'video-session-info': {
            'bitrate': number;
            'video-width': number;
            'video-height': number;
            'frame-rate': number;
        };
    };
    'joinMedia': CtrlApiData & {
        'sdp': string;
    };
    'renegMedia': CtrlApiData & {
        'sdp': string;
    };
    'joinShare': CtrlApiData & {
        'sdp': string;
    };
    'switchShare': CtrlApiData & {
        share: boolean;
    };
    'leaveShare': CtrlApiData & {};
    'renegShare': CtrlApiData & {
        'sdp': string;
        'media-version': number;
    };
    'inviteUser': CtrlApiData & {
        'uid'?: string[];
        'sip-url'?: string;
        'h323-url'?: string;
    };
    'setUserMedia': CtrlApiData & {
        'user-entity': string;
        'endpoint-entity': string;
        'media-id': number;
        'media-ingress-filter'?: 'block' | 'unblocking' | 'unblock';
        'media-egress-filter'?: 'block' | 'unblocking' | 'unblock';
    };
    'setUserRole': CtrlApiData & {
        'user-entity': string;
        'role': 'attendee' | 'presenter';
    };
    'setUserDisplayText': CtrlApiData & {
        'user-entity': string;
        'display-text': string;
    };
    'getStats': CtrlApiData & {
        'user-entity-list': string[];
    };
    'setLock': CtrlApiData & {
        'admission-policy': 'openAuthenticated' | 'anonymous' | 'closedAuthenticated';
        'attendee-lobby-bypass': boolean;
    };
    'leave': CtrlApiData & {
        'reason-code': number;
        'reason-text': string;
        'bizCode': number;
    };
    'end': {
        'conference-url': string;
    };
}

declare interface ApiHeaderMap {
    [apiName: string]: any;
}

declare type ApiNames = keyof typeof configs;

declare interface ApiParamsMap {
    [apiName: string]: any;
    'getVirtualJWT': {
        id: string;
    };
    'getConferenceInfo': {
        conferenceNo: string;
        searchNotStartedScheduledConference?: boolean;
        filterByRegionInfo?: boolean;
    };
}

declare interface ApplicationSharer extends Partialable {
    'user'?: ConferenceUser & {
        'share-type': ShareType;
    };
}

declare type Authentication = {
    readonly token?: string;
    api: Api;
    worker: Worker;
    invalid: () => Promise<void>;
};

declare interface AuthInfo {
    'principle': string;
    'credential': string;
    'enterprise'?: string;
    'areacode'?: string;
    'authtype'?: AuthType;
}

export declare enum AuthType {
    email = "0",
    mobile = "1",
    verifycode = "9"
}
export { axios }

export declare function bootstrap(auth: AuthInfo): Promise<{
    account: any;
    identities: Identity[];
}>;

declare interface CameraCtrl {
    action: (type: ActionType) => Promise<void>;
    left: () => Promise<void>;
    right: () => Promise<void>;
    down: () => Promise<void>;
    up: () => Promise<void>;
    zoomout: () => Promise<void>;
    zoomin: () => Promise<void>;
    focusout: () => Promise<void>;
    focusin: () => Promise<void>;
}

declare interface Channel extends Events {
    readonly status: STATUS;
    readonly connection?: RTCPeerConnection;
    readonly startTime?: Date;
    readonly endTime?: Date;
    getConnectOptions: () => ParsedConnectOptions;
    isInProgress: () => boolean;
    isEstablished: () => boolean;
    isEnded: () => boolean;
    getMute: () => ChannelMuteOptions;
    getHold: () => ChannelHoldOptions;
    connect: (options?: ConnectOptions_2) => Promise<void>;
    terminate: (reason?: string) => Promise<void>;
    renegotiate: (options?: RenegotiateOptions) => Promise<void>;
    mute: (options?: ChannelMuteOptions) => void;
    unmute: (options?: ChannelMuteOptions) => void;
    hold: () => Promise<void>;
    unhold: () => Promise<void>;
    getRemoteStream: () => MediaStream | undefined;
    getLocalStream: () => MediaStream | undefined;
    replaceLocalStream: (stream?: MediaStream | undefined, renegotiation?: boolean) => Promise<void>;
    adjustBandWidth: (options: {
        audio?: number | undefined;
        video?: number | undefined;
    }) => Promise<void>;
    applyConstraints: (options: {
        audio?: MediaTrackConstraints | undefined;
        video?: MediaTrackConstraints | undefined;
    }) => Promise<void>;
    getStats: () => Promise<RTCStats>;
}

declare interface ChannelHoldOptions {
    local: boolean;
    remote: boolean;
}

declare interface ChannelMuteOptions {
    audio: boolean;
    video: boolean;
}

declare interface ChatChannel extends Events {
    ready: boolean;
    connect: (count?: number) => Promise<void>;
    terminate: () => Promise<void>;
    sendMessage: (msg: string, target?: string[]) => Promise<Message>;
    incoming: (data: MessageData) => Message;
}

declare interface ConfereceUri {
    'entity': 'focus' | 'audio-video' | 'applicationsharing';
    'uri': string;
    'display-text': string;
    'purpose': string;
}

declare interface ConfereceUris {
    'entry': ConfereceUri[];
}

declare interface Conference extends Events {
    readonly api: Api;
    readonly url?: string;
    readonly uuid?: string;
    readonly userId?: string;
    readonly user?: User;
    readonly information?: Information;
    readonly description?: Description;
    readonly state?: State;
    readonly view?: View;
    readonly users?: Users;
    readonly rtmp?: RTMP;
    readonly record?: Record;
    readonly mediaChannel?: MediaChannel;
    readonly shareChannel?: MediaChannel;
    readonly chatChannel?: ChatChannel;
    readonly trtc?: any;
    join: (options?: Partial<JoinOptions>) => Promise<Conference>;
    leave: () => Promise<Conference>;
    end: () => Promise<Conference>;
    share: (options?: ConnectOptions_2) => Promise<void>;
    setSharing: (enable?: boolean) => Promise<void>;
    sendMessage: (msg: string, target?: string[]) => Promise<void>;
}

declare interface ConferenceDescription extends Partialable {
    'subject': string;
    'start-time': string;
    'start-time-unix': number;
    'profile': 'conference' | string;
    'record-id': string;
    'conf-uris': ConfereceUris;
    'conf-info-url': string;
    'organizer': Organizer;
    'conference-id': string;
    'conference-number': string;
    'enable-svc': boolean;
    'enterprise-id': string;
    'enterprise-number': string;
    'conference-long-no': string;
    'conference-type': 'vmr' | string;
    'is-recurrence': boolean;
    'book-start-time': string;
    'book-expiry-time': string;
    'presenter-pin': string;
    'attendee-pin': string;
    'maximum-user-count': string;
    'admission-policy': 'anonymous' | 'closedAuthenticated' | 'openAuthenticated';
    'lobby-capable': boolean;
    'attendee-by-pass': boolean;
    'interactive-broadcast-enabled': boolean;
    'video-enabled': boolean;
    'ipcall-enabled': boolean;
    'webrtc-enabled': boolean;
}

declare interface ConferenceInformation extends Partialable {
    'conference-description'?: ConferenceDescription;
    'conference-state'?: ConferenceState;
    'conference-view'?: ConferenceView;
    'entity': string;
    'plan-id': string;
    'record-id': string;
    'record-users'?: ConferenceRecordUsers;
    'rtmp-state'?: ConferenceRTMPUsers;
    'users'?: ConferenceUsers;
    'version': number;
}

declare interface ConferenceLayout {
    'enable': boolean;
    'broadcast-id': number;
    'video-layout': 'Equality' | 'SpeechExcitation' | 'Exclusive';
    'speech-excitation-video-big-view': number;
    'speech-excitation-video-max-view': number;
    'speech-excitation-video-round-enabled': boolean;
    'speech-excitation-video-round-number': number;
    'speech-excitation-video-round-interval': number;
    'equality-video-max-view': number;
    'equality-video-round-enabled': boolean;
    'equality-video-round-number': number;
    'equality-video-round-interval': number;
    'applied-to-attendee': boolean;
    'applied-to-cast-viewer': boolean;
    'selected-user-entity': string[];
    'appoint-users': string[];
}

declare interface ConferenceRecordUser extends Partialable {
    'entity': string;
    'default': boolean;
    'reason': StateReason;
    'record-status': 'stop' | 'stopping' | 'pause' | 'pausing' | 'start' | 'starting' | 'resuming';
    'record-last-stop-duration': number;
    'record-last-start-time': number;
}

declare interface ConferenceRecordUsers extends Partialable {
    'user': ConferenceRecordUser;
}

declare interface ConferenceRTMPUser extends Partialable {
    'entity': string;
    'default': boolean;
    'reason': StateReason;
    'rtmp-status': 'stop' | 'stopping' | 'pause' | 'pausing' | 'start' | 'starting' | 'resuming';
    'rtmp-last-stop-duration': number;
    'rtmp-last-start-time': number;
}

declare interface ConferenceRTMPUsers extends Partialable {
    'rtmp-enable': boolean;
    'users': ConferenceRTMPUser[];
}

declare interface ConferenceState extends Partialable {
    'active': boolean;
    'locked': boolean;
    'applicationsharer': ApplicationSharer;
    'speech-user-entity'?: string;
    'coopshare-state'?: string | 'coopshare';
}

declare interface ConferenceUser extends Partialable {
    'entity': string;
    'answer-time-unix': number;
    'display-text': string;
    'display-number': string;
    'display-text-pinyin-for-search': string;
    'group-id'?: string;
    'group-name'?: string;
    'group-name-pinyin-for-search'?: string;
    'subject-id': string;
    'protocol': string | 'HTTP' | 'SIP';
    'request-uri': string;
    'user-agent': string;
    'roles': UserRole;
    'endpoint': UserEndpoint[];
    'support-fecc': boolean;
    'ip'?: string;
    'reason'?: StateReason;
}

declare interface ConferenceUsers extends Partialable {
    'broadcast-user-count'?: number;
    'user': ConferenceUser[];
}

declare interface ConferenceView extends Partialable {
    'entity-view': EntityView[];
}

declare const configs: {
    getVirtualJWT: {
        method: Method;
        url: string;
    };
    login: {
        method: Method;
        url: string;
    };
    selectAccount: {
        method: Method;
        url: string;
    };
    logout: {
        method: Method;
        url: string;
    };
    refreshToken: {
        method: Method;
        url: string;
    };
    sendMobileLoginVerifyCode: {
        method: Method;
        url: string;
    };
    getConferenceInfo: {
        method: Method;
        url: string;
    };
    getURL: {
        method: Method;
        url: string;
    };
    getFullInfo: {
        method: Method;
        url: string;
    };
    getBasicInfo: {
        method: Method;
        url: string;
    };
    getBasicInfoOffline: {
        method: Method;
        url: string;
    };
    getStats: {
        method: Method;
        url: string;
    };
    polling: {
        method: Method;
        url: string;
    };
    keepalive: {
        method: Method;
        url: string;
    };
    joinFocus: {
        method: Method;
        url: string;
    };
    joinWechat: {
        method: Method;
        url: string;
    };
    joinMedia: {
        method: Method;
        url: string;
    };
    renegMedia: {
        method: Method;
        url: string;
    };
    joinShare: {
        method: Method;
        url: string;
    };
    leaveShare: {
        method: Method;
        url: string;
    };
    switchShare: {
        method: Method;
        url: string;
    };
    renegShare: {
        method: Method;
        url: string;
    };
    pushMessage: {
        method: Method;
        url: string;
    };
    pullMessage: {
        method: Method;
        url: string;
    };
    muteAll: {
        method: Method;
        url: string;
    };
    unmuteAll: {
        method: Method;
        url: string;
    };
    acceptLobbyUser: {
        method: Method;
        url: string;
    };
    acceptLobbyUserAll: {
        method: Method;
        url: string;
    };
    rejectLobbyUserAll: {
        method: Method;
        url: string;
    };
    waitLobbyUser: {
        method: Method;
        url: string;
    };
    waitLobbyUserAll: {
        method: Method;
        url: string;
    };
    rejectHandupAll: {
        method: Method;
        url: string;
    };
    deleteUser: {
        method: Method;
        url: string;
    };
    setUserMedia: {
        method: Method;
        url: string;
    };
    setUserRole: {
        method: Method;
        url: string;
    };
    setUserDisplayText: {
        method: Method;
        url: string;
    };
    holdUser: {
        method: Method;
        url: string;
    };
    inviteUser: {
        method: Method;
        url: string;
    };
    setFocusVideo: {
        method: Method;
        url: string;
    };
    setSpeakMode: {
        method: Method;
        url: string;
    };
    setFreeLayout: {
        method: Method;
        url: string;
    };
    setCustomizeLayout: {
        method: Method;
        url: string;
    };
    setGlobalLayout: {
        method: Method;
        url: string;
    };
    setFecc: {
        method: Method;
        url: string;
    };
    setTitle: {
        method: Method;
        url: string;
    };
    sendTitle: {
        method: Method;
        url: string;
    };
    setRecord: {
        method: Method;
        url: string;
    };
    setRTMP: {
        method: Method;
        url: string;
    };
    setLock: {
        method: Method;
        url: string;
    };
    leave: {
        method: Method;
        url: string;
    };
    end: {
        method: Method;
        url: string;
    };
};

export declare function connect(options: ConnectOptions): Promise<Conference>;

declare interface ConnectOptions extends JoinOptions {
}

declare interface ConnectOptions_2 {
    rtcConstraints?: RTCConfiguration;
    rtcOfferConstraints?: RTCOfferOptions;
    mediaStream?: MediaStream;
    mediaConstraints?: MediaStreamConstraints;
}

export declare function createUA(config?: UAConfigs): UA;

export declare function createUserApi(token?: string | (() => string | undefined)): Api;

declare interface CtrlApiData {
    'conference-uuid'?: string;
    'conference-user-id'?: number;
    [key: string]: any;
}

declare interface DanmakuConfigs {
    type: DanmakuType;
    position: DanmakuPosition;
    displayTime: number;
    repeatCount: number;
    repeatInterval: number;
    rollDirection: DanmakuRollDirection;
}

declare interface DanmakuCtrl {
    setDanmaku: (config: Partial<DanmakuConfigs>) => Promise<void>;
    sendDanmaku: (msg: string, options?: Partial<DanmakuOptions>) => Promise<void>;
}

declare interface DanmakuOptions {
    presenter: boolean;
    attendee: boolean;
    castviewer: boolean;
}

declare type DanmakuPosition = 'top' | 'medium' | 'bottom';

declare type DanmakuRollDirection = 'R2L' | 'L2R';

declare type DanmakuType = 'dynamic' | 'static';
export { debug }

declare interface Description extends Events {
    readonly data: ConferenceDescription;
    readonly subject: ConferenceDescription['subject'];
    get: <T extends keyof ConferenceDescription>(key: T) => ConferenceDescription[T];
    update: (diff?: ConferenceDescription) => void;
    getLock: () => LockOptions;
    setLock: (options: LockOptions) => Promise<void>;
    lock: (attendeeByPass?: boolean, presenterOnly?: boolean) => Promise<void>;
    unlock: () => Promise<void>;
    isLocked: () => boolean;
}

declare interface EntityState extends Partialable {
    'speak-mode': 'free' | 'hand-up';
    'focus-video-user-entity': string;
    'ext-video-as-focus': boolean;
    'video-layout': 'Equality' | 'SpeechExcitation' | 'Exclusive';
    'speech-excitation-video-big-view': number;
    'speech-excitation-video-max-view': number;
    'speech-excitation-video-round-enabled': boolean;
    'speech-excitation-video-round-number': number;
    'speech-excitation-video-round-interval': number;
    'video-speech-ex-enabled': boolean;
    'video-speech-ex-sensitivity': number;
    'equality-video-max-view': number;
    'equality-video-round-enabled': boolean;
    'equality-video-round-number': number;
    'equality-video-round-interval': number;
    'custom-presenter-layout': ConferenceLayout;
    'custom-attendee-layout': ConferenceLayout;
    'custom-cast-viewer-layout': ConferenceLayout;
    'video-big-round': boolean;
    'video-data-mix-enabled': boolean;
    'hide-osd-site-name': boolean;
    'hide-osd-site-icon': boolean;
    'audio-as-mixed-screen-enable': boolean;
}

declare interface EntityView extends Partialable, ConfereceUri {
    'entity-state'?: EntityState;
    'title'?: EntityViewTitle;
}

declare interface EntityViewTitle extends Partialable {
    'position': 'top' | 'bottom';
    'type': 'static' | 'dynamic';
    'display-time': number;
    'repeat-count': number;
    'repeat-interval': number;
    'roll-direction': 'R2L' | 'L2R';
}

declare interface Events {
    on: (event: string | string[], fn: Function) => Events;
    off: (event: string | string[], fn?: Function) => Events;
    once: (event: string | string[], fn: Function) => Events;
    emit: (event: string, ...args: any[]) => Events;
}

export declare function fetchControlUrl(identity: Identity, number: string, baseurl?: string): Promise<string>;

declare interface FilterOptions {
    label: UserMedia['label'];
    enable: boolean;
}

declare interface Identity {
    party: any;
    subject: any;
    cloudAccount: any;
    token: string;
    seeded: boolean;
    lastLogin: boolean;
    readonly account: any;
    readonly auth?: Authentication;
    confirm: () => Promise<Authentication>;
}

declare interface Information extends Events {
    readonly data: ConferenceInformation;
    readonly version?: ConferenceInformation['version'];
    get: <T extends keyof ConferenceInformation>(key: T) => ConferenceInformation[T];
    update: (diff: ConferenceInformation) => void;
    readonly description: Description;
    readonly state: State;
    readonly view: View;
    readonly users: Users;
    readonly rtmp: RTMP;
    readonly record: Record;
}

declare interface InviteOptions {
    uid: string[];
    sipURL: string;
    h323URL: string;
}

declare interface JoinInfo {
    'when': string;
}

declare interface JoinOptions {
    url?: string;
    number: string;
    password?: string;
    displayName?: string;
}

declare interface LayoutCtrl {
    setLayout: (options: ApiDataMap['setFreeLayout']) => Promise<void>;
    setCustomizeLayout: (options: ApiDataMap['setCustomizeLayout']) => Promise<void>;
    setPresenterLayout: (options: ApiDataMap['setCustomizeLayout']) => Promise<void>;
    setAttendeeLayout: (options: ApiDataMap['setCustomizeLayout']) => Promise<void>;
    setCastViewerLayout: (options: ApiDataMap['setCustomizeLayout']) => Promise<void>;
    setOSD: (options: {
        name: true;
        icon: true;
    }) => Promise<void>;
    setSpeakMode: (mode: 'free' | 'hand-up') => Promise<void>;
}

declare interface LobbyCtrl {
    remove: (entity?: string) => Promise<void>;
    unhold: (entity?: string) => Promise<void>;
    hold: (entity?: string) => Promise<void>;
    allow: (entity?: string) => Promise<void>;
}

declare interface LockOptions {
    admissionPolicy: ConferenceDescription['admission-policy'];
    attendeeByPass?: boolean;
}

declare interface MediaChannel extends Channel {
    readonly version?: number;
    readonly callId?: string;
}

declare interface MediaFilter {
    'type': 'unblock' | 'block' | 'unblocking';
    'blockby': 'server' | string;
}

declare interface MeetnowConfig {
    baseurl?: string;
    useragent?: string;
    clientinfo?: string;
    debug?: string;
    persistent?: boolean;
    testing?: boolean;
    timeout?: number;
}

declare interface Message {
    readonly status: MessageStatus;
    readonly direction: MessageDirection;
    readonly content?: string;
    readonly timestamp?: number;
    readonly version?: number;
    readonly sender?: MessageSender;
    readonly receiver?: string[];
    readonly private?: boolean;
    send: (target?: string[]) => Promise<void>;
    retry: () => Promise<void>;
    cancel: () => void;
    incoming: (data: MessageData) => Message;
}

declare interface MessageData {
    'is-private': boolean;
    'im-context': string;
    'im-timestamp': number;
    'im-version': number;
    'sender-entity': string;
    'sender-subject-id': string;
    'sender-display-text': string;
}

declare type MessageDirection = 'incoming' | 'outgoing';

declare interface MessageSender {
    'entity': string;
    'subjectId': string;
    'displayText': string;
}

declare enum MessageStatus {
    kNull = 0,
    kSending = 1,
    kSuccess = 2,
    kFailed = 3
}

declare interface Organizer {
    'display-text': string;
    'subject-id': string;
}

declare interface ParsedConnectOptions {
    rtcConstraints: RTCConfiguration;
    rtcOfferConstraints: RTCOfferOptions;
    localMediaStream?: MediaStream;
    localMediaStreamLocallyGenerated: boolean;
}

declare interface ParsedStats {
    audio?: any;
    video?: any;
}

declare interface Partialable {
    'state': 'full' | 'partial' | 'deleted';
    [key: string]: any;
}

declare interface Record extends Events, RecordCtrl {
    readonly data: ConferenceRecordUsers;
    get: <T extends keyof ConferenceRecordUsers>(key: T) => ConferenceRecordUsers[T];
    update: (diff?: ConferenceRecordUsers) => void;
    getStatus: () => ConferenceRecordUser['record-status'];
    getReason: () => ConferenceRecordUser['reason'];
    getDetail: () => {
        reason: ConferenceRecordUser['reason'];
        status: ConferenceRecordUser['record-status'];
        lastStartTime: ConferenceRecordUser['record-last-start-time'];
        lastStopDuration: ConferenceRecordUser['record-last-stop-duration'];
    };
}

declare interface RecordCtrl {
    operation: (type: RecordOperationType) => Promise<void>;
    start: () => Promise<void>;
    stop: () => Promise<void>;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
}

declare type RecordOperationType = 'start' | 'stop' | 'pause' | 'resume';

declare interface RenegotiateOptions {
    rtcConstraints?: RTCConfiguration;
    rtcOfferConstraints?: RTCOfferOptions;
    mediaStream?: MediaStream;
    mediaConstraints?: MediaStreamConstraints;
}

declare interface Request<RequestData = any, RequestParams = any, RequestHeader = any, RequestResultData = any> {
    config: AxiosRequestConfig;
    header: (header: RequestHeader) => Request<RequestData, RequestParams, RequestHeader>;
    params: (params: RequestParams) => Request<RequestData, RequestParams, RequestHeader>;
    data: (data: RequestData) => Request<RequestData, RequestParams, RequestHeader>;
    send: () => AxiosPromise<RequestResult<RequestResultData>>;
    cancel: () => void;
}

declare interface RequestResult<T = any> {
    ret: number;
    bizCode: number;
    data: T;
    error?: {
        msg: string;
        errorCode: number;
    };
    statusCode?: number;
}

declare interface RTCStats {
    readonly quality: number;
    readonly inbound: ParsedStats;
    readonly outbound: ParsedStats;
    update: (report: RTCStatsReport) => void;
    clear: () => void;
}

declare interface RTMP extends Events, RTMPCtrl {
    readonly data: ConferenceRTMPUsers;
    get: <T extends keyof ConferenceRTMPUsers>(key: T) => ConferenceRTMPUsers[T];
    update: (diff?: ConferenceRTMPUsers) => void;
    getEnable: () => ConferenceRTMPUsers['rtmp-enable'];
    getStatus: () => ConferenceRTMPUser['rtmp-status'] | undefined;
    getReason: () => ConferenceRTMPUser['reason'] | undefined;
    getDetail: () => {
        reason: ConferenceRTMPUser['reason'];
        status: ConferenceRTMPUser['rtmp-status'];
        lastStartTime: ConferenceRTMPUser['rtmp-last-start-time'];
        lastStopDuration: ConferenceRTMPUser['rtmp-last-stop-duration'];
    } | undefined;
}

declare interface RTMPCtrl {
    operation: (type: RTMPOperationType) => Promise<void>;
    start: () => Promise<void>;
    stop: () => Promise<void>;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
}

declare type RTMPOperationType = 'start' | 'stop' | 'pause' | 'resume';

export declare function setup(config?: MeetnowConfig): void;

declare type ShareType = 'applicationsharing' | 'coopshare';

declare interface State extends Events {
    readonly data: ConferenceState;
    get: <T extends keyof ConferenceState>(key: T) => ConferenceState[T];
    update: (diff?: ConferenceState) => void;
    getSharingUserEntity: () => string | undefined;
    getSpeechUserEntity: () => string | undefined;
    getSharingType: () => ShareType | undefined;
}

declare interface StateReason {
    'reason-code': number;
    'reason-text'?: string;
    'bizCode': number;
}

declare enum STATUS {
    kNull = 0,
    kProgress = 1,
    kOffered = 2,
    kAnswered = 3,
    kAccepted = 4,
    kCanceled = 5,
    kTerminated = 6
}

declare interface UA {
    fetch: (number: string) => Promise<{
        number: string;
        partyId: string;
        url: string;
        info: object;
    }>;
    connect: (ConnectOptions: any) => Promise<Conference>;
}

declare interface UAConfigs {
    language?: string;
    auth?: Authentication;
}

declare interface User extends Events {
    readonly data: ConferenceUser;
    get: <T extends keyof ConferenceUser>(key: T) => ConferenceUser[T];
    update: (diff?: ConferenceUser) => void;
    getEntity: () => ConferenceUser['entity'];
    getUID: () => ConferenceUser['subject-id'];
    getDisplayText: () => ConferenceUser['display-text'];
    getRole: () => ConferenceUser['roles']['role'];
    isCurrent: () => boolean;
    isAttendee: () => boolean;
    isPresenter: () => boolean;
    isCastviewer: () => boolean;
    isOrganizer: () => boolean;
    getEndpoint: (type: UserEndpoint['session-type']) => UserEndpoint | undefined;
    isOnHold: () => boolean;
    hasFocus: () => boolean;
    hasMedia: () => boolean;
    hasSharing: () => boolean;
    hasFECC: () => boolean;
    getMedia: (label: UserMedia['label']) => UserMedia | undefined;
    getAudioFilter: (label: UserMedia['label']) => {
        ingress: MediaFilter['type'];
        egress: MediaFilter['type'];
    } | undefined;
    getVideoFilter: (label: UserMedia['label']) => {
        ingress: MediaFilter['type'];
        egress: MediaFilter['type'];
    } | undefined;
    isAudioBlocked: () => boolean;
    isVideoBlocked: () => boolean;
    isHandup: () => boolean;
    isSharing: () => boolean;
    isSIP: () => boolean;
    isHTTP: () => boolean;
    isRTMP: () => boolean;
    setFilter: (options: FilterOptions) => Promise<void>;
    setAudioFilter: (enable: boolean) => Promise<void>;
    setVideoFilter: (enable: boolean) => Promise<void>;
    setDisplayText: (displayText: string) => Promise<void>;
    setRole: (role: 'attendee' | 'presenter') => Promise<void>;
    setFocus: (enable?: boolean) => Promise<void>;
    getStats: () => Promise<any>;
    kick: () => Promise<any>;
    hold: () => Promise<any>;
    unhold: () => Promise<any>;
    allow: () => Promise<any>;
    accept: () => Promise<any>;
    reject: () => Promise<any>;
    sendMessage: (msg: string) => Promise<any>;
    camera: CameraCtrl;
}

declare interface UserEndpoint extends Partialable {
    'entity': string;
    'session-type': 'focus' | 'audio-video' | 'applicationsharing' | 'fecc';
    'status': 'pending' | 'dialing-out' | 'dialing-in' | 'alerting' | 'connected' | 'disconnected' | 'disconnecting' | 'calling' | 'on-hold' | 'muted-via-focus';
    'joining-method': 'dialed-in' | 'dialed-out';
    'joining-info': JoinInfo;
    'media'?: UserMedia[];
}

declare interface UserMedia {
    'id': number;
    'type': 'audio' | 'video';
    'label': 'main-audio' | 'main-video' | 'applicationsharing';
    'status': 'sendrecv' | 'sendonly' | 'recvonly';
    'media-ingress-filter': MediaFilter;
    'media-egress-filter': MediaFilter;
}

declare interface UserRole {
    'role': 'attendee' | 'presenter' | 'castviewer' | 'organizer';
}

declare interface Users extends Events, LobbyCtrl {
    readonly data: ConferenceUsers;
    get: <T extends keyof ConferenceUsers>(key: T) => ConferenceUsers[T];
    update: (diff?: ConferenceUsers) => void;
    getUserList: (filter?: ((user?: User) => boolean)) => User[];
    getUser: (entity: string) => User | undefined;
    hasUser: (entity: string) => boolean;
    getCurrent: () => User | undefined;
    getAttendee: () => User[];
    getPresenter: () => User[];
    getCastviewer: () => User[];
    getOrganizer: () => User[];
    getOnhold: () => User[];
    getHandup: () => User[];
    getSharing: () => User[];
    getAudioBlocked: () => User[];
    getVideoBlocked: () => User[];
    getSIP: () => User[];
    getHTTP: () => User[];
    getRTMP: () => User[];
    invite: (option: Partial<InviteOptions>) => Promise<void>;
    kick: (entity: string) => Promise<void>;
    mute: () => Promise<void>;
    unmute: () => Promise<void>;
    reject: () => Promise<void>;
}

export declare const version: string;

declare interface View extends Events, DanmakuCtrl, LayoutCtrl {
    readonly data: ConferenceView;
    get: <T extends keyof ConferenceView>(key: T) => ConferenceView[T];
    update: (diff?: ConferenceView) => void;
    getVideoView: () => EntityView | undefined;
    getLayout: () => EntityState | undefined;
    getFocusUserEntity: () => EntityState['focus-video-user-entity'];
    getDanmaku: () => EntityView['title'];
}

declare interface Worker {
    config: WorkerConfig;
    readonly running: boolean;
    start: (immediate?: boolean) => Promise<void>;
    stop: () => void;
}

declare interface WorkerConfig {
    work: (times: number) => Promise<any> | any;
    cancel?: () => any;
    interval?: number | (() => number);
}

export { }
