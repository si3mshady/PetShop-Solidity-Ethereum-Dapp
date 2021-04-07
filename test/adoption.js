const Adoption = artifacts.require("Adoption");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Adoption", function (accounts )  {
  describe('First group of tests', () => {
    let instance;
    // executed before all test in block
    before(async() => {
      // this will return our the already deployed contract 
      instance = await Adoption.deployed();
    });

    // an 'it' hook
    // when changes are made to the blockchain, use sendTransaction method
    it('User should adopt a pet', async() => {
      await instance.adopt.sendTransaction(
        8, {from: accounts[0]});

        //when using getter functions, use call method -> pet number 8
        let adopter = await instance.adopters.call(8);
        // retrieving values from blockchain 
        assert.equal(adopter, accounts[0], "Incorrect owner address")
        // checks if actual results matches the expected..
        // adopter is the  actual result --  accounts[0] is the expected. 
      })
      // making a call to the blockchain
      it('Should get adopter address by pet id in array', async () => {
        let adopters = await instance.getAdopters.call();
        assert.equal(adopters[8], accounts[0], "Owner of pet id should be recorded in array")
      });


      it('Should throw if invalid pet id is given', async() => {
        
        try {
          await instance.adopt.sendTransaction(17, {from: accounts[0]});
          // this shoud trigger and error 
          //if this
          assert.fail(true,false, 'this function did not throw');
        } catch(error) {
          assert.include(String(error), "revert",`Expected "revert" but got ${error}`)
          // this checks the the string 'revert' in the error message , test fails if 
          // string revert does not appear. 
        }

      })
      

    
  });
});
