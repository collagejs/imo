# <img src="https://raw.githubusercontent.com/collagejs/core/HEAD/src/logos/collagejs-48.svg" alt="CollageJS Logo" width="48" height="48" align="left">&nbsp;@collagejs/imo

This is *CollageJS*' version for the popular `import-map-overrides` from `single-spa`.  It has significant improvements in user interface and functionality while dropping support for non-standard modules.  If you still work with non-ES modules like `SystemJS`, this won't work for you.

## Comparison to `import-map-overrides`

This is what they have in common:

- Both process `overridable-importmap` scripts in the HEAD HTML element.
- Both provide a way to override specific entries in the import map's `imports` section.
- Both provide a user interface to manage entry overriding.

This is what's different:

- This one cannot work with non-ES modules and has dropped all support for everythinig except `overridable-importmap`.
- This one supports overriding entries in maps inside the import map's `scopes` section (⚠️🚧 experimental).
- This one provides a modern and very fast user interface (powered by Svelte).
- This one supports the `@collagejs/vite-aim` Vite plug-in by posting the resulting import map back to Vite development servers for bare module identifier resolution while in serve mode (`npm run dev`).

## How To Use

When doing *CollageJS* piece (micro-frontend) projects, we don't have to do much.  We simply tell the `@collagejs/vite-im` Vite plug-in to add it.  The plug-in will inject the map-overriding script and the user interface module (which itself is a *CollageJS* piece).  See that plug-in's documentation for more information.

### Using On Its Own

Import map overriding works outside the confines of *CollageJS* projects.  No problem.  Use it if you find it useful.  How, you say?  Before answering this question, one must know this package.

This is a 2-part project.  The NPM package contains:

- The import-map-overriding script.  It is an IIFE that runs as soon as it is available.  Once it finishes, the import map will contain any defined overrides.
- The *CollageJS* piece (micro-frontend).  This is the package's user interface that is used to manage overrides (add, remove, disable, etc.).  This is not required for the overriding functionality, but then one must provide a way to define overrides.  Your choice:  Use this UI, or figure out the values needed in local storage.

ℹ️ Both items above are bundled inside the NPM package:

- `dist/imo.min.js`:  The IIFE script.
- `dist/imo-ui.js`:  The *CollageJS* piece (MFE) script.
- `dist/assets/cjcss(cjs-imo)index.css`:  The piece's CSS.

#### Referencing from CDN

This is the recommended way because it is simple, and bundling (the other option) doesn't really provide any advantages.  Everything works either way.

In your HTML page, after all overridable import maps, inject the script with a `<script>` tag:

```html
<!DOCTYPE html>
<head>
    <script type="overridable-importmap">
        {
            "imports": {...},
            "scopes": { ... }
        }
    </script>
    <!-- ETC. Other overridable import maps, if any. -->
    <script type="application/javascript" src="https://cdn.jsdelivr.net/npm/@collagejs/imo@latest/dist/imo.min.js"></script>
    <script type="application/json" id="collagejs-imo-ui-options">
        {
            "base": "https://cdn.jsdelivr.net/npm/@collagejs/imo@latest"
        }
    </script>
</head>
<body>
    ...
    <script type="module" src="https://cdn.jsdelivr.net/npm/@collagejs/imo@latest/dist/imo-ui.js"></script>
</body>
```

The first script is the import-map-entry-overriding script; the one in the body is an ES module that mounts the user interface.

> ⚠️ The above code uses `@latest` in the URL to pull the latest version, but you should **not** do this in production.  You should always fix your code to the version that you have tested and know it works.  But then again, maybe you don't want this in production, so we don't really know.  Do as you wish! 😁

Finally, the script of type `"application/json"` contains user interface options, where `base` is definitely needed.  It is used to correctly download the user interface CSS from the NPM package.

To know about how to specify more options, see the [Specifying Options](#specifying-options) section below.

#### Bundling

TODO:  This section needs verification.

To bundle the script that overrides import maps, simply import it from a project file:

```typescript
import from '@collagejs/imo/imo';
```

However, things are not that simple.  This script needs to run before any modules are imported, or the import map will be ignored by the browser.  As a general recommendation, we don't bundle this script.  If we do, we will have an IIFE that does side effects mixed with our bundled set of modules.

This would have to be bundled into another side-effects module and separated from the usual framework code that does importing and such.  See? Not so simple, indeed.

As for the UI, the script that mounts it is not available for import.  Instead, one can import the `imoUiFactory()` function and use it to mount the UI under our own conditions:

```typescript
import { imoUiFactory } from '@collagejs/imo';
```

> ℹ️ See below for information on how to use it.

This will tell bundlers to bundle the associated code.  All that remains is the CSS, which can be bundled by importing it as a side effects module:

```typescript
import from '@collagejs/imo/css';
```

### Specifying Options

The import map-overriding script accepts a set of options that control how the resulting import map is posted to Vite development servers.  The user interface script is in a similar position, accepting options that control the appearance and functionality of the provided user interface.

#### Import Map Positing Options

This is the type definition:

```ts
type ImPostingOptions = {
    importMapEndpoint?: string;
    autoAllowLocalhost?: 'loopback' | 'private-ip' | 'all' | 'none';
    retryOptions?: Omit<PRetryOptions, 'onFailedAttempt' | 'shouldRetry' | 'shouldConsumeRetry' | 'signal'>;
}
```

The script uses the popular `p-retry` package to retry data posting operations when they fail.  The behavior can be adjusted via the `retryOptions` option, which is all `p-retry` options except for the ones omitted.

The script, by default, will accept as Vite development server any host that uses loopback or private IP addresses.  It is not possible to ask the script to post the import map to a public IP address.  To deactivate import map posting, set `autoAllowLocalhost` to `'none'`.

The `importMapEndpoint` allows the customization of the path used to post import map data.  If one wishes to use a non-default path, we will have to set it here, and set it also on the server side(s) of the project(s).

These options are set in the `<head>` element as inside a script tag of type `"application/json"` with an `id` attribute of `"collagejs-im-post-options"`:

```html
<head>
    <script type="application/json" id="collagejs-im-post-options">
        {
            "importMapEndpoint": "my_custom_endpoint_path",
            "autoAllowLocalhost": "loopback",
            "retryOptions": {
                "retries": 4,
                "factor": 1.5
            }
        }
    </script>
</head>
```

### User Interface Options

See the [Options](#options) section below for the full type definition and explanation of each setting.

This is how these options are injected:

```html
<head>
    <script type="application/json" id="collagejs-imo-ui-options">
        {
            ...
        }
    </script>
</head>
```

## API

Only one API is exported from this NPM package.

### imoUiFactory

Function that creates a *CollageJS* piece that can be mounted in a web document's DOM element.

```typescript
async function imoUiFactory(options?: ImoUiFactoryOptions): Promise<CorePiece<{}>>;

type ImoUiFactoryOptions = {
    base?: string;
    shadowDom?: boolean;
    ui?: {
        position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
        language?: string | undefined;
        theme?: 'light' | 'dark' | 'system';
        localStorageTrigger?: string | undefined;
        glass?: {
            enabled?: boolean;
            opacity?: number;
            blur?: number;
            saturation?: number;
        };
    };
}
```

#### Options

- `base`: Base path used to locate the user interface's CSS.
- `shadowDom`: Set to `true` to have the piece mount in Shadow DOM.
- `ui.position`: The position of the dev-mode user interface being mounted.
- `ui.language`: The language used in the user interface.
- `ui.theme`: The user interface theme.
- `ui.localStorageTrigger`: The name of the key that is defined in local storage to trigger the appearance of the user interface.
- `ui.glass.enabled`: Enables the glass effects in the user interface.
- `ui.glass.opacity`: Controls the opacity used to create the glass effect.
- `ui.glass.blur`: Controls the blur used to create the glass effect.
- `ui.glass.saturation`: Controls the saturation used to create the glass effect.

> 🚧 English is the only supported language for now.

### Constants

In order to avoid Node (server) code pulling Svelte (browser) code, constant definitions have been separated from the UI factory module.

These are the two constants that can be imported:

```ts
import { imPostingOptionsId, imoUiOptionsId } from "@collagejs/imo/const";
```

These are the script ID's used to set options in the `<head>` element and most people won't need them.  These are used by the `@collagejs/im` Vite plug-in.

## Development

This repository contains, in essence, a **Vite + Svelte** project.  In other words:  A web application.  The build process, however, is not standard:  It's been changed to create bundles of a **CollageJS** piece (the IMO user interface, done in Svelte), plus an IIFE in charge of performing import map overriding.

### Setting Up

Just clone the repository, then install packages:

```bash
npm install
```

At this point, things should work.  Run Vite's development server.  The project runs in port `4444`:

```bash
npm run dev
```

### Build Setup

Vite is used for building.  It has been given 3 plug-ins:

- *CollageJS*' `@collagejs/vite-css`, which is the one used by micro-frontend projects that configures the entry points and injects the CSS mounting algorithm.
- An ad-hoc `viteTest()` plug-in that injects a simple overridable import map into the HTML's HEAD element.
- An ad-hoc `viteIife()` plug-in in charge of creating the IIFE bundle of the code that overrides import maps.

The rest is standard Vite configuration.

#### post-build.ps1

In order to build, Powershell is needed because there is this small PS script that put the files where package.json states they will be.

Anything Vite cannot do by itself now or in the future that is needed for building, will be added to this post-building script.
