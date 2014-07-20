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


Jokes = new Meteor.Collection("jokes");

Analysis = new Meteor.Collection("analysis");
analysisHandle = Meteor.subscribe('analysis');


/////////////////////////////
// Helpers
/////////////////////////////

getJokeIndex = function(){
  if (Session.get('joke_index') != undefined){
    return parseInt(Session.get('joke_index'))
  }
  var currentPath = Router.current().path
  if (currentPath.substring(0,15) == "/insultAnalysis"){
    var joke_index = parseInt(currentPath.substring(16))
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


Template.welcome.events({
  'click #googleLoginButton': function() {
    Meteor.loginWithGoogle();
  },
  'click #resumeButton': function() {
    var joke_index = Meteor.user().profile.joke_index || 0
    Router.go('insultAnalysisContainerWithJokeIndex',{joke_index: joke_index})
  },
  'click #startButton': function(){
    Router.go('insultAnalysisContainerWithJokeIndex',{joke_index: 0})
  }
  
})

/////////////////////////////
// Insult Analysis
/////////////////////////////

submissionValid = function(){
  //is there at least one radio button checked?
  var checkedElement = $('input:radio[name=insult]:checked');
  if (checkedElement.length == 0){
    alert('Please select Yes, No or Unclear (or select "I don\'t know.")')
    return false;
  }
  if ($(checkedElement).val() == "yes" && $('#insultFreeText textarea').val().trim() == ""){
    console.log($('#insultFreeText textarea').val().trim())
    alert('Please select say who or what is being insulted.')
    return false;
  }
  return true;
}

highlightCurrentAnswer = function(insultYNval){
  $('.insult_answer').each(function(){
    $(this).removeClass('answer_selected')
  })
  $('#insult_'+insultYNval).addClass('answer_selected')
}

Template.insultAnalysis.events({
  'change input:radio[name=insult]': function(){    
    var element = $('input:radio[name=insult]:checked');
    var insultYNval = $(element).val();
    
    highlightCurrentAnswer(insultYNval)
    
    if (insultYNval == 'yes'){      
      $('#insultFreeText').show()
    }else{
      $('#insultFreeText').hide()
    }
  }  
})

submitJokeAnalysis = function () {
  var insultRadio = $('input:radio[name=insult]:checked');
  var insultYNval = $(insultRadio).val();
  var insultFreeText = $('#insultFreeText textarea').val()
  Meteor.call('submitAnalysis', {
      ip: Session.get('ip'),
      joke_index: getJokeIndex(),
      insultYN: insultYNval,
      insultFreeText: insultFreeText,
      dontGetIt: false,
    }, function(result){
      goToNextJoke()
    }
    
  )
  /*
  Analysis.insert({
    joke_id: getJokeId(),
    user_id: getUserId(),
    user_account: (Meteor.user() == true),
    insultYN: insultYNval,
    insultFreeText: insultFreeText
  })
  */    
}
  
submitDontGetIt = function (){   
  Meteor.call('submitAnalysis', {
      ip: Session.get('ip'),
      joke_index: getJokeIndex(),
      dontGetIt: true,
    }, function(result){
      goToNextJoke()
    }    
  )  
} 
  
goToNextJoke = function (skipReminder) {
  //console.log('go to next joke')
  
  var last_joke_index = 25
  var joke_index = getJokeIndex()
  var next_joke_index = parseInt(joke_index) + 1
  console.log("joke_index: "+joke_index)
  if (next_joke_index == last_joke_index){
    Router.go('thanks')
    return
  }
  
  if (!skipReminder && !Meteor.userId() && (next_joke_index % 3 == 0)){
    Router.go('loginReminder')
    return 
  }

  Router.go('insultAnalysisContainerWithJokeIndex',{joke_index: next_joke_index})
  
}

clearData = function (){
  
  $('.freeTextDiv').each(function(){
    $(this).hide()
  }) 
   
  $('.freeText').each(function(){
    $(this).val("")
  })

  $('input:radio').each(function(){
      $(this).prop('checked', false); 
  });
  
  highlightCurrentAnswer()
}

Template.insultAnalysisContainer.events({
  'click #next': function(){
    if( submissionValid() ){
      submitJokeAnalysis()
      clearData()
    }
  },
  
  'click #dontGetIt': function() {
    submitDontGetIt()
    clearData()
  }
})

/////////////////////////////
// Login Reminder
/////////////////////////////
Template.loginReminder.events({
  'click #googleLoginButton': function() {
    Meteor.loginWithGoogle();
  },
  
  'click .skipLogin': function(){
    var skipReminder = true
    goToNextJoke(skipReminder)
  },
  
  'click #resumeTasks': function(){
    goToNextJoke()
  }
});

/////////////////////////////
// Radio
/////////////////////////////
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



/////////////////////////////
// Routes
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


Router.map(function(){
  this.route('welcome', { 
    path: '/' 
  })

  this.route('loginReminder', { 
    path: 'loginReminder' ,
  })
  
   this.route('insultAnalysisContainerWithJokeIndex',{
      path: '/insultAnalysis/:joke_index',
      waitOn: function(){ 
        var joke_index = parseInt(this.params.joke_index)
        return Meteor.subscribe('jokesByIndex', joke_index) 
      },
      template: 'insultAnalysisContainer',
      data: function(){
          
          var joke_index = parseInt(this.params.joke_index)
          console.log("joke_index (data): "+joke_index)
          var joke_text = Jokes.findOne().joke_text
          return {joke_text: joke_text} 
      },
      onAfterAction: function(){
        Session.set('joke_index', this.params.joke_index)
        console.log("joke_index (after action): "+this.params.joke_index)
      }
  }); 
  
  this.route('radio')
  
  this.route('thanks')

});

Router.configure({
  load: function() {
    $('html, body').animate({
      scrollTop: 0
    }, 400);
    $('.joke_text').hide().fadeIn(800);
  }
});
