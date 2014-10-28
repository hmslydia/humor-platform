JokeSequences = new Meteor.Collection("joke_sequences")
/*
  id:
  name: "A" (group name)
*/

JokesInSequence = new Meteor.Collection("jokes_in_sequence") 
/*
  sequence_id: sequence_id, 
  name: name,
  joke_id: joke_id, 
  sequence_index: order,
*/


Jokes = new Meteor.Collection("jokes");
/*
  joke_text:
*/


TypeAnalysis = new Meteor.Collection("type_analysis")
/*
  'user_id',
  
  'joke_id',
  
  'funnyYN',

  'vulgar',
  
  'insult',
  'wordPlay',
  'expectationViolation',
  'connectTheDots',
  'lens',
  'observation' 
*/


JokeCounts = new Meteor.Collection("joke_counts");
/* This aggregates all the information logged by the individual responses 
  
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
*/


//Comments = new Meteor.Collection("comments")
/*
  ip:
  joke_id: 
  analysis_id:
  user_id:
  comment_text:
  prompt: "insultWhy"/"unclearWhy"
  in_reply_to: comment_id / or none
  time: 12:00 //order by this
  likes: 15 //to find out who likes stuff, look it up in the like table
*/

//Likes = new Meteor.Collection("likes");
/*
  ip:
  joke_id: 
  analysis_id:
  comment_id:
  user_id:
  time:
  context: joke
*/

