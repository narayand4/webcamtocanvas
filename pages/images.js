import React, { useRef, useState, useEffect } from "react";
import Head from 'next/head'
import { Card, Container, Row, Col } from 'react-bootstrap';

export default function Images() {
    const [capturedImages, setCapturedImages] = useState([])

    const getImages = () => {
        const WS_URL = `ws://localhost:${process.env.WS_PORT}`
        const ws = new WebSocket(WS_URL);
        ws.onopen = () => console.log(`Connected to ${WS_URL}`)
        ws.onmessage = message => {
            setCapturedImages([message.data, ...capturedImages])
        }
    }

    useEffect(() => {
        getImages()
    }, [])

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
                            {capturedImages && (
                                <Row>
                                    <Col>
                                        <ul>
                                            {capturedImages.map((image, index) => (<li key={index}><img src={image} width={200}></img></li>))}
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