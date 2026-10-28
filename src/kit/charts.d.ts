import type * as React from 'react';
import type {SectorProps} from 'recharts';
export interface GlassBarProps{x?:number;y?:number;width?:number;height?:number;radius?:number|[number,number,number,number];fill?:string;index?:number;value?:number|[number,number];active?:boolean;isActive?:boolean}
export function GlassBar(props:GlassBarProps):React.JSX.Element|null;
export function GlassDot(props:{cx?:number;cy?:number;fill?:string;stroke?:string}):React.JSX.Element|null;
export function GlassSector(props:SectorProps&{active?:boolean;isActive?:boolean;value?:number;name?:string;payload?:{name?:string}}):React.JSX.Element;
