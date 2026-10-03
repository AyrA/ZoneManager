enum ZoneType {
	Unspecified, Green, Yellow, Red
}

enum TimeType {
	Normal, Warning, Danger
}

type NumberItem = {
	number: number,
	name: string,
	html: HTMLElement,
	zone: ZoneType,
	history: HistoryEntry[]
}

type HistoryEntry = {
	zone: ZoneType,
	enter: number,
	exit?: number
}

type AppConfig = {
	numbers: NumberItem[],
	showNames: boolean,
	zoneSettings: ZoneConfig
};

type ZoneConfig = {
	green: ZoneSettings,
	yellow: ZoneSettings,
	red: ZoneSettings
};

type ZoneSettings = {
	enableAlert: boolean,
	warnDelayMinutes: number,
	alertDelayMinutes: number
};