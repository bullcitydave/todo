



var DoMe = Backbone.Model.extend({

  // initialize: function() {
  //    this.listenTo(this.model, 'destroy', this.remove);
  // },

  defaults: function(){
      return {
        summary: 'Something I have to do',
        details: 'Need some details',
        dueDate: '',
        status: 'open'
    };
  },

  urlRoot:'http://tiny-pizza-server.herokuapp.com/collections/dome',

  idAttribute: '_id'
});


// this is a completely ridiculously way to force a sort that returns the latest submission first; converts _id from hexadecimal to decimal and sorts by negative, so higher _id values are shown first; since no _id has yet been generated for the new item, force a very large negative number to be returned
var mostRecent = function (model) {
  var pseudoID;
  if (model.get('_id') == undefined) {
    pseudoID = -9.5923158918808516e+28;
    console.log('here');
  }
  else {
    pseudoID = -(parseInt((model.get('_id')), 16));
  }
  console.log(pseudoID);
  return pseudoID;
}

var DoMeList = Backbone.Collection.extend({
    model: DoMe,
    url:'http://tiny-pizza-server.herokuapp.com/collections/dome',
    comparator : mostRecent


  });


var doMeList = new DoMeList();
// doMeList.fetch();






var DoMeView = Backbone.View.extend({
  className : 'do-me-list',

  initialize: function(){
      console.log("Ready to do me!");
      this.listenTo(this.collection, 'add', this.render);
      this.listenTo(this.collection, 'remove', this.render);
      this.collection.fetch();
    },

    render: function(){
      var source = $('#do-me-template').html();
      var template = Handlebars.compile(source);
      var rendered = template({doMeList: this.collection.toJSON()});
      this.$el.html(rendered);
      return this;
  },





});

var doMeView = new DoMeView ({
  collection: doMeList
});


$(document).ready(function() {
    $('.do-me-list').append(doMeView.render().$el);
    $('#add-task').submit(function(ev){
        var doMe = new DoMe({summary: $('#new-task').val()});
        doMe.save(null, {wait: true});
        doMeList.add(doMe);
        return false;
      });

///this works first time only
    $('.delete').click(function() {
      alert('Deleting');
      console.log('Delete');
        var getId = ($(this).parent().attr('id'));
        // doMeList.remove( doMeList.get(getId) );
        var modo = doMeList.get(getId);
        modo.destroy();
    })

    $('.complete').click(function() {
      alert('Completing');
      console.log('Completing');

    })
    $('.edit').click(function() {
      alert('Editing');
      console.log('Editing');

    })

 })




$('h1').click(function() {
  alert('Clicked');
  console.log('Delete');
    // var getId = ($(this).parent().attr('id'));
    // doMeList.remove( doMeList.get(getId) );
})


///error this is not a function
// $('.delete').addEventListener('click', function() {
//         var getId = ($(this).parent().attr('id'));
//         console.log(getId);
//         doMeList.get(getId).destroy();
//     }, false);


    //// this doesn't do anything outside of a function
    $('.delete').click(function() {
      alert('Deleting');
      console.log('Delete');
        var getId = ($(this).parent().attr('id'));
        // doMeList.remove( doMeList.get(getId) );
        var modo = doMeList.get(getId);
        modo.destroy();
    })
