import React from 'react';

const Help = ((props) => {
    return (
        <div>
            <div class="help-info">
                <div>
                    <h1 className="help-heading"> DreamTube Help</h1>
                </div>
                <h2 className="help-topic help-main">You just landed up to a new type of YouTube which is built on React, Express and Mongodb Server.</h2>
               
                <h5 className="help-topic help-instru">So the app works almost like the Youtube having features like playing videos, downloading videos in different formats and many more. So let me give you the breif idea of how this website works. </h5>

                <ul>
                    <li><p>The first think you need to do is just Signup and Login to get to the home page of our application.<i>Without logged in you can't get to the different pages of the application. </i>But hold on you may also choose to not sign and enter as a Guest. Though, much of the operations are kept restricted for a guest. </p></li>

                    <li><p>So now I hope you are logged in. In the home page at the top there is a Search bar where you can choose to type some Keyword or the PlayListId(there a Select menu to choose) to search for videos.</p></li>

                    <li><p>Then once you press the "Search" button, top 10 search results will pop-up in the screen. The Thumbnail and Title for the video will be shown. There will be 4 buttons corresponding to each video. There is also a provision of save some videos as favourites.</p></li>

                    <li><p>The first two buttons are for downloading(video in .mp4 and audio in .mp3 respectively) , the next one will be for playing the video and last one for the details to the Video.<i> Don't miss to explore them all.</i></p></li>

                    <li><p>After that you may look for different buttons in the Navigation Bar. The Trending section shows you the videos which are in YouTube's trending for the Country Code you have signed up with. <i>If you are logged in as Guest, your Country Code is kep IN.</i></p></li>

                    <li><p>The Profile section will contains different sections like signup information, the list of your Favourite videos, provision for your edit different details and even delete your existing Account.</p></li>

                    <li><p>There is also a Logout button which will destroy your session and you will need to login again.<i> Please make sure you do not clear cache during your existing session, it may delete the localStorage that this app is using.</i></p></li>

                    <li><p>Another interesting thing is that if you forget your password, you can easily Reset it back in very simple steps, you just need to enter your Username. <i>One of the drawback of these application is that you are not given access to download some non-downloaded videos of YouTube</i></p></li>

                </ul>
               
                <h3>That's it for a quick guide to our application. Now you can get back and enjoy the different features available to you!!!</h3>

            </div>
        </div>
    )
});

export default Help;