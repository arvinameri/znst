require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // تنظیمات شبکه نایل (Nile Testnet)
    nile: {
      url: "https://nile.trongrid.io/jsonrpc",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 3448148188, // ✅ شناسه صحیح که از ارور گرفتیم
      gasPrice: 420000000000,
    },
    // تنظیمات شبکه اصلی (Mainnet)
    tron: {
      url: "https://api.trongrid.io/jsonrpc",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 728126428,
    },
  },
};
