import React, { useRef, useCallback, useState } from "react";
import Head from 'next/head'
import firebase from 'firebase';
import Webcam from "react-webcam";
import styles from '../styles/Home.module.css'

export default function Home() {
  const webcamRef = useRef(null);
  const webcamImageRef = useRef(null);

  const capture = useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      webcamImageRef.current.src = imageSrc
      console.log("imageSrc: ", imageSrc)
    },
    [webcamRef]
  );

  const firebaseConfig = {
    apiKey: "AIzaSyC3WFCfojNqL61AmsT3FHrm2aWCgzTYP8M",
    authDomain: "webcamtocanvas.firebaseapp.com",
    databaseURL: "https://webcamtocanvas.firebaseio.com",
    projectId: "webcamtocanvas",
    storageBucket: "webcamtocanvas.appspot.com",
    messagingSenderId: "452151666698",
    appId: "1:452151666698:web:5377b5a0d2b95cd5c457f3",
    measurementId: "G-LMKPQFETQJ"
  };
  const app = firebase.initializeApp(firebaseConfig);


  return (
    <div className={styles.container}>
      <Head>
        <title>Webcam to Canvas</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Webcam to Canvas
        </h1>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div>
              <Webcam screenshotFormat="image/jpeg" ref={webcamRef} />
            </div>
            <div className={styles.alignCenter}>
              <button className={styles.button} onClick={capture}>Capture photo</button>
            </div>
          </div>
          <div className={styles.card}>
            <img src={''} ref={webcamImageRef}></img>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        &nbsp;
      </footer>
    </div>
  )
}
