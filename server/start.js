//NEW USERS

function getGroup(){
  //A, B , or C. 
  //Find out how many users there are and assign this next user to 
  
  var numUsers = Meteor.users._collection.find().count()
  var mod3 = numUsers % 3
  if(mod3 == 0){
    return "A"
  }
  if (mod3 == 1){
    return "B"
  }
  if(mod3 == 2){
    return "C"
  }
}

Accounts.onCreateUser(function(options, user) {
  // We're enforcing at least an empty profile object to avoid needing to check
  // for its existence later.
  user.profile = options.profile ? options.profile : {};

  user.profile.currentSequenceId = JokeSequences.findOne()._id
  user.profile.currentSequenceIndex = 0
  user.profile.currentSequenceLastIndex = 99
  user.profile.state = "analysis" //|| "peer review" || "open analysis"
  user.profile.waypointParams = {}
  
  //console.log(user.profile.currentSequenceId)
  user.profile.currentJokeId = JokesInSequence.findOne({
    sequence_id: user.profile.currentSequenceId, 
    sequence_index: user.profile.currentSequenceIndex
  }).joke_id
  
  user.profile.currentAnalysisType = "insult" // \\ "connectTheDots" || "expectationViolation"
  user.profile.currentAnalysisStatus = "notStarted" //|| "inProgress" || "complete"
  user.profile.currentAnalysisSeenInstructions = false // || true
  
  user.profile.group = getGroup() // "A" || "B" || "C"
  
  
  return user;
});


joke_count_categories = [
"submits",
"skips",
"funnyYeses",
"funnyNos",
"funnyUnclears",
"insultYeses",
"insultNos",
"insultUnclears",
"connectTheDotsYeses",
"connectTheDotsNos",
"connectTheDotsUnclears"
]

//RESET SERVER
createBlankJokeCounts = function () {
  var obj = {joke_id: ""}
  _.each(joke_count_categories, function(category){
    obj[category] = 0
  })
  return obj
}

populateJokes = function (){
  //For each joke, insert a Joke and a corresponding JokeCount object.
  if (Jokes.find().count() === 0) {
    for (var i = 0; i < max_num_jokes; i++) {
			var thisItem = jokes[i]
      var task_id = Jokes.insert(thisItem);
      
      
      var joke_counts = createBlankJokeCounts()
      joke_counts['joke_id'] = task_id
      JokeCounts.insert(joke_counts);

    }
  }  
}


populateJokeSequences = function (){
  if (JokeSequences.find().count() === 0) { 
    joke_id_order = _.pluck(Jokes.find().fetch(), "_id")
    
    var numSequences = 3
    var offset = 2
    var joke_id_set1 = joke_id_order.slice(0,offset)
    var joke_id_set2 = joke_id_order.slice(offset,offset*2)
    var joke_id_set3 = joke_id_order.slice(offset*2, offset*3)
    
    for(var i = 0; i<numSequences; i++){
      //create a new sequence
      var name = ""
      if(i == 0){
        name = "A"
        sequence_idA = JokeSequences.insert({name: name})
        
      }
      if(i == 1){
        name = "B"
        sequence_idB = JokeSequences.insert({name: name})
      }
      if(i == 2){
        name = "C"
        sequence_idC = JokeSequences.insert({name: name})
      }
      
      //var sequence_id = JokeSequences.insert({name: name})
      

      /*
      //OLD
      var new_joke_id_order = _.shuffle(joke_id_order)
      _.each(new_joke_id_order, function(joke_id, order){
        JokesInSequence.insert({sequence_id: sequence_id, joke_id: joke_id, order: order})
      })
      */
      
      //insert all items into JokesInSequence
      if(i == 0){
        var group = "A"
        var sequence_id = sequence_idA
        
        //ROUND 1
        _.each(joke_id_set1, function(joke_id, order){
          var first = (order == 0)
          JokesInSequence.insert({
            sequence_id: sequence_id, 
            group: group,
            joke_id: joke_id, 
            sequence_index: order,
            first: first,
            type: "insult",
            state: "analysis"
            })
        })
        _.each(joke_id_set2, function(joke_id, order){
          var first = (order == 0)
          var order = order + offset
          JokesInSequence.insert({
            sequence_id: sequence_id, 
            group: group,
            joke_id: joke_id, 
            sequence_index: order,
            first: first,
            type: "connectTheDots",
            state: "analysis"
            })
        })
         _.each(joke_id_set3, function(joke_id, order){
          var first = (order == 0)
          var order = order + offset*2
          JokesInSequence.insert({
            sequence_id: sequence_id, 
            group: group,
            joke_id: joke_id, 
            sequence_index: order,
            first: first,
            type: "expectationViolation",
            state: "analysis"
            })
        }) 
        
        
        //ROUND 2
        _.each(joke_id_set2, function(joke_id, order){
          var first = (order == 0)
          var order = order + offset*3
          JokesInSequence.insert({
            sequence_id: sequence_id, 
            group: group,
            joke_id: joke_id, 
            sequence_index: order,
            first: first,
            type: "insult",
            state: "peer review"
            })
        })
        _.each(joke_id_set3, function(joke_id, order){
          var first = (order == 0)
          var order = order + offset*4
          JokesInSequence.insert({
            sequence_id: sequence_id, 
            group: group,
            joke_id: joke_id, 
            sequence_index: order,
            first: first,
            type: "connectTheDots",
            state: "peer review"
            })
        })
         _.each(joke_id_set1, function(joke_id, order){
          var first = (order == 0)
          var order = order + offset*5
          JokesInSequence.insert({
            sequence_id: sequence_id, 
            group: group,
            joke_id: joke_id, 
            sequence_index: order,
            first: first,
            type: "expectationViolation",
            state: "peer review"
            })
        })       
      }
      if(i == 1){
        var group = "B"
        var sequence_id = sequence_idB
        _.each(joke_id_set2, function(joke_id, order){
          var first = (order == 0)
          var order = order 
          JokesInSequence.insert({
            sequence_id: sequence_idA, 
            group: group,
            joke_id: joke_id, 
            sequence_index: order,
            first: first,
            type: "insult",
            state: "analysis"
            })
        })
        _.each(joke_id_set3, function(joke_id, order){
          var first = (order == 0)
          var order = order + offset*1
          JokesInSequence.insert({
            sequence_id: sequence_id, 
            group: group,
            joke_id: joke_id, 
            sequence_index: order,
            first: first,
            type: "connectTheDots",
            state: "analysis"
            })
        })
         _.each(joke_id_set1, function(joke_id, order){
          var first = (order == 0)
          var order = order + offset*2
          JokesInSequence.insert({
            sequence_id: sequence_id, 
            group: group,
            joke_id: joke_id, 
            sequence_index: order,
            first: first,
            type: "expectationViolation",
            state: "analysis"
            })
        })
        
                //ROUND 2
        _.each(joke_id_set3, function(joke_id, order){
          var first = (order == 0)
          var order = order + offset*3
          JokesInSequence.insert({
            sequence_id: sequence_id, 
            group: group,
            joke_id: joke_id, 
            sequence_index: order,
            first: first,
            type: "insult",
            state: "peer review"
            })
        })
        _.each(joke_id_set1, function(joke_id, order){
          var first = (order == 0)
          var order = order + offset*4
          JokesInSequence.insert({
            sequence_id: sequence_id, 
            group: group,
            joke_id: joke_id, 
            sequence_index: order,
            first: first,
            type: "connectTheDots",
            state: "peer review"
            })
        })
         _.each(joke_id_set2, function(joke_id, order){
          var first = (order == 0)
          var order = order + offset*5
          JokesInSequence.insert({
            sequence_id: sequence_id, 
            group: group,
            joke_id: joke_id, 
            sequence_index: order,
            first: first,
            type: "expectationViolation",
            state: "peer review"
            })
        }) 
      }
      if(i == 2){
        var group = "C"
        var sequence_id = sequence_idC
        _.each(joke_id_set3, function(joke_id, order){
          var first = (order == 0)
          JokesInSequence.insert({
            sequence_id: sequence_id, 
            group: group,
            joke_id: joke_id, 
            sequence_index: order,
            first: first,
            type: "insult",
            state: "analysis"
            })
        })
        _.each(joke_id_set1, function(joke_id, order){
          var first = (order == 0)
          var order = order + offset
          JokesInSequence.insert({
            sequence_id: sequence_id, 
            group: group,
            joke_id: joke_id, 
            sequence_index: order,
            first: first,
            type: "connectTheDots",
            state: "analysis"
            })
        })
         _.each(joke_id_set2, function(joke_id, order){
          var first = (order == 0)
          var order = order + offset*2
          JokesInSequence.insert({
            sequence_id: sequence_id, 
            group: group,
            joke_id: joke_id, 
            sequence_index: order,
            first: first,
            type: "expectationViolation",
            state: "analysis"
            })
        })
        
        
                //ROUND 2
        _.each(joke_id_set1, function(joke_id, order){
          var first = (order == 0)
          var order = order + offset*3
          JokesInSequence.insert({
            sequence_id: sequence_id, 
            group: group,
            joke_id: joke_id, 
            sequence_index: order,
            first: first,
            type: "insult",
            state: "peer review"
            })
        })
        _.each(joke_id_set2, function(joke_id, order){
          var first = (order == 0)
          var order = order + offset*4
          
          JokesInSequence.insert({
            sequence_id: sequence_id, 
            group: group,
            joke_id: joke_id, 
            sequence_index: order,
            first: first,
            type: "connectTheDots",
            state: "peer review"
            })
        })
         _.each(joke_id_set3, function(joke_id, order){
          var first = (order == 0)
          var order = order + offset*5
          JokesInSequence.insert({
            sequence_id: sequence_id, 
            group: group,
            joke_id: joke_id, 
            sequence_index: order,
            first: first,
            type: "expectationViolation",
            state: "peer review"
            })
        }) 
      }
    }
  } 
}



Meteor.startup(function () {	
  //For each joke, insert a Joke and a corresponding JokeCount object.
  populateJokes()
  populateJokeSequences()
})