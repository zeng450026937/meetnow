
declare const _default: {
    write: typeof write;
    parse: typeof parse;
    parseFmtpConfig: typeof parseParams;
    parseRemoteCandidates: typeof parseRemoteCandidates;
    parseParams: typeof parseParams;
    parsePayloads: typeof parsePayloads;
    parseImageAttributes: typeof parseImageAttributes;
    parseSimulcastStreamList: typeof parseSimulcastStreamList;
};
export default _default;

export declare function paramReducer(acc: any, expr: any): any;

export declare function parse(sdp: string): SDP;

export declare const parseFmtpConfig: typeof parseParams;

export declare function parseImageAttributes(str: any): any;

export declare function parseParams(str: any): any;

export declare function parsePayloads(str: any): any;

export declare function parseReg(obj: any, location: any, content: any): void;

export declare function parseRemoteCandidates(str: any): any[];

export declare function parseSimulcastStreamList(str: any): any;

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

export declare function write(session: any, opts?: any): string;

export { }
