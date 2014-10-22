
Meteor.startup(function(){
  var insultDialog = {
    template: Template.insultInstructionsIntro,
    title: "Instructions",
    modalDialogClass: "share-modal-dialog", //optional
    modalBodyClass: "share-modal-body", //optional
    modalFooterClass: "share-modal-footer",//optional
    removeOnHide: true, 
  }
  insultRD = ReactiveModal.initDialog(insultDialog);

  var wordPlayDialog = {
    template: Template.wordPlayIntro,
    title: "Instructions",
    modalDialogClass: "share-modal-dialog", //optional
    modalBodyClass: "share-modal-body", //optional
    modalFooterClass: "share-modal-footer",//optional
    removeOnHide: true, 
  }
  wordPlayRD = ReactiveModal.initDialog(wordPlayDialog);

  var expectationViolationDialog = {
    template: Template.expectationViolationInstructionsIntro,
    title: "Instructions",
    modalDialogClass: "share-modal-dialog", //optional
    modalBodyClass: "share-modal-body", //optional
    modalFooterClass: "share-modal-footer",//optional
    removeOnHide: true, 
  }
  expectationViolationRD = ReactiveModal.initDialog(expectationViolationDialog);

  var connectTheDotsDialog = {
    template: Template.connectTheDotsInstructionsIntro,
    title: "Instructions",
    modalDialogClass: "share-modal-dialog", //optional
    modalBodyClass: "share-modal-body", //optional
    modalFooterClass: "share-modal-footer",//optional
    removeOnHide: true, 
  }
  connectTheDotsRD = ReactiveModal.initDialog(connectTheDotsDialog);

  var lensDialog = {
    template: Template.lensInstructionsIntro,
    title: "Instructions",
    modalDialogClass: "share-modal-dialog", //optional
    modalBodyClass: "share-modal-body", //optional
    modalFooterClass: "share-modal-footer",//optional
    removeOnHide: true, 
  }
  lensRD = ReactiveModal.initDialog(lensDialog);

  var observationDialog = {
    template: Template.observationIntro,
    title: "Instructions",
    modalDialogClass: "share-modal-dialog", //optional
    modalBodyClass: "share-modal-body", //optional
    modalFooterClass: "share-modal-footer",//optional
    removeOnHide: true, 
  }
  observationRD = ReactiveModal.initDialog(observationDialog);


});



Template.theories.events({
  'click #next': function(){
    var formData = $('form').serializeArray()  
    
    
    var params = {}  
    params.joke_id = this.joke_id
    params.context = "theories"
    params.skip = false
    params.dontGetIt = false
    params.offensive = false
    
    _.each(formData, function(elt){
      var name = elt["name"]
      var value = elt["value"]
      params[name] = value
    })
    clear()
    
    Meteor.call('submitTheoryAnalysis', params, function(){
      goToNextJoke()
    })
    
    
  },
  /*
  'click #skip': function(){
    var params = {}    
    params.joke_id = this.joke_id
    params.context = "theories"
    params.skip = true
    params.dontGetIt = false
    clear()
    Meteor.call('submitTheoryAnalysis', params, function(){
      goToNextJoke()
    })
  },
  
  'click #dontGetIt': function(){
    var params = {}     
    params.joke_id = this.joke_id
    params.context = "theories"
    params.skip = false
    params.dontGetIt = true
    clear()
    Meteor.call('submitTheoryAnalysis', params, function(){
      goToNextJoke()
    })
  },
  */
  'click #offensive': function(){
    var params = {}    
    params.joke_id = this.joke_id
    params.context = "theories"
    //params.skip = false
    //params.dontGetIt = false
    params.offensive = true
    clear()
    Meteor.call('submitTheoryAnalysis', params, function(){
      goToNextJoke()
    })    
  }  
})

clear = function (){
  $("label.active").each(function(label){$(this).removeClass("active")})
}

Template.theoryList.events({
  'click #insultReminder': function(){
    insultRD.show();
  },
  
  'click #wordPlayReminder': function(){
    wordPlayRD.show();
  },

  'click #expectationViolationReminder': function(){
    expectationViolationRD.show();
  },
  
  'click #connectTheDotsReminder': function(){
    connectTheDotsRD.show();
  },
  
  'click #lensReminder': function(){
    lensRD.show();
  },
  
  'click #observationReminder': function(){
    observationRD.show();
  },   
  
})