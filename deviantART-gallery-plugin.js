var deviations = [];

function deviantARTGalleryPlugin(username, id, ratio) {
    // Inject the gallery markup
    var gallery = document.getElementById('deviantART-gallery');
    gallery.innerHTML = '<div id="ss__wrapper"></div><div id="ss__controls"><div id="ss__prev"><div id="ss__prevChev"></div></div><div id="ss__next"><div id="ss__nextChev"></div></div><div id="ss__dots"></div></div></div>';

    

    (function queryYQL() {
        // thanks http://stackoverflow.com/a/7369516/1696757
        var url = 'http://backend.deviantart.com/rss.xml?q=gallery:' + username + '/' + id;

        window['callback'] = callback;
        var s = document.createElement('script');
        s.src = "http://query.yahooapis.com/v1/public/yql?q=" + escape('select * from xml where url="' + url + '"') + "&_maxage=86400&format=json&callback=callback";
        document.body.appendChild(s);
        
        function callback(feed) {
            var items = feed.query.results.rss.channel.item;

            for(var i = 0, l = items.length; i < l; i++) {
                var object = {};

                object.title = items[i].title[0];
                object.image = items[i].content.url;
                object.desc = items[i].description[0].content;

                deviations.push(object);
            }

            accordianView(deviations);

            // async function is complete, move on
            var images = '';

            for(var i = 0, l = deviations.length; i < l; i++) {
                images += '<img src="' + deviations[i].image + '" alt="' + deviations[i].title + '"class="slideshow_img"/>';
            }

            var wrapper = document.getElementById('ss__wrapper').innerHTML = images;
           
            simpleslider(ratio);


        }
    })();
}

/*
  SimpleSlider v1.2 by JaL Productions
  http://jalproductions.co.uk/
  https://github.com/jamesl1001/simpleslider
*/

//input is array of images - consisting of title, description, and image (src)
function accordianView(imgs) {
//var grid = document.createElement("ul");
var gallery = document.getElementById("grid-div");
 gallery.setAttribute("style", "max-height: 400px");
//gallery.appendChild(grid);
var figurePrev;
//grid.setAttribute("class", "grid cs-style-2");
    for(var i = 0; i < imgs.length; i++) {
        figure = document.createElement("figure");
        var img = document.createElement("img");
        img.setAttribute("style", "max-height: 300px; width: auto;");

        var input = document.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("name", "radio-set2");
        if(i == imgs.length-1) {
            input.setAttribute("id", "ia-selector-last");
        }
        else if (i == 0) {
            input.setAttribute("checked", "checked");

        }
        var caption = document.createElement("figcaption");
        var captionSpan = document.createElement("span");
        caption.appendChild(captionSpan);
        figure.appendChild(img);
        figure.appendChild(input);
        figure.appendChild(caption);
        if(figurePrev) figure.appendChild(figurePrev);
        figurePrev = figure;
        link = document.createElement("button");
        link.setAttribute("value", i);
        link.setAttribute("data-modal", "modal-1");
        caption.appendChild(link);

      
      /*  var li = document.createElement("li"),
            figure = document.createElement("figure"),
            img = document.createElement("img"),
            caption = document.createElement("figcaption"),
            title = document.createElement("h3"),
            description = document.createElement("span");
            link = document.createElement("button");
            link.setAttribute("value", i);*/
            captionSpan.setAttribute("class", "img-title");
           // var descriptionHolder = document.createElement();
        
        /*li.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(caption);
        caption.appendChild(title);
        caption.appendChild(description);
        caption.appendChild(link);
        img.setAttribute("src", imgs[i].image);*/
        img.setAttribute("src", imgs[i].image)
        captionSpan.innerHTML = imgs[i].title;
        //description.innerHTML = imgs[i].desc;
        link.innerHTML = "Take a Look";
        classie.add(link, 'md-trigger' );
        classie.add(link, "open-modal");
        //classie.add(caption, 'md-trigger' );
        //classie.add(caption, "open-modal");
        //link.setAttribute("href", "");
        //caption.setAttribute("data-modal", "modal-1");

        gallery.appendChild(figure);
    }

  /* document.getElementsByClassName("open-modal").onclick = function() {
        clearCurrent();
        console.log("ONCLICK i is" + i);
        goToFrame(parseInt(link.getAttribute("value")));
        addCurrent(ssCurrentFrame);
    };*/

    init();

}

function init() {

        
        var overlay = document.querySelector( '.md-overlay' );

        [].slice.call( document.querySelectorAll( '.md-trigger' ) ).forEach( function( el, i ) {

            var modal = document.querySelector( '#' + el.getAttribute( 'data-modal' ) ),
                close = modal.querySelector( '.md-close' );

            function removeModal( hasPerspective ) {
                classie.remove( modal, 'md-show' );

                if( hasPerspective ) {
                    classie.remove( document.documentElement, 'md-perspective' );
                }
            }

            function removeModalHandler() {
                removeModal( classie.has( el, 'md-setperspective' ) ); 
            }

            el.addEventListener( 'click', function( ev ) {
                classie.add( modal, 'md-show' );
                overlay.removeEventListener( 'click', removeModalHandler );
                overlay.addEventListener( 'click', removeModalHandler );

                //change current frame in slideshow:
                clearCurrent(); 
                var n = parseInt(el.getAttribute("value"));
                goToFrame(n);
                addCurrent(ssCurrentFrame);

                //change modal title:
                var modalTitle = document.getElementById("modal-title");
                var frames = document.getElementsByClassName("img-title");
                var frameTitle = frames[frames.length-n-1];
                modalTitle.innerHTML = frameTitle.innerHTML;
                var modalContent = document.getElementById("art-description");
                modalContent.innerHTML = deviations[n].desc;

                if( classie.has( el, 'md-setperspective' ) ) {
                    setTimeout( function() {
                        classie.add( document.documentElement, 'md-perspective' );
                    }, 25 );
                }
            });

            close.addEventListener( 'click', function( ev ) {
                ev.stopPropagation();
                removeModalHandler();

            });

        } );

    }

// Setup variables

        // Update current frame
    function goToFrame(n) {
        console.log("go to frame" + n);
        if(n >= ssFrames) {
            ssCurrentFrame = 0;
        } else if(n < 0) {
            ssCurrentFrame = ssFrames - 1;
        } else {
            ssCurrentFrame = n;
        }

     var modalContent = document.getElementById("art-description");
     modalContent.innerHTML = deviations[ssCurrentFrame].desc;
    }
    // Add current class to first frame
    function addCurrent(n) {
        ssImages[n].className += ' current';
        ssAllDots[n].className += ' current';
    }

    // Clear all current classes
    function clearCurrent() {
        for(var i = 0; i < ssFrames; i++) {
            ssImages[i].className = ssImages[i].className.replace(/ current/, '');
            ssAllDots[i].className = ssAllDots[i].className.replace(/ current/, '');
        }
    }
var ss, ssWrapper, ssControls, ssPrev, ssNext, ssDots, ssImages, ssFrames, ssRatio, ssDirectory, ssPrevix, ssCurrentFrame;
var ssDotsWidth, ssWidth, ssHeight;
function simpleslider(ssR, ssF, ssD, ssP) {
        ss              = document.getElementById('deviantART-gallery');
        ssWrapper       = document.getElementById('ss__wrapper');
        ssControls      = document.getElementById('ss__controls');
        ssPrev          = document.getElementById('ss__prev');
        ssNext          = document.getElementById('ss__next');
        ssDots          = document.getElementById('ss__dots');
        ssImages        = ssWrapper.getElementsByTagName('img');
        ssFrames        = ssF || ssImages.length;
        ssRatio         = ssR;
        ssDirectory     = ssD;
        ssPrefix        = ssP;
        ssCurrentFrame  = 0;
        ssDotsWidth     = ssFrames * 20;
        ssWidth         = 0;
        ssHeight        = 0;
    
    // Calculate aspect ratio
    var ssRatioSplit      = ssRatio.split(':');
    var ssRatioPercentage = ssRatioSplit[1] / ssRatioSplit[0] * 100;


    // Set dimensions
    ss.style.paddingBottom = ssWrapper.style.paddingBottom = ssRatioPercentage + '%';
    ssDots.style.width     = ssDotsWidth + 'px';

    // Get pixel dimensions
    function getSSDimensions() {
        ssWidth  = ssWrapper.offsetWidth;
        ssHeight = ssWrapper.offsetHeight;
    }

    getSSDimensions();

    // Generate navigation dots
    for(var i = 0; i < ssFrames; i++) {
        var ssDot = document.createElement('div');
        ssDot.className = 'ss__dot' + ' ss__frame' + [i];
        ssDots.appendChild(ssDot);
    }

    ssAllDots = ssDots.getElementsByTagName('div');

    // Create img elements if they don't already exist on the DOM
    if(ssImages.length == 0) {
        for(var i = 1; i <= ssFrames; i++) {
            var ssImg = new Image();
            ssImg.src = ssD + '/' + ssP + i + '.jpg'; // 'img/directory/prefix1.jpg'
            ssWrapper.innerHTML += ssImg.outerHTML;
        }
        ssImages = ssWrapper.getElementsByTagName('img');
    }

    for(var i = 0, l = ssImages.length; i < l; i++) {
        coverImages(ssImages[i]);
    }

    // Ensure each image fills the wrapper leaving no whitespace (background-size:cover)
    function coverImages(imgElem) {

        var img = new Image();
        img.src = imgElem.src;

        var wait = setInterval(function() {
            if(img.width != 0 && img.height != 0) {
                clearInterval(wait);

                // Stretch to fit
                if((img.width / img.height) < (ssWidth / ssHeight)) {
                    imgElem.className += ' full-width';
                } else {
                    imgElem.className += ' full-height';
                }

                calculateCentre();
            }
        }, 0);
    }

    function calculateCentre() {
        for(var i = 0, l = ssImages.length; i < l; i++) {
            if(ssImages[i].width >= ssWidth) {
                ssImages[i].style.left = (ssWidth - ssImages[i].width) / 2 + 'px';
            }

            if(ssImages[i].height >= ssHeight) {
                ssImages[i].style.top = (ssHeight - ssImages[i].height) / 2 + 'px';
            }
        }
    }


    // Always initialise first image as .current
    addCurrent(0);

    // Next and Previous click handlers
    if(window.addEventListener) {
        ssPrev.addEventListener('click', clickPrev);
        ssNext.addEventListener('click', clickNext);
    } else if(window.attachEvent) {
        ssPrev.attachEvent('onclick', clickPrev);
        ssNext.attachEvent('onclick', clickNext);
    }

    function clickPrev() {
        clearCurrent();
        goToFrame(ssCurrentFrame - 1);
        addCurrent(ssCurrentFrame);

    }

    function clickNext() {
        clearCurrent();
        goToFrame(ssCurrentFrame + 1);
        addCurrent(ssCurrentFrame);
    }

    // Navigation dots click handlers
    for(var i = 0; i < ssFrames; i++) {
        if(window.addEventListener) {
            ssAllDots[i].addEventListener('click', clickDots);
        } else if(window.attachEvent) {
            ssAllDots[i].attachEvent('onclick', clickDots);
        }
    }

    function clickDots(e) {
        if(e.target) {
            var dotClicked = e.target.className;
        } else if(e.srcElement) {
            var dotClicked = e.srcElement.className;
        }
        var n = dotClicked.match(/\d+/);
        clearCurrent();
        goToFrame(parseInt(n[0]));
        addCurrent(n[0]);
    }

    document.onkeydown = function(e) {
        evt = e || window.event;
        switch(evt.keyCode) {
            case 37:
                clickPrev();
                break;
            case 39:
                clickNext();
                break;
        }
    };

    // Recalculate image centres on window resize
    if(window.addEventListener) {
        window.addEventListener('resize', windowResize);
    } else if(window.attachEvent) {
        window.attachEvent('onresize', windowResize);
    }

    function windowResize() {
        getSSDimensions();
        calculateCentre();
    }

}