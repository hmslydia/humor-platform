Template.funnyAnalysis.events({
  'change input:radio[name=funny]': function(){   
    var element = $('input:radio[name=funny]:checked');
    var funnyYNval = $(element).val();
    
    if(funnyYNval == "no"){
      //ADVANCE TO NEXT PAGE
      var params = {}    
      params.joke_id = this.joke_id
      params.context = "theories"
      params.offensive = false
      params.funnyYN = "no"
      clear()
      Meteor.call('submitTypeAnalysis', params, function(){
        goToNextPage()
      })          
    } else {
      //Show the rest of the UI
      $('.theoryToggle').show()
    }    
  }
})

