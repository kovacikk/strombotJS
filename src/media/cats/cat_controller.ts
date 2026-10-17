import { getCats, insertCats, deleteCats } from '../../data/data_controller';
import { Cat } from '../../data/entities/Cat';
import { getFileNames } from '../media_controller';
import { listFiles, downloadAndEvictFiles } from "../../drive/drive_controller.js";
import { getCatsByName } from '../../data/data_controller.js';
import { DriveResults } from '../media_controller';
import { DriveEmbedManager, driveItem, driveState } from '../../drive/drive_embed';


const CAT_PATH = '/app/media/cats/';
const CAT_DRIVE_FOLDER_ID = '1RyGoPvqWRH9m4xQN02GVvBkez6CHmk7t';

// Compares files and database to insert new cats and delete old ones
export async function sync(): Promise<void> {
    const databaseCats = await getCats();

    const catMap: Record<string, Cat> = {};
    for (const cat of databaseCats) {
        catMap[cat.name] = cat;
    }
    const databaseCatNames = (await getCats()).map(cat => cat.name);

    const fileCats = getFileNames(CAT_PATH);

    const newFiles = fileCats.filter(cat => !databaseCatNames.includes(cat));
    const deletedFiles = databaseCatNames.filter(cat => !fileCats.includes(cat));


    if (newFiles.length > 0) {
        await insertCats(newFiles.map(file => Object.assign(new Cat(), {
            name: file,
            path: `${CAT_PATH}${file}`,
        })));
        console.log(`${newFiles.length} new cats inserted`);
    }

    if (deletedFiles.length > 0) {
        await deleteCats(deletedFiles);
        console.log(`${deletedFiles.length} old cats deleted`);
    }
}

export async function checkDrive(driveEmbed: DriveEmbedManager): Promise<DriveResults> {
    // Get New Files in Google Drive
    const files = await listFiles(CAT_DRIVE_FOLDER_ID);

    // Find any google drive files with the same name in the database
    const fileNames: string[] = files.map(file => file.name);
    const existingCats = await getCatsByName(fileNames);
    const existingSet = new Set;
    for (const existing of existingCats) {
        existingSet.add(existing.name);
    }
    console.log(`${existingCats.length} duplicate name(s) found`);
 
    // Filter out those matches
    const newFiles = files.filter(file => file?.name && !existingSet.has(file?.name));

    let driveItem: driveItem = {
        name: 'Cat',
        downloading: newFiles.length,
        downloaded: 0,
        duplicates: existingCats.length
    }
    driveEmbed.setState(driveState.Downloading).setCurrentItem(driveItem);

    // Download new and delete drive files
    await downloadAndEvictFiles(newFiles, '/app/media/cats/', driveEmbed);
    console.log(`${newFiles.length} new file(s) downloaded`);

    await sync();

    driveEmbed.completeCurrentItem();
    await driveEmbed.refresh();

    return {
        name: 'Cats', 
        duplicates: existingCats.flatMap(cat => cat.name),
        new: newFiles.map(file => file.name)
    }
}