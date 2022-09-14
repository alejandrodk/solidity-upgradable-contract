import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Calculator tests", async () => {
  async function deployCalculatorFixture() {
    const [owner, user, sender, receiver, ...others] =
      await ethers.getSigners();
    const accounts = { owner, user, sender, receiver, others };

    const Calculator = await ethers.getContractFactory("Calculator");
    const calculator = await Calculator.deploy();

    return { calculator, accounts };
  }

  describe("#add", () => {
    it("should calculate result", async () => {
      const first = 1;
      const second = 2;

      const { calculator } = await deployCalculatorFixture();

      await calculator.add(first, second);
      const result = await calculator.calculateResult();

      expect(result).to.equal(first + second);
    });
  });
});
