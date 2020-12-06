import React, { useRef, useCallback, useState, useEffect } from "react";
import Head from 'next/head'
import Webcam from "react-webcam";
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import fire from '../config/firebase.config'

export default function Home() {
  const webcamRef = useRef(null)
  const [capturedImages, setCapturedImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getCaturedImages = () => {
    fire.firestore()
      .collection('images')
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

  const capture = useCallback(
    () => {
      setIsLoading(true)
      const imageSrc = webcamRef.current.getScreenshot();
      fire.firestore().collection('images').add({
        image: imageSrc
      }).then((snapshot) => {
        setIsLoading(false)
      })
    },
    [webcamRef]
  );

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
                  <Webcam screenshotFormat="image/jpeg" ref={webcamRef} width={400} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button onClick={capture}>{isLoading ? 'Saving....' : 'Capture photo'}</Button>
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
