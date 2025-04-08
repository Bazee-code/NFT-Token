import { createNft, fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, keypairIdentity, percentAmount, publicKey } from "@metaplex-foundation/umi";
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

const collectionAddress = publicKey("HutUAyNZBVa7bpkkZpvoMbwSC1dyDL6mtEc1SFMne6Q6");

console.log('creating NFT....');

const mint = generateSigner(umi);

// transaction to create NFT
const transaction = await createNft(umi, {
    mint ,
    name : "My NFT", 
    uri : "https://raw.githubusercontent.com/Bazee-code/NFT-Token/refs/heads/main/metadata.json",
    sellerFeeBasisPoints : percentAmount(0),
    collection : {
        key : collectionAddress,
        verified : false
    }
});

await transaction.sendAndConfirm(umi);

const createdNft = await fetchDigitalAsset(umi, mint.publicKey);
// get nft
console.log(`created nft address is: ${getExplorerLink("address", createdNft.mint.publicKey, "devnet")}`)