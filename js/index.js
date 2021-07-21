function VideoInputTest(changeCallBack, containerElement) {
  this.containerElement =
    containerElement || document.querySelector("#video-input-check");
  this.changeCallBack = changeCallBack || function () {};
  this.value = "";
  this.element = createElement({
    tagName: "video",
    attributes: {
      class: "test-video",
    },
  });
  this.initDropdown = async function () {
    const { listVideoInput } = await getListDevices();
    if (!listVideoInput.length) {
      listVideoInput.push({
        deviceId: "",
        label: "Default",
      });
    }
    if (listVideoInput.length === 1) {
      this.value = listVideoInput[0].deviceId;
    }
    const videoDeviceItems = listVideoInput.map((videoDevice) => {
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
        id: "video-device-select",
      },
      event: {
        type: "change",
        callback: async (e) => {
          // Change audio destination
          const value = e.target.value;
          this.value = value;
          // localStorage.setItem("videoInputID", this.value);
          await this.setStream();
          this.changeCallBack(this.value);
        },
      },
      children: videoDeviceItems,
    });
    this.containerElement.prepend(dropDownContainer);
  };
  this.setStream = async function () {
    if (this.MEDIA_STREAM) {
      this.MEDIA_STREAM.getTracks().forEach((track) => track.stop());
    }
    const videoConstant = {
      facingMode: "user",
      deviceId: {
        exact: this.value,
      },
    };
    if (!this.value) {
      delete videoConstant.deviceId;
    }
    this.MEDIA_STREAM = await navigator.mediaDevices
      .getUserMedia({
        video: videoConstant,
      })
      .catch((error) => {
        console.log("Load test video error:", error);
      });
    this.element.srcObject = this.MEDIA_STREAM;
    this.element.onloadedmetadata = (e) => {
      this.element.play();
    };
  };
  this.render = async function () {
    await this.setStream();
    await this.initDropdown();
    this.containerElement.appendChild(this.element);
  };
}

function AudioInputTest(changeCallBack, containerElement) {
  this.containerElement =
    containerElement || document.querySelector("#audio-input-check");
  this.changeCallBack = changeCallBack || function () {};
  this.PID_LENGTH = 10;
  this.value = "";
  this.AudioContext =
    window["AudioContext"] ||
    window["webkitAudioContext"] ||
    window["mozAudioContext"] ||
    window["msAudioContext"];
  this.setStream = async function () {
    if (this.MEDIA_STREAM) {
      this.MEDIA_STREAM.getTracks().forEach((track) => track.stop());
    }
    const audioConstant = {
      deviceId: {
        exact: this.value,
      },
    };
    if (!this.value) {
      delete audioConstant.deviceId;
    }
    this.MEDIA_STREAM = await navigator.mediaDevices
      .getUserMedia({
        audio: audioConstant,
      })
      .catch((err) => console.log("Err when get permission Audio", err));
    if (this.MEDIA_STREAM) {
      this.context = new this.AudioContext();
      var analyser = this.context.createAnalyser();
      var microphone = this.context.createMediaStreamSource(this.MEDIA_STREAM);
      var javascriptNode = this.context.createScriptProcessor(2048, 1, 1);
      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;
      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(this.context.destination);
      javascriptNode.onaudioprocess = () => {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var values = 0;
        var length = array.length;
        for (var i = 0; i < length; i++) {
          values += array[i];
        }
        var average = values / length;
        this.nextValue(Math.floor(average));
      };
    }
  };
  this.nextValue = function (e) {
    const rate = Math.floor(e / 10);
    if (rate) {
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
    }
  };
  this.initDropdown = async function () {
    const { listAudioInput } = await getListDevices();
    if (!listAudioInput.length) {
      listAudioInput.push({
        deviceId: "",
        label: "Default",
      });
    }
    if (listAudioInput.length === 1) {
      this.value = listAudioInput[0].deviceId;
    }
    if (listAudioInput.length === 1) {
      this.value = listAudioInput[0].deviceId;
    }
    const audioDeviceItems = listAudioInput.map((audioDevice) => {
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
      event: {
        type: "change",
        callback: async (e) => {
          // Change audio destination
          const value = e.target.value;
          this.value = value;
          // localStorage.setItem("audioInputID", this.value);
          await this.setStream();
          this.changeCallBack(this.value);
        },
      },
      children: audioDeviceItems,
    });
    document.querySelector("#audio-input-check").prepend(dropDownContainer);
  };
  this.render = async function () {
    let pids = [];
    for (let index = 0; index < this.PID_LENGTH; index++) {
      pids.push({
        tagName: "div",
        attributes: {
          class: "pid",
        },
      });
    }
    this.element = createElement({
      tagName: "div",
      attributes: {
        class: "pids",
      },
      children: pids,
    });
    await this.setStream();
    await this.initDropdown();
    this.containerElement.appendChild(this.element);
  };
}

function AudioOutputTest(changeCallBack, containerElement, audioSrc) {
  this.containerElement =
    containerElement || document.querySelector("#audio-output-check");
  this.changeCallBack = changeCallBack || function () {};
  this.audio = new Audio();
  this.audio.src = audioSrc || "/assets/output-test.mp3";
  this.audio.load();
  this.audio.onended = () => {
    this.element.removeAttribute("disabled");
  };
  this.value = "";
  this.setSink = function () {
    if (typeof this.audio.sinkId !== "undefined") {
      this.audio
        .setSinkId(this.value)
        .catch((error) =>
          console.error("Error when change Output audio:", error)
        );
    }
  };
  this.render = async function () {
    // // Set default value;
    // localStorage.getItem("audioOutPutID");
    // this.value = localStorage.getItem("audioOutPutID") || "";
    // this.setSink();
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
        deviceId: "",
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
          this.value = value;
          // localStorage.setItem("audioOutPutID", this.value);
          // setSinkId does not support android
          this.setSink();
          this.changeCallBack(this.value);
        },
      },
      children: audioOutputItems,
    });
    this.containerElement.append(dropDownContainer);
    this.containerElement.appendChild(this.element);
  };
}

// MAIN
window.addEventListener("DOMContentLoaded", async (event) => {
  /**
   * - Value of device is in the property "value"
   * - It will auto store the device ID to localStrorage when you change the device
   */

  /**
   * TODO:
   * - Implement call get deviceList only  1 time
   * - Allow to custom test sound [v]
   * - Make version for ReactJS
   * - Buid to use with NPM
   * - Buid to use with CDN
   */

  // Default Usage
  const audioInputTest = new AudioInputTest(); // Looking for #audio-input-check
  audioInputTest.render();
  const videoInputTest = new VideoInputTest(); // Looking for #video-input-check
  videoInputTest.render();
  const audioOutputTest = new AudioOutputTest(); // Looking for #audio-output-check
  audioOutputTest.render();

  /**
   * // ===== Custom container, callback and sound
   * const audioCustomContainer = document.querySelector("#audio-output-custom");
   * const customCallBack = function (val) {
   *    console.log(val);
   * };
   * const audioOutputTest = new AudioOutputTest(customCallBack,audioCustomContainer,"https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3");
   * audioOutputTest.render();
   */

  // Example: Get all value
  document
    .querySelector("button#demo-apply")
    .addEventListener("click", function () {
      console.log("Values:", {
        audioInput: audioInputTest.value,
        audioOutput: audioOutputTest.value,
        videoInput: videoInputTest.value,
      });
    });
});
