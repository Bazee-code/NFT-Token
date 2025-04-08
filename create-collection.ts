import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { keypairIdentity } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { airdropIfRequired, getKeypairFromFile } from "@solana-developers/helpers";
import {clusterApiUrl, Connection, LAMPORTS_PER_SOL} from '@solana/web3.js'

const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromFile();

//in case wallet balance is empty
await airdropIfRequired(connection, user.publicKey, 1 * LAMPORTS_PER_SOL, 0.5 * LAMPORTS_PER_SOL);

console.log('Loaded user:', user.publicKey.toBase58());

// create umi instance to interact with metaplex tools
const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

// create umi keypair
const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser))

console.log('umi instance running');