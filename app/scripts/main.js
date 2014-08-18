/// DEFINE MODEL ///

    var DoIt = Backbone.Model.extend({

      defaults: function(){
          return {
            summary: 'Something I have to do',
            details: '',
            dueDate: '',
            status: 'open'
        };
      },

      urlRoot:'http://tiny-pizza-server.herokuapp.com/collections/dome',

      idAttribute: '_id'

    });



/// DEFINE MODEL VIEW          ///
/// I DON'T NEED ONE RIGHT NOW ///



// Completely ridiculous, but working, way to force a sort that returns the latest submission first; converts _id from hexadecimal to decimal and sorts by negative, so higher _id values are shown first; since no _id has yet been generated for the new item, force a very large negative number to be returned
    // var mostRecent = function (model) {
    //   var pseudoID;
    //   if (model.get('_id') == undefined) {
    //     pseudoID = -9e+28;
    //   }
    //   else {
    //     pseudoID = -(parseInt((model.get('_id')), 16));
    //   }
    //   return pseudoID;
    // }


/// DEFINE COLLECTION ///

    var DoItList = Backbone.Collection.extend({
        model: DoIt,
        url:'http://tiny-pizza-server.herokuapp.com/collections/dome',
        comparator : 'summary'
      });


    var doItList = new DoItList();


/// DEFINE COLLECTION VIEW ///

    var DoItListView = Backbone.View.extend({
      className : 'do-it-list',

      initialize: function(){
          console.log("Ready to do it!");
          this.listenTo(this.collection, 'add', this.render);
          this.listenTo(this.collection, 'change', this.render);
          this.listenTo(this.collection, 'remove', this.render);
          this.collection.fetch();
        },

        render: function(){
          var source = $('#do-it-template').html();
          var template = Handlebars.compile(source);
          var rendered = template({doItList: this.collection.toJSON()});
          this.$el.html(rendered);
          return this;
        },



        events: {
          'click .edit'     : 'editDoIt',
          'click .complete' : 'completeDoIt',
          'click .save'     : 'updateDoIt',
          'click .delete'   : 'deleteDoIt',
          'click .now'      : 'nowDoIt',
          'click .later'    : 'laterDoIt'
        },

        completeDoIt : function(e) {
            var doIt = doItList.get($(e.currentTarget.parentElement).attr('id'));
            doIt.set('status', 'completed');
            $(e.currentTarget.parentElement).find('.summary').addClass('completed');
            doIt.save();
          },


        editDoIt: function (e) {
          var parent = e.currentTarget.parentElement;
          $(e.currentTarget.parentElement).find('.summary').css({'color':'#ab4312','background':'#fff'});
          $(e.currentTarget.parentElement).find('.summary').attr({'contenteditable':'true'});
          $(e.currentTarget.parentElement).find('.edit').hide();
          $(e.currentTarget.parentElement).find('.save').show();
          console.log('Editing');
        },

        updateDoIt: function (e) {
          console.log('Trying to save!');
          var doIt = doItList.get($(e.currentTarget.parentElement).attr('id'));
          console.log(doIt);
          var doItSummary = $(e.currentTarget.parentElement).find('.summary').text();
          console.log(doItSummary);
          doIt.set('summary', doItSummary);
          console.log('Previous summary: ' + doIt.previous('summary') + ' replaced');
          doIt.save();
          $(e.currentTarget.parentElement).find('.summary').attr({'contenteditable':'fase'});
          $(e.currentTarget.parentElement).find('.summary').css({'color':'black','background':'inherit'});
          $(e.currentTarget.parentElement).find('.edit').show();
          $(e.currentTarget.parentElement).find('.save').hide();
        },

        deleteDoIt: function(e) {
          console.log('Delete');
          var doIt = doItList.get($(e.currentTarget.parentElement).attr('id'));
          doIt.destroy();
        },

        laterDoIt: function(e) {
          alert('Wouldn\'t be awesome if clicking this did something?');
        },

        nowDoIt: function(e) {
          alert('Wouldn\'t be awesome if clicking this did something?');
        }

    });


    var doItListView = new DoItListView ({
      collection: doItList
    });


$(document).ready(function() {
    $('.main-list').append(doItListView.render().$el);
    $('#add-do-it').submit(function(ev){
        var doIt = new DoIt({summary: $('#new-do-it').val()});
        doIt.save(null, {wait: true});
        doItList.add(doIt);
        $('#new-do-it').attr({'placeholder':'What do do now?'});
        $('#new-do-it').val('');
        return false;
      });
    });

// Handlebars helpers
    // Helps style completed tasks when loaded
    Handlebars.registerHelper("addClasses", function() {
        if(this.status == "completed") {
            console.log('completed');
            return 'completed';
        } else {
            console.log('not completed');
            return '';
        }
    });
