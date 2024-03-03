jQuery(document).ready(($) => {
	const sliderNavs =
		'<button type="button" class="slider-nav slider-prev" title="Previous">&lt;</i></button><button type="button" class="slider-nav slider-next" title="Next">&gt;</i></button>';

	let isDragging = false;
	let draggingID = null;
	let startPosition = null;
	let diffX = 0;

	// initialize each .kms-slider
	$('.kms-slider').each(function (i) {
		$(this).attr('data-id', i);
		$(this).append(sliderNavs);
	});
	$('.kms-slider:has(.slide:gt(0))').addClass('has-slides');
	$('.kms-slider .slider').each(function () {
		$(this).find('.slide:first').addClass('active');
	});

	const getContainer = (containerID) => `.kms-slider[data-id=${containerID}]`;

	// navigation
	const toPreviousSlide = (containerID, index) => {
		const container = getContainer(containerID);
		const currentSlide = $(`${container} .slide.active`);
		const prevSlide = currentSlide.prev('.slide');

		currentSlide.removeClass('active');

		console.log(prevSlide);

		if (prevSlide.length === 0) {
			$(`${container} .slide:last-of-type`).addClass('active');
		} else {
			prevSlide.addClass('active');
		}

		updateSliderHeight(containerID);
	};

	const toNextSlide = (containerID, index) => {
		const container = getContainer(containerID);
		const currentSlide = $(`${container} .slide.active`);
		const nextSlide = currentSlide.next('.slide');

		currentSlide.removeClass('active');

		if (nextSlide.length === 0) {
			$(`${container} .slide:first-of-type`).addClass('active');
		} else {
			nextSlide.addClass('active');
		}

		updateSliderHeight(containerID);
	};

	function getPositionX(e) {
		return e.type.includes('mouse')
			? e.pageX
			: e.originalEvent.touches[0].pageX;
	}

	// viewport functionality
	const isSliderInViewport = (slider) => {
		const rect = slider.getBoundingClientRect();

		return (
			rect.top >= 0 &&
			rect.bottom <=
				(window.innerHeight || document.documentElement.clientHeight)
		);
	};

	const getAllSlidersInViewport = () => {
		return $('.kms-slider').filter(function () {
			return isSliderInViewport(this);
		});
	};

	// update slider heights
	const updateSliderHeight = (containerID) => {
		const container = getContainer(containerID);
		const activeSlide = $(`${container} .slide.active`);
		const slideWrapper = $(`${container} .slider`);

		if ($(container).length && activeSlide.length) {
			const borderPx = 1;
			const activeHeight = activeSlide.outerHeight(true) + borderPx;
			$(container).height(activeHeight);
		}
	};

	const updateAllSliderHeights = () => {
		$('.kms-slider').each(function () {
			const containerID = $(this).attr('data-id');
			updateSliderHeight(containerID);
		});
	};

	updateAllSliderHeights();
	$(window).resize(updateAllSliderHeights);

	// click handlers
	$('.kms-slider').on('click', '.slider-nav', function () {
		const containerID = $(this).closest('.kms-slider').attr('data-id');
		const container = getContainer(containerID);
		const index = $(`${container} .slide.active`).index();

		$(this).hasClass('slider-prev')
			? toPreviousSlide(containerID, index)
			: toNextSlide(containerID, index);
	});

	// keystroke handlers
	$(document).keydown((e) => {
		// use arrow keys to navigate sliders in viewport
		// 37: left || 39: right
		if (e.which === 37 || e.which === 39) {
			const visibleSliders = getAllSlidersInViewport();
			const action = e.which === 37 ? 'previous' : 'next';

			visibleSliders.each(function () {
				const slider = $(this);
				const containerID = slider.data('id');
				const container = getContainer(containerID);

				const activeSlide = $(`${container} .slide.active`);
				const index = activeSlide.index();

				if (action === 'previous') {
					toPreviousSlide(containerID, index);
				} else {
					toNextSlide(containerID, index);
				}
			});
		}
	});

	// mouse/touch handlers
	$('.kms-slider').on('mousedown touchstart', '.slider', function (e) {
		draggingID = $(this).closest('.kms-slider').data('id');
		isDragging = true;
		startPosition = getPositionX(e);
	});

	$('.kms-slider').on('mousemove touchmove', '.slide', (e) => {
		e.preventDefault();
		if (!isDragging) return;
		const currentPosition = getPositionX(e);
		diffX = currentPosition - startPosition;
	});

	$(window).on('mouseup touchend', () => {
		const tolerance = 100;
		if (isDragging && Math.abs(diffX) > tolerance) {
			const containerID = draggingID;
			const container = getContainer(containerID);
			const index = $(`${container} .slide.active`).index();

			if (diffX < 0) {
				toPreviousSlide(containerID, index);
			} else {
				toNextSlide(containerID, index);
			}
		}

		isDragging = false;
		draggingID = null;
		startPosition = null;
		diffX = 0;
	});
});
