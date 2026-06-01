// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

// ====================================================================
// ZNST Sale Contract - Upgradable (FINAL TRON MAINNET VERSION)
// Network: TRON (TRC-20)
// Version: 1.0.4 (Production Ready)
// ====================================================================

// وارد کردن کتابخانه‌های استاندارد OpenZeppelin
// این کتابخانه‌ها روی شبکه ترون هم دقیقاً مثل اتریوم کار می‌کنند
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

// اینترفیس استاندارد برای صحبت با تتر (USDT-TRC20) و توکن خودت (ZNST)
interface IERC20Upgradeable {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title ZNSale_Upgradable
 * @dev قرارداد فروش توکن ZNST در شبکه ترون
 */
contract ZNSale_Upgradable is Initializable, UUPSUpgradeable, OwnableUpgradeable, PausableUpgradeable {
    
    // --- متغیرهای اصلی قرارداد ---
    // این متغیرها در حافظه بلاکچین ذخیره می‌شوند
    IERC20Upgradeable public usdtToken; // آدرس قرارداد تتر
    IERC20Upgradeable public znstToken; // آدرس قرارداد توکن خودت
    uint256 public lmeZincPriceInCents; // قیمت جهانی روی (مثلاً 300000 برای 3000 دلار)
    uint256 public deploymentTime;      // زمان شروع قرارداد

    // اعداد ثابت برای محاسبات ریاضی
    // تتر ۶ رقم اعشار دارد، ZNST ۱۸ رقم. این ضریب برای همسان‌سازی است.
    uint256 private constant DECIMAL_CONVERSION_FACTOR = 1e14; 
    uint256 private constant SIX_MONTHS_IN_SECONDS = 180 days;

    // --- رویدادها (برای نمایش در ترون‌اسکن) ---
    event TokensPurchased(address indexed purchaser, uint256 usdtAmountPaid, uint256 znstAmountReceived);
    event PriceUpdated(uint256 newLmeZincPriceInCents);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // تابع راه‌اندازی (جایگزین Constructor در قراردادهای آپگریدپذیر)
    function initialize(address _usdtAddress, address _znstAddress) public initializer {
        __Ownable_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        require(_usdtAddress != address(0), "Sale: USDT address cannot be zero");
        require(_znstAddress != address(0), "Sale: ZNST address cannot be zero");

        usdtToken = IERC20Upgradeable(_usdtAddress);
        znstToken = IERC20Upgradeable(_znstAddress);
        deploymentTime = block.timestamp;
    }

    // --- تابع اصلی خرید (مردم این را صدا می‌زنند) ---
    function buyTokens(uint256 usdtAmount) external whenNotPaused {
        // چک کردن شرایط اولیه
        require(lmeZincPriceInCents > 0, "Sale: Price not set yet by Oracle");
        require(usdtAmount > 0, "Sale: Zero amount");

        // ۱. محاسبه تعداد توکن ZNST که باید داده شود
        uint256 amountToBuy = calculateTokenAmount(usdtAmount);
        
        // ۲. چک کردن اینکه آیا قرارداد فروش به اندازه کافی ZNST دارد؟
        require(znstToken.balanceOf(address(this)) >= amountToBuy, "Sale: Insufficient ZNST balance in contract");

        // ۳. انتقال تتر از خریدار به این قرارداد
        // نکته مهم: خریدار باید قبلاً تتر را Approve کرده باشد (در فرانت‌اند انجام می‌شود)
        require(usdtToken.transferFrom(msg.sender, address(this), usdtAmount), "Sale: USDT transfer failed");
        
        // ۴. انتقال ZNST از این قرارداد به خریدار
        require(znstToken.transfer(msg.sender, amountToBuy), "Sale: ZNST transfer failed");

        // ثبت تراکنش در بلاکچین
        emit TokensPurchased(msg.sender, usdtAmount, amountToBuy);
    }

    // --- فرمول ریاضی محاسبه توکن (نسخه اصلاح شده و دقیق) ---
    function calculateTokenAmount(uint256 usdtAmount) public view returns (uint256) {
        require(lmeZincPriceInCents > 0, "Sale: Price is not set");
        
        // تعیین ضریب بر اساس زمان (۲۰۰۰ یا ۱۰۰۰)
        uint256 divisor;
        if (block.timestamp < deploymentTime + SIX_MONTHS_IN_SECONDS) {
            divisor = 2000;
        } else {
            divisor = 1000;
        }

        // فرمول: (مقدار تتر * ضریب اعشار * ضریب سود) / قیمت روی
        // ترتیب عملیات: اول همه ضرب‌ها انجام می‌شود تا عدد بزرگ شود و دقت از دست نرود
        uint256 numerator = usdtAmount * DECIMAL_CONVERSION_FACTOR * divisor;
        
        // تقسیم نهایی
        uint256 tokenAmount = numerator / lmeZincPriceInCents;
        
        return tokenAmount;
    }

    // --- توابع مدیریتی (فقط مالک) ---

    // این تابع توسط اسکریپت پایتون (Oracle) صدا زده می‌شود
    function updateLmeZincPrice(uint256 _newLmeZincPriceInCents) external onlyOwner {
        require(_newLmeZincPriceInCents > 0, "Sale: Invalid price");
        lmeZincPriceInCents = _newLmeZincPriceInCents;
        emit PriceUpdated(_newLmeZincPriceInCents);
    }

    // توقف اضطراری فروش
    function pause() external onlyOwner { _pause(); }
    // شروع مجدد فروش
    function unpause() external onlyOwner { _unpause(); }

    // --- ✅✅✅ بخش حیاتی: برداشت تتر (اصلاح شده برای TRC-20) ✅✅✅ ---
    function withdrawUSDT() external onlyOwner {
        // دریافت موجودی تتر موجود در قرارداد
        uint256 balance = usdtToken.balanceOf(address(this));
        require(balance > 0, "Sale: No USDT to withdraw");
        
        // انتقال امن تتر به کیف پول مالک
        // این دستور روی شبکه ترون دقیقاً درست کار می‌کند
        bool success = usdtToken.transfer(owner(), balance);
        require(success, "Sale: USDT withdraw failed");
    }
    
    // برداشت توکن‌های ZNST باقی‌مانده (اگر خواستی فروش را جمع کنی)
    function withdrawRemainingZNST() external onlyOwner {
        uint256 balance = znstToken.balanceOf(address(this));
        require(balance > 0, "Sale: No ZNST to withdraw");
        znstToken.transfer(owner(), balance);
    }

    // تابع داخلی برای اجازه آپگرید (فقط مالک)
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}