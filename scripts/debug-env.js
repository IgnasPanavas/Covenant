require('dotenv').config();

console.log("🔍 Debugging environment variables...");
console.log("PRIVATE_KEY exists:", !!process.env.PRIVATE_KEY);
console.log("PRIVATE_KEY length:", process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.length : 0);
console.log("PRIVATE_KEY starts with 0x:", process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.startsWith('0x') : false);

if (process.env.PRIVATE_KEY) {
  console.log("PRIVATE_KEY (first 10 chars):", process.env.PRIVATE_KEY.substring(0, 10) + "...");
} else {
  console.log("❌ PRIVATE_KEY not found in environment variables");
}
