
////////////////////////////////
////////////////////////////////
//       HELPERS
////////////////////////////////
////////////////////////////////

UI.registerHelper('eq', function(v1, v2, options) {
  if(v1 == v2){
    return true
  } else {
    return false
  }
});

function findIfILikeThisComment(comment){
  var comment_id = comment._id
  var doILikeThisComment = Comments.find({comment_id: comment_id}).count() 
  //I am only subscribed to MY likes, so this will return 0 if I haven't liked it and 1 if I have liked it.
  if (doILikeThisComment > 0 ){
    comment.i_like = true
  }else {
    comment.i_like = false
  } 
  
}

////////////////////////////////
////////////////////////////////
//       Views, funny
////////////////////////////////
////////////////////////////////

Template.jokeAnalysis.counts = function(){
  return JokeCounts.findOne()
}

Template.jokeAnalysis.analysisTypeSummary = function(){
  rtn = []  
  var selectedTagId = Session.get('selectedTag')
  
  var selected = ""
  if(selectedTagId && selectedTagId == "insultTag"){
    selected = "selected"
  }
  rtn.push({name:"Insult", id:"insultTag", selected: selected})

  var selected = ""
  if(selectedTagId && selectedTagId == "connectTheDotsTag"){
    selected = "selected"
  }  
  rtn.push({name:"Connect The Dots", id:"connectTheDotsTag", selected: selected})
  
  return rtn
}

Template.discussion.selectedTagId = function(){
  return Session.get('selectedTag')
}
/*
Template.myAnalyses.myViews = function(){
    return {contributed: true}
}

Template.myAnalyses.myFunny = function(){
  if (! Meteor.userId()){
    return {contributed: false}
  } else {
    //have I contributed this analysis yet?
    var myFunny = Analysis.findOne({type: "funny", user_id: Meteor.userId()})
    if (myFunny){
      myFunny.seen = true
      return myFunny
    } else {
      return {contributed: false}
    }
  }
}
*/
////////////////////////////////
////////////////////////////////
//       INSULT
////////////////////////////////
////////////////////////////////
Template.insultSummary.counts = function(){
    return JokeCounts.findOne()
}

Template.insultSummary.myInsultData = function(){  
  var myData = myInsultData()
  //do I have a specific comment?
  
  var insultYN = myData.insultYN
  if (insultYN == "yes") {
    myData.yesComment = true 
    myData.hasComment = true   
  }
  if (insultYN == "unclear") {
    myData.unclearComment = true  
    myData.hasComment = true  
  }  
  return myData
}



Template.insultSummary.summary = function(){
  var insultYesExplain = Comments.find({type: "insultYes"}).fetch()
  
  var insultUnclearExplain = [] //Analysis.find({insultYN: "unclear", insultWho: {$not: ""}}).fetch()
  
  // if this user is logged in, 
  //go through all the jokes with non-zero likes
  // determine if THIS USER contributed any of the "likes", so we can flag it.
  if (Meteor.user()){   
    _.each(insultYesExplain, function(comment){
      findIfILikeThisComment(comment)
    })
    
  }
  return {
    insultYesExplain: insultYesExplain, 
    insultUnclearExplain: insultUnclearExplain
  }
}

/*
Template.myAnalyses.myInsult = function(){
  return myInsultData()
}
*/
function myInsultData(){
  if (! Meteor.userId()){
    return {contributed: false}
  } else {
    //have I seen this?
    var myInsult = Analysis.findOne({type: "insult", user_id: Meteor.userId()})
    if (myInsult){
      myInsult.contributed = true
      if (myInsult.insultYN == "yes") {
        //find comments
        myInsult.yes = true
        var analysis_id = myInsult._id
        var comment = Comments.findOne({analysis_id: analysis_id, type: "insultYes"}) 

        if( comment ){
          myInsult.insultWhy = comment.why
          myInsult.insultWho = comment.who
          myInsult.likeCount = comment.likeCount
          myInsult.i_like = false //I can't like my own comment
        }        
      }else if (myInsult.insultYN == "unclear"){
        myInsult.unclear = true
        var analysis_id = myInsult._id
        var comment = Comments.findOne({analysis_id: analysis_id, type: "insultUnclear"}) 

        if( comment ){
          myInsult.unclearWhy = comment.unclearWhy
          myInsult.likeCount = comment.likeCount
          myInsult.i_like = false //I can't like my own comment
        } 
      }
      console.log(myInsult)
      return myInsult
    } else {
      return {contributed: false}
    }
  }  
}


////////////////////////////////
////////////////////////////////
//       CONNECT THE DOTS
////////////////////////////////
////////////////////////////////
Template.connectTheDotsSummary.counts = function(){
  //console.log(JokeCounts.findOne())
  return JokeCounts.findOne()
}

Template.connectTheDotsSummary.myCTDData = function(){  
  var myData = myCTDData()
  //do I have a specific comment?
  
  var connectTheDotsYN = myData.connectTheDotsYN
  if (connectTheDotsYN == "yes") {
    myData.yesComment = true 
    myData.hasComment = true   
  }
  if (connectTheDotsYN == "unclear") {
    myData.unclearComment = true  
    myData.hasComment = true  
  }  
  return myData
}



Template.connectTheDotsSummary.summary = function(){
  var connectTheDotsYesExplain = Comments.find({type: "connectTheDotsYes"}).fetch()
  
  var connectTheDotsUnclearExplain = [] //Analysis.find({insultYN: "unclear", insultWho: {$not: ""}}).fetch()
  
  // if this user is logged in, 
  //go through all the jokes with non-zero likes
  // determine if THIS USER contributed any of the "likes", so we can flag it.
  if (Meteor.user()){   
    _.each(connectTheDotsYesExplain, function(comment){
      findIfILikeThisComment(comment)
    })
    
  }
  return {
    connectTheDotsYesExplain: connectTheDotsYesExplain, 
    connectTheDotsUnclearExplain: connectTheDotsUnclearExplain
  }
}

function myCTDData(){
  if (! Meteor.userId()){
    return {contributed: false}
  } else {
    //have I seen this?
    var myCTD = Analysis.findOne({type: "connect_the_dots", user_id: Meteor.userId()})
    if (myCTD){
      myCTD.contributed = true
      if (myCTD.connectTheDotsYN == "yes") {
        //find comments
        myCTD.yes = true
        var analysis_id = myCTD._id
        var comment = Comments.findOne({analysis_id: analysis_id, type: "connectTheDotsYes"}) 

        if( comment ){
          myCTD.connectWhat = comment.what
          myCTD.likeCount = comment.likeCount
          myCTD.i_like = false //I can't like my own comment
        }        
      }else if (myCTD.insultYN == "unclear"){
        myInsult.unclear = true
        var analysis_id = myCTD._id
        var comment = Comments.findOne({analysis_id: analysis_id, type: "connectTheDotsUnclear"}) 

        if( comment ){
          myCTD.unclearWhy = comment.unclearWhy
          myCTD.likeCount = comment.likeCount
          myCTD.i_like = false //I can't like my own comment
        } 
      }
      return myCTD
    } else {
      return {contributed: false}
    }
  }  
}



///////////////////////////////////////
// EVENTS
///////////////////////////////////////

Template.jokeAnalysis.events({
  'click .analysisTypeTag': function(){
    Session.set('selectedTag', this.id)
  },

  'click .voteUp': function(){
    console.log(this)
    
    Meteor.call('likeComment', {
      ip: Session.get('ip'),
      joke_id: this.joke_id,
      analysis_id: this.analysis_id,
      comment_id: this._id, 
      user_id: Meteor.userId(),
      context: 'joke'
    })
    
  },
  
  //INSULT 
  'click #addInsultAnalysis' : function(){
    $('#insultUI').show()
    $('#addInsultAnalysis').hide()    
  },
  'click #closeInsult' : function(){
    $('#insultUI').hide()
    $('#addInsultAnalysis').show()    
  },
  'click #submitInsult': function(){
    submitInsultAnalysis()
    $('#insultUI').hide()
    $('#addInsultAnalysis').show()
  },  
  
  //CONNECT THE DOTS 
  'click #addConnectTheDotsAnalysis' : function(){
    $('#connectTheDotsUI').show()
    $('#addConnectTheDotsAnalysis').hide()    
  },
  'click #closeConnectTheDots' : function(){
    $('#connectTheDotsUI').hide()
    $('#addConnectTheDotsAnalysis').show()    
  },
  'click #submitConnectTheDots': function(){
    submitConnectTheDotsAnalysis()
    $('#connectTheDotsUI').hide()
    $('#addConnectTheDotsAnalysis').show()
  },   
  
  //FUNNY
  /*
  'click #addFunnyAnalysis' : function(){
    $('#funnyUI').show()
    $('#addFunnyAnalysis').hide()       
  },   
  'click #closeFunny' : function(){
    $('#funnyUI').hide()
    $('#addFunnyAnalysis').show()       
  },    
  'click #submitFunny': function(){
    submitFunnyAnalysis()
    $('#funnyUI').hide()
    $('#addFunnyAnalysis').show()
  } 
  */
})

//SUBMIT HELPERS
function submitConnectTheDotsAnalysis(){
  if( submissionValidCTD() ){
    var connectTheDotsRadio = $('input:radio[name=connectTheDots]:checked');
    var connectTheDotsYNval = $(connectTheDotsRadio).val();
    var connectWhat = $('#connect-what').val()
    var unclearWhy = $('#unclear-why').val()
  
    var funnyRadio = $('input:radio[name=funny]:checked');
    var funnyYNval = $(funnyRadio).val();
   
    
    var f = Meteor.call('submitAnalysis', {
        ip: Session.get('ip'),
        joke_id: Router.current().params["joke_id"],
        connectTheDotsYN: connectTheDotsYNval,
        funnyYN: funnyYNval,
        
        connectWhat: connectWhat,
        unclearWhy: unclearWhy,
        dontGetIt: false,
        skip: false,
        context: 'joke'
      }
    )     
  }
}


function submitInsultAnalysis(){
  var insultRadio = $('input:radio[name=insult]:checked');
  var insultYNval = $(insultRadio).val();
  var insultWho = $('#insulting-who').val()
  var insultWhy = $('#insulting-why').val()
  var unclearWhy = $('#unclear-why').val()

  var f = Meteor.call('submitAnalysis', {
    ip: Session.get('ip'),
    joke_id: Router.current().params["joke_id"],
    insultYN: insultYNval,
    insultWho: insultWho,
    insultWhy: insultWhy,
    unclearWhy: unclearWhy,
    dontGetIt: false,
    skip: false,
    context: 'joke'
  })  
}

function submitFunnyAnalysis(){
  var funnyRadio = $('input:radio[name=funny]:checked');
  var funnyYNval = $(funnyRadio).val();

  var f = Meteor.call('submitAnalysis', {
    ip: Session.get('ip'),
    joke_id: Router.current().params["joke_id"],
    funnyYN: funnyYNval,
    dontGetIt: false,
    skip: false,
    context: 'joke'
  })  
}