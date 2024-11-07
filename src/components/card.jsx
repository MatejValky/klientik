import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import { useState } from 'react';
/* global chrome */

function NavPillsExample(props) {
  const [key, setKey] = useState(false);
  const [answer, setAnswer] = useState("");

  function handleSelect() {
    setKey(!key);
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "dataForPopup") {
        console.log("Data received in popup:", message.data);
        setAnswer(message.data);

    }
  });
  

  return (
    <Card className='Card'>
      <Card.Header>
        <Nav variant="pills" defaultActiveKey="#howToUse">
          <Nav.Item>
            <Nav.Link onClick={handleSelect} href="#answer">ANSWER</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link onClick={handleSelect} href="#howToUse">HOW TO USE</Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body className='cardText'>
        <Card.Title>{key ? "ANSWER":"HOW TO USE"}</Card.Title>
        <Card.Text>
          { props.gotAnswer ? props.gotAnswer : "You have not selected a snippet yet."}
        </Card.Text>
        <Card.Text>{answer}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default NavPillsExample;