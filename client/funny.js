Template.funnyAnalysis.events({
  'change input:radio[name=funny]': function(){   
    var element = $('input:radio[name=funny]:checked');
    var funnyYNval = $(element).val();
    
    //highlightCurrentAnswer("funny", funnyYNval)
    
    if(funnyYNval == "no"){
      //ADVANCE TO NEXT JOKE
      var params = {}    
      params.joke_id = this.joke_id
      params.context = "theories"
      params.offensive = false
      params.funnyYN = "no"
      clear()
      Meteor.call('submitTheoryAnalysis', params, function(){
        goToNextJoke()
      })         
      
    } else {
      //Show the rest of the UI
      $('.theoryToggle').show()
    }
    
    
  },
  

})

Template.funnyAnalysis.showOptional = function(){
  var routeName = Router.current().route.name
  var routesToShowOptionalStuff = ["insultAnalysisContainerWithJokeIndex", "connectTheDotsAnalysisContainerWithJokeIndex"]
  if ( _.contains(routesToShowOptionalStuff, routeName) ){
    return true  
  } else {
    return false
  }
}