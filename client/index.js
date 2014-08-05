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



//analysisHandle = Meteor.subscribe('analysis');


/////////////////////////////
// Helpers
/////////////////////////////

getJokeIndex = function(){
  if (Session.get('joke_index') != undefined){
    return parseInt(Session.get('joke_index'))
  } else {
    var joke_index = parseInt( Router.current().params["joke_index"] )
    Session.set('joke_index',joke_index) 
    return joke_index
  }
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

startOrResume = function(){
    var joke_index = 0
    
    if (Session.keys["joke_index"] != undefined){
      joke_index = Session.get('joke_index')
    }
    
    if (Meteor.user()){
      joke_index = Meteor.user().profile.joke_index 
    }

    Router.go('insultAnalysisContainerWithJokeIndex',{joke_index: joke_index})  
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
  'click #analyze': function(){
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

