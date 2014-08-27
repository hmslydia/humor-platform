/*

I think I need the notion of some kind of "mission"
Analyze 25 jokes, see the results, do another mission, etc.  

The home page should have various mission to go on?

The thank you page should congratulate you for finishing a mission 
It should then send you back to a summary of your work.

//Mission Summary/Selection Page

//Instructions (should it just be an addition to the page? (show/hide instructions)

//Maybe the first page is about insults, but there is an index of analysis types that you can go to?

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
Session Variables:

current_mission = "insult0"
// but I really need a current "mission", something seperate from the concept of a 
//current_analysis_type

joke_indexes = {'insult': 0, 'connect_the_dots': 0}


*/


/////////////////////////////
// Helpers
/////////////////////////////

getJokeIndex = function(){
  if( Session.get('joke_indexes') != undefined && Session.get('analysis_type') != undefined){
    var analysis_type = Session.get('analysis_type')
    var joke_index = Session.get('joke_indexes')[analysis_type]
    return parseInt(joke_index)
  } else {
    var joke_index = parseInt( Router.current().params["joke_index"] )
    //Session.set('joke_index',joke_index) 
    /*
    Should I try to st the session variables if they are unset
    */
    return joke_index    
  }
/*
  if (Session.get('joke_index') != undefined){
    return parseInt(Session.get('joke_index'))
  } else {
    var joke_index = parseInt( Router.current().params["joke_index"] )
    Session.set('joke_index',joke_index) 
    return joke_index
  }
  */
  
}

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
This function is called when users click "Start Analyzing" on the home page, or 
anytime after that to resume their mission

We need to see if this user has been here before.
First, we look at their profile and try to set
- mission
- analysis_type
- joke_index

If the data is neither in their profile or their profile or their session, 
I set it in their session.

I don't need it in their profile because that is set when their account is created
*/
startOrResume = function(){
   
    var mission = undefined
    var analysis_type = undefined
    var joke_index = undefined 
    
    //If I can get data from the session, I should
    if( Session.get('analysis_type') != undefined && Session.get('joke_indexes') != undefined){
      //mission = Session.get('mission') 
      analysis_type = Session.get('analysis_type') 
      //Get the joke_index for this analysis type, if there is one.
      joke_index = Session.get('joke_indexes')[analysis_type]
            
    }

    //if mission is still undefined, then we need to set it,
    // either from the profile, or from defaults
    if (analysis_type === undefined){
      //if they are logged in, then I can check their profile
      if (Meteor.user()){
        if (Meteor.user().profile.mission){
          mission = Meteor.user().profile.mission
          analysis_type = Meteor.user().profile.analysis_type
          joke_index = Meteor.user().profile.joke_indexes[analysis_type]
        }
      }
      
      if (analysis_type === undefined){
        mission = default_mission
        analysis_type = default_analysis_type
        joke_index = 0 
      }
      
      Session.set('mission', mission)
      Session.set('analysis_type', analysis_type)
      var joke_indexes = createJokeIndexes()
      Session.set('joke_indexes', joke_indexes)
      
    }

    
    //Get the previous joke_index for this analysis type, if there is one.
    if (Session.get['joke_indexes'] != undefined && 
            Session.get('joke_indexes')[analysis_type] != undefined){
      joke_index = Session.get('joke_indexes')[analysis_type]
    }
    
    console.log('joke_index', joke_index)
    if (analysis_type == 'insult'){
      Router.go('insultAnalysisContainerWithJokeIndex',{joke_index: joke_index})  
    }
    
    if (analysis_type == 'connect_the_dots'){
      //console.log('connect_the_dots, joke_index', joke_index)
      Router.go('connectTheDotsAnalysisContainerWithJokeIndex',{joke_index: joke_index})  
    }
    
}

Template.welcome.events({
  'click #googleLoginButton': function() {
    Meteor.loginWithGoogle();
  },
  'click #resumeButton': function() {
    startOrResume()
  },
  'click #startButton': function(){
    startOrResume()
  }
  
})



Template.header.events({
  'click #analyzeInsult': function(){
    Session.set('analysis_type', 'insult')
    startOrResume()
  },
  
  'click #analyzeConnectTheDots': function(){
    Session.set('analysis_type', 'connect_the_dots')
    startOrResume()
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
// Encouragement - Waypoints
/////////////////////////////
Template.waypoint.numJokes = function(){
  return getJokeIndex() + 1
}

Template.waypoint.events({
  'click #googleLoginButton': function() {
    Meteor.loginWithGoogle();
  },
  
  'click #tenMore': function(){
    var skipReminder = true
    goToNextJoke(skipReminder)
  },
  
  'click #goHome': function(){
    Router.go('/')
  }
});






/////////////////////////////
// Set IP
/////////////////////////////

myIP = function () {
/*
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
    */
}

Meteor.startup(function(){  
  Deps.autorun(function(){
    if( !Session.get('ip')){
      Session.set('ip', myIP())
    }
  });
})


/////////////////////////////
// Radio
/////////////////////////////
/*
var spanClass = 'insult_answer'
var name = 'insult'

var radioButtons = [
  {
    value: 'yes',
    class: spanClass,
    onSelected: function(){
      console.log('YES selected')
      console.log(this)
    },
    text: "Yes",
    name: name
  },
  {
    value: 'no',
    class: spanClass,
    onSelected: function(){
      console.log('NO selected')
    },
    text: "No"  ,
    name: name  
  },
  {
    value: 'unclear',
    class: spanClass,
    onSelected: function(){
      console.log('UNCLEAR selected')
    },
    text: "Unclear",
    name: name    
  }
]

Template.radio.helpers({
  radioButtons : function(){
    return radioButtons
  }
  
})

highlightSelection = function(selectedContext){
  console.log('highlightSelection: '+selectedContext.value)
  console.log(selectedContext)
  $('.'+selectedContext.class).each(function(){
    $(this).removeClass('answer_selected')
  })
  $('#'+selectedContext.class+"_"+selectedContext.value).each(function(){
    $(this).addClass('answer_selected')
  })
}

Template.radio.events({
  'change input': function() {
    highlightSelection(this)  
  }
});
*/

