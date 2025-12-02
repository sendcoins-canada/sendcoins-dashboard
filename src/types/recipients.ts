export interface RawRecipient {
  keychain: string;
  name: string;
  network: string;
  asset: string;
  walletAddress: string;
  createdAt: string;
  updatedAt: string | null;
  logo: string;
  assetName: string;
  assetNameDisplay: string;
}

export interface RecipientApiResponse {
  title: string;
  isSuccess: boolean;
  recipients: RawRecipient[];
  totalRecipients: number;
}


export interface AddRecipientPayload {
  token: string ;
  name: string;
  network: string;
  asset: string;
  walletAddress: string;
}

export interface RecipientResponse {
  title: string;
  isSuccess: boolean;
  recipients: any[];  // Replace with a strict type if needed
  totalRecipients: number;
}

export interface SingleRecipient {
  keychain: string;
  name: string;
  network: string;
  asset: string;
  walletAddress: string;
  createdAt: string;
  updatedAt: string | null;
  logo: string;
  assetName: string;
  assetNameDisplay: string;
}

export interface SingleRecipientResponse {
  isSuccess: boolean;
  recipient: SingleRecipient;
}
