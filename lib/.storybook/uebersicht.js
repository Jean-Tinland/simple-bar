import { action } from '@storybook/addon-actions';

const handler = action("uebersicht_run");

export const React = require("react");
export const run = function(cmd) { handler(cmd) }
