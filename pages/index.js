import React, { useRef, useCallback, useState, useEffect } from "react";
import Head from 'next/head'
import firebase from 'firebase';
import Webcam from "react-webcam";
import '~styles/Home.module.css'

export default function Home() {
  const webcamRef = useRef(null)
  const webcamImageRef = useRef(null)
  const [firebaseInit, setFirebaseInit] = useState(null)
  const [firestoreDb, setFirestoreDb] = useState(null)

  useEffect(() => {
    const firebaseConfig = {
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      databaseURL: process.env.databaseURL,
      projectId: process.env.projectId,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId,
      appId: process.env.appId,
      measurementId: process.env.measurementId
    };

    if (firebaseInit === null) {
      firebase.initializeApp(firebaseConfig);
      setFirebaseInit(firebase)
    }
  }, [])

  const setupDB = () => {
    const db = firebase.firestore()
    if (firestoreDb === null) {
      db.settings({ timestampsInSnapshots: true })
    }
    setFirestoreDb(db)
    return db;
  }

  const getCaturedImages = () => {
    const db = setupDB()
    db.collection('images').get().then((snapshot) => {
      if (snapshot.docs) {
        snapshot.docs.forEach(doc => {
          console.log("data: ", doc.data())
        })
      }
    })
  }
  const saveCapturedImage = (imageSource) => {
    const db = setupDB()
    db.collection('images').add({
      image: imageSource
    }).then((snapshot) => {
      console.log("snapshot: ", snapshot)
      webcamImageRef.current.src = imageSource
    })
  }

  const capture = useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      saveCapturedImage(imageSrc)
    },
    [webcamRef]
  );

  return (
    <div className="container">
      <Head>
        <title>Webcam to Canvas</title>
      </Head>

      <main className="main">
        <h1 className="title">
          Webcam to Canvas
        </h1>
        <div className="grid">
          <div className="card">
            <div>
              <Webcam screenshotFormat="image/jpeg" ref={webcamRef} />
            </div>
            <div className="alignCenter">
              <button className="button" onClick={capture}>Capture photo</button>
            </div>
          </div>
          <div className="card">
            <img src={''} ref={webcamImageRef}></img>
          </div>
        </div>
      </main>

      <footer className="footer">
        &nbsp;
      </footer>
    </div>
  )
}
