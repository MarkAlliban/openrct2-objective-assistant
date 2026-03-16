/// <reference path="C:/Program Files/OpenRCT2/openrct2.d.ts" />
import { startup } from "./startup";
import { TITLE } from "./constants";

registerPlugin({
	name: TITLE,
	version: "1.0",
	authors: [ "Mark Alliban" ],
	type: "local",
	licence: "MIT",
	targetApiVersion: 24,
	main: startup,
});
