const gradientOne  = [0xfff5f0ff,0xfee0d2ff,0xfcbba1ff,0xfc9272ff,0xfb6a4aff,0xef3b2cff,0xcb181dff,0xa50f15ff,0x67000dff];
const gradientTwo  = [0xfcfbfdff,0xefedf5ff,0xdadaebff,0xbcbddcff,0x9e9ac8ff,0x807dbaff,0x6a51a3ff,0x54278fff,0x3f007dff];
const gradientGray = [0xffffffff,0xf0f0f0ff,0xd9d9d9ff,0xbdbdbdff,0x969696ff,0x737373ff,0x525252ff,0x252525ff,0x000000ff];

function intensityLevel(value) {
    if (value < 0 || value > 1) throw new Error("value must be between 0 and 1");
    return (value === 1) ? gradientOne.length-1 : Math.floor(value * gradientOne.length);
}

function one(value) {
    return gradientOne[intensityLevel(value)];
}

function two(value) {
    return gradientTwo[intensityLevel(value)];
}

function grayscale(value) {
    return gradientGray[intensityLevel(value)];
}

module.exports = {
    intensityLevel,
    one,
    two,
    grayscale
};