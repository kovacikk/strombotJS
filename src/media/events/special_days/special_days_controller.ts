import {
  getSpecialDates,
  insertItems,
  deleteItemsByField,
} from "../../../data/data_controller";
import { SpecialDate } from "../../../data/entities/SpecialDate";
import { getFileNames } from "../../media_controller";

const SPECIAL_DAYS_PATH = "/app/media/events/special_days/";

// Compares files and database to insert new cats and delete old ones
export async function sync(): Promise<void> {
  const databaseCats = await getSpecialDates();

  const specialDateMap: Record<string, SpecialDate> = {};
  for (const specialDate of databaseCats) {
    specialDateMap[specialDate.name] = specialDate;
  }
  const databaseCatNames = (await getSpecialDates()).map(
    (specialDate) => specialDate.name,
  );

  const fileSpecialDates = getFileNames(SPECIAL_DAYS_PATH);

  const newFiles = fileSpecialDates.filter(
    (specialDate) => !databaseCatNames.includes(specialDate),
  );
  const deletedFiles = databaseCatNames.filter(
    (specialDate) => !fileSpecialDates.includes(specialDate),
  );

  if (newFiles.length > 0) {
    await insertItems(
      SpecialDate,
      newFiles.map((file) =>
        Object.assign(new SpecialDate(), {
          name: file,
          path: `${SPECIAL_DAYS_PATH}${file}`,
          month: 1,
          day: 1,
        }),
      ),
    );
    console.log(`${newFiles.length} new special dates inserted`);
  }

  if (deletedFiles.length > 0) {
    await deleteItemsByField(SpecialDate, deletedFiles, "name");
    console.log(`${deletedFiles.length} old special dates deleted`);
  }
}
