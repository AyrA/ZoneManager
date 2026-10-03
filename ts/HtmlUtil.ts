"use strict";

namespace HtmlUtil {
	type DragData = {
		id: string,
		number: number,
		zone: number
	};

	const dragData = { id: "", number: 0, zone: 0 } as DragData;

	function getDragData(drag: DataTransfer): DragData | null {
		const id = drag.getData("text");
		if (id === dragData.id) {
			return dragData;
		}
		return null;
	}

	function setDragData(drag: DataTransfer, item: HTMLElement) {
		const itemData = App.getItem(Number(item.dataset.number));
		if (itemData) {
			drag.clearData();
			dragData.number = Number(item.dataset.number);
			dragData.zone = +itemData.zone;
			dragData.id = DataProtection.GetRandomId();

			drag.setData("text", dragData.id);
			console.log("Drag start for:", dragData);
			return true;
		}
		else {
			console.log("No item found");
		}
		return false;
	}

	export function setNameVisible(visible: boolean) {
		if (visible) {
			document.body.classList.remove("hide-name");
		} else {
			document.body.classList.add("hide-name");
		}
	}

	export function createNumbers(count: number): NumberItem[] {
		return addNumbers(1, count);
	}

	export function addNumbers(firstIndex: number, count: number): NumberItem[] {
		const ret = [];
		for (let i = 0; i < count; i++) {
			const item = {
				html: null!,
				number: firstIndex + i,
				name: "-",
				history: [],
				zone: ZoneType.Unspecified
			} as NumberItem;
			restoreHtml(item);
			assign(item, ZoneType.Green, false, false);
			ret.push(item);
		}
		return ret;
	}

	export function restoreHtml(item: NumberItem) {
		const e = document.createElement("div");
		e.draggable = true;
		e.classList.add("col-4", "number-item", "number-" + item.number);
		e.id = "number-" + item.number;
		e.dataset.number = String(item.number);
		e.innerHTML = `
<div class="alert alert-info">
	<p class="label-number">${item.number}</p>
	<p class="label-name text-break">-</p>
	<p class="label-time">/</p>
</div>`;
		e.addEventListener("dragstart", function (this: HTMLElement, ev) {
			if (!ev.dataTransfer) {
				return;
			}
			if (ev.target instanceof HTMLElement) {
				setDragData(ev.dataTransfer, ev.target);
			}
		});
		e.addEventListener("click", function (ev) {
			ev.preventDefault();
			Dialog.showInfoDialog(App.getItem(Number(this.dataset.number))!);
		});
		item.html = e;
	}

	export function updateItem(item: NumberItem) {
		item.html.querySelector(".label-name")!.textContent = item.name;
		var hist = item.history[0];
		if (hist) {
			const time = Date.now() - hist.enter;
			item.html.querySelector(".label-time")!.textContent = Util.formatTime(time);
			const alertItem = item.html.querySelector(".alert") as HTMLDivElement;
			alertItem.classList.remove("alert-danger", "alert-warning", "alert-info");
			switch (App.getTimeType(time, item.zone)) {
				case TimeType.Warning:
					alertItem.classList.add("alert-warning");
					break;
				case TimeType.Danger:
					alertItem.classList.add("alert-danger");
					break;
				default:
					alertItem.classList.add("alert-info");
					break;
			}
		}
		else {
			item.html.querySelector(".label-time")!.textContent = "/";
		}
	}

	export function getZone(zone: ZoneType): HTMLElement {
		switch (zone) {
			case ZoneType.Green:
				return document.getElementById("zoneGreen")!;
			case ZoneType.Yellow:
				return document.getElementById("zoneYellow")!;
			case ZoneType.Red:
				return document.getElementById("zoneRed")!;
			default:
				throw new Error("Invalid zone data: " + zone);
		}
	}

	export function getZoneFromHtml(zoneItem: HTMLElement): ZoneType {
		zoneItem = zoneItem.querySelector(".zone") ?? zoneItem;
		console.log("checking zone for", zoneItem);
		if (zoneItem.id === "zoneGreen") {
			return ZoneType.Green;
		}
		if (zoneItem.id === "zoneYellow") {
			return ZoneType.Yellow;
		}
		if (zoneItem.id === "zoneRed") {
			return ZoneType.Red;
		}
		return ZoneType.Unspecified;
	}

	export function assign(item: NumberItem, zone: ZoneType, updateHistory: boolean, conditional: boolean) {
		if (conditional && item.zone === zone) {
			console.log("Item doesn't needs assignment");
			return;
		}
		if (updateHistory) {
			if (item.history.length > 0) {
				const oldZone = item.history[0];
				oldZone.exit = Date.now();
			}
			const newZone = {
				enter: Date.now(),
				zone: zone
			} as HistoryEntry;
			item.history.unshift(newZone);
		}
		item.zone = zone;
		const zoneItems = App.getZoneItems(zone);
		zoneItems.sort((a, b) => a.number - b.number);
		const index = zoneItems.indexOf(item);
		const next = index < 0 ? void 0 : zoneItems[index + 1];
		if (next && next.html.parentNode) {
			console.log(zoneItems, item, next);
			next.html.parentNode.insertBefore(item.html, next.html);
		}
		else {
			getZone(zone).appendChild(item.html);
		}
	}

	export function setDragReceiver() {
		const zones = [
			getZone(ZoneType.Green),
			getZone(ZoneType.Yellow),
			getZone(ZoneType.Red),
		];
		for (let zone of zones) {
			zone.parentElement!.addEventListener("drop", function (e) {
				if (e.dataTransfer) {
					const data = getDragData(e.dataTransfer);
					if (!data) {
						console.log("Cannot get drag data");
						return;
					}
					const id = data.number;
					const item = App.getItem(id);
					if (item) {
						e.preventDefault();
						const zone = getZoneFromHtml(this);
						if (zone !== ZoneType.Unspecified) {
							console.log("OK", item.number, item.zone, ZoneType);
							HtmlUtil.assign(item, zone, true, true);
						}
					}
				}
			});
			zone.parentElement!.addEventListener("dragover", function (e) {
				if (e.dataTransfer) {
					e.preventDefault();
					e.dataTransfer.dropEffect = "copy";
				}
			});
		}
	}
}