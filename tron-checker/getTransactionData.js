import { TronWeb } from "tronweb";

// آدرس یک نود عمومی TRON Mainnet
const TRONGRID_API = "https://api.trongrid.io";

const tronWeb = new TronWeb({
  fullHost: TRONGRID_API,
});

// هش تراکنش ساخت قرارداد شما
const TX_ID =
  "0dfa6b87044460c8f8d6390aba03f68dc449cd3c33dff497ca1f96ca9f10f2bb";

async function getContractCreationData() {
  try {
    console.log(`Fetching transaction info for: ${TX_ID}`);

    const txInfo = await tronWeb.trx.getTransaction(TX_ID);

    if (
      !txInfo ||
      !txInfo.raw_data ||
      !txInfo.raw_data.contract ||
      txInfo.raw_data.contract.length === 0
    ) {
      console.error(
        "Error: Transaction data is invalid or not a contract creation transaction."
      );
      return;
    }

    const inputData = txInfo.raw_data.contract[0].parameter.value.data;

    console.log("\n--------------------------------------------------");
    console.log(
      "✅ Full Input Data (Creation Bytecode + Constructor Arguments):"
    );
    console.log(inputData);
    console.log("--------------------------------------------------\n");

    const abiEncodedArgs = inputData.slice(-64);

    console.log(
      "✅ Extracted ABI-Encoded Constructor Argument (last 64 chars):"
    );
    console.log(abiEncodedArgs);
    console.log("\nThis is the value you should use for verification.");

    const decodedAddressHex = "41" + abiEncodedArgs.slice(24);
    const decodedAddressBase58 = tronWeb.address.fromHex(decodedAddressHex);

    console.log("✅ Decoded Owner Address (TRON Base58 Format):");
    console.log(decodedAddressBase58);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

getContractCreationData();
