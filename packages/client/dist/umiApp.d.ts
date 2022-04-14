import React from "react";
export declare const InitialStateError: React.FC<any>;
declare type UmiAppProps = {
    loading?: React.ReactElement | null;
    notfound?: React.ReactElement | null;
    initialStateLoading?: React.ReactElement | null;
    initialStateError?: React.ReactElement | null;
    initialStateSync?: boolean;
    initialPropsSync?: boolean;
    noAccess?: React.ReactElement;
};
export declare const UmiApp: React.FC<UmiAppProps>;
declare type UmiAppEntryProps = {};
export declare const UmiAppEntry: React.FC<UmiAppEntryProps>;
export {};
