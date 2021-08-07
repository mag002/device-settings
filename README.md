# Device settings component for Video Application
This is demo for device setting component with video, audio input, and audio output test
## Default Usage
* HTML:

```HTML
    <div id="video-input-check"></div>
    <div id="audio-input-check"></div>
    <div id="audio-output-check"></div>
    <button class="custom-form-control" id="demo-apply">Apply</button> // Custom button to get all values
```
* Javascript
  - File:
    - utils.js
    - devices.js
    - index.js
```javascript
  const audioInputTest = new AudioInputTest(); // Looking for #audio-input-check
  audioInputTest.render();
  const videoInputTest = new VideoInputTest(); // Looking for #video-input-check
  videoInputTest.render();
  const audioOutputTest = new AudioOutputTest(); // Looking for #audio-output-check
  audioOutputTest.render();
  
  // Example: Get all values
  document
    .querySelector("button#demo-apply")
    .addEventListener("click", function () {
      console.log("Values:", {
        audioInput: audioInputTest.value,
        audioOutput: audioOutputTest.value,
        videoInput: videoInputTest.value,
      });
    });
```
* Result *(With my style.css file)*

![Default Result](https://i.ibb.co/VvB7XYH/image.png)
 ## Custom Video Element
 * HTML
 ```html
 <video id="custom-video"></video>
 ```
 
 
 ```javascript
  const customVideoElement = document.querySelector("#custom-video")
  const videoInputCusom = new VideoInputTest(undefined, undefined, customVideoElement);
  videoInputCusom.render()
 ```
 
 ## Cutom Container and add Callback when change device
 
* JS

```javascript
  const audioCustomContainer = document.querySelector("#audio-output-custom");
  const customCallBack = function (val) {
     console.log(val);
  };
  const audioOutputTest = new AudioOutputTest(customCallBack,audioCustomContainer,"https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3");
  audioOutputTest.render();
```
 
## APIs:
* **VideoInputTest**(changeCallBack, containerElement, customVideoElement):

Property | Default value | Description
------------ | ------------- | -------------
containerElement |  ```<div id="video-input-check"></div>``` | Container for Testing Video and List Video Devices. (Can change by passing **containerElement** argument)
element | ```<video class="test-video"></video>``` | Testing Video Elent (Can change by passing **customVideoElement** argument)
changeCallBack |  null | Event Callback when you change the device  (Can change by passing **changeCallBack** argument)
value | '' | The selected Device ID

* **AudioInputTest**(changeCallBack, containerElement):

Property | Default value | Description
------------ | ------------- | -------------
containerElement |  ```<div id="video-input-check"></div>``` | Container for Testing Video and List Video Devices. (Can change by passing **containerElement** argument)
changeCallBack |  null | Event Callback when you change the device  (Can change by passing **changeCallBack** argument)
value | '' | The selected Device ID
PID_LENGTH | 10 | The number of the pid

* **AudioOutputTest**(changeCallBack, containerElement, audioSrc):

Property | Default value | Description
------------ | ------------- | -------------
containerElement |  ```<div id="video-input-check"></div>``` | Container for Testing Video and List Video Devices. (Can change by passing **containerElement** argument)
audio | HTMLAudioElement | Audio elment, playing the Audio file 
audio.src | /assets/output-test.mp3 | Audio sound (Can change Sound by passing **audioSrc** argument)
changeCallBack |  null | Event Callback when you change the device  (Can change by passing **changeCallBack** argument)
value | '' | The selected Device ID

 
