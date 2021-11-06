import { ComponentType, FC } from 'react';
import { RouteObject } from 'react-router-dom';

export interface Obj {
    [key: string]: any;
}

export interface ReactRouterDomType {
    key: string;
    title: string;
    name?: string;
    path?: string;
    class?: string;
    component?: FC<RouteObject>;
    exact?: boolean;
    icon?: ComponentType;
    children?: ReactRouterDomType[];
}
