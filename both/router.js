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


  this.route('instructions', { 
    path: 'instructions',
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
        return {joke_text: joke_text, joke_id: this.params.joke_id} 
      }
    }
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
    template: 'insultInstructions',
    action: function(){
      if(this.ready() && Meteor.user()){
        this.render()
      }
    },
    
  });
  
  this.route('insultPeerReviewContainerWithJokeId',{
    path: '/insultPeerReview/:joke_id', 
    
    waitOn: function(){ 
      var joke_id = this.params.joke_id
      return [Meteor.subscribe('jokesById', joke_id), Meteor.subscribe('analysisByJoke', joke_id),Meteor.subscribe('commentsByJoke', joke_id),] // MUST ALSO SUBSCRIBE TO THE PEER INPUT       
    },
    
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
    
    template: 'insultPeerReviewContainer',
    loadingTemplate: "thanks",
    data: function(){  
      if(this.ready()){
        //console.log(Jokes.findOne()) 
        var joke_text = Jokes.findOne().joke_text //we are only subscribed to the right joke
        //console.log(Meteor.user())
        var joke_index = Meteor.user().profile.currentSequenceIndex
        var numTotal = (Math.floor(joke_index / 10) + 1 ) * 10     
        var analysis = Analysis.find({type: "insultYN"}).fetch()
        var comments = Comments.find({context: "insult"}).fetch()  
        //console.log(analysis.fetch() )
        //console.log(comments.fetch() )
        return {joke_text: joke_text, numCompleted: (joke_index + 1), numTotal: numTotal, analysis:analysis, comments: comments} 
      }
    },
    action: function(){
      if(this.ready() && Meteor.user()){
        this.render()
      }
    },
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
  
  this.route('connectTheDotsPeerReviewContainerWithJokeId',{
    path: '/connectTheDotsPeerReview/:joke_id', 
    
    waitOn: function(){ 
      var joke_id = this.params.joke_id
      return [Meteor.subscribe('jokesById', joke_id), Meteor.subscribe('analysisByJoke', joke_id),Meteor.subscribe('commentsByJoke', joke_id),] // MUST ALSO SUBSCRIBE TO THE PEER INPUT       
    },
    
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
    
    template: 'connectTheDotsPeerReviewContainer',
    loadingTemplate: "thanks",
    data: function(){  
      if(this.ready()){
        //console.log(Jokes.findOne()) 
        var joke_text = Jokes.findOne().joke_text //we are only subscribed to the right joke
        //console.log(Meteor.user())
        var joke_index = Meteor.user().profile.currentSequenceIndex
        var numTotal = (Math.floor(joke_index / 10) + 1 ) * 10     
        var analysis = Analysis.find({type: "connectTheDotsYN"}).fetch()
        var comments = Comments.find({context: "connectTheDots"}).fetch()  
        //console.log(analysis.fetch() )
        //console.log(comments.fetch() )
        return {joke_text: joke_text, numCompleted: (joke_index + 1), numTotal: numTotal, analysis:analysis, comments: comments} 
      }
    },
    action: function(){
      if(this.ready() && Meteor.user()){
        this.render()
      }
    },
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
      loadingTemplate: "thanks",
      template: 'jokeAnalysis',
      data: function(){
        if(this.ready()){
          //var joke_index = parseInt(this.params.joke_index)
          var joke_text = Jokes.findOne().joke_text
          var analysis = Analysis.find()
          var comments = Comments.find()
          var likes = Likes.find()
          //console.log({joke_text: joke_text.fet, analysis: analysis, comments: comments, likes: likes} )
          return {joke_text: joke_text, analysis: analysis, comments: comments, likes: likes} 
        }
      },    
      action: function(){
      if(this.ready() && Meteor.user()){
        this.render()
      }
    },
  }); 

  this.route('summary', {
    path: 'summary',
    waitOn: function(){ 
      //subscribe to all jokes
      return [Meteor.subscribe("jokes"), Meteor.subscribe("jokeCounts")]
    },
    layoutTemplate: 'standardLayout',
    yieldTemplates: {
      'header': {to: 'header'}
    },
    loadingTemplate: "thanks",
    template: 'summary',
    data: function(){
      if(this.ready()){
        var jokes = Jokes.find().fetch()
        //var jokeCounts = JokeCounts.find().fetch()
        _.each(jokes, function(joke){
          var joke_id = joke._id
          joke.short_text = joke.joke_text.substring(0,60).replace(/<[^>]*>/g, ' ')
          var jokeCounts = JokeCounts.findOne({joke_id: joke_id})
          joke.jokeCounts = jokeCounts
        })
        return {jokes: jokes}
      }
    },
    action: function(){
      if(this.ready()){
        this.render()
      }
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