submissionValid = function(){
  //is there at least one radio button checked?
  var checkedElement = $('input:radio[name=insult]:checked');
  if (checkedElement.length == 0){
    alert('Please select Yes, No or Unclear (or select "I don\'t get it." / "Skip")')
    return false;
  }
  if ($(checkedElement).val() == "yes" && $('#insulting-who').val().trim() == ""){
    alert('Please say who or what is being insulted.')
    return false;
  }
  return true;
}

highlightCurrentAnswer = function(classPrefix, insultYNval){
  $('.'+classPrefix+'_answer').each(function(){
    $(this).removeClass('answer_selected')
  })
  $('#'+classPrefix+'_'+insultYNval).addClass('answer_selected')
}


submitJokeAnalysis = function () {
  var insultRadio = $('input:radio[name=insult]:checked');
  var insultYNval = $(insultRadio).val();
  var insultWho = $('#insulting-who').val()
  var insultWhy = $('#insulting-why').val()
  var unclearWhy = $('#unclear-why').val()

  var funnyRadio = $('input:radio[name=funny]:checked');
  var funnyYNval = $(funnyRadio).val();
 
 
  
  var f = Meteor.call('submitAnalysis', {
      ip: Session.get('ip'),
      //joke_index: getJokeIndex(),
      joke_id: Router.current().params.joke_id,
      insultYN: insultYNval,
      funnyYN: funnyYNval,
      insultWho: insultWho,
      insultWhy: insultWhy,
      unclearWhy: unclearWhy,
      dontGetIt: false,
      skip: false,
      context: 'insult'
    }, function(result){
      //updateNextJoke()
      goToNextJoke()
    } 
  )   
}
  
submitDontGetIt = function (){   
  Meteor.call('submitAnalysis', {
      ip: Session.get('ip'),
      //joke_index: getJokeIndex(),
      joke_id: Router.current().params.joke_id,
      dontGetIt: true,
      skip: false,
      context: 'insult'
    }, function(result){
      //updateNextJoke()
      goToNextJoke()
    }    
  )  
} 

submitSkip = function (){   
  Meteor.call('submitAnalysis', {
      ip: Session.get('ip'),
      //joke_index: getJokeIndex(),
      joke_id: Router.current().params.joke_id,
      dontGetIt: false,
      skip: true,
      context: 'insult'
    }, function(result){
      //updateNextJoke()
      goToNextJoke()
    }    
  )  
}

/*
// Maybe this needs to be called when submit joke is called.  That's starting to sound very reasonable.

// a) so it doesn't get called multiple times if a joke submitted accidentally multiple times.
// b) because they both happen on the server and i don't know why they'd ever have to happen separately


updateNextJoke = function(){
  if(Meteor.user()){
    // increment the order
    var currentSequenceIndex = parseInt(Meteor.user().profile.currentSequenceIndex)
    var nextIndex = currentSequenceIndex + 1
    // find out if the order is is the last order.
    var lastSequenceIndex = parseInt(Meteor.user().profile.currentSequenceLastIndex)
    
    //if we are done with this sequence, mark that state
    if(nextIndex > lastSequenceIndex){
      Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.currentAnalysisStatus": "completed" }}) 
      //WHAT ELSE? DO I NEED TO PICK A NEW THING FOR THEM?      
    }else {
    
      //UPDATE THE STATE
      //updateNextIndex and JokeId
      var sequenceId = Meteor.user().profile.currentSequenceId 
      var nextJokeId = JokesInSequence.findOne({
        sequence_id: sequenceId,
        order: nextIndex
      }).joke_id
      
      Meteor.users.update({_id:Meteor.userId()}, {$set:{
        "profile.currentSequenceIndex": nextIndex,
        "profile.currentJokeId": nextJokeId
      }}) 
    } 
  } else {
    console.log("no user")
  }
}
*/  
  

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
  
  $('.answer_selected').each(function(){
      $(this).removeClass('answer_selected'); 
  });
}
