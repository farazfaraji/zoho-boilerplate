const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require('path');

function getDirectories(srcPath) {
    return fs.readdirSync(srcPath)
        .map(file => path.join(srcPath, file))
        .filter(path => fs.statSync(path).isDirectory());
}

const dirs = getDirectories(__dirname);
for(let i = 0;i<dirs.length;i++){
    fs.readdirSync(dirs[i]).forEach(file => {
        const route = require(dirs[i]+"/"+file);
        route.load(router);
    });
}



module.exports = router;
