
max_num_jokes = 100

//missions 
insult0 = []
connect_the_dots0 = []

//should be depreciaed
joke_id_order = []

function getTime(){
  return (new Date()).getTime()
}


var joke_count_categories = [
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
function createBlankJokeCounts() {
  var obj = {joke_id: ""}
  _.each(joke_count_categories, function(category){
    obj[category] = 0
  })
  return obj
}

Meteor.startup(function () {	
  if (Jokes.find().count() === 0) {
    for (var i = 0; i < max_num_jokes; i++) {
			var thisItem = jokes[i]
      var task_id = Jokes.insert(thisItem);
      
      
      var joke_counts = createBlankJokeCounts()
      joke_counts['joke_id'] = task_id
      JokeCounts.insert(joke_counts);

    }
  }
  if (joke_id_order.length == 0){
    joke_id_order = _.pluck(Jokes.find().fetch(), "_id") 
    
    insult0 = _.pluck(Jokes.find().fetch(), "_id")
    connect_the_dots0 = _.pluck(Jokes.find().fetch(), "_id")
  }
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
    
    var joke_index = parseInt(params.joke_index)
    var joke_id = joke_id_order[joke_index]
    if(joke_id === undefined){
      joke_id = params.joke_id
    }
    analysisParams.joke_id = joke_id

    insertAnalysis(analysisParams)    
    incrementJokeCounts(analysisParams)
    
    if (Meteor.user()){
      Meteor.user().profile.joke_index = (joke_index + 1)
    } 
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
  console.log('326')
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
  console.log(fieldsToInc)
  var joke_id = analysisParams['joke_id']
  console.log(analysisParams)
  console.log(joke_id)
  JokeCounts.update({joke_id: joke_id}, {$inc: fieldsToInc })  
  console.log(JokeCounts.find({joke_id: joke_id}).fetch())
  
}


Accounts.onCreateUser(function(options, user) {
  // We're enforcing at least an empty profile object to avoid needing to check
  // for its existence later.
  user.profile = options.profile ? options.profile : {};
  
  //user.profile.joke_sequence = joke_id_order
  //user.profile.joke_index = 0
  
  user.profile.mission = default_mission
  user.profile.analysis_type = default_analysis_type
  user.profile.joke_indexes = {}
  _.each(analysis_types, function(analysis_type){
    user.profile.joke_indexes[analysis_type] = 0
  })
  
  return user;
});

