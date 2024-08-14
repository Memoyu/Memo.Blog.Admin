// 从Leonardo里搬出来的实现方法
// https://github.com/adobe/leonardo/tree/main

import chroma from 'chroma-js';
import { createScale, CssColor, InterpolationColorspace } from '@adobe/leonardo-contrast-colors';

export function getBrighten(hex: string) {
    return chroma(hex).brighten(3).hex();
}

export function getScaleColors(
    colorKeys: string[],
    quantity: number = 10,
    colorspace: InterpolationColorspace = 'CAM02p'
) {
    let generousColorLength = 100;
    let cssColorKeys = colorKeys.map((c) => c as CssColor);

    let initialColorScale = createScale({
        swatches: quantity,
        colorKeys: cssColorKeys,
        colorspace: colorspace,
        shift: 1,
        distributeLightness: 'linear',
        smooth: false,
        fullScale: false,
        asFun: true,
    });

    let nums = getLuminosities(cssColorKeys);
    const minLum = Math.min(...nums);
    const maxLum = Math.max(...nums);
    const maxLumShifted = maxLum - minLum;

    let dataX = fillRange(0, generousColorLength);
    dataX = dataX.map((x) => (x === 0 ? 0 : x / (generousColorLength - 1)));
    let newLums = dataX.map((i) => round(maxLumShifted * i + minLum, 2));

    let newColors = findMatchingLuminosity(initialColorScale, generousColorLength, newLums, false);

    // Manually ensure first and last user-input key colors
    // are part of new key colors array being passed to the
    // new color scale.
    const lastColorIndex = newColors.length - 1;
    const first = initialColorScale(0);
    const last = initialColorScale(12);
    newColors.splice(0, 1, first.hex());
    newColors.splice(lastColorIndex, 1);
    newColors.splice(lastColorIndex, 1, last.hex());
    // console.log('newColors', newColors);

    return createScale({
        swatches: quantity,
        colorKeys: newColors,
        colorspace: colorspace,
        shift: 1,
        smooth: false,
        distributeLightness: 'linear',
        fullScale: false,
        asFun: false,
    }) as Array<string>;
}

const getLuminosities = (colorKeys: CssColor[]) => {
    let lumsObj = colorKeys.map((c: CssColor) => {
        return {
            color: c,
            lum: chroma(c).jch()[0] as number,
        };
    });
    lumsObj.sort((a, b) => (a.lum < b.lum ? 1 : -1));

    return lumsObj.map((c) => c.lum);
};

function fillRange(start: number, end: number) {
    return Array(end - start)
        .fill(0, start, end)
        .map((_, index) => {
            return start + index;
        });
}

function round(x: number, n = 0) {
    const ten = 10 ** n;
    return Math.round(x * ten) / ten;
}

function findMatchingLuminosity(
    colorScale: any,
    colorLen: number,
    luminosities: number[],
    smooth: boolean
) {
    const colorSearch = (x: number) => {
        const first = smooth ? chroma(colorScale(0)).hsluv()[2] : colorScale(0).hsluv()[2];
        const last = smooth
            ? chroma(colorScale(colorLen)).hsluv()[2]
            : colorScale(colorLen).hsluv()[2];

        const dir = first < last ? 1 : -1;
        const ε = 0.01;
        x += 0.005 * Math.sign(x);
        let step = colorLen / 2;
        let dot = step;
        let val = smooth ? chroma(colorScale(dot)).hsluv()[2] : colorScale(dot).hsluv()[2];
        let counter = 100;
        while (Math.abs(val - x) > ε && counter) {
            counter--;
            step /= 2;
            if (val < x) {
                dot += step * dir;
            } else {
                dot -= step * dir;
            }
            val = smooth ? chroma(colorScale(dot)).hsluv()[2] : colorScale(dot).hsluv()[2];
        }
        return round(dot, 3);
    };
    const outputColors = [] as any[];
    luminosities.forEach((lum) => {
        if (smooth) {
            let findColor = colorScale(colorSearch(+lum));
            outputColors.push(chroma(findColor).hex());
        } else {
            outputColors.push(colorScale(colorSearch(+lum)).hex());
        }
    });

    return outputColors;
}
