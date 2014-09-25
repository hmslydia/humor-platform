Router.map(function(){
  this.route('welcome', { 
    path: '/',
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
    waitOn: function(){         
      return [Meteor.subscribe('joke_sequences'), Meteor.subscribe('jokes_in_sequence')]
    },
    data: function(){
      return JokeSequences.find()
    },
    action: function(){
      if(this.ready()){
        this.render()
      }
    }
  })

  this.route('loginReminder', { 
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
    path: 'loginReminder' ,
  }),
  
  this.route('waypoint', { 
    path: 'waypoint' ,
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
    template: 'waypoint',
  })
  
  /////////////////////////////////
  //INSULTS
  /////////////////////////////////
  this.route('insultAnalysisContainerWithJokeId',{
    path: '/insultAnalysis/:joke_id', 
    
    waitOn: function(){ 
      var joke_id = this.params.joke_id
      return Meteor.subscribe('jokesById', joke_id)        
    },
    
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
    
    template: 'insultAnalysisContainer',
    loadingTemplate: "thanks",
    data: function(){  
      if(this.ready()){
        //console.log(Jokes.findOne()) 
        var joke_text = Jokes.findOne().joke_text //we are only subscribed to the right joke
        //console.log(Meteor.user())
        var joke_index = Meteor.user().profile.currentSequenceIndex
        var numTotal = (Math.floor(joke_index / 10) + 1 ) * 10        
        return {joke_text: joke_text, numCompleted: (joke_index + 1), numTotal: numTotal} 
      }
    }
  }); 

  this.route('insultInstructions', {
    path: 'insultInstructions',
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
    template: 'insultInstructions'
  });
  
  
  /////////////////////////////////
  //CONNECT THE DOTS
  ///////////////////////////////// 
    
  this.route('connectTheDotsAnalysisContainerWithJokeId',{
    path: '/connectTheDotsAnalysis/:joke_id', 
    
    waitOn: function(){ 
      var joke_id = this.params.joke_id
      return Meteor.subscribe('jokesById', joke_id)        
    },
    
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
    
    template: 'connectTheDotsAnalysisContainer',
    loadingTemplate: "thanks",
    data: function(){  
      if(this.ready()){
        console.log(Jokes.findOne()) 
        var joke_text = Jokes.findOne().joke_text //we are only subscribed to the right joke
        //console.log(Meteor.user())
        var joke_index = Meteor.user().profile.currentSequenceIndex
        var numTotal = (Math.floor(joke_index / 10) + 1 ) * 10        
        return {joke_text: joke_text, numCompleted: (joke_index + 1), numTotal: numTotal} 
      }
    }
  });   
    
  this.route('connectTheDotsInstructions', {
    path: 'connectTheDotsInstructions',
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
    template: 'connectTheDotsInstructions'
  });
  
  
  
  
  
  
  this.route('thanks', {
    path: 'thanks',
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
    template: 'thanks'
  });

  this.route('about', {
    path: 'about',
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
    template: 'about'
  });

  this.route('joke',{
      path: '/joke/:joke_id',
      waitOn: function(){ 
        var joke_id = this.params.joke_id
        return [
          Meteor.subscribe('jokesById', joke_id), 
          Meteor.subscribe('analysisByJoke', joke_id), 
          Meteor.subscribe('jokeCountsByJoke', joke_id),
          Meteor.subscribe('commentsByJoke', joke_id),
          Meteor.subscribe('likesByJoke', joke_id)
          ] 
      },
      
      layoutTemplate: 'standardLayout',
      yieldTemplates: {
        'header': {to: 'header'}
      },
      template: 'jokeAnalysis',
      data: function(){
          //var joke_index = parseInt(this.params.joke_index)
          var joke_text = Jokes.findOne().joke_text
          var analysis = Analysis.find()
          var comments = Comments.find()
          var likes = Likes.find()
          return {joke_text: joke_text, analysis: analysis, comments: comments, likes: likes} 
      }
  }); 


});

Router.configure({
  load: function() {
    $('html, body').animate({
      scrollTop: 0
    }, 400);
    $('.joke_text').hide().fadeIn(800);
  }
});