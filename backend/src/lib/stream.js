import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("❌ STREAM_API_KEY or STREAM_API_SECRET is missing");
}

// Chat client
export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

// Video client
export const streamClient = new StreamClient(apiKey, apiSecret);

// Create / update user
export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUsers([userData]);
    console.log("✅ Stream user upserted:", userData.id);
  } catch (error) {
    console.error("❌ Error upserting Stream user:", error);
  }
};

// Delete user
export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUsers([userId]);
    console.log("✅ Stream user deleted:", userId);
  } catch (error) {
    console.error("❌ Error deleting Stream user:", error);
  }
};