import React from "react";

function AboutScreen() {
  return (
    <section className="p-5 popping-font">
      <div className="container">
        <div className="row g-4">
          <div className="col-md">
            <h2 className="text-center mb-4"> </h2>
            <ul className="list-group list-group-flush lead">
              <li className="list-group-item">
                <span className=" text-decoration-underline fst-italic main-color-in">
                  Contact info{" "}
                </span>
              </li>
              <li className="list-group-item">
                <span className="fw-bold">FreeLancer: </span> darkarim
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Fiverr: </span> darkarim
              </li>
              <li className="list-group-item">
                <span className="fw-bold">Email: </span>{" "}
                karim.william7@gmail.com
              </li>
              <li className="list-group-item bg-dark">
                <span className="fw-bold main-color-in ">
                  I can Build your dream website.
                  <br /> Contact me NOW... Or later whenever is convenient.{" "}
                </span>
              </li>
            </ul>
          </div>
          <div className="col-md text-center"></div>
        </div>
      </div>
      <div className="p-5">
        <h4 className="main-color-in">Quality Features</h4>
        <ul
          className="list-group list-group-flush lead"
          style={{ maxWidth: "550px", gap: "10px" }}>
          <li>Fully responsive and friendly to users on all devices</li>
          <li>Built with React From the grounds up</li>
          <li>Fully functioning smart (fuzzy) searching and sorting</li>
          <li>Fully modular code that can easily be edited or added onto</li>
          <li>Supports Paypal and Stripe payments</li>
          <li>SEO optimised for maximum google indexing goodness</li>
          <li>Clean and modern design</li>
          <li>Infinite scroll main page</li>
          <li>
            Product list graciously provided by Target for testing purposes
          </li>
          <li>
            Lazy loading images and content for{" "}
            <span className="animate-charcter">fast</span> inital load time
          </li>
          <li>
            Single page Design insures faster loading times and responsive feel
          </li>
          <li>
            Cloudinary Image hosting and dedicated database servers integrated
            for minimizing load on main server
          </li>
          <li>is very wow...</li>
        </ul>
      </div>
    </section>
  );
}

export default AboutScreen;
