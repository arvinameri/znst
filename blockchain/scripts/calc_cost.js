const hre = require("hardhat");
const TronWeb = require("tronweb");

async function main() {
  console.log("📊 STARTING LOW-LEVEL COST CALCULATION (Shasta)...");

  // 1. تنظیمات شبکه شاستا
  const HttpProvider = TronWeb.providers.HttpProvider;
  const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
  const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
  const eventServer = new HttpProvider("https://api.shasta.trongrid.io");

  const privateKey = process.env.PRIVATE_KEY;
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

  const deployerAddr = tronWeb.address.fromPrivateKey(privateKey);
  console.log("👤 Deployer Address:", deployerAddr);

  // نرخ‌های شبکه اصلی (برای محاسبه نهایی)
  const ENERGY_PRICE = 420;
  const BANDWIDTH_PRICE = 1000;

  // کامپایل
  console.log("\n🔨 Compiling contracts...");
  await hre.run("compile");

  try {
    console.log("1️⃣ Building Transaction for Implementation...");
    const ZNSaleArtifact = await hre.artifacts.readArtifact(
      "ZNSale_Upgradable"
    );

    // --- گام ۱: ساخت دستی تراکنش (Create) ---
    // این تابع تراکنش خام را می‌سازد اما ارسال نمی‌کند
    const transaction = await tronWeb.transactionBuilder.createSmartContract(
      {
        abi: ZNSaleArtifact.abi,
        bytecode: ZNSaleArtifact.bytecode,
        feeLimit: 1000000000, // 1000 TRX Limit
        callValue: 0,
        userFeePercentage: 100,
        originEnergyLimit: 10000000,
      },
      deployerAddr
    );

    console.log("   ✅ Transaction Built.");

    // --- گام ۲: امضای تراکنش (Sign) ---
    const signedTransaction = await tronWeb.trx.sign(transaction, privateKey);
    console.log("   ✅ Transaction Signed.");

    // --- گام ۳: ارسال به شبکه (Broadcast) ---
    const broadcast = await tronWeb.trx.sendRawTransaction(signedTransaction);

    if (!broadcast.result) {
      throw new Error("Broadcast Failed: " + JSON.stringify(broadcast));
    }

    const txId = broadcast.transaction.txID;
    console.log(`   🚀 Broadcasted! TXID: ${txId}`);
    console.log("   ⏳ Waiting for confirmation (this may take 10-20s)...");

    // --- گام ۴: انتظار برای نشستن روی بلاکچین ---
    let receipt = null;
    let retries = 0;
    while (!receipt && retries < 20) {
      await new Promise((r) => setTimeout(r, 3000));
      process.stdout.write("."); // لودینگ
      retries++;
      try {
        const info = await tronWeb.trx.getTransactionInfo(txId);
        if (info && Object.keys(info).length > 0) {
          receipt = info;
        }
      } catch (e) {}
    }
    console.log(""); // خط جدید

    if (!receipt) {
      console.log("\n⚠️ Transaction sent but receipt not found yet.");
      console.log(
        `👉 Please check manually on Shasta Scan: https://shasta.tronscan.org/#/transaction/${txId}`
      );
      return;
    }

    // --- گام ۵: محاسبه هزینه ---
    if (receipt.receipt.result !== "SUCCESS") {
      console.error(
        "❌ Transaction Reverted on Chain:",
        receipt.receipt.result
      );
      return;
    }

    const energyUsed = receipt.receipt.energy_usage_total || 0;
    const netUsed = receipt.receipt.net_usage || 0; // پهنای باند

    // محاسبه هزینه به قیمت Mainnet
    const energyCostSun = energyUsed * ENERGY_PRICE;
    const netCostSun = netUsed * BANDWIDTH_PRICE;
    const totalCostSun = energyCostSun + netCostSun;

    console.log(`   ✅ DEPLOYMENT SUCCESSFUL!`);
    console.log(`   - Energy Consumed: ${energyUsed.toLocaleString()}`);
    console.log(`   - Bandwidth Consumed: ${netUsed.toLocaleString()}`);

    const finalTrx = tronWeb.fromSun(totalCostSun);

    console.log("\n=======================================================");
    console.log("💰 REAL-WORLD COST ESTIMATION (MAINNET):");
    console.log("=======================================================");
    console.log(`🔥 Actual Cost (Implementation): ~${Math.ceil(finalTrx)} TRX`);
    // هزینه پراکسی معمولاً حدود ۱۰-۱۵ درصد قرارداد اصلی است، ما ۲۰ درصد اضافه می‌کنیم برای کل پروژه
    console.log(`➕ Proxy Estimate (~20%): ~${Math.ceil(finalTrx * 0.2)} TRX`);
    console.log("-------------------------------------------------------");
    console.log(
      `💵 TOTAL PROJECT BUDGET NEEDED: ~${Math.ceil(finalTrx * 1.2)} TRX`
    );
    console.log("=======================================================\n");
  } catch (error) {
    console.error("\n❌ FATAL ERROR:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
