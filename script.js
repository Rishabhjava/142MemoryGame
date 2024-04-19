$(function(){
  
  function set(key, value) { localStorage.setItem(key, value); }
  function get(key)        { return localStorage.getItem(key); }
  function increase(el)    { set(el, parseInt( get(el) ) + 1); }
  function decrease(el)    { set(el, parseInt( get(el) ) - 1); }

  var toTime = function(nr){
    if(nr == '-:-') return nr;
    else { var n = ' '+nr/1000+' '; return n.substr(0, n.length-1)+'s'; }
  };

  var terms = [
    { term: "Algorithm", definition: "A set of rules to solve a problem." },
    { term: "Binary", definition: "A system using base two." },
    { term: "Compiler", definition: "Converts source code into machine code." },
    { term: "Finite Automaton", definition: "A theoretical machine used to model computation; operates on a finite amount of input." },
    { term: "Turing Machine", definition: "A mathematical model of computation that defines an abstract machine which manipulates symbols on a strip of tape according to a table of rules." },
    { term: "Context-free Grammar", definition: "A formal grammar that is used to generate all possible strings in a given formal language." },
    { term: "Decidability", definition: "The ability to determine, in a finite amount of time, whether a given algorithm terminates or computes a function for all inputs." },
    { term: "Halting Problem", definition: "The problem of determining, from a description of an arbitrary computer program and an input, whether the program will finish running or continue to run forever." },
    { term: "P vs NP Problem", definition: "A major unsolved problem in computer science concerning the relationship between the complexity classes P and NP." },
    { term: "Regular Expression", definition: "A sequence of characters that define a search pattern, mainly for use in pattern matching with strings." },
    { term: "State Transition", definition: "A change in state within an automaton in response to external inputs." },
    { term: "Non-deterministic Automaton", definition: "An automaton where for each state and symbol, there can be several possible next states." },
    { term: "Church-Turing Thesis", definition: "A hypothesis about the nature of computable functions: any function that can be computed by an algorithm can be computed by a Turing machine." },
    { term: "Complexity Class", definition: "A set of problems of related resource-based complexity." },
    { term: "Reduction", definition: "A way of relating different problems to each other, typically used to show that one problem is at least as difficult as another." },
    { term: "Undecidable Problem", definition: "A problem for which no deterministic algorithm can determine the answer for all inputs." },
    { term: "Recursive Function", definition: "A function that calls itself in its definition." },
    { term: "Pushdown Automaton", definition: "A type of automaton that employs a stack for additional memory." }
];

  

  function updateStats(){
    $('#stats').html('<div class="padded"><h2>Figures: <span>'+
      '<b>'+get('flip_won')+'</b><i>Won</i>'+
      '<b>'+get('flip_lost')+'</b><i>Lost</i>'+
      '<b>'+get('flip_abandoned')+'</b><i>Abandoned</i></span></h2>'+
      '<ul><li><b>Best Casual:</b> <span>'+toTime( get('flip_casual') )+'</span></li>'+
      '<li><b>Best Medium:</b> <span>'+toTime( get('flip_medium') )+'</span></li>'+
      '<li><b>Best Hard:</b> <span>'+toTime( get('flip_hard') )+'</span></li></ul>'+
      '<ul><li><b>Total Flips:</b> <span>'+parseInt( ( parseInt(get('flip_matched')) + parseInt(get('flip_wrong')) ) * 2)+'</span></li>'+
      '<li><b>Matched Flips:</b> <span>'+get('flip_matched')+'</span></li>'+
      '<li><b>Wrong Flips:</b> <span>'+get('flip_wrong')+'</span></li></ul></div>');
  };

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
  };

  function startScreen(text){
    $('#g').removeAttr('class').empty();
    $('.logo').fadeIn(250);

    $('.c1').text(text.substring(0, 1));
    $('.c2').text(text.substring(1, 2));
    $('.c3').text(text.substring(2, 3));
    $('.c4').text(text.substring(3, 4));

    if(text == 'nice'){
      increase('flip_won');
      decrease('flip_abandoned');
    }

    else if(text == 'fail'){
      increase('flip_lost');
      decrease('flip_abandoned');
    }

    updateStats();
  };

  if( !get('flip_won') && !get('flip_lost') && !get('flip_abandoned') ){

    set('flip_won', 0);
    set('flip_lost', 0);
    set('flip_abandoned', 0);

    set('flip_casual', '-:-');
    set('flip_medium', '-:-');
    set('flip_hard', '-:-');

    set('flip_matched', 0);
    set('flip_wrong', 0);
  }

  if( get('flip_won') > 0 || get('flip_lost') > 0 || get('flip_abandoned') > 0) {updateStats();}


  $('.logo .card:not(".twist")').on('click', function(e){
    $(this).toggleClass('active').siblings().not('.twist').removeClass('active');
    if( $(e.target).is('.playnow') ) { $('.logo .card').last().addClass('active'); }
  });

  

  $('.play').on('click', function(){
    increase('flip_abandoned');
		$('.info').fadeOut();

    var difficulty = '',
        timer      = 10000,
        level      = $(this).data('level');


    if     (level ==  8) { difficulty = 'casual'; timer *= level * 4; }
    else if(level == 18) { difficulty = 'medium'; timer *= level * 5; }
    else if(level == 32) { difficulty = 'hard';   timer *= level * 6; }	    

    $('#g').addClass(difficulty);

    $('.logo').fadeOut(250, function(){
      var startGame  = $.now(),
          obj = [];

      for(i = 0; i < level; i++) { obj.push(i); }

      var shu      = shuffle( $.merge(obj, obj) ),
          cardSize = 100/Math.sqrt(shu.length);

// Generate and shuffle the cards
var cards = [];
terms.forEach(function(term) {
  cards.push({ content: term.term, type: 'term' });
  cards.push({ content: term.definition, type: 'definition' });
});
var shuffledCards = shuffle(cards.slice(0, 2*level));
console.log(shuffledCards);

// Generate the HTML for each card
//var cardSize = 100 / Math.sqrt(shuffledCards.length); // Adjust size based on number of cards
for (var i = 0; i < shuffledCards.length; i++) {
  var card = shuffledCards[i];
  $('<div class="card" style="width:' + cardSize + '%; height:' + cardSize + '%;">' +
      '<div class="flipper">' +
        '<div class="f"></div>' + // Front face of the card
        '<div class="b" data-type='+card.definition +' data-f=" ' + card.content + '"></div>' + // Back face of the card shows term or definition
      '</div>' +
    '</div>').appendTo('#g');
}

      // for(i = 0; i < shu.length; i++){
      //   var code = shu[i];
      //   if(code < 10) code = "0" + code;
      //   if(code == 30) code = 10;
      //   if(code == 31) code = 21;
      //   $('<div class="card" style="width:'+cardSize+'%;height:'+cardSize+'%;">'+
      //       '<div class="flipper"><div class="f"></div><div class="b" data-f="&#xf0'+code+';"></div></div>'+
      //     '</div>').appendTo('#g');
      // }

      $('#g .card').on('mousedown', function() {
        if ($('#g').attr('data-paused') == 1) { return; }  // Check if the game is paused
        $(this).toggleClass('active');  // Toggle the active state to show the card's content
    
        var activeCards = $('#g .card.active');
        if (activeCards.length === 2) {
            setTimeout(function() {
                var card1 = activeCards.eq(0).find('.b');
                var card2 = activeCards.eq(1).find('.b');
                var content1 = card1.attr('data-f').trim();
                var content2 = card2.attr('data-f').trim();
                console.log(content1);
                console.log(content2);
                // Find term object for the first card
                var termObject = terms.find(item => item.term === content1 || item.definition === content1);

                console.log("Term Object for Content1:", termObject);  // Diagnostic
                console.log("defintion:", termObject.definition);
                console.log("term:", termObject.term);
                console.log("Content2:", content2);  // Diagnostic
    
                // Check if content of second card matches the definition or term of the first card's term object
                var match = false;
                if (termObject) {
                    match = (termObject.term === content1 && termObject.definition === content2) ||
                            (termObject.definition === content1 && termObject.term === content2);
                    console.log("Match:", match);  // Diagnostic
                }
                if (match) {
                    activeCards.removeClass('active').toggleClass('active card found').empty();  // Mark as found
                    increase('flip_matched');
                    if( !$('#g .card').length ){
                                  var time = $.now() - startGame;
                                  if( get('flip_'+difficulty) == '-:-' || get('flip_'+difficulty) > time ){
                                    set('flip_'+difficulty, time);
                                  }
                
                                  startScreen('nice');
                                }
                } else {
                    activeCards.removeClass('active');  // Hide the cards again
                    increase('flip_wrong');
                }
            }, 1000);  // Allow a brief period for players to view the cards
        }
    });
    

      // $('#g .card').on({
      //   'mousedown' : function(){
      //     if($('#g').attr('data-paused') == 1) {return;}
      //     var data = $(this).addClass('active').find('.b').attr('data-f');

      //     if( $('#g').find('.card.active').length > 1){
      //       setTimeout(function(){
      //         var thisCard = $('#g .active .b[data-f='+data+']');

      //         if( thisCard.length > 1 ) {
      //           thisCard.parents('.card').toggleClass('active card found').empty();
      //           increase('flip_matched');


      //           if( !$('#g .card').length ){
      //             var time = $.now() - startGame;
      //             if( get('flip_'+difficulty) == '-:-' || get('flip_'+difficulty) > time ){
      //               set('flip_'+difficulty, time);
      //             }

      //             startScreen('nice');
      //           }
      //         }
      //         else {
      //           $('#g .card.active').removeClass('active');
      //           increase('flip_wrong');
      //         }
      //       }, 401);
      //     }
      //   }
      // });

      $('<i class="timer"></i>')
        .prependTo('#g')
        .css({
          'animation' : 'timer '+timer+'ms linear'
        })
        .one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
          startScreen('fail');
        });


      $(window).off().on('keyup', function(e){
        if(e.keyCode == 80){
          if( $('#g').attr('data-paused') == 1 ) {
            $('#g').attr('data-paused', '0');
            $('.timer').css('animation-play-state', 'running');
            $('.pause').remove();
          }
          else {
            $('#g').attr('data-paused', '1');
            $('.timer').css('animation-play-state', 'paused');
            $('<div class="pause"></div>').appendTo('body');
          }
        }

        if(e.keyCode == 27){
          startScreen('flip');
          if( $('#g').attr('data-paused') == 1 ){
            $('#g').attr('data-paused', '0');
            $('.pause').remove();
          }
          $(window).off();
        }
      });
    });
  });
  
});