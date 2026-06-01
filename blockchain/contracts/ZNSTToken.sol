// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

// ====================================================================
// ZNST Token Contract
// Version: 1.0.0 (Production Ready)
// Standard: ERC20, Ownable
// ====================================================================

// ما از کدهای استاندارد و حسابرسی‌شده OpenZeppelin استفاده می‌کنیم.
// این کار امنیت، اعتماد و خوانایی کد را به شدت بالا می‌برد.
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ZNSTToken
 * @dev An ERC20 token with a fixed maximum supply, and mint/burn functions
 * controlled by an owner. This contract is production-ready.
 */
contract ZNSTToken is ERC20, Ownable {
    /**
     * @dev حداکثر تعداد توکنی که در طول تاریخ می‌تواند وجود داشته باشد: ۱ میلیارد.
     * این عدد غیرقابل تغییر (immutable) است و در کد حک شده است.
     */
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * (10**18);

    /**
     * @dev سازنده (constructor) قرارداد که در لحظه استقرار اجرا می‌شود.
     * نام توکن ("ZNST Token") و نماد آن ("ZNST") را تنظیم می‌کند.
     * @param initialOwner آدرس کیف پولی که کنترل کامل قرارداد را در دست خواهد داشت (کیف پول مدیرعامل).
     */
    constructor(address initialOwner) ERC20("ZNST Token", "ZNST") {
        // انتقال مالکیت به آدرسی که در زمان استقرار مشخص می‌شود.
        _transferOwnership(initialOwner);
    }

    /**
     * @dev به مالک اجازه می‌دهد تا توکن‌های جدیدی را تا سقف MAX_SUPPLY تولید (mint) کند.
     * @param to آدرس دریافت‌کننده توکن‌های جدید.
     * @param amount تعداد توکن‌هایی که باید تولید شود (با احتساب ۱۸ رقم اعشار).
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "ZNSTToken: Max supply exceeded");
        _mint(to, amount);
    }

    /**
     * @dev به مالک اجازه می‌دهد تا مقداری از توکن‌های خودش را برای همیشه از بین ببرد (بسوزاند).
     * شما از این تابع برای سوزاندن ۵۰۰ میلیون توکن استفاده خواهید کرد.
     * @param amount تعداد توکن‌هایی که باید سوزانده شود (با احتساب ۱۸ رقم اعشار).
     */
    function burn(uint256 amount) public onlyOwner {
        // توکن‌ها از موجودی مالک فعلی قرارداد (owner) سوزانده می‌شوند.
        _burn(owner(), amount);
    }
}
