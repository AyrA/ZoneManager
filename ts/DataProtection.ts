"use strict";
namespace DataProtection {
    export function GetRandomId() {
        var buffer = new Uint8Array(32);
        crypto.getRandomValues(buffer);
        return "id_" + buffer.toHex();
    }
}