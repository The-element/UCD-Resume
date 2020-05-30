function userInformationHTML(user) {    //creates a function by the name of "userInformationHTML" and the data beign passed into it is user is the object that's been returned from the GitHub API. This object has many methods, such as the user's name, login name, and links to their profile
    // the backquote = template literal
    return `
        <h2>${user.name}
            <span class="small-name">
                (@<a href="${user.html_url}" target="_blank">${user.login}</a>)
            </span>
        </h2>
        <div class="gh-content">
            <div class="gh-avatar">
                <a href="${user.html_url}" target="_blank">
                    <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
                </a>
            </div>
            <p>Followers: ${user.followers} - Following ${user.following} <br> Repos: ${user.public_repos}</p>
        </div>`;
        //user.name = the name of the object user.
        //user.html_url = the url to the user.
        //user.login = the username.
        //user.avatar_url = the profile pic.

        //if the profile pic cant be displayed, the placeholder in the alt-attribute will make sure the username is displayed instead.
}

function repoInformationHTML(repos) {
    if (repos.length == 0) {    //checks to see if there is any repos in the response, if not do the following:
        return `<div class="clearfix repo-list">No repos!</div>`; //return this message.
    }

    var listItemsHTML = repos.map(function(repo) {  //creates the variable listItemsHTML to store the return from the function "repos.map", which in it's turn is created when the function inside it is run, a function in which we also pass in the object repo.
        return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>`; //Lists the repo-objects html-url and its name.
    });

    return `<div class="clearfix repo-list">
                <p>
                    <strong>Repo List:</strong>
                </p>
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`; //joins the list items into an unordered list. Separated by a new line for each item.
}

function fetchGitHubInformation(event) {    //Is being called when writing in the input-text-form.
    $("#gh-user-data").html("");    //Setting their HTML content to an empty string has the effect of emptying these divs.
    $("#gh-repo-data").html("");

    var username = $("#gh-username").val(); //stores the username input by calling the jquery-funtion value(val()).
    if (!username) {    //If the username field is empty, there's no value, then we're going to return a little piece of HTML that says "Please enter a GitHub username".
        $("#gh-user-data").html(`<h2>Please enter a GitHub username</h2>`); //($)Jquery selects the div-element with th id of "gh-user-data" and adds the data in between the ();
        return; //if it's empty just pop out of the if statement.
    }

    $("#gh-user-data").html(    //Jquery collects the div-element "gh-user-data" and adds the following as html.
        `<div id="loader">
            <img src="assets/css/loader.gif" alt="loading..." />
        </div>`);
    
    $.when( //When the following code has run. when we do two calls like this, the when() method packs a response up into arrays.
        $.getJSON(`https://api.github.com/users/${username}`), //using Jquery getJSON to retrive the data, we pars in the url + value of username from the variable above with the same name.
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then( //Then do the following:
        function(firstResponse, secondResponse) {    //if we get a respons, pass in each response to this function, and do the following:
            var userData = firstResponse[0];; //store the first response from the array-variable userData at index 0.
            var repoData = secondResponse[0];
            $("#gh-user-data").html(userInformationHTML(userData)); //using Jquery to target the div-element with the id of "gh-user-data", we set its content to html and pass in the function userInformationHTML(), together with the response.
            $("#gh-repo-data").html(repoInformationHTML(repoData)); //using Jquery to target the div-element with the id of "gh-user-data", we set its content to html and pass in the function repoInformationHTML(), together with the response.
        },
        function(errorResponse) {   //if we get a errorResponse, do the following:
            if (errorResponse.status === 404) { //if the status of the errorResponse is equal to 404, do the following:
                $("#gh-user-data").html(    //using Jquery to target the div-element with the id of "gh-user-data", we set its content to html and pass in the text we've written here.
                    `<h2>No info found for user ${username}</h2>`);
            } else if (errorResponse.status === 403){ //If the errorresponse 403(if the limit of requests has been met), do:
                var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset') * 1000); //Variable resetTime is a date-object. the responseHeader "X-RateLimit-Reset" which is inside the errorResponse containes the date. It's formated as UNIX timestamp so we need to multiply it by 1000 to be able to understand it.
                $("#gh-user-data").html(`<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`); //presents the message and the time of above object to the user.
            } else {    //Otherwise, do the following:
                console.log(errorResponse); //log the errorResponse to the console.
                $("#gh-user-data").html(    //using Jquery to target the div-element with the id of "gh-user-data", we return the message generated by the following Jquery-methods.
                    `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
            }
        });
    
}
$(document).ready(fetchGitHubInformation);