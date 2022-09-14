import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Machine tests", async () => {
  async function deployMachineFixture(value: number = 0) {
    const [owner, user, sender, receiver, ...others] =
      await ethers.getSigners();
    const accounts = { owner, user, sender, receiver, others };

    const Storage = await ethers.getContractFactory("Storage");
    const Machine = await ethers.getContractFactory("Machine");

    const storage = await Storage.deploy(value);
    const machine = await Machine.deploy(storage.address);

    return { storage, machine, accounts };
  }

  describe("Deployment", () => {
    it("Should successfully deploy contracts", async () => {
      const { machine, storage } = await loadFixture(deployMachineFixture);

      expect(machine).not.to.be.null;
      expect(storage).not.to.be.null;
    });
  });

  describe("save value", () => {
    it("should update storage contract value", async () => {
      const newValue = 99;

      const { machine, storage } = await loadFixture(deployMachineFixture);

      await machine.saveValue(newValue);
      const result = await storage.value();

      expect(result).to.equal(newValue);
    });
  });
});
