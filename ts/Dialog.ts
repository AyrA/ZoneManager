"use strict";

namespace Dialog {
	const dlgItem = {
		dlg: document.querySelector("#dlgItem") as HTMLDialogElement,
		nameField: document.querySelector("#dlgItem input[name=name]") as HTMLInputElement,
		historyTbl: document.querySelector("#dlgItemHistory tbody") as HTMLInputElement
	};

	const dlgSettings = {
		dlg: document.querySelector("#dlgSettings") as HTMLDialogElement,
		enableField: document.querySelector("#dlgSettings input[name='enable-warning']") as HTMLInputElement,
		warnField: document.querySelector("#dlgSettings input[name='warn-minutes']") as HTMLInputElement,
		alertField: document.querySelector("#dlgSettings input[name='alert-minutes']") as HTMLInputElement
	};

	const dlgAddNumber = {
		dlg: document.querySelector("#dlgAddNumber") as HTMLDialogElement,
		countField: document.querySelector("#dlgAddNumber input[name='number']") as HTMLInputElement
	};

	const dlgReset = {
		dlg: document.querySelector("#dlgReset") as HTMLDialogElement,
		btnYes: document.querySelector("#dlgReset input[type='button']") as HTMLInputElement
	};

	export function showInfoDialog(item: NumberItem) {
		if (!item) {
			return;
		}
		dlgItem.dlg.dataset.itemid = String(item.number);
		dlgItem.nameField.value = item.name;
		dlgItem.dlg.showModal();
		dlgItem.historyTbl.innerHTML = "";
		for (let history of item.history) {
			const row = dlgItem.historyTbl.appendChild(document.createElement("tr"));
			const zoneField = row.appendChild(document.createElement("td"));
			const fromField = row.appendChild(document.createElement("td"));
			const durationField = row.appendChild(document.createElement("td"));
			const toField = row.appendChild(document.createElement("td"));

			zoneField.textContent = Util.zoneName(history.zone);
			fromField.textContent = new Date(history.enter).toLocaleTimeString();
			durationField.textContent = Util.formatTime((history.exit ?? Date.now()) - history.enter);
			toField.textContent = history.exit ? new Date(history.exit).toLocaleTimeString() : "Jetzt";
		}
	}

	export function showResetForm() {
		dlgReset.dlg.showModal();
	}

	export function showAddNumberDialog() {
		dlgAddNumber.countField.value = "0";
		dlgAddNumber.dlg.showModal();
	}

	export function showSettings(settings: ZoneSettings, zone: ZoneType) {
		dlgSettings.enableField.checked = settings.enableAlert;
		dlgSettings.warnField.value = String(settings.warnDelayMinutes);
		dlgSettings.alertField.value = String(settings.alertDelayMinutes);
		dlgSettings.dlg.dataset.zone = String(zone);
		dlgSettings.dlg.showModal();
	}

	dlgItem.dlg.addEventListener("close", function () {
		const item = App.getItem(Number(dlgItem.dlg.dataset.itemid));
		delete dlgItem.dlg.dataset.itemid;
		if (item) {
			item.name = dlgItem.nameField.value ? dlgItem.nameField.value : "-";
		}
	});

	dlgAddNumber.dlg.addEventListener("close", function () {
		const num = Number(dlgAddNumber.countField.value);
		if (num) {
			App.addNumbers(num);
		}
	});

	dlgSettings.dlg.addEventListener("close", function () {
		const zone = Number(dlgSettings.dlg.dataset.zone) as ZoneType;
		delete dlgSettings.dlg.dataset.zone;
		const config = {} as ZoneSettings;
		config.enableAlert = dlgSettings.enableField.checked;
		config.warnDelayMinutes = Math.min(1440, Math.max(0, Number(dlgSettings.warnField.value)));
		config.alertDelayMinutes = Math.min(1440, Math.max(0, Number(dlgSettings.alertField.value)));
		App.updateZoneConfig(zone, config);
	});

	dlgReset.btnYes.addEventListener("click", function () {
		App.resetSaveData();
	});
}