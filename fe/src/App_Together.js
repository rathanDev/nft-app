import "./App.css";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import NftAbi from "./NftAbi.json";
import Registration from "./components/Registration";
// import TodoList from "./components/TodoList";

const App = () => {
  const [selectedAccount, setSelectedAccount] = useState("");

  const [receiptHash, setReceiptHash] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftDesc, setNftDesc] = useState("");
  const [nftUri, setNftUri] = useState("");

  const [balance, setBalance] = useState(-1);
  const [block, setBlock] = useState("");
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  useEffect(() => {
    connectToMetamask();
  }, []);

  const connectToMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log("provider", provider);
    const accounts = await provider.send("eth_requestAccounts", []);
    console.log("accounts", accounts);
    setSelectedAccount(accounts[0]);
    const balance = await provider.getBalance(selectedAccount);
    console.log("balance", balance);

    console.log("ethersUtils-->", ethers);
    const balanceInEther = ethers.utils.formatEther(balance);
    console.log("balanceInEther", balanceInEther);
    setBalance(balance);

    const block = await provider.getBlockNumber();
    provider.on("block", (block) => {
      setBlock(block);
    });
    const contract = new ethers.Contract(contractAddress, NftAbi, provider);
    console.log("contract", contract);
  };

  const flipMintingAllowed = async () => {
    console.log("At transfer-->", ethers);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, NftAbi, provider);

    const contractWithSigner = contract.connect(signer);

    const flipped = await contractWithSigner.flipMintingAllowed();
    console.log("flipped?", flipped, new Date());
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
    <div className="container">
      <Registration />
      <h2>NFT Minting</h2>
      <button onClick={connectToMetamask}>Connect to Metamask</button>
      <label for="receiptHash">Receipt Hash</label>
      <input
        type="text"
        name="receiptHash"
        onChange={(e) => setReceiptHash(e.target.value)}
      />
      <label for="nftName">NFT Name</label>
      <input
        type="text"
        name="nftName"
        onChange={(e) => setNftName(e.target.value)}
      />
      <label for="nftDesc">NFT Description</label>
      <input
        type="text"
        name="nftDesc"
        onChange={(e) => setNftDesc(e.target.value)}
      />
      <label for="nftUri">NFT URI</label>
      <input
        type="text"
        name="nftUri"
        onChange={(e) => setNftUri(e.target.value)}
      />
      Balance: {ethers.utils.formatEther(balance)} <br />
      <button onClick={flipMintingAllowed}>Flip Minting Allowed</button>
      <button onClick={mintNFT}>Mint NFT</button> <br />
    </div>
  );
};

export default App;
