/* eslint-disable */
import React from 'react';
import { render as jsRender } from "../../main-process/CrosshairDrawing/generateSVG.js";
import SVG from 'react-inlinesvg';


export function render (crosshairDrawing) {
    // check if crosshairDrawing is valid as an object and not a string, if its a string parse the string into an object
    if (typeof crosshairDrawing === 'string') {
        crosshairDrawing = JSON.parse(crosshairDrawing);
    }

    // console.log("try", crosshairDrawing)
    const firstLine = generateViewBoxString(crosshairDrawing);
    // console.log("completed")
    const image = jsRender(crosshairDrawing);
    const adjustedString = firstLine + image.substring(image.indexOf('>')+1)
    console.log(adjustedString)
    return <SVG src={adjustedString} uniquifyIDs={true}/>
}

function generateViewBoxString(crosshairDrawing) {

    let adjustedThickness = crosshairDrawing.outline.thickness;

    if (adjustedThickness == 0) {
        adjustedThickness = 1;
    }
    
    const line = crosshairDrawing.line;
    const lineBound = (line.offset + line.length + adjustedThickness) 
    const dotBound = (Math.sqrt(crosshairDrawing.dot.diameter**2 + crosshairDrawing.dot.diameter**2)) / 2 + (Math.sqrt(adjustedThickness**2 +adjustedThickness**2));


    // const line = crosshairDrawing.line;

    // const lineBound = (line.offset + line.length + adjustedThickness);
    // const dotBound = crosshairDrawing.dot.diameter/2 + adjustedThickness ;



    let bound = 0;

    if(lineBound >= dotBound) {
        bound = lineBound;
    } else {
        bound = dotBound;
    }

    const x = -bound;
    const y = -bound;

    const width = bound * 2;
    const height = bound * 2;

    return `<svg width="${width > 40 ? 40 : width}" height="${height > 40 ? 40 : height}" viewBox="${x} ${y} ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">`
}
