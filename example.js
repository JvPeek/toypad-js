const Toypad = require('./toypad');

const toypad = new Toypad();

// Initialize the Toypad
toypad.init();

// Register a callback for tag events
toypad.onTagEvent(({ padNum, uid, action, bytelist}) => {
    console.log(`Tag event detected! Pad: ${padNum}, UID: ${uid}, Action: ${action}`);
    
    if (action === 'added') {
        // Custom logic to handle a tag being inserted
        if (uid.toString() === '83,86,106,93,97,0,1') { // Example UID
            //toypad.setPadColorFade(padNum, [Math.floor(Math.random()*2.55)*100, Math.floor(Math.random()*2.55)*100, Math.floor(Math.random()*2.55)*100], 100); // Set the pad to random color
            toypad.setPadColor(0, [0, 0, 255]); // Set the pad to red
            toypad.setPadColorFlash(0, [255,0,0],1, 1,255); // Set the pad to random color
            //toypad.setPadColorFlash(padNum, [Math.floor(Math.random()*2.55)*100, Math.floor(Math.random()*2.55)*100, Math.floor(Math.random()*2.55)*100], 1,1,20); // Set the pad to random color
        } else {
            toypad.setPadColor(0, [255, 0, 0]); // Set the pad to red
        }
    } else if (action === 'removed') {
        toypad.setPadColorFade(0, [0, 0, 0], 20); // Turn off the pad
    }
});

// Start listening for tags
toypad.listenForTags();

// Handle exit cleanly
process.on('SIGINT', () => {
    toypad.close();
    process.exit();
});
