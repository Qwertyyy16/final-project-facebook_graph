var fbapiApiBaseUrl = "https://graph.facebook.com/v24.0";

function fbapiSelect(id) {
    return document.getElementById(id);
}

function fbapiGetTrimmedValue(input) {
    if (!input) {
        return "";
    }
    return input.value.trim();
}

function fbapiIsSafeText(text) {
    if (!text) {
        return true;
    }
    if (text.indexOf("<") !== -1 || text.indexOf(">") !== -1) {
        return false;
    }
    return true;
}

function fbapiBuildPageUrl(pageId, accessToken, fields) {
    var baseUrl = fbapiApiBaseUrl + "/" + encodeURIComponent(pageId);
    var params = [];
    if (fields) {
        params.push("fields=" + encodeURIComponent(fields));
    }
    params.push("access_token=" + encodeURIComponent(accessToken));
    return baseUrl + "?" + params.join("&");
}

function fbapiBuildPostsUrl(pageId, accessToken, limit) {
    var baseUrl = fbapiApiBaseUrl + "/" + encodeURIComponent(pageId) + "/posts";
    var params = [];
    params.push("fields=id,message,created_time,likes.summary(true),comments.summary(true)");
    params.push("limit=" + (limit || 10));
    params.push("access_token=" + encodeURIComponent(accessToken));
    return baseUrl + "?" + params.join("&");
}

// yung function nato is ginagawa nya lang is binubuo nya yung url ng na gagamitin pang fetch ng data
function fbapiBuildUserUrl(userId, accessToken, fields) {
    var baseUrl = fbapiApiBaseUrl + "/" + encodeURIComponent(userId);
    var params = [];
    if (fields) {
        params.push("fields=" + encodeURIComponent(fields));
    }
    params.push("access_token=" + encodeURIComponent(accessToken));
    return baseUrl + "?" + params.join("&");
}

function fbapiSetButtonLoading(isLoading) {
    var button = fbapiSelect("fbapi-fetch-button");
    if (!button) {
        return;
    }
    var spinner = button.querySelector(".fbapi-button-spinner");
    if (isLoading) {
        button.disabled = true;
        button.classList.add("fbapi-button-loading");
        if (spinner) {
            spinner.style.display = "inline-block";
        }
    } else {
        button.disabled = false;
        button.classList.remove("fbapi-button-loading");
        if (spinner) {
            spinner.style.display = "none";
        }
    }
}

function fbapiSetLoadingVisible(isVisible) {
    var loading = fbapiSelect("fbapi-loading-message");
    if (!loading) {
        return;
    }
    if (isVisible) {
        loading.classList.add("fbapi-loading-visible");
    } else {
        loading.classList.remove("fbapi-loading-visible");
    }
}

function fbapiShowError(message) {
    var container = fbapiSelect("fbapi-error-container");
    if (!container) {
        return;
    }
    container.textContent = message || "";
}

function fbapiClearError() {
    fbapiShowError("");
}

function fbapiCreateElement(tag, className, text) {
    var el = document.createElement(tag);
    if (className) {
        el.className = className;
    }
    if (text) {
        el.textContent = text;
    }
    return el;
}

function fbapiRenderEmptyState(message) {
    var container = fbapiSelect("fbapi-results-container");
    if (!container) {
        return;
    }
    container.innerHTML = "";
    var text = message || "No data found. Enter an access token and page ID, then fetch data.";
    var div = fbapiCreateElement("div", "fbapi-empty-state", text);
    container.appendChild(div);
}

function fbapiFormatDate(dateString) {
    if (!dateString) {
        return "Date not available";
    }
    var date = new Date(dateString);
    var options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return date.toLocaleDateString(undefined, options);
}

function fbapiRenderPageInfo(data) {
    var container = fbapiSelect("fbapi-results-container");
    if (!container) {
        return;
    }
    container.innerHTML = "";
    var card = fbapiCreateElement("div", "fbapi-data-card");
    var title = fbapiCreateElement("h2", "fbapi-data-title", data.name || "Page Information");
    card.appendChild(title);
    if (data.id) {
        var idLabel = fbapiCreateElement("div", "fbapi-data-label", "Page ID");
        var idValue = fbapiCreateElement("div", "fbapi-data-value", data.id);
        card.appendChild(idLabel);
        card.appendChild(idValue);
    }
    if (data.about) {
        var aboutLabel = fbapiCreateElement("div", "fbapi-data-label", "About");
        var aboutValue = fbapiCreateElement("div", "fbapi-data-value", data.about);
        card.appendChild(aboutLabel);
        card.appendChild(aboutValue);
    }
    if (data.category) {
        var catLabel = fbapiCreateElement("div", "fbapi-data-label", "Category");
        var catValue = fbapiCreateElement("div", "fbapi-data-value", data.category);
        card.appendChild(catLabel);
        card.appendChild(catValue);
    }
    if (data.followers_count !== undefined) {
        var followersLabel = fbapiCreateElement("div", "fbapi-data-label", "Followers");
        var followersValue = fbapiCreateElement("div", "fbapi-data-value", data.followers_count.toLocaleString());
        card.appendChild(followersLabel);
        card.appendChild(followersValue);
    }
    if (data.picture && data.picture.data && data.picture.data.url) {
        var imgLabel = fbapiCreateElement("div", "fbapi-data-label", "Profile Picture");
        var img = document.createElement("img");
        img.src = data.picture.data.url;
        img.className = "fbapi-data-image";
        img.alt = "Page profile picture";
        card.appendChild(imgLabel);
        card.appendChild(img);
    }
    if (data.cover && data.cover.source) {
        var coverLabel = fbapiCreateElement("div", "fbapi-data-label", "Cover Photo");
        var coverImg = document.createElement("img");
        coverImg.src = data.cover.source;
        coverImg.className = "fbapi-data-cover";
        coverImg.alt = "Page cover photo";
        card.appendChild(coverLabel);
        card.appendChild(coverImg);
    }
    container.appendChild(card);
}

function fbapiRenderPosts(data) {
    var container = fbapiSelect("fbapi-results-container");
    if (!container) {
        return;
    }
    container.innerHTML = "";
    if (!data || !data.data || data.data.length === 0) {
        fbapiRenderEmptyState("No posts found for this page.");
        return;
    }
    for (var i = 0; i < data.data.length; i++) {
        var post = data.data[i];
        var card = fbapiCreateElement("article", "fbapi-post-card");
        if (post.message) {
            var message = fbapiCreateElement("div", "fbapi-post-message", post.message);
            card.appendChild(message);
        }
        if (post.created_time) {
            var date = fbapiCreateElement("div", "fbapi-post-date", fbapiFormatDate(post.created_time));
            card.appendChild(date);
        }
        var stats = fbapiCreateElement("div", "fbapi-post-stats");
        if (post.likes && post.likes.summary) {
            var likesCount = post.likes.summary.total_count || 0;
            var likesText = fbapiCreateElement("span", "", likesCount + " likes");
            stats.appendChild(likesText);
        }
        if (post.comments && post.comments.summary) {
            var commentsCount = post.comments.summary.total_count || 0;
            var commentsText = fbapiCreateElement("span", "", commentsCount + " comments");
            stats.appendChild(commentsText);
        }
        if (stats.children.length > 0) {
            card.appendChild(stats);
        }
        container.appendChild(card);
    }
}

// ginagawa nmn ng function nato is pag nakuha na yung data or nafetch na ng api natin ididisplay nya na sa mga containerts natin na ginawa sa html file
function fbapiRenderUserInfo(data) {
    var container = fbapiSelect("fbapi-results-container");
    if (!container) {
        return;
    }
    container.innerHTML = "";
    var card = fbapiCreateElement("div", "fbapi-data-card");
    var title = fbapiCreateElement("h2", "fbapi-data-title", data.name || "My Profile");
    card.appendChild(title);
    if (data.picture && data.picture.data && data.picture.data.url) {
        var img = document.createElement("img");
        img.src = data.picture.data.url;
        img.className = "fbapi-data-image";
        img.alt = "Profile picture";
        img.style.marginBottom = "12px";
        card.appendChild(img);
    }
    if (data.id) {
        var idLabel = fbapiCreateElement("div", "fbapi-data-label", "User ID");
        var idValue = fbapiCreateElement("div", "fbapi-data-value", data.id);
        card.appendChild(idLabel);
        card.appendChild(idValue);
    }
    if (data.name) {
        var nameLabel = fbapiCreateElement("div", "fbapi-data-label", "Name");
        var nameValue = fbapiCreateElement("div", "fbapi-data-value", data.name);
        card.appendChild(nameLabel);
        card.appendChild(nameValue);
    }
    if (data.email) {
        var emailLabel = fbapiCreateElement("div", "fbapi-data-label", "Email");
        var emailValue = fbapiCreateElement("div", "fbapi-data-value", data.email);
        card.appendChild(emailLabel);
        card.appendChild(emailValue);
    }
    if (data.first_name) {
        var firstNameLabel = fbapiCreateElement("div", "fbapi-data-label", "First Name");
        var firstNameValue = fbapiCreateElement("div", "fbapi-data-value", data.first_name);
        card.appendChild(firstNameLabel);
        card.appendChild(firstNameValue);
    }
    if (data.last_name) {
        var lastNameLabel = fbapiCreateElement("div", "fbapi-data-label", "Last Name");
        var lastNameValue = fbapiCreateElement("div", "fbapi-data-value", data.last_name);
        card.appendChild(lastNameLabel);
        card.appendChild(lastNameValue);
    }
    if (data.birthday) {
        var birthdayLabel = fbapiCreateElement("div", "fbapi-data-label", "Birthday");
        var birthdayValue = fbapiCreateElement("div", "fbapi-data-value", data.birthday);
        card.appendChild(birthdayLabel);
        card.appendChild(birthdayValue);
    }
    if (data.location && data.location.name) {
        var locationLabel = fbapiCreateElement("div", "fbapi-data-label", "Location");
        var locationValue = fbapiCreateElement("div", "fbapi-data-value", data.location.name);
        card.appendChild(locationLabel);
        card.appendChild(locationValue);
    }
    if (data.link) {
        var linkLabel = fbapiCreateElement("div", "fbapi-data-label", "Profile Link");
        var linkValue = document.createElement("a");
        linkValue.href = data.link;
        linkValue.textContent = data.link;
        linkValue.target = "_blank";
        linkValue.className = "fbapi-data-value";
        linkValue.style.color = "#2563eb";
        linkValue.style.textDecoration = "underline";
        card.appendChild(linkLabel);
        card.appendChild(linkValue);
    }
    container.appendChild(card);
}

// dito naman is yung pag validate ng access token, pag wala laman lalabas yung enter access token
function fbapiValidateAccessToken(accessToken) {
    if (!accessToken) {
        return "enter access token";
    }
    if (!fbapiIsSafeText(accessToken)) {
        return "invalid oauth access token from fb";
    }
    return "";
}

async function fbapiFetchPageInfo(pageId, accessToken) {
    var fields = "id,name,about,category,followers_count,picture,cover";
    var url = fbapiBuildPageUrl(pageId, accessToken, fields);
    try {
        var response = await fetch(url);
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                return { error: "invalid oauth access token from fb" };
            }
            if (response.status === 404) {
                return { error: "not found" };
            }
            if (response.status === 429) {
                return { error: "too many requests" };
            }
            var errorData = await response.json();
            var errorMsg = errorData.error ? errorData.error.message : "request failed";
            if (errorMsg.toLowerCase().indexOf("oauth") !== -1 || errorMsg.toLowerCase().indexOf("parse") !== -1) {
                errorMsg = "invalid oauth access token from fb";
            }
            return { error: errorMsg };
        }
        var data = await response.json();
        return { data: data };
    } catch (e) {
        return { error: "connection error" };
    }
}

async function fbapiFetchPosts(pageId, accessToken) {
    var url = fbapiBuildPostsUrl(pageId, accessToken, 10);
    try {
        var response = await fetch(url);
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                return { error: "invalid oauth access token from fb" };
            }
            if (response.status === 404) {
                return { error: "not found" };
            }
            if (response.status === 429) {
                return { error: "too many requests" };
            }
            var errorData = await response.json();
            var errorMsg = errorData.error ? errorData.error.message : "request failed";
            if (errorMsg.toLowerCase().indexOf("oauth") !== -1 || errorMsg.toLowerCase().indexOf("parse") !== -1) {
                errorMsg = "invalid oauth access token from fb";
            }
            return { error: errorMsg };
        }
        var data = await response.json();
        return { data: data };
    } catch (e) {
        return { error: "connection error" };
    }
}

// yung function naman nato is yung pag fetch ng mismong data as facebook
async function fbapiFetchMyProfile(accessToken) {
    var fields = "id,name,first_name,last_name,email,picture,birthday,location,link";
    var url = fbapiBuildUserUrl("me", accessToken, fields);
    try {
        var response = await fetch(url);
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                return { error: "invalid oauth access token from fb" };
            }
            if (response.status === 404) {
                return { error: "not found" };
            }
            if (response.status === 429) {
                return { error: "too many requests" };
            }
            var errorData = await response.json();
            var errorMsg = errorData.error ? errorData.error.message : "request failed";
            if (errorMsg.toLowerCase().indexOf("oauth") !== -1 || errorMsg.toLowerCase().indexOf("parse") !== -1) {
                errorMsg = "invalid oauth access token from fb";
            }
            return { error: errorMsg };
        }
        var data = await response.json();
        return { data: data };
    } catch (e) {
        return { error: "connection error" };
    }
}

// dito naman yung functionality ng button natin if clinick natin yung button matitrigger tong function nato
async function fbapiFetchData() {
    var accessTokenInput = fbapiSelect("fbapi-access-token");
    var accessToken = fbapiGetTrimmedValue(accessTokenInput);
    var error = fbapiValidateAccessToken(accessToken);
    if (error) {
        fbapiRenderEmptyState("");
        fbapiShowError(error);
        return;
    }
    fbapiClearError();
    fbapiSetButtonLoading(true);
    fbapiSetLoadingVisible(true);
    var result = await fbapiFetchMyProfile(accessToken);
    if (result.error) {
        fbapiRenderEmptyState("");
        fbapiShowError(result.error);
    } else {
        fbapiRenderUserInfo(result.data);
        fbapiShowError("");
    }
    fbapiSetButtonLoading(false);
    fbapiSetLoadingVisible(false);
}


function fbapiAttachEvents() {
    var button = fbapiSelect("fbapi-fetch-button");
    if (button) {
        button.addEventListener("click", function () {
            fbapiFetchData();
        });
    }
    var accessTokenInput = fbapiSelect("fbapi-access-token");
    if (accessTokenInput) {
        accessTokenInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                fbapiFetchData();
            }
        });
    }
}

// ito yung function na mag loload sawebsite para ok lahat walang magiging error
function fbapiInit() {
    fbapiRenderEmptyState("enter your fb access token and click get my profile");
    fbapiAttachEvents();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
        fbapiInit();
    });
} else {
    fbapiInit();
}
