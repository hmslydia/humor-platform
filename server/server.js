Jokes = new Meteor.Collection("jokes");

Meteor.publish('jokesByIndex', function(joke_index){
  var joke_id = joke_id_order[joke_index]
  return Jokes.find(joke_id)
})


Analysis = new Meteor.Collection("analysis");
Meteor.publish('analysis', function () {
	return Analysis.find({});
});

var max_num_jokes = 100
var joke_id_order = []

Meteor.startup(function () {	
  if (Jokes.find().count() === 0) {
    for (var i = 0; i < max_num_jokes; i++) {
			var thisItem = jokes[i]
      var task_id = Jokes.insert(thisItem);

    }
  }
  if (joke_id_order.length == 0){
    joke_id_order = _.pluck(Jokes.find().fetch(), "_id")  }
})

Meteor.methods({
  get_joke_sequence : function(){
    return joke_id_order
  },
  
  get_joke_from_index : function(joke_index){
    var joke_id = joke_id_order[joke_index]
    return Jokes.findOne(joke_id).joke_text
  },
   
  submitAnalysis : function(params){
    var analysisParams = params
    analysisParams.user_id = Meteor.userId() || null
    
    var joke_index = parseInt(params.joke_index)
    var joke_id = joke_id_order[joke_index]
    console.log(joke_id)
    analysisParams.joke_id = joke_id
    
    Analysis.insert(analysisParams)
    if (Meteor.user()){
      Meteor.user().profile.joke_index = (joke_index + 1)
    }
    //if they are logged in, I can update their joke_index
  } 
  
})


Accounts.onCreateUser(function(options, user) {
  // We're enforcing at least an empty profile object to avoid needing to check
  // for its existence later.
  user.profile = options.profile ? options.profile : {};
  user.profile.joke_sequence = joke_id_order
  user.profile.joke_index = 0
  return user;
});

