import React from 'react';

function ContactUS({Form}) {

  console.log('Form', Form)
  
  return (
    <Form method="post" action="/api/contact-form">
      <div className="input-field">
        <label>
          <strong>Your Name</strong>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Enter your name"
        />
      </div>
      <div className="input-field">
        <label>
          <strong>Email Id</strong>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          autoComplete="email"
          placeholder="Enter your email address..."
        />
      </div>
      <div className="input-field">
        <label>
          <strong>Phone Number</strong>
        </label>
        <input
          type="text"
          name="phone"
          id="phone"
          autoComplete="phone"
          placeholder="Enter your phone number"
        />
      </div>
      <div className="input-field">
        <label>
          <strong>Message</strong>
        </label>
        <textarea
          name="message"
          id="message"
          autoComplete="message"
          placeholder="Your Message"
        ></textarea>
      </div>
      <button className="btn btn-full btn-lg" type="Submit">
        Submit
      </button>
    </Form>
  );
}

export default ContactUS;
