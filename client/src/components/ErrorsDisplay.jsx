import React from "react";

export default function ErrorsDisplay({errors}) {
    return (
        <>
        <div>
            <h2 className="validation--errors--label">Validation Errors</h2>
            <div className="validation-errors">
                <ul>
                    {errors.map((error,index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            </div>
        </div>
        </>
    );
}