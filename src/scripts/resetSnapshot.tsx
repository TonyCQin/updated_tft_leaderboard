import { getData } from "@/lib/getData";
import { updateDatabaseSnapshotPoints } from "@/lib/updateDBSnapshot";

async function resetSnapshot(): Promise<void> {
  try {
    const { info } = await getData();
    const users = JSON.parse(info.userinfo);

    for (const user of users) {
      await updateDatabaseSnapshotPoints(user.username, 0);
    }

    console.log("The snapshotPoints were reset!");
  } catch (error) {
    console.error("Error resetting snapshot points:", error);
  }
}

resetSnapshot();
