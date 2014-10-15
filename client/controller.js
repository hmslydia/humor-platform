/*
Control flow is managed by setting state in the user profile. Based on that, the function goToNextJoke() will re-route the user to the next screen. 

User profile state-setting is handled in multiple places:
1. server-side, in the updateNextJoke() function. If the user is submitting data, then the server has a function updateNextJoke() which takes you to the next joke
2. client-side in the nextUp, #resumeButton click handler. Based on the current state of the system, we update the page type, right before we call goToNext(). 

What gets confusing is that updateNextJoke() implicitly updates the page type, for example, when transitioning from the last joke of one sequence to the first joke of another sequence, there will have to be a page change to introduce the next sequence.

Somehow I have to managed both these types of state: page state and joke sequence state. 

I think that it would be better to have explicit joke sequences, so we know when they end

pageType: "home" || "instructions" || "waypoint" || "task" 
state: "analysis" || "peer review" || "free"
analysisType = "insult" || "connectTheDots"

//maybe state and analysisType should be combined
*/


Template.nextUp.helpers({
  'copyText': function(){
    if (    Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
            Meteor.user().profile.currentAnalysisType == "insult" && 
            Meteor.user().profile.state == "analysis" &&
            Meteor.user().profile.pageType == "home"
            ){
      return "Start by learning to analyze jokes for 'Insults.'"
    } else if (
            Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
            Meteor.user().profile.currentAnalysisType == "insult" && 
            Meteor.user().profile.state == "analysis" &&
            Meteor.user().profile.pageType == "instructions"
            ){    
      return "Next: Analyze 10 jokes for insults"
    }else 
    if (    Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
            Meteor.user().profile.currentAnalysisType == "connectTheDots" && 
            Meteor.user().profile.state == "analysis" &&
            Meteor.user().profile.pageType == "waypoint"
            ){
      return "Next: learn to analyze jokes for 'connecting the dots.'"
    } else 
    if (
            Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
            Meteor.user().profile.currentAnalysisType == "connectTheDots" && 
            Meteor.user().profile.state == "analysis" &&
            Meteor.user().profile.pageType == "instructions"
            ){    
      return "Next: Analyze 10 jokes for 'connecting the dots.'"
    } else 
    if (
            //Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
            Meteor.user().profile.currentAnalysisType == "insult" && 
            Meteor.user().profile.state == "peer review" //&&
            //Meteor.user().profile.currentAnalysisSeenInstructions == false
            ){    
      return "Next: Review the answers of other 'Insult' analysts.  Pick your favorite."
    } else 
    if (
            //Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
            Meteor.user().profile.currentAnalysisType == "connectTheDots" && 
            Meteor.user().profile.state == "peer review" //&&
            //Meteor.user().profile.currentAnalysisSeenInstructions == false
            ){    
      return "Next: Review the answers of other 'Connect The Dots' analysts.  Pick your favorite."
    } else {
      return "I don't know where to go next"
    }
  },
  'buttonText': function(){
    return "Begin"
  }
})

Template.nextUp.events({
  'click #resumeButton': function(){
    //calc next page type
    var pageType = Meteor.user().profile.pageType 
    var state = Meteor.user().profile.state 
    
    //WORK HERE - I WILL NEED MORE COMPLEX LOGIC (maybe)
    if (pageType == "home"){
      Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.pageType": "instructions" }})
    } else
    if (pageType == "waypoint" && state == "analysis"){
      Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.pageType": "instructions" }})
    } else
    if (pageType == "waypoint" && state == "peer review"){
      Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.pageType": "task" }})
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
      } else
      if (    //Meteor.user().profile.currentAnalysisStatus == "notStarted" && 
              Meteor.user().profile.currentAnalysisType == "connectTheDots" && 
              Meteor.user().profile.state == "peer review" //&&
              //Meteor.user().profile.currentAnalysisSeenInstructions == true
              ){
        //start analyzing
        var params = {
          joke_id: jokeId
        }
        //console.log(params)
        Router.go("connectTheDotsPeerReviewContainerWithJokeId", params)
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
