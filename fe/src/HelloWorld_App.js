import "./App.css";
import react, { useState, useEffect } from "react";
import HelloWorldABI from "./HelloWorldABI.json";
import { ethers } from "ethers";
// require("ethers")

const App = () => {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [balance, setBalance] = useState(-1);
  const [block, setBlock] = useState("");
  const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
  const decimals = 18;

  useEffect(() => {
    connectToMetamask();
    // ethersUtils = ethers.utils;
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
    const contract = new ethers.Contract(
      contractAddress,
      HelloWorldABI,
      provider
    );
    console.log("contract", contract);

    // const contractName = await contract.name();
    // console.log("contractName", contractName);
  };

  const transferEther = async () => {
    console.log("At transfer-->", ethers);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      contractAddress,
      HelloWorldABI,
      provider
    );
    console.log(contract);

    // const tokenUnits = await contract.decimals();
    const tokenAmountInEther = ethers.utils.parseUnits("100", decimals);
    console.log(tokenAmountInEther)

    const contractWithSigner = contract.connect(signer);
    // daiContractWithSigner.transfer(contractAddress, tokenAmountInEther);

    const tx = await contractWithSigner.sendTransaction({
      to: contractAddress,
      value: tokenAmountInEther,
    });

    console.log(`Transaction hash: ${tx.hash}`);

    console.log("transfered?", new Date());
  };

  const handleName = async () => {
    // connectToMetamask();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      HelloWorldABI,
      provider.getSigner()
    );
    console.log("setName", new Date());
    await contract.setName("HelloWorldName");
    const name = await contract.getName();
    console.log("name", new Date(), name);
  };

  return (
    <div>
      <h1>Minting NFT</h1>
      <button onClick={connectToMetamask}>Connect to Metamask</button> <br />
      <button onClick={handleName}>HandleName</button> <br />
      <button onClick={transferEther}>Transfer Ether</button> <br />
      Balance: {ethers.utils.formatEther(balance)}
    </div>
  );


  // <button onClick={convertInEthers}>Convert</button> <br />
  // 
  // const convertInEthers = () => {
  //   const balanceInEther = ethers.utils.formatEther(balance);
  //   console.log("balanceInEther", balanceInEther);
  // };

};

export default App;
