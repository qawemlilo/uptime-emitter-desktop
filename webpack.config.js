"use strict";

const GoogleFontsPlugin = require("google-fonts-webpack-plugin");

module.exports = {
    /* ... */
    plugins: [
        new GoogleFontsPlugin({
            fonts: [
                { family: "Source Sans Pro" },
                { family: "Roboto", variants: [ "400", "700italic" ] }
            ]
            /* ...options */
        })
    ]
}
