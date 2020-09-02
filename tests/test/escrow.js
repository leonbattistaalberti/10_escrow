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
});
