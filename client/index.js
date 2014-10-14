/*
//Humor Analysis - langing page - invitation to do insults.
//Summary - see progress on all analysis
//
// Insult
// Connect the dots
// Word Play
// Exaggeration ?
// Observational humor
// Logical cleverness
// in-tribe/out-tribe

// For the analysis-types, I want menus for
// - summary (the default page), with Start now buttons.
// - analysis tasks
// - comparision / voting tasks
// (on missions, I can switch you between them, if I want to)
*/

/*
Holy shit, that was useful! So I can publish only the users data without passing it in!
That is super sweet!

Also, reading the documentation cover to cover is useful. Maybe I should try it!

What is the other thing I learned? 
The other thing I learned about is loading templates, and having this.ready() in the data 
field of the router. 

That will enable me to do less hacking around data not yet being ready.

So what am I going to do now? 

Joke Project, clearly. 

Ok, I changed the router stuff to have it be doing it the new (right) way.

Now both Insults and ConnectTheDots seem to be working

So what have I improved:

1. I nailed down the design decision that there are joke sequences that you are randomly assigned to and that you are meant to do them all in order, no matter which type of analysis you have chosen.
the Goals of the system are:
- Show the user as many jokes as possible
- Introduce them to all the analysis types eventually.

2. I change the system from go-to centered to stateChange/process pattern. Geez, I wish I knew what this was properly called. I feel like I've reinvented the wheel here.  Feels a bit stupid, but at least I understand it. 

3. Now there is one update function (on the server) and one goToNext function (on the client)
By passing the appropriate state to it, you can go anywhere you want.  You could even give it a chain of places to go to.  Some how this feels cleaner and more general. 

So that's a bit of an accomplishment. Even though it feels like redoing work already done. 

*/

/////////////////////////////
// Welcome 
/////////////////////////////

Template.welcome.displayName = function() {
		var user = Meteor.user();
		if (!user)
			return '';

		if (user.profile && user.profile.name)
			return user.profile.name;
		if (user.username)
			return user.username;
		if (user.emails && user.emails[0] && user.emails[0].address)
			return user.emails[0].address;

		return '';
	};

createJokeIndexes = function(){
  var obj = {}
  _.each(analysis_types, function(analysis_type){
    obj[analysis_type] = 0
  })
  return obj
}

/*
The goals of this system are:
1. users should analyze as many new jokes as possible (regardless of what analysis type they do for them.
2. the user should learn all the analysis types.

Currently, I'm not sure how I should implements #2, maybe I'll want to switch people between types, but for the moment, we have a sequence of jokeids and the user is proceeding through them, with whatever analysis type happens to be using.

I keep state in the profile of 5 things:
    var sequenceId = Meteor.user().profile.currentSequenceId 
    var sequenceIndex = Meteor.user().profile.currentSequenceIndex
    var sequenceLastIndex = Meteor.user().profile.currentSequenceLastIndex
    
    var jokeId = Meteor.user().profile.currentJokeId   
    var analysisType = Meteor.user().profile.currentAnalysisType 
    var analysisStatus = Meteor.user().profile.currentAnalysisStatus 

Everytime data is entered, I have the chance to update this,
Then I have control flow code that takes in all that data and routes the user somewhere. 

Currently, the state is initially set on login, then it is updated in the function:
- updateNextJoke

Currently, control flow is in two places (perhaps they should be the same or one should call the other)
- startOrResume
- goToNextJoke
*/


/*
This handles all the control flow for the system
*/

startOrResume = function(){
  goToNextJoke()
  /*
   if(Meteor.user()){
     goToNextJoke()
   } else {
    //there is no user logged in: for now, we just go to the home page.
    //TODO: WRITE BEHAVIOR FOR USERS WHO ARE NOT LOGGED IN.
     Router.go("/")
   }
  */
}

Template.welcome.events({
  'click #googleLoginButton': function() {
    Meteor.loginWithGoogle();
  },
  /*
  'click #resumeButton': function() {
    startOrResume()
  },
  */
  'click #startButton': function(){
    startOrResume()
  }
  
})
/*
Template.nextUp.events({
  'click #resumeButton': function() {
    startOrResume()
  }  
})
*/


Template.header.events({
  'click #analyzeInsult': function(){
    if(Meteor.user()){
      //Session.set('analysis_type', 'insult')
      Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.currentAnalysisType": "insult" }}) 
      startOrResume()
    }

  },
  
  'click #analyzeConnectTheDots': function(){
    //Session.set('analysis_type', 'connect_the_dots')
    //startOrResume()
    if(Meteor.user()){
      Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.currentAnalysisType": "connectTheDots" }})
      startOrResume()
    }
  }
})

/////////////////////////////
// Login Reminder
/////////////////////////////
Template.loginReminder.events({
  'click #googleLoginButton': function() {
    Meteor.loginWithGoogle();
  },
  
  'click #skipLogin': function(){
    var skipReminder = true
    goToNextJoke(skipReminder)
  },
  
  'click #resumeTasks': function(){
    goToNextJoke()
  }
});









/////////////////////////////
// Set IP
/////////////////////////////
/*
myIP = function () {

    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("GET","http://api.hostip.info/get_html.php",false);
    xmlhttp.send();

    hostipInfo = xmlhttp.responseText.split("\n");

    for (i=0; hostipInfo.length >= i; i++) {
        ipAddress = hostipInfo[i].split(":");
        if ( ipAddress[0] == "IP" ) return ipAddress[1];
    }

    return false;
    
}

Meteor.startup(function(){  
  Deps.autorun(function(){
    if( !Session.get('ip')){
      Session.set('ip', myIP())
    }
  });
})

*/
