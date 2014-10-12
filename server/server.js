max_num_jokes = 100

getTime = function(){
  return (new Date()).getTime()
}



/*
var joke_count_blank = {
  joke_id : "",
  submits: 0,
  
  skips: 0,
  dontGetIts: 0,
  
  funnyYeses: 0,
  funnyNos: 0, 
  funnyUnclears: 0,
  
  insultYeses: 0,
  insultNos: 0, 
  insultUnclears: 0,
  
  connectTheDotsYeses: 0,
  connectTheDotsNos: 0,
  connectTheDotsUnclears; 0
}
*/



//right now, updateNextJoke is doing it's calculations RELAVTIVELy
//it would be better to do them absolutely.
//so if the user just did joke_id: abc, joke_index: 3, that would be given to
//this function and it would just increment, rather than using the current stuff.
//WOULD THAT MATTER?
updateNextJoke = function(){
  if(Meteor.user()){
    var sequenceId = Meteor.user().profile.currentSequenceId //no change
    var sequenceIndex = Meteor.user().profile.currentSequenceIndex //CHANGE*****
    var sequenceLastIndex = Meteor.user().profile.currentSequenceLastIndex //no change
    
    var jokeId = Meteor.user().profile.currentJokeId //CHANGE *** 
    var analysisType = Meteor.user().profile.currentAnalysisType //could CHANGE, if first
    var analysisStatus = Meteor.user().profile.currentAnalysisStatus //could CHANGE, if first
    var analysisSeenInstructions = Meteor.user().profile.currentAnalysisSeenInstructions // could CHANGE, if first
    var state = Meteor.user().profile.state //could CHANGE
    var group = Meteor.user().profile.group //no change 
    
    var nextSequenceIndex = sequenceIndex + 1
    
    //find the next jokeId
    /*

    sequence_id: sequence_id,   
    group: group,               
    joke_id: joke_id,            
    sequence_index: order,    //SHOULD BE CALLED 'SEQUENCE_INDEX'           
    first: first,               
    type: "insult",                         
    state: 1    //SHOULD BE CALLED 'STATE'                
            
    */
    var nextUp = JokesInSequence.findOne({group: group, sequence_index: nextSequenceIndex})
    
    //Now figure out how to update the state
    
    //what's different between the state where I am and the state where I need to be.
    //update the currentSequenceIndex
    var nextFirst = nextUp.first
    var nextJokeId = nextUp.joke_id
    
    if(nextFirst){
      //we have to propigate a change of state
      Meteor.users.update({_id:Meteor.userId()}, {$set:{
        "profile.sequenceIndex": nextSequenceIndex, 
        "profile.currentJokeId": nextJokeId,      
      
        'profile.currentAnalysisType': nextUp.type,
        'profile.currentAnalysisStatus': "notStarted", 
        'profile.currentAnalysisSeenInstructions': false,
        'profile.state': nextUp.state 
      }})      
    } else {    
      Meteor.users.update({_id:Meteor.userId()}, {$set:{
        "profile.sequenceIndex": nextSequenceIndex, 
        "profile.currentJokeId": nextJokeId,   
        'profile.currentAnalysisStatus': "inProgress"    
      }}) 
    }
  /*
    // increment the order
    var currentSequenceIndex = parseInt(Meteor.user().profile.currentSequenceIndex)
    var nextIndex = currentSequenceIndex + 1
    // find out if the order is is the last order.
    var lastSequenceIndex = parseInt(Meteor.user().profile.currentSequenceLastIndex)
    
    //if we are done with this sequence, mark that state
    if(nextIndex > lastSequenceIndex){
      Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.currentAnalysisStatus": "completed" }}) 
      //WHAT ELSE? DO I NEED TO PICK A NEW THING FOR THEM?  
      
      return    
    }
    

    //UPDATE THE STATE
    //updateNextIndex and JokeId
    var sequenceId = Meteor.user().profile.currentSequenceId 
    var nextJokeId = JokesInSequence.findOne({
      sequence_id: sequenceId,
      order: nextIndex
    }).joke_id
    
    Meteor.users.update({_id:Meteor.userId()}, {$set:{
      "profile.currentAnalysisStatus": "inProgress",
      "profile.currentSequenceIndex": nextIndex,
      "profile.currentJokeId": nextJokeId
    }}) 
     
     //console.log((currentSequenceIndex-1)%10)
   if( (currentSequenceIndex-1)%10 == 0){
      //set the state for the waypoint
      Meteor.users.update({_id:Meteor.userId()}, {$set:{
        "profile.state": "waypoint",
        "profile.waypointParams": {}
      }}) 
    } 
     */
  } else {
    console.log("no user")
  }
}

Meteor.methods({ 
  get_joke_sequence : function(){
    return joke_id_order
  },
  
  get_joke_from_index : function(joke_index){
    var joke_id = joke_id_order[joke_index]
    return Jokes.findOne(joke_id).joke_text
  },
  submitWaypoint: function(){
      Meteor.users.update({_id:Meteor.userId()}, {$set:{
        "profile.state": "analysis",
        "profile.waypointParams": {}
      }})     
  }, 
  submitAnalysis : function(params){
    /*
    params = {
      ip: Session.get('ip'),
      joke_index: getJokeIndex(),
      
      insultYN: insultYNval,
      funnyYN: funnyYNval,
      
      insultWho: insultWho,
      insultWhy: insultWhy,
      unclearWhy: unclearWhy,
            
      dontGetIt: false,
      skip: false
      
      context: insult/joke/etc.
    }
    */
    
    //augment analysisParams to have:
    // user_id 
    // joke_id
    // time

    var analysisParams = params
    analysisParams.time = getTime()
    analysisParams.user_id = Meteor.userId() || null

    console.log(params)

    insertAnalysis(analysisParams)    
    incrementJokeCounts(analysisParams)
    updateNextJoke(analysisParams)

    
    
  },
  likeComment: function(params){
    
    //add to database of likes    
    params.time = getTime
    Likes.insert(params)
    
    //increment likes
    var comment_id = params.comment_id
    Comments.update(comment_id, {$inc: {likeCount: 1} })  
  } 
  
})

/*
    Meteor.call('likeComment', {
      ip: Session.get('ip'),
      joke_id: this.joke_id,
      analysis_id: this.analysis_id,
      comment_id: this._id, 
      context: 'joke'
    })
*/

function insertAnalysis(analysisParams){
  //insert multiple analyses, one for each type of analysis that is entered
  //enter the comments associated with each analysis, if applicable

  insertViewAnalysis(analysisParams)
  insertFunnyAnalysis(analysisParams)
  insertInsultAnalysis(analysisParams)
  insertConnectTheDotsAnalysis(analysisParams)
}

function insertViewAnalysis(analysisParams){
  /*
  ip: Session.get('ip'),
  joke_id: ,
  user_id: me
  time: 12:00
  type: view
  
  skip: false
  dontGetIt: false
  context: insult  
  */
  var keysToInclude = ['user_id', 'joke_id', 'ip', 'time', 'context', 'skip', 'dontGetIt']
  var viewAnalysisParams = createSubsetDict(keysToInclude, analysisParams)
  viewAnalysisParams.type = "view"
    
  Analysis.insert(viewAnalysisParams)  
}

function insertFunnyAnalysis(analysisParams){
  /*
  ip: Session.get('ip'),
  joke_id:
  user_id: me
  time: 12:00
  type: insult/funny/connect_the_dots/lens/...
  
  funnyYN: "yes"/"no"/"unclear"
  time: 12:00
  context: insult 
  */
  if(analysisParams.hasOwnProperty('funnyYN')){
    var keysToInclude = ['user_id', 'joke_id', 'ip', 'time', 'context', 'funnyYN']  
    var funnyAnalysisParams = createSubsetDict(keysToInclude, analysisParams)
    funnyAnalysisParams.type = "funny"  
      
    var analysis_id = Analysis.insert(funnyAnalysisParams)  
  }
}

function insertInsultAnalysis(analysisParams){
  /*
  ip: Session.get('ip'),
  joke_id:
  user_id: me
  time: 12:00
  type: insult/funny/connect_the_dots/lens/...
  
  funnyYN: "yes"/"no"/"unclear"
  time: 12:00
  context: insult 
  */
  if(analysisParams.hasOwnProperty('insultYN')){
    var keysToInclude = ['user_id', 'joke_id', 'ip', 'time', 'context', 'insultYN']  
    var insultAnalysisParams = createSubsetDict(keysToInclude, analysisParams)
    insultAnalysisParams.type = "insult"  
      
    var analysis_id = Analysis.insert(insultAnalysisParams)  
    
    //if there are comments, insert them
    if ( analysisParams["insultYN"] == "yes" &&  analysisParams.hasOwnProperty('insultWho')){
      var keysToInclude = ['user_id', 'joke_id', 'ip', 'time', 'context']  
      var commentObj = createSubsetDict(keysToInclude, analysisParams)
      commentObj.analysis_id = analysis_id
      commentObj.type = "insultYes"
      commentObj.who = analysisParams["insultWho"]
      commentObj.why = analysisParams["insultWhy"]
      commentObj.inreplyto = "none"
      commentObj.likeCount = 0
        
      Comments.insert(commentObj)
    }

    if ( analysisParams["insultYN"] == "unclear" &&  analysisParams.hasOwnProperty('unclearWhy')){
      var keysToInclude = ['user_id', 'joke_id', 'ip', 'time', 'context']  
      var commentObj = createSubsetDict(keysToInclude, analysisParams)
      commentObj.analysis_id = analysis_id
      commentObj.type = "insultUnclear"
      commentObj.unclearWhy = analysisParams["unclearWhy"]
      commentObj.inreplyto = "none"
      commentObj.likeCount = 0
        
      Comments.insert(commentObj)
    }
    
  }
}

function insertConnectTheDotsAnalysis(analysisParams){
  if(analysisParams.hasOwnProperty('connectTheDotsYN')){
    var keysToInclude = ['user_id', 'joke_id', 'ip', 'time', 'context', 'connectTheDotsYN']  
    var connectTheDotsAnalysisParams = createSubsetDict(keysToInclude, analysisParams)
    connectTheDotsAnalysisParams.type = "connect_the_dots"  
      
    var analysis_id = Analysis.insert(connectTheDotsAnalysisParams)  
    
    //if there are comments, insert them
    if ( analysisParams["connectTheDotsYN"] == "yes" &&  analysisParams.hasOwnProperty('connectWhat')){
      var keysToInclude = ['user_id', 'joke_id', 'ip', 'time', 'context']  
      var commentObj = createSubsetDict(keysToInclude, analysisParams)
      commentObj.analysis_id = analysis_id
      commentObj.type = "connectTheDotsYes"
      commentObj.what = analysisParams["connectWhat"]
      commentObj.inreplyto = "none"
      commentObj.likeCount = 0
        
      Comments.insert(commentObj)
    }

    if ( analysisParams["connectTheDotsYN"] == "unclear" &&  analysisParams.hasOwnProperty('unclearWhy')){
      var keysToInclude = ['user_id', 'joke_id', 'ip', 'time', 'context']  
      var commentObj = createSubsetDict(keysToInclude, analysisParams)
      commentObj.analysis_id = analysis_id
      commentObj.type = "connectTheDotsUnclear"
      commentObj.unclearWhy = analysisParams["unclearWhy"]
      commentObj.inreplyto = "none"
      commentObj.likeCount = 0
        
      Comments.insert(commentObj)
    }
    
  }  
}

createSubsetDict = function (keys, oldDict){
  var subsetDict = {}
  oldKeys = _.keys(oldDict)
  _.each(keys, function(key){
    if (_.contains(oldKeys, key)){
      subsetDict[key] = oldDict[key]
    }
  })
  return subsetDict
}

function incrementJokeCounts(analysisParams){
  // update JokeCounts
  var fieldsToInc = {submits: 1}

  if (analysisParams['skip'] != undefined){
    if (analysisParams['skip'] == true){
      fieldsToInc['skips'] = 1
    }
  }
  if (analysisParams['dontGetIt'] != undefined){
    if (analysisParams['dontGetIt'] == true){  
      fieldsToInc['dontGetIts'] = 1
    }
  }
  
  
  if (analysisParams['funnyYN'] != undefined){
    var funnyYN = analysisParams['funnyYN']
    if (funnyYN == "yes"){
      fieldsToInc['funnyYeses'] = 1
    }
    if (funnyYN == "no"){
      fieldsToInc['funnyNos'] = 1
    }
    if (funnyYN == "unclear"){
      fieldsToInc['funnyUnclears'] = 1
    }
  }    


  if (analysisParams['insultYN'] != undefined){
    var insultYN = analysisParams['insultYN']
    if (insultYN == "yes"){
      fieldsToInc['insultYeses'] = 1
    }
    if (insultYN == "no"){
      fieldsToInc['insultNos'] = 1
    }
    if (insultYN == "unclear"){
      fieldsToInc['insultUnclears'] = 1
    }
  }   
  if (analysisParams['connectTheDotsYN'] != undefined){
    console.log('inside')
    var insultYN = analysisParams['connectTheDotsYN']
    if (insultYN == "yes"){
      fieldsToInc['connectTheDotsYeses'] = 1
    }
    if (insultYN == "no"){
      fieldsToInc['connectTheDotsNos'] = 1
    }
    if (insultYN == "unclear"){
      fieldsToInc['connectTheDotsUnclears'] = 1
    }
  } 
  var joke_id = analysisParams['joke_id']
  JokeCounts.update({joke_id: joke_id}, {$inc: fieldsToInc })  
}




