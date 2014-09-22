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
      joke_index: getJokeIndex(),
      insultYN: insultYNval,
      funnyYN: funnyYNval,
      insultWho: insultWho,
      insultWhy: insultWhy,
      unclearWhy: unclearWhy,
      dontGetIt: false,
      skip: false,
      context: 'insult'
    }, function(result){
      updateNextJoke()
      goToNextJoke()
    } 
  )   
}
  
submitDontGetIt = function (){   
  Meteor.call('submitAnalysis', {
      ip: Session.get('ip'),
      joke_index: getJokeIndex(),
      dontGetIt: true,
      skip: false,
      context: 'insult'
    }, function(result){
      updateNextJoke()
      goToNextJoke()
    }    
  )  
} 

submitSkip = function (){   
  Meteor.call('submitAnalysis', {
      ip: Session.get('ip'),
      joke_index: getJokeIndex(),
      dontGetIt: false,
      skip: true,
      context: 'insult'
    }, function(result){
      updateNextJoke()
      goToNextJoke()
    }    
  )  
}
  
updateNextJoke = function(){
  var joke_index = getJokeIndex()
  var next_joke_index = parseInt(joke_index) + 1 
  var analysis_type = Session.get('analysis_type')
  var joke_indexes = Session.get('joke_indexes')
  joke_indexes[analysis_type] = next_joke_index
  Session.set('joke_indexes', joke_indexes)
}  
  
goToNextJoke = function (skipReminder) {  
  var last_joke_index = 25
  var joke_index = getJokeIndex()

  if (!skipReminder && !Meteor.userId() && (joke_index % 6 == 0)){
    Router.go('loginReminder')
    return 
  }
  
  if (!skipReminder && (joke_index % 10 == 0)){
    Router.go('mini-menu')
    return 
  }

  Router.go('insultAnalysisContainerWithJokeIndex',{joke_index: joke_index})
  
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
  
  $('.answer_selected').each(function(){
      $(this).removeClass('answer_selected'); 
  });
}
