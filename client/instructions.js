Template.instructions.events({
  'click #seeEx0': function(){
    goToNextPage("direct", "example", {index:0})
  },
  
  'click #nextUp': function(){
    goToNextPage("task")
  }
})