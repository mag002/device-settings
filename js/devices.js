const getListDevices = async () => {
  listAudioInput = [];
  listVideoInput = [];
  listAudioOutput = [];
  const devices = await navigator.mediaDevices.enumerateDevices().catch((err) =>
  console.log("Err when get list devices", err));
  devices.forEach((device) => {
    if (device.deviceId !== "") {
      switch (device.kind) {
        case "audioinput":
          listAudioInput.push(device);
          break;
        case "videoinput":
          listVideoInput.push(device);
          break;
        case "audiooutput":
          listAudioOutput.push(device);
          break;
      }
    }
  });
  return {
    listAudioInput,
    listVideoInput,
    listAudioOutput,
  };
};
