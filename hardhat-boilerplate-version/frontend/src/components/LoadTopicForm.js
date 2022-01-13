import React from "react";
import { useState } from "react";

export function LoadTopicForm({ pullPrompt }) {
  const [contractPrompt, setContractPrompt] = useState("blank");
  return (
    <div>
      <h4>Pull the most recent topic from the contract</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the mintNFT callback with the
          // form's data.
          setContractPrompt(pullPrompt());
        }}
      >
        <div className="form-group">
          <label>Pull the topic</label>
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Pull" />
        </div>
        <div className="form-group">
          <p>
            Most recent proposal prompt from contract pullin: {contractPrompt}
          </p>
        </div>
      </form>
    </div>
  );
}
