
export declare const BROWSER: {
    name: string;
    version: string;
    firefox: boolean;
    chrome: boolean;
};

export declare function getBrowser(): {
    name: string;
    version: string;
    firefox: boolean;
    chrome: boolean;
};

export declare function isBrowser(name: string): boolean;

export declare function isMiniProgram(): boolean;

export declare const MINIPROGRAM: boolean;

export declare function parseBrowser(ua?: string): {
    name: string;
    version: string;
    firefox: boolean;
    chrome: boolean;
};

export declare interface ParsedResult {
    browser: {
        name: string;
        version: string;
        firefox: boolean;
        chrome: boolean;
    };
}

export { }
