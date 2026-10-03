"use strict";

namespace App {
	let reset = false;
	let hasInit = false;
	let config: AppConfig

	function getInitValues(): AppConfig {
		return {
			numbers: [],
			showNames: true,
			zoneSettings: {
				green: { enableAlert: false, alertDelayMinutes: 0, warnDelayMinutes: 0 },
				yellow: { enableAlert: false, alertDelayMinutes: 0, warnDelayMinutes: 0 },
				red: { enableAlert: true, alertDelayMinutes: 30, warnDelayMinutes: 20 }
			}
		} as AppConfig;
	}

	export function getItem(number: number) {
		const item = config.numbers.find(m => m.number === number);
		return item;
	}

	export function getZoneItems(zone: ZoneType): NumberItem[] {
		return config.numbers.filter(v => v.zone === zone);
	}

	export function init(count: number) {
		config = getInitValues();
		config.numbers = HtmlUtil.createNumbers(count);
		if (!hasInit) {
			hasInit = true;
			handleUpdate();
		}
	}

	export function addNumbers(count: number) {
		config.numbers = config.numbers.concat(HtmlUtil.addNumbers(config.numbers.length + 1, count));
		config.numbers.sort((a, b) => a.number - b.number);
	}

	export function restore() {
		const restore = localStorage.getItem("config");
		if (restore) {
			config = JSON.parse(restore) as AppConfig;
			config.numbers.forEach(HtmlUtil.restoreHtml);
			config.numbers.forEach((item) => HtmlUtil.assign(item, item.zone, false, false));
			if (!hasInit) {
				hasInit = true;
				handleUpdate();
			}
			return true;
		}
		return false;
	}

	export function save() {
		localStorage.setItem("config", JSON.stringify(config));
	}

	export function hasSaveData() {
		return Boolean(localStorage.getItem("config"));
	}

	export function resetSaveData() {
		reset = true;
		localStorage.clear();
		location.reload();
	}

	export function getTimeType(time: number, zone: ZoneType): TimeType {
		const m = time / 1000 / 60;
		const settings = [] as ZoneSettings[];
		settings[ZoneType.Green] = config.zoneSettings.green;
		settings[ZoneType.Yellow] = config.zoneSettings.yellow;
		settings[ZoneType.Red] = config.zoneSettings.red;

		if (!settings[zone].enableAlert) {
			return TimeType.Normal;
		}
		if (m >= settings[zone].alertDelayMinutes) {
			return TimeType.Danger;
		}
		if (m >= settings[zone].warnDelayMinutes) {
			return TimeType.Warning;
		}
		return TimeType.Normal;
	}

	export function getConfig() {
		return config;
	}

	export function updateZoneConfig(zone: ZoneType, settings: ZoneSettings) {
		switch (zone) {
			case ZoneType.Green:
				config.zoneSettings.green = structuredClone(settings);
				break;
			case ZoneType.Yellow:
				config.zoneSettings.yellow = structuredClone(settings);
				break;
			case ZoneType.Red:
				config.zoneSettings.red = structuredClone(settings);
				break;
			default:
				return false;
		}
		return true;
	}

	export function getZoneConfig(zone: ZoneType) {
		switch (zone) {
			case ZoneType.Green:
				return config.zoneSettings.green;
			case ZoneType.Yellow:
				return config.zoneSettings.yellow;
			case ZoneType.Red:
				return config.zoneSettings.red;
			default:
				throw new Error("Unknown zone type");
		}
	}

	export function update() {
		if (!reset) {
			config.numbers.forEach(HtmlUtil.updateItem);
			save();
		}
	}

	function handleUpdate() {
		update();
		setTimeout(handleUpdate, 1000 - (Date.now() % 1000));
	}
}