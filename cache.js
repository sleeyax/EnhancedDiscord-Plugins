const Plugin = require('../plugin');
const { join } = require('path');
const { shell } = require('electron');
const cacheLocation = join(process.env.APPDATA, 'discord', 'cache');
const fs = require('fs');

function clearCache() {
    document.getElementById('cachePluginStatus').innerText = "Clearing cache...";
    deleteFolderRecursive(cacheLocation);
    document.getElementById('cachePluginStatus').innerText = "Cache cleared!";
}
function openCache() {
    shell.openItem(cacheLocation);
}
function recoverCache() {
    document.getElementById('cachePluginStatus').innerText = "Recovering cache...";
    recoverFolderRecursive(cacheLocation);
    document.getElementById('cachePluginStatus').innerText = "Cache recovered!";
}

function deleteFolderRecursive(path) {
    iterateFolderRecursive(path, 'delete');
};

function recoverFolderRecursive(path) {
    iterateFolderRecursive(path, 'recover');
}

function iterateFolderRecursive(path, action) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            if (!file.match(/data/) && !file.match(/index/)) {
                let curPath = join(path, file);
                fs.lstatSync(curPath).isDirectory() ? iterateFolderRecursive(curPath, action) : action == "delete" ?  fs.unlinkSync(curPath) : fs.copyFileSync(curPath, curPath + '.png');
            }
        });
    }
};

module.exports = new Plugin({
    name: 'Cache',
    author: 'Sleeyax',
    description: 'Adds an option to delete, restore and browse local cache',
    color: '#000000',
    load: function () {},
    unload: function () {},
    config: {},
    generateSettings: function () {
        const b = window.ED.classMaps.buttons;
        const a = window.ED.classMaps.alignment;
        const fc = findModule('flexChild');
        const l = window.ED.classMaps.labels = findModule('labelText');
        const d = window.ED.classMaps.description;

        let result = `<div id="cachePluginStatus" class="${d.description} ${d.modeDefault}"></div><div class="${a.horizontal} ${a.alignCenter} ${a.noWrap} ${l.item}><div class="${fc.horizontal} ${a.justifyStart} ${a.alignStretch} ${a.noWrap} ${l.label}" style="flex: 0 1 auto;">`;
        result += `<button id="cachePlugin-clear" class="${b.button} ${b.lookFilled} ${b.sizeSmall} ${b.grow} ${b.colorRed}" style="margin-right: 10px;">Clear cache</button>`;
        result += `<button id="cachePlugin-open" class="${b.button} ${b.lookFilled} ${b.sizeSmall} ${b.grow} ${b.colorGreen}" style="margin-right: 10px;">Open cache folder</button>`;
        result += `<button id="cachePlugin-recover" class="${b.button} ${b.lookFilled} ${b.sizeSmall} ${b.grow} ${b.colorYellow}" style="margin-right: 10px;">Recover images from cache</button>`;
        result += '</div></div></div>';

        return result;
    },
    settingListeners: [
        { el: '#cachePlugin-clear', type: "click", eHandler: clearCache },
        { el: '#cachePlugin-open', type: "click", eHandler: openCache },
        { el: '#cachePlugin-recover', type: "click", eHandler: recoverCache },
    ]
});
