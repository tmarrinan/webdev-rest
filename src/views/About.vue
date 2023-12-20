<template>
  <section class="grid-container">
    <div class="grid-x grid-margin-x">
      <div class="cell small-12 text-center">
        <h1 class="page-title">About the Project</h1>
        <h2>The Developers</h2>
        <section class="developers-section">
          <div class="developer">
            <img src="../pictures/Jonny DeMarais.jpg" alt="Developer 1" class="developer-photo" />
            <div class="developer-bio-box">
              <p class="developer-bio">I am a senior at The University of St. Thomas studying Computer Science with a minor in Catholic Studies.
                After I graduate I will serve as missionary for two years, and then I hope to work full time as a software engineer.
              </p>
            </div>
          </div>
          <div class="developer">
            <img src="../pictures/Noah Friesen.jpg" alt="Developer 2" class="developer-photo" />
            <div class="developer-bio-box">
              <p class="developer-bio">I am a 4th year computer science student at University of Saint Thomas in St. Paul, MN. 
                Some of my goals for the future include working as a full time software engineer and completing a marathon.</p>
            </div>
          </div>
          <div class="developer">
            <img src="../pictures/Catherine Keiffer.jpg" alt="Developer 3" class="developer-photo" />
            <div class="developer-bio-box">
              <p class="developer-bio">I am a senior at the University of St. Thomas majoring in computer science and minoring in Catholic Studies.
                After I graduate I hope to find a job in the software engineering field, do some traveling, and spend more time with my nieces and nephews!
              </p>
            </div>
          </div>
        </section>
        <div class="section-spacing"></div>
        <h2>Tools</h2>
        <section class="tools-section">
          <div class="tool">
            <h4>Vue.js</h4>
            <div class="tool-description">
              <p>A progressive JavaScript framework for building user interfaces.</p>
            </div>
          </div>
          <div class="tool">
            <h4>Leaflet</h4>
            <div class="tool-description">
              <p>An open-source JavaScript library for mobile-friendly interactive maps.</p>
            </div>
          </div>
          <div class="tool">
            <h4>Nominatim</h4>
            <div class="tool-description">
              <p>An open-source search engine for OpenStreetMap data.</p>
            </div>
          </div>
        </section>
      </div>
      
      <div class="cell small-12 text-center">
        <div class="section-spacing"></div>
        <h2>Video Presentation</h2>
        <div class="video-container">
          <iframe width="560" height="315" :src="youtubeEmbedLink" frameborder="0" allowfullscreen></iframe>
        </div>
      </div>
      <!-- Interesting Findings section -->
      <div class="cell small-12 text-center">
        <div class="section-spacing"></div>
        <h2>Interesting Findings</h2>
        <div class="interesting-findings">
          <div class="finding">
            <h3>First Finding</h3>
            <p class="finding-description"> There were a lot more violent crimes than might be expected over in the Conway/Battlecreek/Highwood area.</p>
          </div>
          <div class="finding">
            <h3>Second Finding</h3>
            <p class="finding-description">There was only one violent crime in the Highland area.</p>
          </div>
          <div class="finding">
            <h3>Third Finding</h3>
            <p class="finding-description">Compared to other areas, the Summit Hill neighborhood had a lot of property crimes, which makes sense as Summit Avenue has many very nice houses.</p>
          </div>
          <div class="finding">
            <h3>Fourth Finding</h3>
            <p class="finding-description">The majority of crimes reported are just proactive police visits.</p>
          </div>
          <div class="finding">
            <h3>Fifth Finding</h3>
            <p class="finding-description">Looking at purse-snatching, I would have expected the majority of them to be downtown, but there are purse-snatching crimes happening everywhere.</p>
          </div>
          <div class="finding">
            <h3>Sixth Finding</h3>
            <p class="finding-description">There are surprisingly more crimes reported in downtown Saint Paul than Frogtown.</p>
          </div>
        </div>

      </div>
    </div>
 
  </section>
</template>

<script>
export default {
  data() {
    return {
      youtubeEmbedLink: "https://www.youtube.com/embed/aYddeCj-nlY"
    };
  }

}

</script>

<style>

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}
.text-center {
  text-align: center;
}
.developers-section {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
}
.developer {
  text-align: center;
}
.developer-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 15px; 
  object-fit: cover;

}
.developer-bio-box {
  background-color: #f5f5f5; 
  padding: 10px;
  border-radius: 5px;
  max-width: 250px; 
  margin: 0 auto; 
}
.developer-bio {
  font-size: 1.2rem;
  margin: 0; 
  text-align: justify;
  max-width: 100%; 
}
.tools-section {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
}
.tool {
  text-align: center;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  width: 400px;
}
.tool p {
  margin: 0;
  font-size:xx-large;
}
.video-container {
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 30px;
  height: 0;
  overflow: hidden;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.section-spacing {
  margin-top: 200px;
}
.tool h4 {
  font-size: 3rem; /* Modify the font size for tool headers */
  margin-bottom: 5px; /* Add some space between header and description */
  color: #333; /* Change the color to distinguish it */
}

.tool-description {
  margin-top: 5px; /* Adjust the top margin for descriptions */
  font-size: 0.9rem;
  color: #666; /* Change the color to differentiate from headers */
}

</style>
