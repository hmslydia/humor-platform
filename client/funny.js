Template.funnyAnalysis.events({
  'change input:radio[name=funny]': function(){   
    var element = $('input:radio[name=funny]:checked');
    var funnyYNval = $(element).val();
    
    highlightCurrentAnswer("funny", funnyYNval)
  }
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