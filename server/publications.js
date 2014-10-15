//TEMP
Meteor.publish('joke_sequences', function(){
  return JokeSequences.find({})
})

Meteor.publish('jokes_in_sequence', function(){
  /*
  if(!this.userId)
    return this.ready()
  */
  //user_id: this.userId()
  return JokesInSequence.find({})
})



Meteor.publish('jokesById', function(joke_id){
  return Jokes.find(joke_id)
})

Meteor.publish('jokes', function(){
  return Jokes.find({})
})
Meteor.publish('jokeCounts', function(){
  return JokeCounts.find({})
})

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