import { ethers } from "hardhat";
import { WikiPaw } from "../typechain-types";

const hre = require('hardhat')

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    const name = "Wiki Paw";
    const symbol = "WPW";
    const decimals = 18;
    const supply = await hre.ethers.parseEther('100000000000000');
    const txFee = 1;
    const burnFee = 1;
    const feeAddress = deployer.address;
    const tokenOwner = deployer.address;

    const WikiPawFactory = await hre.ethers.getContractFactory('WikiPaw');

    const wikiPaw:WikiPaw = await WikiPawFactory.deploy(
        name,
        symbol,
        decimals,
        supply,
        txFee,
        burnFee,
        feeAddress,
        tokenOwner
    );
    
    console.log(`Deploying ${name}...`);
    
    await wikiPaw.waitForDeployment()
    // await wikiPaw.deployed();
    console.log(`${name} has been deployed to: ${await wikiPaw.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(
        () => process.exit(0)
    )
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
