import "reflect-metadata";
import * as dotenv from "dotenv";

import { getDrive, getFolderIdByName } from "../src/drive/drive_controller";

dotenv.config();

const CREDENTIALS_PATH = "./service_account_credentials.json";
const PERSONAL_EMAIL = process.env.PERSONAL_EMAIL ?? "";

(async () => {
  const drive = getDrive(CREDENTIALS_PATH);

  // Create/Find parent folder
  let existingParent = await getFolderIdByName("Strombot Files");
  let parentId: string;
  if (existingParent) {
    parentId = existingParent;
  } else {
    const response = await drive.files.create({
      requestBody: {
        name: "Strombot Files",
        mimeType: "application/vnd.google-apps.folder",
      },
      fields: "id",
    });

    parentId = response.data.id ?? "";
  }
  console.log(`Parent folder found: ${parentId}`);

  if (parentId) {
    if (!existingParent) {
      // Share with personal account
      await drive.permissions.create({
        fileId: parentId,
        requestBody: {
          role: "writer",
          type: "user",
          emailAddress: PERSONAL_EMAIL,
        },
      });
    }

    let dayMemeId = "";

    // Create child folders
    for (const folder of ["Bulborbs", "Memes", "Cats", "Weevils", "DayMemes"]) {
      let existingFolder = await getFolderIdByName(folder, parentId);
      let folderId: string;

      if (existingFolder) {
        folderId = existingFolder;
      } else {
        const response = await drive.files.create({
          requestBody: {
            name: folder,
            mimeType: "application/vnd.google-apps.folder",
            parents: [parentId],
          },
          fields: "id",
        });
        folderId = response.data.id ?? "";
      }
      if (folder == "DayMemes") {
        dayMemeId = folderId;
      }

      console.log(`Sub folder ${folder} found: ${folderId}`);
    }

    if (dayMemeId) {
      // Create child folders of DayMemes
      for (const folder of [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]) {
        let existingFolder = await getFolderIdByName(folder, dayMemeId);
        let folderId: string;

        if (existingFolder) {
          folderId = existingFolder;
        } else {
          const response = await drive.files.create({
            requestBody: {
              name: folder,
              mimeType: "application/vnd.google-apps.folder",
              parents: [dayMemeId],
            },
            fields: "id",
          });
          folderId = response.data.id ?? "";
        }

        console.log(`Sub folder ${folder} found: ${folderId}`);
      }
    }
  }
})();
