Template.nextUp.helpers({
  'buttonText': function(){
    return "Analyze jokes"
  }
})

Template.nextUp.events({
  'click #resumeButton': function(){
    //calc next page type
    var pageType = Meteor.user().profile.pageType 
    //var state = Meteor.user().profile.state 
    
    if (pageType == "home"){
      Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.pageType": "task" }})
    }
    goToNextPage()
  }
})

goToNextPage = function (pageType, route, params) {  
  if( Meteor.user() ){    
    var jokeId = Meteor.user().profile.currentJokeId   

    if (pageType == undefined){
      pageType = Meteor.user().profile.pageType || "home"
    }
    
    if (pageType == "home"){
      Router.go("instructions") //should really need this
      return
    } 
    if (pageType == "badge"){
      var badgeTemplate = Meteor.user().profile.badgeTemplate
      Router.go(badgeTemplate)
      return
    }
    if (pageType == "task"){
      var params = {
        joke_id: jokeId
      }
      Router.go("theories", params)
      return
    } 
    if (pageType == "direct"){
      Router.go(route, params)
    }    
  }else{
    console.log("no user")
  }
}
