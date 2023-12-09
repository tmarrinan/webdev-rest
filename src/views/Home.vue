<template>
    <section class="grid-container">
        <div class="title grid-x grid-margin-x">
            <div class="cell Crimetitle">
                <h6>Crime in Minnesota's capital, understood.</h6>
                <h3>St. Paul Crime Data</h3>
                <h3>Explorer</h3>
            </div>
            <div class="cell Buttons">
                <router-link to="/Search" class="navButton"><button class="titleButton Search">Search</button></router-link>
                <a href="https://www.youtube.com/embed/uHgt8giw1LY?autoplay=1&mute=1" target="_blank"><button class="titleButton"><ion-icon name="play-outline"></ion-icon> Watch Overview</button></a>
            </div>

            <div class="cell">
                <iframe width="85%" height="580" src="https://www.youtube.com/embed/oHg5SJYRHA0" frameborder="0" allowfullscreen></iframe>
            </div>
        </div>
    </section>




    <section class="grid-container">
        <div class="grid-x grid-margin-x">
            <div class="cell tooltitle">
                <h4>Built With</h4>
            </div>
            <div class="cell tools">
                <img src="https://vuejs.org/images/logo.png" draggable="false" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/2560px-Node.js_logo.svg.png" draggable="false" />
                <img src="https://www.vectorlogo.zone/logos/expressjs/expressjs-ar21.png" draggable="false" />
                <img src="https://static-00.iconduck.com/assets.00/sqlite-icon-1831x2048-7upf1m3n.png" draggable="false" />
                <img src="https://camo.githubusercontent.com/6463de5386f43d6c67645ac94fc7a0fb309432e8f0b166ce2ef423057ea7bc0f/68747470733a2f2f77696b692e6f70656e7374726565746d61702e6f72672f772f696d616765732f372f37392f5075626c69632d696d616765732d6f736d5f6c6f676f2e737667" draggable="false" />
                <img src="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/096/thumb/leaflet.png" draggable="false" />
            </div>
        </div>
    </section>




    <section class="grid-x grid-margin-x">
		<div class="cell crimeSectionTitle">
			<h4>Our Developers</h4>
		</div>



			<!--List of Contributors-->
        <div class="cell">
            <div class="profiles">

                <div class="profile">
                    <img src="https://media.tenor.com/_4YgA77ExHEAAAAd/rick-roll.gif"
                    class="profile-img" draggable="false" loading="lazy"/>
                    <h3 class="user-name">Francis T.</h3>
                    <h5>Group Member</h5>
                </div>


                <div class="profile">
                    <img src="https://media.tenor.com/_4YgA77ExHEAAAAd/rick-roll.gif"
                    class="profile-img" draggable="false" loading="lazy"/>
                    <h3 class="user-name">John T.</h3>
                    <h5>Group Member</h5>
                </div>


                <div class="profile">
                    <img src="https://media.tenor.com/_4YgA77ExHEAAAAd/rick-roll.gif"
                    class="profile-img" draggable="false" loading="lazy"/>
                    <h3 class="user-name">Matt L.</h3>
                    <h5>Group Member</h5>
                </div>


                <div class="profile">
                    <img src="https://media.tenor.com/_4YgA77ExHEAAAAd/rick-roll.gif"
                    class="profile-img" draggable="false" loading="lazy"/>
                    <h3 class="user-name">Tommy M.</h3>
                    <h5>CS Professor</h5>
                </div>
            </div>
        </div>


	</section>


</template>

<style scoped>
.title{
    align-items: center;
    text-align: center;
}
.Crimetitle{
    align-items: center;
    text-align: center;
    padding: 3rem;
}
.Crimetitle h3{
    font-weight: bold;
    font-size: 3.3rem;
}
.Crimetitle h6{
    color: gray;
}
.titleButton{
    width: 13rem;
    height: 3.3rem;
    margin: .5rem;
    border-radius: .5rem;
    border: 2px solid black;
    font-weight: bold;
    cursor: pointer;
}
.titleButton:hover{
    background-color: black;
    color: white;
}
.Search{
    background-color: black;
    color: white;
}
.Search:hover{
    background-color: white;
    color: black;
}
.Buttons{
    margin-bottom: 3rem;
}
iframe{
    box-shadow: 40px -16px teal;
    border: 3px solid rgb(0, 145, 255)
}






.tooltitle{
    align-items: center;
    text-align: center;
    margin-top: 10rem;
    margin-bottom: 2rem;
}
.tooltitle h4{
    font-weight: bold;
    font-size: 2.5rem;
}
.tools{
    align-items: center;
    text-align: center;
}
.tools img{
    padding: 1rem;
    width: 8rem;
}







.crimeSectionTitle{
    align-items: center;
    text-align: center;
    margin-top: 10rem;
    margin-bottom: 2rem;
}
.crimeSectionTitle h4{
    font-size: 2.5rem;
    font-weight: bold;
}


.profiles{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    justify-content: center;
    align-items: center;
    text-align: center;
    grid-gap: 1.5rem;
    padding: 1rem 0px;
    font-size: 1.2rem;

    /* border: 1px solid red; */
}
.profile{
    min-width: 100%;
    height: 100%;
    margin-bottom: 20px;
    /* border: 1px solid white;  */
}

.profile .profile-img{
    height: 200px;
    width: 200px;
    border-radius: 50%;
    border: 5px solid black;
}
.profile img{
    -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
    filter: grayscale(100%);
    object-fit: cover;
}

.user-name{
    margin-top: 30px;
    font-size: 30px;
}
.profile h5{
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 3px;
    color: #000000;
    word-break: break-all;
}
@media only screen and (max-width: 1395px){
    .profiles{
        grid-template-columns: repeat(4, 1fr);
    }

    .profile{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}

@media only screen and (max-width: 1275px){
    .heading{
        font-size: 40px;
        color: white;
        text-align: center;
    }
    .profiles{
        grid-template-columns: repeat(3, 1fr);
        margin: 20px 0;
    }
}

@media only screen and (max-width: 955px){
    .heading{
        font-size: 40px;
        color: white;
        text-align: center;
    }
    .profiles{
        grid-template-columns: repeat(2, 1fr);
        margin: 20px 0;
    }
}

@media only screen and (max-width: 720px){
    .heading{
        font-size: 40px;
        color: white;
        text-align: center;
    }
    .profiles{
        grid-template-columns: repeat(1, 1fr);
        margin: 20px 0;
    }
}
</style>