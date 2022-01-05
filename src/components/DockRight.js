import Dock from "react-dock";
import React, {useState} from "react";
import {Button, Col, Container, Row} from "react-bootstrap";

const DockRight = () => {
    const [visible, setVisible] = useState(false)
    return (

        <>
            {!visible && <Button color={"primary"} style={{position: "absolute", zIndex: 50, top: "50%", right: 20}} onClick={() => setVisible(!visible)}> {"<"} </Button>}
            <Dock dimMode={"none"} position='right' isVisible={visible} defaultSize={0.2}>
                {/* you can pass a function as a child here */}
                <div style={styles.dockContent}>
                    <Container>

                        <Button onClick={() => setVisible(!visible)}>X</Button>

                        <Row style={{width: "100%"}}>
                            <Col>Rood</Col>
                            <Col>Tekenwerk</Col>
                        </Row>
                    </Container>
                </div>
            </Dock>
        </>
    );
}

export default DockRight

const styles = {
    root: {
        fontSize: '16px',
        color: '#999',
        height: '100vh'
    },
    main: {
        width: '100%',
        height: '150%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '30vh'
    },
    dockContent: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    remove: {
        position: 'absolute',
        zIndex: 1,
        right: '10px',
        top: '10px',
        cursor: 'pointer'
    }
}