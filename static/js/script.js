// --- ----------------------------------- ---
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. CONSTANTS FOR THE DAPP ---

  // These constants are used for interacting with TRON smart contracts.

  const SUNSWAP_ROUTER_ADDRESS = "TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax";

  const TOKEN_ADDRESSES = {
    TRX: "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR", // WTRX Address for pathing

    USDT: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",

    BTC: "TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9",

    ETH: "TXWkP3jLBqRGojUih1ShzNyDaN5Csnebok",

    DOGE: "THbVQp8kMjStKNnf2iCY6NEzThKMK5aBHg",

    LTC: "TR3DLthpnDdCGabhVDbD3VMsiJoCXY3bTT",
  };

  const TOKEN_DECIMALS = {
    TRX: 6,

    USDT: 6,

    BTC: 8,

    ETH: 18,

    DOGE: 8,

    LTC: 8,
  };

  // Minimal ABI (Application Binary Interface) for required functions

  const SUNSWAP_ROUTER_ABI = [
    {
      inputs: [
        { internalType: "uint256", name: "amountIn", type: "uint256" },

        { internalType: "uint256", name: "amountOutMin", type: "uint256" },

        { internalType: "address[]", name: "path", type: "address[]" },

        { internalType: "address", name: "to", type: "address" },

        { internalType: "uint256", name: "deadline", type: "uint256" },
      ],

      name: "swapExactTokensForTokens",

      outputs: [
        { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      ],

      stateMutability: "nonpayable",

      type: "function",
    },

    {
      inputs: [
        { internalType: "uint256", name: "amountOutMin", type: "uint256" },

        { internalType: "address[]", name: "path", type: "address[]" },

        { internalType: "address", name: "to", type: "address" },

        { internalType: "uint256", name: "deadline", type: "uint256" },
      ],

      name: "swapExactTRXForTokens",

      outputs: [
        { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      ],

      stateMutability: "payable",

      type: "function",
    },
  ];

  // کد ناقص قبلی را کاملاً پاک کرده و این کد کامل را جایگزین کنید

  // این کد را جایگزین TRC20_ABI فعلی خود کنید

  const TRC20_ABI = [
    {
      inputs: [
        { internalType: "string", name: "name", type: "string" },

        { internalType: "string", name: "symbol", type: "string" },
      ],

      stateMutability: "nonpayable",

      type: "constructor",
    },

    {
      anonymous: false,

      inputs: [
        {
          indexed: true,

          internalType: "address",

          name: "owner",

          type: "address",
        },

        {
          indexed: true,

          internalType: "address",

          name: "spender",

          type: "address",
        },

        {
          indexed: false,

          internalType: "uint256",

          name: "value",

          type: "uint256",
        },
      ],

      name: "Approval",

      type: "event",
    },

    {
      anonymous: false,

      inputs: [
        {
          indexed: true,

          internalType: "address",

          name: "from",

          type: "address",
        },

        { indexed: true, internalType: "address", name: "to", type: "address" },

        {
          indexed: false,

          internalType: "uint256",

          name: "value",

          type: "uint256",
        },
      ],

      name: "Transfer",

      type: "event",
    },

    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },

        { internalType: "address", name: "spender", type: "address" },
      ],

      name: "allowance",

      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],

      stateMutability: "view",

      type: "function",
    },

    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },

        { internalType: "uint256", name: "amount", type: "uint256" },
      ],

      name: "approve",

      outputs: [{ internalType: "bool", name: "", type: "bool" }],

      stateMutability: "nonpayable",

      type: "function",
    },

    {
      inputs: [{ internalType: "address", name: "account", type: "address" }],

      name: "balanceOf",

      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],

      stateMutability: "view",

      type: "function",
    },

    {
      inputs: [],

      name: "decimals",

      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],

      stateMutability: "view",

      type: "function",
    },

    {
      inputs: [],

      name: "name",

      outputs: [{ internalType: "string", name: "", type: "string" }],

      stateMutability: "view",

      type: "function",
    },

    {
      inputs: [],

      name: "symbol",

      outputs: [{ internalType: "string", name: "", type: "string" }],

      stateMutability: "view",

      type: "function",
    },

    {
      inputs: [],

      name: "totalSupply",

      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],

      stateMutability: "view",

      type: "function",
    },

    {
      inputs: [
        { internalType: "address", name: "recipient", type: "address" },

        { internalType: "uint256", name: "amount", type: "uint256" },
      ],

      name: "transfer",

      outputs: [{ internalType: "bool", name: "", type: "bool" }],

      stateMutability: "nonpayable",

      type: "function",
    },

    {
      inputs: [
        { internalType: "address", name: "sender", type: "address" },

        { internalType: "address", name: "recipient", type: "address" },

        { internalType: "uint256", name: "amount", type: "uint256" },
      ],

      name: "transferFrom",

      outputs: [{ internalType: "bool", name: "", type: "bool" }],

      stateMutability: "nonpayable",

      type: "function",
    },
  ];

  // --- 2. GLOBAL VARIABLES ---

  let currentLang = "fa";

  let historicalChartData = [];

  let debounceTimeout; // --- ⬇️ ⬇️ ⬇️ بخش جدید: راه‌اندازی WalletConnect Universal Provider ⬇️ ⬇️ ⬇️ ---

  let universalProvider = null; // ✅✅✅ این خط را اضافه کنید
  // آدرس کیف پول کاربر را اینجا ذخیره می‌کنیم

  const projectId = "e72bfc802d633f857c90d20381b4b6f7";
  // ...
  let userWalletAddress = null;
  let walletConnectModal = null; // ✅✅✅ به "let" و "null" تغییر کرد
  let androidTargetWallet = null; // 💡 متغیر جدید برای تشخیص انتخاب کاربر در اندروید
  let zndtCurrentPrice = 0;
  // ...

  // Project ID شما از WalletConnect Cloud // این تابع "موتور" WalletConnect را می‌سازد

  // این تابع "موتور" WalletConnect را می‌سازد
  // این تابع "موتور" WalletConnect را می‌سازد
  // --- تابع کامل و نهایی initializeProvider ---
  // داخل ایونت DOMContentLoaded هستیم...

  // ... (بخش 1: Constants و ABIها که بالا هستند و دست نمی‌زنیم) ...
  // ... (بخش 2: Global Variables مثل projectId و غیره) ...

  // ============================================================
  // 👇👇👇 اینجا کدهای جدیدی که دادم را می‌گذاری 👇👇👇
  // ============================================================

  // --- 1. تابع اصلی راه‌اندازی (نسخه هوشمند و بدون ارور) ---
  async function initializeProvider() {
    if (universalProvider) return true;
    console.log("🔄 Initializing WalletConnect...");
    try {
      const { default: UniversalProvider } = await import(
        "https://esm.sh/@walletconnect/universal-provider@2.10.2"
      );
      const { WalletConnectModal } = await import(
        "https://esm.sh/@walletconnect/modal@2.6.2"
      );

      if (!walletConnectModal) {
        walletConnectModal = new WalletConnectModal({
          projectId: projectId,
          chains: ["tron:0x2b6653dc"],
          themeVariables: { "--wcm-z-index": "10000" },
        });
      }

      universalProvider = await UniversalProvider.init({
        projectId: projectId,
        metadata: {
          name: "ZNST Presale",
          description: "Buy ZNST Token",
          url: "https://znst.com",
          icons: ["https://znst.com/icon.png"],
        },
      });

      setupProviderEvents();
      console.log("✅ UniversalProvider initialized successfully.");
      return true;
    } catch (e) {
      console.warn("⚠️ Silent Init Failed (Network issue?):", e);
      return false;
    }
  }

  // --- 2. تابع کمکی مدیریت ایونت‌ها ---
  // --- تابع کمکی مدیریت ایونت‌ها (نسخه کامل و نهایی) ---
  // --- تابع مدیریت ایونت‌های WalletConnect (نسخه کامل و بدون حذفیات) ---
  function setupProviderEvents() {
    if (!universalProvider) return;

    // 1. ایونت تولید لینک اتصال (QR Code / Deep Link)
    universalProvider.on("display_uri", async (uri) => {
      console.log(
        `WalletConnect Event: display_uri (Target: ${androidTargetWallet})`,
        uri
      );

      // تشخیص اینکه آیا روی آیفون (React Native) هستیم؟
      const isIOSApp = navigator.userAgent.includes("ZNST_IOS_APP");

      if (androidTargetWallet === "tokenpocket") {
        // --- منطق اختصاصی اندروید (WebView Kotlin) ---
        console.log("🚀 Android Logic: Direct Jump to TokenPocket...");
        window.location.href = `tpoutside://wc?uri=${encodeURIComponent(uri)}`;

        // باز کردن مودال به عنوان بک‌آپ در صورت عدم پرش (تایمر امنیتی)
        setTimeout(() => {
          if (document.hidden) return;
          if (walletConnectModal) walletConnectModal.openModal({ uri });
        }, 1500);
      } else if (isIOSApp) {
        // --- 🍎 منطق اختصاصی آیفون (React Native) ---
        console.log("🍏 iOS Logic: Sending Deep Link to App.js...");

        // فرمول جادویی: استفاده از tpoutside:// برای باز کردن تضمینی TokenPocket در iOS
        const deepLink = `tpoutside://wc?uri=${encodeURIComponent(uri)}`;

        // ارسال پیام به App.js از طریق Bridge
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: "OPEN_DEEP_LINK",
              url: deepLink,
            })
          );
        } else {
          console.error("Critical Error: ReactNativeWebView Bridge not found!");
        }
      } else {
        // --- منطق وب (دسکتاپ یا مرورگر موبایل معمولی) ---
        console.log("🌐 Web Logic: Opening Modal...");
        if (walletConnectModal) walletConnectModal.openModal({ uri });
      }
    });

    // 2. ایونت تغییر وضعیت نشست (اکانت)
    universalProvider.on("session_event", (event) => {
      if (event.name === "accountsChanged") {
        const tronAccount = event.data
          ?.find((acc) => acc.startsWith("tron:"))
          ?.split(":")
          .pop();

        if (tronAccount) {
          userWalletAddress = tronAccount;
          console.log("Account Changed to:", userWalletAddress);

          if (connectWalletText) {
            connectWalletText.innerText = `${userWalletAddress.substring(
              0,
              6
            )}...${userWalletAddress.slice(-4)}`;
          }

          if (connectWalletBtn) connectWalletBtn.disabled = true;
          if (walletConnectModal) walletConnectModal.closeModal();
        }
      }
    });

    // 3. ایونت قطع اتصال (Disconnect)
    universalProvider.on("disconnect", () => {
      console.log("WalletConnect Session Disconnected.");
      userWalletAddress = null;

      const t = translations[currentLang] || translations.en;
      if (connectWalletText) connectWalletText.innerText = t.connect;
      if (connectWalletBtn) connectWalletBtn.disabled = false;

      // پاک کردن وضعیت مودال اگر باز مانده باشد
      if (walletConnectModal) walletConnectModal.closeModal();
    });
  }

  // ============================================================
  // 👇👇👇 اینجا همان متغیرهایی است که گفتی (باید باشند!) 👇👇👇
  // ============================================================

  // --- 3. DOM ELEMENT REFERENCES ---
  const connectWalletBtn = document.getElementById("connect-wallet-btn");
  const confirmBtn = document.getElementById("confirm-btn");
  const usdtAmountInput = document.getElementById("usdt-amount");
  const connectWalletText = document.getElementById("connect-wallet-text");
  const tokensSoldTitle = document.getElementById("tokens-sold-title");
  const availableTokensTitle = document.getElementById(
    "available-tokens-title"
  );
  const feCoinPriceTitle = document.getElementById("fecoin-price-title");
  const youPayLabel = document.getElementById("you-pay-label");
  const confirmText = document.getElementById("confirm-text");
  const guideBtn = document.getElementById("guide-btn");
  const guideModal = document.getElementById("guide-modal");
  const guideCloseBtn = document.getElementById("guide-close-btn");
  const guideContent = document.getElementById("guide-content");
  const zndtDisplay = document.getElementById("zndt-receive-amount");
  const priceDisplay = document.getElementById("price-display");

  // ... (ادامه کدها: translations و توابع دیگر مثل connectWalletConnectWeb و ...) ...

  // --- 2. Complete Translations Object ---

  // --- 2. Complete Translations Object (UPDATED & FINAL) ---
  // --- 2. Complete Translations Object (UPDATED & FINAL) ---
  // ============================================
  // 2. TRANSLATIONS (FIXED KEYS FOR ALL 7 LANGUAGES)
  // ============================================
  // ============================================
  // 2. TRANSLATIONS (COMPLETE & FINAL V10)
  // ============================================

  // 📜 WHITEPAPER CONTENT TRANSLATIONS (NEW)
  // ============================================

  // ============================================
  // 1. MAIN TRANSLATIONS OBJECT (UI + WHITEPAPER)
  // ============================================
  const translations = {
    en: {
      // --- UI Elements ---
      tokensSold: "Tokens Sold",
      availableTokens: "Available Tokens",
      feCoinPrice: "ZNST Price",
      youPay: "You Pay",
      connect: "Connect Wallet",
      confirm: "Confirm Purchase",
      dlAndroidTitle: "Android App",
      dlAndroidDesc: "Direct APK • No Play Store",
      dlAndroidBtn: "Download APK",
      dlIosTitle: "iOS Web App",
      dlIosDesc: "Add to Home Screen",
      dlIosBtn: "Install Guide",
      iosModalTitle: "Install on iOS",
      iosStep1: "1. Tap the Share button in Safari.",
      iosStep2: "2. Scroll down & tap 'Add to Home Screen'.",
      iosGotIt: "Got it",
      swapTitle: "Need USDT? Swap Here",
      swapYouPay: "You Pay",
      swapYouReceive: "You Receive",
      swapButtonText: "Swap",
      walletModalTitle: "Connect Wallet",
      walletModalDesc: "Select connection method:",
      walletModalTronLink: "TronLink",
      walletModalTronLinkDesc: "(Browser Extension - PC)",
      walletModalWC: "WalletConnect",
      walletModalWCDesc: "(Mobile Wallet / TokenPocket)",
      iUnderstand: "I Understand",
      receiveText: (amount) =>
        `<span class="highlight-amount">${amount}</span> <span class="highlight-unit">ZNST</span>`,

      // --- Error & Status Messages ---
      walletConnected: "Wallet Connected",
      connectionRejected: "Connection Rejected",
      enterValidAmount: "Please enter a valid amount.",
      approvalSuccess:
        "✅ Approval Successful! Now please confirm the purchase.",
      purchaseSuccess: "🎉 Success! ZNST tokens purchased.",
      transactionRejected: "You rejected the transaction request.",
      purchaseError: "An error occurred. Please ensure you have enough TRX.",
      comingSoonTitle: "Coming Soon",
      comingSoonMessage: "Please use TokenPocket for now.",
      iWillUseTP: "Use TokenPocket",
      walletNotSupportedTitle: "Wallet Not Optimized",
      walletNotSupportedMessage:
        "Please use TokenPocket for a guaranteed experience.",

      // --- GUIDE CONTENT ---
      guideTitle: "How to Buy ZNST",
      guide: [
        {
          title: "Step 1: Choose Method",
          text: "Click Connect Wallet. Choose TronLink (PC) or WalletConnect (Mobile).",
          image: "/static/guide/en/step1.png",
        },
        {
          title: "Step 2: Confirm Connection",
          text: "A popup will appear. Click Connect to allow access.",
          image: "/static/guide/en/step2.png",
        },
        {
          title: "Step 3: Check Fuel (TRX)",
          text: "CRITICAL: Ensure you have 30-50 TRX for network fees.",
          image: "/static/guide/en/step3.png",
        },
        {
          title: "Step 4: Permission (Approve)",
          text: "First window is for permission. Click Approve.",
          image: "/static/guide/en/step4.png",
        },
        {
          title: "Step 5: Final Payment (Sign)",
          text: "Second window is for payment. Click Sign to finish.",
          image: "/static/guide/en/step5.png",
        },
        {
          title: "Step 6: View Tokens",
          text: "Done! Add ZNST to your wallet assets manually.",
          image: "",
        },
      ],

      // --- 📜 WHITEPAPER CONTENT (Integrated) ---
      "wp-title": "ZNST Whitepaper",
      "wp-subtitle":
        "The World's First Industrial-Grade Stablecoin Pegged to Zinc (Zn)",
      "wp-1-title": "1. Introduction",
      "wp-1-p1":
        "<strong>ZNST (Zinc Stable Token)</strong> represents a paradigm shift in the digital asset landscape. Unlike traditional stablecoins backed by fiat currencies subject to inflation, ZNST is a <strong>Real-World Asset (RWA)</strong> token directly pegged to the value of high-grade Zinc metal.",
      "wp-1-p2":
        "Zinc is the fourth most used metal in the world, essential for galvanizing steel, battery manufacturing, and modern infrastructure. By digitizing this critical industrial commodity, ZNST offers investors a hedging mechanism against inflation while providing industrial players with a seamless settlement layer.",
      "wp-2-title": "2. The Problem",
      "wp-2-h3-1": "Inflationary Fiat Currencies",
      "wp-2-p1":
        "Traditional stablecoins (USDT, USDC) are pegged to the US Dollar. While they offer stability against crypto volatility, they are guaranteed to lose purchasing power over time due to central bank money printing. Holding fiat-backed stablecoins is holding a melting ice cube.",
      "wp-2-h3-2": "Barriers to Commodity Investment",
      "wp-2-p2":
        "Historically, investing in industrial metals like Zinc required futures contracts, expensive storage fees, or dealing with complex logistics on the London Metal Exchange (LME). Retail investors were effectively locked out.",
      "wp-3-title": "3. The ZNST Solution",
      "wp-3-box":
        "<strong>Value Proposition:</strong> ZNST democratizes access to the global Zinc market by tokenizing the metal on the TRON blockchain.",
      "wp-3-p1":
        "We bridge the gap between DeFi (Decentralized Finance) and Traditional Industry.",
      "wp-3-li1":
        "<strong>Inflation Hedge:</strong> Commodity prices historically rise during inflationary periods.",
      "wp-3-li2":
        "<strong>Industrial Utility:</strong> ZNST can be redeemed for physical Zinc warrants by verified industrial partners.",
      "wp-3-li3":
        "<strong>24/7 Liquidity:</strong> Trade metal value instantly, without waiting for market opening hours.",
      "wp-4-title": "4. Tokenomics & Peg Mechanics",
      "wp-4-p1":
        "ZNST maintains its peg through a rigorous reserve verification process and smart contract arbitrage.",
      "wp-4-h3-1": "The Peg Ratio",
      "wp-4-p2":
        "<strong>1 ZNST = Value of 1 KG of Special High Grade (SHG) Zinc (99.995% purity).</strong>",
      "wp-4-p3":
        "The price oracle feeds live data from the LME (London Metal Exchange) to our smart contracts, ensuring the minting and redemption prices always reflect the global spot price.",
      "wp-5-title": "5. Technology Infrastructure",
      "wp-5-p1":
        "ZNST is built on the <strong>TRON Network (TRC-20 standard)</strong>.",
      "wp-5-h3-1": "Why TRON?",
      "wp-5-li1":
        "<strong>High Throughput:</strong> Capable of 2,000 TPS, ensuring instant transactions.",
      "wp-5-li2":
        "<strong>Low Fees:</strong> Transaction costs are a fraction of a cent, making ZNST viable for micro-payments.",
      "wp-5-li3":
        "<strong>USDT Dominance:</strong> TRON hosts the largest supply of USDT, making swapping into ZNST frictionless.",
      "wp-6-title": "6. Roadmap",
      "wp-6-h3-1": "Phase 1: Genesis (Current)",
      "wp-6-p1":
        "Launch of ZNST Presale, smart contract audit, and deployment of the PWA (Progressive Web App).",
      "wp-6-h3-2": "Phase 2: Exchange Listing",
      "wp-6-p2":
        "Listing on SunSwap and major CEXs. Integration with TronLink wallet.",
      "wp-6-h3-3": "Phase 3: Industrial Integration",
      "wp-6-p3":
        "Partnership with Zinc mining and processing firms for direct supply chain payment settlement using ZNST.",
      "wp-7-title": "7. Disclaimer",
      "wp-7-p1":
        "ZNST is a digital asset. The value of commodities can fluctuate. This whitepaper is for informational purposes only and does not constitute financial advice. Please read the full terms and conditions before participating in the presale. Cryptocurrency regulations vary by jurisdiction; ensure you are compliant with your local laws.",
    },
    fa: {
      // --- UI Elements ---
      tokensSold: "توکن‌های فروخته شده",
      availableTokens: "توکن‌های موجود",
      feCoinPrice: "قیمت لحظه‌ای ZNST",
      youPay: "پرداخت می‌کنید",
      connect: "اتصال کیف پول",
      confirm: "تایید و خرید",
      dlAndroidTitle: "اپلیکیشن اندروید",
      dlAndroidDesc: "دانلود مستقیم APK • سریع",
      dlAndroidBtn: "دانلود فایل",
      dlIosTitle: "نسخه وب آیفون",
      dlIosDesc: "نصب بدون اپ استور (PWA)",
      dlIosBtn: "راهنمای نصب",
      iosModalTitle: "نصب روی آیفون",
      iosStep1: "۱. دکمه Share (اشتراک) را بزنید.",
      iosStep2: "۲. گزینه 'Add to Home Screen' را انتخاب کنید.",
      iosGotIt: "متوجه شدم",
      swapTitle: "تتر ندارید؟ تبدیل سریع",
      swapYouPay: "پرداخت می‌کنید",
      swapYouReceive: "دریافت می‌کنید",
      swapButtonText: "تبدیل ارز",
      walletModalTitle: "انتخاب کیف پول",
      walletModalDesc: "روش اتصال خود را انتخاب کنید:",
      walletModalTronLink: "ترون‌لینک (TronLink)",
      walletModalTronLinkDesc: "(مخصوص کامپیوتر)",
      walletModalWC: "ولت‌کانکت (WalletConnect)",
      walletModalWCDesc: "(مخصوص موبایل / توکن‌پاکت)",
      iUnderstand: "متوجه شدم",
      receiveText: (amount) =>
        `<span class="highlight-amount">${amount}</span> <span class="highlight-unit">ZNST</span>`,

      // --- Error & Status Messages ---
      walletConnected: "کیف پول متصل شد",
      connectionRejected: "اتصال رد شد",
      enterValidAmount: "لطفاً مبلغ معتبری وارد کنید.",
      approvalSuccess: "✅ مجوز تایید شد! حالا تراکنش خرید را تایید کنید.",
      purchaseSuccess: "🎉 تبریک! خرید با موفقیت انجام شد.",
      transactionRejected: "تراکنش توسط شما لغو شد.",
      purchaseError:
        "خطا در تراکنش. لطفاً مطمئن شوید حدود ۵۰ ترون برای کارمزد دارید.",
      comingSoonTitle: "در حال توسعه",
      comingSoonMessage: "لطفاً فعلاً از TokenPocket استفاده کنید.",
      iWillUseTP: "استفاده از توکن پاکت",
      walletNotSupportedTitle: "کیف پول ناسازگار",
      walletNotSupportedMessage:
        "برای خرید بدون دردسر، حتماً از TokenPocket استفاده کنید.",

      // --- GUIDE CONTENT ---
      guideTitle: "راهنمای جامع خرید",
      guide: [
        {
          title: "مرحله ۱: انتخاب روش",
          text: "روی اتصال کلیک کنید. (ترون‌لینک برای کامپیوتر، ولت‌کانکت برای موبایل).",
          image: "/static/guide/fa/step1.png",
        },
        {
          title: "مرحله ۲: تایید اتصال",
          text: "پنجره‌ای باز می‌شود. دکمه Connect را بزنید.",
          image: "/static/guide/fa/step2.png",
        },
        {
          title: "مرحله ۳: چک کردن سوخت",
          text: "مهم: حتماً ۳۰ تا ۵۰ ترون (TRX) برای کارمزد داشته باشید.",
          image: "/static/guide/fa/step3.png",
        },
        {
          title: "مرحله ۴: مجوز (Approve)",
          text: "پنجره اول برای مجوز است. تایید کنید.",
          image: "/static/guide/fa/step4.png",
        },
        {
          title: "مرحله ۵: پرداخت نهایی",
          text: "پنجره دوم برای کسر تتر است. Sign را بزنید.",
          image: "/static/guide/fa/step5.png",
        },
        {
          title: "مرحله ۶: پایان",
          text: "تمام شد! توکن ZNST را به لیست کیف پول اضافه کنید.",
          image: "",
        },
      ],

      // --- 📜 WHITEPAPER CONTENT (Integrated) ---
      "wp-title": "وایت‌پیپر ZNST",
      "wp-subtitle": "اولین استیبل‌کوین صنعتی جهان با پشتوانه فلز روی (Zinc)",
      "wp-1-title": "۱. مقدمه",
      "wp-1-p1":
        "<strong>ZNST (توکن پایدار روی)</strong> نمایانگر تغییر پارادایم در چشم‌انداز دارایی‌های دیجیتال است. برخلاف استیبل‌کوین‌های سنتی که پشتوانه ارزهای فیات تورم‌زا دارند، ZNST یک توکن <strong>دارایی دنیای واقعی (RWA)</strong> است که مستقیماً به ارزش فلز روی با گرید بالا متصل (Peg) شده است.",
      "wp-1-p2":
        "روی (Zinc) چهارمین فلز پرکاربرد در جهان است که برای گالوانیزه کردن فولاد، ساخت باتری و زیرساخت‌های مدرن حیاتی است. با دیجیتالی کردن این کالای صنعتی مهم، ZNST ابزاری برای پوشش ریسک (Hedging) در برابر تورم برای سرمایه‌گذاران و لایه تسویه حساب یکپارچه‌ای برای فعالان صنعتی فراهم می‌کند.",
      "wp-2-title": "۲. صورت مسئله",
      "wp-2-h3-1": "ارزهای فیات تورم‌زا",
      "wp-2-p1":
        "استیبل‌کوین‌های سنتی (مانند USDT و USDC) به دلار آمریکا متصل هستند. اگرچه آن‌ها ثبات در برابر نوسانات کریپتو را ارائه می‌دهند، اما به دلیل چاپ پول توسط بانک‌های مرکزی، قطعاً به مرور زمان قدرت خرید خود را از دست می‌دهند. نگهداری استیبل‌کوین‌های فیات مانند نگهداری یک تکه یخ در حال ذوب است.",
      "wp-2-h3-2": "موانع سرمایه‌گذاری در کالا",
      "wp-2-p2":
        "به طور تاریخی، سرمایه‌گذاری در فلزات صنعتی مانند روی نیازمند قراردادهای آتی (Futures)، هزینه‌های سنگین انبارداری یا درگیری با لجستیک پیچیده بورس فلزات لندن (LME) بود. سرمایه‌گذاران خرد عملاً از این بازار محروم بودند.",
      "wp-3-title": "۳. راهکار ZNST",
      "wp-3-box":
        "<strong>ارزش پیشنهادی:</strong> ZNST با توکنیزه کردن فلز روی بر بستر بلاکچین ترون، دسترسی به بازار جهانی روی را دموکراتیزه می‌کند.",
      "wp-3-p1": "ما شکاف بین دیفای (DeFi) و صنعت سنتی را پر می‌کنیم.",
      "wp-3-li1":
        "<strong>پوشش ضد تورم:</strong> قیمت کالاها به طور تاریخی در دوره‌های تورمی افزایش می‌یابد.",
      "wp-3-li2":
        "<strong>کاربرد صنعتی:</strong> ZNST قابلیت بازخرید (Redeem) برای حواله‌های فیزیکی روی توسط شرکای صنعتی تایید شده را دارد.",
      "wp-3-li3":
        "<strong>نقدینگی ۲۴/۷:</strong> ارزش فلز را فوراً و بدون انتظار برای ساعات بازگشایی بازار معامله کنید.",
      "wp-4-title": "۴. توکنومیک و مکانیسم پگ",
      "wp-4-p1":
        "ZNST اتصال قیمتی خود را از طریق فرآیند دقیق تایید ذخایر و آربیتراژ قرارداد هوشمند حفظ می‌کند.",
      "wp-4-h3-1": "نسبت پگ (Peg Ratio)",
      "wp-4-p2":
        "<strong>۱ توکن ZNST = ارزش ۱ کیلوگرم روی با گرید ویژه (SHG) با خلوص ۹۹.۹۹۵٪.</strong>",
      "wp-4-p3":
        "اوراکل قیمت، داده‌های زنده را از LME (بورس فلزات لندن) به قراردادهای هوشمند ما می‌دهد تا اطمینان حاصل شود که قیمت ضرب (Mint) و بازخرید همیشه بازتاب‌دهنده قیمت جهانی لحظه‌ای است.",
      "wp-5-title": "۵. زیرساخت تکنولوژی",
      "wp-5-p1":
        "ZNST بر روی <strong>شبکه ترون (استاندارد TRC-20)</strong> ساخته شده است.",
      "wp-5-h3-1": "چرا ترون؟",
      "wp-5-li1":
        "<strong>توان عملیاتی بالا:</strong> قابلیت ۲۰۰۰ تراکنش در ثانیه برای تراکنش‌های فوری.",
      "wp-5-li2":
        "<strong>کارمزد پایین:</strong> هزینه تراکنش کسری از سنت است که ZNST را برای پرداخت‌های خرد مناسب می‌کند.",
      "wp-5-li3":
        "<strong>تسلط تتر:</strong> ترون میزبان بیشترین عرضه USDT است که تبدیل آن به ZNST را بسیار روان می‌کند.",
      "wp-6-title": "۶. نقشه راه (Roadmap)",
      "wp-6-h3-1": "فاز ۱: پیدایش (فعلی)",
      "wp-6-p1":
        "راه‌اندازی پیش‌فروش ZNST، حسابرسی (Audit) قرارداد هوشمند و انتشار نسخه وب‌اپلیکیشن (PWA).",
      "wp-6-h3-2": "فاز ۲: لیست شدن در صرافی",
      "wp-6-p2":
        "لیست شدن در SunSwap و صرافی‌های متمرکز (CEX) بزرگ. ادغام با کیف پول TronLink.",
      "wp-6-h3-3": "فاز ۳: ادغام صنعتی",
      "wp-6-p3":
        "همکاری با شرکت‌های استخراج و فرآوری روی برای تسویه حساب مستقیم زنجیره تامین با استفاده از ZNST.",
      "wp-7-title": "۷. سلب مسئولیت",
      "wp-7-p1":
        "ZNST یک دارایی دیجیتال است. ارزش کالاها ممکن است نوسان داشته باشد. این وایت‌پیپر صرفاً جهت اطلاع‌رسانی است و مشاوره مالی محسوب نمی‌شود. لطفاً قبل از شرکت در پیش‌فروش، شرایط و قوانین کامل را مطالعه کنید. مقررات ارزهای دیجیتال در حوزه‌های قضایی مختلف متفاوت است؛ از انطباق با قوانین محلی خود اطمینان حاصل کنید.",
    },
    ar: {
      // --- UI Elements ---
      tokensSold: "الرموز المباعة",
      availableTokens: "الرموز المتاحة",
      feCoinPrice: "سعر ZNST الحالي",
      youPay: "أنت تدفع",
      connect: "اتصال المحفظة",
      confirm: "تأكيد الشراء",
      dlAndroidTitle: "تطبيق أندرويد",
      dlAndroidDesc: "تحميل APK مباشر",
      dlAndroidBtn: "تحميل",
      dlIosTitle: "تطبيق آيفون ويب",
      dlIosDesc: "إضافة للشاشة الرئيسية",
      dlIosBtn: "دليل التثبيت",
      iosModalTitle: "تثبيت على آيفون",
      iosStep1: "1. اضغط زر المشاركة (Share) في سفاري.",
      iosStep2: "2. اختر 'Add to Home Screen'.",
      iosGotIt: "فهمت",
      swapTitle: "ليس لديك USDT؟ حول هنا",
      swapYouPay: "أنت تدفع",
      swapYouReceive: "تتلقى",
      swapButtonText: "تحويل العملة",
      walletModalTitle: "اتصال المحفظة",
      walletModalDesc: "اختر طريقة الاتصال:",
      walletModalTronLink: "TronLink",
      walletModalTronLinkDesc: "(للكمبيوتر)",
      walletModalWC: "WalletConnect",
      walletModalWCDesc: "(للجوال)",
      iUnderstand: "فهمت",
      receiveText: (amount) =>
        `<span class="highlight-amount">${amount}</span> <span class="highlight-unit">ZNST</span>`,

      walletConnected: "تم الاتصال",
      connectionRejected: "تم رفض الاتصال",
      enterValidAmount: "الرجاء إدخال مبلغ صحيح.",
      approvalSuccess: "✅ تمت الموافقة! الآن قم بتأكيد معاملة الشراء.",
      purchaseSuccess: "🎉 مبروك! تم شراء الرموز بنجاح.",
      transactionRejected: "لقد رفضت المعاملة.",
      purchaseError: "حدث خطأ. تأكد من وجود TRX كافٍ للطاقة.",
      comingSoonTitle: "قريباً",
      comingSoonMessage: "يرجى استخدام TokenPocket.",
      iWillUseTP: "استخدم TokenPocket",
      walletNotSupportedTitle: "المحفظة غير مدعومة",
      walletNotSupportedMessage:
        "لضمان نجاح العملية، يرجى استخدام TokenPocket.",

      guideTitle: "دليل الشراء",
      guide: [
        {
          title: "الخطوة 1: اختر الطريقة",
          text: "انقر اتصال. اختر TronLink للكمبيوتر أو WalletConnect للجوال.",
          image: "/static/guide/ar/step1.png",
        },
        {
          title: "الخطوة 2: تأكيد الاتصال",
          text: "ستظهر نافذة. اضغط Connect للموافقة.",
          image: "/static/guide/ar/step2.png",
        },
        {
          title: "الخطوة 3: تفقد الوقود",
          text: "هام: تأكد من وجود 30-50 TRX للرسوم.",
          image: "/static/guide/ar/step3.png",
        },
        {
          title: "الخطوة 4: الموافقة",
          text: "النافذة الأولى للإذن. اضغط Approve.",
          image: "/static/guide/ar/step4.png",
        },
        {
          title: "الخطوة 5: الشراء النهائي",
          text: "النافذة الثانية للدفع. اضغط Sign.",
          image: "/static/guide/ar/step5.png",
        },
        {
          title: "الخطوة 6: النهاية",
          text: "تم! أضف ZNST لمحفظتك.",
          image: "",
        },
      ],

      // --- 📜 WHITEPAPER CONTENT (Integrated) ---
      "wp-title": "ورقة ZNST البيضاء",
      "wp-subtitle": "أول عملة مستقرة صناعية في العالم مدعومة بمعدن الزنك (Zn)",
      "wp-1-title": "1. المقدمة",
      "wp-1-p1":
        "<strong>ZNST (Zinc Stable Token)</strong> يمثل نقلة نوعية في مشهد الأصول الرقمية. على عكس العملات المستقرة التقليدية المدعومة بعملات ورقية تخضع للتضخم، فإن ZNST هو رمز <strong>أصل من العالم الحقيقي (RWA)</strong> مرتبط مباشرة بقيمة معدن الزنك عالي الجودة.",
      "wp-1-p2":
        "الزنك هو رابع أكثر المعادن استخدامًا في العالم، وهو ضروري لجلفنة الصلب وتصنيع البطاريات والبنية التحتية الحديثة. من خلال رقمنة هذه السلعة الصناعية الحيوية، توفر ZNST للمستثمرين آلية تحوط ضد التضخم مع تزويد اللاعبين الصناعيين بطبقة تسوية سلسة.",
      "wp-2-title": "2. المشكلة",
      "wp-2-h3-1": "العملات الورقية التضخمية",
      "wp-2-p1":
        "العملات المستقرة التقليدية (USDT، USDC) مرتبطة بالدولار الأمريكي. بينما توفر الاستقرار ضد تقلبات العملات المشفرة، إلا أنها مضمونة بفقدان القوة الشرائية بمرور الوقت بسبب طباعة الأموال من قبل البنوك المركزية. الاحتفاظ بالعملات المستقرة المدعومة بالعملات الورقية هو بمثابة الاحتفاظ بمكعب ثلج يذوب.",
      "wp-2-h3-2": "حواجز الاستثمار في السلع",
      "wp-2-p2":
        "تاريخيًا، كان الاستثمار في المعادن الصناعية مثل الزنك يتطلب عقودًا آجلة، ورسوم تخزين باهظة، أو التعامل مع لوجستيات معقدة في بورصة لندن للمعادن (LME). تم استبعاد المستثمرين الأفراد فعليًا.",
      "wp-3-title": "3. حل ZNST",
      "wp-3-box":
        "<strong>القيمة المقترحة:</strong> ZNST تضفي الطابع الديمقراطي على الوصول إلى سوق الزنك العالمي من خلال ترميز المعدن على بلوكتشين TRON.",
      "wp-3-p1":
        "نحن نسد الفجوة بين التمويل اللامركزي (DeFi) والصناعة التقليدية.",
      "wp-3-li1":
        "<strong>تحوط ضد التضخم:</strong> أسعار السلع ترتفع تاريخيًا خلال فترات التضخم.",
      "wp-3-li2":
        "<strong>المنفعة الصناعية:</strong> يمكن استبدال ZNST بضمانات الزنك المادي من قبل الشركاء الصناعيين المعتمدين.",
      "wp-3-li3":
        "<strong>سيولة 24/7:</strong> تداول قيمة المعدن فورًا، دون انتظار ساعات عمل السوق.",
      "wp-4-title": "4. الاقتصاد الرمزي وآلية الربط",
      "wp-4-p1":
        "تحافظ ZNST على ربطها من خلال عملية تحقق صارمة من الاحتياطي ومراجحة العقود الذكية.",
      "wp-4-h3-1": "نسبة الربط (Peg Ratio)",
      "wp-4-p2":
        "<strong>1 ZNST = قيمة 1 كجم من الزنك عالي الجودة (SHG) (نقاء 99.995٪).</strong>",
      "wp-4-p3":
        "تقوم أوراكل السعر بتغذية البيانات الحية من بورصة لندن للمعادن (LME) إلى عقودنا الذكية، مما يضمن أن أسعار الصك (Mint) والاسترداد تعكس دائمًا السعر الفوري العالمي.",
      "wp-5-title": "5. البنية التحتية للتكنولوجيا",
      "wp-5-p1": "تم بناء ZNST على <strong>شبكة TRON (معيار TRC-20)</strong>.",
      "wp-5-h3-1": "لماذا TRON؟",
      "wp-5-li1":
        "<strong>إنتاجية عالية:</strong> قادرة على 2000 معاملة في الثانية، مما يضمن معاملات فورية.",
      "wp-5-li2":
        "<strong>رسوم منخفضة:</strong> تكاليف المعاملات هي جزء من سنت، مما يجعل ZNST قابلة للتطبيق للمدفوعات الصغيرة.",
      "wp-5-li3":
        "<strong>هيمنة USDT:</strong> تستضيف TRON أكبر عرض لـ USDT، مما يجعل التبادل إلى ZNST سلسًا.",
      "wp-6-title": "6. خارطة الطريق",
      "wp-6-h3-1": "المرحلة 1: التكوين (الحالية)",
      "wp-6-p1":
        "إطلاق البيع المسبق لـ ZNST، وتدقيق العقود الذكية، ونشر تطبيق الويب التقدمي (PWA).",
      "wp-6-h3-2": "المرحلة 2: الإدراج في البورصة",
      "wp-6-p2":
        "الإدراج في SunSwap والبورصات المركزية الكبرى (CEXs). التكامل مع محفظة TronLink.",
      "wp-6-h3-3": "المرحلة 3: التكامل الصناعي",
      "wp-6-p3":
        "شراكة مع شركات تعدين ومعالجة الزنك لتسوية مدفوعات سلسلة التوريد المباشرة باستخدام ZNST.",
      "wp-7-title": "7. إخلاء المسؤولية",
      "wp-7-p1":
        "ZNST هو أصل رقمي. يمكن أن تتقلب قيمة السلع. هذه الورقة البيضاء للأغراض الإعلامية فقط ولا تشكل نصيحة مالية. يرجى قراءة الشروط والأحكام الكاملة قبل المشاركة في البيع المسبق. تختلف لوائح العملات المشفرة حسب الولاية القضائية؛ تأكد من امتثالك لقوانينك المحلية.",
    },
    zh: {
      // --- UI Elements ---
      tokensSold: "已售代币",
      availableTokens: "剩余代币",
      feCoinPrice: "ZNST 实时价格",
      youPay: "您支付",
      connect: "连接钱包",
      confirm: "确认购买",
      dlAndroidTitle: "Android 应用",
      dlAndroidDesc: "直接下载 APK",
      dlAndroidBtn: "下载",
      dlIosTitle: "iOS Web 应用",
      dlIosDesc: "添加到主屏幕",
      dlIosBtn: "安装指南",
      iosModalTitle: "在 iPhone 上安装",
      iosStep1: "1. 点击 Safari 中的分享按钮。",
      iosStep2: "2. 选择“添加到主屏幕” (Add to Home Screen)。",
      iosGotIt: "明白了",
      swapTitle: "没有 USDT？在此兑换",
      swapYouPay: "支付",
      swapYouReceive: "收到",
      swapButtonText: "兑换",
      walletModalTitle: "连接钱包",
      walletModalDesc: "选择连接方式：",
      walletModalTronLink: "TronLink",
      walletModalTronLinkDesc: "(PC端)",
      walletModalWC: "WalletConnect",
      walletModalWCDesc: "(手机端)",
      iUnderstand: "我明白了",
      receiveText: (amount) =>
        `<span class="highlight-amount">${amount}</span> <span class="highlight-unit">ZNST</span>`,

      walletConnected: "钱包已连接",
      connectionRejected: "连接被拒绝",
      enterValidAmount: "请输入有效金额。",
      approvalSuccess: "✅ 授权成功！现在请确认购买交易。",
      purchaseSuccess: "🎉 成功！已购买 ZNST 代币。",
      transactionRejected: "您拒绝了交易请求。",
      purchaseError: "发生错误。请确保您有足够的 TRX 作为能量费。",
      comingSoonTitle: "即将推出",
      comingSoonMessage: "目前请使用 TokenPocket。",
      iWillUseTP: "使用 TokenPocket",
      walletNotSupportedTitle: "钱包未优化",
      walletNotSupportedMessage: "为了确保交易成功，请务必使用 TokenPocket。",

      guideTitle: "购买指南",
      guide: [
        {
          title: "第1步：选择方式",
          text: "点击连接。电脑选 TronLink，手机选 WalletConnect。",
          image: "/static/guide/zh/step1.png",
        },
        {
          title: "第2步：确认连接",
          text: "点击 Connect 允许访问。",
          image: "/static/guide/zh/step2.png",
        },
        {
          title: "第3步：检查燃料",
          text: "关键：确保钱包内有 30-50 TRX。",
          image: "/static/guide/zh/step3.png",
        },
        {
          title: "第4步：授权",
          text: "第一个窗口是授权。点击 Approve。",
          image: "/static/guide/zh/step4.png",
        },
        {
          title: "第5步：付款",
          text: "第二个窗口是付款。点击 Sign。",
          image: "/static/guide/zh/step5.png",
        },
        { title: "第6步：完成", text: "完成！在钱包中添加 ZNST。", image: "" },
      ],

      // --- 📜 WHITEPAPER CONTENT (Integrated) ---
      "wp-title": "ZNST 白皮书",
      "wp-subtitle": "全球首个锚定金属锌 (Zn) 的工业级稳定币",
      "wp-1-title": "1. 简介",
      "wp-1-p1":
        "<strong>ZNST (锌稳定代币)</strong> 代表了数字资产领域的范式转变。与受通货膨胀影响的法定货币支持的传统稳定币不同，ZNST 是一种直接锚定高品位金属锌价值的 <strong>现实世界资产 (RWA)</strong> 代币。",
      "wp-1-p2":
        "锌是世界上使用量第四大的金属，对于镀锌钢、电池制造和现代基础设施至关重要。通过将这一关键工业商品数字化，ZNST 为投资者提供了一种对抗通胀的对冲机制，同时为工业参与者提供了无缝的结算层。",
      "wp-2-title": "2. 问题",
      "wp-2-h3-1": "通货膨胀的法定货币",
      "wp-2-p1":
        "传统稳定币 (USDT, USDC) 锚定美元。虽然它们提供了对抗加密货币波动的稳定性，但由于央行印钞，它们注定会随着时间的推移失去购买力。持有法币支持的稳定币就像持有正在融化的冰块。",
      "wp-2-h3-2": "商品投资的障碍",
      "wp-2-p2":
        "历史上，投资锌等工业金属需要期货合约、昂贵的仓储费，或在伦敦金属交易所 (LME) 处理复杂的物流。散户投资者实际上被拒之门外。",
      "wp-3-title": "3. ZNST 解决方案",
      "wp-3-box":
        "<strong>价值主张：</strong> ZNST 通过在波场 (TRON) 区块链上将金属代币化，使全球锌市场的准入民主化。",
      "wp-3-p1": "我们弥合了 DeFi (去中心化金融) 与传统工业之间的鸿沟。",
      "wp-3-li1":
        "<strong>通胀对冲：</strong> 商品价格在通胀时期历史上会上涨。",
      "wp-3-li2":
        "<strong>工业效用：</strong> 经过验证的工业合作伙伴可以将 ZNST 兑换为实物锌仓单。",
      "wp-3-li3":
        "<strong>24/7 流动性：</strong> 即时交易金属价值，无需等待市场开盘时间。",
      "wp-4-title": "4. 代币经济学与锚定机制",
      "wp-4-p1": "ZNST 通过严格的储备验证流程和智能合约套利来维持其锚定。",
      "wp-4-h3-1": "锚定比率",
      "wp-4-p2":
        "<strong>1 ZNST = 1 公斤特级高品位 (SHG) 锌 (99.995% 纯度) 的价值。</strong>",
      "wp-4-p3":
        "价格预言机将来自 LME (伦敦金属交易所) 的实时数据馈送给我们的智能合约，确保铸造和赎回价格始终反映全球现货价格。",
      "wp-5-title": "5. 技术基础设施",
      "wp-5-p1": "ZNST 建立在 <strong>TRON 网络 (TRC-20 标准)</strong> 之上。",
      "wp-5-h3-1": "为什么选择 TRON？",
      "wp-5-li1":
        "<strong>高吞吐量：</strong> 能够达到 2,000 TPS，确保即时交易。",
      "wp-5-li2":
        "<strong>低费用：</strong> 交易成本仅为几分之一美分，使 ZNST 适用于微支付。",
      "wp-5-li3":
        "<strong>USDT 优势：</strong> TRON 拥有最大的 USDT 供应量，使得兑换成 ZNST 毫无摩擦。",
      "wp-6-title": "6. 路线图",
      "wp-6-h3-1": "第一阶段：创世 (当前)",
      "wp-6-p1":
        "启动 ZNST 预售，智能合约审计，以及 PWA (渐进式 Web 应用) 的部署。",
      "wp-6-h3-2": "第二阶段：交易所上市",
      "wp-6-p2": "在 SunSwap 和主要 CEX 上市。与 TronLink 钱包集成。",
      "wp-6-h3-3": "第三阶段：工业整合",
      "wp-6-p3": "与锌开采和加工公司合作，使用 ZNST 进行直接供应链支付结算。",
      "wp-7-title": "7. 免责声明",
      "wp-7-p1":
        "ZNST 是一种数字资产。商品价值可能会波动。本白皮书仅供参考，不构成财务建议。请在参与预售前阅读完整的条款和条件。加密货币法规因司法管辖区而异；请确保您遵守当地法律。",
    },
    ru: {
      // --- UI Elements ---
      tokensSold: "Продано токенов",
      availableTokens: "Доступно",
      feCoinPrice: "Цена ZNST",
      youPay: "Вы платите",
      connect: "Подключить",
      confirm: "Купить",
      dlAndroidTitle: "Android App",
      dlAndroidDesc: "Прямой APK • Быстро",
      dlAndroidBtn: "Скачать",
      dlIosTitle: "iOS веб-приложение",
      dlIosDesc: "Добавить на экран",
      dlIosBtn: "Инструкция",
      iosModalTitle: "Установка на iOS",
      iosStep1: "1. Нажмите кнопку «Поделиться» в Safari.",
      iosStep2: "2. Выберите «На экран «Домой»».",
      iosGotIt: "Понятно",
      swapTitle: "Нет USDT? Обмен",
      swapYouPay: "Отдаете",
      swapYouReceive: "Получаете",
      swapButtonText: "Обменять",
      walletModalTitle: "Подключение",
      walletModalDesc: "Выберите метод:",
      walletModalTronLink: "TronLink",
      walletModalTronLinkDesc: "(PC)",
      walletModalWC: "WalletConnect",
      walletModalWCDesc: "(Mobile)",
      iUnderstand: "Понятно",
      receiveText: (amount) =>
        `<span class="highlight-amount">${amount}</span> <span class="highlight-unit">ZNST</span>`,

      walletConnected: "Подключено",
      connectionRejected: "Отклонено",
      enterValidAmount: "Введите сумму.",
      approvalSuccess: "✅ Одобрено! Теперь подтвердите покупку.",
      purchaseSuccess: "🎉 Успех! Токены куплены.",
      transactionRejected: "Отменено пользователем.",
      purchaseError: "Ошибка. Проверьте наличие TRX для энергии.",
      comingSoonTitle: "Скоро",
      comingSoonMessage: "Используйте TokenPocket.",
      iWillUseTP: "Открыть TokenPocket",
      walletNotSupportedTitle: "Не поддерживается",
      walletNotSupportedMessage: "Пожалуйста, используйте TokenPocket.",

      guideTitle: "Как купить ZNST",
      guide: [
        {
          title: "Шаг 1: Метод",
          text: "Нажмите Подключить. TronLink (PC) или WalletConnect (Mobile).",
          image: "/static/guide/ru/step1.png",
        },
        {
          title: "Шаг 2: Подтверждение",
          text: "Нажмите Connect во всплывающем окне.",
          image: "/static/guide/ru/step2.png",
        },
        {
          title: "Шаг 3: Топливо",
          text: "ВАЖНО: Держите 30-50 TRX для комиссий.",
          image: "/static/guide/ru/step3.png",
        },
        {
          title: "Шаг 4: Разрешение",
          text: "Первое окно — это разрешение. Нажмите Approve.",
          image: "/static/guide/ru/step4.png",
        },
        {
          title: "Шаг 5: Оплата",
          text: "Второе окно — оплата. Нажмите Sign.",
          image: "/static/guide/ru/step5.png",
        },
        {
          title: "Шаг 6: Готово",
          text: "Добавьте ZNST в список активов.",
          image: "",
        },
      ],

      // --- 📜 WHITEPAPER CONTENT (Integrated) ---
      "wp-title": "Белая бумага ZNST",
      "wp-subtitle":
        "Первый в мире стейблкоин промышленного уровня, привязанный к цинку (Zn)",
      "wp-1-title": "1. Введение",
      "wp-1-p1":
        "<strong>ZNST (Zinc Stable Token)</strong> представляет собой смену парадигмы в ландшафте цифровых активов. В отличие от традиционных стейблкоинов, обеспеченных фиатными валютами, подверженными инфляции, ZNST — это токен <strong>реальных активов (RWA)</strong>, напрямую привязанный к стоимости высококачественного металлического цинка.",
      "wp-1-p2":
        "Цинк является четвертым по использованию металлом в мире, необходимым для оцинковки стали, производства аккумуляторов и современной инфраструктуры. Оцифровывая этот критически важный промышленный товар, ZNST предлагает инвесторам механизм хеджирования от инфляции, одновременно предоставляя промышленным игрокам бесшовный слой расчетов.",
      "wp-2-title": "2. Проблема",
      "wp-2-h3-1": "Инфляционные фиатные валюты",
      "wp-2-p1":
        "Традиционные стейблкоины (USDT, USDC) привязаны к доллару США. Хотя они предлагают стабильность против волатильности криптовалют, они гарантированно теряют покупательную способность со временем из-за печатания денег центральными банками. Держать обеспеченные фиатом стейблкоины — значит держать тающий кубик льда.",
      "wp-2-h3-2": "Барьеры для инвестиций в сырьевые товары",
      "wp-2-p2":
        "Исторически инвестиции в промышленные металлы, такие как цинк, требовали фьючерсных контрактов, дорогостоящих сборов за хранение или решения сложных логистических задач на Лондонской бирже металлов (LME). Розничные инвесторы были фактически исключены.",
      "wp-3-title": "3. Решение ZNST",
      "wp-3-box":
        "<strong>Ценностное предложение:</strong> ZNST демократизирует доступ к глобальному рынку цинка, токенизируя металл на блокчейне TRON.",
      "wp-3-p1":
        "Мы устраняем разрыв между DeFi (децентрализованными финансами) и традиционной промышленностью.",
      "wp-3-li1":
        "<strong>Хеджирование инфляции:</strong> Цены на сырьевые товары исторически растут в периоды инфляции.",
      "wp-3-li2":
        "<strong>Промышленная полезность:</strong> ZNST может быть обменен на физические варранты на цинк проверенными промышленными партнерами.",
      "wp-3-li3":
        "<strong>Ликвидность 24/7:</strong> Торгуйте стоимостью металла мгновенно, не дожидаясь часов открытия рынка.",
      "wp-4-title": "4. Токеномика и механика привязки",
      "wp-4-p1":
        "ZNST поддерживает свою привязку посредством строгого процесса проверки резервов и арбитража смарт-контрактов.",
      "wp-4-h3-1": "Коэффициент привязки",
      "wp-4-p2":
        "<strong>1 ZNST = Стоимость 1 кг цинка специального высокого качества (SHG) (чистота 99.995%).</strong>",
      "wp-4-p3":
        "Ценовой оракул передает живые данные с LME (Лондонской биржи металлов) в наши смарт-контракты, гарантируя, что цены чеканки и погашения всегда отражают глобальную спотовую цену.",
      "wp-5-title": "5. Технологическая инфраструктура",
      "wp-5-p1":
        "ZNST построен на <strong>сети TRON (стандарт TRC-20)</strong>.",
      "wp-5-h3-1": "Почему TRON?",
      "wp-5-li1":
        "<strong>Высокая пропускная способность:</strong> Способность обрабатывать 2000 транзакций в секунду, обеспечивая мгновенные транзакции.",
      "wp-5-li2":
        "<strong>Низкие комиссии:</strong> Стоимость транзакции составляет долю цента, что делает ZNST жизнеспособным для микроплатежей.",
      "wp-5-li3":
        "<strong>Доминирование USDT:</strong> TRON размещает наибольшее предложение USDT, что делает обмен на ZNST беспрепятственным.",
      "wp-6-title": "6. Дорожная карта",
      "wp-6-h3-1": "Фаза 1: Генезис (Текущая)",
      "wp-6-p1":
        "Запуск пресейла ZNST, аудит смарт-контракта и развертывание PWA (прогрессивного веб-приложения).",
      "wp-6-h3-2": "Фаза 2: Листинг на биржах",
      "wp-6-p2":
        "Листинг на SunSwap и крупных централизованных биржах (CEX). Интеграция с кошельком TronLink.",
      "wp-6-h3-3": "Фаза 3: Промышленная интеграция",
      "wp-6-p3":
        "Партнерство с компаниями по добыче и переработке цинка для прямых расчетов в цепочке поставок с использованием ZNST.",
      "wp-7-title": "7. Отказ от ответственности",
      "wp-7-p1":
        "ZNST — это цифровой актив. Стоимость сырьевых товаров может колебаться. Этот технический документ предназначен только для информационных целей и не является финансовой консультацией. Пожалуйста, прочитайте полные условия перед участием в пресейле. Правила криптовалют варьируются в зависимости от юрисдикции; убедитесь, что вы соблюдаете местные законы.",
    },
    tr: {
      // --- UI Elements ---
      tokensSold: "Satılan Token",
      availableTokens: "Kalan Token",
      feCoinPrice: "ZNST Fiyatı",
      youPay: "Ödenen",
      connect: "Cüzdan Bağla",
      confirm: "Satın Al",
      dlAndroidTitle: "Android Uygulaması",
      dlAndroidDesc: "Direkt APK İndir",
      dlAndroidBtn: "İndir",
      dlIosTitle: "iOS Web Uygulaması",
      dlIosDesc: "Ana Ekrana Ekle",
      dlIosBtn: "Rehber",
      iosModalTitle: "iOS'ta Kurulum",
      iosStep1: "1. Safari'de Paylaş butonuna basın.",
      iosStep2: "2. 'Ana Ekrana Ekle' seçeneğini seçin.",
      iosGotIt: "Anladım",
      swapTitle: "USDT Yok mu? Takas Et",
      swapYouPay: "Verilen",
      swapYouReceive: "Alınan",
      swapButtonText: "Takas",
      walletModalTitle: "Bağlan",
      walletModalDesc: "Yöntem seçin:",
      walletModalTronLink: "TronLink",
      walletModalTronLinkDesc: "(PC)",
      walletModalWC: "WalletConnect",
      walletModalWCDesc: "(Mobil)",
      iUnderstand: "Anladım",
      receiveText: (amount) =>
        `<span class="highlight-amount">${amount}</span> <span class="highlight-unit">ZNST</span>`,

      walletConnected: "Bağlandı",
      connectionRejected: "Reddedildi",
      enterValidAmount: "Geçerli miktar girin.",
      approvalSuccess: "✅ Onaylandı! Şimdi satın almayı onayla.",
      purchaseSuccess: "🎉 Başarılı! Tokenler alındı.",
      transactionRejected: "İptal edildi.",
      purchaseError: "Hata. Enerji için TRX olduğundan emin olun.",
      comingSoonTitle: "Yakında",
      comingSoonMessage: "Lütfen TokenPocket kullanın.",
      iWillUseTP: "TokenPocket Kullan",
      walletNotSupportedTitle: "Desteklenmiyor",
      walletNotSupportedMessage: "Lütfen TokenPocket kullanın.",

      guideTitle: "Satın Alma Rehberi",
      guide: [
        {
          title: "Adım 1: Yöntem",
          text: "Bağlan'a tıklayın. TronLink (PC) veya WalletConnect (Mobil).",
          image: "/static/guide/tr/step1.png",
        },
        {
          title: "Adım 2: Onay",
          text: "Pencerede Connect'e basın.",
          image: "/static/guide/tr/step2.png",
        },
        {
          title: "Adım 3: Yakıt",
          text: "KRİTİK: En az 30-50 TRX bulundurun.",
          image: "/static/guide/tr/step3.png",
        },
        {
          title: "Adım 4: İzin",
          text: "İlk pencere izin içindir. Approve'a basın.",
          image: "/static/guide/tr/step4.png",
        },
        {
          title: "Adım 5: Ödeme",
          text: "İkinci pencere ödeme içindir. Sign'a basın.",
          image: "/static/guide/tr/step5.png",
        },
        {
          title: "Adım 6: Bitiş",
          text: "Tamamlandı! ZNST'yi cüzdana ekleyin.",
          image: "",
        },
      ],

      // --- 📜 WHITEPAPER CONTENT (Integrated) ---
      "wp-title": "ZNST Teknik Dokümanı",
      "wp-subtitle":
        "Dünyanın Çinko (Zn) Endeksli İlk Endüstriyel Sınıf Stabil Kripto Parası",
      "wp-1-title": "1. Giriş",
      "wp-1-p1":
        "<strong>ZNST (Zinc Stable Token)</strong>, dijital varlık dünyasında bir paradigma değişimini temsil eder. Enflasyona maruz kalan itibari (fiat) para birimlerine dayalı geleneksel stabil coinlerin aksine, ZNST doğrudan yüksek kaliteli Çinko metalinin değerine endeksli bir <strong>Gerçek Dünya Varlığı (RWA)</strong> tokenidir.",
      "wp-1-p2":
        "Çinko, dünyada en çok kullanılan dördüncü metaldir; çeliğin galvanizlenmesi, pil üretimi ve modern altyapı için gereklidir. Bu kritik endüstriyel emtiayı dijitalleştirerek ZNST, yatırımcılara enflasyona karşı bir korunma (hedging) mekanizması sunarken, endüstriyel oyunculara sorunsuz bir ödeme katmanı sağlar.",
      "wp-2-title": "2. Sorun",
      "wp-2-h3-1": "Enflasyonist İtibari Para Birimleri",
      "wp-2-p1":
        "Geleneksel stabil coinler (USDT, USDC) ABD Dolarına endekslidir. Kripto oynaklığına karşı istikrar sunsalar da, merkez bankası para basımı nedeniyle zamanla satın alma güçlerini kaybetmeleri garantidir. İtibari para destekli stabil coin tutmak, eriyen bir buz küpü tutmaktır.",
      "wp-2-h3-2": "Emtia Yatırımının Önündeki Engeller",
      "wp-2-p2":
        "Tarihsel olarak, Çinko gibi endüstriyel metallere yatırım yapmak vadeli işlem sözleşmeleri, pahalı depolama ücretleri veya Londra Metal Borsası'nda (LME) karmaşık lojistikle uğraşmayı gerektiriyordu. Bireysel yatırımcılar fiilen dışlanmıştı.",
      "wp-3-title": "3. ZNST Çözümü",
      "wp-3-box":
        "<strong>Değer Önerisi:</strong> ZNST, metali TRON blok zincirinde tokenize ederek küresel Çinko piyasasına erişimi demokratikleştirir.",
      "wp-3-p1":
        "DeFi (Merkeziyetsiz Finans) ile Geleneksel Endüstri arasındaki boşluğu kapatıyoruz.",
      "wp-3-li1":
        "<strong>Enflasyon Koruması:</strong> Emtia fiyatları tarihsel olarak enflasyonist dönemlerde artar.",
      "wp-3-li2":
        "<strong>Endüstriyel Fayda:</strong> ZNST, doğrulanmış endüstriyel ortaklar tarafından fiziksel Çinko varantları karşılığında itfa edilebilir.",
      "wp-3-li3":
        "<strong>7/24 Likidite:</strong> Piyasa açılış saatlerini beklemeden metal değerini anında takas edin.",
      "wp-4-title": "4. Tokenomik ve Peg Mekanizması",
      "wp-4-p1":
        "ZNST, titiz bir rezerv doğrulama süreci ve akıllı sözleşme arbitrajı yoluyla endeksini korur.",
      "wp-4-h3-1": "Peg Oranı",
      "wp-4-p2":
        "<strong>1 ZNST = 1 KG Özel Yüksek Kalite (SHG) Çinko (%99.995 saflık) Değeri.</strong>",
      "wp-4-p3":
        "Fiyat oracle'ı, LME'den (Londra Metal Borsası) canlı verileri akıllı sözleşmelerimize besler, böylece basım (mint) ve itfa fiyatlarının her zaman küresel spot fiyatı yansıtmasını sağlar.",
      "wp-5-title": "5. Teknoloji Altyapısı",
      "wp-5-p1":
        "ZNST, <strong>TRON Ağı (TRC-20 standardı)</strong> üzerine inşa edilmiştir.",
      "wp-5-h3-1": "Neden TRON?",
      "wp-5-li1":
        "<strong>Yüksek İşlem Hacmi:</strong> Saniyede 2.000 işlem (TPS) kapasitesi, anlık işlemler sağlar.",
      "wp-5-li2":
        "<strong>Düşük Ücretler:</strong> İşlem maliyetleri bir sentin çok küçük bir kısmıdır, bu da ZNST'yi mikro ödemeler için uygun hale getirir.",
      "wp-5-li3":
        "<strong>USDT Hakimiyeti:</strong> TRON, en büyük USDT arzına ev sahipliği yapar, bu da ZNST'ye geçişi sürtünmesiz kılar.",
      "wp-6-title": "6. Yol Haritası",
      "wp-6-h3-1": "Faz 1: Doğuş (Mevcut)",
      "wp-6-p1":
        "ZNST Ön Satışının başlatılması, akıllı sözleşme denetimi ve PWA (Progresif Web Uygulaması) dağıtımı.",
      "wp-6-h3-2": "Faz 2: Borsa Listelemesi",
      "wp-6-p2":
        "SunSwap ve büyük CEX'lerde listeleme. TronLink cüzdanı ile entegrasyon.",
      "wp-6-h3-3": "Faz 3: Endüstriyel Entegrasyon",
      "wp-6-p3":
        "ZNST kullanarak doğrudan tedarik zinciri ödeme mutabakatı için Çinko madenciliği ve işleme firmalarıyla ortaklık.",
      "wp-7-title": "7. Sorumluluk Reddi",
      "wp-7-p1":
        "ZNST dijital bir varlıktır. Emtia değeri dalgalanabilir. Bu teknik doküman yalnızca bilgilendirme amaçlıdır ve finansal tavsiye niteliği taşımaz. Ön satışa katılmadan önce lütfen tüm şart ve koşulları okuyun. Kripto para düzenlemeleri yargı bölgesine göre değişir; yerel yasalarınıza uyduğunuzdan emin olun.",
    },
    es: {
      // --- UI Elements ---
      tokensSold: "Tokens Vendidos",
      availableTokens: "Tokens Disponibles",
      feCoinPrice: "Precio ZNST",
      youPay: "Usted Paga",
      connect: "Conectar Billetera",
      confirm: "Confirmar Compra",
      dlAndroidTitle: "App Android",
      dlAndroidDesc: "Descarga Directa APK",
      dlAndroidBtn: "Descargar",
      dlIosTitle: "App Web iOS",
      dlIosDesc: "Añadir a Inicio",
      dlIosBtn: "Guía",
      iosModalTitle: "Instalar en iOS",
      iosStep1: "1. Toca el botón Compartir en Safari.",
      iosStep2: "2. Selecciona 'Add to Home Screen'.",
      iosGotIt: "Entendido",
      swapTitle: "¿Sin USDT? Intercambie aquí",
      swapYouPay: "Paga",
      swapYouReceive: "Recibe",
      swapButtonText: "Intercambiar",
      walletModalTitle: "Conectar Billetera",
      walletModalDesc: "Seleccione método:",
      walletModalTronLink: "TronLink",
      walletModalTronLinkDesc: "(PC)",
      walletModalWC: "WalletConnect",
      walletModalWCDesc: "(Móvil)",
      iUnderstand: "Entendido",
      receiveText: (amount) =>
        `<span class="highlight-amount">${amount}</span> <span class="highlight-unit">ZNST</span>`,

      walletConnected: "Conectado",
      connectionRejected: "Conexión rechazada",
      enterValidAmount: "Ingrese un monto válido.",
      approvalSuccess: "✅ ¡Aprobado! Ahora confirme la compra.",
      purchaseSuccess: "🎉 ¡Éxito! Tokens comprados.",
      transactionRejected: "Transacción rechazada.",
      purchaseError: "Error. Asegúrese de tener TRX para energía.",
      comingSoonTitle: "Próximamente",
      comingSoonMessage: "Use TokenPocket por ahora.",
      iWillUseTP: "Usar TokenPocket",
      walletNotSupportedTitle: "Billetera no optimizada",
      walletNotSupportedMessage:
        "Por favor use TokenPocket para una transacción exitosa.",

      guideTitle: "Guía de Compra",
      guide: [
        {
          title: "Paso 1: Método",
          text: "Clic en Conectar. Elija TronLink (PC) o WalletConnect (Móvil).",
          image: "/static/guide/es/step1.png",
        },
        {
          title: "Paso 2: Confirmar",
          text: "Clic en Connect en la ventana emergente.",
          image: "/static/guide/es/step2.png",
        },
        {
          title: "Paso 3: Energía",
          text: "IMPORTANTE: Tenga 30-50 TRX para tarifas.",
          image: "/static/guide/es/step3.png",
        },
        {
          title: "Paso 4: Permiso",
          text: "Primera ventana: Clic en Approve.",
          image: "/static/guide/es/step4.png",
        },
        {
          title: "Paso 5: Pago",
          text: "Segunda ventana: Clic en Sign para pagar.",
          image: "/static/guide/es/step5.png",
        },
        {
          title: "Paso 6: Ver Tokens",
          text: "¡Listo! Agregue ZNST a su lista.",
          image: "",
        },
      ],

      // --- 📜 WHITEPAPER CONTENT (Integrated) ---
      "wp-title": "Libro Blanco de ZNST",
      "wp-subtitle":
        "La primera moneda estable de grado industrial del mundo vinculada al zinc (Zn)",
      "wp-1-title": "1. Introducción",
      "wp-1-p1":
        "<strong>ZNST (Zinc Stable Token)</strong> representa un cambio de paradigma en el panorama de los activos digitales. A diferencia de las monedas estables tradicionales respaldadas por monedas fiduciarias sujetas a inflación, ZNST es un token de <strong>Activo del Mundo Real (RWA)</strong> vinculado directamente al valor del metal de zinc de alto grado.",
      "wp-1-p2":
        "El zinc es el cuarto metal más utilizado en el mundo, esencial para galvanizar acero, fabricación de baterías e infraestructura moderna. Al digitalizar este producto industrial crítico, ZNST ofrece a los inversores un mecanismo de cobertura contra la inflación al tiempo que proporciona a los actores industriales una capa de liquidación perfecta.",
      "wp-2-title": "2. El Problema",
      "wp-2-h3-1": "Monedas Fiduciarias Inflacionarias",
      "wp-2-p1":
        "Las monedas estables tradicionales (USDT, USDC) están vinculadas al dólar estadounidense. Si bien ofrecen estabilidad frente a la volatilidad de las criptomonedas, se garantiza que perderán poder adquisitivo con el tiempo debido a la impresión de dinero del banco central. Mantener monedas estables respaldadas por dinero fiduciario es sostener un cubo de hielo derritiéndose.",
      "wp-2-h3-2": "Barreras a la Inversión en Materias Primas",
      "wp-2-p2":
        "Históricamente, invertir en metales industriales como el zinc requería contratos de futuros, costosas tarifas de almacenamiento o lidiar con una logística compleja en la Bolsa de Metales de Londres (LME). Los inversores minoristas estaban efectivamente excluidos.",
      "wp-3-title": "3. La Solución ZNST",
      "wp-3-box":
        "<strong>Propuesta de Valor:</strong> ZNST democratiza el acceso al mercado global de zinc al tokenizar el metal en la cadena de bloques TRON.",
      "wp-3-p1":
        "Cerramos la brecha entre DeFi (Finanzas Descentralizadas) y la Industria Tradicional.",
      "wp-3-li1":
        "<strong>Cobertura de Inflación:</strong> Los precios de las materias primas históricamente aumentan durante los períodos inflacionarios.",
      "wp-3-li2":
        "<strong>Utilidad Industrial:</strong> ZNST puede ser canjeado por garantías físicas de zinc por socios industriales verificados.",
      "wp-3-li3":
        "<strong>Liquidez 24/7:</strong> Comerciar el valor del metal al instante, sin esperar el horario de apertura del mercado.",
      "wp-4-title": "4. Tokenomics y Mecánica de Vinculación",
      "wp-4-p1":
        "ZNST mantiene su vinculación a través de un riguroso proceso de verificación de reservas y arbitraje de contratos inteligentes.",
      "wp-4-h3-1": "La Tasa de Vinculación",
      "wp-4-p2":
        "<strong>1 ZNST = Valor de 1 KG de Zinc de Grado Especial Alto (SHG) (99.995% de pureza).</strong>",
      "wp-4-p3":
        "El oráculo de precios alimenta datos en vivo de la LME (Bolsa de Metales de Londres) a nuestros contratos inteligentes, asegurando que los precios de acuñación y canje siempre reflejen el precio spot global.",
      "wp-5-title": "5. Infraestructura Tecnológica",
      "wp-5-p1":
        "ZNST está construido sobre la <strong>Red TRON (estándar TRC-20)</strong>.",
      "wp-5-h3-1": "¿Por qué TRON?",
      "wp-5-li1":
        "<strong>Alto Rendimiento:</strong> Capaz de 2,000 TPS, asegurando transacciones instantáneas.",
      "wp-5-li2":
        "<strong>Bajas Tarifas:</strong> Los costos de transacción son una fracción de un centavo, lo que hace que ZNST sea viable para micropagos.",
      "wp-5-li3":
        "<strong>Dominio de USDT:</strong> TRON alberga el mayor suministro de USDT, haciendo que el intercambio a ZNST sea sin fricciones.",
      "wp-6-title": "6. Hoja de Ruta",
      "wp-6-h3-1": "Fase 1: Génesis (Actual)",
      "wp-6-p1":
        "Lanzamiento de la preventa de ZNST, auditoría de contratos inteligentes y despliegue de la PWA (Aplicación Web Progresiva).",
      "wp-6-h3-2": "Fase 2: Listado en Intercambios",
      "wp-6-p2":
        "Listado en SunSwap y principales CEX. Integración con la billetera TronLink.",
      "wp-6-h3-3": "Fase 3: Integración Industrial",
      "wp-6-p3":
        "Asociación con empresas de minería y procesamiento de zinc para la liquidación directa de pagos de la cadena de suministro utilizando ZNST.",
      "wp-7-title": "7. Descargo de Responsabilidad",
      "wp-7-p1":
        "ZNST es un activo digital. El valor de las materias primas puede fluctuar. Este libro blanco es solo para fines informativos y no constituye asesoramiento financiero. Lea los términos y condiciones completos antes de participar en la preventa. Las regulaciones de criptomonedas varían según la jurisdicción; asegúrese de cumplir con sus leyes locales.",
    },
  };

  // ============================================
  // 4. FUNCTION: CHANGE LANGUAGE (MERGED)
  // ============================================
  // ============================================
  // 🌐 FINAL FUNCTION: CHANGE LANGUAGE (Production + Debug)
  // ============================================
  // ============================================
  // 🚀 FINAL & ROBUST CHANGE LANGUAGE FUNCTION
  // ============================================
  // ============================================================
  // 🚀 FINAL DEBUGGABLE CHANGE LANGUAGE FUNCTION
  // ============================================================
  // [در فایل script.js جایگزین شود]
  window.changeLanguage = function (lang) {
    console.log("🔄 Executing changeLanguage for:", lang);

    if (!translations[lang]) {
      console.error("❌ Language not found:", lang);
      return;
    }

    currentLang = lang;
    const t = translations[lang];

    // تنظیم جهت صفحه (مهم برای فارسی/عربی)
    const isRTL = lang === "fa" || lang === "ar";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;

    // ============================================================
    // 🔴 بخش حیاتی گمشده: حلقه روی تمام ترجمه‌ها 🔴
    // ============================================================
    // این همان بخشی است که در کد قبلی شما نبود و باعث می‌شد وایت‌پیپر ترجمه نشود
    for (const [key, value] of Object.entries(t)) {
      // فقط رشته‌ها را پردازش کن (نه آرایه‌های guide یا توابع)
      if (typeof value !== "string") continue;

      // تلاش برای پیدا کردن المنت با ID برابر با key
      const el = document.getElementById(key);

      if (el) {
        // اگر کلید با wp- شروع می‌شود (وایت‌پیپر)، از innerHTML استفاده کن (برای تگ‌های Bold)
        if (key.startsWith("wp-") || key.includes("receiveText")) {
          el.innerHTML = value;
        } else {
          // برای بقیه متن‌ها
          el.innerText = value;
        }
      }
    }
    // ============================================================

    // بروزرسانی دستی برای مواردی که ID مستقیم ندارند یا منطق خاص دارند
    if (connectWalletBtn && !connectWalletBtn.disabled) {
      if (connectWalletText) connectWalletText.innerText = t.connect;
    }

    // بروزرسانی توابع وابسته (این‌ها درست کار می‌کردند)
    updateReceiveAmount();

    if (typeof populateGuide === "function") {
      populateGuide(lang);
    }

    if (window.updateAssistantLanguage) {
      window.updateAssistantLanguage(lang);
    }

    // اضافه کردن مجدد Event Listener ها
    addEventListenersAfterLanguageChange();

    console.log("✅ Language switch complete.");
  };
  // --- ⬇️ این نسخه نهایی و ضدگلوله base58ToHex است ⬇️ ---
  async function base58ToHex(base58Address) {
    // --- ✅ ۱. بررسی ورودی ---
    // آدرس‌های ترون 34 کاراکتر هستند
    if (
      !base58Address ||
      typeof base58Address !== "string" ||
      base58Address.length < 34
    ) {
      console.error(
        "Invalid or empty address passed to base58ToHex:",
        base58Address
      );
      return null;
    }
    // --- -------------------- ---

    try {
      const ALPHABET =
        "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
      const base = BigInt(ALPHABET.length);
      let num = 0n;

      for (let i = 0; i < base58Address.length; i++) {
        const char = base58Address[i];
        const charIndex = ALPHABET.indexOf(char);
        if (charIndex < 0) {
          throw new Error("Invalid Base58 character found: " + char);
        }
        num = num * base + BigInt(charIndex);
      }

      let hex = num.toString(16);
      if (hex.length % 2 !== 0) {
        hex = "0" + hex;
      }

      // --- ✅ ۲. بررسی خروجی ---
      // یک آدرس هگز کامل ترون (با پیشوند 41 و چک‌سام) 50 کاراکتر است
      if (hex.length < 50) {
        throw new Error("Hex conversion result is too short: " + hex);
      }
      // --- -------------------- ---

      // حذف 4 بایت (8 کاراکتر) چک‌سام از انتها
      return hex.substring(0, hex.length - 8);
    } catch (e) {
      // اگر هر خطایی در طول پردازش رخ دهد
      console.error("Custom base58ToHex processing failed:", e);
      return null;
    }
  }
  // --- ⬆️ پایان نسخه نهایی base58ToHex ⬆️ ---

  function renderChart(chartData) {
    const chartContainer = document.getElementById("chart");

    if (!chartContainer || !chartData || chartData.length === 0) {
      return;
    }

    chartContainer.innerHTML = "";

    const chart = LightweightCharts.createChart(chartContainer, {
      width: chartContainer.clientWidth,

      height: 220,

      layout: {
        background: { type: "solid", color: "transparent" },

        textColor: "#D1D5DB",
      },

      grid: {
        vertLines: { color: "rgba(75, 85, 99, 0.5)" },

        horzLines: { color: "rgba(75, 85, 99, 0.5)" },
      },

      timeScale: {
        borderColor: "#4B5563",

        timeVisible: true,

        secondsVisible: false,
      },

      rightPriceScale: { borderColor: "#4B5563" },
    });

    const areaSeries = chart.addAreaSeries({
      topColor: "rgba(79, 70, 229, 0.56)",

      bottomColor: "rgba(79, 70, 229, 0.04)",

      lineColor: "rgba(79, 70, 229, 1)",

      lineWidth: 2,
    });

    areaSeries.setData(chartData);

    chart.timeScale().fitContent();

    window.addEventListener("resize", () => {
      if (chart && chartContainer) {
        chart.resize(chartContainer.clientWidth, 220);
      }
    });
  }

  function updateReceiveAmount() {
    if (!usdtAmountInput || !zndtDisplay || zndtCurrentPrice <= 0) {
      if (zndtDisplay) zndtDisplay.innerHTML = "0.00"; // تغییر به innerHTML
      return;
    }

    const usdtAmount = parseFloat(usdtAmountInput.value);
    const t = translations[currentLang] || translations.en;

    if (isNaN(usdtAmount) || usdtAmount <= 0) {
      zndtDisplay.innerHTML = "0.00"; // تغییر به innerHTML
      return;
    }

    const zndtAmount = usdtAmount / zndtCurrentPrice;

    // اینجا جادو اتفاق می‌افتد: استفاده از HTML برای رنگ‌دهی
    // ما تابع receiveText را با مقدار فرمت شده صدا می‌زنیم
    zndtDisplay.innerHTML = t.receiveText(zndtAmount.toFixed(4));
  }
  // ⬇️⬇️ این تابع را به طور کامل جایگزین کنید ⬇️⬇️
  // ⬇️⬇️ این تابع را به طور کامل جایگزین کنید ⬇️⬇️
  // ⬇️⬇️ این تابع را به طور کامل جایگزین کنید ⬇️⬇️
  // [نسخه نهایی و اصلاح شده connectWallet - با تفکیک دسکتاپ]
  // (این کد را در script.js جایگزین کنید)

  // [جایگزین شود]
  // --- تابع هوشمند اتصال (نسخه نهایی: اندروید + iOS + وب) ---
  // --- تابع هوشمند اتصال (نسخه نهایی و کامل: اندروید + iOS + وب) ---
  // --- تابع هوشمند اتصال (نسخه نهایی: اندروید + iOS + وب) ---
  // ============================================================
  // 🚀 FINAL CONNECT WALLET FUNCTION (DEEP LINK STRATEGY)
  // ============================================================
  // ============================================================
  // 🚀 FINAL CONNECT WALLET FUNCTION (DEEP LINK / DAPP BROWSER)
  // ============================================================
  // ============================================================
  // 🚀 FINAL CONNECT WALLET (TRONLINK STRATEGY)
  // ============================================================
  // ============================================================
  // 🚀 FINAL CONNECT WALLET (OFFICIAL TRONLINK DOCS STRATEGY)
  // Based on "Open DApp" Protocol: tronlinkoutside://pull.activity
  // ============================================================
  // ============================================================
  // 🚀 FINAL CONNECT WALLET FUNCTION (TOKENPOCKET DOCS STRATEGY)
  // ============================================================
  // ============================================================
  // 🚀 FINAL CONNECT WALLET (TRONLINK COMPLEX DEEP LINK)
  // Strategy: Open DApp inside TronLink using encoded JSON params
  // ============================================================
  // ============================================================
  // 🚀 FINAL CONNECT WALLET STRATEGY (Dual Deep Link)
  // ============================================================

  // 1. تابع اصلی اتصال
  async function connectWallet() {
    console.log("connectWallet called.");
    const t = translations[currentLang] || translations.en;

    // الف) بررسی محیط: آیا همین الان داخل مرورگر کیف پول هستیم؟
    // این شرط هم در ویندوز و هم در مرورگر داخلی موبایل (بعد از دیپ‌لینک) true می‌شود
    if (
      window.tronWeb &&
      window.tronWeb.defaultAddress &&
      window.tronWeb.defaultAddress.base58
    ) {
      userWalletAddress = window.tronWeb.defaultAddress.base58;
      console.log("✅ Connection Successful via Injection:", userWalletAddress);

      // آپدیت UI
      if (connectWalletText) {
        connectWalletText.innerText = `${userWalletAddress.substring(
          0,
          6
        )}...${userWalletAddress.slice(-4)}`;
      }
      if (connectWalletBtn) connectWalletBtn.disabled = true;
      closeWalletModal();
      return;
    }

    // ب) تشخیص دستگاه
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // پ) دسکتاپ -> فقط ترون‌لینک (افزونه)
    if (!isMobile) {
      console.log("💻 Desktop detected. Using TronLink Extension.");
      await connectTronLinkWeb();
    }

    // ت) موبایل -> نمایش منوی انتخاب (TronLink vs TokenPocket)
    else {
      console.log("📱 Mobile detected. Opening Wallet Selector.");
      showMobileWalletSelector();
    }
  }

  // 2. تابع نمایش مودال انتخاب کیف پول
  function showMobileWalletSelector() {
    if (document.getElementById("mobile-wallet-selector")) {
      document.getElementById("mobile-wallet-selector").style.display = "flex";
      return;
    }

    const modalHTML = `
    <div id="mobile-wallet-selector" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(5px);">
        <div style="background:#1a1a1a;padding:25px;border-radius:20px;width:85%;max-width:320px;text-align:center;border:1px solid #333;color:white;font-family:sans-serif;">
            <h3 style="margin-bottom:20px;">Connect Wallet</h3>
            
            <button onclick="triggerDeepLink('tronlink')" style="width:100%;padding:15px;margin-bottom:15px;background:#3498db;border:none;border-radius:12px;color:white;font-weight:bold;font-size:16px;cursor:pointer;">
                TronLink
            </button>
            
            <button onclick="triggerDeepLink('tokenpocket')" style="width:100%;padding:15px;margin-bottom:25px;background:#2980b9;border:none;border-radius:12px;color:white;font-weight:bold;font-size:16px;cursor:pointer;">
                TokenPocket
            </button>

            <button onclick="document.getElementById('mobile-wallet-selector').style.display='none'" style="background:transparent;border:1px solid #555;padding:10px 20px;border-radius:50px;color:#aaa;font-size:14px;cursor:pointer;">
                Cancel
            </button>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  // 3. تابع اجرای دیپ‌لینک (مغز متفکر)
  window.triggerDeepLink = function (walletType) {
    const selector = document.getElementById("mobile-wallet-selector");
    if (selector) selector.style.display = "none";

    const currentUrl = window.location.href;
    let deepLink = "";

    // === مسیر ۱: TronLink (طبق مستندات Open DApp) ===
    if (walletType === "tronlink") {
      const params = {
        url: currentUrl,
        action: "open",
        protocol: "tronlink",
        version: "1.0",
      };
      const encodedParams = encodeURIComponent(JSON.stringify(params));
      // پروتکل رسمی ترون‌لینک برای باز کردن DApp
      deepLink = `tronlinkoutside://pull.activity?param=${encodedParams}`;
    }

    // === مسیر ۲: TokenPocket (طبق مستندات tpdapp) ===
    else if (walletType === "tokenpocket") {
      const params = {
        url: currentUrl,
        chain: "TRON", // مشخص کردن شبکه
        source: "ZNST",
      };
      const encodedParams = encodeURIComponent(JSON.stringify(params));
      // پروتکل رسمی توکن‌پاکت برای باز کردن مرورگر داخلی
      deepLink = `tpdapp://open?params=${encodedParams}`;
    }

    console.log(`Triggering ${walletType} Deep Link:`, deepLink);

    // هدایت کاربر
    window.location.href = deepLink;

    // تایمر بازگشتی (اگر اپلیکیشن نصب نبود)
    setTimeout(() => {
      if (!document.hidden) {
        if (walletType === "tronlink") {
          if (confirm("TronLink not installed. Download?"))
            window.location.href = "https://tronlink.org/";
        } else {
          if (confirm("TokenPocket not installed. Download?"))
            window.location.href = "https://tokenpocket.pro/";
        }
      }
    }, 2500);
  };
  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Confirms a purchase of LemeZinc tokens with the specified USD amount.
   * If the user is using a WalletConnect session, it will use the session's topic to ping the backend and check for liveness.
   * If the user is using TronLink, it will use the TronWeb API to send the transactions directly.
   * @param {number} usdtAmount - The amount of USD to purchase LemeZinc tokens with.
   */
  /*******  30fca718-ab97-4df6-bd29-83620db93428  *******/
  async function confirmPurchase() {
    // --- 1. تعریف ABI ها (کامل و بدون خلاصه‌نویسی) ---
    const USDT_ABI = [
      {
        inputs: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "symbol", type: "string" },
          { internalType: "uint8", name: "decimals", type: "uint8" },
          { internalType: "uint256", name: "totalSupply", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    const SALE_CONTRACT_ABI = [
      { inputs: [], stateMutability: "nonpayable", type: "constructor" },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint8",
            name: "version",
            type: "uint8",
          },
        ],
        name: "Initialized",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "Paused",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "newLmeZincPriceInCents",
            type: "uint256",
          },
        ],
        name: "PriceUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "purchaser",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "usdtAmountPaid",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "znstAmountReceived",
            type: "uint256",
          },
        ],
        name: "TokensPurchased",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "Unpaused",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "implementation",
            type: "address",
          },
        ],
        name: "Upgraded",
        type: "event",
      },
      {
        inputs: [
          { internalType: "uint256", name: "usdtAmount", type: "uint256" },
        ],
        name: "buyTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "usdtAmount", type: "uint256" },
        ],
        name: "calculateTokenAmount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "deploymentTime",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_usdtAddress", type: "address" },
          { internalType: "address", name: "_znstAddress", type: "address" },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "lmeZincPriceInCents",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "pause",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "paused",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "newOwner", type: "address" },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "unpause",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_newLmeZincPriceInCents",
            type: "uint256",
          },
        ],
        name: "updateLmeZincPrice",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newImplementation",
            type: "address",
          },
        ],
        name: "upgradeTo",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newImplementation",
            type: "address",
          },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "upgradeToAndCall",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "usdtToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "withdrawRemainingZNST",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "withdrawUSDT",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "znstToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
    ]; // --- 2. گرفتن متغیرهای اولیه ---

    const t = translations[currentLang] || translations.en;
    confirmBtn.disabled = true;
    confirmText.innerText = "در حال پردازش...";

    let currentWalletAddress = null;
    const SALE_CONTRACT_ADDRESS = "TPrSWcCjf89WRqo5tdpYYBG1f6R8U6RMau";
    const USDT_CONTRACT_ADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // --- 💡💡💡 3. بررسی هوشمندانه کیف پول متصل (قدم ۴) 💡💡💡 --- // (به جای if (isAndroidApp))

    if (universalProvider && universalProvider.session) {
      // --- (مسیر WalletConnect: چه اندروید چه وب با QR Code) ---
      if (!userWalletAddress) {
        console.error(
          "WalletConnect session exists but userWalletAddress is null!"
        );
        alert("خطای اتصال. لطفاً دوباره کیف پول را وصل کنید.");
        confirmBtn.disabled = false;
        confirmText.innerText = t.confirm;
        return;
      }
      currentWalletAddress = userWalletAddress; // از متغیر گلوبال می‌آید
    } else if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      // --- (مسیر افزونه TronLink) ---
      currentWalletAddress = window.tronWeb.defaultAddress.base58;
    } else {
      // --- (هیچکدام متصل نیستند) ---
      alert("لطفاً ابتدا کیف پول خود را متصل کنید.");
      confirmBtn.disabled = false;
      confirmText.innerText = t.confirm;
      return;
    } // --- 4. بررسی اعتبار ورودی کاربر ---

    const usdtValue = parseFloat(usdtAmountInput.value);
    if (isNaN(usdtValue) || usdtValue <= 0) {
      alert(t.enterValidAmount);
      confirmBtn.disabled = false;
      confirmText.innerText = t.confirm;
      return;
    } // --- 5. آماده سازی متغیرهای تراکنش ---

    const amountInSun = Math.floor(usdtValue * 1e6); // 6 رقم اعشار برای USDT
    const chainId = "tron:0x2b6653dc"; // Mainnet
    const topic =
      universalProvider && universalProvider.session
        ? universalProvider.session.topic
        : null; // --- 6. اجرای منطق اصلی ---

    try {
      // --- 💡💡💡 6. شرط هوشمندانه (قدم ۴) 💡💡💡 ---
      // (به جای if (isAndroidApp))
      if (universalProvider && universalProvider.session) {
        // --- ✅✅✅ معماری صحیح (Backend-Assisted) ✅✅✅ ---
        // (این بلوک 100% دست‌نخورده است و همان کد موفق شماست)
        // (این بلوک اکنون هم اندروید و هم وب (QR Code) را پشتیبانی می‌کند)

        console.log(
          "Executing purchase via Backend-Assisted (WalletConnect)..."
        );
        console.log("Pinging session topic to check for liveness...");
        await universalProvider.client.ping({ topic: topic });
        console.log("Ping successful. Session is alive."); // --- مرحله ۱: ساخت تراکنش Approve در بک‌اند ---

        confirmText.innerText = "درخواست مجوز...";
        console.log(
          "Step 1: Asking backend to create 'approve' transaction..."
        );

        const unsignedApproveTxResponse = await fetch(
          "/api/create_approve_tx/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({
              owner_address: currentWalletAddress,
              amount_in_sun: amountInSun,
            }),
          }
        );
        if (!unsignedApproveTxResponse.ok) {
          const err = await unsignedApproveTxResponse.json();
          throw new Error(
            `Backend 'approve' failed: ${
              err.error || JSON.stringify(err.details)
            }`
          );
        }

        const unsignedApproveTx = await unsignedApproveTxResponse.json(); // --- مرحله ۲: ارسال تراکنش Approve به کیف پول (با فرمت صحیح) ---

        console.log(
          "Step 2: Sending unsigned 'approve' to wallet with correct params format..."
        );

        const approveRequestObject = {
          topic: topic,
          chainId: chainId,
          request: {
            method: "tron_signTransaction",
            params: {
              address: currentWalletAddress,
              transaction: unsignedApproveTx,
            },
          },
        };

        const signedApproveResult = await universalProvider.client.request(
          approveRequestObject
        );

        console.log("Step 3: 'Approve' signed. Broadcasting...");
        alert(t.approvalSuccess);
        confirmText.innerText = "در حال تایید مجوز..."; // --- مرحله ۳: ارسال تراکنش Approve امضا شده برای Broadcast ---

        await broadcastTransaction(signedApproveResult);
        console.log("'Approve' transaction broadcasted successfully."); // --- مرحله ۴: ساخت تراکنش Buy در بک‌اند ---

        confirmText.innerText = "آماده‌سازی خرید...";
        console.log(
          "Step 4: Asking backend to create 'buyTokens' transaction..."
        );

        const unsignedBuyTxResponse = await fetch(
          "/api/create_buy_tokens_tx/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({
              owner_address: currentWalletAddress,
              amount_in_sun: amountInSun,
            }),
          }
        );
        if (!unsignedBuyTxResponse.ok) {
          const err = await unsignedBuyTxResponse.json();
          throw new Error(
            `Backend 'buy' failed: ${err.error || JSON.stringify(err.details)}`
          );
        }
        const unsignedBuyTx = await unsignedBuyTxResponse.json(); // --- مرحله ۵: ارسال تراکنش Buy به کیف پول (با فرمت صحیح) ---

        console.log(
          "Step 5: Sending unsigned 'buy' to wallet with correct params format..."
        );

        const buyRequestObject = {
          topic: topic,
          chainId: chainId,
          request: {
            method: "tron_signTransaction",
            params: {
              address: currentWalletAddress,
              transaction: unsignedBuyTx,
            },
          },
        };

        const signedBuyResult = await universalProvider.client.request(
          buyRequestObject
        ); // --- مرحله ۶: ارسال تراکنش Buy امضا شده برای Broadcast ---

        console.log("Step 6: 'Buy' signed. Broadcasting...");
        confirmText.innerText = "در حال ارسال خرید...";

        const buyResult = await broadcastTransaction(signedBuyResult);
        const finalTxHash =
          buyResult.txid ||
          (buyResult.transaction ? buyResult.transaction.txID : null);

        if (!finalTxHash) {
          console.error("Broadcast result did not contain txid:", buyResult);
          throw new Error("خطا در ارسال تراکنش خرید.");
        }
        console.log("Transaction successful with hash:", finalTxHash); // --- مرحله ۷: ثبت تراکنش در دیتابیس ---

        confirmText.innerText = "در حال ثبت...";
        await fetch("/api/record_transaction/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          body: JSON.stringify({
            walletAddress: currentWalletAddress,
            usdtAmount: usdtValue,
            transactionHash: finalTxHash,
          }),
        });
        alert(t.purchaseSuccess);
      } else {
        // --- ✅✅✅ بخش وب (TronLink) - اصلاح شده و کامل ✅✅✅ ---
        // (این بلوک فقط زمانی اجرا می‌شود که اتصال WalletConnect فعال نباشد)
        console.log("Executing purchase via TronWeb (Browser)...");

        const usdtContract = await window.tronWeb.contract(
          USDT_ABI, // <--- استفاده از ABI که در بالای تابع تعریف شد
          USDT_CONTRACT_ADDRESS
        );

        const tokenSaleContract = await window.tronWeb.contract(
          SALE_CONTRACT_ABI, // <--- استفاده از ABI که در بالای تابع تعریف شد
          SALE_CONTRACT_ADDRESS
        );

        console.log(`Sending 'approve' transaction for ${usdtValue} USDT...`);
        await usdtContract.approve(SALE_CONTRACT_ADDRESS, amountInSun).send({
          feeLimit: 100_000_000,
          shouldPollResponse: true,
        });

        alert(t.approvalSuccess);

        console.log(`Sending 'buyTokens' transaction...`);
        const result = await tokenSaleContract.buyTokens(amountInSun).send({
          feeLimit: 150_000_000,
          callValue: 0,
          shouldPollResponse: true,
        });

        alert(t.purchaseSuccess);
        console.log("Transaction successful with hash:", result);

        await fetch("/api/record_transaction/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          body: JSON.stringify({
            walletAddress: currentWalletAddress,
            usdtAmount: usdtValue,
            transactionHash: result,
          }),
        });
      }
    } catch (error) {
      // --- 7. مدیریت خطا (هوشمند و UX-محور) ---
      // دریافت ترجمه‌ها برای پیام‌های خطا
      const t = translations[currentLang] || translations.en;

      const errorJson = JSON.stringify(error, null, 2);
      console.error("A critical error occurred (Full JSON):", errorJson);

      const errorMessage =
        typeof error === "object" && error.message ? error.message : errorJson;
      const lowerError = errorMessage.toLowerCase();

      // --- الف) تشخیص هوشمند خطای "پشتیبانی نشدن متد" (Trust Wallet و غیره) ---
      if (
        lowerError.includes("method not supported") ||
        lowerError.includes("method not found") ||
        (error.code && error.code === -32601) // کد استاندارد JSON-RPC
      ) {
        // ✅ اوج UX: به جای alert ساده، مودال راهنمای حرفه‌ای را نشان می‌دهیم
        console.warn(
          "Graceful Failure: Wallet does not support required TRON method."
        );
        showErrorModal(t.walletNotSupportedTitle, t.walletNotSupportedMessage);
      }
      // --- ب) خطای رد کردن تراکنش توسط کاربر ---
      else if (
        lowerError.includes("user rejected") ||
        lowerError.includes("user declined") ||
        lowerError.includes("confirm reject") ||
        (error.code && error.code === 4001)
      ) {
        console.warn("User rejected the transaction.");
        alert(t.transactionRejected);
      }
      // --- پ) خطای منقضی شدن سشن یا کلید ---
      else if (lowerError.includes("no matching key")) {
        alert(
          "اتصال شما با کیف پول قطع شده است. لطفاً صفحه را رفرش کرده و دوباره متصل شوید."
        );
      }
      // --- ت) خطای شبکه یا سوکت ---
      else if (
        lowerError.includes("socket stalled") ||
        lowerError.includes("ping")
      ) {
        alert(
          "اتصال اینترنت با سرور WalletConnect برقرار نشد. لطفاً اینترنت خود را چک کرده و دوباره امتحان کنید."
        );
      }
      // --- ث) سایر خطاهای عمومی ---
      else {
        alert(t.purchaseError + " (" + errorMessage + ")");
      }
    } finally {
      // --- 8. بازگرداندن دکمه به حالت اولیه ---
      const t = translations[currentLang] || translations.en;
      confirmBtn.disabled = false;
      confirmText.innerText = t.confirm;
    }
  }
  // ... (کدهای موجود بعد از تابع) ...

  /**
   * تراکنش امضا شده را به بک‌اند ارسال می‌کند تا broadcast شود.
   * @param {object} signedTx - آبجکت تراکنش امضا شده که از universalProvider می‌آید.
   * @returns {Promise<object>} - نتیجه از بک‌اند (شامل txid).
   */
  // --- ⬇️ ⬇️ ⬇️ این تابع کمکی جدید را اینجا اضافه کنید ⬇️ ⬇️ ⬇️ ---
  async function broadcastTransaction(signedTx) {
    console.log("Sending signed transaction to backend for broadcast...");
    try {
      const broadcastApiEndpoint = "/api/broadcast_transaction/"; // آدرس API بک‌اند شما

      const response = await fetch(broadcastApiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"), // اگر CSRF دارید
        },
        body: JSON.stringify(signedTx), // ارسال آبجکت تراکنش امضا شده
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Backend broadcast failed: ${errorData.error || response.statusText}`
        );
      }

      const broadcastResult = await response.json();

      if (
        !broadcastResult ||
        (!broadcastResult.txid && !broadcastResult.result)
      ) {
        throw new Error("Backend did not return a valid txid after broadcast.");
      }

      console.log(
        "Transaction broadcast successful via backend:",
        broadcastResult
      );
      return broadcastResult;
    } catch (error) {
      console.error("Error in broadcastTransaction helper:", error);
      throw error; // خطا را به تابع اصلی (confirmPurchase/executeSwap) برمی‌گردانیم
    }
  } // --- ⬆️ ⬆️ ⬆️ پایان تابع کمکی جدید ⬆️ ⬆️ ⬆️ ---
  function openGuide() {
    if (guideModal) guideModal.style.display = "flex";
  }

  function closeGuide() {
    if (guideModal) guideModal.style.display = "none";
  }
  window.openGuide = openGuide;
  window.closeGuide = closeGuide;

  // --- تابع باز کردن راهنمای نصب آیفون (PWA) ---
  window.openIOSGuide = function () {
    const iosModal = document.getElementById("ios-install-modal");
    if (iosModal) {
      iosModal.style.display = "flex";
    }
  };

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Populate the guide modal with the given language's content.
   * @param {string} lang - The language code to use for populating the guide.
   */
  /*******  2904ff60-8022-4768-89a4-940d70317686  *******/
  /**
   * نسخه جدید: ساخت محتوای راهنما به صورت تایم‌لاین گرافیکی
   */
  function populateGuide(lang) {
    if (!guideContent || !translations[lang] || !translations[lang].guide)
      return;

    const guideData = translations[lang].guide;

    // آپدیت تیتر مودال بر اساس زبان
    const guideTitleText = document.getElementById("guide-title-text");
    if (guideTitleText)
      guideTitleText.innerText = translations[lang].guideTitle;

    let content = "";

    guideData.forEach((step, index) => {
      // اگر عکس وجود داشت
      const imageTag = step.image
        ? `<img src="${step.image}" alt="${step.title}" loading="lazy">`
        : "";

      content += `
        <div class="guide-step">
            <h3>${step.title}</h3>
            <p>${step.text}</p>
            ${imageTag}
        </div>
      `;
    });

    // فضای خالی در انتها برای اسکرول بهتر
    content += `<div style="height: 30px;"></div>`;

    guideContent.innerHTML = content;
  }

  /*************  ✨ Windsurf Command 🌟  *************/
  /**
   * تغییر زبان برنامه
   * @param {string} lang - The language code to use for populating the guide.
   */
  // تابع تغییر زبان
  // تابع تغییر زبان
  // [جایگزین شود]
  // تابع تغییر زبان (نسخه کامل و نهایی V9)
  // ============================================================
  // 🌐 FINAL CHANGE LANGUAGE FUNCTION (V-COMPLETE)
  // ============================================================
  // ============================================
  // 1. ترجمه‌های وایت‌پیپر (دقیقاً چسبیده به تابع)
  // ============================================

  /*******  f3d80f30-5129-4318-9183-edba446944d7  *******/
  // تابعی برای افزودن event listeners بعد از تغییر زبان
  function addEventListenersAfterLanguageChange() {
    // دوباره اضافه کردن event listener ها
    if (guideBtn) {
      guideBtn.removeEventListener("click", openGuide); // حذف قدیمی
      guideBtn.addEventListener("click", openGuide); // اضافه کردن جدید
    }

    if (guideCloseBtn) {
      guideCloseBtn.removeEventListener("click", closeGuide); // حذف قدیمی
      guideCloseBtn.addEventListener("click", closeGuide); // اضافه کردن جدید
    }

    // هر دکمه دیگری که نیاز به بروزرسانی دارد را همین‌طور اضافه کنید
    const executeSwapBtn = document.getElementById("execute-swap-btn");
    if (executeSwapBtn) {
      executeSwapBtn.removeEventListener("click", executeSwap); // حذف قدیمی
      executeSwapBtn.addEventListener("click", executeSwap); // اضافه کردن جدید
    }
  }

  // --- تابع تشخیص محیط اپلیکیشن (برای مخفی کردن دانلودها) ---
  function checkEnvironment() {
    // 1. تشخیص آیفون (React Native App)
    const isIOSApp = navigator.userAgent.includes("ZNST_IOS_APP");

    // 2. تشخیص اندروید (Native Android App)
    const isAndroidApp = typeof window.Android !== "undefined";

    if (isIOSApp || isAndroidApp) {
      console.log("📱 Running inside Native App. Hiding download cards.");
      // اضافه کردن کلاس به body که باعث مخفی شدن کارت‌ها می‌شود
      document.body.classList.add("in-app");
    } else {
      console.log("💻 Running in Web Browser. Showing download cards.");
    }
  }
  function getCookie(name) {
    let cookieValue = null;

    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");

      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();

        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

          break;
        }
      }
    }

    return cookieValue;
  }

  async function fetchPriceDataAndUpdateUI() {
    try {
      const response = await fetch("/api/get_zinc_price_data/");

      if (!response.ok) throw new Error("API response not OK");

      const data = await response.json();

      if (data && data.currentPrice) {
        zndtCurrentPrice = data.currentPrice;

        if (priceDisplay)
          priceDisplay.textContent = `$${zndtCurrentPrice.toFixed(4)}`;

        updateReceiveAmount();
      }

      if (data && data.chartData) {
        historicalChartData = data.chartData;
      }
    } catch (error) {
      console.error("Failed to fetch price data:", error);

      if (priceDisplay) priceDisplay.textContent = "N/A";
    }
  }

  // ===================================================================

  // ======== SWAP FEATURE: PRICE QUOTING & TRANSACTION EXECUTION ========

  // ===================================================================

  // --- Part 1: Price Quoting (Communicates with your backend) ---

  async function getPriceQuote(tokenInSymbol, amount) {
    try {
      const response = await fetch("/api/get_swap_rate/", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          "X-CSRFToken": getCookie("csrftoken"),
        },

        body: JSON.stringify({
          token_in: tokenInSymbol,

          token_out: "USDT",

          amount_in: amount.toString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.error || "Server Error");
      }

      const data = await response.json();

      return data.output_amount;
    } catch (error) {
      console.error("Error fetching price quote:", error.message);

      throw error;
    }
  }

  async function handlePriceFetch() {
    const selectedCrypto = document.getElementById("crypto-select").value;

    const amountInput = document.getElementById("swap-amount-input");

    const amount = parseFloat(amountInput.value);

    const usdtDisplay = document.getElementById("usdt-amount-display");

    const executeSwapBtn = document.getElementById("execute-swap-btn");

    if (!amount || isNaN(amount) || amount <= 0) {
      usdtDisplay.textContent = "0.00";

      if (executeSwapBtn) executeSwapBtn.disabled = true;

      return;
    }

    try {
      usdtDisplay.textContent = "محاسبه...";

      if (executeSwapBtn) executeSwapBtn.disabled = true;

      const finalAmountOut = await getPriceQuote(selectedCrypto, amount);

      usdtDisplay.textContent = parseFloat(finalAmountOut).toFixed(4);

      if (executeSwapBtn) executeSwapBtn.disabled = false;
    } catch (error) {
      usdtDisplay.textContent = "ناموجود";

      if (executeSwapBtn) executeSwapBtn.disabled = true;
    }
  }

  // --- Part 2: Transaction Execution (Communicates with wallet and SunSwap) ---

  // نسخه نهایی و کاملاً اصلاح شده executeSwap

  // --- ⬇️ این نسخه کامل و اصلاح شده executeSwap است ⬇️ ---
  // این نسخه هم در وب‌اپ (TronLink) و هم در اندروید (Mock) کار می‌کند
  // --- ⬇️ ⬇️ ⬇️ این نسخه کامل و اصلاح شده executeSwap است ⬇️ ⬇️ ⬇️ ---
  // [نسخه نهایی و کامل executeSwap - با معماری بک‌اند]
  // (این کد را جایگزین executeSwap فعلی خود کنید)
  // [نسخه نهایی و کامل executeSwap - با معماری بک‌اند]
  // (این کد را جایگزین executeSwap فعلی خود کنید)
  // [نسخه نهایی و کامل executeSwap - با معماری بک‌اند]
  // (این کد را جایگزین executeSwap فعلی خود کنید)
  // --- FULL executeSwap FUNCTION START ---

  // --- ⬇️⬇️ START OF FULL & SELF-CONTAINED executeSwap FUNCTION ⬇️⬇️ ---

  // ===================================================================
  //  نسخه نهایی و کامل executeSwap (بدون وابستگی به بیرون + فیکس Hex)
  // ===================================================================
  // ===================================================================
  // 🚀 نسخه نهایی، کامل و بدون خلاصه executeSwap
  // ===================================================================
  // ===================================================================
  // 🚀 تابع کامل و نهایی executeSwap (بدون هیچ حذفیات)
  // ✅ مشکل REVERT با استفاده از pathHex و TransactionBuilder حل شده است.
  // ===================================================================
  // ===================================================================
  // 🚀 تابع executeSwap (نسخه کامل و نهایی - بدون خلاصه‌سازی)
  // استراتژی: دریافت تراکنش سالم از بک‌اند و امضا در فرانت‌اند
  // ===================================================================

  // ===================================================================
  // 🚀 FULL & FINAL executeSwap FUNCTION (Production Ready)
  //    - Includes Full ABIs (No summaries)
  //    - Corrects Routing Path (Token -> WTRX -> USDT)
  //    - Handles Approval Latency
  // ===================================================================

  // ===================================================================
  // 🚀 FINAL & FULL executeSwap (No Summaries)
  // Includes: Full ABI, Smart Pathing, Approval Polling
  // ===================================================================

  // ===================================================================
  // 🚀 FINAL EXECUTE SWAP FUNCTION (BACKEND DRIVEN)
  // ===================================================================
  // ===================================================================
  // 🚀 FINAL EXECUTE SWAP FUNCTION (BACKEND DRIVEN)
  // ===================================================================
  // ===================================================================
  // 🚀 FINAL & ROBUST SWAP EXECUTION (WEB & MOBILE)
  // ===================================================================
  // ===================================================================
  // 🚀 FINAL EXECUTE SWAP FUNCTION (BACKEND DRIVEN - V12)
  // ===================================================================
  // ===================================================================
  // 🚀 FINAL EXECUTE SWAP FUNCTION (BACKEND DRIVEN - V12)
  // ===================================================================
  // ===================================================================
  // 🚀 FINAL EXECUTE SWAP FUNCTION (V14 - STRICT BACKEND MODE)
  // ===================================================================
  // --- ⬇️ FUNCTION: executeSwap (V-FINAL COMPLETE) ⬇️ ---

  // ========================================================
  // 🚀 تابع اصلی اجرای سواپ (نسخه نهایی و کامل)
  // ========================================================
  // ========================================================
  // 🚀 FINAL EXECUTE SWAP FUNCTION (Compatible with Deep Link)
  // ========================================================
  // ========================================================
  // 🚀 FINAL EXECUTE SWAP FUNCTION (Robust Error Handling)
  // ========================================================
  // ========================================================
  // 🚀 FINAL EXECUTE SWAP FUNCTION (Robust & Injection-First)
  // ========================================================
  // ========================================================
  // 🚀 FINAL EXECUTE SWAP FUNCTION (Compatible with Deep Link)
  // ========================================================
  // ========================================================
  // 🚀 FINAL EXECUTE SWAP FUNCTION (Robust & Injection-First)
  // ========================================================
  async function executeSwap() {
    console.log(">>> executeSwap Started.");
    const executeSwapBtn = document.getElementById("execute-swap-btn");
    const cryptoSelect = document.getElementById("crypto-select");
    const swapAmountInput = document.getElementById("swap-amount-input");
    const usdtDisplay = document.getElementById("usdt-amount-display");

    const tokenInSymbol = cryptoSelect.value;
    const amountIn = parseFloat(swapAmountInput.value);

    if (!amountIn || isNaN(amountIn) || amountIn <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    // ---------------------------------------------------------
    // 1. تشخیص دقیق روش اتصال (اولویت با window.tronWeb)
    // ---------------------------------------------------------
    let currentAddress = null;
    let isWalletConnect = false;

    // الف) بررسی وجود مرورگر داخلی (TokenPocket/TronLink)
    // وقتی با Deep Link وارد می‌شویم، این شرط true می‌شود
    if (
      window.tronWeb &&
      window.tronWeb.defaultAddress &&
      window.tronWeb.defaultAddress.base58
    ) {
      currentAddress = window.tronWeb.defaultAddress.base58;
      isWalletConnect = false; // مهم: اینجا مستقیم وصل هستیم
      console.log("Mode: In-App Browser / Native Injection detected.");
    }
    // ب) بررسی WalletConnect (برای حالت‌های خاص یا قدیمی)
    else if (userWalletAddress && universalProvider) {
      currentAddress = userWalletAddress;
      isWalletConnect = true;
      console.log("Mode: WalletConnect detected.");
    }
    // ج) عدم اتصال
    else {
      alert("Please connect wallet first.");
      return;
    }

    // قفل دکمه
    executeSwapBtn.disabled = true;
    executeSwapBtn.innerText = "Processing...";

    try {
      const decimals = TOKEN_DECIMALS[tokenInSymbol] || 18;
      // تبدیل مقدار به Wei/Sun با دقت بالا (BigInt)
      const amountInWeiStr = BigInt(
        Math.floor(amountIn * Math.pow(10, decimals))
      ).toString();

      console.log(
        `Swap Request: ${amountIn} ${tokenInSymbol} -> ${amountInWeiStr} Wei/Sun`
      );

      // ---------------------------------------------------------
      // 2. پروسه مجوز (Approve) - فقط برای توکن‌ها (غیر از TRX)
      // ---------------------------------------------------------
      if (tokenInSymbol !== "TRX") {
        executeSwapBtn.innerText = "Checking Allowance...";

        // چک کردن مجوز فعلی از طریق API
        const allowRes = await fetch("/api/check_allowance/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          body: JSON.stringify({
            owner_address: currentAddress,
            token_symbol: tokenInSymbol,
          }),
        });

        if (!allowRes.ok) throw new Error("Network Error checking allowance");
        const allowData = await allowRes.json();
        const currentAllowance = BigInt(allowData.allowance || "0");
        const requiredAmount = BigInt(amountInWeiStr);

        // اگر مجوز کم بود -> درخواست Approve
        if (currentAllowance < requiredAmount) {
          console.log("Allowance low. Starting Approve process...");
          executeSwapBtn.innerText = "Approving...";

          const approveRes = await fetch("/api/create_swap_approve_tx/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({
              owner_address: currentAddress,
              token_in_address: TOKEN_ADDRESSES[tokenInSymbol],
              amount_in_sun_str: amountInWeiStr,
            }),
          });

          if (!approveRes.ok)
            throw new Error("Backend failed to create Approve transaction.");
          const unsignedApprove = await approveRes.json();
          if (unsignedApprove.error)
            throw new Error("Approve Error: " + unsignedApprove.error);

          // امضا و پخش Approve
          await signAndBroadcast(
            unsignedApprove,
            isWalletConnect,
            currentAddress
          );

          executeSwapBtn.innerText = "Waiting for Confirmation...";

          // افزایش زمان انتظار به 5 ثانیه (برای جلوگیری از خطای TransferFrom Failed)
          await new Promise((r) => setTimeout(r, 5000));
        }
      }

      // ---------------------------------------------------------
      // 3. پروسه تبدیل (Swap)
      // ---------------------------------------------------------
      executeSwapBtn.innerText = "Building Swap...";
      const swapRes = await fetch("/api/create_swap_tx/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
          owner_address: currentAddress,
          token_in_symbol: tokenInSymbol,
          amount_in_sun_str: amountInWeiStr,
        }),
      });

      const responseData = await swapRes.json();

      // بررسی خطای بک‌اند
      if (!swapRes.ok || responseData.error) {
        let errorMsg = responseData.error || "Unknown Backend Error";
        if (
          errorMsg.includes("REVERT") ||
          errorMsg.includes("TRANSFER_FROM_FAILED")
        ) {
          errorMsg =
            "Transaction Reverted! Please check your TRX balance (for gas) or wait a bit more for Approval.";
        }
        throw new Error(errorMsg);
      }

      // امضا و پخش Swap
      executeSwapBtn.innerText = "Please Sign Swap...";
      const txHash = await signAndBroadcast(
        responseData,
        isWalletConnect,
        currentAddress
      );

      console.log("Swap Success:", txHash);
      alert(`✅ Swap Successful!\nTXID: ${txHash}`);

      // ریست فرم
      if (swapAmountInput) swapAmountInput.value = "";
      if (usdtDisplay) usdtDisplay.innerText = "0.00";
    } catch (error) {
      console.error("Swap Process Error:", error);

      // استخراج پیام خطا برای نمایش به کاربر
      let msg = "Unknown Error";
      if (error.message) msg = error.message;
      else if (typeof error === "string") msg = error;
      else {
        try {
          msg = JSON.stringify(error);
        } catch (e) {}
      }

      if (msg.includes("User rejected")) msg = "Transaction rejected by user.";

      alert("❌ Swap Failed: " + msg);
    } finally {
      executeSwapBtn.disabled = false;
      executeSwapBtn.innerText = "Swap";
    }
  }
  // ========================================================
  // 🛠️ تابع کمکی حیاتی: امضا و پخش تراکنش
  // (این تابع باید دقیقاً زیر تابع بالا یا در همان فایل باشد)
  // ========================================================
  // این تابع را جایگزین تابع قبلی signAndBroadcast کنید
  // ========================================================
  // 🛠️ CRITICAL HELPER: SIGN AND BROADCAST (FINAL VERSION)
  // ========================================================
  // ========================================================
  // 🛠️ CRITICAL HELPER: SIGN AND BROADCAST (FINAL & ROBUST)
  // ========================================================
  // ========================================================
  // 🛠️ CRITICAL HELPER: SIGN AND BROADCAST (Safety Checks)
  // ========================================================
  // ========================================================
  // 🛠️ CRITICAL HELPER: SIGN AND BROADCAST (Safety Checks)
  // ========================================================
  async function signAndBroadcast(transactionObj, isWalletConnect, address) {
    console.log(
      "Signing Transaction...",
      isWalletConnect
        ? "Via WalletConnect"
        : "Via Native Injection (TokenPocket/TronLink)"
    );
    let signedTx;

    // ---------------------------------------------------------
    // مسیر ۱: WalletConnect (فقط اگر isWalletConnect=true باشد)
    // ---------------------------------------------------------
    if (isWalletConnect) {
      if (!universalProvider)
        throw new Error("WalletConnect provider not ready");

      try {
        console.log("WalletConnect Param Check -> Address:", address);

        signedTx = await universalProvider.client.request({
          topic: universalProvider.session.topic,
          chainId: "tron:0x2b6653dc",
          request: {
            method: "tron_signTransaction",
            params: {
              address: address, // آدرس Base58
              transaction: transactionObj, // آبجکت Hex از بک‌اند
            },
          },
        });
      } catch (err) {
        console.error("WalletConnect Sign Error:", err);
        // نمایش خطای دقیق
        alert("Wallet Error Details:\n" + JSON.stringify(err));
        throw err;
      }
    }
    // ---------------------------------------------------------
    // مسیر ۲: Native Injection (توکن پاکت / ترون لینک)
    // ---------------------------------------------------------
    else {
      // ⚠️ چک ایمنی: مطمئن شویم window.tronWeb لود شده است
      if (!window.tronWeb || !window.tronWeb.trx) {
        console.error("TronWeb object is missing!");
        throw new Error(
          "Wallet not injected! Please make sure you are inside TokenPocket Browser."
        );
      }

      try {
        // امضای تراکنش با استفاده از متد داخلی کیف پول
        // این متد آبجکت Hex بک‌اند را به راحتی می‌پذیرد
        signedTx = await window.tronWeb.trx.sign(transactionObj);
      } catch (err) {
        console.error("Native Sign Error:", err);
        // مدیریت خطای رد کردن توسط کاربر
        // ممکن است خطا رشته باشد یا آبجکت
        const errStr = typeof err === "string" ? err : JSON.stringify(err);
        if (errStr.includes("rejected") || errStr.includes("declined")) {
          throw new Error("Transaction rejected by user.");
        }
        throw err;
      }
    }

    // ---------------------------------------------------------
    // پخش تراکنش (Broadcast) توسط سرور
    // ---------------------------------------------------------
    console.log("Broadcasting Signed Transaction...");
    const broadcastRes = await fetch("/api/broadcast_transaction/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(signedTx),
    });

    if (!broadcastRes.ok) {
      const errData = await broadcastRes.json();
      throw new Error(
        "Broadcast Network Error: " + (errData.error || broadcastRes.statusText)
      );
    }

    const bResult = await broadcastRes.json();

    // بررسی دقیق نتیجه موفقیت
    if (
      bResult.result === true ||
      (bResult.result && bResult.result.result === true)
    ) {
      const txID =
        bResult.txid || (bResult.transaction ? bResult.transaction.txID : null);
      return txID;
    } else if (bResult.txid) {
      return bResult.txid;
    } else {
      // لاگ و نمایش خطا
      console.error("Broadcast Logic Failed. Response:", bResult);

      let msg = "Unknown Broadcast Error";
      // تلاش برای دیکود کردن پیام خطای Hex (ترون گاهی ارور را هگز می‌دهد)
      if (bResult.message) {
        try {
          msg = bytes.fromhex(bResult.message).decode();
        } catch (e) {
          msg = bResult.message;
        }
      } else if (bResult.result && bResult.result.message) {
        try {
          msg = bytes.fromhex(bResult.result.message).decode();
        } catch (e) {
          msg = bResult.result.message;
        }
      }

      throw new Error("Broadcast Failed: " + msg);
    }
  }

  /*******  5034d41b-13ae-4163-8abe-1122c766f613  *******/
  function attachEventListeners() {
    // ==========================================
    // 1. بخش‌های اصلی خرید (Core Purchase)
    // ==========================================
    if (usdtAmountInput) {
      usdtAmountInput.addEventListener("input", updateReceiveAmount);
    }

    if (connectWalletBtn) {
      connectWalletBtn.addEventListener("click", connectWallet);
    }

    if (confirmBtn) {
      confirmBtn.addEventListener("click", confirmPurchase);
    }

    // ==========================================
    // 2. بخش راهنما (Guide Modal)
    // ==========================================
    if (guideBtn) guideBtn.addEventListener("click", openGuide);
    if (guideCloseBtn) guideCloseBtn.addEventListener("click", closeGuide);

    if (guideModal) {
      guideModal.addEventListener("click", (e) => {
        if (e.target === guideModal) closeGuide();
      });
    }

    // ==========================================
    // 3. بخش تبدیل ارز (Swap Feature)
    // ==========================================
    const swapAmountInput = document.getElementById("swap-amount-input");
    const cryptoSelect = document.getElementById("crypto-select");
    const executeSwapBtn = document.getElementById("execute-swap-btn");

    if (executeSwapBtn) {
      executeSwapBtn.addEventListener("click", executeSwap);
    }

    if (swapAmountInput) {
      swapAmountInput.addEventListener("input", () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(handlePriceFetch, 500);
      });
    }

    if (cryptoSelect) {
      cryptoSelect.addEventListener("change", handlePriceFetch);
    }

    // ==========================================
    // 4. مودال انتخاب کیف پول (Desktop Web)
    // ==========================================
    const walletModal = document.getElementById("wallet-select-modal");
    const walletModalCloseBtn = document.getElementById("wallet-modal-close");
    const tronLinkBtn = document.getElementById("connect-tronlink-btn");
    const wcBtn = document.getElementById("connect-wc-btn");

    // بستن با دکمه ضربدر
    if (walletModalCloseBtn) {
      walletModalCloseBtn.addEventListener("click", closeWalletModal);
    }

    // بستن با کلیک بیرون مودال
    if (walletModal) {
      walletModal.addEventListener("click", (e) => {
        if (e.target === walletModal) closeWalletModal();
      });
    }

    // دکمه اتصال TronLink
    if (tronLinkBtn) {
      tronLinkBtn.addEventListener("click", connectTronLinkWeb);
    }

    // دکمه اتصال WalletConnect
    if (wcBtn) {
      wcBtn.addEventListener("click", connectWalletConnectWeb);
    }

    // ==========================================
    // 5. مودال خطای حرفه‌ای (Generic Error Modal)
    // ==========================================
    const errorModal = document.getElementById("generic-error-modal");
    const errorCloseBtn = document.getElementById("modal-error-close-btn");
    const errorUnderstandBtn = document.getElementById(
      "modal-error-understand-btn"
    );

    const closeErrorModal = () => {
      if (errorModal) errorModal.style.display = "none";
    };

    if (errorCloseBtn) {
      errorCloseBtn.addEventListener("click", closeErrorModal);
    }

    if (errorUnderstandBtn) {
      errorUnderstandBtn.addEventListener("click", closeErrorModal);
    }

    // ==========================================
    // 6. مودال "در حال توسعه" (Coming Soon)
    // ==========================================

    // بستن مودال با دکمه ضربدر
    const modalSoonClose = document.getElementById("modal-soon-close-btn");
    if (modalSoonClose) {
      modalSoonClose.addEventListener("click", () => {
        document.getElementById("coming-soon-modal").style.display = "none";
      });
    }

    // دکمه عملیاتی "استفاده از توکن پاکت" (اصلاح شده و ایمن)
    const modalActionBtn = document.getElementById("modal-soon-action-btn");
    if (modalActionBtn) {
      modalActionBtn.addEventListener("click", () => {
        // 1. بستن مودال
        document.getElementById("coming-soon-modal").style.display = "none";

        // 2. تشخیص محیط اجرا
        const isIOSApp = navigator.userAgent.includes("ZNST_IOS_APP");
        const isAndroidApp =
          typeof window.Android?.showWalletSelector === "function";

        // 3. اجرای دستور مناسب بدون کرش کردن
        if (isIOSApp) {
          // اگر روی آیفون است، از Bridge آیفون استفاده کن
          if (window.onIOSWalletSelected) {
            window.onIOSWalletSelected("tokenpocket");
          }
        } else if (isAndroidApp) {
          // اگر روی اندروید است، از Bridge اندروید استفاده کن
          if (window.onAndroidWalletSelected) {
            window.onAndroidWalletSelected("tokenpocket");
          }
        } else {
          // اگر روی وب است، لینک سایت را باز کن
          window.location.href = "https://www.tokenpocket.pro";
        }
      });
    }
  }
  function closeWalletModal() {
    const walletModal = document.getElementById("wallet-select-modal");
    if (walletModal) walletModal.style.display = "none";
  }
  // [اضافه شود]
  function showErrorModal(title, message) {
    const modal = document.getElementById("generic-error-modal");
    const titleEl = document.getElementById("modal-error-title");
    const textEl = document.getElementById("modal-error-message");
    const closeBtn = document.getElementById("modal-error-understand-btn");

    if (modal && titleEl && textEl && closeBtn) {
      titleEl.innerText = title;
      textEl.innerText = message;
      // متن دکمه از ترجمه‌ها خوانده می‌شود
      closeBtn.innerText = (
        translations[currentLang] || translations.en
      ).iUnderstand;
      closeBtn.style.display = "block"; // نمایش دکمه
      modal.style.display = "flex";
    } else {
      // Fallback برای اطمینان
      alert(title + "\n" + message);
    }
  }
  /**
   * (تابع کمکی - Callback برای اندروید)
   * این تابع توسط کد Kotlin صدا زده می‌شود تا نتیجه انتخاب کاربر را به JS بگوید.
   */
  // [جایگزین شود]
  // [در script.js جایگزین شود]
  // (اصلاح شده) هدایت هوشمند در اندروید
  window.onAndroidWalletSelected = async function (walletType) {
    console.log(`Android native code selected: ${walletType}`);

    if (walletType === "tokenpocket") {
      // ✅ مسیر ۱: توکن پاکت (مسیر طلایی و فعال)
      // ما متغیر target را ست می‌کنیم تا initializeProvider بداند باید دیپ‌لینک کند
      androidTargetWallet = "tokenpocket";
      // اجرا با Force New Session
      await connectWalletConnectAndroid(true);
    } else if (walletType === "other_wc") {
      // 🚧 مسیر ۲: سایر کیف پول‌ها (فعلاً بسته با پیام محترمانه)
      // به جای تلاش برای اتصال، مودال "در حال توسعه" را نشان می‌دهیم
      showComingSoonModal();
    } else {
      console.warn(`Unknown walletType selected: ${walletType}`);
    }
  };
  // [در script.js جایگزین شود]
  /**
   * تابع اتصال اندروید با قابلیت شروع مجدد (Force New Session)
   */
  async function connectWalletConnectAndroid(forceNewSession = false) {
    console.log(
      `connectWalletConnectAndroid() called. Force New: ${forceNewSession}`
    );
    const t = translations[currentLang] || translations.en;

    try {
      // 1. اطمینان از اینکه Provider ساخته شده است
      if (!universalProvider) {
        await initializeProvider();
        if (!universalProvider)
          throw new Error("Provider initialization failed.");
      }

      // 2. مدیریت سشن‌های قبلی (رفع باگ پرش ناگهانی)
      if (universalProvider.session) {
        if (forceNewSession) {
          console.log(
            "Forcing disconnect of old session to allow new selection..."
          );
          try {
            await universalProvider.disconnect();
          } catch (e) {
            console.warn(
              "Error clearing old session (might be already cleared):",
              e
            );
          }
          userWalletAddress = null;
        } else {
          // اگر Force نبود و سشن داشتیم، یعنی بازیابی خودکار (مثلا رفرش صفحه)
          console.log(
            "Restoring existing session:",
            universalProvider.session.topic
          );
          // ... (منطق بازیابی آدرس) ...
          // اما در سناریوی ما، چون از منوی کاتلین می‌آید، همیشه Force است.
          return;
        }
      }

      // 3. شروع اتصال جدید
      console.log("Requesting NEW session from UniversalProvider...");

      // این دستور باعث می‌شود لیست کیف پول‌ها (WalletConnect Modal) باز شود
      // و چون سشن قبلی را پاک کردیم، کاربر حق انتخاب خواهد داشت.
      const session = await universalProvider.connect({
        namespaces: {
          tron: {
            methods: ["tron_signTransaction", "tron_signMessage"],
            events: ["accountsChanged", "chainChanged"],
            chains: ["tron:0x2b6653dc"],
          },
        },
        // نکته: ما pairingTopic را نمی‌فرستیم تا همیشه یک QR/لیست جدید تولید شود
      });

      // 4. پردازش موفقیت آمیز اتصال
      if (session) {
        console.log("--- Session established ---");
        const accounts = session.namespaces.tron?.accounts;
        const tronAccount = accounts
          ?.find((acc) => acc.startsWith("tron:"))
          ?.split(":")
          .pop();

        if (tronAccount) {
          userWalletAddress = tronAccount;
          console.log("Connected Address:", userWalletAddress);

          if (connectWalletText) {
            connectWalletText.innerText = `${userWalletAddress.substring(
              0,
              6
            )}...${userWalletAddress.slice(-4)}`;
          }
          if (connectWalletBtn) connectWalletBtn.disabled = true;

          // بستن مودال WC اگر باز مانده باشد
          if (walletConnectModal) walletConnectModal.closeModal();
        }
      }
    } catch (error) {
      console.error("Error in Android connection:", error);
      if (walletConnectModal) walletConnectModal.closeModal();

      // فقط اگر کاربر کنسل نکرده بود ارور بده
      if (
        !error.message?.includes("User rejected") &&
        !error.message?.includes("Connection request reset")
      ) {
        // اینجا نیازی به آلرت نیست چون کاربر خودش بسته یا شبکه قطع شده
        console.warn("Connection process interrupted.");
      }
    }
  }

  /**
   * (تابع کمکی - "موتور" وب ۱)
   * تلاش برای اتصال با افزونه TronLink در وب
   * (این همان کدی است که قبلاً در 'else' تابع connectWallet شما بود)
   */
  // [نسخه D - نهایى و کامل]
  // این نسخه هر ۳ مشکل را حل مى‌کند:
  // 1. تداخل افزونه (TokenPocket)
  // 2. باگ "Reject" (خطاى base58)
  // 3. باگ "هنگ کردن" (عدم باز شدن پاپ‌آپ)

  // [نسخه D - نهایى و کامل، در حالت دیباگ]
  // این نسخه هر ۳ مشکل را حل مى‌کند:
  // 1. تداخل افزونه (TokenPocket) - (در حالت دیباگ)
  // 2. باگ "Reject" (خطاى base58)
  // 3. باگ "هنگ کردن" (عدم باز شدن پاپ‌آپ)

  // [نسخه G - نهایى و تولیدى (Guarded)]
  // این نسخه شامل بررسى هویت است که از برنامه در برابر افزونه‌هاى متجاوز محافظت مى‌کند.

  // [نسخه H - نهایى (منطق "اول درخواست")]
  // این نسخه ابتدا درخواست اتصال مى‌دهد و سپس هویت را بررسى مى‌کند.

  // [نسخه J - نهایى (فقط tronLink)]
  // این نسخه فقط به دنبال آبجکت واقعى افزونه (window.tronLink) مى‌گردد.

  async function connectTronLinkWeb() {
    // 1. دریافت ترجمه‌ها
    const t = translations[currentLang] || translations.en;
    closeWalletModal();
    console.log("--- 🚦 connectTronLinkWeb (vJ - TronLink Only) START ---");

    try {
      // 2. پیدا کردن Provider واقعى
      console.log("🔍 [1/5] Searching for provider (window.tronLink ONLY)..."); // --- 💡💡💡 تغییر کلیدى اینجاست 💡💡💡 --- // ما فقط به دنبال window.tronLink مى‌گردیم.
      const tronProvider = window.tronLink; // 3. بررسى وجود
      if (!tronProvider) {
        console.error(
          "❌ [1/5] FAILED. Provider not found (window.tronLink is null)."
        );
        alert("Please install the TronLink wallet extension.");
        return;
      }
      console.log("✅ [1/5] Provider (Proxy) found. Object:", tronProvider); // 4. اول درخواست اتصال مى‌دهیم تا پروکسى "بیدار" شود

      console.log("📥 [2/5] Requesting accounts to 'wake up' the provider...");
      const accountsResult = await tronProvider.request({
        method: "tron_requestAccounts",
      });
      console.log("✅ [2/5] 'request' method returned:", accountsResult); // 5. اکنون (پس از اتصال) بررسى مى‌کنیم که آبجکت داخلى tronWeb آماده شده باشد
      console.log("🆔 [3/5] Verifying post-request state...");
      if (!tronProvider.tronWeb) {
        console.error(
          "❌ [3/5] FAILED. Provider did not provide .tronWeb after request."
        );
        alert("Could not initialize TronLink. Please try again.");
        return;
      } // (ما دیگر به isTronLink نیاز نداریم، چون از اول window.tronLink را گرفتیم)
      console.log("✅ [3/5] Identity confirmed: Provider has .tronWeb."); // 6. پردازش نتیجه

      console.log("🔄 [4/5] Parsing address from result...");
      let userAddress = null;
      const tronWeb = tronProvider.tronWeb; // حالا مى‌دانیم که این وجود دارد

      if (Array.isArray(accountsResult) && accountsResult.length > 0) {
        userAddress = tronWeb.address.fromHex(accountsResult[0]);
      } else if (
        typeof accountsResult === "object" &&
        accountsResult.code === 200
      ) {
        userAddress = tronWeb.defaultAddress?.base58; // '?' امن
      } else if (
        typeof accountsResult === "string" &&
        accountsResult.length > 0
      ) {
        userAddress = accountsResult;
      } // 7. بررسى نهایى (اگر کاربر Reject کرده باشد)

      if (!userAddress) {
        console.warn(
          "❌ [5/5] FAILED. Address parsing failed. User likely rejected."
        );
        alert(t.connectionRejected);
        return;
      } // 8. موفقیت!

      console.log("✅ [5/5] SUCCESS. Final address parsed:", userAddress);
      if (connectWalletText) {
        connectWalletText.innerText = `${userAddress.substring(
          0,
          6
        )}...${userAddress.slice(-4)}`;
      }
      if (connectWalletBtn) connectWalletBtn.disabled = true;
    } catch (error) {
      // 9. مدیریت خطا
      console.error("--- ☠️ CATCH BLOCK ☠️ ---");
      console.error("An exception occurred:", error);
      if (
        error.message &&
        (error.message.toLowerCase().includes("user rejected") ||
          error.code === 4001)
      ) {
        alert(t.connectionRejected);
      } else {
        alert("An error occurred: " + error.message);
      }
    } finally {
      console.log("--- 🏁 connectTronLinkWeb (vJ - TronLink Only) END ---");
    }
  }
  async function connectWalletConnectWeb() {
    const t = translations[currentLang] || translations.en;
    closeWalletModal(); // بستن پاپ‌آپ
    console.log(
      "Web Browser: User selected WalletConnect (QR Code). Using UniversalProvider..."
    ); // --- از همان کد موفق اندروید استفاده می‌کنیم ---
    try {
      if (!universalProvider) {
        await initializeProvider();
        if (!universalProvider)
          throw new Error("Provider initialization failed.");
      }
      if (userWalletAddress) {
        console.log("Already connected:", userWalletAddress);
        return;
      }

      const session = await universalProvider.connect({
        namespaces: {
          tron: {
            methods: ["tron_signTransaction", "tron_signMessage"],
            events: ["accountsChanged", "chainChanged"],
            chains: ["tron:0x2b6653dc"],
          },
        },
      });
      if (session) {
        console.log("--- DEBUG: Session established (Full Details) ---");
        console.log(JSON.stringify(session, null, 2));
        const accounts = session.namespaces.tron?.accounts;
        const tronAccount = accounts
          ?.find((acc) => acc.startsWith("tron:"))
          ?.split(":")
          .pop();
        if (tronAccount) {
          userWalletAddress = tronAccount; // <-- متغیر گلوبال را ست می‌کنیم
          console.log(
            "Connected Address (Web/WalletConnect):",
            userWalletAddress
          );
          if (connectWalletText)
            connectWalletText.innerText = `${userWalletAddress.substring(
              0,
              6
            )}...${userWalletAddress.slice(-4)}`;
          if (connectWalletBtn) connectWalletBtn.disabled = true;
          if (walletConnectModal) {
            walletConnectModal.closeModal();
          }
        } else {
          throw new Error("TRON address not found in session.");
        }
      }
    } catch (error) {
      console.error("Error connecting via WalletConnect (Web):", error);
      if (walletConnectModal) {
        walletConnectModal.closeModal();
      }
      if (
        !error.message?.includes("Session currently connecting") &&
        !error.message?.includes("User rejected")
      ) {
        alert(t.connectionRejected);
      }
    }
  }
  /**
   * تابع کمکی برای بستن پاپ‌آپ انتخاب کیف پول
   */
  function closeWalletModal() {
    const walletModal = document.getElementById("wallet-select-modal");
    if (walletModal) walletModal.style.display = "none";
  }

  /**
   * (منطق جابجا شده)
   * تلاش برای اتصال با افزونه TronLink در وب
   */

  /**
   * (منطق جابجا شده)
   * تلاش برای اتصال با WalletConnect (QR Code) در وب
   */
  // --- تابع هوشمند اتصال (با قابلیت تلاش مجدد برای آیفون) ---
  async function connectWalletConnectWeb() {
    const t = translations[currentLang] || translations.en;

    // بستن مودال انتخاب کیف پول
    closeWalletModal();

    console.log("🖱️ User clicked WalletConnect.");

    // 1. بررسی: آیا موتور WalletConnect لود شده است؟
    if (!universalProvider) {
      console.log("⚠️ Provider not ready yet. Retrying initialization...");

      // تغییر متن دکمه برای فیدبک به کاربر
      const btnText = document.getElementById("wallet-modal-wc-text");
      const originalText = btnText ? btnText.innerText : "";
      if (btnText) btnText.innerText = "Loading...";

      // تلاش مجدد برای دانلود کتابخانه (اینجا منتظر می‌مانیم)
      const success = await initializeProvider();

      // برگرداندن متن دکمه
      if (btnText) btnText.innerText = originalText;

      if (!success) {
        // فقط اینجا حق داریم ارور بدهیم چون کاربر منتظر است و خودش کلیک کرده
        alert(
          "Connection Error: Please check your internet connection (VPN) and try again."
        );
        return;
      }
    }

    // 2. جلوگیری از اتصال تکراری
    if (userWalletAddress) {
      console.log("Already connected.");
      return;
    }

    // 3. شروع فرآیند اتصال
    try {
      // باز کردن QR Code یا دیپ‌لینک
      const session = await universalProvider.connect({
        namespaces: {
          tron: {
            methods: ["tron_signTransaction", "tron_signMessage"],
            events: ["accountsChanged", "chainChanged"],
            chains: ["tron:0x2b6653dc"],
          },
        },
      });

      // مدیریت موفقیت اتصال
      if (session) {
        const accounts = session.namespaces.tron?.accounts;
        const tronAccount = accounts
          ?.find((acc) => acc.startsWith("tron:"))
          ?.split(":")
          .pop();

        if (tronAccount) {
          userWalletAddress = tronAccount;

          // آپدیت UI
          if (connectWalletText) {
            connectWalletText.innerText = `${userWalletAddress.substring(
              0,
              6
            )}...${userWalletAddress.slice(-4)}`;
          }
          if (connectWalletBtn) connectWalletBtn.disabled = true;

          // بستن مودال QR Code
          if (walletConnectModal) walletConnectModal.closeModal();
        }
      }
    } catch (error) {
      console.error("Connection Logic Error:", error);

      // بستن مودال در صورت خطا
      if (walletConnectModal) walletConnectModal.closeModal();

      // اگر کاربر خودش پنجره را بست یا رد کرد، ارور نده
      const errMsg = error.message || "";
      if (
        !errMsg.includes("User rejected") &&
        !errMsg.includes("Connection request reset")
      ) {
        alert("Failed to connect. Please refresh the page and try again.");
      }
    }
  }

  function initializeChart() {
    const isChartReady =
      typeof window.LightweightCharts !== "undefined" &&
      typeof window.LightweightCharts.createChart === "function";

    if (isChartReady) {
      renderChart(historicalChartData);
    } else {
      setTimeout(initializeChart, 200);
    }
  }

  // ============================================
  // 7. HELPER FUNCTIONS & APP INITIALIZATION
  // ============================================

  // --- 1. تابع تشخیص محیط اپلیکیشن (برای مخفی کردن دانلودها) ---
  function checkEnvironment() {
    // تشخیص آیفون (React Native App)
    const isIOSApp = navigator.userAgent.includes("ZNST_IOS_APP");

    // تشخیص اندروید (Native Android App)
    const isAndroidApp = typeof window.Android !== "undefined";

    if (isIOSApp || isAndroidApp) {
      console.log("📱 Running inside Native App. Hiding download cards.");
      // اضافه کردن کلاس به body که باعث مخفی شدن کارت‌ها می‌شود
      document.body.classList.add("in-app");
    } else {
      console.log("💻 Running in Web Browser. Showing download cards.");
    }
  }

  // --- 2. تابع باز کردن راهنمای نصب آیفون (PWA) ---
  // (این تابع در دکمه Install Guide در HTML صدا زده می‌شود)
  window.openIOSGuide = function () {
    const iosModal = document.getElementById("ios-install-modal");
    if (iosModal) {
      iosModal.style.display = "flex";
    }
  };

  // --- 3. تابع نمایش مودال "در حال توسعه" ---
  // (وقتی کاربر روی "سایر کیف پول‌ها" کلیک می‌کند)
  function showComingSoonModal() {
    const modal = document.getElementById("coming-soon-modal");
    const titleEl = document.getElementById("modal-soon-title");
    const textEl = document.getElementById("modal-soon-message");
    const actionBtn = document.getElementById("modal-soon-action-btn");

    // دریافت ترجمه‌ها
    const t = translations[currentLang] || translations.en;

    if (modal && titleEl && textEl && actionBtn) {
      titleEl.innerText = t.comingSoonTitle;
      textEl.innerText = t.comingSoonMessage;
      actionBtn.innerText = t.iWillUseTP;
      modal.style.display = "flex";
    }
  }

  // --- 4. تابع کال‌بک مخصوص آیفون (Bridge) ---
  // (این تابع توسط App.js صدا زده می‌شود تا نتیجه انتخاب کاربر را بگوید)
  window.onIOSWalletSelected = async function (walletType) {
    console.log(`🍏 iOS Native Selection: ${walletType}`);

    if (walletType === "tokenpocket") {
      // ✅ مسیر موفقیت: شروع پروسه اتصال
      await connectWalletConnectWeb();
    } else {
      // ⛔ مسیر سایر کیف پول‌ها: نمایش مودال هدایت کننده
      showComingSoonModal();
    }
  };

  // --- 5. تابع اصلی راه‌اندازی برنامه (Main Init) ---
  async function initializeApp() {
    console.log("Initializing application...");

    // الف) تشخیص محیط (مخفی‌سازی دکمه‌های دانلود در اپلیکیشن)
    checkEnvironment();

    // ب) فعال‌سازی دکمه‌ها و لیسنرها
    attachEventListeners();

    changeLanguage(currentLang);

    // پ) دریافت قیمت و دیتا از سرور
    await fetchPriceDataAndUpdateUI();

    // ت) تنظیم زبان اولیه

    // ث) رسم نمودار
    initializeChart();

    // ج) راه‌اندازی اولیه موتور اتصال (فقط برای اندروید)
    if (window.Android && typeof window.Android.openLink === "function") {
      await initializeProvider();
    }

    // چ) تنظیم آپدیت خودکار قیمت (هر 60 ثانیه)
    setInterval(fetchPriceDataAndUpdateUI, 60000);
  }

  // --- 6. اجرای نهایی ---
  initializeApp();
}); // پایان document.addEventListener
