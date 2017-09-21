
/** 
* Create a list to store the cards that will be used in the game. 
*The list we use is an array of text that will be used in pairs. The reason we use pairs is so that we can pair the elements to create a match. 
*/

/**  Below we will create global variables. 
*/
var symbols = ['bus', 'bus', 'bell', 'bell', 'bug', 'bug', 'child', 'child', 'flag', 'flag', 'magnet', 'magnet', 'heart', 'heart', 'rocket', 'rocket'],	
		opened = [],
		match = 0,
		moves = 0,
		$deck = jQuery('.deck'),
		$scorePanel = $('#score-panel'),
		$moveNum = $('.moves'),
		$ratingThumbs = $('i'),
		$restart = $('.restart'),
		delay = 800,
		gameCardsQTY = symbols.length / 2,
		rank3thumbs = gameCardsQTY + 2,
		rank2thumbs = gameCardsQTY + 6,
		rank1thumbs = gameCardsQTY + 10;

/**
* @description Card shuffle Here the cards are shuffled according to this setup and code http://stackoverflow.com/a/2450976
* @param [array]  - Array is parsed
* @returns [array] Array values are shuffled 
*/
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
}


/**
* @description Game setup: Cards are placed inside the grid.
* @param {array}  - Shuffled values are parsed into grid
* @returns {array} - Cards are generated on the grid blank side up
*/
function startGame() {
  var cards = shuffle(symbols);
  $deck.empty();
  match = 0;
  moves = 0;
  $moveNum.text('0');
  $ratingThumbs.removeClass('fa-thumbs-up-o').addClass('spinner');
	for (var i = 0; i < cards.length; i++) {
		$deck.append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))
	}
	addCardListener();
};


/**
* @description Game thumb rating and score: you will see your thumb rating and score
* @param {array}  - Full thumbs are calculated
* @returns {array} - Three thumbs are displayed and the score is 0
*/
function setRating(moves) {
	var rating = 3;
	if (moves > rank3thumbs && moves < rank2thumbs) {
		$ratingThumbs.eq(2).removeClass('fa-thumbs-up').addClass('fa-thumbs-up-o');
		rating = 2;
	} else if (moves > rank2thumbs && moves < rank1thumbs) {
		$ratingThumbs.eq(1).removeClass('fa-thumbs-up').addClass('fa-thumbs-up-o');
		rating = 1;
	} else if (moves > rank1thumbs) {
		$ratingThumbs.eq(0).removeClass('fa-thumbs-up').addClass('fa-thumbs-up-o');
		rating = 0;
	}	
	return { score: rating };
};

/**
* @description Game Completion: Moves are displayed and score
* @param {string}  - Moves are read in and score from setRatings()
* @returns {string}  - Text is called from the object then a popup displays a screen with an option to cancel or confirm
*/
function endGame(moves, score) {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Congratulations! You Won!',
		text: 'With ' + moves + ' Moves and ' + score + ' Thumbs.\n Great man!',
		type: 'great',
		confirmButtonColor: '#02ccba',
		confirmButtonText: 'Need another brain-try!'
	}).then(function(isConfirm) {
		if (isConfirm) {
			startGame();
		}
	})
}

/**
* @description Refresh your game: Press refresh to start all over and resest deck to orginal state
* @param {.click}  - User clicks restart to reshuffle grid
* @returns {startgame()} - User gets notified in popup to accept refresh or not
*/
$restart.bind('click', function() {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'But why?',
    text: "All your achievement lost with one click!",
    showCancelButton: true,
    confirmButtonColor: '#0e2c98',
    cancelButtonColor: '#1f2323',
    confirmButtonText: 'Yes, let me hav\'em!'
  }).then(function(isConfirm) {
    if (isConfirm) {
      startGame();
    }
  })
});


/**
* @description Listen to the screen: Here all events that is activated by a click is logged as user events
* @param {addCardListener}  - Grid waits for clicks. Any click is logged and compared to what was clicked
* @returns {startgame()} - User clicks are compared in pairs to check if a card match. If card match then cards stay open. If it does not match cards return to previous sate and game continues.
*/
var addCardListener = function() {


/**
* @description Flipping the card: Cards turns around
* @param {click}  - User clicks in grid
* @returns {open show} - Card is turned around and kept open.
*/
$deck.find('.card:not(".match, .open")').bind('click' , function() {
	if($('.show').length > 1) { return true; }
	
	var $this = $(this),
			card = $this.context.innerHTML;
  $this.addClass('open show');
	opened.push(card);

    /**
	* @description Open card: Comparison
	* @param {.open}  - Second click occurs
	* @returns {open show} - If the card has same value as in the index then card stays open. If the value is not the same as in index card closes
	*/
  if (opened.length > 1) {
    if (card === opened[0]) {
      $deck.find('.open').addClass('match');
      setTimeout(function() {
        $deck.find('.match').removeClass('open show ');
      }, delay);
      match++;
    } else {
      $deck.find('.open').addClass('notmatch');
			setTimeout(function() {
				$deck.find('.open');
			}, delay / 0.5);
      setTimeout(function() {
        $deck.find('.open').removeClass('open show notmatch');
      }, delay);
    }
    opened = [];
       moves++;
	   setRating(moves);
       $moveNum.html(moves);
  }
	/**
	* @description Game ending: It all ends the game
	* @param {score}  - Game score and thumbs are calculated and checked.
	* @returns {moves, score} - Game scores are displayed and status of thumbs if moves were not over the 19 count threshold is displayed
	*/
	if (gameCardsQTY === match) {
		setRating(moves);
		var score = setRating(moves).score;
		setTimeout(function() {
			endGame(moves, score);
		}, 200);
  }
});
};

startGame();