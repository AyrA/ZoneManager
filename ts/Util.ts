"use strict";

namespace Util {
	export function formatTime(ms: number): string {
		if (ms <= 0) {
			return "/";
		}
		var s = Math.floor(ms / 1000);
		var m = Math.floor(s / 60);
		var h = Math.floor(m / 60);
		return [n2(h), n2(m % 60), n2(s % 60)].join(":");
	}

	function n2(n: number) {
		return n < 10 ? "0" + String(n) : String(n);
	}

	export function zoneName(zone: ZoneType) {
		switch (zone) {
			case ZoneType.Green: return "Grün";
			case ZoneType.Yellow: return "Gelb";
			case ZoneType.Red: return "Rot";
		}
		return "?";
	}
}