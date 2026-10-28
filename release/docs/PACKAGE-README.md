# tenvell

Thin glass. Clear interfaces.

[Documentation](https://tenvell.esher1.chatgpt.site/install) · [Source](https://github.com/raven-ai-esh/tenvell)

A React19 UI kit with four glass finishes, independent themes, readable controls and a shallow hover → press → release response. Original Lamina UI/Mono fonts are included locally; no font service or account is needed.

## Install the release archive

The prepared0.1 release is distributed as a tarball. From the folder containing it:

    npm install ./tenvell-0.1.0.tgz

This does not assume that the name is already published on npm. The downloadable starter includes the same tarball and a lockfile; unzip it, run npm ci, then npm run dev.

## Use

    import {TenvellProvider, Button, Card, Input} from 'tenvell';
    import 'tenvell/styles.css';

    export default function App() {
      return <TenvellProvider theme="light" surface="air">
        <Card>
          <Input aria-label="Name" placeholder="Your name" />
          <Button>Continue</Button>
        </Card>
      </TenvellProvider>;
    }

Import the stylesheet once. Wrap the area that should use tenvell. The provider does not change document/body styles or store preferences. Own its settings in your application state.

- theme: light | dark
- surface: air | frost | prism | smoke
- accent: slate | blue | violet | jade
- radius: strict | soft | round
- density: comfortable | compact
- motion: boolean, default true; reduced-motion preferences always take precedence

Multiple independent providers are supported. Inline CSS custom properties passed through the provider style prop also reach its overlays; layout styles stay local. The --tenvell-overlay-z token controls the overlay layer (default1000). Overlays inherit the originating provider's settings through a dedicated body portal. Dialogs use a theme-backed readable plate with a material tint, so their text does not depend on whether the host content underneath is light or dark. Fields retain one quiet edge. Motion and CSS stay inside the provider and its portal; unrelated page controls keep their own styling and input handling. Put your layout/background on an outer element; the kit does not replace the page background.

## Included in0.1

Button/loading/disabled variants, Input/Textarea, Checkbox, Switch, Card family, GlassSurface/Picker, Select, DropdownMenu family, Dialog family, Sheet, Popover, Tooltip, Combobox, Tabs, Accordion, Badge, Avatar/Group, RadioGroup, Slider, Progress, Input/Button groups, Breadcrumb, Pagination, ToggleGroup, Skeleton and EmptyState.

Calendar, DataTable, toast examples, the full messenger and task board remain in the source website. They are not claimed as standalone exports of this initial core release. Labels on shared primitives retain the current kit defaults; pass label/aria-label props to localize your product.

## Charts

Install Recharts3 separately if you need the optional chart shapes:

    npm install recharts@3.10.1

    import {GlassBar, GlassDot, GlassSector} from 'tenvell/charts';

Use these as Recharts shapes/active shapes. Keep Tooltip cursor={false}; item highlighting should follow the actual bar, point or sector. See the starter for a real example.

## Source-first installation

The release website's /r/tenvell.json installs the same core through the shadcn CLI. Use the full URL from its installation page inside your configured shadcn project. This copies editable files under your components/tenvell alias and retains the scoped stylesheet and licences. Individual item endpoints use direct module imports shown in their docs. The UI is ordinary CSS; it does not use Tailwind utilities.

## Compatibility and licences

The ESM release targets React/React DOM19 and modern browsers with backdrop-filter and CSS @scope. CSS scope boundaries keep nested providers independent; this is not a legacy-browser compatibility layer. The starter uses Vite6. Node22.12+ is recommended for the supplied tooling. Source-first JS and the full package TypeScript declarations are included. Do not infer certification of arbitrary backgrounds, assistive technologies or every framework from the supplied checks.

Code: MIT. Original Lamina fonts: SIL OFL1.1. See LICENSE, FONT-LICENSE.txt and THIRD-PARTY-NOTICES.md. No tracking, remote fonts, backend or production data is included.
