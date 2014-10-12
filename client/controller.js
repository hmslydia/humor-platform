Template.nextUp.helpers({
  'copyText': function(){
    if (    Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
            Meteor.user().profile.currentAnalysisType == "insult" && 
            Meteor.user().profile.state == "analysis" &&
            Meteor.user().profile.currentAnalysisSeenInstructions == false
            ){
      return "Start by learning to analyze jokes for 'Insult.'"
    } else if (
            Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
            Meteor.user().profile.currentAnalysisType == "insult" && 
            Meteor.user().profile.state == "analysis" &&
            Meteor.user().profile.currentAnalysisSeenInstructions == true
            ){    
      return "First mission: analyze 10 jokes for insults"
    } else {
      return "I don't know where to go next"
    }
  },
  'buttonText': function(){
    if (    Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
            Meteor.user().profile.currentAnalysisType == "insult" && 
            Meteor.user().profile.state == "analysis" &&
            Meteor.user().profile.currentAnalysisSeenInstructions == false
            ){
      return "Begin!"
    } else if (
            Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
            Meteor.user().profile.currentAnalysisType == "insult" && 
            Meteor.user().profile.state == "analysis" &&
            Meteor.user().profile.currentAnalysisSeenInstructions == true
            ){    
      return "Begin!"
    } else {
      return "Error"
    }
  }
})

Template.nextUp.rendered = function(){
  console.log(Meteor.user().profile.currentAnalysisSeenInstructions)
  
  var instructionPages = ["insultInstructions"]
  console.log(Router.current().route.name)
  if (_.contains(instructionPages, Router.current().route.name)) {
    console.log('HERE')
    Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.currentAnalysisSeenInstructions": true }})
  }
}

Template.nextUp.events({
  'click #resumeButton': function(){
    goToNextJoke()
  }
})

goToNextJoke = function () {  
  if( Meteor.user() ){
    //use the state set by updateNextJoke to route us to the next location  
    var sequenceId = Meteor.user().profile.currentSequenceId 
    var sequenceIndex = Meteor.user().profile.currentSequenceIndex
    var sequenceLastIndex = Meteor.user().profile.currentSequenceLastIndex
    
    var jokeId = Meteor.user().profile.currentJokeId   
    var analysisType = Meteor.user().profile.currentAnalysisType 
    var analysisStatus = Meteor.user().profile.currentAnalysisStatus 
    var state = Meteor.user().profile.state 
    
    
    // Insult Analysis, not started, instructions not seen.
    if (    Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
            Meteor.user().profile.currentAnalysisType == "insult" && 
            Meteor.user().profile.state == "analysis" &&
            Meteor.user().profile.currentAnalysisSeenInstructions == false
            ){
      //Go to instructions
      Router.go('insultInstructions')
    }
    
    //Insult Analysis, not started, instructions seen.
    if (    Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
            Meteor.user().profile.currentAnalysisType == "insult" && 
            Meteor.user().profile.state == "analysis" &&
            Meteor.user().profile.currentAnalysisSeenInstructions == true
            ){
      //start analyzing
      var params = {
        joke_id: jokeId
      }
      Router.go("insultAnalysisContainerWithJokeId", params)
      return
    }
    
    /*
    //default action - go to next joke in the sequence for this analysis type
    if(analysisStatus == "completed"){
      Router.go("/")
      return
    } 
    console.log(analysisType)
    
    if(state == "waypoint"){
      console.log("goto: waypoint")
      Router.go("waypoint")
      return
    } 
    
    if(analysisType=="insult"){
      var params = {
        joke_id: jokeId
      }
      Router.go("insultAnalysisContainerWithJokeId", params)
      return
    }
    
    if(analysisType=="connectTheDots"){
      var params = {
        joke_id: jokeId
      }
      Router.go("connectTheDotsAnalysisContainerWithJokeId", params)
      return
    }
    
    */
    
  }else{
    console.log("no user")
  }
}
