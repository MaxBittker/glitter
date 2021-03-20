let clmtrackr = require("clmtrackr");
let ctracker = new clmtrackr.tracker();
ctracker.init();

function setupWebcam(options) {
  const regl = options.regl;
  var video = null;
  var canvas = null;

  function startup() {
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    let startbutton = document.getElementById("start");

    var trackingStarted = false;

    function tryGetUserMedia() {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: false
        })
        .then(gumSuccess)
        .catch(e => {
          console.log("initial gum failed");
        });
      video.play();
      startbutton.hidden = true;
    }

    tryGetUserMedia();

    startbutton.onclick = function() {
      console.log("play!");
      tryGetUserMedia();
      // startVideo();
    };

    function gumSuccess(stream) {
      if ("srcObject" in video) {
        video.srcObject = stream;
      } else {
        video.src = window.URL && window.URL.createObjectURL(stream);
      }
      video.onloadedmetadata = function() {
        console.log("metadata loaded");
        const webcam = regl.texture(video);

        const { videoWidth, videoHeight } = video;

        var w = videoWidth;
        var h = videoHeight;
        video.height = h;
        video.width = w;
        // ctracker.init();
        // ctracker.start(video);
        // positionLoop();

        regl.frame(() => webcam.subimage(video));
        options.done(webcam, {
          videoWidth,
          videoHeight,
          ctracker
        });
      };
    }
    // function adjustVideoProportions() {
    //   // resize overlay and video if proportions of video are not 4:3
    //   // keep same height, just change width
    //   debugger
    //   var proportion = video.videoWidth/video.videoHeight;
    //   video_width = Math.round(video_height * proportion);
    //   video.width = video_width;
    // }
    video.onresize = function() {
      // adjustVideoProportions();
      // if (trackingStarted) {
      // ctracker.stop();
      // ctracker.reset();
      // ctracker.start(video);
      // }
    };
    video.addEventListener(
      "canplay",
      function(ev) {
        video.play();
      },
      false
    );
  }

  window.onload = startup;
}

module.exports = { setupWebcam };
