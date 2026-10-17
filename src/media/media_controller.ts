import * as fs from 'fs';

export type DriveResults = {
    name: string;
    duplicates: string[],
    new: string[]
}

export function getFileNames(path: string): string[] {
    return fs.readdirSync(path, { withFileTypes: true })
        .filter(file => file.isFile())
        .map(file => file.name);
}

export function deleteFiles(paths: string[]): Number {
    let deleted = 0;
    for (const path of paths) {
        try {
            if (fs.existsSync(path)) {
                fs.rmSync(path);
                deleted++;
            } else {
                console.log(`${path} not found`);
            }
        } catch (error) {
            throw new Error(`Failed to delete ${path}`);
        }
    }
    return deleted;
}