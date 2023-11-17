import { ethers } from "hardhat";
import { WikiPaw } from "../typechain-types";

async function main() {
    const [deployer] = await ethers.getSigners();

    const name = "Wiki Paw";
    const symbol = "WPW";
    const decimals = 18;
    const supply = await ethers.parseEther('100000000000000');
    const txFee = await ethers.BigNumber.from('1');
    const burnFee = await ethers.BigNumber.from('1');
    const feeAddress = deployer.address;
    const tokenOwner = deployer.address;

    const WikiPawFactory = await ethers.getContractFactory('WikiPaw');

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

    await wikiPaw.deployed();
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
