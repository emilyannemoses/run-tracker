# Emily's Run Tracker
My Run Tracker is made with [LoneJS](https://github.com/robbobfrh84/loneJS); a front-end JavaScript framework created by [Bob Main](https://github.com/robbobfrh84). Please visit the [LoneJS](https://github.com/robbobfrh84/loneJS) GitHub repository to learn how to get started on your own single-page application.

**How was Run Tracker conceived?**

As an avid runner and data nerd, I felt a need to track my progress. I downloaded an app called Tracker on my iPhone which tracks me as I run my route. The data given are elevation, latitude and longitude, time, date, miles ran per hour and fastest pace ran.  I decided to build Run Tracker to give a kinder interface to display just the information I thought was important.

**Technologies**
* python3
* ES6 (SPA framework LoneJS)
* myJSON

I hadn't worked with Python before this project, but I found it to be a really pleasant experience and I hope to work with it more in the future.  The iPhone app allows for exports in `.gpx` format to a folder on my machine, from there I wrote a Python method which extracted each `.gpx` file individually, parsed through the data I wanted, and I created an API around this data.

This data was then spit through [myJSON](http://myjson.com/) to host the data that Python was creating for me, and then plopped onto the front-end of my loneJS web app for easy viewing.

If you're interested in the Tracker app I use, here it is: [Minimalist GPS Tracker](https://itunes.apple.com/us/app/minimalist-gps-tracker/id704921899?mt=8)
