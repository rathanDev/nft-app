import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import NftAbi from "./NftAbi.json";
// import Registration from "./components/Registration";

const NFT = () => {
  const [selectedAccount, setSelectedAccount] = useState("");

  const [receiptHash, setReceiptHash] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftDesc, setNftDesc] = useState("");
  const [nftUri, setNftUri] = useState("");

  const [balance, setBalance] = useState(-1);
  const [block, setBlock] = useState("");
  const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

  useEffect(() => {
    // connectToMetamask();
  }, []);

  const connectToMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setSelectedAccount(accounts[0]);
    const balance = await provider.getBalance(selectedAccount);

    const balanceInEther = ethers.utils.formatEther(balance);
    setBalance(balance);

    const block = await provider.getBlockNumber();
    provider.on("block", (block) => {
      setBlock(block);
    });
    const contract = new ethers.Contract(contractAddress, NftAbi, provider);
    console.log("contract", contract);
  };

  const enableMinting = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, NftAbi, provider);

    const contractWithSigner = contract.connect(signer);

    const enabled = await contractWithSigner.enableMinting();
    console.log("enabled?", enabled, new Date());
  };

  const mintNFT = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, NftAbi, provider);

    const contractWithSigner = contract.connect(signer);

    const receiptHashInBytes = ethers.utils.formatBytes32String(receiptHash);
    const mintResult = await contractWithSigner.mintNFT(
      receiptHashInBytes,
      nftName,
      nftDesc,
      nftUri
    );
    console.log("mintResult?", mintResult, new Date());
  };

  return (
    <>
      <h2>NFT Minting</h2>
      <button onClick={connectToMetamask}>Connect to Metamask</button>
      <label htmlFor="receiptHash">Receipt Hash</label>
      <input
        type="text"
        name="receiptHash"
        onChange={(e) => setReceiptHash(e.target.value)}
      />
      <label htmlFor="nftName">NFT Name</label>
      <input
        type="text"
        name="nftName"
        onChange={(e) => setNftName(e.target.value)}
      />
      <label htmlFor="nftDesc">NFT Description</label>
      <input
        type="text"
        name="nftDesc"
        onChange={(e) => setNftDesc(e.target.value)}
      />
      <label htmlFor="nftUri">NFT URI</label>
      <input
        type="text"
        name="nftUri"
        onChange={(e) => setNftUri(e.target.value)}
      />
      Balance: {ethers.utils.formatEther(balance)} <br />
      <button onClick={enableMinting}>Enable Minting</button>
      <button onClick={mintNFT}>Mint NFT</button> <br />
      </>
  );
};

export default NFT;
