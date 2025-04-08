import { createNft, fetchDigitalAsset, findMetadataPda, mplTokenMetadata, verifyCollectionV1 } from "@metaplex-foundation/mpl-token-metadata";
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

const nftAddress = publicKey('JAb85hdJetyBGWQF9JNRcasY56qi7dLQBJdeJGQz83HP');

// transaction to verify if NFT exists in said collecition
const transaction = await verifyCollectionV1(umi, {
    metadata : findMetadataPda(umi, {mint : nftAddress}),
    collectionMint : collectionAddress,
    authority : umi.identity 
});

await transaction.sendAndConfirm(umi);

// get nft
console.log(`verified nft of address ${nftAddress} and collection address ${collectionAddress} can be found here : ${getExplorerLink("address", nftAddress, "devnet")}`)