// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    bool public isMintingAllowed;

    struct Receipt {
        address owner;
        uint timestamp;
    }

    mapping(bytes32 => Receipt) private _receipts;

    constructor() ERC721("MyNFT", "NFT") {}

    function mintNFT(bytes32 receiptHash, string memory name, string memory description, string memory imageURI) public {
        require(_receipts[receiptHash].owner == address(0), "Receipt has already been used");
        require(_tokenIds.current() < 5, "Maximum number of NFTs minted");
        require(isMintingAllowed, "Minting is not allowed now");

        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _safeMint(msg.sender, tokenId);
        // _setTokenURI(tokenId, imageURI);

        Receipt memory receipt = Receipt({ owner: msg.sender, timestamp: block.timestamp });
        _receipts[receiptHash] = receipt;
    }

    function verifyReceipt(bytes32 receiptHash) public view returns (bool) {
        return _receipts[receiptHash].owner == msg.sender;
    }

    function findIsMintingAllowed() public view returns (bool) {
        // if (block.timestamp >= 1641532800 && block.timestamp <= 1642147200) return true; // "Minting is only available between 7 Jan to 14 Jan 2023");
        return isMintingAllowed;
    }

    function enableMinting() external onlyOwner {
        isMintingAllowed = true;
    }

}