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




// how is the current state going to be stored?
// how is the history going to be stored?
// what aggregate information do we need to store?

// are there going to be units? or... how is the counter going to be used?
// for the main verticals (joke type), I know I want the user to experience 20 joke chunks,
// which can be interrupted, and returned to.
// and probably somewhere is a menu
// in the future I may want curated lists.
// for now just a placeholder is good enough.
// so how would I implement 20 jokes, then one thanks page, with options?
// if my current thing were the joke_analysis, how would I know which track to return to?
// - history?
// what does that history look like?


// history:
// verticle: analysis
// 

//how do we store what's current?
//maybe just a bit for which vertical we are in,
// then the profile knows for each vertical, what the current undone 

// current vertical: 'insult'
// verticalStates: {"insult": {currentIndex: 1}, "connectTheDots": {currentIndex: 2}, ...}

// vertical history: ['insult']
// current route: {routeName: "insult", params: {params_go_here}}

//Ah, so here is the problem with having a vertical with only one state: it assumes everyone will want to go through all the jokes in the same order.  I won't have any ability to re-order their jokes in order to optimize.
//Do I want to take care of this now? It does seem important.

//If I wanted to fix this, how would I do it?
//I would have a database of joke_sequences, each one would have an id.  
// (this is starting to feel a lot like the SAT thing)
// 

/*
JOKESEQUENCES
id:
joke_ids: [a,b,c,d] //this way they are reusable. and multiple users can make units from the same sequences.
index:

UNIT
*id: 
*type: sequence (there could be other types, this determines which logic we will use to get from joke to joke and to end the sequence

//DATA FOR THIS UNIT TYPE IN PARTICULAR.
*joke_sequence_id: [] //because this a a type sequence, we need it's sequence
* joke_seuqence_index: 10, for now, this is just useful for getting the next joke sequence.
*current_index: //this depends on the user.  I think that is fine.  Certainly, their state needs to be stored permanently somewhere.
*analysis_type: "insult" // this also helps the router know where to go.
*totalNumJokes: 20 // this tells us how much progress there is.
status: notStarted/completed/inProgress

//do I need any state-y stuff here?
*preconditions? - ?
*postconditions? - move to history? (probably compulsory)

//control flow is determined based on the type of the unit.

The major data I need to keep is:
currentUnitId - this will have all the information I need to get 
I need to initiate one when they log in.
//how will I ensure that there always is one..
//well, if there isn't I need a "pick a track" page that lets them initiate their own.
*/



//When a user is initialized, they need a sequence in order to start.
//the also need a sequence in order to know where to go next.
//What should I initialize them with?????
// - at least one insult sequence
// - at least one connect the dots sequence

//SO HOW SHOULD I START DOING THIS?
// I need to initialize some units for my users
// I need to populate some current Unit Ids
// I need to make sure that given startOrResume()
//    has enough information to get the user to their correct route with the correct parameters
// I need to make sure that the user can submit their answers correctly and that any other data is kept.
// I need to make sure that the control flow (in startOrResume) works, not just for getting from joke to joke, but
//I also need to make sure that I can be in the insult track, go to a in-depth joke-analysis, then easily resume back to their track and mark some more insult jokes.






//then, we need to know the users current units.
//there should also be a history or completed units.
//I guess we need a Collection of Units,

//After a unit is over, what do we do?
//well, we could create another unit for them that they haven't completed (we would have to look at their history to figure out what joke sequences they have done.

//should we have a default order for the joke sequences? so that I know where to go next?
//See, real games must have a strategy for this.
//I don't have a high level picture.
// maybe I need one in order to really get somewhere.
//cover as many unique jokes as possible.
//make sure people collectively cover as many of the same jokes as possible. 

//OK, for now, I will have a default joke_id sequence



/*
This handles all the control flow for the system
*/

startOrResume = function(){
   if(Meteor.user()){
     //we are logged in.
     //through some combination of the current state and my history
     //we need to figure out what route (and what information) we need to go to.
     var currentUnitId = Meteor.user().profile.currentUnitId
     if(currentUnitId){
       var unit = Units.findOne(currentUnitId)
       console.log(unit)
       var analysisType = unit.analysis_type
       //var joke_index = currentUnit.joke_sequence_index
       var joke_id = unit.current_joke_id
       var type = unit.type
       var status = unit.status
       
       if (type == "sequence"){
         if(status == "completed"){
           Router.go("/") // TODO: HOW TO HANDLE THIS CONDITION
         }
         
         if(status == "inProgress" || status == "notStarted"){
           if(analysisType=="insult"){
             var params = {joke_id: joke_id}
             console.log(params)
             Router.go("insultAnalysisContainerWithJokeId", params)
           }
         }
       } 
       //processing of other types go here
       
       
     }else{
       //either choose the next unit id or ask the user to
       Router.go("/")
     }
     
     
     //first, we can check if there is a current route.
     //if so, then we can just go there.
     
     //if there isn't, then we need to decide where to go. 
     // either we create some options and let the user pick
     // or we decide where to send them and just take them there. 
     
   } else {
    //there is no user logged in: for now, we just go to the home page.
    //TODO: WRITE BEHAVIOR FOR USERS WHO ARE NOT LOGGED IN.
     Router.go("/")
   }
   
   /*
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
    */
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

