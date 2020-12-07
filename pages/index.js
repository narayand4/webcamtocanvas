import React, { useRef, useState, useEffect } from "react";
import Head from 'next/head'
import Webcam from "react-webcam";
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import imageCompression from 'browser-image-compression';
import fire from '../config/firebase.config'

export default function Home() {
  const imagesCollection = fire.firestore().collection('images')
  const webcamRef = useRef(null)
  const [capturedImages, setCapturedImages] = useState([])

  const getCaturedImages = () => {
    imagesCollection.orderBy("timestamp", "desc")
      .onSnapshot(snap => {
        const images = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCapturedImages(images);
      });
  }

  useEffect(() => {
    getCaturedImages()
  }, [])

  const onUserMedia = mediaStream => {
    wsOpen(mediaStream)
  }

  const wsOpen = (mediaStream) => {
    const WS_URL = `ws://localhost:${process.env.WS_PORT}`;
    const FPS = 3;
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      console.log(`Connected to ${WS_URL}`);
      setInterval(() => {
        const track = mediaStream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);
        imageCapture.takePhoto().then(function (blob) {
          imageCompression.getDataUrlFromFile(blob).then(image => {
            imagesCollection.add({
              image: image,
              timestamp: new Date().getTime()
            })
            ws.send(image);
          }).catch(function (error) {
            console.log('takePhoto() error: ', error);
          });
        })
      }, 1000 / FPS);
    }
  }

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
                  <Webcam ref={webcamRef} width={400} onUserMedia={onUserMedia} />
                </Col>
              </Row>
              {capturedImages && (
                <Row>
                  <Col>
                    <ul>
                      {capturedImages.map((doc, index) => (<li key={index}><img src={doc.image} width={200}></img></li>))}
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
