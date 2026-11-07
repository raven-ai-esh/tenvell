# tenvell interface recipes

These examples use the package installation from the [install guide]({{SITE}}/docs/install.md). For the complete source-first core, substitute `@/components/tenvell` and `@/components/tenvell/styles.css`.

## A working settings form

```jsx
import { useState } from 'react';
import {
  TenvellProvider, Card, CardHeader, CardTitle,
  CardDescription, CardContent, CardFooter, Input, Button
} from 'tenvell';
import 'tenvell/styles.css';

export default function SettingsForm() {
  const [name, setName] = useState('Alex');
  const [saved, setSaved] = useState(false);

  function submit(event) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <TenvellProvider theme="light" surface="air" accent="slate">
      <form onSubmit={submit} style={{ maxWidth: 480, margin: '2rem auto' }}>
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your name in this local preview.</CardDescription>
          </CardHeader>
          <CardContent>
            <label htmlFor="profile-name">Display name</label>
            <Input id="profile-name" value={name} required
              onChange={event => { setName(event.target.value); setSaved(false); }} />
          </CardContent>
          <CardFooter>
            <Button type="submit">Save</Button>
            <span role="status">{saved ? 'Saved in this view' : ''}</span>
          </CardFooter>
        </Card>
      </form>
    </TenvellProvider>
  );
}
```

This deliberately keeps data in React state. Add persistence or a network request only when the application requires it.

## A controlled dialog

```jsx
import { useState } from 'react';
import {
  TenvellProvider, Button, Dialog, DialogTrigger, DialogContent,
  DialogTitle, DialogDescription, DialogClose
} from 'tenvell';
import 'tenvell/styles.css';

export default function DetailsDialog() {
  const [open, setOpen] = useState(false);
  return (
    <TenvellProvider theme="dark" surface="frost">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button />}>Open details</DialogTrigger>
        <DialogContent>
          <DialogTitle>Details</DialogTitle>
          <DialogDescription>This dialog inherits its provider's theme.</DialogDescription>
          <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
        </DialogContent>
      </Dialog>
    </TenvellProvider>
  );
}
```

Triggers use the Base UI `render` prop. Do not assume a Radix `asChild` API. The provider supplies the themed body portal; do not move the dialog out of its originating provider to apply a theme.

## A Recharts bar shape

Install `recharts@3.10.1` separately. Use the glass shapes as actual chart elements:

```jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TenvellProvider } from 'tenvell';
import { GlassBar } from 'tenvell/charts';
import 'tenvell/styles.css';

const data = [{ day: 'Mon', value: 12 }, { day: 'Tue', value: 19 }];

export default function ActivityChart() {
  return (
    <TenvellProvider theme="light" surface="air">
      <div style={{ height: 280, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip cursor={false} />
            <Bar dataKey="value" shape={<GlassBar />} activeBar={<GlassBar />} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </TenvellProvider>
  );
}
```

The host application provides a nonzero chart height. Keep `Tooltip cursor={false}` so hover follows the actual bar rather than a rectangular overlay. The starter contains a complete working chart.
