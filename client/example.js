Template.example.events({
  'click #seeEx1': function(){
    console.log("EXAMPLE")
    goToNextPage("direct", "example", {index: 1})
  },
  
  'click #nextUp': function(){
    goToNextPage("task")
  }
})