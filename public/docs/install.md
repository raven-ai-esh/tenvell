# Install tenvell 0.2.1

Requires React/React DOM 19 and a modern browser with CSS `@scope` and `backdrop-filter`. Use Node 22.12+ for the supplied tooling.

## Package archive

In an existing React 19 application:

```sh
npm install https://tenvell.space/releases/0.2.1/tenvell-0.2.1.tgz
```

This installs the package from the official website. A plain `npm install tenvell` is not the documented distribution channel.

Import the stylesheet once at your application's entrypoint. In frameworks that restrict global CSS imports, place it in the permitted root layout or entry file. Components use client-side interactions; in a React Server Components project, put the component using hooks or event handlers behind a `"use client"` boundary.

```jsx
import { TenvellProvider, Button, Card, Input } from 'tenvell';
import 'tenvell/styles.css';

export default function App() {
  return (
    <TenvellProvider theme="light" surface="air">
      <Card>
        <label htmlFor="name">Name</label>
        <Input id="name" name="name" placeholder="Your name" />
        <Button type="button">Continue</Button>
      </Card>
    </TenvellProvider>
  );
}
```

The button is an interface element; connect its action to your application's behavior.

## Editable source through shadcn

In a React 19 project with a working `components.json` and aliases:

```sh
npx shadcn@4.23.0 add https://tenvell.space/r/tenvell.json
```

With the conventional `@/*` alias pointing to your source directory:

```jsx
import { TenvellProvider, Button, Card } from '@/components/tenvell';
import '@/components/tenvell/styles.css';
```

The CLI copies editable components, CSS and licences. Keep your existing shadcn configuration and adjust the imports if its `components` alias differs. The copied tenvell components use ordinary CSS; do not replace their styles with Tailwind utilities.

To start with a small runnable example instead of the full core:

```sh
npx shadcn@4.23.0 add https://tenvell.space/r/button-demo.json
```

```jsx
import ButtonDemo from '@/components/tenvell/examples/button-demo';

export default function App() {
  return <ButtonDemo />;
}
```

For individual items, use their documented module imports. For example `button.json` exports `Button`, `Input`, `Textarea` and `TenvellProvider` from `@/components/tenvell/button`; it does not install the full core barrel. See the [registry reference](https://tenvell.space/docs/registry.md).

## Locked starter

Download [tenvell-starter-0.2.1.zip](https://tenvell.space/releases/0.2.1/tenvell-starter-0.2.1.zip), extract it into a new folder and run:

```sh
npm ci
npm run dev
```

To check TypeScript and build the starter:

```sh
npm run build
```

The starter includes the package tarball, a lockfile and a local example. It has no production backend.

## Optional charts

For the package installation:

```sh
npm install recharts@3.10.1
```

```jsx
import { GlassBar, GlassDot, GlassSector } from 'tenvell/charts';
```

For copied source, install `https://tenvell.space/r/charts.json` and import from `@/components/tenvell/charts`. Use the shapes inside Recharts components. See [recipes](https://tenvell.space/docs/recipes.md).

## Verify the release

The [release manifest](https://tenvell.space/releases/0.2.1/manifest.json) contains filenames, byte lengths and SHA-256 checksums. The package, starter and source archives are immutable published artifacts. Documentation updates do not replace their bytes.

If a UI appears unstyled, check the stylesheet import and provider before adding CSS. If an import is missing, check the [published API](https://tenvell.space/docs/api.md) and whether you installed an individual registry item or the complete core.
