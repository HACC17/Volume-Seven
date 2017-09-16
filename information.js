
$( document ).ready(function() {
  let currentForm = 'personal-info';

  $('#personal-info-next').click((e) => {
    e.preventDefault();
    $('#personal-info').addClass('hideForm');
    $('#address-info').removeClass('hideForm');
    currentForm = 'address-info';
  });

  $('#address-info-next').click((e) => {
    e.preventDefault();
    $('#address-info').addClass('hideForm');
    $('#other-info').removeClass('hideForm');
    currentForm = 'other-info';
  });

  $('#mailingSameAsResidence').click(function(){
    if (this.checked) {
      $('#mailingAddressFields').addClass('hideForm');
    } else if (!this.checked) {
      $('#mailingAddressFields').removeClass('hideForm');
    }
  });

});
