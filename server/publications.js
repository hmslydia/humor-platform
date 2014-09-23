//TEMP
Meteor.publish('joke_sequences', function(){
  return JokeSequences.find({})
})

Meteor.publish('units', function(){
  return Units.find({})
})



///

/*
Meteor.publish('jokesByIndex', function(joke_index){
  //var joke_id = joke_id_order[joke_index]
  return Jokes.find(joke_id)
})
*/
Meteor.publish('jokesById', function(joke_id){
  return Jokes.find(joke_id)
})
/*
Meteor.publish('jokesByUnitId', function(unit_id){
  console.log(unit_id)
  var unit = Units.findOne(unit_id)
  console.log(unit)
  //var joke_sequence_id = unit.joke_sequence_id
  //var current_index = unit.current_index
  var current_joke_id = unit.current_joke_id
  //var jokeSequence = JokeSequence.findOne(joke_sequence_id)
  //var joke_id = jokeSequence.joke_ids[current_index]
  console.log(Jokes.findOne(current_joke_id))
  return Jokes.find(current_joke_id)
})
*/
/*
Meteor.publish('analysis', function () {
	return Analysis.find({});
});

Meteor.publish('comments', function () {
	return Comments.find({});
});
*/

/*
Per-joke analysis info: counts, comments, etc.
*/
Meteor.publish('analysisByJoke', function (joke_id) {
	return Analysis.find({joke_id: joke_id});
});

Meteor.publish('jokeCountsByJoke', function (joke_id) {
	return JokeCounts.find({joke_id: joke_id});
});

Meteor.publish('commentsByJoke', function (joke_id) {
	return Comments.find({joke_id: joke_id});
});

Meteor.publish('likesByJoke', function (joke_id) {
	return Likes.find({joke_id: joke_id});
});