       
     var gallery;
     var ratio = '16:9';
     var currentVideo = 0;
     var currentAlbum = '2990189';
     var galleryTag = "art";
     var galleryLoaded = false;
     var numVideos = []; //number of videos in each gallery
     numVideos.push(0);
     var currentGallery = 0; //loaded galleries
     var allVideos = [];
    
      function setCurrentAlbum(id, tag) {
        currentAlbum = id;
        galleryTag = tag;
        numVideos[0] = allVideos.length;
        console.log("videos.length is" + numVideos[0])
        if(gallery) {
       // currentGallery++;
    }
        getVideos();
     }

    $(document).ready(function(){
     gallery = document.getElementById('vimeoGallery');
    // gallery.innerHTML = '<div id="ss__wrapper"></div><div id="ss__controls"><div id="ss__prev"><div id="ss__prevChev"></div></div><div id="ss__next"><div id="ss__nextChev"></div></div><div id="ss__dots"></div></div></div>';

});
        var apiEndpoint = 'http://vimeo.com/api/v2/';
        var oEmbedEndpoint = 'http://vimeo.com/api/oembed.json'
        var oEmbedCallback = 'switchVideo';
        var videosCallback = 'setupGallery';
        var vimeoUsername = 'user7720451';  


function getVideos() {
 // Get the user's videos
 $(document).ready(function() {
    //$.getScript(apiEndpoint + vimeoUsername + '/videos.json?callback=' + videosCallback);
    $.getScript(apiEndpoint + "album/" + currentAlbum + '/videos.json?callback=' + videosCallback);
 });
}
getVideos();

   function getVideo(url) {
            $.getScript(oEmbedEndpoint + '?url=' + url + '&width=504&height=280&callback=' + oEmbedCallback);
        }

        function setupGallery(videos) {

            // Set the user's thumbnail and the page title
           // $('#stats').prepend('<img id="portrait" src="' + videos[0].user_portrait_medium + '" />');
            //$('#stats h2').text(videos[0].user_name + "'s Videos");

            // Load the first video
            getVideo(videos[0].url);
            for(var i = 0; i < videos.length; i++) {
            //allVideos = videos;
            allVideos.push(videos[i]);
        }
             gridview(allVideos, galleryTag);
            
           


            // Switch to the video when a thumbnail is clicked
            $('#thumbs a').click(function(event) {
                event.preventDefault();
                getVideo(this.href);

                return false;
            });

        }

        function switchVideo(video) {
            var embed = "embed";
           /* if(galleryTag === "code") {
                embed = "embed-code";
            }*/
            console.log("switch video to" + video.url);
            console.log("video html is"+video.html);
            $('#'+embed).html(decodeURI(video.html));
            var src = $('#'+embed+ ' iframe').attr("src");
            src = src.substring(2, src.length);
            src = "https://" + src;
            $('#' + embed + ' iframe').attr("src", src);
            var description = document.createElement("p");
            description.innerHTML = video.description;
            $('#' + embed).append(description);
        }

    function gridview(imgs, tag) {
        var radioset = "radio-set3";
        var modalid = "modal-2";
        console.log("imgs length is" + imgs.length);
    var gallery = document.getElementById("grid-div-vimeo");
    if(tag && tag === "code") {
        console.log("tag was code");
        gallery = document.getElementById("grid-div-code");
        radioset = "radio-set4"
       // modalid = "modal-3"
    }
    else {
        console.log("tag was not code");
    }
    gallery.setAttribute("style", "max-height: 400px");
    //gallery.appendChild(grid);
    var figurePrev;
    //grid.setAttribute("class", "grid cs-style-2");
    for(var i = numVideos[currentVideo]; i < imgs.length; i++) {
        figure = document.createElement("figure");
        var img = document.createElement("img");
        img.setAttribute("style", "max-height: 300px; width: auto;");
        var input = document.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("name", radioset);
        if(i == imgs.length-1) {
            input.setAttribute("id", "ia-selector-last");
            input.setAttribute("class", "ia-selector-last");
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
        link.setAttribute("data-modal", modalid);
        caption.appendChild(link);

            var titleTag = "img-title-vimeo";
          /*  if(galleryTag === "code") {
                titleTag = "img-title-code";
            }*/
            captionSpan.setAttribute("class", titleTag);
        
        /*li.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(caption);
        caption.appendChild(title);
        caption.appendChild(description);
        caption.appendChild(link);
        img.setAttribute("src", imgs[i].image);*/
        img.setAttribute("src", imgs[i].thumbnail_large);
        captionSpan.innerHTML = imgs[i].title;
     //   description.innerHTML = imgs[i].description;
        link.innerHTML = "Take a Look";
        classie.add(link, 'md-trigger' );
        classie.add(link, "open-modal");
        //classie.add(caption, 'md-trigger' );
        //classie.add(caption, "open-modal");
        //link.setAttribute("href", "");
        //caption.setAttribute("data-modal", "modal-1");

        gallery.appendChild(figure);
    }
    initVid(imgs);
}

function initVid(videos) {
    console.log("TAG IS" + galleryTag + "AND ITS IN INIT");
        
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

                var n = parseInt(el.getAttribute("value"));
                getVideo(videos[n].url);
                //switchVideo(videos[n]);

                var modaltitleid = "modal-title-2";
               /* if(galleryTag === "code") {
                    modaltitleid = "modal-title-3";
                }*/
                //change modal title:
                var modalTitle = document.getElementById(modaltitleid);
               // console.log("modalTitle is"+modalTitle);
                var titleTag = "img-title-vimeo";
               /* if(galleryTag === "code") {
                    titleTag = "img-title-code"
                }*/
                var frames =  document.getElementsByClassName(titleTag);
                //console.log("frames length" + frames.length + " n is" + n + " modal title is" + modaltitleid);
                var index = frames.length - n - 1;
                if(n < numVideos[0]) {
                    var lengthSecond = frames.length - numVideos[0];
                    index = (lengthSecond - n +1);
                    //index = n;
                }
                else {
        
                    index = frames.length - n + numVideos[0] -1;
                   /* var lengthSecond = frames.length - numVideos[0];
                    var secondIndex = n - numVideos[0];
                    index = numVideos[0] + (lengthSecond - secondIndex);*/
                }
                var frameTitle = frames[index];
                modalTitle.innerHTML = frameTitle.innerHTML;

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

        var artAlbumId = '2990189';
        var codeAlbumId = '2990185';
        var allAlbumId = '2990191';
        if(!galleryLoaded) {
         setCurrentAlbum(codeAlbumId, "code");
         galleryLoaded = true;
        }

    }







         // Update current frame
   /* function goToFrame(n) {
        console.log("go to frame" + n);
        if(n >= ssFrames) {
            ssCurrentFrame = 0;
        } else if(n < 0) {
            ssCurrentFrame = ssFrames - 1;
        } else {
            ssCurrentFrame = n;
        }
    }*/
    // Add current class to first frame
 /*   function addCurrent(n) {
        ssImages[n].className += ' current';
        ssAllDots[n].className += ' current';
    }

    // Clear all current classes
    function clearCurrent() {
        for(var i = 0; i < ssFrames; i++) {
            ssImages[i].className = ssImages[i].className.replace(/ current/, '');
            ssAllDots[i].className = ssAllDots[i].className.replace(/ current/, '');
        }
    }*/



