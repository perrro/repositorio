$( document ).ready(function() {

  var carousel = $(".myCarousel").carousel({"pagination": false});

  $('.ch-carousel-item > img').on({
    'click': function() {
         var src = $(this).data('big');
         $('.main-image figure img').attr('src', src);
    }
	});

});
