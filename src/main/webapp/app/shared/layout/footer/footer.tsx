import './footer.scss';

import React from 'react';

import { Col, Row } from 'reactstrap';

const Footer = () => (
  <div className="footer page-content">
    <Row className={'bg-secondary p-5'}>
      <Col md="12">
        <p>Rodapé</p>
      </Col>
    </Row>
  </div>
);

export default Footer;
