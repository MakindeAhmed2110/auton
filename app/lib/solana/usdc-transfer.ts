import {
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";

const USDC_DECIMALS = 6;

export function getSolanaRpcUrl() {
  return (
    import.meta.env.VITE_SOLANA_RPC_URL?.trim() ||
    "https://api.mainnet-beta.solana.com"
  );
}

export function createSolanaConnection() {
  return new Connection(getSolanaRpcUrl(), "confirmed");
}

export async function buildUsdcTransferTransaction(params: {
  payer: string;
  treasuryWallet: string;
  usdcMint: string;
  amountMicro: bigint;
}) {
  const connection = createSolanaConnection();
  const payer = new PublicKey(params.payer);
  const treasury = new PublicKey(params.treasuryWallet);
  const mint = new PublicKey(params.usdcMint);

  const sourceAta = getAssociatedTokenAddressSync(
    mint,
    payer,
    false,
    TOKEN_PROGRAM_ID,
  );
  const destinationAta = getAssociatedTokenAddressSync(
    mint,
    treasury,
    false,
    TOKEN_PROGRAM_ID,
  );

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash("confirmed");

  const transaction = new Transaction({
    blockhash,
    lastValidBlockHeight,
    feePayer: payer,
  });

  transaction.add(
    createAssociatedTokenAccountIdempotentInstruction(
      payer,
      destinationAta,
      treasury,
      mint,
    ),
    createTransferCheckedInstruction(
      sourceAta,
      mint,
      destinationAta,
      payer,
      params.amountMicro,
      USDC_DECIMALS,
    ),
  );

  return transaction;
}

export function serializeTransaction(transaction: Transaction) {
  return new Uint8Array(
    transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    }),
  );
}

export function computeUsdcMicroLocal(tokenAmount: number, lockedRatePerM: number) {
  return BigInt(Math.round(tokenAmount * lockedRatePerM));
}

export function formatUsdcFromMicro(micro: bigint | string) {
  const value = typeof micro === "string" ? BigInt(micro) : micro;
  const whole = value / 1_000_000n;
  const fraction = value % 1_000_000n;
  if (fraction === 0n) return whole.toString();
  return `${whole}.${fraction.toString().padStart(6, "0").replace(/0+$/, "")}`;
}
