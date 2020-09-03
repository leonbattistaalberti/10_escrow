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
  const [lawyer, payer, payee] = accounts;
  before(async () => {
    escrow = await Escrow.deployed();
  });
  it("Should deposit", async () => {
    await escrow.deposit({ from: payer, value: 900 });
    const deployerBalance = parseInt(await web3.eth.getBalance(escrow.address));
    assert.equal(deployerBalance, 900);
  });
  it("Should not deposit if sender is not the payer", async () => {
    assertError(
      escrow.deposit({ from: accounts[5], value: 900 }),
      "Sender must be the payer"
    );
  });
  it("Should not send more than escrow amount", async () => {
    assertError(
      escrow.deposit({ from: payer, value: 2000 }),
      "Cannot send more than escrow amount"
    );
  });
  it("Should not release funds before the full amount sent", async () => {});
});
