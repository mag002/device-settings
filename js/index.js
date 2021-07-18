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
function AudioOutputTest() {
  this.audio = new Audio();
  this.audio.src = "/assets/output-test.mp3";
  this.audio.load();
  this.audio.onended = () => {
    this.element.removeAttribute("disabled");
  };
  this.render = async function () {
    const stream = await navigator.mediaDevices // Asking Permission to get List  devices
      .getUserMedia({
        audio: true,
      })
      .catch((err) => console.log("Err when get permission Audio", err));
    if (stream) {
      // If allowed, Remove track after get permission;
      const tracks = stream.getTracks();
      tracks.forEach(function (track) {
        track.stop();
      });
    }
    this.element = createElement({
      tagName: "button",
      attributes: {
        class: "audio-output-test custom-form-control",
      },
      textContent: "Test speaker",
      event: {
        type: "click",
        callback: (e) => {
          this.element.setAttribute("disabled", true);
          this.audio.play();
        },
      },
    });
    const { listAudioOutput } = await getListDevices();
    if (!listAudioOutput.length) {
      listAudioOutput.push({
        deviceId: "default",
        label: "Default",
      });
    }
    const audioOutputItems = listAudioOutput.map((audioOutputDevice) => {
      const item = {
        tagName: "option",
        attributes: {
          value: audioOutputDevice.deviceId,
        },
        textContent: audioOutputDevice.label,
      };
      if (audioOutputDevice.deviceId === "default") {
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
      event: {
        type: "change",
        callback: (e) => {
          // Change audio destination
          const value = e.target.value;
          if (typeof this.audio.sinkId !== "undefined") {
            // setSinkId does not support android
            this.audio
              .setSinkId(value)
              .catch((error) =>
                console.error("Error when change Output audio:", error)
              );
          }
          // Store the value
          localStorage.setItem("audioOutPutID", value);
        },
      },
      children: audioOutputItems,
    });
    document.querySelector("#audio-output-check").append(dropDownContainer);
    document.querySelector("#audio-output-check").appendChild(this.element);
  };
}

// MAIN
window.addEventListener("DOMContentLoaded", async (event) => {
  // AUDIO INPUT
  initAudioInputTestHTML(); // INIT AUDIO TESTING PIDS
  await initAudioInputFunctional(); // ASK PERMISSION FOR AUDIO

  // VIDEO INPUT
  const videoElement = initVideoTestHTML(); // INIT TEST VIDEO
  initVideoTestFunctional(videoElement); // ASK PERMISSION FOR VIDEO STREAMING

  // LOAD LIST DEVICES
  const AVAILABLE_DEVICES = await getListDevices();

  // INIT LIST DEVICES FUNCTIONAL
  initAudioSelectHTML(AVAILABLE_DEVICES.listAudioInput);
  initVideoSelectHTML(AVAILABLE_DEVICES.listVideoInput);

  const audioOutputTest = new AudioOutputTest();
  audioOutputTest.render();
});
