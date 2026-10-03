document.addEventListener("DOMContentLoaded", function () {
	if (!App.restore()) {
		console.log("Created new state");
		App.init(12);
	}
	else {
		console.log("State restored from save data");
	}
	HtmlUtil.setDragReceiver();

	const zoneClick = function (this: HTMLElement, e: Event) {
		e.preventDefault();
		const zone = Number(this.dataset.zone);
		if (zone) {
			Dialog.showSettings(App.getZoneConfig(zone), zone);
		}
	}

	document.querySelectorAll("h2[data-zone]").forEach(title => title.addEventListener("click", zoneClick));

	document.querySelector("#btnAddNumber")!.addEventListener("click", function () {
		Dialog.showAddNumberDialog();
	});

	document.querySelector("#btnReset")!.addEventListener("click", function () {
		Dialog.showResetForm();
	});
});