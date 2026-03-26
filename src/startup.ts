import { openWindow } from "./ui/open-window";
import { TITLE } from "./constants";
import { guestTracker } from "./data/guest-tracker";

context.subscribe("interval.day", function () {
});

export function startup() {

	// Initialise guest tracker
	const tracker = guestTracker();
	context.subscribe("interval.day", function () {
		tracker.updateGuestCount();
	});

	if (typeof ui !== "undefined") {
    ui.registerMenuItem(TITLE, () => openWindow(tracker));
  }
}
