import React from "react";
import { LinkContainer } from "react-router-bootstrap";
function DoesNotExist() {
  return (
    <>
      <div>Whatever You were looking for doesnt seem to exist</div>
      <LinkContainer to="/">
        <button>GO TO HOMEPAGE</button>
      </LinkContainer>
    </>
  );
}

export default DoesNotExist;
