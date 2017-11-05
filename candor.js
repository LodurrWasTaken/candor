function candor(selector, params) {
    // check selector if exists
    if (selector.length == 0) return;
    // defaults
    var slideInterval = 3000;
    var slidingSpeed = '.5s';
    var btnPrev = false;
    var btnNext = false;
    var isAutoplay = true;
    var ms = 500;
    var isInfinite = true;

    // get user parameters
    if (typeof(params) === 'object') {
        for (var key in params) {
            switch (key) {
                case 'interval':
                    slideInterval = params[key];
                    continue;
                case 'animationSpeed':
                    slidingSpeed = params[key];
                    ms = parseMs(params[key])
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
                case 'infinite':
                    isInfinite = params[key];
                    // disable auto play if not infinite
                    if (!isInfinite) {
                        isAutoplay = false;
                    }
                    continue;
            }
        }
    }

    // to get ms for settimeout
    function parseMs(speed) {
        var msArr = speed.split('.');
        // check if element before dot exists & not 0
        if (msArr[0] !== '' && msArr[0] !== '0') {
            var firstEl = parseInt(msArr[0]);
        }

        var lastEl = msArr[msArr.length - 1];
        lastEl = lastEl.split('');
        lastEl.pop();
        var lastElLen = lastEl.length;
        lastEl = parseInt(lastEl.join(''));
        var coeff = [1,0,0,0];
        // count coefficient depending on number of chars after dot
        for (var i = 0; i < lastElLen; i++) {
            if (coeff.length > 0) {
                coeff.pop();
            }
        }

        coeff = Number(coeff.join(''));
        
        if (firstEl && coeff !== 0) {
            var val = firstEl * 1000 + lastEl * coeff;
        } else if (!firstEl && coeff !== 0) {
            var val = lastEl * coeff;
        } else {
            var val = ms;
        }

        return val;
    }
    
    // cache
    var slider = selector[0];
    if (isInfinite) {
        var count = 1;
    } else {
        var count = 0;
    }

    // copy 0 & -1 slides for infinite
    if (isInfinite) {
        slider.insertAdjacentHTML('afterbegin', slider.children[slider.children.length - 1].outerHTML);
        slider.insertAdjacentHTML('beforeend', slider.children[1].outerHTML);
    }

    // cache
    var slides = slider.children;
    var slidesLen = slides.length;
    var lastSlide = slidesLen - 1;
    var isDisabled = false;

    // set slider & slides width
    slider.style.width = ''+(100 * slidesLen)+'%';
    for (var i = 0; i < slidesLen; i++) {
        slides[i].style.width = ''+(100 / slidesLen)+'%';
    }

    // cache
    var sliderWidth = slider.offsetWidth;
    var slideWidth = sliderWidth / slidesLen;

    // shift initial pos due to extra slides
    if (isInfinite) {
        slider.style.marginLeft = '-'+ slideWidth +'px';
    }

    // create transition class & apply to slider
    var transition = ''+ slidingSpeed +' ease-out';
    var transitionClass = document.createElement('style');
    transitionClass.type = 'text/css';
    transitionClass.innerHTML = '.candor { transition: '+ transition +'; }';
    document.getElementsByTagName('head')[0].appendChild(transitionClass);
    slider.classList.add('candor');

    function slideNext() {
        if (isDisabled) return;
        
        if (isInfinite) {
            stopAutoplay();
            // update count
            count++;
            // move slides
            slider.style.marginLeft = '-'+(slideWidth * count)+'px';
            // reset bullets
            if (bullets) {
                for (var i = 0; i < bulletsLen; i++) {
                    bullets[i].classList.remove('active');
                }
            }
            if (count === lastSlide) {
                // before the last slide in DOM
                if (bullets) {
                    bullets[0].classList.add('active');
                }
                setTimeout(function() {
                    slider.classList.remove('candor');
                    setTimeout(function() {
                        slider.style.marginLeft = '-'+ slideWidth +'px';
                        setTimeout(function() {
                            slider.classList.add('candor');
                        }, 100);
                    }, Number.MIN_VALUE);
                },ms);
                // reset count
                count = 1;
            } else if (bullets) {
                bullets[count - 1].classList.add('active');
            }

            startAutoplay();
        } else {
            if (count !== lastSlide) {
                // update count
                count++;
                // move slides
                slider.style.marginLeft = '-'+(slideWidth * count)+'px';
                // reset bullets
                if (bullets) {
                    for (var i = 0; i < bulletsLen; i++) {
                        bullets[i].classList.remove('active');
                        bullets[count].classList.add('active');
                    }
                }
            } else {
               return;
            }
        }

        // avoid button mashing
        isDisabled = true;
        setTimeout(function() {
            isDisabled = false;
        }, ms + 100);
    }

    function slidePrev() {
        if (isDisabled) return;
        
        if (isInfinite) {
            stopAutoplay();
            // update count
            count--;
            // move slides
            slider.style.marginLeft = '-'+(slideWidth * count)+'px';
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
                    slider.classList.remove('candor');
                    setTimeout(function() {
                        slider.style.marginLeft = '-'+(slideWidth * (slidesLen - 2))+'px';
                        setTimeout(function() {
                            slider.classList.add('candor');
                        }, 100);
                    }, Number.MIN_VALUE);
                },ms);
                // update count
                count = lastSlide - 1;
            } else if (bullets) {
                bullets[count - 1].classList.add('active');
            }
            
            startAutoplay();
        } else {
            if (count !== 0) {
                // update count
                count--
                // move slides
                slider.style.marginLeft = '-'+(slideWidth * count)+'px';
                // reset bullets
                if (bullets) {
                    for (var i = 0; i < bulletsLen; i++) {
                        bullets[i].classList.remove('active');
                        bullets[count].classList.add('active');
                    }
                }
            } else {
               return;
            }
        }

        // avoid button mashing
        isDisabled = true;
        setTimeout(function() {
            isDisabled = false;
        }, ms + 100);
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
                var _this = this;
                stopAutoplay();
                // change bullet
                for (var j = 0; j < bulletsLen; j++) {
                    bullets[j].classList.remove('active');
                    _this.classList.add('active');

                    // update count
                    if (bullets[j] === _this) {
                        if (isInfinite) {
                            count = j + 1;
                        } else {
                            count = j;
                        }
                    }
                }
                // change slide
                slider.style.marginLeft = '-'+(slideWidth * count)+'px';
                
                startAutoplay();
            });
        }
    }

    // slider buttons
    if (btnPrev) {
        btnPrev[0].addEventListener('click', function() {
            slidePrev();
        });
    }
    if (btnNext) {
        btnNext[0].addEventListener('click', function() {
            slideNext();
        });
    }

    // swipe
    var x1, delta, returnPos;
    var initialPos = [];
    var slideTrigger = slideWidth / 6;

    // get all initial positions of slides
    for (var i = 0; i < slidesLen; i++) {
        var pos = -slideWidth * i;
        initialPos.push(pos);
    }

    // get initial touch position
    slider.addEventListener('touchstart', function(e) {
        x1 = e.changedTouches[0].clientX;
        stopAutoplay();
        // remove animation
        slider.classList.remove('candor');
    });

    // move slides upon swiping
    slider.addEventListener('touchmove', function(e) {
        delta = e.changedTouches[0].clientX - x1;
        // get coordinates
        for (var i = 0; i < slidesLen; i++) {
            if (slides[i] === e.target) {
                returnPos = initialPos[i];
                var newPos = initialPos[i] + delta;
            }
        }
        // move slides
        if (!isInfinite && count === lastSlide && delta < 0 || !isInfinite && count === 0 && delta > 0) {
            return false;
        } else {
            slider.style.marginLeft = ''+ newPos +'px';
        }
    });

    // slide left/right or return to initial position
    slider.addEventListener('touchend', function(e) {
        if (Math.abs(delta) > slideTrigger) {
            if (delta < 0) {
                slideNext();
            } else {
                slidePrev();
            }
        } else {
            slider.style.marginLeft = ''+ returnPos +'px';
            startAutoplay();
        }
        // add animation
        slider.classList.add('candor');
    });
}