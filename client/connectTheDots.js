Template.connectTheDotsAnalysis.events({
  'change input:radio[name=connectTheDots]': function(){    
    var element = $('input:radio[name=connectTheDots]:checked');
    var insultYNval = $(element).val();
    
    highlightCurrentAnswerCTD("connectTheDots", insultYNval)
    
    if (insultYNval == 'yes'){      
      $('#connectTheDotsFreeText').show()
      $('#connect-what').focus()
    }else{
      $('#connectTheDotsFreeText').hide()
    }
    
    if (insultYNval == 'unclear'){      
      $('#connectTheDotsUnclearFreeText').show()
      $('#unclear-why').focus()
    }else{
      $('#connectTheDotsUnclearFreeText').hide()
    }
  },
     
})


Template.connectTheDotsAnalysisContainer.events({
  'click #next': function(){
    console.log('foo')
    if( submissionValidCTD() ){
      submitJokeAnalysisCTD()
      clearDataCTD()
    }
  },  
  'click #dontGetIt': function() {
    submitDontGetItCTD()
    clearDataCTD()
  },  
  'click #skip': function() {
    submitSkipCTD()
    clearDataCTD()
  }
})


Template.connectTheDotsInstructions.events({
  'click #analyze': function(){
    startOrResume()
  }
  
})

Template.insultCard.events({
  'click #analyze': function(){
    startOrResume()
  }
  
})