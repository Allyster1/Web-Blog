import crypto from "crypto";
console.log("Generated JWT Secret:");
console.log(crypto.randomBytes(64).toString("hex"));
