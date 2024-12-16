import React, { useEffect, useRef } from "react";

const LoginWithFace = () => {
  const videoRef = useRef<any>();
  const canvasRef = useRef<any>();
  useEffect(() => {
    startVideo();
    videoRef && callServer();
  }, []);
  //open web cam
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const callServer = () => {
    console.log("call server");
    console.log(videoRef.current);
  };
  return (
    <div>
      <h1>Face reco</h1>
      <div className="appvide">
        <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
      </div>
      <canvas ref={canvasRef} width={940} height={650} className="appcanvas" />
    </div>
  );
};

export default LoginWithFace;
