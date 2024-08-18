function uidCompare(uid1, uid2) {
    return uid1.every((val, index) => val === uid2[index]);
}

module.exports = { uidCompare };
