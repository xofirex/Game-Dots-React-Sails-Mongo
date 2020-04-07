module.exports = {


  friendlyName: 'View contact',


  description: 'Display "Contact" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/get-score'
    }

  },


  fn: async function () {
    return JSON({q:'Privet'});

  }


};
