/////////////////////////////
// Insult Analysis
/////////////////////////////
Template.insultAnalysis.events({
  'change input:radio[name=insult]': function(){    
    var element = $('input:radio[name=insult]:checked');
    var insultYNval = $(element).val();
    
    highlightCurrentAnswer("insult", insultYNval)
    
    if (insultYNval == 'yes'){      
      $('#insultFreeText').show()
      $('#insulting-who').focus()
    }else{
      $('#insultFreeText').hide()
    }
    
    if (insultYNval == 'unclear'){      
      $('#insultUnclearFreeText').show()
      $('#unclear-why').focus()
    }else{
      $('#insultUnclearFreeText').hide()
    }
  },
  
  'change input:radio[name=funny]': function(){   
    var element = $('input:radio[name=funny]:checked');
    var funnyYNval = $(element).val();
    
    highlightCurrentAnswer("funny", funnyYNval)
  },    
})
/*
Template.insultAnalysisContainer.helpers({
  joke_text: function(){
    return Jokes.findOne().joke_text
  },
  numCompleted: function(){
    var joke_index = Meteor.user().profile.currentSequenceIndex
    return (joke_index + 1)
  }, 
  numTotal: function(){
    var joke_index = Meteor.user().profile.currentSequenceIndex
    var numTotal = (Math.floor(joke_index / 10) + 1 ) * 10
    return numTotal
  }
})
*/
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
  },  
  'click #skip': function() {    
    submitSkip()
    clearData()
  }
})
///



Template.insultInstructions.events({
  'click #analyze': function(){
    startOrResume()
  }  
})

Template.insultCard.events({
  'click #analyze': function(){
    startOrResume()
  }  
})