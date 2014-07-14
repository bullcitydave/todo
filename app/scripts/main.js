var DoMe = Backbone.Model.extend({
  defaults: function(){
      return {
        summary: 'Something I have to do',
        details: 'Need some details',
        dueDate: '',
        status: 'open'
    };
  }, urlRoot:'http://tiny-pizza-server.herokuapp.com/collections/dome',
  idAttribute: '_id'
});


var DoMeList = Backbone.Collection.extend({
  model: DoMe,
  url:'http://tiny-pizza-server.herokuapp.com/collections/dome'
});


var doMeList = new DoMeList();

// var doMeList = new DoMeList([
//   {
//       summary: 'Something I have to do asap',
//       details: 'Need some details or else',
//       dueDate: 'July 20, 2014',
//       status: 'open'
//   },
//   {
//       summary: 'Something I have to do soon',
//       details: 'Need some details soon',
//       dueDate: 'July 21, 2014',
//       status: 'open'
//   },
//   {
//       summary: 'Something I have to do eventually',
//       details: 'Need some details eventually',
//       dueDate: 'July 22, 2014',
//       status: 'open'
//   }
//   ]);



var DoMeView = Backbone.View.extend({
  className : 'do-me-list',

  initialize: function(){
      console.log("Ready to do me!");
      this.listenTo(this.collection, 'reset', this.render);
      // this.fetch();
    },

    render: function(){
      var source = $('#do-me-template').html();
      var template = Handlebars.compile(source);
      var rendered = template({doMeList: this.collection.toJSON()});
      this.$el.html(rendered);
      return this;
  }

});

var doMeView = new DoMeView ({
  collection: doMeList
})


$(document).ready(function() {
 $('.do-me-list').append(doMeView.render().$el);
 // $('#add-task').submit(function(ev){
 //   var doMe = new DoMe({summary: $('#new-task').val()});
 //   doMe.save();
 //  //  doMeList.add(doMe);
 //  //  console.log(doMeList.toJSON());
 //   return false;
 // });
 })


 var doMeItem = new DoMe(
   {
       summary: 'Something I have to do asap',
       details: 'Need some details or else',
       dueDate: 'July 20, 2014',
       status: 'open'
   });

doMeItem.save();
