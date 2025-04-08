import { createNft, fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from "@solana-developers/helpers";
import {clusterApiUrl, Connection, LAMPORTS_PER_SOL} from '@solana/web3.js'

const connection = new Connection(clusterApiUrl("devnet"));

// load user from id.json
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

// collections are just nfts that point to other nfts
const collectionMint = generateSigner(umi);

const transaction = await createNft(umi, {
    mint : collectionMint,
    name : "My Collection", 
    symbol : "MC",
    uri : "https://...",
    sellerFeeBasisPoints : percentAmount(0),
    isCollection : true
})

// send transaction
await transaction.sendAndConfirm(umi);

// fetch collection
const createdCollectionNft = await fetchDigitalAsset(umi, collectionMint.publicKey);

console.log(`created collection address is ${getExplorerLink("address", createdCollectionNft.mint.publicKey, "devnet")}`);