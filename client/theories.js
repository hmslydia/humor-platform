Template.theories.events({
  'click #next': function(){
    var formData = $('form').serializeArray()  
    
    
    var params = {}  
    params.joke_id = this.joke_id
    params.context = "theories"
    params.skip = false
    params.dontGetIt = false
    
    _.each(formData, function(elt){
      var name = elt["name"]
      var value = elt["value"]
      params[name] = value
    })
    console.log(params)
    
    Meteor.call('submitTheoryAnalysis', params, function(){
      //goToNextJoke()
    })
    
    
  },
  
  'click #skip': function(){
    //var formData = $('form').serializeArray()    
    formData.joke_id = this.joke_id
    formData.context = "theories"
    formData.skip = true
    formData.dontGetIt = false

    Meteor.call('submitTheoryAnalysis', formData, function(){
      goToNextJoke()
    })
  },
  
  'click #dontGetIt': function(){
    //var formData = $('form').serializeArray()    
    formData.joke_id = this.joke_id
    formData.context = "theories"
    formData.skip = false
    formData.dontGetIt = true

    Meteor.call('submitTheoryAnalysis', formData, function(){
      goToNextJoke()
    })
  }  
})