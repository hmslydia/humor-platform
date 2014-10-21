Template.theories.rendered = function(){
  console.log(this)
}

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
    clear()
    
    Meteor.call('submitTheoryAnalysis', params, function(){
      goToNextJoke()
    })
    
    
  },
  
  'click #skip': function(){
    var params = {}    
    params.joke_id = this.joke_id
    params.context = "theories"
    params.skip = true
    params.dontGetIt = false
    clear()
    Meteor.call('submitTheoryAnalysis', params, function(){
      goToNextJoke()
    })
  },
  
  'click #dontGetIt': function(){
    var params = {}     
    params.joke_id = this.joke_id
    params.context = "theories"
    params.skip = false
    params.dontGetIt = true
    clear()
    Meteor.call('submitTheoryAnalysis', params, function(){
      goToNextJoke()
    })
  }  
})

function clear(){
  $("label.active").each(function(label){$(this).removeClass("active")})
}