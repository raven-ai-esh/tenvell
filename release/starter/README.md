# tenvell starter0.1

The actual tenvell0.1 tarball is included in vendor/. This is a local UI starter with fictional data; it does not connect to a backend or send messages.

    npm ci
    npm run dev

Then open the URL printed by Vite. To check and build:

    npm run build

src/App.tsx uses the installed package and optional Recharts shapes. Settings belong to local React state. Edit this application to build your own product. Use TenvellProvider and import tenvell/styles.css once; styles and input responses stay inside the provider and its body portal. The title and notes can be edited and the checklist, menu, search, modal and chart are functional demonstrations.

Code MIT; embedded original Lamina fonts SIL OFL1.1. See the included licence files. Package documentation is included in vendor/README.md.
