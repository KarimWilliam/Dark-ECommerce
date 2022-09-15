import React from "react";

const Message = ({ variant, children }) => {
  variant = " alert alert-" + variant;
  return (
    <div className={variant} role="alert" variant={variant}>
      {children}
    </div>
  );
};

Message.defaultProps = {
  variant: "info",
};

export default Message;
