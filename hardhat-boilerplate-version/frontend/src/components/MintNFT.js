import React from "react";

export function MintNFT({ mintNFT }) {
  return (
    <div>
      <h4>Mint NFT</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the mintNFT callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const to = formData.get("to");
          const tokenURI = formData.get("tokenURI");

          if (to && tokenURI) {
            mintNFT(to, tokenURI);
          }
        }}
      >
        <div className="form-group">
          <label>Token URI </label>
          <input className="form-control" type="text" name="tokenURI" required />
        </div>
        <div className="form-group">
          <label>Recipient address </label>
          <input className="form-control" type="text" name="to" required />
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Mint" />
        </div>
      </form>
    </div>
  );
}
