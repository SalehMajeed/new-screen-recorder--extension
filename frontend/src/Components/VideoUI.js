import React, { useState, useRef } from "react";
import styles from "./VideoUI.module.css";

const VideoUI = () => {
  const [videoStream, setVideoStream] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const videoRef = useRef(null);
  const chunksRef = useRef([]);
  const recorderRef = useRef(null);

  const getMedia = async () => {
    try {
      const video = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const audio = await navigator.mediaDevices.getUserMedia({ audio: true });

      setVideoStream(video);
      setAudioStream(audio);
      playPauseStream(video, audio);
    } catch (err) {
      console.log("Error getting media:", err);
    }
  };

  const playPauseStream = (videoStream, audioStream) => {
    if (videoStream && audioStream) {
      const mixedStream = new MediaStream([
        ...videoStream.getTracks(),
        ...audioStream.getTracks(),
      ]);

      if (videoRef.current) {
        videoRef.current.srcObject = mixedStream;
        videoRef.current.play();
      }

      mediaRecording(mixedStream);
    } else {
      console.log("Error: videoStream or audioStream is undefined.");
    }
  };

  const mediaRecording = (mixedStream) => {
    chunksRef.current = [];

    const recorder = new MediaRecorder(mixedStream);

    recorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      if (chunksRef.current.length > 0) {
        const videoBlob = new Blob(chunksRef.current, {
          type: `video/webm`,
        });
        const videoURL = URL.createObjectURL(videoBlob);
        setRecordedVideo(videoURL);
      } else {
        console.log("No data recorded.");
      }
    };

    recorder.start();
    recorderRef.current = recorder;
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
    } else {
      console.log("Recorder is not initialized.");
    }
  };

  return (
    <div className={styles.videoContainer}>
      <div className={styles.videoFrame}>
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          controls
        ></video>
      </div>
      <div className={styles.controls}>
        <button className={styles.startButton} onClick={getMedia}>
          Start
        </button>
        <button className={styles.endButton} onClick={stopRecording}>
          End
        </button>
      </div>
      <div className={styles.videoFrame}>
        {recordedVideo && (
          <video src={recordedVideo} className={styles.video} controls></video>
        )}
      </div>
    </div>
  );
};

export default VideoUI;
