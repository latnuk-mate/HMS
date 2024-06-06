// client side javascript file..

// $(document).ready(function (){
  
//     $('.department--list li').click(function(){
//         $('.department--list li').removeClass('active');
//         $(this).addClass('active');

//         var filterValue = $(this).attr('data-filter');
//         $grid.isotope({ filter: filterValue });
//     });

    

//    var $grid =  $('.grid').isotope({
//         itemSelector: '.all',
//         percentPosition: false,
//         masonry: {
//           columnWidth: '.all'
//         }
//       })


// });

$(window).on('load' , function(){
      
    $('.department--list li').click(function(){
        $('.department--list li').removeClass('active');
        $(this).addClass('active');

        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
    });

    

   var $grid =  $('.grid').isotope({
        itemSelector: '.all',
        percentPosition: false,
        masonry: {
          columnWidth: '.all'
        }
      })
})
