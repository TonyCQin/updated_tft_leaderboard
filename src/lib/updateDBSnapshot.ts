import "dotenv/config";
import clientPromise from "../lib/mongodb";

export const updateDatabaseSnapshotPoints = async (
  username: string,
  newSnapshotPoints: number
) => {
  const client = await clientPromise;
  const db = client.db("userdata");
  const collection = db.collection("info");

  try {
    const filter = { username: username };
    const update = { $set: { snapshotPoints: newSnapshotPoints } };
    const result = await collection.updateOne(filter, update);

    const updatedInfo = await collection.find({}).toArray();

    console.log("updating snapshot points");

    return {
      info: {
        userinfo: JSON.stringify(updatedInfo),
      },
    };
  } catch (error) {
    console.log("Error updating data:", error);
    throw error;
  }
};
