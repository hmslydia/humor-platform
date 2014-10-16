Template.connectTheDotsPeerReview.helpers({
  peerResponses: function(){
    //HERE IS WHERE I MAKE MY array of peer responses:
    //{"response": "yes", "comment", "", analysis_id: , comment_id}
    var responseObj = []
    var analyses = this.analysis
    var comments = this.comments
    console.log("EERER")
    _.each(analyses, function(analysis){
      console.log("ANALYSIS")
      console.log(analysis)
      analysis.response = analysis.connectTheDotsYN
      if(analysis.response == "no"){
        analysis.comment = ""  
             
      }
      if(analysis.response == "yes"){
        var commentObj = _.find(comments, function(comment){ return comment.analysis_id == analysis._id})
        var what = commentObj.what
        analysis.comment = what
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

Template.connectTheDotsPeerReview.events({
  'click .btn': function(event){
    var id = $(event.target).attr("id")
    //console.log(this)
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

Template.connectTheDotsPeerReviewContainer.events({
  'click #next': function(){
    //Check to see they have selected something
    var selectedItems = $(".btn-success")
    if(selectedItems.length == 0){
      alert("Please select at least one response.")
    }else {
      //console.log(this)
      submitPeerReview()
    }
  },
  'click #dontGetIt': function() {
    submitDontGetItConnectTheDotsPeerReview()
    //clearData()
  },  
  'click #skip': function() {    
    submitSkipConnectTheDotsPeerReview()
    //clearData()
  }
})

submitDontGetItConnectTheDotsPeerReview = function (){   
  Meteor.call('submitPeerAnalysis', {
      ip: Session.get('ip'),
      joke_id: Router.current().params.joke_id,
      selected_analysis_ids: [],
      dontGetIt: true,
      skip: false,
      context: 'connectTheDotsPeer'
    }, function(result){
      goToNextJoke()
    }    
  )  
} 

submitSkipConnectTheDotsPeerReview = function (){   
  Meteor.call('submitPeerAnalysis', {
      ip: Session.get('ip'),
      joke_id: Router.current().params.joke_id,
      selected_analysis_ids: [],
      dontGetIt: false,
      skip: true,
      context: 'connectTheDotsPeer'
    }, function(result){
      goToNextJoke()
    }    
  )  
}

submitConnectTheDotsPeerReview = function () {
  var selectedItems = $(".btn-success")
  var selectedIds = []
  _.each(selectedItems, function(selectedItem){
    selectedIds.push($(selectedItem).attr('id'))
  })
  //console.log(selectedIds)

  //var funnyRadio = $('input:radio[name=funny]:checked');
  //var funnyYNval = $(funnyRadio).val();
 //console.log(selectedIds)
  var f = Meteor.call('submitPeerAnalysis', {
      ip: Session.get('ip'),
      joke_id: Router.current().params.joke_id,
      selected_analysis_ids: selectedIds,
      user_id: Meteor.userId(),
      dontGetIt: false,
      skip: false,
      context: 'connectTheDotsPeer'
    }, function(result){
      goToNextJoke()
    } 
  )  
}