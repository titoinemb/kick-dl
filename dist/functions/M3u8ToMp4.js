"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
exports.default = async ({ url, name }) => {
    if (!url || url.trim() === "")
        return "invalid url";
    let destinationDir = (0, path_1.join)(process.env.HOME || '', 'Videos', 'kick-dl');
    (0, fs_1.mkdirSync)(destinationDir, { recursive: true });
    let output = (0, path_1.join)(destinationDir, `${name}.mp4`);
    if ((0, fs_1.existsSync)(output)) {
        (0, fs_1.unlinkSync)(output);
    }
    ;
    let command = `ffmpeg -i "${url}" -c copy -bsf:a aac_adtstoasc "${output}"`;
    return new Promise((resolve, reject) => {
        let process = (0, child_process_1.exec)(command);
        process.stdout?.on('data', (data) => {
            console.log(data.toString());
        });
        process.stderr?.on('data', (data) => {
            console.error(data.toString());
        });
        process.on('error', (error) => {
            reject(`Erreur: ${error.message}`);
        });
        process.on('close', (code) => {
            if (code !== 0) {
                reject(`Processus terminé avec le code: ${code}`);
            }
            else {
                resolve(`Téléchargement terminé : ${output}`);
            }
            ;
        });
    });
};
