/// DEFINE MODEL ///

    var DoMe = Backbone.Model.extend({

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
    var mostRecent = function (model) {
      var pseudoID;
      if (model.get('_id') == undefined) {
        pseudoID = -9e+28;
      }
      else {
        pseudoID = -(parseInt((model.get('_id')), 16));
      }
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
          this.listenTo(this.collection, 'change', this.render);
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



        events: {
          'click .edit'     : 'editDoMe',
          'click .complete' : 'completeDoMe',
          'click .save'     : 'updateDoMe',
          'click .delete'   : 'deleteDoMe',
          'click .now'      : 'nowDoMe',
          'click .later'    : 'laterDoMe'
        },

        completeDoMe : function(e) {
            var doMe = doMeList.get($(e.currentTarget.parentElement).attr('id'));
            doMe.set('status', 'completed');
            $(e.currentTarget.parentElement).find('.summary').addClass('completed');
            doMe.save();
          },


        editDoMe: function (e) {
          var parent = e.currentTarget.parentElement;
          $(e.currentTarget.parentElement).find('.summary').css({'color':'#ab4312','background':'#fff'});
          $(e.currentTarget.parentElement).find('.summary').attr({'contenteditable':'true'});
          $(e.currentTarget.parentElement).find('.edit').hide();
          $(e.currentTarget.parentElement).find('.save').show();
          console.log('Editing');
        },

        updateDoMe: function (e) {
          console.log('Trying to save!');
          var doMe = doMeList.get($(e.currentTarget.parentElement).attr('id'));
          console.log(doMe);
          var doMeSummary = $(e.currentTarget.parentElement).find('.summary').text();
          console.log(doMeSummary);
          doMe.set('summary', doMeSummary);
          console.log('Previous summary: ' + doMe.previous('summary') + ' replaced');
          doMe.save();
          $(e.currentTarget.parentElement).find('.summary').attr({'contenteditable':'fase'});
          $(e.currentTarget.parentElement).find('.summary').css({'color':'black','background':'inherit'});
          $(e.currentTarget.parentElement).find('.edit').show();
          $(e.currentTarget.parentElement).find('.save').hide();
        },

        deleteDoMe: function(e) {
          console.log('Delete');
          var doMe = doMeList.get($(e.currentTarget.parentElement).attr('id'));
          doMe.destroy();
        },

        laterDoMe: function(e) {
          alert('Wouldn\'t be awesome if clicking this did something?');
        },

        nowDoMe: function(e) {
          alert('Wouldn\'t be awesome if clicking this did something?');
        }

    });


    var doMeListView = new DoMeListView ({
      collection: doMeList
    });


$(document).ready(function() {
    $('.main-list').append(doMeListView.render().$el);
    $('#add-do-me').submit(function(ev){
        var doMe = new DoMe({summary: $('#new-do-me').val()});
        doMe.save(null, {wait: true});
        doMeList.add(doMe);
        $('#new-do-me').attr({'placeholder':'What do do now?'});
        $('#new-do-me').val('');
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
