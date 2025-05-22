import "dotenv/config";
import clientPromise from "../lib/mongodb";

const deleteDatabase = async () => {
  const client = await clientPromise;
  const db = client.db("userdata");
  const collection = db.collection("info");

  try {
    const result = await collection.deleteMany({});
    console.log(`Deleted ${result.deletedCount} documents.`);
  } catch (error) {
    console.error("Error deleting data:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
};

deleteDatabase();
