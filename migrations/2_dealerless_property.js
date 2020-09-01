
const DealerlessMarket = artifacts.require("DealerlessMarket");
module.exports = function(deployer) {
  deployer.deploy(DealerlessMarket)
  .then(async (contract) => {
    await contract.registerLand('{"name":"Olympus Mons","image":"https://cdn.mos.cms.futurecdn.net/XNRcoHujh5mZHmPQZzYbgH-650-80.jpg"}');
    await contract.registerLand('{"name":"Tharsis volcanoes","image":"https://cdn.mos.cms.futurecdn.net/DKavvKEEdrtRJhfKXndKeW-650-80.jpg"}');
    await contract.registerLand('{"name":"Valles Marineris","image":"https://cdn.mos.cms.futurecdn.net/vpZLAKQca68wDX7zb3AnpG-650-80.jpg"}');
    await contract.registerLand('{"name":"North Pole","image":"https://i.ytimg.com/vi/3N_o2JqVdwA/maxresdefault.jpg"}');
    await contract.registerLand('{"name":"South Pole","image":"https://cdn.mos.cms.futurecdn.net/pVqhqw779HUn2JEV9B2ZsX.jpg"}');
    await contract.registerLand('{"name":"Gale Crater","image":"https://mars.nasa.gov/msl/images/PIA14290_GaleCrater_ellipse1-full.jpg"}');
    await contract.registerLand('{"name":"Mount Sharp","image":"https://www.jpl.nasa.gov/spaceimages/images/largesize/PIA19912_hires.jpg"}');
    await contract.registerLand('{"name":"Medusae Fossae","image":"https://cdn.mos.cms.futurecdn.net/8LTqBJyx6pdA5dKk5cNosb-650-80.jpg"}');
    await contract.registerLand('{"name":"Hale Crater","image":"https://cdn.mos.cms.futurecdn.net/oQagT9pJXc9bdNNcgzR27X-650-80.jpg"}');
    await contract.registerLand('{"name":"Ghost Dunes","image":"https://cdn.mos.cms.futurecdn.net/VDWEBupoEHTkKcPbznUh8M-650-80.jpg"}');
  });
};