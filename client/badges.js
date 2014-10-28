Template.badge1.events({
  'click #seeEx2': function(){
    goToNextPage("direct", "example",{index:2})
  },

  'click #nextUp': function(){
    goToNextPage("task")
  }
})

Template.badge2.events({
  'click #nextUp': function(){
    goToNextPage("task")
  }
})

Template.badge3.events({
  'click #nextUp': function(){
    goToNextPage("task")
  }
})