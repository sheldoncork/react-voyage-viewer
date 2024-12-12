import React from 'react';
// import sheldonImage from './myotherimages/sheldon.jpg';
// import kennedyImage from './myotherimages/kennedy.jpg';

function About() {
  return (
    <div>
      <section className="py-5 text-center container">
        <h1 className="fw-light">SE/ComS319 Construction of User Interfaces, Fall 2024</h1>
        <h2 className="fw-light">Taught by PH.D. Abraham Aldaco</h2>
        <h2 className="fw-light">December 11th, 2024</h2>
      </section>
      <section className="py-3 container">
        <div className="Team">
          <div className="Students">
            <img src="http://localhost:8081/uploads/sheldon.jpg" alt="Sheldon Corkery" width={500}/>
            <h1>Sheldon Corkery</h1>
            <h3>sheldonc@iastate.edu</h3>
            <p>
              Hi, I'm Sheldon and I'm majoring in Software Engineering at Iowa State. 
              This is my first year here after transferring from Kirkwood in Cedar Rapids.
              I enjoy playing video games, running, and going to concerts for some of my hobbies.
            </p>
          </div>
          <div className="Students">
            <img src="http://localhost:8081/uploads/kennedy.jpg" alt="Kennedy Wendl" width={500}/>
            <h1>Kennedy Wendl</h1>
            <h3>kmwendl@iastate.edu</h3>
            <p>
              Hello! My name is Kennedy and I'm currently a junior at Iowa State double majoring in 
              Computer Science and Data Science. So far, I've really enjoyed this course and 
              can't wait to keep learning more about web design! Outside of school, I love 
              playing board games and hanging out with friends.
            </p>
          </div>
        </div>
      </section>
      <footer className="text-body-secondary py-5">
        <div className="container">
          <p className="mb-1">&copy; Sheldon Corkery & Kennedy Wendl</p>
        </div>
      </footer>
    </div>
  );
}

export default About;
