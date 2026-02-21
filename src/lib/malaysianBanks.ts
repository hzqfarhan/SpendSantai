export interface BankOption {
    name: string;
    type: "BANK" | "E-WALLET";
}

export const MALAYSIAN_BANKS: BankOption[] = [
    // Major Banks
    { name: "Maybank", type: "BANK" },
    { name: "CIMB Bank", type: "BANK" },
    { name: "Public Bank", type: "BANK" },
    { name: "RHB Bank", type: "BANK" },
    { name: "Hong Leong Bank", type: "BANK" },
    { name: "AmBank", type: "BANK" },
    { name: "Bank Islam", type: "BANK" },
    { name: "Bank Rakyat", type: "BANK" },
    { name: "BSN (Bank Simpanan Nasional)", type: "BANK" },
    { name: "Affin Bank", type: "BANK" },
    { name: "Alliance Bank", type: "BANK" },
    { name: "Bank Muamalat", type: "BANK" },
    { name: "Agrobank", type: "BANK" },
    // International Banks in Malaysia
    { name: "HSBC Malaysia", type: "BANK" },
    { name: "OCBC Malaysia", type: "BANK" },
    { name: "Standard Chartered Malaysia", type: "BANK" },
    { name: "UOB Malaysia", type: "BANK" },
    { name: "Citibank Malaysia", type: "BANK" },
    // E-Wallets
    { name: "Touch 'n Go eWallet", type: "E-WALLET" },
    { name: "GrabPay", type: "E-WALLET" },
    { name: "Boost", type: "E-WALLET" },
    { name: "MAE (Maybank)", type: "E-WALLET" },
    { name: "BigPay", type: "E-WALLET" },
    { name: "ShopeePay", type: "E-WALLET" },
    { name: "GoPayz", type: "E-WALLET" },
    { name: "Setel", type: "E-WALLET" },
];

export function getBanksByType(type: "BANK" | "E-WALLET"): BankOption[] {
    return MALAYSIAN_BANKS.filter((b) => b.type === type);
}
