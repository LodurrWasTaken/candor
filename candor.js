function candor(selector, params) {
    // defaults
    var slideInterval = 3000;
    var slidingSpeed = '.5s';
    var btnPrev = false;
    var btnNext = false;
    var isAutoplay = true;

    // get user parameters
    if (typeof(params) === 'object') {
        for (var key in params) {
            switch (key) {
                case 'interval':
                    slideInterval = params[key];
                    continue;
                case 'animationSpeed':
                    slidingSpeed = params[key];
                    continue;
                case 'bullets':
                    var bullets = params[key][0].children;
                    var bulletsLen = bullets.length;
                    continue;
                case 'btnPrev':
                    btnPrev = params[key];
                    continue;
                case 'btnNext':
                    btnNext = params[key];
                    continue;
                case 'autoplay':
                    isAutoplay = params[key];
                    continue; 
            }
        }
    }
    // cache
    var imgBox = selector[0];
    var count = 1;

    // copy 0 & -1 imgs for infitine
    imgBox.insertAdjacentHTML('afterbegin', imgBox.children[imgBox.children.length - 1].outerHTML);
    imgBox.insertAdjacentHTML('beforeend', imgBox.children[0].outerHTML);

    // cache
    var slidesLen = imgBox.children.length;
    var lastSlide = slidesLen - 1;

    // set img box & img width/height
    imgBox.style.width = ''+(100 * slidesLen)+'%';
    for (var i = 0; i < slidesLen; i++) {
        imgBox.children[i].style.width = ''+(100 / slidesLen)+'%';
        imgBox.children[i].style.height = ''+100+'%';
    }

    // set transition to img box
    imgBox.style.transition = ''+slidingSpeed+' ease-in-out';

    // cache
    var imgBoxWidth = imgBox.offsetWidth;
    var slideWidth = imgBoxWidth / slidesLen;

    // shift initial pos due to extra imgs
    imgBox.style.marginLeft = '-'+slideWidth+'px';

    function slideNext() {
        // update count
        count++;
        // move slides
        imgBox.style.marginLeft = '-'+(slideWidth * count)+'px';
        // reset bullets
        if (bullets) {
            for (var i = 0; i < bulletsLen; i++) {
                bullets[i].classList.remove('active');
            }
        }
        // reset slider when last slide & activate bullet
        if (count === lastSlide) {
            imgBox.style.marginLeft = '-'+slideWidth+'px';
            count = 1;
            if (bullets) {
                bullets[0].classList.add('active');
            }
        } else if (bullets) {
            bullets[count - 1].classList.add('active');
        }
        // recursion
        if (isAutoplay) {
            autoplay = setTimeout(slideNext, slideInterval);
        }
    }

    function slidePrev() {
        // update count
        count--;
        // move slides
        imgBox.style.marginLeft = '-'+(slideWidth * count)+'px';
        // reset bullets
        if (bullets) {
            for (var i = 0; i < bulletsLen; i++) {
                bullets[i].classList.remove('active');
            }
        }
        // reset slider when last slide & activate bullet
        if (count === 0) {
            imgBox.style.marginLeft = '-'+(slideWidth * (slidesLen - 2))+'px';
            count = lastSlide - 1;
            if (bullets) {
                bullets[bulletsLen - 1].classList.add('active');
            }
        } else if (bullets) {
            bullets[count - 1].classList.add('active');
        }
        // recursion
        if (isAutoplay) {
            autoplay = setTimeout(slideNext, slideInterval);
        }
    }

    // init auto sliding
    if (isAutoplay) {
        var autoplay = setTimeout(slideNext, slideInterval);
    }

    // bullets clicking
    if (bullets) {
        for (var i = 0; i < bulletsLen; i++) {
            bullets[i].addEventListener('click', function() {
                clearTimeout(autoplay);
                // change bullet
                for (var j = 0; j < bulletsLen; j++) {
                    bullets[j].classList.remove('active');
                    this.classList.add('active');

                    // update count
                    if (bullets[j] === this) {
                        count = j + 1;
                    }
                }
                // change slide
                imgBox.style.marginLeft = '-'+(slideWidth * count)+'px';
                // recursion
                autoplay = setTimeout(slideNext, slideInterval);
            });
        }
    }

    // slider buttons
    if (btnPrev) {
        btnPrev[0].addEventListener('click', function() {
            clearTimeout(autoplay);
            slidePrev();
        });
    }
    if (btnNext) {
        btnNext[0].addEventListener('click', function() {
            clearTimeout(autoplay);
            slideNext();
        });
    }
}
/*
OPTIONS:
btnPrev: selector
btnNext: selector
bullets: selector
autoplay: boolean (default: true)
animationSpeed: string (default: '.5s')
interval: number (default: 3000)
*/
