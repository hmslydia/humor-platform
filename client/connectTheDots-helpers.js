submissionValidCTD = function(){
  //is there at least one radio button checked?
  var checkedElement = $('input:radio[name=connectTheDots]:checked');
  console.log('here', checkedElement)
  if (checkedElement.length == 0){
    alert('Please select Yes, No or Unclear (or select "I don\'t get it." / "Skip")')
    return false;
  }
  
  if ($(checkedElement).val() == "yes" && $('#connect-what').val().trim() == ""){
    alert('Please say what information you need to infer.')
    return false;
  }
  console.log('here')
  return true;
}

highlightCurrentAnswerCTD = function(classPrefix, insultYNval){
  $('.'+classPrefix+'_answer').each(function(){
    $(this).removeClass('answer_selected')
  })
  $('#'+classPrefix+'_'+insultYNval).addClass('answer_selected')
}


submitJokeAnalysisCTD = function () {
  var connectTheDotsRadio = $('input:radio[name=connectTheDots]:checked');
  var connectTheDotsYNval = $(connectTheDotsRadio).val();
  var connectWhat = $('#connect-what').val()
  var unclearWhy = $('#unclear-why').val()

  var funnyRadio = $('input:radio[name=funny]:checked');
  var funnyYNval = $(funnyRadio).val();
 
  
  var f = Meteor.call('submitAnalysis', {
      ip: Session.get('ip'),
      joke_index: getJokeIndex(),
      connectTheDotsYN: connectTheDotsYNval,
      funnyYN: funnyYNval,
      
      connectWhat: connectWhat,
      unclearWhy: unclearWhy,
      dontGetIt: false,
      skip: false,
      context: 'connectTheDots'
    }, function(result){
      updateNextJokeCTD()
      goToNextJokeCTD()
    } 
  )   
}
  
submitDontGetItCTD = function (){   
  Meteor.call('submitAnalysis', {
      ip: Session.get('ip'),
      joke_index: getJokeIndex(),
      dontGetIt: true,
      skip: false,
      context: 'connectTheDots'
    }, function(result){
      updateNextJokeCTD()
      goToNextJokeCTD()
    }    
  )  
} 

submitSkipCTD = function (){   
  Meteor.call('submitAnalysis', {
      ip: Session.get('ip'),
      joke_index: getJokeIndex(),
      dontGetIt: false,
      skip: true,
      context: 'connectTheDots'
    }, function(result){
      updateNextJokeCTD()
      goToNextJokeCTD()
    }    
  )  
}
  
updateNextJokeCTD = function(){
  var joke_index = getJokeIndex()
  var next_joke_index = parseInt(joke_index) + 1 
  var analysis_type = Session.get('analysis_type')
  var joke_indexes = Session.get('joke_indexes')
  joke_indexes[analysis_type] = next_joke_index
  Session.set('joke_indexes', joke_indexes)
}  
  
goToNextJokeCTD = function (skipReminder) {  
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

  Router.go('connectTheDotsAnalysisContainerWithJokeIndex',{joke_index: joke_index})
  
}

clearDataCTD = function (){  
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
