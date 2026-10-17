import { getMemes, insertMemes, deleteMemes } from '../../data/data_controller';
import { Meme } from '../../data/entities/Meme';
import { getFileNames } from '../media_controller';
import { listFiles, downloadAndEvictFiles } from "../../drive/drive_controller.js";
import { getMemesByName } from '../../data/data_controller.js';
import { DriveResults } from '../media_controller';
import { DriveEmbedManager, driveItem, driveState } from '../../drive/drive_embed';


const MEME_PATH = '/app/media/memes/';
const MEME_DRIVE_FOLDER_ID = '1wd_KRGLDe7N3taKclTwUERDZrpOCSWOo';

// Compares files and database to insert new memes and delete old ones
export async function sync(): Promise<void> {
    const databaseMemes = await getMemes();

    const memeMap: Record<string, Meme> = {};
    for (const meme of databaseMemes) {
        memeMap[meme.name] = meme;
    }
    const databaseMemeNames = (await getMemes()).map(meme => meme.name);

    const fileMemes = getFileNames(MEME_PATH);

    const newFiles = fileMemes.filter(meme => !databaseMemeNames.includes(meme));
    const deletedFiles = databaseMemeNames.filter(meme => !fileMemes.includes(meme));


    if (newFiles.length > 0) {
        await insertMemes(newFiles.map(file => Object.assign(new Meme(), {
            name: file,
            path: `${MEME_PATH}${file}`,
        })));
        console.log(`${newFiles.length} new memes inserted`);
    }

    if (deletedFiles.length > 0) {
        await deleteMemes(deletedFiles);
        console.log(`${deletedFiles.length} old memes deleted`);
    }
}

export async function checkDrive(driveEmbed: DriveEmbedManager): Promise<DriveResults> {
    // Get New Files in Google Drive
    const files = await listFiles(MEME_DRIVE_FOLDER_ID);

    // Find any google drive files with the same name in the database
    const fileNames: string[] = files.map(file => file.name);
    const existingMemes = await getMemesByName(fileNames);
    const existingSet = new Set;
    for (const existing of existingMemes) {
        existingSet.add(existing.name);
    }
    console.log(`${existingMemes.length} duplicate name(s) found`);
 
    // Filter out those matches
    const newFiles = files.filter(file => file?.name && !existingSet.has(file?.name));

    let driveItem: driveItem = {
        name: 'Meme',
        downloading: newFiles.length,
        downloaded: 0,
        duplicates: existingMemes.length
    }
    driveEmbed.setState(driveState.Downloading).setCurrentItem(driveItem);

    // Download new and delete drive files
    await downloadAndEvictFiles(newFiles, '/app/media/memes/', driveEmbed);
    console.log(`${newFiles.length} new file(s) downloaded`);

    await sync();

    driveEmbed.completeCurrentItem();
    await driveEmbed.refresh();

    return {
        name: 'Memes', 
        duplicates: existingMemes.flatMap(meme => meme.name),
        new: newFiles.map(file => file.name)
    }
}