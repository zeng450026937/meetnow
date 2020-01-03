
declare namespace MeetNow {
// declare module '@meetnow/meetnow' {
  const version: string;

  const setup: () => void;
  const connect: (options: ConnectOptions) => Promise<Conference>;
  const createUA: () => UserAgent;

  class ApiError extends Error {
    bizCode: number;
    errCode: number;
  }

  class EventEmitter {
    on(event: string | string[], fn: Function): this;
    off(event: string | string[], fn?: Function): this;
    once(event: string | string[], fn: Function): this;
    emit(event: string, ...args: any[]): this;
  }

  interface ConnectOptions extends JoinOptions {}

  class UserAgent {
    stop(): void;

    fetch: (number: string, url?: string | undefined) => Promise<{
      partyId: string;
      number: string;
      url: string;
      info: ConferenceInformation;
    }>
    connect: (options: ConnectOptions) => Promise<Conference>;
  }

  enum ChannelStatus {
    kNull = 0,
    kProgress = 1,
    kOffered = 2,
    kAnswered = 3,
    kAccepted = 4,
    kCanceled = 5,
    kTerminated = 6,
  }

  interface ChannelConnectOptions {
    rtcConstraints?: RTCConfiguration;
    rtcOfferConstraints?: RTCOfferOptions;
    mediaStream?: MediaStream;
    mediaConstraints?: MediaStreamConstraints;
  }

  type ChannelOriginator = 'local' | 'remote';

  interface ChannelMuteOptions {
    audio: boolean;
    video: boolean;
  }
  interface ChannelHoldOptions {
    local: boolean;
    remote: boolean;
  }
  interface ChannelBandwidthOptions {
    audio?: number;
    video?: number;
  }
  interface ChannelConstraintsOptions {
    audio?: MediaTrackConstraints;
    video?: MediaTrackConstraints;
  }

  interface ParsedStats {
    audio?: any;
    video?: any;
  }
  interface RTCStats {
    readonly quality: number;
    readonly inbound: ParsedStats;
    readonly outbound: ParsedStats;
  }

  class Channel extends EventEmitter {
    readonly status: ChannelStatus;
    readonly connection: RTCPeerConnection | undefined;

    isInProgress(): boolean;
    isEstablished(): boolean;
    isEnded(): boolean;

    getMute(): ChannelMuteOptions;
    getHold(): ChannelHoldOptions;

    connect(options?: ChannelConnectOptions): Promise<void>;
    terminate(reason?: string): Promise<void>;

    renegotiate(): Promise<void>;

    mute(options?: ChannelMuteOptions): void;
    unmute(options?: ChannelMuteOptions): void;

    hold(): void;
    unhold(): void;

    getRemoteStream(): MediaStream | undefined;

    addLocalStream(): void;
    removeLocalStream(): void;
    getLocalStream(): MediaStream | undefined;
    setLocalStream(): void;

    replaceLocalStream(stream?: MediaStream, renegotiation?: boolean): Promise<void>;

    adjustBandWith(options: ChannelBandwidthOptions): Promise<void>;
    applyConstraints(options: ChannelConstraintsOptions): Promise<void>;

    getStats(): RTCStats

    /* eslint-disable no-dupe-class-members */
    on(event: 'peerconnection:connectionfailed', listener: Function): this;
    on(event: 'peerconnection:createofferfailed', listener: (error: Error) => void): this;
    on(event: 'peerconnection:createanswerfailed', listener: (error: Error) => void): this;
    on(event: 'peerconnection:setlocaldescriptionfailed', listener: (error: Error) => void): this;
    on(event: 'peerconnection:setremotedescriptionfailed', listener: (error: Error) => void): this;
    on(event: 'peerconnection:icecandidate', listener: (data: { candidate: RTCIceCandidate | null; ready(): void; }) => void): this;
    on(event: 'peerconnection', listener: (connection: RTCPeerConnection) => void): this;
    on(event: 'sdp', listener: (data: { originator: ChannelOriginator; type: RTCSdpType; sdp: string; }) => void): this;

    on(event: 'connecting', listener: Function): this;
    on(event: 'progress', listener: Function): this;
    on(event: 'accepted', listener: Function): this;
    on(event: 'connected', listener: Function): this;
    on(event: 'ended', listener: Function): this;
    on(event: 'failed', listener: (data: { originator: ChannelOriginator; message: string; }) => void): this;

    on(event: 'mute', listener: (data: ChannelMuteOptions) => void): this;
    on(event: 'unmute', listener: (data: ChannelMuteOptions) => void): this;
    on(event: 'hold', listener: (data: ChannelMuteOptions) => void): this;
    on(event: 'unhold', listener: (data: ChannelMuteOptions) => void): this;
    /* eslint-enable no-dupe-class-members */
  }

  class MediaChannel extends Channel {
    readonly version: number;
    readonly callId: string;

    /* eslint-disable no-dupe-class-members */
    on(event: string | string[], fn: Function): this;
    on(event: 'localstream', listener: (stream: MediaChannel | undefined) => void): this;
    on(event: 'remotestream', listener: (stream: MediaChannel | undefined) => void): this;
    /* eslint-enable no-dupe-class-members */
  }

  enum MessageStatus {
    kNull,
    kSending,
    kSuccess,
    kFailed,
  }

  type MessageDirection = 'incoming' | 'outgoing';

  interface MessageSender {
    'entity': string;
    'subjectId': string;
    'displayText': string;
  }

  class Message extends EventEmitter {
    readonly status: MessageStatus;
    readonly direction: MessageDirection;
    readonly content: string;
    readonly timestamp: number;
    readonly version: number;
    readonly sender: MessageSender;
    readonly receiver: string[] | undefined;
    readonly private: number;

    send: (message: string, target?: string[] | undefined) => Promise<void>;
    retry: () => Promise<void>;
    cancel: () => void;
  }

  class ChatChannel extends EventEmitter {
    readonly ready: boolean;

    connect(count?: number): Promise<void>;
    terminate(): Promise<void>;

    sendMessage: (msg: string, target?: string[]) => Promise<Message>;

    /* eslint-disable no-dupe-class-members */
    on(event: 'ready', listener: () => void): this;
    on(event: 'connected', listener: () => void): this;
    on(event: 'disconnected', listener: () => void): this;
    on(event: 'message', listener: (data: { originator: ChannelOriginator; message: Message; }) => void): this;
    /* eslint-enable no-dupe-class-members */
  }

  class Information extends EventEmitter {
    readonly data: ConferenceInformation;
    readonly version: number;

    get(key: keyof ConferenceInformation): any;

    readonly description: Description;
    readonly state: State;
    readonly view: View;
    readonly users: Users;
    readonly rtmp: RTMP;
    readonly record: Record;

    /* eslint-disable no-dupe-class-members */
    on(event: 'updated', listener: (data: Information) => void): this;
    /* eslint-enable no-dupe-class-members */
  }

  interface LockOptions {
    admissionPolicy: ConferenceDescription['admission-policy'];
    attendeeByPass?: boolean;
  }

  class Description extends EventEmitter {
    readonly data: ConferenceDescription;
    readonly subject: string;

    get(key: keyof ConferenceDescription): any;

    getLock: () => LockOptions;
    setLock: (options: LockOptions) => Promise<void>

    lock: (attendeeByPass?: boolean, presenterOnly?: boolean) => Promise<void>;
    unlock: () => Promise<void>;

    isLocked: () => boolean;

    /* eslint-disable no-dupe-class-members */
    on(event: 'updated', listener: (data: Description) => void): this;
    on(event: 'lockedChanged', listener: (data: boolean) => void): this;
    /* eslint-enable no-dupe-class-members */
  }

  class State extends EventEmitter {
    readonly data: ConferenceState;

    get(key: keyof ConferenceState): any;

    /* eslint-disable no-dupe-class-members */
    on(event: 'updated', listener: (data: State) => void): this;
    on(event: 'activeChanged', listener: (data: boolean) => void): this;
    on(event: 'lockedChanged', listener: (data: boolean) => void): this;
    on(event: 'sharingUserEntityChanged', listener: (data: string) => void): this;
    on(event: 'speechUserEntityChanged', listener: (data: string) => void): this;
    /* eslint-enable no-dupe-class-members */
  }

  interface OSDOptions {
    name: boolean;
    icon: boolean;
  }

  type DanmakuType = 'dynamic'| 'static';
  type DanmakuPosition = 'top'| 'medium'| 'bottom';
  type DanmakuRollDirection = 'R2L' | 'L2R';

  interface DanmakuConfigs {
    type: DanmakuType;
    position: DanmakuPosition;
    displayTime: number; // in seconds
    repeatCount: number;
    repeatInterval: number;
    rollDirection: DanmakuRollDirection;
  }
  interface DanmakuOptions {
    presenter: boolean;
    attendee: boolean;
    castviewer: boolean;
  }

  class View extends EventEmitter {
    readonly data: ConferenceView;

    get(key: keyof ConferenceView): any;

    // layout ctrl
    setLayout(options: any): Promise<void>;
    setCustomizeLayout(options: any): Promise<void>;
    setPresenterLayout(options: any): Promise<void>;
    setAttendeeLayout(options: any): Promise<void>;
    setCastViewerLayout(options: any): Promise<void>;

    setOSD(options?: OSDOptions): Promise<void>;
    setSpeakMode(mode: 'free' | 'hand-up'): Promise<void>

    // danmaku ctrl
    setDanmaku: (config: Partial<DanmakuConfigs>) => Promise<void>;
    sendDanmaku: (msg: string, options?: Partial<DanmakuOptions>) => Promise<void>;

    getVideoView: () => EntityView;
    getLayout: () => EntityState;
    getFocusUserEntity: () => string;
    getDanmaku: () => EntityViewTitle;

    /* eslint-disable no-dupe-class-members */
    on(event: 'updated', listener: (data: View) => void): this;
    on(event: 'focusUserEntityChanged', listener: (data: string) => void): this;
    /* eslint-enable no-dupe-class-members */
  }

  interface FilterOptions {
    label: UserMedia['label']
    enable: boolean;
  }

  class User extends EventEmitter {
    readonly data: ConferenceUser;

    get(key: keyof ConferenceUser): any;

    getEntity: () => string;
    getUID: () => string;
    getDisplayText: () => string;
    getRole: () => UserRole['role'];

    isCurrent: () => boolean;
    isAttendee: () => boolean;
    isPresenter: () => boolean;
    isCastviewer: () => boolean;
    isOrganizer: () => boolean;

    getEndpoint: (type: UserEndpoint['session-type']) => UserEndpoint;
    isOnHold: () => boolean;

    hasFocus: () => boolean;
    hasMedia: () => boolean;
    hasSharing: () => boolean;
    hasFECC: () => boolean;

    getMedia(label: UserMedia['label']): UserMedia | undefined;
    getMediaFilter(label: UserMedia['label']): { ingress: MediaFilter['type']; egress: MediaFilter['type']; };
    getAudioFilter(): { ingress: MediaFilter['type']; egress: MediaFilter['type']; };
    getVideoFilter(): { ingress: MediaFilter['type']; egress: MediaFilter['type']; };

    isAudioBlocked: () => boolean;
    isVideoBlocked: () => boolean;

    isHandup: () => boolean;
    isSharing: () => boolean;

    isSIP: () => boolean;
    isHTTP: () => boolean;
    isRTMP: () => boolean;

    // user ctrl
    setFilter(options: FilterOptions): Promise<void>;

    setAudioFilter(enable: boolean): Promise<void>;
    setVideoFilter(enable: boolean): Promise<void>;

    setDisplayText(displayText: string): Promise<void>;
    setRole(role: 'attendee' | 'presenter'): Promise<void>;
    setFocus(enable?: boolean): Promise<void>;

    getStats(): Promise<any>;

    kick(): Promise<void>;
    hold(): Promise<void>;
    unhold(): Promise<void>;
    allow(): Promise<void>;

    accept(): Promise<void>;
    reject(): Promise<void>;

    sendMessage(msg: string): Promise<void>;

    /* eslint-disable no-dupe-class-members */
    on(event: 'updated', listener: (data: User) => void): this;
    on(event: 'displayTextChanged', listener: (data: string) => void): this;
    on(event: 'roleChanged', listener: (data: string) => void): this;
    on(event: 'holdChanged', listener: (data: boolean) => void): this;
    on(event: 'handupChanged', listener: (data: boolean) => void): this;
    on(event: 'audioChanged', listener: (data: boolean) => void): this;
    on(event: 'videoChanged', listener: (data: boolean) => void): this;
    on(event: 'mediaChanged', listener: (data: boolean) => void): this;
    on(event: 'sharingChanged', listener: (data: boolean) => void): this;
    /* eslint-enable no-dupe-class-members */
  }

  interface InviteOptions {
    uid: string[];
    sipURL: string;
    h323URL: string;
  }

  class Users extends EventEmitter {
    readonly data: ConferenceUsers;

    get(key: keyof ConferenceUsers): any;

    getUserList(filter?: (user?: User) => boolean): User[];
    getUser(entity: string): User;
    hasUser(entity: string): boolean;

    getCurrent(): User | undefined;
    getAttendee(): User[];
    getPresenter(): User[];
    getCastviewer(): User[];
    getOrganizer(): User[];

    getOnhold(): User[];
    getHandup(): User[];
    getSharing(): User[];

    getAudioBlocked(): User[];
    getVideoBlocked(): User[];

    getSIP(): User[];
    getHTTP(): User[];
    getRTMP(): User[];

    invite(option: Partial<InviteOptions>): Promise<void>;
    kick(entity: string): Promise<void>;

    mute(): Promise<void>;
    unmute(): Promise<void>;

    // lobby ctrl
    remove(): Promise<void>;
    hold(): Promise<void>;
    unhold(): Promise<void>;
    allow(): Promise<void>;

    /* eslint-disable no-dupe-class-members */
    on(event: 'updated', listener: (data: Users) => void): this;
    on(event: 'user:added', listener: (data: User) => void): this;
    on(event: 'user:updated', listener: (data: User) => void): this;
    on(event: 'user:deleted', listener: (data: User) => void): this;
    /* eslint-enable no-dupe-class-members */
  }

  interface RTMPDetail {
    reason: ConferenceRTMPUser['reason'];
    status: ConferenceRTMPUser['rtmp-status'];
    lastStartTime: ConferenceRTMPUser['rtmp-last-start-time'];
    lastStopDuration: ConferenceRTMPUser['rtmp-last-stop-duration'];
  }

  class RTMP extends EventEmitter {
    readonly data: ConferenceRTMPUsers;

    get(key: keyof ConferenceRTMPUsers): any;

    getStatus(entity?: string): ConferenceRTMPUser['rtmp-status'];
    getReason(entity?: string): ConferenceRTMPUser['reason'];
    getDetail(entity?: string): RTMPDetail;

    // rtmp ctrl
    start(): Promise<void>;
    stop(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;

    /* eslint-disable no-dupe-class-members */
    on(event: 'updated', listener: (data: RTMP) => void): this;
    on(event: 'enableChanged', listener: (data: boolean) => void): this;
    on(event: 'statusChanged', listener: (data: boolean) => void): this;
    /* eslint-enable no-dupe-class-members */
  }

  interface RecordDetail {
    reason: ConferenceRecordUser['reason'];
    status: ConferenceRecordUser['record-status'];
    lastStartTime: ConferenceRecordUser['record-last-start-time'];
    lastStopDuration: ConferenceRecordUser['record-last-stop-duration'];
  }

  class Record extends EventEmitter {
    readonly data: ConferenceRecordUsers;

    get(key: keyof ConferenceRecordUsers): any;

    getStatus(): ConferenceRecordUser['record-status'];
    getReason(): ConferenceRecordUser['reason'];
    getDetail(): RecordDetail;

    // rtmp ctrl
    start(): Promise<void>;
    stop(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;

    /* eslint-disable no-dupe-class-members */
    on(event: 'updated', listener: (data: Record) => void): this;
    on(event: 'statusChanged', listener: (data: boolean) => void): this;
    /* eslint-enable no-dupe-class-members */
  }

  interface JoinOptions {
    url?: string;
    number: string;
    password?: string;
    displayName?: string;
  }

  class Conference extends EventEmitter {
    readonly url: string;

    readonly uuid: string;
    readonly userId: string;
    readonly user: User | undefined;

    readonly information: Information;

    readonly description: Description;
    readonly state: State;
    readonly view: View;
    readonly users: Users;
    readonly rtmp: RTMP;
    readonly record: Record;

    readonly mediaChannel: MediaChannel;
    readonly shareChannel: MediaChannel;
    readonly chatChannel: ChatChannel;

    join(options?: Partial<JoinOptions>): Promise<this>;
    leave(): Promise<this>;
    end(): Promise<this>;

    share(): Promise<void>;
    sendMessage(msg: string, target?: string[]): Promise<void>;

    /* eslint-disable no-dupe-class-members */
    on(event: 'connecting', listener: () => void): this;
    on(event: 'connected', listener: () => void): this;
    on(event: 'disconnecting', listener: () => void): this;
    on(event: 'disconnected', listener: (data: any) => void): this;
    on(event: 'error', listener: (data: ApiError) => void): this;

    on(event: 'chatready', listener: () => void): this;

    on(event: 'user', listener: (data: User) => void): this;
    on(event: 'sharinguser', listener: (data: User) => void): this;
    on(event: 'speechuser', listener: (data: User) => void): this;

    on(event: 'user:added', listener: (data: User) => void): this;
    on(event: 'user:updated', listener: (data: User) => void): this;
    on(event: 'user:deleted', listener: (data: User) => void): this;

    on(event: 'information', listener: (data: Information) => void): this;
    on(event: 'message', listener: (data: Message) => void): this;
    /* eslint-enable no-dupe-class-members */
  }


  interface Partialable {
    'state': 'full' | 'partial' | 'deleted';
    [key: string]: any;
  }

  type SessionType = 'focus' | 'audio-video' | 'applicationsharing' | 'fecc';
  type VideoLayoutType = 'Equality' | 'SpeechExcitation' | 'Exclusive';

  // Conference Description

  interface ConfereceUri {
    'entity': 'focus' | 'audio-video' | 'applicationsharing';
    'uri': string;
    'display-text': string;
    'purpose': string;
  }

  interface ConfereceUris {
    'entry': ConfereceUri[];
  }

  interface Organizer {
    'display-text': string;
    'subject-id': string;
  }

  interface ConferenceDescription extends Partialable {
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

  // Conference State

  interface ApplicationSharer extends Partialable {
    'user': ConferenceUser;
  }

  interface ConferenceState extends Partialable {
    'active': boolean;
    'locked': boolean;
    'applicationsharer': ApplicationSharer;
    'speech-user-entity'?: string;
  }

  // Conference View

  interface ConferenceLayout {
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

  interface EntityState extends Partialable {
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

  interface EntityViewTitle extends Partialable {
    'position': 'top' | 'bottom';
    'type': 'static' | 'dynamic';
    'display-time': number;
    'repeat-count': number;
    'repeat-interval': number;
    'roll-direction': 'R2L' | 'L2R';
  }

  interface EntityView extends Partialable, ConfereceUri {
    'entity-state'?: EntityState;
    'title'?: EntityViewTitle;
  }

  interface ConferenceView extends Partialable {
    'entity-view': EntityView[];
  }

  // Conference Users

  interface UserRole {
    'role': 'attendee' | 'presenter' | 'castviewer' | 'organizer';
  }

  interface JoinInfo {
    'when': string;
  }

  interface MediaFilter {
    'type': 'unblock' | 'block' | 'unblocking';
    'blockby': 'server' | string;
  }

  interface UserMedia {
    'id': number;
    'type': 'audio' | 'video';
    'label': 'main-audio' | 'main-video' | 'applicationsharing';
    'status': 'sendrecv' | 'sendonly' | 'recvonly';
    'media-ingress-filter': MediaFilter;
    'media-egress-filter': MediaFilter;
  }

  interface UserEndpoint extends Partialable {
    'entity': string;
    'session-type': 'focus' | 'audio-video' | 'applicationsharing' | 'fecc';
    'status': 'pending' | 'dialing-out' | 'dialing-in' | 'alerting' | 'connected' | 'disconnected' | 'disconnecting' | 'calling' | 'on-hold' | 'muted-via-focus';
    'joining-method': 'dialed-in' | 'dialed-out';
    'joining-info': JoinInfo;
    'media'?: UserMedia[];
  }

  interface ConferenceUser extends Partialable {
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
    'endpoint': UserEndpoint[]
    'support-fecc': boolean;
    'ip'?: string;
    'reason'?: StateReason;
  }

  interface ConferenceUsers extends Partialable {
    'broadcast-user-count'?: number;
    'user': ConferenceUser[];
  }

  // Conference Record Users

  interface StateReason {
    'reason-code': number;
    'reason-text'?: string;
    'bizCode': number;
  }

  interface ConferenceRecordUser extends Partialable {
    'entity': string;
    'default': boolean;
    'reason': StateReason;
    'record-status': 'stop' | 'stopping' | 'pause' | 'pausing' | 'start' | 'starting' | 'resuming';
    'record-last-stop-duration': number;
    'record-last-start-time': number;
  }

  interface ConferenceRecordUsers extends Partialable {
    'user': ConferenceRecordUser;
  }

  // Conference RTMP Users

  interface ConferenceRTMPUser extends Partialable {
    'entity': string;
    'default': boolean;
    'reason': StateReason;
    'rtmp-status': 'stop' | 'stopping' | 'pause' | 'pausing' | 'start' | 'starting' | 'resuming';
    'rtmp-last-stop-duration': number;
    'rtmp-last-start-time': number;
  }

  interface ConferenceRTMPUsers extends Partialable {
    'rtmp-enable': boolean;
    'users': ConferenceRTMPUser[];
  }

  // Conference Information

  interface ConferenceInformation extends Partialable {
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
}

declare module '@meetnow/meetnow' {
  export = MeetNow;
}

interface NodeRequireFunction {
  (moduleName: '@meetnow/meetnow'): typeof MeetNow;
}
