Jokes = new Meteor.Collection("jokes");
/*

*/



JokeCounts = new Meteor.Collection("joke_counts");
/* This aggregates all the information logged by the individual responses in the Analysis Collection
  
  joke_id : corresponding joke id,
  submits: number of submits,
  
  skips: # of skips,
  dontGetIts: # of dontGetIts,
  
  funnyYeses: # of funnyYN = "yes"
  funnyNos: # of funnyYN = "no"  
  funnyUnclears: # of funnyYN = "unclear"
  
  insultYeses: # of insultYN = "yes"
  insultNos: # of insultYN = "no"  
  insultUnclears: # of insultYN = "unclear"
  
*/


Analysis = new Meteor.Collection("analysis");
/*
This is to log all user inputs to the system. In particular, it can be used to find out which users have already contributed to an analysis.

There are two main types - views (when a user has simply seen a joke), and particular analysis types.

Enter comments in "comment" collection.

joke type: view
  ip: Session.get('ip'),
  joke_id: 
  user_id: me
  time: 12:00
  type: view
  
  skip: false
  dontGetIt: false
  context_analysis_type: insultYN

Joke types: insultYN/ funnyYN/ connectTheDots
  ip: Session.get('ip'),
  joke_id:
  user_id: me
  time: 12:00
  type: insultYN/funnyYN/connectYN/exaggerationYN
  
  answer: "yes"/"no"/"unclear"
  time: 12:00
  context: insult
*/

Comments = new Meteor.Collection("comments")
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

Likes = new Meteor.Collection("likes");
/*
ip:
joke_id: 
analysis_id:
comment_id:
user_id:
time:
context: joke
*/

