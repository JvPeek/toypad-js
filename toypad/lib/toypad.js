const UsbDevice = require('./usbDevice');

const TOYPAD_INIT = [0x55, 0x0f, 0xb0, 0x01, 0x28, 0x63, 0x29, 0x20, 0x4c, 0x45, 0x47, 0x4f, 0x20, 0x32, 0x30, 0x31, 0x34, 0xf7, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
const MSG_NORMAL = 0x55;

// Actions
const TAG_ADDED = 0;

class Toypad {
    constructor(vendorId = 0x0e6f, productId = 0x0241) {
        this.usbDevice = new UsbDevice(vendorId, productId);
        this.tagCallback = null;
    }

    init() {
        this.usbDevice.initDevice();
        this.usbDevice.sendCommand(TOYPAD_INIT);
    }

    onTagEvent(callback) {
        this.tagCallback = callback;
    }

    listenForTags() {
        this.usbDevice.onData((bytelist) => {
            if (!bytelist.length || bytelist[0] !== 0x56) return; // Skip non-NFC packets

            const padNum = bytelist[2];
            const uidBytes = bytelist.slice(6, 13);
            const action = bytelist[5];

            if (this.tagCallback) {
                this.tagCallback({
                    padNum,
                    uid: uidBytes,
                    action: action === TAG_ADDED ? 'added' : 'removed',
                    bytelist: bytelist,
                });
            } else {
                console.log(bytelist)
            }
        });
    }
    setPadColorFade(pad, color, fadeTime, count = 0x01) {
        this.usbDevice.sendCommand([MSG_NORMAL, 0x08, 0xc2, 0x02, pad, fadeTime, count, ...color]);
    }
    setPadColorFlash(pad, color, onTime, offTime, count = 0x02) {
        this.usbDevice.sendCommand([MSG_NORMAL, 0x09, 0xc3, 0x02, pad, onTime, offTime, count, ...color]);
    }
    setPadColor(pad, color) {
        
        this.usbDevice.sendCommand([MSG_NORMAL, 0x06, 0xc0, 0x02, pad, ...color]);
    }

    close() {
        this.usbDevice.closeDevice();
    }
}

module.exports = Toypad;
