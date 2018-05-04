# Web Data View
Web Data View (WDV) is a chrome browser extension to help users copy data from web pages easily. Using this extension, you can specify what you want to copy by directly interacting with the web page, and paste it to Spreadsheet software or download it as a CSV file just by a few clicks.

## Who
Anyone who can use browsers to serve the Web can benefit from using Web Data View:
* Save data to your own databases
* Gather data across the internet to one place
* Analyze data using your favorite data analytics tools like Spreadsheet

## Why
Web Data View does not create new problems, only makes what you have been doing easier:
* Almost no interuption of your daily workflow: use WDV while serving the web with your Chrome browser
* Almost no learning curve: no coding, only clicking
* Almost always speed up your copy & paste: no exhautive selecting, only descriptive guiding or crowdsourcing

## What
Our solution creates data view, which allows users to interact with web pages as if interacting with data sources:
* Web Data View allows users to do copy-and-paste while browsing the Web by wrapping itself as a Chrome extension
* Web Data View allows users to specify their copy-and-paste intents with minimum effort
* Web Data View allows users to crowdsource intents through a Wiki-style database of intents

## Challenges
* How to develop a Chrome extenstion that is robust with diverse websites?
* How to leverage existing knowledge and minimal user guidance to understand user intent?
* How to match existing intents with a web page?

## Insights
* The key to avoid conflicts is to isolate javascript and css of web pages and Chrome extension
* User input is very powerful for instantiating generic model for specific web page. For example, we may know generic rule "same title field same class names". However, it is useless without knowing exactly which classnames they share. A single "click" from users can tell us which class names.
* Web pages can be grouped into categories where corresponding intents are likely to match

## Current solution
* Use contentframe to isolate css. Chrome extension isolates javascript for us by default.
* Allow users to select predefined generic descriptive rules, and visually choose one value sample to instantiate the rules.
* Use URL to match intents with web pages

## To install
Open Chrome and type chrome://extensions/ in the URL box. Download and draf crx file in the most recent release to the page you have just openned. Open a page like https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=laptop and click on our Chrome Extension button.

## To make change to the code
Check out the code. And then load folder ng-dashboard you have just downloaded asan  unpacked Chrome extension following the following instruction: https://support.google.com/chrome/a/answer/2714278?hl=en. Please note that whenever you make a change on the code, you need to reload it on chrome://extensions/ to see the difference.

## Potential improvements
* Makes selecting data value samples easily by smart segmentation
* Allows users to descriptive queries, which are more robust against changes than classnames
* ???
