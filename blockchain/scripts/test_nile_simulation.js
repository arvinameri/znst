const TronWeb = require("tronweb");
const hre = require("hardhat");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

// --- تابع محاسبه‌گر هزینه (سِمِج و دقیق) ---
async function printRealCost(tronWeb, txId, label) {
  console.log(`\n📊 Calculating Cost for: ${label}...`);
  process.stdout.write("   Waiting for network receipt");

  let info = null;
  let attempts = 0;
  // 60 بار تلاش (2 دقیقه صبر) تا مطمئن شویم شبکه فاکتور را صادر کرده
  const maxAttempts = 60;

  while (attempts < maxAttempts) {
    try {
      info = await tronWeb.trx.getTransactionInfo(txId);
      // شرط: رسید وجود داشته باشد و انرژی مصرفی ثبت شده باشد
      if (
        info &&
        info.receipt &&
        typeof info.receipt.energy_usage_total !== "undefined"
      ) {
        console.log(" ✅ Receipt Found!");
        break;
      }
    } catch (e) {}
    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, 2000));
    attempts++;
  }

  if (!info || !info.receipt) {
    console.log("\n   ⚠️ Time out! Network is too slow to give receipt.");
    return 0;
  }

  const energyUsed = info.receipt.energy_usage_total || 0;
  const netUsed = info.receipt.net_usage || 0;

  // قیمت دقیق شبکه اصلی (Mainnet)
  const ENERGY_PRICE = 420; // 420 Sun
  const NET_PRICE = 1000;

  const energyCostTrx = (energyUsed * ENERGY_PRICE) / 1_000_000;
  const netCostTrx = (netUsed * NET_PRICE) / 1_000_000;
  const totalTrx = energyCostTrx + netCostTrx;

  console.log(`\n   ------------------------------------------`);
  console.log(`   📄 Transaction: ${txId}`);
  console.log(`   🔥 Energy Used:    ${energyUsed.toLocaleString()} Units`);
  console.log(`   💰 Cost:           ${totalTrx.toFixed(2)} TRX`);
  console.log(`   ------------------------------------------`);

  return totalTrx;
}

async function main() {
  console.log("🧪 STARTING PRECISION COST TEST...");

  const privateKey = process.env.PRIVATE_KEY;
  const tronWeb = new TronWeb({
    fullHost: "https://nile.trongrid.io",
    privateKey: privateKey,
  });
  const deployerAddress = tronWeb.defaultAddress.base58;
  console.log(`👤 Actor: ${deployerAddress}`);

  await hre.run("compile");

  // --- 1. Setup (Fast & Silent) ---
  console.log(
    "\n[Step 1] Setting up environment (ignoring costs for setup)..."
  );
  const ZNSTTokenArtifact = await hre.artifacts.readArtifact("ZNSTToken");
  const tokenFactory = await tronWeb.contract().new({
    abi: ZNSTTokenArtifact.abi,
    bytecode: ZNSTTokenArtifact.bytecode,
    feeLimit: 15e9,
    parameters: [deployerAddress],
  });

  const ZNSaleImplArtifact = await hre.artifacts.readArtifact(
    "ZNSale_Upgradable"
  );
  const implFactory = await tronWeb.contract().new({
    abi: ZNSaleImplArtifact.abi,
    bytecode: ZNSaleImplArtifact.bytecode,
    feeLimit: 15e9,
  });

  const proxyArtifactPath = path.join(
    __dirname,
    "../node_modules/@openzeppelin/contracts/build/contracts/ERC1967Proxy.json"
  );
  const ProxyArtifact = JSON.parse(fs.readFileSync(proxyArtifactPath, "utf8"));

  let iface;
  if (hre.ethers.Interface) {
    iface = new hre.ethers.Interface(ZNSaleImplArtifact.abi);
  } else {
    iface = new hre.ethers.utils.Interface(ZNSaleImplArtifact.abi);
  }

  const dummyUsdtAddress =
    "0x" + tronWeb.address.toHex(tokenFactory.address).substring(2);
  const znstAddressHex =
    "0x" + tronWeb.address.toHex(tokenFactory.address).substring(2);
  const initData = iface.encodeFunctionData("initialize", [
    dummyUsdtAddress,
    znstAddressHex,
  ]);

  const proxyFactory = await tronWeb.contract().new({
    abi: ProxyArtifact.abi,
    bytecode: ProxyArtifact.bytecode,
    feeLimit: 15e9,
    parameters: [tronWeb.address.toHex(implFactory.address), initData],
  });
  const proxyAddress = tronWeb.address.fromHex(proxyFactory.address);
  console.log(`✅ Environment Ready.`);

  // --- 2. THE REAL UPGRADE (Measuring Costs) ---
  console.log("\n====================================================");
  console.log("🚀 STARTING UPGRADE & CALCULATING BILL");
  console.log("====================================================");

  let totalEstimatedCost = 0;

  // A) Deploy NEW Implementation (The Heavy Cost)
  console.log("\n[Action A] Deploying NEW Implementation (The Fix)...");
  const newImplFactory = await tronWeb.contract().new({
    abi: ZNSaleImplArtifact.abi,
    bytecode: ZNSaleImplArtifact.bytecode,
    feeLimit: 15e9,
  });

  // --- اینجا صبر می‌کنیم تا فاکتور صادر شود ---
  if (newImplFactory.transaction && newImplFactory.transaction.txID) {
    totalEstimatedCost += await printRealCost(
      tronWeb,
      newImplFactory.transaction.txID,
      "Deploying Implementation"
    );
  } else {
    console.warn("Could not get TX ID for deployment!");
  }

  // B) Upgrade Command (The Light Cost)
  console.log("\n[Action B] Sending Upgrade Command...");
  const proxyContract = await tronWeb.contract(
    ZNSaleImplArtifact.abi,
    proxyAddress
  );

  try {
    const tx = await proxyContract
      .upgradeTo(tronWeb.address.toHex(newImplFactory.address))
      .send({
        feeLimit: 100000000,
      });

    totalEstimatedCost += await printRealCost(tronWeb, tx, "Upgrade Call");

    console.log("\n====================================================");
    console.log("🧾 FINAL INVOICE (MAINNET ESTIMATE):");
    console.log(`💰 TOTAL REQUIRED: ${totalEstimatedCost.toFixed(2)} TRX`);
    console.log(`🛡️ SAFE DEPOSIT:   ${Math.ceil(totalEstimatedCost + 50)} TRX`); // 50 تا اضافه برای اطمینان
    console.log("====================================================");
  } catch (error) {
    console.error("\n❌ UPGRADE FAILED:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
