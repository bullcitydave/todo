/// DEFINE MODEL ///

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


/// DEFINE MODEL VIEW ///

    var DoMeView = Backbone.View.extend({
      className : 'do-me-list',

      initialize: function(){
          console.log("Ready to do me!");
        },

        events: {
        "click .edit" : "editToDo"
      },

        editToDo: function (e) {
              // $(this).children('strong').css('color', 'blue');
              // $(this).children('strong').attr({'contenteditable': 'true'});
              var parent = e.currentTarget.parentElement;
              $(e.currentTarget.parentElement).find('strong').css('color','blue');
              console.log('Editing');

            }

    });


// This is a completely ridiculously way to force a sort that returns the latest submission first; converts _id from hexadecimal to decimal and sorts by negative, so higher _id values are shown first; since no _id has yet been generated for the new item, force a very large negative number to be returned
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


/// DEFINE COLLECTION ///

    var DoMeList = Backbone.Collection.extend({
        model: DoMe,
        url:'http://tiny-pizza-server.herokuapp.com/collections/dome',
        comparator : mostRecent
      });


    var doMeList = new DoMeList();



/// DEFINE COLLECTION VIEW ///

    var DoMeListView = Backbone.View.extend({
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

        editToDo: function (e) {
              // $(this).children('strong').css('color', 'blue');
              // $(this).children('strong').attr({'contenteditable': 'true'});
              var parent = e.currentTarget.parentElement;
              $(e.currentTarget.parentElement).find('strong').css('color','blue');
              console.log('Editing');

            }

    });


    var doMeListView = new DoMeListView ({
      collection: doMeList
    });


$(document).ready(function() {
    $('.do-me-list').append(doMeListView.render().$el);
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
        doMeList.remove( doMeList.get(getId) );
        var modo = doMeList.get(getId);
        // modo.destroy();
    })

    $('.complete').click(function() {
      alert('Completing');
      console.log('Completing');

    })
    // $('.edit').click(function() {
    //   alert('Editing');
    //   alert($(this).siblings('strong').attr('contenteditable'));
    //   $(this).siblings('strong').css('color', 'blue');
    //   $(this).siblings('strong').attr({'contenteditable' : 'true'});
    //   alert($(this).siblings('strong').attr('contenteditable'));
    //   console.log('Editing');
    //
    // })

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

    // 
    // $('.edit').click(editToDo);
    //
    //
    // var editToDo = function() {
    //   $(this).siblings('strong').css('color', 'blue');
    //   $(this).siblings('strong').attr({'contenteditable': 'true'});
    //   $(this).siblings('save').css('display', 'inline-block');
    //   console.log('Editing');
    // }
