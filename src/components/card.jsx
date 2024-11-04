import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import { useState } from 'react';

function NavPillsExample(props) {
  const [key, setKey] = useState(false);

  function handleSelect() {
    setKey(!key);
  }
  

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
      </Card.Body>
    </Card>
  );
}

export default NavPillsExample;