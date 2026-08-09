export type CoinLedgerType =
  | 'EARN'
  | 'SPEND'
  | 'ADMIN_GRANT'
  | 'ADMIN_DEDUCT';

export type Coin = {
  balance: number;
  amount: number;
  type: CoinLedgerType;
};