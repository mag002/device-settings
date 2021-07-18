const PID_LENGTH = 10;
const AudioContext =
  window["AudioContext"] ||
  window["webkitAudioContext"] ||
  window["mozAudioContext"] ||
  window["msAudioContext"];

const initAudioInputTestHTML = () => {
  let pids = [];
  for (let index = 0; index < PID_LENGTH; index++) {
    pids.push({
      tagName: "div",
      attributes: {
        class: "pid",
      },
    });
  }
  document.querySelector("#audio-input-check").appendChild(
    createElement({
      tagName: "div",
      attributes: {
        class: "pids",
      },
      children: pids,
    })
  );
};
const initAudioInputFunctional = async () => {
  const stream = await navigator.mediaDevices
    .getUserMedia({
      audio: true,
    })
    .catch((err) => console.log("Err when get permission Audio", err));
  if (stream) {
    context = new AudioContext();
    var analyser = context.createAnalyser();
    var microphone = context.createMediaStreamSource(stream);
    var javascriptNode = context.createScriptProcessor(2048, 1, 1);
    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;
    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(context.destination);
    javascriptNode.onaudioprocess = () => {
      var array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      var values = 0;
      var length = array.length;
      for (var i = 0; i < length; i++) {
        values += array[i];
      }
      var average = values / length;
      nextValue(Math.floor(average));
    };
  }
};
const nextValue = (e) => {
  // Interact with PID UI
  const rate = Math.floor(e / 10);
  const pids = document.querySelectorAll(".pid");
  if (pids) {
    Array.from(pids).forEach((element, index) => {
      if (index <= rate) {
        element.classList.add("rate");
      } else {
        element.classList.remove("rate");
      }
    });
  }
};
const initAudioSelectHTML = (listAudioDevice) => {
  const audioDeviceItems = listAudioDevice.map((audioDevice) => {
    const item = {
      tagName: "option",
      attributes: {
        value: audioDevice.deviceId,
      },
      textContent: audioDevice.label,
    };
    if (audioDevice.deviceId === "default") {
      item.attributes.selected = true;
    }
    return item;
  });
  const dropDownContainer = createElement({
    tagName: "select",
    attributes: {
      class: "device-select",
      id: "audio-device-select",
    },
    children: audioDeviceItems,
  });
  document.querySelector("#audio-input-check").prepend(dropDownContainer);
};

const initVideoTestFunctional = async (videoElement) => {
  if (this.MEDIA_STREAM) {
    this.MEDIA_STREAM.getTracks().forEach((track) => track.stop());
  }
  this.MEDIA_STREAM = await navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: "user",
        // deviceId: {
        //   exact: this.selected_devices.video.deviceId,
        // },
      },
    })
    .catch((error) => {
      console.log("Load test video error:", error);
    });
  videoElement.srcObject = this.MEDIA_STREAM;
  videoElement.onloadedmetadata = (e) => {
    videoElement.play();
  };
};
const initVideoTestHTML = () => {
  const videoElement = createElement({
    tagName: "video",
    attributes: {
      class: "test-video",
    },
  });
  document.querySelector("#video-input-check").appendChild(videoElement);
  return videoElement;
};
const initVideoSelectHTML = (listVideoDevice) => {
  const videoDeviceItems = listVideoDevice.map((videoDevice) => {
    const item = {
      tagName: "option",
      attributes: {
        value: videoDevice.deviceId,
      },
      textContent: videoDevice.label,
    };
    if (videoDevice.deviceId === "default") {
      item.attributes.selected = true;
    }
    return item;
  });
  const dropDownContainer = createElement({
    tagName: "select",
    attributes: {
      class: "device-select",
      id: "audio-device-select",
    },
    children: videoDeviceItems,
  });
  document.querySelector("#video-input-check").prepend(dropDownContainer);
};
