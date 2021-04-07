App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  // initWeb3 -> able to interact with blockchain
  // it can retreive user accounts, send transactions,interact with 
  // smart contracts and more..
  initWeb3: async function() {
   if(typeof web3 !== undefined) {
     // metamask is using web3 behind the scenes and
     App.web3Provider = web3.currentProvider

   } else {
    App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
   }

   web3 = new Web3(App.web3Provider)
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Adoption.json" , (data) => {
      let adoptionArtifact = data;

      // manage all deployments and migrations for contracts 
      App.contracts.adoption = TruffleContract(adoptionArtifact);

      App.contracts.adoption.setProvider(App.web3Provider);

      return App.markAdopted()


       
    })
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },
  markAdopted: function() {
    // get the instance of deployed contracts
    App.contracts.adoption.deployed().then((instance) => {
      return instance.getAdopters.call();
      // returns all doctors in smart contract;
    }).then((adopters) => {
      for (let i = 0; i < adopters.length; i++) {
        
        if(!web3.toBigNumber(adopters[i]).isZero()) {
          $('.panel-pet').eq(i).find('button').text("Success").attr("disabled", true )
        }



        }
      }).catch((err) =>  {
        console.log(err.message)
      })
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    web3.eth.getAccounts( (err,accounts) => {
      if (error) {
        console.log(error);

      }

      App.contracts.adoption.deployed().then((instance) => {

        return instance.adopt.sendTransaction(petId, {from: accounts[0]})

      }).then(result => {

        return App.markAdopted();
      }).catch((error) => {
        console.log(error.message);
      })


    })
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
