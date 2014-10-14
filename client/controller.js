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
    }else 
    if (    Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
            Meteor.user().profile.currentAnalysisType == "connectTheDots" && 
            Meteor.user().profile.state == "analysis" &&
            Meteor.user().profile.currentAnalysisSeenInstructions == false
            ){
      return "Start by learning to analyze jokes for 'connecting the dots.'"
    } else 
    if (
            Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
            Meteor.user().profile.currentAnalysisType == "connectTheDots" && 
            Meteor.user().profile.state == "analysis" &&
            Meteor.user().profile.currentAnalysisSeenInstructions == true
            ){    
      return "First mission: analyze 10 jokes for 'connecting the dots.'"
    } else 
    if (
            //Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
            Meteor.user().profile.currentAnalysisType == "insult" && 
            Meteor.user().profile.state == "peer review" &&
            Meteor.user().profile.currentAnalysisSeenInstructions == false
            ){    
      return "Next mission: review the answers of other analysts.  Pick your favorite."
    } else {
      return "I don't know where to go next"
    }
  },
  'buttonText': function(){
    return "Start now!"
    /*
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
    */
  }
})
/*
Template.nextUp.rendered = function(){
  console.log(Meteor.user().profile.currentAnalysisSeenInstructions)
  /*
  var instructionPages = ["insultInstructions"]
  console.log(Router.current().route.name)
  if (_.contains(instructionPages, Router.current().route.name)) {
    //console.log('HERE')
    //Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.currentAnalysisSeenInstructions": true }})
  }
  
}
*/
Template.nextUp.events({
  'click #resumeButton': function(){
    //calc next page type
    var pageType = Meteor.user().profile.pageType 
    
    
    //WORK HERE - I WILL NEED MORE COMPLEX LOGIC (maybe)
    if (pageType == "home"){
      Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.pageType": "instructions" }})
    } else
    if (pageType == "waypoint"){
      Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.pageType": "instructions" }})
    } else
    if (pageType == "instructions"){
      Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.pageType": "task" }})
    } else
    {
      Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.pageType": "home" }})
    }  
  
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
    
    var pageType = Meteor.user().profile.pageType 

    if (pageType == "home"){
      Router.go("/") //should really need this
      return
    }     
    if (pageType == "waypoint"){
      Router.go("waypoint")
      return
    }    
    if (pageType == "instructions"){
      //WORK HERE - check AnalysisType ("insult", connectTheDots", ) and state ("analysis", "peer review", "open")
      if (Meteor.user().profile.currentAnalysisType == "insult" && 
          Meteor.user().profile.state == "analysis"){
        Router.go('insultInstructions')
        return 
      }
      if (Meteor.user().profile.currentAnalysisType == "connectTheDots" && 
          Meteor.user().profile.state == "analysis"){
        Router.go('connectTheDotsInstructions')
        return 
      }
      if (Meteor.user().profile.currentAnalysisType == "expectationViolation" && 
          Meteor.user().profile.state == "analysis"){
        Router.go('expectationViolationInstructions')
        return 
      }                    
    }
    
    if ( pageType == "task" ){
      //Insult Analysis, not started, instructions seen.
      if (    //Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
              Meteor.user().profile.currentAnalysisType == "insult" && 
              Meteor.user().profile.state == "analysis" //&&
              //Meteor.user().profile.currentAnalysisSeenInstructions == true
              ){
        //start analyzing
        var params = {
          joke_id: jokeId
        }
        //console.log(params)
        Router.go("insultAnalysisContainerWithJokeId", params)
        return
      } else
      if (    //Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
              Meteor.user().profile.currentAnalysisType == "connectTheDots" && 
              Meteor.user().profile.state == "analysis" //&&
              //Meteor.user().profile.currentAnalysisSeenInstructions == true
              ){
        //start analyzing
        var params = {
          joke_id: jokeId
        }
        //console.log(params)
        Router.go("connectTheDotsAnalysisContainerWithJokeId", params)
        return
      } else
      if (    //Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
              Meteor.user().profile.currentAnalysisType == "insult" && 
              Meteor.user().profile.state == "peer review" //&&
              //Meteor.user().profile.currentAnalysisSeenInstructions == true
              ){
        //start analyzing
        var params = {
          joke_id: jokeId
        }
        //console.log(params)
        Router.go("insultPeerReviewContainerWithJokeId", params)
        return
      }      
      else {
        console.log("NOWHERE TO GO")
        return
      }
    }
    
  }else{
    console.log("no user")
  }
}
