const Escrow = artifacts.require("Escrow");

const assertError = async (promise, error) => {
  try {
    await promise;
  } catch (e) {
    assert(e.message.includes(error));
    return;
  }
  assert(false);
};

contract("Escrow", (accounts) => {
  let escrow = null;
  const [lawyer, payer, recipient] = accounts;
  before(async () => {
    escrow = await Escrow.deployed();
  });

  it("Should deposit", async () => {
    await escrow.deposit({ from: payer, value: 900 });
    const deployerBalance = parseInt(await web3.eth.getBalance(escrow.address));
    assert.equal(deployerBalance, 900);
  });

  // 2

  it("Should not deposit if sender is not the payer", async () => {
    assertError(
      escrow.deposit({ from: accounts[5], value: 900 }),
      "Sender must be the payer"
    );
  });

  // 3
  it("should not deposit if transfer exceed total escrow amount", async () => {
    assertError(
      escrow.deposit({ from: payer, value: 1000 }),
      "Cant send more than escrow amount"
    );
  });

  // 4
  it("should not release if full amount not received", async () => {
    assertError(
      escrow.release({ from: lawyer }),
      "cannot release funds before full amount is sent"
    );
  });

  it("Should not release if not lawyer", async () => {
    await escrow.deposit({ from: payer, value: 100 });
    try {
      await escrow.release({ from: accounts[5] });
    } catch (e) {
      e.message.includes("only lawyer can release funds");
      return;
    }
    assert(false);
  });

  it("should release", async () => {
    const initialRecipientBalance = web3.utils.toBN(
      await web3.eth.getBalance(recipient)
    );
    await escrow.release({ from: lawyer });
    const finalRecipientBalance = web3.utils.toBN(
      await web3.eth.getBalance(recipient)
    );
    assert(
      finalRecipientBalance.sub(initialRecipientBalance).toNumber() === 1000
    );
  });
});
