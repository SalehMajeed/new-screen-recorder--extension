const video = document.querySelector(".video") as HTMLVideoElement;
let videoStream: MediaStream, audioStream: MediaStream;
const chunks: Blob[] = [];

async function getMedia(): Promise<void> {
  try {
    videoStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    if (!videoStream || !audioStream) {
      throw new Error(
        "There was a problem while sharing screen or accessing audio"
      );
    }
  } catch (err: any) {
    console.error(err);
  }
}

let startBtn = document
  .querySelector(".start")
  ?.addEventListener("click", getMedia);

async function playPauseStream(): Promise<void> {
  try {
    mediaRecording();
    video.srcObject = videoStream;
  } catch (err: any) {
    console.log(err);
  }
}

async function mediaRecording() {
  let mixedStream: MediaStream = new MediaStream([
    ...videoStream.getTracks(),
    ...audioStream.getTracks(),
  ]);
  let recorder = new MediaRecorder(mixedStream);
  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.start();
  recorder.onstop = (e) => {
    video.src = URL.createObjectURL(
      new Blob(chunks, {
        type: chunks[0].type,
      })
    );
  };
}
