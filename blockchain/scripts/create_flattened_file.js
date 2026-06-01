const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("در حال ساخت فایل نهایی با فرمت صحیح UTF-8 برای تایید...");

  // دریافت کد کامل و یکپارچه شده به صورت یک رشته متنی
  const flattenedCode = await hre.run("flatten:get-flattened-sources", {
    files: ["contracts/ZNSTToken.sol"],
  });

  // تعریف مسیر فایل خروجی در ریشه پروژه
  const outputPath = path.join(
    __dirname,
    "..",
    "ZNSTToken_for_verification.sol"
  );

  // نوشتن فایل با فرمت قطعی UTF-8
  fs.writeFileSync(outputPath, flattenedCode, { encoding: "utf8" });

  console.log(`✅ عملیات موفقیت آمیز بود!`);
  console.log(`فایل در مسیر زیر ساخته شد: ${outputPath}`);
  console.log("این فایل اکنون برای آپلود در سایت TronScan آماده است.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
