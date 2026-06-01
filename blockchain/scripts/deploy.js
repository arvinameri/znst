const TronWeb = require("tronweb");
const hre = require("hardhat");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting FINAL deployment script for Mainnet...");

  // --- Step 1 & 2: Connect and Compile ---
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length !== 64) {
    throw new Error(
      "\n[ERROR] A valid 64-character PRIVATE_KEY is not set in the .env file."
    );
  }

  const tronWeb = new TronWeb({
    fullHost: "https://api.trongrid.io", // Correct URL for TRON Mainnet
    privateKey: privateKey,
  });
  const deployerAddress = tronWeb.defaultAddress.base58;
  console.log(`\nDeploying contracts with the account: ${deployerAddress}`);
  await hre.run("compile");
  console.log("\n✅ Local contracts compiled successfully.");

  const ZNSTTokenArtifact = await hre.artifacts.readArtifact("ZNSTToken");
  const ZNSaleImplArtifact = await hre.artifacts.readArtifact(
    "ZNSale_Upgradable"
  );

  // --- Step 3: Load the correct Proxy Artifact ---
  console.log("\nReading ERC1967Proxy artifact from node_modules...");
  const proxyArtifactPath = path.join(
    __dirname,
    "../node_modules/@openzeppelin/contracts/build/contracts/ERC1967Proxy.json"
  );
  const ProxyArtifact = JSON.parse(fs.readFileSync(proxyArtifactPath, "utf8"));
  console.log("✅ Correct UUPS-compatible Proxy artifact loaded.");

  // --- Step 4: Deploy ZNSTToken ---
  console.log("\nDeploying ZNSTToken...");
  const znstTokenFactory = await tronWeb.contract().new({
    abi: ZNSTTokenArtifact.abi,
    bytecode: ZNSTTokenArtifact.bytecode,
    feeLimit: 15e9,
    parameters: [deployerAddress],
  });
  const znstTokenAddress = tronWeb.address.fromHex(znstTokenFactory.address);
  console.log(`✅ ZNSTToken deployed successfully to: ${znstTokenAddress}`);

  // --- Step 5: Deploy the Implementation Contract ---
  console.log("\nDeploying ZNSale_Upgradable (Implementation)...");
  const znSaleImplFactory = await tronWeb.contract().new({
    abi: ZNSaleImplArtifact.abi,
    bytecode: ZNSaleImplArtifact.bytecode,
    feeLimit: 15e9,
  });
  const implementationAddress = tronWeb.address.fromHex(
    znSaleImplFactory.address
  );
  console.log(`✅ ZNSale Implementation deployed to: ${implementationAddress}`);

  // --- Step 6: Prepare Initialization Data ---
  console.log("\nConverting addresses to Ethereum-compatible HEX format...");
  // TRON hex starts with "41". We remove it with substring(2) and add "0x" for ethers.js
  const usdtAddress_Hex =
    "0x" +
    tronWeb.address.toHex("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t").substring(2);
  const znstTokenAddress_Hex =
    "0x" + tronWeb.address.toHex(znstTokenAddress).substring(2);
  console.log("✅ Addresses converted successfully.");

  console.log("\nPreparing initialization data for Proxy...");
  const iface = new hre.ethers.utils.Interface(ZNSaleImplArtifact.abi);
  const initializeData = iface.encodeFunctionData("initialize", [
    usdtAddress_Hex,
    znstTokenAddress_Hex,
  ]);
  console.log("✅ Initialization data created successfully.");

  // --- Step 7: Deploy the Proxy Contract ---
  console.log("\nDeploying ERC1967Proxy...");
  const proxyFactory = await tronWeb.contract().new({
    abi: ProxyArtifact.abi,
    bytecode: ProxyArtifact.bytecode,
    feeLimit: 15e9,
    parameters: [implementationAddress, initializeData],
  });
  const proxyAddress = tronWeb.address.fromHex(proxyFactory.address);
  console.log(`✅ ZNSale Upgradable (UUPS) Proxy deployed to: ${proxyAddress}`);

  // --- Final Success Message ---
  console.log(
    "\n\n🎉 MISSION ACCOMPLISHED! Deployment to MAINNET finished successfully! 🎉"
  );
  console.log(
    "================================================================================"
  );
  console.log("  ZNST Token Address (Mainnet):", znstTokenAddress);
  console.log(
    "  ZN Sale Address (Proxy - USE THIS ONE FOR YOUR DAPP!):",
    proxyAddress
  );
  console.log(
    "================================================================================"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n[FATAL ERROR] Deployment failed:");
    console.error(error);
    process.exit(1);
  });
