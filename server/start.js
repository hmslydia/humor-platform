max_num_jokes = 100
//NEW USERS

function getGroup(){
  //A, B , or C. 
  //Find out how many users there are and assign this next user to 
  
  var numUsers = Meteor.users._collection.find().count()
  var mod3 = numUsers % 2 
  if(mod3 == 0){
    return "A"
  }
  if (mod3 == 1){
    return "B"
  }
}

Accounts.onCreateUser(function(options, user) {
  // We're enforcing at least an empty profile object to avoid needing to check
  // for its existence later.
  user.profile = options.profile ? options.profile : {};

  user.profile.currentSequenceId = JokeSequences.findOne()._id
  user.profile.currentSequenceIndex = 0
  user.profile.currentSequenceLastIndex = 99
  
  user.profile.sequence_name = getGroup() // "A" || "B" || "C"
  
  user.profile.currentJokeId = JokesInSequence.findOne({
    name: user.profile.sequence_name,
    sequence_id: user.profile.currentSequenceId, 
    sequence_index: user.profile.currentSequenceIndex
  }).joke_id
  
  
  user.profile.pageType = "home" 
  
  
  return user;
});



joke_counts_columns = [
  'joke_id',
  'submits',
  
  'funnyYes',
  'funnyNo',
  'funnyKinda',
  
  'vulgar',
  
  'insult',
  'wordPlay',
  'expectationViolation',
  'connectTheDots',
  'lens',
  'observation'
]


createBlankJokeCounts = function () {
  var obj = {}
  _.each(joke_counts_columns, function(column){
    obj[column] = 0
  })
  return obj
}

populateJokes = function (){
  //For each joke, insert a Joke and a corresponding JokeCount object.
  if (Jokes.find().count() === 0) {
    for (var i = 0; i < max_num_jokes; i++) {
			
			//insert into Jokes
			var thisItem = jokes2[i]
			thisItem.joke_text = thisItem.text
			var jokeObj = {joke_text: thisItem.text}
      var task_id = Jokes.insert(jokeObj);
      
      //establish JokeCounts
      var joke_counts = createBlankJokeCounts()
      joke_counts['joke_id'] = task_id
      JokeCounts.insert(joke_counts);
    }
  }  
}



populateJokeSequences = function (){
  if (JokeSequences.find().count() === 0) { 
    joke_id_order = _.pluck(Jokes.find().fetch(), "_id")
    
    var joke_sequence1 = joke_id_order
    var joke_sequence2 = _.shuffle(joke_id_order)
    
    insertJokeSequence("A", joke_sequence1)
    insertJokeSequence("B", joke_sequence2)    
  } 
}

insertJokeSequence = function(name, joke_sequence){
   var sequence_id = JokeSequences.insert({name: name})

  _.each(joke_sequence, function(joke_id, index){
    JokesInSequence.insert({
      sequence_id: sequence_id, 
      name: name,
      joke_id: joke_id, 
      sequence_index: index,
    })
  })  
}


Meteor.startup(function () {	
  //For each joke, insert a Joke and a corresponding JokeCount object.
  populateJokes()
  populateJokeSequences()
})