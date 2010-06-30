/*!
 * jQuery JavaScript Library v1.4.2
 * http://jquery.com/
 *
 * Copyright 2010, George Ornbo
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2010, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Sat Feb 13 22:33:48 2010 -0500
 */
 
if (window !== window.top)
{
      return; 
}

var TwitterReactions = function() {

  var body = document.getElementsByTagName('body')[0];  
  this.enabled = false;

  function removeHTMLTags(text) {
    var strInputCode = text;
    strInputCode = strInputCode.replace(/&(lt|gt);/g, function (strMatch, p1) {
      return (p1 == "lt")? "<" : ">";
    });
    var strTagStrippedText = strInputCode.replace(/<\/?[^>]+(>|$)/g, "");
    return strTagStrippedText;
  }

  function removeElement(id) {
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
  }

  /*
   * JavaScript Pretty Date
   * Copyright (c) 2008 John Resig (jquery.com)
   * Licensed under the MIT license.
   */

  // Takes an ISO time and returns a string representing how
  // long ago the date represents.  
  function prettyDate(time){
    var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
      diff = (((new Date()).getTime() - date.getTime()) / 1000),
      day_diff = Math.floor(diff / 86400);

    if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
      return;

      return day_diff == 0 && (
        diff < 60 && "just now" ||
        diff < 120 && "1 minute ago" ||
        diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
        diff < 7200 && "1 hour ago" ||
        diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
        day_diff == 1 && "Yesterday" ||
        day_diff < 7 && day_diff + " days ago" ||
        day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
  }

  function _parseTweets(data) {
    


    tweetsDiv = document.createElement('div');
    tweetsDiv.setAttribute("id", "shapeshed-twitter-reactions");
    tweetList = document.createElement('ul');

    for (var i=0; i < data.tweets.length; i++) {
      newListItem = document.createElement('li');
      newImage = document.createElement('img');
      newImage.setAttribute("src", data.tweets[i].tweet_profile_image_url);
      newAuthor = document.createElement('a');
      newAuthor.setAttribute("href", 'http://twitter.com/' +  data.tweets[i].tweet_from_user);
      newAuthor.setAttribute("target", '_blank');
      newAuthorText = document.createTextNode(data.tweets[i].tweet_from_user);
      newAuthor.appendChild(newAuthorText);
      newText = document.createTextNode(' ' + removeHTMLTags(data.tweets[i].tweet_text));
      newListItem.appendChild(newAuthor);
      newPermalink = document.createElement('a');
      newPermalink.setAttribute("href", 'http://twitter.com/' +  data.tweets[i].tweet_from_user + '/status/' + data.tweets[i].tweet_id);
      newPermalink.setAttribute("target", '_blank');
      newDate = document.createTextNode(' ' + removeHTMLTags(prettyDate(data.tweets[i].tweet_created_at)));
      newPermalink.appendChild(newDate);          
      newSpan = document.createElement('span');
      newSpan.appendChild(newPermalink);
      newListItem.appendChild(newImage);
      newListItem.appendChild(newText);
      newListItem.appendChild(newSpan);
      tweetList.appendChild(newListItem);
    }; 
    tweetsDiv.appendChild(tweetList);
    body.appendChild(tweetsDiv);
  }
  function _init(data) {
    _parseTweets(data);

  }

  function _removePanel() {
    var obj = document.getElementById('shapeshed-twitter-reactions');
    obj.parentElement.removeChild(obj);
  }
  
  return {
    startIt: function(data) {
       if (this.enabled) {
         _removePanel();
        this.enabled = false;  
        safari.self.tab.dispatchMessage("enabled",false);
         
       } else {
         _init(data); 
        this.enabled = true;  
        safari.self.tab.dispatchMessage("enabled",true);     
       }
     },
     stopIt: function() {
       _removePanel();
       this.enabled = false;  
       safari.self.tab.dispatchMessage("enabled",false);
     },
     getTweets: function(data){
       _parseTweets(data);
     }
  };
}();

function handleMessage(msgEvent) {
  var messageName = msgEvent.name;
  var messageData = msgEvent.message;
  if (messageName === "TweetData") { 
    TwitterReactions.startIt(messageData);
  }
  if (messageName === "TwitterReactions") { 
    TwitterReactions.stopIt();
  }
}

safari.self.addEventListener("message", handleMessage, false);
