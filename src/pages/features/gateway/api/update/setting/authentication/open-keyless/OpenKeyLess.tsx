import React from "react";
import { Col, Form } from "react-bootstrap";

export default function OpenKeyless() {
  return (
    <div>
      {
        <>
          <Col className="border bg-info bg-opacity-10 rounded mx-2 pb-3 h-60 d-inline-block">
            <Form.Group className="mt-3  ">
              Keyless access will disable all rating limiting, security checks
              and validations of requests as no session data is tracked along
              with requests. Analytics data will still be collected,however it
              will be not be as detailed as data that uses one of the keyed
              methods.
            </Form.Group>
          </Col>
        </>
      }
    </div>
  );
}
