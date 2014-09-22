Meteor.publish('jokesByIndex', function(joke_index){
  var joke_id = joke_id_order[joke_index]
  return Jokes.find(joke_id)
})

Meteor.publish('jokesById', function(joke_id){
  return Jokes.find(joke_id)
})


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