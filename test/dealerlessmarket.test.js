const DealerlessMarket = artifacts.require("DealerlessMarket");

contract("Martian land token", accounts => {
  it("Token metadata should be correct", async () => {
    let contract = await DealerlessMarket.deployed();
    let name = await contract.name();
    let symbol = await contract.symbol();
    assert.equal(name, "DealerlessMarket");
    assert.equal(symbol, "DEAL");
  });
});


