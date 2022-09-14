import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Machine tests", async () => {
  async function deployMachineFixture(value: number = 0) {
    const [owner, user, sender, receiver, ...others] =
      await ethers.getSigners();
    const accounts = {
      owner,
      user,
      sender,
      receiver,
      others,
    };

    const Storage = await ethers.getContractFactory("Storage");
    const Machine = await ethers.getContractFactory("Machine");
    const Calculator = await ethers.getContractFactory("Calculator");

    const storage = await Storage.deploy(value);
    const machine = await Machine.deploy(storage.address);
    const calculator = await Calculator.deploy();

    return { storage, machine, calculator, accounts };
  }

  describe("Deployment", () => {
    it("Should successfully deploy contracts", async () => {
      const { machine, storage } = await loadFixture(deployMachineFixture);

      expect(machine).not.to.be.null;
      expect(storage).not.to.be.null;
    });
  });

  describe("#saveValue", () => {
    it("should update storage contract value", async () => {
      const newValue = 99;

      const { machine, storage } = await loadFixture(deployMachineFixture);

      await machine.saveValue(newValue);
      const result = await storage.value();

      expect(result).to.equal(newValue);
    });
  });

  describe("#addWithCall", () => {
    it("Should emit event on transfer with call", async () => {
      const first = 1;
      const second = 2;

      const { machine, calculator } = await loadFixture(deployMachineFixture);

      await expect(machine.addWithCall(calculator.address, first, second))
        .to.emit(machine, "calledByCall")
        .withArgs(first, second, true);
    });

    it("Should successfully call to calculator contract", async () => {
      const first = 1;
      const second = 2;

      const { machine, calculator, accounts } = await loadFixture(
        deployMachineFixture
      );
      const { owner } = accounts;

      const { from, to } = await machine.addWithCall(
        calculator.address,
        first,
        second
      );

      expect(from).equal(owner.address);
      expect(to).equal(machine.address);
    });

    it("Should successfully add values", async () => {
      const first = 1;
      const second = 2;

      const { machine, calculator } = await loadFixture(deployMachineFixture);

      await machine.addWithCall(calculator.address, first, second);
      const calculatedResult = await calculator.calculateResult();

      expect(calculatedResult).equal(first + second);
    });

    it("Should not mutate caller contract state", async () => {
      const { machine, calculator } = await loadFixture(deployMachineFixture);

      await machine.addWithCall(calculator.address, 1, 2);

      const calculatedResult = await calculator.calculateResult();
      const machineCalculatedResult = await machine.calculateResult();

      expect(calculatedResult).equal(3);
      expect(machineCalculatedResult).equal(0);
    });

    it("Should validate user on each context", async () => {
      const { machine, calculator } = await loadFixture(deployMachineFixture);

      await machine.addWithCall(calculator.address, 1, 2);

      const machineUser = await machine.user();
      const calculatorUser = await calculator.user();

      expect(machineUser).equal(ethers.constants.AddressZero);
      expect(calculatorUser).equal(machine.address);
    });
  });
});
