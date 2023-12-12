import {useFetcher} from '@remix-run/react';
import React from 'react';

export function Index() {
  const {Form, ...fetcher} = useFetcher();
  const data = fetcher?.data;
  const formSubmitted = data?.form;
  const formError = data?.error;

  return (
    <div>
      <h3>Contact Us</h3>
      {formSubmitted ? (
        <div>
          <p>Thank you for your message. We will get back to you shortly.</p>
        </div>
      ) : (
        <ContactForm Form={Form} />
      )}
      {formError && (
        <div>
          <p>There was an error submitting your message. Please try again.</p>
          <p>{formError.message}</p>
        </div>
      )}
    </div>
  );
}

export default function ContactForm({Form}) {
  const yyyyMmDd = new Date().toISOString().split('T')[0];
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
          name="phoneno"
          id="phoneno"
          autoComplete="phoneno"
          placeholder="Enter your phone number"
        />
      </div>

      <label htmlFor="subject">Subject</label>
      <input type="subject" name="subject" required />

      <input type="text" hidden name="date" defaultValue={yyyyMmDd} />
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
