// Import necessary modules from Hardhat
import { ethers } from 'hardhat';
import { expect } from 'chai';

// Import the generated types for your contract
import { WikiPaw } from '../typechain-types';

describe('WikiPaw Contract', () => {
    let wikiPaw: WikiPaw;
    let owner: any; // Change the type based on your contract owner's type
    let arewa: {address: string};
    let initialSupply: number

    // Deploy the contract before each test
    beforeEach(async () => {    
        // Deploy the contract with necessary parameters

        // Get the contract owner
        [owner] = await ethers.getSigners();
        arewa = {address: '0xc4e40B693e6060CC16D364dBDF2Ff0e18A6e5cf0'};
        initialSupply = 100000000000000
        
        const WikiPawFactory = await ethers.getContractFactory('WikiPaw');
        wikiPaw = (await WikiPawFactory.deploy(
            'Wiki Paw',
            'WPW',
            18,
            initialSupply, // Initial supply
            1, // _txFee
            1, // _burnFee
            owner.address,
            owner.address
        )) as WikiPaw;

    });

    // Test case for the mint function
    it('should allow the owner to mint new tokens', async () => {
        const amountToMint = 1000;
        const initialOwnerBalance = await wikiPaw.balanceOf(owner.address);
        await wikiPaw.connect(owner).mint(owner.address, amountToMint);

        // Check the balance of the owner after minting
        const ownerBalance = await wikiPaw.balanceOf(owner.address);
        expect(ownerBalance).to.equal(initialOwnerBalance + BigInt(amountToMint), "Incorrect Owner Balance after minting");

        // Check the total supply after minting
        const totalSupply = await wikiPaw.totalSupply();
        expect(totalSupply).to.equal(initialOwnerBalance + BigInt(amountToMint), "Incorrect total supply after minting");
    });

    // Test case for the burn function
    it('should allow token holders to burn their tokens', async () => {
        const initialBalance = await wikiPaw.balanceOf(owner.address);

        const prevTotalSupply = await wikiPaw.totalSupply();
    
        // Burn a portion of the owner's tokens
        const amountToBurn = 1000;
        await wikiPaw.connect(owner).burn(BigInt(amountToBurn));
    
        // Check the balance of the owner after burning
        const newBalance = await wikiPaw.balanceOf(owner.address);
        expect(newBalance).to.equal(initialBalance - BigInt(amountToBurn), 'Incorrect balance after burning');
    
        // Check the total supply after burning
        const totalSupply = await wikiPaw.totalSupply();
        expect(totalSupply).to.equal(prevTotalSupply - BigInt(amountToBurn), 'Incorrect total supply after burning');
    });
    

    // Test case for the updateFee function
    it('should allow the owner to update transaction fees', async () => {
        const newTxFee = 2;
        const newBurnFee = 2;
        const newFeeAddress = '0xc4e40B693e6060CC16D364dBDF2Ff0e18A6e5cf0';

        // Update transaction fees
        await wikiPaw.connect(owner).updateFee(newTxFee, newBurnFee, newFeeAddress);

        // Check if the fees are updated correctly
        expect(await wikiPaw.txFee()).to.equal(newTxFee);
        expect(await wikiPaw.burnFee()).to.equal(newBurnFee);
        expect(await wikiPaw.FeeAddress()).to.equal(newFeeAddress);
    });

    it('should transfer tokens between accounts', async () => {
        const initialOwnerBalance = await wikiPaw.balanceOf(owner.address);
        const transferAmount = 100n;

        // Transfer tokens from owner to arewa
        await wikiPaw.connect(owner).transfer(arewa.address, transferAmount);

        // Check balances after transfer
        const ownerBalanceAfterTransfer = await wikiPaw.balanceOf(owner.address);
        const arewaBalanceAfterTransfer = await wikiPaw.balanceOf(arewa.address);

        expect(ownerBalanceAfterTransfer).to.equal(initialOwnerBalance - transferAmount);
        expect(arewaBalanceAfterTransfer).to.equal(transferAmount);
    });
});
