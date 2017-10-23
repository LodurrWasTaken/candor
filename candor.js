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

    // copy 0 & -1 imgs for infinite
    imgBox.insertAdjacentHTML('afterbegin', imgBox.children[imgBox.children.length - 1].outerHTML);
    imgBox.insertAdjacentHTML('beforeend', imgBox.children[1].outerHTML);

    // cache
    var slides = imgBox.children;
    var slidesLen = slides.length;
    var lastSlide = slidesLen - 1;

    // set img box & img width/height
    imgBox.style.width = ''+(100 * slidesLen)+'%';
    for (var i = 0; i < slidesLen; i++) {
        slides[i].style.width = ''+(100 / slidesLen)+'%';
        slides[i].style.height = '100%';
    }

    // cache
    var imgBoxWidth = imgBox.offsetWidth;
    var slideWidth = imgBoxWidth / slidesLen;

    // shift initial pos due to extra imgs
    imgBox.style.marginLeft = '-'+ slideWidth +'px';

    // create transition class & apply to img box
    var transition = ''+ slidingSpeed +' ease-in-out';
    var transitionClass = document.createElement('style');
    transitionClass.type = 'text/css';
    transitionClass.innerHTML = '.candor { transition: '+ transition +'; }';
    document.getElementsByTagName('head')[0].appendChild(transitionClass);
    imgBox.classList.add('candor');

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
            // before the last slide in DOM
            if (bullets) {
                bullets[0].classList.add('active');
            }
            setTimeout(function() {
                imgBox.classList.remove('candor');
                setTimeout(function() {
                    imgBox.style.marginLeft = '-'+ slideWidth +'px';
                    setTimeout(function() {
                        imgBox.classList.add('candor');
                    }, 100);
                }, Number.MIN_VALUE);
            },500);
            // reset count
            count = 1;
        } else if (bullets) {
            bullets[count - 1].classList.add('active');
        }
        // recursion
        startAutoplay();
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
            if (bullets) {
                bullets[bulletsLen - 1].classList.add('active');
            }
            setTimeout(function() {
                imgBox.classList.remove('candor');
                setTimeout(function() {
                    imgBox.style.marginLeft = '-'+(slideWidth * (slidesLen - 2))+'px';
                    setTimeout(function() {
                        imgBox.classList.add('candor');
                    }, 100);
                }, Number.MIN_VALUE);
            },500);
            // update count
            count = lastSlide - 1;
        } else if (bullets) {
            bullets[count - 1].classList.add('active');
        }
        // recursion
        startAutoplay();
    }

    function stopAutoplay() {
        clearTimeout(autoplay);
    }

    function startAutoplay() {
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
                stopAutoplay();
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
                startAutoplay();
            });
        }
    }

    // slider buttons
    if (btnPrev) {
        btnPrev[0].addEventListener('click', function() {
            stopAutoplay();
            slidePrev();
        });
    }
    if (btnNext) {
        btnNext[0].addEventListener('click', function() {
            stopAutoplay();
            slideNext();
        });
    }

    // swipe
    var x1, delta, returnPos;
    var initialPos = [];
    var slideTrigger = slideWidth / 2;

    // get all initial positions of slides
    for (var i = 0; i < slidesLen; i++) {
        var pos = -slideWidth * i;
        initialPos.push(pos);
    }

    // get initial touch position
    imgBox.addEventListener('touchstart', function(e) {
        x1 = e.changedTouches[0].clientX;
        stopAutoplay();
        imgBox.classList.remove('candor');
    });

    // move slides upon swiping
    imgBox.addEventListener('touchmove', function(e) {
        delta = e.changedTouches[0].clientX - x1;

        for (var i = 0; i < slidesLen; i++) {
            if (slides[i] === e.target) {
                returnPos = initialPos[i];
                var newPos = initialPos[i] + delta;
            }
        }
        
        imgBox.style.marginLeft = ''+ newPos +'px';        
    });

    // slide left/right or return to initial position
    imgBox.addEventListener('touchend', function() {
        if (Math.abs(delta) > slideTrigger) {
            if (delta < 0) {
                slideNext();
            } else {
                slidePrev();
            }
        } else {
            imgBox.style.marginLeft = ''+ returnPos +'px';
            startAutoplay();
        }
        imgBox.classList.add('candor');
    });
}