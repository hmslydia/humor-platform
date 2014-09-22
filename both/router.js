Router.map(function(){
  this.route('welcome', { 
    path: '/',
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
     
  })

  this.route('loginReminder', { 
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
    path: 'loginReminder' ,
  }),
  
  this.route('mini-menu', { 
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
   this.route('insultAnalysisContainerWithJokeIndex',{
      
      path: '/insultAnalysis/:joke_index',
      
      waitOn: function(){ 
        
        var joke_index = parseInt(this.params.joke_index)
        return Meteor.subscribe('jokesByIndex', joke_index) 
      },
      
      layoutTemplate: 'standardLayout',
      yieldTemplates: {
        'header': {to: 'header'}
      },
      
      template: 'insultAnalysisContainer',
      
      data: function(){        
          var joke_index = parseInt(this.params.joke_index)
          var joke_text = Jokes.findOne().joke_text
          var numTotal = (Math.floor(joke_index / 10) + 1 ) * 10
          return {joke_text: joke_text, numCompleted: (joke_index + 1), numTotal: numTotal} 
      },
      onAfterAction: function(){
        Session.set('analysis_type', 'insult')
        var joke_indexes = Session.get('joke_indexes')
        joke_indexes['insult'] = parseInt(this.params.joke_index)
        Session.set('joke_indexes', joke_indexes)
        Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.joke_indexes.insult":this.params.joke_index}})
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
  
   this.route('connectTheDotsAnalysisContainerWithJokeIndex',{
      path: '/connectTheDotsAnalysis/:joke_index',
      waitOn: function(){ 
        var joke_index = parseInt(this.params.joke_index)
        return Meteor.subscribe('jokesByIndex', joke_index) 
      },
      layoutTemplate: 'standardLayout',
      yieldTemplates: {
        'header': {to: 'header'}
      },   
      template: 'connectTheDotsAnalysisContainer',
      data: function(){         
          var joke_text = Jokes.findOne().joke_text //we are only subscribed to the right joke
          
          var joke_index = parseInt(this.params.joke_index)
          var numTotal = (Math.floor(joke_index / 10) + 1 ) * 10
          
          return {joke_text: joke_text, numCompleted: (joke_index + 1), numTotal: numTotal} 
      },
      onAfterAction: function(){
        
        var analysis_type = "connect_the_dots"
        var joke_indexes = Session.get('joke_indexes')
        joke_indexes[analysis_type] = this.params.joke_index
        Session.set('joke_indexes', joke_indexes)
        Session.set('current_analysis_type', analysis_type)
        
        var profileSetting = "profile.joke_indexes."+analysis_type
        Meteor.users.update({_id:Meteor.userId()}, 
          {$set:{profileSetting: this.params.joke_index, 'profile.current_analysis_type': analysis_type}})
        
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