import MailchimpSubscribe from 'react-mailchimp-subscribe';

const url =
  'https://dev.us21.list-manage.com/subscribe/post?u=945f970b3cd9b345dcb4b1a4b&amp;id=c57f035bdf';

const SimpleForm = () => <MailchimpSubscribe url={url} />;

const Waiting = () => (
  <MailchimpSubscribe
    url={url}
    render={({subscribe, status, message}) => (
      <div>
        <h6 className="stft-cl-title text-up ">Newsletter</h6>
        <SimpleForm onSubmitted={(formData) => subscribe(formData)} />
        {status === 'sending' && (
          <span className="statusMsg" style={{color: 'blue'}}>
            sending...
          </span>
        )}
        {status === 'error' && (
          <span
            className="statusMsg"
            style={{color: 'red'}}
            dangerouslySetInnerHTML={{__html: message}}
          />
        )}
        {status === 'success' && (
          <span
            className="statusMsg"
            style={{color: 'green', marginTop: '120px'}}
          >
            Subscribed !
          </span>
        )}
      </div>
    )}
  />
);

export default Waiting;
