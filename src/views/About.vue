<template>
  <section class="grid-container">
    <div class="grid-x grid-margin-x">
      <div class="cell small-12 text-center">
        <h1 class="page-title">About the Project</h1>
        <h2>The Developers</h2>
        <!-- Add content about your project -->
        <section class="developers-section">
          <div class="developer">
            <img src="../pictures/Jonny DeMarais.jpg" alt="Developer 1" class="developer-photo" />
            <div class="developer-bio-box">
              <p class="developer-bio">Jonny DeMarais is a senior at The University of St. Thomas studying 
              Computer Science with a minor in Catholic Studies.</p>
            </div>
          </div>
          <div class="developer">
            <img src="../pictures/Noah Friesen.jpg" alt="Developer 2" class="developer-photo" />
            <div class="developer-bio-box">
              <p class="developer-bio">Short bio for Developer 3.</p>
            </div>
          </div>
          <div class="developer">
            <img src="../pictures/Catherine Keiffer.jpg" alt="Developer 3" class="developer-photo" />
            <div class="developer-bio-box">
              <p class="developer-bio">Short bio for Developer 3.</p>
            </div>
          </div>
        </section>
        <div class="section-spacing"></div>
        <h2>Tools</h2>
        <section class="tools-section">
          <div class="tool">
            <p>Vue.js</p>
          </div>
          <div class="tool">
            <p>Leaflet</p>
          </div>
          <div class="tool">
            <p>Nominatim</p>
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
            <p class="finding-description">Description of the first finding goes here.</p>
          </div>
          <div class="finding">
            <h3>Second Finding</h3>
            <p class="finding-description">Description of the second finding goes here.</p>
          </div>
          <div class="finding">
            <h3>Third Finding</h3>
            <p class="finding-description">Description of the third finding goes here.</p>
          </div>
          <div class="finding">
            <h3>Fourth Finding</h3>
            <p class="finding-description">Description of the second finding goes here.</p>
          </div>
          <div class="finding">
            <h3>Fifth Finding</h3>
            <p class="finding-description">Description of the second finding goes here.</p>
          </div>
          <div class="finding">
            <h3>Sixth Finding</h3>
            <p class="finding-description">Description of the second finding goes here.</p>
          </div>
        </div>
        <!-- Add content for interesting findings -->
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
};


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
  width: 150px; /* Adjust the width of the photos */
  height: 150px;
  border-radius: 50%; /* Make the images circular */
  margin-bottom: 15px; /* Add some space between the photo and bio */
  object-fit: cover; /* Maintain aspect ratio without distortion */

}
.developer-bio-box {
  background-color: #f5f5f5; /* Set background color for the bio box */
  padding: 10px; /* Add padding around the bio */
  border-radius: 5px; /* Add rounded corners to the bio box */
  max-width: 250px; /* Set maximum width for the bio box */
  margin: 0 auto; /* Center the box horizontally */
}
.developer-bio {
  font-size: 1.2rem;
  margin: 0; /* Remove default margins to fit content within the box */
  text-align: justify; /* Align text to justify for better readability */
  max-width: 100%; /* Limit text width within the box */
}
.tools-section {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
}
.tool {
  text-align: center;
  background-color: #f5f5f5; /* Set background color for the tool box */
  padding: 10px; /* Add padding around the tool */
  border-radius: 5px; /* Add rounded corners to the tool box */
  width: 200px; /* Adjust the width of the tool box */
}
.tool p {
  margin: 0; /* Remove default margins */
  font-size:xx-large;
}
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* Aspect ratio for 16:9 */
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

</style>
