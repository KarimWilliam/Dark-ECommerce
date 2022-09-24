import React from "react";

function AboutScreen() {
  return (
    <section className="p-5 popping-font ">
      <div className="container ">
        <div className="row g-4 ">
          <div className="col-md">
            <h2 className="text-center mb-4"> </h2>
            <ul className="list-group list-group-flush lead about-borders">
              <li className="list-group-item">
                <h2 className="main-color-in">Contact info </h2>
              </li>
              <li className="list-group-item ">
                <span className="fw-bold black-color-in">FreeLancer: </span>{" "}
                Karim William
              </li>
              <li className="list-group-item">
                <span className="fw-bold black-color-in">Fiverr: </span>{" "}
                darkarim
              </li>
              <li className="list-group-item">
                <span className="fw-bold black-color-in">Email: </span>{" "}
                karim.william7@gmail.com
              </li>
              <li className="list-group-item">
                <span className="fw-bold black-color-in">Note: </span> I will
                professionally build your desired website with up to date
                technology and industry standard methodology.
              </li>
            </ul>
          </div>
          <div className="col-md text-center"></div>
        </div>
      </div>
      <div className="p-5 ">
        <h4 className="main-color-in">Dark-Commerce Features</h4>
        <ul
          className="list-group list-group-flush lead "
          style={{ maxWidth: "550px", gap: "10px" }}>
          <li>Responsive and friendly to users on all devices</li>
          <li>Built with React From the grounds up</li>
          <li>Smart searching and sorting</li>
          <li>Modular code that can easily be edited or added onto</li>
          <li>Supports Paypal and Stripe payments</li>
          <li>SEO optimised for maximum google indexing goodness</li>
          <li>Clean and modern design</li>
          <li>
            Cloudinary Image hosting and dedicated database servers integrated
            to minimizing load on main server
          </li>
          <li>
            Product list graciously provided by Target for testing purposes
          </li>
          <li>Lazy loading images and content for fast inital load time</li>
          <li>
            Single page Design insures faster loading times and responsive feel
          </li>
          <li>
            Is very <span className="animate-charcter"> wow </span>{" "}
          </li>
        </ul>
      </div>
    </section>
  );
}

export default AboutScreen;
