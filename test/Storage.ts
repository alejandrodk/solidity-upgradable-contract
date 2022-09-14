import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Storage tests", async () => {
  async function deployStorageFixture(value: number = 10) {
    const [owner, user, sender, receiver, ...others] =
      await ethers.getSigners();
    const accounts = { owner, user, sender, receiver, others };

    const Storage = await ethers.getContractFactory("Storage");
    const storage = await Storage.deploy(value);

    return { storage, accounts };
  }

  describe("Deployment", () => {
    it("Should successfully initialize value property", async () => {
      const EXPECTED_VALUE = 10;

      const { storage } = await loadFixture(deployStorageFixture);

      const result = await storage.value();

      expect(result).to.equal(EXPECTED_VALUE);
    });
  });

  describe("setValue", () => {
    it("Should set value successfully", async () => {
      const EXPECTED_VALUE = 100;

      const { storage } = await loadFixture(deployStorageFixture);
      await storage.setValue(EXPECTED_VALUE);
      
      const result = await storage.value();

      expect(result).to.equal(EXPECTED_VALUE);
    });
  });
});
