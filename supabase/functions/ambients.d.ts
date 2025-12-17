// @ts-nocheck
// This file is a fallback for when the Deno extension for VS Code is missing.
// It suppresses "Cannot find name 'Deno'" errors in the IDE.
// If you have the "Deno" extension installed and enabled, this file is redundant but harmless.

declare global {
  var Deno: any;
}

export {};
