import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createContext, SourceTextModule, SyntheticModule } from "node:vm";
import React from "react";
import { act, create } from "react-test-renderer";

// Load the hook with Übersicht's host-provided imports replaced by test doubles.
// React itself is real, so effect updates and unmount cleanup use its lifecycle.
async function setup(t, initial = {}) {
  const source = await readFile(
    new URL("../lib/hooks/use-server-socket.js", import.meta.url),
    "utf8",
  );
  const sockets = [];
  const calls = [];
  const savedSettings = [];
  const contextValue = {
    settings: {
      global: { enableServer: true, serverSocketPort: 7776 },
      widgets: { cpuWidget: true },
      userWidgets: { userWidgetsList: { 0: { active: true } } },
    },
    setSettings(update) {
      contextValue.settings = update(contextValue.settings);
    },
  };
  class WebSocket {
    constructor(url) {
      this.url = url;
      this.closeCount = 0;
      sockets.push(this);
    }
    close() {
      this.closeCount++;
    }
    send(action, data) {
      this.onmessage?.({ data: JSON.stringify({ action, data }) });
    }
  }
  const context = createContext({ WebSocket });
  const imports = {
    uebersicht: { React },
    "../settings": { set: (settings) => savedSettings.push(settings) },
    "../components/simple-bar-context.jsx": {
      useSimpleBarContext: () => contextValue,
    },
  };
  const module = new SourceTextModule(source, { context });
  await module.link((specifier) => {
    const values = imports[specifier];
    assert.ok(values, `Unexpected import: ${specifier}`);
    return new SyntheticModule(
      Object.keys(values),
      function () {
        for (const [key, value] of Object.entries(values)) {
          this.setExport(key, value);
        }
      },
      { context },
    );
  });
  await module.evaluate();
  const useServerSocket = module.namespace.default;
  let props = {
    target: "cpu",
    visible: true,
    getter: (data) => calls.push(data),
    ...initial,
  };
  function Widget(props) {
    useServerSocket(
      props.target,
      props.visible,
      props.getter,
      props.resetWidget,
      props.setLoading,
      props.userWidgetIndex,
    );
    return null;
  }
  let renderer;
  act(() => {
    renderer = create(React.createElement(Widget, props));
  });
  const unmount = () => act(() => renderer.unmount());
  t.after(unmount);
  return {
    sockets,
    calls,
    savedSettings,
    unmount,
    render(next = {}, global = {}) {
      props = { ...props, ...next };
      contextValue.settings = {
        ...contextValue.settings,
        global: { ...contextValue.settings.global, ...global },
      };
      act(() => renderer.update(React.createElement(Widget, props)));
    },
  };
}

test("closes and detaches the socket on unmount", async (t) => {
  const { sockets, calls, unmount } = await setup(t);
  assert.equal(sockets.length, 1);
  sockets[0].send("push", "before");
  unmount();
  assert.equal(sockets[0].closeCount, 1);
  assert.equal(sockets[0].onmessage, null);
  sockets[0].send("push", "after");
  assert.deepEqual(calls, ["before"]);
});

test("uses current callbacks and visibility without reconnecting", async (t) => {
  const { sockets, calls, render } = await setup(t);
  const updated = [];
  render({ getter: (data) => updated.push(data), visible: false });
  sockets[0].send("refresh", "hidden");
  sockets[0].send("push", "pushed");
  render({ visible: true });
  sockets[0].send("refresh", "visible");
  assert.deepEqual(calls, []);
  assert.deepEqual(updated, ["pushed", "visible"]);
  assert.equal(sockets.length, 1);
  assert.equal(sockets[0].closeCount, 0);
});

test("replaces the socket when its port, target, or widget index changes", async (t) => {
  const { sockets, render } = await setup(t);
  render({}, { serverSocketPort: 8888 });
  render({ target: "user-widget", userWidgetIndex: 0 });
  render({ userWidgetIndex: 1 });
  assert.deepEqual(
    sockets.map((socket) => socket.url),
    [
      "ws://localhost:7776/?target=cpu",
      "ws://localhost:8888/?target=cpu",
      "ws://localhost:8888/?target=user-widget&userWidgetIndex=0",
      "ws://localhost:8888/?target=user-widget&userWidgetIndex=1",
    ],
  );
  assert.deepEqual(sockets.map((socket) => socket.closeCount), [1, 1, 1, 0]);
  assert.ok(sockets.slice(0, -1).every((socket) => socket.onmessage === null));
});

test("disabling closes the socket and re-enabling opens exactly one", async (t) => {
  const { sockets, render } = await setup(t);
  render({}, { enableServer: false });
  assert.equal(sockets[0].closeCount, 1);
  render({ visible: false });
  assert.equal(sockets.length, 1);
  render({}, { enableServer: true });
  assert.equal(sockets.length, 2);
  assert.equal(sockets[1].closeCount, 0);
});

test("toggle actions use updated reset and loading callbacks", async (t) => {
  const { sockets, render, savedSettings } = await setup(t);
  const actions = [];
  render({
    resetWidget: () => actions.push("reset"),
    setLoading: (loading) => actions.push(loading),
  });
  sockets[0].send("disable");
  sockets[0].send("enable");
  sockets[0].send("toggle");
  assert.deepEqual(actions, ["reset", true, "reset"]);
  assert.deepEqual(
    savedSettings.map((s) => s.widgets.cpuWidget),
    [false, true, false],
  );
  assert.equal(sockets.length, 1);
});
