let videoStream , audioStream;
let video = document.querySelector('.video');

async function getMedia(){
    try {
        
        videoStream = await navigator.mediaDevices.getDisplayMedia({
            video : true,
        })

        audioStream = await navigator.mediaDevices.getUserMedia({
            audio:true,
        })
        playPauseStream();

    } catch (err) {
        console.log(err);
    }
}

let startBtn = document.querySelector('.start').addEventListener('click',getMedia);

async function playPauseStream(){
      if(videoStream){
        mediaRecording();
        video.srcObject = videoStream;
        
      }
      else{
        console.log('err in videoStream');
      }     
}

let chunks = [];
async function mediaRecording(){
  let mixedStream = new MediaStream([...videoStream.getTracks(),...audioStream.getTracks()]);
  let recorder = new MediaRecorder(mixedStream);
  recorder.ondataavailable = (e)=>{
    chunks.push(e.data);
  }
  recorder.start();
  recorder.onstop = (e) =>{
    video.src = URL.createObjectURL(
      new Blob(chunks ,{
        type : chunks[0].type,
    })
   )
  }
}