import Error from '../components/error.jsx'
import Spaces from "../components/spaces/spaces";

export default {
  title: "simple-bar-spaces-jsx",
  component: Spaces,
};

const intBool = (x) => x ? 1 : 0;
const switchBool = (x) => x ? "on" : "off";
const sipBool = (x) => x ? "enabled" : "disabled";

const generateSpace = function(id, index, visible, focused, layout = "bsp", windows = []) {
  return {
    "id": id,
    "label": "",
    "index": index,
    "display": 1,
    "windows": [],
    "type": layout,
    "visible": intBool(visible),
    "focused": intBool(focused),
    "native-fullscreen": 0,
    "first-window": 0,
    "last-window": 0
  }
};

const generateWindow = function() {
  return {
    "id": 5765,
        "pid": 14583,
        "app": "Contexts",
        "title": "Sidebar",
        "frame": {
          "x": 1279,
          "y": 194,
          "w": 1,
          "h": 412
        },
        "level": 20,
        "role": "AXWindow",
        "subrole": "AXSystemDialog",
        "movable": 1,
        "resizable": 0,
        "display": 1,
        "space": 1,
        "visible": 1,
        "focused": 0,
        "split": "none",
        "floating": 1,
        "sticky": 1,
        "minimized": 0,
        "topmost": 0,
        "opacity": 1,
        "shadow": 0,
        "border": 0,
        "stack-index": 0,
        "zoom-parent": 0,
        "zoom-fullscreen": 0,
        "native-fullscreen": 0
  }
};


const generateDisplay = function() {
  return {
      "id": 1,
      "uuid": "37D8832A-2D66-02CA-B9F7-8F30A301B230",
      "index": 1,
      "spaces": [
        1
      ],
      "frame": {
        "x": 0,
        "y": 0,
        "w": 1280,
        "h": 800
      }
    };
};

const generateOutput = function() {
  return {
  "spaces": {
    "spaces": [ generateSpace(3, 1, false, false), generateSpace(3, 2, true, true) ],
    "windows": []
  },
  "displays": [generateDisplay()],
  "SIP": `System Integrity Protection status: ${sipBool(false)}.`,
  "shadow": switchBool(true)
  };
}

const Template = function(args) {
  if (args.error) {
    return (<Error type="error" />)
  } else if (!args.output) {
    return (<Error type="noOutput" />)
  } else if (typeof(args.output) != "object" || !args.output.spaces) {
    return (<Error type="noData" />)
  }

  return <Spaces
    output={args.output.spaces}
    SIP={`System Integrity Protection status: ${sipBool(args.sipEnabled)}.`}
    displayIndex={1}
  />
}

export const NoOutput = Template.bind({})
NoOutput.args = {
  error: true
}

export const RawOutput = Template.bind({})
RawOutput.args = {
  output: "purposely malformed json",
}

export const EmptySpaces =  Template.bind({})
EmptySpaces.args = {
  output: generateOutput(),
  sipEnabled: false,
}
