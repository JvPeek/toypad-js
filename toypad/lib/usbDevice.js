const usb = require('usb');

class UsbDevice {
    constructor(vendorId, productId) {
        this.vendorId = vendorId;
        this.productId = productId;
        this.device = null;
    }

    initDevice() {
        this.device = usb.findByIds(this.vendorId, this.productId);

        if (!this.device) {
            throw new Error('Device not found');
        }

        try {
            this.device.open();

            const iface = this.device.interfaces[0];
            if (iface.isKernelDriverActive()) {
                iface.detachKernelDriver();
            }
            iface.claim();
        } catch (error) {
            throw new Error(`Failed to access the device: ${error.message}`);
        }

        return this.device;
    }

    sendCommand(command) {
        let checksum = 0;
        command.forEach((word) => {
            checksum += word;
            if (checksum >= 256) checksum -= 256;
        });
        const message = [...command, checksum];

        while (message.length < 32) {
            message.push(0x00);
        }

        const endpoint = this.device.interfaces[0].endpoints[1];
        endpoint.transfer(message, (err) => {
            if (err) {
                console.error('Error sending message:', err);
            }
        });
    }

    onData(callback) {
        const endpoint = this.device.interfaces[0].endpoints[0];
        endpoint.startPoll(1, 32);
        endpoint.on('data', (data) => {
            callback(Array.from(data));
        });
        endpoint.on('error', (err) => {
            console.error('USB Error:', err);
        });
    }

    closeDevice() {
        if (this.device) {
            const endpoint = this.device.interfaces[0].endpoints[0];
            endpoint.stopPoll(() => {
                this.device.close();
                console.log('Device disconnected.');
            });
        }
    }
}

module.exports = UsbDevice;
