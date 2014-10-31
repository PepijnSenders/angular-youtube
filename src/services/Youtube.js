ytApp.service('Youtube', function($window, $timeout, $q) {

  var Youtube = this;

  this.playerStates = {
    '3': 'BUFFERING',
    '5': 'CUED',
    '0': 'ENDED',
    '2': 'PAUSED',
    '1': 'PLAYING',
    '-1': 'UNSTARTED',
    '-2': 'READY'
  };

  var apiDeferred = $q.defer(),
      apiPromise = apiDeferred.promise;

  $window.onYouTubeIframeAPIReady = function() {
    $timeout(function() {
      Youtube.YT = $window.YT;
      apiDeferred.resolve();
    });
  };

  this.addVideo = function(element, videoId, width, height) {
    apiPromise.then(function() {
      Youtube.player = new Youtube.YT.Player(element, {
        width: width,
        height: height,
        videoId: videoId,
        playerVars: {
          rel: 0,
          autohide: 1,
          modestbranding: 1,
          showinfo:0
        },
        events: {
          'onReady': Youtube.onReady.bind(Youtube),
          'onStateChange': Youtube.onStateChange.bind(Youtube)
        }
      });
    });
  };

  this.onReady = function(e) {
    $timeout(function() {
      Youtube.status = 'READY';
    });
  };

  this.onStateChange = function(e) {
    $timeout(function() {
      if (typeof e.data === 'string') {
        var data = JSON.parse(e.data);
        Youtube.status = Youtube.playerStates[data.info];
      } else {
        Youtube.status = Youtube.playerStates[e.data];
      }
    });
  };

  (function () {
    var tag = document.createElement('script');

    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }());

});