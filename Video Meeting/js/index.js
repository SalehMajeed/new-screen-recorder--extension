const previewVideo = document.getElementsByClassName("preview")[0];
const outputVideo = document.getElementsByClassName("output")[0];
const startRecordingBtn = document.querySelector(".start");
const stopRecordingBtn = document.querySelector(".end");
const recordedChunks = [];
let mediaRecorder;

async function startRecording() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      throw new Error("getDisplayMedia is not supported in this browser");
    }

    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const urlObject = URL.createObjectURL(blob);
      outputVideo.src = urlObject;
    };

    previewVideo.srcObject = stream;
    mediaRecorder.start();
  } catch (error) {
    console.error(error);
    alert("Error: " + error.message);
  }
}

startRecordingBtn.addEventListener("click", startRecording);
stopRecordingBtn.addEventListener("click", () => mediaRecorder.stop());