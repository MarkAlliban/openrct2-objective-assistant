/// <reference path="./lib/openrct2.d.ts" />
import { startup } from "./startup";
import { TITLE } from "./constants";

registerPlugin({
  name: TITLE,
  version: "1.0",
  authors: ["Mark Alliban"],
  type: "local",
  licence: "MIT",
  targetApiVersion: 111,
  minApiVersion: 111,
  main: startup,
});
