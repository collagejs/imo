# @collagejs/imo

This project is a hybrid project:

- Exports a JavaScript script that is capable of overriding import map entries.
- Exports a *CollageJS* micro-frontend project that provides a floating widget used to configure import map overriding.

## Usage

People would normally use this as a direct dependency of `@collagejs/vite-im`, a Vite plug-in that injects an overridable import map to the page, and then the overriding JavaScript script in a script tag in the HEAD HTML element.

This script also mounts the micro-frontend creates a global object named `_CollageJS_Imo` used to control a few things at will.