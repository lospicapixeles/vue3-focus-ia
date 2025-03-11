<template>
    <div style="position: relative; width: 640px; height: 480px;">
      <video id="video" autoplay playsinline width="640" height="480" style="position: absolute; top: 0; left: 0;"></video>
      <canvas id="canvas" width="640" height="480" style="position: absolute; top: 0; left: 0;"></canvas>
    </div>
  </template>
  
  <script setup>
  import { FilesetResolver, PoseLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';
  import { onMounted } from 'vue';
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.getElementById('video');
      if (video) {
        video.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accediendo a la cámara:', error);
    }
  };
  
  onMounted(async () => {
    await startCamera();
  
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
  
    const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "/models/pose_landmarker_lite.task", // asegúrate de que esta ruta esté bien
      },
      runningMode: "VIDEO",
    });
  
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const drawingUtils = new DrawingUtils(ctx);
    const video = document.getElementById("video");
  
    let lastVideoTime = -1;
  
    function renderLoop() {
      if (video.currentTime !== lastVideoTime) {
        const result = poseLandmarker.detectForVideo(video, performance.now());
  
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        if (result && result.landmarks && result.landmarks.length > 0) {
          result.landmarks.forEach(landmarkSet => {
            drawingUtils.drawLandmarks(landmarkSet, {
              color: 'red',
              lineWidth: 2,
              radius: 4,
            });
            drawingUtils.drawConnectors(landmarkSet, PoseLandmarker.POSE_CONNECTIONS, {
              color: 'blue',
              lineWidth: 2,
            });
          });
        }
  
        lastVideoTime = video.currentTime;
      }
  
      requestAnimationFrame(renderLoop);
    }
  
    renderLoop();
  });
  </script>
  