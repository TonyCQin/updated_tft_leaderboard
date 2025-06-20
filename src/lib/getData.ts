import clientPromise from "./mongodb";

type UserInfo = {
  username: string;
  tag: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  orderingScore: number;
};

export async function getData(): Promise<{ info: { userinfo: string } }> {
  try {
    const client = await clientPromise;
    const db = client.db("userdata");
    const collection = db.collection<UserInfo>("info");

    const info = await collection.find({}).toArray();

    console.log(info);

    return {
      info: {
        userinfo: JSON.stringify(info),
      },
    };
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    throw error;
  }
}
