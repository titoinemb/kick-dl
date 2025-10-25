import { exec } from 'child_process';
import { mkdirSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

export default async ({ url, name }: { url: string; name: string }): Promise<string> => {
  if (!url || url.trim() === "") return "invalid url";

  let destinationDir: string = join(process.env.HOME || '', 'Videos', 'kick-dl');
  mkdirSync(destinationDir, { recursive: true });

  let output: string = join(destinationDir, `${name}.mp4`);

  if (existsSync(output)) {
    unlinkSync(output);
  };

  let command: string = `ffmpeg -i "${url}" -c copy -bsf:a aac_adtstoasc "${output}"`;

  return new Promise((resolve, reject) => {
    let process = exec(command);

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
      } else {
        resolve(`Téléchargement terminé : ${output}`);
      };
    });
  });
};