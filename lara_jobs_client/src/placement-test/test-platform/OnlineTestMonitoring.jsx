import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilesetResolver } from '@mediapipe/tasks-vision';
import { ObjectDetector } from '@mediapipe/tasks-vision';
import toast from 'react-hot-toast';

const OnlineTestMonitoring = ({ style, className, isCameraOn }) => {
  const [detector, setDetector] = useState(null);
  const [video, setVideo] = useState(null);
  const [toastId, setToastId] = useState(null);
  const [toastCount, setToastCount] = useState(0);
  const [phoneDetected, setPhoneDetected] = useState(false);
  const [detectedPersons, setDetectedPersons] = useState([]);
  const MAX_TOAST_COUNT = 10;
  const malpracticeCount = useRef(0); 
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        const objectDetector = await ObjectDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float32/latest/efficientdet_lite0.tflite',
            delegate: 'GPU',
          },
          scoreThreshold: 0.5,
        });
        setDetector(objectDetector);
      } catch (error) {
        console.error('Error loading MediaPipe model:', error);
      }
    };

    loadModel();
  }, []);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;

          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch((err) => console.error('Error playing video:', err));
          };
          setVideo(videoRef.current);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    if (isCameraOn) {
      startVideo();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  useEffect(() => {
    let intervalId;
    if (detector && videoRef.current) {
      intervalId = setInterval(async () => {
        const detections = await detector.detect(videoRef.current);
        if (!detections || !detections.detections) return;

        processDetections(detections.detections);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [detector]);

  const processDetections = (detections) => {
    let persons = [];
    let phoneDetectedFlag = false;

    detections.forEach((obj) => {
      if (!obj.boundingBox || !obj.categories || obj.categories.length === 0) return;

      const { score, categoryName } = obj.categories[0];

      if (categoryName.toLowerCase() === "person") {
        persons.push({ id: persons.length + 1, confidence: Math.round(score * 100) });
      }

      if (categoryName.toLowerCase().includes("cell phone")) {
        phoneDetectedFlag = true;
      }
    });

    setDetectedPersons(persons);
    setPhoneDetected(phoneDetectedFlag);

    // Displaying specific messages based on detected malpractice
    if (persons.length === 0) {
      showWarningToast("No person detected! Malpractice identified.");
    } else if (persons.length > 1) {
      showWarningToast("Multiple people detected! Malpractice identified.");
    } else if (phoneDetectedFlag) {
      showWarningToast("Phone detected! Malpractice identified.");
    } else {
      dismissWarningToast();
    }
  };

  const showWarningToast = (message) => {
    if (!toastId) {
      const id = toast.custom(
        (t) => (
          <div
            style={{
              backgroundColor: 'rgba(255, 87, 34, 0.9)',
              color: 'white',
              padding: '10px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '16px',
            }}
          >
            <span role="img" aria-label="warning" style={{ marginRight: '10px' }}>
              ⚠️
            </span>
            {message}
          </div>
        ),
        {
          duration: 3000, 
          position: 'top-right',
          style: {
            zIndex: 1000,
            fontSize: '16px',
          },
        }
      );
      setToastId(id);

      malpracticeCount.current += 1;
      setToastCount((prevCount) => prevCount + 1);

      // If we've seen 5 malpractices, terminate the test
      if (malpracticeCount.current >= MAX_TOAST_COUNT) {
        terminateTest();
      }

      setTimeout(() => {
        if (detectedPersons.length > 0 && !phoneDetected) {
          dismissWarningToast();
        }
      }, 3000);
    }
  };

  const dismissWarningToast = () => {
    if (toastId) {
      toast.dismiss(toastId);
      setToastId(null);
    }
  };

  const terminateTest = () => {
    toast.error('Test terminated due to repeated malpractice!');
    navigate('/malpractice-detected');
  };

  return (
    <div className={className}>
      <video ref={videoRef} id="video" width="240" height="240" style={{ ...style }} />
      <canvas ref={canvasRef} width="320" height="240" style={{ marginLeft: '20%' }} />
    </div>
  );
};

export default OnlineTestMonitoring;
