import {useState} from 'react';

export function ContactForm({seo}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const API_KEY = '596f858e194d4de0a29123e697839be6';

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({...prevData, [name]: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        'https://api.takeshape.io/project/446b627e-049d-4bd3-9e27-738aaafebed9/production/graphql',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            query: `
            mutation ($input: CreateCustomerInput!) {
              createCustomer(input: $input) {
                result {
                  _id
                  email
                  message
                  name
                  phone
                }
              }
            }
            `,
            variables: {
              input: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message,
              },
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="cust-sign-page bg-grey clearfix">
      <div className="breadcrumb">
        <div className="container">
          <span>
            <a href="/">Home</a>
          </span>
          <span>register</span>
        </div>
      </div>
      <div className="container">
        <h2 className="page-title text-up text-center">{seo?.title}</h2>
        <div className="cust-contact-wrap dfx flxcntr">
          <div className="cust-cntct-info dfx dfxcl">
            <ul>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="24"
                  viewBox="0 0 16 24"
                >
                  <path d="M16 22.62L12.48 15.83C12.47 15.83 10.51 16.8 10.42 16.84C8.18 17.92 3.62 9.02 5.81 7.84L7.89 6.82L4.4 0C4.39 0 2.32 1.02 2.29 1.04C-4.91 4.79 6.52 27.02 13.89 23.65C14.01 23.6 15.99 22.62 16 22.62Z" />
                </svg>
                <h6>Contact</h6>
                <p>555-555-1234</p>
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="18"
                  viewBox="0 0 24 18"
                >
                  <path d="M15.87 9.15L12 12.29L8.13 9.15L0.02 18L23.98 18L15.87 9.15ZM17.42 7.89L24 15.06L24 2.56L17.42 7.89ZM6.58 7.89L0 2.56L0 15.06L6.58 7.89ZM12 9.71L0.01 0L23.99 0L12 9.71Z" />
                </svg>
                <h6>Email</h6>
                <p>john.smith@gmail.com</p>
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="24"
                  viewBox="0 0 16 24"
                >
                  <path d="M8 11C6.34 11 5 9.66 5 8C5 6.34 6.34 5 8 5C9.66 5 11 6.34 11 8C11 9.66 9.66 11 8 11ZM8 0C3.8 0 0 3.4 0 7.6C0 11.8 3.47 16.81 8 24C12.53 16.81 16 11.8 16 7.6C16 3.4 12.2 0 8 0Z" />
                </svg>
                <h6>Address</h6>
                <p>133 Virginia Street Wappingers Falls, NY 12590</p>
              </li>
            </ul>
            <div className="social-icons dfx flxwrp">
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"></path>
                </svg>
              </a>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"></path>
                </svg>
              </a>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.829 6.302c-.738-.034-.96-.04-2.829-.04s-2.09.007-2.828.04c-1.899.087-2.783.986-2.87 2.87-.033.738-.041.959-.041 2.828s.008 2.09.041 2.829c.087 1.879.967 2.783 2.87 2.87.737.033.959.041 2.828.041 1.87 0 2.091-.007 2.829-.041 1.899-.086 2.782-.988 2.87-2.87.033-.738.04-.96.04-2.829s-.007-2.09-.04-2.828c-.088-1.883-.973-2.783-2.87-2.87zm-2.829 9.293c-1.985 0-3.595-1.609-3.595-3.595 0-1.985 1.61-3.594 3.595-3.594s3.595 1.609 3.595 3.594c0 1.985-1.61 3.595-3.595 3.595zm3.737-6.491c-.464 0-.84-.376-.84-.84 0-.464.376-.84.84-.84.464 0 .84.376.84.84 0 .463-.376.84-.84.84zm-1.404 2.896c0 1.289-1.045 2.333-2.333 2.333s-2.333-1.044-2.333-2.333c0-1.289 1.045-2.333 2.333-2.333s2.333 1.044 2.333 2.333zm-2.333-12c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.958 14.886c-.115 2.545-1.532 3.955-4.071 4.072-.747.034-.986.042-2.887.042s-2.139-.008-2.886-.042c-2.544-.117-3.955-1.529-4.072-4.072-.034-.746-.042-.985-.042-2.886 0-1.901.008-2.139.042-2.886.117-2.544 1.529-3.955 4.072-4.071.747-.035.985-.043 2.886-.043s2.14.008 2.887.043c2.545.117 3.957 1.532 4.071 4.071.034.747.042.985.042 2.886 0 1.901-.008 2.14-.042 2.886z"></path>
                </svg>
              </a>
            </div>
          </div>
          <div className="cust-sign-form flx-cover">
            <form onSubmit={handleSubmit}>
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
                  value={formData.name}
                  onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.phone}
                  onChange={handleChange}
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
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
              <button className="btn btn-full btn-lg" type="Submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
