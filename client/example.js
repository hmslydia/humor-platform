Template.example.events({
  'click #seeNextExample': function(){
    //console.log(this)
    var index = (this.index + 1)
    goToNextPage("direct", "example", {index: index})
  },
  
  'click #nextUp': function(){
    goToNextPage("task")
  }
})


Template.example.events({
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