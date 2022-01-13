import React from "react";

export function BurnTokenForm({ burnTokens }) {
  return (
    <div>
      <h4>Burn Tokens</h4>
      <form
        onSubmit={async (event) => {
          // This function just calls the mintNFT callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const time = formData.get("time");
          if (time) {
            const burning = await burnTokens(time);
            console.log("burning token button pressed");
          }
        }}
      >
        <div className="form-group">
          <label>Time Frame (seconds) (doesn't get used) </label>
          <input className="form-control" type="text" name="time" required />
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="burn 🔥🔥" />
        </div>
      </form>
    </div>
  );
}
