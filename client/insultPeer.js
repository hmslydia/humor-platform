Template.insultPeerReview.helpers({
  peerResponses: function(){
    //HERE IS WHERE I MAKE MY array of peer responses:
    //{"response": "yes", "comment", "", analysis_id: , comment_id}
    var responseObj = []
    console.log('insultPeerReview')
    console.log(this)
    var analyses = this.analysis
    var comments = this.comments
    _.each(analyses, function(analysis){
      analysis.response = analysis.insultYN
      if(analysis.response == "no"){
        analysis.comment = ""  
             
      }
      if(analysis.response == "yes"){
        var commentObj = _.find(comments, function(comment){ return comment.analysis_id == analysis._id})
        var who = commentObj.who
        var why = commentObj.why
        analysis.comment = ""+who+"<br>"+why
        analysis.comment_id = commentObj._id
      }
      if(analysis.response == "unclear"){
        var commentObj = _.find(comments, function(comment){ return comment.analysis_id == analysis._id})
        //var who = yesCommentObj.who
        var unclearWhy = commentObj.unclearWhy
        analysis.comment = unclearWhy
        analysis.comment_id = commentObj._id
      }
      responseObj.push(analysis) 
    })
    console.log(responseObj)
    return responseObj
  }
  
})

Template.insultPeerReview.events({
  'click .btn': function(event){
    var id = $(event.target).attr("id")
    console.log(this)
    if($(event.target).hasClass('btn-default')){
      console.log("has selected, remove it")
      $(event.target).removeClass('btn-default')
      $(event.target).addClass('btn-success')
    }else{
      console.log("doesn't have, select it")
      $(event.target).addClass('btn-default')
      $(event.target).removeClass('btn-success')
    }

  }
})

Template.insultPeerReviewContainer.events({
  'click #next': function(){
    //Check to see they have selected something
    var selectedItems = $(".btn-success")
    if(selectedItems.length == 0){
      alert("Please select at least one response.")
    }else {
      console.log(this)
      submitPeerReview()
    }
  },
  'click #dontGetIt': function() {
    submitDontGetItPeerReview()
    //clearData()
  },  
  'click #skip': function() {    
    submitSkipPeerReview()
    //clearData()
  }
})

submitDontGetItPeerReview = function (){   
  Meteor.call('submitPeerAnalysis', {
      ip: Session.get('ip'),
      joke_id: Router.current().params.joke_id,
      selected_analysis_ids: [],
      dontGetIt: true,
      skip: false,
      context: 'insultPeer'
    }, function(result){
      //updateNextJoke()
      goToNextJoke()
    }    
  )  
} 

submitSkipPeerReview = function (){   
  Meteor.call('submitPeerAnalysis', {
      ip: Session.get('ip'),
      joke_id: Router.current().params.joke_id,
      selected_analysis_ids: [],
      dontGetIt: false,
      skip: true,
      context: 'insultPeer'
    }, function(result){
      //updateNextJoke()
      goToNextJoke()
    }    
  )  
}

submitPeerReview = function () {
  var selectedItems = $(".btn-success")
  var selectedIds = []
  _.each(selectedItems, function(selectedItem){
    selectedIds.push($(selectedItem).attr('id'))
  })
  //console.log(selectedIds)

  //var funnyRadio = $('input:radio[name=funny]:checked');
  //var funnyYNval = $(funnyRadio).val();
 console.log(selectedIds)
  var f = Meteor.call('submitPeerAnalysis', {
      ip: Session.get('ip'),
      joke_id: Router.current().params.joke_id,
      selected_analysis_ids: selectedIds,
      user_id: Meteor.userId(),
      dontGetIt: false,
      skip: false,
      context: 'insultPeer'
    }, function(result){
      goToNextJoke()
    } 
  )  
 
 }
/*
submitDontGetIt = function (){   
  Meteor.call('submitAnalysis', {
      ip: Session.get('ip'),
      //joke_index: getJokeIndex(),
      joke_id: Router.current().params.joke_id,
      dontGetIt: true,
      skip: false,
      context: 'insult'
    }, function(result){
      //updateNextJoke()
      goToNextJoke()
    }    
  )  
} 

submitSkip = function (){   
  Meteor.call('submitAnalysis', {
      ip: Session.get('ip'),
      //joke_index: getJokeIndex(),
      joke_id: Router.current().params.joke_id,
      dontGetIt: false,
      skip: true,
      context: 'insult'
    }, function(result){
      //updateNextJoke()
      goToNextJoke()
    }    
  )  
}
*/