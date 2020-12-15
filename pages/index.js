import React, { useRef, useState, useEffect } from "react";
import Head from 'next/head'
import Webcam from "react-webcam";
import { Card, Container, Row, Col } from 'react-bootstrap';
import imageCompression from 'browser-image-compression';
import fire from '../config/firebase.config'

export default function Home() {
  const collectionName = "images"
  const imagesCollection = fire.firestore().collection(collectionName)
  const webcamRef = useRef(null)
  const [capturedImages, setCapturedImages] = useState([])
  const [imagesCount, setImagesCount] = useState(0)
  const maxWidth = 200

  const getImagesCount = () => {
    imagesCollection.get().then(snap => {
      setImagesCount(snap.length)
    });
  }

  const deleteAllIMages = () => {
    imagesCollection
      .orderBy("timestamp", "desc")
      .limit(100)
      .onSnapshot(snap => {
        snap.docs.forEach(doc => {
          imagesCollection.doc(doc.id).delete().then(() => {
            console.log("Document successfully deleted!");
          }).catch(error => {
            console.error("Error removing document: ", error);
          });
        })
      })
  }

  const getCaturedImages = () => {
    imagesCollection
      .orderBy("timestamp", "desc")
      .onSnapshot(snap => {
        const images = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCapturedImages(images);
      });
  }

  useEffect(() => {
    // getImagesCount()
    getCaturedImages()
    // deleteAllIMages()
  }, [])

  const onUserMedia = mediaStream => {
    wsOpen(mediaStream)
  }

  const uploadImage = async (image) => {
    // const imageId = new Date().getTime()
    // const imageName = imageId + '.png'
    // const fileRef = fire.storage().ref(collectionName + '/' + imageName)
    // await fileRef.put(image)

    // const imageUrl = await fileRef.getDownloadURL()
    const imageStored = await imagesCollection.add({
      image: image,
      timestamp: new Date().getTime()
    })
  }

  const processImage = async (mediaStream) => {
    const track = mediaStream.getVideoTracks()[0]
    const imageCapture = new ImageCapture(track)
    const blob = await imageCapture.takePhoto()
    const imageUrl = URL.createObjectURL(blob);
    // const compressionOptions = {
    //   maxWidthOrHeight: maxWidth,
    //   initialQuality: 0.5,
    // }
    // const image = await imageCompression(blob, compressionOptions)
    await uploadImage(imageUrl)
    return imageUrl
  }

  const wsOpen = (mediaStream) => {
    const WS_URL = `ws://localhost:${process.env.WS_PORT}`
    const FPS = 3
    const ws = new WebSocket(WS_URL)
    ws.onopen = () => {
      setInterval(() => {
        processImage(mediaStream).then(image => {
          ws.send(image)
        })
      }, 1000);
    }
  }

  const videoConstraints = {
    width: maxWidth,
    facingMode: "user"
  };

  return (
    <Container>
      <Head>
        <title>Webcam to Canvas</title>
      </Head>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title><h1>Webcam to Canvas</h1></Card.Title>
              <Row>
                <Col>
                  <Webcam ref={webcamRef} width={maxWidth} onUserMedia={onUserMedia} audio={false} videoConstraints={videoConstraints} />
                </Col>
              </Row>
              {capturedImages && (
                <Row>
                  <Col>
                    <ul>
                      {capturedImages.map((doc, index) => (<li key={index}><img src={doc.image} width={maxWidth}></img></li>))}
                    </ul>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
