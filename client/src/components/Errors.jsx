import React from "react";

export default function Errors({ errors }) {
  return (
    <>
      <div>
        <div className="validation-errors">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
