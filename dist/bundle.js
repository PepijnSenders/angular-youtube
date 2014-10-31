var ytApp = angular.module('ytApp', []);
ytApp.service('Youtube', function($window) {

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

  $window.onYouTubeIframeAPIReady = function() {
    $rootScope.$apply(function() {
      Youtube.YT = $window.YT;
    });
  };

  this.addVideo = function(element, videoId, width, height) {
    this.player = new this.YT.Player(element, {
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
        'onReady': this.onReady.bind(this),
        'onStateChange': this.onStateChange.bind(this)
      }
    });
  };

  this.onReady = function(e) {
    $rootScope.$apply(function() {
      Youtube.status = 'READY';
    });
  };

  this.onStateChange = function(e) {
    $rootScope.$apply(function() {
      var data = JSON.parse(event.data);
      Youtube.status = Youtube.playerStates[data.info];
    });
  };

  (function () {
    var tag = document.createElement('script');

    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }());

});