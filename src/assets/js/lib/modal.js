(function(global) {
	global.Modal = {
		init:init,
		open: openModal,
		close: closeModal
	};

	function openModal(id) {
		global.observer.emit('modal.open', {id: id});
	}
	function closeModal(id) {
		global.observer.emit('modal.close', {id: id});
	}
	global.observer.on('modal.open', function (opt) {
		Modal.$activeModal = $( '#' + opt.id );
		Modal.$activeModal.addClass('md-show' );
	});

	global.observer.on('modal.close', function (opt) {
		if (opt && opt.id) {
			$( '#' + opt.id ).removeClass('md-show');
		} else {
			Modal.$activeModal.removeClass('md-show');
		}
	});

	var $overlay = $('.md-overlay');
	if ($overlay.length===0){
		$overlay = $('<div class="md-overlay">');
		$('body').append($overlay);
	}
	$overlay.on('mousedown touchstart', function () {
		global.observer.emit('modal.close');
	});

	$(document).on('mousedown touchstart', '.md-close', function(eve) {
		eve.stopPropagation();
		global.observer.emit('modal.close');
	});

	function init() {
		$('.md-trigger').each( function( el, i ) {
			var id = el.getAttribute( 'data-modal' );
			$(el).on('mousedown touchstart', function(eve) {
				eve.stopPropagation();
				global.observer.emit('modal.open', {id:id});
			});
		});
	}
})(window);