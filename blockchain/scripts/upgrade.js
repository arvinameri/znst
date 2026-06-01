const TronWeb = require("tronweb");
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Starting Upgrade script for ZNSale...");

  // 1. تنظیمات شبکه
  const privateKey = process.env.PRIVATE_KEY;
  const tronWeb = new TronWeb({
    fullHost: "https://api.trongrid.io",
    privateKey: privateKey,
  });

  // آدرس پروکسی فعلی (همان که در فایل env دارید)
  const PROXY_ADDRESS = "TPrSWcCjf89WRqo5tdpYYBG1f6R8U6RMau";

  console.log(`Upgrading Proxy at: ${PROXY_ADDRESS}`);

  // 2. کامپایل کردن قرارداد جدید (نسخه اصلاح شده)
  await hre.run("compile");

  // 3. دیپلوی کردن Implementation جدید (نسخه باگ‌گیری شده)
  const ZNSaleImplArtifact = await hre.artifacts.readArtifact(
    "ZNSale_Upgradable"
  );
  console.log("Deploying NEW Implementation...");

  const newImplFactory = await tronWeb.contract().new({
    abi: ZNSaleImplArtifact.abi,
    bytecode: ZNSaleImplArtifact.bytecode,
    feeLimit: 15e9,
  });

  const newImplementationAddress = tronWeb.address.fromHex(
    newImplFactory.address
  );
  console.log(`✅ NEW Implementation deployed to: ${newImplementationAddress}`);

  // 4. دستور آپگرید به پروکسی
  // ما باید تابع upgradeTo را روی پروکسی صدا بزنیم و آدرس ایمپلیمنتیشن جدید را بدهیم
  console.log("Pointing Proxy to new Implementation...");

  // نکته مهم: برای صدا زدن توابع مدیریتی UUPS، باید با ABI قرارداد ایمپلیمنتیشن به آدرس پروکسی وصل شویم
  const proxyContract = await tronWeb.contract(
    ZNSaleImplArtifact.abi,
    PROXY_ADDRESS
  );

  try {
    const tx = await proxyContract.upgradeTo(newImplementationAddress).send({
      feeLimit: 100_000_000, // حدود 100 TRX
    });
    console.log(`✅ Upgrade Successful! TX ID: ${tx}`);
    console.log("Your contract logic is now fixed. No address change needed.");
  } catch (error) {
    console.error("Upgrade Failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
