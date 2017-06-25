chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  console.log("Background sender " + JSON.stringify(sender));
  console.log("Background request " + JSON.stringify(request));

  if(request.clickData){
    
    console.log("Background in clickData " + request.clickData);
    sendResponse({backgroundClick:"goodbye"});

    chrome.runtime.sendMessage({clickData:request.clickData},function(response) {
      console.log("Response " + JSON.stringify(response));
    });
  }

  if(request.selectionData){
    console.log("Background in selectionData " + request.selectionData);
    sendResponse({backgroundSelection:"goodbye"});
  }

  if(request.classData){
    console.log("Background in classData " + request.classData);
    sendResponse({backgroundClass: "goodbye"});
    chrome.runtime.sendMessage({bgData : request.classData}, function(response){
      console.log(JSON.stringify(response));
    });

    if(!window.localStorage.ClassData){
      window.localStorage.ClassData = "[]";
    }
    var temp_local_st = JSON.parse(window.localStorage.ClassData);
    console.log(temp_local_st);
    temp_local_st.push(request.classData);
    window.localStorage.ClassData= JSON.stringify(temp_local_st);
    console.log("CLASSDATA "+ window.localStorage.ClassData);
  }

});