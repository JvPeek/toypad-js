# Welcome/Servus
This is my implementation of the ${Klemmbausteinhersteller} Dimensions ToyPad protocol. At least in parts.

### Installation
#### Linux
libusb needs to be installed.
You also might want to create a udev rule.
```
sudo vim /etc/udev/rules.d/99-dimensions.rules
```

```bash
SUBSYSTEM=="usb", ATTR{idVendor}=="0e6f", ATTR{idProduct}=="0241", MODE="0666"
```
### Usage
See example.js for usage. Good luck.
