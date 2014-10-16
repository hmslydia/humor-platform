
Template.waypoint.numJokes = function(){
  return 10 //getJokeIndex() + 1
}

Template.waypoint.events({
  'click #googleLoginButton': function() {
    Meteor.loginWithGoogle();
  },
  
  'click #tenMore': function(){
    Meteor.call('submitWaypoint', function(){
      goToNextJoke()
    })    
  },
  
  'click #goHome': function(){
    Router.go('/')
  }
});