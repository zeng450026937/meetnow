import axios from 'axios';
import { AxiosPromise } from 'axios';
import { AxiosRequestConfig } from 'axios';
import { AxiosResponse } from 'axios';
import debug from 'debug';
import { Debugger } from 'debug';

export declare function adapter(config: AxiosRequestConfig): AxiosPromise;

declare type Api = ReturnType<typeof createApi>;

declare interface ApiDataMap {
    [apiName: string]: any;
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

declare interface ApiParamsMap {
    [apiName: string]: any;
    'getVirtualJWT': {
        id: string;
    };
}

declare interface ApplicationSharer extends Partialable {
    'user': ConferenceUser;
}
export { axios }

declare interface ConfereceUri {
    'entity': 'focus' | 'audio-video' | 'applicationsharing';
    'uri': string;
    'display-text': string;
    'purpose': string;
}

declare interface ConfereceUris {
    'entry': ConfereceUri[];
}

export declare type Conference = ReturnType<typeof createConference>;

export declare interface ConferenceConfigs {
    api: Api;
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

declare function connect(options: ConnectOptions): Promise<{
    api: {
        readonly interceptors: {
            request: import("axios").AxiosInterceptorManager<import("axios").AxiosRequestConfig>;
            response: import("axios").AxiosInterceptorManager<import("axios").AxiosResponse<any>>;
        };
        request: <T extends "getVirtualJWT" | "getURL" | "getFullInfo" | "getBasicInfo" | "getBasicInfoOffline" | "getStats" | "polling" | "keepalive" | "joinFocus" | "joinWechat" | "joinMedia" | "renegMedia" | "joinShare" | "leaveShare" | "switchShare" | "renegShare" | "pushMessage" | "pullMessage" | "muteAll" | "unmuteAll" | "acceptLobbyUser" | "acceptLobbyUserAll" | "rejectLobbyUserAll" | "waitLobbyUser" | "waitLobbyUserAll" | "rejectHandupAll" | "deleteUser" | "setUserMedia" | "setUserRole" | "setUserDisplayText" | "holdUser" | "inviteUser" | "setFocusVideo" | "setSpeakMode" | "setFreeLayout" | "setCustomizeLayout" | "setGlobalLayout" | "setFecc" | "setTitle" | "sendTitle" | "setRecord" | "setRTMP" | "setLock" | "leave" | "end" = "getVirtualJWT" | "getURL" | "getFullInfo" | "getBasicInfo" | "getBasicInfoOffline" | "getStats" | "polling" | "keepalive" | "joinFocus" | "joinWechat" | "joinMedia" | "renegMedia" | "joinShare" | "leaveShare" | "switchShare" | "renegShare" | "pushMessage" | "pullMessage" | "muteAll" | "unmuteAll" | "acceptLobbyUser" | "acceptLobbyUserAll" | "rejectLobbyUserAll" | "waitLobbyUser" | "waitLobbyUserAll" | "rejectHandupAll" | "deleteUser" | "setUserMedia" | "setUserRole" | "setUserDisplayText" | "holdUser" | "inviteUser" | "setFocusVideo" | "setSpeakMode" | "setFreeLayout" | "setCustomizeLayout" | "setGlobalLayout" | "setFecc" | "setTitle" | "sendTitle" | "setRecord" | "setRTMP" | "setLock" | "leave" | "end">(apiName: T) => import("./api/request").Request<import("./api/api-configs").ApiDataMap[T], import("./api/api-configs").ApiParamsMap[T], any>;
    };
    url: string | undefined;
    uuid: string | undefined;
    userId: string;
    user: {
        data: import("./conference/conference-info").ConferenceUser;
        get(key: string | number): any;
        update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
        getEntity: () => string;
        getUID: () => string;
        getDisplayText: () => string;
        getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
        isCurrent: () => boolean;
        isAttendee: () => boolean;
        isPresenter: () => boolean;
        isCastviewer: () => boolean;
        isOrganizer: () => boolean;
        getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
        isOnHold: () => boolean | undefined;
        hasFocus: () => boolean;
        hasMedia: () => boolean;
        hasSharing: () => boolean;
        hasFECC: () => boolean;
        getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
        getAudioFilter: () => {
            ingress: "unblock" | "block" | "unblocking";
            egress: "unblock" | "block" | "unblocking";
        };
        getVideoFilter: () => {
            ingress: "unblock" | "block" | "unblocking";
            egress: "unblock" | "block" | "unblocking";
        };
        isAudioBlocked: () => boolean;
        isVideoBlocked: () => boolean;
        isHandup: () => boolean;
        isSharing: () => boolean | undefined;
        isSIP: () => boolean;
        isHTTP: () => boolean;
        isRTMP: () => boolean;
        setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
        setAudioFilter: (enable: boolean) => Promise<void>;
        setVideoFilter: (enable: boolean) => Promise<void>;
        setDisplayText: (displayText: string) => Promise<void>;
        setRole: (role: "attendee" | "presenter") => Promise<void>;
        setFocus: (enable?: boolean) => Promise<void>;
        getStats: () => Promise<void>;
        kick: () => Promise<void>;
        hold: () => Promise<void>;
        unhold: () => Promise<void>;
        allow: () => Promise<void>;
        accept: () => Promise<void>;
        reject: () => Promise<void>;
        sendMessage: (msg: string) => Promise<void>;
        camera: {
            action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
            left: () => Promise<void>;
            right: () => Promise<void>;
            down: () => Promise<void>;
            up: () => Promise<void>;
            zoomout: () => Promise<void>;
            zoomin: () => Promise<void>;
            focusout: () => Promise<void>;
            focusin: () => Promise<void>;
        };
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    information: {
        data: import("./conference/conference-info").ConferenceInformation;
        version: number;
        get(key: string | number): any;
        description: {
            data: import("./conference/conference-info").ConferenceDescription;
            subject: string;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceDescription | undefined) => void;
            getLock: () => import("./conference/description").LockOptions;
            setLock: (options: import("./conference/description").LockOptions) => Promise<void>;
            lock: (attendeeByPass?: boolean, presenterOnly?: boolean) => Promise<void>;
            unlock: () => Promise<void>;
            isLocked: () => boolean;
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        };
        state: {
            data: import("./conference/conference-info").ConferenceState;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceState | undefined) => void;
            getSharingUserEntity: () => string;
            getSpeechUserEntity: () => string | undefined;
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        };
        view: {
            update: (diff?: import("./conference/conference-info").ConferenceView | undefined) => void;
            getVideoView: () => import("./conference/conference-info").EntityView | undefined;
            getLayout: () => import("./conference/conference-info").EntityState | undefined;
            getFocusUserEntity: () => string;
            getDanmaku: () => import("./conference/conference-info").EntityViewTitle | undefined;
            setDanmaku: (config: Partial<import("./conference/danmaku-ctrl").DanmakuConfigs>) => Promise<void>;
            sendDanmaku: (msg: string, options?: Partial<import("./conference/danmaku-ctrl").DanmakuOptions> | undefined) => Promise<void>;
            setLayout: (options: import("./api/api-configs").CtrlApiData & {
                'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                'speech-excitation-video-big-view'?: number | undefined;
                'speech-excitation-video-max-view'?: number | undefined;
                'equality-video-max-view'?: number | undefined;
                'ext-video-as-focus': number;
                'speech-excitation-video-round-enabled'?: boolean | undefined;
                'speech-excitation-video-round-number'?: number | undefined;
                'speech-excitation-video-round-interval'?: number | undefined;
                'equality-video-round-enabled'?: boolean | undefined;
                'equality-video-round-number'?: number | undefined;
                'equality-video-round-interval'?: number | undefined;
            }) => Promise<void>;
            setCustomizeLayout: (options: import("./api/api-configs").CtrlApiData & {
                'enable'?: boolean | undefined;
                'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
                'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                'speech-excitation-video-big-view'?: number | undefined;
                'speech-excitation-video-max-view'?: number | undefined;
                'equality-video-max-view'?: number | undefined;
                'ext-video-as-focus'?: number | undefined;
                'speech-excitation-video-round-enabled': boolean;
                'speech-excitation-video-round-number': number;
                'speech-excitation-video-round-interval': number;
                'equality-video-round-enabled'?: boolean | undefined;
                'equality-video-round-number'?: number | undefined;
                'equality-video-round-interval'?: number | undefined;
                'applied-to-attendee': boolean;
                'applied-to-cast-viewer': boolean;
                'selected-user-entity'?: string[] | undefined;
                'pos'?: number | undefined;
                'entity'?: string | undefined;
            }) => Promise<void>;
            setPresenterLayout: (options: import("./api/api-configs").CtrlApiData & {
                'enable'?: boolean | undefined;
                'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
                'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                'speech-excitation-video-big-view'?: number | undefined;
                'speech-excitation-video-max-view'?: number | undefined;
                'equality-video-max-view'?: number | undefined;
                'ext-video-as-focus'?: number | undefined;
                'speech-excitation-video-round-enabled': boolean;
                'speech-excitation-video-round-number': number;
                'speech-excitation-video-round-interval': number;
                'equality-video-round-enabled'?: boolean | undefined;
                'equality-video-round-number'?: number | undefined;
                'equality-video-round-interval'?: number | undefined;
                'applied-to-attendee': boolean;
                'applied-to-cast-viewer': boolean;
                'selected-user-entity'?: string[] | undefined;
                'pos'?: number | undefined;
                'entity'?: string | undefined;
            }) => Promise<void>;
            setAttendeeLayout: (options: import("./api/api-configs").CtrlApiData & {
                'enable'?: boolean | undefined;
                'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
                'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                'speech-excitation-video-big-view'?: number | undefined;
                'speech-excitation-video-max-view'?: number | undefined;
                'equality-video-max-view'?: number | undefined;
                'ext-video-as-focus'?: number | undefined;
                'speech-excitation-video-round-enabled': boolean;
                'speech-excitation-video-round-number': number;
                'speech-excitation-video-round-interval': number;
                'equality-video-round-enabled'?: boolean | undefined;
                'equality-video-round-number'?: number | undefined;
                'equality-video-round-interval'?: number | undefined;
                'applied-to-attendee': boolean;
                'applied-to-cast-viewer': boolean;
                'selected-user-entity'?: string[] | undefined;
                'pos'?: number | undefined;
                'entity'?: string | undefined;
            }) => Promise<void>;
            setCastViewerLayout: (options: import("./api/api-configs").CtrlApiData & {
                'enable'?: boolean | undefined;
                'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
                'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                'speech-excitation-video-big-view'?: number | undefined;
                'speech-excitation-video-max-view'?: number | undefined;
                'equality-video-max-view'?: number | undefined;
                'ext-video-as-focus'?: number | undefined;
                'speech-excitation-video-round-enabled': boolean;
                'speech-excitation-video-round-number': number;
                'speech-excitation-video-round-interval': number;
                'equality-video-round-enabled'?: boolean | undefined;
                'equality-video-round-number'?: number | undefined;
                'equality-video-round-interval'?: number | undefined;
                'applied-to-attendee': boolean;
                'applied-to-cast-viewer': boolean;
                'selected-user-entity'?: string[] | undefined;
                'pos'?: number | undefined;
                'entity'?: string | undefined;
            }) => Promise<void>;
            setOSD: (options?: {
                name: boolean;
                icon: boolean;
            }) => Promise<void>;
            setSpeakMode: (mode: "free" | "hand-up") => Promise<void>;
            data: import("./conference/conference-info").ConferenceView;
            get(key: string | number): any;
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        };
        users: {
            update: (diff?: import("./conference/conference-info").ConferenceUsers | undefined) => void;
            getUserList: (filter?: ((user?: {
                data: import("./conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            } | undefined) => boolean) | undefined) => {
                data: import("./conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getUser: (entity: string) => {
                data: import("./conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            } | undefined;
            hasUser: (entity: string) => boolean;
            getCurrent: () => {
                data: import("./conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            } | undefined;
            getAttendee: () => {
                data: import("./conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getPresenter: () => {
                data: import("./conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getCastviewer: () => {
                data: import("./conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getOrganizer: () => {
                data: import("./conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getOnhold: () => {
                data: import("./conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getHandup: () => {
                data: import("./conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getSharing: () => {
                data: import("./conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getAudioBlocked: () => {
                data: import("./conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getVideoBlocked: () => {
                data: import("./conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getSIP: () => {
                data: import("./conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getHTTP: () => {
                data: import("./conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getRTMP: () => {
                data: import("./conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            invite: (option: Partial<import("./conference/users").InviteOptions>) => Promise<void>;
            kick: (entity: string) => Promise<void>;
            mute: () => Promise<void>;
            unmute: () => Promise<void>;
            remove: (entity?: string | undefined) => Promise<void>;
            unhold: (entity?: string | undefined) => Promise<void>;
            hold: (entity?: string | undefined) => Promise<void>;
            allow: (entity?: string | undefined) => Promise<void>;
            data: import("./conference/conference-info").ConferenceUsers;
            get(key: string | number): any;
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        };
        rtmp: {
            operation: (type: import("./conference/rtmp-ctrl").RTMPOperationType) => Promise<void>;
            start: () => Promise<void>;
            stop: () => Promise<void>;
            pause: () => Promise<void>;
            resume: () => Promise<void>;
            data: import("./conference/conference-info").ConferenceRTMPUsers;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceRTMPUsers | undefined) => void;
            getEnable: () => boolean;
            getStatus: (entity?: string | undefined) => "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming" | undefined;
            getReason: (entity?: string | undefined) => import("./conference/conference-info").StateReason | undefined;
            getDetail: (entity?: string | undefined) => {
                reason: import("./conference/conference-info").StateReason;
                status: "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming";
                lastStartTime: number;
                lastStopDuration: number;
            } | undefined;
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        };
        record: {
            operation: (type: import("./conference/rtmp-ctrl").RTMPOperationType) => Promise<void>;
            start: () => Promise<void>;
            stop: () => Promise<void>;
            pause: () => Promise<void>;
            resume: () => Promise<void>;
            data: import("./conference/conference-info").ConferenceRecordUsers;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceRecordUsers | undefined) => void;
            getStatus: () => "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming";
            getReason: () => import("./conference/conference-info").StateReason;
            getDetail: () => {
                reason: import("./conference/conference-info").StateReason;
                status: "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming";
                lastStartTime: number;
                lastStopDuration: number;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        };
        update: (val: import("./conference/conference-info").ConferenceInformation) => void;
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    description: {
        data: import("./conference/conference-info").ConferenceDescription;
        subject: string;
        get(key: string | number): any;
        update: (diff?: import("./conference/conference-info").ConferenceDescription | undefined) => void;
        getLock: () => import("./conference/description").LockOptions;
        setLock: (options: import("./conference/description").LockOptions) => Promise<void>;
        lock: (attendeeByPass?: boolean, presenterOnly?: boolean) => Promise<void>;
        unlock: () => Promise<void>;
        isLocked: () => boolean;
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    state: {
        data: import("./conference/conference-info").ConferenceState;
        get(key: string | number): any;
        update: (diff?: import("./conference/conference-info").ConferenceState | undefined) => void;
        getSharingUserEntity: () => string;
        getSpeechUserEntity: () => string | undefined;
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    view: {
        update: (diff?: import("./conference/conference-info").ConferenceView | undefined) => void;
        getVideoView: () => import("./conference/conference-info").EntityView | undefined;
        getLayout: () => import("./conference/conference-info").EntityState | undefined;
        getFocusUserEntity: () => string;
        getDanmaku: () => import("./conference/conference-info").EntityViewTitle | undefined;
        setDanmaku: (config: Partial<import("./conference/danmaku-ctrl").DanmakuConfigs>) => Promise<void>;
        sendDanmaku: (msg: string, options?: Partial<import("./conference/danmaku-ctrl").DanmakuOptions> | undefined) => Promise<void>;
        setLayout: (options: import("./api/api-configs").CtrlApiData & {
            'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
            'speech-excitation-video-big-view'?: number | undefined;
            'speech-excitation-video-max-view'?: number | undefined;
            'equality-video-max-view'?: number | undefined;
            'ext-video-as-focus': number;
            'speech-excitation-video-round-enabled'?: boolean | undefined;
            'speech-excitation-video-round-number'?: number | undefined;
            'speech-excitation-video-round-interval'?: number | undefined;
            'equality-video-round-enabled'?: boolean | undefined;
            'equality-video-round-number'?: number | undefined;
            'equality-video-round-interval'?: number | undefined;
        }) => Promise<void>;
        setCustomizeLayout: (options: import("./api/api-configs").CtrlApiData & {
            'enable'?: boolean | undefined;
            'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
            'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
            'speech-excitation-video-big-view'?: number | undefined;
            'speech-excitation-video-max-view'?: number | undefined;
            'equality-video-max-view'?: number | undefined;
            'ext-video-as-focus'?: number | undefined;
            'speech-excitation-video-round-enabled': boolean;
            'speech-excitation-video-round-number': number;
            'speech-excitation-video-round-interval': number;
            'equality-video-round-enabled'?: boolean | undefined;
            'equality-video-round-number'?: number | undefined;
            'equality-video-round-interval'?: number | undefined;
            'applied-to-attendee': boolean;
            'applied-to-cast-viewer': boolean;
            'selected-user-entity'?: string[] | undefined;
            'pos'?: number | undefined;
            'entity'?: string | undefined;
        }) => Promise<void>;
        setPresenterLayout: (options: import("./api/api-configs").CtrlApiData & {
            'enable'?: boolean | undefined;
            'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
            'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
            'speech-excitation-video-big-view'?: number | undefined;
            'speech-excitation-video-max-view'?: number | undefined;
            'equality-video-max-view'?: number | undefined;
            'ext-video-as-focus'?: number | undefined;
            'speech-excitation-video-round-enabled': boolean;
            'speech-excitation-video-round-number': number;
            'speech-excitation-video-round-interval': number;
            'equality-video-round-enabled'?: boolean | undefined;
            'equality-video-round-number'?: number | undefined;
            'equality-video-round-interval'?: number | undefined;
            'applied-to-attendee': boolean;
            'applied-to-cast-viewer': boolean;
            'selected-user-entity'?: string[] | undefined;
            'pos'?: number | undefined;
            'entity'?: string | undefined;
        }) => Promise<void>;
        setAttendeeLayout: (options: import("./api/api-configs").CtrlApiData & {
            'enable'?: boolean | undefined;
            'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
            'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
            'speech-excitation-video-big-view'?: number | undefined;
            'speech-excitation-video-max-view'?: number | undefined;
            'equality-video-max-view'?: number | undefined;
            'ext-video-as-focus'?: number | undefined;
            'speech-excitation-video-round-enabled': boolean;
            'speech-excitation-video-round-number': number;
            'speech-excitation-video-round-interval': number;
            'equality-video-round-enabled'?: boolean | undefined;
            'equality-video-round-number'?: number | undefined;
            'equality-video-round-interval'?: number | undefined;
            'applied-to-attendee': boolean;
            'applied-to-cast-viewer': boolean;
            'selected-user-entity'?: string[] | undefined;
            'pos'?: number | undefined;
            'entity'?: string | undefined;
        }) => Promise<void>;
        setCastViewerLayout: (options: import("./api/api-configs").CtrlApiData & {
            'enable'?: boolean | undefined;
            'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
            'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
            'speech-excitation-video-big-view'?: number | undefined;
            'speech-excitation-video-max-view'?: number | undefined;
            'equality-video-max-view'?: number | undefined;
            'ext-video-as-focus'?: number | undefined;
            'speech-excitation-video-round-enabled': boolean;
            'speech-excitation-video-round-number': number;
            'speech-excitation-video-round-interval': number;
            'equality-video-round-enabled'?: boolean | undefined;
            'equality-video-round-number'?: number | undefined;
            'equality-video-round-interval'?: number | undefined;
            'applied-to-attendee': boolean;
            'applied-to-cast-viewer': boolean;
            'selected-user-entity'?: string[] | undefined;
            'pos'?: number | undefined;
            'entity'?: string | undefined;
        }) => Promise<void>;
        setOSD: (options?: {
            name: boolean;
            icon: boolean;
        }) => Promise<void>;
        setSpeakMode: (mode: "free" | "hand-up") => Promise<void>;
        data: import("./conference/conference-info").ConferenceView;
        get(key: string | number): any;
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    users: {
        update: (diff?: import("./conference/conference-info").ConferenceUsers | undefined) => void;
        getUserList: (filter?: ((user?: {
            data: import("./conference/conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        } | undefined) => boolean) | undefined) => {
            data: import("./conference/conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getUser: (entity: string) => {
            data: import("./conference/conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        } | undefined;
        hasUser: (entity: string) => boolean;
        getCurrent: () => {
            data: import("./conference/conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        } | undefined;
        getAttendee: () => {
            data: import("./conference/conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getPresenter: () => {
            data: import("./conference/conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getCastviewer: () => {
            data: import("./conference/conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getOrganizer: () => {
            data: import("./conference/conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getOnhold: () => {
            data: import("./conference/conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getHandup: () => {
            data: import("./conference/conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getSharing: () => {
            data: import("./conference/conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getAudioBlocked: () => {
            data: import("./conference/conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getVideoBlocked: () => {
            data: import("./conference/conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getSIP: () => {
            data: import("./conference/conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getHTTP: () => {
            data: import("./conference/conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getRTMP: () => {
            data: import("./conference/conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference/conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference/conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference/conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./conference/user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./conference/camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        invite: (option: Partial<import("./conference/users").InviteOptions>) => Promise<void>;
        kick: (entity: string) => Promise<void>;
        mute: () => Promise<void>;
        unmute: () => Promise<void>;
        remove: (entity?: string | undefined) => Promise<void>;
        unhold: (entity?: string | undefined) => Promise<void>;
        hold: (entity?: string | undefined) => Promise<void>;
        allow: (entity?: string | undefined) => Promise<void>;
        data: import("./conference/conference-info").ConferenceUsers;
        get(key: string | number): any;
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    rtmp: {
        operation: (type: import("./conference/rtmp-ctrl").RTMPOperationType) => Promise<void>;
        start: () => Promise<void>;
        stop: () => Promise<void>;
        pause: () => Promise<void>;
        resume: () => Promise<void>;
        data: import("./conference/conference-info").ConferenceRTMPUsers;
        get(key: string | number): any;
        update: (diff?: import("./conference/conference-info").ConferenceRTMPUsers | undefined) => void;
        getEnable: () => boolean;
        getStatus: (entity?: string | undefined) => "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming" | undefined;
        getReason: (entity?: string | undefined) => import("./conference/conference-info").StateReason | undefined;
        getDetail: (entity?: string | undefined) => {
            reason: import("./conference/conference-info").StateReason;
            status: "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming";
            lastStartTime: number;
            lastStopDuration: number;
        } | undefined;
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    record: {
        operation: (type: import("./conference/rtmp-ctrl").RTMPOperationType) => Promise<void>;
        start: () => Promise<void>;
        stop: () => Promise<void>;
        pause: () => Promise<void>;
        resume: () => Promise<void>;
        data: import("./conference/conference-info").ConferenceRecordUsers;
        get(key: string | number): any;
        update: (diff?: import("./conference/conference-info").ConferenceRecordUsers | undefined) => void;
        getStatus: () => "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming";
        getReason: () => import("./conference/conference-info").StateReason;
        getDetail: () => {
            reason: import("./conference/conference-info").StateReason;
            status: "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming";
            lastStartTime: number;
            lastStopDuration: number;
        };
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    mediaChannel: {
        status: import("./channel").STATUS;
        connection: RTCPeerConnection | undefined;
        version: number;
        callId: string;
        isInProgress: () => boolean;
        isEstablished: () => boolean;
        isEnded: () => boolean;
        getMute: () => {
            audio: boolean;
            video: boolean;
        };
        getHold: () => {
            local: boolean;
            remote: boolean;
        };
        connect: (options?: import("./channel").ConnectOptions) => Promise<void>;
        terminate: (reason?: string | undefined) => Promise<void>;
        renegotiate: (options?: import("./channel").RenegotiateOptions) => Promise<void>;
        mute: (options?: {
            audio: boolean;
            video: boolean;
        }) => void;
        unmute: (options?: {
            audio: boolean;
            video: boolean;
        }) => void;
        hold: () => Promise<void>;
        unhold: () => Promise<void>;
        getRemoteStream: () => MediaStream | undefined;
        addLocalStream: (stream?: MediaStream | undefined) => void;
        removeLocalStream: () => void;
        getLocalStream: () => MediaStream | undefined;
        setLocalStream: (stream?: MediaStream | undefined) => void;
        replaceLocalStream: (stream?: MediaStream | undefined, renegotiation?: boolean) => Promise<void>;
        adjustBandWidth: (options: {
            audio?: number | undefined;
            video?: number | undefined;
        }) => Promise<void>;
        applyConstraints: (options: {
            audio?: MediaTrackConstraints | undefined;
            video?: MediaTrackConstraints | undefined;
        }) => Promise<void>;
        getStats: () => Promise<{
            readonly quality: number;
            readonly inbound: import("./channel/rtc-stats").ParsedStats;
            readonly outbound: import("./channel/rtc-stats").ParsedStats;
            update: (report: RTCStatsReport) => void;
            clear: () => void;
        }>;
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    shareChannel: {
        status: import("./channel").STATUS;
        connection: RTCPeerConnection | undefined;
        version: number;
        callId: string;
        isInProgress: () => boolean;
        isEstablished: () => boolean;
        isEnded: () => boolean;
        getMute: () => {
            audio: boolean;
            video: boolean;
        };
        getHold: () => {
            local: boolean;
            remote: boolean;
        };
        connect: (options?: import("./channel").ConnectOptions) => Promise<void>;
        terminate: (reason?: string | undefined) => Promise<void>;
        renegotiate: (options?: import("./channel").RenegotiateOptions) => Promise<void>;
        mute: (options?: {
            audio: boolean;
            video: boolean;
        }) => void;
        unmute: (options?: {
            audio: boolean;
            video: boolean;
        }) => void;
        hold: () => Promise<void>;
        unhold: () => Promise<void>;
        getRemoteStream: () => MediaStream | undefined;
        addLocalStream: (stream?: MediaStream | undefined) => void;
        removeLocalStream: () => void;
        getLocalStream: () => MediaStream | undefined;
        setLocalStream: (stream?: MediaStream | undefined) => void;
        replaceLocalStream: (stream?: MediaStream | undefined, renegotiation?: boolean) => Promise<void>;
        adjustBandWidth: (options: {
            audio?: number | undefined;
            video?: number | undefined;
        }) => Promise<void>;
        applyConstraints: (options: {
            audio?: MediaTrackConstraints | undefined;
            video?: MediaTrackConstraints | undefined;
        }) => Promise<void>;
        getStats: () => Promise<{
            readonly quality: number;
            readonly inbound: import("./channel/rtc-stats").ParsedStats;
            readonly outbound: import("./channel/rtc-stats").ParsedStats;
            update: (report: RTCStatsReport) => void;
            clear: () => void;
        }>;
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    chatChannel: {
        ready: boolean;
        connect: (count?: number) => Promise<void>;
        terminate: () => Promise<void>;
        sendMessage: (msg: string, target?: string[] | undefined) => Promise<{
            readonly status: import("./channel/message").MessageStatus;
            readonly direction: import("./channel/message").MessageDirection;
            readonly content: string | undefined;
            readonly timestamp: number | undefined;
            readonly version: number | undefined;
            readonly sender: import("./channel/message").MessageSender | undefined;
            readonly receiver: string[] | undefined;
            readonly private: boolean;
            send: (message: string, target?: string[] | undefined) => Promise<void>;
            retry: () => Promise<void>;
            cancel: () => void;
            incoming: (data: import("./channel/message").MessageData) => any;
        }>;
        incoming: (data: import("./channel/message").MessageData) => {
            readonly status: import("./channel/message").MessageStatus;
            readonly direction: import("./channel/message").MessageDirection;
            readonly content: string | undefined;
            readonly timestamp: number | undefined;
            readonly version: number | undefined;
            readonly sender: import("./channel/message").MessageSender | undefined;
            readonly receiver: string[] | undefined;
            readonly private: boolean;
            send: (message: string, target?: string[] | undefined) => Promise<void>;
            retry: () => Promise<void>;
            cancel: () => void;
            incoming: (data: import("./channel/message").MessageData) => any;
        };
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    trtc: object;
    join: (options?: Partial<import("./conference").JoinOptions>) => Promise<any>;
    leave: () => Promise<any>;
    end: () => Promise<any>;
    share: (options?: import("./channel").ConnectOptions | undefined) => Promise<void>;
    sendMessage: (msg: string, target?: string[] | undefined) => Promise<void>;
    on(event: string | string[], fn: Function): {
        on(event: string | string[], fn: Function): any;
        off(event: string | string[], fn?: Function | undefined): any;
        once(event: string | string[], fn: Function): any;
        emit(event: string, ...args: any[]): any;
    };
    off(event: string | string[], fn?: Function | undefined): {
        on(event: string | string[], fn: Function): any;
        off(event: string | string[], fn?: Function | undefined): any;
        once(event: string | string[], fn: Function): any;
        emit(event: string, ...args: any[]): any;
    };
    once(event: string | string[], fn: Function): {
        on(event: string | string[], fn: Function): any;
        off(event: string | string[], fn?: Function | undefined): any;
        once(event: string | string[], fn: Function): any;
        emit(event: string, ...args: any[]): any;
    };
    emit(event: string, ...args: any[]): {
        on(event: string | string[], fn: Function): any;
        off(event: string | string[], fn?: Function | undefined): any;
        once(event: string | string[], fn: Function): any;
        emit(event: string, ...args: any[]): any;
    };
}>;

export declare interface ConnectOptions extends JoinOptions {
}

declare interface ConnectOptions_2 {
    rtcConstraints?: RTCConfiguration;
    rtcOfferConstraints?: RTCOfferOptions;
    mediaStream?: MediaStream;
    mediaConstraints?: MediaStreamConstraints;
}

declare function createApi(config?: AxiosRequestConfig): {
    readonly interceptors: {
        request: import("axios").AxiosInterceptorManager<AxiosRequestConfig>;
        response: import("axios").AxiosInterceptorManager<AxiosResponse<any>>;
    };
    request: <T extends "getVirtualJWT" | "getURL" | "getFullInfo" | "getBasicInfo" | "getBasicInfoOffline" | "getStats" | "polling" | "keepalive" | "joinFocus" | "joinWechat" | "joinMedia" | "renegMedia" | "joinShare" | "leaveShare" | "switchShare" | "renegShare" | "pushMessage" | "pullMessage" | "muteAll" | "unmuteAll" | "acceptLobbyUser" | "acceptLobbyUserAll" | "rejectLobbyUserAll" | "waitLobbyUser" | "waitLobbyUserAll" | "rejectHandupAll" | "deleteUser" | "setUserMedia" | "setUserRole" | "setUserDisplayText" | "holdUser" | "inviteUser" | "setFocusVideo" | "setSpeakMode" | "setFreeLayout" | "setCustomizeLayout" | "setGlobalLayout" | "setFecc" | "setTitle" | "sendTitle" | "setRecord" | "setRTMP" | "setLock" | "leave" | "end" = "getVirtualJWT" | "getURL" | "getFullInfo" | "getBasicInfo" | "getBasicInfoOffline" | "getStats" | "polling" | "keepalive" | "joinFocus" | "joinWechat" | "joinMedia" | "renegMedia" | "joinShare" | "leaveShare" | "switchShare" | "renegShare" | "pushMessage" | "pullMessage" | "muteAll" | "unmuteAll" | "acceptLobbyUser" | "acceptLobbyUserAll" | "rejectLobbyUserAll" | "waitLobbyUser" | "waitLobbyUserAll" | "rejectHandupAll" | "deleteUser" | "setUserMedia" | "setUserRole" | "setUserDisplayText" | "holdUser" | "inviteUser" | "setFocusVideo" | "setSpeakMode" | "setFreeLayout" | "setCustomizeLayout" | "setGlobalLayout" | "setFecc" | "setTitle" | "sendTitle" | "setRecord" | "setRTMP" | "setLock" | "leave" | "end">(apiName: T) => import("./request").Request<ApiDataMap[T], ApiParamsMap[T], any>;
};

export declare function createConference(config: ConferenceConfigs): {
    api: {
        readonly interceptors: {
            request: import("axios").AxiosInterceptorManager<import("axios").AxiosRequestConfig>;
            response: import("axios").AxiosInterceptorManager<AxiosResponse<any>>;
        };
        request: <T extends "getURL" | "getVirtualJWT" | "getFullInfo" | "getBasicInfo" | "getBasicInfoOffline" | "getStats" | "polling" | "keepalive" | "joinFocus" | "joinWechat" | "joinMedia" | "renegMedia" | "joinShare" | "leaveShare" | "switchShare" | "renegShare" | "pushMessage" | "pullMessage" | "muteAll" | "unmuteAll" | "acceptLobbyUser" | "acceptLobbyUserAll" | "rejectLobbyUserAll" | "waitLobbyUser" | "waitLobbyUserAll" | "rejectHandupAll" | "deleteUser" | "setUserMedia" | "setUserRole" | "setUserDisplayText" | "holdUser" | "inviteUser" | "setFocusVideo" | "setSpeakMode" | "setFreeLayout" | "setCustomizeLayout" | "setGlobalLayout" | "setFecc" | "setTitle" | "sendTitle" | "setRecord" | "setRTMP" | "setLock" | "leave" | "end" = "getURL" | "getVirtualJWT" | "getFullInfo" | "getBasicInfo" | "getBasicInfoOffline" | "getStats" | "polling" | "keepalive" | "joinFocus" | "joinWechat" | "joinMedia" | "renegMedia" | "joinShare" | "leaveShare" | "switchShare" | "renegShare" | "pushMessage" | "pullMessage" | "muteAll" | "unmuteAll" | "acceptLobbyUser" | "acceptLobbyUserAll" | "rejectLobbyUserAll" | "waitLobbyUser" | "waitLobbyUserAll" | "rejectHandupAll" | "deleteUser" | "setUserMedia" | "setUserRole" | "setUserDisplayText" | "holdUser" | "inviteUser" | "setFocusVideo" | "setSpeakMode" | "setFreeLayout" | "setCustomizeLayout" | "setGlobalLayout" | "setFecc" | "setTitle" | "sendTitle" | "setRecord" | "setRTMP" | "setLock" | "leave" | "end">(apiName: T) => Request<import("../api/api-configs").ApiDataMap[T], import("../api/api-configs").ApiParamsMap[T], any>;
    };
    url: string | undefined;
    uuid: string | undefined;
    userId: string;
    user: {
        data: import("./conference-info").ConferenceUser;
        get(key: string | number): any;
        update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
        getEntity: () => string;
        getUID: () => string;
        getDisplayText: () => string;
        getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
        isCurrent: () => boolean;
        isAttendee: () => boolean;
        isPresenter: () => boolean;
        isCastviewer: () => boolean;
        isOrganizer: () => boolean;
        getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
        isOnHold: () => boolean | undefined;
        hasFocus: () => boolean;
        hasMedia: () => boolean;
        hasSharing: () => boolean;
        hasFECC: () => boolean;
        getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
        getAudioFilter: () => {
            ingress: "unblock" | "block" | "unblocking";
            egress: "unblock" | "block" | "unblocking";
        };
        getVideoFilter: () => {
            ingress: "unblock" | "block" | "unblocking";
            egress: "unblock" | "block" | "unblocking";
        };
        isAudioBlocked: () => boolean;
        isVideoBlocked: () => boolean;
        isHandup: () => boolean;
        isSharing: () => boolean | undefined;
        isSIP: () => boolean;
        isHTTP: () => boolean;
        isRTMP: () => boolean;
        setFilter: (options: import("./user").FilterOptions) => Promise<void>;
        setAudioFilter: (enable: boolean) => Promise<void>;
        setVideoFilter: (enable: boolean) => Promise<void>;
        setDisplayText: (displayText: string) => Promise<void>;
        setRole: (role: "attendee" | "presenter") => Promise<void>;
        setFocus: (enable?: boolean) => Promise<void>;
        getStats: () => Promise<void>;
        kick: () => Promise<void>;
        hold: () => Promise<void>;
        unhold: () => Promise<void>;
        allow: () => Promise<void>;
        accept: () => Promise<void>;
        reject: () => Promise<void>;
        sendMessage: (msg: string) => Promise<void>;
        camera: {
            action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
            left: () => Promise<void>;
            right: () => Promise<void>;
            down: () => Promise<void>;
            up: () => Promise<void>;
            zoomout: () => Promise<void>;
            zoomin: () => Promise<void>;
            focusout: () => Promise<void>;
            focusin: () => Promise<void>;
        };
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    information: {
        data: ConferenceInformation;
        version: number;
        get(key: string | number): any;
        description: {
            data: import("./conference-info").ConferenceDescription;
            subject: string;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceDescription | undefined) => void;
            getLock: () => import("./description").LockOptions;
            setLock: (options: import("./description").LockOptions) => Promise<void>;
            lock: (attendeeByPass?: boolean, presenterOnly?: boolean) => Promise<void>;
            unlock: () => Promise<void>;
            isLocked: () => boolean;
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        };
        state: {
            data: import("./conference-info").ConferenceState;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceState | undefined) => void;
            getSharingUserEntity: () => string;
            getSpeechUserEntity: () => string | undefined;
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        };
        view: {
            update: (diff?: import("./conference-info").ConferenceView | undefined) => void;
            getVideoView: () => import("./conference-info").EntityView | undefined;
            getLayout: () => import("./conference-info").EntityState | undefined;
            getFocusUserEntity: () => string;
            getDanmaku: () => import("./conference-info").EntityViewTitle | undefined;
            setDanmaku: (config: Partial<import("./danmaku-ctrl").DanmakuConfigs>) => Promise<void>;
            sendDanmaku: (msg: string, options?: Partial<import("./danmaku-ctrl").DanmakuOptions> | undefined) => Promise<void>;
            setLayout: (options: import("../api/api-configs").CtrlApiData & {
                'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                'speech-excitation-video-big-view'?: number | undefined;
                'speech-excitation-video-max-view'?: number | undefined;
                'equality-video-max-view'?: number | undefined;
                'ext-video-as-focus': number;
                'speech-excitation-video-round-enabled'?: boolean | undefined;
                'speech-excitation-video-round-number'?: number | undefined;
                'speech-excitation-video-round-interval'?: number | undefined;
                'equality-video-round-enabled'?: boolean | undefined;
                'equality-video-round-number'?: number | undefined;
                'equality-video-round-interval'?: number | undefined;
            }) => Promise<void>;
            setCustomizeLayout: (options: import("../api/api-configs").CtrlApiData & {
                'enable'?: boolean | undefined;
                'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
                'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                'speech-excitation-video-big-view'?: number | undefined;
                'speech-excitation-video-max-view'?: number | undefined;
                'equality-video-max-view'?: number | undefined;
                'ext-video-as-focus'?: number | undefined;
                'speech-excitation-video-round-enabled': boolean;
                'speech-excitation-video-round-number': number;
                'speech-excitation-video-round-interval': number;
                'equality-video-round-enabled'?: boolean | undefined;
                'equality-video-round-number'?: number | undefined;
                'equality-video-round-interval'?: number | undefined;
                'applied-to-attendee': boolean;
                'applied-to-cast-viewer': boolean;
                'selected-user-entity'?: string[] | undefined;
                'pos'?: number | undefined;
                'entity'?: string | undefined;
            }) => Promise<void>;
            setPresenterLayout: (options: import("../api/api-configs").CtrlApiData & {
                'enable'?: boolean | undefined;
                'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
                'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                'speech-excitation-video-big-view'?: number | undefined;
                'speech-excitation-video-max-view'?: number | undefined;
                'equality-video-max-view'?: number | undefined;
                'ext-video-as-focus'?: number | undefined;
                'speech-excitation-video-round-enabled': boolean;
                'speech-excitation-video-round-number': number;
                'speech-excitation-video-round-interval': number;
                'equality-video-round-enabled'?: boolean | undefined;
                'equality-video-round-number'?: number | undefined;
                'equality-video-round-interval'?: number | undefined;
                'applied-to-attendee': boolean;
                'applied-to-cast-viewer': boolean;
                'selected-user-entity'?: string[] | undefined;
                'pos'?: number | undefined;
                'entity'?: string | undefined;
            }) => Promise<void>;
            setAttendeeLayout: (options: import("../api/api-configs").CtrlApiData & {
                'enable'?: boolean | undefined;
                'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
                'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                'speech-excitation-video-big-view'?: number | undefined;
                'speech-excitation-video-max-view'?: number | undefined;
                'equality-video-max-view'?: number | undefined;
                'ext-video-as-focus'?: number | undefined;
                'speech-excitation-video-round-enabled': boolean;
                'speech-excitation-video-round-number': number;
                'speech-excitation-video-round-interval': number;
                'equality-video-round-enabled'?: boolean | undefined;
                'equality-video-round-number'?: number | undefined;
                'equality-video-round-interval'?: number | undefined;
                'applied-to-attendee': boolean;
                'applied-to-cast-viewer': boolean;
                'selected-user-entity'?: string[] | undefined;
                'pos'?: number | undefined;
                'entity'?: string | undefined;
            }) => Promise<void>;
            setCastViewerLayout: (options: import("../api/api-configs").CtrlApiData & {
                'enable'?: boolean | undefined;
                'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
                'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                'speech-excitation-video-big-view'?: number | undefined;
                'speech-excitation-video-max-view'?: number | undefined;
                'equality-video-max-view'?: number | undefined;
                'ext-video-as-focus'?: number | undefined;
                'speech-excitation-video-round-enabled': boolean;
                'speech-excitation-video-round-number': number;
                'speech-excitation-video-round-interval': number;
                'equality-video-round-enabled'?: boolean | undefined;
                'equality-video-round-number'?: number | undefined;
                'equality-video-round-interval'?: number | undefined;
                'applied-to-attendee': boolean;
                'applied-to-cast-viewer': boolean;
                'selected-user-entity'?: string[] | undefined;
                'pos'?: number | undefined;
                'entity'?: string | undefined;
            }) => Promise<void>;
            setOSD: (options?: {
                name: boolean;
                icon: boolean;
            }) => Promise<void>;
            setSpeakMode: (mode: "free" | "hand-up") => Promise<void>;
            data: import("./conference-info").ConferenceView;
            get(key: string | number): any;
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        };
        users: {
            update: (diff?: import("./conference-info").ConferenceUsers | undefined) => void;
            getUserList: (filter?: ((user?: {
                data: import("./conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            } | undefined) => boolean) | undefined) => {
                data: import("./conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getUser: (entity: string) => {
                data: import("./conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            } | undefined;
            hasUser: (entity: string) => boolean;
            getCurrent: () => {
                data: import("./conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            } | undefined;
            getAttendee: () => {
                data: import("./conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getPresenter: () => {
                data: import("./conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getCastviewer: () => {
                data: import("./conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getOrganizer: () => {
                data: import("./conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getOnhold: () => {
                data: import("./conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getHandup: () => {
                data: import("./conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getSharing: () => {
                data: import("./conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getAudioBlocked: () => {
                data: import("./conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getVideoBlocked: () => {
                data: import("./conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getSIP: () => {
                data: import("./conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getHTTP: () => {
                data: import("./conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getRTMP: () => {
                data: import("./conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("./user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            invite: (option: Partial<import("./users").InviteOptions>) => Promise<void>;
            kick: (entity: string) => Promise<void>;
            mute: () => Promise<void>;
            unmute: () => Promise<void>;
            remove: (entity?: string | undefined) => Promise<void>;
            unhold: (entity?: string | undefined) => Promise<void>;
            hold: (entity?: string | undefined) => Promise<void>;
            allow: (entity?: string | undefined) => Promise<void>;
            data: import("./conference-info").ConferenceUsers;
            get(key: string | number): any;
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        };
        rtmp: {
            operation: (type: import("./rtmp-ctrl").RTMPOperationType) => Promise<void>;
            start: () => Promise<void>;
            stop: () => Promise<void>;
            pause: () => Promise<void>;
            resume: () => Promise<void>;
            data: import("./conference-info").ConferenceRTMPUsers;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceRTMPUsers | undefined) => void;
            getEnable: () => boolean;
            getStatus: (entity?: string | undefined) => "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming" | undefined;
            getReason: (entity?: string | undefined) => import("./conference-info").StateReason | undefined;
            getDetail: (entity?: string | undefined) => {
                reason: import("./conference-info").StateReason;
                status: "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming";
                lastStartTime: number;
                lastStopDuration: number;
            } | undefined;
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        };
        record: {
            operation: (type: import("./rtmp-ctrl").RTMPOperationType) => Promise<void>;
            start: () => Promise<void>;
            stop: () => Promise<void>;
            pause: () => Promise<void>;
            resume: () => Promise<void>;
            data: import("./conference-info").ConferenceRecordUsers;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceRecordUsers | undefined) => void;
            getStatus: () => "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming";
            getReason: () => import("./conference-info").StateReason;
            getDetail: () => {
                reason: import("./conference-info").StateReason;
                status: "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming";
                lastStartTime: number;
                lastStopDuration: number;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        };
        update: (val: ConferenceInformation) => void;
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    description: {
        data: import("./conference-info").ConferenceDescription;
        subject: string;
        get(key: string | number): any;
        update: (diff?: import("./conference-info").ConferenceDescription | undefined) => void;
        getLock: () => import("./description").LockOptions;
        setLock: (options: import("./description").LockOptions) => Promise<void>;
        lock: (attendeeByPass?: boolean, presenterOnly?: boolean) => Promise<void>;
        unlock: () => Promise<void>;
        isLocked: () => boolean;
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    state: {
        data: import("./conference-info").ConferenceState;
        get(key: string | number): any;
        update: (diff?: import("./conference-info").ConferenceState | undefined) => void;
        getSharingUserEntity: () => string;
        getSpeechUserEntity: () => string | undefined;
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    view: {
        update: (diff?: import("./conference-info").ConferenceView | undefined) => void;
        getVideoView: () => import("./conference-info").EntityView | undefined;
        getLayout: () => import("./conference-info").EntityState | undefined;
        getFocusUserEntity: () => string;
        getDanmaku: () => import("./conference-info").EntityViewTitle | undefined;
        setDanmaku: (config: Partial<import("./danmaku-ctrl").DanmakuConfigs>) => Promise<void>;
        sendDanmaku: (msg: string, options?: Partial<import("./danmaku-ctrl").DanmakuOptions> | undefined) => Promise<void>;
        setLayout: (options: import("../api/api-configs").CtrlApiData & {
            'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
            'speech-excitation-video-big-view'?: number | undefined;
            'speech-excitation-video-max-view'?: number | undefined;
            'equality-video-max-view'?: number | undefined;
            'ext-video-as-focus': number;
            'speech-excitation-video-round-enabled'?: boolean | undefined;
            'speech-excitation-video-round-number'?: number | undefined;
            'speech-excitation-video-round-interval'?: number | undefined;
            'equality-video-round-enabled'?: boolean | undefined;
            'equality-video-round-number'?: number | undefined;
            'equality-video-round-interval'?: number | undefined;
        }) => Promise<void>;
        setCustomizeLayout: (options: import("../api/api-configs").CtrlApiData & {
            'enable'?: boolean | undefined;
            'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
            'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
            'speech-excitation-video-big-view'?: number | undefined;
            'speech-excitation-video-max-view'?: number | undefined;
            'equality-video-max-view'?: number | undefined;
            'ext-video-as-focus'?: number | undefined;
            'speech-excitation-video-round-enabled': boolean;
            'speech-excitation-video-round-number': number;
            'speech-excitation-video-round-interval': number;
            'equality-video-round-enabled'?: boolean | undefined;
            'equality-video-round-number'?: number | undefined;
            'equality-video-round-interval'?: number | undefined;
            'applied-to-attendee': boolean;
            'applied-to-cast-viewer': boolean;
            'selected-user-entity'?: string[] | undefined;
            'pos'?: number | undefined;
            'entity'?: string | undefined;
        }) => Promise<void>;
        setPresenterLayout: (options: import("../api/api-configs").CtrlApiData & {
            'enable'?: boolean | undefined;
            'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
            'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
            'speech-excitation-video-big-view'?: number | undefined;
            'speech-excitation-video-max-view'?: number | undefined;
            'equality-video-max-view'?: number | undefined;
            'ext-video-as-focus'?: number | undefined;
            'speech-excitation-video-round-enabled': boolean;
            'speech-excitation-video-round-number': number;
            'speech-excitation-video-round-interval': number;
            'equality-video-round-enabled'?: boolean | undefined;
            'equality-video-round-number'?: number | undefined;
            'equality-video-round-interval'?: number | undefined;
            'applied-to-attendee': boolean;
            'applied-to-cast-viewer': boolean;
            'selected-user-entity'?: string[] | undefined;
            'pos'?: number | undefined;
            'entity'?: string | undefined;
        }) => Promise<void>;
        setAttendeeLayout: (options: import("../api/api-configs").CtrlApiData & {
            'enable'?: boolean | undefined;
            'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
            'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
            'speech-excitation-video-big-view'?: number | undefined;
            'speech-excitation-video-max-view'?: number | undefined;
            'equality-video-max-view'?: number | undefined;
            'ext-video-as-focus'?: number | undefined;
            'speech-excitation-video-round-enabled': boolean;
            'speech-excitation-video-round-number': number;
            'speech-excitation-video-round-interval': number;
            'equality-video-round-enabled'?: boolean | undefined;
            'equality-video-round-number'?: number | undefined;
            'equality-video-round-interval'?: number | undefined;
            'applied-to-attendee': boolean;
            'applied-to-cast-viewer': boolean;
            'selected-user-entity'?: string[] | undefined;
            'pos'?: number | undefined;
            'entity'?: string | undefined;
        }) => Promise<void>;
        setCastViewerLayout: (options: import("../api/api-configs").CtrlApiData & {
            'enable'?: boolean | undefined;
            'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
            'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
            'speech-excitation-video-big-view'?: number | undefined;
            'speech-excitation-video-max-view'?: number | undefined;
            'equality-video-max-view'?: number | undefined;
            'ext-video-as-focus'?: number | undefined;
            'speech-excitation-video-round-enabled': boolean;
            'speech-excitation-video-round-number': number;
            'speech-excitation-video-round-interval': number;
            'equality-video-round-enabled'?: boolean | undefined;
            'equality-video-round-number'?: number | undefined;
            'equality-video-round-interval'?: number | undefined;
            'applied-to-attendee': boolean;
            'applied-to-cast-viewer': boolean;
            'selected-user-entity'?: string[] | undefined;
            'pos'?: number | undefined;
            'entity'?: string | undefined;
        }) => Promise<void>;
        setOSD: (options?: {
            name: boolean;
            icon: boolean;
        }) => Promise<void>;
        setSpeakMode: (mode: "free" | "hand-up") => Promise<void>;
        data: import("./conference-info").ConferenceView;
        get(key: string | number): any;
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    users: {
        update: (diff?: import("./conference-info").ConferenceUsers | undefined) => void;
        getUserList: (filter?: ((user?: {
            data: import("./conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        } | undefined) => boolean) | undefined) => {
            data: import("./conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getUser: (entity: string) => {
            data: import("./conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        } | undefined;
        hasUser: (entity: string) => boolean;
        getCurrent: () => {
            data: import("./conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        } | undefined;
        getAttendee: () => {
            data: import("./conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getPresenter: () => {
            data: import("./conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getCastviewer: () => {
            data: import("./conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getOrganizer: () => {
            data: import("./conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getOnhold: () => {
            data: import("./conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getHandup: () => {
            data: import("./conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getSharing: () => {
            data: import("./conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getAudioBlocked: () => {
            data: import("./conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getVideoBlocked: () => {
            data: import("./conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getSIP: () => {
            data: import("./conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getHTTP: () => {
            data: import("./conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        getRTMP: () => {
            data: import("./conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("./conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("./conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("./conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("./user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("./camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        }[];
        invite: (option: Partial<import("./users").InviteOptions>) => Promise<void>;
        kick: (entity: string) => Promise<void>;
        mute: () => Promise<void>;
        unmute: () => Promise<void>;
        remove: (entity?: string | undefined) => Promise<void>;
        unhold: (entity?: string | undefined) => Promise<void>;
        hold: (entity?: string | undefined) => Promise<void>;
        allow: (entity?: string | undefined) => Promise<void>;
        data: import("./conference-info").ConferenceUsers;
        get(key: string | number): any;
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    rtmp: {
        operation: (type: import("./rtmp-ctrl").RTMPOperationType) => Promise<void>;
        start: () => Promise<void>;
        stop: () => Promise<void>;
        pause: () => Promise<void>;
        resume: () => Promise<void>;
        data: import("./conference-info").ConferenceRTMPUsers;
        get(key: string | number): any;
        update: (diff?: import("./conference-info").ConferenceRTMPUsers | undefined) => void;
        getEnable: () => boolean;
        getStatus: (entity?: string | undefined) => "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming" | undefined;
        getReason: (entity?: string | undefined) => import("./conference-info").StateReason | undefined;
        getDetail: (entity?: string | undefined) => {
            reason: import("./conference-info").StateReason;
            status: "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming";
            lastStartTime: number;
            lastStopDuration: number;
        } | undefined;
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    record: {
        operation: (type: import("./rtmp-ctrl").RTMPOperationType) => Promise<void>;
        start: () => Promise<void>;
        stop: () => Promise<void>;
        pause: () => Promise<void>;
        resume: () => Promise<void>;
        data: import("./conference-info").ConferenceRecordUsers;
        get(key: string | number): any;
        update: (diff?: import("./conference-info").ConferenceRecordUsers | undefined) => void;
        getStatus: () => "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming";
        getReason: () => import("./conference-info").StateReason;
        getDetail: () => {
            reason: import("./conference-info").StateReason;
            status: "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming";
            lastStartTime: number;
            lastStopDuration: number;
        };
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    mediaChannel: {
        status: import("../channel/channel").STATUS;
        connection: RTCPeerConnection | undefined;
        version: number;
        callId: string;
        isInProgress: () => boolean;
        isEstablished: () => boolean;
        isEnded: () => boolean;
        getMute: () => {
            audio: boolean;
            video: boolean;
        };
        getHold: () => {
            local: boolean;
            remote: boolean;
        };
        connect: (options?: ConnectOptions_2) => Promise<void>;
        terminate: (reason?: string | undefined) => Promise<void>;
        renegotiate: (options?: import("../channel/channel").RenegotiateOptions) => Promise<void>;
        mute: (options?: {
            audio: boolean;
            video: boolean;
        }) => void;
        unmute: (options?: {
            audio: boolean;
            video: boolean;
        }) => void;
        hold: () => Promise<void>;
        unhold: () => Promise<void>;
        getRemoteStream: () => MediaStream | undefined;
        addLocalStream: (stream?: MediaStream | undefined) => void;
        removeLocalStream: () => void;
        getLocalStream: () => MediaStream | undefined;
        setLocalStream: (stream?: MediaStream | undefined) => void;
        replaceLocalStream: (stream?: MediaStream | undefined, renegotiation?: boolean) => Promise<void>;
        adjustBandWidth: (options: {
            audio?: number | undefined;
            video?: number | undefined;
        }) => Promise<void>;
        applyConstraints: (options: {
            audio?: MediaTrackConstraints | undefined;
            video?: MediaTrackConstraints | undefined;
        }) => Promise<void>;
        getStats: () => Promise<{
            readonly quality: number;
            readonly inbound: import("../channel/rtc-stats").ParsedStats;
            readonly outbound: import("../channel/rtc-stats").ParsedStats;
            update: (report: RTCStatsReport) => void;
            clear: () => void;
        }>;
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    shareChannel: {
        status: import("../channel/channel").STATUS;
        connection: RTCPeerConnection | undefined;
        version: number;
        callId: string;
        isInProgress: () => boolean;
        isEstablished: () => boolean;
        isEnded: () => boolean;
        getMute: () => {
            audio: boolean;
            video: boolean;
        };
        getHold: () => {
            local: boolean;
            remote: boolean;
        };
        connect: (options?: ConnectOptions_2) => Promise<void>;
        terminate: (reason?: string | undefined) => Promise<void>;
        renegotiate: (options?: import("../channel/channel").RenegotiateOptions) => Promise<void>;
        mute: (options?: {
            audio: boolean;
            video: boolean;
        }) => void;
        unmute: (options?: {
            audio: boolean;
            video: boolean;
        }) => void;
        hold: () => Promise<void>;
        unhold: () => Promise<void>;
        getRemoteStream: () => MediaStream | undefined;
        addLocalStream: (stream?: MediaStream | undefined) => void;
        removeLocalStream: () => void;
        getLocalStream: () => MediaStream | undefined;
        setLocalStream: (stream?: MediaStream | undefined) => void;
        replaceLocalStream: (stream?: MediaStream | undefined, renegotiation?: boolean) => Promise<void>;
        adjustBandWidth: (options: {
            audio?: number | undefined;
            video?: number | undefined;
        }) => Promise<void>;
        applyConstraints: (options: {
            audio?: MediaTrackConstraints | undefined;
            video?: MediaTrackConstraints | undefined;
        }) => Promise<void>;
        getStats: () => Promise<{
            readonly quality: number;
            readonly inbound: import("../channel/rtc-stats").ParsedStats;
            readonly outbound: import("../channel/rtc-stats").ParsedStats;
            update: (report: RTCStatsReport) => void;
            clear: () => void;
        }>;
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    chatChannel: {
        ready: boolean;
        connect: (count?: number) => Promise<void>;
        terminate: () => Promise<void>;
        sendMessage: (msg: string, target?: string[] | undefined) => Promise<{
            readonly status: import("../channel/message").MessageStatus;
            readonly direction: import("../channel/message").MessageDirection;
            readonly content: string | undefined;
            readonly timestamp: number | undefined;
            readonly version: number | undefined;
            readonly sender: import("../channel/message").MessageSender | undefined;
            readonly receiver: string[] | undefined;
            readonly private: boolean;
            send: (message: string, target?: string[] | undefined) => Promise<void>;
            retry: () => Promise<void>;
            cancel: () => void;
            incoming: (data: import("../channel/message").MessageData) => any;
        }>;
        incoming: (data: import("../channel/message").MessageData) => {
            readonly status: import("../channel/message").MessageStatus;
            readonly direction: import("../channel/message").MessageDirection;
            readonly content: string | undefined;
            readonly timestamp: number | undefined;
            readonly version: number | undefined;
            readonly sender: import("../channel/message").MessageSender | undefined;
            readonly receiver: string[] | undefined;
            readonly private: boolean;
            send: (message: string, target?: string[] | undefined) => Promise<void>;
            retry: () => Promise<void>;
            cancel: () => void;
            incoming: (data: import("../channel/message").MessageData) => any;
        };
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    } | undefined;
    trtc: object;
    join: (options?: Partial<JoinOptions>) => Promise<any>;
    leave: () => Promise<any>;
    end: () => Promise<any>;
    share: (options?: ConnectOptions_2 | undefined) => Promise<void>;
    sendMessage: (msg: string, target?: string[] | undefined) => Promise<void>;
    on(event: string | string[], fn: Function): {
        on(event: string | string[], fn: Function): any;
        off(event: string | string[], fn?: Function | undefined): any;
        once(event: string | string[], fn: Function): any;
        emit(event: string, ...args: any[]): any;
    };
    off(event: string | string[], fn?: Function | undefined): {
        on(event: string | string[], fn: Function): any;
        off(event: string | string[], fn?: Function | undefined): any;
        once(event: string | string[], fn: Function): any;
        emit(event: string, ...args: any[]): any;
    };
    once(event: string | string[], fn: Function): {
        on(event: string | string[], fn: Function): any;
        off(event: string | string[], fn?: Function | undefined): any;
        once(event: string | string[], fn: Function): any;
        emit(event: string, ...args: any[]): any;
    };
    emit(event: string, ...args: any[]): {
        on(event: string | string[], fn: Function): any;
        off(event: string | string[], fn?: Function | undefined): any;
        once(event: string | string[], fn: Function): any;
        emit(event: string, ...args: any[]): any;
    };
};

export declare function createEvents(scopedlog?: Debugger): {
    on(event: string | string[], fn: Function): any;
    off(event: string | string[], fn?: Function | undefined): any;
    once(event: string | string[], fn: Function): any;
    emit(event: string, ...args: any[]): any;
};

export declare function createMedia(): {};

export declare function createReactive(data?: object, events?: Events): object;

export declare function createUA(config?: UAConfigs): {
    stop: () => void;
    fetch: (number: string) => Promise<{
        partyId: string;
        number: string;
        url: string;
        info: any;
    }>;
    connect: (options: ConnectOptions) => Promise<{
        api: {
            readonly interceptors: {
                request: import("axios").AxiosInterceptorManager<import("axios").AxiosRequestConfig>;
                response: import("axios").AxiosInterceptorManager<AxiosResponse<any>>;
            };
            request: <T extends "getVirtualJWT" | "getURL" | "getFullInfo" | "getBasicInfo" | "getBasicInfoOffline" | "getStats" | "polling" | "keepalive" | "joinFocus" | "joinWechat" | "joinMedia" | "renegMedia" | "joinShare" | "leaveShare" | "switchShare" | "renegShare" | "pushMessage" | "pullMessage" | "muteAll" | "unmuteAll" | "acceptLobbyUser" | "acceptLobbyUserAll" | "rejectLobbyUserAll" | "waitLobbyUser" | "waitLobbyUserAll" | "rejectHandupAll" | "deleteUser" | "setUserMedia" | "setUserRole" | "setUserDisplayText" | "holdUser" | "inviteUser" | "setFocusVideo" | "setSpeakMode" | "setFreeLayout" | "setCustomizeLayout" | "setGlobalLayout" | "setFecc" | "setTitle" | "sendTitle" | "setRecord" | "setRTMP" | "setLock" | "leave" | "end" = "getVirtualJWT" | "getURL" | "getFullInfo" | "getBasicInfo" | "getBasicInfoOffline" | "getStats" | "polling" | "keepalive" | "joinFocus" | "joinWechat" | "joinMedia" | "renegMedia" | "joinShare" | "leaveShare" | "switchShare" | "renegShare" | "pushMessage" | "pullMessage" | "muteAll" | "unmuteAll" | "acceptLobbyUser" | "acceptLobbyUserAll" | "rejectLobbyUserAll" | "waitLobbyUser" | "waitLobbyUserAll" | "rejectHandupAll" | "deleteUser" | "setUserMedia" | "setUserRole" | "setUserDisplayText" | "holdUser" | "inviteUser" | "setFocusVideo" | "setSpeakMode" | "setFreeLayout" | "setCustomizeLayout" | "setGlobalLayout" | "setFecc" | "setTitle" | "sendTitle" | "setRecord" | "setRTMP" | "setLock" | "leave" | "end">(apiName: T) => import("../api/request").Request<import("../api/api-configs").ApiDataMap[T], import("../api/api-configs").ApiParamsMap[T], any>;
        };
        url: string | undefined;
        uuid: string | undefined;
        userId: string;
        user: {
            data: import("../conference/conference-info").ConferenceUser;
            get(key: string | number): any;
            update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
            getEntity: () => string;
            getUID: () => string;
            getDisplayText: () => string;
            getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
            isCurrent: () => boolean;
            isAttendee: () => boolean;
            isPresenter: () => boolean;
            isCastviewer: () => boolean;
            isOrganizer: () => boolean;
            getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
            isOnHold: () => boolean | undefined;
            hasFocus: () => boolean;
            hasMedia: () => boolean;
            hasSharing: () => boolean;
            hasFECC: () => boolean;
            getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
            getAudioFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            getVideoFilter: () => {
                ingress: "unblock" | "block" | "unblocking";
                egress: "unblock" | "block" | "unblocking";
            };
            isAudioBlocked: () => boolean;
            isVideoBlocked: () => boolean;
            isHandup: () => boolean;
            isSharing: () => boolean | undefined;
            isSIP: () => boolean;
            isHTTP: () => boolean;
            isRTMP: () => boolean;
            setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
            setAudioFilter: (enable: boolean) => Promise<void>;
            setVideoFilter: (enable: boolean) => Promise<void>;
            setDisplayText: (displayText: string) => Promise<void>;
            setRole: (role: "attendee" | "presenter") => Promise<void>;
            setFocus: (enable?: boolean) => Promise<void>;
            getStats: () => Promise<void>;
            kick: () => Promise<void>;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            allow: () => Promise<void>;
            accept: () => Promise<void>;
            reject: () => Promise<void>;
            sendMessage: (msg: string) => Promise<void>;
            camera: {
                action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                left: () => Promise<void>;
                right: () => Promise<void>;
                down: () => Promise<void>;
                up: () => Promise<void>;
                zoomout: () => Promise<void>;
                zoomin: () => Promise<void>;
                focusout: () => Promise<void>;
                focusin: () => Promise<void>;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        } | undefined;
        information: {
            data: import("../conference/conference-info").ConferenceInformation;
            version: number;
            get(key: string | number): any;
            description: {
                data: import("../conference/conference-info").ConferenceDescription;
                subject: string;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceDescription | undefined) => void;
                getLock: () => import("../conference/description").LockOptions;
                setLock: (options: import("../conference/description").LockOptions) => Promise<void>;
                lock: (attendeeByPass?: boolean, presenterOnly?: boolean) => Promise<void>;
                unlock: () => Promise<void>;
                isLocked: () => boolean;
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            };
            state: {
                data: import("../conference/conference-info").ConferenceState;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceState | undefined) => void;
                getSharingUserEntity: () => string;
                getSpeechUserEntity: () => string | undefined;
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            };
            view: {
                update: (diff?: import("../conference/conference-info").ConferenceView | undefined) => void;
                getVideoView: () => import("../conference/conference-info").EntityView | undefined;
                getLayout: () => import("../conference/conference-info").EntityState | undefined;
                getFocusUserEntity: () => string;
                getDanmaku: () => import("../conference/conference-info").EntityViewTitle | undefined;
                setDanmaku: (config: Partial<import("../conference/danmaku-ctrl").DanmakuConfigs>) => Promise<void>;
                sendDanmaku: (msg: string, options?: Partial<import("../conference/danmaku-ctrl").DanmakuOptions> | undefined) => Promise<void>;
                setLayout: (options: import("../api/api-configs").CtrlApiData & {
                    'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                    'speech-excitation-video-big-view'?: number | undefined;
                    'speech-excitation-video-max-view'?: number | undefined;
                    'equality-video-max-view'?: number | undefined;
                    'ext-video-as-focus': number;
                    'speech-excitation-video-round-enabled'?: boolean | undefined;
                    'speech-excitation-video-round-number'?: number | undefined;
                    'speech-excitation-video-round-interval'?: number | undefined;
                    'equality-video-round-enabled'?: boolean | undefined;
                    'equality-video-round-number'?: number | undefined;
                    'equality-video-round-interval'?: number | undefined;
                }) => Promise<void>;
                setCustomizeLayout: (options: import("../api/api-configs").CtrlApiData & {
                    'enable'?: boolean | undefined;
                    'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
                    'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                    'speech-excitation-video-big-view'?: number | undefined;
                    'speech-excitation-video-max-view'?: number | undefined;
                    'equality-video-max-view'?: number | undefined;
                    'ext-video-as-focus'?: number | undefined;
                    'speech-excitation-video-round-enabled': boolean;
                    'speech-excitation-video-round-number': number;
                    'speech-excitation-video-round-interval': number;
                    'equality-video-round-enabled'?: boolean | undefined;
                    'equality-video-round-number'?: number | undefined;
                    'equality-video-round-interval'?: number | undefined;
                    'applied-to-attendee': boolean;
                    'applied-to-cast-viewer': boolean;
                    'selected-user-entity'?: string[] | undefined;
                    'pos'?: number | undefined;
                    'entity'?: string | undefined;
                }) => Promise<void>;
                setPresenterLayout: (options: import("../api/api-configs").CtrlApiData & {
                    'enable'?: boolean | undefined;
                    'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
                    'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                    'speech-excitation-video-big-view'?: number | undefined;
                    'speech-excitation-video-max-view'?: number | undefined;
                    'equality-video-max-view'?: number | undefined;
                    'ext-video-as-focus'?: number | undefined;
                    'speech-excitation-video-round-enabled': boolean;
                    'speech-excitation-video-round-number': number;
                    'speech-excitation-video-round-interval': number;
                    'equality-video-round-enabled'?: boolean | undefined;
                    'equality-video-round-number'?: number | undefined;
                    'equality-video-round-interval'?: number | undefined;
                    'applied-to-attendee': boolean;
                    'applied-to-cast-viewer': boolean;
                    'selected-user-entity'?: string[] | undefined;
                    'pos'?: number | undefined;
                    'entity'?: string | undefined;
                }) => Promise<void>;
                setAttendeeLayout: (options: import("../api/api-configs").CtrlApiData & {
                    'enable'?: boolean | undefined;
                    'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
                    'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                    'speech-excitation-video-big-view'?: number | undefined;
                    'speech-excitation-video-max-view'?: number | undefined;
                    'equality-video-max-view'?: number | undefined;
                    'ext-video-as-focus'?: number | undefined;
                    'speech-excitation-video-round-enabled': boolean;
                    'speech-excitation-video-round-number': number;
                    'speech-excitation-video-round-interval': number;
                    'equality-video-round-enabled'?: boolean | undefined;
                    'equality-video-round-number'?: number | undefined;
                    'equality-video-round-interval'?: number | undefined;
                    'applied-to-attendee': boolean;
                    'applied-to-cast-viewer': boolean;
                    'selected-user-entity'?: string[] | undefined;
                    'pos'?: number | undefined;
                    'entity'?: string | undefined;
                }) => Promise<void>;
                setCastViewerLayout: (options: import("../api/api-configs").CtrlApiData & {
                    'enable'?: boolean | undefined;
                    'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
                    'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                    'speech-excitation-video-big-view'?: number | undefined;
                    'speech-excitation-video-max-view'?: number | undefined;
                    'equality-video-max-view'?: number | undefined;
                    'ext-video-as-focus'?: number | undefined;
                    'speech-excitation-video-round-enabled': boolean;
                    'speech-excitation-video-round-number': number;
                    'speech-excitation-video-round-interval': number;
                    'equality-video-round-enabled'?: boolean | undefined;
                    'equality-video-round-number'?: number | undefined;
                    'equality-video-round-interval'?: number | undefined;
                    'applied-to-attendee': boolean;
                    'applied-to-cast-viewer': boolean;
                    'selected-user-entity'?: string[] | undefined;
                    'pos'?: number | undefined;
                    'entity'?: string | undefined;
                }) => Promise<void>;
                setOSD: (options?: {
                    name: boolean;
                    icon: boolean;
                }) => Promise<void>;
                setSpeakMode: (mode: "free" | "hand-up") => Promise<void>;
                data: import("../conference/conference-info").ConferenceView;
                get(key: string | number): any;
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            };
            users: {
                update: (diff?: import("../conference/conference-info").ConferenceUsers | undefined) => void;
                getUserList: (filter?: ((user?: {
                    data: import("../conference/conference-info").ConferenceUser;
                    get(key: string | number): any;
                    update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                    getEntity: () => string;
                    getUID: () => string;
                    getDisplayText: () => string;
                    getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                    isCurrent: () => boolean;
                    isAttendee: () => boolean;
                    isPresenter: () => boolean;
                    isCastviewer: () => boolean;
                    isOrganizer: () => boolean;
                    getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                    isOnHold: () => boolean | undefined;
                    hasFocus: () => boolean;
                    hasMedia: () => boolean;
                    hasSharing: () => boolean;
                    hasFECC: () => boolean;
                    getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                    getAudioFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    getVideoFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    isAudioBlocked: () => boolean;
                    isVideoBlocked: () => boolean;
                    isHandup: () => boolean;
                    isSharing: () => boolean | undefined;
                    isSIP: () => boolean;
                    isHTTP: () => boolean;
                    isRTMP: () => boolean;
                    setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                    setAudioFilter: (enable: boolean) => Promise<void>;
                    setVideoFilter: (enable: boolean) => Promise<void>;
                    setDisplayText: (displayText: string) => Promise<void>;
                    setRole: (role: "attendee" | "presenter") => Promise<void>;
                    setFocus: (enable?: boolean) => Promise<void>;
                    getStats: () => Promise<void>;
                    kick: () => Promise<void>;
                    hold: () => Promise<void>;
                    unhold: () => Promise<void>;
                    allow: () => Promise<void>;
                    accept: () => Promise<void>;
                    reject: () => Promise<void>;
                    sendMessage: (msg: string) => Promise<void>;
                    camera: {
                        action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                        left: () => Promise<void>;
                        right: () => Promise<void>;
                        down: () => Promise<void>;
                        up: () => Promise<void>;
                        zoomout: () => Promise<void>;
                        zoomin: () => Promise<void>;
                        focusout: () => Promise<void>;
                        focusin: () => Promise<void>;
                    };
                    on(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    off(event: string | string[], fn?: Function | undefined): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    once(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    emit(event: string, ...args: any[]): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                } | undefined) => boolean) | undefined) => {
                    data: import("../conference/conference-info").ConferenceUser;
                    get(key: string | number): any;
                    update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                    getEntity: () => string;
                    getUID: () => string;
                    getDisplayText: () => string;
                    getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                    isCurrent: () => boolean;
                    isAttendee: () => boolean;
                    isPresenter: () => boolean;
                    isCastviewer: () => boolean;
                    isOrganizer: () => boolean;
                    getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                    isOnHold: () => boolean | undefined;
                    hasFocus: () => boolean;
                    hasMedia: () => boolean;
                    hasSharing: () => boolean;
                    hasFECC: () => boolean;
                    getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                    getAudioFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    getVideoFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    isAudioBlocked: () => boolean;
                    isVideoBlocked: () => boolean;
                    isHandup: () => boolean;
                    isSharing: () => boolean | undefined;
                    isSIP: () => boolean;
                    isHTTP: () => boolean;
                    isRTMP: () => boolean;
                    setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                    setAudioFilter: (enable: boolean) => Promise<void>;
                    setVideoFilter: (enable: boolean) => Promise<void>;
                    setDisplayText: (displayText: string) => Promise<void>;
                    setRole: (role: "attendee" | "presenter") => Promise<void>;
                    setFocus: (enable?: boolean) => Promise<void>;
                    getStats: () => Promise<void>;
                    kick: () => Promise<void>;
                    hold: () => Promise<void>;
                    unhold: () => Promise<void>;
                    allow: () => Promise<void>;
                    accept: () => Promise<void>;
                    reject: () => Promise<void>;
                    sendMessage: (msg: string) => Promise<void>;
                    camera: {
                        action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                        left: () => Promise<void>;
                        right: () => Promise<void>;
                        down: () => Promise<void>;
                        up: () => Promise<void>;
                        zoomout: () => Promise<void>;
                        zoomin: () => Promise<void>;
                        focusout: () => Promise<void>;
                        focusin: () => Promise<void>;
                    };
                    on(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    off(event: string | string[], fn?: Function | undefined): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    once(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    emit(event: string, ...args: any[]): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                }[];
                getUser: (entity: string) => {
                    data: import("../conference/conference-info").ConferenceUser;
                    get(key: string | number): any;
                    update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                    getEntity: () => string;
                    getUID: () => string;
                    getDisplayText: () => string;
                    getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                    isCurrent: () => boolean;
                    isAttendee: () => boolean;
                    isPresenter: () => boolean;
                    isCastviewer: () => boolean;
                    isOrganizer: () => boolean;
                    getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                    isOnHold: () => boolean | undefined;
                    hasFocus: () => boolean;
                    hasMedia: () => boolean;
                    hasSharing: () => boolean;
                    hasFECC: () => boolean;
                    getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                    getAudioFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    getVideoFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    isAudioBlocked: () => boolean;
                    isVideoBlocked: () => boolean;
                    isHandup: () => boolean;
                    isSharing: () => boolean | undefined;
                    isSIP: () => boolean;
                    isHTTP: () => boolean;
                    isRTMP: () => boolean;
                    setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                    setAudioFilter: (enable: boolean) => Promise<void>;
                    setVideoFilter: (enable: boolean) => Promise<void>;
                    setDisplayText: (displayText: string) => Promise<void>;
                    setRole: (role: "attendee" | "presenter") => Promise<void>;
                    setFocus: (enable?: boolean) => Promise<void>;
                    getStats: () => Promise<void>;
                    kick: () => Promise<void>;
                    hold: () => Promise<void>;
                    unhold: () => Promise<void>;
                    allow: () => Promise<void>;
                    accept: () => Promise<void>;
                    reject: () => Promise<void>;
                    sendMessage: (msg: string) => Promise<void>;
                    camera: {
                        action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                        left: () => Promise<void>;
                        right: () => Promise<void>;
                        down: () => Promise<void>;
                        up: () => Promise<void>;
                        zoomout: () => Promise<void>;
                        zoomin: () => Promise<void>;
                        focusout: () => Promise<void>;
                        focusin: () => Promise<void>;
                    };
                    on(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    off(event: string | string[], fn?: Function | undefined): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    once(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    emit(event: string, ...args: any[]): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                } | undefined;
                hasUser: (entity: string) => boolean;
                getCurrent: () => {
                    data: import("../conference/conference-info").ConferenceUser;
                    get(key: string | number): any;
                    update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                    getEntity: () => string;
                    getUID: () => string;
                    getDisplayText: () => string;
                    getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                    isCurrent: () => boolean;
                    isAttendee: () => boolean;
                    isPresenter: () => boolean;
                    isCastviewer: () => boolean;
                    isOrganizer: () => boolean;
                    getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                    isOnHold: () => boolean | undefined;
                    hasFocus: () => boolean;
                    hasMedia: () => boolean;
                    hasSharing: () => boolean;
                    hasFECC: () => boolean;
                    getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                    getAudioFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    getVideoFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    isAudioBlocked: () => boolean;
                    isVideoBlocked: () => boolean;
                    isHandup: () => boolean;
                    isSharing: () => boolean | undefined;
                    isSIP: () => boolean;
                    isHTTP: () => boolean;
                    isRTMP: () => boolean;
                    setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                    setAudioFilter: (enable: boolean) => Promise<void>;
                    setVideoFilter: (enable: boolean) => Promise<void>;
                    setDisplayText: (displayText: string) => Promise<void>;
                    setRole: (role: "attendee" | "presenter") => Promise<void>;
                    setFocus: (enable?: boolean) => Promise<void>;
                    getStats: () => Promise<void>;
                    kick: () => Promise<void>;
                    hold: () => Promise<void>;
                    unhold: () => Promise<void>;
                    allow: () => Promise<void>;
                    accept: () => Promise<void>;
                    reject: () => Promise<void>;
                    sendMessage: (msg: string) => Promise<void>;
                    camera: {
                        action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                        left: () => Promise<void>;
                        right: () => Promise<void>;
                        down: () => Promise<void>;
                        up: () => Promise<void>;
                        zoomout: () => Promise<void>;
                        zoomin: () => Promise<void>;
                        focusout: () => Promise<void>;
                        focusin: () => Promise<void>;
                    };
                    on(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    off(event: string | string[], fn?: Function | undefined): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    once(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    emit(event: string, ...args: any[]): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                } | undefined;
                getAttendee: () => {
                    data: import("../conference/conference-info").ConferenceUser;
                    get(key: string | number): any;
                    update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                    getEntity: () => string;
                    getUID: () => string;
                    getDisplayText: () => string;
                    getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                    isCurrent: () => boolean;
                    isAttendee: () => boolean;
                    isPresenter: () => boolean;
                    isCastviewer: () => boolean;
                    isOrganizer: () => boolean;
                    getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                    isOnHold: () => boolean | undefined;
                    hasFocus: () => boolean;
                    hasMedia: () => boolean;
                    hasSharing: () => boolean;
                    hasFECC: () => boolean;
                    getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                    getAudioFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    getVideoFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    isAudioBlocked: () => boolean;
                    isVideoBlocked: () => boolean;
                    isHandup: () => boolean;
                    isSharing: () => boolean | undefined;
                    isSIP: () => boolean;
                    isHTTP: () => boolean;
                    isRTMP: () => boolean;
                    setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                    setAudioFilter: (enable: boolean) => Promise<void>;
                    setVideoFilter: (enable: boolean) => Promise<void>;
                    setDisplayText: (displayText: string) => Promise<void>;
                    setRole: (role: "attendee" | "presenter") => Promise<void>;
                    setFocus: (enable?: boolean) => Promise<void>;
                    getStats: () => Promise<void>;
                    kick: () => Promise<void>;
                    hold: () => Promise<void>;
                    unhold: () => Promise<void>;
                    allow: () => Promise<void>;
                    accept: () => Promise<void>;
                    reject: () => Promise<void>;
                    sendMessage: (msg: string) => Promise<void>;
                    camera: {
                        action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                        left: () => Promise<void>;
                        right: () => Promise<void>;
                        down: () => Promise<void>;
                        up: () => Promise<void>;
                        zoomout: () => Promise<void>;
                        zoomin: () => Promise<void>;
                        focusout: () => Promise<void>;
                        focusin: () => Promise<void>;
                    };
                    on(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    off(event: string | string[], fn?: Function | undefined): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    once(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    emit(event: string, ...args: any[]): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                }[];
                getPresenter: () => {
                    data: import("../conference/conference-info").ConferenceUser;
                    get(key: string | number): any;
                    update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                    getEntity: () => string;
                    getUID: () => string;
                    getDisplayText: () => string;
                    getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                    isCurrent: () => boolean;
                    isAttendee: () => boolean;
                    isPresenter: () => boolean;
                    isCastviewer: () => boolean;
                    isOrganizer: () => boolean;
                    getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                    isOnHold: () => boolean | undefined;
                    hasFocus: () => boolean;
                    hasMedia: () => boolean;
                    hasSharing: () => boolean;
                    hasFECC: () => boolean;
                    getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                    getAudioFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    getVideoFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    isAudioBlocked: () => boolean;
                    isVideoBlocked: () => boolean;
                    isHandup: () => boolean;
                    isSharing: () => boolean | undefined;
                    isSIP: () => boolean;
                    isHTTP: () => boolean;
                    isRTMP: () => boolean;
                    setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                    setAudioFilter: (enable: boolean) => Promise<void>;
                    setVideoFilter: (enable: boolean) => Promise<void>;
                    setDisplayText: (displayText: string) => Promise<void>;
                    setRole: (role: "attendee" | "presenter") => Promise<void>;
                    setFocus: (enable?: boolean) => Promise<void>;
                    getStats: () => Promise<void>;
                    kick: () => Promise<void>;
                    hold: () => Promise<void>;
                    unhold: () => Promise<void>;
                    allow: () => Promise<void>;
                    accept: () => Promise<void>;
                    reject: () => Promise<void>;
                    sendMessage: (msg: string) => Promise<void>;
                    camera: {
                        action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                        left: () => Promise<void>;
                        right: () => Promise<void>;
                        down: () => Promise<void>;
                        up: () => Promise<void>;
                        zoomout: () => Promise<void>;
                        zoomin: () => Promise<void>;
                        focusout: () => Promise<void>;
                        focusin: () => Promise<void>;
                    };
                    on(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    off(event: string | string[], fn?: Function | undefined): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    once(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    emit(event: string, ...args: any[]): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                }[];
                getCastviewer: () => {
                    data: import("../conference/conference-info").ConferenceUser;
                    get(key: string | number): any;
                    update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                    getEntity: () => string;
                    getUID: () => string;
                    getDisplayText: () => string;
                    getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                    isCurrent: () => boolean;
                    isAttendee: () => boolean;
                    isPresenter: () => boolean;
                    isCastviewer: () => boolean;
                    isOrganizer: () => boolean;
                    getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                    isOnHold: () => boolean | undefined;
                    hasFocus: () => boolean;
                    hasMedia: () => boolean;
                    hasSharing: () => boolean;
                    hasFECC: () => boolean;
                    getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                    getAudioFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    getVideoFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    isAudioBlocked: () => boolean;
                    isVideoBlocked: () => boolean;
                    isHandup: () => boolean;
                    isSharing: () => boolean | undefined;
                    isSIP: () => boolean;
                    isHTTP: () => boolean;
                    isRTMP: () => boolean;
                    setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                    setAudioFilter: (enable: boolean) => Promise<void>;
                    setVideoFilter: (enable: boolean) => Promise<void>;
                    setDisplayText: (displayText: string) => Promise<void>;
                    setRole: (role: "attendee" | "presenter") => Promise<void>;
                    setFocus: (enable?: boolean) => Promise<void>;
                    getStats: () => Promise<void>;
                    kick: () => Promise<void>;
                    hold: () => Promise<void>;
                    unhold: () => Promise<void>;
                    allow: () => Promise<void>;
                    accept: () => Promise<void>;
                    reject: () => Promise<void>;
                    sendMessage: (msg: string) => Promise<void>;
                    camera: {
                        action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                        left: () => Promise<void>;
                        right: () => Promise<void>;
                        down: () => Promise<void>;
                        up: () => Promise<void>;
                        zoomout: () => Promise<void>;
                        zoomin: () => Promise<void>;
                        focusout: () => Promise<void>;
                        focusin: () => Promise<void>;
                    };
                    on(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    off(event: string | string[], fn?: Function | undefined): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    once(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    emit(event: string, ...args: any[]): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                }[];
                getOrganizer: () => {
                    data: import("../conference/conference-info").ConferenceUser;
                    get(key: string | number): any;
                    update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                    getEntity: () => string;
                    getUID: () => string;
                    getDisplayText: () => string;
                    getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                    isCurrent: () => boolean;
                    isAttendee: () => boolean;
                    isPresenter: () => boolean;
                    isCastviewer: () => boolean;
                    isOrganizer: () => boolean;
                    getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                    isOnHold: () => boolean | undefined;
                    hasFocus: () => boolean;
                    hasMedia: () => boolean;
                    hasSharing: () => boolean;
                    hasFECC: () => boolean;
                    getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                    getAudioFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    getVideoFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    isAudioBlocked: () => boolean;
                    isVideoBlocked: () => boolean;
                    isHandup: () => boolean;
                    isSharing: () => boolean | undefined;
                    isSIP: () => boolean;
                    isHTTP: () => boolean;
                    isRTMP: () => boolean;
                    setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                    setAudioFilter: (enable: boolean) => Promise<void>;
                    setVideoFilter: (enable: boolean) => Promise<void>;
                    setDisplayText: (displayText: string) => Promise<void>;
                    setRole: (role: "attendee" | "presenter") => Promise<void>;
                    setFocus: (enable?: boolean) => Promise<void>;
                    getStats: () => Promise<void>;
                    kick: () => Promise<void>;
                    hold: () => Promise<void>;
                    unhold: () => Promise<void>;
                    allow: () => Promise<void>;
                    accept: () => Promise<void>;
                    reject: () => Promise<void>;
                    sendMessage: (msg: string) => Promise<void>;
                    camera: {
                        action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                        left: () => Promise<void>;
                        right: () => Promise<void>;
                        down: () => Promise<void>;
                        up: () => Promise<void>;
                        zoomout: () => Promise<void>;
                        zoomin: () => Promise<void>;
                        focusout: () => Promise<void>;
                        focusin: () => Promise<void>;
                    };
                    on(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    off(event: string | string[], fn?: Function | undefined): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    once(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    emit(event: string, ...args: any[]): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                }[];
                getOnhold: () => {
                    data: import("../conference/conference-info").ConferenceUser;
                    get(key: string | number): any;
                    update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                    getEntity: () => string;
                    getUID: () => string;
                    getDisplayText: () => string;
                    getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                    isCurrent: () => boolean;
                    isAttendee: () => boolean;
                    isPresenter: () => boolean;
                    isCastviewer: () => boolean;
                    isOrganizer: () => boolean;
                    getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                    isOnHold: () => boolean | undefined;
                    hasFocus: () => boolean;
                    hasMedia: () => boolean;
                    hasSharing: () => boolean;
                    hasFECC: () => boolean;
                    getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                    getAudioFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    getVideoFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    isAudioBlocked: () => boolean;
                    isVideoBlocked: () => boolean;
                    isHandup: () => boolean;
                    isSharing: () => boolean | undefined;
                    isSIP: () => boolean;
                    isHTTP: () => boolean;
                    isRTMP: () => boolean;
                    setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                    setAudioFilter: (enable: boolean) => Promise<void>;
                    setVideoFilter: (enable: boolean) => Promise<void>;
                    setDisplayText: (displayText: string) => Promise<void>;
                    setRole: (role: "attendee" | "presenter") => Promise<void>;
                    setFocus: (enable?: boolean) => Promise<void>;
                    getStats: () => Promise<void>;
                    kick: () => Promise<void>;
                    hold: () => Promise<void>;
                    unhold: () => Promise<void>;
                    allow: () => Promise<void>;
                    accept: () => Promise<void>;
                    reject: () => Promise<void>;
                    sendMessage: (msg: string) => Promise<void>;
                    camera: {
                        action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                        left: () => Promise<void>;
                        right: () => Promise<void>;
                        down: () => Promise<void>;
                        up: () => Promise<void>;
                        zoomout: () => Promise<void>;
                        zoomin: () => Promise<void>;
                        focusout: () => Promise<void>;
                        focusin: () => Promise<void>;
                    };
                    on(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    off(event: string | string[], fn?: Function | undefined): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    once(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    emit(event: string, ...args: any[]): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                }[];
                getHandup: () => {
                    data: import("../conference/conference-info").ConferenceUser;
                    get(key: string | number): any;
                    update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                    getEntity: () => string;
                    getUID: () => string;
                    getDisplayText: () => string;
                    getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                    isCurrent: () => boolean;
                    isAttendee: () => boolean;
                    isPresenter: () => boolean;
                    isCastviewer: () => boolean;
                    isOrganizer: () => boolean;
                    getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                    isOnHold: () => boolean | undefined;
                    hasFocus: () => boolean;
                    hasMedia: () => boolean;
                    hasSharing: () => boolean;
                    hasFECC: () => boolean;
                    getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                    getAudioFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    getVideoFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    isAudioBlocked: () => boolean;
                    isVideoBlocked: () => boolean;
                    isHandup: () => boolean;
                    isSharing: () => boolean | undefined;
                    isSIP: () => boolean;
                    isHTTP: () => boolean;
                    isRTMP: () => boolean;
                    setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                    setAudioFilter: (enable: boolean) => Promise<void>;
                    setVideoFilter: (enable: boolean) => Promise<void>;
                    setDisplayText: (displayText: string) => Promise<void>;
                    setRole: (role: "attendee" | "presenter") => Promise<void>;
                    setFocus: (enable?: boolean) => Promise<void>;
                    getStats: () => Promise<void>;
                    kick: () => Promise<void>;
                    hold: () => Promise<void>;
                    unhold: () => Promise<void>;
                    allow: () => Promise<void>;
                    accept: () => Promise<void>;
                    reject: () => Promise<void>;
                    sendMessage: (msg: string) => Promise<void>;
                    camera: {
                        action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                        left: () => Promise<void>;
                        right: () => Promise<void>;
                        down: () => Promise<void>;
                        up: () => Promise<void>;
                        zoomout: () => Promise<void>;
                        zoomin: () => Promise<void>;
                        focusout: () => Promise<void>;
                        focusin: () => Promise<void>;
                    };
                    on(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    off(event: string | string[], fn?: Function | undefined): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    once(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    emit(event: string, ...args: any[]): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                }[];
                getSharing: () => {
                    data: import("../conference/conference-info").ConferenceUser;
                    get(key: string | number): any;
                    update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                    getEntity: () => string;
                    getUID: () => string;
                    getDisplayText: () => string;
                    getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                    isCurrent: () => boolean;
                    isAttendee: () => boolean;
                    isPresenter: () => boolean;
                    isCastviewer: () => boolean;
                    isOrganizer: () => boolean;
                    getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                    isOnHold: () => boolean | undefined;
                    hasFocus: () => boolean;
                    hasMedia: () => boolean;
                    hasSharing: () => boolean;
                    hasFECC: () => boolean;
                    getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                    getAudioFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    getVideoFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    isAudioBlocked: () => boolean;
                    isVideoBlocked: () => boolean;
                    isHandup: () => boolean;
                    isSharing: () => boolean | undefined;
                    isSIP: () => boolean;
                    isHTTP: () => boolean;
                    isRTMP: () => boolean;
                    setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                    setAudioFilter: (enable: boolean) => Promise<void>;
                    setVideoFilter: (enable: boolean) => Promise<void>;
                    setDisplayText: (displayText: string) => Promise<void>;
                    setRole: (role: "attendee" | "presenter") => Promise<void>;
                    setFocus: (enable?: boolean) => Promise<void>;
                    getStats: () => Promise<void>;
                    kick: () => Promise<void>;
                    hold: () => Promise<void>;
                    unhold: () => Promise<void>;
                    allow: () => Promise<void>;
                    accept: () => Promise<void>;
                    reject: () => Promise<void>;
                    sendMessage: (msg: string) => Promise<void>;
                    camera: {
                        action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                        left: () => Promise<void>;
                        right: () => Promise<void>;
                        down: () => Promise<void>;
                        up: () => Promise<void>;
                        zoomout: () => Promise<void>;
                        zoomin: () => Promise<void>;
                        focusout: () => Promise<void>;
                        focusin: () => Promise<void>;
                    };
                    on(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    off(event: string | string[], fn?: Function | undefined): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    once(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    emit(event: string, ...args: any[]): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                }[];
                getAudioBlocked: () => {
                    data: import("../conference/conference-info").ConferenceUser;
                    get(key: string | number): any;
                    update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                    getEntity: () => string;
                    getUID: () => string;
                    getDisplayText: () => string;
                    getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                    isCurrent: () => boolean;
                    isAttendee: () => boolean;
                    isPresenter: () => boolean;
                    isCastviewer: () => boolean;
                    isOrganizer: () => boolean;
                    getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                    isOnHold: () => boolean | undefined;
                    hasFocus: () => boolean;
                    hasMedia: () => boolean;
                    hasSharing: () => boolean;
                    hasFECC: () => boolean;
                    getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                    getAudioFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    getVideoFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    isAudioBlocked: () => boolean;
                    isVideoBlocked: () => boolean;
                    isHandup: () => boolean;
                    isSharing: () => boolean | undefined;
                    isSIP: () => boolean;
                    isHTTP: () => boolean;
                    isRTMP: () => boolean;
                    setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                    setAudioFilter: (enable: boolean) => Promise<void>;
                    setVideoFilter: (enable: boolean) => Promise<void>;
                    setDisplayText: (displayText: string) => Promise<void>;
                    setRole: (role: "attendee" | "presenter") => Promise<void>;
                    setFocus: (enable?: boolean) => Promise<void>;
                    getStats: () => Promise<void>;
                    kick: () => Promise<void>;
                    hold: () => Promise<void>;
                    unhold: () => Promise<void>;
                    allow: () => Promise<void>;
                    accept: () => Promise<void>;
                    reject: () => Promise<void>;
                    sendMessage: (msg: string) => Promise<void>;
                    camera: {
                        action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                        left: () => Promise<void>;
                        right: () => Promise<void>;
                        down: () => Promise<void>;
                        up: () => Promise<void>;
                        zoomout: () => Promise<void>;
                        zoomin: () => Promise<void>;
                        focusout: () => Promise<void>;
                        focusin: () => Promise<void>;
                    };
                    on(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    off(event: string | string[], fn?: Function | undefined): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    once(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    emit(event: string, ...args: any[]): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                }[];
                getVideoBlocked: () => {
                    data: import("../conference/conference-info").ConferenceUser;
                    get(key: string | number): any;
                    update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                    getEntity: () => string;
                    getUID: () => string;
                    getDisplayText: () => string;
                    getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                    isCurrent: () => boolean;
                    isAttendee: () => boolean;
                    isPresenter: () => boolean;
                    isCastviewer: () => boolean;
                    isOrganizer: () => boolean;
                    getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                    isOnHold: () => boolean | undefined;
                    hasFocus: () => boolean;
                    hasMedia: () => boolean;
                    hasSharing: () => boolean;
                    hasFECC: () => boolean;
                    getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                    getAudioFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    getVideoFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    isAudioBlocked: () => boolean;
                    isVideoBlocked: () => boolean;
                    isHandup: () => boolean;
                    isSharing: () => boolean | undefined;
                    isSIP: () => boolean;
                    isHTTP: () => boolean;
                    isRTMP: () => boolean;
                    setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                    setAudioFilter: (enable: boolean) => Promise<void>;
                    setVideoFilter: (enable: boolean) => Promise<void>;
                    setDisplayText: (displayText: string) => Promise<void>;
                    setRole: (role: "attendee" | "presenter") => Promise<void>;
                    setFocus: (enable?: boolean) => Promise<void>;
                    getStats: () => Promise<void>;
                    kick: () => Promise<void>;
                    hold: () => Promise<void>;
                    unhold: () => Promise<void>;
                    allow: () => Promise<void>;
                    accept: () => Promise<void>;
                    reject: () => Promise<void>;
                    sendMessage: (msg: string) => Promise<void>;
                    camera: {
                        action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                        left: () => Promise<void>;
                        right: () => Promise<void>;
                        down: () => Promise<void>;
                        up: () => Promise<void>;
                        zoomout: () => Promise<void>;
                        zoomin: () => Promise<void>;
                        focusout: () => Promise<void>;
                        focusin: () => Promise<void>;
                    };
                    on(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    off(event: string | string[], fn?: Function | undefined): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    once(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    emit(event: string, ...args: any[]): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                }[];
                getSIP: () => {
                    data: import("../conference/conference-info").ConferenceUser;
                    get(key: string | number): any;
                    update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                    getEntity: () => string;
                    getUID: () => string;
                    getDisplayText: () => string;
                    getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                    isCurrent: () => boolean;
                    isAttendee: () => boolean;
                    isPresenter: () => boolean;
                    isCastviewer: () => boolean;
                    isOrganizer: () => boolean;
                    getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                    isOnHold: () => boolean | undefined;
                    hasFocus: () => boolean;
                    hasMedia: () => boolean;
                    hasSharing: () => boolean;
                    hasFECC: () => boolean;
                    getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                    getAudioFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    getVideoFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    isAudioBlocked: () => boolean;
                    isVideoBlocked: () => boolean;
                    isHandup: () => boolean;
                    isSharing: () => boolean | undefined;
                    isSIP: () => boolean;
                    isHTTP: () => boolean;
                    isRTMP: () => boolean;
                    setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                    setAudioFilter: (enable: boolean) => Promise<void>;
                    setVideoFilter: (enable: boolean) => Promise<void>;
                    setDisplayText: (displayText: string) => Promise<void>;
                    setRole: (role: "attendee" | "presenter") => Promise<void>;
                    setFocus: (enable?: boolean) => Promise<void>;
                    getStats: () => Promise<void>;
                    kick: () => Promise<void>;
                    hold: () => Promise<void>;
                    unhold: () => Promise<void>;
                    allow: () => Promise<void>;
                    accept: () => Promise<void>;
                    reject: () => Promise<void>;
                    sendMessage: (msg: string) => Promise<void>;
                    camera: {
                        action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                        left: () => Promise<void>;
                        right: () => Promise<void>;
                        down: () => Promise<void>;
                        up: () => Promise<void>;
                        zoomout: () => Promise<void>;
                        zoomin: () => Promise<void>;
                        focusout: () => Promise<void>;
                        focusin: () => Promise<void>;
                    };
                    on(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    off(event: string | string[], fn?: Function | undefined): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    once(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    emit(event: string, ...args: any[]): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                }[];
                getHTTP: () => {
                    data: import("../conference/conference-info").ConferenceUser;
                    get(key: string | number): any;
                    update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                    getEntity: () => string;
                    getUID: () => string;
                    getDisplayText: () => string;
                    getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                    isCurrent: () => boolean;
                    isAttendee: () => boolean;
                    isPresenter: () => boolean;
                    isCastviewer: () => boolean;
                    isOrganizer: () => boolean;
                    getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                    isOnHold: () => boolean | undefined;
                    hasFocus: () => boolean;
                    hasMedia: () => boolean;
                    hasSharing: () => boolean;
                    hasFECC: () => boolean;
                    getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                    getAudioFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    getVideoFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    isAudioBlocked: () => boolean;
                    isVideoBlocked: () => boolean;
                    isHandup: () => boolean;
                    isSharing: () => boolean | undefined;
                    isSIP: () => boolean;
                    isHTTP: () => boolean;
                    isRTMP: () => boolean;
                    setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                    setAudioFilter: (enable: boolean) => Promise<void>;
                    setVideoFilter: (enable: boolean) => Promise<void>;
                    setDisplayText: (displayText: string) => Promise<void>;
                    setRole: (role: "attendee" | "presenter") => Promise<void>;
                    setFocus: (enable?: boolean) => Promise<void>;
                    getStats: () => Promise<void>;
                    kick: () => Promise<void>;
                    hold: () => Promise<void>;
                    unhold: () => Promise<void>;
                    allow: () => Promise<void>;
                    accept: () => Promise<void>;
                    reject: () => Promise<void>;
                    sendMessage: (msg: string) => Promise<void>;
                    camera: {
                        action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                        left: () => Promise<void>;
                        right: () => Promise<void>;
                        down: () => Promise<void>;
                        up: () => Promise<void>;
                        zoomout: () => Promise<void>;
                        zoomin: () => Promise<void>;
                        focusout: () => Promise<void>;
                        focusin: () => Promise<void>;
                    };
                    on(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    off(event: string | string[], fn?: Function | undefined): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    once(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    emit(event: string, ...args: any[]): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                }[];
                getRTMP: () => {
                    data: import("../conference/conference-info").ConferenceUser;
                    get(key: string | number): any;
                    update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                    getEntity: () => string;
                    getUID: () => string;
                    getDisplayText: () => string;
                    getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                    isCurrent: () => boolean;
                    isAttendee: () => boolean;
                    isPresenter: () => boolean;
                    isCastviewer: () => boolean;
                    isOrganizer: () => boolean;
                    getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                    isOnHold: () => boolean | undefined;
                    hasFocus: () => boolean;
                    hasMedia: () => boolean;
                    hasSharing: () => boolean;
                    hasFECC: () => boolean;
                    getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                    getAudioFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    getVideoFilter: () => {
                        ingress: "unblock" | "block" | "unblocking";
                        egress: "unblock" | "block" | "unblocking";
                    };
                    isAudioBlocked: () => boolean;
                    isVideoBlocked: () => boolean;
                    isHandup: () => boolean;
                    isSharing: () => boolean | undefined;
                    isSIP: () => boolean;
                    isHTTP: () => boolean;
                    isRTMP: () => boolean;
                    setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                    setAudioFilter: (enable: boolean) => Promise<void>;
                    setVideoFilter: (enable: boolean) => Promise<void>;
                    setDisplayText: (displayText: string) => Promise<void>;
                    setRole: (role: "attendee" | "presenter") => Promise<void>;
                    setFocus: (enable?: boolean) => Promise<void>;
                    getStats: () => Promise<void>;
                    kick: () => Promise<void>;
                    hold: () => Promise<void>;
                    unhold: () => Promise<void>;
                    allow: () => Promise<void>;
                    accept: () => Promise<void>;
                    reject: () => Promise<void>;
                    sendMessage: (msg: string) => Promise<void>;
                    camera: {
                        action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                        left: () => Promise<void>;
                        right: () => Promise<void>;
                        down: () => Promise<void>;
                        up: () => Promise<void>;
                        zoomout: () => Promise<void>;
                        zoomin: () => Promise<void>;
                        focusout: () => Promise<void>;
                        focusin: () => Promise<void>;
                    };
                    on(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    off(event: string | string[], fn?: Function | undefined): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    once(event: string | string[], fn: Function): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                    emit(event: string, ...args: any[]): {
                        on(event: string | string[], fn: Function): any;
                        off(event: string | string[], fn?: Function | undefined): any;
                        once(event: string | string[], fn: Function): any;
                        emit(event: string, ...args: any[]): any;
                    };
                }[];
                invite: (option: Partial<import("../conference/users").InviteOptions>) => Promise<void>;
                kick: (entity: string) => Promise<void>;
                mute: () => Promise<void>;
                unmute: () => Promise<void>;
                remove: (entity?: string | undefined) => Promise<void>;
                unhold: (entity?: string | undefined) => Promise<void>;
                hold: (entity?: string | undefined) => Promise<void>;
                allow: (entity?: string | undefined) => Promise<void>;
                data: import("../conference/conference-info").ConferenceUsers;
                get(key: string | number): any;
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            };
            rtmp: {
                operation: (type: import("../conference/rtmp-ctrl").RTMPOperationType) => Promise<void>;
                start: () => Promise<void>;
                stop: () => Promise<void>;
                pause: () => Promise<void>;
                resume: () => Promise<void>;
                data: import("../conference/conference-info").ConferenceRTMPUsers;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceRTMPUsers | undefined) => void;
                getEnable: () => boolean;
                getStatus: (entity?: string | undefined) => "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming" | undefined;
                getReason: (entity?: string | undefined) => import("../conference/conference-info").StateReason | undefined;
                getDetail: (entity?: string | undefined) => {
                    reason: import("../conference/conference-info").StateReason;
                    status: "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming";
                    lastStartTime: number;
                    lastStopDuration: number;
                } | undefined;
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            };
            record: {
                operation: (type: import("../conference/rtmp-ctrl").RTMPOperationType) => Promise<void>;
                start: () => Promise<void>;
                stop: () => Promise<void>;
                pause: () => Promise<void>;
                resume: () => Promise<void>;
                data: import("../conference/conference-info").ConferenceRecordUsers;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceRecordUsers | undefined) => void;
                getStatus: () => "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming";
                getReason: () => import("../conference/conference-info").StateReason;
                getDetail: () => {
                    reason: import("../conference/conference-info").StateReason;
                    status: "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming";
                    lastStartTime: number;
                    lastStopDuration: number;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            };
            update: (val: import("../conference/conference-info").ConferenceInformation) => void;
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        } | undefined;
        description: {
            data: import("../conference/conference-info").ConferenceDescription;
            subject: string;
            get(key: string | number): any;
            update: (diff?: import("../conference/conference-info").ConferenceDescription | undefined) => void;
            getLock: () => import("../conference/description").LockOptions;
            setLock: (options: import("../conference/description").LockOptions) => Promise<void>;
            lock: (attendeeByPass?: boolean, presenterOnly?: boolean) => Promise<void>;
            unlock: () => Promise<void>;
            isLocked: () => boolean;
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        } | undefined;
        state: {
            data: import("../conference/conference-info").ConferenceState;
            get(key: string | number): any;
            update: (diff?: import("../conference/conference-info").ConferenceState | undefined) => void;
            getSharingUserEntity: () => string;
            getSpeechUserEntity: () => string | undefined;
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        } | undefined;
        view: {
            update: (diff?: import("../conference/conference-info").ConferenceView | undefined) => void;
            getVideoView: () => import("../conference/conference-info").EntityView | undefined;
            getLayout: () => import("../conference/conference-info").EntityState | undefined;
            getFocusUserEntity: () => string;
            getDanmaku: () => import("../conference/conference-info").EntityViewTitle | undefined;
            setDanmaku: (config: Partial<import("../conference/danmaku-ctrl").DanmakuConfigs>) => Promise<void>;
            sendDanmaku: (msg: string, options?: Partial<import("../conference/danmaku-ctrl").DanmakuOptions> | undefined) => Promise<void>;
            setLayout: (options: import("../api/api-configs").CtrlApiData & {
                'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                'speech-excitation-video-big-view'?: number | undefined;
                'speech-excitation-video-max-view'?: number | undefined;
                'equality-video-max-view'?: number | undefined;
                'ext-video-as-focus': number;
                'speech-excitation-video-round-enabled'?: boolean | undefined;
                'speech-excitation-video-round-number'?: number | undefined;
                'speech-excitation-video-round-interval'?: number | undefined;
                'equality-video-round-enabled'?: boolean | undefined;
                'equality-video-round-number'?: number | undefined;
                'equality-video-round-interval'?: number | undefined;
            }) => Promise<void>;
            setCustomizeLayout: (options: import("../api/api-configs").CtrlApiData & {
                'enable'?: boolean | undefined;
                'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
                'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                'speech-excitation-video-big-view'?: number | undefined;
                'speech-excitation-video-max-view'?: number | undefined;
                'equality-video-max-view'?: number | undefined;
                'ext-video-as-focus'?: number | undefined;
                'speech-excitation-video-round-enabled': boolean;
                'speech-excitation-video-round-number': number;
                'speech-excitation-video-round-interval': number;
                'equality-video-round-enabled'?: boolean | undefined;
                'equality-video-round-number'?: number | undefined;
                'equality-video-round-interval'?: number | undefined;
                'applied-to-attendee': boolean;
                'applied-to-cast-viewer': boolean;
                'selected-user-entity'?: string[] | undefined;
                'pos'?: number | undefined;
                'entity'?: string | undefined;
            }) => Promise<void>;
            setPresenterLayout: (options: import("../api/api-configs").CtrlApiData & {
                'enable'?: boolean | undefined;
                'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
                'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                'speech-excitation-video-big-view'?: number | undefined;
                'speech-excitation-video-max-view'?: number | undefined;
                'equality-video-max-view'?: number | undefined;
                'ext-video-as-focus'?: number | undefined;
                'speech-excitation-video-round-enabled': boolean;
                'speech-excitation-video-round-number': number;
                'speech-excitation-video-round-interval': number;
                'equality-video-round-enabled'?: boolean | undefined;
                'equality-video-round-number'?: number | undefined;
                'equality-video-round-interval'?: number | undefined;
                'applied-to-attendee': boolean;
                'applied-to-cast-viewer': boolean;
                'selected-user-entity'?: string[] | undefined;
                'pos'?: number | undefined;
                'entity'?: string | undefined;
            }) => Promise<void>;
            setAttendeeLayout: (options: import("../api/api-configs").CtrlApiData & {
                'enable'?: boolean | undefined;
                'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
                'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                'speech-excitation-video-big-view'?: number | undefined;
                'speech-excitation-video-max-view'?: number | undefined;
                'equality-video-max-view'?: number | undefined;
                'ext-video-as-focus'?: number | undefined;
                'speech-excitation-video-round-enabled': boolean;
                'speech-excitation-video-round-number': number;
                'speech-excitation-video-round-interval': number;
                'equality-video-round-enabled'?: boolean | undefined;
                'equality-video-round-number'?: number | undefined;
                'equality-video-round-interval'?: number | undefined;
                'applied-to-attendee': boolean;
                'applied-to-cast-viewer': boolean;
                'selected-user-entity'?: string[] | undefined;
                'pos'?: number | undefined;
                'entity'?: string | undefined;
            }) => Promise<void>;
            setCastViewerLayout: (options: import("../api/api-configs").CtrlApiData & {
                'enable'?: boolean | undefined;
                'viewer'?: "attendee" | "presenter" | "castviewer" | undefined;
                'video-layout': "Equality" | "SpeechExcitation" | "Exclusive";
                'speech-excitation-video-big-view'?: number | undefined;
                'speech-excitation-video-max-view'?: number | undefined;
                'equality-video-max-view'?: number | undefined;
                'ext-video-as-focus'?: number | undefined;
                'speech-excitation-video-round-enabled': boolean;
                'speech-excitation-video-round-number': number;
                'speech-excitation-video-round-interval': number;
                'equality-video-round-enabled'?: boolean | undefined;
                'equality-video-round-number'?: number | undefined;
                'equality-video-round-interval'?: number | undefined;
                'applied-to-attendee': boolean;
                'applied-to-cast-viewer': boolean;
                'selected-user-entity'?: string[] | undefined;
                'pos'?: number | undefined;
                'entity'?: string | undefined;
            }) => Promise<void>;
            setOSD: (options?: {
                name: boolean;
                icon: boolean;
            }) => Promise<void>;
            setSpeakMode: (mode: "free" | "hand-up") => Promise<void>;
            data: import("../conference/conference-info").ConferenceView;
            get(key: string | number): any;
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        } | undefined;
        users: {
            update: (diff?: import("../conference/conference-info").ConferenceUsers | undefined) => void;
            getUserList: (filter?: ((user?: {
                data: import("../conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            } | undefined) => boolean) | undefined) => {
                data: import("../conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getUser: (entity: string) => {
                data: import("../conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            } | undefined;
            hasUser: (entity: string) => boolean;
            getCurrent: () => {
                data: import("../conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            } | undefined;
            getAttendee: () => {
                data: import("../conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getPresenter: () => {
                data: import("../conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getCastviewer: () => {
                data: import("../conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getOrganizer: () => {
                data: import("../conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getOnhold: () => {
                data: import("../conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getHandup: () => {
                data: import("../conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getSharing: () => {
                data: import("../conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getAudioBlocked: () => {
                data: import("../conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getVideoBlocked: () => {
                data: import("../conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getSIP: () => {
                data: import("../conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getHTTP: () => {
                data: import("../conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            getRTMP: () => {
                data: import("../conference/conference-info").ConferenceUser;
                get(key: string | number): any;
                update: (diff?: import("../conference/conference-info").ConferenceUser | undefined) => void;
                getEntity: () => string;
                getUID: () => string;
                getDisplayText: () => string;
                getRole: () => "organizer" | "attendee" | "presenter" | "castviewer";
                isCurrent: () => boolean;
                isAttendee: () => boolean;
                isPresenter: () => boolean;
                isCastviewer: () => boolean;
                isOrganizer: () => boolean;
                getEndpoint: (type: "focus" | "audio-video" | "applicationsharing" | "fecc") => import("../conference/conference-info").UserEndpoint | undefined;
                isOnHold: () => boolean | undefined;
                hasFocus: () => boolean;
                hasMedia: () => boolean;
                hasSharing: () => boolean;
                hasFECC: () => boolean;
                getMedia: (label: "applicationsharing" | "main-audio" | "main-video") => import("../conference/conference-info").UserMedia | undefined;
                getAudioFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                getVideoFilter: () => {
                    ingress: "unblock" | "block" | "unblocking";
                    egress: "unblock" | "block" | "unblocking";
                };
                isAudioBlocked: () => boolean;
                isVideoBlocked: () => boolean;
                isHandup: () => boolean;
                isSharing: () => boolean | undefined;
                isSIP: () => boolean;
                isHTTP: () => boolean;
                isRTMP: () => boolean;
                setFilter: (options: import("../conference/user").FilterOptions) => Promise<void>;
                setAudioFilter: (enable: boolean) => Promise<void>;
                setVideoFilter: (enable: boolean) => Promise<void>;
                setDisplayText: (displayText: string) => Promise<void>;
                setRole: (role: "attendee" | "presenter") => Promise<void>;
                setFocus: (enable?: boolean) => Promise<void>;
                getStats: () => Promise<void>;
                kick: () => Promise<void>;
                hold: () => Promise<void>;
                unhold: () => Promise<void>;
                allow: () => Promise<void>;
                accept: () => Promise<void>;
                reject: () => Promise<void>;
                sendMessage: (msg: string) => Promise<void>;
                camera: {
                    action: (type: import("../conference/camera-ctrl").ActionType) => Promise<void>;
                    left: () => Promise<void>;
                    right: () => Promise<void>;
                    down: () => Promise<void>;
                    up: () => Promise<void>;
                    zoomout: () => Promise<void>;
                    zoomin: () => Promise<void>;
                    focusout: () => Promise<void>;
                    focusin: () => Promise<void>;
                };
                on(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                off(event: string | string[], fn?: Function | undefined): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                once(event: string | string[], fn: Function): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
                emit(event: string, ...args: any[]): {
                    on(event: string | string[], fn: Function): any;
                    off(event: string | string[], fn?: Function | undefined): any;
                    once(event: string | string[], fn: Function): any;
                    emit(event: string, ...args: any[]): any;
                };
            }[];
            invite: (option: Partial<import("../conference/users").InviteOptions>) => Promise<void>;
            kick: (entity: string) => Promise<void>;
            mute: () => Promise<void>;
            unmute: () => Promise<void>;
            remove: (entity?: string | undefined) => Promise<void>;
            unhold: (entity?: string | undefined) => Promise<void>;
            hold: (entity?: string | undefined) => Promise<void>;
            allow: (entity?: string | undefined) => Promise<void>;
            data: import("../conference/conference-info").ConferenceUsers;
            get(key: string | number): any;
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        } | undefined;
        rtmp: {
            operation: (type: import("../conference/rtmp-ctrl").RTMPOperationType) => Promise<void>;
            start: () => Promise<void>;
            stop: () => Promise<void>;
            pause: () => Promise<void>;
            resume: () => Promise<void>;
            data: import("../conference/conference-info").ConferenceRTMPUsers;
            get(key: string | number): any;
            update: (diff?: import("../conference/conference-info").ConferenceRTMPUsers | undefined) => void;
            getEnable: () => boolean;
            getStatus: (entity?: string | undefined) => "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming" | undefined;
            getReason: (entity?: string | undefined) => import("../conference/conference-info").StateReason | undefined;
            getDetail: (entity?: string | undefined) => {
                reason: import("../conference/conference-info").StateReason;
                status: "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming";
                lastStartTime: number;
                lastStopDuration: number;
            } | undefined;
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        } | undefined;
        record: {
            operation: (type: import("../conference/rtmp-ctrl").RTMPOperationType) => Promise<void>;
            start: () => Promise<void>;
            stop: () => Promise<void>;
            pause: () => Promise<void>;
            resume: () => Promise<void>;
            data: import("../conference/conference-info").ConferenceRecordUsers;
            get(key: string | number): any;
            update: (diff?: import("../conference/conference-info").ConferenceRecordUsers | undefined) => void;
            getStatus: () => "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming";
            getReason: () => import("../conference/conference-info").StateReason;
            getDetail: () => {
                reason: import("../conference/conference-info").StateReason;
                status: "start" | "stop" | "pause" | "stopping" | "pausing" | "starting" | "resuming";
                lastStartTime: number;
                lastStopDuration: number;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        } | undefined;
        mediaChannel: {
            status: import("../channel").STATUS;
            connection: RTCPeerConnection | undefined;
            version: number;
            callId: string;
            isInProgress: () => boolean;
            isEstablished: () => boolean;
            isEnded: () => boolean;
            getMute: () => {
                audio: boolean;
                video: boolean;
            };
            getHold: () => {
                local: boolean;
                remote: boolean;
            };
            connect: (options?: import("../channel").ConnectOptions) => Promise<void>;
            terminate: (reason?: string | undefined) => Promise<void>;
            renegotiate: (options?: import("../channel").RenegotiateOptions) => Promise<void>;
            mute: (options?: {
                audio: boolean;
                video: boolean;
            }) => void;
            unmute: (options?: {
                audio: boolean;
                video: boolean;
            }) => void;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            getRemoteStream: () => MediaStream | undefined;
            addLocalStream: (stream?: MediaStream | undefined) => void;
            removeLocalStream: () => void;
            getLocalStream: () => MediaStream | undefined;
            setLocalStream: (stream?: MediaStream | undefined) => void;
            replaceLocalStream: (stream?: MediaStream | undefined, renegotiation?: boolean) => Promise<void>;
            adjustBandWidth: (options: {
                audio?: number | undefined;
                video?: number | undefined;
            }) => Promise<void>;
            applyConstraints: (options: {
                audio?: MediaTrackConstraints | undefined;
                video?: MediaTrackConstraints | undefined;
            }) => Promise<void>;
            getStats: () => Promise<{
                readonly quality: number;
                readonly inbound: import("../channel/rtc-stats").ParsedStats;
                readonly outbound: import("../channel/rtc-stats").ParsedStats;
                update: (report: RTCStatsReport) => void;
                clear: () => void;
            }>;
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        } | undefined;
        shareChannel: {
            status: import("../channel").STATUS;
            connection: RTCPeerConnection | undefined;
            version: number;
            callId: string;
            isInProgress: () => boolean;
            isEstablished: () => boolean;
            isEnded: () => boolean;
            getMute: () => {
                audio: boolean;
                video: boolean;
            };
            getHold: () => {
                local: boolean;
                remote: boolean;
            };
            connect: (options?: import("../channel").ConnectOptions) => Promise<void>;
            terminate: (reason?: string | undefined) => Promise<void>;
            renegotiate: (options?: import("../channel").RenegotiateOptions) => Promise<void>;
            mute: (options?: {
                audio: boolean;
                video: boolean;
            }) => void;
            unmute: (options?: {
                audio: boolean;
                video: boolean;
            }) => void;
            hold: () => Promise<void>;
            unhold: () => Promise<void>;
            getRemoteStream: () => MediaStream | undefined;
            addLocalStream: (stream?: MediaStream | undefined) => void;
            removeLocalStream: () => void;
            getLocalStream: () => MediaStream | undefined;
            setLocalStream: (stream?: MediaStream | undefined) => void;
            replaceLocalStream: (stream?: MediaStream | undefined, renegotiation?: boolean) => Promise<void>;
            adjustBandWidth: (options: {
                audio?: number | undefined;
                video?: number | undefined;
            }) => Promise<void>;
            applyConstraints: (options: {
                audio?: MediaTrackConstraints | undefined;
                video?: MediaTrackConstraints | undefined;
            }) => Promise<void>;
            getStats: () => Promise<{
                readonly quality: number;
                readonly inbound: import("../channel/rtc-stats").ParsedStats;
                readonly outbound: import("../channel/rtc-stats").ParsedStats;
                update: (report: RTCStatsReport) => void;
                clear: () => void;
            }>;
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        } | undefined;
        chatChannel: {
            ready: boolean;
            connect: (count?: number) => Promise<void>;
            terminate: () => Promise<void>;
            sendMessage: (msg: string, target?: string[] | undefined) => Promise<{
                readonly status: import("../channel/message").MessageStatus;
                readonly direction: import("../channel/message").MessageDirection;
                readonly content: string | undefined;
                readonly timestamp: number | undefined;
                readonly version: number | undefined;
                readonly sender: import("../channel/message").MessageSender | undefined;
                readonly receiver: string[] | undefined;
                readonly private: boolean | undefined;
                send: (message: string, target?: string[] | undefined) => Promise<void>;
                retry: () => Promise<void>;
                cancel: () => void;
                incoming: (data: import("../channel/message").MessageData) => any;
            }>;
            incoming: (data: import("../channel/message").MessageData) => {
                readonly status: import("../channel/message").MessageStatus;
                readonly direction: import("../channel/message").MessageDirection;
                readonly content: string | undefined;
                readonly timestamp: number | undefined;
                readonly version: number | undefined;
                readonly sender: import("../channel/message").MessageSender | undefined;
                readonly receiver: string[] | undefined;
                readonly private: boolean | undefined;
                send: (message: string, target?: string[] | undefined) => Promise<void>;
                retry: () => Promise<void>;
                cancel: () => void;
                incoming: (data: import("../channel/message").MessageData) => any;
            };
            on(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            off(event: string | string[], fn?: Function | undefined): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            once(event: string | string[], fn: Function): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
            emit(event: string, ...args: any[]): {
                on(event: string | string[], fn: Function): any;
                off(event: string | string[], fn?: Function | undefined): any;
                once(event: string | string[], fn: Function): any;
                emit(event: string, ...args: any[]): any;
            };
        } | undefined;
        join: (options?: Partial<JoinOptions>) => Promise<any>;
        leave: () => Promise<any>;
        end: () => Promise<any>;
        share: (options?: import("../channel").ConnectOptions | undefined) => Promise<void>;
        sendMessage: (msg: string, target?: string[] | undefined) => Promise<void>;
        on(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        off(event: string | string[], fn?: Function | undefined): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        once(event: string | string[], fn: Function): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
        emit(event: string, ...args: any[]): {
            on(event: string | string[], fn: Function): any;
            off(event: string | string[], fn?: Function | undefined): any;
            once(event: string | string[], fn: Function): any;
            emit(event: string, ...args: any[]): any;
        };
    }>;
};

declare interface CtrlApiData {
    'conference-uuid'?: string;
    'conference-user-id'?: number;
    [key: string]: any;
}
export { debug }

declare const _default: {
    version: string;
    createUA: typeof createUA;
    setup: typeof setup;
    connect: typeof connect;
};
export default _default;

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

export declare type Events = ReturnType<typeof createEvents>;

declare interface JoinInfo {
    'when': string;
}

export declare interface JoinOptions {
    url?: string;
    number: string;
    password?: string;
    displayName?: string;
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
}

declare interface Organizer {
    'display-text': string;
    'subject-id': string;
}

export declare function paramReducer(acc: any, expr: any): any;

export declare function parse(sdp: string): SDP;

export declare const parseFmtpConfig: typeof parseParams;

export declare function parseImageAttributes(str: any): any;

export declare function parseParams(str: any): any;

export declare function parsePayloads(str: any): any;

export declare function parseReg(obj: any, location: any, content: any): void;

export declare function parseRemoteCandidates(str: any): any[];

export declare function parseSimulcastStreamList(str: any): any;

declare interface Partialable {
    'state': 'full' | 'partial' | 'deleted';
    [key: string]: any;
}

declare interface Request<RequestData = any, RequestParams = any, RequestHeader = any> {
    config: AxiosRequestConfig;
    header: (header: RequestHeader) => Request<RequestData, RequestParams, RequestHeader>;
    params: (params: RequestParams) => Request<RequestData, RequestParams, RequestHeader>;
    data: (data: RequestData) => Request<RequestData, RequestParams, RequestHeader>;
    send: () => AxiosPromise<RequestResult>;
    cancel: () => void;
}

declare interface RequestResult {
    ret: number;
    bizCode: number;
    data: {
        [K: string]: any;
    };
    error?: {
        msg: string;
        errorCode: number;
    };
    statusCode?: number;
}

export declare interface SDP {
    version?: number;
    origin?: {
        username: string;
        sessionId: string;
        sessionVersion: number;
        netType: string;
        ipVer: number;
        address: string;
    };
    name?: string;
    description?: string;
    uri?: string;
    email?: string;
    phone?: string;
    timezones?: string;
    repeats?: string;
    timing?: {
        start: number;
        stop: number;
    };
    msidSemantic?: {
        semantic: string;
        token: string;
    };
    groups?: {
        type: string;
        mids: string;
    }[];
    media?: {
        type: string;
        port: number;
        protocol: string;
        payloads: string;
        control?: string;
        connection?: {
            version: number;
            ip: string;
        };
        bandwidth?: {
            type: string;
            limit: number;
        }[];
        rtp?: {
            payload: number | string;
            codec: string;
            rate?: number;
            encoding?: number;
        }[];
        fmtp?: {
            payload: number | string;
            config: string;
        }[];
        rtcp?: {
            port: number;
            netType?: string;
            ipVer?: number;
            address?: string;
        }[];
        rtcpFbTrrInt?: {
            payload: number;
            value: number;
        }[];
        rtcpFb?: {
            payload: number | string;
            type: string;
            subtype?: string;
        }[];
        ext?: {
            value: number;
            direction?: string;
            uri: string;
            config?: string;
        }[];
        crypto?: {
            id: number;
            suite: string;
            config: string;
            sessionConfig?: string;
        }[];
        setup?: string;
        mid?: string | number;
        msid?: string;
        ptime?: number;
        maxptime?: number;
        direction?: 'sendrecv' | 'recvonly' | 'sendonly' | 'inactive';
        icelite?: string;
        iceUfrag?: string;
        icePwd?: string;
        iceOptions?: string;
        fingerprint?: {
            type: string;
            hash: string;
        };
        candidates?: {
            foundation: number;
            component: number;
            transport: string;
            priority: number;
            ip: string;
            port: number;
            type: string;
            raddr?: string;
            rport?: number;
            tcptype?: number;
            generation?: number;
            'network-id'?: number;
            'network-cost'?: number;
        }[];
        endOfCandidates?: string;
        remoteCandidates?: string;
        ssrcs?: {
            id: number;
            attribute?: string;
            value?: string;
        }[];
        ssrcGroups?: {
            semantics: string;
            ssrcs: string;
        }[];
        rtcpMux?: string;
        rtcpRsize?: string;
        sctpmap?: {
            sctpmapNumber: number;
            app?: string;
            maxMessageSize?: number;
        };
        xGoogleFlag?: string;
        content?: string;
        label?: number;
        rids?: {
            id: number;
            direction: string;
            params?: string;
        };
        imageattrs?: {
            pt: string;
            dir1: string;
            attrs1: string;
            dir2?: string;
            attrs2?: string;
        };
        simulcast?: {
            dir1: string;
            list1: string;
            dir2?: string;
            list2?: string;
        };
        'simulcast_03'?: {
            value: string;
        };
        framerate?: string;
        sourceFilter?: {
            filterMode: string;
            netType: string;
            addressTypes: string;
            destAddress: string;
            srcList: string;
        };
        invalid?: {
            value: string;
        }[];
    }[];
}

declare function setup(config?: MeetnowConfig): void;

declare interface StateReason {
    'reason-code': number;
    'reason-text'?: string;
    'bizCode': number;
}

export declare enum STATUS {
    kNull = 0,
    kConnecting = 1,
    kConnected = 2,
    kDisconnecting = 3,
    kDisconnected = 4
}

export declare type UA = ReturnType<typeof createUA>;

export declare interface UAConfigs {
    language?: string;
}

export declare function urlToNumber(url: string): string;

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

export declare function write(session: any, opts?: any): string;

export { }
