import "whatwg-fetch";
import { StrictMode } from "react";
import { render } from "react-dom";
import App from "./App";
import "./index.css";

import "core-js/stable";
import "regenerator-runtime/runtime";
import "whatwg-fetch";
import "url-polyfill";
import "raf/polyfill";
import "dom4";
import SimpleExamples from "./examples/SimpleExamples";

render(<SimpleExamples />, document.getElementById("root"));
