Router.map(function(){
  
  this.route('waypoint', { 
    path: 'waypoint' ,
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
    template: 'waypoint',
  })


  this.route('instructions', { 
    path: '/',
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
  })  

  this.route('example', { 
    path: '/example/:index',
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
    template: 'example',
    data: function(){      
      var index = parseInt(this.params.index)
      var hasAnother = false
      if(index == 0){
        hasAnother = true
      }
      console.log({example: examples[index], hasAnotherExample: hasAnother})
      return {example: examples[index], hasAnotherExample: hasAnother}
    }
  }) 
  
  this.route('badge1', { 
    path: 'badge1',
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
  }), 
  this.route('badge2', { 
    path: 'badge2',
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
  }),
  this.route('badge3', { 
    path: 'badge3',
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
  })  
  
  this.route('theories', { 
    path: 'theories/:joke_id',
    layoutTemplate: 'standardLayout',
    template: 'theories',
    waitOn: function(){ 
      var joke_id = this.params.joke_id
      return Meteor.subscribe('jokesById', joke_id)        
    },
    yieldTemplates: {
      'header': {to: 'header'}
    },
    loadingTemplate: "thanks",
    data: function(){  
      if(this.ready()){   
        var joke_text = Jokes.findOne().joke_text 
        var numCompleted = Meteor.user().profile.currentSequenceIndex + 1
        var numTotal = (Math.floor(Meteor.user().profile.currentSequenceIndex/5)  + 1)*5 
        return {
          joke_text: joke_text, 
          joke_id: this.params.joke_id,
          numCompleted: numCompleted,
          numTotal: numTotal
          } 
      }
    },
    onAfterAction: function(){
      clear()
    }
  }) 

});

Router.configure({
  load: function() {
    $('html, body').animate({
      scrollTop: 0
    }, 400);
    $('.joke_text').hide().fadeIn(800);
  }
});