
getTime = function(){
  return (new Date()).getTime()
}


Meteor.methods({ 
  /*
  submitWaypoint: function(){
      Meteor.users.update({_id:Meteor.userId()}, {$set:{
        "profile.state": "analysis",
        "profile.waypointParams": {}
      }})     
  }, 
  */
  submitTypeAnalysis: function(params){
    params.time = getTime()
    params.user_id = Meteor.userId() || null
        
    TypeAnalysis.insert(params)          
    updateJokeCounts(params)
    updateNextJoke(params)
    //updateUserProfile()
  },
  /*
  likeComment: function(params){
    
    //add to database of likes    
    params.time = getTime
    Likes.insert(params)
    
    //increment likes
    var comment_id = params.comment_id
    Comments.update(comment_id, {$inc: {likeCount: 1} })  
  },
  */
  
})

updateJokeCounts = function(analysisParams){
  // update JokeCounts
  var fieldsToInc = {submits: 1}
  
  var theories = [
    'wordPlay',
    'insult',
    'expectationViolation',
    'connectTheDots',
    'lens',
    'observation'
  ]
  
  //Funny increment
  if(analysisParams["funny"] != undefined){
    var ans = analysisParams["funny"]
    if (ans == "yes"){
      fieldsToInc["funnyYes"] = 1
    } 
    if (ans == "unclear"){
      fieldsToInc["funnyUnclear"] = 1
    } 
    if (ans == "no"){
      fieldsToInc["funnyNo"] = 1
    }    
  }
  
  //offensive flag
  if(analysisParams["offensive"] != undefined){
    var ans = analysisParams["offensive"]
    if (ans == true){
      fieldsToInc["offensive"] = 1
    } 
   
  }  
  
  _.each(theories, function(theory){
    if(analysisParams[theory] != undefined){
      fieldsToInc[theory] = 1

    }
  })

  var joke_id = analysisParams['joke_id']
  JokeCounts.update({joke_id: joke_id}, {$inc: fieldsToInc })  
}

badges = [4,9,19]

//right now, updateNextJoke is doing it's calculations RELAVTIVELy
//it would be better to do them absolutely.
//so if the user just did joke_id: abc, joke_index: 3, that would be given to
//this function and it would just increment, rather than using the current stuff.
//WOULD THAT MATTER?
updateNextJoke = function(){
  if(Meteor.user()){
    var sequenceId = Meteor.user().profile.currentSequenceId 
    var sequenceIndex = Meteor.user().profile.currentSequenceIndex 
    var sequenceLastIndex = Meteor.user().profile.currentSequenceLastIndex 
    
    var jokeId = Meteor.user().profile.currentJokeId 
    
    var nextSequenceIndex = sequenceIndex + 1
    
    //find the next jokeId
    
    var nextUp = JokesInSequence.findOne({
      sequence_id: sequenceId, 
      sequence_index: nextSequenceIndex
    })
    
    var nextJokeId = nextUp.joke_id
    Meteor.users.update({_id:Meteor.userId()}, {$set:{
      "profile.currentJokeId": nextJokeId,  
      "profile.currentSequenceIndex": nextSequenceIndex    
    }})  
    
    var newBadgeTemplate = earnedNewBadge(sequenceIndex)
    if(newBadgeTemplate != undefined){ 
      console.log("new badge")     
      Meteor.users.update({_id:Meteor.userId()}, {$set:{
        "profile.pageType": "badge",
        "profile.badgeTemplate": newBadgeTemplate     
      }})            
    } else {
      Meteor.users.update({_id:Meteor.userId()}, {$set:{
        "profile.pageType": "task",
        "profile.badgeTemplate": ""     
      }})       
    }  
    
    
  } else {
    console.log("no user")
  }
}

earnedNewBadge = function(sequenceIndex){
  if (sequenceIndex == 4){
    return "badge1"
  } else if (sequenceIndex == 9){
    return "badge2"
  } else if (sequenceIndex == 19){
    return "badge3"
  } else {
    return undefined
  }
}

