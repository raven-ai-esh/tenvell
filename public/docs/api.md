# tenvell 0.2.1 API

The declarations below are extracted from the published package archive. They describe the installed release, including exact export names and component props.

## Provider

`TenvellProvider` renders a scoped wrapper. Import `tenvell/styles.css` once; the provider does not set the host page's layout or background and does not persist application preferences.

| Prop | Values | Default |
| --- | --- | --- |
| `theme` | `light`, `dark` | `light` |
| `surface` | `air`, `frost`, `prism`, `smoke` | `air` |
| `accent` | `slate`, `blue`, `violet`, `jade` | `slate` |
| `radius` | `strict`, `soft`, `round` | `soft` |
| `density` | `comfortable`, `compact` | `comfortable` |
| `motion` | boolean | `true` |

Multiple independent providers are supported. Dialogs and menus inherit their originating provider's theme through a body portal. CSS custom properties passed in the provider's `style` also reach its overlays; layout styles stay on the wrapper. `--tenvell-overlay-z` sets the overlay layer (default `1000`). Reduced-motion preferences take precedence.

Pass product labels and accessible names explicitly. The portable core renders caller-provided content; the website's EN/RU translation layer is not part of the package.

## Export boundaries

- `tenvell`: the core exports shown below.
- `tenvell/styles.css`: scoped styles and locally embedded Lamina fonts.
- `tenvell/charts`: optional Recharts shapes, with Recharts 3 installed separately.
- Website-only examples include Calendar, DataTable, toast, the messenger, task board and complete product screens. Do not import these names from the core package.

After a source-first installation, substitute the corresponding `@/components/tenvell` module paths. The compact [component inventory](https://tenvell.space/docs/components.json) records the exports of each registry item.

## Core TypeScript declarations

```ts
import type * as React from 'react';
import {Dialog as D} from '@base-ui/react/dialog';
import {Menu as M} from '@base-ui/react/menu';
import {Tabs as T} from '@base-ui/react/tabs';
import {Accordion as A} from '@base-ui/react/accordion';
import {Popover as P} from '@base-ui/react/popover';
import {Checkbox as C} from '@base-ui/react/checkbox';
import {Switch as S} from '@base-ui/react/switch';
import {Select as SelectBase} from '@base-ui/react/select';

type Styled<T>=Omit<T,'className'>&{className?:string};
export type Theme='light'|'dark';
export type Surface='air'|'frost'|'prism'|'smoke';
export type Accent='slate'|'blue'|'violet'|'jade';
export type Radius='strict'|'soft'|'round';
export type Density='comfortable'|'compact';
export interface TenvellProviderProps extends Omit<React.ComponentProps<'div'>,'style'>{theme?:Theme;surface?:Surface;accent?:Accent;radius?:Radius;density?:Density;motion?:boolean;style?:React.CSSProperties&Record<`--${string}`,string|number|undefined>}
export function TenvellProvider(props:TenvellProviderProps):React.JSX.Element;
export interface ButtonProps extends React.ComponentProps<'button'>{variant?:'primary'|'secondary'|'outline'|'ghost'|'icon'|'link'|'destructive';size?:'default'|'sm'|'lg'|'icon';loading?:boolean}
export function Button(props:ButtonProps):React.JSX.Element;
export function Input(props:React.ComponentProps<'input'>):React.JSX.Element;
export function Textarea(props:React.ComponentProps<'textarea'>):React.JSX.Element;
export function Checkbox(props:Styled<React.ComponentProps<typeof C.Root>>):React.JSX.Element;
export function Switch(props:Styled<React.ComponentProps<typeof S.Root>>):React.JSX.Element;
export function Card(props:React.ComponentProps<'article'>&{surface?:Surface}):React.JSX.Element;
export function CardHeader(props:React.ComponentProps<'header'>):React.JSX.Element;
export function CardTitle(props:React.ComponentProps<'h3'>):React.JSX.Element;
export function CardDescription(props:React.ComponentProps<'p'>):React.JSX.Element;
export function CardContent(props:React.ComponentProps<'div'>):React.JSX.Element;
export function CardFooter(props:React.ComponentProps<'footer'>):React.JSX.Element;
export const glassMaterials:{id:Surface;name:string;description:string}[];
export type GlassSurfaceProps<Element extends React.ElementType='div'>={as?:Element;surface?:Surface;className?:string}&Omit<React.ComponentPropsWithRef<Element>,'as'|'surface'|'className'>;
export function GlassSurface<Element extends React.ElementType='div'>(props:GlassSurfaceProps<Element>):React.JSX.Element;
export function GlassPicker(props:{value:Surface;onChange:(value:Surface)=>void;label?:string}):React.JSX.Element;
export interface SelectProps extends Omit<Styled<React.ComponentProps<typeof SelectBase.Trigger>>,'value'|'onChange'|'name'>{items:{value:string;label:React.ReactNode}[];name?:string;value?:string|null;onValueChange?:(value:string|null)=>void}
export function Select(props:SelectProps):React.JSX.Element;
export const Dialog:typeof D.Root;
export const DialogTrigger:typeof D.Trigger;
export const DialogClose:typeof D.Close;
export function DialogTitle(props:Styled<React.ComponentProps<typeof D.Title>>):React.JSX.Element;
export function DialogDescription(props:Styled<React.ComponentProps<typeof D.Description>>):React.JSX.Element;
export function DialogContent(props:Styled<React.ComponentProps<typeof D.Popup>>):React.JSX.Element|null;
export const DropdownMenu:typeof M.Root;
export const DropdownMenuTrigger:typeof M.Trigger;
export const DropdownMenuGroup:typeof M.Group;
export const DropdownMenuRadioGroup:typeof M.RadioGroup;
export function DropdownMenuContent(props:Styled<React.ComponentProps<typeof M.Popup>>&{align?:Styled<React.ComponentProps<typeof M.Positioner>>['align']}):React.JSX.Element;
export function DropdownMenuItem(props:Styled<React.ComponentProps<typeof M.Item>>):React.JSX.Element;
export function DropdownMenuLabel(props:Styled<React.ComponentProps<typeof M.GroupLabel>>):React.JSX.Element;
export function DropdownMenuSeparator(props:Styled<React.ComponentProps<typeof M.Separator>>):React.JSX.Element;
export function DropdownMenuCheckboxItem(props:Styled<React.ComponentProps<typeof M.CheckboxItem>>):React.JSX.Element;
export function DropdownMenuRadioItem(props:Styled<React.ComponentProps<typeof M.RadioItem>>):React.JSX.Element;
export function Tabs(props:Styled<React.ComponentProps<typeof T.Root>>):React.JSX.Element;
export function TabsList(props:Styled<React.ComponentProps<typeof T.List>>&{variant?:'segmented'|'line'|'vertical'}):React.JSX.Element;
export function TabsTrigger(props:Styled<React.ComponentProps<typeof T.Tab>>):React.JSX.Element;
export function TabsContent(props:Styled<React.ComponentProps<typeof T.Panel>>):React.JSX.Element;
export function Accordion(props:Styled<React.ComponentProps<typeof A.Root>>):React.JSX.Element;
export const AccordionItem:typeof A.Item;
export function AccordionTrigger(props:Styled<React.ComponentProps<typeof A.Trigger>>):React.JSX.Element;
export function AccordionContent(props:Styled<React.ComponentProps<typeof A.Panel>>):React.JSX.Element;
export const Popover:typeof P.Root;
export const PopoverTrigger:typeof P.Trigger;
export const PopoverClose:typeof P.Close;
export const PopoverTitle:typeof P.Title;
export const PopoverDescription:typeof P.Description;
export function PopoverContent(props:Styled<React.ComponentProps<typeof P.Popup>>&{align?:Styled<React.ComponentProps<typeof P.Positioner>>['align']}):React.JSX.Element;
export function Tooltip(props:{children:React.ReactElement<{'aria-describedby'?:string}>;content:React.ReactNode;side?:'top'|'right'|'bottom'|'left'}):React.JSX.Element;
export const Sheet:typeof D.Root;
export const SheetTrigger:typeof D.Trigger;
export const SheetClose:typeof D.Close;
export const SheetTitle:typeof D.Title;
export const SheetDescription:typeof D.Description;
export function SheetContent(props:Styled<React.ComponentProps<typeof D.Popup>>):React.JSX.Element;
export function Combobox(props:{items:string[];value?:string|null;onValueChange:(value:string|null)=>void;label?:string;placeholder?:string;disabled?:boolean}):React.JSX.Element;
export function Badge(props:React.ComponentProps<'span'>&{tone?:'neutral'|'success'|'warning'|'info'|'error'}):React.JSX.Element;
export function Avatar(props:{fallback?:React.ReactNode;alt?:string;src?:string;size?:'default'|'sm'|'lg';className?:string}):React.JSX.Element;
export function AvatarGroup(props:{children?:React.ReactNode;label?:string}):React.JSX.Element;
export function Separator(props:React.ComponentProps<'div'>&{orientation?:'horizontal'|'vertical'}):React.JSX.Element;
export function Skeleton(props:React.ComponentProps<'div'>):React.JSX.Element;
export function Progress(props:Omit<React.ComponentProps<'progress'>,'value'>&{value?:number|null;max?:number;label?:string}):React.JSX.Element;
export function EmptyState(props:React.ComponentProps<'div'>&{title?:string;description?:React.ReactNode;icon?:React.ElementType}):React.JSX.Element;
export function InputGroup(props:React.ComponentProps<'div'>):React.JSX.Element;
export function InputAddon(props:{children?:React.ReactNode;align?:'start'|'end';className?:string}):React.JSX.Element;
export function ButtonGroup(props:{children?:React.ReactNode;label?:string;className?:string}):React.JSX.Element;
export function RadioGroup(props:{items:{value:string;label:React.ReactNode;description?:React.ReactNode;disabled?:boolean}[];value:string;onValueChange:(value:string)=>void;label?:string;name?:string;disabled?:boolean;className?:string}):React.JSX.Element;
export function Slider(props:Omit<React.ComponentProps<'input'>,'value'|'onChange'|'min'|'max'|'step'>&{value?:number;onValueChange:(value:number)=>void;min?:number;max?:number;step?:number;label?:string;unit?:string}):React.JSX.Element;
export function Breadcrumb(props:{items:{label:React.ReactNode;href?:string}[];label?:string}):React.JSX.Element;
export function Pagination(props:{page:number;pages:number;onPageChange:(page:number)=>void;label?:string}):React.JSX.Element;
export function ToggleGroup(props:{items:{value:string;label:string;icon?:React.ElementType}[];value:string;onValueChange:(value:string)=>void;label?:string}):React.JSX.Element;
```

## Optional chart declarations

```ts
import type * as React from 'react';
import type {SectorProps} from 'recharts';
export interface GlassBarProps{x?:number;y?:number;width?:number;height?:number;radius?:number|[number,number,number,number];fill?:string;index?:number;value?:number|[number,number];active?:boolean;isActive?:boolean}
export function GlassBar(props:GlassBarProps):React.JSX.Element|null;
export function GlassDot(props:{cx?:number;cy?:number;fill?:string;stroke?:string}):React.JSX.Element|null;
export function GlassSector(props:SectorProps&{active?:boolean;isActive?:boolean;value?:number;name?:string;payload?:{name?:string}}):React.JSX.Element;
```
