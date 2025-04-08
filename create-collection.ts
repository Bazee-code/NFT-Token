import { createNft } from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired, getKeypairFromFile } from "@solana-developers/helpers";
import {clusterApiUrl, Connection, LAMPORTS_PER_SOL} from '@solana/web3.js'

const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromFile();

//in case wallet balance is empty
await airdropIfRequired(connection, user.publicKey, 1 * LAMPORTS_PER_SOL, 0.5 * LAMPORTS_PER_SOL);

// create umi instance