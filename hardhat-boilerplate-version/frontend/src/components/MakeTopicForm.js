import React from "react";
import { useState } from "react";

export function MakeTopicForm({ makeTopic }) {
  const [promptpart, setPrompt] = useState("blank");
  return (
    <div>
      <h4>Create a topic</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the mintNFT callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const prompt = formData.get("prompt");
          console.log("prompt submitted on frontend as: ");
          console.log(prompt);
          if (prompt) {
            makeTopic(prompt);
            console.log("maketopic sent with above prompt");
          }
          setPrompt(prompt);
        }}
      >
        <div className="form-group">
          <label>Prompt </label>
          <input className="form-control" type="text" name="prompt" required />
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="set topic" />
        </div>
        <div className="form-group">
          <p>
            Most recent proposal: {promptpart}, (prompt from frontend)["yes",
            "no"], 5, 10,{" "}
          </p>
        </div>
      </form>
    </div>
  );
}
