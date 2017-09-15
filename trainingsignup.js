$(document).ready(function() {
  $('#calendar').clndr({
    template: $('#calendar-template').html(),
    events: [
  { date: '2013-09-09', title: 'CLNDR GitHub Page Finished', url: 'http://github.com/kylestetz/CLNDR' }
],
clickEvents: {
  click: function(target) {
    console.log(target);
  },
  onMonthChange: function(month) {
    console.log('you just went to ' + month.format('MMMM, YYYY'));
  }
},
doneRendering: function() {
  console.log('this would be a fine place to attach custom event handlers.');
}
  });
});
